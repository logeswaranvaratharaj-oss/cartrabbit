<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

<p align="center">
<a href="https://github.com/laravel/framework/actions"><img src="https://github.com/laravel/framework/workflows/tests/badge.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

## About Laravel

Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable and creative experience to be truly fulfilling. Laravel takes the pain out of development by easing common tasks used in many web projects, such as:

- [Simple, fast routing engine](https://laravel.com/docs/routing).
- [Powerful dependency injection container](https://laravel.com/docs/container).
- Multiple back-ends for [session](https://laravel.com/docs/session) and [cache](https://laravel.com/docs/cache) storage.
- Expressive, intuitive [database ORM](https://laravel.com/docs/eloquent).
- Database agnostic [schema migrations](https://laravel.com/docs/migrations).
- [Robust background job processing](https://laravel.com/docs/queues).
- [Real-time event broadcasting](https://laravel.com/docs/broadcasting).

Laravel is accessible, powerful, and provides tools required for large, robust applications.

## Learning Laravel

Laravel has the most extensive and thorough [documentation](https://laravel.com/docs) and video tutorial library of all modern web application frameworks, making it a breeze to get started with the framework. You can also check out [Laravel Learn](https://laravel.com/learn), where you will be guided through building a modern Laravel application.

If you don't feel like reading, [Laracasts](https://laracasts.com) can help. Laracasts contains thousands of video tutorials on a range of topics including Laravel, modern PHP, unit testing, and JavaScript. Boost your skills by digging into our comprehensive video library.

## Laravel Sponsors

We would like to extend our thanks to the following sponsors for funding Laravel development. If you are interested in becoming a sponsor, please visit the [Laravel Partners program](https://partners.laravel.com).

### Premium Partners

- **[Vehikl](https://vehikl.com)**
- **[Tighten Co.](https://tighten.co)**
- **[Kirschbaum Development Group](https://kirschbaumdevelopment.com)**
- **[64 Robots](https://64robots.com)**
- **[Curotec](https://www.curotec.com/services/technologies/laravel)**
- **[DevSquad](https://devsquad.com/hire-laravel-developers)**
- **[Redberry](https://redberry.international/laravel-development)**
- **[Active Logic](https://activelogic.com)**

## Contributing

Thank you for considering contributing to the Laravel framework! The contribution guide can be found in the [Laravel documentation](https://laravel.com/docs/contributions).

## Code of Conduct

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).



Technology Stack & Packages

Laravel 11: The core PHP framework used for its robust API routing, Eloquent ORM, and built-in mailing system.

Laravel Sanctum: Used for lightweight API token authentication (protecting admin routes).

Carbon: A PHP extension for DateTime, used extensively for calculating time slots and availability.

MySQL: The relational database used to store users, bookings, and availability configurations.

Database Architecture

users: Stores admin credentials.

availabilities: Stores the "Working Hours" (e.g., Monday 9 AM - 5 PM). Linked to a user.

bookings: Stores confirmed appointments, including guest details, date, and start_time/end_time.

meeting_types: Stores customizable meeting options (e.g., "Product Demo" with a 30-minute duration).

Core Logic & Controller Functions (BookingController)

A. Availability Calculation (getAvailability)
This is the most complex part of the backend.

Input: Date and Meeting Duration.

Process:

Fetches the "Availability Block" for that specific day of the week (e.g., Monday).

Loops from start_time to end_time, creating "chunks" based on the duration (e.g., 9:00, 9:30, 10:00).

Fetches all existing bookings for that date.

Overlap Detection: For every generated time slot, it checks if it overlaps with any existing booking.

Output: Returns an array of objects: { "time": "09:00", "is_booked": true/false }.

B. Booking Storage (storeBooking)

Validates input and calculates the end_time by adding the duration to the start_time.

Performs a final "Double Booking" check to ensure no overlap happened during the time the user was filling the form.

Email Trigger: On success, it initiates the BookingConfirmed mailable.

C. Admin Batch Syncing (updateAdminAvailability & syncMeetingTypes)

Uses a Truncate & Recreate strategy. Instead of complex "Upsert" logic, it deletes existing records for the user and inserts the new state provided by the frontend. This ensures the database always perfectly matches the admin's UI state.

Email System

Mailable: App\Mail\BookingConfirmed

Template: resources/views/emails/booking_confirmed.blade.php

Logic: Uses Blade templating to generate a professional HTML email sent to the guest immediately after booking.

Most Complicated Part: Overlap Logic
Generating time slots dynamically is tricky because you must handle boundaries:

if ($slotStart->lessThan($bEnd) && $slotEnd->greaterThan($bStart)) {
    $slot['is_booked'] = true;
}

This specific condition ensures that even if a meeting is 15 minutes and another is 60 minutes, the system accurately detects if they occupy the same space on the timeline.

Database Setup & Commands

A. Migrations
Migrations define the database schema. To create the tables from scratch:

php artisan migrate

Availability Table: Defines working hours per day.

Bookings Table: Stores guest details and time slots.

Meeting Types Table: Stores customizable durations and colors.

Users Table: Default Laravel table, used here for Admin Auth.

B. Seeders (Populating Initial Data)
To populate the database with default admin user, working hours, and meeting types, run:

php artisan db:seed

This command runs the DatabaseSeeder.php which automatically creates:

Admin User: logeswaran@gmail.com (Password: 12345678).

Default Availability: Monday to Friday, 9:00 AM to 5:00 PM.

Meeting Options: Default 15m, 30m, and 60m options.

Sample Booking: A test booking for today to demonstrate the "Red Mark" (Booked) feature.

C. Helpful Commands

Fresh Restart: To wipe all data and start fresh with seeds:

php artisan migrate:fresh --seed

Run Server:

php artisan serve --port=8001