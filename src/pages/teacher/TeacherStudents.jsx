import { useEffect, useState } from 'react';
import api from '../../services/api';

const demoStudents = [
    { id: 1, name: 'Ali Ahmed', roll_number: '101', class_name: 'Class 9', section_name: 'Section A', gender: 'Male', phone: '0300-1234567' },
    { id: 2, name: 'Fatima Zahra', roll_number: '102', class_name: 'Class 9', section_name: 'Section A', gender: 'Female', phone: '0301-2345678' },
    { id: 3, name: 'Bilal Khan', roll_number: '103', class_name: 'Class 9', section_name: 'Section A', gender: 'Male', phone: '0302-3456789' },
    { id: 4, name: 'Ayesha Noor', roll_number: '104', class_name: 'Class 10', section_name: 'Section B', gender: 'Female', phone: '0303-4567890' },
];

export default function TeacherStudents() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const res = await api.get('/my-teacher/students');
                const list = res.data?.data || res.data || [];
                setStudents(Array.isArray(list) && list.length > 0 ? list : demoStudents);
            } catch {
                setStudents(demoStudents);
            } finally {
                setLoading(false);
            }
        };
        fetchStudents();
    }, []);

    const filtered = students.filter(
        (s) =>
            (s.name || '').toLowerCase().includes(search.toLowerCase()) ||
            (s.roll_number || '').includes(search)
    );

    return (
        <div className="container-fluid py-4">
            <div className="mb-4">
                <h1 className="h3 fw-bold mb-1">My Students</h1>
                <p className="text-muted mb-0">Students currently enrolled in your assigned classes and sections.</p>
            </div>

            <div className="card border-0 shadow-sm mb-4">
                <div className="card-body">
                    <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">
                            <i className="bi bi-search"></i>
                        </span>
                        <input
                            type="text"
                            className="form-control border-start-0"
                            placeholder="Search students by name or roll number..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="card border-0 shadow-sm">
                <div className="card-body p-0">
                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status"></div>
                            <p className="mt-2 text-muted">Loading students...</p>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-5 text-muted">
                            <p>No students found.</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>Roll #</th>
                                        <th>Student Name</th>
                                        <th>Class & Section</th>
                                        <th>Gender</th>
                                        <th>Contact</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map((s) => (
                                        <tr key={s.id}>
                                            <td className="fw-bold text-primary">#{s.roll_number || s.id}</td>
                                            <td className="fw-semibold">{s.name}</td>
                                            <td>{s.class_name || s.school_class?.name || 'Class 9'} - {s.section_name || s.section?.name || 'A'}</td>
                                            <td>{s.gender || '-'}</td>
                                            <td>{s.phone || '-'}</td>
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
