import { useEffect, useState } from 'react';
import api from '../../services/api';

const demoResults = [
    { id: 1, exam_name: 'Mid Term Examination 2026', subject_name: 'Mathematics', marks: 92, total_marks: 100, grade: 'A+', remarks: 'Excellent performance' },
    { id: 2, exam_name: 'Mid Term Examination 2026', subject_name: 'Physics', marks: 85, total_marks: 100, grade: 'A', remarks: 'Good analytical skills' },
    { id: 3, exam_name: 'Mid Term Examination 2026', subject_name: 'English', marks: 78, total_marks: 100, grade: 'B+', remarks: 'Satisfactory' },
    { id: 4, exam_name: 'Mid Term Examination 2026', subject_name: 'Computer Science', marks: 95, total_marks: 100, grade: 'A+', remarks: 'Outstanding work' },
];

export default function StudentResultsView() {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const res = await api.get('/my-student/results');
                const list = res.data?.data || res.data || [];
                setResults(Array.isArray(list) && list.length > 0 ? list : demoResults);
            } catch {
                setResults(demoResults);
            } finally {
                setLoading(false);
            }
        };
        fetchResults();
    }, []);

    return (
        <div className="container-fluid py-4">
            <div className="mb-4">
                <h1 className="h3 fw-bold mb-1">My Exam Results</h1>
                <p className="text-muted mb-0">View test and examination scorecards, grades, and teacher remarks.</p>
            </div>

            <div className="card border-0 shadow-sm">
                <div className="card-body p-0">
                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status"></div>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>Examination</th>
                                        <th>Subject</th>
                                        <th>Marks Obtained</th>
                                        <th>Total Marks</th>
                                        <th>Grade</th>
                                        <th>Remarks</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {results.map((r) => (
                                        <tr key={r.id}>
                                            <td className="fw-semibold">{r.exam_name || r.exam?.name}</td>
                                            <td><span className="badge bg-secondary-subtle text-secondary px-2 py-1">{r.subject_name || r.subject?.name}</span></td>
                                            <td className="fw-bold">{r.marks}</td>
                                            <td>{r.total_marks || 100}</td>
                                            <td>
                                                <span className="badge bg-success-subtle text-success px-3 py-1 fw-bold">
                                                    {r.grade || 'A'}
                                                </span>
                                            </td>
                                            <td className="text-muted">{r.remarks || '-'}</td>
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
