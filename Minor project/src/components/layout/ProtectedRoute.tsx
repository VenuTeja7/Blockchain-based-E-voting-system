import { Outlet, Navigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

interface ProtectedRouteProps {
  role: 'voter' | 'commissioner';
}

const ProtectedRoute = ({ role }: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== role) {
    return <Navigate to={`/${user?.role}/dashboard`} replace />;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar role={role} />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ProtectedRoute;