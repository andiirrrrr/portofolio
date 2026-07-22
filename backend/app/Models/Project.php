<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

class Project extends Model
{
    use HasFactory, HasSlug;

    protected $fillable = [
        'title',
        'slug',
        'category',
        'short_description',
        'description',
        'thumbnail',
        'github_url',
        'demo_url',
        'tech_stack',
        'challenges',
        'solutions',
        'key_features',
        'order',
        'is_featured',
        'is_active',
        'published_at',
    ];

    protected $casts = [
        'tech_stack' => 'array',
        'key_features' => 'array',
        'is_featured' => 'boolean',
        'is_active' => 'boolean',
        'published_at' => 'datetime',
        'order' => 'integer',
    ];

    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom('title')
            ->saveSlugsTo('slug');
    }

    public function images()
    {
        return $this->hasMany(ProjectImage::class)->orderBy('order');
    }
}