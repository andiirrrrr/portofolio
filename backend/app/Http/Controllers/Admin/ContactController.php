<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    public function index()
    {
        $contacts = Contact::orderBy('created_at', 'desc')->get();
        return view('admin.contacts.index', compact('contacts'));
    }

    public function show(Contact $contact)
    {
        // Tandai sebagai sudah dibaca
        if (!$contact->is_read) {
            $contact->update(['is_read' => true]);
        }
        
        return view('admin.contacts.show', compact('contact'));
    }

    public function destroy(Contact $contact)
    {
        $contact->delete();
        return redirect()->route('admin.contacts.index')
            ->with('success', 'Message deleted successfully!');
    }

    public function markAsRead(Contact $contact)
    {
        $contact->update(['is_read' => true]);
        return redirect()->route('admin.contacts.index')
            ->with('success', 'Message marked as read!');
    }

    public function markAsReplied(Contact $contact)
    {
        $contact->update([
            'is_replied' => true,
            'replied_at' => now(),
        ]);
        return redirect()->route('admin.contacts.index')
            ->with('success', 'Message marked as replied!');
    }
}