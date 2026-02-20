import React from 'react';
import { User, Server, MapPin, AlertCircle, ChevronLeft } from 'lucide-react';

const BookingForm = ({ bookingData, setBookingData, handleBooking, error, setStep, loading, selectedType }) => {
    return (
        <div className="booking-form fade-in">
            <div className="form-head">
                <h2>Enter Details</h2>
                <p>Almost there! Just need a few things to lock it in.</p>
            </div>
            <form onSubmit={handleBooking}>
                <div className="input-group">
                    <label><User size={14} /> Name</label>
                    <input
                        type="text"
                        required
                        value={bookingData.name}
                        onChange={e => setBookingData({ ...bookingData, name: e.target.value })}
                        placeholder="Full Name"
                    />
                </div>
                <div className="input-group">
                    <label><Server size={14} /> Email</label>
                    <input
                        type="email"
                        required
                        value={bookingData.email}
                        onChange={e => setBookingData({ ...bookingData, email: e.target.value })}
                        placeholder="name@company.com"
                    />
                </div>
                <div className="input-group">
                    <label><MapPin size={14} /> Location</label>
                    <select value={bookingData.location} onChange={e => setBookingData({ ...bookingData, location: e.target.value })}>
                        <option value="video">Google Meet (Online)</option>
                        <option value="phone">Phone Call</option>
                        <option value="in_person">In Person</option>
                    </select>
                </div>
                {error && <div className="error-box"><AlertCircle size={14} /> {error}</div>}
                <div className="form-btn-row">
                    <button type="button" className="btn-back-styled" onClick={() => setStep(1)}>
                        <ChevronLeft size={16} /> Change Time
                    </button>
                    <button type="submit" className="btn-confirm" disabled={loading} style={{ background: selectedType.color }}>
                        {loading ? 'Scheduling...' : 'Confirm Meeting'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default BookingForm;
