import React from 'react';
import { motion } from 'framer-motion';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays, subMonths, addMonths, startOfToday } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Calendar = ({ currentDate, setCurrentDate, selectedDate, setSelectedDate, selectedType }) => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
        for (let i = 0; i < 7; i++) {
            const d = day;
            const isDisabled = !isSameMonth(d, monthStart) || d < startOfToday();
            days.push(
                <div
                    className={`cal-cell ${isDisabled ? 'disabled' : ''} ${isSameDay(d, selectedDate) ? 'active' : ''}`}
                    key={d.toString()}
                    onClick={() => !isDisabled && setSelectedDate(d)}
                >
                    {format(d, "d")}
                    {isSameDay(d, selectedDate) && (
                        <motion.div
                            layoutId="cal-bg"
                            className="cal-active-bg"
                            style={{ background: selectedType.color }}
                        />
                    )}
                </div>
            );
            day = addDays(day, 1);
        }
        rows.push(<div className="cal-row" key={day.toString()}>{days}</div>);
        days = [];
    }

    return (
        <div className="calendar">
            <div className="cal-header">
                <button onClick={() => setCurrentDate(subMonths(currentDate, 1))}><ChevronLeft /></button>
                <h2>{format(currentDate, "MMMM yyyy")}</h2>
                <button onClick={() => setCurrentDate(addMonths(currentDate, 1))}><ChevronRight /></button>
            </div>
            <div className="cal-grid">
                <div className="weekdays">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <div key={d + i}>{d}</div>)}
                </div>
                {rows}
            </div>
        </div>
    );
};

export default Calendar;
