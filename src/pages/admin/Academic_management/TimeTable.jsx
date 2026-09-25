
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

// API is intentionally disabled for frontend/static development.
// import api from '../../../services/api';

import { mockStorage } from '../../../services/mockData';

const initialForm = {
    academic_year: '',
    class_name: '',
    section: '',
    subject: '',
    teacher: '',
    day: '',
    start_time: '',
    end_time: '',
    room: '',
};

function TimeTable() {
    const [timeTables, setTimeTables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [editingTimeTable, setEditingTimeTable] = useState(null);

    const [search, setSearch] = useState('');

    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState({});

    // --------------------------------------------------
    // FETCH TIMETABLES
    // --------------------------------------------------

    const fetchTimeTables = async () => {
        setLoading(true);

        try {
            // API intentionally disabled.
            // const response = await api.get('/timetables');
            // setTimeTables(response.data);

            const data =
                typeof mockStorage.getTimeTables === 'function'
                    ? mockStorage.getTimeTables()
                    : [];

            setTimeTables(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error loading timetable:', error);

            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Unable to load timetable records.',
                confirmButtonColor: '#198754',
            });

            setTimeTables([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTimeTables();
    }, []);

    // --------------------------------------------------
    // FORM CHANGE
    // --------------------------------------------------

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));

        if (errors[name]) {
            setErrors((previous) => ({
                ...previous,
                [name]: '',
            }));
        }
    };

    // --------------------------------------------------
    // OPEN ADD MODAL
    // --------------------------------------------------

    const openAddModal = () => {
        setEditingTimeTable(null);
        setForm(initialForm);
        setErrors({});
        setShowModal(true);
    };

    // --------------------------------------------------
    // OPEN EDIT MODAL
    // --------------------------------------------------

    const openEditModal = (timeTable) => {
        setEditingTimeTable(timeTable);

        setForm({
            academic_year:
                timeTable.academic_year ||
                timeTable.academicYear ||
                '',

            class_name:
                timeTable.class_name ||
                timeTable.className ||
                '',

            section: timeTable.section || '',

            subject: timeTable.subject || '',

            teacher:
                timeTable.teacher ||
                timeTable.teacher_name ||
                '',

            day: timeTable.day || '',

            start_time:
                timeTable.start_time ||
                timeTable.startTime ||
                '',

            end_time:
                timeTable.end_time ||
                timeTable.endTime ||
                '',

            room: timeTable.room || '',
        });

        setErrors({});
        setShowModal(true);
    };

    // --------------------------------------------------
    // CLOSE MODAL
    // --------------------------------------------------

    const closeModal = () => {
        if (saving) return;

        setShowModal(false);
        setEditingTimeTable(null);
        setForm(initialForm);
        setErrors({});
    };

    // --------------------------------------------------
    // VALIDATION
    // --------------------------------------------------

    const validateForm = () => {
        const newErrors = {};

        if (!form.academic_year.trim()) {
            newErrors.academic_year = 'Academic Year is required.';
        }

        if (!form.class_name.trim()) {
            newErrors.class_name = 'Class is required.';
        }

        if (!form.section.trim()) {
            newErrors.section = 'Section is required.';
        }

        if (!form.subject.trim()) {
            newErrors.subject = 'Subject is required.';
        }

        if (!form.teacher.trim()) {
            newErrors.teacher = 'Teacher is required.';
        }

        if (!form.day.trim()) {
            newErrors.day = 'Day is required.';
        }

        if (!form.start_time) {
            newErrors.start_time = 'Start Time is required.';
        }

        if (!form.end_time) {
            newErrors.end_time = 'End Time is required.';
        }

        if (
            form.start_time &&
            form.end_time &&
            form.start_time >= form.end_time
        ) {
            newErrors.end_time =
                'End Time must be later than Start Time.';
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    // --------------------------------------------------
    // SUBMIT FORM
    // --------------------------------------------------

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateForm()) {
            Swal.fire({
                icon: 'warning',
                title: 'Required Fields',
                text: 'Please complete all required fields.',
                confirmButtonColor: '#198754',
            });

            return;
        }

        setSaving(true);

        try {
            const timetableData = {
                academic_year: form.academic_year.trim(),
                class_name: form.class_name.trim(),
                section: form.section.trim(),
                subject: form.subject.trim(),
                teacher: form.teacher.trim(),
                day: form.day,
                start_time: form.start_time,
                end_time: form.end_time,
                room: form.room.trim(),
            };

            // --------------------------------------------------
            // API IS INTENTIONALLY DISABLED
            // --------------------------------------------------

            /*
            if (editingTimeTable) {
                await api.put(
                    `/timetables/${editingTimeTable.id}`,
                    timetableData
                );
            } else {
                await api.post('/timetables', timetableData);
            }
            */

            // --------------------------------------------------
            // MOCK STORAGE
            // --------------------------------------------------

            if (editingTimeTable) {
                if (typeof mockStorage.updateTimeTable === 'function') {
                    mockStorage.updateTimeTable(
                        editingTimeTable.id,
                        timetableData
                    );
                }

                setTimeTables((previous) =>
                    previous.map((item) =>
                        item.id === editingTimeTable.id
                            ? {
                                  ...item,
                                  ...timetableData,
                              }
                            : item
                    )
                );

                Swal.fire({
                    icon: 'success',
                    title: 'Updated',
                    text: 'Timetable has been updated successfully.',
                    confirmButtonColor: '#198754',
                });
            } else {
                let newRecord = {
                    id: `TT-${Date.now()}`,
                    ...timetableData,
                };

                if (typeof mockStorage.addTimeTable === 'function') {
                    const result =
                        mockStorage.addTimeTable(timetableData);

                    if (result) {
                        newRecord = result;
                    }
                }

                setTimeTables((previous) => [
                    ...previous,
                    newRecord,
                ]);

                Swal.fire({
                    icon: 'success',
                    title: 'Added',
                    text: 'Timetable has been added successfully.',
                    confirmButtonColor: '#198754',
                });
            }

            closeModal();
        } catch (error) {
            console.error('Error saving timetable:', error);

            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Unable to save timetable record.',
                confirmButtonColor: '#198754',
            });
        } finally {
            setSaving(false);
        }
    };

    // --------------------------------------------------
    // DELETE TIMETABLE
    // --------------------------------------------------

    const handleDelete = async (timeTable) => {
        const result = await Swal.fire({
            icon: 'warning',
            title: 'Delete Timetable?',
            text: `Are you sure you want to delete the timetable for ${timeTable.subject || 'this subject'}?`,
            showCancelButton: true,
            confirmButtonText: 'Yes, Delete',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#6c757d',
        });

        if (!result.isConfirmed) {
            return;
        }

        try {
            // API intentionally disabled.
            // await api.delete(`/timetables/${timeTable.id}`);

            if (typeof mockStorage.deleteTimeTable === 'function') {
                mockStorage.deleteTimeTable(timeTable.id);
            }

            setTimeTables((previous) =>
                previous.filter(
                    (item) => item.id !== timeTable.id
                )
            );

            Swal.fire({
                icon: 'success',
                title: 'Deleted',
                text: 'Timetable has been deleted successfully.',
                confirmButtonColor: '#198754',
            });
        } catch (error) {
            console.error('Error deleting timetable:', error);

            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Unable to delete timetable record.',
                confirmButtonColor: '#198754',
            });
        }
    };

    // --------------------------------------------------
    // FIELD ERROR
    // --------------------------------------------------

    const fieldError = (fieldName) => {
        if (!errors[fieldName]) {
            return null;
        }

        return (
            <div
                className="text-danger"
                style={{
                    fontSize: '12px',
                    marginTop: '5px',
                }}
            >
                {errors[fieldName]}
            </div>
        );
    };

    // --------------------------------------------------
    // SEARCH
    // --------------------------------------------------

    const filteredTimeTables = timeTables.filter((item) => {
        const searchValue = search.toLowerCase();

        return (
            String(item.academic_year || '')
                .toLowerCase()
                .includes(searchValue) ||
            String(item.class_name || item.className || '')
                .toLowerCase()
                .includes(searchValue) ||
            String(item.section || '')
                .toLowerCase()
                .includes(searchValue) ||
            String(item.subject || '')
                .toLowerCase()
                .includes(searchValue) ||
            String(
                item.teacher || item.teacher_name || ''
            )
                .toLowerCase()
                .includes(searchValue) ||
            String(item.day || '')
                .toLowerCase()
                .includes(searchValue) ||
            String(item.room || '')
                .toLowerCase()
                .includes(searchValue)
        );
    });

    // --------------------------------------------------
    // UI
    // --------------------------------------------------

    return (
        <div className="academic-years-page">

            {/* PAGE HEADER */}
            <div className="academic-years-header">
                <div>
                    <p className="section-kicker">
                        Academic Management
                    </p>

                    <h1>Time Table</h1>

                    <p className="hero-copy">
                        Manage class schedules and timetable
                        information.
                    </p>
                </div>

                <button
                    type="button"
                    className="btn btn-primary academic-years-add"
                    onClick={openAddModal}
                >
                    <i className="bi bi-plus-lg me-2"></i>
                    Add Time Table
                </button>
            </div>

            {/* TABLE PANEL */}
            <div className="dashboard-panel academic-years-panel">

                {/* PANEL HEADER */}
                <div className="academic-years-panel-heading">
                    <div>
                        <p className="section-kicker">
                            Academic management
                        </p>

                        <h2>Time Table List</h2>
                    </div>

                    <div className="d-flex align-items-center gap-3">

                        {/* SEARCH */}
                        <div className="student-search">
                            <i className="bi bi-search"></i>

                            <input
                                type="text"
                                value={search}
                                onChange={(event) =>
                                    setSearch(
                                        event.target.value
                                    )
                                }
                                placeholder="Search timetable..."
                            />
                        </div>

                        <span className="panel-count">
                            {filteredTimeTables.length} records
                        </span>
                    </div>
                </div>

                {/* TABLE */}
                <div className="academic-years-table-wrap">

                    {loading ? (
                        <div
                            className="d-flex justify-content-center align-items-center"
                            style={{
                                minHeight: '250px',
                            }}
                        >
                            <div
                                className="spinner-border text-success"
                                role="status"
                            >
                                <span className="visually-hidden">
                                    Loading...
                                </span>
                            </div>
                        </div>
                    ) : filteredTimeTables.length === 0 ? (
                        <div
                            className="text-center py-5"
                            style={{
                                minHeight: '250px',
                            }}
                        >
                            <div
                                style={{
                                    fontSize: '42px',
                                    marginBottom: '15px',
                                    opacity: 0.6,
                                }}
                            >
                                <i className="bi bi-calendar3"></i>
                            </div>

                            <h4>
                                No timetable records found
                            </h4>

                            <p className="text-muted">
                                Add a timetable record to get
                                started.
                            </p>

                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={openAddModal}
                            >
                                <i className="bi bi-plus-lg me-2"></i>
                                Add Time Table
                            </button>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="academic-years-table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Academic Year</th>
                                        <th>Class</th>
                                        <th>Section</th>
                                        <th>Subject</th>
                                        <th>Teacher</th>
                                        <th>Day</th>
                                        <th>Start Time</th>
                                        <th>End Time</th>
                                        <th>Room</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {filteredTimeTables.map(
                                        (item, index) => (
                                            <tr
                                                key={
                                                    item.id ||
                                                    index
                                                }
                                            >
                                                <td className="academic-years-index">
                                                    {index + 1}
                                                </td>

                                                <td>
                                                    {item.academic_year ||
                                                        '-'}
                                                </td>

                                                <td>
                                                    {item.class_name ||
                                                        item.className ||
                                                        '-'}
                                                </td>

                                                <td>
                                                    {item.section ||
                                                        '-'}
                                                </td>

                                                <td>
                                                    <strong>
                                                        {item.subject ||
                                                            '-'}
                                                    </strong>
                                                </td>

                                                <td>
                                                    {item.teacher ||
                                                        item.teacher_name ||
                                                        '-'}
                                                </td>

                                                <td>
                                                    {item.day ||
                                                        '-'}
                                                </td>

                                                <td>
                                                    {item.start_time ||
                                                        item.startTime ||
                                                        '-'}
                                                </td>

                                                <td>
                                                    {item.end_time ||
                                                        item.endTime ||
                                                        '-'}
                                                </td>

                                                <td>
                                                    {item.room ||
                                                        '-'}
                                                </td>

                                                <td>
                                                    <div className="academic-actions">

                                                        {/* EDIT */}
                                                        <button
                                                            type="button"
                                                            className="academic-action-button edit"
                                                            title="Edit"
                                                            onClick={() =>
                                                                openEditModal(
                                                                    item
                                                                )
                                                            }
                                                        >
                                                            <i className="bi bi-pencil"></i>
                                                        </button>

                                                        {/* DELETE */}
                                                        <button
                                                            type="button"
                                                            className="academic-action-button delete"
                                                            title="Delete"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    item
                                                                )
                                                            }
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
                                <span className="section-kicker">
                                    Time Table
                                </span>

                                <h3>
                                    {editingTimeTable
                                        ? 'Edit Time Table'
                                        : 'Add Time Table'}
                                </h3>

                                <p>
                                    {editingTimeTable
                                        ? 'Update timetable information.'
                                        : 'Enter timetable information.'}
                                </p>
                            </div>

                            <button
                                type="button"
                                className="student-modal-close"
                                onClick={closeModal}
                            >
                                ×
                            </button>

                        </div>

                        {/* MODAL BODY */}
                        <div className="student-modal-body">

                            <form onSubmit={handleSubmit}>

                                <div className="student-form-grid">

                                    {/* ACADEMIC YEAR */}
                                    <div className="form-group">

                                        <label>
                                            Academic Year *
                                        </label>

                                        <input
                                            type="text"
                                            name="academic_year"
                                            value={
                                                form.academic_year
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="e.g. 2025-2026"
                                            className={
                                                errors.academic_year
                                                    ? 'is-invalid'
                                                    : ''
                                            }
                                        />

                                        {fieldError(
                                            'academic_year'
                                        )}

                                    </div>

                                    {/* CLASS */}
                                    <div className="form-group">

                                        <label>
                                            Class *
                                        </label>

                                        <input
                                            type="text"
                                            name="class_name"
                                            value={
                                                form.class_name
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="e.g. Class 10"
                                            className={
                                                errors.class_name
                                                    ? 'is-invalid'
                                                    : ''
                                            }
                                        />

                                        {fieldError(
                                            'class_name'
                                        )}

                                    </div>

                                    {/* SECTION */}
                                    <div className="form-group">

                                        <label>
                                            Section *
                                        </label>

                                        <input
                                            type="text"
                                            name="section"
                                            value={
                                                form.section
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="e.g. A"
                                            className={
                                                errors.section
                                                    ? 'is-invalid'
                                                    : ''
                                            }
                                        />

                                        {fieldError(
                                            'section'
                                        )}

                                    </div>

                                    {/* SUBJECT */}
                                    <div className="form-group">

                                        <label>
                                            Subject *
                                        </label>

                                        <input
                                            type="text"
                                            name="subject"
                                            value={
                                                form.subject
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="e.g. Mathematics"
                                            className={
                                                errors.subject
                                                    ? 'is-invalid'
                                                    : ''
                                            }
                                        />

                                        {fieldError(
                                            'subject'
                                        )}

                                    </div>

                                    {/* TEACHER */}
                                    <div className="form-group">

                                        <label>
                                            Teacher *
                                        </label>

                                        <input
                                            type="text"
                                            name="teacher"
                                            value={
                                                form.teacher
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Enter teacher name"
                                            className={
                                                errors.teacher
                                                    ? 'is-invalid'
                                                    : ''
                                            }
                                        />

                                        {fieldError(
                                            'teacher'
                                        )}

                                    </div>

                                    {/* DAY */}
                                    <div className="form-group">

                                        <label>
                                            Day *
                                        </label>

                                        <select
                                            name="day"
                                            value={
                                                form.day
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            className={
                                                errors.day
                                                    ? 'is-invalid'
                                                    : ''
                                            }
                                        >
                                            <option value="">
                                                Select Day
                                            </option>

                                            <option value="Monday">
                                                Monday
                                            </option>

                                            <option value="Tuesday">
                                                Tuesday
                                            </option>

                                            <option value="Wednesday">
                                                Wednesday
                                            </option>

                                            <option value="Thursday">
                                                Thursday
                                            </option>

                                            <option value="Friday">
                                                Friday
                                            </option>

                                            <option value="Saturday">
                                                Saturday
                                            </option>

                                            <option value="Sunday">
                                                Sunday
                                            </option>
                                        </select>

                                        {fieldError(
                                            'day'
                                        )}

                                    </div>

                                    {/* START TIME */}
                                    <div className="form-group">

                                        <label>
                                            Start Time *
                                        </label>

                                        <input
                                            type="time"
                                            name="start_time"
                                            value={
                                                form.start_time
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            className={
                                                errors.start_time
                                                    ? 'is-invalid'
                                                    : ''
                                            }
                                        />

                                        {fieldError(
                                            'start_time'
                                        )}

                                    </div>

                                    {/* END TIME */}
                                    <div className="form-group">

                                        <label>
                                            End Time *
                                        </label>

                                        <input
                                            type="time"
                                            name="end_time"
                                            value={
                                                form.end_time
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            className={
                                                errors.end_time
                                                    ? 'is-invalid'
                                                    : ''
                                            }
                                        />

                                        {fieldError(
                                            'end_time'
                                        )}

                                    </div>

                                    {/* ROOM */}
                                    <div className="form-group">

                                        <label>
                                            Room
                                        </label>

                                        <input
                                            type="text"
                                            name="room"
                                            value={
                                                form.room
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="e.g. Room 101"
                                        />

                                    </div>

                                </div>

                                {/* MODAL FOOTER */}
                                <div className="student-modal-footer">

                                    <button
                                        type="button"
                                        className="student-modal-cancel"
                                        onClick={closeModal}
                                        disabled={saving}
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
                                                <i className="bi bi-check-lg me-2"></i>

                                                {editingTimeTable
                                                    ? 'Update Time Table'
                                                    : 'Save Time Table'}
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
}

export default TimeTable;