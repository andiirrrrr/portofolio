<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\CertificateRequest;
use App\Http\Resources\CertificateResource;
use App\Models\Certificate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CertificateController extends ApiController
{
    public function index(Request $request)
    {
        $query = Certificate::query();

        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        $certificates = $query->orderBy('order')
            ->orderBy('issued_date', 'desc')
            ->get();

        return $this->success(CertificateResource::collection($certificates));
    }

    public function store(CertificateRequest $request)
    {
        $data = $request->validated();

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('certificates', 'public');
            $data['image'] = $path;
        }

        $certificate = Certificate::create($data);
        return $this->success(new CertificateResource($certificate), 'Certificate created successfully', 201);
    }

    public function show(Certificate $certificate)
    {
        return $this->success(new CertificateResource($certificate));
    }

    public function update(CertificateRequest $request, Certificate $certificate)
    {
        $data = $request->validated();

        if ($request->hasFile('image')) {
            if ($certificate->image) {
                Storage::disk('public')->delete($certificate->image);
            }
            $path = $request->file('image')->store('certificates', 'public');
            $data['image'] = $path;
        }

        $certificate->update($data);
        return $this->success(new CertificateResource($certificate), 'Certificate updated successfully');
    }

    public function destroy(Certificate $certificate)
    {
        if ($certificate->image) {
            Storage::disk('public')->delete($certificate->image);
        }
        $certificate->delete();
        return $this->success(null, 'Certificate deleted successfully');
    }

    public function updateOrder(Request $request)
    {
        $request->validate([
            'certificates' => 'required|array',
            'certificates.*.id' => 'required|exists:certificates,id',
            'certificates.*.order' => 'required|integer|min:0',
        ]);

        foreach ($request->certificates as $item) {
            Certificate::where('id', $item['id'])->update(['order' => $item['order']]);
        }

        return $this->success(null, 'Certificate order updated successfully');
    }
}