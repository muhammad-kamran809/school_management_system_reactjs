// import { useEffect, useMemo, useState } from 'react';
// import Swal from 'sweetalert2';

// // API will be connected later by backend developer
// // import api from '../../../services/api';

// import { mockStorage } from '../../../services/mockData';

// const FeeReports = () => {
// const [students, setStudents] = useState([]);
// const [fees, setFees] = useState([]);
// const [payments, setPayments] = useState([]);
// const [academicYears, setAcademicYears] = useState([]);

// ```
// const [loading, setLoading] = useState(true);

// const [searchTerm, setSearchTerm] = useState('');

// const [filters, setFilters] = useState({
//     academic_year: '',
//     student: '',
//     class_name: '',
//     section: '',
//     fee_type: '',
//     payment_status: '',
//     date_from: '',
//     date_to: '',
// });

// useEffect(() => {
//     fetchReportData();
// }, []);

// // =========================================================
// // FETCH REPORT DATA
// // =========================================================

// const fetchReportData = async () => {
//     try {
//         setLoading(true);

//         // API will be connected later
//         //
//         // const studentsResponse =
//         //     await api.get('/students');
//         //
//         // const feesResponse =
//         //     await api.get('/fees');
//         //
//         // const paymentsResponse =
//         //     await api.get('/payments');
//         //
//         // setStudents(studentsResponse.data);
//         // setFees(feesResponse.data);
//         // setPayments(paymentsResponse.data);

//         let studentData = [];
//         let feeData = [];
//         let paymentData = [];
//         let academicYearData = [];

//         // =====================================================
//         // STUDENTS
//         // =====================================================

//         if (
//             mockStorage &&
//             typeof mockStorage.getStudents === 'function'
//         ) {
//             studentData =
//                 mockStorage.getStudents() || [];
//         } else {
//             const storedStudents =
//                 localStorage.getItem(
//                     'school_students'
//                 );

//             studentData = storedStudents
//                 ? JSON.parse(storedStudents)
//                 : [];
//         }

//         // =====================================================
//         // FEES
//         // =====================================================

//         if (
//             mockStorage &&
//             typeof mockStorage.getFees === 'function'
//         ) {
//             feeData =
//                 mockStorage.getFees() || [];
//         } else {
//             const storedFees =
//                 localStorage.getItem(
//                     'sms_fees'
//                 );

//             feeData = storedFees
//                 ? JSON.parse(storedFees)
//                 : [];
//         }

//         // =====================================================
//         // PAYMENTS
//         // =====================================================

//         if (
//             mockStorage &&
//             typeof mockStorage.getPayments === 'function'
//         ) {
//             paymentData =
//                 mockStorage.getPayments() || [];
//         } else {
//             const storedPayments =
//                 localStorage.getItem(
//                     'sms_payments'
//                 );

//             paymentData = storedPayments
//                 ? JSON.parse(storedPayments)
//                 : [];
//         }

//         // =====================================================
//         // ACADEMIC YEARS
//         // =====================================================

//         if (
//             mockStorage &&
//             typeof mockStorage.getAcademicYears ===
//                 'function'
//         ) {
//             academicYearData =
//                 mockStorage.getAcademicYears() || [];
//         } else {
//             const storedAcademicYears =
//                 localStorage.getItem(
//                     'sms_academic_years'
//                 );

//             academicYearData = storedAcademicYears
//                 ? JSON.parse(storedAcademicYears)
//                 : [];
//         }

//         setStudents(
//             Array.isArray(studentData)
//                 ? studentData
//                 : []
//         );

//         setFees(
//             Array.isArray(feeData)
//                 ? feeData
//                 : []
//         );

//         setPayments(
//             Array.isArray(paymentData)
//                 ? paymentData
//                 : []
//         );

//         setAcademicYears(
//             Array.isArray(academicYearData)
//                 ? academicYearData
//                 : []
//         );
//     } catch (error) {
//         console.error(
//             'Error fetching fee report data:',
//             error
//         );

//         Swal.fire({
//             icon: 'error',
//             title: 'Error',
//             text: 'Failed to load fee report data.',
//         });

//         setStudents([]);
//         setFees([]);
//         setPayments([]);
//         setAcademicYears([]);
//     } finally {
//         setLoading(false);
//     }
// };

// // =========================================================
// // GET STUDENT
// // =========================================================

// const getStudent = (studentValue) => {
//     return (
//         students.find(
//             (item) =>
//                 String(item.id) ===
//                     String(studentValue) ||
//                 String(item.name) ===
//                     String(studentValue)
//         ) || null
//     );
// };

// // =========================================================
// // GET STUDENT NAME
// // =========================================================

// const getStudentName = (studentValue) => {
//     const student =
//         getStudent(studentValue);

//     return (
//         student?.name ||
//         studentValue ||
//         '-'
//     );
// };

// // =========================================================
// // GET STUDENT CLASS
// // =========================================================

// const getStudentClass = (studentValue) => {
//     const student =
//         getStudent(studentValue);

//     return (
//         student?.class_name ||
//         student?.className ||
//         student?.class ||
//         student?.grade ||
//         '-'
//     );
// };

// // =========================================================
// // GET STUDENT SECTION
// // =========================================================

// const getStudentSection = (studentValue) => {
//     const student =
//         getStudent(studentValue);

//     return (
//         student?.section ||
//         student?.section_name ||
//         '-'
//     );
// };

// // =========================================================
// // GET ACADEMIC YEAR
// // =========================================================

