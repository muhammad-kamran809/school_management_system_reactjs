export const adminPageGroups = [
    {
        title: 'Academic',
        icon: 'bi-mortarboard',
        items: [
            { title: 'Academic Years', path: '/academic-years', icon: 'bi-calendar3' },
            { title: 'Classes', path: '/classes', icon: 'bi-building' },
            { title: 'Sections', path: '/sections', icon: 'bi-grid-3x3-gap' },
            { title: 'Subjects', path: '/subjects', icon: 'bi-book' },
        ],
    },
    {
        title: 'People',
        icon: 'bi-people',
        items: [
            { title: 'Students', path: '/students', icon: 'bi-person-vcard' },
            { title: 'Teachers', path: '/teachers', icon: 'bi-person-workspace' },
            { title: 'Staff', path: '/staff', icon: 'bi-person-badge' },
        ],
    },
    {
        title: 'Academic Management',
        icon: 'bi-kanban',
        items: [
            { title: 'Enrollments', path: '/enrollments', icon: 'bi-person-plus' },
            { title: 'Teacher Assignments', path: '/teacher-assignments', icon: 'bi-person-check' },
            { title: 'Timetable', path: '/timetable', icon: 'bi-table' },
        ],
    },
    {
        title: 'Attendance',
        icon: 'bi-calendar2-check',
        items: [
            { title: 'Student Attendance', path: '/student-attendance', icon: 'bi-person-check' },
            { title: 'Teacher Attendance', path: '/teacher-attendance', icon: 'bi-person-check-fill' },
        ],
    },
    {
        title: 'Exams',
        icon: 'bi-journal-check',
        items: [
            { title: 'Exams', path: '/exams', icon: 'bi-journal-text' },
            { title: 'Results', path: '/results', icon: 'bi-award' },
        ],
    },
    {
        title: 'Finance',
        icon: 'bi-wallet2',
        items: [
            { title: 'Fees', path: '/fees', icon: 'bi-receipt' },
            { title: 'Payments', path: '/payments', icon: 'bi-credit-card' },
            { title: 'Fee Reports', path: '/fee-reports', icon: 'bi-bar-chart-line' },
        ],
    },
    {
        title: 'Communication',
        icon: 'bi-megaphone',
        items: [
            { title: 'Notices', path: '/notices', icon: 'bi-bell' },
            { title: 'Events', path: '/events', icon: 'bi-calendar-event' },
        ],
    },
    {
        title: 'Reports',
        icon: 'bi-file-earmark-bar-graph',
        items: [
            { title: 'Student Report', path: '/student-report', icon: 'bi-file-earmark-person' },
            { title: 'Attendance Report', path: '/attendance-report', icon: 'bi-clipboard2-check' },
            { title: 'Fee Report', path: '/fee-report', icon: 'bi-file-earmark-spreadsheet' },
            { title: 'Result Report', path: '/result-report', icon: 'bi-file-earmark-medical' },
        ],
    },
    {
        title: 'Settings',
        icon: 'bi-gear',
        items: [
            { title: 'School Settings', path: '/school-settings', icon: 'bi-sliders' },
        ],
    },
];

export const adminPages = adminPageGroups.flatMap((group) => group.items);