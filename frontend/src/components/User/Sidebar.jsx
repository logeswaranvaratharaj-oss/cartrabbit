import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Clock, Globe, Video, Calendar as CalIcon, MapPin, Phone } from 'lucide-react';
import { format } from 'date-fns';

const Sidebar = ({ selectedType, setStep, setSelectedDate, setSelectedTime, selectedDate, selectedTime }) => {
    return (
        <div className="sidebar">
            <div className="sidebar-top">
                <button className="nav-back" onClick={() => { setStep(0); setSelectedDate(null); setSelectedTime(null); }}>
                    <ChevronLeft size={16} /> <span>All Meetings</span>
                </button>

                <div className="host-profile">
                    <div className="host-avatar">JD</div>
                    <div className="host-meta">
                        <span className="badge">Project Lead</span>
                        <h2>John Doe</h2>
                    </div>
                </div>
            </div>

            <div className="sidebar-middle">
                <div className="event-details-card" style={{ borderColor: selectedType.color }}>
                    <h3 style={{ color: selectedType.color }}>{selectedType.title}</h3>
                    {selectedType.description && (
                        <p style={{ fontSize: '14px', color: 'var(--text-light)', marginBottom: '16px', fontWeight: 500 }}>
                            {selectedType.description}
                        </p>
                    )}
                    <div className="detail-row">
                        <Clock size={16} />
                        <span>{selectedType.duration} mins</span>
                    </div>
                    <div className="detail-row">
                        <Globe size={16} />
                        <span>Indian Standard Time</span>
                    </div>
                    <div className="detail-row">
                        <Video size={16} />
                        <span>Google Meet (Online)</span>
                    </div>
                </div>
            </div>

            <div className="sidebar-bottom">
                <AnimatePresence>
                    {selectedDate && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="selected-info-group"
                        >
                            <div className="info-item">
                                <CalIcon size={16} />
                                <span>{format(selectedDate, 'EEEE, MMM d, yyyy')}</span>
                            </div>
                            {selectedTime && (
                                <div className="info-item active">
                                    <Clock size={16} />
                                    <span>{selectedTime}</span>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Sidebar;
