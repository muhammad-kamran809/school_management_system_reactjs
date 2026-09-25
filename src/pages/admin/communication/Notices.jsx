
// import { useEffect, useState } from 'react';
// import Swal from 'sweetalert2';

// // API will be connected later by backend developer
// // import api from '../../../services/api';

// import { mockStorage } from '../../../services/mockData';

// const Notices = () => {
//     const initialForm = {
//         title: '',
//         description: '',
//         publish_date: '',
//         expiry_date: '',
//         status: '',
//     };

//     const [notices, setNotices] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [saving, setSaving] = useState(false);

//     const [showModal, setShowModal] = useState(false);
//     const [editingNotice, setEditingNotice] = useState(null);

//     const [searchTerm, setSearchTerm] = useState('');
//     const [formData, setFormData] = useState(initialForm);
//     const [errors, setErrors] = useState({});

//     useEffect(() => {
//         loadNotices();
//     }, []);

//     const loadNotices = () => {
//         try {
//             setLoading(true);

//             let data = [];

//             if (mockStorage && typeof mockStorage.getNotices === 'function') {
//                 data = mockStorage.getNotices() || [];
//             }

//             if (!data.length) {
//                 const storedNotices = localStorage.getItem('sms_notices');

//                 if (storedNotices) {
//                     data = JSON.parse(storedNotices);
//                 }
//             }

//             setNotices(Array.isArray(data) ? data : []);
//         } catch (error) {
//             console.error('Error loading notices:', error);

//             Swal.fire({
//                 icon: 'error',
//                 title: 'Error',
//                 text: 'Failed to load notices.',
//             });
//         } finally {
//             setLoading(false);
//         }
//     };

//     const saveToLocalStorage = (data) => {
//         localStorage.setItem('sms_notices', JSON.stringify(data));
//     };

//     const openAddModal = () => {
//         setEditingNotice(null);
//         setFormData(initialForm);
//         setErrors({});
//         setShowModal(true);
//     };

//     const openEditModal = (notice) => {
//         setEditingNotice(notice);

//         setFormData({
//             title: notice.title || '',
//             description: notice.description || '',
//             publish_date: notice.publish_date || notice.publishDate || '',
//             expiry_date: notice.expiry_date || notice.expiryDate || '',
//             status: notice.status || '',
//         });

//         setErrors({});
//         setShowModal(true);
//     };

//     const closeModal = () => {
//         if (saving) return;

//         setShowModal(false);
//         setEditingNotice(null);
//         setFormData(initialForm);
//         setErrors({});
//     };

//     const handleChange = (e) => {
//         const { name, value } = e.target;

//         setFormData((prev) => ({
//             ...prev,
//             [name]: value,
//         }));

//         if (errors[name]) {
//             setErrors((prev) => ({
//                 ...prev,
//                 [name]: '',
//             }));
//         }
//     };

//     const validateForm = () => {
//         const newErrors = {};

//         if (!formData.title.trim()) {
//             newErrors.title = 'Title is required';
//         }

//         if (!formData.description.trim()) {
//             newErrors.description = 'Description is required';
//         }

//         if (!formData.publish_date) {
//             newErrors.publish_date = 'Publish Date is required';
//         }

//         if (
//             formData.publish_date &&
//             formData.expiry_date &&
//             formData.expiry_date < formData.publish_date
//         ) {
//             newErrors.expiry_date =
//                 'Expiry Date cannot be before Publish Date';
//         }

//         if (!formData.status) {
//             newErrors.status = 'Status is required';
//         }

//         setErrors(newErrors);

