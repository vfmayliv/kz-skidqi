
import { Navigate } from 'react-router-dom';
import { useAppStore } from '@/stores/useAppStore';
import { useToast } from '@/hooks/useToast';
import { useEffect } from 'react';

interface AuthProtectionProps {
  children: React.ReactNode;
  requiredRole?: 'user' | 'admin';
}

export const AuthProtection: React.FC<AuthProtectionProps> = ({ 
  children, 
  requiredRole = 'user' 
}) => {
  const { isAuthenticated, userRole, language } = useAppStore();
  const { toast } = useToast();
  
  // Check if user has required authentication
  const hasAccess = isAuthenticated && (
    requiredRole === 'user' ? 
      (userRole === 'user' || userRole === 'admin') : 
      userRole === 'admin'
  );

  // For debugging only - remove in production
  console.log('AuthProtection', { isAuthenticated, userRole, requiredRole, hasAccess });
  
  useEffect(() => {
    if (!isAuthenticated) {
      // Show login required message
      const title = language === 'ru' ? 'Доступ запрещен' : 'Қол жеткізу тыйым салынған';
      const description = language === 'ru' 
        ? 'Пожалуйста, войдите в систему для доступа к этой странице' 
        : 'Бұл бетке кіру үшін жүйеге кіріңіз';
      
      toast({
        title,
        description,
        variant: "destructive"
      });
    } else if (!hasAccess) {
      // Show insufficient permissions message
      const title = language === 'ru' ? 'Недостаточно прав' : 'Құқықтар жеткіліксіз';
      const description = language === 'ru' 
        ? 'У вас нет необходимых прав для доступа к этой странице' 
        : 'Бұл бетке кіру үшін қажетті құқықтарыңыз жоқ';
      
      toast({
        title,
        description,
        variant: "destructive"
      });
    }
  }, [isAuthenticated, hasAccess, toast, language]);
  
  if (!isAuthenticated) {
    // Redirect to the appropriate login page based on required role
    return requiredRole === 'admin' ? 
      <Navigate to="/owner" replace /> :
      <Navigate to="/login" replace />;
  }
  
  if (!hasAccess) {
    // User doesn't have required role
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};
