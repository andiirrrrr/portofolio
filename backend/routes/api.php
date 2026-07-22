<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\SkillController;
use App\Http\Controllers\Api\ExperienceController;
use App\Http\Controllers\Api\EducationController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\CertificateController;
use App\Http\Controllers\Api\BlogController;
use App\Http\Controllers\Api\ContactController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {
    // PUBLIC AUTH ROUTES
    Route::post('/auth/login', [AuthController::class, 'login'])->name('api.login');
    Route::post('/auth/register', [AuthController::class, 'register'])->name('api.register');

    // PUBLIC ROUTES (no auth)
    Route::get('/profile', [ProfileController::class, 'index']);
    Route::get('/skills', [SkillController::class, 'index']);
    Route::get('/skills/categories', [SkillController::class, 'categories']);
    Route::get('/experiences', [ExperienceController::class, 'index']);
    Route::get('/educations', [EducationController::class, 'index']);
    Route::get('/projects', [ProjectController::class, 'index']);
    Route::get('/projects/{project}', [ProjectController::class, 'show']);
    Route::get('/certificates', [CertificateController::class, 'index']);
    Route::get('/blogs', [BlogController::class, 'index']);
    Route::get('/blogs/{blog}', [BlogController::class, 'show']);
    Route::get('/blogs/categories', [BlogController::class, 'categories']);
    Route::post('/contacts', [ContactController::class, 'store']);

    // PROTECTED ROUTES (require auth)
    Route::middleware('auth:api')->group(function () {
        // Auth
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::post('/auth/refresh', [AuthController::class, 'refresh']);
        Route::get('/auth/me', [AuthController::class, 'me']);

        // Profile (Admin only)
        Route::post('/profile', [ProfileController::class, 'store'])->middleware('role:admin');
        Route::put('/profile/{profile}', [ProfileController::class, 'update'])->middleware('role:admin');

        // Skills (Admin only)
        Route::post('/skills', [SkillController::class, 'store'])->middleware('role:admin');
        Route::put('/skills/{skill}', [SkillController::class, 'update'])->middleware('role:admin');
        Route::delete('/skills/{skill}', [SkillController::class, 'destroy'])->middleware('role:admin');
        Route::post('/skills/order', [SkillController::class, 'updateOrder'])->middleware('role:admin');

        // Experiences (Admin only)
        Route::post('/experiences', [ExperienceController::class, 'store'])->middleware('role:admin');
        Route::put('/experiences/{experience}', [ExperienceController::class, 'update'])->middleware('role:admin');
        Route::delete('/experiences/{experience}', [ExperienceController::class, 'destroy'])->middleware('role:admin');
        Route::post('/experiences/order', [ExperienceController::class, 'updateOrder'])->middleware('role:admin');

        // Educations (Admin only)
        Route::post('/educations', [EducationController::class, 'store'])->middleware('role:admin');
        Route::put('/educations/{education}', [EducationController::class, 'update'])->middleware('role:admin');
        Route::delete('/educations/{education}', [EducationController::class, 'destroy'])->middleware('role:admin');
        Route::post('/educations/order', [EducationController::class, 'updateOrder'])->middleware('role:admin');

        // Projects (Admin only)
        Route::post('/projects', [ProjectController::class, 'store'])->middleware('role:admin');
        Route::put('/projects/{project}', [ProjectController::class, 'update'])->middleware('role:admin');
        Route::delete('/projects/{project}', [ProjectController::class, 'destroy'])->middleware('role:admin');
        Route::post('/projects/order', [ProjectController::class, 'updateOrder'])->middleware('role:admin');
        Route::post('/projects/upload-image', [ProjectController::class, 'uploadImage'])->middleware('role:admin');

        // Certificates (Admin only)
        Route::post('/certificates', [CertificateController::class, 'store'])->middleware('role:admin');
        Route::put('/certificates/{certificate}', [CertificateController::class, 'update'])->middleware('role:admin');
        Route::delete('/certificates/{certificate}', [CertificateController::class, 'destroy'])->middleware('role:admin');
        Route::post('/certificates/order', [CertificateController::class, 'updateOrder'])->middleware('role:admin');

        // Blogs (Admin only)
        Route::post('/blogs', [BlogController::class, 'store'])->middleware('role:admin');
        Route::put('/blogs/{blog}', [BlogController::class, 'update'])->middleware('role:admin');
        Route::delete('/blogs/{blog}', [BlogController::class, 'destroy'])->middleware('role:admin');

        // Contacts (Admin only)
        Route::get('/contacts', [ContactController::class, 'index'])->middleware('role:admin');
        Route::get('/contacts/{contact}', [ContactController::class, 'show'])->middleware('role:admin');
        Route::delete('/contacts/{contact}', [ContactController::class, 'destroy'])->middleware('role:admin');
        Route::put('/contacts/{contact}/read', [ContactController::class, 'markAsRead'])->middleware('role:admin');
        Route::put('/contacts/{contact}/replied', [ContactController::class, 'markAsReplied'])->middleware('role:admin');
        Route::get('/contacts/unread/count', [ContactController::class, 'unreadCount'])->middleware('role:admin');
    });
});