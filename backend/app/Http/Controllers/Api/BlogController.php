<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\BlogRequest;
use App\Http\Resources\BlogResource;
use App\Models\Blog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class BlogController extends ApiController
{
    public function index(Request $request)
    {
        $query = Blog::query();

        // Show only published for public
        if (!$request->user()) {
            $query->where('is_published', true);
        }

        // Filter by category
        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        // Search
        if ($request->has('search')) {
            $query->where('title', 'like', '%' . $request->search . '%')
                ->orWhere('content', 'like', '%' . $request->search . '%');
        }

        $blogs = $query->orderBy('published_at', 'desc')
            ->paginate($this->getPerPage($request));

        return $this->paginated($blogs, BlogResource::collection($blogs));
    }

    public function store(BlogRequest $request)
    {
        $data = $request->validated();

        if ($request->hasFile('featured_image')) {
            $path = $request->file('featured_image')->store('blogs', 'public');
            $data['featured_image'] = $path;
        }

        // Convert tags to JSON
        if (isset($data['tags'])) {
            $data['tags'] = json_encode($data['tags']);
        }

        $blog = Blog::create($data);
        return $this->success(new BlogResource($blog), 'Blog created successfully', 201);
    }

    public function show(Blog $blog)
    {
        // Increment views
        $blog->increment('views');

        return $this->success(new BlogResource($blog));
    }

    public function update(BlogRequest $request, Blog $blog)
    {
        $data = $request->validated();

        if ($request->hasFile('featured_image')) {
            if ($blog->featured_image) {
                Storage::disk('public')->delete($blog->featured_image);
            }
            $path = $request->file('featured_image')->store('blogs', 'public');
            $data['featured_image'] = $path;
        }

        if (isset($data['tags'])) {
            $data['tags'] = json_encode($data['tags']);
        }

        $blog->update($data);
        return $this->success(new BlogResource($blog), 'Blog updated successfully');
    }

    public function destroy(Blog $blog)
    {
        if ($blog->featured_image) {
            Storage::disk('public')->delete($blog->featured_image);
        }
        $blog->delete();
        return $this->success(null, 'Blog deleted successfully');
    }

    public function categories()
    {
        $categories = Blog::select('category')
            ->distinct()
            ->whereNotNull('category')
            ->pluck('category');

        return $this->success($categories);
    }
}