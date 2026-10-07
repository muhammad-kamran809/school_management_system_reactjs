import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import api from '../../../services/api';
import Pagination from '../../../components/Pagination';

const initialForm = {
name: '',
email: '',
phone: '',
class_name: '',
section: '',
gender: '',
date_of_birth: '',
address: '',
guardian_name: '',
guardian_phone: '',
status: 'active',
};

export default function Students() {
const [students, setStudents] = useState([]);
const [loading, setLoading] = useState(true);
const [saving, setSaving] = useState(false);

const [showModal, setShowModal] = useState(false);
const [editingStudent, setEditingStudent] = useState(null);

const [search, setSearch] = useState('');

// Pagination states for GET /api/students
const [currentPage, setCurrentPage] = useState(1);
const [perPage, setPerPage] = useState(10);
const [total, setTotal] = useState(0);
const [lastPage, setLastPage] = useState(1);
const [from, setFrom] = useState(0);
const [to, setTo] = useState(0);

const [form, setForm] = useState(initialForm);
const [errors, setErrors] = useState({});

// -----------------------------------------
// API ERROR HANDLER
// -----------------------------------------
const handleApiError = (error) => {
console.error('API Error:', error);

// No response from Laravel
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

console.log('API status:', status);
console.log('API data:', data);

// 422 VALIDATION ERROR
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

// 401 UNAUTHENTICATED
if (status === 401) {
Swal.fire({
icon: 'warning',
title: 'Unauthenticated',
text: 'Your login session has expired. Please login again.',
confirmButtonText: 'OK'
});

return;
}

// 403 FORBIDDEN
if (status === 403) {
Swal.fire({
icon: 'error',
title: 'Permission Denied',
text: data.message || 'You do not have permission to perform this action.',
confirmButtonText: 'OK'
});

return;
}

// 404 NOT FOUND
if (status === 404) {
Swal.fire({
icon: 'error',
title: 'Student Not Found',
text: data.message || 'The requested student could not be found.',
confirmButtonText: 'OK'
});

return;
}

// 500 SERVER ERROR
if (status === 500) {
Swal.fire({
icon: 'error',
title: 'Server Error',
text: data.message || 'Something went wrong on the Laravel server.',
confirmButtonText: 'OK'
});

return;
}

// OTHER ERRORS
Swal.fire({
icon: 'error',
title: 'Something Went Wrong',
text: data.message || `Request failed with status ${status}.`,
confirmButtonText: 'OK'
});
};

// -----------------------------------------
// GET STUDENTS (GET /api/students pagination)
// -----------------------------------------
const fetchStudents = async (page = currentPage, pageSize = perPage, searchQuery = search) => {
try {
setLoading(true);
const params = {
page: page,
per_page: pageSize,
};
if (searchQuery && String(searchQuery).trim() !== '') {
params.search = String(searchQuery).trim();
}

const response = await api.get('/students', { params });

let records = [];
let curPage = page;
let lastPg = 1;
let totalRecords = 0;
let fromRecord = null;
let toRecord = null;

if (response.data && response.data.meta) {
records = Array.isArray(response.data.data) ? response.data.data : [];
curPage = response.data.meta.current_page || page;
lastPg = response.data.meta.last_page || 1;
totalRecords = response.data.meta.total ?? records.length;
fromRecord = response.data.meta.from ?? ((curPage - 1) * pageSize + 1);
toRecord = response.data.meta.to ?? (fromRecord + records.length - 1);
} else if (response.data && (response.data.current_page || response.data.last_page || response.data.total !== undefined)) {
records = Array.isArray(response.data.data) ? response.data.data : [];
curPage = response.data.current_page || page;
lastPg = response.data.last_page || 1;
totalRecords = response.data.total ?? records.length;
fromRecord = response.data.from ?? ((curPage - 1) * pageSize + 1);
toRecord = response.data.to ?? (fromRecord + records.length - 1);
} else {
const raw = response.data?.data || response.data || [];
const list = Array.isArray(raw) ? raw : [];
totalRecords = list.length;
lastPg = Math.max(1, Math.ceil(totalRecords / pageSize));
curPage = Math.min(page, lastPg);
fromRecord = totalRecords > 0 ? (curPage - 1) * pageSize + 1 : 0;
toRecord = Math.min(curPage * pageSize, totalRecords);
records = list.slice((curPage - 1) * pageSize, curPage * pageSize);
}

setStudents(records);
setCurrentPage(curPage);
setLastPage(lastPg);
setTotal(totalRecords);
setFrom(fromRecord);
setTo(toRecord);
} catch (error) {
console.error('Fetch students error:', error);
handleApiError(error);
} finally {
setLoading(false);
}
};

const handlePageChange = (newPage) => {
setCurrentPage(newPage);
fetchStudents(newPage, perPage, search);
};

const handlePerPageChange = (newPerPage) => {
setPerPage(newPerPage);
setCurrentPage(1);
fetchStudents(1, newPerPage, search);
};

const handleSearchChange = (e) => {
const val = e.target.value;
setSearch(val);
setCurrentPage(1);
fetchStudents(1, perPage, val);
};

useEffect(() => {
fetchStudents(1, perPage, '');
}, []);

// -----------------------------------------
// FORM INPUT
// -----------------------------------------
const handleChange = (e) => {
const { name, value } = e.target;

setForm((previous) => ({
...previous,
[name]: value,
}));

// Remove field error when user starts correcting it
if (errors[name]) {
setErrors((previous) => ({
...previous,
[name]: undefined,
}));
}
};

// -----------------------------------------
// OPEN ADD MODAL
// -----------------------------------------
const openAddModal = () => {
setEditingStudent(null);
setForm(initialForm);
setErrors({});
setShowModal(true);
};

// -----------------------------------------
// OPEN EDIT MODAL
// -----------------------------------------
const openEditModal = (student) => {
setEditingStudent(student);

let formattedDob = '';
if (student.date_of_birth) {
formattedDob = student.date_of_birth.split('T')[0];
}

setForm({
name: student.name || '',
email: student.email || '',
phone: student.phone || '',
class_name: student.class_name || '',
section: student.section || '',
gender: student.gender || '',
date_of_birth: formattedDob,
address: student.address || '',
guardian_name: student.guardian_name || '',
guardian_phone: student.guardian_phone || '',
status: student.status || 'active',
});

setErrors({});
setShowModal(true);
};

// -----------------------------------------
// CLOSE MODAL
// -----------------------------------------
const closeModal = () => {
setShowModal(false);
setEditingStudent(null);

setForm(initialForm);
setErrors({});
};

// -----------------------------------------
// SAVE STUDENT
// -----------------------------------------
const handleSubmit = async (e) => {
e.preventDefault();

// Prevent double submit
if (saving) {
return;
}

setSaving(true);
setErrors({});

const payload = {
name: form.name,
email: form.email ? form.email.trim() : null,
phone: form.phone ? form.phone.trim() : null,
gender: form.gender,
date_of_birth: form.date_of_birth || null,
address: form.address ? form.address.trim() : null,
guardian_name: form.guardian_name,
guardian_phone: form.guardian_phone,
status: form.status,
};

try {
if (editingStudent) {
// UPDATE STUDENT
await api.put(`/students/${editingStudent.id}`, payload);

// Close modal first
closeModal();

// Refresh table
await fetchStudents();

// Show success alert
await Swal.fire({
icon: 'success',
title: 'Student Updated!',
text: 'Student information has been updated successfully.',
confirmButtonText: 'OK',
});
} else {
// CREATE STUDENT
await api.post('/students', payload);

// Close modal
closeModal();

// Refresh table
await fetchStudents();

// Show success alert
await Swal.fire({
icon: 'success',
title: 'Student Created!',
text: 'Student has been added successfully.',
confirmButtonText: 'OK',
});
}
} catch (error) {
console.error('Student save error:', error);
handleApiError(error);
} finally {
setSaving(false);
}
};

// -----------------------------------------
// DELETE STUDENT
// -----------------------------------------
const handleDelete = async (student) => {
const result = await Swal.fire({
icon: 'warning',
title: 'Delete Student?',
text: `Are you sure you want to delete ${student.name}?`,
showCancelButton: true,
confirmButtonText: 'Yes, Delete',
cancelButtonText: 'Cancel',
reverseButtons: true,
});

// User clicked Cancel
if (!result.isConfirmed) {
return;
}

try {
// Show loading alert
Swal.fire({
title: 'Deleting...',
text: 'Please wait while the student is being deleted.',
allowOutsideClick: false,
allowEscapeKey: false,
didOpen: () => {
Swal.showLoading();
},
});

await api.delete(`/students/${student.id}`);

await Swal.fire({
icon: 'success',
title: 'Student Deleted!',
text: `${student.name} has been deleted successfully.`,
confirmButtonText: 'OK',
});

// Refresh table
await fetchStudents();
} catch (error) {
Swal.close();
handleApiError(error);
}
};

// -----------------------------------------
// SEARCH
// -----------------------------------------
const filteredStudents = students.filter((student) => {
const searchText = search.toLowerCase();

return (
String(student.name || '')
.toLowerCase()
.includes(searchText) ||
String(student.email || '')
.toLowerCase()
.includes(searchText) ||
String(student.phone || '')
.toLowerCase()
.includes(searchText) ||
String(student.class_name || '')
.toLowerCase()
.includes(searchText) ||
String(student.section || '')
.toLowerCase()
.includes(searchText) ||
String(student.guardian_name || '')
.toLowerCase()
.includes(searchText)
);
});

// -----------------------------------------
// FIELD ERROR
// -----------------------------------------
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

return (
<div className="academic-years-page">

{/* PAGE HEADER */}
<div className="academic-years-header">

<div>
<p className="section-kicker">
People
</p>

<h1>Students</h1>

<p className="hero-copy">
Manage student records and information.
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

Add Student
</button>

</div>

{/* STUDENT TABLE PANEL */}
<div className="dashboard-panel academic-years-panel">

{/* PANEL HEADER */}
<div className="academic-years-panel-heading">

<div>
<p className="section-kicker">
People management
</p>

<h2>Student list</h2>
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
placeholder="Search students..."
value={search}
onChange={handleSearchChange}
/>

</div>

<span className="panel-count">
{filteredStudents.length} records
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
Loading students...
</p>

</div>

) : filteredStudents.length === 0 ? (

/* EMPTY STATE */
<div className="academic-years-empty">

<i
className="bi bi-people"
aria-hidden="true"
></i>

<h3>
{search
? 'No students found'
: 'No students yet'}
</h3>

<p>
{search
? 'Try a different search.'
: 'Add your first student to get started.'}
</p>

{!search && (
<button
className="btn btn-primary"
onClick={openAddModal}
>
<i className="bi bi-plus-lg me-2"></i>
Add Student
</button>
)}

</div>

) : (

<>
/* TABLE */
<div className="table-responsive">

<table className="academic-years-table">

<thead>

<tr>

<th style={{ width: '60px' }}>
#
</th>

<th>
Student
</th>

<th>
Phone
</th>

<th>
Class
</th>

<th>
Section
</th>

<th>
Gender
</th>

<th>
Guardian
</th>

<th>
Status
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

{filteredStudents.map(
(student, index) => (

<tr key={student.id}>

{/* NUMBER */}
<td>
<span className="academic-years-index">
{String(
(from || ((currentPage - 1) * perPage + 1)) + index
).padStart(
2,
'0'
)}
</span>
</td>

{/* STUDENT */}
<td>

<div className="student-table-name">

<div className="student-avatar">

{student.photo ? (
<img
src={
student.photo
}
alt={
student.name
}
/>
) : (
<i className="bi bi-person"></i>
)}

</div>

<div>

<div className="fw-semibold">
{
student.name
}
</div>

<div className="text-muted small">
{
student.email ||
'No email'
}
</div>

</div>

</div>

</td>

{/* PHONE */}
<td>
{student.phone || '-'}
</td>

{/* CLASS */}
<td>
{student.class_name || '-'}
</td>

{/* SECTION */}
<td>
{student.section || '-'}
</td>

{/* GENDER */}
<td>

{student.gender
? student.gender
.charAt(0)
.toUpperCase() +
student.gender.slice(1)
: '-'}

</td>

{/* GUARDIAN */}
<td>
{
student.guardian_name ||
'-'
}
</td>

{/* STATUS */}
<td>

{student.status ===
'active' ? (

<span className="status-badge active">
Active
</span>

) : (

<span className="status-badge inactive">
{student.status
? student.status
.charAt(0)
.toUpperCase() +
student.status.slice(
1
)
: 'Inactive'}
</span>

)}

</td>

{/* ACTIONS */}
<td>

<div className="academic-actions">

<button
type="button"
className="academic-action-button edit"
title="Edit student"
onClick={() =>
openEditModal(
student
)
}
>
<i className="bi bi-pencil"></i>
</button>

<button
type="button"
className="academic-action-button delete"
title="Delete student"
onClick={() =>
handleDelete(
student
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

<Pagination
currentPage={currentPage}
lastPage={lastPage}
total={total}
perPage={perPage}
from={from}
to={to}
onPageChange={handlePageChange}
onPerPageChange={handlePerPageChange}
itemName="students"
loading={loading}
/>
</>

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
<span className="section-kicker">Student</span>
<h3>
{editingStudent ? 'Edit Student' : 'Add Student'}
</h3>
<p>
{editingStudent
? 'Update student information.'
: 'Create a new student record.'}
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

{/* Student Name */}
<div className="form-group">
<label>
Student Name <span>*</span>
</label>

<input
type="text"
name="name"
value={form.name}
onChange={handleChange}
placeholder="Enter student name"
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

{/* Address */}
<div className="form-group full-width">
<label>Address</label>

<textarea
name="address"
value={form.address}
onChange={handleChange}
placeholder="Enter student address"
rows="3"
disabled={saving}
/>

{fieldError('address')}
</div>

{/* Guardian Name */}
<div className="form-group">
<label>Guardian Name</label>

<input
type="text"
name="guardian_name"
value={form.guardian_name}
onChange={handleChange}
placeholder="Enter guardian name"
disabled={saving}
/>

{fieldError('guardian_name')}
</div>

{/* Guardian Phone */}
<div className="form-group">
<label>Guardian Phone</label>

<input
type="text"
name="guardian_phone"
value={form.guardian_phone}
onChange={handleChange}
placeholder="Enter guardian phone"
disabled={saving}
/>

{fieldError('guardian_phone')}
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
: editingStudent
? 'Update Student'
: 'Save Student'}
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

// export default Students;