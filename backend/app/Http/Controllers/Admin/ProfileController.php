<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Profile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    public function index()
    {
        $profile = Profile::first();
        return view('admin.profiles.index', compact('profile'));
    }

    public function create()
    {
        return view('admin.profiles.form');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'full_name' => 'required|string|max:255',
            'title' => 'nullable|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'location' => 'nullable|string|max:255',
            'bio' => 'nullable|string',
            'profile_image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'cv_file' => 'nullable|file|mimes:pdf,doc,docx|max:5120',
            'github_url' => 'nullable|url|max:255',
            'linkedin_url' => 'nullable|url|max:255',
            'instagram_url' => 'nullable|url|max:255',
            'youtube_url' => 'nullable|url|max:255',
            'website_url' => 'nullable|url|max:255',
            'about_me' => 'nullable|string',
            'professional_summary' => 'nullable|string',
        ]);

        if ($request->hasFile('profile_image')) {
            $data['profile_image'] = $request->file('profile_image')->store('profiles', 'public');
        }
        if ($request->hasFile('cv_file')) {
            $data['cv_file'] = $request->file('cv_file')->store('cv', 'public');
        }

        Profile::updateOrCreate([], $data);

        return redirect()->route('admin.profile.index')
            ->with('success', 'Profile saved successfully!');
    }

    public function edit(Profile $profile)
    {
        return view('admin.profiles.form', compact('profile'));
    }

    public function update(Request $request, Profile $profile)
    {
        $data = $request->validate([
            'full_name' => 'required|string|max:255',
            'title' => 'nullable|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'location' => 'nullable|string|max:255',
            'bio' => 'nullable|string',
            'profile_image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'cv_file' => 'nullable|file|mimes:pdf,doc,docx|max:5120',
            'github_url' => 'nullable|url|max:255',
            'linkedin_url' => 'nullable|url|max:255',
            'instagram_url' => 'nullable|url|max:255',
            'youtube_url' => 'nullable|url|max:255',
            'website_url' => 'nullable|url|max:255',
            'about_me' => 'nullable|string',
            'professional_summary' => 'nullable|string',
        ]);

        if ($request->hasFile('profile_image')) {
            if ($profile->profile_image) {
                Storage::disk('public')->delete($profile->profile_image);
            }
            $data['profile_image'] = $request->file('profile_image')->store('profiles', 'public');
        }
        if ($request->hasFile('cv_file')) {
            if ($profile->cv_file) {
                Storage::disk('public')->delete($profile->cv_file);
            }
            $data['cv_file'] = $request->file('cv_file')->store('cv', 'public');
        }

        $profile->update($data);

        return redirect()->route('admin.profile.index')
            ->with('success', 'Profile updated successfully!');
    }
}