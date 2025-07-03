
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import CategoryPage from '@/pages/CategoryPage';

export default function ElectronicsPageWrapper() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Redirect /electronics to /category/electronics to ensure proper slug handling
    // Clean redirect without any prefixes
    if (location.pathname === '/electronics') {
      navigate('/category/electronics', { replace: true });
      return;
    }
  }, [location.pathname, navigate]);

  // If we're already on /category/electronics, render CategoryPage normally
  if (location.pathname === '/category/electronics') {
    return <CategoryPage />;
  }

  // For the redirect case, show loading
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
    </div>
  );
}
