# Full Stack Project Documentation - CartRabbit Booking System

This document contains a comprehensive breakdown of both the Frontend and Backend, including project details, code explanations, and potential interview questions.

---

## 1. BACKEND DOCUMENTATION (Laravel)

### Technology Stack & Packages
*   **Laravel 11**: Provides the solid API foundation.
*   **Carbon**: Used for complex date/time calculations.
*   **Laravel Sanctum**: Used for lightweight API authentication for the admin dashboard.
*   **MySQL**: Relational database for structured data storage.

### Core Architecture & Logic
*   **Availability Calculation (`getAvailability`)**:
    *   **Logic**: It translates "Operating Hours" (e.g., Mon 9-5) into discrete user-selectable slots based on a meeting type's duration (15m, 30m, etc.).
    *   **Complexity**: It must handle overlap detection. It fetches all existing `bookings` for the date and compares the `start_time` and `end_time` of every potential slot against every booking to set the `is_booked` status.
*   **Email Notification**:
    *   Uses a dedicated `Mailable` class.
    *   Renders a specialized HTML Blade template (`emails.booking_confirmed`).
    *   Triggered immediately upon a successful database entry.
*   **Batch Save (Sync Logic)**:
    *   Instead of making many small API calls, the backend provides "Sync" endpoints that `truncate` (clear) and `recreate` records. This ensures the database always matches the latest Admin UI state exactly.

### Most Complicated Part
**The Overlap Query**: Preventing the "Double Booking" problem.
When a user books, the backend doesn't just check if the start time is free; it checks if the *entire duration* (Start → End) touches any existing booking.
```php
$query->where('start_time', '<', $endTime)->where('end_time', '>', $startTime);
```

---

## 2. FRONTEND DOCUMENTATION (React)

### Technology Stack & Packages
*   **React (Vite)**: Fast, modern frontend framework.
*   **Axios**: For communicating with the Laravel API.
*   **Framer Motion**: Powers all the premium animations (fades/transitions).
*   **Date-fns**: Simplifies manipulating and formatting dates for the user.
*   **Lucide React**: High-quality vector icons.

### User Flow Mechanics
*   **Step-Based State**: A single variable `step` in `App.jsx` controls which component is visible (Meeting Types -> Calendar -> Form -> Success).
*   **Dynamic Styling**: The meeting type cards pull their background colors directly from the database values, allowing for a fully customizable UI.
*   **Red Mark Feature**: The `Slots` component checks the `is_booked` flag for each button. If true, it applies a `booked` CSS class, changes the color to red, and disables the `onClick` event.

### Admin Dashboard Logic
*   **Local UI State**: When editing Meeting Options or Working Hours, the changes are stored in a React `useState` array first.
*   **Manual Trigger**: The API is only called when the user clicks the "Synchronize" button. This prevents "half-saved" states if the internet drops while editing.

---

## 3. INTERVIEW QUESTIONS & ANSWERS (QA)

### General / Project Focused
**Q1: How did you handle time-zone or date consistency between React and Laravel?**
*   **A**: I used standardized `ISO-8601` formats (YYYY-MM-DD) for communication. React handles the local display using `date-fns`, while Laravel processes the core logic using `Carbon` objects to ensure no data is lost or misinterpreted.

**Q2: How do you prevent two people from booking the same slot at the exact same time?**
*   **A**: We have two layers of protection. First, the frontend disables booked slots in real-time. Second, the backend `storeBooking` function performs a "Final Check" query right before inserting into the database to ensure no overlap occurred in the seconds between the user selecting the slot and clicking "Confirm".

### Backend Specialized
**Q3: Why did you use `truncate` and `recreate` for the sync logic instead of individual `update` calls?**
*   **A**: For simpler configuration data like "Working Hours," it is much more reliable. It prevents "orphan" records (leftover data from a row you deleted in the UI) and ensures there is only one source of truth: exactly what is on the user's screen.

**Q4: How did you implement the email system in Laravel?**
*   **A**: I created a `BookingConfirmed` Mailable class that accepts a `Booking` model in its constructor. I then created a custom Blade view with professional CSS. To handle performance, I wrapped the `Mail::send` call in a try-catch block so that if the email server fails, it doesn't crash the user's booking experience.

### Frontend Specialized
**Q5: How did you handle the "WOW" factor and premium aesthetics in this project?**
*   **A**: I used a combination of **Glassmorphism** (semi-transparent backgrounds with blurs), custom **Google Fonts**, and **Framer Motion** for micro-interactions. Every navigation step is animated with a smooth fade, and interactive elements have slight "scaling" effects to feel responsive.

**Q6: What was the benefit of using Vite over Create-React-App?**
*   **A**: Vite uses ES modules to provide almost instant server starts and Hot Module Replacement (HMR), which made the development of the complex Admin Dashboard much faster and more efficient compared to older tools.
