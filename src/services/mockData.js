// Mock Data Layer with localStorage persistence

const STORAGE_KEYS = {
    ACADEMIC_YEARS: 'sms_academic_years',
    CLASSES: 'sms_classes',
    SECTIONS: 'sms_sections',
    SUBJECTS: 'sms_subjects',
    STUDENTS: 'sms_students',
};

const initialAcademicYears = [
    {
        id: 1,
        name: '2024-2025',
        start_date: '2024-08-01',
        end_date: '2025-06-30',
        status: 'completed',
    },
    {
        id: 2,
        name: '2025-2026',
        start_date: '2025-08-01',
        end_date: '2026-06-30',
        status: 'active',
    },
    {
        id: 3,
        name: '2026-2027',
        start_date: '2026-08-01',
        end_date: '2027-06-30',
        status: 'inactive',
    },
];

const initialClasses = [
    { id: 1, name: 'Class 1', description: 'Primary Grade 1', status: 'active' },
    { id: 2, name: 'Class 2', description: 'Primary Grade 2', status: 'active' },
    { id: 3, name: 'Class 3', description: 'Primary Grade 3', status: 'active' },
    { id: 4, name: 'Class 4', description: 'Primary Grade 4', status: 'active' },
    { id: 5, name: 'Class 5', description: 'Primary Grade 5', status: 'active' },
    { id: 6, name: 'Class 6', description: 'Middle Grade 6', status: 'active' },
    { id: 7, name: 'Class 7', description: 'Middle Grade 7', status: 'active' },
    { id: 8, name: 'Class 8', description: 'Middle Grade 8', status: 'active' },
    { id: 9, name: 'Class 9', description: 'Secondary Grade 9', status: 'active' },
    { id: 10, name: 'Class 10', description: 'Secondary Grade 10', status: 'active' },
];

const initialSections = [
    { id: 1, class_id: 1, class_name: 'Class 1', name: 'Section A', capacity: 35, status: 'active' },
    { id: 2, class_id: 1, class_name: 'Class 1', name: 'Section B', capacity: 35, status: 'active' },
    { id: 3, class_id: 2, class_name: 'Class 2', name: 'Section A', capacity: 30, status: 'active' },
    { id: 4, class_id: 3, class_name: 'Class 3', name: 'Section A', capacity: 30, status: 'active' },
    { id: 5, class_id: 4, class_name: 'Class 4', name: 'Section A', capacity: 30, status: 'active' },
];

const initialSubjects = [
    { id: 1, name: 'Mathematics', code: 'MATH-101', description: 'Core mathematics curriculum', status: 'active' },
    { id: 2, name: 'English Language', code: 'ENG-101', description: 'Grammar and literature', status: 'active' },
    { id: 3, name: 'General Science', code: 'SCI-101', description: 'Physics, Chemistry, and Biology basics', status: 'active' },
    { id: 4, name: 'Social Studies', code: 'SOC-101', description: 'History and Geography', status: 'active' },
    { id: 5, name: 'Computer Science', code: 'CS-101', description: 'Basics of computing and programming', status: 'active' },
];

const initialStudents = [
    {
        id: 1,
        name: 'Ali Ahmed',
        email: 'ali.ahmed@example.com',
        phone: '+92 300 1234567',
        class_name: 'Class 10',
        section: 'Section A',
        gender: 'Male',
        date_of_birth: '2008-04-12',
        address: 'Main Street, City',
        guardian_name: 'Ahmed Khan',
        guardian_phone: '+92 300 7654321',
        status: 'active',
    },
    {
        id: 2,
        name: 'Sara Khan',
        email: 'sara.khan@example.com',
        phone: '+92 301 2345678',
        class_name: 'Class 9',
        section: 'Section B',
        gender: 'Female',
        date_of_birth: '2009-08-25',
        address: 'Block 4, City',
        guardian_name: 'Tariq Khan',
        guardian_phone: '+92 301 8765432',
        status: 'active',
    },
    {
        id: 3,
        name: 'Zainab Fatima',
        email: 'zainab.f@example.com',
        phone: '+92 302 3456789',
        class_name: 'Class 8',
        section: 'Section A',
        gender: 'Female',
        date_of_birth: '2010-01-15',
        address: 'Street 12, City',
        guardian_name: 'Muhammad Asif',
        guardian_phone: '+92 302 9876543',
        status: 'active',
    },
    {
        id: 4,
        name: 'Bilal Hassan',
        email: 'bilal.h@example.com',
        phone: '+92 303 4567890',
        class_name: 'Class 10',
        section: 'Section B',
        gender: 'Male',
        date_of_birth: '2008-11-05',
        address: 'House 88, City',
        guardian_name: 'Hassan Raza',
        guardian_phone: '+92 303 0987654',
        status: 'active',
    },
    {
        id: 5,
        name: 'Ayesha Noor',
        email: 'ayesha.noor@example.com',
        phone: '+92 304 5678901',
        class_name: 'Class 7',
        section: 'Section A',
        gender: 'Female',
        date_of_birth: '2011-03-20',
        address: 'Sector G-9, City',
        guardian_name: 'Noor Alam',
        guardian_phone: '+92 304 1098765',
        status: 'inactive',
    },
];

