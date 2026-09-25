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
// Academic Management section
import TimeTable from './pages/admin/Academic_management/TimeTable';
import TeacherAssignments from './pages/admin/Academic_management/TeacherAssignment';
import Enrollments from './pages/admin/Academic_management/Enrollments';
//Attendance Section
import StudentAttendance from './pages/admin/attendance/StudentAttendance';
import TeacherAttendance from './pages/admin/attendance/TeacherAttendance';
// Exams sections
import Exams from './pages/admin/Exams/Exams';
import Result from './pages/admin/Exams/Result';
// Finance sections
import Fees from './pages/admin/finance/Fees';
import Payments from './pages/admin/finance/Payments';
import FeeReports from './pages/admin/finance/FeeReports';
import Notices from './pages/admin/communication/Notices';
import Events from './pages/admin/communication/Events';
import SchoolSettings from './pages/admin/settings/SchoolSettings';
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
                        //Academic_management section routes
                        <Route
                            path="/TimeTable"
                            element={<TimeTable />}
                        />
                         <Route
                            path="/teacher-assignments"
                            element={<TeacherAssignments />}
                        />
                         <Route
                            path="/enrollments"
                            element={<Enrollments  />}
                        />
                        //Attendance section
                            <Route
                                 path="/student-attendance"
                                element={<StudentAttendance />}
                                                                 /> 
                            <Route
                                 path="/teacher-attendance"
                                element={< TeacherAttendance/>}
                                                                 />                                  
                                // Exams section
                                 <Route
                                 path="/exams"
                                element={< Exams/>}
                                                     />
                             <Route
                                 path="/results"
                                element={< Result/>}
                                                     />
                            // Fees sections Routes
                             <Route
                                 path="/fees"
                                element={< Fees/>}
                                                     />
                             <Route
                                 path="/payments"
                                element={< Payments/>}
                                                     />
                            <Route
                                 path="/fee-reports"
                                element={< FeeReports/>}
                                                     />
                            <Route
                                 path="/notices"
                                element={< Notices/>}
                                                     />
                            <Route
                                 path="/events"
                                element={< Events/>}
                                                     />
                             <Route
                                 path="/school-settings"
                                element={< SchoolSettings/>}
                                                     />

                        {adminPages.filter((page) => page.path !== '/academic-years').map((page) => (
                            <Route
                                key={page.path}
                                path={page.path}
                                element={<AdminPage title={page.title} icon={page.icon} />}
                            />
                        ))}
                        {adminPages
                            .filter(
                                (page) =>
                                    ![
                                        '/academic-years',
                                        '/classes',
                                        '/sections',
                                        '/subjects',
                                        '/students',
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
