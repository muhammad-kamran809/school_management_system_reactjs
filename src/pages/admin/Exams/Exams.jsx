

import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

// API will be connected later by backend developer
// import api from '../../../services/api';

import { mockStorage } from '../../../services/mockData';

const initialForm = {
    exam_name: '',
    academic_year: '',
    class_name: '',
    start_date: '',
    end_date: '',
    status: 'active',
};

// =========================================================
// DEMO EXAM DATA
// =========================================================

const demoExamData = [
    {
        id: 'EXAM-001',
        exam_name: 'Mid Term Examination',
        academic_year: '2024-2025',
        class_name: 'Class 10',
        start_date: '2025-03-10',
        end_date: '2025-03-15',
        status: 'active',
    },
    {
        id: 'EXAM-002',
        exam_name: 'Final Examination',
        academic_year: '2024-2025',
        class_name: 'Class 9',
        start_date: '2025-05-05',
        end_date: '2025-05-12',
        status: 'active',
    },
    {
        id: 'EXAM-003',
        exam_name: 'Monthly Test - September',
        academic_year: '2025-2026',
        class_name: 'Class 8',
        start_date: '2025-09-10',
        end_date: '2025-09-12',
        status: 'completed',
    },
    {
        id: 'EXAM-004',
        exam_name: 'First Term Examination',
        academic_year: '2025-2026',
        class_name: 'Class 7',
        start_date: '2025-10-15',
        end_date: '2025-10-20',
        status: 'active',
    },
    {
        id: 'EXAM-005',
        exam_name: 'Annual Examination',
        academic_year: '2025-2026',
        class_name: 'Class 6',
        start_date: '2026-03-01',
        end_date: '2026-03-07',
        status: 'inactive',
    },
    {
        id: 'EXAM-006',
        exam_name: 'First Monthly Test',
        academic_year: '2026-2027',
        class_name: 'Class 6',
        start_date: '2026-04-06',
        end_date: '2026-04-08',
        status: 'completed',
    },
    {
        id: 'EXAM-007',
        exam_name: 'Second Monthly Test',
        academic_year: '2026-2027',
        class_name: 'Class 7',
        start_date: '2026-05-11',
        end_date: '2026-05-13',
        status: 'active',
    },
    {
        id: 'EXAM-008',
        exam_name: 'Mid Year Examination',
        academic_year: '2026-2027',
        class_name: 'Class 8',
        start_date: '2026-06-15',
        end_date: '2026-06-20',
        status: 'active',
    },
    {
        id: 'EXAM-009',
        exam_name: 'Science Assessment',
        academic_year: '2026-2027',
        class_name: 'Class 9',
        start_date: '2026-07-05',
        end_date: '2026-07-07',
        status: 'completed',
    },
    {
        id: 'EXAM-010',
        exam_name: 'Mathematics Assessment',
        academic_year: '2026-2027',
        class_name: 'Class 10',
        start_date: '2026-07-15',
        end_date: '2026-07-17',
        status: 'active',
    },
    {
        id: 'EXAM-011',
        exam_name: 'English Language Test',
        academic_year: '2026-2027',
        class_name: 'Class 8',
        start_date: '2026-08-03',
        end_date: '2026-08-05',
        status: 'active',
    },
    {
        id: 'EXAM-012',
        exam_name: 'Computer Science Test',
        academic_year: '2026-2027',
        class_name: 'Class 9',
        start_date: '2026-08-10',
        end_date: '2026-08-12',
        status: 'inactive',
    },
    {
        id: 'EXAM-013',
        exam_name: 'First Semester Examination',
        academic_year: '2026-2027',
        class_name: 'Class 10',
        start_date: '2026-09-01',
        end_date: '2026-09-08',
        status: 'active',
    },
    {
        id: 'EXAM-014',
        exam_name: 'Islamiyat Assessment',
        academic_year: '2026-2027',
        class_name: 'Class 7',
        start_date: '2026-09-15',
        end_date: '2026-09-17',
        status: 'completed',
    },
    {
        id: 'EXAM-015',
        exam_name: 'General Knowledge Test',
        academic_year: '2026-2027',
        class_name: 'Class 6',
        start_date: '2026-09-20',
        end_date: '2026-09-22',
        status: 'active',
    },
    {
        id: 'EXAM-016',
        exam_name: 'Physics Mid Term',
        academic_year: '2026-2027',
        class_name: 'Class 10',
        start_date: '2026-10-05',
        end_date: '2026-10-08',
        status: 'active',
    },
    {
        id: 'EXAM-017',
        exam_name: 'Chemistry Assessment',
        academic_year: '2026-2027',
        class_name: 'Class 10',
        start_date: '2026-10-12',
        end_date: '2026-10-14',
        status: 'active',
    },
    {
        id: 'EXAM-018',
        exam_name: 'Biology Monthly Test',
        academic_year: '2026-2027',
        class_name: 'Class 9',
        start_date: '2026-10-20',
        end_date: '2026-10-22',
        status: 'inactive',
    },
    {
        id: 'EXAM-019',
        exam_name: 'Second Term Examination',
        academic_year: '2026-2027',
        class_name: 'Class 8',
        start_date: '2026-11-02',
        end_date: '2026-11-07',
        status: 'active',
    },
    {
        id: 'EXAM-020',
        exam_name: 'Final Assessment',
        academic_year: '2026-2027',
        class_name: 'Class 7',
        start_date: '2026-12-01',
        end_date: '2026-12-05',
        status: 'cancelled',
    },
];

