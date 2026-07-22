<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\EducationRequest;
use App\Http\Resources\EducationResource;
use App\Models\Education;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class EducationController extends ApiController
{
    public function index(Request $request)
    {
        $query = Education::query();

        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        $educations = $query->orderBy('order')
            ->orderBy('start_date', 'desc')
            ->get();

        return $this->success(EducationResource::collection($educations));
    }

    public function store(EducationRequest $request)
    {
        $data = $request->validated();

        if ($request->hasFile('institution_logo')) {
            $path = $request->file('institution_logo')->store('educations', 'public');
            $data['institution_logo'] = $path;
        }

        $education = Education::create($data);
        return $this->success(new EducationResource($education), 'Education created successfully', 201);
    }

    public function show(Education $education)
    {
        return $this->success(new EducationResource($education));
    }

    public function update(EducationRequest $request, Education $education)
    {
        $data = $request->validated();

        if ($request->hasFile('institution_logo')) {
            if ($education->institution_logo) {
                Storage::disk('public')->delete($education->institution_logo);
            }
            $path = $request->file('institution_logo')->store('educations', 'public');
            $data['institution_logo'] = $path;
        }

        $education->update($data);
        return $this->success(new EducationResource($education), 'Education updated successfully');
    }

    public function destroy(Education $education)
    {
        if ($education->institution_logo) {
            Storage::disk('public')->delete($education->institution_logo);
        }
        $education->delete();
        return $this->success(null, 'Education deleted successfully');
    }

    public function updateOrder(Request $request)
    {
        $request->validate([
            'educations' => 'required|array',
            'educations.*.id' => 'required|exists:educations,id',
            'educations.*.order' => 'required|integer|min:0',
        ]);

        foreach ($request->educations as $item) {
            Education::where('id', $item['id'])->update(['order' => $item['order']]);
        }

        return $this->success(null, 'Education order updated successfully');
    }
}