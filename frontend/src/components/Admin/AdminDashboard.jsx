import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LogOut, Save, Plus, Trash2, Calendar as CalIcon, Users, Clock, TrendingUp, CalendarCheck, MapPin, Edit, Sparkles } from 'lucide-react';
import { DAYS, API_BASE_URL } from '../../constants';
import { format, isToday, parseISO } from 'date-fns';

const AdminDashboard = ({
    adminAvailabilities,
    handleLogout,
    saveAdminAvailabilities,
    loading,
    addAvailRow,
    removeAvailRow,
    updateAvailRow
}) => {
    const [bookings, setBookings] = useState([]);
    const [meetingTypes, setMeetingTypes] = useState([]);
    const [activeTab, setActiveTab] = useState('bookings');
    const [editingBooking, setEditingBooking] = useState(null);

    useEffect(() => {
        fetchBookings();
        fetchMeetingTypes();
    }, []);

    const fetchBookings = async () => {
        try {
            const resp = await axios.get(`${API_BASE_URL}/admin/bookings`);
            setBookings(resp.data);
        } catch (err) {
            console.error("Failed to fetch bookings", err);
        }
    };

    const fetchMeetingTypes = async () => {
        try {
            const resp = await axios.get(`${API_BASE_URL}/meeting-types`);
            setMeetingTypes(resp.data);
        } catch (err) {
            console.error("Failed to fetch meeting types", err);
        }
    };

    const handleUpdateBooking = async (id, data) => {
        try {
            await axios.put(`${API_BASE_URL}/admin/bookings/${id}`, data);
            fetchBookings();
            setEditingBooking(null);
        } catch (err) {
            alert("Failed to update booking");
        }
    };

    const handleDeleteBooking = async (id) => {
        if (!window.confirm("Are you sure you want to delete this booking?")) return;
        try {
            await axios.delete(`${API_BASE_URL}/admin/bookings/${id}`);
            fetchBookings();
        } catch (err) {
            alert("Failed to delete booking");
        }
    };

    const handleAddMeetingType = () => {
        const newType = { title: 'New Meeting', duration: 30, color: '#3b82f6', description: '' };
        setMeetingTypes([...meetingTypes, newType]);
    };

    const handleUpdateMeetingType = (index, field, value) => {
        const newData = [...meetingTypes];
        newData[index][field] = value;
        setMeetingTypes(newData);
    };

    const handleDeleteMeetingType = (index) => {
        setMeetingTypes(meetingTypes.filter((_, i) => i !== index));
    };

    const saveMeetingTypes = async () => {
        try {
            await axios.post(`${API_BASE_URL}/admin/meeting-types/sync`, { meeting_types: meetingTypes });
            alert("Meeting options synchronized successfully!");
            fetchMeetingTypes();
        } catch (err) {
            alert("Failed to sync meeting options");
        }
    };

    const getStats = () => {
        const today = bookings.filter(b => isToday(parseISO(b.booking_date))).length;
        return [
            { id: 1, label: 'Total Bookings', value: bookings.length, icon: <Users />, color: '#3b82f6', bg: '#3b82f615' },
            { id: 2, label: 'Today Events', value: today, icon: <CalendarCheck />, color: '#10b981', bg: '#10b98115' },
            { id: 3, label: 'Weekly Growth', value: '+12%', icon: <TrendingUp />, color: '#8b5cf6', bg: '#8b5cf615' },
        ];
    };

    return (
        <div className="admin-dashboard-view fade-in">
            <div className="dashboard-header">
                <div>
                    <h1>Dashboard Overview</h1>
                    <p>Welcome back! Here's what's happening today.</p>
                </div>
                <div className="header-actions">
                    <button className="btn-secondary" onClick={handleLogout}>
                        <LogOut size={18} /> <span>Sign Out</span>
                    </button>
                </div>
            </div>

            <div className="admin-stats-grid">
                {getStats().map(stat => (
                    <div key={stat.id} className="stat-card">
                        <div className="stat-icon" style={{ color: stat.color, background: stat.bg }}>
                            {stat.icon}
                        </div>
                        <div className="stat-info">
                            <h4>{stat.label}</h4>
                            <span>{stat.value}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="admin-tabs">
                <button
                    className={`tab-btn ${activeTab === 'bookings' ? 'active' : ''}`}
                    onClick={() => setActiveTab('bookings')}
                >
                    <CalIcon size={18} /> <span>Manage Bookings</span>
                </button>
                <button
                    className={`tab-btn ${activeTab === 'meetings' ? 'active' : ''}`}
                    onClick={() => setActiveTab('meetings')}
                >
                    <Sparkles size={18} /> <span>Meeting Options</span>
                </button>
                <button
                    className={`tab-btn ${activeTab === 'availability' ? 'active' : ''}`}
                    onClick={() => setActiveTab('availability')}
                >
                    <Clock size={18} /> <span>Setup Working Hours</span>
                </button>
            </div>

            {activeTab === 'bookings' ? (
                <div className="bookings-section fade-in">
                    <div className="bookings-table-wrapper">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Client Detail</th>
                                    <th>Appointment Date</th>
                                    <th>Scheduled Time</th>
                                    <th>Location Type</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.length > 0 ? bookings.map((b) => (
                                    <tr key={b.id} className="admin-row">
                                        <td>
                                            <div className="client-info">
                                                <strong>{b.guest_name}</strong>
                                                <span>{b.guest_email}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="date-badge">
                                                <span className="day">{format(parseISO(b.booking_date), 'dd')}</span>
                                                <span className="month">{format(parseISO(b.booking_date), 'MMM, yyyy')}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="time-info" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#3b82f6', fontWeight: 800 }}>
                                                <Clock size={16} /> {b.start_time.substring(0, 5)}
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <span className="location-tag" style={{ background: '#f1f5f9', color: '#475569', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                                    <MapPin size={12} /> {b.location === 'video' ? 'Google Meet' : (b.location === 'phone' ? 'Phone Call' : 'In Person')}
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button className="btn-icon" onClick={() => setEditingBooking(b)}><Edit size={16} /></button>
                                                <button className="btn-icon delete" onClick={() => handleDeleteBooking(b.id)}><Trash2 size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="5" className="empty-row">You have no scheduled bookings yet.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : activeTab === 'meetings' ? (
                <div className="meetings-section fade-in">
                    <div className="availability-list">
                        <div className="list-headers">
                            <span>Title</span>
                            <span>Description</span>
                            <span>Duration (m)</span>
                            <span>Color</span>
                            <span>Actions</span>
                        </div>
                        {meetingTypes.map((type, idx) => (
                            <div key={type.id || idx} className="avail-row">
                                <input
                                    type="text"
                                    value={type.title}
                                    onChange={e => handleUpdateMeetingType(idx, 'title', e.target.value)}
                                    placeholder="Meeting Title"
                                />
                                <input
                                    type="text"
                                    value={type.description || ''}
                                    onChange={e => handleUpdateMeetingType(idx, 'description', e.target.value)}
                                    placeholder="Description"
                                />
                                <input
                                    type="number"
                                    value={type.duration}
                                    onChange={e => handleUpdateMeetingType(idx, 'duration', parseInt(e.target.value))}
                                    placeholder="Minutes"
                                />
                                <input
                                    type="color"
                                    value={type.color}
                                    onChange={e => handleUpdateMeetingType(idx, 'color', e.target.value)}
                                />
                                <button className="btn-trash" onClick={() => handleDeleteMeetingType(idx)}>
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        ))}
                        <button className="btn-add-row" onClick={handleAddMeetingType}>
                            <Plus size={18} /> <span>Add New Meeting Type</span>
                        </button>
                    </div>
                    <div className="save-footer" style={{ marginTop: '40px', display: 'flex', justifyContent: 'flex-end' }}>
                        <button className="btn-primary" onClick={saveMeetingTypes} disabled={loading} style={{ padding: '16px 40px', fontSize: '16px' }}>
                            <Save size={18} /> {loading ? 'Saving...' : 'Synchronize Meeting Options'}
                        </button>
                    </div>
                </div>
            ) : (
                <div className="availability-section fade-in">
                    <div className="availability-list">
                        <div className="list-headers">
                            <span>Day of Week</span>
                            <span>Available From</span>
                            <span>Ends At</span>
                            <span>Actions</span>
                        </div>
                        {adminAvailabilities.map((avail, idx) => (
                            <div key={avail.id || idx} className="avail-row">
                                <select
                                    value={avail.day_of_week}
                                    onChange={e => updateAvailRow(idx, 'day_of_week', parseInt(e.target.value))}
                                >
                                    {DAYS.map((day, dIdx) => <option key={dIdx} value={dIdx}>{day}</option>)}
                                </select>
                                <input
                                    type="time"
                                    value={avail.start_time.substring(0, 5)}
                                    onChange={e => updateAvailRow(idx, 'start_time', e.target.value)}
                                />
                                <input
                                    type="time"
                                    value={avail.end_time.substring(0, 5)}
                                    onChange={e => updateAvailRow(idx, 'end_time', e.target.value)}
                                />
                                <button className="btn-trash" onClick={() => removeAvailRow(idx)}>
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        ))}
                        <button className="btn-add-row" onClick={addAvailRow}>
                            <Plus size={18} /> <span>Define New Availability Block</span>
                        </button>
                    </div>
                    <div className="save-footer" style={{ marginTop: '40px', display: 'flex', justifyContent: 'flex-end' }}>
                        <button className="btn-primary" onClick={saveAdminAvailabilities} disabled={loading} style={{ padding: '16px 40px', fontSize: '16px' }}>
                            <Save size={18} /> {loading ? 'Saving Changes...' : 'Synchronize Schedule'}
                        </button>
                    </div>
                </div>
            )}

            {editingBooking && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Edit Booking</h3>
                        <div className="form-group">
                            <label>Guest Name</label>
                            <input type="text" value={editingBooking.guest_name} onChange={e => setEditingBooking({ ...editingBooking, guest_name: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Date</label>
                            <input type="date" value={editingBooking.booking_date} onChange={e => setEditingBooking({ ...editingBooking, booking_date: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Start Time</label>
                            <input type="time" value={editingBooking.start_time.substring(0, 5)} onChange={e => setEditingBooking({ ...editingBooking, start_time: e.target.value })} />
                        </div>
                        <div className="modal-actions">
                            <button className="btn-secondary" onClick={() => setEditingBooking(null)}>Cancel</button>
                            <button className="btn-primary" onClick={() => handleUpdateBooking(editingBooking.id, editingBooking)}>Save Changes</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
