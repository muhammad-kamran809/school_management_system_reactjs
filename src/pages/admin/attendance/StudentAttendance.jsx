
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

// API will be connected later by backend developer
// import api from '../../../services/api';

import { mockStorage } from '../../../services/mockData';

const initialForm = {
    date: '',
    class_name: '',
    section: '',
};

const StudentAttendance = () => {
    const [attendance, setAttendance] = useState([]);
    const [classes, setClasses] = useState([]);
    const [sections, setSections] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [editingAttendance, setEditingAttendance] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState(initialForm);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetchAttendance();
        fetchClasses();
        fetchSections();
    }, []);

    // =========================================================
    // FETCH ATTENDANCE
    // =========================================================

    const fetchAttendance = async () => {
        try {
            setLoading(true);

            // API will be connected later
            // const response = await api.get('/student-attendance');
            // setAttendance(response.data);

            let data = [];

            if (
                mockStorage &&
                typeof mockStorage.getStudentAttendance === 'function'
            ) {
                data = mockStorage.getStudentAttendance() || [];
            } else {
                const storedData = localStorage.getItem(
                    'sms_student_attendance'
                );

                data = storedData ? JSON.parse(storedData) : [];
            }

            setAttendance(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching attendance:', error);

            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to load student attendance.',
            });

            setAttendance([]);
        } finally {
            setLoading(false);
        }
    };

    // =========================================================
    // FETCH CLASSES
    // =========================================================

    const fetchClasses = async () => {
        try {
            let data = [];

            if (
                mockStorage &&
                typeof mockStorage.getClasses === 'function'
            ) {
                data = mockStorage.getClasses() || [];
            } else {
                const storedData = localStorage.getItem('sms_classes');

                data = storedData ? JSON.parse(storedData) : [];
            }

            setClasses(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching classes:', error);
            setClasses([]);
        }
    };

    // =========================================================
    // FETCH SECTIONS
    // =========================================================

    const fetchSections = async () => {
        try {
            let data = [];

            if (
                mockStorage &&
                typeof mockStorage.getSections === 'function'
            ) {
                data = mockStorage.getSections() || [];
            } else {
                const storedData = localStorage.getItem('sms_sections');

                data = storedData ? JSON.parse(storedData) : [];
            }

            setSections(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching sections:', error);
            setSections([]);
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
    };

    // =========================================================
    // OPEN EDIT MODAL
    // =========================================================

    const openEditModal = (item) => {
        setEditingAttendance(item);

        setFormData({
            date: item.date || '',
            class_name: item.class_name || item.className || '',
            section: item.section || '',
        });

        setErrors({});
        setShowModal(true);
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

        if (!formData.class_name) {
            newErrors.class_name = 'Class is required.';
        }

        if (!formData.section) {
            newErrors.section = 'Section is required.';
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
            //         `/student-attendance/${editingAttendance.id}`,
            //         formData
            //     );
            // } else {
            //     await api.post('/student-attendance', formData);
            // }

            const newAttendance = {
                ...formData,
                id: editingAttendance?.id || Date.now(),
            };

            let updatedAttendance = [];

            if (editingAttendance) {
                updatedAttendance = attendance.map((item) =>
                    item.id === editingAttendance.id
                        ? newAttendance
                        : item
                );

                if (
                    mockStorage &&
                    typeof mockStorage.updateStudentAttendance ===
                        'function'
                ) {
                    mockStorage.updateStudentAttendance(
                        editingAttendance.id,
                        newAttendance
                    );
                }
            } else {
                updatedAttendance = [...attendance, newAttendance];

                if (
                    mockStorage &&
                    typeof mockStorage.addStudentAttendance ===
                        'function'
                ) {
                    mockStorage.addStudentAttendance(newAttendance);
                }
            }

            localStorage.setItem(
                'sms_student_attendance',
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
                    ? 'Student attendance has been updated successfully.'
                    : 'Student attendance has been added successfully.',
                timer: 1800,
                showConfirmButton: false,
            });
        } catch (error) {
            console.error('Error saving attendance:', error);
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
            // await api.delete(`/student-attendance/${id}`);

            if (
                mockStorage &&
                typeof mockStorage.deleteStudentAttendance ===
                    'function'
            ) {
                mockStorage.deleteStudentAttendance(id);
            }

            const updatedAttendance = attendance.filter(
                (item) => item.id !== id
            );

            localStorage.setItem(
                'sms_student_attendance',
                JSON.stringify(updatedAttendance)
            );

            setAttendance(updatedAttendance);

            Swal.fire({
                icon: 'success',
                title: 'Deleted',
                text: 'Attendance record has been deleted successfully.',
                timer: 1500,
                showConfirmButton: false,
            });
        } catch (error) {
            console.error('Error deleting attendance:', error);
            handleApiError(error);
        }
    };

    // =========================================================
    // GET CLASS NAME
    // =========================================================

    const getClassName = (classValue) => {
        const foundClass = classes.find(
            (item) =>
                String(item.id) === String(classValue) ||
                String(item.name) === String(classValue)
        );

        return foundClass?.name || classValue || '-';
    };

    // =========================================================
    // GET SECTION NAME
    // =========================================================

    const getSectionName = (sectionValue) => {
        const foundSection = sections.find(
            (item) =>
                String(item.id) === String(sectionValue) ||
                String(item.name) === String(sectionValue)
        );

        return foundSection?.name || sectionValue || '-';
    };

    // =========================================================
    // SEARCH
    // =========================================================

    const filteredAttendance = attendance.filter((item) => {
        const search = searchTerm.toLowerCase();

        return (
            String(item.date || '')
                .toLowerCase()
                .includes(search) ||
            String(getClassName(item.class_name || item.className))
                .toLowerCase()
                .includes(search) ||
            String(getSectionName(item.section))
                .toLowerCase()
                .includes(search)
        );
    });

    // =========================================================
    // FIELD ERROR
    // =========================================================

    const fieldError = (fieldName) => {
        return errors[fieldName] ? (
            <small className="text-danger">{errors[fieldName]}</small>
        ) : null;
    };

    // =========================================================
    // UI
    // =========================================================

    return (
        <div className="academic-years-page">

            {/* PAGE HEADER */}
            <div className="academic-years-header">
                <div>
                    <p className="section-kicker">Students</p>

                    <h1>Student Attendance</h1>

                    <p className="hero-copy">
                        Manage student attendance records and information.
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
                            Student management
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
                                    setSearchTerm(e.target.value)
                                }
                            />
                        </div>

                        <span className="panel-count">
                            {filteredAttendance.length} records
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

                            <p>Loading attendance...</p>
                        </div>
                    ) : filteredAttendance.length === 0 ? (
                        <div className="academic-years-empty">
                            <i className="bi bi-calendar-check"></i>

                            <h3>No attendance records found</h3>

                            <p>
                                Add a student attendance record to get
                                started.
                            </p>
                        </div>
                    ) : (
                        <div className="table-responsive">

                            <table className="table academic-years-table">

                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Date</th>
                                        <th>Class</th>
                                        <th>Section</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {filteredAttendance.map(
                                        (item, index) => (
                                            <tr key={item.id}>

                                                <td>
                                                    <span className="academic-years-index">
                                                        {index + 1}
                                                    </span>
                                                </td>

                                                <td>
                                                    <div className="student-table-name">
                                                        <div className="student-avatar">
                                                            <i className="bi bi-calendar-event"></i>
                                                        </div>

                                                        <div>
                                                            <strong>
                                                                {item.date ||
                                                                    '-'}
                                                            </strong>

                                                            <small>
                                                                Attendance
                                                            </small>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td>
                                                    {getClassName(
                                                        item.class_name ||
                                                            item.className
                                                    )}
                                                </td>

                                                <td>
                                                    {getSectionName(
                                                        item.section
                                                    )}
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
                                    Student attendance
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
                                            value={formData.date}
                                            onChange={handleChange}
                                            className={
                                                errors.date
                                                    ? 'is-invalid'
                                                    : ''
                                            }
                                        />

                                        {fieldError('date')}

                                    </div>

                                    {/* CLASS */}
                                    <div className="form-group">

                                        <label htmlFor="class_name">
                                            Class *
                                        </label>

                                        <select
                                            id="class_name"
                                            name="class_name"
                                            value={formData.class_name}
                                            onChange={handleChange}
                                            className={
                                                errors.class_name
                                                    ? 'is-invalid'
                                                    : ''
                                            }
                                        >

                                            <option value="">
                                                Select Class
                                            </option>

                                            {classes.map((item) => (
                                                <option
                                                    key={item.id}
                                                    value={
                                                        item.id ??
                                                        item.name
                                                    }
                                                >
                                                    {item.name}
                                                </option>
                                            ))}

                                        </select>

                                        {fieldError('class_name')}

                                    </div>

                                    {/* SECTION */}
                                    <div className="form-group">

                                        <label htmlFor="section">
                                            Section *
                                        </label>

                                        <select
                                            id="section"
                                            name="section"
                                            value={formData.section}
                                            onChange={handleChange}
                                            className={
                                                errors.section
                                                    ? 'is-invalid'
                                                    : ''
                                            }
                                        >

                                            <option value="">
                                                Select Section
                                            </option>

                                            {sections.map((item) => (
                                                <option
                                                    key={item.id}
                                                    value={
                                                        item.id ??
                                                        item.name
                                                    }
                                                >
                                                    {item.name}
                                                </option>
                                            ))}

                                        </select>

                                        {fieldError('section')}

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

export default StudentAttendance;

