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
                <label class="block text-gray-700 font-medium mb-2">Certificate Name *</label>
                <input type="text" 
                       name="name" 
                       value="{{ old('name', $certificate->name ?? '') }}"
                       class="w-full px-3 py-2 border @error('name') border-red-500 @else border-gray-300 @enderror rounded-lg focus:outline-none focus:border-blue-500"
                       required>
                @error('name')
                    <p class="text-red-500 text-xs mt-1">{{ $message }}</p>
                @enderror
            </div>
            <div>
                <label class="block text-gray-700 font-medium mb-2">Issuer *</label>
                <input type="text" 
                       name="issuer" 
                       value="{{ old('issuer', $certificate->issuer ?? '') }}"
                       class="w-full px-3 py-2 border @error('issuer') border-red-500 @else border-gray-300 @enderror rounded-lg focus:outline-none focus:border-blue-500"
                       required>
                @error('issuer')
                    <p class="text-red-500 text-xs mt-1">{{ $message }}</p>
                @enderror
            </div>
            <div>
                <label class="block text-gray-700 font-medium mb-2">Issued Date *</label>
                <input type="date" 
                       name="issued_date" 
                       value="{{ old('issued_date', isset($certificate) && $certificate->issued_date ? $certificate->issued_date->format('Y-m-d') : '') }}"
                       class="w-full px-3 py-2 border @error('issued_date') border-red-500 @else border-gray-300 @enderror rounded-lg focus:outline-none focus:border-blue-500"
                       required>
                @error('issued_date')
                    <p class="text-red-500 text-xs mt-1">{{ $message }}</p>
                @enderror
            </div>
            <div>
                <label class="block text-gray-700 font-medium mb-2">Expiry Date</label>
                <input type="date" 
                       name="expiry_date" 
                       value="{{ old('expiry_date', isset($certificate) && $certificate->expiry_date ? $certificate->expiry_date->format('Y-m-d') : '') }}"
                       class="w-full px-3 py-2 border @error('expiry_date') border-red-500 @else border-gray-300 @enderror rounded-lg focus:outline-none focus:border-blue-500">
                @error('expiry_date')
                    <p class="text-red-500 text-xs mt-1">{{ $message }}</p>
                @enderror
            </div>
            <div>
                <label class="block text-gray-700 font-medium mb-2">Credential ID</label>
                <input type="text" 
                       name="credential_id" 
                       value="{{ old('credential_id', $certificate->credential_id ?? '') }}"
                       class="w-full px-3 py-2 border @error('credential_id') border-red-500 @else border-gray-300 @enderror rounded-lg focus:outline-none focus:border-blue-500">
                @error('credential_id')
                    <p class="text-red-500 text-xs mt-1">{{ $message }}</p>
                @enderror
            </div>
            <div>
                <label class="block text-gray-700 font-medium mb-2">Credential URL</label>
                <input type="url" 
                       name="credential_url" 
                       placeholder="https://..."
                       value="{{ old('credential_url', $certificate->credential_url ?? '') }}"
                       class="w-full px-3 py-2 border @error('credential_url') border-red-500 @else border-gray-300 @enderror rounded-lg focus:outline-none focus:border-blue-500">
                @error('credential_url')
                    <p class="text-red-500 text-xs mt-1">{{ $message }}</p>
                @enderror
            </div>
            <div>
                <label class="block text-gray-700 font-medium mb-2">Certificate Image</label>
                <input type="file" 
                       name="image" 
                       id="certificateImageInput"
                       accept="image/jpeg,image/png,image/jpg,image/webp,image/svg+xml"
                       class="w-full px-3 py-2 border @error('image') border-red-500 @else border-gray-300 @enderror rounded-lg focus:outline-none focus:border-blue-500">
                <p class="text-xs text-gray-500 mt-1">Format: JPG, PNG, WebP, SVG (Maks. 10MB)</p>
                @error('image')
                    <p class="text-red-500 text-xs mt-1">{{ $message }}</p>
                @enderror
                
                <div id="imagePreviewContainer" class="mt-3 {{ isset($certificate) && $certificate->image ? '' : 'hidden' }}">
                    <p class="text-xs text-gray-500 mb-1">Preview:</p>
                    <img id="imagePreview" 
                         src="{{ isset($certificate) && $certificate->image ? asset('storage/' . $certificate->image) : '' }}" 
                         alt="Preview" 
                         class="w-32 h-24 object-cover rounded-lg border border-gray-200 shadow-sm">
                </div>
            </div>
            <div>
                <label class="block text-gray-700 font-medium mb-2">Order</label>
                <input type="number" 
                       name="order" 
                       value="{{ old('order', $certificate->order ?? 0) }}"
                       min="0"
                       class="w-full px-3 py-2 border @error('order') border-red-500 @else border-gray-300 @enderror rounded-lg focus:outline-none focus:border-blue-500">
                @error('order')
                    <p class="text-red-500 text-xs mt-1">{{ $message }}</p>
                @enderror
            </div>
        </div>

        <div class="mt-4">
            <label class="flex items-center">
                <input type="checkbox" 
                       name="is_active" 
                       value="1"
                       {{ old('is_active', isset($certificate) ? $certificate->is_active : true) ? 'checked' : '' }}
                       class="rounded border-gray-300 text-blue-600">
                <span class="ml-2 text-gray-700 font-medium">Active</span>
            </label>
        </div>

        <div class="mt-6">
            <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium">
                {{ isset($certificate) ? 'Update' : 'Save' }}
            </button>
            <a href="{{ route('admin.certificates.index') }}" class="ml-2 text-gray-600 hover:text-gray-800">
                Cancel
            </a>
        </div>
    </form>
</div>

@push('scripts')
<script>
    const input = document.getElementById('certificateImageInput');
    const previewContainer = document.getElementById('imagePreviewContainer');
    const preview = document.getElementById('imagePreview');

    if (input) {
        input.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(evt) {
                    preview.src = evt.target.result;
                    previewContainer.classList.remove('hidden');
                }
                reader.readAsDataURL(file);
            }
        });
    }
</script>
@endpush
@endsection