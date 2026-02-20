<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\AuthController;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/availability', [BookingController::class, 'getAvailability']);
Route::post('/book', [BookingController::class, 'storeBooking']);
Route::get('/meeting-types', [BookingController::class, 'getMeetingTypes']);

// Admin Routes
Route::get('/admin/availability', [BookingController::class, 'getAdminAvailability']);
Route::post('/admin/availability', [BookingController::class, 'updateAdminAvailability']);
Route::get('/admin/bookings', [BookingController::class, 'getBookings']);
Route::put('/admin/bookings/{id}', [BookingController::class, 'updateBooking']);
Route::delete('/admin/bookings/{id}', [BookingController::class, 'deleteBooking']);

// Meeting Types Admin
Route::post('/admin/meeting-types', [BookingController::class, 'storeMeetingType']);
Route::post('/admin/meeting-types/sync', [BookingController::class, 'syncMeetingTypes']);
Route::put('/admin/meeting-types/{id}', [BookingController::class, 'updateMeetingType']);
Route::delete('/admin/meeting-types/{id}', [BookingController::class, 'deleteMeetingType']);
