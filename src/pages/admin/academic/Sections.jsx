import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import api from "../../../services/api";

function Sections() {
    const [sections, setSections] = useState([]);
    const [classes, setClasses] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        class_id: '',
        name: '',
        capacity: '',
        status: 'active',
    });

    const [errors, setErrors] = useState({});

    // =========================
    // GET SECTIONS
    // =========================
    const fetchSections = async () => {
        try {
            setLoading(true);
            const response = await api.get('/sections');
            const data = response.data?.data || response.data || [];
            setSections(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Fetch sections error:', error);
            setSections([]);

            const status = error.response?.status;
            const message = error.response?.data?.message || 'Failed to load sections.';

            if (status === 401) {
                Swal.fire({
                    icon: 'error',
                    title: 'Unauthenticated',
                    text: 'Please login again.',
                });
            } else if (status === 403) {
                Swal.fire({
                    icon: 'error',
                    title: 'Permission Denied',
                    text: 'You do not have permission to view sections.',
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Unable to Load Sections',
                    text: message,
                });
            }
        } finally {
            setLoading(false);
        }
    };

    // =========================
    // GET CLASSES
    // =========================
    const fetchClasses = async () => {
        try {
            const response = await api.get('/classes');
            const data = response.data?.data || response.data || [];
            setClasses(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Fetch classes error:', error);

            Swal.fire({
                icon: 'error',
                title: 'Unable to Load Classes',
                text:
                    error.response?.data?.message ||
                    'Failed to load classes.',
            });
        }
    };

    // =========================
    // PAGE LOAD
    // =========================
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchSections();
        fetchClasses();
    }, []);

    // =========================
    // INPUT CHANGE
    // =========================
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

        setErrors((previous) => ({
            ...previous,
            [name]: null,
        }));
    };

    // =========================
    // ADD
    // =========================
    const handleAdd = () => {
        setEditingId(null);

        setFormData({
            class_id: '',
            name: '',
            capacity: '',
            status: 'active',
        });

        setErrors({});
        setShowModal(true);
    };

    // =========================
    // EDIT
    // =========================
    const handleEdit = (section) => {
        setEditingId(section.id);

        setFormData({
            class_id: section.class_id || '',
            name: section.name || '',
            capacity: section.capacity ?? '',
            status: section.status || 'active',
        });

        setErrors({});
        setShowModal(true);
    };

    // =========================
    // VALIDATION MESSAGE
    // =========================
    const getValidationMessage = (error) => {
        const validationErrors =
            error.response?.data?.errors;

        if (!validationErrors) {
            return (
                error.response?.data?.message ||
                'Please check your information.'
            );
        }

        return Object.values(validationErrors)
            .flat()
            .join('\n');
    };

    // =========================
    // SAVE / UPDATE
    // =========================
    const handleSubmit = async (e) => {
        e.preventDefault();

        setSaving(true);
        setErrors({});

        try {
            const data = {
                class_id: formData.class_id,
                name: formData.name,
                capacity:
                    formData.capacity === ''
                        ? null
                        : Number(formData.capacity),
                status: formData.status,
            };

            console.log('Sending section data:', data);

            if (editingId) {
                await api.put(`/sections/${editingId}`, data);

                await Swal.fire({
                    icon: 'success',
                    title: 'Section Updated',
                    text: 'Section updated successfully.',
                    timer: 1500,
                    showConfirmButton: false,
                });
            } else {
                await api.post('/sections', data);

                await Swal.fire({
                    icon: 'success',
                    title: 'Section Created',
                    text: 'Section created successfully.',
                    timer: 1500,
                    showConfirmButton: false,
                });
            }

            setShowModal(false);

            await fetchSections();

        } catch (error) {
            console.error(
                'Save section error:',
                error
            );

            console.error(
                'Backend response:',
                error.response?.data
            );

            // 422 VALIDATION
            if (error.response?.status === 422) {
                const validationErrors =
                    error.response.data.errors || {};

                setErrors(validationErrors);

                await Swal.fire({
                    icon: 'warning',
                    title: 'Please Check Your Information',
                    text: getValidationMessage(error),
                });

                return;
            }

            // 401
            if (error.response?.status === 401) {
                await Swal.fire({
                    icon: 'error',
                    title: 'Unauthenticated',
                    text: 'Please login again.',
                });

                return;
            }

            // 403
            if (error.response?.status === 403) {
                await Swal.fire({
                    icon: 'error',
                    title: 'Permission Denied',
                    text:
                        error.response?.data?.message ||
                        'You do not have permission to save sections.',
                });

                return;
            }

            // OTHER ERROR
            await Swal.fire({
                icon: 'error',
                title: 'Unable to Save Section',
                text:
                    error.response?.data?.message ||
                    'Something went wrong.',
            });

        } finally {
            setSaving(false);
        }
    };

    // =========================
    // DELETE
    // =========================
    const handleDelete = async (id) => {
        const section = sections.find(
            (item) => item.id === id
        );

        const result = await Swal.fire({
            icon: 'warning',
            title: 'Delete Section?',
            text: `Are you sure you want to delete ${section?.name || 'this section'
                }?`,
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it',
            cancelButtonText: 'Cancel',
        });

        if (!result.isConfirmed) {
            return;
        }

        try {
            await api.delete(`/sections/${id}`);

            await Swal.fire({
                icon: 'success',
                title: 'Section Deleted',
                text: 'Section deleted successfully.',
                timer: 1500,
                showConfirmButton: false,
            });

            await fetchSections();

        } catch (error) {
            console.error(
                'Delete section error:',
                error
            );

            const status = error.response?.status;

            if (status === 401) {
                Swal.fire({
                    icon: 'error',
                    title: 'Unauthenticated',
                    text: 'Please login again.',
                });

                return;
            }

            if (status === 403) {
                Swal.fire({
                    icon: 'error',
                    title: 'Permission Denied',
                    text:
                        'You do not have permission to delete sections.',
                });

                return;
            }

            Swal.fire({
                icon: 'error',
                title: 'Unable to Delete Section',
                text:
                    error.response?.data?.message ||
                    'Something went wrong while deleting the section.',
            });
        }
    };

    return (
        <div className="academic-years-page">

            {/* HEADER */}
            <div className="academic-years-header">

                <div>
                    <p className="section-kicker">
                        School structure
                    </p>

                    <h1>Sections</h1>

                    <p className="hero-copy">
                        Manage class sections and capacity.
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

                    Add Section
                </button>

            </div>

            {/* TABLE PANEL */}
            <div className="dashboard-panel academic-years-panel">

                <div className="academic-years-panel-heading">

                    <div>
                        <p className="section-kicker">
                            School structure
                        </p>

                        <h2>Section list</h2>
                    </div>

                    <span className="panel-count">
                        {sections.length} records
                    </span>

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
                                Loading sections...
                            </p>

                        </div>

                    ) : sections.length === 0 ? (

                        /* EMPTY */
                        <div className="academic-years-empty">

                            <i
                                className="bi bi-diagram-3"
                                aria-hidden="true"
                            ></i>

                            <h3>
                                No sections yet
                            </h3>

                            <p>
                                Add your first section to get started.
                            </p>

                        </div>

                    ) : (

                        /* TABLE */
                        <div className="table-responsive">

                            <table className="table academic-years-table align-middle mb-0">

                                <thead>

                                    <tr>
                                        <th>#</th>
                                        <th>Class</th>
                                        <th>Section</th>
                                        <th>Capacity</th>
                                        <th>Status</th>
                                        <th className="text-end">
                                            Actions
                                        </th>
                                    </tr>

                                </thead>

                                <tbody>

                                    {sections.map(
                                        (section, index) => {

                                            const className =
                                                section.school_class?.name ||
                                                section.class?.name ||
                                                classes.find(
                                                    (schoolClass) =>
                                                        schoolClass.id ==
                                                        section.class_id
                                                )?.name ||
                                                '-';

                                            return (
                                                <tr
                                                    key={section.id}
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
                                                        {className}
                                                    </td>

                                                    <td>
                                                        <span className="date-value">
                                                            {section.name}
                                                        </span>
                                                    </td>

                                                    <td>
                                                        {section.capacity ??
                                                            '-'}
                                                    </td>

                                                    <td>

                                                        {section.status ===
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
                                                            title={`Edit ${section.name}`}
                                                            onClick={() =>
                                                                handleEdit(
                                                                    section
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
                                                            title={`Delete ${section.name}`}
                                                            onClick={() =>
                                                                handleDelete(
                                                                    section.id
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
                                            );
                                        }
                                    )}

                                </tbody>

                            </table>

                        </div>
                    )}

                </div>
            </div>

            {/* MODAL */}
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

                            <div className="modal-header">

                                <h5 className="modal-title">

                                    {editingId
                                        ? 'Edit Section'
                                        : 'Add Section'}

                                </h5>

                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() =>
                                        setShowModal(false)
                                    }
                                ></button>

                            </div>

                            <form
                                onSubmit={handleSubmit}
                            >

                                <div className="modal-body">

                                    {/* CLASS */}
                                    <div className="mb-3">

                                        <label className="form-label">
                                            Class
                                        </label>

                                        <select
                                            name="class_id"
                                            className={`form-select ${errors.class_id
                                                ? 'is-invalid'
                                                : ''
                                                }`}
                                            value={
                                                formData.class_id
                                            }
                                            onChange={
                                                handleChange
                                            }
                                        >

                                            <option value="">
                                                Select Class
                                            </option>

                                            {classes.map(
                                                (schoolClass) => (
                                                    <option
                                                        key={
                                                            schoolClass.id
                                                        }
                                                        value={
                                                            schoolClass.id
                                                        }
                                                    >
                                                        {
                                                            schoolClass.name
                                                        }
                                                    </option>
                                                )
                                            )}

                                        </select>

                                        {errors.class_id && (
                                            <div className="invalid-feedback">
                                                {
                                                    errors
                                                        .class_id[0]
                                                }
                                            </div>
                                        )}

                                    </div>

                                    {/* SECTION NAME */}
                                    <div className="mb-3">

                                        <label className="form-label">
                                            Section Name
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
                                            placeholder="Example: A"
                                        />

                                        {errors.name && (
                                            <div className="invalid-feedback">
                                                {
                                                    errors.name[0]
                                                }
                                            </div>
                                        )}

                                    </div>

                                    {/* CAPACITY */}
                                    <div className="mb-3">

                                        <label className="form-label">
                                            Capacity
                                        </label>

                                        <input
                                            type="number"
                                            name="capacity"
                                            min="1"
                                            className={`form-control ${errors.capacity
                                                ? 'is-invalid'
                                                : ''
                                                }`}
                                            value={
                                                formData.capacity
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Example: 40"
                                        />

                                        {errors.capacity && (
                                            <div className="invalid-feedback">
                                                {
                                                    errors
                                                        .capacity[0]
                                                }
                                            </div>
                                        )}

                                    </div>

                                    {/* STATUS */}
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
                                                {
                                                    errors
                                                        .status[0]
                                                }
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

export default Sections;