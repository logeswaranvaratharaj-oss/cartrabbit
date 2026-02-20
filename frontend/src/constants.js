export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001/api';

export const MEETING_TYPES = [
    { id: 15, title: 'Quick Catch-up', duration: 15, color: '#10b981', description: 'Perfect for brief updates or quick check-ins.' },
    { id: 30, title: 'Product Demo', duration: 30, color: '#3b82f6', description: 'Deep dive into features and solution workflows.' },
    { id: 60, title: 'Strategy session', duration: 60, color: '#8b5cf6', description: 'High-level planning and strategic roadmap discussion.' },
];

export const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
