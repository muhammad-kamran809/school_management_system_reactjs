
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

// API will be connected later by backend developer
// import api from '../../../services/api';

import { mockStorage } from '../../../services/mockData';

const STORAGE_KEY = 'sms_school_settings';

const initialForm = {
    school_name: '',
    school_logo: '',
    email: '',
    phone: '',
    address: '',
    website: '',
    principal_name: '',
};

const demoSchoolSettings = {
    id: 'SCHOOL-001',
    school_name: 'Al Noor Public School',
    school_logo: '',
    email: 'info@alnoorpublicschool.com',
    phone: '+92 300 1234567',
    address: 'Main Raiwind Road, Lahore, Pakistan',
    website: 'https://www.alnoorpublicschool.com',
    principal_name: 'Muhammad Ahmed',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
};

const getLocalSettings = () => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);

        if (stored) {
            return JSON.parse(stored);
        }

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(demoSchoolSettings)
        );

        return demoSchoolSettings;
    } catch (error) {
        console.error('Error reading school settings:', error);
        return demoSchoolSettings;
    }
};

const saveLocalSettings = (data) => {
    try {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(data)
        );
    } catch (error) {
        console.error('Error saving school settings:', error);
    }
};

const getInitials = (name = '') => {
    const words = name.trim().split(/\s+/).filter(Boolean);

    if (words.length === 0) {
        return 'SC';
    }

    if (words.length === 1) {
        return words[0].substring(0, 2).toUpperCase();
    }

    return (
        words[0].charAt(0) +
        words[words.length - 1].charAt(0)
    ).toUpperCase();
};

