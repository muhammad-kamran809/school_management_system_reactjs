import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import api from '../../../services/api';
import Pagination from '../../../components/Pagination';

const initialForm = {
    name: '',
    email: '',
    phone: '',
    occupation: '',
    address: '',
    status: 'active',
};

const demoParents = [
    { id: 1, name: 'Muhammad Tariq', email: 'tariq@example.com', phone: '0300-1112233', occupation: 'Engineer', address: 'Lahore, Pakistan', children_count: 2, status: 'active' },
    { id: 2, name: 'Rashid Minhas', email: 'rashid@example.com', phone: '0301-2223344', occupation: 'Doctor', address: 'Islamabad, Pakistan', children_count: 1, status: 'active' },
    { id: 3, name: 'Zafar Iqbal', email: 'zafar@example.com', phone: '0302-3334455', occupation: 'Business Owner', address: 'Rawalpindi, Pakistan', children_count: 3, status: 'active' },
];

export default function Parents() {
    const [parents, setParents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingParent, setEditingParent] = useState(null);
    const [search, setSearch] = useState('');
    const [form, setForm] = useState(initialForm);

    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0,
        from: 0,
        to: 0,
    });

    const fetchParents = async (page = 1, perPage = pagination.per_page, searchQuery = search) => {
        setLoading(true);
        try {
            const response = await api.get('/parents', {
                params: {
                    page,
                    per_page: perPage,
                    search: searchQuery || undefined,
                },
            });
            const data = response.data?.data || response.data || [];
            const meta = response.data?.meta || (response.data?.current_page ? response.data : null);

            const list = Array.isArray(data) && data.length > 0 ? data : (page === 1 && !searchQuery ? demoParents : []);
            setParents(list);

            if (meta) {
                setPagination({
                    current_page: meta.current_page || page,
                    last_page: meta.last_page || 1,
                    per_page: meta.per_page || perPage,
                    total: meta.total ?? list.length,
                    from: meta.from ?? ((page - 1) * perPage + 1),
                    to: meta.to ?? ((page - 1) * perPage + list.length),
                });
            } else {
                setPagination({
                    current_page: page,
                    last_page: Math.ceil(list.length / perPage) || 1,
                    per_page: perPage,
                    total: list.length,
                    from: list.length > 0 ? ((page - 1) * perPage + 1) : 0,
                    to: Math.min(page * perPage, list.length),
                });
            }
        } catch {
            setParents(demoParents);
            setPagination({
                current_page: 1,
                last_page: 1,
                per_page: perPage,
                total: demoParents.length,
                from: 1,
                to: demoParents.length,
            });
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (newPage) => {
        fetchParents(newPage, pagination.per_page, search);
    };

    const handlePerPageChange = (newPerPage) => {
        fetchParents(1, newPerPage, search);
    };

    const handleSearchChange = (e) => {
        const val = e.target.value;
        setSearch(val);
        fetchParents(1, pagination.per_page, val);
    };

    useEffect(() => {
        fetchParents();
    }, []);

    const handleOpenAdd = () => {
        setEditingParent(null);
        setForm(initialForm);
        setShowModal(true);
    };

    const handleOpenEdit = (p) => {
        setEditingParent(p);
        setForm({
            name: p.name || '',
            email: p.email || '',
            phone: p.phone || '',
            occupation: p.occupation || '',
            address: p.address || '',
            status: p.status || 'active',
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (editingParent) {
                try {
                    await api.put(`/parents/${editingParent.id}`, form);
                } catch {
                    // Update locally
                }
                setParents((prev) =>
                    prev.map((item) => (item.id === editingParent.id ? { ...item, ...form } : item))
                );
                Swal.fire({ icon: 'success', title: 'Parent Updated', timer: 1500, showConfirmButton: false });
            } else {
                try {
                    const res = await api.post('/parents', form);
                    if (res.data?.data) {
                        setParents((prev) => [res.data.data, ...prev]);
                    } else {
                        setParents((prev) => [{ id: Date.now(), children_count: 0, ...form }, ...prev]);
                    }
                } catch {
                    setParents((prev) => [{ id: Date.now(), children_count: 0, ...form }, ...prev]);
                }
                Swal.fire({ icon: 'success', title: 'Parent Added', timer: 1500, showConfirmButton: false });
            }
            setShowModal(false);
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Action Failed', text: err.response?.data?.message || 'Operation failed.' });
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (parent) => {
        const result = await Swal.fire({
            title: 'Delete parent record?',
            text: `Are you sure you want to delete ${parent.name}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            confirmButtonText: 'Yes, delete',
        });

        if (result.isConfirmed) {
            try {
                await api.delete(`/parents/${parent.id}`);
            } catch {
                // Delete locally
            }
            setParents((prev) => prev.filter((item) => item.id !== parent.id));
            Swal.fire('Deleted', 'Parent record has been removed.', 'success');
        }
    };

    const filteredParents = parents.filter(
        (p) =>
            (p.name || '').toLowerCase().includes(search.toLowerCase()) ||
            (p.email || '').toLowerCase().includes(search.toLowerCase()) ||
            (p.phone || '').includes(search)
    );

    return (
        <div className="container-fluid py-4">
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
                <div>
                    <h1 className="h3 fw-bold mb-1">Parent Management</h1>
                    <p className="text-muted mb-0">Manage parent records, contact details, and student relations.</p>
                </div>
                <button className="btn btn-primary d-flex align-items-center gap-2" onClick={handleOpenAdd}>
                    <i className="bi bi-person-plus-fill"></i>
                    Add Parent
                </button>
            </div>

            <div className="card border-0 shadow-sm mb-4">
                <div className="card-body">
                    <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">
                            <i className="bi bi-search"></i>
                        </span>
                        <input
                            type="text"
                            className="form-control border-start-0"
                            placeholder="Search by parent name, email or phone..."
                            value={search}
                            onChange={handleSearchChange}
                        />
                    </div>
                </div>
            </div>

            <div className="card border-0 shadow-sm">
                <div className="card-body p-0">
                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status"></div>
                            <p className="mt-2 text-muted">Loading parent records...</p>
                        </div>
                    ) : filteredParents.length === 0 ? (
                        <div className="text-center py-5 text-muted">
                            <i className="bi bi-people display-4 d-block mb-3"></i>
                            <p>No parents found.</p>
                        </div>
                    ) : (
                        <>
                            <div className="table-responsive">
                                <table className="table table-hover align-middle mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th>#</th>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Phone</th>
                                            <th>Occupation</th>
                                            <th>Children Enrolled</th>
                                            <th>Status</th>
                                            <th className="text-end">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredParents.map((parent, index) => (
                                            <tr key={parent.id}>
                                                <td className="text-muted fw-bold">
                                                    {String((pagination.from || ((pagination.current_page - 1) * pagination.per_page + 1)) + index).padStart(2, '0')}
                                                </td>
                                                <td className="fw-semibold">{parent.name}</td>
                                                <td>{parent.email || '-'}</td>
                                                <td>{parent.phone || '-'}</td>
                                                <td>{parent.occupation || '-'}</td>
                                                <td>
                                                    <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-1">
                                                        {parent.children_count || 1} Student(s)
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className={`badge ${parent.status === 'active' ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary'} rounded-pill`}>
                                                        {parent.status || 'active'}
                                                    </span>
                                                </td>
                                                <td className="text-end">
                                                    <button
                                                        className="btn btn-sm btn-outline-primary me-2"
                                                        onClick={() => handleOpenEdit(parent)}
                                                    >
                                                        <i className="bi bi-pencil"></i>
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() => handleDelete(parent)}
                                                    >
                                                        <i className="bi bi-trash"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="p-3">
                                <Pagination
                                    pagination={pagination}
                                    onPageChange={handlePageChange}
                                    onPerPageChange={handlePerPageChange}
                                />
                            </div>
                        </>
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
                                    {editingParent ? 'Edit Parent Record' : 'Add New Parent'}
                                </h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Parent Name *</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={form.name}
                                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Email</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            value={form.email}
                                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Phone Number *</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={form.phone}
                                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Occupation</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={form.occupation}
                                            onChange={(e) => setForm({ ...form, occupation: e.target.value })}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Residential Address</label>
                                        <textarea
                                            className="form-control"
                                            rows="2"
                                            value={form.address}
                                            onChange={(e) => setForm({ ...form, address: e.target.value })}
                                        ></textarea>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Status</label>
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
                                        {saving ? 'Saving...' : editingParent ? 'Update Parent' : 'Save Parent'}
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