// =========================================================
// DEMO ACADEMIC YEARS
// =========================================================

const demoAcademicYears = [
    {
        id: 1,
        name: '2024-2025',
    },
    {
        id: 2,
        name: '2025-2026',
    },
    {
        id: 3,
        name: '2026-2027',
    },
];

// =========================================================
// DEMO CLASSES
// =========================================================

const demoClasses = [
    {
        id: 1,
        name: 'Class 6',
    },
    {
        id: 2,
        name: 'Class 7',
    },
    {
        id: 3,
        name: 'Class 8',
    },
    {
        id: 4,
        name: 'Class 9',
    },
    {
        id: 5,
        name: 'Class 10',
    },
];

const Exams = () => {
    const [exams, setExams] = useState([]);
    const [academicYears, setAcademicYears] = useState([]);
    const [classes, setClasses] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [editingExam, setEditingExam] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState(initialForm);
    const [errors, setErrors] = useState({});

    // =========================================================
    // LOAD DATA
    // =========================================================

    useEffect(() => {
        fetchExams();
        fetchAcademicYears();
        fetchClasses();
    }, []);

    // =========================================================
    // FETCH EXAMS
    // =========================================================

    const fetchExams = async () => {
        try {
            setLoading(true);

            // API will be connected later
            // const response = await api.get('/exams');
            // setExams(response.data);

            let data = [];

            if (
                mockStorage &&
                typeof mockStorage.getExams === 'function'
            ) {
                data = mockStorage.getExams() || [];
            } else {
                const storedData =
                    localStorage.getItem('sms_exams');

                data = storedData
                    ? JSON.parse(storedData)
                    : [];
            }

            // If there is no data, use demo data.
            if (!Array.isArray(data) || data.length === 0) {
                data = demoExamData;

                localStorage.setItem(
                    'sms_exams',
                    JSON.stringify(demoExamData)
                );
            }

            setExams(
                Array.isArray(data)
                    ? data
                    : []
            );
        } catch (error) {
            console.error(
                'Error fetching exams:',
                error
            );

            setExams(demoExamData);

            localStorage.setItem(
                'sms_exams',
                JSON.stringify(demoExamData)
            );

            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to load exam records.',
            });
        } finally {
            setLoading(false);
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
                typeof mockStorage.getAcademicYears ===
                    'function'
            ) {
                data =
                    mockStorage.getAcademicYears() || [];
            } else {
                const storedData =
                    localStorage.getItem(
                        'sms_academic_years'
                    );

                data = storedData
                    ? JSON.parse(storedData)
                    : [];
            }

            if (
                !Array.isArray(data) ||
                data.length === 0
            ) {
                data = demoAcademicYears;
            }

            setAcademicYears(
                Array.isArray(data)
                    ? data
                    : []
            );
        } catch (error) {
            console.error(
                'Error fetching academic years:',
                error
            );

            setAcademicYears(
                demoAcademicYears
            );
        }
    };

    // =========================================================
    // FETCH CLASSES
    // =========================================================

    const fetchClasses = async () => {
        try {
            let data = [];

            if (
                mockStorage &&
                typeof mockStorage.getClasses ===
                    'function'
            ) {
                data =
                    mockStorage.getClasses() || [];
            } else {
                const storedData =
                    localStorage.getItem(
                        'sms_classes'
                    );

                data = storedData
                    ? JSON.parse(storedData)
                    : [];
            }

            if (
                !Array.isArray(data) ||
                data.length === 0
            ) {
                data = demoClasses;
            }

            setClasses(
                Array.isArray(data)
                    ? data
                    : []
            );
        } catch (error) {
            console.error(
                'Error fetching classes:',
                error
            );

            setClasses(demoClasses);
        }
    };

    // =========================================================
    // ERROR HANDLER
    // =========================================================

    const handleApiError = (error) => {
        console.error(error);

        const status =
            error?.response?.status;

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
        const {
            name,
            value,
        } = e.target;

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
        setEditingExam(null);
        setFormData(initialForm);
        setErrors({});
        setShowModal(true);
    };

    // =========================================================
    // OPEN EDIT MODAL
    // =========================================================

    const openEditModal = (item) => {
        setEditingExam(item);

        setFormData({
            exam_name:
                item.exam_name ||
                item.name ||
                '',

            academic_year:
                item.academic_year ||
                item.academicYear ||
                item.academic_year_id ||
                '',

            class_name:
                item.class_name ||
                item.className ||
                item.class ||
                item.class_id ||
                '',

            start_date:
                item.start_date ||
                item.startDate ||
                '',

            end_date:
                item.end_date ||
                item.endDate ||
                '',

            status:
                item.status ||
                'active',
        });

        setErrors({});
        setShowModal(true);
    };

    // =========================================================
    // CLOSE MODAL
    // =========================================================

    const closeModal = () => {
        setShowModal(false);
        setEditingExam(null);
        setFormData(initialForm);
        setErrors({});
    };

    // =========================================================
    // VALIDATION
    // =========================================================

    const validateForm = () => {
        const newErrors = {};

        if (!formData.exam_name.trim()) {
            newErrors.exam_name =
                'Exam Name is required.';
        }

        if (!formData.academic_year) {
            newErrors.academic_year =
                'Academic Year is required.';
        }

        if (!formData.class_name) {
            newErrors.class_name =
                'Class is required.';
        }

        if (
            formData.start_date &&
            formData.end_date &&
            formData.end_date <
                formData.start_date
        ) {
            newErrors.end_date =
                'End Date cannot be before Start Date.';
        }

        setErrors(newErrors);

        return (
            Object.keys(newErrors).length === 0
        );
    };

    // =========================================================
    // SAVE EXAM
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
            // if (editingExam) {
            //     await api.put(
            //         `/exams/${editingExam.id}`,
            //         formData
            //     );
            // } else {
            //     await api.post(
            //         '/exams',
            //         formData
            //     );
            // }

            const newExam = {
                ...formData,
                id:
                    editingExam?.id ||
                    `EXAM-${Date.now()}`,
            };

            let updatedExams = [];

            if (editingExam) {
                updatedExams = exams.map(
                    (item) =>
                        item.id ===
                        editingExam.id
                            ? newExam
                            : item
                );

                if (
                    mockStorage &&
                    typeof mockStorage.updateExam ===
                        'function'
                ) {
                    mockStorage.updateExam(
                        editingExam.id,
                        newExam
                    );
                }
            } else {
                updatedExams = [
                    ...exams,
                    newExam,
                ];

                if (
                    mockStorage &&
                    typeof mockStorage.addExam ===
                        'function'
                ) {
                    mockStorage.addExam(
                        newExam
                    );
                }
            }

            localStorage.setItem(
                'sms_exams',
                JSON.stringify(updatedExams)
            );

            setExams(updatedExams);

            closeModal();

            Swal.fire({
                icon: 'success',
                title: editingExam
                    ? 'Exam Updated'
                    : 'Exam Added',
                text: editingExam
                    ? 'Exam has been updated successfully.'
                    : 'Exam has been added successfully.',
                timer: 1800,
                showConfirmButton: false,
            });
        } catch (error) {
            console.error(
                'Error saving exam:',
                error
            );

            handleApiError(error);
        } finally {
            setSaving(false);
        }
    };

    // =========================================================
    // DELETE EXAM
    // =========================================================

    const handleDelete = async (id) => {
        const result =
            await Swal.fire({
                icon: 'warning',
                title: 'Delete Exam?',
                text: 'This exam record will be permanently deleted.',
                showCancelButton: true,
                confirmButtonText:
                    'Yes, Delete',
                cancelButtonText:
                    'Cancel',
            });

        if (!result.isConfirmed) {
            return;
        }

        try {
            // API will be connected later
            //
            // await api.delete(
            //     `/exams/${id}`
            // );

            if (
                mockStorage &&
                typeof mockStorage.deleteExam ===
                    'function'
            ) {
                mockStorage.deleteExam(id);
            }

            const updatedExams =
                exams.filter(
                    (item) =>
                        item.id !== id
                );

            localStorage.setItem(
                'sms_exams',
                JSON.stringify(updatedExams)
            );

            setExams(updatedExams);

            Swal.fire({
                icon: 'success',
                title: 'Deleted',
                text: 'Exam record has been deleted successfully.',
                timer: 1500,
                showConfirmButton: false,
            });
        } catch (error) {
            console.error(
                'Error deleting exam:',
                error
            );

            handleApiError(error);
        }
    };

    // =========================================================
    // GET ACADEMIC YEAR NAME
    // =========================================================

    const getAcademicYearName = (
        yearValue
    ) => {
        const foundYear =
            academicYears.find(
                (item) =>
                    String(item.id) ===
                        String(yearValue) ||
                    String(item.name) ===
                        String(yearValue)
            );

        return (
            foundYear?.name ||
            yearValue ||
            '-'
        );
    };

    // =========================================================
    // GET CLASS NAME
    // =========================================================

    const getClassName = (
        classValue
    ) => {
        const foundClass =
            classes.find(
                (item) =>
                    String(item.id) ===
                        String(classValue) ||
                    String(item.name) ===
                        String(classValue)
            );

        return (
            foundClass?.name ||
            classValue ||
            '-'
        );
    };

    // =========================================================
    // SEARCH
    // =========================================================

    const filteredExams =
        exams.filter((item) => {
            const search =
                searchTerm.toLowerCase();

            return (
                String(
                    item.exam_name ||
                        item.name ||
                        ''
                )
                    .toLowerCase()
                    .includes(search) ||
                String(
                    getAcademicYearName(
                        item.academic_year ||
                            item.academicYear ||
                            item.academic_year_id
                    )
                )
                    .toLowerCase()
                    .includes(search) ||
                String(
                    getClassName(
                        item.class_name ||
                            item.className ||
                            item.class ||
                            item.class_id
                    )
                )
                    .toLowerCase()
                    .includes(search) ||
                String(
                    item.start_date ||
                        item.startDate ||
                        ''
                )
                    .toLowerCase()
                    .includes(search) ||
                String(
                    item.end_date ||
                        item.endDate ||
                        ''
                )
                    .toLowerCase()
                    .includes(search) ||
                String(
                    item.status || ''
                )
                    .toLowerCase()
                    .includes(search)
            );
        });

    // =========================================================
    // STATUS CLASS
    // =========================================================

    const getStatusClass = (
        status
    ) => {
        const value =
            String(
                status || ''
            ).toLowerCase();

        if (
            value === 'active' ||
            value === 'completed'
        ) {
            return 'active';
        }

        return 'inactive';
    };

    // =========================================================
    // FORMAT DATE
    // =========================================================

    const formatDate = (date) => {
        if (!date) {
            return '-';
        }

        const parsedDate =
            new Date(date);

        if (
            Number.isNaN(
                parsedDate.getTime()
            )
        ) {
            return date;
        }

        return parsedDate.toLocaleDateString(
            'en-GB'
        );
    };

    // =========================================================
    // FIELD ERROR
    // =========================================================

    const fieldError = (
        fieldName
    ) => {
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
                        Academics
                    </p>

                    <h1>Exams</h1>

                    <p className="hero-copy">
                        Manage examination schedules
                        and information.
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

                    Add Exam
                </button>

            </div>

            {/* MAIN PANEL */}
            <div className="dashboard-panel academic-years-panel">

                {/* PANEL HEADER */}
                <div className="academic-years-panel-heading">

                    <div>
                        <p className="section-kicker">
                            Exam management
                        </p>

                        <h2>
                            Exam list
                        </h2>
                    </div>

                    <div className="d-flex align-items-center gap-3">

                        <div className="student-search">

                            <i
                                className="bi bi-search"
                                aria-hidden="true"
                            ></i>

                            <input
                                type="text"
                                placeholder="Search exams..."
                                value={searchTerm}
                                onChange={(e) =>
                                    setSearchTerm(
                                        e.target.value
                                    )
                                }
                            />

                        </div>

                        <span className="panel-count">
                            {filteredExams.length}{' '}
                            records
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

                            <p>
                                Loading exams...
                            </p>

                        </div>
                    ) : filteredExams.length ===
                      0 ? (
                        <div className="academic-years-empty">

                            <i className="bi bi-calendar-check"></i>

                            <h3>
                                No exam records found
                            </h3>

                            <p>
                                Add an exam record
                                to get started.
                            </p>

                        </div>
                    ) : (
                        <div className="table-responsive">

                            <table className="table academic-years-table">

                                <thead>
                                    <tr>
                                        <th>#</th>

                                        <th>
                                            Exam Name
                                        </th>

                                        <th>
                                            Academic Year
                                        </th>

                                        <th>
                                            Class
                                        </th>

                                        <th>
                                            Start Date
                                        </th>

                                        <th>
                                            End Date
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

                                    {filteredExams.map(
                                        (
                                            item,
                                            index
                                        ) => (
                                            <tr
                                                key={
                                                    item.id
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
                                                            <i className="bi bi-journal-text"></i>
                                                        </div>

                                                        <div>
                                                            <strong>
                                                                {item.exam_name ||
                                                                    item.name ||
                                                                    '-'}
                                                            </strong>

                                                            <small>
                                                                Examination
                                                            </small>
                                                        </div>

                                                    </div>
                                                </td>

                                                <td>
                                                    {getAcademicYearName(
                                                        item.academic_year ||
                                                            item.academicYear ||
                                                            item.academic_year_id
                                                    )}
                                                </td>

                                                <td>
                                                    {getClassName(
                                                        item.class_name ||
                                                            item.className ||
                                                            item.class ||
                                                            item.class_id
                                                    )}
                                                </td>

                                                <td>
                                                    {formatDate(
                                                        item.start_date ||
                                                            item.startDate
                                                    )}
                                                </td>

                                                <td>
                                                    {formatDate(
                                                        item.end_date ||
                                                            item.endDate
                                                    )}
                                                </td>

                                                <td>
                                                    <span
                                                        className={`status-badge ${getStatusClass(
                                                            item.status
                                                        )}`}
                                                    >
                                                        {item.status ||
                                                            'active'}
                                                    </span>
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
                                    Examination
                                </p>

                                <h2>
                                    {editingExam
                                        ? 'Edit Exam'
                                        : 'Add Exam'}
                                </h2>

                            </div>

                            <button
                                type="button"
                                className="btn-close"
                                onClick={
                                    closeModal
                                }
                            ></button>

                        </div>

                        {/* MODAL BODY */}
                        <div className="student-modal-body">

                            <form
                                onSubmit={
                                    handleSubmit
                                }
                            >

                                <div className="student-form-grid">

                                    {/* EXAM NAME */}
                                    <div className="form-group">

                                        <label htmlFor="exam_name">
                                            Exam Name *
                                        </label>

                                        <input
                                            type="text"
                                            id="exam_name"
                                            name="exam_name"
                                            value={
                                                formData.exam_name
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Enter exam name"
                                            className={
                                                errors.exam_name
                                                    ? 'is-invalid'
                                                    : ''
                                            }
                                        />

                                        {fieldError(
                                            'exam_name'
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
                                                Select Academic
                                                Year
                                            </option>

                                            {academicYears.map(
                                                (
                                                    item
                                                ) => (
                                                    <option
                                                        key={
                                                            item.id
                                                        }
                                                        value={
                                                            item.id ??
                                                            item.name
                                                        }
                                                    >
                                                        {item.name ||
                                                            item.year}
                                                    </option>
                                                )
                                            )}

                                        </select>

                                        {fieldError(
                                            'academic_year'
                                        )}

                                    </div>

                                    {/* CLASS */}
                                    <div className="form-group">

                                        <label htmlFor="class_name">
                                            Class *
                                        </label>

                                        <select
                                            id="class_name"
                                            name="class_name"
                                            value={
                                                formData.class_name
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            className={
                                                errors.class_name
                                                    ? 'is-invalid'
                                                    : ''
                                            }
                                        >

                                            <option value="">
                                                Select Class
                                            </option>

                                            {classes.map(
                                                (
                                                    item
                                                ) => (
                                                    <option
                                                        key={
                                                            item.id
                                                        }
                                                        value={
                                                            item.id ??
                                                            item.name
                                                        }
                                                    >
                                                        {item.name ||
                                                            item.class_name}
                                                    </option>
                                                )
                                            )}

                                        </select>

                                        {fieldError(
                                            'class_name'
                                        )}

                                    </div>

                                    {/* START DATE */}
                                    <div className="form-group">

                                        <label htmlFor="start_date">
                                            Start Date
                                        </label>

                                        <input
                                            type="date"
                                            id="start_date"
                                            name="start_date"
                                            value={
                                                formData.start_date
                                            }
                                            onChange={
                                                handleChange
                                            }
                                        />

                                    </div>

                                    {/* END DATE */}
                                    <div className="form-group">

                                        <label htmlFor="end_date">
                                            End Date
                                        </label>

                                        <input
                                            type="date"
                                            id="end_date"
                                            name="end_date"
                                            value={
                                                formData.end_date
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            className={
                                                errors.end_date
                                                    ? 'is-invalid'
                                                    : ''
                                            }
                                        />

                                        {fieldError(
                                            'end_date'
                                        )}

                                    </div>

                                    {/* STATUS */}
                                    <div className="form-group">

                                        <label htmlFor="status">
                                            Status
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
                                        >

                                            <option value="active">
                                                Active
                                            </option>

                                            <option value="inactive">
                                                Inactive
                                            </option>

                                            <option value="completed">
                                                Completed
                                            </option>

                                            <option value="cancelled">
                                                Cancelled
                                            </option>

                                        </select>

                                    </div>

                                </div>

                                {/* MODAL FOOTER */}
                                <div className="student-modal-footer">

                                    <button
                                        type="button"
                                        className="student-modal-cancel"
                                        onClick={
                                            closeModal
                                        }
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        className="student-modal-submit"
                                        disabled={
                                            saving
                                        }
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

                                                {editingExam
                                                    ? 'Update Exam'
                                                    : 'Save Exam'}
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

export default Exams;