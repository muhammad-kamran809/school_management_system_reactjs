import { useAuth } from '../context/AuthContext';
import { getPrimaryRole, ROLES } from '../utils/roles';

function Navbar() {
    const { user, logout } = useAuth();
    const primaryRole = getPrimaryRole(user);

    const handleLogout = async () => {
        await logout();
        window.location.href = '/login';
    };

    const eyebrow = primaryRole === ROLES.STUDENT
        ? 'Student Portal'
        : primaryRole === ROLES.TEACHER
        ? 'Teacher Portal'
        : primaryRole === ROLES.PARENT
        ? 'Parent Portal'
        : primaryRole === ROLES.STAFF
        ? 'Staff Portal'
        : 'School Administration';

    return (
        <nav className="topbar navbar navbar-light px-4">
            <div className="container-fluid">

                <div>
                    <span className="topbar-eyebrow">{eyebrow}</span>
                    <span className="navbar-brand fw-bold mb-0 d-block">Dashboard</span>
                </div>

                <div className="d-flex align-items-center gap-3">

                    <div className="user-summary text-end d-none d-sm-block">
                        <div className="fw-bold">
                            {user?.name || 'User'}
                        </div>

                        <small className="text-muted">
                            {primaryRole || 'User'}
                        </small>
                    </div>

                    <div className="user-avatar" aria-hidden="true">
                        {(user?.name || primaryRole || 'U').charAt(0).toUpperCase()}
                    </div>

                    <button
                        className="btn btn-light logout-button"
                        onClick={handleLogout}
                        aria-label="Log out"
                    >
                        <i className="bi bi-box-arrow-right"></i>
                        <span className="d-none d-md-inline">Logout</span>
                    </button>

                </div>

            </div>
        </nav>
    );
}

export default Navbar;