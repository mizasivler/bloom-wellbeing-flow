
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const { isLoggedIn, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-florescer-background flex items-center justify-center">
        <div className="animate-pulse-gentle">
          <h1 className="text-2xl font-lora text-florescer-primary">Carregando...</h1>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    // Redirect to login with a return URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default RequireAuth;
