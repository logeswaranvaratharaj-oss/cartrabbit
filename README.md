# Calendly Clone Mini App

A lean, thoughtful appointment-scheduling app built with Laravel (Backend) and React (Frontend).

## Features
- **Host Profile**: View host details and meeting duration.
- **Calendar View**: interactive calendar to pick dates with availability awareness.
- **Time Slot Selection**: Dynamic selection of 30-minute intervals from host's schedule.
- **Booking Form**: Clean validation and guest details entry.
- **Confirmation**: Friendly success screen.
- **Conflict Prevention**: Double-booking validation on both frontend and backend.

## Tech Stack
- **Backend**: Laravel 12, SQLite.
- **Frontend**: React (Vite), `date-fns` for date logic, `lucide-react` for icons, `axios` for API.
- **Styling**: Vanilla CSS with modern design principles.

## Installation & Setup

### Backend (Laravel)
1. Navigate to `backend` folder: `cd backend`
2. Install dependencies: `composer install`
3. Prepare environment: `cp .env.example .env`
4. Run migrations and seeders: `php artisan migrate:fresh --seed`
5. Start server on specific port: **`php artisan serve --port=8001`**

### Frontend (React)
1. Navigate to `frontend` folder: `cd frontend`
2. Install dependencies: `npm install`
3. Start development server: `npm run dev` (Runs on default **port 5173**)

## Enhanced Features
- **Dynamic Durations**: Choose between 15, 30, and 60 minute sessions.
- **Smart Availability**: Backend calculates overlapping slots based on selected duration.
- **Meeting Locations**: Select between Video, Phone, or In-person.
- **Improved UX**: New selection flow with meeting type cards and detailed sidebar.
- **Users**: Represents the host (e.g., John Doe).
- **Availabilities**: Stores host's working hours per day of the week (0-6).
- **Bookings**: Stores guest appointments (name, email, date, time).
  - *Relationship*: Both Availabilities and Bookings belong to a User.
  - *Constraint*: Bookings have a unique constraint/check for (user_id, date, time) to prevent double-booking.

## AI Tools & Libraries
- **Vite**: For fast frontend development.
- **date-fns**: Essential for complex date calculations in the calendar.
- **Lucide React**: Premium-feel icons consistent with modern UI.
- **Framer Motion**: Used for subtle transitions and layout animations.
- **Laravel**: Robust PHP framework for clean, secure API development.

---
Built in ~4 hours as a technical challenge.
