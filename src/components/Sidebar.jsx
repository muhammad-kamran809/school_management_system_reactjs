import { useState, useMemo, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { adminPageGroups, teacherPageGroups, studentPageGroups, parentPageGroups } from '../routes/adminPages';
import { useAuth } from '../context/AuthContext';
import { getUserRoles, ROLES, getDashboardRoute, normalizeRole } from '../utils/roles';

function Sidebar() {
    const location = useLocation();
    const { user } = useAuth();
    const userRoles = getUserRoles(user);

    const isTeacher = userRoles.includes(ROLES.TEACHER);
    const isStudent = userRoles.includes(ROLES.STUDENT);
    const isParent = userRoles.includes(ROLES.PARENT);
    const isStaff = userRoles.includes(ROLES.STAFF);
    const isAdminUser = !isStudent && !isTeacher && !isParent && (userRoles.includes(ROLES.ADMIN) || !isStaff);

    const activeGroups = useMemo(() => {
        if (isStudent) return studentPageGroups;
        if (isTeacher) return teacherPageGroups;
        if (isParent) return parentPageGroups;

        if (isAdminUser) {
            return adminPageGroups;
        }

        if (isStaff) {
            return adminPageGroups
                .map((group) => {
                    const filteredItems = group.items.filter((item) => {
                        if (!item.roles || item.roles.length === 0) return true;
                        return item.roles.some((r) => normalizeRole(r) === ROLES.STAFF);
                    });
                    return { ...group, items: filteredItems };
                })
                .filter((group) => group.items.length > 0);
        }

        return adminPageGroups;
    }, [isAdminUser, isTeacher, isStudent, isParent, isStaff]);

    // Open all groups by default so all pages are immediately visible
    const [openGroups, setOpenGroups] = useState(() =>
        activeGroups.map((group) => group.title)
    );

    // Keep all groups open whenever activeGroups updates
    useEffect(() => {
        setOpenGroups(activeGroups.map((group) => group.title));
    }, [activeGroups]);

    const toggleGroup = (groupTitle) => {
        setOpenGroups((groups) => (
            groups.includes(groupTitle)
                ? groups.filter((title) => title !== groupTitle)
                : [...groups, groupTitle]
        ));
    };

    const dashboardPath = getDashboardRoute(user);
    const portalTitle = isStudent
        ? 'Student portal'
        : isTeacher
        ? 'Teacher portal'
        : isParent
        ? 'Parent portal'
        : isStaff
        ? 'Staff portal'
        : 'Admin portal';

    return (
        <aside
            className="app-sidebar text-white p-3"
            style={{
                width: '248px',
                overflowY: 'auto',
                maxHeight: '100vh',
            }}
        >
            <div className="brand-lockup">
                <div className="brand-mark"><i className="bi bi-mortarboard-fill"></i></div>
                <div>
                    <strong>Campus</strong>
                    <span>{portalTitle}</span>
                </div>
            </div>

            <div className="sidebar-label">Workspace</div>

            <ul className="nav nav-pills flex-column gap-3">
                <li className="nav-item">
                    <NavLink
                        to={dashboardPath}
                        end
                        className={({ isActive }) =>
                            `nav-link text-white sidebar-link ${isActive ? 'active' : ''}`
                        }
                    >
                        <i className="bi bi-speedometer2 me-2"></i>
                        Dashboard
                    </NavLink>
                </li>

                {activeGroups.map((group) => (
                    <li className="nav-item" key={group.title}>
                        <button
                            type="button"
                            className="sidebar-group-title"
                            aria-expanded={openGroups.includes(group.title)}
                            onClick={() => toggleGroup(group.title)}
                        >
                            <i className={`bi ${group.icon}`}></i>
                            <span>{group.title}</span>
                            <i className={`bi bi-chevron-${openGroups.includes(group.title) ? 'up' : 'down'} sidebar-group-chevron`}></i>
                        </button>
                        {openGroups.includes(group.title) && (
                            <ul className="nav nav-pills flex-column gap-1">
                                {group.items.map((item) => (
                                    <li className="nav-item" key={item.path}>
                                        <NavLink
                                            to={item.path}
                                            className={({ isActive }) =>
                                                `nav-link text-white sidebar-link ${
                                                    isActive ? 'active' : ''
                                                }`
                                            }
                                        >
                                            <i className={`bi ${item.icon} me-2`}></i>
                                            {item.title}
                                        </NavLink>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>
        </aside>
    );
}

export default Sidebar;
