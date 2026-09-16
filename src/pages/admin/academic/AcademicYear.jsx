import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import api from "../../../services/api";
// import api from "../../../services/api";
import { mockStorage } from "../../../services/mockData";

function AcademicYears() {
    const [academicYears, setAcademicYears] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        start_date: '',
        end_date: '',
        status: 'active',
    });

    const [errors, setErrors] = useState({});

    // Load academic years
    const fetchAcademicYears = async () => {
        try {
            setLoading(true);

            const response = await api.get('/academic-years');
            // API call commented out:
            // const response = await api.get('/academic-years');
            // setAcademicYears(response.data.data || response.data);

            setAcademicYears(response.data.data || response.data);
            const data = mockStorage.getAcademicYears();
            setAcademicYears(data);
        } catch (error) {
            console.error(error);

            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to load academic years.',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchAcademicYears();
    }, []);

    // Open Add Modal
    const handleAdd = () => {
        setEditingId(null);

        setFormData({
            name: '',
            start_date: '',
            end_date: '',
            status: 'active',
        });

        setErrors({});
        setShowModal(true);
    };

    // Open Edit Modal
    const handleEdit = (academicYear) => {
        setEditingId(academicYear.id);

        setFormData({
            name: academicYear.name || '',
            start_date: academicYear.start_date || '',
            end_date: academicYear.end_date || '',
            status: academicYear.status || 'active',
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

    // Save / Update
    const handleSubmit = async (e) => {
        e.preventDefault();

        setSaving(true);
        setErrors({});

        try {
            if (editingId) {
                await api.put(`/academic-years/${editingId}`, formData);
                // API call commented out:
                // await api.put(`/academic-years/${editingId}`, formData);
                mockStorage.updateAcademicYear(editingId, formData);

                Swal.fire({
                    icon: 'success',
                    title: 'Updated',
                    text: 'Academic year updated successfully.',
                    timer: 1500,
                    showConfirmButton: false,
                });
            } else {
                await api.post('/academic-years', formData);
                // API call commented out:
                // await api.post('/academic-years', formData);
                mockStorage.addAcademicYear(formData);

                Swal.fire({
                    icon: 'success',
                    title: 'Created',
                    text: 'Academic year created successfully.',
                    timer: 1500,
                    showConfirmButton: false,
                });
            }

            setShowModal(false);

            await fetchAcademicYears();
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

    // Delete
    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Delete Academic Year?',
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
            await api.delete(`/academic-years/${id}`);
            // API call commented out:
            // await api.delete(`/academic-years/${id}`);
            mockStorage.deleteAcademicYear(id);

            Swal.fire({
                icon: 'success',
                title: 'Deleted',
                text: 'Academic year deleted successfully.',
                timer: 1500,
                showConfirmButton: false,
            });

            await fetchAcademicYears();
        } catch (error) {
            console.error(error);

            if (error.response?.status === 403) {
                Swal.fire({
                    icon: 'error',
                    title: 'Forbidden',
                    text: 'You do not have permission to delete academic years.',
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to delete academic year.',
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
                    <h1>Academic years</h1>
                    <p className="hero-copy">Manage the school calendar and active terms.</p>
                </div>

                <button
                    className="btn btn-primary academic-years-add"
                    onClick={handleAdd}
                >
                    <i className="bi bi-plus-lg" aria-hidden="true"></i>
                    Add Academic Year
                </button>
            </div>

            {/* Table */}
            <div className="dashboard-panel academic-years-panel">
                <div className="academic-years-panel-heading">
                    <div>
                        <p className="section-kicker">Calendar</p>
                        <h2>Academic year list</h2>
                    </div>
                    <span className="panel-count">{academicYears.length} records</span>
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

                            <p>Loading academic years...</p>
                        </div>
                    ) : academicYears.length === 0 ? (
                        <div className="academic-years-empty">
                            <i className="bi bi-calendar-x" aria-hidden="true"></i>

                            <h3>No academic years yet</h3>

                            <p>Add your first academic year to get started.</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table academic-years-table align-middle mb-0">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Name</th>
                                        <th>Start Date</th>
                                        <th>End Date</th>
                                        <th>Status</th>
                                        <th className="text-end">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {academicYears.map(
                                        (academicYear, index) => (
                                            <tr key={academicYear.id}>
                                                <td className="academic-years-index">{String(index + 1).padStart(2, '0')}</td>

                                                <td className="fw-semibold">
                                                    {academicYear.name}
                                                </td>

                                                <td>
                                                    <span className="date-value">{academicYear.start_date}</span>
                                                </td>

                                                <td>
                                                    <span className="date-value">{academicYear.end_date}</span>
                                                </td>

                                                <td>
                                                    {academicYear.status ===
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
                                                        aria-label={`Edit ${academicYear.name}`}
                                                        title={`Edit ${academicYear.name}`}
                                                        onClick={() =>
                                                            handleEdit(
                                                                academicYear
                                                            )
                                                        }
                                                    >
                                                        <i className="bi bi-pencil" aria-hidden="true"></i>
                                                    </button>

                                                    <button
                                                        className="academic-action-button delete"
                                                        aria-label={`Delete ${academicYear.name}`}
                                                        title={`Delete ${academicYear.name}`}
                                                        onClick={() =>
                                                            handleDelete(
                                                                academicYear.id
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

            {/* Add/Edit Modal */}
            {showModal && (
                <div
                    className="modal fade show d-block"
                    tabIndex="-1"
                    style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {editingId
                                        ? 'Edit Academic Year'
                                        : 'Add Academic Year'}
                                </h5>

                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowModal(false)}
                                ></button>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    {/* Name */}
                                    <div className="mb-3">
                                        <label className="form-label">
                                            Academic Year Name
                                        </label>

                                        <input
                                            type="text"
                                            name="name"
                                            className={`form-control ${errors.name
                                                    ? 'is-invalid'
                                                    : ''
                                                }`}
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Example: 2026-2027"
                                        />

                                        {errors.name && (
                                            <div className="invalid-feedback">
                                                {errors.name[0]}
                                            </div>
                                        )}
                                    </div>

                                    {/* Start Date */}
                                    <div className="mb-3">
                                        <label className="form-label">
                                            Start Date
                                        </label>

                                        <input
                                            type="date"
                                            name="start_date"
                                            className={`form-control ${errors.start_date
                                                    ? 'is-invalid'
                                                    : ''
                                                }`}
                                            value={formData.start_date}
                                            onChange={handleChange}
                                        />

                                        {errors.start_date && (
                                            <div className="invalid-feedback">
                                                {errors.start_date[0]}
                                            </div>
                                        )}
                                    </div>

                                    {/* End Date */}
                                    <div className="mb-3">
                                        <label className="form-label">
                                            End Date
                                        </label>

                                        <input
                                            type="date"
                                            name="end_date"
                                            className={`form-control ${errors.end_date
                                                    ? 'is-invalid'
                                                    : ''
                                                }`}
                                            value={formData.end_date}
                                            onChange={handleChange}
                                        />

                                        {errors.end_date && (
                                            <div className="invalid-feedback">
                                                {errors.end_date[0]}
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

export default AcademicYears;