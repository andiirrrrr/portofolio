<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EducationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'institution_name' => 'required|string|max:255',
            'institution_logo' => 'nullable|image|mimes:jpeg,png,jpg,svg|max:2048',
            'degree' => 'required|string|max:255',
            'field_of_study' => 'required|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after:start_date',
            'is_current' => 'nullable|boolean',
            'description' => 'nullable|string',
            'gpa' => 'nullable|string|max:10',
            'order' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
        ];
    }
}