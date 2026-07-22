<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\ProfileController;
use App\Http\Controllers\Admin\SkillController;
use App\Http\Controllers\Admin\ExperienceController;
use App\Http\Controllers\Admin\EducationController;
use App\Http\Controllers\Admin\ProjectController;
use App\Http\Controllers\Admin\CertificateController;
use App\Http\Controllers\Admin\ContactController;

Route::get('/login', function () {
    return redirect()->route('admin.login');
})->name('login');

Route::prefix('admin')->name('admin.')->group(function () {

    // AUTH - Public
    Route::get('/login', [AuthController::class, 'showLoginForm'])->name('login');
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

    // PROTECTED - Harus login
    Route::middleware('auth:web')->group(function () {

        // DASHBOARD
        Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

        // CRUD yang sudah ada controllernya
        Route::resource('profile', ProfileController::class)->except(['show']);
        Route::resource('skills', SkillController::class)->except(['show']);
        Route::resource('experiences', ExperienceController::class)->except(['show']);
        Route::resource('educations', EducationController::class)->except(['show']);
        Route::resource('projects', ProjectController::class)->except(['show']);
        Route::resource('certificates', CertificateController::class)->except(['show']);
        Route::get('contacts', [ContactController::class, 'index'])->name('contacts.index');
        Route::get('contacts/{contact}', [ContactController::class, 'show'])->name('contacts.show');
        Route::delete('contacts/{contact}', [ContactController::class, 'destroy'])->name('contacts.destroy');
        Route::put('contacts/{contact}/read', [ContactController::class, 'markAsRead'])->name('contacts.read');
        Route::put('contacts/{contact}/replied', [ContactController::class, 'markAsReplied'])->name('contacts.replied');
    });
});