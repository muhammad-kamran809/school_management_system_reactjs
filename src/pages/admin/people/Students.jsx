
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import api from '../../../services/api';
// import api from '../../../services/api';
import { mockStorage } from '../../../services/mockData';

const initialForm = {
    name: '',
    email: '',
    phone: '',
    class_name: '',
    section: '',
    gender: '',
    date_of_birth: '',
    address: '',
    guardian_name: '',
    guardian_phone: '',
    status: 'active',
};

export default function Students() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const [showModal, setShowModal] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);

    const [search, setSearch] = useState('');

    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState({});

    // -----------------------------------------
    // GET STUDENTS
    // -----------------------------------------
    const fetchStudents = async () => {
        try {
            setLoading(true);

            // API call commented out:
            // const response = await api.get('/students');
            // if (Array.isArray(response.data)) {
            //     setStudents(response.data);
            // } else if (Array.isArray(response.data.data)) {
            //     setStudents(response.data.data);
            // } else {
            //     setStudents([]);
            // }

            const data = mockStorage.getStudents();
            setStudents(data);

        } catch (error) {
            console.error('Fetch students error:', error);

            handleApiError(error);

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchStudents();
    }, []);

    // =========================================================
    // API ERROR HANDLER
    // =========================================================

    const handleApiError = (error) => {
        console.error(
            'API Error:',
            error
        );

        if (!error.response) {
            Swal.fire({
                icon: 'error',
                title: 'Connection Error',
                text:
                    'Could not connect to the Laravel server. Please check your API server.',
                confirmButtonText: 'OK',
            });

            return;
        }

        const status =
            error.response.status;

        const data =
            error.response.data || {};

        // 422 VALIDATION ERROR
        if (status === 422) {

            const validationErrors = data.errors || {};

            setErrors(validationErrors);

            const messages =
                Object.values(
                    validationErrors
                )
                    .flat()
                    .join('<br>');

            Swal.fire({
                icon: 'warning',
                title: 'Validation Error',
                html:
                    messages ||
                    data.message ||
                    'Please check the form.',
                confirmButtonText: 'OK',
            });

            return;
        }

        // 401 UNAUTHENTICATED
        if (status === 401) {
            Swal.fire({
                icon: 'warning',
                title: 'Unauthenticated',
                text:
                    'Your login session has expired. Please login again.',
                confirmButtonText: 'OK',
            });

            return;
        }

        // 403 FORBIDDEN
        if (status === 403) {
            Swal.fire({
                icon: 'error',
                title: 'Permission Denied',
                text:
                    data.message ||
                    'You do not have permission to perform this action.',
                confirmButtonText: 'OK',
            });

            return;
        }

        // 404 NOT FOUND
        if (status === 404) {
            Swal.fire({
                icon: 'error',
                title: 'Student Not Found',
                text:
                    data.message ||
                    'The requested student could not be found.',
                confirmButtonText: 'OK',
            });

            return;
        }

        // 500 SERVER ERROR
        if (status === 500) {
            Swal.fire({
                icon: 'error',
                title: 'Server Error',
                text:
                    data.message ||
                    'Something went wrong on the Laravel server.',
                confirmButtonText: 'OK',
            });

            return;
        }

        // OTHER ERRORS
        Swal.fire({
            icon: 'error',
            title: 'Something Went Wrong',
            text:
                data.message ||
                `Request failed with status ${status}.`,
            confirmButtonText: 'OK',
        });
    };

    // -----------------------------------------
    // GET STUDENTS
    // -----------------------------------------
    const fetchStudents = async () => {
        try {
            setLoading(true);
            const response = await api.get('/students');
            const data = response.data?.data || response.data || [];
            setStudents(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Fetch students error:', error);
            handleApiError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchStudents();
    }, []);

    // =========================================================
    // FORM INPUT
    // =========================================================

    const handleChange = (e) => {
        const {
            name,
            value,
        } = e.target;

        setForm(
            (previous) => ({
                ...previous,
                [name]: value,
            })
        );

        if (errors[name]) {
            setErrors(
                (previous) => ({
                    ...previous,
                    [name]: undefined,
                })
            );
        }
    };

    // =========================================================
    // OPEN ADD MODAL
    // =========================================================

    const openAddModal = () => {
        setEditingStudent(null);

        setForm({
            ...initialForm,
        });

        setErrors({});
        setShowModal(true);
    };

    // =========================================================
    // OPEN EDIT MODAL
    // =========================================================

    const openEditModal = (student) => {
        setEditingStudent(student);

        let formattedDob = '';
        if (student.date_of_birth) {
            formattedDob = student.date_of_birth.split('T')[0];
        }

        setForm({
            name: student.name || '',
            email: student.email || '',
            phone: student.phone || '',
            class_name: student.class_name || '',
            section: student.section || '',
            gender: student.gender || '',
            date_of_birth: student.date_of_birth || '',
            address: student.address || '',
            guardian_name: student.guardian_name || '',
            guardian_phone: student.guardian_phone || '',
            status: student.status || 'active',
        });

        setErrors({});
        setShowModal(true);
    };

    // =========================================================
    // CLOSE MODAL
    // =========================================================

    const closeModal = () => {
        if (saving) {
            return;
        }

        setShowModal(false);
        setEditingStudent(null);

        setForm({
            ...initialForm,
        });

        setErrors({});
    };

    // =========================================================
    // SAVE STUDENT
    // =========================================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (saving) {
            return;
        }

        setSaving(true);
        setErrors({});

        try {
            let response;

        try {
            if (editingStudent) {
                // UPDATE STUDENT
                response = await api.put(
                    `/students/${editingStudent.id}`,
                    form
                );
                // API call commented out:
                // response = await api.put(
                //     `/students/${editingStudent.id}`,
                //     form
                // );
                mockStorage.updateStudent(editingStudent.id, form);

                console.log('Student update response:', response.data);

                // Close modal first
                closeModal();

                // Refresh table
                await fetchStudents();

                // Show success alert
                await Swal.fire({
                    icon: 'success',
                    title: 'Student Updated!',
                    text: 'Student information has been updated successfully.',
                    confirmButtonText: 'OK'
                });

            } else {
                // CREATE STUDENT
                response = await api.post(
                    '/students',
                    form
                );
                // API call commented out:
                // response = await api.post(
                //     '/students',
                //     form
                // );
                mockStorage.addStudent(form);

                console.log('Student create response:', response.data);

                // Close modal
                closeModal();

                // Refresh table
                await fetchStudents();

                // Show success alert
                await Swal.fire({
                    icon: 'success',
                    title: 'Student Created!',
                    text: 'Student has been added successfully.',
                    confirmButtonText: 'OK'
                });
            }
        } catch (error) {
            console.error('Student save error:', error);

            // IMPORTANT:
            // Show the error to the user
            handleApiError(error);
        } finally {
            setSaving(false);
        }
    };
    // -----------------------------------------
    // DELETE STUDENT
    // -----------------------------------------
    const handleDelete = async (student) => {
        const result = await Swal.fire({
            icon: 'warning',
            title: 'Delete Student?',
            text: `Are you sure you want to delete ${student.name}?`,
            showCancelButton: true,
            confirmButtonText: 'Yes, Delete',
            cancelButtonText: 'Cancel',
            reverseButtons: true
        });

        if (!result.isConfirmed) {
            return;
        }

        try {
            // Show loading alert
            Swal.fire({
                title: 'Deleting...',
                text: 'Please wait while the student is being deleted.',
                allowOutsideClick: false,
                allowEscapeKey: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            await api.delete(`/students/${student.id}`);
            // API call commented out:
            // await api.delete(`/students/${student.id}`);
            mockStorage.deleteStudent(student.id);

            await Swal.fire({
                icon: 'success',
                title: 'Student Deleted!',
                text: `${student.name} has been deleted successfully.`,
                confirmButtonText: 'OK'
            });

            // Refresh table
            fetchStudents();

        } catch (error) {
            Swal.close();

            handleApiError(error);
        } finally {
            setDeletingId(null);
        }
    };

    // =========================================================
    // SEARCH
    // =========================================================

    const filteredStudents =
        students.filter(
            (student) => {
                const searchText =
                    search
                        .toLowerCase()
                        .trim();

                return (
                    String(
                        student.name || ''
                    )
                        .toLowerCase()
                        .includes(
                            searchText
                        ) ||
                    String(
                        student.email || ''
                    )
                        .toLowerCase()
                        .includes(
                            searchText
                        ) ||
                    String(
                        student.phone || ''
                    )
                        .toLowerCase()
                        .includes(
                            searchText
                        ) ||
                    String(
                        student.class_name ||
                        ''
                    )
                        .toLowerCase()
                        .includes(
                            searchText
                        ) ||
                    String(
                        student.section || ''
                    )
                        .toLowerCase()
                        .includes(
                            searchText
                        ) ||
                    String(
                        student.guardian_name ||
                        ''
                    )
                        .toLowerCase()
                        .includes(
                            searchText
                        )
                );
            }
        );

    // =========================================================
    // FIELD ERROR
    // =========================================================

    const fieldError = (field) => {
        if (!errors[field]) {
            return null;
        }

        return (
            <div className="text-danger small mt-1">
                {Array.isArray(
                    errors[field]
                )
                    ? errors[field][0]
                    : errors[field]}
            </div>
        );
    };

    // =========================================================
    // STATUS FORMATTER
    // =========================================================

    const formatStatus = (
        status
    ) => {
        if (!status) {
            return 'Inactive';
        }

        return (
            status
                .charAt(0)
                .toUpperCase() +
            status.slice(1)
        );
    };

    // =========================================================
    // RENDER
    // =========================================================

    return (
        <div
            className="academic-years-page"
            style={{
                width: '100%',
                maxWidth: '100%',
            }}
        >

            {/* =================================================
                PAGE HEADER
            ================================================= */}

            <div className="academic-years-header">

                <div>
                    <p className="section-kicker">
                        People
                    </p>

                    <h1>
                        Students
                    </h1>

                    <p className="hero-copy">
                        Manage student records and information.
                    </p>
                </div>

                <button
                    type="button"
                    className="btn btn-primary academic-years-add"
                    onClick={
                        openAddModal
                    }
                    disabled={
                        deletingId !== null
                    }
                >
                    <i
                        className="bi bi-plus-lg"
                        aria-hidden="true"
                    ></i>

                    Add Student
                </button>

            </div>

            {/* =================================================
                STUDENT LIST PANEL
            ================================================= */}

            <div
                className="dashboard-panel academic-years-panel"
                style={{
                    width: '100%',
                    maxWidth: 'none',
                    marginLeft: 0,
                    marginRight: 0,
                }}
            >

                {/* PANEL HEADER */}

                <div className="academic-years-panel-heading">

                    <div>
                        <p className="section-kicker">
                            People management
                        </p>

                        <h2>
                            Student list
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
                                placeholder="Search students..."
                                value={
                                    search
                                }
                                onChange={(
                                    e
                                ) =>
                                    setSearch(
                                        e.target.value
                                    )
                                }
                            />

                            {search && (
                                <button
                                    type="button"
                                    className="student-search-clear"
                                    onClick={() =>
                                        setSearch(
                                            ''
                                        )
                                    }
                                    title="Clear search"
                                >
                                    &times;
                                </button>
                            )}

                        </div>

                        <span className="panel-count">
                            {
                                filteredStudents.length
                            } records
                        </span>

                    </div>

                </div>

                {/* =================================================
                    TABLE
                ================================================= */}

                <div
                    className="academic-years-table-wrap"
                    style={{
                        width: '100%',
                        maxWidth: '100%',
                    }}
                >

                    {/* LOADING */}

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
                                Loading students...
                            </p>

                        </div>

                    ) : filteredStudents.length === 0 ? (

                        /* EMPTY STATE */

                        <div className="academic-years-empty">

                            <i
                                className="bi bi-people"
                                aria-hidden="true"
                            ></i>

                            <h3>
                                {search
                                    ? 'No students found'
                                    : 'No students yet'}
                            </h3>

                            <p>
                                {search
                                    ? 'Try a different search.'
                                    : 'Add your first student to get started.'}
                            </p>

                            {!search && (
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={
                                        openAddModal
                                    }
                                >
                                    <i className="bi bi-plus-lg me-2"></i>
                                    Add Student
                                </button>
                            )}

                        </div>

                    ) : (

                        /* TABLE */

                        <div
                            className="table-responsive"
                            style={{
                                width: '100%',
                                overflowX:
                                    'auto',
                            }}
                        >

                            <table
                                className="academic-years-table"
                                style={{
                                    width:
                                        '100%',
                                    minWidth:
                                        '1200px',
                                }}
                            >

                                <thead>

                                    <tr>

                                        <th
                                            style={{
                                                width:
                                                    '60px',
                                            }}
                                        >
                                            #
                                        </th>

                                        <th>
                                            Student
                                        </th>

                                        <th>
                                            Phone
                                        </th>

                                        <th>
                                            Class
                                        </th>

                                        <th>
                                            Section
                                        </th>

                                        <th>
                                            Gender
                                        </th>

                                        <th>
                                            Guardian
                                        </th>

                                        <th>
                                            Status
                                        </th>

                                        <th
                                            style={{
                                                width:
                                                    '120px',
                                                textAlign:
                                                    'right',
                                            }}
                                        >
                                            Actions
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {filteredStudents.map(
                                        (
                                            student,
                                            index
                                        ) => {

                                            const isDeleting =
                                                deletingId ===
                                                student.id;

                                            return (
                                                <tr
                                                    key={
                                                        student.id ||
                                                        `${student.name}-${index}`
                                                    }
                                                    style={
                                                        isDeleting
                                                            ? {
                                                                  opacity: 0.55,
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

                                                    {/* STUDENT */}

                                                    <td>

                                                        <div className="student-table-name">

                                                            <div className="student-avatar">

                                                                {student.photo ? (
                                                                    <img
                                                                        src={
                                                                            student.photo
                                                                        }
                                                                        alt={
                                                                            student.name
                                                                        }
                                                                    />
                                                                ) : (
                                                                    <i className="bi bi-person"></i>
                                                                )}

                                                            </div>

                                                            <div>

                                                                <div className="fw-semibold">
                                                                    {
                                                                        student.name
                                                                    }
                                                                </div>

                                                                <div className="text-muted small">
                                                                    {
                                                                        student.email ||
                                                                        'No email'
                                                                    }
                                                                </div>

                                                            </div>

                                                        </div>

                                                    </td>

                                                    {/* PHONE */}

                                                    <td>
                                                        {
                                                            student.phone ||
                                                            '-'
                                                        }
                                                    </td>

                                                    {/* CLASS */}

                                                    <td>
                                                        {
                                                            student.class_name ||
                                                            '-'
                                                        }
                                                    </td>

                                                    {/* SECTION */}

                                                    <td>
                                                        {
                                                            student.section ||
                                                            '-'
                                                        }
                                                    </td>

                                                    {/* GENDER */}

                                                    <td>
                                                        {student.gender
                                                            ? student.gender
                                                                  .charAt(
                                                                      0
                                                                  )
                                                                  .toUpperCase() +
                                                              student.gender.slice(
                                                                  1
                                                              )
                                                            : '-'}
                                                    </td>

                                                    {/* GUARDIAN */}

                                                    <td>
                                                        {
                                                            student.guardian_name ||
                                                            '-'
                                                        }
                                                    </td>

                                                    {/* STATUS */}

                                                    <td>

                                                        {student.status ===
                                                        'active' ? (

                                                            <span className="status-badge active">
                                                                Active
                                                            </span>

                                                        ) : (

                                                            <span className="status-badge inactive">
                                                                {formatStatus(
                                                                    student.status
                                                                )}
                                                            </span>

                                                        )}

                                                    </td>

                                                    {/* ACTIONS */}

                                                    <td>

                                                        <div className="academic-actions">

                                                            <button
                                                                type="button"
                                                                className="academic-action-button edit"
                                                                title="Edit student"
                                                                onClick={() =>
                                                                    openEditModal(
                                                                        student
                                                                    )
                                                                }
                                                                disabled={
                                                                    deletingId !==
                                                                    null
                                                                }
                                                            >
                                                                <i className="bi bi-pencil"></i>
                                                            </button>

                                                            <button
                                                                type="button"
                                                                className="academic-action-button delete"
                                                                title="Delete student"
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        student
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

            {/* =================================================
                ADD / EDIT MODAL
            ================================================= */}

            {showModal && (

                <div
                    className="student-modal-overlay"
                    onMouseDown={(
                        e
                    ) => {
                        if (
                            e.target ===
                                e.currentTarget &&
                            !saving
                        ) {
                            closeModal();
                        }
                    }}
                >

                    <div className="student-modal">

                        {/* MODAL HEADER */}

                        <div className="student-modal-header">

                            <div>

                                <span className="section-kicker">
                                    Student
                                </span>

                                <h3>
                                    {editingStudent
                                        ? 'Edit Student'
                                        : 'Add Student'}
                                </h3>

                                <p>
                                    {editingStudent
                                        ? 'Update student information.'
                                        : 'Create a new student record.'}
                                </p>

                            </div>

                            <button
                                type="button"
                                className="student-modal-close"
                                onClick={
                                    closeModal
                                }
                                disabled={
                                    saving
                                }
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

                                    {/* STUDENT NAME */}

                                    <div className="form-group">

                                        <label>
                                            Student Name{' '}
                                            <span>
                                                *
                                            </span>
                                        </label>

                                        <input
                                            type="text"
                                            name="name"
                                            value={
                                                form.name
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Enter student name"
                                            disabled={
                                                saving
                                            }
                                        />

                                        {fieldError(
                                            'name'
                                        )}

                                    </div>

                                    {/* EMAIL */}

                                    <div className="form-group">

                                        <label>
                                            Email
                                        </label>

                                        <input
                                            type="email"
                                            name="email"
                                            value={
                                                form.email
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Enter email address"
                                            disabled={
                                                saving
                                            }
                                        />

                                        {fieldError(
                                            'email'
                                        )}

                                    </div>

                                    {/* PHONE */}

                                    <div className="form-group">

                                        <label>
                                            Phone
                                        </label>

                                        <input
                                            type="text"
                                            name="phone"
                                            value={
                                                form.phone
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Enter phone number"
                                            disabled={
                                                saving
                                            }
                                        />

                                        {fieldError(
                                            'phone'
                                        )}

                                    </div>

                                    {/* CLASS */}

                                    <div className="form-group">

                                        <label>
                                            Class
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
                                            placeholder="Enter class"
                                            disabled={
                                                saving
                                            }
                                        />

                                        {fieldError(
                                            'class_name'
                                        )}

                                    </div>

                                    {/* SECTION */}

                                    <div className="form-group">

                                        <label>
                                            Section
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
                                            placeholder="Enter section"
                                            disabled={
                                                saving
                                            }
                                        />

                                        {fieldError(
                                            'section'
                                        )}

                                    </div>

                                    {/* GENDER */}

                                    <div className="form-group">

                                        <label>
                                            Gender
                                        </label>

                                        <select
                                            name="gender"
                                            value={
                                                form.gender
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            disabled={
                                                saving
                                            }
                                        >

                                            <option value="">
                                                Select gender
                                            </option>

                                            <option value="male">
                                                Male
                                            </option>

                                            <option value="female">
                                                Female
                                            </option>

                                            <option value="other">
                                                Other
                                            </option>

                                        </select>

                                        {fieldError(
                                            'gender'
                                        )}

                                    </div>

                                    {/* DATE OF BIRTH */}

                                    <div className="form-group">

                                        <label>
                                            Date of Birth
                                        </label>

                                        <input
                                            type="date"
                                            name="date_of_birth"
                                            value={
                                                form.date_of_birth
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            disabled={
                                                saving
                                            }
                                        />

                                        {fieldError(
                                            'date_of_birth'
                                        )}

                                    </div>

                                    {/* STATUS */}

                                    <div className="form-group">

                                        <label>
                                            Status
                                        </label>

                                        <select
                                            name="status"
                                            value={
                                                form.status
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            disabled={
                                                saving
                                            }
                                        >

                                            <option value="active">
                                                Active
                                            </option>

                                            <option value="inactive">
                                                Inactive
                                            </option>

                                        </select>

                                        {fieldError(
                                            'status'
                                        )}

                                    </div>

                                    {/* ADDRESS */}

                                    <div className="form-group full-width">

                                        <label>
                                            Address
                                        </label>

                                        <textarea
                                            name="address"
                                            value={
                                                form.address
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Enter student address"
                                            rows="3"
                                            disabled={
                                                saving
                                            }
                                        />

                                        {fieldError(
                                            'address'
                                        )}

                                    </div>

                                    {/* GUARDIAN NAME */}

                                    <div className="form-group">

                                        <label>
                                            Guardian Name
                                        </label>

                                        <input
                                            type="text"
                                            name="guardian_name"
                                            value={
                                                form.guardian_name
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Enter guardian name"
                                            disabled={
                                                saving
                                            }
                                        />

                                        {fieldError(
                                            'guardian_name'
                                        )}

                                    </div>

                                    {/* GUARDIAN PHONE */}

                                    <div className="form-group">

                                        <label>
                                            Guardian Phone
                                        </label>

                                        <input
                                            type="text"
                                            name="guardian_phone"
                                            value={
                                                form.guardian_phone
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Enter guardian phone"
                                            disabled={
                                                saving
                                            }
                                        />

                                        {fieldError(
                                            'guardian_phone'
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
                                        {saving
                                            ? 'Saving...'
                                            : editingStudent
                                                ? 'Update Student'
                                                : 'Save Student'}
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

