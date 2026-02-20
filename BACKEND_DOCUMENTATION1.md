# Backend Technical Documentation - CartRabbit Booking System

This document provides a comprehensive breakdown of the Laravel-based backend architecture, logic, and dependencies.

## 1. Technology Stack & Packages
*   **Laravel 11**: The core PHP framework used for its robust API routing, Eloquent ORM, and built-in mailing system.
*   **Laravel Sanctum**: Used for lightweight API token authentication (protecting admin routes).
*   **Carbon**: A PHP extension for DateTime, used extensively for calculating time slots and availability.
*   **MySQL**: The relational database used to store users, bookings, and availability configurations.

## 2. Database Architecture
*   **`users`**: Stores admin credentials.
*   **`availabilities`**: Stores the "Working Hours" (e.g., Monday 9 AM - 5 PM). Linked to a user.
*   **`bookings`**: Stores confirmed appointments, including guest details, date, and `start_time`/`end_time`.
*   **`meeting_types`**: Stores customizable meeting options (e.g., "Product Demo" with a 30-minute duration).

## 3. Core Logic & Controller Functions (`BookingController`)

### A. Availability Calculation (`getAvailability`)
**This is the most complex part of the backend.**
*   **Input**: Date and Meeting Duration.
*   **Process**:
    1.  Fetches the "Availability Block" for that specific day of the week (e.g., Monday).
    2.  Loops from `start_time` to `end_time`, creating "chunks" based on the `duration` (e.g., 9:00, 9:30, 10:00).
    3.  Fetches all existing `bookings` for that date.
    4.  **Overlap Detection**: For every generated time slot, it checks if it overlaps with any existing booking.
    5.  **Output**: Returns an array of objects: `{ "time": "09:00", "is_booked": true/false }`.

### B. Booking Storage (`storeBooking`)
*   Validates input and calculates the `end_time` by adding the duration to the `start_time`.
*   Performs a final "Double Booking" check to ensure no overlap happened during the time the user was filling the form.
*   **Email Trigger**: On success, it initiates the `BookingConfirmed` mailable.

### C. Admin Batch Syncing (`updateAdminAvailability` & `syncMeetingTypes`)
*   Uses a **Truncate & Recreate** strategy. Instead of complex "Upsert" logic, it deletes existing records for the user and inserts the new state provided by the frontend. This ensures the database always perfectly matches the admin's UI state.

## 4. Email System
*   **Mailable**: `App\Mail\BookingConfirmed`
*   **Template**: `resources/views/emails/booking_confirmed.blade.php`
*   **Logic**: Uses Blade templating to generate a professional HTML email sent to the guest immediately after booking.

## 5. Most Complicated Part: Overlap Logic
Generating time slots dynamically is tricky because you must handle boundaries:
```php
if ($slotStart->lessThan($bEnd) && $slotEnd->greaterThan($bStart)) {
    $slot['is_booked'] = true;
}
```
This specific condition ensures that even if a meeting is 15 minutes and another is 60 minutes, the system accurately detects if they occupy the same space on the timeline.

## 6. Database Setup & Commands

### A. Migrations
Migrations define the database schema. To create the tables from scratch:
```bash
php artisan migrate
```
*   **Availability Table**: Defines working hours per day.
*   **Bookings Table**: Stores guest details and time slots.
*   **Meeting Types Table**: Stores customizable durations and colors.
*   **Users Table**: Default Laravel table, used here for Admin Auth.

### B. Seeders (Populating Initial Data)
To populate the database with default admin user, working hours, and meeting types, run:
```bash
php artisan db:seed
```
*This command runs the `DatabaseSeeder.php` which automatically creates:*
1.  **Admin User**: `admin@gmail.com` (Password: `password`).
2.  **Default Availability**: Monday to Friday, 9:00 AM to 5:00 PM.
3.  **Meeting Options**: Default 15m, 30m, and 60m options.
4.  **Sample Booking**: A test booking for today to demonstrate the "Red Mark" (Booked) feature.

### C. Helpful Commands
*   **Fresh Restart**: To wipe all data and start fresh with seeds:
    ```bash
    php artisan migrate:fresh --seed
    ```
*   **Run Server**:
    ```bash
    php artisan serve --port=8001
    ```

