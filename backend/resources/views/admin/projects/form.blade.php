@extends('admin.layouts.app')

@section('title', isset($project) ? 'Edit Project' : 'Create Project')
@section('header', isset($project) ? 'Edit Project' : 'Create Project')

@section('content')
<div class="bg-white rounded-lg shadow p-6">
    <form action="{{ isset($project) ? route('admin.projects.update', $project->id) : route('admin.projects.store') }}" 
          method="POST" 
          enctype="multipart/form-data">
        @csrf
        @if(isset($project))
            @method('PUT')
        @endif

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label class="block text-gray-700 mb-2">Title *</label>
                <input type="text" 
                       name="title" 
                       value="{{ isset($project) ? $project->title : old('title') }}"
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                       required>
            </div>
            <div>
                <label class="block text-gray-700 mb-2">Category</label>
                <input type="text" 
                       name="category" 
                       value="{{ isset($project) ? $project->category : old('category') }}"
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">
            </div>
        </div>

        <div class="mt-4">
            <label class="block text-gray-700 mb-2">Short Description *</label>
            <textarea name="short_description" 
                      rows="2"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      required>{{ isset($project) ? $project->short_description : old('short_description') }}</textarea>
        </div>

        <div class="mt-4">
            <label class="block text-gray-700 mb-2">Full Description</label>
            <textarea name="description" 
                      rows="4"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">{{ isset($project) ? $project->description : old('description') }}</textarea>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div>
                <label class="block text-gray-700 mb-2">Thumbnail</label>
                <input type="file" 
                       name="thumbnail" 
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">
                @if(isset($project) && $project->thumbnail)
                    <p class="mt-2 text-sm text-gray-500">Current: {{ basename($project->thumbnail) }}</p>
                @endif
            </div>
            <div>
                <label class="block text-gray-700 mb-2">Published At</label>
                <input type="datetime-local" 
                       name="published_at" 
                       value="{{ isset($project) && $project->published_at ? $project->published_at->format('Y-m-d\TH:i') : old('published_at') }}"
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">
            </div>
            <div>
                <label class="block text-gray-700 mb-2">GitHub URL</label>
                <input type="url" 
                       name="github_url" 
                       value="{{ isset($project) ? $project->github_url : old('github_url') }}"
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">
            </div>
            <div>
                <label class="block text-gray-700 mb-2">Demo URL</label>
                <input type="url" 
                       name="demo_url" 
                       value="{{ isset($project) ? $project->demo_url : old('demo_url') }}"
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">
            </div>
            <div>
                <label class="block text-gray-700 mb-2">Order</label>
                <input type="number" 
                       name="order" 
                       value="{{ isset($project) ? $project->order : old('order', 0) }}"
                       min="0"
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">
            </div>
        </div>

        <div class="mt-4">
            <label class="block text-gray-700 mb-2">Tech Stack (satu per baris)</label>
            <textarea name="tech_stack" 
                    rows="3"
                    placeholder="Contoh:&#10;Laravel&#10;React&#10;MySQL"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">{{ isset($project) && $project->tech_stack ? implode("\n", json_decode($project->tech_stack, true) ?? []) : old('tech_stack') }}</textarea>
        </div>

        <div class="mt-4">
            <label class="block text-gray-700 mb-2">Key Features (satu per baris)</label>
            <textarea name="key_features" 
                    rows="3"
                    placeholder="Contoh:&#10;User Authentication&#10;Payment Gateway&#10;Admin Dashboard"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">{{ isset($project) && $project->key_features ? implode("\n", json_decode($project->key_features, true) ?? []) : old('key_features') }}</textarea>
        </div>

        <div class="mt-4 flex items-center space-x-4">
            <label class="flex items-center">
                <input type="checkbox" 
                       name="is_featured" 
                       value="1"
                       {{ isset($project) && $project->is_featured ? 'checked' : '' }}
                       class="rounded border-gray-300 text-blue-600">
                <span class="ml-2 text-gray-700">Featured Project</span>
            </label>
            <label class="flex items-center">
                <input type="checkbox" 
                       name="is_active" 
                       value="1"
                       {{ isset($project) && $project->is_active ? 'checked' : 'checked' }}
                       class="rounded border-gray-300 text-blue-600">
                <span class="ml-2 text-gray-700">Active</span>
            </label>
        </div>

        <div class="mt-6">
            <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
                {{ isset($project) ? 'Update' : 'Save' }}
            </button>
            <a href="{{ route('admin.projects.index') }}" class="ml-2 text-gray-600 hover:text-gray-800">
                Cancel
            </a>
        </div>
    </form>
</div>
@endsection