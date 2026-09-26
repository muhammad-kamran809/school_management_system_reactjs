import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

// API will be connected later by backend developer
// import api from '../../../services/api';

import { mockStorage } from '../../../services/mockData';

const initialForm = {
    exam: '',
    student: '',
    subject: '',
    marks_obtained: '',
    total_marks: '',
    grade: '',
    remarks: '',
};

// ---------------------------------------------------------
// DEMO DATA
// ---------------------------------------------------------

const demoResultData = [
    {
        id: 1,
        exam: 'Mid Term Examination',
        student: 'Ali Khan',
        subject: 'Mathematics',
        marks_obtained: 85,
        total_marks: 100,
        grade: 'A',
        remarks: 'Excellent performance',
    },
    {
        id: 2,
        exam: 'Mid Term Examination',
        student: 'Ahmed Raza',
        subject: 'English',
        marks_obtained: 78,
        total_marks: 100,
        grade: 'B+',
        remarks: 'Good performance',
    },
    {
        id: 3,
        exam: 'Final Examination',
        student: 'Hamza Malik',
        subject: 'Computer Science',
        marks_obtained: 92,
        total_marks: 100,
        grade: 'A+',
        remarks: 'Outstanding',
    },
    {
        id: 4,
        exam: 'Final Examination',
        student: 'Usman Ali',
        subject: 'Physics',
        marks_obtained: 74,
        total_marks: 100,
        grade: 'B',
        remarks: 'Good effort',
    },
    {
        id: 5,
        exam: 'First Term Examination',
        student: 'Hassan Ahmed',
        subject: 'Chemistry',
        marks_obtained: 88,
        total_marks: 100,
        grade: 'A',
        remarks: 'Very good',
    },
    {
        id: 6,
        exam: 'First Term Examination',
        student: 'Bilal Khan',
        subject: 'Biology',
        marks_obtained: 69,
        total_marks: 100,
        grade: 'C+',
        remarks: 'Needs improvement',
    },
    {
        id: 7,
        exam: 'Monthly Test',
        student: 'Usman Tariq',
        subject: 'Islamiyat',
        marks_obtained: 95,
        total_marks: 100,
        grade: 'A+',
        remarks: 'Excellent',
    },
    {
        id: 8,
        exam: 'Monthly Test',
        student: 'Zain Ahmed',
        subject: 'Urdu',
        marks_obtained: 81,
        total_marks: 100,
        grade: 'A-',
        remarks: 'Very good',
    },
    {
        id: 9,
        exam: 'Mid Year Examination',
        student: 'Muhammad Hassan',
        subject: 'Mathematics',
        marks_obtained: 73,
        total_marks: 100,
        grade: 'B',
        remarks: 'Good',
    },
    {
        id: 10,
        exam: 'Mid Year Examination',
        student: 'Abdullah Khan',
        subject: 'English',
        marks_obtained: 89,
        total_marks: 100,
        grade: 'A',
        remarks: 'Excellent work',
    },
];

// ---------------------------------------------------------
// DEMO SELECT DATA
// ---------------------------------------------------------

const demoExams = [
    {
        id: 1,
        name: 'Mid Term Examination',
    },
    {
        id: 2,
        name: 'Final Examination',
    },
    {
        id: 3,
        name: 'First Term Examination',
    },
    {
        id: 4,
        name: 'Monthly Test',
    },
    {
        id: 5,
        name: 'Mid Year Examination',
    },
];

const demoStudents = [
    {
        id: 1,
        name: 'Ali Khan',
    },
    {
        id: 2,
        name: 'Ahmed Raza',
    },
    {
        id: 3,
        name: 'Hamza Malik',
    },
    {
        id: 4,
        name: 'Usman Ali',
    },
    {
        id: 5,
        name: 'Hassan Ahmed',
    },
    {
        id: 6,
        name: 'Bilal Khan',
    },
    {
        id: 7,
        name: 'Usman Tariq',
    },
    {
        id: 8,
        name: 'Zain Ahmed',
    },
    {
        id: 9,
        name: 'Muhammad Hassan',
    },
    {
        id: 10,
        name: 'Abdullah Khan',
    },
];

