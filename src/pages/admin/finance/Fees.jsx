
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

// API will be connected later by backend developer
// import api from '../../../services/api';

import { mockStorage } from '../../../services/mockData';

const initialForm = {
    student: '',
    academic_year: '',
    fee_type: '',
    amount: '',
    due_date: '',
    status: '',
    description: '',
};

const Fees = () => {
    const [fees, setFees] = useState([]);
    const [students, setStudents] = useState([]);
    const [academicYears, setAcademicYears] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [editingFee, setEditingFee] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState(initialForm);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetchFees();
        fetchStudents();
        fetchAcademicYears();
    }, []);

    // =========================================================
    // FETCH FEES
    // =========================================================

    const fetchFees = async () => {
        try {
            setLoading(true);

            // API will be connected later
            // const response = await api.get('/fees');
            // setFees(response.data);

            let data = [];

            if (
                mockStorage &&
                typeof mockStorage.getFees === 'function'
            ) {
                data = mockStorage.getFees() || [];
            } else {
                const storedData = localStorage.getItem('sms_fees');

                data = storedData ? JSON.parse(storedData) : [];
            }

            setFees(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching fees:', error);

            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to load fee records.',
            });

            setFees([]);
        } finally {
            setLoading(false);
        }
    };

    // =========================================================
    // FETCH STUDENTS
    // =========================================================

    const fetchStudents = async () => {
        try {
            let data = [];

            if (
                mockStorage &&
                typeof mockStorage.getStudents === 'function'
            ) {
                data = mockStorage.getStudents() || [];
            } else {
                const storedData = localStorage.getItem('school_students');

                data = storedData ? JSON.parse(storedData) : [];
            }

            setStudents(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching students:', error);
            setStudents([]);
        }
    };

    // =========================================================
    // FETCH ACADEMIC YEARS
    // =========================================================

    const fetchAcademicYears = async () => {
        try {
            let data = [];

            if (
                mockStorage &&
                typeof mockStorage.getAcademicYears === 'function'
            ) {
                data = mockStorage.getAcademicYears() || [];
            } else {
                const storedData = localStorage.getItem(
                    'sms_academic_years'
                );

                data = storedData ? JSON.parse(storedData) : [];
            }

            setAcademicYears(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching academic years:', error);
            setAcademicYears([]);
        }
    };

    // =========================================================
    // ERROR HANDLER
    // =========================================================

    const handleApiError = (error) => {
        const status = error?.response?.status;

        switch (status) {
            case 422:
                Swal.fire({
                    icon: 'error',
                    title: 'Validation Error',
                    text: 'Please check the entered information.',
                });
                break;

            case 401:
                Swal.fire({
                    icon: 'error',
                    title: 'Unauthorized',
                    text: 'You are not authorized to perform this action.',
                });
                break;

            case 403:
                Swal.fire({
                    icon: 'error',
                    title: 'Forbidden',
                    text: 'You do not have permission to perform this action.',
                });
                break;

            case 404:
                Swal.fire({
                    icon: 'error',
                    title: 'Not Found',
                    text: 'The requested resource was not found.',
                });
                break;

            case 500:
                Swal.fire({
                    icon: 'error',
                    title: 'Server Error',
                    text: 'Something went wrong on the server.',
                });
                break;

            default:
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Something went wrong. Please try again.',
                });
        }
    };

    // =========================================================
    // HANDLE INPUT CHANGE
    // =========================================================

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: '',
        }));
    };

    // =========================================================
    // OPEN ADD MODAL
    // =========================================================

    const openAddModal = () => {
        setEditingFee(null);
        setFormData(initialForm);
        setErrors({});
        setShowModal(true);
    };

    // =========================================================
    // OPEN EDIT MODAL
    // =========================================================

    const openEditModal = (item) => {
        setEditingFee(item);

        setFormData({
            student: item.student || '',
            academic_year:
                item.academic_year ||
                item.academicYear ||
                '',
            fee_type:
                item.fee_type ||
                item.feeType ||
                '',
            amount: item.amount || '',
            due_date:
                item.due_date ||
                item.dueDate ||
                '',
            status: item.status || '',
            description: item.description || '',
        });

        setErrors({});
        setShowModal(true);
    };

    // =========================================================
    // CLOSE MODAL
    // =========================================================

    const closeModal = () => {
        setShowModal(false);
        setEditingFee(null);
        setFormData(initialForm);
        setErrors({});
    };

    // =========================================================
    // VALIDATION
    // =========================================================

    const validateForm = () => {
        const newErrors = {};

        if (!formData.student) {
            newErrors.student = 'Student is required.';
        }

        if (!formData.academic_year) {
            newErrors.academic_year =
                'Academic Year is required.';
        }

        if (!formData.fee_type) {
            newErrors.fee_type = 'Fee Type is required.';
        }

        if (!formData.amount) {
            newErrors.amount = 'Amount is required.';
        }

        if (!formData.due_date) {
            newErrors.due_date = 'Due Date is required.';
        }

        if (!formData.status) {
            newErrors.status = 'Status is required.';
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    // =========================================================
    // SAVE FEE
    // =========================================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setSaving(true);

            // API will be connected later
            //
            // if (editingFee) {
            //     await api.put(
            //         `/fees/${editingFee.id}`,
            //         formData
            //     );
            // } else {
            //     await api.post('/fees', formData);
            // }

            const newFee = {
                ...formData,
                id: editingFee?.id || Date.now(),
            };

            let updatedFees = [];

            if (editingFee) {
                updatedFees = fees.map((item) =>
                    item.id === editingFee.id
                        ? newFee
                        : item
                );

                if (
                    mockStorage &&
                    typeof mockStorage.updateFee === 'function'
                ) {
                    mockStorage.updateFee(
                        editingFee.id,
                        newFee
                    );
                }
            } else {
                updatedFees = [...fees, newFee];

                if (
                    mockStorage &&
                    typeof mockStorage.addFee === 'function'
                ) {
                    mockStorage.addFee(newFee);
                }
            }

            localStorage.setItem(
                'sms_fees',
                JSON.stringify(updatedFees)
            );

            setFees(updatedFees);

            closeModal();

            Swal.fire({
                icon: 'success',
                title: editingFee
                    ? 'Fee Updated'
                    : 'Fee Added',
                text: editingFee
                    ? 'Fee record has been updated successfully.'
                    : 'Fee record has been added successfully.',
                timer: 1800,
                showConfirmButton: false,
            });
        } catch (error) {
            console.error('Error saving fee:', error);
            handleApiError(error);
        } finally {
            setSaving(false);
        }
    };

    // =========================================================
    // DELETE FEE
    // =========================================================

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            icon: 'warning',
            title: 'Delete Fee?',
            text: 'This fee record will be permanently deleted.',
            showCancelButton: true,
            confirmButtonText: 'Yes, Delete',
            cancelButtonText: 'Cancel',
        });

        if (!result.isConfirmed) {
            return;
        }

        try {
            // API will be connected later
            //
            // await api.delete(`/fees/${id}`);

            if (
                mockStorage &&
                typeof mockStorage.deleteFee === 'function'
            ) {
                mockStorage.deleteFee(id);
            }

            const updatedFees = fees.filter(
                (item) => item.id !== id
            );

            localStorage.setItem(
                'sms_fees',
                JSON.stringify(updatedFees)
            );

            setFees(updatedFees);

            Swal.fire({
                icon: 'success',
                title: 'Deleted',
                text: 'Fee record has been deleted successfully.',
                timer: 1500,
                showConfirmButton: false,
            });
        } catch (error) {
            console.error('Error deleting fee:', error);
            handleApiError(error);
        }
    };

    // =========================================================
    // GET STUDENT NAME
    // =========================================================

    const getStudentName = (studentValue) => {
        const foundStudent = students.find(
            (item) =>
                String(item.id) === String(studentValue) ||
                String(item.name) === String(studentValue)
        );

        return (
            foundStudent?.name ||
            studentValue ||
            '-'
        );
    };

    // =========================================================
    // GET ACADEMIC YEAR NAME
    // =========================================================

    const getAcademicYearName = (yearValue) => {
        const foundYear = academicYears.find(
            (item) =>
                String(item.id) === String(yearValue) ||
                String(item.name) === String(yearValue) ||
                String(item.year) === String(yearValue)
        );

        return (
            foundYear?.name ||
            foundYear?.year ||
            yearValue ||
            '-'
        );
    };

    // =========================================================
    // SEARCH
    // =========================================================

    const filteredFees = fees.filter((item) => {
        const search = searchTerm.toLowerCase();

        return (
            String(
                getStudentName(item.student)
            )
                .toLowerCase()
                .includes(search) ||
            String(
                getAcademicYearName(
                    item.academic_year ||
                    item.academicYear
                )
            )
                .toLowerCase()
                .includes(search) ||
            String(
                item.fee_type ||
                item.feeType ||
                ''
            )
                .toLowerCase()
                .includes(search) ||
            String(item.amount || '')
                .toLowerCase()
                .includes(search) ||
            String(item.due_date || item.dueDate || '')
                .toLowerCase()
                .includes(search) ||
            String(item.status || '')
                .toLowerCase()
                .includes(search)
        );
    });

    // =========================================================
    // FIELD ERROR
    // =========================================================

    const fieldError = (fieldName) => {
        return errors[fieldName] ? (
            <small className="text-danger">
                {errors[fieldName]}
            </small>
        ) : null;
    };

    // =========================================================
    // UI
    // =========================================================

    return (
        <div className="academic-years-page">

            {/* PAGE HEADER */}
            <div className="academic-years-header">

                <div>

                    <p className="section-kicker">
                        Fees
                    </p>

                    <h1>Fees</h1>

                    <p className="hero-copy">
                        Manage student fee records and information.
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

                    Add Fee
                </button>

            </div>

            {/* MAIN PANEL */}
            <div className="dashboard-panel academic-years-panel">

                {/* PANEL HEADER */}
                <div className="academic-years-panel-heading">

                    <div>

                        <p className="section-kicker">
                            Fee management
                        </p>

                        <h2>Fee list</h2>

                    </div>

                    <div className="d-flex align-items-center gap-3">

                        <div className="student-search">

                            <i
                                className="bi bi-search"
                                aria-hidden="true"
                            ></i>

                            <input
                                type="text"
                                placeholder="Search fees..."
                                value={searchTerm}
                                onChange={(e) =>
                                    setSearchTerm(
                                        e.target.value
                                    )
                                }
                            />

                        </div>

                        <span className="panel-count">
                            {filteredFees.length} records
                        </span>

                    </div>

                </div>

                {/* TABLE */}
                <div className="academic-years-table-wrap">

                    {loading ? (

                        <div className="academic-years-empty">

                            <div
                                className="spinner-border"
                                role="status"
                            >

                                <span className="visually-hidden">
                                    Loading...
                                </span>

                            </div>

                            <p>Loading fees...</p>

                        </div>

                    ) : filteredFees.length === 0 ? (

                        <div className="academic-years-empty">

                            <i className="bi bi-cash-stack"></i>

                            <h3>
                                No fee records found
                            </h3>

                            <p>
                                Add a fee record to get
                                started.
                            </p>

                        </div>

                    ) : (

                        <div className="table-responsive">

                            <table className="table academic-years-table">

                                <thead>

                                    <tr>

                                        <th>#</th>

                                        <th>
                                            Student
                                        </th>

                                        <th>
                                            Academic Year
                                        </th>

                                        <th>
                                            Fee Type
                                        </th>

                                        <th>
                                            Amount
                                        </th>

                                        <th>
                                            Due Date
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

                                    {filteredFees.map(
                                        (item, index) => (

                                            <tr
                                                key={item.id}
                                            >

                                                <td>

                                                    <span className="academic-years-index">
                                                        {index + 1}
                                                    </span>

                                                </td>

                                                <td>

                                                    <div className="student-table-name">

                                                        <div className="student-avatar">

                                                            <i className="bi bi-person"></i>

                                                        </div>

                                                        <div>

                                                            <strong>
                                                                {getStudentName(
                                                                    item.student
                                                                )}
                                                            </strong>

                                                            <small>
                                                                Fee Record
                                                            </small>

                                                        </div>

                                                    </div>

                                                </td>

                                                <td>

                                                    {getAcademicYearName(
                                                        item.academic_year ||
                                                            item.academicYear
                                                    )}

                                                </td>

                                                <td>

                                                    {item.fee_type ||
                                                        item.feeType ||
                                                        '-'}

                                                </td>

                                                <td>

                                                    {item.amount
                                                        ? Number(
                                                              item.amount
                                                          ).toLocaleString()
                                                        : '-'}

                                                </td>

                                                <td>

                                                    {item.due_date ||
                                                        item.dueDate ||
                                                        '-'}

                                                </td>

                                                <td>

                                                    {item.status ||
                                                        '-'}

                                                </td>

                                                <td>

                                                    <div className="academic-actions">

                                                        <button
                                                            type="button"
                                                            className="academic-action-button edit"
                                                            onClick={() =>
                                                                openEditModal(
                                                                    item
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
                                                                    item.id
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

            </div>

            {/* ADD / EDIT MODAL */}
            {showModal && (

                <div className="student-modal-overlay">

                    <div className="student-modal">

                        {/* MODAL HEADER */}
                        <div className="student-modal-header">

                            <div>

                                <p className="section-kicker">
                                    Fee management
                                </p>

                                <h2>

                                    {editingFee
                                        ? 'Edit Fee'
                                        : 'Add Fee'}

                                </h2>

                            </div>

                            <button
                                type="button"
                                className="btn-close"
                                onClick={closeModal}
                            ></button>

                        </div>

                        {/* MODAL BODY */}
                        <div className="student-modal-body">

                            <form onSubmit={handleSubmit}>

                                <div className="student-form-grid">

                                    {/* STUDENT */}
                                    <div className="form-group">

                                        <label htmlFor="student">
                                            Student *
                                        </label>

                                        <select
                                            id="student"
                                            name="student"
                                            value={formData.student}
                                            onChange={handleChange}
                                            className={
                                                errors.student
                                                    ? 'is-invalid'
                                                    : ''
                                            }
                                        >

                                            <option value="">
                                                Select Student
                                            </option>

                                            {students.map(
                                                (item) => (

                                                    <option
                                                        key={
                                                            item.id
                                                        }
                                                        value={
                                                            item.id ??
                                                            item.name
                                                        }
                                                    >
                                                        {item.name}
                                                    </option>

                                                )
                                            )}

                                        </select>

                                        {fieldError(
                                            'student'
                                        )}

                                    </div>

                                    {/* ACADEMIC YEAR */}
                                    <div className="form-group">

                                        <label htmlFor="academic_year">
                                            Academic Year *
                                        </label>

                                        <select
                                            id="academic_year"
                                            name="academic_year"
                                            value={
                                                formData.academic_year
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            className={
                                                errors.academic_year
                                                    ? 'is-invalid'
                                                    : ''
                                            }
                                        >

                                            <option value="">
                                                Select Academic Year
                                            </option>

                                            {academicYears.map(
                                                (item) => (

                                                    <option
                                                        key={
                                                            item.id
                                                        }
                                                        value={
                                                            item.id ??
                                                            item.name ??
                                                            item.year
                                                        }
                                                    >
                                                        {item.name ??
                                                            item.year}
                                                    </option>

                                                )
                                            )}

                                            {academicYears.length ===
                                                0 && (
                                                <>
                                                    <option value="2025-2026">
                                                        2025-2026
                                                    </option>

                                                    <option value="2026-2027">
                                                        2026-2027
                                                    </option>

                                                    <option value="2027-2028">
                                                        2027-2028
                                                    </option>
                                                </>
                                            )}

                                        </select>

                                        {fieldError(
                                            'academic_year'
                                        )}

                                    </div>

                                    {/* FEE TYPE */}
                                    <div className="form-group">

                                        <label htmlFor="fee_type">
                                            Fee Type *
                                        </label>

                                        <select
                                            id="fee_type"
                                            name="fee_type"
                                            value={
                                                formData.fee_type
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            className={
                                                errors.fee_type
                                                    ? 'is-invalid'
                                                    : ''
                                            }
                                        >

                                            <option value="">
                                                Select Fee Type
                                            </option>

                                            <option value="Tuition Fee">
                                                Tuition Fee
                                            </option>

                                            <option value="Admission Fee">
                                                Admission Fee
                                            </option>

                                            <option value="Transport Fee">
                                                Transport Fee
                                            </option>

                                            <option value="Examination Fee">
                                                Examination Fee
                                            </option>

                                            <option value="Library Fee">
                                                Library Fee
                                            </option>

                                            <option value="Other">
                                                Other
                                            </option>

                                        </select>

                                        {fieldError(
                                            'fee_type'
                                        )}

                                    </div>

                                    {/* AMOUNT */}
                                    <div className="form-group">

                                        <label htmlFor="amount">
                                            Amount *
                                        </label>

                                        <input
                                            type="number"
                                            id="amount"
                                            name="amount"
                                            value={
                                                formData.amount
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Enter amount"
                                            className={
                                                errors.amount
                                                    ? 'is-invalid'
                                                    : ''
                                            }
                                        />

                                        {fieldError(
                                            'amount'
                                        )}

                                    </div>

                                    {/* DUE DATE */}
                                    <div className="form-group">

                                        <label htmlFor="due_date">
                                            Due Date *
                                        </label>

                                        <input
                                            type="date"
                                            id="due_date"
                                            name="due_date"
                                            value={
                                                formData.due_date
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            className={
                                                errors.due_date
                                                    ? 'is-invalid'
                                                    : ''
                                            }
                                        />

                                        {fieldError(
                                            'due_date'
                                        )}

                                    </div>

                                    {/* STATUS */}
                                    <div className="form-group">

                                        <label htmlFor="status">
                                            Status *
                                        </label>

                                        <select
                                            id="status"
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

                                            <option value="Paid">
                                                Paid
                                            </option>

                                            <option value="Pending">
                                                Pending
                                            </option>

                                            <option value="Partial">
                                                Partial
                                            </option>

                                            <option value="Overdue">
                                                Overdue
                                            </option>

                                        </select>

                                        {fieldError(
                                            'status'
                                        )}

                                    </div>

                                    {/* DESCRIPTION */}
                                    <div className="form-group">

                                        <label htmlFor="description">
                                            Description
                                        </label>

                                        <textarea
                                            id="description"
                                            name="description"
                                            value={
                                                formData.description
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Enter description"
                                            rows="3"
                                        ></textarea>

                                    </div>

                                </div>

                                {/* MODAL FOOTER */}
                                <div className="student-modal-footer">

                                    <button
                                        type="button"
                                        className="student-modal-cancel"
                                        onClick={closeModal}
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
                                                ></span>

                                                Saving...

                                            </>

                                        ) : (

                                            <>

                                                <i className="bi bi-check-lg"></i>

                                                {editingFee
                                                    ? 'Update Fee'
                                                    : 'Save Fee'}

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

export default Fees;


