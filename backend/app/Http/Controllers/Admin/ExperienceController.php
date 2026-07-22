<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Experience;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ExperienceController extends Controller
{
    public function index()
    {
        $experiences = Experience::orderBy('order')->orderBy('start_date', 'desc')->get();
        return view('admin.experiences.index', compact('experiences'));
    }

    public function create()
    {
        return view('admin.experiences.form');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'company_name' => 'required|string|max:255',
            'position' => 'required|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after:start_date',
            'is_current' => 'nullable|boolean',
            'description' => 'nullable|string',
            'achievements' => 'nullable|string', // Ubah dari array ke string
            'company_website' => 'nullable|url|max:255',
            'company_logo' => 'nullable|image|mimes:jpeg,png,jpg,svg|max:2048',
            'order' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
        ]);

        if ($request->hasFile('company_logo')) {
            $data['company_logo'] = $request->file('company_logo')->store('experiences', 'public');
        }

        // Convert achievements dari string (per baris) ke array
        if (!empty($data['achievements'])) {
            $achievements = explode("\n", $data['achievements']);
            $achievements = array_map('trim', $achievements);
            $achievements = array_filter($achievements, fn($item) => !empty($item));
            $data['achievements'] = json_encode($achievements);
        } else {
            $data['achievements'] = null;
        }

        Experience::create($data);

        return redirect()->route('admin.experiences.index')
            ->with('success', 'Experience created successfully!');
    }

    public function edit(Experience $experience)
    {
        return view('admin.experiences.form', compact('experience'));
    }

    public function update(Request $request, Experience $experience)
    {
        $data = $request->validate([
            'company_name' => 'required|string|max:255',
            'position' => 'required|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after:start_date',
            'is_current' => 'nullable|boolean',
            'description' => 'nullable|string',
            'achievements' => 'nullable|string', // Ubah dari array ke string
            'company_website' => 'nullable|url|max:255',
            'company_logo' => 'nullable|image|mimes:jpeg,png,jpg,svg|max:2048',
            'order' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
        ]);

        if ($request->hasFile('company_logo')) {
            if ($experience->company_logo) {
                Storage::disk('public')->delete($experience->company_logo);
            }
            $data['company_logo'] = $request->file('company_logo')->store('experiences', 'public');
        }

        // Convert achievements dari string (per baris) ke array
        if (!empty($data['achievements'])) {
            $achievements = explode("\n", $data['achievements']);
            $achievements = array_map('trim', $achievements);
            $achievements = array_filter($achievements, fn($item) => !empty($item));
            $data['achievements'] = json_encode($achievements);
        } else {
            $data['achievements'] = null;
        }

        $experience->update($data);

        return redirect()->route('admin.experiences.index')
            ->with('success', 'Experience updated successfully!');
    }

    public function destroy(Experience $experience)
    {
        if ($experience->company_logo) {
            Storage::disk('public')->delete($experience->company_logo);
        }
        $experience->delete();
        return redirect()->route('admin.experiences.index')
            ->with('success', 'Experience deleted successfully!');
    }
}