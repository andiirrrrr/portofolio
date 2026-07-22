<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProfileResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'full_name' => $this->full_name,
            'title' => $this->title,
            'email' => $this->email,
            'phone' => $this->phone,
            'location' => $this->location,
            'bio' => $this->bio,
            'profile_image' => $this->profile_image ? url('storage/' . $this->profile_image) : null,
            'cv_file' => $this->cv_file ? url('storage/' . $this->cv_file) : null,
            'github_url' => $this->github_url,
            'linkedin_url' => $this->linkedin_url,
            'instagram_url' => $this->instagram_url,
            'youtube_url' => $this->youtube_url,
            'website_url' => $this->website_url,
            'about_me' => $this->about_me,
            'professional_summary' => $this->professional_summary,
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),
        ];
    }
}