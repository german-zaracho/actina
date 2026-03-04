import { Navigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export function ProtectedRoute({ children }) {
    const { isAuthenticated, loading } = useAuth();

    if (loading) return null;

    if (!isAuthenticated) return <Navigate to="/login" replace />;

    return children;
}

export function AdminRoute({ children }) {
    const { isAuthenticated, isAdmin, loading } = useAuth();

    if (loading) return null;

    if (!isAuthenticated) return <Navigate to="/login" replace />;

    if (!isAdmin) return <Navigate to="/home" replace />;

    return children;
}