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
    qualification: '',
    joining_date: '',
    salary: '',
    status: 'active',
};

export default function Teachers() {
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [editingTeacher, setEditingTeacher] = useState(null);

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
                title: 'Teacher Not Found',
                text: data.message || 'The requested teacher could not be found.',
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

    const fetchTeachers = async () => {
        try {
            setLoading(true);
            const response = await api.get('/teachers');
            const data = response.data?.data || response.data || [];
            setTeachers(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Fetch teachers error:', error);
            handleApiError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeachers();
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
        setEditingTeacher(null);
        setForm(initialForm);
        setErrors({});
        setSelectedPhotoFile(null);
        setPhotoPreview('');
        setShowModal(true);
    };

    const openEditModal = (teacher) => {
        setEditingTeacher(teacher);

        let formattedDob = '';
        if (teacher.date_of_birth) {
            formattedDob = teacher.date_of_birth.split('T')[0];
        }

        let formattedJoiningDate = '';
        if (teacher.joining_date) {
            formattedJoiningDate = teacher.joining_date.split('T')[0];
        }

        setForm({
            name: teacher.name || '',
            email: teacher.email || '',
            phone: teacher.phone || '',
            gender: teacher.gender || '',
            date_of_birth: formattedDob,
            address: teacher.address || '',
            qualification: teacher.qualification || '',
            joining_date: formattedJoiningDate,
            salary: teacher.salary || '',
            status: teacher.status || 'active',
        });

        setErrors({});
        setSelectedPhotoFile(null);
        setPhotoPreview(teacher.photo || '');
        setShowModal(true);
    };

    const closeModal = () => {
        if (photoPreview && photoPreview.startsWith('blob:')) {
            URL.revokeObjectURL(photoPreview);
        }

        setShowModal(false);
        setEditingTeacher(null);
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
        if (form.qualification) formData.append('qualification', form.qualification.trim());
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
            if (editingTeacher) {
                formData.append('_method', 'PUT');
                await api.post(`/teachers/${editingTeacher.id}`, formData, requestConfig);

                closeModal();
                await fetchTeachers();

                await Swal.fire({
                    icon: 'success',
                    title: 'Teacher Updated!',
                    text: 'Teacher information has been updated successfully.',
                    confirmButtonText: 'OK',
                });
            } else {
                await api.post('/teachers', formData, requestConfig);

                closeModal();
                await fetchTeachers();

                await Swal.fire({
                    icon: 'success',
                    title: 'Teacher Created!',
                    text: 'Teacher has been added successfully.',
                    confirmButtonText: 'OK',
                });
            }
        } catch (error) {
            console.error('Teacher save error:', error);
            handleApiError(error);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (teacher) => {
        const result = await Swal.fire({
            icon: 'warning',
            title: 'Delete Teacher?',
            text: `Are you sure you want to delete ${teacher.name}?`,
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
                text: 'Please wait while the teacher is being deleted.',
                allowOutsideClick: false,
                allowEscapeKey: false,
                didOpen: () => {
                    Swal.showLoading();
                },
            });

            await api.delete(`/teachers/${teacher.id}`);

            await Swal.fire({
                icon: 'success',
                title: 'Teacher Deleted!',
                text: `${teacher.name} has been deleted successfully.`,
                confirmButtonText: 'OK',
            });

            await fetchTeachers();
        } catch (error) {
            Swal.close();
            handleApiError(error);
        }
    };

    const filteredTeachers = teachers.filter((teacher) => {
        const searchText = search.toLowerCase();

        return (
            String(teacher.name || '')
                .toLowerCase()
                .includes(searchText) ||
            String(teacher.email || '')
                .toLowerCase()
                .includes(searchText) ||
            String(teacher.phone || '')
                .toLowerCase()
                .includes(searchText) ||
            String(teacher.qualification || '')
                .toLowerCase()
                .includes(searchText) ||
            String(teacher.status || '')
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

                    <h1>Teachers</h1>

                    <p className="hero-copy">
                        Manage teacher records and information.
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

                    Add Teacher
                </button>

            </div>

            {/* TEACHER TABLE PANEL */}
            <div className="dashboard-panel academic-years-panel">

                {/* PANEL HEADER */}
                <div className="academic-years-panel-heading">

                    <div>
                        <p className="section-kicker">
                            People management
                        </p>

                        <h2>Teacher list</h2>
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
                                placeholder="Search teachers..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                            />

                        </div>

                        <span className="panel-count">
                            {filteredTeachers.length} records
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
                                Loading teachers...
                            </p>

                        </div>

                    ) : filteredTeachers.length === 0 ? (

                        /* EMPTY STATE */
                        <div className="academic-years-empty">

                            <i
                                className="bi bi-person-workspace"
                                aria-hidden="true"
                            ></i>

                            <h3>
                                {search
                                    ? 'No teachers found'
                                    : 'No teachers yet'}
                            </h3>

                            <p>
                                {search
                                    ? 'Try a different search.'
                                    : 'Add your first teacher to get started.'}
                            </p>

                            {!search && (
                                <button
                                    className="btn btn-primary"
                                    onClick={openAddModal}
                                >
                                    <i className="bi bi-plus-lg me-2"></i>
                                    Add Teacher
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
                                            Qualification
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

                                    {filteredTeachers.map(
                                        (teacher, index) => (

                                            <tr key={teacher.id}>

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

                                                            {teacher.photo ? (
                                                                <img
                                                                    src={
                                                                        teacher.photo
                                                                    }
                                                                    alt={
                                                                        teacher.name
                                                                    }
                                                                />
                                                            ) : (
                                                                <i className="bi bi-person"></i>
                                                            )}

                                                        </div>

                                                        <div>

                                                            <div className="fw-semibold">
                                                                {
                                                                    teacher.name
                                                                }
                                                            </div>

                                                            <div className="text-muted small">
                                                                {
                                                                    teacher.email ||
                                                                    'No email'
                                                                }
                                                            </div>

                                                        </div>

                                                    </div>

                                                    {/* Address (small text below) */}
                                                    {teacher.address && (
                                                        <div className="text-muted small mt-1" style={{ maxWidth: '220px' }}>
                                                            {teacher.address}
                                                        </div>
                                                    )}

                                                </td>

                                                {/* PHONE */}
                                                <td>
                                                    {teacher.phone || '-'}
                                                </td>

                                                {/* GENDER */}
                                                <td>

                                                    {teacher.gender
                                                        ? teacher.gender
                                                            .charAt(0)
                                                            .toUpperCase() +
                                                        teacher.gender.slice(1)
                                                        : '-'}

                                                </td>

                                                {/* DATE OF BIRTH */}
                                                <td>
                                                    {teacher.date_of_birth
                                                        ? teacher.date_of_birth.split('T')[0]
                                                        : '-'}
                                                </td>

                                                {/* QUALIFICATION */}
                                                <td>
                                                    {teacher.qualification || '-'}
                                                </td>

                                                {/* JOINING DATE */}
                                                <td>
                                                    {teacher.joining_date
                                                        ? teacher.joining_date.split('T')[0]
                                                        : '-'}
                                                </td>

                                                {/* SALARY */}
                                                <td>
                                                    {formatCurrency(teacher.salary)}
                                                </td>

                                                {/* STATUS */}
                                                <td>

                                                    {teacher.status ===
                                                        'active' ? (

                                                        <span className="status-badge active">
                                                            Active
                                                        </span>

                                                    ) : (

                                                        <span className="status-badge inactive">
                                                            {teacher.status
                                                                ? teacher.status
                                                                    .charAt(0)
                                                                    .toUpperCase() +
                                                                teacher.status.slice(
                                                                    1
                                                                )
                                                                : 'Inactive'}
                                                        </span>

                                                    )}

                                                </td>

                                                {/* PHOTO */}
                                                <td>
                                                    {teacher.photo ? (
                                                        <div
                                                            className="rounded-circle overflow-hidden border"
                                                            style={{ width: '36px', height: '36px' }}
                                                        >
                                                            <img
                                                                src={teacher.photo}
                                                                alt={teacher.name}
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
                                                            title="Edit teacher"
                                                            onClick={() =>
                                                                openEditModal(
                                                                    teacher
                                                                )
                                                            }
                                                        >
                                                            <i className="bi bi-pencil"></i>
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className="academic-action-button delete"
                                                            title="Delete teacher"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    teacher
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
                                <span className="section-kicker">Teacher</span>
                                <h3>
                                    {editingTeacher ? 'Edit Teacher' : 'Add Teacher'}
                                </h3>
                                <p>
                                    {editingTeacher
                                        ? 'Update teacher information.'
                                        : 'Create a new teacher record.'}
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

                                    {/* Teacher Name */}
                                    <div className="form-group">
                                        <label>
                                            Name <span>*</span>
                                        </label>

                                        <input
                                            type="text"
                                            name="name"
                                            value={form.name}
                                            onChange={handleChange}
                                            placeholder="Enter teacher name"
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

                                    {/* Qualification */}
                                    <div className="form-group">
                                        <label>Qualification</label>

                                        <input
                                            type="text"
                                            name="qualification"
                                            value={form.qualification}
                                            onChange={handleChange}
                                            placeholder="e.g. M.Ed, B.Sc, MA"
                                            disabled={saving}
                                        />

                                        {fieldError('qualification')}
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
                                            placeholder="Enter teacher address"
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
                                            : editingTeacher
                                                ? 'Update Teacher'
                                                : 'Save Teacher'}
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
