@extends('admin.layouts.app')

@section('title', isset($skill) ? 'Edit Skill' : 'Create Skill')
@section('header', isset($skill) ? 'Edit Skill' : 'Create Skill')

@section('content')
<div class="bg-white rounded-lg shadow p-6">
    <form action="{{ isset($skill) ? route('admin.skills.update', $skill->id) : route('admin.skills.store') }}" method="POST">
        @csrf
        @if(isset($skill))
            @method('PUT')
        @endif

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label class="block text-gray-700 mb-2">Name *</label>
                <input type="text" 
                       name="name" 
                       value="{{ isset($skill) ? $skill->name : old('name') }}"
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                       required>
            </div>
            <div>
                <label class="block text-gray-700 mb-2">Category</label>
                <input type="text" 
                       name="category" 
                       value="{{ isset($skill) ? $skill->category : old('category') }}"
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">
            </div>
            <div>
                <label class="block text-gray-700 mb-2">Icon (FontAwesome class)</label>
                <input type="text" 
                       name="icon" 
                       value="{{ isset($skill) ? $skill->icon : old('icon') }}"
                       placeholder="fa-brands fa-php"
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">
            </div>
            <div>
                <label class="block text-gray-700 mb-2">Level (1-10)</label>
                <input type="number" 
                       name="level" 
                       value="{{ isset($skill) ? $skill->level : old('level', 5) }}"
                       min="1" max="10"
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">
            </div>
            <div>
                <label class="block text-gray-700 mb-2">Color</label>
                <input type="text" 
                       name="color" 
                       value="{{ isset($skill) ? $skill->color : old('color', '#3B82F6') }}"
                       placeholder="#3B82F6"
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">
            </div>
            <div>
                <label class="block text-gray-700 mb-2">Order</label>
                <input type="number" 
                       name="order" 
                       value="{{ isset($skill) ? $skill->order : old('order', 0) }}"
                       min="0"
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">
            </div>
        </div>

        <div class="mt-4">
            <label class="flex items-center">
                <input type="checkbox" 
                       name="is_active" 
                       value="1"
                       {{ isset($skill) && $skill->is_active ? 'checked' : 'checked' }}
                       class="rounded border-gray-300 text-blue-600">
                <span class="ml-2 text-gray-700">Active</span>
            </label>
        </div>

        <div class="mt-6">
            <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
                {{ isset($skill) ? 'Update' : 'Save' }}
            </button>
            <a href="{{ route('admin.skills.index') }}" class="ml-2 text-gray-600 hover:text-gray-800">
                Cancel
            </a>
        </div>
    </form>
</div>
@endsection