import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import api from "../../../services/api";

function Classes() {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        status: 'active',
    });

    const [errors, setErrors] = useState({});

    // Fetch classes
    const fetchClasses = async () => {
        try {
            setLoading(true);

            const response = await api.get('/classes');

            setClasses(response.data.data || response.data);
        } catch (error) {
            console.error(error);

            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to load classes.',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClasses();
    }, []);

    // Add class
    const handleAdd = () => {
        setEditingId(null);

        setFormData({
            name: '',
            description: '',
            status: 'active',
        });

        setErrors({});
        setShowModal(true);
    };

    // Edit class
    const handleEdit = (schoolClass) => {
        setEditingId(schoolClass.id);

        setFormData({
            name: schoolClass.name || '',
            description: schoolClass.description || '',
            status: schoolClass.status || 'active',
        });

        setErrors({});
        setShowModal(true);
    };

    // Handle input
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

        setErrors((previous) => ({
            ...previous,
            [name]: '',
        }));
    };

    // Create / Update
    const handleSubmit = async (e) => {
        e.preventDefault();

        setSaving(true);
        setErrors({});

        try {
            if (editingId) {
                await api.put(`/classes/${editingId}`, formData);

                Swal.fire({
                    icon: 'success',
                    title: 'Updated',
                    text: 'Class updated successfully.',
                    timer: 1500,
                    showConfirmButton: false,
                });
            } else {
                await api.post('/classes', formData);

                Swal.fire({
                    icon: 'success',
                    title: 'Created',
                    text: 'Class created successfully.',
                    timer: 1500,
                    showConfirmButton: false,
                });
            }

            setShowModal(false);

            await fetchClasses();
        } catch (error) {
            console.error(error);

            if (error.response?.status === 422) {
                setErrors(error.response.data.errors || {});

                Swal.fire({
                    icon: 'error',
                    title: 'Validation Error',
                    text: 'Please check the form fields.',
                });
            } else if (error.response?.status === 401) {
                Swal.fire({
                    icon: 'error',
                    title: 'Unauthenticated',
                    text: 'Your login session has expired.',
                });
            } else if (error.response?.status === 403) {
                Swal.fire({
                    icon: 'error',
                    title: 'Forbidden',
                    text: 'You do not have permission to perform this action.',
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Something went wrong.',
                });
            }
        } finally {
            setSaving(false);
        }
    };


   // Delete class
const handleDelete = async (id) => {
    const result = await Swal.fire({
        title: 'Delete Class?',
        text: 'This action cannot be undone.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it',
        cancelButtonText: 'Cancel',
    });

    if (!result.isConfirmed) {
        return;
    }

    try {
        await api.delete(`/classes/${id}`);

        Swal.fire({
            icon: 'success',
            title: 'Deleted',
            text: 'Class deleted successfully.',
            timer: 1500,
            showConfirmButton: false,
        });

        await fetchClasses();

    } catch (error) {
        console.error('Delete class error:', error);

        // Laravel validation / foreign key error
        if (error.response) {
            console.log('Status:', error.response.status);
            console.log('Response:', error.response.data);

            const message =
                error.response.data.message ||
                'Failed to delete class.';

            Swal.fire({
                icon: 'error',
                title: 'Cannot Delete Class',
                text: message,
            });

        } else if (error.request) {

            Swal.fire({
                icon: 'error',
                title: 'Server Error',
                text: 'The Laravel server did not respond.',
            });

        } else {

            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Failed to delete class.',
            });
        }
    }
};

    return (
        <div className="academic-years-page">
            {/* Page Header */}
            <div className="academic-years-header">
                <div>
                    <p className="section-kicker">School structure</p>
                    <h1>Classes</h1>
                    <p className="hero-copy">Manage school classes and descriptions.</p>
                </div>

                <button
                    className="btn btn-primary academic-years-add"
                    onClick={handleAdd}
                >
                    <i className="bi bi-plus-lg" aria-hidden="true"></i>
                    Add Class
                </button>
            </div>

            {/* Table */}
            <div className="dashboard-panel academic-years-panel">
                <div className="academic-years-panel-heading">
                    <div>
                        <p className="section-kicker">School structure</p>
                        <h2>Class list</h2>
                    </div>
                    <span className="panel-count">{classes.length} records</span>
                </div>

                <div className="academic-years-table-wrap">
                    {loading ? (
                        <div className="academic-years-empty">
                            <div
                                className="spinner-border spinner-border-sm text-primary"
                                role="status"
                            >
                                <span className="visually-hidden">Loading...</span>
                            </div>

                            <p>Loading classes...</p>
                        </div>
                    ) : classes.length === 0 ? (
                        <div className="academic-years-empty">
                            <i className="bi bi-building" aria-hidden="true"></i>

                            <h3>No classes yet</h3>

                            <p>Add your first class to get started.</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table academic-years-table align-middle mb-0">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Name</th>
                                        <th>Description</th>
                                        <th>Status</th>
                                        <th className="text-end">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {classes.map(
                                        (schoolClass, index) => (
                                            <tr key={schoolClass.id}>
                                                <td className="academic-years-index">{String(index + 1).padStart(2, '0')}</td>

                                                <td className="fw-semibold">
                                                    {schoolClass.name}
                                                </td>

                                                <td>
                                                    <span className="date-value">
                                                        {schoolClass.description || '-'}
                                                    </span>
                                                </td>

                                                <td>
                                                    {schoolClass.status ===
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
                                                        aria-label={`Edit ${schoolClass.name}`}
                                                        title={`Edit ${schoolClass.name}`}
                                                        onClick={() =>
                                                            handleEdit(
                                                                schoolClass
                                                            )
                                                        }
                                                    >
                                                        <i className="bi bi-pencil" aria-hidden="true"></i>
                                                    </button>

                                                    <button
                                                        className="academic-action-button delete"
                                                        aria-label={`Delete ${schoolClass.name}`}
                                                        title={`Delete ${schoolClass.name}`}
                                                        onClick={() =>
                                                            handleDelete(
                                                                schoolClass.id
                                                            )
                                                        }
                                                    >
                                                        <i className="bi bi-trash3" aria-hidden="true"></i>
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

            {/* Modal */}
            {showModal && (
                <div
                    className="modal fade show d-block"
                    tabIndex="-1"
                    style={{
                        backgroundColor: 'rgba(0,0,0,0.5)',
                    }}
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">

                            {/* Modal Header */}
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {editingId
                                        ? 'Edit Class'
                                        : 'Add Class'}
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
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">

                                    {/* Name */}
                                    <div className="mb-3">
                                        <label className="form-label">
                                            Class Name
                                        </label>

                                        <input
                                            type="text"
                                            name="name"
                                            className={`form-control ${
                                                errors.name
                                                    ? 'is-invalid'
                                                    : ''
                                            }`}
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Example: Class 1"
                                        />

                                        {errors.name && (
                                            <div className="invalid-feedback">
                                                {errors.name[0]}
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
                                            className={`form-control ${
                                                errors.description
                                                    ? 'is-invalid'
                                                    : ''
                                            }`}
                                            value={formData.description}
                                            onChange={handleChange}
                                            placeholder="Enter class description"
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
                                            className={`form-select ${
                                                errors.status
                                                    ? 'is-invalid'
                                                    : ''
                                            }`}
                                            value={formData.status}
                                            onChange={handleChange}
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

export default Classes;