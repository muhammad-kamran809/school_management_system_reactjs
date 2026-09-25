
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

// API will be connected later by backend developer
// import api from '../../../services/api';

import { mockStorage } from '../../../services/mockData';

const initialForm = {
  fee: '',
  student: '',
  amount: '',
  payment_date: '',
  payment_method: '',
  receipt_number: '',
  remarks: '',
};

const demoPayments = [
  {
    id: 'PAY-001',
    fee: 'Tuition Fee',
    student: 'Ali Khan',
    amount: 25000,
    payment_date: '2026-09-05',
    payment_method: 'Cash',
    receipt_number: 'REC-001',
    remarks: 'Full tuition fee payment',
  },
  {
    id: 'PAY-002',
    fee: 'Admission Fee',
    student: 'Ahmed Raza',
    amount: 15000,
    payment_date: '2026-09-08',
    payment_method: 'Bank Transfer',
    receipt_number: 'REC-002',
    remarks: 'Admission fee received',
  },
  {
    id: 'PAY-003',
    fee: 'Transport Fee',
    student: 'Sara Ahmed',
    amount: 8000,
    payment_date: '2026-09-10',
    payment_method: 'Online Payment',
    receipt_number: 'REC-003',
    remarks: 'Transport charges paid',
  },
  {
    id: 'PAY-004',
    fee: 'Examination Fee',
    student: 'Usman Ali',
    amount: 5000,
    payment_date: '2026-09-12',
    payment_method: 'Cash',
    receipt_number: 'REC-004',
    remarks: 'Examination fee received',
  },
  {
    id: 'PAY-005',
    fee: 'Library Fee',
    student: 'Ayesha Malik',
    amount: 3000,
    payment_date: '2026-09-15',
    payment_method: 'Card',
    receipt_number: 'REC-005',
    remarks: 'Library charges paid',
  },
];

