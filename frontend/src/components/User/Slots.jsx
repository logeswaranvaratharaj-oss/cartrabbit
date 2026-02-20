import React from 'react';
import { format } from 'date-fns';

const Slots = ({ selectedDate, loading, availableSlots, selectedTime, setSelectedTime, setStep, selectedType }) => {
    return (
        <div className="slots fade-in">
            <h3>Select Time</h3>
            <p className="slots-date">{format(selectedDate, 'EEEE, MMM d')}</p>
            {loading ? (
                <div className="slot-loader"><div className="loader-ring"></div></div>
            ) : (
                <div className="slot-list">
                    {availableSlots.length > 0 ? (
                        availableSlots.map(slot => (
                            <button
                                key={slot.time}
                                className={`slot-item ${selectedTime === slot.time ? 'pick' : ''} ${slot.is_booked ? 'booked' : ''}`}
                                onClick={() => !slot.is_booked && (setSelectedTime(slot.time), setStep(3))}
                                disabled={slot.is_booked}
                                style={
                                    slot.is_booked ? { borderColor: '#ef4444', color: '#ef4444', background: '#fee2e2' } :
                                    selectedTime === slot.time ? { background: selectedType.color, color: 'white', borderColor: selectedType.color } : {}
                                }
                            >
                                {slot.time}
                                {slot.is_booked && <span style={{fontSize: '10px', display: 'block'}}>Booked</span>}
                            </button>
                        ))
                    ) : (
                        <div className="empty-state">No slots left for today.</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Slots;
