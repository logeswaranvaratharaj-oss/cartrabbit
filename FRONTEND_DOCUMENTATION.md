# Frontend Technical Documentation - CartRabbit UI

This document explains the React-based frontend architecture and the flow of the booking experience.

## 1. Technology Stack & Packages
*   **React (Vite)**: The core library for building a fast, reactive single-page application.
*   **Axios**: Used for all HTTP requests to the Laravel API.
*   **React Router Dom**: Handles navigation between the User Flow (`/`), Admin Login (`/login`), and the Dashboard (`/admin`).
*   **Framer Motion**: Used for the "WOW" factor. It handles smooth transitions between steps (e.g., Fade-in/Fade-out when moving from Calendar to Form).
*   **Date-fns**: Used for robust date formatting (e.g., converting "2026-02-20" to "Friday, February 20th").
*   **Lucide React**: Provides the premium icon set used throughout the dashboard.

## 2. Component Structure
*   **`App.jsx`**: The "Brain" of the app. It holds the global state (selected date, time, meeting type) and coordinates the multi-step flow.
*   **`User/Calendar.jsx`**: A custom-built calendar interface. It doesn't just pick dates; it filters out past dates and visually highlights the selected one.
*   **`User/Slots.jsx`**: Renders the time buttons. It listens to the `is_booked` flag from the backend to apply the red "Booked" styles.
*   **`Admin/AdminDashboard.jsx`**: The most complex component. It uses a Tab system to switch between managing bookings, meeting types, and working hours.

## 3. The Multi-Step Booking Flow
The `step` state (0, 1, 3, 4) controls the UI:
1.  **Step 0**: `MeetingTypes.jsx` - Dynamic cards fetched from the DB.
2.  **Step 1**: `Calendar.jsx` & `Slots.jsx` - Picking the moment.
3.  **Step 3**: `BookingForm.jsx` - Gathering user info.
4.  **Step 4**: `Success.jsx` - Final confirmation state.

## 4. Key Logic & Functionality

### A. Local State for Batch Saving
In the Admin Dashboard, we use "Optimistic" local state for Meeting Types and Availability.
*   Changes are kept in a local React array.
*   The `syncMeetingTypes` function sends the **entire array** to the backend only when the "Synchronize" button is clicked.
*   This prevents unnecessary database writes while the admin is still typing.

### B. Dynamic Styling
We use the `color` property from the `MeetingType` object to theme the UI on the fly:
```javascript
<div className="type-border" style={{ background: type.color }}></div>
```
This allows the admin to change a meeting's color in the dashboard, and it immediately updates the user's booking cards.

## 5. Most Complicated Part: Component Coordination
The synchronization between `Calendar.jsx` and `Slots.jsx` is the most intricate part. When a user clicks a date:
1.  `Calendar` updates the `selectedDate` state in `App.jsx`.
2.  An `useEffect` in `App.jsx` detects this change.
3.  It triggers `fetchAvailability`.
4.  The `Slots.jsx` component receives the new `availableSlots` and re-renders with loading spinners and booked status.

## 6. Premium Aesthetics
*   **Glassmorphism**: Achieved via `backdrop-filter: blur(12px)` in `index.css`.
*   **Micro-animations**: Every button has a `:hover` and `:active` scaling effect.
*   **Red Marking**: Booked slots use a combination of `opacity`, `cursor: not-allowed`, and custom red borders to clearly communicate state to the user.

## 7. Frontend Setup & Run Commands

### Installation
To install the necessary project dependencies:
```bash
npm install
```
*   **Vite**: Used for lightning-fast bundling.
*   **Tailwind (Optional/Custom CSS)**: Most styles are handled via `index.css` for a unique premium feel.

### Development Commands
*   **Start Local Server**:
    ```bash
    npm run dev
    ```
*   **Build for Production**:
    ```bash
    npm run build
    ```

## 8. API Integration Detail
The frontend communicates with the backend via a centralized `API_BASE_URL` defined in `src/constants.js`.

| Method | Endpoint | Purpose |
| :--- | :--- | :--- |
| **GET** | `/meeting-types` | Fetches available session types for the home screen. |
| **GET** | `/availability` | Fetches time slots for a specific date and duration. |
| **POST** | `/book` | Submits a new booking request. |
| **POST** | `/login` | Authenticates the administrator. |
| **POST** | `/admin/meeting-types/sync` | Saves altered meeting options in a single batch. |

## 9. Navigation & Routing
Uses `react-router-dom` for seamless transitions:
*   `/`: The user booking journey.
*   `/login`: The secure admin gateway.
*   `/admin`: The multi-tab dashboard (requires logical auth state).

