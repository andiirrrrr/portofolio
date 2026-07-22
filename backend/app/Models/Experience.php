<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Experience extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_name',
        'company_logo',
        'position',
        'start_date',
        'end_date',
        'is_current',
        'description',
        'achievements',
        'company_website',
        'order',
        'is_active',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'is_current' => 'boolean',
        'is_active' => 'boolean',
        'achievements' => 'array',
        'order' => 'integer',
    ];
}