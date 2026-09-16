import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import api from "../../../services/api";
// import api from "../../../services/api";
import { mockStorage } from "../../../services/mockData";

function Subjects() {
    const [subjects, setSubjects] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        code: '',
        description: '',
        status: 'active',
    });

    const [errors, setErrors] = useState({});

    // =========================
    // Load Subjects
    // =========================
    const fetchSubjects = async () => {
        try {
            setLoading(true);

            const response = await api.get('/subjects');
            // API call commented out:
            // const response = await api.get('/subjects');
            // setSubjects(response.data.data || response.data);

            setSubjects(response.data.data || response.data);
            const data = mockStorage.getSubjects();
            setSubjects(data);
        } catch (error) {
            console.error('Fetch subjects error:', error);

            Swal.fire({
                icon: 'error',
                title: 'Unable to Load Subjects',
                text:
                    error.response?.data?.message ||
                    'Something went wrong while loading subjects.',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchSubjects();
    }, []);

    // =========================
    // Input Change
    // =========================
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: null,
        }));
    };

    // =========================
    // Add Subject
    // =========================
    const handleAdd = () => {
        setEditingId(null);

        setFormData({
            name: '',
            code: '',
            description: '',
            status: 'active',
        });

        setErrors({});
        setShowModal(true);
    };

    // =========================
    // Edit Subject
    // =========================
    const handleEdit = (subject) => {
        setEditingId(subject.id);

        setFormData({
            name: subject.name || '',
            code: subject.code || '',
            description: subject.description || '',
            status: subject.status || 'active',
        });

        setErrors({});
        setShowModal(true);
    };

    // =========================
    // Format Validation Errors
    // =========================
    const getValidationMessage = (error) => {
        const validationErrors = error.response?.data?.errors;

        if (!validationErrors) {
            return (
                error.response?.data?.message ||
                'Please check the information and try again.'
            );
        }

        return Object.values(validationErrors)
            .flat()
            .join('\n');
    };

    // =========================
    // Save / Update
    // =========================
    const handleSubmit = async (e) => {
        e.preventDefault();

        setSaving(true);
        setErrors({});

        try {
            const data = {
                name: formData.name,
                code: formData.code,
                description: formData.description || null,
                status: formData.status,
            };

            if (editingId) {
                await api.put(`/subjects/${editingId}`, data);
                // API call commented out:
                // await api.put(`/subjects/${editingId}`, data);
                mockStorage.updateSubject(editingId, data);

                await Swal.fire({
                    icon: 'success',
                    title: 'Subject Updated',
                    text: 'Subject updated successfully.',
                    timer: 1500,
                    showConfirmButton: false,
                });
            } else {
                await api.post('/subjects', data);
                // API call commented out:
                // await api.post('/subjects', data);
                mockStorage.addSubject(data);

                await Swal.fire({
                    icon: 'success',
                    title: 'Subject Created',
                    text: 'Subject created successfully.',
                    timer: 1500,
                    showConfirmButton: false,
                });
            }

            setShowModal(false);

            await fetchSubjects();
        } catch (error) {
            console.error('Save subject error:', error);

            // Laravel validation error
            if (error.response?.status === 422) {
                const validationErrors =
                    error.response.data.errors || {};

                setErrors(validationErrors);

                await Swal.fire({
                    icon: 'warning',
                    title: 'Please Check Your Information',
                    text: getValidationMessage(error),
                    confirmButtonText: 'OK',
                });

                return;
            }

            // Unauthorized
            if (error.response?.status === 401) {
                await Swal.fire({
                    icon: 'error',
                    title: 'Unauthenticated',
                    text: 'Your login session has expired. Please login again.',
                });

                return;
            }

            // Forbidden
            if (error.response?.status === 403) {
                await Swal.fire({
                    icon: 'error',
                    title: 'Permission Denied',
                    text: 'You do not have permission to perform this action.',
                });

                return;
            }

            // Other errors
            await Swal.fire({
                icon: 'error',
                title: 'Unable to Save Subject',
                text:
                    error.response?.data?.message ||
                    'Something went wrong. Please try again.',
            });
        } finally {
            setSaving(false);
        }
    };

    // =========================
    // Delete Subject
    // =========================
    const handleDelete = async (id) => {
        const subject = subjects.find(
            (item) => item.id === id
        );

        const result = await Swal.fire({
            icon: 'warning',
            title: 'Delete Subject?',
            text: `Are you sure you want to delete ${subject?.name || 'this subject'}?`,
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it',
            cancelButtonText: 'Cancel',
        });

        if (!result.isConfirmed) {
            return;
        }

        try {
            await api.delete(`/subjects/${id}`);
            // API call commented out:
            // await api.delete(`/subjects/${id}`);
            mockStorage.deleteSubject(id);

            await Swal.fire({
                icon: 'success',
                title: 'Subject Deleted',
                text: 'Subject deleted successfully.',
                timer: 1500,
                showConfirmButton: false,
            });

            await fetchSubjects();
        } catch (error) {
            console.error('Delete subject error:', error);

            if (error.response?.status === 401) {
                Swal.fire({
                    icon: 'error',
                    title: 'Unauthenticated',
                    text: 'Please login again.',
                });

                return;
            }

            if (error.response?.status === 403) {
                Swal.fire({
                    icon: 'error',
                    title: 'Permission Denied',
                    text: 'You do not have permission to delete subjects.',
                });

                return;
            }

            if (error.response?.status === 409) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Cannot Delete Subject',
                    text:
                        error.response?.data?.message ||
                        'This subject is being used by other records.',
                });

                return;
            }

            Swal.fire({
                icon: 'error',
                title: 'Unable to Delete Subject',
                text:
                    error.response?.data?.message ||
                    'Something went wrong while deleting the subject.',
            });
        }
    };

    return (
        <div className="academic-years-page">

            {/* =========================
                Page Header
            ========================= */}
            <div className="academic-years-header">
                <div>
                    <p className="section-kicker">
                        School structure
                    </p>

                    <h1>Subjects</h1>

                    <p className="hero-copy">
                        Manage school subjects and subject details.
                    </p>
                </div>

                <button
                    className="btn btn-primary academic-years-add"
                    onClick={handleAdd}
                >
                    <i
                        className="bi bi-plus-lg"
                        aria-hidden="true"
                    ></i>

                    Add Subject
                </button>
            </div>

            {/* =========================
                Table
            ========================= */}
            <div className="dashboard-panel academic-years-panel">

                <div className="academic-years-panel-heading">

                    <div>
                        <p className="section-kicker">
                            School structure
                        </p>

                        <h2>Subject list</h2>
                    </div>

                    <span className="panel-count">
                        {subjects.length} records
                    </span>

                </div>

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
                                Loading subjects...
                            </p>

                        </div>

                    ) : subjects.length === 0 ? (

                        <div className="academic-years-empty">

                            <i
                                className="bi bi-book"
                                aria-hidden="true"
                            ></i>

                            <h3>
                                No subjects yet
                            </h3>

                            <p>
                                Add your first subject to get started.
                            </p>

                        </div>

                    ) : (

                        <div className="table-responsive">

                            <table className="table academic-years-table align-middle mb-0">

                                <thead>

                                    <tr>
                                        <th>#</th>
                                        <th>Name</th>
                                        <th>Code</th>
                                        <th>Description</th>
                                        <th>Status</th>

                                        <th className="text-end">
                                            Actions
                                        </th>
                                    </tr>

                                </thead>

                                <tbody>

                                    {subjects.map(
                                        (subject, index) => (

                                            <tr
                                                key={subject.id}
                                            >

                                                <td className="academic-years-index">
                                                    {String(
                                                        index + 1
                                                    ).padStart(
                                                        2,
                                                        '0'
                                                    )}
                                                </td>

                                                <td className="fw-semibold">
                                                    {subject.name}
                                                </td>

                                                <td>
                                                    <span className="badge bg-light text-dark border">
                                                        {subject.code}
                                                    </span>
                                                </td>

                                                <td>
                                                    <span className="date-value">
                                                        {subject.description ||
                                                            '-'}
                                                    </span>
                                                </td>

                                                <td>

                                                    {subject.status ===
                                                        'active' ? (

                                                        <span className="status-badge active">
                                                            Active
                                                        </span>

                                                    ) : (

                                                        <span className="status-badge inactive">
                                                            Inactive
                                                        </span>

                                                    )}

                                                </td>

                                                <td className="text-end">

                                                    <button
                                                        className="academic-action-button edit"
                                                        aria-label={`Edit ${subject.name}`}
                                                        title={`Edit ${subject.name}`}
                                                        onClick={() =>
                                                            handleEdit(
                                                                subject
                                                            )
                                                        }
                                                    >
                                                        <i
                                                            className="bi bi-pencil"
                                                            aria-hidden="true"
                                                        ></i>
                                                    </button>

                                                    <button
                                                        className="academic-action-button delete"
                                                        aria-label={`Delete ${subject.name}`}
                                                        title={`Delete ${subject.name}`}
                                                        onClick={() =>
                                                            handleDelete(
                                                                subject.id
                                                            )
                                                        }
                                                    >
                                                        <i
                                                            className="bi bi-trash3"
                                                            aria-hidden="true"
                                                        ></i>
                                                    </button>

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

            {/* =========================
                Modal
            ========================= */}
            {showModal && (

                <div
                    className="modal fade show d-block"
                    tabIndex="-1"
                    style={{
                        backgroundColor:
                            'rgba(0,0,0,0.5)',
                    }}
                >

                    <div className="modal-dialog modal-dialog-centered">

                        <div className="modal-content">

                            {/* Header */}
                            <div className="modal-header">

                                <h5 className="modal-title">
                                    {editingId
                                        ? 'Edit Subject'
                                        : 'Add Subject'}
                                </h5>

                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() =>
                                        setShowModal(false)
                                    }
                                ></button>

                            </div>

                            {/* Form */}
                            <form
                                onSubmit={handleSubmit}
                            >

                                <div className="modal-body">

                                    {/* Name */}
                                    <div className="mb-3">

                                        <label className="form-label">
                                            Subject Name
                                        </label>

                                        <input
                                            type="text"
                                            name="name"
                                            className={`form-control ${errors.name
                                                    ? 'is-invalid'
                                                    : ''
                                                }`}
                                            value={
                                                formData.name
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Example: Mathematics"
                                        />

                                        {errors.name && (
                                            <div className="invalid-feedback">
                                                {errors.name[0]}
                                            </div>
                                        )}

                                    </div>

                                    {/* Code */}
                                    <div className="mb-3">

                                        <label className="form-label">
                                            Subject Code
                                        </label>

                                        <input
                                            type="text"
                                            name="code"
                                            className={`form-control ${errors.code
                                                    ? 'is-invalid'
                                                    : ''
                                                }`}
                                            value={
                                                formData.code
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Example: MATH"
                                        />

                                        {errors.code && (
                                            <div className="invalid-feedback">
                                                {errors.code[0]}
                                            </div>
                                        )}

                                    </div>

                                    {/* Description */}
                                    <div className="mb-3">

                                        <label className="form-label">
                                            Description
                                        </label>

                                        <textarea
                                            name="description"
                                            rows="3"
                                            className={`form-control ${errors.description
                                                    ? 'is-invalid'
                                                    : ''
                                                }`}
                                            value={
                                                formData.description
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Enter subject description"
                                        ></textarea>

                                        {errors.description && (
                                            <div className="invalid-feedback">
                                                {errors.description[0]}
                                            </div>
                                        )}

                                    </div>

                                    {/* Status */}
                                    <div className="mb-3">

                                        <label className="form-label">
                                            Status
                                        </label>

                                        <select
                                            name="status"
                                            className={`form-select ${errors.status
                                                    ? 'is-invalid'
                                                    : ''
                                                }`}
                                            value={
                                                formData.status
                                            }
                                            onChange={
                                                handleChange
                                            }
                                        >

                                            <option value="active">
                                                Active
                                            </option>

                                            <option value="inactive">
                                                Inactive
                                            </option>

                                        </select>

                                        {errors.status && (
                                            <div className="invalid-feedback">
                                                {errors.status[0]}
                                            </div>
                                        )}

                                    </div>

                                </div>

                                {/* Footer */}
                                <div className="modal-footer">

                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() =>
                                            setShowModal(false)
                                        }
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        className="btn btn-primary"
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

                                                {editingId
                                                    ? 'Update'
                                                    : 'Save'}
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

export default Subjects;