const demoSubjects = [
    {
        id: 1,
        name: 'Mathematics',
    },
    {
        id: 2,
        name: 'English',
    },
    {
        id: 3,
        name: 'Computer Science',
    },
    {
        id: 4,
        name: 'Physics',
    },
    {
        id: 5,
        name: 'Chemistry',
    },
    {
        id: 6,
        name: 'Biology',
    },
    {
        id: 7,
        name: 'Islamiyat',
    },
    {
        id: 8,
        name: 'Urdu',
    },
];

// ---------------------------------------------------------
// COMPONENT
// ---------------------------------------------------------

const Result = () => {
    const [results, setResults] = useState([]);
    const [exams, setExams] = useState([]);
    const [students, setStudents] = useState([]);
    const [subjects, setSubjects] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [editingResult, setEditingResult] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');

    const [formData, setFormData] = useState(initialForm);
    const [errors, setErrors] = useState({});

    // -------------------------------------------------------
    // LOAD DATA
    // -------------------------------------------------------

    useEffect(() => {
        fetchResults();
        fetchExams();
        fetchStudents();
        fetchSubjects();
    }, []);

    // -------------------------------------------------------
    // FETCH RESULTS
    // -------------------------------------------------------

    const fetchResults = async () => {
        setLoading(true);

        try {
            // API will be connected later
            /*
            const response = await api.get('/results');
            setResults(response.data.data || response.data);
            return;
            */

            let storedResults = [];

            if (
                mockStorage &&
                typeof mockStorage.getResults === 'function'
            ) {
                storedResults = mockStorage.getResults() || [];
            } else {
                const saved = localStorage.getItem('sms_results');

                if (saved) {
                    storedResults = JSON.parse(saved);
                }
            }

            if (!storedResults || storedResults.length === 0) {
                storedResults = demoResultData;

                localStorage.setItem(
                    'sms_results',
                    JSON.stringify(demoResultData)
                );
            }

            setResults(storedResults);
        } catch (error) {
            console.error('Error fetching results:', error);

            setResults(demoResultData);

            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Unable to load result data.',
            });
        } finally {
            setLoading(false);
        }
    };

    // -------------------------------------------------------
    // FETCH EXAMS
    // -------------------------------------------------------

    const fetchExams = async () => {
        try {
            /*
            const response = await api.get('/exams');
            setExams(response.data.data || response.data);
            return;
            */

            let storedExams = [];

            if (
                mockStorage &&
                typeof mockStorage.getExams === 'function'
            ) {
                storedExams = mockStorage.getExams() || [];
            } else {
                const saved = localStorage.getItem('sms_exams');

                if (saved) {
                    storedExams = JSON.parse(saved);
                }
            }

            if (!storedExams || storedExams.length === 0) {
                storedExams = demoExams;
            }

            setExams(storedExams);
        } catch (error) {
            console.error('Error fetching exams:', error);
            setExams(demoExams);
        }
    };

    // -------------------------------------------------------
    // FETCH STUDENTS
    // -------------------------------------------------------

    const fetchStudents = async () => {
        try {
            /*
            const response = await api.get('/students');
            setStudents(response.data.data || response.data);
            return;
            */

            let storedStudents = [];

            if (
                mockStorage &&
                typeof mockStorage.getStudents === 'function'
            ) {
                storedStudents = mockStorage.getStudents() || [];
            } else {
                const saved = localStorage.getItem('sms_students');

                if (saved) {
                    storedStudents = JSON.parse(saved);
                }
            }

            if (!storedStudents || storedStudents.length === 0) {
                storedStudents = demoStudents;
            }

            setStudents(storedStudents);
        } catch (error) {
            console.error('Error fetching students:', error);
            setStudents(demoStudents);
        }
    };

    // -------------------------------------------------------
    // FETCH SUBJECTS
    // -------------------------------------------------------

    const fetchSubjects = async () => {
        try {
            /*
            const response = await api.get('/subjects');
            setSubjects(response.data.data || response.data);
            return;
            */

            let storedSubjects = [];

            if (
                mockStorage &&
                typeof mockStorage.getSubjects === 'function'
            ) {
                storedSubjects = mockStorage.getSubjects() || [];
            } else {
                const saved = localStorage.getItem('sms_subjects');

                if (saved) {
                    storedSubjects = JSON.parse(saved);
                }
            }

            if (!storedSubjects || storedSubjects.length === 0) {
                storedSubjects = demoSubjects;
            }

            setSubjects(storedSubjects);
        } catch (error) {
            console.error('Error fetching subjects:', error);
            setSubjects(demoSubjects);
        }
    };

    // -------------------------------------------------------
    // ERROR HANDLER
    // -------------------------------------------------------

    const handleApiError = (error) => {
        console.error(error);

        const status = error?.response?.status;

        if (status === 422) {
            Swal.fire({
                icon: 'error',
                title: 'Validation Error',
                text: 'Please check the entered information.',
            });
        } else if (status === 401) {
            Swal.fire({
                icon: 'error',
                title: 'Unauthorized',
                text: 'You are not authorized to perform this action.',
            });
        } else if (status === 403) {
            Swal.fire({
                icon: 'error',
                title: 'Forbidden',
                text: 'You do not have permission to perform this action.',
            });
        } else if (status === 404) {
            Swal.fire({
                icon: 'error',
                title: 'Not Found',
                text: 'The requested record was not found.',
            });
        } else if (status === 500) {
            Swal.fire({
                icon: 'error',
                title: 'Server Error',
                text: 'Something went wrong on the server.',
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Something went wrong. Please try again.',
            });
        }
    };

    // -------------------------------------------------------
    // HANDLE INPUT CHANGE
    // -------------------------------------------------------

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

        // Automatically calculate grade when marks change
        if (name === 'marks_obtained' || name === 'total_marks') {
            const marks =
                name === 'marks_obtained'
                    ? Number(value)
                    : Number(formData.marks_obtained);

            const total =
                name === 'total_marks'
                    ? Number(value)
                    : Number(formData.total_marks);

            if (total > 0 && marks >= 0) {
                const percentage = (marks / total) * 100;

                let calculatedGrade = '';

                if (percentage >= 90) {
                    calculatedGrade = 'A+';
                } else if (percentage >= 80) {
                    calculatedGrade = 'A';
                } else if (percentage >= 70) {
                    calculatedGrade = 'B';
                } else if (percentage >= 60) {
                    calculatedGrade = 'C';
                } else if (percentage >= 50) {
                    calculatedGrade = 'D';
                } else {
                    calculatedGrade = 'F';
                }

                setFormData((prev) => ({
                    ...prev,
                    [name]: value,
                    grade: calculatedGrade,
                }));
            }
        }
    };

    // -------------------------------------------------------
    // OPEN ADD MODAL
    // -------------------------------------------------------

    const openAddModal = () => {
        setEditingResult(null);
        setFormData(initialForm);
        setErrors({});
        setShowModal(true);
    };

    // -------------------------------------------------------
    // OPEN EDIT MODAL
    // -------------------------------------------------------

    const openEditModal = (result) => {
        setEditingResult(result);

        setFormData({
            exam:
                result.exam ??
                result.exam_name ??
                result.exam_id ??
                '',
            student:
                result.student ??
                result.student_name ??
                result.student_id ??
                '',
            subject:
                result.subject ??
                result.subject_name ??
                result.subject_id ??
                '',
            marks_obtained:
                result.marks_obtained ??
                result.marksObtained ??
                '',
            total_marks:
                result.total_marks ??
                result.totalMarks ??
                '',
            grade: result.grade ?? '',
            remarks: result.remarks ?? '',
        });

        setErrors({});
        setShowModal(true);
    };

    // -------------------------------------------------------
    // CLOSE MODAL
    // -------------------------------------------------------

    const closeModal = () => {
        if (saving) return;

        setShowModal(false);
        setEditingResult(null);
        setFormData(initialForm);
        setErrors({});
    };

    // -------------------------------------------------------
    // VALIDATION
    // -------------------------------------------------------

    const validateForm = () => {
        const newErrors = {};

        if (!formData.exam) {
            newErrors.exam = 'Exam is required';
        }

        if (!formData.student) {
            newErrors.student = 'Student is required';
        }

        if (!formData.subject) {
            newErrors.subject = 'Subject is required';
        }

        if (
            formData.marks_obtained === '' ||
            formData.marks_obtained === null
        ) {
            newErrors.marks_obtained = 'Marks obtained is required';
        }

        if (
            formData.total_marks === '' ||
            formData.total_marks === null
        ) {
            newErrors.total_marks = 'Total marks is required';
        }

        if (
            formData.marks_obtained !== '' &&
            formData.total_marks !== '' &&
            Number(formData.marks_obtained) >
                Number(formData.total_marks)
        ) {
            newErrors.marks_obtained =
                'Marks obtained cannot be greater than total marks';
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    // -------------------------------------------------------
    // SUBMIT FORM
    // -------------------------------------------------------

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setSaving(true);

        try {
            /*
            // API will be connected later

            if (editingResult) {
                await api.put(`/results/${editingResult.id}`, formData);
            } else {
                await api.post('/results', formData);
            }
            */

            const resultData = {
                ...formData,
                marks_obtained: Number(formData.marks_obtained),
                total_marks: Number(formData.total_marks),
            };

            let updatedResults = [];

            if (editingResult) {
                updatedResults = results.map((item) =>
                    item.id === editingResult.id
                        ? {
                              ...item,
                              ...resultData,
                          }
                        : item
                );
            } else {
                const newResult = {
                    id: Date.now(),
                    ...resultData,
                };

                updatedResults = [...results, newResult];
            }

            setResults(updatedResults);

            localStorage.setItem(
                'sms_results',
                JSON.stringify(updatedResults)
            );

            if (
                mockStorage &&
                typeof mockStorage.updateResult === 'function' &&
                editingResult
            ) {
                mockStorage.updateResult(
                    editingResult.id,
                    resultData
                );
            }

            if (
                mockStorage &&
                typeof mockStorage.addResult === 'function' &&
                !editingResult
            ) {
                mockStorage.addResult(resultData);
            }

            Swal.fire({
                icon: 'success',
                title: editingResult
                    ? 'Result Updated'
                    : 'Result Added',
                text: editingResult
                    ? 'Result has been updated successfully.'
                    : 'Result has been added successfully.',
                timer: 1800,
                showConfirmButton: false,
            });

            closeModal();
        } catch (error) {
            handleApiError(error);
        } finally {
            setSaving(false);
        }
    };

    // -------------------------------------------------------
    // DELETE RESULT
    // -------------------------------------------------------

    const handleDelete = async (result) => {
        const confirmation = await Swal.fire({
            icon: 'warning',
            title: 'Delete Result?',
            text: 'Are you sure you want to delete this result?',
            showCancelButton: true,
            confirmButtonText: 'Yes, Delete',
            cancelButtonText: 'Cancel',
        });

        if (!confirmation.isConfirmed) {
            return;
        }

        try {
            /*
            // API will be connected later

            await api.delete(`/results/${result.id}`);
            */

            const updatedResults = results.filter(
                (item) => item.id !== result.id
            );

            setResults(updatedResults);

            localStorage.setItem(
                'sms_results',
                JSON.stringify(updatedResults)
            );

            if (
                mockStorage &&
                typeof mockStorage.deleteResult === 'function'
            ) {
                mockStorage.deleteResult(result.id);
            }

            Swal.fire({
                icon: 'success',
                title: 'Deleted',
                text: 'Result has been deleted successfully.',
                timer: 1500,
                showConfirmButton: false,
            });
        } catch (error) {
            handleApiError(error);
        }
    };

    // -------------------------------------------------------
    // GET NAMES
    // -------------------------------------------------------

    const getExamName = (exam) => {
        if (!exam) return '-';

        const found = exams.find(
            (item) =>
                String(item.id) === String(exam) ||
                String(item.name) === String(exam) ||
                String(item.exam_name) === String(exam)
        );

        return (
            found?.name ??
            found?.exam_name ??
            exam
        );
    };

    const getStudentName = (student) => {
        if (!student) return '-';

        const found = students.find(
            (item) =>
                String(item.id) === String(student) ||
                String(item.name) === String(student)
        );

        return (
            found?.name ??
            found?.student_name ??
            student
        );
    };

    const getSubjectName = (subject) => {
        if (!subject) return '-';

        const found = subjects.find(
            (item) =>
                String(item.id) === String(subject) ||
                String(item.name) === String(subject)
        );

        return (
            found?.name ??
            found?.subject_name ??
            subject
        );
    };

    // -------------------------------------------------------
    // SEARCH
    // -------------------------------------------------------

    const filteredResults = results.filter((result) => {
        const search = searchTerm.toLowerCase();

        return (
            String(getExamName(result.exam)).toLowerCase().includes(search) ||
            String(getStudentName(result.student))
                .toLowerCase()
                .includes(search) ||
            String(getSubjectName(result.subject))
                .toLowerCase()
                .includes(search) ||
            String(result.marks_obtained)
                .toLowerCase()
                .includes(search) ||
            String(result.total_marks)
                .toLowerCase()
                .includes(search) ||
            String(result.grade).toLowerCase().includes(search) ||
            String(result.remarks).toLowerCase().includes(search)
        );
    });

    // -------------------------------------------------------
    // RENDER
    // -------------------------------------------------------

    return (
        <div className="academic-years-page">

            {/* PAGE HEADER */}

            <div className="academic-years-header">
                <div>
                    <div className="section-kicker">
                        Academic Results
                    </div>

                    <h1>Results</h1>

                    <p className="hero-copy">
                        Manage student examination results and academic
                        performance.
                    </p>
                </div>

                <button
                    type="button"
                    className="btn btn-primary academic-years-add"
                    onClick={openAddModal}
                >
                    <i className="bi bi-plus-lg"></i>
                    Add Result
                </button>
            </div>

            {/* MAIN PANEL */}

            <div className="dashboard-panel academic-years-panel">

                {/* PANEL HEADER */}

                <div className="academic-years-panel-heading">

                    <div className="d-flex align-items-center gap-3">

                        <div className="student-search">
                            <i className="bi bi-search"></i>

                            <input
                                type="text"
                                placeholder="Search results..."
                                value={searchTerm}
                                onChange={(e) =>
                                    setSearchTerm(e.target.value)
                                }
                            />
                        </div>

                        <span className="panel-count">
                            {filteredResults.length} Results
                        </span>

                    </div>

                </div>

                {/* TABLE */}

                {loading ? (
                    <div className="academic-years-empty">
                        <div className="spinner-border"></div>
                        <p>Loading results...</p>
                    </div>
                ) : filteredResults.length === 0 ? (
                    <div className="academic-years-empty">
                        <i className="bi bi-clipboard-data"></i>
                        <p>No results found.</p>
                    </div>
                ) : (
                    <div className="academic-years-table-wrap">

                        <div className="table-responsive">

                            <table className="table academic-years-table">

                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Exam</th>
                                        <th>Student</th>
                                        <th>Subject</th>
                                        <th>Marks</th>
                                        <th>Total</th>
                                        <th>Grade</th>
                                        <th>Remarks</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {filteredResults.map(
                                        (result, index) => (
                                            <tr key={result.id}>

                                                <td className="academic-years-index">
                                                    {index + 1}
                                                </td>

                                                <td>
                                                    <div className="student-table-name">
                                                        {getExamName(
                                                            result.exam
                                                        )}
                                                    </div>
                                                </td>

                                                <td>
                                                    <div className="d-flex align-items-center gap-2">

                                                        <div className="student-avatar">
                                                            {String(
                                                                getStudentName(
                                                                    result.student
                                                                )
                                                            )
                                                                .charAt(0)
                                                                .toUpperCase()}
                                                        </div>

                                                        <div className="student-table-name">
                                                            {getStudentName(
                                                                result.student
                                                            )}
                                                        </div>

                                                    </div>
                                                </td>

                                                <td>
                                                    {getSubjectName(
                                                        result.subject
                                                    )}
                                                </td>

                                                <td>
                                                    {result.marks_obtained}
                                                </td>

                                                <td>
                                                    {result.total_marks}
                                                </td>

                                                <td>
                                                    <span className="badge bg-success">
                                                        {result.grade || '-'}
                                                    </span>
                                                </td>

                                                <td>
                                                    {result.remarks || '-'}
                                                </td>

                                                <td>
                                                    <div className="academic-actions">

                                                        <button
                                                            type="button"
                                                            className="academic-action-button edit"
                                                            onClick={() =>
                                                                openEditModal(
                                                                    result
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
                                                                    result
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

                    </div>
                )}

            </div>

            {/* MODAL */}

            {showModal && (
                <div
                    className="student-modal-overlay"
                    onClick={closeModal}
                >

                    <div
                        className="student-modal"
                        onClick={(e) => e.stopPropagation()}
                    >

                        {/* MODAL HEADER */}

                        <div className="student-modal-header">

                            <div>
                                <div className="section-kicker">
                                    {editingResult
                                        ? 'Update Result'
                                        : 'New Result'}
                                </div>

                                <h2>
                                    {editingResult
                                        ? 'Edit Result'
                                        : 'Add Result'}
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

                            <form
                                id="result-form"
                                onSubmit={handleSubmit}
                            >

                                <div className="student-form-grid">

                                    {/* EXAM */}

                                    <div className="form-group">

                                        <label>
                                            Exam *
                                        </label>

                                        <select
                                            name="exam"
                                            value={formData.exam}
                                            onChange={handleChange}
                                            className={
                                                errors.exam
                                                    ? 'is-invalid'
                                                    : ''
                                            }
                                        >
                                            <option value="">
                                                Select Exam
                                            </option>

                                            {exams.map((exam) => (
                                                <option
                                                    key={exam.id}
                                                    value={
                                                        exam.id ??
                                                        exam.name
                                                    }
                                                >
                                                    {exam.name ??
                                                        exam.exam_name}
                                                </option>
                                            ))}
                                        </select>

                                        {errors.exam && (
                                            <div className="invalid-feedback">
                                                {errors.exam}
                                            </div>
                                        )}

                                    </div>

                                    {/* STUDENT */}

                                    <div className="form-group">

                                        <label>
                                            Student *
                                        </label>

                                        <select
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

                                            {students.map((student) => (
                                                <option
                                                    key={student.id}
                                                    value={
                                                        student.id ??
                                                        student.name
                                                    }
                                                >
                                                    {student.name ??
                                                        student.student_name}
                                                </option>
                                            ))}
                                        </select>

                                        {errors.student && (
                                            <div className="invalid-feedback">
                                                {errors.student}
                                            </div>
                                        )}

                                    </div>

                                    {/* SUBJECT */}

                                    <div className="form-group">

                                        <label>
                                            Subject *
                                        </label>

                                        <select
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            className={
                                                errors.subject
                                                    ? 'is-invalid'
                                                    : ''
                                            }
                                        >
                                            <option value="">
                                                Select Subject
                                            </option>

                                            {subjects.map((subject) => (
                                                <option
                                                    key={subject.id}
                                                    value={
                                                        subject.id ??
                                                        subject.name
                                                    }
                                                >
                                                    {subject.name ??
                                                        subject.subject_name}
                                                </option>
                                            ))}
                                        </select>

                                        {errors.subject && (
                                            <div className="invalid-feedback">
                                                {errors.subject}
                                            </div>
                                        )}

                                    </div>

                                    {/* MARKS OBTAINED */}

                                    <div className="form-group">

                                        <label>
                                            Marks Obtained *
                                        </label>

                                        <input
                                            type="number"
                                            name="marks_obtained"
                                            value={
                                                formData.marks_obtained
                                            }
                                            onChange={handleChange}
                                            min="0"
                                            placeholder="Enter marks obtained"
                                            className={
                                                errors.marks_obtained
                                                    ? 'is-invalid'
                                                    : ''
                                            }
                                        />

                                        {errors.marks_obtained && (
                                            <div className="invalid-feedback">
                                                {
                                                    errors.marks_obtained
                                                }
                                            </div>
                                        )}

                                    </div>

                                    {/* TOTAL MARKS */}

                                    <div className="form-group">

                                        <label>
                                            Total Marks *
                                        </label>

                                        <input
                                            type="number"
                                            name="total_marks"
                                            value={formData.total_marks}
                                            onChange={handleChange}
                                            min="1"
                                            placeholder="Enter total marks"
                                            className={
                                                errors.total_marks
                                                    ? 'is-invalid'
                                                    : ''
                                            }
                                        />

                                        {errors.total_marks && (
                                            <div className="invalid-feedback">
                                                {errors.total_marks}
                                            </div>
                                        )}

                                    </div>

                                    {/* GRADE */}

                                    <div className="form-group">

                                        <label>
                                            Grade
                                        </label>

                                        <input
                                            type="text"
                                            name="grade"
                                            value={formData.grade}
                                            onChange={handleChange}
                                            placeholder="Enter grade"
                                        />

                                    </div>

                                    {/* REMARKS */}

                                    <div className="form-group">

                                        <label>
                                            Remarks
                                        </label>

                                        <textarea
                                            name="remarks"
                                            value={formData.remarks}
                                            onChange={handleChange}
                                            placeholder="Enter remarks"
                                            rows="3"
                                        ></textarea>

                                    </div>

                                </div>

                            </form>

                        </div>

                        {/* MODAL FOOTER */}

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
                                form="result-form"
                                className="student-modal-submit"
                                disabled={saving}
                            >
                                {saving ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                        Saving...
                                    </>
                                ) : editingResult ? (
                                    'Update Result'
                                ) : (
                                    'Save Result'
                                )}
                            </button>

                        </div>

                    </div>

                </div>
            )}

        </div>
    );
};

export default Result;
