<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MeetingTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
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
    }
}
