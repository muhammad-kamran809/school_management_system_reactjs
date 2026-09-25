
// export default TeacherAssignments;
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

// API is intentionally disabled for frontend/static development.
// import api from '../../../services/api';

import { mockStorage } from '../../../services/mockData';

// ==================================================
// INITIAL FORM
// ==================================================

const initialForm = {
    teacher: '',
    academic_year: '',
    class_name: '',
    section: '',
    subject: '',
};

// ==================================================
// DEMO / RANDOM DATA
// ==================================================

const demoTeacherAssignments = [
    {
        id: 'TA-001',
        teacher: 'Ahmed Khan',
        academic_year: '2025-2026',
        class_name: 'Class 6',
        section: 'A',
        subject: 'Mathematics',
    },
    {
        id: 'TA-002',
        teacher: 'Sarah Ahmed',
        academic_year: '2025-2026',
        class_name: 'Class 7',
        section: 'B',
        subject: 'English',
    },
    {
        id: 'TA-003',
        teacher: 'Muhammad Ali',
        academic_year: '2025-2026',
        class_name: 'Class 8',
        section: 'A',
        subject: 'Computer Science',
    },
    {
        id: 'TA-004',
        teacher: 'Ayesha Malik',
        academic_year: '2025-2026',
        class_name: 'Class 9',
        section: 'C',
        subject: 'Physics',
    },
    {
        id: 'TA-005',
        teacher: 'Hassan Raza',
        academic_year: '2025-2026',
        class_name: 'Class 10',
        section: 'A',
        subject: 'Chemistry',
    },
    {
        id: 'TA-006',
        teacher: 'Fatima Noor',
        academic_year: '2025-2026',
        class_name: 'Class 5',
        section: 'B',
        subject: 'Urdu',
    },
    {
        id: 'TA-007',
        teacher: 'Usman Tariq',
        academic_year: '2025-2026',
        class_name: 'Class 8',
        section: 'C',
        subject: 'Biology',
    },
    {
        id: 'TA-008',
        teacher: 'Mariam Iqbal',
        academic_year: '2025-2026',
        class_name: 'Class 7',
        section: 'A',
        subject: 'General Science',
    },
];

