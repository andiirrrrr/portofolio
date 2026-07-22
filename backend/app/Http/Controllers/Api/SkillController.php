<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\SkillRequest;
use App\Http\Resources\SkillResource;
use App\Models\Skill;
use Illuminate\Http\Request;

class SkillController extends ApiController
{
    /**
     * Get all skills (public)
     */
    public function index(Request $request)
    {
        $query = Skill::query();

        // Filter by category
        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        // Filter by active
        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        $skills = $query->orderBy('order')
            ->orderBy('name')
            ->get();

        return $this->success(SkillResource::collection($skills));
    }

    /**
     * Get skill categories
     */
    public function categories()
    {
        $categories = Skill::select('category')
            ->distinct()
            ->whereNotNull('category')
            ->pluck('category');

        return $this->success($categories);
    }

    /**
     * Store new skill (admin only)
     */
    public function store(SkillRequest $request)
    {
        $skill = Skill::create($request->validated());
        return $this->success(new SkillResource($skill), 'Skill created successfully', 201);
    }

    /**
     * Get single skill
     */
    public function show(Skill $skill)
    {
        return $this->success(new SkillResource($skill));
    }

    /**
     * Update skill (admin only)
     */
    public function update(SkillRequest $request, Skill $skill)
    {
        $skill->update($request->validated());
        return $this->success(new SkillResource($skill), 'Skill updated successfully');
    }

    /**
     * Delete skill (admin only)
     */
    public function destroy(Skill $skill)
    {
        $skill->delete();
        return $this->success(null, 'Skill deleted successfully');
    }

    /**
     * Update skill order (admin only)
     */
    public function updateOrder(Request $request)
    {
        $request->validate([
            'skills' => 'required|array',
            'skills.*.id' => 'required|exists:skills,id',
            'skills.*.order' => 'required|integer|min:0',
        ]);

        foreach ($request->skills as $item) {
            Skill::where('id', $item['id'])->update(['order' => $item['order']]);
        }

        return $this->success(null, 'Skill order updated successfully');
    }
}