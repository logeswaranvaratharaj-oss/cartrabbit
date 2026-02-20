<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    protected $fillable = ['user_id', 'guest_name', 'guest_email', 'location', 'booking_date', 'start_time', 'end_time'];
}