function TeacherAssignments() {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const [showModal, setShowModal] = useState(false);
    const [editingAssignment, setEditingAssignment] = useState(null);

    const [search, setSearch] = useState('');

    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState({});

    // ==================================================
    // FETCH ASSIGNMENTS
    // ==================================================

    const fetchAssignments = async () => {
        setLoading(true);

        try {
            // API intentionally disabled.
            // const response = await api.get('/teacher-assignments');
            // setAssignments(response.data);

            let data = [];

            if (
                typeof mockStorage.getTeacherAssignments ===
                'function'
            ) {
                data = mockStorage.getTeacherAssignments();
            }

            // ==================================================
            // DEMO DATA
            // ==================================================

            if (!Array.isArray(data) || data.length === 0) {
                data = demoTeacherAssignments.map((item) => ({
                    ...item,
                }));
            }

            setAssignments(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(
                'Error loading teacher assignments:',
                error
            );

            // If storage fails, still show demo records
            setAssignments(
                demoTeacherAssignments.map((item) => ({
                    ...item,
                }))
            );

            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Unable to load teacher assignment records.',
                confirmButtonColor: '#198754',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchAssignments();
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

        setEditingAssignment(null);
        setForm({ ...initialForm });
        setErrors({});
        setShowModal(true);
    };

    // ==================================================
    // OPEN EDIT MODAL
    // ==================================================

    const openEditModal = (assignment) => {
        if (deletingId !== null) return;

        setEditingAssignment(assignment);

        setForm({
            teacher:
                assignment.teacher ||
                assignment.teacher_name ||
                '',

            academic_year:
                assignment.academic_year ||
                assignment.academicYear ||
                '',

            class_name:
                assignment.class_name ||
                assignment.className ||
                '',

            section: assignment.section || '',

            subject: assignment.subject || '',
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
        setEditingAssignment(null);
        setForm({ ...initialForm });
        setErrors({});
    };

    // ==================================================
    // VALIDATE FORM
    // ==================================================

    const validateForm = () => {
        const newErrors = {};

        if (!form.teacher.trim()) {
            newErrors.teacher = 'Teacher is required.';
        }

        if (!form.academic_year.trim()) {
            newErrors.academic_year =
                'Academic Year is required.';
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
            const assignmentData = {
                teacher: form.teacher.trim(),
                academic_year: form.academic_year.trim(),
                class_name: form.class_name.trim(),
                section: form.section.trim(),
                subject: form.subject.trim(),
            };

            // ==================================================
            // UPDATE
            // ==================================================

            if (editingAssignment) {
                if (
                    typeof mockStorage.updateTeacherAssignment ===
                    'function'
                ) {
                    mockStorage.updateTeacherAssignment(
                        editingAssignment.id,
                        assignmentData
                    );
                }

                setAssignments((previous) =>
                    previous.map((item) =>
                        item.id === editingAssignment.id
                            ? {
                                  ...item,
                                  ...assignmentData,
                              }
                            : item
                    )
                );

                closeModal();

                await Swal.fire({
                    icon: 'success',
                    title: 'Updated',
                    text: 'Teacher assignment has been updated successfully.',
                    confirmButtonColor: '#198754',
                });
            }

            // ==================================================
            // ADD
            // ==================================================

            else {
                let newRecord = {
                    id: `TA-${Date.now()}`,
                    ...assignmentData,
                };

                if (
                    typeof mockStorage.addTeacherAssignment ===
                    'function'
                ) {
                    const result =
                        mockStorage.addTeacherAssignment(
                            assignmentData
                        );

                    if (result) {
                        newRecord = result;
                    }
                }

                setAssignments((previous) => [
                    ...previous,
                    newRecord,
                ]);

                closeModal();

                await Swal.fire({
                    icon: 'success',
                    title: 'Added',
                    text: 'Teacher assignment has been added successfully.',
                    confirmButtonColor: '#198754',
                });
            }
        } catch (error) {
            console.error(
                'Error saving teacher assignment:',
                error
            );

            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Unable to save teacher assignment.',
                confirmButtonColor: '#198754',
            });
        } finally {
            setSaving(false);
        }
    };

    // ==================================================
    // DELETE ASSIGNMENT
    // ==================================================

    const handleDelete = async (assignment) => {
        if (deletingId !== null) return;

        const teacherName =
            assignment.teacher ||
            assignment.teacher_name ||
            'this teacher';

        const result = await Swal.fire({
            icon: 'warning',
            title: 'Delete Assignment?',
            text: `Are you sure you want to delete the assignment for ${teacherName}?`,
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
            setDeletingId(assignment.id);

            if (
                typeof mockStorage.deleteTeacherAssignment ===
                'function'
            ) {
                mockStorage.deleteTeacherAssignment(
                    assignment.id
                );
            }

            setAssignments((previous) =>
                previous.filter(
                    (item) => item.id !== assignment.id
                )
            );

            await Swal.fire({
                icon: 'success',
                title: 'Deleted',
                text: 'Teacher assignment has been deleted successfully.',
                confirmButtonColor: '#198754',
            });
        } catch (error) {
            console.error(
                'Error deleting teacher assignment:',
                error
            );

            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Unable to delete teacher assignment.',
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
            <div
                className="text-danger small mt-1"
            >
                {errors[fieldName]}
            </div>
        );
    };

    // ==================================================
    // SEARCH
    // ==================================================

    const filteredAssignments = assignments.filter(
        (assignment) => {
            const searchValue = search
                .toLowerCase()
                .trim();

            return (
                String(
                    assignment.teacher ||
                        assignment.teacher_name ||
                        ''
                )
                    .toLowerCase()
                    .includes(searchValue) ||

                String(
                    assignment.academic_year ||
                        assignment.academicYear ||
                        ''
                )
                    .toLowerCase()
                    .includes(searchValue) ||

                String(
                    assignment.class_name ||
                        assignment.className ||
                        ''
                )
                    .toLowerCase()
                    .includes(searchValue) ||

                String(assignment.section || '')
                    .toLowerCase()
                    .includes(searchValue) ||

                String(assignment.subject || '')
                    .toLowerCase()
                    .includes(searchValue)
            );
        }
    );

    // ==================================================
    // UI
    // ==================================================

    return (
        <div className="academic-years-page teacher-assignments-page">

            {/* ==================================================
                PAGE HEADER
            ================================================== */}

            <div className="academic-years-header">
                <div>
                    <p className="section-kicker">
                        Academic
                    </p>

                    <h1>Teacher Assignments</h1>

                    <p className="hero-copy">
                        Manage teacher assignment records
                        and information.
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
                    Add Assignment
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
                            Teacher Assignment List
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
                                placeholder="Search assignments..."
                            />
                        </div>

                        <span className="panel-count">
                            {filteredAssignments.length} records
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
                                Loading teacher assignments...
                            </p>
                        </div>
                    ) : filteredAssignments.length === 0 ? (
                        <div className="academic-years-empty">

                            <i
                                className="bi bi-person-workspace"
                                aria-hidden="true"
                            ></i>

                            <h3>
                                {search
                                    ? 'No teacher assignments found'
                                    : 'No teacher assignments yet'}
                            </h3>

                            <p>
                                {search
                                    ? 'Try a different search.'
                                    : 'Add your first teacher assignment to get started.'}
                            </p>

                            {!search && (
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={openAddModal}
                                    disabled={
                                        deletingId !== null
                                    }
                                >
                                    <i className="bi bi-plus-lg me-2"></i>
                                    Add Assignment
                                </button>
                            )}
                        </div>
                    ) : (
                        <div
                            className="table-responsive"
                            style={{ width: '100%' }}
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
                                                minWidth: '190px',
                                            }}
                                        >
                                            Teacher
                                        </th>

                                        <th
                                            style={{
                                                minWidth: '170px',
                                            }}
                                        >
                                            Academic Year
                                        </th>

                                        <th
                                            style={{
                                                minWidth: '140px',
                                            }}
                                        >
                                            Class
                                        </th>

                                        <th
                                            style={{
                                                minWidth: '120px',
                                            }}
                                        >
                                            Section
                                        </th>

                                        <th
                                            style={{
                                                minWidth: '190px',
                                            }}
                                        >
                                            Subject
                                        </th>

                                        <th
                                            style={{
                                                width: '120px',
                                                minWidth: '120px',
                                                textAlign: 'right',
                                            }}
                                        >
                                            Actions
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {filteredAssignments.map(
                                        (
                                            assignment,
                                            index
                                        ) => {
                                            const isDeleting =
                                                deletingId ===
                                                assignment.id;

                                            return (
                                                <tr
                                                    key={
                                                        assignment.id ||
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

                                                    {/* TEACHER */}

                                                    <td>
                                                        <div className="student-table-name">
                                                            <div className="student-avatar">
                                                                <i className="bi bi-person"></i>
                                                            </div>

                                                            <div>
                                                                <div className="fw-semibold">
                                                                    {assignment.teacher ||
                                                                        assignment.teacher_name ||
                                                                        '-'}
                                                                </div>

                                                                <div className="text-muted small">
                                                                    Teacher Assignment
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* ACADEMIC YEAR */}

                                                    <td>
                                                        {assignment.academic_year ||
                                                            assignment.academicYear ||
                                                            '-'}
                                                    </td>

                                                    {/* CLASS */}

                                                    <td>
                                                        {assignment.class_name ||
                                                            assignment.className ||
                                                            '-'}
                                                    </td>

                                                    {/* SECTION */}

                                                    <td>
                                                        {assignment.section ||
                                                            '-'}
                                                    </td>

                                                    {/* SUBJECT */}

                                                    <td>
                                                        <span className="fw-semibold">
                                                            {assignment.subject ||
                                                                '-'}
                                                        </span>
                                                    </td>

                                                    {/* ACTIONS */}

                                                    <td>
                                                        <div className="academic-actions">

                                                            {/* EDIT */}

                                                            <button
                                                                type="button"
                                                                className="academic-action-button edit"
                                                                title="Edit assignment"
                                                                onClick={() =>
                                                                    openEditModal(
                                                                        assignment
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
                                                                title="Delete assignment"
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        assignment
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
                                    Teacher Assignment
                                </span>

                                <h3>
                                    {editingAssignment
                                        ? 'Edit Teacher Assignment'
                                        : 'Add Teacher Assignment'}
                                </h3>

                                <p>
                                    {editingAssignment
                                        ? 'Update teacher assignment information.'
                                        : 'Create a new teacher assignment record.'}
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
                                onSubmit={handleSubmit}
                            >
                                <div className="student-form-grid">

                                    {/* TEACHER */}

                                    <div className="form-group">
                                        <label>
                                            Teacher <span>*</span>
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
                                            Class <span>*</span>
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
                                            Section <span>*</span>
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
                                            Subject <span>*</span>
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
                                </div>

                                {/* MODAL FOOTER */}

                                <div className="student-modal-footer">

                                    <button
                                        type="button"
                                        className="student-modal-cancel"
                                        onClick={closeModal}
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

                                                {editingAssignment
                                                    ? 'Update Assignment'
                                                    : 'Save Assignment'}
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

export default TeacherAssignments;