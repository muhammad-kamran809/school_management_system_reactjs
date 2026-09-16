import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

function AdminLayout() {
    return (
        <div className="admin-shell d-flex min-vh-100">
            <Sidebar />

            <div className="admin-content flex-grow-1">
                <Navbar />

                <main className="admin-main">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default AdminLayout;
