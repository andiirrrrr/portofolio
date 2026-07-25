<?php

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$profile = App\Models\Profile::first();
$projects = App\Models\Project::where('is_active', true)->orderBy('order', 'asc')->get();
$certificates = App\Models\Certificate::where('is_active', true)->orderBy('order', 'asc')->get();
$experiences = App\Models\Experience::where('is_active', true)->orderBy('order', 'asc')->get();
$educations = App\Models\Education::where('is_active', true)->orderBy('order', 'asc')->get();
$skills = App\Models\Skill::where('is_active', true)->orderBy('order', 'asc')->get();

$data = [
    'profile' => $profile,
    'projects' => $projects,
    'certificates' => $certificates,
    'experiences' => $experiences,
    'educations' => $educations,
    'skills' => $skills,
];

file_put_contents(__DIR__ . '/../frontend/lib/initialData.json', json_encode($data, JSON_PRETTY_PRINT));
echo "Data exported successfully to frontend/lib/initialData.json\n";
