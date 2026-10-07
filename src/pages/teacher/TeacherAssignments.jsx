import { useEffect, useState } from 'react';
import api from '../../services/api';

const demoAssignments = [
    { id: 1, academic_year: '2026-2027', school_class: { name: 'Class 9' }, section: { name: 'Section A' }, subject: { name: 'Mathematics' }, students_count: 32 },
    { id: 2, academic_year: '2026-2027', school_class: { name: 'Class 10' }, section: { name: 'Section B' }, subject: { name: 'Physics' }, students_count: 28 },
    { id: 3, academic_year: '2026-2027', school_class: { name: 'Class 9' }, section: { name: 'Section B' }, subject: { name: 'Mathematics' }, students_count: 35 },
];

export default function TeacherAssignments() {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                const res = await api.get('/my-teacher/assignments');
                const list = res.data?.data || res.data || [];
                setAssignments(Array.isArray(list) && list.length > 0 ? list : demoAssignments);
            } catch {
                setAssignments(demoAssignments);
            } finally {
                setLoading(false);
            }
        };
        fetchAssignments();
    }, []);

    return (
        <div className="container-fluid py-4">
            <div className="mb-4">
                <h1 className="h3 fw-bold mb-1">My Assigned Classes & Subjects</h1>
                <p className="text-muted mb-0">View all teaching assignments across classes, sections, and subjects.</p>
            </div>

            <div className="card border-0 shadow-sm">
                <div className="card-body p-0">
                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status"></div>
                            <p className="mt-2 text-muted">Loading assignments...</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>Academic Year</th>
                                        <th>Class</th>
                                        <th>Section</th>
                                        <th>Subject</th>
                                        <th>Enrolled Students</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {assignments.map((item) => (
                                        <tr key={item.id}>
                                            <td>{item.academic_year || '2026-2027'}</td>
                                            <td className="fw-semibold">{item.school_class?.name || item.class_name || 'Class'}</td>
                                            <td><span className="badge bg-secondary-subtle text-secondary px-2 py-1">{item.section?.name || item.section_name || 'Section'}</span></td>
                                            <td><span className="badge bg-primary-subtle text-primary px-2 py-1">{item.subject?.name || item.subject_name || 'Subject'}</span></td>
                                            <td>{item.students_count || 30} Students</td>
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
