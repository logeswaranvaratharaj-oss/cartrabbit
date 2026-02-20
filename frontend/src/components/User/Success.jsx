import React from 'react';
import { format, parseISO } from 'date-fns';
import { CheckCircle, Calendar, Clock, User, Mail, ShieldCheck } from 'lucide-react';

const Success = ({ selectedType, bookingData, selectedDate, selectedTime }) => {
    return (
        <div className="success-container fade-in">
            <div className="success-card">
                <div className="success-header">
                    <div className="success-icon-wrapper" style={{ background: selectedType.color }}>
                        <CheckCircle size={48} color="white" />
                    </div>
                    <h1>Booking Confirmed!</h1>
                    <p className="success-subtitle">We've sent a calendar invitation and confirmation details to your inbox.</p>
                </div>

                <div className="success-details-grid">
                    <div className="detail-item">
                        <div className="detail-label"><User size={14} /> Participant</div>
                        <div className="detail-value">{bookingData.name}</div>
                    </div>
                    <div className="detail-item">
                        <div className="detail-label"><Mail size={14} /> Email</div>
                        <div className="detail-value">{bookingData.email}</div>
                    </div>
                    <div className="detail-item">
                        <div className="detail-label"><Calendar size={14} /> Date</div>
                        <div className="detail-value">{format(selectedDate, 'EEEE, MMMM do, yyyy')}</div>
                    </div>
                    <div className="detail-item">
                        <div className="detail-label"><Clock size={14} /> Time</div>
                        <div className="detail-value">{selectedTime} (IST)</div>
                    </div>
                </div>

                <div className="success-footer">
                    <div className="security-note">
                        <ShieldCheck size={14} />
                        <span>Securely scheduled via CartRabbit</span>
                    </div>
                    <button className="btn-done" onClick={() => window.location.reload()}>
                        Return to Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Success;
