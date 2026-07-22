<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Education;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class EducationController extends Controller
{
    public function index()
    {
        $educations = Education::orderBy('order')->orderBy('start_date', 'desc')->get();
        return view('admin.educations.index', compact('educations'));
    }

    public function create()
    {
        return view('admin.educations.form');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'institution_name' => 'required|string|max:255',
            'degree' => 'required|string|max:255',
            'field_of_study' => 'required|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after:start_date',
            'is_current' => 'nullable|boolean',
            'description' => 'nullable|string',
            'gpa' => 'nullable|string|max:10',
            'institution_logo' => 'nullable|image|mimes:jpeg,png,jpg,svg|max:2048',
            'order' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
        ]);

        if ($request->hasFile('institution_logo')) {
            $data['institution_logo'] = $request->file('institution_logo')->store('educations', 'public');
        }

        Education::create($data);

        return redirect()->route('admin.educations.index')
            ->with('success', 'Education created successfully!');
    }

    public function edit(Education $education)
    {
        return view('admin.educations.form', compact('education'));
    }

    public function update(Request $request, Education $education)
    {
        $data = $request->validate([
            'institution_name' => 'required|string|max:255',
            'degree' => 'required|string|max:255',
            'field_of_study' => 'required|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after:start_date',
            'is_current' => 'nullable|boolean',
            'description' => 'nullable|string',
            'gpa' => 'nullable|string|max:10',
            'institution_logo' => 'nullable|image|mimes:jpeg,png,jpg,svg|max:2048',
            'order' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
        ]);

        if ($request->hasFile('institution_logo')) {
            if ($education->institution_logo) {
                Storage::disk('public')->delete($education->institution_logo);
            }
            $data['institution_logo'] = $request->file('institution_logo')->store('educations', 'public');
        }

        $education->update($data);

        return redirect()->route('admin.educations.index')
            ->with('success', 'Education updated successfully!');
    }

    public function destroy(Education $education)
    {
        if ($education->institution_logo) {
            Storage::disk('public')->delete($education->institution_logo);
        }
        $education->delete();
        return redirect()->route('admin.educations.index')
            ->with('success', 'Education deleted successfully!');
    }
}