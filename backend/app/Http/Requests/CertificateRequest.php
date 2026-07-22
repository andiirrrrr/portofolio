<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CertificateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'issuer' => 'required|string|max:255',
            'issued_date' => 'required|date',
            'expiry_date' => 'nullable|date|after:issued_date',
            'credential_id' => 'nullable|string|max:255',
            'credential_url' => 'nullable|url|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'order' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
        ];
    }
}