// const getAcademicYear = (fee) => {
//     return (
//         fee?.academic_year ||
//         fee?.academicYear ||
//         fee?.academic_year_id ||
//         fee?.academicYearId ||
//         ''
//     );
// };

// // =========================================================
// // GET ACADEMIC YEAR NAME
// // =========================================================

// const getAcademicYearName = (
//     yearValue
// ) => {
//     const foundYear =
//         academicYears.find(
//             (item) =>
//                 String(item.id) ===
//                     String(yearValue) ||
//                 String(item.name) ===
//                     String(yearValue) ||
//                 String(item.year) ===
//                     String(yearValue)
//         );

//     return (
//         foundYear?.name ||
//         foundYear?.year ||
//         yearValue ||
//         '-'
//     );
// };

// // =========================================================
// // GET FEE STUDENT
// // =========================================================

// const getFeeStudent = (fee) => {
//     return (
//         fee?.student ||
//         fee?.student_id ||
//         fee?.studentId ||
//         ''
//     );
// };

// // =========================================================
// // GET FEE TYPE
// // =========================================================

// const getFeeType = (fee) => {
//     return (
//         fee?.fee_type ||
//         fee?.feeType ||
//         '-'
//     );
// };

// // =========================================================
// // GET FEE AMOUNT
// // =========================================================

// const getFeeAmount = (fee) => {
//     return Number(
//         fee?.amount ||
//             fee?.total_amount ||
//             fee?.totalAmount ||
//             0
//     );
// };

// // =========================================================
// // GET PAYMENT FEE
// // =========================================================

// const getPaymentFee = (payment) => {
//     return (
//         payment?.fee ||
//         payment?.fee_id ||
//         payment?.feeId ||
//         ''
//     );
// };

// // =========================================================
// // GET PAYMENT STUDENT
// // =========================================================

// const getPaymentStudent = (
//     payment
// ) => {
//     return (
//         payment?.student ||
//         payment?.student_id ||
//         payment?.studentId ||
//         ''
//     );
// };

// // =========================================================
// // GET PAYMENT AMOUNT
// // =========================================================

// const getPaymentAmount = (
//     payment
// ) => {
//     return Number(
//         payment?.amount ||
//             payment?.paid_amount ||
//             payment?.paidAmount ||
//             0
//     );
// };

// // =========================================================
// // GET PAYMENT DATE
// // =========================================================

// const getPaymentDate = (
//     payment
// ) => {
//     return (
//         payment?.payment_date ||
//         payment?.paymentDate ||
//         payment?.date ||
//         ''
//     );
// };

// // =========================================================
// // CHECK PAYMENT DATE
// // =========================================================

// const isPaymentInsideDateRange = (
//     payment
// ) => {
//     const paymentDate =
//         getPaymentDate(payment);

//     if (!paymentDate) {
//         return (
//             !filters.date_from &&
//             !filters.date_to
//         );
//     }

//     const date = String(
//         paymentDate
//     ).substring(0, 10);

//     if (
//         filters.date_from &&
//         date < filters.date_from
//     ) {
//         return false;
//     }

//     if (
//         filters.date_to &&
//         date > filters.date_to
//     ) {
//         return false;
//     }

//     return true;
// };

// // =========================================================
// // GET PAID AMOUNT FOR FEE
// // =========================================================

// const getPaidAmount = (fee) => {
//     const feeId = fee?.id;
//     const feeStudent =
//         getFeeStudent(fee);

//     const relatedPayments =
//         payments.filter(
//             (payment) => {
//                 const paymentFee =
//                     getPaymentFee(
//                         payment
//                     );

//                 const paymentStudent =
//                     getPaymentStudent(
//                         payment
//                     );

//                 const matchesFee =
//                     paymentFee &&
//                     feeId &&
//                     String(
//                         paymentFee
//                     ) ===
//                         String(
//                             feeId
//                         );

//                 const matchesStudent =
//                     paymentStudent &&
//                     feeStudent &&
//                     String(
//                         paymentStudent
//                     ) ===
//                         String(
//                             feeStudent
//                         );

//                 const matchesDate =
//                     isPaymentInsideDateRange(
//                         payment
//                     );

//                 return (
//                     (
//                         matchesFee ||
//                         matchesStudent
//                     ) &&
//                     matchesDate
//                 );
//             }
//         );

//     return relatedPayments.reduce(
//         (
//             total,
//             payment
//         ) =>
//             total +
//             getPaymentAmount(
//                 payment
//             ),
//         0
//     );
// };

// // =========================================================
// // GET STATUS
// // =========================================================

// const getStatus = (
//     totalFee,
//     paid
// ) => {
//     if (
//         totalFee > 0 &&
//         paid >= totalFee
//     ) {
//         return 'Paid';
//     }

//     if (paid > 0) {
//         return 'Partial';
//     }

//     return 'Unpaid';
// };

// // =========================================================
// // HANDLE FILTER CHANGE
// // =========================================================

// const handleFilterChange = (
//     e
// ) => {
//     const {
//         name,
//         value,
//     } = e.target;

//     setFilters(
//         (prev) => ({
//             ...prev,
//             [name]: value,
//         })
//     );
// };

// // =========================================================
// // RESET FILTERS
// // =========================================================

// const resetFilters = () => {
//     setFilters({
//         academic_year: '',
//         student: '',
//         class_name: '',
//         section: '',
//         fee_type: '',
//         payment_status: '',
//         date_from: '',
//         date_to: '',
//     });

