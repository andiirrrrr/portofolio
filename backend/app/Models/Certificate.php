<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Certificate extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'issuer',
        'issued_date',
        'expiry_date',
        'credential_id',
        'credential_url',
        'image',
        'order',
        'is_active',
    ];

    protected $casts = [
        'issued_date' => 'date',
        'expiry_date' => 'date',
        'is_active' => 'boolean',
        'order' => 'integer',
    ];
}