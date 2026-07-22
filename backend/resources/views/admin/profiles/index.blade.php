@extends('admin.layouts.app')

@section('title', 'Profile')
@section('header', 'Profile Management')

@section('content')
<div class="bg-white rounded-lg shadow p-6">
    @if($profile)
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                @if($profile->profile_image)
                    <img src="{{ asset('storage/' . $profile->profile_image) }}" 
                         alt="Profile" 
                         class="w-32 h-32 rounded-full object-cover">
                @endif
                <div class="mt-4">
                    <p><strong>Name:</strong> {{ $profile->full_name }}</p>
                    <p><strong>Title:</strong> {{ $profile->title }}</p>
                    <p><strong>Email:</strong> {{ $profile->email }}</p>
                    <p><strong>Phone:</strong> {{ $profile->phone }}</p>
                    <p><strong>Location:</strong> {{ $profile->location }}</p>
                </div>
            </div>
            <div>
                <div class="space-y-2">
                    <p><strong>Bio:</strong></p>
                    <p class="text-gray-600">{{ $profile->bio }}</p>
                    <p><strong>About Me:</strong></p>
                    <p class="text-gray-600">{{ $profile->about_me }}</p>
                    <p><strong>Professional Summary:</strong></p>
                    <p class="text-gray-600">{{ $profile->professional_summary }}</p>
                </div>
                <div class="mt-4">
                    <a href="{{ route('admin.profile.edit', $profile->id) }}" 
                       class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                        Edit Profile
                    </a>
                </div>
            </div>
        </div>
    @else
        <p class="text-gray-500">Profile not set up yet.</p>
        <a href="{{ route('admin.profile.create') }}" 
           class="inline-block mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
            Create Profile
        </a>
    @endif
</div>
@endsection