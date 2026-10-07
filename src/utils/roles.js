export const ROLES = {
    ADMIN: 'Admin',
    TEACHER: 'Teacher',
    PARENT: 'Parent',
    STUDENT: 'Student',
    STAFF: 'Staff',
};

export const normalizeRole = (role) => {
    if (!role) return '';
    let rawStr = role;
    if (typeof role === 'object' && role !== null) {
        rawStr = role.name || role.title || role.role || '';
    }
    const str = String(rawStr).trim().toLowerCase();
    if (str === 'admin' || str === 'super_admin' || str === 'administrator' || str === 'superadmin') return ROLES.ADMIN;
    if (str === 'teacher') return ROLES.TEACHER;
    if (str === 'parent' || str === 'guardian') return ROLES.PARENT;
    if (str === 'student') return ROLES.STUDENT;
    if (str === 'staff' || str === 'employee') return ROLES.STAFF;
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const getUserRoles = (user) => {
    if (!user) return [];

    let targetUser = user;
    if (targetUser.data && typeof targetUser.data === 'object' && !targetUser.roles && !targetUser.role && !targetUser.student) {
        targetUser = targetUser.data;
    } else if (targetUser.user && typeof targetUser.user === 'object' && !targetUser.roles && !targetUser.role) {
        targetUser = targetUser.user;
    }

    let roles = [];

    if (Array.isArray(targetUser.roles) && targetUser.roles.length > 0) {
        roles = targetUser.roles.map((r) => (typeof r === 'object' && r !== null ? (r.name || r.role || '') : r));
    } else if (typeof targetUser.roles === 'string') {
        roles = targetUser.roles.split(',').map((s) => s.trim());
    } else if (targetUser.role) {
        roles = [typeof targetUser.role === 'object' && targetUser.role !== null ? (targetUser.role.name || targetUser.role.role) : targetUser.role];
    } else if (targetUser.user_type) {
        roles = [targetUser.user_type];
    } else if (targetUser.type) {
        roles = [targetUser.type];
    }

    // Check relationship links provided by Laravel Eloquent
    if (targetUser.student || targetUser.student_id || targetUser.is_student) {
        roles.push(ROLES.STUDENT);
    }
    if (targetUser.teacher || targetUser.teacher_id || targetUser.is_teacher) {
        roles.push(ROLES.TEACHER);
    }
    if (targetUser.studentParent || targetUser.student_parent || targetUser.parent || targetUser.is_parent) {
        roles.push(ROLES.PARENT);
    }
    if (targetUser.staff || targetUser.staff_id || targetUser.is_staff) {
        roles.push(ROLES.STAFF);
    }
    if (targetUser.is_admin || targetUser.isAdmin) {
        roles.push(ROLES.ADMIN);
    }

    const normalized = Array.from(new Set(roles.filter(Boolean).map(normalizeRole).filter(Boolean)));

    // Fallback checks using email when roles are not explicitly attached
    if (normalized.length === 0) {
        const emailLower = String(targetUser.email || '').toLowerCase();
        if (emailLower.includes('student@') || emailLower === 'student@school.com') {
            return [ROLES.STUDENT];
        }
        if (emailLower.includes('teacher@') || emailLower === 'teacher@school.com') {
            return [ROLES.TEACHER];
        }
        if (emailLower.includes('parent@') || emailLower === 'parent@school.com') {
            return [ROLES.PARENT];
        }
        if (emailLower.includes('staff@') || emailLower === 'staff@school.com') {
            return [ROLES.STAFF];
        }
        if (emailLower.includes('admin@') || emailLower === 'admin@school.com') {
            return [ROLES.ADMIN];
        }
    }

    return normalized;
};

export const hasRole = (user, role) => {
    const roles = getUserRoles(user);
    const target = normalizeRole(role);
    return roles.includes(target);
};

export const hasAnyRole = (user, roles) => {
    if (!roles || roles.length === 0) return true;
    const userRoles = getUserRoles(user);
    if (userRoles.includes(ROLES.ADMIN)) return true; // Admin has access to all
    const normalizedTargets = roles.map(normalizeRole);
    return normalizedTargets.some((r) => userRoles.includes(r));
};

export const isAdmin = (user) => hasRole(user, ROLES.ADMIN);
export const isTeacher = (user) => hasRole(user, ROLES.TEACHER);
export const isParent = (user) => hasRole(user, ROLES.PARENT);
export const isStudent = (user) => hasRole(user, ROLES.STUDENT);
export const isStaff = (user) => hasRole(user, ROLES.STAFF);

export const getPrimaryRole = (user) => {
    const roles = getUserRoles(user);
    // Specific self-service portal roles take clear precedence
    if (roles.includes(ROLES.STUDENT)) return ROLES.STUDENT;
    if (roles.includes(ROLES.TEACHER)) return ROLES.TEACHER;
    if (roles.includes(ROLES.PARENT)) return ROLES.PARENT;
    if (roles.includes(ROLES.STAFF)) return ROLES.STAFF;
    if (roles.includes(ROLES.ADMIN)) return ROLES.ADMIN;
    return roles[0] || ROLES.ADMIN;
};

export const getDashboardRoute = (user) => {
    const role = getPrimaryRole(user);
    switch (role) {
        case ROLES.TEACHER:
            return '/teacher/dashboard';
        case ROLES.PARENT:
            return '/parent/dashboard';
        case ROLES.STUDENT:
            return '/student/dashboard';
        case ROLES.STAFF:
        case ROLES.ADMIN:
        default:
            return '/dashboard';
    }
};