//     setSearchTerm('');
// };

// // =========================================================
// // BUILD REPORT
// // =========================================================

// const reportData = useMemo(() => {
//     return fees
//         .map((fee) => {
//             const studentValue =
//                 getFeeStudent(fee);

//             const totalFee =
//                 getFeeAmount(fee);

//             const paid =
//                 getPaidAmount(fee);

//             const remaining =
//                 Math.max(
//                     totalFee - paid,
//                     0
//                 );

//             const status =
//                 getStatus(
//                     totalFee,
//                     paid
//                 );

//             return {
//                 id: fee.id,
//                 fee,
//                 studentValue,
//                 studentName:
//                     getStudentName(
//                         studentValue
//                     ),
//                 className:
//                     getStudentClass(
//                         studentValue
//                     ),
//                 section:
//                     getStudentSection(
//                         studentValue
//                     ),
//                 academicYear:
//                     getAcademicYearName(
//                         getAcademicYear(
//                             fee
//                         )
//                     ),
//                 academicYearValue:
//                     getAcademicYear(
//                         fee
//                     ),
//                 feeType:
//                     getFeeType(fee),
//                 totalFee,
//                 paid,
//                 remaining,
//                 status,
//             };
//         })
//         .filter((item) => {
//             if (
//                 filters.academic_year &&
//                 String(
//                     item.academicYearValue
//                 ) !==
//                     String(
//                         filters.academic_year
//                     )
//             ) {
//                 return false;
//             }

//             if (
//                 filters.student &&
//                 String(
//                     item.studentValue
//                 ) !==
//                     String(
//                         filters.student
//                     )
//             ) {
//                 return false;
//             }

//             if (
//                 filters.class_name &&
//                 String(
//                     item.className
//                 ).toLowerCase() !==
//                     String(
//                         filters.class_name
//                     ).toLowerCase()
//             ) {
//                 return false;
//             }

//             if (
//                 filters.section &&
//                 String(
//                     item.section
//                 ).toLowerCase() !==
//                     String(
//                         filters.section
//                     ).toLowerCase()
//             ) {
//                 return false;
//             }

//             if (
//                 filters.fee_type &&
//                 String(
//                     item.feeType
//                 ).toLowerCase() !==
//                     String(
//                         filters.fee_type
//                     ).toLowerCase()
//             ) {
//                 return false;
//             }

//             if (
//                 filters.payment_status &&
//                 item.status !==
//                     filters.payment_status
//             ) {
//                 return false;
//             }

//             return true;
//         });
// }, [
//     fees,
//     students,
//     payments,
//     academicYears,
//     filters,
// ]);

// // =========================================================
// // SEARCH
// // =========================================================

// const filteredReports =
//     useMemo(() => {
//         const search =
//             searchTerm
//                 .toLowerCase()
//                 .trim();

//         if (!search) {
//             return reportData;
//         }

//         return reportData.filter(
//             (item) =>
//                 String(
//                     item.studentName
//                 )
//                     .toLowerCase()
//                     .includes(
//                         search
//                     ) ||
//                 String(
//                     item.className
//                 )
//                     .toLowerCase()
//                     .includes(
//                         search
//                     ) ||
//                 String(
//                     item.section
//                 )
//                     .toLowerCase()
//                     .includes(
//                         search
//                     ) ||
//                 String(
//                     item.academicYear
//                 )
//                     .toLowerCase()
//                     .includes(
//                         search
//                     ) ||
//                 String(
//                     item.feeType
//                 )
//                     .toLowerCase()
//                     .includes(
//                         search
//                     ) ||
//                 String(
//                     item.status
//                 )
//                     .toLowerCase()
//                     .includes(
//                         search
//                     )
//         );
//     }, [
//         reportData,
//         searchTerm,
//     ]);

// // =========================================================
// // TOTALS
// // =========================================================

// const totalFee =
//     filteredReports.reduce(
//         (
//             total,
//             item
//         ) =>
//             total +
//             item.totalFee,
//         0
//     );

// const totalPaid =
//     filteredReports.reduce(
//         (
//             total,
//             item
//         ) =>
//             total +
//             item.paid,
//         0
//     );

// const totalRemaining =
//     filteredReports.reduce(
//         (
//             total,
//             item
//         ) =>
//             total +
//             item.remaining,
//         0
//     );

// // =========================================================
// // GET CLASSES
// // =========================================================

// const classes = [
//     ...new Set(
//         students
//             .map(
//                 (student) =>
//                     student.class_name ||
//                     student.className ||
//                     student.class ||
//                     student.grade
//             )
//             .filter(Boolean)
//     ),
// ];

// // =========================================================
// // GET SECTIONS
// // =========================================================

// const sections = [
//     ...new Set(
//         students
//             .map(
//                 (student) =>
//                     student.section ||
//                     student.section_name
//             )
//             .filter(Boolean)
//     ),
// ];

// // =========================================================
// // GET FEE TYPES
// // =========================================================

// const feeTypes = [
//     ...new Set(
//         fees
//             .map((fee) =>
//                 getFeeType(fee)
//             )
//             .filter(
//                 (type) =>
//                     type &&
//                     type !== '-'
//             )
//     ),
// ];

// // =========================================================
// // UI
// // =========================================================

// return (
//     <div className="academic-years-page">

//         {/* PAGE HEADER */}
//         <div className="academic-years-header">

//             <div>

