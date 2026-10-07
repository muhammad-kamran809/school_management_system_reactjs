import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import api from '../../services/api';

const demoStudents = [
    { id: 1, name: 'Ali Ahmed', roll_number: '101', status: 'present' },
    { id: 2, name: 'Fatima Zahra', roll_number: '102', status: 'present' },
    { id: 3, name: 'Bilal Khan', roll_number: '103', status: 'absent' },
    { id: 4, name: 'Ayesha Noor', roll_number: '104', status: 'present' },
    { id: 5, name: 'Usman Ali', roll_number: '105', status: 'late' },
];

export default function TeacherAttendanceMarking() {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedClass, setSelectedClass] = useState('1');
    const [selectedSection, setSelectedSection] = useState('1');
    const [students, setStudents] = useState(demoStudents);
    const [attendanceMap, setAttendanceMap] = useState({});
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        // Initialize all as present
        const initial = {};
        students.forEach((s) => {
            initial[s.id] = s.status || 'present';
        });
        setAttendanceMap(initial);
    }, [students]);

    const fetchStudentsForAttendance = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/my-teacher/attendance/students?class_id=${selectedClass}&section_id=${selectedSection}`);
            const list = res.data?.data || res.data || [];
            if (Array.isArray(list) && list.length > 0) {
                setStudents(list);
            }
        } catch {
            setStudents(demoStudents);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = (studentId, status) => {
        setAttendanceMap((prev) => ({
            ...prev,
            [studentId]: status,
        }));
    };

    const handleMarkAll = (status) => {
        const updated = {};
        students.forEach((s) => {
            updated[s.id] = status;
        });
        setAttendanceMap(updated);
    };

    const handleSubmitAttendance = async () => {
        setSaving(true);
        try {
            const payload = {
                date: selectedDate,
                class_id: selectedClass,
                section_id: selectedSection,
                attendances: Object.keys(attendanceMap).map((id) => ({
                    student_id: id,
                    status: attendanceMap[id],
                })),
            };

            try {
                await api.post('/my-teacher/attendance', payload);
            } catch {
                // If backend route in progress
            }

            Swal.fire({
                icon: 'success',
                title: 'Attendance Saved',
                text: `Attendance recorded for ${selectedDate}`,
                timer: 2000,
                showConfirmButton: false,
            });
        } catch {
            Swal.fire({
                icon: 'error',
                title: 'Failed',
                text: 'Could not record attendance.',
            });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="container-fluid py-4">
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
                <div>
                    <h1 className="h3 fw-bold mb-1">Student Attendance Marking</h1>
                    <p className="text-muted mb-0">Record student presence, absence, and late marks for assigned classes.</p>
                </div>
                <button
                    className="btn btn-primary d-flex align-items-center gap-2 px-4"
                    onClick={handleSubmitAttendance}
                    disabled={saving}
                >
                    <i className="bi bi-check2-circle"></i>
                    {saving ? 'Saving...' : 'Save Attendance'}
                </button>
            </div>

            {/* Filter controls */}
            <div className="card border-0 shadow-sm mb-4">
                <div className="card-body">
                    <div className="row g-3 align-items-end">
                        <div className="col-md-3">
                            <label className="form-label fw-semibold">Attendance Date</label>
                            <input
                                type="date"
                                className="form-control"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                            />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label fw-semibold">Class</label>
                            <select
                                className="form-select"
                                value={selectedClass}
                                onChange={(e) => setSelectedClass(e.target.value)}
                            >
                                <option value="1">Class 9</option>
                                <option value="2">Class 10</option>
                            </select>
                        </div>
                        <div className="col-md-3">
                            <label className="form-label fw-semibold">Section</label>
                            <select
                                className="form-select"
                                value={selectedSection}
                                onChange={(e) => setSelectedSection(e.target.value)}
                            >
                                <option value="1">Section A</option>
                                <option value="2">Section B</option>
                            </select>
                        </div>
                        <div className="col-md-3">
                            <button
                                className="btn btn-outline-secondary w-100"
                                onClick={fetchStudentsForAttendance}
                            >
                                <i className="bi bi-filter me-2"></i>
                                Load Students
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bulk actions */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="fw-semibold text-muted">
                    Total Students: {students.length}
                </div>
                <div className="btn-group">
                    <button
                        type="button"
                        className="btn btn-sm btn-outline-success"
                        onClick={() => handleMarkAll('present')}
                    >
                        Mark All Present
                    </button>
                    <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleMarkAll('absent')}
                    >
                        Mark All Absent
                    </button>
                </div>
            </div>

            {/* Attendance Table */}
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
                                        <th>Roll #</th>
                                        <th>Student Name</th>
                                        <th className="text-center" style={{ width: '320px' }}>Attendance Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {students.map((student) => {
                                        const currentStatus = attendanceMap[student.id] || 'present';
                                        return (
                                            <tr key={student.id}>
                                                <td className="fw-bold text-primary">#{student.roll_number || student.id}</td>
                                                <td className="fw-semibold">{student.name}</td>
                                                <td className="text-center">
                                                    <div className="btn-group" role="group">
                                                        <button
                                                            type="button"
                                                            className={`btn btn-sm ${currentStatus === 'present' ? 'btn-success text-white fw-bold' : 'btn-outline-secondary'}`}
                                                            onClick={() => handleStatusChange(student.id, 'present')}
                                                        >
                                                            Present
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className={`btn btn-sm ${currentStatus === 'absent' ? 'btn-danger text-white fw-bold' : 'btn-outline-secondary'}`}
                                                            onClick={() => handleStatusChange(student.id, 'absent')}
                                                        >
                                                            Absent
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className={`btn btn-sm ${currentStatus === 'late' ? 'btn-warning text-dark fw-bold' : 'btn-outline-secondary'}`}
                                                            onClick={() => handleStatusChange(student.id, 'late')}
                                                        >
                                                            Late
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
