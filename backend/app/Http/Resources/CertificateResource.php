<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CertificateResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'issuer' => $this->issuer,
            'issued_date' => $this->issued_date->format('Y-m-d'),
            'expiry_date' => $this->expiry_date?->format('Y-m-d'),
            'credential_id' => $this->credential_id,
            'credential_url' => $this->credential_url,
            'image' => $this->image ? url('storage/' . $this->image) : null,
            'order' => $this->order,
            'is_active' => $this->is_active,
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}