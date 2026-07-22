@extends('admin.layouts.app')

@section('title', 'Dashboard')
@section('header', 'Dashboard')

@section('content')
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
            <div class="p-3 bg-blue-100 rounded-full">
                <i class="fas fa-folder-open text-blue-600 text-xl"></i>
            </div>
            <div class="ml-4">
                <p class="text-gray-500 text-sm">Total Projects</p>
                <p class="text-2xl font-bold">{{ $total_projects ?? 0 }}</p>
            </div>
        </div>
    </div>
    
    <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
            <div class="p-3 bg-green-100 rounded-full">
                <i class="fas fa-blog text-green-600 text-xl"></i>
            </div>
            <div class="ml-4">
                <p class="text-gray-500 text-sm">Published Blogs</p>
                <p class="text-2xl font-bold">{{ $total_blogs ?? 0 }}</p>
            </div>
        </div>
    </div>
    
    <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
            <div class="p-3 bg-red-100 rounded-full">
                <i class="fas fa-envelope text-red-600 text-xl"></i>
            </div>
            <div class="ml-4">
                <p class="text-gray-500 text-sm">Unread Messages</p>
                <p class="text-2xl font-bold">{{ $unread_messages ?? 0 }}</p>
            </div>
        </div>
    </div>
    
    <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
            <div class="p-3 bg-purple-100 rounded-full">
                <i class="fas fa-inbox text-purple-600 text-xl"></i>
            </div>
            <div class="ml-4">
                <p class="text-gray-500 text-sm">Total Messages</p>
                <p class="text-2xl font-bold">{{ $total_messages ?? 0 }}</p>
            </div>
        </div>
    </div>
</div>

<div class="bg-white rounded-lg shadow p-6">
    <h3 class="text-lg font-semibold text-gray-800 mb-4">Profile Status</h3>
    @if($profile)
        <div class="flex items-center justify-between">
            <div>
                <p class="text-gray-600">Name: <strong>{{ $profile->full_name ?? 'Not set' }}</strong></p>
                <p class="text-gray-600">Email: <strong>{{ $profile->email ?? 'Not set' }}</strong></p>
                <p class="text-gray-600">Title: <strong>{{ $profile->title ?? 'Not set' }}</strong></p>
            </div>
            <a href="#" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm">
                Edit Profile
            </a>
        </div>
    @else
        <p class="text-gray-500">Profile not set up yet. 
            <a href="#" class="text-blue-600 hover:underline">Create profile</a>
        </p>
    @endif
</div>
@endsection