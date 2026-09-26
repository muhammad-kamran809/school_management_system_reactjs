
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

// API will be connected later by backend developer
// import api from '../../../services/api';

import { mockStorage } from '../../../services/mockData';

const Events = () => {
    const initialForm = {
        title: '',
        description: '',
        event_date: '',
        start_time: '',
        end_time: '',
        location: '',
        status: '',
    };

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState(initialForm);
    const [errors, setErrors] = useState({});

    // --------------------------------------------------
    // Demo data for testing
    // --------------------------------------------------
    const getDemoEvents = () => {
        return [
            {
                id: 'EVENT-001',
                title: 'Annual Sports Day',
                description:
                    'Annual sports day event for students with different indoor and outdoor activities.',
                event_date: '2026-10-10',
                start_time: '09:00',
                end_time: '14:00',
                location: 'School Sports Ground',
                status: 'Active',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            },
            {
                id: 'EVENT-002',
                title: 'Parent Teacher Meeting',
                description:
                    'Meeting between parents and teachers to discuss student academic progress and performance.',
                event_date: '2026-10-17',
                start_time: '10:00',
                end_time: '13:00',
                location: 'School Auditorium',
                status: 'Published',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            },
            {
                id: 'EVENT-003',
                title: 'Science Exhibition',
                description:
                    'Students will present science projects and practical demonstrations during the school science exhibition.',
                event_date: '2026-11-05',
                start_time: '09:30',
                end_time: '15:00',
                location: 'Science Block',
                status: 'Active',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            },
            {
                id: 'EVENT-004',
                title: 'Teachers Training Workshop',
                description:
                    'Professional development workshop for teachers covering modern teaching methods and classroom management.',
                event_date: '2026-11-15',
                start_time: '09:00',
                end_time: '12:30',
                location: 'Conference Hall',
                status: 'Draft',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            },
            {
                id: 'EVENT-005',
                title: 'Annual Cultural Day',
                description:
                    'Students will participate in cultural performances, speeches, presentations, and other activities.',
                event_date: '2026-12-05',
                start_time: '10:00',
                end_time: '16:00',
                location: 'Main School Hall',
                status: 'Active',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            },
        ];
    };

    useEffect(() => {
        loadEvents();
    }, []);

    // --------------------------------------------------
    // Load events
    // --------------------------------------------------
    const loadEvents = () => {
        try {
            setLoading(true);

            let data = [];

            if (
                mockStorage &&
                typeof mockStorage.getEvents === 'function'
            ) {
                data = mockStorage.getEvents() || [];
            }

            if (!data.length) {
                const storedEvents =
                    localStorage.getItem('sms_events');

                if (storedEvents) {
                    data = JSON.parse(storedEvents);
                }
            }

            // Add demo data only when no events exist
            if (!data.length) {
                data = getDemoEvents();

                localStorage.setItem(
                    'sms_events',
                    JSON.stringify(data)
                );
            }

            setEvents(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error loading events:', error);

            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to load events.',
            });
        } finally {
            setLoading(false);
        }
    };

    // --------------------------------------------------
    // Save events to localStorage
    // --------------------------------------------------
    const saveToLocalStorage = (data) => {
        localStorage.setItem(
            'sms_events',
            JSON.stringify(data)
        );
    };

    // --------------------------------------------------
    // Open add modal
    // --------------------------------------------------
    const openAddModal = () => {
        setEditingEvent(null);
        setFormData(initialForm);
        setErrors({});
        setShowModal(true);
    };

    // --------------------------------------------------
    // Open edit modal
    // --------------------------------------------------
    const openEditModal = (event) => {
        setEditingEvent(event);

        setFormData({
            title: event.title || '',
            description: event.description || '',
            event_date:
                event.event_date ||
                event.eventDate ||
                '',
            start_time:
                event.start_time ||
                event.startTime ||
                '',
            end_time:
                event.end_time ||
                event.endTime ||
                '',
            location: event.location || '',
            status: event.status || '',
        });

        setErrors({});
        setShowModal(true);
    };

    // --------------------------------------------------
    // Close modal
    // --------------------------------------------------
    const closeModal = () => {
        if (saving) return;

        setShowModal(false);
        setEditingEvent(null);
        setFormData(initialForm);
        setErrors({});
    };

    // --------------------------------------------------
    // Handle input changes
    // --------------------------------------------------
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: '',
            }));
        }
    };

    // --------------------------------------------------
    // Validate form
    // --------------------------------------------------
    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        }

        if (!formData.event_date) {
            newErrors.event_date =
                'Event Date is required';
        }

        if (
            formData.start_time &&
            formData.end_time &&
            formData.end_time <= formData.start_time
        ) {
            newErrors.end_time =
                'End Time must be after Start Time';
        }

        if (!formData.status) {
            newErrors.status = 'Status is required';
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    // --------------------------------------------------
    // Submit form
    // --------------------------------------------------
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setSaving(true);

            const now = new Date().toISOString();

            // ------------------------------------------
            // Update existing event
            // ------------------------------------------
            if (editingEvent) {
                const updatedEvent = {
                    ...editingEvent,
                    title: formData.title.trim(),
                    description:
                        formData.description.trim(),
                    event_date:
                        formData.event_date,
                    start_time:
                        formData.start_time,
                    end_time:
                        formData.end_time,
                    location:
                        formData.location.trim(),
                    status: formData.status,
                    updated_at: now,
                };

                let updatedEvents = events.map(
                    (event) =>
                        event.id === editingEvent.id
                            ? updatedEvent
                            : event
                );

                if (
                    mockStorage &&
                    typeof mockStorage.updateEvent ===
                        'function'
                ) {
                    mockStorage.updateEvent(
                        editingEvent.id,
                        updatedEvent
                    );

                    if (
                        typeof mockStorage.getEvents ===
                        'function'
                    ) {
                        updatedEvents =
                            mockStorage.getEvents() ||
                            updatedEvents;
                    }
                }

                setEvents(updatedEvents);
                saveToLocalStorage(updatedEvents);

                await Swal.fire({
                    icon: 'success',
                    title: 'Updated!',
                    text: 'Event updated successfully.',
                    timer: 1500,
                    showConfirmButton: false,
                });
            } else {
                // --------------------------------------
                // Add new event
                // --------------------------------------
                const newEvent = {
                    id: `EVENT-${Date.now()}`,
                    title: formData.title.trim(),
                    description:
                        formData.description.trim(),
                    event_date:
                        formData.event_date,
                    start_time:
                        formData.start_time,
                    end_time:
                        formData.end_time,
                    location:
                        formData.location.trim(),
                    status: formData.status,
                    created_at: now,
                    updated_at: now,
                };

                let updatedEvents = [
                    ...events,
                    newEvent,
                ];

                if (
                    mockStorage &&
                    typeof mockStorage.addEvent ===
                        'function'
                ) {
                    const addedEvent =
                        mockStorage.addEvent(
                            newEvent
                        );

                    if (addedEvent) {
                        updatedEvents = [
                            ...events,
                            addedEvent,
                        ];
                    } else if (
                        typeof mockStorage.getEvents ===
                        'function'
                    ) {
                        updatedEvents =
                            mockStorage.getEvents() ||
                            updatedEvents;
                    }
                }

                setEvents(updatedEvents);
                saveToLocalStorage(updatedEvents);

                await Swal.fire({
                    icon: 'success',
                    title: 'Added!',
                    text: 'Event added successfully.',
                    timer: 1500,
                    showConfirmButton: false,
                });
            }

            closeModal();
        } catch (error) {
            console.error(
                'Error saving event:',
                error
            );

            let message =
                'Failed to save event.';

            if (
                error?.response?.status === 422
            ) {
                message =
                    'Please check the entered information.';
            } else if (
                error?.response?.status === 401
            ) {
                message =
                    'You are not authorized to perform this action.';
            } else if (
                error?.response?.status === 403
            ) {
                message =
                    'You do not have permission to perform this action.';
            } else if (
                error?.response?.status === 404
            ) {
                message =
                    'Requested resource was not found.';
            } else if (
                error?.response?.status === 500
            ) {
                message =
                    'Server error occurred. Please try again later.';
            }

            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: message,
            });
        } finally {
            setSaving(false);
        }
    };

    // --------------------------------------------------
    // Delete event
    // --------------------------------------------------
    const handleDelete = async (event) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: `Delete "${event.title}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText:
                'Yes, delete it!',
            cancelButtonText: 'Cancel',
        });

        if (!result.isConfirmed) {
            return;
        }

        try {
            let updatedEvents =
                events.filter(
                    (item) =>
                        item.id !== event.id
                );

            if (
                mockStorage &&
                typeof mockStorage.deleteEvent ===
                    'function'
            ) {
                mockStorage.deleteEvent(
                    event.id
                );

                if (
                    typeof mockStorage.getEvents ===
                    'function'
                ) {
                    updatedEvents =
                        mockStorage.getEvents() ||
                        updatedEvents;
                }
            }

            setEvents(updatedEvents);
            saveToLocalStorage(updatedEvents);

            await Swal.fire({
                icon: 'success',
                title: 'Deleted!',
                text: 'Event deleted successfully.',
                timer: 1500,
                showConfirmButton: false,
            });
        } catch (error) {
            console.error(
                'Error deleting event:',
                error
            );

            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to delete event.',
            });
        }
    };

    // --------------------------------------------------
    // Search
    // --------------------------------------------------
    const filteredEvents = events.filter(
        (event) => {
            const search =
                searchTerm.toLowerCase();

            return (
                (event.title || '')
                    .toLowerCase()
                    .includes(search) ||
                (event.description || '')
                    .toLowerCase()
                    .includes(search) ||
                (event.location || '')
                    .toLowerCase()
                    .includes(search) ||
                (event.status || '')
                    .toLowerCase()
                    .includes(search)
            );
        }
    );

    // --------------------------------------------------
    // Format date
    // --------------------------------------------------
    const formatDate = (date) => {
        if (!date) return '-';

        const parsedDate = new Date(date);

        if (
            Number.isNaN(
                parsedDate.getTime()
            )
        ) {
            return date;
        }

        return parsedDate.toLocaleDateString();
    };

    // --------------------------------------------------
    // Format time
    // --------------------------------------------------
    const formatTime = (time) => {
        if (!time) return '-';

        const [hours, minutes] =
            time.split(':');

        if (
            hours === undefined ||
            minutes === undefined
        ) {
            return time;
        }

        const date = new Date();

        date.setHours(
            Number(hours),
            Number(minutes),
            0,
            0
        );

        return date.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="academic-years-page">
            {/* Header */}
            <div className="academic-years-header">
                <div className="hero-copy">
                    <div className="section-kicker">
                        Event Management
                    </div>

                    <h1>Events</h1>

                    <p>
                        Manage school events and
                        activities
                    </p>
                </div>

                <button
                    type="button"
                    className="btn btn-primary academic-years-add"
                    onClick={openAddModal}
                >
                    <i className="bi bi-plus-lg"></i>
                    Add Event
                </button>
            </div>

            {/* Main Panel */}
            <div className="dashboard-panel academic-years-panel">
                <div className="academic-years-panel-heading">
                    <div>
                        <h2>
                            Event records
                        </h2>

                        <span className="panel-count">
                            {filteredEvents.length}{' '}
                            events
                        </span>
                    </div>

                    <div className="student-search">
                        <i className="bi bi-search"></i>

                        <input
                            type="text"
                            placeholder="Search events..."
                            value={searchTerm}
                            onChange={(e) =>
                                setSearchTerm(
                                    e.target.value
                                )
                            }
                        />
                    </div>
                </div>

                {/* Loading */}
                {loading ? (
                    <div className="academic-years-empty">
                        <div className="spinner-border"></div>

                        <p>
                            Loading events...
                        </p>
                    </div>
                ) : filteredEvents.length ===
                  0 ? (
                    /* Empty */
                    <div className="academic-years-empty">
                        <i className="bi bi-calendar-event"></i>

                        <h3>
                            No events found
                        </h3>

                        <p>
                            Add an event to start
                            managing school
                            activities.
                        </p>
                    </div>
                ) : (
                    /* Table */
                    <div className="academic-years-table-wrap">
                        <table className="table academic-years-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>
                                        Title
                                    </th>
                                    <th>
                                        Description
                                    </th>
                                    <th>
                                        Event Date
                                    </th>
                                    <th>
                                        Start Time
                                    </th>
                                    <th>
                                        End Time
                                    </th>
                                    <th>
                                        Location
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
                                {filteredEvents.map(
                                    (
                                        event,
                                        index
                                    ) => (
                                        <tr
                                            key={
                                                event.id ||
                                                index
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
                                                        {(
                                                            event.title ||
                                                            'E'
                                                        )
                                                            .charAt(
                                                                0
                                                            )
                                                            .toUpperCase()}
                                                    </div>

                                                    <span>
                                                        {event.title ||
                                                            '-'}
                                                    </span>
                                                </div>
                                            </td>

                                            <td>
                                                {event.description ||
                                                    '-'}
                                            </td>

                                            <td>
                                                {formatDate(
                                                    event.event_date ||
                                                        event.eventDate
                                                )}
                                            </td>

                                            <td>
                                                {formatTime(
                                                    event.start_time ||
                                                        event.startTime
                                                )}
                                            </td>

                                            <td>
                                                {formatTime(
                                                    event.end_time ||
                                                        event.endTime
                                                )}
                                            </td>

                                            <td>
                                                {event.location ||
                                                    '-'}
                                            </td>

                                            <td>
                                                {event.status ||
                                                    '-'}
                                            </td>

                                            <td>
                                                <div className="academic-actions">
                                                    <button
                                                        type="button"
                                                        className="academic-action-button edit"
                                                        onClick={() =>
                                                            openEditModal(
                                                                event
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
                                                                event
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

            {/* Add / Edit Modal */}
            {showModal && (
                <div className="student-modal-overlay">
                    <div className="student-modal">
                        <div className="student-modal-header">
                            <div>
                                <h2>
                                    {editingEvent
                                        ? 'Edit Event'
                                        : 'Add Event'}
                                </h2>

                                <p>
                                    {editingEvent
                                        ? 'Update event information'
                                        : 'Add a new school event'}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={
                                    closeModal
                                }
                                disabled={saving}
                            >
                                <i className="bi bi-x-lg"></i>
                            </button>
                        </div>

                        <form
                            onSubmit={
                                handleSubmit
                            }
                        >
                            <div className="student-modal-body">
                                <div className="student-form-grid">
                                    {/* Title */}
                                    <div className="form-group">
                                        <label>
                                            Title *
                                        </label>

                                        <input
                                            type="text"
                                            name="title"
                                            value={
                                                formData.title
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Enter event title"
                                            className={
                                                errors.title
                                                    ? 'is-invalid'
                                                    : ''
                                            }
                                        />

                                        {errors.title && (
                                            <div className="invalid-feedback">
                                                {
                                                    errors.title
                                                }
                                            </div>
                                        )}
                                    </div>

                                    {/* Event Date */}
                                    <div className="form-group">
                                        <label>
                                            Event Date *
                                        </label>

                                        <input
                                            type="date"
                                            name="event_date"
                                            value={
                                                formData.event_date
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            className={
                                                errors.event_date
                                                    ? 'is-invalid'
                                                    : ''
                                            }
                                        />

                                        {errors.event_date && (
                                            <div className="invalid-feedback">
                                                {
                                                    errors.event_date
                                                }
                                            </div>
                                        )}
                                    </div>

                                    {/* Start Time */}
                                    <div className="form-group">
                                        <label>
                                            Start Time
                                        </label>

                                        <input
                                            type="time"
                                            name="start_time"
                                            value={
                                                formData.start_time
                                            }
                                            onChange={
                                                handleChange
                                            }
                                        />
                                    </div>

                                    {/* End Time */}
                                    <div className="form-group">
                                        <label>
                                            End Time
                                        </label>

                                        <input
                                            type="time"
                                            name="end_time"
                                            value={
                                                formData.end_time
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            className={
                                                errors.end_time
                                                    ? 'is-invalid'
                                                    : ''
                                            }
                                        />

                                        {errors.end_time && (
                                            <div className="invalid-feedback">
                                                {
                                                    errors.end_time
                                                }
                                            </div>
                                        )}
                                    </div>

                                    {/* Location */}
                                    <div className="form-group">
                                        <label>
                                            Location
                                        </label>

                                        <input
                                            type="text"
                                            name="location"
                                            value={
                                                formData.location
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Enter event location"
                                        />
                                    </div>

                                    {/* Status */}
                                    <div className="form-group">
                                        <label>
                                            Status
                                        </label>

                                        <select
                                            name="status"
                                            value={
                                                formData.status
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            className={
                                                errors.status
                                                    ? 'is-invalid'
                                                    : ''
                                            }
                                        >
                                            <option value="">
                                                Select Status
                                            </option>

                                            <option value="Active">
                                                Active
                                            </option>

                                            <option value="Inactive">
                                                Inactive
                                            </option>

                                            <option value="Published">
                                                Published
                                            </option>

                                            <option value="Draft">
                                                Draft
                                            </option>

                                            <option value="Completed">
                                                Completed
                                            </option>

                                            <option value="Cancelled">
                                                Cancelled
                                            </option>
                                        </select>

                                        {errors.status && (
                                            <div className="invalid-feedback">
                                                {
                                                    errors.status
                                                }
                                            </div>
                                        )}
                                    </div>

                                    {/* Description */}
                                    <div
                                        className="form-group"
                                        style={{
                                            gridColumn:
                                                '1 / -1',
                                        }}
                                    >
                                        <label>
                                            Description
                                        </label>

                                        <textarea
                                            name="description"
                                            value={
                                                formData.description
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Enter event description"
                                            rows="5"
                                        ></textarea>
                                    </div>
                                </div>
                            </div>

                            <div className="student-modal-footer">
                                <button
                                    type="button"
                                    className="student-modal-cancel"
                                    onClick={
                                        closeModal
                                    }
                                    disabled={saving}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="student-modal-submit"
                                    disabled={saving}
                                >
                                    {saving ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm"></span>
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-check-lg"></i>

                                            {editingEvent
                                                ? 'Update Event'
                                                : 'Save Event'}
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Events;