//                 <p className="section-kicker">
//                     Fee Reports
//                 </p>

//                 <h1>
//                     Fee Reports
//                 </h1>

//                 <p className="hero-copy">
//                     View paid, unpaid, partial,
//                     outstanding fees and
//                     collection totals.
//                 </p>

//             </div>

//             <button
//                 className="btn btn-primary academic-years-add"
//                 onClick={resetFilters}
//             >

//                 <i
//                     className="bi bi-arrow-clockwise"
//                     aria-hidden="true"
//                 ></i>

//                 Reset Filters

//             </button>

//         </div>

//         {/* MAIN PANEL */}
//         <div className="dashboard-panel academic-years-panel">

//             {/* PANEL HEADER */}
//             <div className="academic-years-panel-heading">

//                 <div>

//                     <p className="section-kicker">
//                         Fee management
//                     </p>

//                     <h2>
//                         Fee report
//                     </h2>

//                 </div>

//                 <div className="d-flex align-items-center gap-3">

//                     <div className="student-search">

//                         <i
//                             className="bi bi-search"
//                             aria-hidden="true"
//                         ></i>

//                         <input
//                             type="text"
//                             placeholder="Search reports..."
//                             value={
//                                 searchTerm
//                             }
//                             onChange={(
//                                 e
//                             ) =>
//                                 setSearchTerm(
//                                     e.target.value
//                                 )
//                             }
//                         />

//                     </div>

//                     <span className="panel-count">
//                         {
//                             filteredReports.length
//                         } records
//                     </span>

//                 </div>

//             </div>

//             {/* FILTERS */}
//             <div
//                 className="student-form-grid"
//                 style={{
//                     padding:
//                         '20px 24px',
//                     borderBottom:
//                         '1px solid #e9ecef',
//                 }}
//             >

//                 {/* ACADEMIC YEAR */}
//                 <div className="form-group">

//                     <label htmlFor="academic_year">
//                         Academic Year
//                     </label>

//                     <select
//                         id="academic_year"
//                         name="academic_year"
//                         value={
//                             filters.academic_year
//                         }
//                         onChange={
//                             handleFilterChange
//                         }
//                     >

//                         <option value="">
//                             All Academic Years
//                         </option>

//                         {academicYears.map(
//                             (item) => (
//                                 <option
//                                     key={
//                                         item.id ??
//                                         item.name ??
//                                         item.year
//                                     }
//                                     value={
//                                         item.id ??
//                                         item.name ??
//                                         item.year
//                                     }
//                                 >
//                                     {
//                                         item.name ??
//                                         item.year
//                                     }
//                                 </option>
//                             )
//                         )}

//                         {academicYears.length ===
//                             0 && (
//                             <>
//                                 <option value="2025-2026">
//                                     2025-2026
//                                 </option>

//                                 <option value="2026-2027">
//                                     2026-2027
//                                 </option>

//                                 <option value="2027-2028">
//                                     2027-2028
//                                 </option>
//                             </>
//                         )}

//                     </select>

//                 </div>

//                 {/* STUDENT */}
//                 <div className="form-group">

//                     <label htmlFor="student">
//                         Student
//                     </label>

//                     <select
//                         id="student"
//                         name="student"
//                         value={
//                             filters.student
//                         }
//                         onChange={
//                             handleFilterChange
//                         }
//                     >

//                         <option value="">
//                             All Students
//                         </option>

//                         {students.map(
//                             (item) => (
//                                 <option
//                                     key={
//                                         item.id ??
//                                         item.name
//                                     }
//                                     value={
//                                         item.id ??
//                                         item.name
//                                     }
//                                 >
//                                     {
//                                         item.name
//                                     }
//                                 </option>
//                             )
//                         )}

//                     </select>

//                 </div>

//                 {/* CLASS */}
//                 <div className="form-group">

//                     <label htmlFor="class_name">
//                         Class
//                     </label>

//                     <select
//                         id="class_name"
//                         name="class_name"
//                         value={
//                             filters.class_name
//                         }
//                         onChange={
//                             handleFilterChange
//                         }
//                     >

//                         <option value="">
//                             All Classes
//                         </option>

//                         {classes.map(
//                             (item) => (
//                                 <option
//                                     key={item}
//                                     value={item}
//                                 >
//                                     {item}
//                                 </option>
//                             )
//                         )}

//                     </select>

//                 </div>

//                 {/* SECTION */}
//                 <div className="form-group">

//                     <label htmlFor="section">
//                         Section
//                     </label>

//                     <select
//                         id="section"
//                         name="section"
//                         value={
//                             filters.section
//                         }
//                         onChange={
//                             handleFilterChange
//                         }
//                     >

//                         <option value="">
//                             All Sections
//                         </option>

//                         {sections.map(
//                             (item) => (
//                                 <option
//                                     key={item}
//                                     value={item}
//                                 >
//                                     {item}
//                                 </option>
//                             )
//                         )}

//                     </select>

//                 </div>

//                 {/* FEE TYPE */}
//                 <div className="form-group">

//                     <label htmlFor="fee_type">
//                         Fee Type
//                     </label>

//                     <select
//                         id="fee_type"
//                         name="fee_type"
//                         value={
//                             filters.fee_type
//                         }
//                         onChange={
//                             handleFilterChange
//                         }
//                     >

//                         <option value="">
//                             All Fee Types
//                         </option>

