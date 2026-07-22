<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\ExperienceRequest;
use App\Http\Resources\ExperienceResource;
use App\Models\Experience;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ExperienceController extends ApiController
{
    public function index(Request $request)
    {
        $query = Experience::query();

        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        $experiences = $query->orderBy('order')
            ->orderBy('start_date', 'desc')
            ->get();

        return $this->success(ExperienceResource::collection($experiences));
    }

    public function store(ExperienceRequest $request)
    {
        $data = $request->validated();

        if ($request->hasFile('company_logo')) {
            $path = $request->file('company_logo')->store('experiences', 'public');
            $data['company_logo'] = $path;
        }

        $experience = Experience::create($data);
        return $this->success(new ExperienceResource($experience), 'Experience created successfully', 201);
    }

    public function show(Experience $experience)
    {
        return $this->success(new ExperienceResource($experience));
    }

    public function update(ExperienceRequest $request, Experience $experience)
    {
        $data = $request->validated();

        if ($request->hasFile('company_logo')) {
            if ($experience->company_logo) {
                Storage::disk('public')->delete($experience->company_logo);
            }
            $path = $request->file('company_logo')->store('experiences', 'public');
            $data['company_logo'] = $path;
        }

        $experience->update($data);
        return $this->success(new ExperienceResource($experience), 'Experience updated successfully');
    }

    public function destroy(Experience $experience)
    {
        if ($experience->company_logo) {
            Storage::disk('public')->delete($experience->company_logo);
        }
        $experience->delete();
        return $this->success(null, 'Experience deleted successfully');
    }

    public function updateOrder(Request $request)
    {
        $request->validate([
            'experiences' => 'required|array',
            'experiences.*.id' => 'required|exists:experiences,id',
            'experiences.*.order' => 'required|integer|min:0',
        ]);

        foreach ($request->experiences as $item) {
            Experience::where('id', $item['id'])->update(['order' => $item['order']]);
        }

        return $this->success(null, 'Experience order updated successfully');
    }
}