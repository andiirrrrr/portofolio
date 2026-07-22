<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Skill;
use Illuminate\Http\Request;

class SkillController extends Controller
{
    public function index()
    {
        $skills = Skill::orderBy('order')->get();
        return view('admin.skills.index', compact('skills'));
    }

    public function create()
    {
        return view('admin.skills.form');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'nullable|string|max:255',
            'icon' => 'nullable|string|max:255',
            'level' => 'nullable|integer|min:1|max:10',
            'color' => 'nullable|string|max:50',
            'order' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
        ]);

        Skill::create($data);
        return redirect()->route('admin.skills.index')
            ->with('success', 'Skill created successfully!');
    }

    public function edit(Skill $skill)
    {
        return view('admin.skills.form', compact('skill'));
    }

    public function update(Request $request, Skill $skill)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'nullable|string|max:255',
            'icon' => 'nullable|string|max:255',
            'level' => 'nullable|integer|min:1|max:10',
            'color' => 'nullable|string|max:50',
            'order' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
        ]);

        $skill->update($data);
        return redirect()->route('admin.skills.index')
            ->with('success', 'Skill updated successfully!');
    }

    public function destroy(Skill $skill)
    {
        $skill->delete();
        return redirect()->route('admin.skills.index')
            ->with('success', 'Skill deleted successfully!');
    }
}