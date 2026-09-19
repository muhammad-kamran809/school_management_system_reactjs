import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import api from '../../../services/api';

const initialForm = {
    name: '',
    email: '',
    phone: '',
    gender: '',
    date_of_birth: '',
    address: '',
    designation: '',
    department: '',
    joining_date: '',
    salary: '',
    status: 'active',
};

export default function Staff() {
    const [staffList, setStaffList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [editingStaff, setEditingStaff] = useState(null);

    const [search, setSearch] = useState('');

    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState({});

    const [selectedPhotoFile, setSelectedPhotoFile] = useState(null);
    const [photoPreview, setPhotoPreview] = useState('');

    const handleApiError = (error) => {
        console.error('API Error:', error);

        if (!error.response) {
            Swal.fire({
                icon: 'error',
                title: 'Connection Error',
                text: 'Could not connect to the Laravel server. Please check your API server.',
                confirmButtonText: 'OK'
            });

            return;
        }

        const status = error.response.status;
        const data = error.response.data;

        if (status === 422) {
            const validationErrors = data.errors || {};
            setErrors(validationErrors);

            const messages = Object.values(validationErrors)
                .flat()
                .join('<br>');

            Swal.fire({
                icon: 'warning',
                title: 'Validation Error',
                html: messages || data.message || 'Please check the form.',
                confirmButtonText: 'OK'
            });

            return;
        }

        if (status === 401) {
            Swal.fire({
                icon: 'warning',
                title: 'Unauthenticated',
                text: 'Your login session has expired. Please login again.',
                confirmButtonText: 'OK'
            });

            return;
        }

        if (status === 403) {
            Swal.fire({
                icon: 'error',
                title: 'Permission Denied',
                text: data.message || 'You do not have permission to perform this action.',
                confirmButtonText: 'OK'
            });

            return;
        }

        if (status === 404) {
            Swal.fire({
                icon: 'error',
                title: 'Staff Not Found',
                text: data.message || 'The requested staff member could not be found.',
                confirmButtonText: 'OK'
            });

            return;
        }

        if (status === 500) {
            Swal.fire({
                icon: 'error',
                title: 'Server Error',
                text: data.message || 'Something went wrong on the Laravel server.',
                confirmButtonText: 'OK'
            });

            return;
        }

        Swal.fire({
            icon: 'error',
            title: 'Something Went Wrong',
            text: data.message || `Request failed with status ${status}.`,
            confirmButtonText: 'OK'
        });
    };

    const fetchStaff = async () => {
        try {
            setLoading(true);
            const response = await api.get('/staff');
            const data = response.data?.data || response.data || [];
            setStaffList(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Fetch staff error:', error);
            handleApiError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStaff();
    }, []);

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

    const handlePhotoChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            Swal.fire({
                icon: 'warning',
                title: 'Invalid File',
                text: 'Please select an image file (JPG, PNG, WebP, etc.).',
            });
            e.target.value = '';
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            Swal.fire({
                icon: 'warning',
                title: 'File Too Large',
                text: 'Please select an image under 5MB.',
            });
            e.target.value = '';
            return;
        }

        if (photoPreview && photoPreview.startsWith('blob:')) {
            URL.revokeObjectURL(photoPreview);
        }

        const previewUrl = URL.createObjectURL(file);
        setSelectedPhotoFile(file);
        setPhotoPreview(previewUrl);

        if (errors.photo) {
            setErrors((prev) => ({ ...prev, photo: undefined }));
        }
    };

    const openAddModal = () => {
        setEditingStaff(null);
        setForm(initialForm);
        setErrors({});
        setSelectedPhotoFile(null);
        setPhotoPreview('');
        setShowModal(true);
    };

    const openEditModal = (staff) => {
        setEditingStaff(staff);

        let formattedDob = '';
        if (staff.date_of_birth) {
            formattedDob = staff.date_of_birth.split('T')[0];
        }

        let formattedJoiningDate = '';
        if (staff.joining_date) {
            formattedJoiningDate = staff.joining_date.split('T')[0];
        }

        setForm({
            name: staff.name || '',
            email: staff.email || '',
            phone: staff.phone || '',
            gender: staff.gender || '',
            date_of_birth: formattedDob,
            address: staff.address || '',
            designation: staff.designation || '',
            department: staff.department || '',
            joining_date: formattedJoiningDate,
            salary: staff.salary || '',
            status: staff.status || 'active',
        });

        setErrors({});
        setSelectedPhotoFile(null);
        setPhotoPreview(staff.photo || '');
        setShowModal(true);
    };

    const closeModal = () => {
        if (photoPreview && photoPreview.startsWith('blob:')) {
            URL.revokeObjectURL(photoPreview);
        }

        setShowModal(false);
        setEditingStaff(null);
        setForm(initialForm);
        setErrors({});
        setSelectedPhotoFile(null);
        setPhotoPreview('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (saving) {
            return;
        }

        setSaving(true);
        setErrors({});

        const formData = new FormData();

        formData.append('name', form.name);
        if (form.email) formData.append('email', form.email.trim());
        if (form.phone) formData.append('phone', form.phone.trim());
        if (form.gender) formData.append('gender', form.gender);
        if (form.date_of_birth) formData.append('date_of_birth', form.date_of_birth);
        if (form.address) formData.append('address', form.address.trim());
        if (form.designation) formData.append('designation', form.designation);
        if (form.department) formData.append('department', form.department.trim());
        if (form.joining_date) formData.append('joining_date', form.joining_date);
        if (form.salary) formData.append('salary', form.salary);
        formData.append('status', form.status);

        if (selectedPhotoFile) {
            formData.append('photo', selectedPhotoFile);
        }

        const requestConfig = {
            headers: {
                'Content-Type': undefined,
            },
        };

        try {
            if (editingStaff) {
                formData.append('_method', 'PUT');
                await api.post(`/staff/${editingStaff.id}`, formData, requestConfig);

                closeModal();
                await fetchStaff();

                await Swal.fire({
                    icon: 'success',
                    title: 'Staff Updated!',
                    text: 'Staff information has been updated successfully.',
                    confirmButtonText: 'OK',
                });
            } else {
                await api.post('/staff', formData, requestConfig);

                closeModal();
                await fetchStaff();

                await Swal.fire({
                    icon: 'success',
                    title: 'Staff Created!',
                    text: 'Staff member has been added successfully.',
                    confirmButtonText: 'OK',
                });
            }
        } catch (error) {
            console.error('Staff save error:', error);
            handleApiError(error);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (staff) => {
        const result = await Swal.fire({
            icon: 'warning',
            title: 'Delete Staff?',
            text: `Are you sure you want to delete ${staff.name}?`,
            showCancelButton: true,
            confirmButtonText: 'Yes, Delete',
            cancelButtonText: 'Cancel',
            reverseButtons: true,
        });

        if (!result.isConfirmed) {
            return;
        }

        try {
            Swal.fire({
                title: 'Deleting...',
                text: 'Please wait while the staff member is being deleted.',
                allowOutsideClick: false,
                allowEscapeKey: false,
                didOpen: () => {
                    Swal.showLoading();
                },
            });

            await api.delete(`/staff/${staff.id}`);

            await Swal.fire({
                icon: 'success',
                title: 'Staff Deleted!',
                text: `${staff.name} has been deleted successfully.`,
                confirmButtonText: 'OK',
            });

            await fetchStaff();
        } catch (error) {
            Swal.close();
            handleApiError(error);
        }
    };

    const filteredStaff = staffList.filter((staff) => {
        const searchText = search.toLowerCase();

        return (
            String(staff.name || '')
                .toLowerCase()
                .includes(searchText) ||
            String(staff.email || '')
                .toLowerCase()
                .includes(searchText) ||
            String(staff.phone || '')
                .toLowerCase()
                .includes(searchText) ||
            String(staff.designation || '')
                .toLowerCase()
                .includes(searchText) ||
            String(staff.department || '')
                .toLowerCase()
                .includes(searchText) ||
            String(staff.status || '')
                .toLowerCase()
                .includes(searchText)
        );
    });

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

    const formatCurrency = (value) => {
        if (!value) return '-';
        const num = Number(value);
        if (isNaN(num)) return value;
        return num.toLocaleString();
    };

    return (
        <div className="academic-years-page">

            {/* PAGE HEADER */}
            <div className="academic-years-header">

                <div>
                    <p className="section-kicker">
                        People
                    </p>

                    <h1>Staff</h1>

                    <p className="hero-copy">
                        Manage staff records and information.
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

                    Add Staff
                </button>

            </div>

            {/* STAFF TABLE PANEL */}
            <div className="dashboard-panel academic-years-panel">

                {/* PANEL HEADER */}
                <div className="academic-years-panel-heading">

                    <div>
                        <p className="section-kicker">
                            People management
                        </p>

                        <h2>Staff list</h2>
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
                                placeholder="Search staff..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                            />

                        </div>

                        <span className="panel-count">
                            {filteredStaff.length} records
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
                                Loading staff...
                            </p>

                        </div>

                    ) : filteredStaff.length === 0 ? (

                        /* EMPTY STATE */
                        <div className="academic-years-empty">

                            <i
                                className="bi bi-person-badge"
                                aria-hidden="true"
                            ></i>

                            <h3>
                                {search
                                    ? 'No staff found'
                                    : 'No staff yet'}
                            </h3>

                            <p>
                                {search
                                    ? 'Try a different search.'
                                    : 'Add your first staff member to get started.'}
                            </p>

                            {!search && (
                                <button
                                    className="btn btn-primary"
                                    onClick={openAddModal}
                                >
                                    <i className="bi bi-plus-lg me-2"></i>
                                    Add Staff
                                </button>
                            )}

                        </div>

                    ) : (

                        /* TABLE */
                        <div className="table-responsive">

                            <table className="academic-years-table">

                                <thead>

                                    <tr>

                                        <th style={{ width: '60px' }}>
                                            #
                                        </th>

                                        <th>
                                            Name
                                        </th>

                                        <th>
                                            Phone
                                        </th>

                                        <th>
                                            Gender
                                        </th>

                                        <th>
                                            Date of Birth
                                        </th>

                                        <th>
                                            Designation
                                        </th>

                                        <th>
                                            Department
                                        </th>

                                        <th>
                                            Joining Date
                                        </th>

                                        <th>
                                            Salary
                                        </th>

                                        <th>
                                            Status
                                        </th>

                                        <th>
                                            Photo
                                        </th>

                                        <th
                                            style={{
                                                width: '120px',
                                                textAlign: 'right'
                                            }}
                                        >
                                            Actions
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {filteredStaff.map(
                                        (staff, index) => (

                                            <tr key={staff.id}>

                                                {/* NUMBER */}
                                                <td>
                                                    <span className="academic-years-index">
                                                        {String(
                                                            index + 1
                                                        ).padStart(
                                                            2,
                                                            '0'
                                                        )}
                                                    </span>
                                                </td>

                                                {/* NAME & EMAIL */}
                                                <td>

                                                    <div className="student-table-name">

                                                        <div className="student-avatar">

                                                            {staff.photo ? (
                                                                <img
                                                                    src={
                                                                        staff.photo
                                                                    }
                                                                    alt={
                                                                        staff.name
                                                                    }
                                                                />
                                                            ) : (
                                                                <i className="bi bi-person"></i>
                                                            )}

                                                        </div>

                                                        <div>

                                                            <div className="fw-semibold">
                                                                {
                                                                    staff.name
                                                                }
                                                            </div>

                                                            <div className="text-muted small">
                                                                {
                                                                    staff.email ||
                                                                    'No email'
                                                                }
                                                            </div>

                                                        </div>

                                                    </div>

                                                    {/* Address (small text below) */}
                                                    {staff.address && (
                                                        <div className="text-muted small mt-1" style={{ maxWidth: '220px' }}>
                                                            {staff.address}
                                                        </div>
                                                    )}

                                                </td>

                                                {/* PHONE */}
                                                <td>
                                                    {staff.phone || '-'}
                                                </td>

                                                {/* GENDER */}
                                                <td>

                                                    {staff.gender
                                                        ? staff.gender
                                                            .charAt(0)
                                                            .toUpperCase() +
                                                        staff.gender.slice(1)
                                                        : '-'}

                                                </td>

                                                {/* DATE OF BIRTH */}
                                                <td>
                                                    {staff.date_of_birth
                                                        ? staff.date_of_birth.split('T')[0]
                                                        : '-'}
                                                </td>

                                                {/* DESIGNATION */}
                                                <td>
                                                    {staff.designation || '-'}
                                                </td>

                                                {/* DEPARTMENT */}
                                                <td>
                                                    {staff.department || '-'}
                                                </td>

                                                {/* JOINING DATE */}
                                                <td>
                                                    {staff.joining_date
                                                        ? staff.joining_date.split('T')[0]
                                                        : '-'}
                                                </td>

                                                {/* SALARY */}
                                                <td>
                                                    {formatCurrency(staff.salary)}
                                                </td>

                                                {/* STATUS */}
                                                <td>

                                                    {staff.status ===
                                                        'active' ? (

                                                        <span className="status-badge active">
                                                            Active
                                                        </span>

                                                    ) : (

                                                        <span className="status-badge inactive">
                                                            {staff.status
                                                                ? staff.status
                                                                    .charAt(0)
                                                                    .toUpperCase() +
                                                                staff.status.slice(
                                                                    1
                                                                )
                                                                : 'Inactive'}
                                                        </span>

                                                    )}

                                                </td>

                                                {/* PHOTO */}
                                                <td>
                                                    {staff.photo ? (
                                                        <div
                                                            className="rounded-circle overflow-hidden border"
                                                            style={{ width: '36px', height: '36px' }}
                                                        >
                                                            <img
                                                                src={staff.photo}
                                                                alt={staff.name}
                                                                style={{
                                                                    width: '100%',
                                                                    height: '100%',
                                                                    objectFit: 'cover'
                                                                }}
                                                            />
                                                        </div>
                                                    ) : (
                                                        <span className="text-muted small">-</span>
                                                    )}
                                                </td>

                                                {/* ACTIONS */}
                                                <td>

                                                    <div className="academic-actions">

                                                        <button
                                                            type="button"
                                                            className="academic-action-button edit"
                                                            title="Edit staff"
                                                            onClick={() =>
                                                                openEditModal(
                                                                    staff
                                                                )
                                                            }
                                                        >
                                                            <i className="bi bi-pencil"></i>
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className="academic-action-button delete"
                                                            title="Delete staff"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    staff
                                                                )
                                                            }
                                                        >
                                                            <i className="bi bi-trash3"></i>
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

                        {/* Modal Header */}
                        <div className="student-modal-header">
                            <div>
                                <span className="section-kicker">Staff</span>
                                <h3>
                                    {editingStaff ? 'Edit Staff' : 'Add Staff'}
                                </h3>
                                <p>
                                    {editingStaff
                                        ? 'Update staff information.'
                                        : 'Create a new staff record.'}
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

                                    {/* Staff Name */}
                                    <div className="form-group">
                                        <label>
                                            Name <span>*</span>
                                        </label>

                                        <input
                                            type="text"
                                            name="name"
                                            value={form.name}
                                            onChange={handleChange}
                                            placeholder="Enter staff name"
                                            disabled={saving}
                                        />

                                        {fieldError('name')}
                                    </div>

                                    {/* Email */}
                                    <div className="form-group">
                                        <label>Email</label>

                                        <input
                                            type="email"
                                            name="email"
                                            value={form.email}
                                            onChange={handleChange}
                                            placeholder="Enter email address"
                                            disabled={saving}
                                        />

                                        {fieldError('email')}
                                    </div>

                                    {/* Phone */}
                                    <div className="form-group">
                                        <label>Phone</label>

                                        <input
                                            type="text"
                                            name="phone"
                                            value={form.phone}
                                            onChange={handleChange}
                                            placeholder="Enter phone number"
                                            disabled={saving}
                                        />

                                        {fieldError('phone')}
                                    </div>

                                    {/* Gender */}
                                    <div className="form-group">
                                        <label>Gender</label>

                                        <select
                                            name="gender"
                                            value={form.gender}
                                            onChange={handleChange}
                                            disabled={saving}
                                        >
                                            <option value="">Select gender</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                        </select>

                                        {fieldError('gender')}
                                    </div>

                                    {/* Date of Birth */}
                                    <div className="form-group">
                                        <label>Date of Birth</label>

                                        <input
                                            type="date"
                                            name="date_of_birth"
                                            value={form.date_of_birth}
                                            onChange={handleChange}
                                            disabled={saving}
                                        />

                                        {fieldError('date_of_birth')}
                                    </div>

                                    {/* Designation */}
                                    <div className="form-group">
                                        <label>
                                            Designation <span>*</span>
                                        </label>

                                        <input
                                            type="text"
                                            name="designation"
                                            value={form.designation}
                                            onChange={handleChange}
                                            placeholder="e.g. Accountant, Clerk, Librarian"
                                            disabled={saving}
                                        />

                                        {fieldError('designation')}
                                    </div>

                                    {/* Department */}
                                    <div className="form-group">
                                        <label>Department</label>

                                        <input
                                            type="text"
                                            name="department"
                                            value={form.department}
                                            onChange={handleChange}
                                            placeholder="e.g. Administration, Finance, IT"
                                            disabled={saving}
                                        />

                                        {fieldError('department')}
                                    </div>

                                    {/* Joining Date */}
                                    <div className="form-group">
                                        <label>Joining Date</label>

                                        <input
                                            type="date"
                                            name="joining_date"
                                            value={form.joining_date}
                                            onChange={handleChange}
                                            disabled={saving}
                                        />

                                        {fieldError('joining_date')}
                                    </div>

                                    {/* Salary */}
                                    <div className="form-group">
                                        <label>Salary</label>

                                        <input
                                            type="number"
                                            name="salary"
                                            value={form.salary}
                                            onChange={handleChange}
                                            placeholder="Enter salary amount"
                                            min="0"
                                            step="0.01"
                                            disabled={saving}
                                        />

                                        {fieldError('salary')}
                                    </div>

                                    {/* Status */}
                                    <div className="form-group">
                                        <label>Status</label>

                                        <select
                                            name="status"
                                            value={form.status}
                                            onChange={handleChange}
                                            disabled={saving}
                                        >
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                        </select>

                                        {fieldError('status')}
                                    </div>

                                    {/* Photo Upload */}
                                    <div className="form-group full-width">
                                        <label>Photo</label>

                                        <div className="d-flex align-items-center gap-3">
                                            {/* Preview */}
                                            <div
                                                className="rounded-circle overflow-hidden border bg-light d-flex align-items-center justify-content-center flex-shrink-0"
                                                style={{ width: '80px', height: '80px' }}
                                            >
                                                {photoPreview ? (
                                                    <img
                                                        src={photoPreview}
                                                        alt="Preview"
                                                        style={{
                                                            width: '100%',
                                                            height: '100%',
                                                            objectFit: 'cover',
                                                        }}
                                                    />
                                                ) : (
                                                    <i className="bi bi-person fs-3 text-muted"></i>
                                                )}
                                            </div>

                                            {/* File Input */}
                                            <div className="flex-grow-1">
                                                <input
                                                    type="file"
                                                    className="form-control"
                                                    accept="image/*"
                                                    onChange={handlePhotoChange}
                                                    disabled={saving}
                                                />
                                                <small className="text-muted d-block mt-1">
                                                    Select an image from your PC (max 5MB). JPG, PNG, WebP supported.
                                                </small>
                                            </div>
                                        </div>

                                        {fieldError('photo')}
                                    </div>

                                    {/* Address */}
                                    <div className="form-group full-width">
                                        <label>Address</label>

                                        <textarea
                                            name="address"
                                            value={form.address}
                                            onChange={handleChange}
                                            placeholder="Enter staff address"
                                            rows="3"
                                            disabled={saving}
                                        />

                                        {fieldError('address')}
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
                                            : editingStaff
                                                ? 'Update Staff'
                                                : 'Save Staff'}
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