//                         {feeTypes.map(
//                             (item) => (
//                                 <option
//                                     key={item}
//                                     value={item}
//                                 >
//                                     {item}
//                                 </option>
//                             )
//                         )}

//                     </select>

//                 </div>

//                 {/* PAYMENT STATUS */}
//                 <div className="form-group">

//                     <label htmlFor="payment_status">
//                         Payment Status
//                     </label>

//                     <select
//                         id="payment_status"
//                         name="payment_status"
//                         value={
//                             filters.payment_status
//                         }
//                         onChange={
//                             handleFilterChange
//                         }
//                     >

//                         <option value="">
//                             All Statuses
//                         </option>

//                         <option value="Paid">
//                             Paid
//                         </option>

//                         <option value="Partial">
//                             Partial
//                         </option>

//                         <option value="Unpaid">
//                             Unpaid
//                         </option>

//                     </select>

//                 </div>

//                 {/* DATE FROM */}
//                 <div className="form-group">

//                     <label htmlFor="date_from">
//                         Date From
//                     </label>

//                     <input
//                         type="date"
//                         id="date_from"
//                         name="date_from"
//                         value={
//                             filters.date_from
//                         }
//                         onChange={
//                             handleFilterChange
//                         }
//                     />

//                 </div>

//                 {/* DATE TO */}
//                 <div className="form-group">

//                     <label htmlFor="date_to">
//                         Date To
//                     </label>

//                     <input
//                         type="date"
//                         id="date_to"
//                         name="date_to"
//                         value={
//                             filters.date_to
//                         }
//                         onChange={
//                             handleFilterChange
//                         }
//                     />

//                 </div>

//             </div>

//             {/* COLLECTION TOTALS */}
//             <div
//                 className="student-form-grid"
//                 style={{
//                     padding:
//                         '20px 24px',
//                 }}
//             >

//                 <div className="form-group">

//                     <label>
//                         Total Fee
//                     </label>

//                     <strong>
//                         {
//                             totalFee.toLocaleString()
//                         }
//                     </strong>

//                 </div>

//                 <div className="form-group">

//                     <label>
//                         Total Paid
//                     </label>

//                     <strong>
//                         {
//                             totalPaid.toLocaleString()
//                         }
//                     </strong>

//                 </div>

//                 <div className="form-group">

//                     <label>
//                         Outstanding
//                     </label>

//                     <strong>
//                         {
//                             totalRemaining.toLocaleString()
//                         }
//                     </strong>

//                 </div>

//             </div>

//             {/* TABLE */}
//             <div className="academic-years-table-wrap">

//                 {loading ? (

//                     <div className="academic-years-empty">

//                         <div
//                             className="spinner-border"
//                             role="status"
//                         >

//                             <span className="visually-hidden">
//                                 Loading...
//                             </span>

//                         </div>

//                         <p>
//                             Loading fee reports...
//                         </p>

//                     </div>

//                 ) : filteredReports.length ===
//                   0 ? (

//                     <div className="academic-years-empty">

//                         <i className="bi bi-cash-stack"></i>

//                         <h3>
//                             No fee reports found
//                         </h3>

//                         <p>
//                             No records match
//                             the selected
//                             filters.
//                         </p>

//                     </div>

//                 ) : (

//                     <div className="table-responsive">

//                         <table className="table academic-years-table">

//                             <thead>

//                                 <tr>

//                                     <th>
//                                         #
//                                     </th>

//                                     <th>
//                                         Student
//                                     </th>

//                                     <th>
//                                         Class
//                                     </th>

//                                     <th>
//                                         Section
//                                     </th>

//                                     <th>
//                                         Fee Type
//                                     </th>

//                                     <th>
//                                         Total Fee
//                                     </th>

//                                     <th>
//                                         Paid
//                                     </th>

//                                     <th>
//                                         Remaining
//                                     </th>

//                                     <th>
//                                         Status
//                                     </th>

//                                 </tr>

//                             </thead>

//                             <tbody>

//                                 {filteredReports.map(
//                                     (
//                                         item,
//                                         index
//                                     ) => (

//                                         <tr
//                                             key={
//                                                 item.id
//                                             }
//                                         >

//                                             <td>

//                                                 <span className="academic-years-index">
//                                                     {
//                                                         index +
//                                                         1
//                                                     }
//                                                 </span>

//                                             </td>

//                                             <td>

//                                                 <div className="student-table-name">

//                                                     <div className="student-avatar">

//                                                         <i className="bi bi-person"></i>

//                                                     </div>

//                                                     <div>

//                                                         <strong>
//                                                             {
//                                                                 item.studentName
//                                                             }
//                                                         </strong>

//                                                         <small>
//                                                             Fee Report
//                                                         </small>

//                                                     </div>

//                                                 </div>

//                                             </td>

//                                             <td>
//                                                 {
//                                                     item.className
//                                                 }
//                                             </td>

//                                             <td>
//                                                 {
//                                                     item.section
//                                                 }
//                                             </td>

//                                             <td>
//                                                 {
//                                                     item.feeType
//                                                 }
//                                             </td>

//                                             <td>
//                                                 {
//                                                     item.totalFee.toLocaleString()
//                                                 }
//                                             </td>

//                                             <td>
//                                                 {
//                                                     item.paid.toLocaleString()
//                                                 }
//                                             </td>

//                                             <td>
//                                                 {
//                                                     item.remaining.toLocaleString()
//                                                 }
//                                             </td>

//                                             <td>
//                                                 {
//                                                     item.status
//                                                 }
//                                             </td>

