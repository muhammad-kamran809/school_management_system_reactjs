import { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

function Dashboard() {
    const { user } = useAuth();
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const loadDashboard = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await api.get('/dashboard');
            const data = response.data?.data || {};
            setDashboard({
                ...data,
                academic_year: response.data?.academic_year || data.academic_year || null,
                user: user || data.user || null,
            });
        } catch (err) {
            console.error('Failed to load dashboard:', err);
            setError(
                err.response?.data?.message ||
                'Unable to load dashboard.'
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadDashboard();
    }, []);

    if (loading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-primary">
                    <span className="visually-hidden">
                        Loading...
                    </span>
                </div>

                <p className="mt-3">
                    Loading dashboard...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger">
                {error}
            </div>
        );
    }

    const counts = dashboard?.counts || {};
    const academicYear = dashboard?.academic_year || {};
    const attendance = dashboard?.attendance || {};
    const exams = dashboard?.exams || {};
    const fees = dashboard?.fees || {};
    const recentPayments = dashboard?.recent_payments || [];

    const formatAmount = (amount) =>
        Number(amount || 0).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

    const formatDate = (date) =>
        date
            ? new Date(date).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            })
            : '-';

    const statCards = [
        { label: 'Students', value: counts.students, icon: 'bi-people', tone: 'blue' },
        { label: 'Teachers', value: counts.teachers, icon: 'bi-person-workspace', tone: 'green' },
        { label: 'Staff members', value: counts.staff, icon: 'bi-person-badge', tone: 'amber' },
        { label: 'Classes', value: counts.classes, icon: 'bi-building', tone: 'red' },
    ];

    return (
        <div className="dashboard-page">
            <section className="dashboard-hero">
                <div>
                    <p className="section-kicker">Overview</p>
                    <h1>Good morning, {dashboard?.user?.name?.split(' ')[0] || 'Administrator'}.</h1>
                    <p className="hero-copy">Here is what is happening across your school today.</p>
                </div>
                {academicYear.name && (
                    <div className="academic-year">
                        <span className="academic-year-icon"><i className="bi bi-calendar3"></i></span>
                        <span><small>Academic year</small><strong>{academicYear.name}</strong></span>
                    </div>
                )}
            </section>

            <div className="row g-3">
                {statCards.map((stat) => (
                    <div className="col-sm-6 col-xl-3" key={stat.label}>
                        <div className="stat-card">
                            <div className={`stat-icon ${stat.tone}`}><i className={`bi ${stat.icon}`}></i></div>
                            <div>
                                <span>{stat.label}</span>
                                <strong>{stat.value ?? 0}</strong>
                            </div>
                            <i className="bi bi-arrow-up-right stat-trend"></i>
                        </div>
                    </div>
                ))}
            </div>

            <div className="row g-3 dashboard-section">

                <div className="col-md-6">
                    <div className="dashboard-panel h-100">
                        <div className="panel-heading"><div><p className="section-kicker">Daily activity</p><h2>Attendance overview</h2></div><i className="bi bi-bar-chart-line"></i></div>

                        <div className="attendance-grid">
                            <div><strong>{attendance.total ?? 0}</strong><span>Total</span></div>
                            <div className="success"><strong>{attendance.present ?? 0}</strong><span>Present</span></div>
                            <div className="danger"><strong>{attendance.absent ?? 0}</strong><span>Absent</span></div>
                            <div className="warning"><strong>{attendance.late ?? 0}</strong><span>Late</span></div>
                        </div>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="dashboard-panel h-100">
                        <div className="panel-heading"><div><p className="section-kicker">Assessment</p><h2>Exams overview</h2></div><i className="bi bi-journal-check"></i></div>
                        <div className="overview-list">
                            <div><span>Total exams</span><strong>{exams.total ?? 0}</strong></div>
                            <div><span>Results recorded</span><strong>{exams.results ?? 0}</strong></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row g-3 dashboard-section">
                <div className="col-md-5">
                    <div className="dashboard-panel h-100">
                        <div className="panel-heading"><div><p className="section-kicker">Structure</p><h2>Academic overview</h2></div><i className="bi bi-mortarboard"></i></div>
                        <div className="overview-list">
                            <div><span>Sections</span><strong>{counts.sections ?? 0}</strong></div>
                            <div><span>Subjects</span><strong>{counts.subjects ?? 0}</strong></div>
                        </div>
                    </div>
                </div>

                <div className="col-md-7">
                    <div className="dashboard-panel h-100">
                        <div className="panel-heading"><div><p className="section-kicker">Collections</p><h2>Finance overview</h2></div><i className="bi bi-wallet2"></i></div>
                        <div className="finance-grid">
                            <div><span>Total fees</span><strong>{formatAmount(fees.total)}</strong></div>
                            <div><span>Paid</span><strong className="text-success">{formatAmount(fees.paid)}</strong></div>
                            <div><span>Remaining</span><strong className="text-danger">{formatAmount(fees.remaining)}</strong></div>
                            <div><span>Pending</span><strong className="text-warning">{formatAmount(fees.pending)}</strong></div>
                        </div>
                        <div className="progress finance-progress" role="progressbar" aria-label="Fee collection progress" aria-valuenow={fees.collection_percentage ?? 0} aria-valuemin="0" aria-valuemax="100">
                            <div className="progress-bar" style={{ width: `${fees.collection_percentage ?? 0}%` }}></div>
                        </div>
                        <div className="progress-caption"><span>Collection progress</span><strong>{fees.collection_percentage ?? 0}%</strong></div>
                    </div>
                </div>
            </div>

            <div className="dashboard-panel table-panel dashboard-section">
                <div className="panel-heading"><div><p className="section-kicker">People</p><h2>Recent students</h2></div><span className="panel-count">{dashboard?.recent_students?.length || 0} records</span></div>

                {dashboard?.recent_students?.length > 0 ? (
                    <div className="table-responsive">
                        <table className="table align-middle mb-0">
                            <thead><tr><th>#</th><th>Name</th><th>Email</th><th>Phone</th><th>Status</th></tr></thead>
                            <tbody>
                                {dashboard.recent_students.map((student, index) => (
                                    <tr key={student.id}><td>{index + 1}</td><td className="fw-semibold">{student.name}</td><td>{student.email || '-'}</td><td>{student.phone || '-'}</td><td><span className="status-badge">{student.status}</span></td></tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : <p className="empty-state">No students found.</p>}
            </div>

            <div className="dashboard-panel table-panel dashboard-section">
                <div className="panel-heading"><div><p className="section-kicker">Finance activity</p><h2>Recent payments</h2></div><span className="panel-count">{recentPayments.length} records</span></div>

                {recentPayments.length > 0 ? (
                    <div className="table-responsive">
                        <table className="table align-middle mb-0">
                            <thead><tr><th>Receipt</th><th>Student</th><th>Date</th><th>Method</th><th className="text-end">Amount</th></tr></thead>
                            <tbody>
                                {recentPayments.map((payment) => (
                                    <tr key={payment.id}><td className="fw-semibold">{payment.receipt_number || '-'}</td><td>{payment.student?.name || '-'}</td><td>{formatDate(payment.payment_date)}</td><td className="text-capitalize">{payment.payment_method || '-'}</td><td className="text-end fw-semibold">{formatAmount(payment.amount)}</td></tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : <p className="empty-state">No payments found.</p>}
            </div>
        </div>
    );
}

export default Dashboard;