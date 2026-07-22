<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ExperienceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'company_name' => $this->company_name,
            'company_logo' => $this->company_logo ? url('storage/' . $this->company_logo) : null,
            'position' => $this->position,
            'start_date' => $this->start_date->format('Y-m-d'),
            'end_date' => $this->end_date?->format('Y-m-d'),
            'is_current' => $this->is_current,
            'description' => $this->description,
            'achievements' => $this->achievements,
            'company_website' => $this->company_website,
            'order' => $this->order,
            'is_active' => $this->is_active,
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}