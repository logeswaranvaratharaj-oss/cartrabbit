# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


Technology Stack & Packages

React (Vite): The core library for building a fast, reactive single-page application.

Axios: Used for all HTTP requests to the Laravel API.

React Router Dom: Handles navigation between the User Flow (/), Admin Login (/login), and the Dashboard (/admin).

Framer Motion: Used for the "WOW" factor. It handles smooth transitions between steps (e.g., Fade-in/Fade-out when moving from Calendar to Form).

Date-fns: Used for robust date formatting (e.g., converting "2026-02-20" to "Friday, February 20th").

Lucide React: Provides the premium icon set used throughout the dashboard.

Component Structure

App.jsx: The "Brain" of the app. It holds the global state (selected date, time, meeting type) and coordinates the multi-step flow.

User/Calendar.jsx: A custom-built calendar interface. It doesn't just pick dates; it filters out past dates and visually highlights the selected one.

User/Slots.jsx: Renders the time buttons. It listens to the is_booked flag from the backend to apply the red "Booked" styles.

Admin/AdminDashboard.jsx: The most complex component. It uses a Tab system to switch between managing bookings, meeting types, and working hours.

The Multi-Step Booking Flow
The step state (0, 1, 3, 4) controls the UI:

Step 0: MeetingTypes.jsx - Dynamic cards fetched from the DB.

Step 1: Calendar.jsx & Slots.jsx - Picking the moment.

Step 3: BookingForm.jsx - Gathering user info.

Step 4: Success.jsx - Final confirmation state.

Key Logic & Functionality

A. Local State for Batch Saving
In the Admin Dashboard, we use "Optimistic" local state for Meeting Types and Availability.

Changes are kept in a local React array.

The syncMeetingTypes function sends the entire array to the backend only when the "Synchronize" button is clicked.

This prevents unnecessary database writes while the admin is still typing.

B. Dynamic Styling
We use the color property from the MeetingType object to theme the UI on the fly:

<div className="type-border" style={{ background: type.color }}></div>

This allows the admin to change a meeting's color in the dashboard, and it immediately updates the user's booking cards.

Most Complicated Part: Component Coordination
The synchronization between Calendar.jsx and Slots.jsx is the most intricate part. When a user clicks a date:

Calendar updates the selectedDate state in App.jsx.

A useEffect in App.jsx detects this change.

It triggers fetchAvailability.

The Slots.jsx component receives the new availableSlots and re-renders with loading spinners and booked status.

Premium Aesthetics

Glassmorphism: Achieved via backdrop-filter: blur(12px) in index.css.

Micro-animations: Every button has a :hover and :active scaling effect.

Red Marking: Booked slots use a combination of opacity, cursor: not-allowed, and custom red borders to clearly communicate state to the user.

Frontend Setup & Run Commands

Installation
To install the necessary project dependencies:

npm install

Vite: Used for lightning-fast bundling.

Tailwind (Optional/Custom CSS): Most styles are handled via index.css for a unique premium feel.

Development Commands

Start Local Server:

npm run dev

Build for Production:

npm run build

API Integration Detail
The frontend communicates with the backend via a centralized API_BASE_URL defined in src/constants.js.

Method	Endpoint	Purpose
GET	/meeting-types	Fetches available session types for the home screen.
GET	/availability	Fetches time slots for a specific date and duration.
POST	/book	Submits a new booking request.
POST	/login	Authenticates the administrator.
POST	/admin/meeting-types/sync	Saves altered meeting options in a single batch.

Navigation & Routing
Uses react-router-dom for seamless transitions:

/: The user booking journey.

/login: The secure admin gateway.

/admin: The multi-tab dashboard (requires logical auth state).