function Payments() {
  const [payments, setPayments] = useState([]);
  const [students, setStudents] = useState([]);
  const [fees, setFees] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchPayments();
    fetchStudents();
    fetchFees();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      let data = [];

      if (
        mockStorage &&
        typeof mockStorage.getPayments === 'function'
      ) {
        data = mockStorage.getPayments() || [];
      } else {
        const storedPayments = localStorage.getItem('sms_payments');
        data = storedPayments ? JSON.parse(storedPayments) : [];
      }

      if (!data || data.length === 0) {
        data = demoPayments;
        localStorage.setItem(
          'sms_payments',
          JSON.stringify(demoPayments)
        );
      }

      setPayments(data);
    } catch (error) {
      console.error('Error loading payments:', error);
      const storedPayments = localStorage.getItem('sms_payments');
      if (storedPayments) {
        try {
          setPayments(JSON.parse(storedPayments));
        } catch {
          setPayments(demoPayments);
        }
      } else {
        setPayments(demoPayments);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      let data = [];
      if (
        mockStorage &&
        typeof mockStorage.getStudents === 'function'
      ) {
        data = mockStorage.getStudents() || [];
      } else {
        const storedStudents =
          localStorage.getItem('school_students');

        data = storedStudents
          ? JSON.parse(storedStudents)
          : [];
      }

      setStudents(data);
    } catch (error) {
      console.error('Error loading students:', error);
      setStudents([]);
    }
  };

  const fetchFees = async () => {
    try {
      let data = [];
      if (
        mockStorage &&
        typeof mockStorage.getFees === 'function'
      ) {
        data = mockStorage.getFees() || [];
      } else {
        const storedFees = localStorage.getItem('sms_fees');

        data = storedFees
          ? JSON.parse(storedFees)
          : [];
      }

      setFees(data);
    } catch (error) {
      console.error('Error loading fees:', error);
      setFees([]);
    }
  };

  const handleApiError = (error) => {
    console.error('Payment API error:', error);
    const status = error?.response?.status;

    if (status === 422) {
      Swal.fire(
        'Validation Error',
        'Please check the entered information.',
        'error'
      );
    } else if (status === 401) {
      Swal.fire(
        'Unauthorized',
        'You are not authorized to perform this action.',
        'error'
      );
    } else if (status === 403) {
      Swal.fire(
        'Forbidden',
        'You do not have permission to perform this action.',
        'error'
      );
    } else if (status === 404) {
      Swal.fire(
        'Not Found',
        'The requested payment record was not found.',
        'error'
      );
    } else if (status === 500) {
      Swal.fire(
        'Server Error',
        'Something went wrong on the server.',
        'error'
      );
    } else {
      Swal.fire(
        'Error',
        'Something went wrong. Please try again.',
        'error'
      );
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((previous) => ({
        ...previous,
        [name]: '',
      }));
    }
  };

  const openAddModal = () => {
    setEditingPayment(null);
    setForm(initialForm);
    setErrors({});
    setShowModal(true);
  };

  const openEditModal = (payment) => {
    setEditingPayment(payment);

    setForm({
      fee: payment.fee || '',
      student: payment.student || '',
      amount: payment.amount || '',
      payment_date: payment.payment_date || '',
      payment_method: payment.payment_method || '',
      receipt_number: payment.receipt_number || '',
      remarks: payment.remarks || '',
    });

    setErrors({});
    setShowModal(true);
  };

  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    setEditingPayment(null);
    setForm(initialForm);
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.fee.trim()) {
      newErrors.fee = 'Fee is required';
    }

    if (!form.student.trim()) {
      newErrors.student = 'Student is required';
    }

    if (!form.amount) {
      newErrors.amount = 'Amount is required';
    } else if (Number(form.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (!form.payment_date) {
      newErrors.payment_date = 'Payment Date is required';
    }

    if (!form.payment_method) {
      newErrors.payment_method = 'Payment Method is required';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSaving(true);

    try {
      const paymentData = {
        id:
          editingPayment?.id ||
          `PAY-${Date.now()}`,
        fee: form.fee,
        student: form.student,
        amount: Number(form.amount),
        payment_date: form.payment_date,
        payment_method: form.payment_method,
        receipt_number: form.receipt_number,
        remarks: form.remarks,
      };

      let updatedPayments;

      if (editingPayment) {
        updatedPayments = payments.map((payment) =>
          payment.id === editingPayment.id
            ? paymentData
            : payment
        );

        if (
          mockStorage &&
          typeof mockStorage.updatePayment === 'function'
        ) {
          mockStorage.updatePayment(
            editingPayment.id,
            paymentData
          );
        }
      } else {
        updatedPayments = [
          ...payments,
          paymentData,
        ];

        if (
          mockStorage &&
          typeof mockStorage.addPayment === 'function'
        ) {
          mockStorage.addPayment(paymentData);
        }
      }

      localStorage.setItem(
        'sms_payments',
        JSON.stringify(updatedPayments)
      );

      setPayments(updatedPayments);

      Swal.fire({
        icon: 'success',
        title: editingPayment
          ? 'Payment Updated'
          : 'Payment Added',
        text: editingPayment
          ? 'Payment has been updated successfully.'
          : 'Payment has been added successfully.',
        timer: 1500,
        showConfirmButton: false,
      });

      closeModal();
    } catch (error) {
      handleApiError(error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (payment) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This payment record will be deleted.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'Cancel',
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      if (
        mockStorage &&
        typeof mockStorage.deletePayment === 'function'
      ) {
        mockStorage.deletePayment(payment.id);
      }

      const updatedPayments = payments.filter(
        (item) => item.id !== payment.id
      );

      localStorage.setItem(
        'sms_payments',
        JSON.stringify(updatedPayments)
      );

      setPayments(updatedPayments);

      Swal.fire({
        icon: 'success',
        title: 'Deleted',
        text: 'Payment has been deleted successfully.',
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      handleApiError(error);
    }
  };

  const getStudentName = (studentValue) => {
    if (!studentValue) {
      return '-';
    }

    const student = students.find(
      (item) =>
        String(item.id) === String(studentValue) ||
        item.name === studentValue
    );

    return student?.name || studentValue;
  };

  const getFeeName = (feeValue) => {
    if (!feeValue) {
      return '-';
    }

    const fee = fees.find(
      (item) =>
        String(item.id) === String(feeValue) ||
        item.name === feeValue ||
        item.fee_type === feeValue
    );

    return (
      fee?.name ||
      fee?.fee_type ||
      feeValue
    );
  };

  const filteredPayments = payments.filter((payment) => {
    const search = searchTerm.toLowerCase();

    return (
      String(payment.fee || '')
        .toLowerCase()
        .includes(search) ||
      String(payment.student || '')
        .toLowerCase()
        .includes(search) ||
      String(payment.amount || '')
        .toLowerCase()
        .includes(search) ||
      String(payment.payment_method || '')
        .toLowerCase()
        .includes(search) ||
      String(payment.receipt_number || '')
        .toLowerCase()
        .includes(search) ||
      String(payment.payment_date || '')
        .toLowerCase()
        .includes(search)
    );
  });

  const fieldError = (field) => {
    return errors[field] ? (
      <div className="text-danger small mt-1">
        {errors[field]}
      </div>
    ) : null;
  };

  return (
    <div className="academic-years-page">
      <div className="academic-years-header">
        <div className="hero-copy">
          <div className="section-kicker">
            Finance
          </div>

          <h1>Payments</h1>

          <p>
            Manage payment records and information
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary academic-years-add"
          onClick={openAddModal}
        >
          <i className="bi bi-plus-lg me-2"></i>
          Add Payment
        </button>
      </div>

      <div className="dashboard-panel academic-years-panel">
        <div className="academic-years-panel-heading">
          <div className="student-search">
            <input
              type="text"
              className="form-control"
              placeholder="Search payments..."
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
            />
          </div>

          <div className="panel-count">
            {filteredPayments.length} payment
            {filteredPayments.length !== 1
              ? 's'
              : ''}
          </div>
        </div>

        {loading ? (
          <div className="academic-years-empty">
            <div
              className="spinner-border"
              role="status"
            >
              <span className="visually-hidden">
                Loading... </span>
            </div>

            <p>Loading payments...</p>
          </div>
        ) : filteredPayments.length === 0 ? (
          <div className="academic-years-empty">
            <i className="bi bi-wallet2"></i>

            <h3>No payments found</h3>

            <p>
              Add a payment record to get started. </p>
          </div>
        ) : (
          <div className="academic-years-table-wrap">
            <table className="table academic-years-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Student</th>
                  <th>Fee</th>
                  <th>Amount</th>
                  <th>Payment Date</th>
                  <th>Payment Method</th>
                  <th>Receipt Number</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredPayments.map(
                  (payment, index) => (
                    <tr key={payment.id}>
                      <td>
                        <span className="academic-years-index">
                          {index + 1}
                        </span>
                      </td>

                      <td>
                        <div className="student-table-name">
                          <div className="student-avatar">
                            {String(
                              getStudentName(
                                payment.student
                              )
                            )
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <span>
                            {getStudentName(
                              payment.student
                            )}
                          </span>
                        </div>
                      </td>

                      <td>
                        {getFeeName(payment.fee)}
                      </td>

                      <td>
                        {Number(
                          payment.amount || 0
                        ).toLocaleString()}
                      </td>

                      <td>
                        {payment.payment_date || '-'}
                      </td>

                      <td>
                        {payment.payment_method || '-'}
                      </td>

                      <td>
                        {payment.receipt_number || '-'}
                      </td>

                      <td>
                        <div className="academic-actions">
                          <button
                            type="button"
                            className="academic-action-button edit"
                            onClick={() =>
                              openEditModal(payment)
                            }
                            title="Edit"
                          >
                            <i className="bi bi-pencil"></i>
                          </button>

                          <button
                            type="button"
                            className="academic-action-button delete"
                            onClick={() =>
                              handleDelete(payment)
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

      {showModal && (
        <div
          className="student-modal-overlay"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget
            ) {
              closeModal();
            }
          }}
        >
          <div className="student-modal">
            <div className="student-modal-header">
              <div>
                <div className="section-kicker">
                  Finance
                </div>

                <h2>
                  {editingPayment
                    ? 'Edit Payment'
                    : 'Add Payment'}
                </h2>
              </div>

              <button
                type="button"
                className="btn-close"
                onClick={closeModal}
                disabled={saving}
              ></button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="student-modal-body">
                <div className="student-form-grid">
                  {/* Fee */}
                  <div className="form-group">
                    <label htmlFor="fee">
                      Fee <span>*</span>
                    </label>

                    <select
                      id="fee"
                      name="fee"
                      className={`form-control ${
                        errors.fee
                          ? 'is-invalid'
                          : ''
                      }`}
                      value={form.fee}
                      onChange={handleChange}
                    >
                      <option value="">
                        Select Fee
                      </option>

                      {fees.length > 0 ? (
                        fees.map((fee) => (
                          <option
                            key={fee.id}
                            value={
                              fee.id ||
                              fee.name ||
                              fee.fee_type
                            }
                          >
                            {fee.name ||
                              fee.fee_type ||
                              'Fee'}
                          </option>
                        ))
                      ) : (
                        <>
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
                        </>
                      )}
                    </select>

                    {fieldError('fee')}
                  </div>

                  {/* Student */}
                  <div className="form-group">
                    <label htmlFor="student">
                      Student <span>*</span>
                    </label>

                    <select
                      id="student"
                      name="student"
                      className={`form-control ${
                        errors.student
                          ? 'is-invalid'
                          : ''
                      }`}
                      value={form.student}
                      onChange={handleChange}
                    >
                      <option value="">
                        Select Student
                      </option>

                      {students.length > 0 ? (
                        students.map((student) => (
                          <option
                            key={student.id}
                            value={
                              student.id ||
                              student.name
                            }
                          >
                            {student.name}
                          </option>
                        ))
                      ) : (
                        <>
                          <option value="Ali Khan">
                            Ali Khan
                          </option>

                          <option value="Ahmed Raza">
                            Ahmed Raza
                          </option>

                          <option value="Sara Ahmed">
                            Sara Ahmed
                          </option>

                          <option value="Usman Ali">
                            Usman Ali
                          </option>

                          <option value="Ayesha Malik">
                            Ayesha Malik
                          </option>
                        </>
                      )}
                    </select>

                    {fieldError('student')}
                  </div>

                  {/* Amount */}
                  <div className="form-group">
                    <label htmlFor="amount">
                      Amount <span>*</span>
                    </label>

                    <input
                      id="amount"
                      type="number"
                      name="amount"
                      className={`form-control ${
                        errors.amount
                          ? 'is-invalid'
                          : ''
                      }`}
                      placeholder="Enter amount"
                      value={form.amount}
                      onChange={handleChange}
                      min="0"
                    />

                    {fieldError('amount')}
                  </div>

                  {/* Payment Date */}
                  <div className="form-group">
                    <label htmlFor="payment_date">
                      Payment Date <span>*</span>
                    </label>

                    <input
                      id="payment_date"
                      type="date"
                      name="payment_date"
                      className={`form-control ${
                        errors.payment_date
                          ? 'is-invalid'
                          : ''
                      }`}
                      value={form.payment_date}
                      onChange={handleChange}
                    />

                    {fieldError('payment_date')}
                  </div>

                  {/* Payment Method */}
                  <div className="form-group">
                    <label htmlFor="payment_method">
                      Payment Method <span>*</span>
                    </label>

                    <select
                      id="payment_method"
                      name="payment_method"
                      className={`form-control ${
                        errors.payment_method
                          ? 'is-invalid'
                          : ''
                      }`}
                      value={form.payment_method}
                      onChange={handleChange}
                    >
                      <option value="">
                        Select Payment Method
                      </option>

                      <option value="Cash">
                        Cash
                      </option>

                      <option value="Bank Transfer">
                        Bank Transfer
                      </option>

                      <option value="Online Payment">
                        Online Payment
                      </option>

                      <option value="Card">
                        Card
                      </option>

                      <option value="Cheque">
                        Cheque
                      </option>
                    </select>

                    {fieldError(
                      'payment_method'
                    )}
                  </div>

                  {/* Receipt Number */}
                  <div className="form-group">
                    <label htmlFor="receipt_number">
                      Receipt Number
                    </label>

                    <input
                      id="receipt_number"
                      type="text"
                      name="receipt_number"
                      className="form-control"
                      placeholder="Enter receipt number"
                      value={form.receipt_number}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Remarks */}
                  <div className="form-group">
                    <label htmlFor="remarks">
                      Remarks
                    </label>

                    <textarea
                      id="remarks"
                      name="remarks"
                      className="form-control"
                      placeholder="Enter remarks"
                      rows="3"
                      value={form.remarks}
                      onChange={handleChange}
                    ></textarea>
                  </div>
                </div>
              </div>

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
                      ></span>

                      Saving... </>
                  ) : editingPayment ? (
                    'Update Payment'
                  ) : (
                    'Add Payment'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Payments;

