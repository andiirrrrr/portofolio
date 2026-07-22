<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Profile extends Model
{
    use HasFactory;

    protected $fillable = [
        'full_name',
        'title',
        'email',
        'phone',
        'location',
        'bio',
        'profile_image',
        'cv_file',
        'github_url',
        'linkedin_url',
        'instagram_url',
        'youtube_url',
        'website_url',
        'about_me',
        'professional_summary',
    ];
}