@extends('admin.layouts.app')

@section('title', 'Message Detail')
@section('header', 'Message Detail')

@section('content')
<div class="bg-white rounded-lg shadow p-6">
    <div class="flex justify-between items-start mb-4">
        <div>
            <h3 class="text-lg font-semibold">{{ $contact->subject ?? 'No Subject' }}</h3>
            <p class="text-sm text-gray-500">
                From: <strong>{{ $contact->name }}</strong> ({{ $contact->email }})
            </p>
            @if($contact->phone)
                <p class="text-sm text-gray-500">Phone: {{ $contact->phone }}</p>
            @endif
            <p class="text-sm text-gray-500">Received: {{ $contact->created_at->format('d M Y, H:i') }}</p>
        </div>
        <div class="flex space-x-2">
            <span class="px-3 py-1 rounded-full text-xs {{ $contact->is_read ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700' }}">
                {{ $contact->is_read ? 'Read' : 'Unread' }}
            </span>
            <span class="px-3 py-1 rounded-full text-xs {{ $contact->is_replied ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700' }}">
                {{ $contact->is_replied ? 'Replied' : 'Not Replied' }}
            </span>
        </div>
    </div>

    <div class="border-t pt-4">
        <h4 class="font-semibold text-gray-700 mb-2">Message:</h4>
        <div class="bg-gray-50 p-4 rounded-lg">
            <p class="text-gray-700 whitespace-pre-wrap">{{ $contact->message }}</p>
        </div>
    </div>

    <div class="mt-6 flex space-x-3">
        @if(!$contact->is_read)
            <form action="{{ route('admin.contacts.read', $contact->id) }}" method="POST">
                @csrf
                @method('PUT')
                <button type="submit" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">
                    Mark as Read
                </button>
            </form>
        @endif
        
        @if(!$contact->is_replied)
            <form action="{{ route('admin.contacts.replied', $contact->id) }}" method="POST">
                @csrf
                @method('PUT')
                <button type="submit" class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg">
                    Mark as Replied
                </button>
            </form>
        @endif
        
        <form action="{{ route('admin.contacts.destroy', $contact->id) }}" method="POST">
            @csrf
            @method('DELETE')
            <button type="submit" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg" 
                    onclick="return confirm('Delete this message?')">
                Delete Message
            </button>
        </form>
        
        <a href="{{ route('admin.contacts.index') }}" class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg">
            Back
        </a>
    </div>
</div>
@endsection