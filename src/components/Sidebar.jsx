import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { adminPageGroups } from '../routes/adminPages';

function Sidebar() {
    const location = useLocation();
    const [openGroups, setOpenGroups] = useState(() => (
        adminPageGroups
            .filter((group) => group.items.some((item) => item.path === location.pathname))
            .map((group) => group.title)
    ));

    const toggleGroup = (groupTitle) => {
        setOpenGroups((groups) => (
            groups.includes(groupTitle)
                ? groups.filter((title) => title !== groupTitle)
                : [...groups, groupTitle]
        ));
    };

    return (
        <aside
            className="app-sidebar text-white p-3"
            style={{
                width: '248px',
            }}
        >
            <div className="brand-lockup">
                <div className="brand-mark"><i className="bi bi-mortarboard-fill"></i></div>
                <div>
                    <strong>Campus</strong>
                    <span>Admin portal</span>
                </div>
            </div>

            <div className="sidebar-label">Workspace</div>

            <ul className="nav nav-pills flex-column gap-3">
                <li className="nav-item">
                    <NavLink
                        to="/dashboard"
                        end
                        className={({ isActive }) =>
                            `nav-link text-white sidebar-link ${isActive ? 'active' : ''}`
                        }
                    >
                        <i className="bi bi-speedometer2 me-2"></i>
                        Dashboard
                    </NavLink>
                </li>

                {adminPageGroups.map((group) => (
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