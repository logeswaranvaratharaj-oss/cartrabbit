<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Create or fetch the main Admin User
        $user = \App\Models\User::firstOrCreate(
            ['email' => 'admin@gmail.com'],
            [
                'name' => 'Admin User',
                'password' => bcrypt('password'),
            ]
        );

        // 2. Setup Working Hours (Monday to Friday, 9 AM to 5 PM)
        \App\Models\Availability::where('user_id', $user->id)->delete();
        for ($i = 1; $i <= 5; $i++) {
            \App\Models\Availability::create([
                'user_id' => $user->id,
                'day_of_week' => $i,
                'start_time' => '09:00:00',
                'end_time' => '17:00:00',
            ]);
        }

        // 3. Seed Meeting Types
        \App\Models\MeetingType::truncate();
        \App\Models\MeetingType::create([
            'title' => 'Quick Catch-up',
            'duration' => 15,
            'color' => '#10b981',
            'description' => 'Perfect for brief updates or quick check-ins.'
        ]);
        \App\Models\MeetingType::create([
            'title' => 'Product Demo',
            'duration' => 30,
            'color' => '#3b82f6',
            'description' => 'Deep dive into features and solution workflows.'
        ]);
        \App\Models\MeetingType::create([
            'title' => 'Strategy session',
            'duration' => 60,
            'color' => '#8b5cf6',
            'description' => 'High-level planning and strategic roadmap discussion.'
        ]);

        // 4. Sample Booking for Today (to show the red mark feature)
        $today = now()->format('Y-m-d');
        \App\Models\Booking::create([
            'user_id' => $user->id,
            'guest_name' => 'John Doe',
            'guest_email' => 'john@example.com',
            'booking_date' => $today,
            'start_time' => '10:00:00',
            'end_time' => '10:30:00',
            'location' => 'video'
        ]);
    }
}
