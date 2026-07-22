@extends('admin.layouts.app')

@section('title', isset($education) ? 'Edit Education' : 'Create Education')
@section('header', isset($education) ? 'Edit Education' : 'Create Education')

@section('content')
<div class="bg-white rounded-lg shadow p-6">
    <form action="{{ isset($education) ? route('admin.educations.update', $education->id) : route('admin.educations.store') }}" 
          method="POST" 
          enctype="multipart/form-data">
        @csrf
        @if(isset($education))
            @method('PUT')
        @endif

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label class="block text-gray-700 mb-2">Institution Name *</label>
                <input type="text" 
                       name="institution_name" 
                       value="{{ isset($education) ? $education->institution_name : old('institution_name') }}"
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                       required>
            </div>
            <div>
                <label class="block text-gray-700 mb-2">Degree *</label>
                <input type="text" 
                       name="degree" 
                       value="{{ isset($education) ? $education->degree : old('degree') }}"
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                       required>
            </div>
            <div>
                <label class="block text-gray-700 mb-2">Field of Study *</label>
                <input type="text" 
                       name="field_of_study" 
                       value="{{ isset($education) ? $education->field_of_study : old('field_of_study') }}"
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                       required>
            </div>
            <div>
                <label class="block text-gray-700 mb-2">GPA</label>
                <input type="text" 
                       name="gpa" 
                       value="{{ isset($education) ? $education->gpa : old('gpa') }}"
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">
            </div>
            <div>
                <label class="block text-gray-700 mb-2">Start Date *</label>
                <input type="date" 
                       name="start_date" 
                       value="{{ isset($education) ? $education->start_date->format('Y-m-d') : old('start_date') }}"
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                       required>
            </div>
            <div>
                <label class="block text-gray-700 mb-2">End Date</label>
                <input type="date" 
                       name="end_date" 
                       value="{{ isset($education) && $education->end_date ? $education->end_date->format('Y-m-d') : old('end_date') }}"
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">
            </div>
            <div>
                <label class="block text-gray-700 mb-2">Institution Logo</label>
                <input type="file" 
                       name="institution_logo" 
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">
                @if(isset($education) && $education->institution_logo)
                    <p class="mt-2 text-sm text-gray-500">Current: {{ basename($education->institution_logo) }}</p>
                @endif
            </div>
            <div>
                <label class="block text-gray-700 mb-2">Order</label>
                <input type="number" 
                       name="order" 
                       value="{{ isset($education) ? $education->order : old('order', 0) }}"
                       min="0"
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">
            </div>
            <div class="flex items-center space-x-4 mt-6">
                <label class="flex items-center">
                    <input type="checkbox" 
                           name="is_current" 
                           value="1"
                           {{ isset($education) && $education->is_current ? 'checked' : '' }}
                           class="rounded border-gray-300 text-blue-600">
                    <span class="ml-2 text-gray-700">Currently Studying Here</span>
                </label>
                <label class="flex items-center">
                    <input type="checkbox" 
                           name="is_active" 
                           value="1"
                           {{ isset($education) && $education->is_active ? 'checked' : 'checked' }}
                           class="rounded border-gray-300 text-blue-600">
                    <span class="ml-2 text-gray-700">Active</span>
                </label>
            </div>
        </div>

        <div class="mt-4">
            <label class="block text-gray-700 mb-2">Description</label>
            <textarea name="description" 
                      rows="3"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">{{ isset($education) ? $education->description : old('description') }}</textarea>
        </div>

        <div class="mt-6">
            <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
                {{ isset($education) ? 'Update' : 'Save' }}
            </button>
            <a href="{{ route('admin.educations.index') }}" class="ml-2 text-gray-600 hover:text-gray-800">
                Cancel
            </a>
        </div>
    </form>
</div>
@endsection