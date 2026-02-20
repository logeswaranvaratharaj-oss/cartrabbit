<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Availability;
use App\Models\Booking;
use App\Models\User;
use Carbon\Carbon;

class BookingController extends Controller
{
    public function getAvailability(Request $request)
    {
        $request->validate([
            'date' => 'required|date_format:Y-m-d',
            'duration' => 'integer|min:15|max:120',
        ]);

        $date = Carbon::parse($request->date);
        $dayOfWeek = $date->dayOfWeek;
        $duration = (int) $request->input('duration', 30);
        $availabilities = Availability::where('user_id', 1)
            ->where('day_of_week', $dayOfWeek)
            ->get();

        if ($availabilities->isEmpty()) {
            return response()->json(['slots' => []]);
        }

        $allSlots = [];
        foreach ($availabilities as $avail) {
            $start = Carbon::createFromFormat('H:i:s', $avail->start_time);
            $end = Carbon::createFromFormat('H:i:s', $avail->end_time);

            while ($start->copy()->addMinutes($duration)->lessThanOrEqualTo($end)) {
                $allSlots[] = [
                    'time' => $start->format('H:i'),
                    'is_booked' => false,
                ];
                $start->addMinutes($duration);
            }
        }
        $bookedSlots = Booking::where('user_id', 1)
            ->where('booking_date', $request->date)
            ->get(['start_time', 'end_time']);

        foreach ($allSlots as &$slot) {
            $slotStart = Carbon::createFromFormat('H:i', $slot['time']);
            $slotEnd = $slotStart->copy()->addMinutes($duration);

            foreach ($bookedSlots as $booking) {
                $bStart = Carbon::parse($booking->start_time);
                $bEnd = Carbon::parse($booking->end_time);

                if ($slotStart->lessThan($bEnd) && $slotEnd->greaterThan($bStart)) {
                    $slot['is_booked'] = true;
                    break;
                }
            }
        }

        return response()->json(['slots' => $allSlots]);
    }

    public function storeBooking(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'date' => 'required|date_format:Y-m-d',
            'time' => 'required|date_format:H:i',
            'duration' => 'integer|min:15|max:120',
        ]);

        $duration = (int) $request->input('duration', 30);
        $startTime = Carbon::createFromFormat('H:i', $request->time);
        $endTime = $startTime->copy()->addMinutes($duration);

        // Check for double booking (any overlap)
        $exists = Booking::where('user_id', 1)
            ->where('booking_date', $request->date)
            ->where(function ($query) use ($startTime, $endTime) {
                $query->where(function ($q) use ($startTime, $endTime) {
                    $q->where('start_time', '<', $endTime->format('H:i:s'))
                        ->where('end_time', '>', $startTime->format('H:i:s'));
                });
            })
            ->exists();

        if ($exists) {
            return response()->json(['error' => 'This slot is already booked or overlaps with another booking.'], 422);
        }

        $booking = Booking::create([
            'user_id' => 1,
            'guest_name' => $request->name,
            'guest_email' => $request->email,
            'location' => $request->location,
            'booking_date' => $request->date,
            'start_time' => $request->time,
            'end_time' => $endTime->format('H:i:s'),
        ]);

        // Send email notification
        try {
            \Illuminate\Support\Facades\Mail::to($booking->guest_email)->send(new \App\Mail\BookingConfirmed($booking));
        } catch (\Exception $e) {
            // Log error but don't fail the booking
            \Illuminate\Support\Facades\Log::error('Email failed: ' . $e->getMessage());
        }

        return response()->json(['success' => true, 'message' => 'Booking confirmed!', 'booking' => $booking]);
    }

    public function getAdminAvailability()
    {
        return response()->json(Availability::where('user_id', 1)->get());
    }

    public function updateAdminAvailability(Request $request)
    {
        $request->validate([
            'availabilities' => 'required|array',
            'availabilities.*.day_of_week' => 'required|integer|min:0|max:6',
            'availabilities.*.start_time' => 'required|string',
            'availabilities.*.end_time' => 'required|string',
        ]);

        // Simple approach: Delete existing and recreate
        Availability::where('user_id', 1)->delete();

        foreach ($request->availabilities as $avail) {
            Availability::create([
                'user_id' => 1,
                'day_of_week' => $avail['day_of_week'],
                'start_time' => $avail['start_time'],
                'end_time' => $avail['end_time'],
            ]);
        }

        return response()->json(['success' => true]);
    }

    public function getBookings()
    {
        return response()->json(Booking::where('user_id', 1)->orderBy('booking_date', 'desc')->get());
    }

    public function updateBooking(Request $request, $id)
    {
        $booking = Booking::findOrFail($id);
        $booking->update($request->all());
        return response()->json(['success' => true, 'booking' => $booking]);
    }

    public function deleteBooking($id)
    {
        $booking = Booking::findOrFail($id);
        $booking->delete();
        return response()->json(['success' => true]);
    }

    // Meeting Types Management
    public function getMeetingTypes()
    {
        return response()->json(\App\Models\MeetingType::all());
    }

    public function storeMeetingType(Request $request)
    {
        $request->validate([
            'title' => 'required|string',
            'duration' => 'required|integer',
        ]);
        $type = \App\Models\MeetingType::create($request->all());
        return response()->json($type);
    }

    public function updateMeetingType(Request $request, $id)
    {
        $type = \App\Models\MeetingType::findOrFail($id);
        $type->update($request->all());
        return response()->json($type);
    }

    public function syncMeetingTypes(Request $request)
    {
        $request->validate([
            'meeting_types' => 'required|array',
            'meeting_types.*.title' => 'required|string',
            'meeting_types.*.duration' => 'required|integer',
        ]);

        \App\Models\MeetingType::truncate();

        foreach ($request->meeting_types as $type) {
            \App\Models\MeetingType::create([
                'title' => $type['title'],
                'duration' => $type['duration'],
                'color' => $type['color'] ?? '#3b82f6',
                'description' => $type['description'] ?? '',
            ]);
        }

        return response()->json(['success' => true]);
    }

    public function deleteMeetingType($id)
    {
        \App\Models\MeetingType::findOrFail($id)->delete();
        return response()->json(['success' => true]);
    }
}
