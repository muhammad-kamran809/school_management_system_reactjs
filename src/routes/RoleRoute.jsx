import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { hasAnyRole } from '../utils/roles';

function RoleRoute({ children, allowedRoles, fallback = '/dashboard' }) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-100">
                <div className="spinner-border text-primary">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && allowedRoles.length > 0 && !hasAnyRole(user, allowedRoles)) {
        return <Navigate to={fallback} replace />;
    }

    return children;
}

export default RoleRoute;
