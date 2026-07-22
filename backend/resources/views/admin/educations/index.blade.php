@extends('admin.layouts.app')

@section('title', 'Educations')
@section('header', 'Education Management')

@section('content')
<div class="bg-white rounded-lg shadow p-6">
    <div class="flex justify-between mb-4">
        <h3 class="text-lg font-semibold">Education History</h3>
        <a href="{{ route('admin.educations.create') }}" 
           class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm">
            + Add Education
        </a>
    </div>

    @if($educations->isEmpty())
        <p class="text-gray-500 text-center py-4">No education records yet. Add your first education!</p>
    @else
        <div class="space-y-4">
            @foreach($educations as $edu)
            <div class="border rounded-lg p-4 hover:shadow transition">
                <div class="flex justify-between items-start">
                    <div>
                        <h4 class="text-lg font-semibold">{{ $edu->institution_name }}</h4>
                        <p class="text-gray-600">{{ $edu->degree }} in {{ $edu->field_of_study }}</p>
                        <p class="text-sm text-gray-500">
                            {{ $edu->start_date->format('M Y') }} - 
                            {{ $edu->is_current ? 'Present' : $edu->end_date?->format('M Y') }}
                        </p>
                        @if($edu->gpa)
                            <p class="text-sm text-gray-600">GPA: {{ $edu->gpa }}</p>
                        @endif
                        @if($edu->description)
                            <p class="text-gray-700 mt-2">{{ Str::limit($edu->description, 150) }}</p>
                        @endif
                    </div>
                    <div class="flex space-x-2">
                        <span class="px-2 py-1 rounded-full text-xs {{ $edu->is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700' }}">
                            {{ $edu->is_active ? 'Active' : 'Inactive' }}
                        </span>
                        <a href="{{ route('admin.educations.edit', $edu->id) }}" 
                           class="text-blue-600 hover:text-blue-800 text-sm">Edit</a>
                        <form action="{{ route('admin.educations.destroy', $edu->id) }}" method="POST" class="inline">
                            @csrf
                            @method('DELETE')
                            <button type="submit" class="text-red-600 hover:text-red-800 text-sm" 
                                    onclick="return confirm('Are you sure?')">Delete</button>
                        </form>
                    </div>
                </div>
            </div>
            @endforeach
        </div>
    @endif
</div>
@endsection