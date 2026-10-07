import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function TeacherDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalClasses: 3,
        totalStudents: 95,
        todayLectures: 4,
        pendingAttendance: 1,
    });
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTeacherData = async () => {
            try {
                const res = await api.get('/my-teacher/assignments');
                const list = res.data?.data || res.data || [];
                setAssignments(Array.isArray(list) ? list : []);
            } catch {
                // Fallback demo assignments
                setAssignments([
                    { id: 1, class_name: 'Class 9', section_name: 'Section A', subject_name: 'Mathematics', room: 'Room 101', time: '09:00 AM' },
                    { id: 2, class_name: 'Class 10', section_name: 'Section B', subject_name: 'Physics', room: 'Lab 2', time: '11:00 AM' },
                    { id: 3, class_name: 'Class 9', section_name: 'Section B', subject_name: 'Mathematics', room: 'Room 102', time: '01:00 PM' },
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchTeacherData();
    }, []);

    return (
        <div className="container-fluid py-4">
            {/* Header Hero */}
            <div className="card border-0 bg-primary text-white shadow-sm mb-4">
                <div className="card-body p-4 p-md-5">
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                        <div>
                            <span className="badge bg-white text-primary mb-2 px-3 py-1 fw-bold">Teacher Portal</span>
                            <h1 className="h2 fw-bold mb-2">Welcome back, {user?.name || 'Teacher'}!</h1>
                            <p className="mb-0 text-white-50">Here is your daily teaching schedule, assigned classes, and student updates.</p>
                        </div>
                        <div className="d-flex gap-2">
                            <Link to="/my-teacher/attendance" className="btn btn-light fw-semibold">
                                <i className="bi bi-clipboard-check me-2 text-primary"></i>
                                Mark Attendance
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="row g-3 mb-4">
                <div className="col-sm-6 col-xl-3">
                    <div className="card border-0 shadow-sm p-3">
                        <div className="d-flex align-items-center gap-3">
                            <div className="p-3 bg-primary-subtle text-primary rounded-3 fs-3">
                                <i className="bi bi-mortarboard"></i>
                            </div>
                            <div>
                                <small className="text-muted d-block">Assigned Classes</small>
                                <span className="h4 fw-bold mb-0">{stats.totalClasses}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-sm-6 col-xl-3">
                    <div className="card border-0 shadow-sm p-3">
                        <div className="d-flex align-items-center gap-3">
                            <div className="p-3 bg-success-subtle text-success rounded-3 fs-3">
                                <i className="bi bi-people"></i>
                            </div>
                            <div>
                                <small className="text-muted d-block">Total Students</small>
                                <span className="h4 fw-bold mb-0">{stats.totalStudents}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-sm-6 col-xl-3">
                    <div className="card border-0 shadow-sm p-3">
                        <div className="d-flex align-items-center gap-3">
                            <div className="p-3 bg-warning-subtle text-warning rounded-3 fs-3">
                                <i className="bi bi-clock-history"></i>
                            </div>
                            <div>
                                <small className="text-muted d-block">Lectures Today</small>
                                <span className="h4 fw-bold mb-0">{stats.todayLectures}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-sm-6 col-xl-3">
                    <div className="card border-0 shadow-sm p-3">
                        <div className="d-flex align-items-center gap-3">
                            <div className="p-3 bg-danger-subtle text-danger rounded-3 fs-3">
                                <i className="bi bi-check2-circle"></i>
                            </div>
                            <div>
                                <small className="text-muted d-block">Pending Attendance</small>
                                <span className="h4 fw-bold mb-0">{stats.pendingAttendance}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Teaching Schedule / Assignments */}
            <div className="row g-4">
                <div className="col-lg-8">
                    <div className="card border-0 shadow-sm">
                        <div className="card-header bg-transparent border-0 pt-4 px-4 d-flex justify-content-between align-items-center">
                            <h5 className="fw-bold mb-0">My Teaching Schedule & Assignments</h5>
                            <Link to="/my-teacher/assignments" className="btn btn-sm btn-outline-primary">
                                View All
                            </Link>
                        </div>
                        <div className="card-body p-4">
                            {loading ? (
                                <div className="text-center py-4">
                                    <div className="spinner-border text-primary" role="status"></div>
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th>Class & Section</th>
                                                <th>Subject</th>
                                                <th>Room</th>
                                                <th>Time</th>
                                                <th className="text-end">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {assignments.map((item) => (
                                                <tr key={item.id}>
                                                    <td className="fw-semibold">
                                                        {item.class_name || item.school_class?.name || 'Class'} - {item.section_name || item.section?.name || 'A'}
                                                    </td>
                                                    <td>
                                                        <span className="badge bg-info-subtle text-dark px-2 py-1">
                                                            {item.subject_name || item.subject?.name || 'General'}
                                                        </span>
                                                    </td>
                                                    <td>{item.room || 'Room 101'}</td>
                                                    <td>{item.time || '09:00 AM'}</td>
                                                    <td className="text-end">
                                                        <Link to="/my-teacher/attendance" className="btn btn-sm btn-outline-primary me-2">
                                                            Attendance
                                                        </Link>
                                                        <Link to="/my-teacher/students" className="btn btn-sm btn-light">
                                                            Students
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="card border-0 shadow-sm mb-4">
                        <div className="card-header bg-transparent border-0 pt-4 px-4">
                            <h5 className="fw-bold mb-0">Quick Teacher Tools</h5>
                        </div>
                        <div className="card-body p-4 d-flex flex-column gap-2">
                            <Link to="/my-teacher/attendance" className="btn btn-outline-primary text-start p-3 d-flex align-items-center gap-3">
                                <i className="bi bi-calendar-check fs-4"></i>
                                <div>
                                    <strong className="d-block">Mark Student Attendance</strong>
                                    <small className="text-muted">Take attendance for assigned classes</small>
                                </div>
                            </Link>
                            <Link to="/results" className="btn btn-outline-success text-start p-3 d-flex align-items-center gap-3">
                                <i className="bi bi-award fs-4"></i>
                                <div>
                                    <strong className="d-block">Enter Exam Results</strong>
                                    <small className="text-muted">Record student scores and grades</small>
                                </div>
                            </Link>
                            <Link to="/timetable" className="btn btn-outline-secondary text-start p-3 d-flex align-items-center gap-3">
                                <i className="bi bi-table fs-4"></i>
                                <div>
                                    <strong className="d-block">Class Timetable</strong>
                                    <small className="text-muted">View school routine & schedules</small>
                                </div>
                            </Link>
                            <Link to="/notices" className="btn btn-outline-info text-start p-3 d-flex align-items-center gap-3">
                                <i className="bi bi-megaphone fs-4"></i>
                                <div>
                                    <strong className="d-block">School Notices</strong>
                                    <small className="text-muted">Stay informed on school events</small>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
