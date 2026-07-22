<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProjectController extends Controller
{
    public function index()
    {
        $projects = Project::orderBy('order')->orderBy('created_at', 'desc')->get();
        return view('admin.projects.index', compact('projects'));
    }

    public function create()
    {
        return view('admin.projects.form');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'nullable|string|max:255',
            'short_description' => 'required|string|max:500',
            'description' => 'nullable|string',
            'thumbnail' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
            'github_url' => 'nullable|url|max:255',
            'demo_url' => 'nullable|url|max:255',
            'tech_stack' => 'nullable|string', // Ubah dari array ke string
            'key_features' => 'nullable|string', // Ubah dari array ke string
            'order' => 'nullable|integer|min:0',
            'is_featured' => 'nullable|boolean',
            'is_active' => 'nullable|boolean',
            'published_at' => 'nullable|date',
        ]);

        if ($request->hasFile('thumbnail')) {
            $data['thumbnail'] = $request->file('thumbnail')->store('projects/thumbnails', 'public');
        }

        $data['slug'] = Str::slug($request->title);

        // Convert tech_stack dari string (per baris) ke array JSON
        if (!empty($data['tech_stack'])) {
            $techStack = explode("\n", $data['tech_stack']);
            $techStack = array_map('trim', $techStack);
            $techStack = array_filter($techStack, fn($item) => !empty($item));
            $data['tech_stack'] = json_encode(array_values($techStack));
        } else {
            $data['tech_stack'] = null;
        }

        // Convert key_features dari string (per baris) ke array JSON
        if (!empty($data['key_features'])) {
            $keyFeatures = explode("\n", $data['key_features']);
            $keyFeatures = array_map('trim', $keyFeatures);
            $keyFeatures = array_filter($keyFeatures, fn($item) => !empty($item));
            $data['key_features'] = json_encode(array_values($keyFeatures));
        } else {
            $data['key_features'] = null;
        }

        Project::create($data);

        return redirect()->route('admin.projects.index')
            ->with('success', 'Project created successfully!');
    }

    public function edit(Project $project)
    {
        return view('admin.projects.form', compact('project'));
    }

    public function update(Request $request, Project $project)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'nullable|string|max:255',
            'short_description' => 'required|string|max:500',
            'description' => 'nullable|string',
            'thumbnail' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
            'github_url' => 'nullable|url|max:255',
            'demo_url' => 'nullable|url|max:255',
            'tech_stack' => 'nullable|string', // Ubah dari array ke string
            'key_features' => 'nullable|string', // Ubah dari array ke string
            'order' => 'nullable|integer|min:0',
            'is_featured' => 'nullable|boolean',
            'is_active' => 'nullable|boolean',
            'published_at' => 'nullable|date',
        ]);

        if ($request->hasFile('thumbnail')) {
            if ($project->thumbnail) {
                Storage::disk('public')->delete($project->thumbnail);
            }
            $data['thumbnail'] = $request->file('thumbnail')->store('projects/thumbnails', 'public');
        }

        $data['slug'] = Str::slug($request->title);

        // Convert tech_stack dari string (per baris) ke array JSON
        if (!empty($data['tech_stack'])) {
            $techStack = explode("\n", $data['tech_stack']);
            $techStack = array_map('trim', $techStack);
            $techStack = array_filter($techStack, fn($item) => !empty($item));
            $data['tech_stack'] = json_encode(array_values($techStack));
        } else {
            $data['tech_stack'] = null;
        }

        // Convert key_features dari string (per baris) ke array JSON
        if (!empty($data['key_features'])) {
            $keyFeatures = explode("\n", $data['key_features']);
            $keyFeatures = array_map('trim', $keyFeatures);
            $keyFeatures = array_filter($keyFeatures, fn($item) => !empty($item));
            $data['key_features'] = json_encode(array_values($keyFeatures));
        } else {
            $data['key_features'] = null;
        }

        $project->update($data);

        return redirect()->route('admin.projects.index')
            ->with('success', 'Project updated successfully!');
    }

    public function destroy(Project $project)
    {
        if ($project->thumbnail) {
            Storage::disk('public')->delete($project->thumbnail);
        }
        $project->delete();
        return redirect()->route('admin.projects.index')
            ->with('success', 'Project deleted successfully!');
    }
}