//         return Object.keys(newErrors).length === 0;
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         if (!validateForm()) {
//             return;
//         }

//         try {
//             setSaving(true);

//             const now = new Date().toISOString();

//             if (editingNotice) {
//                 const updatedNotice = {
//                     ...editingNotice,
//                     title: formData.title.trim(),
//                     description: formData.description.trim(),
//                     publish_date: formData.publish_date,
//                     expiry_date: formData.expiry_date,
//                     status: formData.status,
//                     updated_at: now,
//                 };

//                 let updatedNotices = notices.map((notice) =>
//                     notice.id === editingNotice.id
//                         ? updatedNotice
//                         : notice
//                 );

//                 if (
//                     mockStorage &&
//                     typeof mockStorage.updateNotice === 'function'
//                 ) {
//                     mockStorage.updateNotice(
//                         editingNotice.id,
//                         updatedNotice
//                     );

//                     if (
//                         typeof mockStorage.getNotices === 'function'
//                     ) {
//                         updatedNotices =
//                             mockStorage.getNotices() || updatedNotices;
//                     }
//                 }

//                 setNotices(updatedNotices);
//                 saveToLocalStorage(updatedNotices);

//                 await Swal.fire({
//                     icon: 'success',
//                     title: 'Updated!',
//                     text: 'Notice updated successfully.',
//                     timer: 1500,
//                     showConfirmButton: false,
//                 });
//             } else {
//                 const newNotice = {
//                     id: `NOTICE-${Date.now()}`,
//                     title: formData.title.trim(),
//                     description: formData.description.trim(),
//                     publish_date: formData.publish_date,
//                     expiry_date: formData.expiry_date,
//                     status: formData.status,
//                     created_at: now,
//                     updated_at: now,
//                 };

//                 let updatedNotices = [...notices, newNotice];

//                 if (
//                     mockStorage &&
//                     typeof mockStorage.addNotice === 'function'
//                 ) {
//                     const addedNotice =
//                         mockStorage.addNotice(newNotice);

//                     if (addedNotice) {
//                         updatedNotices = [
//                             ...notices,
//                             addedNotice,
//                         ];
//                     } else if (
//                         typeof mockStorage.getNotices === 'function'
//                     ) {
//                         updatedNotices =
//                             mockStorage.getNotices() || updatedNotices;
//                     }
//                 }

//                 setNotices(updatedNotices);
//                 saveToLocalStorage(updatedNotices);

//                 await Swal.fire({
//                     icon: 'success',
//                     title: 'Added!',
//                     text: 'Notice added successfully.',
//                     timer: 1500,
//                     showConfirmButton: false,
//                 });
//             }

//             closeModal();
//         } catch (error) {
//             console.error('Error saving notice:', error);

//             let message = 'Failed to save notice.';

//             if (error?.response?.status === 422) {
//                 message = 'Please check the entered information.';
//             } else if (error?.response?.status === 401) {
//                 message = 'You are not authorized to perform this action.';
//             } else if (error?.response?.status === 403) {
//                 message = 'You do not have permission to perform this action.';
//             } else if (error?.response?.status === 404) {
//                 message = 'Requested resource was not found.';
//             } else if (error?.response?.status === 500) {
//                 message = 'Server error occurred. Please try again later.';
//             }

//             Swal.fire({
//                 icon: 'error',
//                 title: 'Error',
//                 text: message,
//             });
//         } finally {
//             setSaving(false);
//         }
//     };

//     const handleDelete = async (notice) => {
//         const result = await Swal.fire({
//             title: 'Are you sure?',
//             text: `Delete "${notice.title}"?`,
//             icon: 'warning',
//             showCancelButton: true,
//             confirmButtonText: 'Yes, delete it!',
//             cancelButtonText: 'Cancel',
//         });

//         if (!result.isConfirmed) {
//             return;
//         }

//         try {
//             let updatedNotices = notices.filter(
//                 (item) => item.id !== notice.id
//             );

//             if (
//                 mockStorage &&
//                 typeof mockStorage.deleteNotice === 'function'
//             ) {
//                 mockStorage.deleteNotice(notice.id);

//                 if (
//                     typeof mockStorage.getNotices === 'function'
//                 ) {
//                     updatedNotices =
//                         mockStorage.getNotices() || updatedNotices;
//                 }
//             }

//             setNotices(updatedNotices);
//             saveToLocalStorage(updatedNotices);

//             await Swal.fire({
//                 icon: 'success',
//                 title: 'Deleted!',
//                 text: 'Notice deleted successfully.',
//                 timer: 1500,
//                 showConfirmButton: false,
//             });
//         } catch (error) {
//             console.error('Error deleting notice:', error);

//             Swal.fire({
//                 icon: 'error',
//                 title: 'Error',
//                 text: 'Failed to delete notice.',
//             });
//         }
//     };

//     const filteredNotices = notices.filter((notice) => {
//         const search = searchTerm.toLowerCase();

//         return (
//             (notice.title || '').toLowerCase().includes(search) ||
//             (notice.description || '').toLowerCase().includes(search) ||
//             (notice.status || '').toLowerCase().includes(search)
//         );
//     });

//     const formatDate = (date) => {
//         if (!date) return '-';

//         const parsedDate = new Date(date);

//         if (Number.isNaN(parsedDate.getTime())) {
//             return date;
//         }

//         return parsedDate.toLocaleDateString();
//     };

//     return (
//         <div className="academic-years-page">
//             {/* Header */}
//             <div className="academic-years-header">
//                 <div className="hero-copy">
//                     <div className="section-kicker">
//                         Notice Management
//                     </div>

//                     <h1>Notices</h1>

//                     <p>
//                         Manage school notices and announcements
//                     </p>
//                 </div>

//                 <button
//                     type="button"
//                     className="btn btn-primary academic-years-add"
//                     onClick={openAddModal}
//                 >
//                     <i className="bi bi-plus-lg"></i>
//                     Add Notice
//                 </button>
//             </div>

//             {/* Main Panel */}
//             <div className="dashboard-panel academic-years-panel">
//                 <div className="academic-years-panel-heading">
//                     <div>
//                         <h2>Notice records</h2>

//                         <span className="panel-count">
//                             {filteredNotices.length} notices
//                         </span>
//                     </div>

//                     <div className="student-search">
//                         <i className="bi bi-search"></i>

//                         <input
//                             type="text"
//                             placeholder="Search notices..."
//                             value={searchTerm}
//                             onChange={(e) =>
//                                 setSearchTerm(e.target.value)
//                             }
//                         />
//                     </div>
//                 </div>

//                 {loading ? (
//                     <div className="academic-years-empty">
//                         <div className="spinner-border"></div>
//                         <p>Loading notices...</p>
//                     </div>
//                 ) : filteredNotices.length === 0 ? (
//                     <div className="academic-years-empty">
//                         <i className="bi bi-megaphone"></i>

//                         <h3>No notices found</h3>

//                         <p>
//                             Add a notice to start managing school
//                             announcements.
//                         </p>
//                     </div>
//                 ) : (
//                     <div className="academic-years-table-wrap">
//                         <table className="table academic-years-table">
//                             <thead>
//                                 <tr>
//                                     <th>#</th>
//                                     <th>Title</th>
//                                     <th>Description</th>
//                                     <th>Publish Date</th>
//                                     <th>Expiry Date</th>
//                                     <th>Status</th>
//                                     <th>Actions</th>
//                                 </tr>
//                             </thead>

//                             <tbody>
//                                 {filteredNotices.map(
//                                     (notice, index) => (
//                                         <tr key={notice.id || index}>
//                                             <td>
//                                                 <span className="academic-years-index">
//                                                     {index + 1}
//                                                 </span>
//                                             </td>

//                                             <td>
//                                                 <div className="student-table-name">
//                                                     <div className="student-avatar">
//                                                         {(
//                                                             notice.title ||
//                                                             'N'
//                                                         )
//                                                             .charAt(0)
//                                                             .toUpperCase()}
//                                                     </div>

//                                                     <span>
//                                                         {notice.title ||
//                                                             '-'}
//                                                     </span>
//                                                 </div>
//                                             </td>

//                                             <td>
//                                                 {notice.description ||
//                                                     '-'}
//                                             </td>

//                                             <td>
//                                                 {formatDate(
//                                                     notice.publish_date ||
//                                                         notice.publishDate
//                                                 )}
//                                             </td>

//                                             <td>
//                                                 {formatDate(
//                                                     notice.expiry_date ||
//                                                         notice.expiryDate
//                                                 )}
//                                             </td>

//                                             <td>
//                                                 {notice.status ||
//                                                     '-'}
//                                             </td>

//                                             <td>
//                                                 <div className="academic-actions">
//                                                     <button
//                                                         type="button"
//                                                         className="academic-action-button edit"
//                                                         onClick={() =>
//                                                             openEditModal(
//                                                                 notice
//                                                             )
//                                                         }
//                                                         title="Edit"
//                                                     >
//                                                         <i className="bi bi-pencil"></i>
//                                                     </button>

//                                                     <button
//                                                         type="button"
//                                                         className="academic-action-button delete"
//                                                         onClick={() =>
//                                                             handleDelete(
//                                                                 notice
//                                                             )
//                                                         }
//                                                         title="Delete"
//                                                     >
//                                                         <i className="bi bi-trash"></i>
//                                                     </button>
//                                                 </div>
//                                             </td>
//                                         </tr>
//                                     )
//                                 )}
//                             </tbody>
//                         </table>
//                     </div>
//                 )}
//             </div>

//             {/* Add / Edit Modal */}
//             {showModal && (
//                 <div className="student-modal-overlay">
//                     <div className="student-modal">
//                         <div className="student-modal-header">
//                             <div>
//                                 <h2>
//                                     {editingNotice
//                                         ? 'Edit Notice'
//                                         : 'Add Notice'}
//                                 </h2>

//                                 <p>
//                                     {editingNotice
//                                         ? 'Update notice information'
//                                         : 'Add a new school notice'}
//                                 </p>
//                             </div>

//                             <button
//                                 type="button"
//                                 onClick={closeModal}
//                                 disabled={saving}
//                             >
//                                 <i className="bi bi-x-lg"></i>
//                             </button>
//                         </div>

//                         <form onSubmit={handleSubmit}>
//                             <div className="student-modal-body">
//                                 <div className="student-form-grid">
//                                     {/* Title */}
//                                     <div className="form-group">
//                                         <label>
//                                             Title *
//                                         </label>

//                                         <input
//                                             type="text"
//                                             name="title"
//                                             value={formData.title}
//                                             onChange={handleChange}
//                                             placeholder="Enter notice title"
//                                             className={
//                                                 errors.title
//                                                     ? 'is-invalid'
//                                                     : ''
//                                             }
//                                         />

//                                         {errors.title && (
//                                             <div className="invalid-feedback">
//                                                 {errors.title}
//                                             </div>
//                                         )}
//                                     </div>

//                                     {/* Status */}
//                                     <div className="form-group">
//                                         <label>
//                                             Status
//                                         </label>

//                                         <select
//                                             name="status"
//                                             value={formData.status}
//                                             onChange={handleChange}
//                                             className={
//                                                 errors.status
//                                                     ? 'is-invalid'
//                                                     : ''
//                                             }
//                                         >
//                                             <option value="">
//                                                 Select Status
//                                             </option>
//                                             <option value="Active">
//                                                 Active
//                                             </option>
//                                             <option value="Inactive">
//                                                 Inactive
//                                             </option>
//                                             <option value="Published">
//                                                 Published
//                                             </option>
//                                             <option value="Draft">
//                                                 Draft
//                                             </option>
//                                             <option value="Expired">
//                                                 Expired
//                                             </option>
//                                         </select>

//                                         {errors.status && (
//                                             <div className="invalid-feedback">
//                                                 {errors.status}
//                                             </div>
//                                         )}
//                                     </div>

//                                     {/* Publish Date */}
//                                     <div className="form-group">
//                                         <label>
//                                             Publish Date *
//                                         </label>

//                                         <input
//                                             type="date"
//                                             name="publish_date"
//                                             value={
//                                                 formData.publish_date
//                                             }
//                                             onChange={handleChange}
//                                             className={
//                                                 errors.publish_date
//                                                     ? 'is-invalid'
//                                                     : ''
//                                             }
//                                         />

//                                         {errors.publish_date && (
//                                             <div className="invalid-feedback">
//                                                 {
//                                                     errors.publish_date
//                                                 }
//                                             </div>
//                                         )}
//                                     </div>

//                                     {/* Expiry Date */}
//                                     <div className="form-group">
//                                         <label>
//                                             Expiry Date
//                                         </label>

//                                         <input
//                                             type="date"
//                                             name="expiry_date"
//                                             value={
//                                                 formData.expiry_date
//                                             }
//                                             onChange={handleChange}
//                                             className={
//                                                 errors.expiry_date
//                                                     ? 'is-invalid'
//                                                     : ''
//                                             }
//                                         />

//                                         {errors.expiry_date && (
//                                             <div className="invalid-feedback">
//                                                 {
//                                                     errors.expiry_date
//                                                 }
//                                             </div>
//                                         )}
//                                     </div>

//                                     {/* Description */}
//                                     <div
//                                         className="form-group"
//                                         style={{
//                                             gridColumn: '1 / -1',
//                                         }}
//                                     >
//                                         <label>
//                                             Description *
//                                         </label>

//                                         <textarea
//                                             name="description"
//                                             value={
//                                                 formData.description
//                                             }
//                                             onChange={handleChange}
//                                             placeholder="Enter notice description"
//                                             rows="5"
//                                             className={
//                                                 errors.description
//                                                     ? 'is-invalid'
//                                                     : ''
//                                             }
//                                         ></textarea>

//                                         {errors.description && (
//                                             <div className="invalid-feedback">
//                                                 {
//                                                     errors.description
//                                                 }
//                                             </div>
//                                         )}
//                                     </div>
//                                 </div>
//                             </div>

//                             <div className="student-modal-footer">
//                                 <button
//                                     type="button"
//                                     className="student-modal-cancel"
//                                     onClick={closeModal}
//                                     disabled={saving}
//                                 >
//                                     Cancel
//                                 </button>

//                                 <button
//                                     type="submit"
//                                     className="student-modal-submit"
//                                     disabled={saving}
//                                 >
//                                     {saving ? (
//                                         <>
//                                             <span className="spinner-border spinner-border-sm"></span>
//                                             Saving...
//                                         </>
//                                     ) : (
//                                         <>
//                                             <i className="bi bi-check-lg"></i>
//                                             {editingNotice
//                                                 ? 'Update Notice'
//                                                 : 'Save Notice'}
//                                         </>
//                                     )}
//                                 </button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default Notices;


import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

// API will be connected later by backend developer
// import api from '../../../services/api';

import { mockStorage } from '../../../services/mockData';

const Notices = () => {
    const initialForm = {
        title: '',
        description: '',
        publish_date: '',
        expiry_date: '',
        status: '',
    };

    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [editingNotice, setEditingNotice] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState(initialForm);
    const [errors, setErrors] = useState({});

    // --------------------------------------------------
    // Demo data for testing
    // --------------------------------------------------
    const getDemoNotices = () => {
        return [
            {
                id: 'NOTICE-001',
                title: 'Annual Examination Schedule',
                description:
                    'The annual examinations will begin from 15 December. Students are requested to prepare according to the examination schedule.',
                publish_date: '2026-09-01',
                expiry_date: '2026-12-20',
                status: 'Published',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            },
            {
                id: 'NOTICE-002',
                title: 'Parent Teacher Meeting',
                description:
                    'A parent teacher meeting will be held at the school campus. Parents are requested to attend the meeting on time.',
                publish_date: '2026-09-05',
                expiry_date: '2026-10-05',
                status: 'Active',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            },
            {
                id: 'NOTICE-003',
                title: 'School Holiday Announcement',
                description:
                    'The school will remain closed on the announced public holiday. Regular classes will resume on the next working day.',
                publish_date: '2026-09-10',
                expiry_date: '2026-09-30',
                status: 'Published',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            },
            {
                id: 'NOTICE-004',
                title: 'Fee Submission Reminder',
                description:
                    'Parents and students are requested to submit outstanding school fees before the due date to avoid any inconvenience.',
                publish_date: '2026-09-12',
                expiry_date: '2026-10-15',
                status: 'Active',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            },
            {
                id: 'NOTICE-005',
                title: 'Sports Day Event',
                description:
                    'The annual sports day event will be organized at the school ground. Students participating in different activities should report to their respective teachers.',
                publish_date: '2026-09-15',
                expiry_date: '2026-11-01',
                status: 'Draft',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            },
        ];
    };

    useEffect(() => {
        loadNotices();
    }, []);

    // --------------------------------------------------
    // Load notices
    // --------------------------------------------------
    const loadNotices = () => {
        try {
            setLoading(true);

            let data = [];

            if (
                mockStorage &&
                typeof mockStorage.getNotices === 'function'
            ) {
                data = mockStorage.getNotices() || [];
            }

            if (!data.length) {
                const storedNotices =
                    localStorage.getItem('sms_notices');

                if (storedNotices) {
                    data = JSON.parse(storedNotices);
                }
            }

            // Add demo data only when no notices exist
            if (!data.length) {
                data = getDemoNotices();

                localStorage.setItem(
                    'sms_notices',
                    JSON.stringify(data)
                );
            }

            setNotices(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error loading notices:', error);

            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to load notices.',
            });
        } finally {
            setLoading(false);
        }
    };

    // --------------------------------------------------
    // Save notices to localStorage
    // --------------------------------------------------
    const saveToLocalStorage = (data) => {
        localStorage.setItem(
            'sms_notices',
            JSON.stringify(data)
        );
    };

    // --------------------------------------------------
    // Open add modal
    // --------------------------------------------------
    const openAddModal = () => {
        setEditingNotice(null);
        setFormData(initialForm);
        setErrors({});
        setShowModal(true);
    };

    // --------------------------------------------------
    // Open edit modal
    // --------------------------------------------------
    const openEditModal = (notice) => {
        setEditingNotice(notice);

        setFormData({
            title: notice.title || '',
            description: notice.description || '',
            publish_date:
                notice.publish_date ||
                notice.publishDate ||
                '',
            expiry_date:
                notice.expiry_date ||
                notice.expiryDate ||
                '',
            status: notice.status || '',
        });

        setErrors({});
        setShowModal(true);
    };

    // --------------------------------------------------
    // Close modal
    // --------------------------------------------------
    const closeModal = () => {
        if (saving) return;

        setShowModal(false);
        setEditingNotice(null);
        setFormData(initialForm);
        setErrors({});
    };

    // --------------------------------------------------
    // Handle input changes
    // --------------------------------------------------
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

    // --------------------------------------------------
    // Validate form
    // --------------------------------------------------
    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        }

        if (!formData.description.trim()) {
            newErrors.description =
                'Description is required';
        }

        if (!formData.publish_date) {
            newErrors.publish_date =
                'Publish Date is required';
        }

        if (
            formData.publish_date &&
            formData.expiry_date &&
            formData.expiry_date <
                formData.publish_date
        ) {
            newErrors.expiry_date =
                'Expiry Date cannot be before Publish Date';
        }

        if (!formData.status) {
            newErrors.status = 'Status is required';
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    // --------------------------------------------------
    // Submit form
    // --------------------------------------------------
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setSaving(true);

            const now = new Date().toISOString();

            // ------------------------------------------
            // Update existing notice
            // ------------------------------------------
            if (editingNotice) {
                const updatedNotice = {
                    ...editingNotice,
                    title: formData.title.trim(),
                    description:
                        formData.description.trim(),
                    publish_date:
                        formData.publish_date,
                    expiry_date:
                        formData.expiry_date,
                    status: formData.status,
                    updated_at: now,
                };

                let updatedNotices = notices.map(
                    (notice) =>
                        notice.id === editingNotice.id
                            ? updatedNotice
                            : notice
                );

                if (
                    mockStorage &&
                    typeof mockStorage.updateNotice ===
                        'function'
                ) {
                    mockStorage.updateNotice(
                        editingNotice.id,
                        updatedNotice
                    );

                    if (
                        typeof mockStorage.getNotices ===
                        'function'
                    ) {
                        updatedNotices =
                            mockStorage.getNotices() ||
                            updatedNotices;
                    }
                }

                setNotices(updatedNotices);
                saveToLocalStorage(updatedNotices);

                await Swal.fire({
                    icon: 'success',
                    title: 'Updated!',
                    text: 'Notice updated successfully.',
                    timer: 1500,
                    showConfirmButton: false,
                });
            } else {
                // --------------------------------------
                // Add new notice
                // --------------------------------------
                const newNotice = {
                    id: `NOTICE-${Date.now()}`,
                    title: formData.title.trim(),
                    description:
                        formData.description.trim(),
                    publish_date:
                        formData.publish_date,
                    expiry_date:
                        formData.expiry_date,
                    status: formData.status,
                    created_at: now,
                    updated_at: now,
                };

                let updatedNotices = [
                    ...notices,
                    newNotice,
                ];

                if (
                    mockStorage &&
                    typeof mockStorage.addNotice ===
                        'function'
                ) {
                    const addedNotice =
                        mockStorage.addNotice(
                            newNotice
                        );

                    if (addedNotice) {
                        updatedNotices = [
                            ...notices,
                            addedNotice,
                        ];
                    } else if (
                        typeof mockStorage.getNotices ===
                        'function'
                    ) {
                        updatedNotices =
                            mockStorage.getNotices() ||
                            updatedNotices;
                    }
                }

                setNotices(updatedNotices);
                saveToLocalStorage(updatedNotices);

                await Swal.fire({
                    icon: 'success',
                    title: 'Added!',
                    text: 'Notice added successfully.',
                    timer: 1500,
                    showConfirmButton: false,
                });
            }

            closeModal();
        } catch (error) {
            console.error(
                'Error saving notice:',
                error
            );

            let message =
                'Failed to save notice.';

            if (
                error?.response?.status === 422
            ) {
                message =
                    'Please check the entered information.';
            } else if (
                error?.response?.status === 401
            ) {
                message =
                    'You are not authorized to perform this action.';
            } else if (
                error?.response?.status === 403
            ) {
                message =
                    'You do not have permission to perform this action.';
            } else if (
                error?.response?.status === 404
            ) {
                message =
                    'Requested resource was not found.';
            } else if (
                error?.response?.status === 500
            ) {
                message =
                    'Server error occurred. Please try again later.';
            }

            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: message,
            });
        } finally {
            setSaving(false);
        }
    };

    // --------------------------------------------------
    // Delete notice
    // --------------------------------------------------
    const handleDelete = async (notice) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: `Delete "${notice.title}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText:
                'Yes, delete it!',
            cancelButtonText: 'Cancel',
        });

        if (!result.isConfirmed) {
            return;
        }

        try {
            let updatedNotices =
                notices.filter(
                    (item) =>
                        item.id !== notice.id
                );

            if (
                mockStorage &&
                typeof mockStorage.deleteNotice ===
                    'function'
            ) {
                mockStorage.deleteNotice(
                    notice.id
                );

                if (
                    typeof mockStorage.getNotices ===
                    'function'
                ) {
                    updatedNotices =
                        mockStorage.getNotices() ||
                        updatedNotices;
                }
            }

            setNotices(updatedNotices);
            saveToLocalStorage(updatedNotices);

            await Swal.fire({
                icon: 'success',
                title: 'Deleted!',
                text: 'Notice deleted successfully.',
                timer: 1500,
                showConfirmButton: false,
            });
        } catch (error) {
            console.error(
                'Error deleting notice:',
                error
            );

            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to delete notice.',
            });
        }
    };

    // --------------------------------------------------
    // Search
    // --------------------------------------------------
    const filteredNotices = notices.filter(
        (notice) => {
            const search =
                searchTerm.toLowerCase();

            return (
                (notice.title || '')
                    .toLowerCase()
                    .includes(search) ||
                (notice.description || '')
                    .toLowerCase()
                    .includes(search) ||
                (notice.status || '')
                    .toLowerCase()
                    .includes(search)
            );
        }
    );

    // --------------------------------------------------
    // Format date
    // --------------------------------------------------
    const formatDate = (date) => {
        if (!date) return '-';

        const parsedDate = new Date(date);

        if (
            Number.isNaN(
                parsedDate.getTime()
            )
        ) {
            return date;
        }

        return parsedDate.toLocaleDateString();
    };

    return (
        <div className="academic-years-page">
            {/* Header */}
            <div className="academic-years-header">
                <div className="hero-copy">
                    <div className="section-kicker">
                        Notice Management
                    </div>

                    <h1>Notices</h1>

                    <p>
                        Manage school notices and
                        announcements
                    </p>
                </div>

                <button
                    type="button"
                    className="btn btn-primary academic-years-add"
                    onClick={openAddModal}
                >
                    <i className="bi bi-plus-lg"></i>
                    Add Notice
                </button>
            </div>

            {/* Main Panel */}
            <div className="dashboard-panel academic-years-panel">
                <div className="academic-years-panel-heading">
                    <div>
                        <h2>
                            Notice records
                        </h2>

                        <span className="panel-count">
                            {filteredNotices.length}{' '}
                            notices
                        </span>
                    </div>

                    <div className="student-search">
                        <i className="bi bi-search"></i>

                        <input
                            type="text"
                            placeholder="Search notices..."
                            value={searchTerm}
                            onChange={(e) =>
                                setSearchTerm(
                                    e.target.value
                                )
                            }
                        />
                    </div>
                </div>

                {/* Loading */}
                {loading ? (
                    <div className="academic-years-empty">
                        <div className="spinner-border"></div>

                        <p>
                            Loading notices...
                        </p>
                    </div>
                ) : filteredNotices.length ===
                  0 ? (
                    /* Empty */
                    <div className="academic-years-empty">
                        <i className="bi bi-megaphone"></i>

                        <h3>
                            No notices found
                        </h3>

                        <p>
                            Add a notice to start
                            managing school
                            announcements.
                        </p>
                    </div>
                ) : (
                    /* Table */
                    <div className="academic-years-table-wrap">
                        <table className="table academic-years-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>
                                        Title
                                    </th>
                                    <th>
                                        Description
                                    </th>
                                    <th>
                                        Publish Date
                                    </th>
                                    <th>
                                        Expiry Date
                                    </th>
                                    <th>
                                        Status
                                    </th>
                                    <th>
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredNotices.map(
                                    (
                                        notice,
                                        index
                                    ) => (
                                        <tr
                                            key={
                                                notice.id ||
                                                index
                                            }
                                        >
                                            <td>
                                                <span className="academic-years-index">
                                                    {index +
                                                        1}
                                                </span>
                                            </td>

                                            <td>
                                                <div className="student-table-name">
                                                    <div className="student-avatar">
                                                        {(
                                                            notice.title ||
                                                            'N'
                                                        )
                                                            .charAt(
                                                                0
                                                            )
                                                            .toUpperCase()}
                                                    </div>

                                                    <span>
                                                        {notice.title ||
                                                            '-'}
                                                    </span>
                                                </div>
                                            </td>

                                            <td>
                                                {notice.description ||
                                                    '-'}
                                            </td>

                                            <td>
                                                {formatDate(
                                                    notice.publish_date ||
                                                        notice.publishDate
                                                )}
                                            </td>

                                            <td>
                                                {formatDate(
                                                    notice.expiry_date ||
                                                        notice.expiryDate
                                                )}
                                            </td>

                                            <td>
                                                {notice.status ||
                                                    '-'}
                                            </td>

                                            <td>
                                                <div className="academic-actions">
                                                    <button
                                                        type="button"
                                                        className="academic-action-button edit"
                                                        onClick={() =>
                                                            openEditModal(
                                                                notice
                                                            )
                                                        }
                                                        title="Edit"
                                                    >
                                                        <i className="bi bi-pencil"></i>
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="academic-action-button delete"
                                                        onClick={() =>
                                                            handleDelete(
                                                                notice
                                                            )
                                                        }
                                                        title="Delete"
                                                    >
                                                        <i className="bi bi-trash"></i>
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

            {/* Add / Edit Modal */}
            {showModal && (
                <div className="student-modal-overlay">
                    <div className="student-modal">
                        <div className="student-modal-header">
                            <div>
                                <h2>
                                    {editingNotice
                                        ? 'Edit Notice'
                                        : 'Add Notice'}
                                </h2>

                                <p>
                                    {editingNotice
                                        ? 'Update notice information'
                                        : 'Add a new school notice'}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={closeModal}
                                disabled={saving}
                            >
                                <i className="bi bi-x-lg"></i>
                            </button>
                        </div>

                        <form
                            onSubmit={
                                handleSubmit
                            }
                        >
                            <div className="student-modal-body">
                                <div className="student-form-grid">
                                    {/* Title */}
                                    <div className="form-group">
                                        <label>
                                            Title *
                                        </label>

                                        <input
                                            type="text"
                                            name="title"
                                            value={
                                                formData.title
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Enter notice title"
                                            className={
                                                errors.title
                                                    ? 'is-invalid'
                                                    : ''
                                            }
                                        />

                                        {errors.title && (
                                            <div className="invalid-feedback">
                                                {
                                                    errors.title
                                                }
                                            </div>
                                        )}
                                    </div>

                                    {/* Status */}
                                    <div className="form-group">
                                        <label>
                                            Status
                                        </label>

                                        <select
                                            name="status"
                                            value={
                                                formData.status
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            className={
                                                errors.status
                                                    ? 'is-invalid'
                                                    : ''
                                            }
                                        >
                                            <option value="">
                                                Select Status
                                            </option>

                                            <option value="Active">
                                                Active
                                            </option>

                                            <option value="Inactive">
                                                Inactive
                                            </option>

                                            <option value="Published">
                                                Published
                                            </option>

                                            <option value="Draft">
                                                Draft
                                            </option>

                                            <option value="Expired">
                                                Expired
                                            </option>
                                        </select>

                                        {errors.status && (
                                            <div className="invalid-feedback">
                                                {
                                                    errors.status
                                                }
                                            </div>
                                        )}
                                    </div>

                                    {/* Publish Date */}
                                    <div className="form-group">
                                        <label>
                                            Publish Date *
                                        </label>

                                        <input
                                            type="date"
                                            name="publish_date"
                                            value={
                                                formData.publish_date
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            className={
                                                errors.publish_date
                                                    ? 'is-invalid'
                                                    : ''
                                            }
                                        />

                                        {errors.publish_date && (
                                            <div className="invalid-feedback">
                                                {
                                                    errors.publish_date
                                                }
                                            </div>
                                        )}
                                    </div>

                                    {/* Expiry Date */}
                                    <div className="form-group">
                                        <label>
                                            Expiry Date
                                        </label>

                                        <input
                                            type="date"
                                            name="expiry_date"
                                            value={
                                                formData.expiry_date
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            className={
                                                errors.expiry_date
                                                    ? 'is-invalid'
                                                    : ''
                                            }
                                        />

                                        {errors.expiry_date && (
                                            <div className="invalid-feedback">
                                                {
                                                    errors.expiry_date
                                                }
                                            </div>
                                        )}
                                    </div>

                                    {/* Description */}
                                    <div
                                        className="form-group"
                                        style={{
                                            gridColumn:
                                                '1 / -1',
                                        }}
                                    >
                                        <label>
                                            Description *
                                        </label>

                                        <textarea
                                            name="description"
                                            value={
                                                formData.description
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Enter notice description"
                                            rows="5"
                                            className={
                                                errors.description
                                                    ? 'is-invalid'
                                                    : ''
                                            }
                                        ></textarea>

                                        {errors.description && (
                                            <div className="invalid-feedback">
                                                {
                                                    errors.description
                                                }
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="student-modal-footer">
                                <button
                                    type="button"
                                    className="student-modal-cancel"
                                    onClick={
                                        closeModal
                                    }
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
                                            <span className="spinner-border spinner-border-sm"></span>
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-check-lg"></i>

                                            {editingNotice
                                                ? 'Update Notice'
                                                : 'Save Notice'}
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Notices;

