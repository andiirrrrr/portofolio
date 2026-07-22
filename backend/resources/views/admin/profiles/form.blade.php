@extends('admin.layouts.app')

@section('title', isset($profile) ? 'Edit Profile' : 'Create Profile')
@section('header', isset($profile) ? 'Edit Profile' : 'Create Profile')

@section('content')
<div class="bg-white rounded-lg shadow p-6">
    <form action="{{ isset($profile) ? route('admin.profile.update', $profile->id) : route('admin.profile.store') }}" 
          method="POST" 
          enctype="multipart/form-data">
        @csrf
        @if(isset($profile))
            @method('PUT')
        @endif

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label class="block text-gray-700 mb-2">Full Name *</label>
                <input type="text" 
                       name="full_name" 
                       value="{{ isset($profile) ? $profile->full_name : old('full_name') }}"
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                       required>
            </div>
            <div>
                <label class="block text-gray-700 mb-2">Title</label>
                <input type="text" 
                       name="title" 
                       value="{{ isset($profile) ? $profile->title : old('title') }}"
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">
            </div>
            <div>
                <label class="block text-gray-700 mb-2">Email *</label>
                <input type="email" 
                       name="email" 
                       value="{{ isset($profile) ? $profile->email : old('email') }}"
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                       required>
            </div>
            <div>
                <label class="block text-gray-700 mb-2">Phone</label>
                <input type="text" 
                       name="phone" 
                       value="{{ isset($profile) ? $profile->phone : old('phone') }}"
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">
            </div>
            <div>
                <label class="block text-gray-700 mb-2">Location</label>
                <input type="text" 
                       name="location" 
                       value="{{ isset($profile) ? $profile->location : old('location') }}"
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">
            </div>
            <div>
                <label class="block text-gray-700 mb-2">Profile Image</label>
                <input type="file" 
                       name="profile_image" 
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">
                @if(isset($profile) && $profile->profile_image)
                    <p class="mt-2 text-sm text-gray-500">Current: {{ basename($profile->profile_image) }}</p>
                @endif
            </div>
            <div>
                <label class="block text-gray-700 mb-2">CV File</label>
                <input type="file" 
                       name="cv_file" 
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">
                @if(isset($profile) && $profile->cv_file)
                    <p class="mt-2 text-sm text-gray-500">Current: {{ basename($profile->cv_file) }}</p>
                @endif
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            <div>
                <label class="block text-gray-700 mb-2">GitHub URL</label>
                <input type="url" 
                       name="github_url" 
                       value="{{ isset($profile) ? $profile->github_url : old('github_url') }}"
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">
            </div>
            <div>
                <label class="block text-gray-700 mb-2">LinkedIn URL</label>
                <input type="url" 
                       name="linkedin_url" 
                       value="{{ isset($profile) ? $profile->linkedin_url : old('linkedin_url') }}"
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">
            </div>
            <div>
                <label class="block text-gray-700 mb-2">Instagram URL</label>
                <input type="url" 
                       name="instagram_url" 
                       value="{{ isset($profile) ? $profile->instagram_url : old('instagram_url') }}"
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">
            </div>
            <div>
                <label class="block text-gray-700 mb-2">YouTube URL</label>
                <input type="url" 
                       name="youtube_url" 
                       value="{{ isset($profile) ? $profile->youtube_url : old('youtube_url') }}"
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">
            </div>
            <div>
                <label class="block text-gray-700 mb-2">Website URL</label>
                <input type="url" 
                       name="website_url" 
                       value="{{ isset($profile) ? $profile->website_url : old('website_url') }}"
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">
            </div>
        </div>

        <div class="mt-4">
            <label class="block text-gray-700 mb-2">Bio</label>
            <textarea name="bio" 
                      rows="3"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">{{ isset($profile) ? $profile->bio : old('bio') }}</textarea>
        </div>
        <div class="mt-4">
            <label class="block text-gray-700 mb-2">About Me</label>
            <textarea name="about_me" 
                      rows="4"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">{{ isset($profile) ? $profile->about_me : old('about_me') }}</textarea>
        </div>
        <div class="mt-4">
            <label class="block text-gray-700 mb-2">Professional Summary</label>
            <textarea name="professional_summary" 
                      rows="4"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">{{ isset($profile) ? $profile->professional_summary : old('professional_summary') }}</textarea>
        </div>

        <div class="mt-6">
            <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
                {{ isset($profile) ? 'Update' : 'Save' }}
            </button>
            <a href="{{ route('admin.profile.index') }}" class="ml-2 text-gray-600 hover:text-gray-800">
                Cancel
            </a>
        </div>
    </form>
</div>
@endsection