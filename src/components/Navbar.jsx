import { useAuth } from '../context/AuthContext';

function Navbar() {
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
        window.location.href = '/login';
    };

    return (
        <nav className="topbar navbar navbar-light px-4">
            <div className="container-fluid">

                <div>
                    <span className="topbar-eyebrow">School administration</span>
                    <span className="navbar-brand fw-bold mb-0 d-block">Dashboard</span>
                </div>

                <div className="d-flex align-items-center gap-3">

                    <div className="user-summary text-end d-none d-sm-block">
                        <div className="fw-bold">
                            {user?.name || 'Administrator'}
                        </div>

                        <small className="text-muted">
                            {user?.roles?.[0]?.name || 'User'}
                        </small>
                    </div>

                    <div className="user-avatar" aria-hidden="true">
                        {(user?.name || 'A').charAt(0).toUpperCase()}
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