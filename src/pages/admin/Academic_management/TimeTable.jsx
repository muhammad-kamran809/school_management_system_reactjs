
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

// API is intentionally disabled for frontend/static development.
// import api from '../../../services/api';

import { mockStorage } from '../../../services/mockData';

// ==================================================
// INITIAL FORM
// ==================================================

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

// ==================================================
// DEMO / RANDOM DATA
// ==================================================

const demoTimeTables = [
    {
        id: 'TT-001',
        academic_year: '2025-2026',
        class_name: 'Class 6',
        section: 'A',
        subject: 'Mathematics',
        teacher: 'Ahmed Khan',
        day: 'Monday',
        start_time: '08:00',
        end_time: '08:45',
        room: 'Room 101',
    },
    {
        id: 'TT-002',
        academic_year: '2025-2026',
        class_name: 'Class 7',
        section: 'B',
        subject: 'English',
        teacher: 'Sarah Ahmed',
        day: 'Monday',
        start_time: '08:45',
        end_time: '09:30',
        room: 'Room 102',
    },
    {
        id: 'TT-003',
        academic_year: '2025-2026',
        class_name: 'Class 8',
        section: 'A',
        subject: 'Computer Science',
        teacher: 'Muhammad Ali',
        day: 'Tuesday',
        start_time: '09:00',
        end_time: '09:45',
        room: 'Lab 1',
    },
    {
        id: 'TT-004',
        academic_year: '2025-2026',
        class_name: 'Class 9',
        section: 'C',
        subject: 'Physics',
        teacher: 'Ayesha Malik',
        day: 'Tuesday',
        start_time: '10:00',
        end_time: '10:45',
        room: 'Physics Lab',
    },
    {
        id: 'TT-005',
        academic_year: '2025-2026',
        class_name: 'Class 10',
        section: 'A',
        subject: 'Chemistry',
        teacher: 'Hassan Raza',
        day: 'Wednesday',
        start_time: '08:00',
        end_time: '08:45',
        room: 'Chemistry Lab',
    },
    {
        id: 'TT-006',
        academic_year: '2025-2026',
        class_name: 'Class 5',
        section: 'B',
        subject: 'Urdu',
        teacher: 'Fatima Noor',
        day: 'Wednesday',
        start_time: '09:00',
        end_time: '09:45',
        room: 'Room 105',
    },
    {
        id: 'TT-007',
        academic_year: '2025-2026',
        class_name: 'Class 8',
        section: 'C',
        subject: 'Biology',
        teacher: 'Usman Tariq',
        day: 'Thursday',
        start_time: '10:00',
        end_time: '10:45',
        room: 'Biology Lab',
    },
    {
        id: 'TT-008',
        academic_year: '2025-2026',
        class_name: 'Class 7',
        section: 'A',
        subject: 'General Science',
        teacher: 'Mariam Iqbal',
        day: 'Friday',
        start_time: '11:00',
        end_time: '11:45',
        room: 'Room 107',
    },
];

// ==================================================
// COMPONENT
// ==================================================

