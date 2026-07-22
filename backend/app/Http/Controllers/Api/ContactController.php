<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\ContactRequest;
use App\Http\Resources\ContactResource;
use App\Models\Contact;
use Illuminate\Http\Request;

class ContactController extends ApiController
{
    public function index(Request $request)
    {
        $query = Contact::query();

        // Filter by read status
        if ($request->has('is_read')) {
            $query->where('is_read', $request->boolean('is_read'));
        }

        $contacts = $query->orderBy('created_at', 'desc')
            ->paginate($this->getPerPage($request));

        return $this->paginated($contacts, ContactResource::collection($contacts));
    }

    public function store(ContactRequest $request)
    {
        $contact = Contact::create($request->validated());
        return $this->success(new ContactResource($contact), 'Message sent successfully', 201);
    }

    public function show(Contact $contact)
    {
        // Mark as read
        if (!$contact->is_read) {
            $contact->update(['is_read' => true]);
        }

        return $this->success(new ContactResource($contact));
    }

    public function destroy(Contact $contact)
    {
        $contact->delete();
        return $this->success(null, 'Message deleted successfully');
    }

    public function markAsRead(Contact $contact)
    {
        $contact->update(['is_read' => true]);
        return $this->success(new ContactResource($contact), 'Message marked as read');
    }

    public function markAsReplied(Contact $contact)
    {
        $contact->update([
            'is_replied' => true,
            'replied_at' => now(),
        ]);
        return $this->success(new ContactResource($contact), 'Message marked as replied');
    }

    public function unreadCount()
    {
        $count = Contact::where('is_read', false)->count();
        return $this->success(['count' => $count]);
    }
}