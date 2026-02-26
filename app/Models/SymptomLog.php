<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SymptomLog extends Model
{
    protected $fillable = [
        'city',
        'symptoms_summary',
        'conditions',
        'urgency',
    ];
}
