@extends('admin.layouts.app')

@section('title', 'Projects')
@section('header', 'Project Management')

@section('content')
<div class="bg-white rounded-lg shadow p-6">
    <div class="flex justify-between mb-4">
        <h3 class="text-lg font-semibold">Portfolio Projects</h3>
        <a href="{{ route('admin.projects.create') }}" 
           class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm">
            + Add Project
        </a>
    </div>

    @if($projects->isEmpty())
        <p class="text-gray-500 text-center py-4">No projects yet. Add your first project!</p>
    @else
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            @foreach($projects as $project)
            <div class="border rounded-lg overflow-hidden hover:shadow transition">
                @if($project->thumbnail)
                    <img src="{{ asset('storage/' . $project->thumbnail) }}" 
                         alt="{{ $project->title }}"
                         class="w-full h-48 object-cover">
                @endif
                <div class="p-4">
                    <h4 class="text-lg font-semibold">{{ $project->title }}</h4>
                    <p class="text-sm text-gray-500">{{ $project->category }}</p>
                    <p class="text-gray-600 mt-2 text-sm">{{ Str::limit($project->short_description, 100) }}</p>
                    <div class="flex justify-between items-center mt-3">
                        <div class="flex space-x-2">
                            <span class="px-2 py-1 rounded-full text-xs {{ $project->is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700' }}">
                                {{ $project->is_active ? 'Active' : 'Inactive' }}
                            </span>
                            @if($project->is_featured)
                                <span class="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700">
                                    Featured
                                </span>
                            @endif
                        </div>
                        <div class="flex space-x-2">
                            <a href="{{ route('admin.projects.edit', $project->id) }}" 
                               class="text-blue-600 hover:text-blue-800 text-sm">Edit</a>
                            <form action="{{ route('admin.projects.destroy', $project->id) }}" method="POST" class="inline">
                                @csrf
                                @method('DELETE')
                                <button type="submit" class="text-red-600 hover:text-red-800 text-sm" 
                                        onclick="return confirm('Are you sure?')">Delete</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            @endforeach
        </div>
    @endif
</div>
@endsection