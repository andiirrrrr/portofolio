<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\ProjectRequest;
use App\Http\Resources\ProjectResource;
use App\Models\Project;
use App\Models\ProjectImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProjectController extends ApiController
{
    public function index(Request $request)
    {
        $query = Project::query()->with('images');

        // Filter by category
        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        // Filter by featured
        if ($request->has('is_featured')) {
            $query->where('is_featured', $request->boolean('is_featured'));
        }

        // Filter by active
        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        // Search
        if ($request->has('search')) {
            $query->where('title', 'like', '%' . $request->search . '%')
                ->orWhere('short_description', 'like', '%' . $request->search . '%');
        }

        $projects = $query->orderBy('order')
            ->orderBy('created_at', 'desc')
            ->paginate($this->getPerPage($request));

        return $this->paginated($projects, ProjectResource::collection($projects));
    }

    public function store(ProjectRequest $request)
    {
        $data = $request->validated();

        // Handle thumbnail
        if ($request->hasFile('thumbnail')) {
            $path = $request->file('thumbnail')->store('projects/thumbnails', 'public');
            $data['thumbnail'] = $path;
        }

        // Convert arrays to JSON
        if (isset($data['tech_stack'])) {
            $data['tech_stack'] = json_encode($data['tech_stack']);
        }
        if (isset($data['key_features'])) {
            $data['key_features'] = json_encode($data['key_features']);
        }

        $project = Project::create($data);

        // Handle project images
        if ($request->has('images') && is_array($request->images)) {
            foreach ($request->images as $index => $imageData) {
                ProjectImage::create([
                    'project_id' => $project->id,
                    'image_path' => $imageData['path'] ?? '',
                    'caption' => $imageData['caption'] ?? null,
                    'order' => $imageData['order'] ?? $index,
                ]);
            }
        }

        return $this->success(new ProjectResource($project->load('images')), 'Project created successfully', 201);
    }

    public function show(Project $project)
    {
        return $this->success(new ProjectResource($project->load('images')));
    }

    public function update(ProjectRequest $request, Project $project)
    {
        $data = $request->validated();

        // Handle thumbnail
        if ($request->hasFile('thumbnail')) {
            if ($project->thumbnail) {
                Storage::disk('public')->delete($project->thumbnail);
            }
            $path = $request->file('thumbnail')->store('projects/thumbnails', 'public');
            $data['thumbnail'] = $path;
        }

        // Convert arrays to JSON
        if (isset($data['tech_stack'])) {
            $data['tech_stack'] = json_encode($data['tech_stack']);
        }
        if (isset($data['key_features'])) {
            $data['key_features'] = json_encode($data['key_features']);
        }

        $project->update($data);

        // Handle project images update
        if ($request->has('images')) {
            // Delete old images
            foreach ($project->images as $image) {
                Storage::disk('public')->delete($image->image_path);
            }
            ProjectImage::where('project_id', $project->id)->delete();

            // Create new images
            foreach ($request->images as $index => $imageData) {
                ProjectImage::create([
                    'project_id' => $project->id,
                    'image_path' => $imageData['path'] ?? '',
                    'caption' => $imageData['caption'] ?? null,
                    'order' => $imageData['order'] ?? $index,
                ]);
            }
        }

        return $this->success(new ProjectResource($project->load('images')), 'Project updated successfully');
    }

    public function destroy(Project $project)
    {
        // Delete thumbnail
        if ($project->thumbnail) {
            Storage::disk('public')->delete($project->thumbnail);
        }

        // Delete project images
        foreach ($project->images as $image) {
            Storage::disk('public')->delete($image->image_path);
        }
        ProjectImage::where('project_id', $project->id)->delete();

        $project->delete();
        return $this->success(null, 'Project deleted successfully');
    }

    public function updateOrder(Request $request)
    {
        $request->validate([
            'projects' => 'required|array',
            'projects.*.id' => 'required|exists:projects,id',
            'projects.*.order' => 'required|integer|min:0',
        ]);

        foreach ($request->projects as $item) {
            Project::where('id', $item['id'])->update(['order' => $item['order']]);
        }

        return $this->success(null, 'Project order updated successfully');
    }

    public function uploadImage(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,webp|max:5120',
        ]);

        $path = $request->file('image')->store('projects/temp', 'public');

        return $this->success([
            'path' => $path,
            'url' => url('storage/' . $path),
        ], 'Image uploaded successfully');
    }
}