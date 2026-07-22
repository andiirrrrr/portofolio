<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'category' => 'nullable|string|max:255',
            'short_description' => 'required|string|max:500',
            'description' => 'nullable|string',
            'thumbnail' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
            'github_url' => 'nullable|url|max:255',
            'demo_url' => 'nullable|url|max:255',
            'tech_stack' => 'nullable|array',
            'challenges' => 'nullable|string',
            'solutions' => 'nullable|string',
            'key_features' => 'nullable|array',
            'order' => 'nullable|integer|min:0',
            'is_featured' => 'nullable|boolean',
            'is_active' => 'nullable|boolean',
            'published_at' => 'nullable|date',
        ];
    }
}