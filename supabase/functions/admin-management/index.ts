
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { createHash } from "https://deno.land/std@0.168.0/hash/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function hashPassword(password: string): string {
  const hash = createHash("sha256");
  hash.update(password);
  return hash.toString();
}

async function verifyAdminToken(supabase: any, token: string) {
  try {
    const { data } = await supabase.functions.invoke('admin-auth', {
      body: { action: 'verify', token }
    });
    return data?.success ? data.user : null;
  } catch {
    return null;
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

    const { action, token, ...payload } = await req.json();
    
    // Verify admin token
    const admin = await verifyAdminToken(supabase, token);
    if (!admin) {
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const ipAddress = req.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';

    // Log admin activity
    await supabase.from('admin_activity_logs').insert({
      admin_id: admin.id,
      action: `admin_management_${action}`,
      details: { action, payload: Object.keys(payload) },
      ip_address: ipAddress,
      user_agent: userAgent
    });

    if (action === 'create_admin') {
      const { username, email, password, role = 'admin' } = payload;
      
      if (!username || !email || !password) {
        return new Response(
          JSON.stringify({ success: false, error: 'Missing required fields' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const passwordHash = hashPassword(password);
      
      const { data, error } = await supabase
        .from('admin_users')
        .insert({
          username,
          email,
          password_hash: passwordHash,
          role,
          is_active: true
        })
        .select()
        .single();

      if (error) {
        return new Response(
          JSON.stringify({ success: false, error: error.message }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const { password_hash, ...adminWithoutPassword } = data;
      return new Response(
        JSON.stringify({ success: true, admin: adminWithoutPassword }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'list_admins') {
      const { data, error } = await supabase
        .from('admin_users')
        .select('id, username, email, role, is_active, last_login, created_at, failed_login_attempts')
        .order('created_at', { ascending: false });

      if (error) {
        return new Response(
          JSON.stringify({ success: false, error: error.message }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ success: true, admins: data }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'get_stats') {
      const [usersResult, listingsResult, viewsResult] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact' }),
        supabase.from('listings').select('id, status', { count: 'exact' }),
        supabase.from('listings').select('views').neq('views', null)
      ]);

      const totalUsers = usersResult.count || 0;
      const totalListings = listingsResult.count || 0;
      const activeListings = listingsResult.data?.filter(l => l.status === 'active').length || 0;
      const totalViews = viewsResult.data?.reduce((sum, item) => sum + (item.views || 0), 0) || 0;

      return new Response(
        JSON.stringify({ 
          success: true, 
          stats: {
            totalUsers,
            totalListings,
            activeListings,
            totalViews
          }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'get_activity_logs') {
      const { page = 1, limit = 50 } = payload;
      const offset = (page - 1) * limit;

      const { data, error } = await supabase
        .from('admin_activity_logs')
        .select(`
          id,
          action,
          details,
          ip_address,
          created_at,
          admin_users (username, email)
        `)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        return new Response(
          JSON.stringify({ success: false, error: error.message }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ success: true, logs: data }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: false, error: 'Invalid action' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Admin management error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
})
