import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
} from 'react-router-dom';

import Login from './pages/Login';
import Dashboard from './pages/admin/Dashboard';
import AcademicYears from "./pages/admin/academic/AcademicYear";
import Classes from './pages/admin/academic/Classes';
import Sections from './pages/admin/academic/Sections';
import Subjects from './pages/admin/academic/Subjects';
import Students from './pages/admin/people/Students';
import Teachers from './pages/admin/people/Teachers';
import Staff from './pages/admin/people/Staff';
import Parents from './pages/admin/people/Parents';
import AdminPage from './pages/admin/AdminPage';
import { adminPages } from './routes/adminPages';

import ProtectedRoute from './routes/ProtectedRoute';
import AdminLayout from './layouts/AdminLayout';


function App() {
    return (
        <BrowserRouter>

            <Routes>

                {/* Public Routes */}
                <Route
                    path="/login"
                    element={<Login />}
                />

                {/* Protected Routes */}
                <Route element={<ProtectedRoute />}>

                    {/* Admin Layout */}
                    <Route element={<AdminLayout />}>

                        <Route
                            path="/dashboard"
                            element={<Dashboard />}
                        />

                        <Route
                            path="/academic-years"
                            element={<AcademicYears />}
                        />

                        <Route
                            path="/classes"
                            element={<Classes />}
                        />

                        <Route
                            path="/sections"
                            element={<Sections />}
                        />

                        <Route
                            path="/subjects"
                            element={<Subjects />}
                        />

                        <Route
                            path="/students"
                            element={<Students />}
                        />

                        <Route
                            path="/teachers"
                            element={<Teachers />}
                        />

                        <Route
                            path="/staff"
                            element={<Staff />}
                        />

                        <Route
                            path="/parents"
                            element={<Parents />}
                        />

                        {adminPages
                            .filter(
                                (page) =>
                                    ![
                                        '/academic-years',
                                        '/classes',
                                        '/sections',
                                        '/subjects',
                                        '/students',
                                        '/teachers',
                                        '/staff',
                                        '/parents',
                                    ].includes(page.path)
                            )
                            .map((page) => (
                                <Route
                                    key={page.path}
                                    path={page.path}
                                    element={<AdminPage title={page.title} icon={page.icon} />}
                                />
                            ))}

                    </Route>

                </Route>

                {/* Default */}
                <Route
                    path="/"
                    element={
                        <Navigate
                            to="/dashboard"
                            replace
                        />
                    }
                />

                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/dashboard"
                            replace
                        />
                    }
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;