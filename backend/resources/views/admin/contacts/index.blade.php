@extends('admin.layouts.app')

@section('title', 'Contacts')
@section('header', 'Contact Messages')

@section('content')
<div class="bg-white rounded-lg shadow p-6">
    <div class="flex justify-between mb-4">
        <h3 class="text-lg font-semibold">Messages from Visitors</h3>
        <div class="flex space-x-2">
            <span class="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm">
                Total: {{ $contacts->count() }}
            </span>
            <span class="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm">
                Unread: {{ $contacts->where('is_read', false)->count() }}
            </span>
        </div>
    </div>

    @if($contacts->isEmpty())
        <p class="text-gray-500 text-center py-8">No messages yet.</p>
    @else
        <div class="overflow-x-auto">
            <table class="w-full">
                <thead>
                    <tr class="border-b">
                        <th class="text-left py-3 px-2">Status</th>
                        <th class="text-left py-3 px-2">Name</th>
                        <th class="text-left py-3 px-2">Email</th>
                        <th class="text-left py-3 px-2">Subject</th>
                        <th class="text-left py-3 px-2">Date</th>
                        <th class="text-left py-3 px-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($contacts as $contact)
                    <tr class="border-b hover:bg-gray-50 transition">
                        <td class="py-3 px-2">
                            <div class="flex space-x-1">
                                @if(!$contact->is_read)
                                    <span class="w-2 h-2 bg-red-500 rounded-full inline-block" title="Unread"></span>
                                @endif
                                @if($contact->is_replied)
                                    <span class="w-2 h-2 bg-green-500 rounded-full inline-block" title="Replied"></span>
                                @endif
                            </div>
                        </td>
                        <td class="py-3 px-2 font-medium">{{ $contact->name }}</td>
                        <td class="py-3 px-2 text-sm">{{ $contact->email }}</td>
                        <td class="py-3 px-2 text-sm">{{ $contact->subject ?? '-' }}</td>
                        <td class="py-3 px-2 text-sm">{{ $contact->created_at->format('d M Y, H:i') }}</td>
                        <td class="py-3 px-2">
                            <div class="flex space-x-2">
                                <a href="{{ route('admin.contacts.show', $contact->id) }}" 
                                   class="text-blue-600 hover:text-blue-800 text-sm">View</a>
                                
                                @if(!$contact->is_read)
                                    <form action="{{ route('admin.contacts.read', $contact->id) }}" method="POST" class="inline">
                                        @csrf
                                        @method('PUT')
                                        <button type="submit" class="text-green-600 hover:text-green-800 text-sm">Mark Read</button>
                                    </form>
                                @endif
                                
                                @if(!$contact->is_replied)
                                    <form action="{{ route('admin.contacts.replied', $contact->id) }}" method="POST" class="inline">
                                        @csrf
                                        @method('PUT')
                                        <button type="submit" class="text-purple-600 hover:text-purple-800 text-sm">Mark Replied</button>
                                    </form>
                                @endif
                                
                                <form action="{{ route('admin.contacts.destroy', $contact->id) }}" method="POST" class="inline">
                                    @csrf
                                    @method('DELETE')
                                    <button type="submit" class="text-red-600 hover:text-red-800 text-sm" 
                                            onclick="return confirm('Delete this message?')">Delete</button>
                                </form>
                            </div>
                        </td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    @endif
</div>
@endsection