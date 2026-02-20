<!DOCTYPE html>
<html>
<head>
    <title>Booking Confirmed</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
        <h2 style="color: #3b82f6;">Booking Confirmed!</h2>
        <p>Hello <strong>{{ $booking->guest_name }}</strong>,</p>
        <p>Your appointment has been successfully scheduled.</p>
        
        <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Date:</strong> {{ \Carbon\Carbon::parse($booking->booking_date)->format('F j, Y') }}</p>
            <p><strong>Time:</strong> {{ \Carbon\Carbon::parse($booking->start_time)->format('h:i A') }}</p>
            <p><strong>Location:</strong> {{ $booking->location === 'video' ? 'Google Meet' : ($booking->location === 'phone' ? 'Phone Call' : 'In Person') }}</p>
        </div>

        <p>Thank you for booking with us!</p>
        <p>Best Regards,<br>Cartrabbit Team</p>
    </div>
</body>
</html>
