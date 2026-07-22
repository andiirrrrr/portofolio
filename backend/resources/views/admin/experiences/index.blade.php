@extends('admin.layouts.app')

@section('title', 'Experiences')
@section('header', 'Experience Management')

@section('content')
<div class="bg-white rounded-lg shadow p-6">
    <div class="flex justify-between mb-4">
        <h3 class="text-lg font-semibold">Work Experiences</h3>
        <a href="{{ route('admin.experiences.create') }}" 
           class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm">
            + Add Experience
        </a>
    </div>

    @if($experiences->isEmpty())
        <p class="text-gray-500 text-center py-4">No experiences yet. Add your first work experience!</p>
    @else
        <div class="space-y-4">
            @foreach($experiences as $exp)
            <div class="border rounded-lg p-4 hover:shadow transition">
                <div class="flex justify-between items-start">
                    <div>
                        <h4 class="text-lg font-semibold">{{ $exp->company_name }}</h4>
                        <p class="text-gray-600">{{ $exp->position }}</p>
                        <p class="text-sm text-gray-500">
                            {{ $exp->start_date->format('M Y') }} - 
                            {{ $exp->is_current ? 'Present' : $exp->end_date?->format('M Y') }}
                        </p>
                        @if($exp->description)
                            <p class="text-gray-700 mt-2">{{ Str::limit($exp->description, 150) }}</p>
                        @endif
                    </div>
                    <div class="flex space-x-2">
                        <span class="px-2 py-1 rounded-full text-xs {{ $exp->is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700' }}">
                            {{ $exp->is_active ? 'Active' : 'Inactive' }}
                        </span>
                        <a href="{{ route('admin.experiences.edit', $exp->id) }}" 
                           class="text-blue-600 hover:text-blue-800 text-sm">Edit</a>
                        <form action="{{ route('admin.experiences.destroy', $exp->id) }}" method="POST" class="inline">
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