const SchoolSettings = () => {
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [showModal, setShowModal] = useState(false);

    const [formData, setFormData] = useState(initialForm);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        setLoading(true);

        try {
            let data = null;

            // API will be connected later
            // const response = await api.get('/school-settings');
            // data = response.data;

            if (
                mockStorage &&
                typeof mockStorage.getSchoolSettings === 'function'
            ) {
                data = mockStorage.getSchoolSettings();
            }

            if (!data) {
                data = getLocalSettings();
            }

            // If mockStorage returns an empty value,
            // create demo data for testing.
            if (!data) {
                data = demoSchoolSettings;
                saveLocalSettings(data);
            }

            setSettings(data);
        } catch (error) {
            console.error('Error loading school settings:', error);

            const fallbackData = getLocalSettings();

            setSettings(fallbackData);
        } finally {
            setLoading(false);
        }
    };

    const openEditModal = () => {
        if (!settings) {
            return;
        }

        setFormData({
            school_name: settings.school_name || '',
            school_logo: settings.school_logo || '',
            email: settings.email || '',
            phone: settings.phone || '',
            address: settings.address || '',
            website: settings.website || '',
            principal_name: settings.principal_name || '',
        });

        setErrors({});
        setShowModal(true);
    };

    const closeModal = () => {
        if (saving) {
            return;
        }

        setShowModal(false);
        setErrors({});
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: '',
            }));
        }
    };

    const handleLogoChange = (e) => {
        const file = e.target.files?.[0];

        if (!file) {
            return;
        }

        if (!file.type.startsWith('image/')) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid File',
                text: 'Please select a valid image file.',
            });

            return;
        }

        const maxSize = 2 * 1024 * 1024;

        if (file.size > maxSize) {
            Swal.fire({
                icon: 'error',
                title: 'File Too Large',
                text: 'School logo must be less than 2 MB.',
            });

            return;
        }

        const reader = new FileReader();

        reader.onload = () => {
            setFormData((prev) => ({
                ...prev,
                school_logo: reader.result,
            }));

            if (errors.school_logo) {
                setErrors((prev) => ({
                    ...prev,
                    school_logo: '',
                }));
            }
        };

        reader.onerror = () => {
            Swal.fire({
                icon: 'error',
                title: 'Upload Error',
                text: 'Unable to read the selected image.',
            });
        };

        reader.readAsDataURL(file);
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.school_name.trim()) {
            newErrors.school_name = 'School name is required.';
        }

        if (formData.email.trim()) {
            const emailRegex =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(formData.email.trim())) {
                newErrors.email = 'Please enter a valid email address.';
            }
        }

        if (formData.website.trim()) {
            const websiteRegex =
                /^https?:\/\/.+/i;

            if (!websiteRegex.test(formData.website.trim())) {
                newErrors.website =
                    'Website must start with http:// or https://.';
            }
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setSaving(true);

        try {
            const updatedSettings = {
                ...settings,
                ...formData,
                school_name: formData.school_name.trim(),
                email: formData.email.trim(),
                phone: formData.phone.trim(),
                address: formData.address.trim(),
                website: formData.website.trim(),
                principal_name: formData.principal_name.trim(),
                updated_at: new Date().toISOString(),
            };

            // API will be connected later
            // const response = await api.put(
            //     `/school-settings/${settings.id}`,
            //     updatedSettings
            // );

            if (
                mockStorage &&
                typeof mockStorage.updateSchoolSettings === 'function'
            ) {
                mockStorage.updateSchoolSettings(updatedSettings);
            }

            saveLocalSettings(updatedSettings);

            setSettings(updatedSettings);
            setShowModal(false);
            setErrors({});

            Swal.fire({
                icon: 'success',
                title: 'Saved',
                text: 'School settings updated successfully.',
                timer: 1800,
                showConfirmButton: false,
            });
        } catch (error) {
            console.error('Error saving school settings:', error);

            Swal.fire({
                icon: 'error',
                title: 'Save Failed',
                text: 'Unable to save school settings. Please try again.',
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="academic-years-page">
                <div className="academic-years-empty">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">
                            Loading...
                        </span>
                    </div>

                    <p>Loading school settings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="academic-years-page">

            {/* Header */}
            <div className="academic-years-header">
                <div className="hero-copy">
                    <div className="section-kicker">
                        Settings
                    </div>

                    <h1>School Settings</h1>

                    <p>
                        Manage your school information and basic settings.
                    </p>
                </div>

                <button
                    type="button"
                    className="btn btn-primary academic-years-add"
                    onClick={openEditModal}
                >
                    <i className="bi bi-pencil-square me-2"></i>
                    Edit Settings
                </button>
            </div>

            {/* Main Panel */}
            <div className="dashboard-panel academic-years-panel">

                <div className="academic-years-panel-heading">
                    <div>
                        <h2>School Information</h2>
                        <p className="panel-count">
                            Your school profile information
                        </p>
                    </div>
                </div>

                {/* School Information */}
                {settings && (
                    <div className="student-form-grid">

                        {/* School Logo */}
                        <div className="form-group">
                            <label>School Logo</label>

                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '15px',
                                }}
                            >
                                {settings.school_logo ? (
                                    <img
                                        src={settings.school_logo}
                                        alt="School Logo"
                                        style={{
                                            width: '80px',
                                            height: '80px',
                                            objectFit: 'cover',
                                            borderRadius: '12px',
                                            border: '1px solid #ddd',
                                        }}
                                    />
                                ) : (
                                    <div
                                        className="student-avatar"
                                        style={{
                                            width: '80px',
                                            height: '80px',
                                            fontSize: '24px',
                                        }}
                                    >
                                        {getInitials(
                                            settings.school_name
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* School Name */}
                        <div className="form-group">
                            <label>School Name</label>
                            <div className="form-control">
                                {settings.school_name || '-'}
                            </div>
                        </div>

                        {/* Email */}
                        <div className="form-group">
                            <label>Email</label>
                            <div className="form-control">
                                {settings.email || '-'}
                            </div>
                        </div>

                        {/* Phone */}
                        <div className="form-group">
                            <label>Phone</label>
                            <div className="form-control">
                                {settings.phone || '-'}
                            </div>
                        </div>

                        {/* Principal Name */}
                        <div className="form-group">
                            <label>Principal Name</label>
                            <div className="form-control">
                                {settings.principal_name || '-'}
                            </div>
                        </div>

                        {/* Website */}
                        <div className="form-group">
                            <label>Website</label>

                            <div className="form-control">
                                {settings.website ? (
                                    <a
                                        href={settings.website}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        {settings.website}
                                    </a>
                                ) : (
                                    '-'
                                )}
                            </div>
                        </div>

                        {/* Address */}
                        <div
                            className="form-group"
                            style={{
                                gridColumn: '1 / -1',
                            }}
                        >
                            <label>Address</label>

                            <div className="form-control">
                                {settings.address || '-'}
                            </div>
                        </div>

                    </div>
                )}
            </div>

            {/* Edit Modal */}
            {showModal && (
                <div
                    className="student-modal-overlay"
                    onClick={closeModal}
                >
                    <div
                        className="student-modal"
                        onClick={(e) => e.stopPropagation()}
                    >

                        {/* Modal Header */}
                        <div className="student-modal-header">
                            <div>
                                <h3>Edit School Settings</h3>
                                <p>
                                    Update your school information.
                                </p>
                            </div>

                            <button
                                type="button"
                                className="btn-close"
                                onClick={closeModal}
                                disabled={saving}
                                aria-label="Close"
                            ></button>
                        </div>

                        {/* Modal Body */}
                        <div className="student-modal-body">

                            <form onSubmit={handleSubmit}>

                                <div className="student-form-grid">

                                    {/* School Name */}
                                    <div className="form-group">
                                        <label htmlFor="school_name">
                                            School Name *
                                        </label>

                                        <input
                                            type="text"
                                            id="school_name"
                                            name="school_name"
                                            className={`form-control ${
                                                errors.school_name
                                                    ? 'is-invalid'
                                                    : ''
                                            }`}
                                            value={
                                                formData.school_name
                                            }
                                            onChange={handleChange}
                                            placeholder="Enter school name"
                                        />

                                        {errors.school_name && (
                                            <div className="invalid-feedback">
                                                {errors.school_name}
                                            </div>
                                        )}
                                    </div>

                                    {/* Email */}
                                    <div className="form-group">
                                        <label htmlFor="email">
                                            Email
                                        </label>

                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            className={`form-control ${
                                                errors.email
                                                    ? 'is-invalid'
                                                    : ''
                                            }`}
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="Enter school email"
                                        />

                                        {errors.email && (
                                            <div className="invalid-feedback">
                                                {errors.email}
                                            </div>
                                        )}
                                    </div>

                                    {/* Phone */}
                                    <div className="form-group">
                                        <label htmlFor="phone">
                                            Phone
                                        </label>

                                        <input
                                            type="text"
                                            id="phone"
                                            name="phone"
                                            className="form-control"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="Enter phone number"
                                        />
                                    </div>

                                    {/* Website */}
                                    <div className="form-group">
                                        <label htmlFor="website">
                                            Website
                                        </label>

                                        <input
                                            type="text"
                                            id="website"
                                            name="website"
                                            className={`form-control ${
                                                errors.website
                                                    ? 'is-invalid'
                                                    : ''
                                            }`}
                                            value={
                                                formData.website
                                            }
                                            onChange={handleChange}
                                            placeholder="https://example.com"
                                        />

                                        {errors.website && (
                                            <div className="invalid-feedback">
                                                {errors.website}
                                            </div>
                                        )}
                                    </div>

                                    {/* Principal Name */}
                                    <div className="form-group">
                                        <label htmlFor="principal_name">
                                            Principal Name
                                        </label>

                                        <input
                                            type="text"
                                            id="principal_name"
                                            name="principal_name"
                                            className="form-control"
                                            value={
                                                formData.principal_name
                                            }
                                            onChange={handleChange}
                                            placeholder="Enter principal name"
                                        />
                                    </div>

                                    {/* School Logo */}
                                    <div className="form-group">
                                        <label htmlFor="school_logo">
                                            School Logo
                                        </label>

                                        <input
                                            type="file"
                                            id="school_logo"
                                            name="school_logo"
                                            className="form-control"
                                            accept="image/*"
                                            onChange={handleLogoChange}
                                        />

                                        <small
                                            style={{
                                                display: 'block',
                                                marginTop: '6px',
                                                color: '#777',
                                            }}
                                        >
                                            Maximum file size: 2 MB
                                        </small>
                                    </div>

                                    {/* Logo Preview */}
                                    {formData.school_logo && (
                                        <div className="form-group">
                                            <label>Logo Preview</label>

                                            <div>
                                                <img
                                                    src={
                                                        formData.school_logo
                                                    }
                                                    alt="School Logo Preview"
                                                    style={{
                                                        width: '80px',
                                                        height: '80px',
                                                        objectFit: 'cover',
                                                        borderRadius: '12px',
                                                        border: '1px solid #ddd',
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Address */}
                                    <div
                                        className="form-group"
                                        style={{
                                            gridColumn: '1 / -1',
                                        }}
                                    >
                                        <label htmlFor="address">
                                            Address
                                        </label>

                                        <textarea
                                            id="address"
                                            name="address"
                                            className="form-control"
                                            rows="4"
                                            value={formData.address}
                                            onChange={handleChange}
                                            placeholder="Enter school address"
                                        ></textarea>
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
                                                Save Changes
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
};

export default SchoolSettings;
