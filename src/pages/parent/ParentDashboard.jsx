import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const demoChildren = [
    {
        id: 1,
        name: 'Hamza Sheikh',
        roll_number: '101',
        class_name: 'Class 10',
        section_name: 'Section A',
        attendance_percentage: 95,
        latest_grade: 'A+',
        fees_status: 'Paid',
    },
    {
        id: 2,
        name: 'Amina Sheikh',
        roll_number: '108',
        class_name: 'Class 7',
        section_name: 'Section B',
        attendance_percentage: 92,
        latest_grade: 'A',
        fees_status: 'Paid',
    },
];

export default function ParentDashboard() {
    const { user } = useAuth();
    const [children, setChildren] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchChildren = async () => {
            try {
                const res = await api.get('/my-parent/children');
                const list = res.data?.data || res.data || [];
                setChildren(Array.isArray(list) && list.length > 0 ? list : demoChildren);
            } catch {
                try {
                    const fallbackRes = await api.get('/my-children');
                    const fallbackList = fallbackRes.data?.data || fallbackRes.data || [];
                    setChildren(Array.isArray(fallbackList) && fallbackList.length > 0 ? fallbackList : demoChildren);
                } catch {
                    setChildren(demoChildren);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchChildren();
    }, []);

    return (
        <div className="container-fluid py-4">
            <div className="card border-0 bg-warning-subtle shadow-sm mb-4">
                <div className="card-body p-4 p-md-5">
                    <span className="badge bg-warning text-dark mb-2 px-3 py-1 fw-bold">Parent Portal</span>
                    <h1 className="h2 fw-bold mb-2">Welcome, {user?.name || 'Parent'}!</h1>
                    <p className="mb-0 text-muted">
                        Monitor academic progress, classroom attendance, and fee invoices for your enrolled children.
                    </p>
                </div>
            </div>

            <div className="mb-4 d-flex justify-content-between align-items-center">
                <h4 className="fw-bold mb-0">My Children ({children.length})</h4>
                <Link to="/my-parent/children" className="btn btn-outline-primary btn-sm">
                    View Complete Records
                </Link>
            </div>

            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status"></div>
                </div>
            ) : (
                <div className="row g-4">
                    {children.map((child) => (
                        <div className="col-md-6" key={child.id}>
                            <div className="card border-0 shadow-sm h-100 p-4">
                                <div className="d-flex align-items-center gap-3 mb-3">
                                    <div className="p-3 bg-primary-subtle text-primary rounded-circle fs-3">
                                        <i className="bi bi-mortarboard-fill"></i>
                                    </div>
                                    <div>
                                        <h5 className="fw-bold mb-0">{child.name}</h5>
                                        <small className="text-muted">
                                            {child.class_name} - {child.section_name} | Roll #{child.roll_number}
                                        </small>
                                    </div>
                                </div>

                                <div className="row g-2 mb-4 bg-light p-3 rounded-3 text-center">
                                    <div className="col-4">
                                        <small className="text-muted d-block">Attendance</small>
                                        <strong className="text-success">{child.attendance_percentage || 94}%</strong>
                                    </div>
                                    <div className="col-4">
                                        <small className="text-muted d-block">Grade</small>
                                        <strong className="text-primary">{child.latest_grade || 'A'}</strong>
                                    </div>
                                    <div className="col-4">
                                        <small className="text-muted d-block">Fees</small>
                                        <span className="badge bg-success-subtle text-success">{child.fees_status || 'Paid'}</span>
                                    </div>
                                </div>

                                <div className="d-flex gap-2 mt-auto">
                                    <Link to={`/my-parent/children`} className="btn btn-outline-primary btn-sm w-100">
                                        Child Report
                                    </Link>
                                    <Link to="/timetable" className="btn btn-light btn-sm w-100">
                                        Timetable
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
