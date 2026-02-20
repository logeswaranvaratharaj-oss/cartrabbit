import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ChevronRight } from 'lucide-react';
const MeetingTypes = ({ meetingTypes, setSelectedType, setStep }) => {
    return (
        <div className="types-view fade-in">
            <header className="hero">
                <Sparkles className="icon-spark" />
                <h1>Book a Session</h1>
                <p>Choose your preferred meeting duration below to get started.</p>
            </header>
            <div className="type-grid">
                {meetingTypes.length > 0 ? meetingTypes.map((type, i) => (
                    <motion.div
                        key={type.id}
                        className="meeting-type-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        whileHover={{ y: -5, boxShadow: '0 15px 30px rgba(0,0,0,0.06)' }}
                        onClick={() => { setSelectedType(type); setStep(1); }}
                    >
                        <div className="type-border" style={{ background: type.color }}></div>
                        <div className="type-header">
                            <span className="type-time" style={{ background: `${type.color}15`, color: type.color }}>{type.duration}m</span>
                        </div>
                        <h3>{type.title}</h3>
                        <p>{type.description}</p>
                        <div className="type-footer">
                            <span>View Availability</span>
                            <ChevronRight size={16} />
                        </div>
                    </motion.div>
                )) : (
                    <div className="empty-state-container" style={{ gridColumn: '1/-1', padding: '40px' }}>
                        <p style={{ color: 'var(--text-light)', marginBottom: '20px' }}>No meeting types found. If you are the admin, please setup meeting types in the dashboard.</p>
                        <button className="btn-secondary" onClick={() => window.location.reload()}>Refresh Page</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MeetingTypes;
