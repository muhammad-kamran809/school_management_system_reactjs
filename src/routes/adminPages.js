export const adminPageGroups = [
    {
        title: 'Academic',
        icon: 'bi-mortarboard',
        items: [
            { title: 'Academic Years', path: '/academic-years', icon: 'bi-calendar3', roles: ['Admin'] },
            { title: 'Classes', path: '/classes', icon: 'bi-building', roles: ['Admin', 'Staff'] },
            { title: 'Sections', path: '/sections', icon: 'bi-grid-3x3-gap', roles: ['Admin', 'Staff'] },
            { title: 'Subjects', path: '/subjects', icon: 'bi-book', roles: ['Admin', 'Staff'] },
        ],
    },
    {
        title: 'People',
        icon: 'bi-people',
        items: [
            { title: 'Students', path: '/students', icon: 'bi-person-vcard', roles: ['Admin', 'Staff'] },
            { title: 'Teachers', path: '/teachers', icon: 'bi-person-workspace', roles: ['Admin', 'Staff'] },
            { title: 'Staff', path: '/staff', icon: 'bi-person-badge', roles: ['Admin', 'Staff'] },
            { title: 'Parents', path: '/parents', icon: 'bi-people-fill', roles: ['Admin'] },
            { title: 'User Accounts', path: '/users', icon: 'bi-person-gear', roles: ['Admin'] },
        ],
    },
    {
        title: 'Academic Management',
        icon: 'bi-kanban',
        items: [
            { title: 'Enrollments', path: '/enrollments', icon: 'bi-person-plus', roles: ['Admin', 'Staff'] },
            { title: 'Teacher Assignments', path: '/teacher-assignments', icon: 'bi-person-check', roles: ['Admin'] },
            { title: 'Timetable', path: '/timetable', icon: 'bi-table', roles: ['Admin', 'Staff', 'Teacher', 'Student', 'Parent'] },
        ],
    },
    {
        title: 'Attendance',
        icon: 'bi-calendar2-check',
        items: [
            { title: 'Student Attendance', path: '/student-attendance', icon: 'bi-person-check', roles: ['Admin', 'Staff', 'Teacher'] },
            { title: 'Teacher Attendance', path: '/teacher-attendance', icon: 'bi-person-check-fill', roles: ['Admin', 'Staff', 'Teacher'] },
        ],
    },
    {
        title: 'Exams',
        icon: 'bi-journal-check',
        items: [
            { title: 'Exams', path: '/exams', icon: 'bi-journal-text', roles: ['Admin', 'Teacher', 'Student', 'Parent'] },
            { title: 'Results', path: '/results', icon: 'bi-award', roles: ['Admin', 'Teacher'] },
        ],
    },
    {
        title: 'Finance',
        icon: 'bi-wallet2',
        items: [
            { title: 'Fees', path: '/fees', icon: 'bi-receipt', roles: ['Admin', 'Staff'] },
            { title: 'Payments', path: '/payments', icon: 'bi-credit-card', roles: ['Admin', 'Staff'] },
            { title: 'Fee Reports', path: '/fee-reports', icon: 'bi-bar-chart-line', roles: ['Admin'] },
        ],
    },
    {
        title: 'Communication',
        icon: 'bi-megaphone',
        items: [
            { title: 'Notices', path: '/notices', icon: 'bi-bell', roles: ['Admin', 'Staff', 'Teacher', 'Student', 'Parent'] },
            { title: 'Events', path: '/events', icon: 'bi-calendar-event', roles: ['Admin', 'Staff', 'Teacher', 'Student', 'Parent'] },
        ],
    },
    {
        title: 'Reports',
        icon: 'bi-file-earmark-bar-graph',
        items: [
            { title: 'Student Report', path: '/student-report', icon: 'bi-file-earmark-person', roles: ['Admin'] },
            { title: 'Attendance Report', path: '/attendance-report', icon: 'bi-clipboard2-check', roles: ['Admin'] },
            { title: 'Fee Report', path: '/fee-report', icon: 'bi-file-earmark-spreadsheet', roles: ['Admin'] },
            { title: 'Result Report', path: '/result-report', icon: 'bi-file-earmark-medical', roles: ['Admin'] },
        ],
    },
    {
        title: 'Settings',
        icon: 'bi-gear',
        items: [
            { title: 'School Settings', path: '/school-settings', icon: 'bi-sliders', roles: ['Admin'] },
        ],
    },
];

export const teacherPageGroups = [
    {
        title: 'Teacher Self-Service',
        icon: 'bi-person-workspace',
        items: [
            { title: 'My Schedule', path: '/my-teacher/assignments', icon: 'bi-calendar-check', roles: ['Teacher'] },
            { title: 'My Students', path: '/my-teacher/students', icon: 'bi-people', roles: ['Teacher'] },
            { title: 'Mark Attendance', path: '/my-teacher/attendance', icon: 'bi-clipboard-check', roles: ['Teacher'] },
        ],
    },
    {
        title: 'Academics & Exams',
        icon: 'bi-award',
        items: [
            { title: 'Results Management', path: '/results', icon: 'bi-award', roles: ['Teacher'] },
            { title: 'Exams', path: '/exams', icon: 'bi-journal-text', roles: ['Teacher'] },
            { title: 'Timetable', path: '/timetable', icon: 'bi-table', roles: ['Teacher'] },
        ],
    },
    {
        title: 'Communication',
        icon: 'bi-megaphone',
        items: [
            { title: 'Notices', path: '/notices', icon: 'bi-bell', roles: ['Teacher'] },
            { title: 'Events', path: '/events', icon: 'bi-calendar-event', roles: ['Teacher'] },
        ],
    },
];

export const studentPageGroups = [
    {
        title: 'Student Portal',
        icon: 'bi-mortarboard',
        items: [
            { title: 'My Profile', path: '/my-profile/student', icon: 'bi-person-circle', roles: ['Student'] },
            { title: 'My Attendance', path: '/my-student/attendance', icon: 'bi-calendar2-check', roles: ['Student'] },
            { title: 'My Results', path: '/my-student/results', icon: 'bi-award', roles: ['Student'] },
            { title: 'My Fees & Receipts', path: '/my-student/fees', icon: 'bi-credit-card', roles: ['Student'] },
            { title: 'Timetable', path: '/timetable', icon: 'bi-table', roles: ['Student'] },
            { title: 'Exams', path: '/exams', icon: 'bi-journal-text', roles: ['Student'] },
            { title: 'Notices', path: '/notices', icon: 'bi-bell', roles: ['Student'] },
            { title: 'Events', path: '/events', icon: 'bi-calendar-event', roles: ['Student'] },
        ],
    },
];

export const parentPageGroups = [
    {
        title: 'Parent Portal',
        icon: 'bi-people-fill',
        items: [
            { title: 'My Children', path: '/my-parent/children', icon: 'bi-person-vcard', roles: ['Parent'] },
            { title: 'Timetable', path: '/timetable', icon: 'bi-table', roles: ['Parent'] },
            { title: 'Exams', path: '/exams', icon: 'bi-journal-text', roles: ['Parent'] },
            { title: 'Notices', path: '/notices', icon: 'bi-bell', roles: ['Parent'] },
            { title: 'Events', path: '/events', icon: 'bi-calendar-event', roles: ['Parent'] },
        ],
    },
];

export const adminPages = adminPageGroups.flatMap((group) => group.items);