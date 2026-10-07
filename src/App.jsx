import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
} from 'react-router-dom';

import Login from './pages/Login';
import Forbidden from './pages/Forbidden';
import Dashboard from './pages/admin/Dashboard';
import AcademicYears from './pages/admin/academic/AcademicYear';
import Classes from './pages/admin/academic/Classes';
import Sections from './pages/admin/academic/Sections';
import Subjects from './pages/admin/academic/Subjects';
import Students from './pages/admin/people/Students';
import Teachers from './pages/admin/people/Teachers';
import Staff from './pages/admin/people/Staff';
import Parents from './pages/admin/people/Parents';
import Users from './pages/admin/people/Users';
import Enrollments from './pages/admin/Academic_management/Enrollments';
import TeacherAssignment from './pages/admin/Academic_management/TeacherAssignment';
import TimeTable from './pages/admin/Academic_management/TimeTable';
import StudentAttendance from './pages/admin/attendance/StudentAttendance';
import TeacherAttendance from './pages/admin/attendance/TeacherAttendance';
import Exams from './pages/admin/Exams/Exams';
import Result from './pages/admin/Exams/Result';
import Fees from './pages/admin/finance/Fees';
import Payments from './pages/admin/finance/Payments';
import FeeReports from './pages/admin/finance/FeeReports';
import Notices from './pages/admin/communication/Notices';
import Events from './pages/admin/communication/Events';
import SchoolSettings from './pages/admin/settings/SchoolSettings';
import ReportsHub from './pages/admin/reports/ReportsHub';

// Teacher Self-Service
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import TeacherAssignments from './pages/teacher/TeacherAssignments';
import TeacherStudents from './pages/teacher/TeacherStudents';
import TeacherAttendanceMarking from './pages/teacher/TeacherAttendanceMarking';

// Student Self-Service
import StudentDashboard from './pages/student/StudentDashboard';
import StudentProfile from './pages/student/StudentProfile';
import StudentAttendanceView from './pages/student/StudentAttendanceView';
import StudentResultsView from './pages/student/StudentResultsView';
import StudentFeesView from './pages/student/StudentFeesView';

// Parent Self-Service
import ParentDashboard from './pages/parent/ParentDashboard';
import ParentChildrenView from './pages/parent/ParentChildrenView';

import ProtectedRoute from './routes/ProtectedRoute';
import AdminLayout from './layouts/AdminLayout';
import { ROLES, getDashboardRoute, getPrimaryRole } from './utils/roles';
import { useAuth } from './context/AuthContext';

function SmartDashboardRoute() {
    const { user } = useAuth();
    const primaryRole = getPrimaryRole(user);
    if (primaryRole === ROLES.STUDENT) {
        return <Navigate to="/student/dashboard" replace />;
    }
    if (primaryRole === ROLES.TEACHER) {
        return <Navigate to="/teacher/dashboard" replace />;
    }
    if (primaryRole === ROLES.PARENT) {
        return <Navigate to="/parent/dashboard" replace />;
    }
    return <Dashboard />;
}