function TimeTable() {
    const [timeTables, setTimeTables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const [showModal, setShowModal] = useState(false);
    const [editingTimeTable, setEditingTimeTable] = useState(null);

    const [search, setSearch] = useState('');

    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState({});

    // ==================================================
    // FETCH TIMETABLES
    // ==================================================

    const fetchTimeTables = async () => {
        setLoading(true);

        try {
            // API intentionally disabled.
            // const response = await api.get('/timetables');
            // setTimeTables(response.data);

            let data = [];

            if (
                typeof mockStorage.getTimeTables ===
                'function'
            ) {
                data = mockStorage.getTimeTables();
            }

            // ==================================================
            // DEMO DATA
            // ==================================================

            if (!Array.isArray(data) || data.length === 0) {
                data = demoTimeTables.map((item) => ({
                    ...item,
                }));
            }

            setTimeTables(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(
                'Error loading timetables:',
                error
            );

            // If storage fails, still show demo records
            setTimeTables(
                demoTimeTables.map((item) => ({
                    ...item,
                }))
            );

            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Unable to load timetable records.',
                confirmButtonColor: '#198754',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchTimeTables();
    }, []);

    // ==================================================
    // HANDLE INPUT CHANGE
    // ==================================================

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

    // ==================================================
    // OPEN ADD MODAL
    // ==================================================

    const openAddModal = () => {
        if (deletingId !== null) return;

        setEditingTimeTable(null);
        setForm({ ...initialForm });
        setErrors({});
        setShowModal(true);
    };

    // ==================================================
    // OPEN EDIT MODAL
    // ==================================================

    const openEditModal = (timeTable) => {
        if (deletingId !== null) return;

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

            section:
                timeTable.section ||
                '',

            subject:
                timeTable.subject ||
                '',

            teacher:
                timeTable.teacher ||
                timeTable.teacher_name ||
                '',

            day:
                timeTable.day ||
                '',

            start_time:
                timeTable.start_time ||
                timeTable.startTime ||
                '',

            end_time:
                timeTable.end_time ||
                timeTable.endTime ||
                '',

            room:
                timeTable.room ||
                '',
        });

        setErrors({});
        setShowModal(true);
    };

    // ==================================================
    // CLOSE MODAL
    // ==================================================

    const closeModal = () => {
        if (saving) return;

        setShowModal(false);
        setEditingTimeTable(null);
        setForm({ ...initialForm });
        setErrors({});
    };

    // ==================================================
    // VALIDATE FORM
    // ==================================================

    const validateForm = () => {
        const newErrors = {};

        if (!form.academic_year.trim()) {
            newErrors.academic_year =
                'Academic Year is required.';
        }

        if (!form.class_name.trim()) {
            newErrors.class_name =
                'Class is required.';
        }

        if (!form.section.trim()) {
            newErrors.section =
                'Section is required.';
        }

        if (!form.subject.trim()) {
            newErrors.subject =
                'Subject is required.';
        }

        if (!form.teacher.trim()) {
            newErrors.teacher =
                'Teacher is required.';
        }

        if (!form.day.trim()) {
            newErrors.day =
                'Day is required.';
        }

        if (!form.start_time.trim()) {
            newErrors.start_time =
                'Start Time is required.';
        }

        if (!form.end_time.trim()) {
            newErrors.end_time =
                'End Time is required.';
        }

        if (!form.room.trim()) {
            newErrors.room =
                'Room is required.';
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    // ==================================================
    // SUBMIT FORM
    // ==================================================

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (saving || deletingId !== null) return;

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
            const timeTableData = {
                academic_year:
                    form.academic_year.trim(),

                class_name:
                    form.class_name.trim(),

                section:
                    form.section.trim(),

                subject:
                    form.subject.trim(),

                teacher:
                    form.teacher.trim(),

                day:
                    form.day.trim(),

                start_time:
                    form.start_time.trim(),

                end_time:
                    form.end_time.trim(),

                room:
                    form.room.trim(),
            };

            // ==================================================
            // UPDATE
            // ==================================================

            if (editingTimeTable) {
                if (
                    typeof mockStorage.updateTimeTable ===
                    'function'
                ) {
                    mockStorage.updateTimeTable(
                        editingTimeTable.id,
                        timeTableData
                    );
                }

                setTimeTables((previous) =>
                    previous.map((item) =>
                        item.id === editingTimeTable.id
                            ? {
                                  ...item,
                                  ...timeTableData,
                              }
                            : item
                    )
                );

                closeModal();

                await Swal.fire({
                    icon: 'success',
                    title: 'Updated',
                    text: 'Timetable has been updated successfully.',
                    confirmButtonColor: '#198754',
                });
            }

            // ==================================================
            // ADD
            // ==================================================

            else {
                let newRecord = {
                    id: `TT-${Date.now()}`,
                    ...timeTableData,
                };

                if (
                    typeof mockStorage.addTimeTable ===
                    'function'
                ) {
                    const result =
                        mockStorage.addTimeTable(
                            timeTableData
                        );

                    if (result) {
                        newRecord = result;
                    }
                }

                setTimeTables((previous) => [
                    ...previous,
                    newRecord,
                ]);

                closeModal();

                await Swal.fire({
                    icon: 'success',
                    title: 'Added',
                    text: 'Timetable has been added successfully.',
                    confirmButtonColor: '#198754',
                });
            }
        } catch (error) {
            console.error(
                'Error saving timetable:',
                error
            );

            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Unable to save timetable.',
                confirmButtonColor: '#198754',
            });
        } finally {
            setSaving(false);
        }
    };

    // ==================================================
    // DELETE TIMETABLE
    // ==================================================

    const handleDelete = async (timeTable) => {
        if (deletingId !== null) return;

        const subjectName =
            timeTable.subject ||
            'this timetable';

        const result = await Swal.fire({
            icon: 'warning',
            title: 'Delete Timetable?',
            text: `Are you sure you want to delete the timetable for ${subjectName}?`,
            showCancelButton: true,
            confirmButtonText: 'Yes, Delete',
            cancelButtonText: 'Cancel',
            reverseButtons: true,
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#6c757d',
        });

        if (!result.isConfirmed) {
            return;
        }

        try {
            setDeletingId(timeTable.id);

            if (
                typeof mockStorage.deleteTimeTable ===
                'function'
            ) {
                mockStorage.deleteTimeTable(
                    timeTable.id
                );
            }

            setTimeTables((previous) =>
                previous.filter(
                    (item) =>
                        item.id !== timeTable.id
                )
            );

            await Swal.fire({
                icon: 'success',
                title: 'Deleted',
                text: 'Timetable has been deleted successfully.',
                confirmButtonColor: '#198754',
            });
        } catch (error) {
            console.error(
                'Error deleting timetable:',
                error
            );

            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Unable to delete timetable.',
                confirmButtonColor: '#198754',
            });
        } finally {
            setDeletingId(null);
        }
    };

    // ==================================================
    // FIELD ERROR
    // ==================================================

    const fieldError = (fieldName) => {
        if (!errors[fieldName]) {
            return null;
        }

        return (
            <div className="text-danger small mt-1">
                {errors[fieldName]}
            </div>
        );
    };

    // ==================================================
    // SEARCH
    // ==================================================

    const filteredTimeTables = timeTables.filter(
        (timeTable) => {
            const searchValue = search
                .toLowerCase()
                .trim();

            return (
                String(
                    timeTable.academic_year ||
                        timeTable.academicYear ||
                        ''
                )
                    .toLowerCase()
                    .includes(searchValue) ||

                String(
                    timeTable.class_name ||
                        timeTable.className ||
                        ''
                )
                    .toLowerCase()
                    .includes(searchValue) ||

                String(
                    timeTable.section ||
                        ''
                )
                    .toLowerCase()
                    .includes(searchValue) ||

                String(
                    timeTable.subject ||
                        ''
                )
                    .toLowerCase()
                    .includes(searchValue) ||

                String(
                    timeTable.teacher ||
                        timeTable.teacher_name ||
                        ''
                )
                    .toLowerCase()
                    .includes(searchValue) ||

                String(
                    timeTable.day ||
                        ''
                )
                    .toLowerCase()
                    .includes(searchValue) ||

                String(
                    timeTable.room ||
                        ''
                )
                    .toLowerCase()
                    .includes(searchValue)
            );
        }
    );

    // ==================================================
    // UI
    // ==================================================

    return (
        <div className="academic-years-page timetable-page">

            {/* ==================================================
                PAGE HEADER
            ================================================== */}

            <div className="academic-years-header">
                <div>
                    <p className="section-kicker">
                        Academic
                    </p>

                    <h1>Time Table</h1>

                    <p className="hero-copy">
                        Manage class timetable records
                        and schedules.
                    </p>
                </div>

                <button
                    type="button"
                    className="btn btn-primary academic-years-add"
                    onClick={openAddModal}
                    disabled={deletingId !== null}
                >
                    <i
                        className="bi bi-plus-lg"
                        aria-hidden="true"
                    ></i>
                    Add Time Table
                </button>
            </div>

            {/* ==================================================
                MAIN PANEL
            ================================================== */}

            <div className="dashboard-panel academic-years-panel">

                {/* PANEL HEADER */}

                <div className="academic-years-panel-heading">
                    <div>
                        <p className="section-kicker">
                            Academic management
                        </p>

                        <h2>
                            Time Table List
                        </h2>
                    </div>

                    <div className="d-flex align-items-center gap-3">

                        {/* SEARCH */}

                        <div className="student-search">
                            <i
                                className="bi bi-search"
                                aria-hidden="true"
                            ></i>

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
                            {filteredTimeTables.length}{' '}
                            records
                        </span>
                    </div>
                </div>

                {/* ==================================================
                    TABLE
                ================================================== */}

                <div className="academic-years-table-wrap">

                    {loading ? (
                        <div className="academic-years-empty">

                            <div
                                className="spinner-border spinner-border-sm text-primary"
                                role="status"
                            >
                                <span className="visually-hidden">
                                    Loading...
                                </span>
                            </div>

                            <p>
                                Loading timetables...
                            </p>
                        </div>
                    ) : filteredTimeTables.length === 0 ? (
                        <div className="academic-years-empty">

                            <i
                                className="bi bi-calendar3"
                                aria-hidden="true"
                            ></i>

                            <h3>
                                {search
                                    ? 'No timetables found'
                                    : 'No timetables yet'}
                            </h3>

                            <p>
                                {search
                                    ? 'Try a different search.'
                                    : 'Add your first timetable to get started.'}
                            </p>

                            {!search && (
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={
                                        openAddModal
                                    }
                                    disabled={
                                        deletingId !==
                                        null
                                    }
                                >
                                    <i className="bi bi-plus-lg me-2"></i>
                                    Add Time Table
                                </button>
                            )}
                        </div>
                    ) : (
                        <div
                            className="table-responsive"
                            style={{
                                width: '100%',
                            }}
                        >
                            <table
                                className="academic-years-table"
                                style={{
                                    width: '100%',
                                    minWidth: '100%',
                                    tableLayout: 'auto',
                                }}
                            >
                                <thead>
                                    <tr>

                                        <th
                                            style={{
                                                width: '60px',
                                                minWidth: '60px',
                                            }}
                                        >
                                            #
                                        </th>

                                        <th
                                            style={{
                                                minWidth: '160px',
                                            }}
                                        >
                                            Academic Year
                                        </th>

                                        <th
                                            style={{
                                                minWidth: '130px',
                                            }}
                                        >
                                            Class
                                        </th>

                                        <th
                                            style={{
                                                minWidth: '100px',
                                            }}
                                        >
                                            Section
                                        </th>

                                        <th
                                            style={{
                                                minWidth: '180px',
                                            }}
                                        >
                                            Subject
                                        </th>

                                        <th
                                            style={{
                                                minWidth: '180px',
                                            }}
                                        >
                                            Teacher
                                        </th>

                                        <th
                                            style={{
                                                minWidth: '130px',
                                            }}
                                        >
                                            Day
                                        </th>

                                        <th
                                            style={{
                                                minWidth: '150px',
                                            }}
                                        >
                                            Time
                                        </th>

                                        <th
                                            style={{
                                                minWidth: '130px',
                                            }}
                                        >
                                            Room
                                        </th>

                                        <th
                                            style={{
                                                width: '120px',
                                                minWidth: '120px',
                                                textAlign:
                                                    'right',
                                            }}
                                        >
                                            Actions
                                        </th>

                                    </tr>
                                </thead>

                                <tbody>
                                    {filteredTimeTables.map(
                                        (
                                            timeTable,
                                            index
                                        ) => {
                                            const isDeleting =
                                                deletingId ===
                                                timeTable.id;

                                            return (
                                                <tr
                                                    key={
                                                        timeTable.id ||
                                                        index
                                                    }
                                                    style={
                                                        isDeleting
                                                            ? {
                                                                  opacity: 0.6,
                                                              }
                                                            : undefined
                                                    }
                                                >

                                                    {/* NUMBER */}

                                                    <td>
                                                        <span className="academic-years-index">
                                                            {String(
                                                                index +
                                                                    1
                                                            ).padStart(
                                                                2,
                                                                '0'
                                                            )}
                                                        </span>
                                                    </td>

                                                    {/* ACADEMIC YEAR */}

                                                    <td>
                                                        {timeTable.academic_year ||
                                                            timeTable.academicYear ||
                                                            '-'}
                                                    </td>

                                                    {/* CLASS */}

                                                    <td>
                                                        {timeTable.class_name ||
                                                            timeTable.className ||
                                                            '-'}
                                                    </td>

                                                    {/* SECTION */}

                                                    <td>
                                                        {timeTable.section ||
                                                            '-'}
                                                    </td>

                                                    {/* SUBJECT */}

                                                    <td>
                                                        <div className="student-table-name">

                                                            <div className="student-avatar">
                                                                <i className="bi bi-book"></i>
                                                            </div>

                                                            <div>
                                                                <div className="fw-semibold">
                                                                    {timeTable.subject ||
                                                                        '-'}
                                                                </div>

                                                                <div className="text-muted small">
                                                                    Subject
                                                                </div>
                                                            </div>

                                                        </div>
                                                    </td>

                                                    {/* TEACHER */}

                                                    <td>
                                                        <div className="fw-semibold">
                                                            {timeTable.teacher ||
                                                                timeTable.teacher_name ||
                                                                '-'}
                                                        </div>
                                                    </td>

                                                    {/* DAY */}

                                                    <td>
                                                        <span className="fw-semibold">
                                                            {timeTable.day ||
                                                                '-'}
                                                        </span>
                                                    </td>

                                                    {/* TIME */}

                                                    <td>
                                                        <span className="fw-semibold">
                                                            {timeTable.start_time ||
                                                                timeTable.startTime ||
                                                                '-'}
                                                            {' - '}
                                                            {timeTable.end_time ||
                                                                timeTable.endTime ||
                                                                '-'}
                                                        </span>
                                                    </td>

                                                    {/* ROOM */}

                                                    <td>
                                                        {timeTable.room ||
                                                            '-'}
                                                    </td>

                                                    {/* ACTIONS */}

                                                    <td>
                                                        <div className="academic-actions">

                                                            {/* EDIT */}

                                                            <button
                                                                type="button"
                                                                className="academic-action-button edit"
                                                                title="Edit timetable"
                                                                onClick={() =>
                                                                    openEditModal(
                                                                        timeTable
                                                                    )
                                                                }
                                                                disabled={
                                                                    deletingId !==
                                                                    null
                                                                }
                                                            >
                                                                <i className="bi bi-pencil"></i>
                                                            </button>

                                                            {/* DELETE */}

                                                            <button
                                                                type="button"
                                                                className="academic-action-button delete"
                                                                title="Delete timetable"
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        timeTable
                                                                    )
                                                                }
                                                                disabled={
                                                                    deletingId !==
                                                                    null
                                                                }
                                                            >
                                                                {isDeleting ? (
                                                                    <span
                                                                        className="spinner-border spinner-border-sm"
                                                                        role="status"
                                                                        aria-hidden="true"
                                                                    ></span>
                                                                ) : (
                                                                    <i className="bi bi-trash3"></i>
                                                                )}
                                                            </button>

                                                        </div>
                                                    </td>

                                                </tr>
                                            );
                                        }
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* ==================================================
                ADD / EDIT MODAL
            ================================================== */}

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
                                        : 'Create a new timetable record.'}
                                </p>
                            </div>

                            <button
                                type="button"
                                className="student-modal-close"
                                onClick={closeModal}
                                disabled={saving}
                            >
                                &times;
                            </button>

                        </div>

                        {/* MODAL BODY */}

                        <div className="student-modal-body">

                            <form
                                onSubmit={
                                    handleSubmit
                                }
                            >

                                <div className="student-form-grid">

                                    {/* ACADEMIC YEAR */}

                                    <div className="form-group">

                                        <label>
                                            Academic Year{' '}
                                            <span>*</span>
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
                                            disabled={
                                                saving
                                            }
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
                                            Class{' '}
                                            <span>*</span>
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
                                            disabled={
                                                saving
                                            }
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
                                            Section{' '}
                                            <span>*</span>
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
                                            disabled={
                                                saving
                                            }
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
                                            Subject{' '}
                                            <span>*</span>
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
                                            disabled={
                                                saving
                                            }
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
                                            Teacher{' '}
                                            <span>*</span>
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
                                            disabled={
                                                saving
                                            }
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
                                            Day{' '}
                                            <span>*</span>
                                        </label>

                                        <select
                                            name="day"
                                            value={
                                                form.day
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            disabled={
                                                saving
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
                                        </select>

                                        {fieldError(
                                            'day'
                                        )}

                                    </div>

                                    {/* START TIME */}

                                    <div className="form-group">

                                        <label>
                                            Start Time{' '}
                                            <span>*</span>
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
                                            disabled={
                                                saving
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
                                            End Time{' '}
                                            <span>*</span>
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
                                            disabled={
                                                saving
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
                                            Room{' '}
                                            <span>*</span>
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
                                            disabled={
                                                saving
                                            }
                                            className={
                                                errors.room
                                                    ? 'is-invalid'
                                                    : ''
                                            }
                                        />

                                        {fieldError(
                                            'room'
                                        )}

                                    </div>

                                </div>

                                {/* MODAL FOOTER */}

                                <div className="student-modal-footer">

                                    <button
                                        type="button"
                                        className="student-modal-cancel"
                                        onClick={
                                            closeModal
                                        }
                                        disabled={
                                            saving
                                        }
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        className="student-modal-submit"
                                        disabled={
                                            saving
                                        }
                                    >
                                        {saving ? (
                                            <>
                                                <span
                                                    className="spinner-border spinner-border-sm me-2"
                                                    role="status"
                                                    aria-hidden="true"
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