//                                         </tr>

//                                     )
//                                 )}

//                             </tbody>

//                             <tfoot>

//                                 <tr>

//                                     <th
//                                         colSpan="5"
//                                         style={{
//                                             textAlign:
//                                                 'right',
//                                         }}
//                                     >
//                                         Collection Total
//                                     </th>

//                                     <th>
//                                         {
//                                             totalFee.toLocaleString()
//                                         }
//                                     </th>

//                                     <th>
//                                         {
//                                             totalPaid.toLocaleString()
//                                         }
//                                     </th>

//                                     <th>
//                                         {
//                                             totalRemaining.toLocaleString()
//                                         }
//                                     </th>

//                                     <th>
//                                         -
//                                     </th>

//                                 </tr>

//                             </tfoot>

//                         </table>

//                     </div>

//                 )}

//             </div>

//         </div>

//     </div>
// );
// ```

// };

// export default FeeReports;

import { useEffect, useMemo, useState } from 'react';
import Swal from 'sweetalert2';

import { mockStorage } from '../../../services/mockData';

const FeeReports = () => {
  const [students, setStudents] = useState([]);
  const [fees, setFees] = useState([]);
  const [payments, setPayments] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);

  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    academic_year: '',
    student: '',
    class_name: '',
    section: '',
    fee_type: '',
    payment_status: '',
    date_from: '',
    date_to: '',
  });

  // -------------------------------------------------
  // FETCH REPORT DATA
  // -------------------------------------------------
  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      setLoading(true);

      let studentData = [];
      let feeData = [];
      let paymentData = [];
      let academicYearData = [];

      // STUDENTS
      if (mockStorage && typeof mockStorage.getStudents === 'function') {
        studentData = mockStorage.getStudents() || [];
      } else {
        const stored = localStorage.getItem('school_students');
        studentData = stored ? JSON.parse(stored) : [];
      }

      // FEES
      if (mockStorage && typeof mockStorage.getFees === 'function') {
        feeData = mockStorage.getFees() || [];
      } else {
        const stored = localStorage.getItem('sms_fees');
        feeData = stored ? JSON.parse(stored) : [];
      }

      // PAYMENTS
      if (mockStorage && typeof mockStorage.getPayments === 'function') {
        paymentData = mockStorage.getPayments() || [];
      } else {
        const stored = localStorage.getItem('sms_payments');
        paymentData = stored ? JSON.parse(stored) : [];
      }

      // ACADEMIC YEARS
      if (mockStorage && typeof mockStorage.getAcademicYears === 'function') {
        academicYearData = mockStorage.getAcademicYears() || [];
      } else {
        const stored = localStorage.getItem('sms_academic_years');
        academicYearData = stored ? JSON.parse(stored) : [];
      }

      setStudents(Array.isArray(studentData) ? studentData : []);
      setFees(Array.isArray(feeData) ? feeData : []);
      setPayments(Array.isArray(paymentData) ? paymentData : []);
      setAcademicYears(Array.isArray(academicYearData) ? academicYearData : []);
    } catch (error) {
      console.error('Error fetching fee report data:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load fee report data.',
      });
      setStudents([]);
      setFees([]);
      setPayments([]);
      setAcademicYears([]);
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------------------
  // HELPER FUNCTIONS
  // -------------------------------------------------
  const getStudent = (studentValue) => {
    return (
      students.find(
        (item) =>
          String(item.id) === String(studentValue) ||
          String(item.name) === String(studentValue)
      ) || null
    );
  };

  const getStudentName = (studentValue) => {
    const student = getStudent(studentValue);
    return student?.name || studentValue || '-';
  };

  const getStudentClass = (studentValue) => {
    const student = getStudent(studentValue);
    return (
      student?.class_name ||
      student?.className ||
      student?.class ||
      student?.grade ||
      '-'
    );
  };

  const getStudentSection = (studentValue) => {
    const student = getStudent(studentValue);
    return student?.section || student?.section_name || '-';
  };

  const getAcademicYear = (fee) => {
    return (
      fee?.academic_year ||
      fee?.academicYear ||
      fee?.academic_year_id ||
      fee?.academicYearId ||
      ''
    );
  };

  const getAcademicYearName = (yearValue) => {
    const foundYear = academicYears.find(
      (item) =>
        String(item.id) === String(yearValue) ||
        String(item.name) === String(yearValue) ||
        String(item.year) === String(yearValue)
    );
    return foundYear?.name || foundYear?.year || yearValue || '-';
  };

  const getFeeStudent = (fee) => {
    return fee?.student || fee?.student_id || fee?.studentId || '';
  };

  const getFeeType = (fee) => {
    return fee?.fee_type || fee?.feeType || '-';
  };

  const getFeeAmount = (fee) => {
    return Number(fee?.amount || fee?.total_amount || fee?.totalAmount || 0);
  };

  const getPaymentFee = (payment) => {
    return payment?.fee || payment?.fee_id || payment?.feeId || '';
  };

  const getPaymentStudent = (payment) => {
    return payment?.student || payment?.student_id || payment?.studentId || '';
  };

  const getPaymentAmount = (payment) => {
    return Number(
      payment?.amount || payment?.paid_amount || payment?.paidAmount || 0
    );
  };

  const getPaymentDate = (payment) => {
    return (
      payment?.payment_date ||
      payment?.paymentDate ||
      payment?.date ||
      ''
    );
  };

  const isPaymentInsideDateRange = (payment) => {
    const paymentDate = getPaymentDate(payment);
    if (!paymentDate) {
      return !filters.date_from && !filters.date_to;
    }
    const date = String(paymentDate).substring(0, 10);
    if (filters.date_from && date < filters.date_from) return false;
    if (filters.date_to && date > filters.date_to) return false;
    return true;
  };

  const getPaidAmount = (fee) => {
    const feeId = fee?.id;
    const feeStudent = getFeeStudent(fee);
    const relatedPayments = payments.filter((payment) => {
      const paymentFee = getPaymentFee(payment);
      const paymentStudent = getPaymentStudent(payment);
      const matchesFee =
        paymentFee && feeId && String(paymentFee) === String(feeId);
      const matchesStudent =
        paymentStudent && feeStudent && String(paymentStudent) === String(feeStudent);
      const matchesDate = isPaymentInsideDateRange(payment);
      return (matchesFee || matchesStudent) && matchesDate;
    });
    return relatedPayments.reduce(
      (total, payment) => total + getPaymentAmount(payment),
      0
    );
  };

  const getStatus = (totalFee, paid) => {
    if (totalFee > 0 && paid >= totalFee) return 'Paid';
    if (paid > 0) return 'Partial';
    return 'Unpaid';
  };

  // -------------------------------------------------
  // FILTER HANDLERS
  // -------------------------------------------------
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setFilters({
      academic_year: '',
      student: '',
      class_name: '',
      section: '',
      fee_type: '',
      payment_status: '',
      date_from: '',
      date_to: '',
    });
    setSearchTerm('');
  };

  // -------------------------------------------------
  // BUILD REPORT DATA
  // -------------------------------------------------
  const reportData = useMemo(() => {
    return fees
      .map((fee) => {
        const studentValue = getFeeStudent(fee);
        const totalFee = getFeeAmount(fee);
        const paid = getPaidAmount(fee);
        const remaining = Math.max(totalFee - paid, 0);
        const status = getStatus(totalFee, paid);
        return {
          id: fee.id,
          fee,
          studentValue,
          studentName: getStudentName(studentValue),
          className: getStudentClass(studentValue),
          section: getStudentSection(studentValue),
          academicYear: getAcademicYearName(getAcademicYear(fee)),
          academicYearValue: getAcademicYear(fee),
          feeType: getFeeType(fee),
          totalFee,
          paid,
          remaining,
          status,
        };
      })
      .filter((item) => {
        if (filters.academic_year && String(item.academicYearValue) !== String(filters.academic_year)) return false;
        if (filters.student && String(item.studentValue) !== String(filters.student)) return false;
        if (filters.class_name && String(item.className).toLowerCase() !== String(filters.class_name).toLowerCase()) return false;
        if (filters.section && String(item.section).toLowerCase() !== String(filters.section).toLowerCase()) return false;
        if (filters.fee_type && String(item.feeType).toLowerCase() !== String(filters.fee_type).toLowerCase()) return false;
        if (filters.payment_status && item.status !== filters.payment_status) return false;
        return true;
      });
  }, [fees, students, payments, academicYears, filters]);

  // -------------------------------------------------
  // SEARCH FILTER
  // -------------------------------------------------
  const filteredReports = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();
    if (!search) return reportData;
    return reportData.filter((item) =>
      String(item.studentName).toLowerCase().includes(search) ||
      String(item.className).toLowerCase().includes(search) ||
      String(item.section).toLowerCase().includes(search) ||
      String(item.academicYear).toLowerCase().includes(search) ||
      String(item.feeType).toLowerCase().includes(search) ||
      String(item.status).toLowerCase().includes(search)
    );
  }, [reportData, searchTerm]);

  // -------------------------------------------------
  // TOTALS
  // -------------------------------------------------
  const totalFee = filteredReports.reduce((sum, item) => sum + item.totalFee, 0);
  const totalPaid = filteredReports.reduce((sum, item) => sum + item.paid, 0);
  const totalRemaining = filteredReports.reduce((sum, item) => sum + item.remaining, 0);

  // -------------------------------------------------
  // DERIVED LISTS FOR FILTERS
  // -------------------------------------------------
  const classes = useMemo(() => {
    return [
      ...new Set(
        students
          .map(
            (s) =>
              s.class_name ||
              s.className ||
              s.class ||
              s.grade
          )
          .filter(Boolean)
      ),
    ];
  }, [students]);

  const sections = useMemo(() => {
    return [
      ...new Set(
        students
          .map((s) => s.section || s.section_name)
          .filter(Boolean)
      ),
    ];
  }, [students]);

  const feeTypes = useMemo(() => {
    return [
      ...new Set(
        fees
          .map(getFeeType)
          .filter((t) => t && t !== '-')
      ),
    ];
  }, [fees]);

  // -------------------------------------------------
  // RENDER
  // -------------------------------------------------
  return (
    <div className="academic-years-page">
      {/* PAGE HEADER */}
      <div className="academic-years-header">
        <div>
          <p className="section-kicker">Fee Reports</p>
          <h1>Fee Reports</h1>
          <p className="hero-copy">
            View paid, unpaid, partial, outstanding fees and collection totals.
          </p>
        </div>
        <button className="btn btn-primary academic-years-add" onClick={resetFilters}>
          <i className="bi bi-arrow-clockwise" aria-hidden="true"></i>
          Reset Filters
        </button>
      </div>

      {/* MAIN PANEL */}
      <div className="dashboard-panel academic-years-panel">
        {/* PANEL HEADER */}
        <div className="academic-years-panel-heading">
          <div>
            <p className="section-kicker">Fee management</p>
            <h2>Fee report</h2>
          </div>
          <div className="d-flex align-items-center gap-3">
            <div className="student-search">
              <i className="bi bi-search" aria-hidden="true"></i>
              <input
                type="text"
                placeholder="Search reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <span className="panel-count">{filteredReports.length} records</span>
          </div>
        </div>

        {/* FILTERS */}
        <div className="student-form-grid" style={{ padding: '20px 24px', borderBottom: '1px solid #e9ecef' }}>
          {/* ACADEMIC YEAR */}
          <div className="form-group">
            <label htmlFor="academic_year">Academic Year</label>
            <select id="academic_year" name="academic_year" value={filters.academic_year} onChange={handleFilterChange}>
              <option value="">All Academic Years</option>
              {academicYears.map((item) => (
                <option key={item.id ?? item.name ?? item.year} value={item.id ?? item.name ?? item.year}>
                  {item.name ?? item.year}
                </option>
              ))}
              {academicYears.length === 0 && (
                <>
                  <option value="2025-2026">2025-2026</option>
                  <option value="2026-2027">2026-2027</option>
                  <option value="2027-2028">2027-2028</option>
                </>
              )}
            </select>
          </div>

          {/* STUDENT */}
          <div className="form-group">
            <label htmlFor="student">Student</label>
            <select id="student" name="student" value={filters.student} onChange={handleFilterChange}>
              <option value="">All Students</option>
              {students.map((item) => (
                <option key={item.id ?? item.name} value={item.id ?? item.name}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          {/* CLASS */}
          <div className="form-group">
            <label htmlFor="class_name">Class</label>
            <select id="class_name" name="class_name" value={filters.class_name} onChange={handleFilterChange}>
              <option value="">All Classes</option>
              {classes.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          {/* SECTION */}
          <div className="form-group">
            <label htmlFor="section">Section</label>
            <select id="section" name="section" value={filters.section} onChange={handleFilterChange}>
              <option value="">All Sections</option>
              {sections.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          {/* FEE TYPE */}
          <div className="form-group">
            <label htmlFor="fee_type">Fee Type</label>
            <select id="fee_type" name="fee_type" value={filters.fee_type} onChange={handleFilterChange}>
              <option value="">All Fee Types</option>
              {feeTypes.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          {/* PAYMENT STATUS */}
          <div className="form-group">
            <label htmlFor="payment_status">Payment Status</label>
            <select id="payment_status" name="payment_status" value={filters.payment_status} onChange={handleFilterChange}>
              <option value="">All Statuses</option>
              <option value="Paid">Paid</option>
              <option value="Partial">Partial</option>
              <option value="Unpaid">Unpaid</option>
            </select>
          </div>

          {/* DATE FROM */}
          <div className="form-group">
            <label htmlFor="date_from">Date From</label>
            <input type="date" id="date_from" name="date_from" value={filters.date_from} onChange={handleFilterChange} />
          </div>

          {/* DATE TO */}
          <div className="form-group">
            <label htmlFor="date_to">Date To</label>
            <input type="date" id="date_to" name="date_to" value={filters.date_to} onChange={handleFilterChange} />
          </div>
        </div>

        {/* COLLECTION TOTALS */}
        <div className="student-form-grid" style={{ padding: '20px 24px' }}>
          <div className="form-group">
            <label>Total Fee</label>
            <strong>{totalFee.toLocaleString()}</strong>
          </div>
          <div className="form-group">
            <label>Total Paid</label>
            <strong>{totalPaid.toLocaleString()}</strong>
          </div>
          <div className="form-group">
            <label>Outstanding</label>
            <strong>{totalRemaining.toLocaleString()}</strong>
          </div>
        </div>

        {/* TABLE */}
        <div className="academic-years-table-wrap">
          {loading ? (
            <div className="academic-years-empty">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p>Loading fee reports...</p>
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="academic-years-empty">
              <i className="bi bi-cash-stack"></i>
              <h3>No fee reports found</h3>
              <p>No records match the selected filters.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table academic-years-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Student</th>
                    <th>Class</th>
                    <th>Section</th>
                    <th>Fee Type</th>
                    <th>Total Fee</th>
                    <th>Paid</th>
                    <th>Remaining</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReports.map((item, index) => (
                    <tr key={item.id}>
                      <td>
                        <span className="academic-years-index">{index + 1}</span>
                      </td>
                      <td>
                        <div className="student-table-name">
                          <div className="student-avatar">
                            <i className="bi bi-person"></i>
                          </div>
                          <div>
                            <strong>{item.studentName}</strong>
                            <small>Fee Report</small>
                          </div>
                        </div>
                      </td>
                      <td>{item.className}</td>
                      <td>{item.section}</td>
                      <td>{item.feeType}</td>
                      <td>{item.totalFee.toLocaleString()}</td>
                      <td>{item.paid.toLocaleString()}</td>
                      <td>{item.remaining.toLocaleString()}</td>
                      <td>{item.status}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <th colSpan="5" style={{ textAlign: 'right' }}>
                      Collection Total
                    </th>
                    <th>{totalFee.toLocaleString()}</th>
                    <th>{totalPaid.toLocaleString()}</th>
                    <th>{totalRemaining.toLocaleString()}</th>
                    <th>-</th>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeeReports;
