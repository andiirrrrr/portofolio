<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ExperienceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'company_name' => 'required|string|max:255',
            'company_logo' => 'nullable|image|mimes:jpeg,png,jpg,svg|max:2048',
            'position' => 'required|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after:start_date',
            'is_current' => 'nullable|boolean',
            'description' => 'nullable|string',
            'achievements' => 'nullable|array',
            'company_website' => 'nullable|url|max:255',
            'order' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
        ];
    }
}