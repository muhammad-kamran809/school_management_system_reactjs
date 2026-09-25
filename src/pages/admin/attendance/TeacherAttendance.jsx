

import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

// API will be connected later by backend developer
// import api from '../../../services/api';

import { mockStorage } from '../../../services/mockData';

const initialForm = {
    date: '',
    teacher: '',
    status: 'present',
    remarks: '',
};

const TeacherAttendance = () => {
    const [attendance, setAttendance] = useState([]);
    const [teachers, setTeachers] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [editingAttendance, setEditingAttendance] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState(initialForm);
    const [errors, setErrors] = useState({});

    // =========================================================
    // LOAD DATA
    // =========================================================

    useEffect(() => {
        fetchAttendance();
        fetchTeachers();
    }, []);

    // =========================================================
    // FETCH TEACHER ATTENDANCE
    // =========================================================

    const fetchAttendance = async () => {
        try {
            setLoading(true);

            // API will be connected later
            //
            // const response = await api.get('/teacher-attendance');
            // setAttendance(response.data);

            let data = [];

            if (
                mockStorage &&
                typeof mockStorage.getTeacherAttendance === 'function'
            ) {
                data = mockStorage.getTeacherAttendance() || [];
            } else {
                const storedData = localStorage.getItem(
                    'sms_teacher_attendance'
                );

                data = storedData ? JSON.parse(storedData) : [];
            }

            setAttendance(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(
                'Error fetching teacher attendance:',
                error
            );

            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to load teacher attendance.',
            });

            setAttendance([]);
        } finally {
            setLoading(false);
        }
    };

    // =========================================================
    // FETCH TEACHERS
    // =========================================================

    const fetchTeachers = async () => {
        try {
            let data = [];

            /*
             * First try mockStorage.getTeachers()
             */
            if (
                mockStorage &&
                typeof mockStorage.getTeachers === 'function'
            ) {
                data = mockStorage.getTeachers() || [];
            }

            /*
             * If mockStorage does not contain teachers,
             * load them from localStorage.
             */
            if (!Array.isArray(data) || data.length === 0) {
                const possibleKeys = [
                    'school_teachers',
                    'sms_teachers',
                ];

                for (const key of possibleKeys) {
                    const storedData =
                        localStorage.getItem(key);

                    if (storedData) {
                        const parsedData =
                            JSON.parse(storedData);

                        if (
                            Array.isArray(parsedData) &&
                            parsedData.length > 0
                        ) {
                            data = parsedData;
                            break;
                        }
                    }
                }
            }

            setTeachers(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(
                'Error fetching teachers:',
                error
            );

            setTeachers([]);
        }
    };

    // =========================================================
    // ERROR HANDLER
    // =========================================================

    const handleApiError = (error) => {
        const status = error?.response?.status;

        switch (status) {
            case 422:
                Swal.fire({
                    icon: 'error',
                    title: 'Validation Error',
                    text: 'Please check the entered information.',
                });
                break;

            case 401:
                Swal.fire({
                    icon: 'error',
                    title: 'Unauthorized',
                    text: 'You are not authorized to perform this action.',
                });
                break;

            case 403:
                Swal.fire({
                    icon: 'error',
                    title: 'Forbidden',
                    text: 'You do not have permission to perform this action.',
                });
                break;

            case 404:
                Swal.fire({
                    icon: 'error',
                    title: 'Not Found',
                    text: 'The requested resource was not found.',
                });
                break;

            case 500:
                Swal.fire({
                    icon: 'error',
                    title: 'Server Error',
                    text: 'Something went wrong on the server.',
                });
                break;

            default:
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Something went wrong. Please try again.',
                });
        }
    };

    // =========================================================
    // HANDLE INPUT CHANGE
    // =========================================================

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: '',
        }));
    };

    // =========================================================
    // OPEN ADD MODAL
    // =========================================================

    const openAddModal = () => {
        setEditingAttendance(null);
        setFormData(initialForm);
        setErrors({});
        setShowModal(true);

        // Refresh teachers whenever modal opens
        fetchTeachers();
    };

    // =========================================================
    // OPEN EDIT MODAL
    // =========================================================

    const openEditModal = (item) => {
        setEditingAttendance(item);

        setFormData({
            date: item.date || '',
            teacher: item.teacher || '',
            status: item.status || 'present',
            remarks: item.remarks || '',
        });

        setErrors({});
        setShowModal(true);

        // Refresh teachers whenever edit modal opens
        fetchTeachers();
    };

    // =========================================================
    // CLOSE MODAL
    // =========================================================

    const closeModal = () => {
        setShowModal(false);
        setEditingAttendance(null);
        setFormData(initialForm);
        setErrors({});
    };

    // =========================================================
    // VALIDATION
    // =========================================================

    const validateForm = () => {
        const newErrors = {};

        if (!formData.date) {
            newErrors.date = 'Date is required.';
        }

        if (!formData.teacher) {
            newErrors.teacher = 'Teacher is required.';
        }

        if (!formData.status) {
            newErrors.status = 'Status is required.';
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    // =========================================================
    // SAVE ATTENDANCE
    // =========================================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setSaving(true);

            // API will be connected later
            //
            // if (editingAttendance) {
            //     await api.put(
            //         `/teacher-attendance/${editingAttendance.id}`,
            //         formData
            //     );
            // } else {
            //     await api.post(
            //         '/teacher-attendance',
            //         formData
            //     );
            // }

            const newAttendance = {
                ...formData,
                id: editingAttendance?.id || Date.now(),
            };

            let updatedAttendance = [];

            if (editingAttendance) {
                updatedAttendance = attendance.map(
                    (item) =>
                        item.id === editingAttendance.id
                            ? newAttendance
                            : item
                );

                if (
                    mockStorage &&
                    typeof mockStorage.updateTeacherAttendance ===
                        'function'
                ) {
                    mockStorage.updateTeacherAttendance(
                        editingAttendance.id,
                        newAttendance
                    );
                }
            } else {
                updatedAttendance = [
                    ...attendance,
                    newAttendance,
                ];

                if (
                    mockStorage &&
                    typeof mockStorage.addTeacherAttendance ===
                        'function'
                ) {
                    mockStorage.addTeacherAttendance(
                        newAttendance
                    );
                }
            }

            localStorage.setItem(
                'sms_teacher_attendance',
                JSON.stringify(updatedAttendance)
            );

            setAttendance(updatedAttendance);

            closeModal();

            Swal.fire({
                icon: 'success',
                title: editingAttendance
                    ? 'Attendance Updated'
                    : 'Attendance Added',
                text: editingAttendance
                    ? 'Teacher attendance has been updated successfully.'
                    : 'Teacher attendance has been added successfully.',
                timer: 1800,
                showConfirmButton: false,
            });
        } catch (error) {
            console.error(
                'Error saving teacher attendance:',
                error
            );

            handleApiError(error);
        } finally {
            setSaving(false);
        }
    };

    // =========================================================
    // DELETE ATTENDANCE
    // =========================================================

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            icon: 'warning',
            title: 'Delete Attendance?',
            text: 'This attendance record will be permanently deleted.',
            showCancelButton: true,
            confirmButtonText: 'Yes, Delete',
            cancelButtonText: 'Cancel',
        });

        if (!result.isConfirmed) {
            return;
        }

        try {
            // API will be connected later
            //
            // await api.delete(
            //     `/teacher-attendance/${id}`
            // );

            if (
                mockStorage &&
                typeof mockStorage.deleteTeacherAttendance ===
                    'function'
            ) {
                mockStorage.deleteTeacherAttendance(id);
            }

            const updatedAttendance =
                attendance.filter(
                    (item) => item.id !== id
                );

            localStorage.setItem(
                'sms_teacher_attendance',
                JSON.stringify(updatedAttendance)
            );

            setAttendance(updatedAttendance);

            Swal.fire({
                icon: 'success',
                title: 'Deleted',
                text: 'Teacher attendance has been deleted successfully.',
                timer: 1500,
                showConfirmButton: false,
            });
        } catch (error) {
            console.error(
                'Error deleting teacher attendance:',
                error
            );

            handleApiError(error);
        }
    };

    // =========================================================
    // GET TEACHER NAME
    // =========================================================

    const getTeacherName = (teacherValue) => {
        const teacher = teachers.find(
            (item) =>
                String(item.id) === String(teacherValue) ||
                String(item.name) === String(teacherValue)
        );

        return teacher?.name || teacherValue || '-';
    };

    // =========================================================
    // SEARCH
    // =========================================================

    const filteredAttendance = attendance.filter(
        (item) => {
            const search =
                searchTerm.toLowerCase();

            return (
                String(item.date || '')
                    .toLowerCase()
                    .includes(search) ||
                String(
                    getTeacherName(item.teacher)
                )
                    .toLowerCase()
                    .includes(search) ||
                String(item.status || '')
                    .toLowerCase()
                    .includes(search) ||
                String(item.remarks || '')
                    .toLowerCase()
                    .includes(search)
            );
        }
    );

    // =========================================================
    // FIELD ERROR
    // =========================================================

    const fieldError = (fieldName) => {
        return errors[fieldName] ? (
            <small className="text-danger">
                {errors[fieldName]}
            </small>
        ) : null;
    };

    // =========================================================
    // STATUS CLASS
    // =========================================================

    const getStatusClass = (status) => {
        switch (status) {
            case 'present':
                return 'active';

            case 'absent':
                return 'inactive';

            case 'late':
                return 'active';

            case 'leave':
                return 'inactive';

            default:
                return 'inactive';
        }
    };

    // =========================================================
    // UI
    // =========================================================

    return (
        <div className="academic-years-page">

            {/* PAGE HEADER */}
            <div className="academic-years-header">

                <div>
                    <p className="section-kicker">
                        Teachers
                    </p>

                    <h1>Teacher Attendance</h1>

                    <p className="hero-copy">
                        Manage teacher attendance records and
                        information.
                    </p>
                </div>

                <button
                    className="btn btn-primary academic-years-add"
                    onClick={openAddModal}
                >
                    <i
                        className="bi bi-plus-lg"
                        aria-hidden="true"
                    ></i>

                    Add Attendance
                </button>

            </div>

            {/* MAIN PANEL */}
            <div className="dashboard-panel academic-years-panel">

                {/* PANEL HEADER */}
                <div className="academic-years-panel-heading">

                    <div>
                        <p className="section-kicker">
                            Teacher management
                        </p>

                        <h2>Attendance list</h2>
                    </div>

                    <div className="d-flex align-items-center gap-3">

                        <div className="student-search">

                            <i
                                className="bi bi-search"
                                aria-hidden="true"
                            ></i>

                            <input
                                type="text"
                                placeholder="Search attendance..."
                                value={searchTerm}
                                onChange={(e) =>
                                    setSearchTerm(
                                        e.target.value
                                    )
                                }
                            />

                        </div>

                        <span className="panel-count">
                            {filteredAttendance.length}{' '}
                            records
                        </span>

                    </div>

                </div>

                {/* TABLE */}
                <div className="academic-years-table-wrap">

                    {loading ? (
                        <div className="academic-years-empty">

                            <div
                                className="spinner-border"
                                role="status"
                            >
                                <span className="visually-hidden">
                                    Loading...
                                </span>
                            </div>

                            <p>
                                Loading attendance...
                            </p>

                        </div>
                    ) : filteredAttendance.length ===
                      0 ? (
                        <div className="academic-years-empty">

                            <i className="bi bi-calendar-check"></i>

                            <h3>
                                No attendance records found
                            </h3>

                            <p>
                                Add a teacher attendance
                                record to get started.
                            </p>

                        </div>
                    ) : (
                        <div className="table-responsive">

                            <table className="table academic-years-table">

                                <thead>

                                    <tr>
                                        <th>#</th>
                                        <th>Date</th>
                                        <th>Teacher</th>
                                        <th>Status</th>
                                        <th>Remarks</th>
                                        <th>Actions</th>
                                    </tr>

                                </thead>

                                <tbody>

                                    {filteredAttendance.map(
                                        (
                                            item,
                                            index
                                        ) => (
                                            <tr
                                                key={
                                                    item.id
                                                }
                                            >

                                                <td>
                                                    <span className="academic-years-index">
                                                        {
                                                            index +
                                                            1
                                                        }
                                                    </span>
                                                </td>

                                                <td>
                                                    <div className="student-table-name">

                                                        <div className="student-avatar">
                                                            <i className="bi bi-calendar-event"></i>
                                                        </div>

                                                        <div>
                                                            <strong>
                                                                {
                                                                    item.date
                                                                }
                                                            </strong>

                                                            <small>
                                                                Attendance
                                                            </small>
                                                        </div>

                                                    </div>
                                                </td>

                                                <td>
                                                    <div className="student-table-name">

                                                        <div className="student-avatar">
                                                            <i className="bi bi-person"></i>
                                                        </div>

                                                        <div>
                                                            <strong>
                                                                {getTeacherName(
                                                                    item.teacher
                                                                )}
                                                            </strong>

                                                            <small>
                                                                Teacher
                                                            </small>
                                                        </div>

                                                    </div>
                                                </td>

                                                <td>

                                                    <span
                                                        className={`status-badge ${getStatusClass(
                                                            item.status
                                                        )}`}
                                                    >
                                                        {item.status
                                                            ? item.status
                                                                  .charAt(
                                                                      0
                                                                  )
                                                                  .toUpperCase() +
                                                              item.status.slice(
                                                                  1
                                                              )
                                                            : '-'}
                                                    </span>

                                                </td>

                                                <td>
                                                    {item.remarks ||
                                                        '-'}
                                                </td>

                                                <td>

                                                    <div className="academic-actions">

                                                        <button
                                                            type="button"
                                                            className="academic-action-button edit"
                                                            onClick={() =>
                                                                openEditModal(
                                                                    item
                                                                )
                                                            }
                                                            title="Edit"
                                                        >
                                                            <i className="bi bi-pencil"></i>
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className="academic-action-button delete"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    item.id
                                                                )
                                                            }
                                                            title="Delete"
                                                        >
                                                            <i className="bi bi-trash"></i>
                                                        </button>

                                                    </div>

                                                </td>

                                            </tr>
                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>
                    )}

                </div>

            </div>

            {/* ADD / EDIT MODAL */}
            {showModal && (
                <div className="student-modal-overlay">

                    <div className="student-modal">

                        {/* MODAL HEADER */}
                        <div className="student-modal-header">

                            <div>

                                <p className="section-kicker">
                                    Teacher attendance
                                </p>

                                <h2>
                                    {editingAttendance
                                        ? 'Edit Attendance'
                                        : 'Add Attendance'}
                                </h2>

                            </div>

                            <button
                                type="button"
                                className="btn-close"
                                onClick={closeModal}
                            ></button>

                        </div>

                        {/* MODAL BODY */}
                        <div className="student-modal-body">

                            <form onSubmit={handleSubmit}>

                                <div className="student-form-grid">

                                    {/* DATE */}
                                    <div className="form-group">

                                        <label htmlFor="date">
                                            Date *
                                        </label>

                                        <input
                                            type="date"
                                            id="date"
                                            name="date"
                                            value={
                                                formData.date
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            className={
                                                errors.date
                                                    ? 'is-invalid'
                                                    : ''
                                            }
                                        />

                                        {fieldError(
                                            'date'
                                        )}

                                    </div>

                                    {/* TEACHER */}
                                    <div className="form-group">

                                        <label htmlFor="teacher">
                                            Teacher *
                                        </label>

                                        <select
                                            id="teacher"
                                            name="teacher"
                                            value={
                                                formData.teacher
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            className={
                                                errors.teacher
                                                    ? 'is-invalid'
                                                    : ''
                                            }
                                        >

                                            <option value="">
                                                Select Teacher
                                            </option>

                                            {teachers.map(
                                                (
                                                    teacher
                                                ) => (
                                                    <option
                                                        key={
                                                            teacher.id
                                                        }
                                                        value={
                                                            teacher.id ??
                                                            teacher.name
                                                        }
                                                    >
                                                        {
                                                            teacher.name
                                                        }
                                                    </option>
                                                )
                                            )}

                                        </select>

                                        {teachers.length ===
                                            0 && (
                                            <small className="text-muted">
                                                No teachers
                                                found. Add a
                                                teacher first
                                                from the
                                                Teachers
                                                section.
                                            </small>
                                        )}

                                        {fieldError(
                                            'teacher'
                                        )}

                                    </div>

                                    {/* STATUS */}
                                    <div className="form-group">

                                        <label htmlFor="status">
                                            Status *
                                        </label>

                                        <select
                                            id="status"
                                            name="status"
                                            value={
                                                formData.status
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            className={
                                                errors.status
                                                    ? 'is-invalid'
                                                    : ''
                                            }
                                        >

                                            <option value="">
                                                Select Status
                                            </option>

                                            <option value="present">
                                                Present
                                            </option>

                                            <option value="absent">
                                                Absent
                                            </option>

                                            <option value="late">
                                                Late
                                            </option>

                                            <option value="leave">
                                                Leave
                                            </option>

                                        </select>

                                        {fieldError(
                                            'status'
                                        )}

                                    </div>

                                    {/* REMARKS */}
                                    <div className="form-group">

                                        <label htmlFor="remarks">
                                            Remarks
                                        </label>

                                        <textarea
                                            id="remarks"
                                            name="remarks"
                                            value={
                                                formData.remarks
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            rows="4"
                                            placeholder="Enter remarks..."
                                        ></textarea>

                                        {fieldError(
                                            'remarks'
                                        )}

                                    </div>

                                </div>

                                {/* MODAL FOOTER */}
                                <div className="student-modal-footer">

                                    <button
                                        type="button"
                                        className="student-modal-cancel"
                                        onClick={closeModal}
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        className="student-modal-submit"
                                        disabled={saving}
                                    >

                                        {saving ? (
                                            <>
                                                <span
                                                    className="spinner-border spinner-border-sm me-2"
                                                    role="status"
                                                ></span>

                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-check-lg"></i>

                                                {editingAttendance
                                                    ? 'Update Attendance'
                                                    : 'Save Attendance'}
                                            </>
                                        )}

                                    </button>

                                </div>

                            </form>

                        </div>

                    </div>

                </div>
            )}

        </div>
    );
};

export default TeacherAttendance;