function DefaultRedirect() {
    const { user, loading } = useAuth();
    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-100">
                <div className="spinner-border text-primary" role="status"></div>
            </div>
        );
    }
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    return <Navigate to={getDashboardRoute(user)} replace />;
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/403" element={<Forbidden />} />

                {/* Protected Routes */}
                <Route element={<ProtectedRoute />}>
                    <Route element={<AdminLayout />}>
                        {/* 1. Main Dashboard: Auto-redirects Student, Teacher, Parent to their respective portal */}
                        <Route
                            path="/dashboard"
                            element={<SmartDashboardRoute />}
                        />

                        {/* 2. Admin Only System Configuration & Reports */}
                        <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
                            <Route path="/academic-years" element={<AcademicYears />} />
                            <Route path="/parents" element={<Parents />} />
                            <Route path="/teacher-assignments" element={<TeacherAssignment />} />
                            <Route path="/fee-reports" element={<FeeReports />} />
                            <Route path="/school-settings" element={<SchoolSettings />} />
                            <Route path="/users" element={<Users />} />
                            <Route path="/student-report" element={<ReportsHub reportType="student" title="Student Enrolment Report" />} />
                            <Route path="/attendance-report" element={<ReportsHub reportType="attendance" title="Class Attendance Report" />} />
                            <Route path="/fee-report" element={<ReportsHub reportType="fee" title="Institutional Fee Report" />} />
                            <Route path="/result-report" element={<ReportsHub reportType="result" title="Academic Examination Report" />} />
                        </Route>

                        {/* 3. Academic Structure & People (Admin, Staff) */}
                        <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.STAFF]} />}>
                            <Route path="/classes" element={<Classes />} />
                            <Route path="/sections" element={<Sections />} />
                            <Route path="/subjects" element={<Subjects />} />
                            <Route path="/students" element={<Students />} />
                            <Route path="/teachers" element={<Teachers />} />
                            <Route path="/staff" element={<Staff />} />
                            <Route path="/enrollments" element={<Enrollments />} />
                            <Route path="/fees" element={<Fees />} />
                            <Route path="/payments" element={<Payments />} />
                        </Route>

                        {/* 4. Attendance (Admin, Staff, Teacher) */}
                        <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.STAFF, ROLES.TEACHER]} />}>
                            <Route path="/student-attendance" element={<StudentAttendance />} />
                            <Route path="/teacher-attendance" element={<TeacherAttendance />} />
                        </Route>

                        {/* 5. Shared Routes: Timetable, Notices, Events (Admin, Staff, Teacher, Student, Parent) */}
                        <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.STAFF, ROLES.TEACHER, ROLES.STUDENT, ROLES.PARENT]} />}>
                            <Route path="/timetable" element={<TimeTable />} />
                            <Route path="/timetables" element={<TimeTable />} />
                            <Route path="/notices" element={<Notices />} />
                            <Route path="/events" element={<Events />} />
                        </Route>

                        {/* 6. Exams & Results Access Control */}
                        <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT, ROLES.PARENT]} />}>
                            <Route path="/exams" element={<Exams />} />
                        </Route>
                        <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.TEACHER]} />}>
                            <Route path="/results" element={<Result />} />
                        </Route>

                        {/* 6. Teacher Self-Service Portal */}
                        <Route element={<ProtectedRoute allowedRoles={[ROLES.TEACHER, ROLES.ADMIN]} />}>
                            <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
                            <Route path="/my-teacher/assignments" element={<TeacherAssignments />} />
                            <Route path="/my-teacher/students" element={<TeacherStudents />} />
                            <Route path="/my-teacher/attendance" element={<TeacherAttendanceMarking />} />
                        </Route>

                        {/* 7. Student Self-Service Portal */}
                        <Route element={<ProtectedRoute allowedRoles={[ROLES.STUDENT, ROLES.ADMIN]} />}>
                            <Route path="/student/dashboard" element={<StudentDashboard />} />
                            <Route path="/my-profile/student" element={<StudentProfile />} />
                            <Route path="/my-student/attendance" element={<StudentAttendanceView />} />
                            <Route path="/my-student/results" element={<StudentResultsView />} />
                            <Route path="/my-student/fees" element={<StudentFeesView />} />
                            <Route path="/my-student/payments" element={<StudentFeesView />} />
                        </Route>

                        {/* 8. Parent Portal */}
                        <Route element={<ProtectedRoute allowedRoles={[ROLES.PARENT, ROLES.ADMIN]} />}>
                            <Route path="/parent/dashboard" element={<ParentDashboard />} />
                            <Route path="/my-parent/children" element={<ParentChildrenView />} />
                            <Route path="/my-children" element={<ParentChildrenView />} />
                        </Route>
                    </Route>
                </Route>

                {/* Default & Wildcard Catch-all */}
                <Route path="/" element={<DefaultRedirect />} />
                <Route path="*" element={<DefaultRedirect />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;