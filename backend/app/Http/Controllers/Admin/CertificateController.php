<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Certificate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CertificateController extends Controller
{
    public function index()
    {
        $certificates = Certificate::orderBy('order')->orderBy('issued_date', 'desc')->get();
        return view('admin.certificates.index', compact('certificates'));
    }

    public function create()
    {
        return view('admin.certificates.form');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'issuer' => 'required|string|max:255',
            'issued_date' => 'required|date',
            'expiry_date' => 'nullable|date|after:issued_date',
            'credential_id' => 'nullable|string|max:255',
            'credential_url' => 'nullable|url|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'order' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
        ]);

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('certificates', 'public');
        }

        Certificate::create($data);

        return redirect()->route('admin.certificates.index')
            ->with('success', 'Certificate created successfully!');
    }

    public function edit(Certificate $certificate)
    {
        return view('admin.certificates.form', compact('certificate'));
    }

    public function update(Request $request, Certificate $certificate)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'issuer' => 'required|string|max:255',
            'issued_date' => 'required|date',
            'expiry_date' => 'nullable|date|after:issued_date',
            'credential_id' => 'nullable|string|max:255',
            'credential_url' => 'nullable|url|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'order' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
        ]);

        if ($request->hasFile('image')) {
            if ($certificate->image) {
                Storage::disk('public')->delete($certificate->image);
            }
            $data['image'] = $request->file('image')->store('certificates', 'public');
        }

        $certificate->update($data);

        return redirect()->route('admin.certificates.index')
            ->with('success', 'Certificate updated successfully!');
    }

    public function destroy(Certificate $certificate)
    {
        if ($certificate->image) {
            Storage::disk('public')->delete($certificate->image);
        }
        $certificate->delete();
        return redirect()->route('admin.certificates.index')
            ->with('success', 'Certificate deleted successfully!');
    }
}