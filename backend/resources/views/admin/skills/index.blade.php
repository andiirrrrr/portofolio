@extends('admin.layouts.app')

@section('title', 'Skills')
@section('header', 'Skills Management')

@section('content')
<div class="bg-white rounded-lg shadow p-6">
    <div class="flex justify-between mb-4">
        <h3 class="text-lg font-semibold">Skills</h3>
        <a href="{{ route('admin.skills.create') }}" 
           class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm">
            + Add Skill
        </a>
    </div>

    <table class="w-full">
        <thead>
            <tr class="border-b">
                <th class="text-left py-2">Name</th>
                <th class="text-left py-2">Category</th>
                <th class="text-left py-2">Icon</th>
                <th class="text-left py-2">Level</th>
                <th class="text-left py-2">Status</th>
                <th class="text-left py-2">Actions</th>
            </tr>
        </thead>
        <tbody>
            @foreach($skills as $skill)
            <tr class="border-b">
                <td class="py-2">{{ $skill->name }}</td>
                <td class="py-2">{{ $skill->category }}</td>
                <td class="py-2">{{ $skill->icon }}</td>
                <td class="py-2">{{ $skill->level }}/10</td>
                <td class="py-2">
                    <span class="px-2 py-1 rounded-full text-xs {{ $skill->is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700' }}">
                        {{ $skill->is_active ? 'Active' : 'Inactive' }}
                    </span>
                </td>
                <td class="py-2">
                    <a href="{{ route('admin.skills.edit', $skill->id) }}" class="text-blue-600 hover:text-blue-800 mr-2">Edit</a>
                    <form action="{{ route('admin.skills.destroy', $skill->id) }}" method="POST" class="inline">
                        @csrf
                        @method('DELETE')
                        <button type="submit" class="text-red-600 hover:text-red-800" onclick="return confirm('Are you sure?')">Delete</button>
                    </form>
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>

    @if($skills->isEmpty())
        <p class="text-gray-500 text-center py-4">No skills yet. Add your first skill!</p>
    @endif
</div>
@endsection