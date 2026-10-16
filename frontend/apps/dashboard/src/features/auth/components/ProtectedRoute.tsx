import { useNavigate } from 'react-router';
import { useAuth } from '../auth-provider';

const WEB_LOGIN_URL = import.meta.env.VITE_WEB_URL || 'http://localhost:3000';

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if ((!user?._id || user.role !== 'admin') && typeof window !== 'undefined') {
    navigate(`${WEB_LOGIN_URL}/auth/login`, { replace: true });
    return null;
  }

  return <>{children}</>;
}
