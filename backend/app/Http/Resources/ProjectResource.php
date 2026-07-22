<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'category' => $this->category,
            'short_description' => $this->short_description,
            'description' => $this->description,
            'thumbnail' => $this->thumbnail ? url('storage/' . $this->thumbnail) : null,
            'github_url' => $this->github_url,
            'demo_url' => $this->demo_url,
            'tech_stack' => $this->tech_stack,
            'challenges' => $this->challenges,
            'solutions' => $this->solutions,
            'key_features' => $this->key_features,
            'order' => $this->order,
            'is_featured' => $this->is_featured,
            'is_active' => $this->is_active,
            'published_at' => $this->published_at?->toISOString(),
            'images' => ProjectImageResource::collection($this->whenLoaded('images')),
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}