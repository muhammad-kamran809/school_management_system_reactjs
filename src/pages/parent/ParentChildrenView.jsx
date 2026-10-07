import { useEffect, useState } from 'react';
import api from '../../services/api';

const demoChildList = [
    {
        id: 1,
        name: 'Hamza Sheikh',
        roll_number: '101',
        class_name: 'Class 10',
        section_name: 'Section A',
        attendance: [
            { date: '2026-10-06', status: 'present' },
            { date: '2026-10-05', status: 'present' },
            { date: '2026-10-04', status: 'late' },
        ],
        results: [
            { subject: 'Mathematics', marks: 92, grade: 'A+' },
            { subject: 'Physics', marks: 85, grade: 'A' },
            { subject: 'English', marks: 78, grade: 'B+' },
        ],
        fees: [
            { title: 'October 2026 Tuition', amount: 8000, status: 'Paid', receipt: 'REC-2026-089' },
            { title: 'September 2026 Tuition', amount: 8000, status: 'Paid', receipt: 'REC-2026-042' },
        ],
    },
    {
        id: 2,
        name: 'Amina Sheikh',
        roll_number: '108',
        class_name: 'Class 7',
        section_name: 'Section B',
        attendance: [
            { date: '2026-10-06', status: 'present' },
            { date: '2026-10-05', status: 'present' },
            { date: '2026-10-04', status: 'present' },
        ],
        results: [
            { subject: 'Science', marks: 88, grade: 'A' },
            { subject: 'Mathematics', marks: 95, grade: 'A+' },
            { subject: 'Urdu', marks: 82, grade: 'A' },
        ],
        fees: [
            { title: 'October 2026 Tuition', amount: 7000, status: 'Paid', receipt: 'REC-2026-090' },
        ],
    },
];

export default function ParentChildrenView() {
    const [children, setChildren] = useState(demoChildList);
    const [selectedChildId, setSelectedChildId] = useState(demoChildList[0].id);
    const [activeTab, setActiveTab] = useState('attendance');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchChildren = async () => {
            try {
                const res = await api.get('/my-parent/children');
                const list = res.data?.data || res.data || [];
                if (Array.isArray(list) && list.length > 0) {
                    setChildren(list);
                    setSelectedChildId(list[0].id);
                }
            } catch {
                setChildren(demoChildList);
            } finally {
                setLoading(false);
            }
        };
        fetchChildren();
    }, []);

    const activeChild = children.find((c) => c.id === selectedChildId) || children[0];

    return (
        <div className="container-fluid py-4">
            <div className="mb-4">
                <h1 className="h3 fw-bold mb-1">My Children Records</h1>
                <p className="text-muted mb-0">Detailed view of classroom attendance, exam reports, and fee records per child.</p>
            </div>

            {/* Child selector tabs */}
            <div className="d-flex gap-2 mb-4 border-bottom pb-3">
                {children.map((child) => (
                    <button
                        key={child.id}
                        className={`btn ${selectedChildId === child.id ? 'btn-primary' : 'btn-outline-secondary'}`}
                        onClick={() => setSelectedChildId(child.id)}
                    >
                        <i className="bi bi-person-fill me-2"></i>
                        {child.name} ({child.class_name || 'Class'})
                    </button>
                ))}
            </div>

            {/* Sub-tabs: Attendance, Results, Fees */}
            <ul className="nav nav-pills mb-4">
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'attendance' ? 'active' : ''}`}
                        onClick={() => setActiveTab('attendance')}
                    >
                        <i className="bi bi-calendar-check me-2"></i>
                        Attendance
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'results' ? 'active' : ''}`}
                        onClick={() => setActiveTab('results')}
                    >
                        <i className="bi bi-award me-2"></i>
                        Exam Results
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'fees' ? 'active' : ''}`}
                        onClick={() => setActiveTab('fees')}
                    >
                        <i className="bi bi-credit-card me-2"></i>
                        Fee History
                    </button>
                </li>
            </ul>

            {/* Tab content */}
            <div className="card border-0 shadow-sm">
                <div className="card-body p-0">
                    {activeTab === 'attendance' && (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>Date</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(activeChild?.attendance || []).map((att, idx) => (
                                        <tr key={idx}>
                                            <td className="fw-semibold">{att.date}</td>
                                            <td>
                                                <span className={`badge ${att.status === 'present' ? 'bg-success' : att.status === 'absent' ? 'bg-danger' : 'bg-warning text-dark'} px-3 py-1 text-uppercase`}>
                                                    {att.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === 'results' && (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>Subject</th>
                                        <th>Marks</th>
                                        <th>Grade</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(activeChild?.results || []).map((res, idx) => (
                                        <tr key={idx}>
                                            <td className="fw-semibold">{res.subject}</td>
                                            <td className="fw-bold">{res.marks}</td>
                                            <td>
                                                <span className="badge bg-success-subtle text-success px-3 py-1">
                                                    {res.grade}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === 'fees' && (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>Fee Item</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                        <th>Receipt #</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(activeChild?.fees || []).map((f, idx) => (
                                        <tr key={idx}>
                                            <td className="fw-semibold">{f.title}</td>
                                            <td className="fw-bold">Rs. {Number(f.amount || 0).toLocaleString()}</td>
                                            <td><span className="badge bg-success-subtle text-success px-3 py-1">{f.status}</span></td>
                                            <td><span className="badge bg-light text-dark border">{f.receipt}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
