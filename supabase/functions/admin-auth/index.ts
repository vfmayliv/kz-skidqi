import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { createHash } from "https://deno.land/std@0.168.0/hash/mod.ts"
import { encode, decode } from "https://deno.land/std@0.168.0/encoding/base64.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: string;
  is_active: boolean;
  password_hash: string;
  failed_login_attempts: number;
  locked_until: string | null;
  last_login: string | null;
  created_at: string;
}

interface LoginAttempt {
  username: string;
  ip_address: string;
  user_agent: string;
  timestamp: Date;
}

// Simple in-memory storage for rate limiting (in production, use Redis)
const loginAttempts = new Map<string, LoginAttempt[]>();

function hashPassword(password: string): string {
  const hash = createHash("sha256");
  hash.update(password);
  return hash.toString();
}

function generateToken(adminId: string): string {
  const payload = {
    adminId,
    timestamp: Date.now(),
    random: Math.random()
  };
  const encoder = new TextEncoder();
  const data = encoder.encode(JSON.stringify(payload));
  return encode(data);
}

function verifyToken(token: string): { adminId: string } | null {
  try {
    const decoder = new TextDecoder();
    const data = decode(token);
    const payload = JSON.parse(decoder.decode(data));
    
    // Check if token is not older than 8 hours
    if (Date.now() - payload.timestamp > 8 * 60 * 60 * 1000) {
      return null;
    }
    
    return { adminId: payload.adminId };
  } catch {
    return null;
  }
}

function isRateLimited(ip: string, userAgent: string): boolean {
  const key = `${ip}:${userAgent}`;
  const attempts = loginAttempts.get(key) || [];
  const recentAttempts = attempts.filter(
    attempt => Date.now() - attempt.timestamp.getTime() < 15 * 60 * 1000 // 15 minutes
  );
  
  return recentAttempts.length >= 5;
}

function recordLoginAttempt(username: string, ip: string, userAgent: string) {
  const key = `${ip}:${userAgent}`;
  const attempts = loginAttempts.get(key) || [];
  attempts.push({
    username,
    ip_address: ip,
    user_agent: userAgent,
    timestamp: new Date()
  });
  
  // Keep only recent attempts
  const recentAttempts = attempts.filter(
    attempt => Date.now() - attempt.timestamp.getTime() < 15 * 60 * 1000
  );
  
  loginAttempts.set(key, recentAttempts);
}

async function logAdminActivity(
  supabase: any,
  adminId: string,
  action: string,
  details: any,
  ipAddress: string,
  userAgent: string
) {
  try {
    await supabase.from('admin_activity_logs').insert({
      admin_id: adminId,
      action,
      details,
      ip_address: ipAddress,
      user_agent: userAgent
    });
  } catch (error) {
    console.error('Failed to log admin activity:', error);
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { action, username, password, token } = await req.json();
    const ipAddress = req.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';

    if (action === 'login') {
      // Rate limiting check
      if (isRateLimited(ipAddress, userAgent)) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Слишком много попыток входа. Попробуйте позже.' 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      recordLoginAttempt(username, ipAddress, userAgent);

      // Get admin user
      const { data: adminUsers, error: fetchError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('username', username)
        .eq('is_active', true)
        .single();

      if (fetchError || !adminUsers) {
        await logAdminActivity(supabase, '', 'login_failed', { username, reason: 'user_not_found' }, ipAddress, userAgent);
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Неверные учетные данные' 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const admin = adminUsers as AdminUser;

      // Check if account is locked
      if (admin.locked_until && new Date(admin.locked_until) > new Date()) {
        await logAdminActivity(supabase, admin.id, 'login_failed', { username, reason: 'account_locked' }, ipAddress, userAgent);
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Аккаунт временно заблокирован' 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Verify password
      const hashedPassword = hashPassword(password);
      if (admin.password_hash !== hashedPassword) {
        // Increment failed attempts
        const newFailedAttempts = (admin.failed_login_attempts || 0) + 1;
        const updateData: any = { failed_login_attempts: newFailedAttempts };
        
        // Lock account after 5 failed attempts
        if (newFailedAttempts >= 5) {
          updateData.locked_until = new Date(Date.now() + 30 * 60 * 1000).toISOString(); // 30 minutes
        }

        await supabase
          .from('admin_users')
          .update(updateData)
          .eq('id', admin.id);

        await logAdminActivity(supabase, admin.id, 'login_failed', { username, reason: 'wrong_password' }, ipAddress, userAgent);
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Неверные учетные данные' 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Success - reset failed attempts and update last login
      await supabase
        .from('admin_users')
        .update({
          failed_login_attempts: 0,
          locked_until: null,
          last_login: new Date().toISOString()
        })
        .eq('id', admin.id);

      // Create session
      const sessionToken = generateToken(admin.id);
      await supabase.from('admin_sessions').insert({
        admin_id: admin.id,
        token_hash: hashPassword(sessionToken),
        expires_at: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(), // 8 hours
        ip_address: ipAddress,
        user_agent: userAgent
      });

      await logAdminActivity(supabase, admin.id, 'login_success', { username }, ipAddress, userAgent);

      const { password_hash, ...userWithoutPassword } = admin;
      return new Response(
        JSON.stringify({ 
          success: true, 
          token: sessionToken,
          user: userWithoutPassword
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'verify') {
      const tokenData = verifyToken(token);
      if (!tokenData) {
        return new Response(
          JSON.stringify({ success: false, error: 'Invalid token' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Check if session exists and is valid
      const tokenHash = hashPassword(token);
      const { data: session } = await supabase
        .from('admin_sessions')
        .select('admin_id, expires_at')
        .eq('token_hash', tokenHash)
        .single();

      if (!session || new Date(session.expires_at) < new Date()) {
        return new Response(
          JSON.stringify({ success: false, error: 'Session expired' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Get admin user
      const { data: admin } = await supabase
        .from('admin_users')
        .select('id, username, email, role, is_active, last_login, created_at')
        .eq('id', session.admin_id)
        .eq('is_active', true)
        .single();

      if (!admin) {
        return new Response(
          JSON.stringify({ success: false, error: 'User not found' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ success: true, user: admin }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'logout') {
      const tokenData = verifyToken(token);
      if (tokenData) {
        const tokenHash = hashPassword(token);
        await supabase
          .from('admin_sessions')
          .delete()
          .eq('token_hash', tokenHash);

        await logAdminActivity(supabase, tokenData.adminId, 'logout', {}, ipAddress, userAgent);
      }

      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: false, error: 'Invalid action' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Admin auth error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Внутренняя ошибка сервера' 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
})
