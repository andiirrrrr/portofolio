<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\ProfileRequest;
use App\Http\Resources\ProfileResource;
use App\Models\Profile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProfileController extends ApiController
{
    /**
     * Get profile (public)
     */
    public function index()
    {
        $profile = Profile::first();
        
        if (!$profile) {
            return $this->success(null, 'Profile not found yet');
        }

        return $this->success(new ProfileResource($profile));
    }

    /**
     * Create or update profile (admin only)
     */
    public function store(ProfileRequest $request)
    {
        $data = $request->validated();

        // Handle profile image upload
        if ($request->hasFile('profile_image')) {
            $path = $request->file('profile_image')->store('profiles', 'public');
            $data['profile_image'] = $path;
        }

        // Handle CV file upload
        if ($request->hasFile('cv_file')) {
            $path = $request->file('cv_file')->store('cv', 'public');
            $data['cv_file'] = $path;
        }

        $profile = Profile::updateOrCreate([], $data);

        return $this->success(new ProfileResource($profile), 'Profile saved successfully');
    }

    /**
     * Update profile (admin only)
     */
    public function update(ProfileRequest $request, Profile $profile)
    {
        $data = $request->validated();

        // Handle profile image upload
        if ($request->hasFile('profile_image')) {
            // Delete old image
            if ($profile->profile_image) {
                Storage::disk('public')->delete($profile->profile_image);
            }
            $path = $request->file('profile_image')->store('profiles', 'public');
            $data['profile_image'] = $path;
        }

        // Handle CV file upload
        if ($request->hasFile('cv_file')) {
            if ($profile->cv_file) {
                Storage::disk('public')->delete($profile->cv_file);
            }
            $path = $request->file('cv_file')->store('cv', 'public');
            $data['cv_file'] = $path;
        }

        $profile->update($data);

        return $this->success(new ProfileResource($profile), 'Profile updated successfully');
    }
}