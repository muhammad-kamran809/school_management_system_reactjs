
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

// API will be connected later by backend developer
import api from '../../../services/api';
import Pagination from '../../../components/Pagination';

import { mockStorage } from '../../../services/mockData';

const initialForm = {
    student: '',
    academic_year: '',
    class_name: '',
    section: '',
    roll_no: '',
    enrollment_date: '',
    status: 'active',
};

export default function Enrollments() {
    const [enrollments, setEnrollments] = useState([]);
    const [students, setStudents] = useState([]);
    const [academicYears, setAcademicYears] = useState([]);
    const [classes, setClasses] = useState([]);
    const [sections, setSections] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const [showModal, setShowModal] = useState(false);
    const [editingEnrollment, setEditingEnrollment] = useState(null);

    const [search, setSearch] = useState('');

    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState({});

    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0,
        from: 0,
        to: 0,
    });

    // -----------------------------------------
    // GET ENROLLMENTS
    // -----------------------------------------
    const fetchEnrollments = async (page = 1, perPage = pagination.per_page) => {
        try {
            setLoading(true);

            const response = await api.get('/enrollments', {
                params: {
                    page,
                    per_page: perPage,
                },
            });

            const data =
                response.data?.data ||
                response.data ||
                [];
            const meta = response.data?.meta || (response.data?.current_page ? response.data : null);

            setEnrollments(
                Array.isArray(data)
                    ? data
                    : []
            );

            if (meta) {
                setPagination({
                    current_page: meta.current_page || page,
                    last_page: meta.last_page || 1,
                    per_page: meta.per_page || perPage,
                    total: meta.total ?? (Array.isArray(data) ? data.length : 0),
                    from: meta.from ?? ((page - 1) * perPage + 1),
                    to: meta.to ?? ((page - 1) * perPage + (Array.isArray(data) ? data.length : 0)),
                });
            } else {
                const total = Array.isArray(data) ? data.length : 0;
                setPagination({
                    current_page: 1,
                    last_page: 1,
                    per_page: perPage,
                    total,
                    from: total > 0 ? 1 : 0,
                    to: total,
                });
            }
        } catch (error) {
            console.error(
                'Fetch enrollments error:',
                error
            );

            handleApiError(error);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (newPage) => {
        fetchEnrollments(newPage, pagination.per_page);
    };

    const handlePerPageChange = (newPerPage) => {
        fetchEnrollments(1, newPerPage);
    };

    // -----------------------------------------
    // GET STUDENTS
    // -----------------------------------------
   const fetchStudents = async () => {
    try {
        const response = await api.get('/students');

        const data =
            response.data?.data ||
            response.data ||
            [];

        setStudents(Array.isArray(data) ? data : []);
    } catch (error) {
        console.error('Fetch students error:', error);
        handleApiError(error);
    }
};

    // -----------------------------------------
    // GET ACADEMIC YEARS
    // -----------------------------------------
    const fetchAcademicYears = async () => {
    try {
        const response = await api.get('/academic-years');

        const data =
            response.data?.data ||
            response.data ||
            [];

        setAcademicYears(Array.isArray(data) ? data : []);
    } catch (error) {
        console.error('Fetch academic years error:', error);
        handleApiError(error);
    }
};

    // -----------------------------------------
    // GET CLASSES
    // -----------------------------------------
    const fetchClasses = async () => {
    try {
        const response = await api.get('/classes');

        const data =
            response.data?.data ||
            response.data ||
            [];

        setClasses(Array.isArray(data) ? data : []);
    } catch (error) {
        console.error('Fetch classes error:', error);
        handleApiError(error);
    }
};

    // -----------------------------------------
    // GET SECTIONS
    // -----------------------------------------
   const fetchSections = async () => {
    try {
        const response = await api.get('/sections');

        const data =
            response.data?.data ||
            response.data ||
            [];

        setSections(Array.isArray(data) ? data : []);
    } catch (error) {
        console.error('Fetch sections error:', error);
        handleApiError(error);
    }
};



    // -----------------------------------------
    // LOAD DATA
    // -----------------------------------------
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchEnrollments();

        fetchStudents();
        fetchAcademicYears();
        fetchClasses();
        fetchSections();
    }, []);

    // -----------------------------------------
    // API ERROR HANDLER
    // -----------------------------------------
    const handleApiError = (error) => {
        console.error('API Error:', error);

        if (!error.response) {
            Swal.fire({
                icon: 'error',
                title: 'Connection Error',
                text: 'Could not connect to the Laravel server. Please check your API server.',
                confirmButtonText: 'OK',
            });

            return;
        }

        const status = error.response.status;
        const data = error.response.data;

        console.log('API status:', status);
        console.log('API data:', data);

        // 422 VALIDATION ERROR
        if (status === 422) {
            const validationErrors =
                data.errors || {};

            setErrors(validationErrors);

            const messages = Object.values(
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
                text: 'Your login session has expired. Please login again.',
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
                title: 'Enrollment Not Found',
                text:
                    data.message ||
                    'The requested enrollment could not be found.',
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
    // FORM INPUT
    // -----------------------------------------
    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));

        if (errors[name]) {
            setErrors((previous) => ({
                ...previous,
                [name]: undefined,
            }));
        }
    };

    // -----------------------------------------
    // OPEN ADD MODAL
    // -----------------------------------------
    const openAddModal = () => {
        if (deletingId !== null) {
            return;
        }

        setEditingEnrollment(null);
        setForm(initialForm);
        setErrors({});
        setShowModal(true);
    };

    // -----------------------------------------
    // OPEN EDIT MODAL
    // -----------------------------------------
    const openEditModal = (enrollment) => {
        if (deletingId !== null) {
            return;
        }

        setEditingEnrollment(enrollment);

        setForm({
            student: enrollment.student || '',
            academic_year:
                enrollment.academic_year || '',
            class_name:
                enrollment.class_name || '',
            section:
                enrollment.section || '',
            roll_number:
                enrollment.roll_number || '',
            enrollment_date:
                enrollment.enrollment_date || '',
            status:
                enrollment.status || 'active',
        });

        setErrors({});
        setShowModal(true);
    };

    // -----------------------------------------
    // CLOSE MODAL
    // -----------------------------------------
    const closeModal = () => {
        if (saving) {
            return;
        }

        setShowModal(false);
        setEditingEnrollment(null);

        setForm(initialForm);
        setErrors({});
    };

    // -----------------------------------------
    // SAVE ENROLLMENT
    // -----------------------------------------
 const handleSubmit = async (e) => {
    e.preventDefault();

    if (saving || deletingId !== null) {
        return;
    }

    setSaving(true);
    setErrors({});

    const payload = {
        student_id: form.student,
        academic_year_id: form.academic_year,
        class_id: form.class_name,
        section_id: form.section,
        roll_no: form.roll_number,
        enrollment_date: form.enrollment_date,
        status: form.status,
    };

    try {
        if (editingEnrollment) {
            // UPDATE
            await api.put(
                `/enrollments/${editingEnrollment.id}`,
                payload
            );

            // Close modal
            closeModal();

            // Get fresh data from Laravel
            await fetchEnrollments();

            // Success alert
            await Swal.fire({
                icon: 'success',
                title: 'Enrollment Updated!',
                text: 'Enrollment information has been updated successfully.',
                confirmButtonText: 'OK',
            });
        } else {
            // CREATE
            await api.post(
                '/enrollments',
                payload
            );

            // Close modal
            closeModal();

            // Get fresh data from Laravel
            await fetchEnrollments();

            // Success alert
            await Swal.fire({
                icon: 'success',
                title: 'Enrollment Created!',
                text: 'Enrollment has been added successfully.',
                confirmButtonText: 'OK',
            });
        }
    } catch (error) {
        console.error(
            'Enrollment save error:',
            error
        );

        handleApiError(error);
    } finally {
        setSaving(false);
    }
};

    // -----------------------------------------
    // DELETE ENROLLMENT
    // -----------------------------------------
    const handleDelete = async (enrollment) => {
        // Prevent multiple delete operations
        if (deletingId !== null) {
            return;
        }

        const studentName =
            getStudentName(enrollment.student);

        const result = await Swal.fire({
            icon: 'warning',
            title: 'Delete Enrollment?',
            text: `Are you sure you want to delete the enrollment for ${studentName}?`,
            showCancelButton: true,
            confirmButtonText: 'Yes, Delete',
            cancelButtonText: 'Cancel',
            reverseButtons: true,
        });

        if (!result.isConfirmed) {
            return;
        }

        try {
            // Start row-level loading only.
            setDeletingId(enrollment.id);

            // API call will be connected later
        
            await api.delete(
                `/enrollments/${enrollment.id}`
            );
           

            if (mockStorage.deleteEnrollment) {
                mockStorage.deleteEnrollment(
                    enrollment.id
                );
            } else {
                const existing =
                    JSON.parse(
                        localStorage.getItem(
                            'sms_enrollments'
                        )
                    ) || [];

                const updated = existing.filter(
                    (item) =>
                        item.id !== enrollment.id
                );

                localStorage.setItem(
                    'sms_enrollments',
                    JSON.stringify(updated)
                );
            }

            // IMPORTANT:
            // Remove the row directly from React state.
            // This avoids fetchEnrollments() and therefore
            // avoids the full table loading again.
            setEnrollments((previous) =>
                previous.filter(
                    (item) =>
                        item.id !== enrollment.id
                )
            );

            await Swal.fire({
                icon: 'success',
                title: 'Enrollment Deleted!',
                text: `${studentName}'s enrollment has been deleted successfully.`,
                confirmButtonText: 'OK',
            });
        } catch (error) {
            console.error(
                'Enrollment delete error:',
                error
            );

            handleApiError(error);
        } finally {
            setDeletingId(null);
        }
    };

    // -----------------------------------------
    // GET STUDENT NAME
    // -----------------------------------------
    const getStudentName = (studentId) => {
        const student = students.find(
            (item) =>
                String(item.id) ===
                    String(studentId) ||
                String(item.student_id) ===
                    String(studentId)
        );

        if (student) {
            return (
                student.name ||
                student.student_name ||
                student.full_name ||
                String(studentId)
            );
        }

        return studentId || '-';
    };

    // -----------------------------------------
    // GET ACADEMIC YEAR NAME
    // -----------------------------------------
    const getAcademicYearName = (yearId) => {
        const year = academicYears.find(
            (item) =>
                String(item.id) ===
                String(yearId)
        );

        if (year) {
            return (
                year.name ||
                year.year ||
                String(yearId)
            );
        }

        return yearId || '-';
    };

    // -----------------------------------------
    // GET CLASS NAME
    // -----------------------------------------
    const getClassName = (classId) => {
        const classItem = classes.find(
            (item) =>
                String(item.id) ===
                String(classId)
        );

        if (classItem) {
            return (
                classItem.name ||
                classItem.class_name ||
                classItem.className ||
                String(classId)
            );
        }

        return classId || '-';
    };

    // -----------------------------------------
    // GET SECTION NAME
    // -----------------------------------------
    const getSectionName = (sectionId) => {
        const section = sections.find(
            (item) =>
                String(item.id) ===
                String(sectionId)
        );

        if (section) {
            return (
                section.name ||
                section.section_name ||
                String(sectionId)
            );
        }

        return sectionId || '-';
    };

    // -----------------------------------------
    // SEARCH
    // -----------------------------------------
    const filteredEnrollments =
        enrollments.filter((enrollment) => {
            const searchText =
                search.toLowerCase();

            return (
                String(
                    getStudentName(
                        enrollment.student
                    ) || ''
                )
                    .toLowerCase()
                    .includes(searchText) ||

                String(
                    getAcademicYearName(
                        enrollment.academic_year
                    ) || ''
                )
                    .toLowerCase()
                    .includes(searchText) ||

                String(
                    getClassName(
                        enrollment.class_name
                    ) || ''
                )
                    .toLowerCase()
                    .includes(searchText) ||

                String(
                    getSectionName(
                        enrollment.section
                    ) || ''
                )
                    .toLowerCase()
                    .includes(searchText) ||

                String(
                    enrollment.roll_number || ''
                )
                    .toLowerCase()
                    .includes(searchText)
            );
        });

    // -----------------------------------------
    // FIELD ERROR
    // -----------------------------------------
    const fieldError = (field) => {
        if (!errors[field]) {
            return null;
        }

        return (
            <div className="text-danger small mt-1">
                {Array.isArray(errors[field])
                    ? errors[field][0]
                    : errors[field]}
            </div>
        );
    };

    return (
        <div className="academic-years-page">

            {/* PAGE HEADER */}
            <div className="academic-years-header">

                <div>
                    <p className="section-kicker">
                        Academic
                    </p>

                    <h1>Enrollments</h1>

                    <p className="hero-copy">
                        Manage student enrollment records and information.
                    </p>
                </div>

                <button
                    className="btn btn-primary academic-years-add"
                    onClick={openAddModal}
                    disabled={deletingId !== null}
                >
                    <i
                        className="bi bi-plus-lg"
                        aria-hidden="true"
                    ></i>

                    Add Enrollment
                </button>

            </div>

            {/* ENROLLMENT TABLE PANEL */}
            <div className="dashboard-panel academic-years-panel">

                {/* PANEL HEADER */}
                <div className="academic-years-panel-heading">

                    <div>
                        <p className="section-kicker">
                            Academic management
                        </p>

                        <h2>Enrollment list</h2>
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
                                placeholder="Search enrollments..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(
                                        e.target.value
                                    )
                                }
                            />

                        </div>

                        <span className="panel-count">
                            {pagination.total || filteredEnrollments.length} records
                        </span>

                    </div>

                </div>

                <div className="academic-years-table-wrap">

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
                                Loading enrollments...
                            </p>

                        </div>

                    ) : filteredEnrollments.length === 0 ? (

                        /* EMPTY STATE */
                        <div className="academic-years-empty">

                            <i
                                className="bi bi-people"
                                aria-hidden="true"
                            ></i>

                            <h3>
                                {search
                                    ? 'No enrollments found'
                                    : 'No enrollments yet'}
                            </h3>

                            <p>
                                {search
                                    ? 'Try a different search.'
                                    : 'Add your first enrollment to get started.'}
                            </p>

                            {!search && (
                                <button
                                    className="btn btn-primary"
                                    onClick={openAddModal}
                                    disabled={
                                        deletingId !== null
                                    }
                                >
                                    <i className="bi bi-plus-lg me-2"></i>
                                    Add Enrollment
                                </button>
                            )}

                        </div>

                    ) : (

                        /* TABLE */
                        <>
                            <div className="table-responsive">

                            <table className="academic-years-table">

                                <thead>

                                    <tr>

                                        <th
                                            style={{
                                                width: '60px',
                                            }}
                                        >
                                            #
                                        </th>

                                        <th>
                                            Student
                                        </th>

                                        <th>
                                            Academic Year
                                        </th>

                                        <th>
                                            Class
                                        </th>

                                        <th>
                                            Section
                                        </th>

                                        <th>
                                            Roll Number
                                        </th>

                                        <th>
                                            Enrollment Date
                                        </th>

                                        <th>
                                            Status
                                        </th>

                                        <th
                                            style={{
                                                width: '120px',
                                                textAlign:
                                                    'right',
                                            }}
                                        >
                                            Actions
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {filteredEnrollments.map(
                                        (
                                            enrollment,
                                            index
                                        ) => {

                                            const isDeleting =
                                                deletingId ===
                                                enrollment.id;

                                            return (
                                                <tr
                                                    key={
                                                        enrollment.id
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
                                                                (pagination.from || ((pagination.current_page - 1) * pagination.per_page + 1)) +
                                                                    index
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

                                                                <i className="bi bi-person"></i>

                                                            </div>

                                                            <div>

                                                                <div className="fw-semibold">
                                                                    {getStudentName(
                                                                        enrollment.student
                                                                    )}
                                                                </div>

                                                                <div className="text-muted small">
                                                                    Student Enrollment
                                                                </div>

                                                            </div>

                                                        </div>

                                                    </td>

                                                    {/* ACADEMIC YEAR */}
                                                    <td>
                                                        {getAcademicYearName(
                                                            enrollment.academic_year
                                                        )}
                                                    </td>

                                                    {/* CLASS */}
                                                    <td>
                                                        {getClassName(
                                                            enrollment.class_name
                                                        )}
                                                    </td>

                                                    {/* SECTION */}
                                                    <td>
                                                        {getSectionName(
                                                            enrollment.section
                                                        )}
                                                    </td>

                                                    {/* ROLL NUMBER */}
                                                    <td>
                                                        {enrollment.roll_number ||
                                                            '-'}
                                                    </td>

                                                    {/* ENROLLMENT DATE */}
                                                    <td>
                                                        {enrollment.enrollment_date ||
                                                            '-'}
                                                    </td>

                                                    {/* STATUS */}
                                                    <td>

                                                        {enrollment.status ===
                                                        'active' ? (

                                                            <span className="status-badge active">
                                                                Active
                                                            </span>

                                                        ) : (

                                                            <span className="status-badge inactive">
                                                                {enrollment.status
                                                                    ? enrollment.status
                                                                          .charAt(
                                                                              0
                                                                          )
                                                                          .toUpperCase() +
                                                                      enrollment.status.slice(
                                                                          1
                                                                      )
                                                                    : 'Inactive'}
                                                            </span>

                                                        )}

                                                    </td>

                                                    {/* ACTIONS */}
                                                    <td>

                                                        <div className="academic-actions">

                                                            <button
                                                                type="button"
                                                                className="academic-action-button edit"
                                                                title="Edit enrollment"
                                                                onClick={() =>
                                                                    openEditModal(
                                                                        enrollment
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
                                                                title="Delete enrollment"
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        enrollment
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

                        <Pagination
                            pagination={pagination}
                            onPageChange={handlePageChange}
                            onPerPageChange={handlePerPageChange}
                        />
                    </>
                )}

                </div>

            </div>

            {/* ADD / EDIT MODAL */}
            {showModal && (
                <div className="student-modal-overlay">

                    <div className="student-modal">

                        {/* Modal Header */}
                        <div className="student-modal-header">

                            <div>

                                <span className="section-kicker">
                                    Enrollment
                                </span>

                                <h3>
                                    {editingEnrollment
                                        ? 'Edit Enrollment'
                                        : 'Add Enrollment'}
                                </h3>

                                <p>
                                    {editingEnrollment
                                        ? 'Update enrollment information.'
                                        : 'Create a new enrollment record.'}
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

                        {/* SCROLLABLE MODAL BODY */}
                        <div className="student-modal-body">

                            <form onSubmit={handleSubmit}>

                                <div className="student-form-grid">

                                    {/* Student */}
                                    <div className="form-group">

                                        <label>
                                            Student <span>*</span>
                                        </label>

                                        <select
                                            name="student"
                                            value={
                                                form.student
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            disabled={saving}
                                        >

                                            <option value="">
                                                Select student
                                            </option>

                                            {students.map(
                                                (student) => (

                                                    <option
                                                        key={
                                                            student.id
                                                        }
                                                        value={
                                                            student.id
                                                        }
                                                    >
                                                        {student.name ||
                                                            // student.student_name ||
                                                            // student.full_name ||
                                                            `Student ${student.id}`}
                                                    </option>

                                                )
                                            )}

                                        </select>

                                        {fieldError(
                                            'student'
                                        )}

                                    </div>

                                    {/* Academic Year */}
                                    <div className="form-group">

                                        <label>
                                            Academic Year{' '}
                                            <span>*</span>
                                        </label>

                                        <select
                                            name="academic_year"
                                            value={
                                                form.academic_year
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            disabled={saving}
                                        >

                                            <option value="">
                                                Select academic year
                                            </option>

                                            {academicYears.map(
                                                (year) => (

                                                    <option
                                                        key={
                                                            year.id
                                                        }
                                                        value={
                                                            year.id
                                                        }
                                                    >
                                                        {year.name ||
                                                            year.year ||
                                                            `Academic Year ${year.id}`}
                                                    </option>

                                                )
                                            )}

                                        </select>

                                        {fieldError(
                                            'academic_year'
                                        )}

                                    </div>

                                    {/* Class */}
                                    <div className="form-group">

                                        <label>
                                            Class <span>*</span>
                                        </label>

                                        <select
                                            name="class_name"
                                            value={
                                                form.class_name
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            disabled={saving}
                                        >

                                            <option value="">
                                                Select class
                                            </option>

                                            {classes.map(
                                                (
                                                    classItem
                                                ) => (

                                                    <option
                                                        key={
                                                            classItem.id
                                                        }
                                                        value={
                                                            classItem.id
                                                        }
                                                    >
                                                        {classItem.name ||
                                                            classItem.class_name ||
                                                            classItem.className ||
                                                            `Class ${classItem.id}`}
                                                    </option>

                                                )
                                            )}

                                        </select>

                                        {fieldError(
                                            'class_name'
                                        )}

                                    </div>

                                    {/* Section */}
                                    <div className="form-group">

                                        <label>
                                            Section <span>*</span>
                                        </label>

                                        <select
                                            name="section"
                                            value={
                                                form.section
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            disabled={saving}
                                        >

                                            <option value="">
                                                Select section
                                            </option>

                                            {sections.map(
                                                (
                                                    section
                                                ) => (

                                                    <option
                                                        key={
                                                            section.id
                                                        }
                                                        value={
                                                            section.id
                                                        }
                                                    >
                                                        {section.name ||
                                                            section.section_name ||
                                                            `Section ${section.id}`}
                                                    </option>

                                                )
                                            )}

                                        </select>

                                        {fieldError(
                                            'section'
                                        )}

                                    </div>

                                    {/* Roll Number */}
                                    <div className="form-group">

                                        <label>
                                            Roll Number{' '}
                                            <span>*</span>
                                        </label>

                                        <input
                                            type="text"
                                            name="roll_number"
                                            value={
                                                form.roll_number
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Enter roll number"
                                            disabled={saving}
                                        />

                                        {fieldError(
                                            'roll_number'
                                        )}

                                    </div>

                                    {/* Enrollment Date */}
                                    <div className="form-group">

                                        <label>
                                            Enrollment Date{' '}
                                            <span>*</span>
                                        </label>

                                        <input
                                            type="date"
                                            name="enrollment_date"
                                            value={
                                                form.enrollment_date
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            disabled={saving}
                                        />

                                        {fieldError(
                                            'enrollment_date'
                                        )}

                                    </div>

                                    {/* Status */}
                                    <div className="form-group">

                                        <label>
                                            Status <span>*</span>
                                        </label>

                                        <select
                                            name="status"
                                            value={
                                                form.status
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            disabled={saving}
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

                                </div>

                                {/* Modal Footer */}
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
                                        {saving
                                            ? 'Saving...'
                                            : editingEnrollment
                                              ? 'Update Enrollment'
                                              : 'Save Enrollment'}
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