const getStoredList = (key, defaultList) => {
    try {
        const data = localStorage.getItem(key);
        if (data) {
            return JSON.parse(data);
        }
    } catch (e) {
        console.warn(`Failed reading ${key} from localStorage:`, e);
    }
    localStorage.setItem(key, JSON.stringify(defaultList));
    return defaultList;
};

const setStoredList = (key, list) => {
    try {
        localStorage.setItem(key, JSON.stringify(list));
    } catch (e) {
        console.warn(`Failed writing ${key} to localStorage:`, e);
    }
};

export const mockStorage = {
    // Academic Years
    getAcademicYears: () => getStoredList(STORAGE_KEYS.ACADEMIC_YEARS, initialAcademicYears),
    saveAcademicYears: (list) => setStoredList(STORAGE_KEYS.ACADEMIC_YEARS, list),
    addAcademicYear: (item) => {
        const list = mockStorage.getAcademicYears();
        const newItem = { ...item, id: Date.now() };
        const updated = [newItem, ...list];
        mockStorage.saveAcademicYears(updated);
        return newItem;
    },
    updateAcademicYear: (id, item) => {
        const list = mockStorage.getAcademicYears();
        const updated = list.map((y) => (y.id === Number(id) ? { ...y, ...item, id: Number(id) } : y));
        mockStorage.saveAcademicYears(updated);
        return updated.find((y) => y.id === Number(id));
    },
    deleteAcademicYear: (id) => {
        const list = mockStorage.getAcademicYears();
        const updated = list.filter((y) => y.id !== Number(id));
        mockStorage.saveAcademicYears(updated);
        return true;
    },

    // Classes
    getClasses: () => getStoredList(STORAGE_KEYS.CLASSES, initialClasses),
    saveClasses: (list) => setStoredList(STORAGE_KEYS.CLASSES, list),
    addClass: (item) => {
        const list = mockStorage.getClasses();
        const newItem = { ...item, id: Date.now() };
        const updated = [newItem, ...list];
        mockStorage.saveClasses(updated);
        return newItem;
    },
    updateClass: (id, item) => {
        const list = mockStorage.getClasses();
        const updated = list.map((c) => (c.id === Number(id) ? { ...c, ...item, id: Number(id) } : c));
        mockStorage.saveClasses(updated);
        return updated.find((c) => c.id === Number(id));
    },
    deleteClass: (id) => {
        const list = mockStorage.getClasses();
        const updated = list.filter((c) => c.id !== Number(id));
        mockStorage.saveClasses(updated);
        return true;
    },

    // Sections
    getSections: () => getStoredList(STORAGE_KEYS.SECTIONS, initialSections),
    saveSections: (list) => setStoredList(STORAGE_KEYS.SECTIONS, list),
    addSection: (item) => {
        const list = mockStorage.getSections();
        const classes = mockStorage.getClasses();
        const matchedClass = classes.find((c) => c.id === Number(item.class_id));
        const newItem = {
            ...item,
            id: Date.now(),
            class_name: matchedClass ? matchedClass.name : `Class ${item.class_id}`,
        };
        const updated = [newItem, ...list];
        mockStorage.saveSections(updated);
        return newItem;
    },
    updateSection: (id, item) => {
        const list = mockStorage.getSections();
        const classes = mockStorage.getClasses();
        const matchedClass = classes.find((c) => c.id === Number(item.class_id));
        const updated = list.map((s) =>
            s.id === Number(id)
                ? {
                    ...s,
                    ...item,
                    id: Number(id),
                    class_name: matchedClass ? matchedClass.name : s.class_name,
                }
                : s
        );
        mockStorage.saveSections(updated);
        return updated.find((s) => s.id === Number(id));
    },
    deleteSection: (id) => {
        const list = mockStorage.getSections();
        const updated = list.filter((s) => s.id !== Number(id));
        mockStorage.saveSections(updated);
        return true;
    },

    // Subjects
    getSubjects: () => getStoredList(STORAGE_KEYS.SUBJECTS, initialSubjects),
    saveSubjects: (list) => setStoredList(STORAGE_KEYS.SUBJECTS, list),
    addSubject: (item) => {
        const list = mockStorage.getSubjects();
        const newItem = { ...item, id: Date.now() };
        const updated = [newItem, ...list];
        mockStorage.saveSubjects(updated);
        return newItem;
    },
    updateSubject: (id, item) => {
        const list = mockStorage.getSubjects();
        const updated = list.map((s) => (s.id === Number(id) ? { ...s, ...item, id: Number(id) } : s));
        mockStorage.saveSubjects(updated);
        return updated.find((s) => s.id === Number(id));
    },
    deleteSubject: (id) => {
        const list = mockStorage.getSubjects();
        const updated = list.filter((s) => s.id !== Number(id));
        mockStorage.saveSubjects(updated);
        return true;
    },

    // Students
    getStudents: () => getStoredList(STORAGE_KEYS.STUDENTS, initialStudents),
    saveStudents: (list) => setStoredList(STORAGE_KEYS.STUDENTS, list),
    addStudent: (item) => {
        const list = mockStorage.getStudents();
        const newItem = { ...item, id: Date.now() };
        const updated = [newItem, ...list];
        mockStorage.saveStudents(updated);
        return newItem;
    },
    updateStudent: (id, item) => {
        const list = mockStorage.getStudents();
        const updated = list.map((s) => (s.id === Number(id) ? { ...s, ...item, id: Number(id) } : s));
        mockStorage.saveStudents(updated);
        return updated.find((s) => s.id === Number(id));
    },
    deleteStudent: (id) => {
        const list = mockStorage.getStudents();
        const updated = list.filter((s) => s.id !== Number(id));
        mockStorage.saveStudents(updated);
        return true;
    },

    // Dashboard dynamic generator
    getDashboardData: () => {
        const students = mockStorage.getStudents();
        const classes = mockStorage.getClasses();
        const sections = mockStorage.getSections();
        const subjects = mockStorage.getSubjects();
        const academicYears = mockStorage.getAcademicYears();
        const activeYear = academicYears.find((y) => y.status === 'active') || academicYears[0] || { name: '2025-2026' };

        return {
            user: {
                name: 'Administrator',
            },
            academic_year: {
                name: activeYear.name,
            },
            counts: {
                students: students.length,
                teachers: 28,
                staff: 14,
                classes: classes.length,
                sections: sections.length,
                subjects: subjects.length,
            },
            attendance: {
                total: students.length * 20,
                present: Math.round(students.length * 18.5),
                absent: Math.round(students.length * 1),
                late: Math.round(students.length * 0.5),
            },
            exams: {
                total: 12,
                results: 10,
            },
            fees: {
                total: 250000,
                paid: 195000,
                remaining: 55000,
                pending: 15000,
                collection_percentage: 78,
            },
            recent_students: students.slice(0, 5),
            recent_payments: [
                {
                    id: 1,
                    receipt_number: 'REC-2026-001',
                    student: { name: students[0]?.name || 'Ali Ahmed' },
                    payment_date: '2026-09-10',
                    payment_method: 'Cash',
                    amount: 15000,
                },
                {
                    id: 2,
                    receipt_number: 'REC-2026-002',
                    student: { name: students[1]?.name || 'Sara Khan' },
                    payment_date: '2026-09-11',
                    payment_method: 'Online Transfer',
                    amount: 15000,
                },
                {
                    id: 3,
                    receipt_number: 'REC-2026-003',
                    student: { name: students[2]?.name || 'Zainab Fatima' },
                    payment_date: '2026-09-12',
                    payment_method: 'Bank Deposit',
                    amount: 12000,
                },
            ],
        };
    },
};

