<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Education extends Model
{
    use HasFactory;

    // Tentukan nama tabel secara eksplisit (opsional, tapi aman)
    protected $table = 'educations';

    protected $fillable = [
        'institution_name',
        'institution_logo',
        'degree',
        'field_of_study',
        'start_date',
        'end_date',
        'is_current',
        'description',
        'gpa',
        'order',
        'is_active',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'is_current' => 'boolean',
        'is_active' => 'boolean',
        'order' => 'integer',
    ];
}