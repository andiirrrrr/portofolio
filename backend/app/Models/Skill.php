<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Skill extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'category',
        'icon',
        'level',
        'color',
        'order',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'level' => 'integer',
        'order' => 'integer',
    ];
}