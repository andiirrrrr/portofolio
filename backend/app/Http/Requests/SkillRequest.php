<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SkillRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'category' => 'nullable|string|max:255',
            'icon' => 'nullable|string|max:255',
            'level' => 'nullable|integer|min:1|max:10',
            'color' => 'nullable|string|max:50',
            'order' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
        ];
    }
}