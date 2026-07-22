@extends('admin.layouts.app')

@section('title', isset($experience) ? 'Edit Experience' : 'Create Experience')
@section('header', isset($experience) ? 'Edit Experience' : 'Create Experience')

@section('content')
<div class="bg-white rounded-lg shadow p-6">
    <form action="{{ isset($experience) ? route('admin.experiences.update', $experience->id) : route('admin.experiences.store') }}" 
          method="POST" 
          enctype="multipart/form-data">
        @csrf
        @if(isset($experience))
            @method('PUT')
        @endif

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label class="block text-gray-700 mb-2">Company Name *</label>
                <input type="text" 
                       name="company_name" 
                       value="{{ isset($experience) ? $experience->company_name : old('company_name') }}"
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                       required>
            </div>
            <div>
                <label class="block text-gray-700 mb-2">Position *</label>
                <input type="text" 
                       name="position" 
                       value="{{ isset($experience) ? $experience->position : old('position') }}"
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                       required>
            </div>
            <div>
                <label class="block text-gray-700 mb-2">Start Date *</label>
                <input type="date" 
                       name="start_date" 
                       value="{{ isset($experience) ? $experience->start_date->format('Y-m-d') : old('start_date') }}"
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                       required>
            </div>
            <div>
                <label class="block text-gray-700 mb-2">End Date</label>
                <input type="date" 
                       name="end_date" 
                       value="{{ isset($experience) && $experience->end_date ? $experience->end_date->format('Y-m-d') : old('end_date') }}"
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">
            </div>
            <div>
                <label class="block text-gray-700 mb-2">Company Logo</label>
                <input type="file" 
                       name="company_logo" 
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">
                @if(isset($experience) && $experience->company_logo)
                    <p class="mt-2 text-sm text-gray-500">Current: {{ basename($experience->company_logo) }}</p>
                @endif
            </div>
            <div>
                <label class="block text-gray-700 mb-2">Company Website</label>
                <input type="url" 
                       name="company_website" 
                       value="{{ isset($experience) ? $experience->company_website : old('company_website') }}"
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">
            </div>
            <div>
                <label class="block text-gray-700 mb-2">Order</label>
                <input type="number" 
                       name="order" 
                       value="{{ isset($experience) ? $experience->order : old('order', 0) }}"
                       min="0"
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">
            </div>
            <div class="flex items-center space-x-4 mt-6">
                <label class="flex items-center">
                    <input type="checkbox" 
                           name="is_current" 
                           value="1"
                           {{ isset($experience) && $experience->is_current ? 'checked' : '' }}
                           class="rounded border-gray-300 text-blue-600">
                    <span class="ml-2 text-gray-700">Currently Working Here</span>
                </label>
                <label class="flex items-center">
                    <input type="checkbox" 
                           name="is_active" 
                           value="1"
                           {{ isset($experience) && $experience->is_active ? 'checked' : 'checked' }}
                           class="rounded border-gray-300 text-blue-600">
                    <span class="ml-2 text-gray-700">Active</span>
                </label>
            </div>
        </div>

        <div class="mt-4">
            <label class="block text-gray-700 mb-2">Description</label>
            <textarea name="description" 
                      rows="3"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">{{ isset($experience) ? $experience->description : old('description') }}</textarea>
        </div>

        <div class="mt-4">
            <label class="block text-gray-700 mb-2">Achievements (satu per baris)</label>
            <textarea name="achievements" 
                    rows="4"
                    placeholder="Contoh:&#10;- Increased sales by 20%&#10;- Led team of 5 developers"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">{{ isset($experience) && $experience->achievements ? implode("\n", json_decode($experience->achievements, true) ?? []) : old('achievements') }}</textarea>
        </div>

        <div class="mt-6">
            <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
                {{ isset($experience) ? 'Update' : 'Save' }}
            </button>
            <a href="{{ route('admin.experiences.index') }}" class="ml-2 text-gray-600 hover:text-gray-800">
                Cancel
            </a>
        </div>
    </form>
</div>
@endsection