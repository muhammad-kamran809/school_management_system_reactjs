export const ROLES = {
    ADMIN: 'Admin',
    TEACHER: 'Teacher',
    PARENT: 'Parent',
    STUDENT: 'Student',
    STAFF: 'Staff',
};

export const getUserRoles = (user) => {
    if (!user) return [];
    if (Array.isArray(user.roles)) {
        return user.roles.map((r) => r.name || r);
    }
    if (user.role) {
        return [user.role];
    }
    return [];
};

export const hasRole = (user, role) => {
    const roles = getUserRoles(user);
    return roles.includes(role);
};

export const hasAnyRole = (user, roles) => {
    const userRoles = getUserRoles(user);
    return roles.some((r) => userRoles.includes(r));
};

export const isAdmin = (user) => hasRole(user, ROLES.ADMIN);
export const isTeacher = (user) => hasRole(user, ROLES.TEACHER);
export const isParent = (user) => hasRole(user, ROLES.PARENT);
export const isStudent = (user) => hasRole(user, ROLES.STUDENT);
export const isStaff = (user) => hasRole(user, ROLES.STAFF);

export const getPrimaryRole = (user) => {
    const roles = getUserRoles(user);
    if (roles.includes(ROLES.ADMIN)) return ROLES.ADMIN;
    if (roles.includes(ROLES.TEACHER)) return ROLES.TEACHER;
    if (roles.includes(ROLES.PARENT)) return ROLES.PARENT;
    if (roles.includes(ROLES.STUDENT)) return ROLES.STUDENT;
    if (roles.includes(ROLES.STAFF)) return ROLES.STAFF;
    return null;
};

export const getDashboardRoute = (user) => {
    const role = getPrimaryRole(user);
    switch (role) {
        case ROLES.ADMIN:
        case ROLES.STAFF:
            return '/dashboard';
        case ROLES.TEACHER:
            return '/teacher/dashboard';
        case ROLES.PARENT:
            return '/parent/dashboard';
        case ROLES.STUDENT:
            return '/student/dashboard';
        default:
            return '/dashboard';
    }
};
