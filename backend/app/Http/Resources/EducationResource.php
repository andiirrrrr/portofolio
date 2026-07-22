<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EducationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'institution_name' => $this->institution_name,
            'institution_logo' => $this->institution_logo ? url('storage/' . $this->institution_logo) : null,
            'degree' => $this->degree,
            'field_of_study' => $this->field_of_study,
            'start_date' => $this->start_date->format('Y-m-d'),
            'end_date' => $this->end_date?->format('Y-m-d'),
            'is_current' => $this->is_current,
            'description' => $this->description,
            'gpa' => $this->gpa,
            'order' => $this->order,
            'is_active' => $this->is_active,
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}