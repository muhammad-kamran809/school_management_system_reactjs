import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function StudentDashboard() {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [stats, setStats] = useState({
        attendancePercentage: 94,
        latestResult: 'A+',
        pendingFees: 0,
        upcomingExams: 2,
    });

    useEffect(() => {
        const fetchStudentProfile = async () => {
            try {
                const res = await api.get('/my-profile/student');
                setProfile(res.data?.data || res.data);
            } catch {
                setProfile({
                    name: user?.name || 'Student',
                    roll_number: '101',
                    class_name: 'Class 10',
                    section_name: 'Section A',
                });
            }
        };
        fetchStudentProfile();
    }, [user]);

    return (
        <div className="container-fluid py-4">
            {/* Hero banner */}
            <div className="card border-0 bg-info-subtle shadow-sm mb-4">
                <div className="card-body p-4 p-md-5">
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                        <div>
                            <span className="badge bg-primary text-white mb-2 px-3 py-1 fw-bold">Student Portal</span>
                            <h1 className="h2 fw-bold mb-2">Hello, {profile?.name || user?.name || 'Student'}!</h1>
                            <p className="mb-0 text-muted">
                                Class: <strong>{profile?.class_name || 'Class 10'}</strong> | Roll #: <strong>{profile?.roll_number || '101'}</strong>
                            </p>
                        </div>
                        <div>
                            <Link to="/my-profile/student" className="btn btn-primary fw-semibold">
                                <i className="bi bi-person-circle me-2"></i>
                                View My Profile
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="row g-3 mb-4">
                <div className="col-sm-6 col-xl-3">
                    <div className="card border-0 shadow-sm p-3">
                        <div className="d-flex align-items-center gap-3">
                            <div className="p-3 bg-success-subtle text-success rounded-3 fs-3">
                                <i className="bi bi-calendar-check"></i>
                            </div>
                            <div>
                                <small className="text-muted d-block">Attendance</small>
                                <span className="h4 fw-bold mb-0">{stats.attendancePercentage}%</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-sm-6 col-xl-3">
                    <div className="card border-0 shadow-sm p-3">
                        <div className="d-flex align-items-center gap-3">
                            <div className="p-3 bg-primary-subtle text-primary rounded-3 fs-3">
                                <i className="bi bi-award"></i>
                            </div>
                            <div>
                                <small className="text-muted d-block">Latest Grade</small>
                                <span className="h4 fw-bold mb-0">{stats.latestResult}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-sm-6 col-xl-3">
                    <div className="card border-0 shadow-sm p-3">
                        <div className="d-flex align-items-center gap-3">
                            <div className="p-3 bg-warning-subtle text-warning rounded-3 fs-3">
                                <i className="bi bi-journal-text"></i>
                            </div>
                            <div>
                                <small className="text-muted d-block">Upcoming Exams</small>
                                <span className="h4 fw-bold mb-0">{stats.upcomingExams}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-sm-6 col-xl-3">
                    <div className="card border-0 shadow-sm p-3">
                        <div className="d-flex align-items-center gap-3">
                            <div className="p-3 bg-danger-subtle text-danger rounded-3 fs-3">
                                <i className="bi bi-credit-card"></i>
                            </div>
                            <div>
                                <small className="text-muted d-block">Pending Dues</small>
                                <span className="h4 fw-bold mb-0">Rs. {stats.pendingFees}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Navigation Cards */}
            <div className="row g-4">
                <div className="col-md-6 col-lg-3">
                    <div className="card border-0 shadow-sm h-100 text-center p-4">
                        <div className="fs-1 text-primary mb-3">
                            <i className="bi bi-calendar2-week"></i>
                        </div>
                        <h5 className="fw-bold">My Attendance</h5>
                        <p className="text-muted small">View daily attendance logs and monthly summary.</p>
                        <Link to="/my-student/attendance" className="btn btn-outline-primary btn-sm mt-auto">
                            Check Attendance
                        </Link>
                    </div>
                </div>
                <div className="col-md-6 col-lg-3">
                    <div className="card border-0 shadow-sm h-100 text-center p-4">
                        <div className="fs-1 text-success mb-3">
                            <i className="bi bi-file-earmark-bar-graph"></i>
                        </div>
                        <h5 className="fw-bold">Exam Results</h5>
                        <p className="text-muted small">Check test grades, marks sheets, and teacher remarks.</p>
                        <Link to="/my-student/results" className="btn btn-outline-success btn-sm mt-auto">
                            View Results
                        </Link>
                    </div>
                </div>
                <div className="col-md-6 col-lg-3">
                    <div className="card border-0 shadow-sm h-100 text-center p-4">
                        <div className="fs-1 text-warning mb-3">
                            <i className="bi bi-receipt"></i>
                        </div>
                        <h5 className="fw-bold">Fee Status</h5>
                        <p className="text-muted small">View tuition invoices, receipts, and payment history.</p>
                        <Link to="/my-student/fees" className="btn btn-outline-warning text-dark btn-sm mt-auto">
                            View Fees
                        </Link>
                    </div>
                </div>
                <div className="col-md-6 col-lg-3">
                    <div className="card border-0 shadow-sm h-100 text-center p-4">
                        <div className="fs-1 text-info mb-3">
                            <i className="bi bi-table"></i>
                        </div>
                        <h5 className="fw-bold">Class Timetable</h5>
                        <p className="text-muted small">View daily period schedule and assigned subjects.</p>
                        <Link to="/timetable" className="btn btn-outline-info text-dark btn-sm mt-auto">
                            View Timetable
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
