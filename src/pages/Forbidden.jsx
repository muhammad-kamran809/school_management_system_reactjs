import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getDashboardRoute, getPrimaryRole } from '../utils/roles';

export default function Forbidden() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleBack = () => {
        navigate(getDashboardRoute(user), { replace: true });
    };

    return (
        <div className="container min-vh-100 d-flex align-items-center justify-content-center py-5">
            <div className="card shadow-sm border-0 text-center p-5" style={{ maxWidth: '520px' }}>
                <div className="mb-4">
                    <span className="badge bg-danger-subtle text-danger rounded-circle p-4 fs-1">
                        <i className="bi bi-shield-lock-fill"></i>
                    </span>
                </div>
                <h1 className="h3 fw-bold mb-2">Access Restricted (403)</h1>
                <p className="text-muted mb-4">
                    Your current account ({getPrimaryRole(user) || 'User'}) does not have permission to view this section of the school management system.
                </p>
                <div className="d-flex justify-content-center gap-2">
                    <button onClick={handleBack} className="btn btn-primary px-4">
                        <i className="bi bi-arrow-left me-2"></i>
                        Return to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
}
