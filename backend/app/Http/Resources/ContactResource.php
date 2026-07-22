<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ContactResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'subject' => $this->subject,
            'message' => $this->message,
            'phone' => $this->phone,
            'is_read' => $this->is_read,
            'is_replied' => $this->is_replied,
            'replied_at' => $this->replied_at?->toISOString(),
            'created_at' => $this->created_at->toISOString(),
        ];
    }
}