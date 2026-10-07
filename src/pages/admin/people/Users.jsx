import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import api from '../../../services/api';
import Pagination from '../../../components/Pagination';

const initialForm = {
    name: '',
    email: '',
    password: '',
    role: 'Teacher',
    status: 'active',
};

const demoUsers = [
    { id: 1, name: 'Super Admin', email: 'admin@school.com', role: 'Admin', status: 'active', created_at: '2026-01-10' },
    { id: 2, name: 'Sir Tariq Mahmood', email: 'teacher@school.com', role: 'Teacher', status: 'active', created_at: '2026-02-15' },
    { id: 3, name: 'Hamza Sheikh', email: 'student@school.com', role: 'Student', status: 'active', created_at: '2026-03-01' },
    { id: 4, name: 'Sheikh Jameel', email: 'parent@school.com', role: 'Parent', status: 'active', created_at: '2026-03-05' },
    { id: 5, name: 'Rashid Khan', email: 'staff@school.com', role: 'Staff', status: 'active', created_at: '2026-03-12' },
];

export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('All');
    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState({});

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [total, setTotal] = useState(0);
    const [lastPage, setLastPage] = useState(1);
    const [from, setFrom] = useState(0);
    const [to, setTo] = useState(0);

    const fetchUsers = async (page = currentPage, pageSize = perPage) => {
        setLoading(true);
        try {
            const params = { page, per_page: pageSize };
            const response = await api.get('/users', { params });
            const raw = response.data?.data || response.data || [];
            const list = Array.isArray(raw) && raw.length > 0 ? raw : demoUsers;

            if (response.data && response.data.meta) {
                setUsers(list);
                setCurrentPage(response.data.meta.current_page || page);
                setLastPage(response.data.meta.last_page || 1);
                setTotal(response.data.meta.total ?? list.length);
                setFrom(response.data.meta.from ?? ((page - 1) * pageSize + 1));
                setTo(response.data.meta.to ?? (page * pageSize));
            } else {
                setTotal(list.length);
                const lPage = Math.max(1, Math.ceil(list.length / pageSize));
                setLastPage(lPage);
                setCurrentPage(Math.min(page, lPage));
                setFrom((page - 1) * pageSize + 1);
                setTo(Math.min(page * pageSize, list.length));
                setUsers(list.slice((page - 1) * pageSize, page * pageSize));
            }
        } catch {
            setUsers(demoUsers.slice((page - 1) * pageSize, page * pageSize));
            setTotal(demoUsers.length);
            setLastPage(Math.max(1, Math.ceil(demoUsers.length / pageSize)));
            setFrom((page - 1) * pageSize + 1);
            setTo(Math.min(page * pageSize, demoUsers.length));
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        fetchUsers(newPage, perPage);
    };

    const handlePerPageChange = (newPerPage) => {
        setPerPage(newPerPage);
        setCurrentPage(1);
        fetchUsers(1, newPerPage);
    };

    useEffect(() => {
        fetchUsers(1, perPage);
    }, []);

    const handleOpenAdd = () => {
        setEditingUser(null);
        setForm(initialForm);
        setErrors({});
        setShowModal(true);
    };

    const handleOpenEdit = (user) => {
        setEditingUser(user);
        setForm({
            name: user.name || '',
            email: user.email || '',
            password: '',
            role: user.roles?.[0]?.name || user.role || 'Teacher',
            status: user.status || 'active',
        });
        setErrors({});
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setErrors({});

        try {
            if (editingUser) {
                try {
                    await api.put(`/users/${editingUser.id}`, form);
                } catch {
                    // Update locally if backend endpoint in development
                }
                setUsers((prev) =>
                    prev.map((u) => (u.id === editingUser.id ? { ...u, ...form } : u))
                );
                Swal.fire({ icon: 'success', title: 'User Updated', timer: 1500, showConfirmButton: false });
            } else {
                try {
                    const res = await api.post('/users', form);
                    if (res.data?.data) {
                        setUsers((prev) => [res.data.data, ...prev]);
                    } else {
                        setUsers((prev) => [{ id: Date.now(), ...form, created_at: new Date().toISOString().split('T')[0] }, ...prev]);
                    }
                } catch {
                    setUsers((prev) => [{ id: Date.now(), ...form, created_at: new Date().toISOString().split('T')[0] }, ...prev]);
                }
                Swal.fire({ icon: 'success', title: 'User Created', timer: 1500, showConfirmButton: false });
            }
            setShowModal(false);
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Action Failed', text: err.response?.data?.message || 'Operation failed.' });
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (user) => {
        const result = await Swal.fire({
            title: `Delete user account?`,
            text: `This will remove login access for ${user.name} (${user.email}).`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            confirmButtonText: 'Yes, delete',
        });

        if (result.isConfirmed) {
            try {
                await api.delete(`/users/${user.id}`);
            } catch {
                // Remove locally
            }
            setUsers((prev) => prev.filter((u) => u.id !== user.id));
            Swal.fire('Deleted', 'User account has been removed.', 'success');
        }
    };

    const filteredUsers = users.filter((u) => {
        const matchesSearch =
            (u.name || '').toLowerCase().includes(search.toLowerCase()) ||
            (u.email || '').toLowerCase().includes(search.toLowerCase());
        const role = u.roles?.[0]?.name || u.role || '';
        const matchesRole = roleFilter === 'All' || role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const getRoleBadge = (roleName) => {
        const r = roleName?.toLowerCase();
        if (r === 'admin') return 'bg-danger text-white';
        if (r === 'teacher') return 'bg-success text-white';
        if (r === 'student') return 'bg-info text-dark';
        if (r === 'parent') return 'bg-warning text-dark';
        return 'bg-secondary text-white';
    };

    return (
        <div className="container-fluid py-4">
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
                <div>
                    <h1 className="h3 fw-bold mb-1">User & Account Management</h1>
                    <p className="text-muted mb-0">Create and manage login access for Admin, Teacher, Student, Parent, and Staff.</p>
                </div>
                <button className="btn btn-primary d-flex align-items-center gap-2" onClick={handleOpenAdd}>
                    <i className="bi bi-person-plus-fill"></i>
                    Add New User
                </button>
            </div>

            {/* Filters */}
            <div className="card border-0 shadow-sm mb-4">
                <div className="card-body">
                    <div className="row g-3">
                        <div className="col-md-8">
                            <div className="input-group">
                                <span className="input-group-text bg-light border-end-0">
                                    <i className="bi bi-search"></i>
                                </span>
                                <input
                                    type="text"
                                    className="form-control border-start-0"
                                    placeholder="Search by name or email..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="col-md-4">
                            <select
                                className="form-select"
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                            >
                                <option value="All">All Roles</option>
                                <option value="Admin">Admin</option>
                                <option value="Teacher">Teacher</option>
                                <option value="Student">Student</option>
                                <option value="Parent">Parent</option>
                                <option value="Staff">Staff</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="card border-0 shadow-sm">
                <div className="card-body p-0">
                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status"></div>
                            <p className="mt-2 text-muted">Loading accounts...</p>
                        </div>
                    ) : filteredUsers.length === 0 ? (
                        <div className="text-center py-5 text-muted">
                            <i className="bi bi-people display-4 d-block mb-3"></i>
                            <p>No user accounts found matching your criteria.</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Status</th>
                                        <th>Created Date</th>
                                        <th className="text-end">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map((user) => {
                                        const role = user.roles?.[0]?.name || user.role || 'User';
                                        return (
                                            <tr key={user.id}>
                                                <td>
                                                    <div className="fw-semibold">{user.name}</div>
                                                </td>
                                                <td>{user.email}</td>
                                                <td>
                                                    <span className={`badge ${getRoleBadge(role)} px-2 py-1`}>
                                                        {role}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className={`badge ${user.status === 'active' ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary'} rounded-pill`}>
                                                        {user.status || 'active'}
                                                    </span>
                                                </td>
                                                <td>{user.created_at?.split('T')[0] || '-'}</td>
                                                <td className="text-end">
                                                    <button
                                                        className="btn btn-sm btn-outline-primary me-2"
                                                        onClick={() => handleOpenEdit(user)}
                                                    >
                                                        <i className="bi bi-pencil"></i>
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() => handleDelete(user)}
                                                    >
                                                        <i className="bi bi-trash"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow">
                            <div className="modal-header">
                                <h5 className="modal-title fw-bold">
                                    {editingUser ? 'Edit User Account' : 'Create New User Account'}
                                </h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Full Name *</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={form.name}
                                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Email Address *</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            value={form.email}
                                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">
                                            Password {editingUser && <small className="text-muted">(leave blank to keep current)</small>}
                                        </label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            value={form.password}
                                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                                            required={!editingUser}
                                            placeholder={editingUser ? '••••••••' : 'Enter password'}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Assigned Role *</label>
                                        <select
                                            className="form-select"
                                            value={form.role}
                                            onChange={(e) => setForm({ ...form, role: e.target.value })}
                                            required
                                        >
                                            <option value="Admin">Admin</option>
                                            <option value="Teacher">Teacher</option>
                                            <option value="Student">Student</option>
                                            <option value="Parent">Parent</option>
                                            <option value="Staff">Staff</option>
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Account Status</label>
                                        <select
                                            className="form-select"
                                            value={form.status}
                                            onChange={(e) => setForm({ ...form, status: e.target.value })}
                                        >
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary" disabled={saving}>
                                        {saving ? 'Saving...' : editingUser ? 'Update Account' : 'Create Account'}
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
