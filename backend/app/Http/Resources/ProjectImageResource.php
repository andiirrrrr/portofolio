<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectImageResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'image_path' => url('storage/' . $this->image_path),
            'caption' => $this->caption,
            'order' => $this->order,
        ];
    }
}