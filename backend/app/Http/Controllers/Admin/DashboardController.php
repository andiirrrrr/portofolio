<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use App\Models\Project;
use App\Models\Blog;
use App\Models\Profile;

class DashboardController extends Controller
{
    public function index()
    {
        $data = [
            'total_projects' => Project::count(),
            'total_blogs' => Blog::where('is_published', true)->count(),
            'unread_messages' => Contact::where('is_read', false)->count(),
            'total_messages' => Contact::count(),
            'profile' => Profile::first(),
        ];
        
        return view('admin.dashboard.index', $data);
    }
}