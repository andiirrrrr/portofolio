@extends('admin.layouts.app')

@section('title', 'Certificates')
@section('header', 'Certificate Management')

@section('content')
<div class="bg-white rounded-lg shadow p-6">
    <div class="flex justify-between mb-4">
        <h3 class="text-lg font-semibold">Certificates</h3>
        <a href="{{ route('admin.certificates.create') }}" 
           class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm">
            + Add Certificate
        </a>
    </div>

    @if($certificates->isEmpty())
        <p class="text-gray-500 text-center py-4">No certificates yet. Add your first certificate!</p>
    @else
        <div class="space-y-4">
            @foreach($certificates as $cert)
            <div class="border rounded-lg p-4 hover:shadow transition">
                <div class="flex items-start space-x-4">
                    @if($cert->image)
                        <img src="{{ asset('storage/' . $cert->image) }}" 
                             alt="{{ $cert->name }}"
                             class="w-16 h-16 object-cover rounded">
                    @endif
                    <div class="flex-1">
                        <h4 class="text-lg font-semibold">{{ $cert->name }}</h4>
                        <p class="text-gray-600">{{ $cert->issuer }}</p>
                        <p class="text-sm text-gray-500">
                            Issued: {{ $cert->issued_date->format('M Y') }}
                            @if($cert->expiry_date)
                                - Expires: {{ $cert->expiry_date->format('M Y') }}
                            @endif
                        </p>
                        @if($cert->credential_id)
                            <p class="text-sm text-gray-500">ID: {{ $cert->credential_id }}</p>
                        @endif
                    </div>
                    <div class="flex space-x-2">
                        <span class="px-2 py-1 rounded-full text-xs {{ $cert->is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700' }}">
                            {{ $cert->is_active ? 'Active' : 'Inactive' }}
                        </span>
                        <a href="{{ route('admin.certificates.edit', $cert->id) }}" 
                           class="text-blue-600 hover:text-blue-800 text-sm">Edit</a>
                        <form action="{{ route('admin.certificates.destroy', $cert->id) }}" method="POST" class="inline">
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