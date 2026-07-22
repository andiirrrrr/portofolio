@extends('admin.layouts.app')

@section('title', isset($certificate) ? 'Edit Certificate' : 'Create Certificate')
@section('header', isset($certificate) ? 'Edit Certificate' : 'Create Certificate')

@section('content')
<div class="bg-white rounded-lg shadow p-6">
    <form action="{{ isset($certificate) ? route('admin.certificates.update', $certificate->id) : route('admin.certificates.store') }}" 
          method="POST" 
          enctype="multipart/form-data">
        @csrf
        @if(isset($certificate))
            @method('PUT')
        @endif

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label class="block text-gray-700 mb-2">Certificate Name *</label>
                <input type="text" 
                       name="name" 
                       value="{{ isset($certificate) ? $certificate->name : old('name') }}"
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                       required>
            </div>
            <div>
                <label class="block text-gray-700 mb-2">Issuer *</label>
                <input type="text" 
                       name="issuer" 
                       value="{{ isset($certificate) ? $certificate->issuer : old('issuer') }}"
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                       required>
            </div>
            <div>
                <label class="block text-gray-700 mb-2">Issued Date *</label>
                <input type="date" 
                       name="issued_date" 
                       value="{{ isset($certificate) ? $certificate->issued_date->format('Y-m-d') : old('issued_date') }}"
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                       required>
            </div>
            <div>
                <label class="block text-gray-700 mb-2">Expiry Date</label>
                <input type="date" 
                       name="expiry_date" 
                       value="{{ isset($certificate) && $certificate->expiry_date ? $certificate->expiry_date->format('Y-m-d') : old('expiry_date') }}"
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">
            </div>
            <div>
                <label class="block text-gray-700 mb-2">Credential ID</label>
                <input type="text" 
                       name="credential_id" 
                       value="{{ isset($certificate) ? $certificate->credential_id : old('credential_id') }}"
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">
            </div>
            <div>
                <label class="block text-gray-700 mb-2">Credential URL</label>
                <input type="url" 
                       name="credential_url" 
                       value="{{ isset($certificate) ? $certificate->credential_url : old('credential_url') }}"
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">
            </div>
            <div>
                <label class="block text-gray-700 mb-2">Certificate Image</label>
                <input type="file" 
                       name="image" 
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">
                @if(isset($certificate) && $certificate->image)
                    <p class="mt-2 text-sm text-gray-500">Current: {{ basename($certificate->image) }}</p>
                @endif
            </div>
            <div>
                <label class="block text-gray-700 mb-2">Order</label>
                <input type="number" 
                       name="order" 
                       value="{{ isset($certificate) ? $certificate->order : old('order', 0) }}"
                       min="0"
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">
            </div>
        </div>

        <div class="mt-4">
            <label class="flex items-center">
                <input type="checkbox" 
                       name="is_active" 
                       value="1"
                       {{ isset($certificate) && $certificate->is_active ? 'checked' : 'checked' }}
                       class="rounded border-gray-300 text-blue-600">
                <span class="ml-2 text-gray-700">Active</span>
            </label>
        </div>

        <div class="mt-6">
            <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
                {{ isset($certificate) ? 'Update' : 'Save' }}
            </button>
            <a href="{{ route('admin.certificates.index') }}" class="ml-2 text-gray-600 hover:text-gray-800">
                Cancel
            </a>
        </div>
    </form>
</div>
@endsection