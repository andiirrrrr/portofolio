<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('profiles', function (Blueprint $table) {
            $table->id();
            $table->string('full_name');
            $table->string('title')->nullable();
            $table->string('email')->unique();
            $table->string('phone')->nullable();
            $table->string('location')->nullable();
            $table->text('bio')->nullable();
            $table->string('profile_image')->nullable();
            $table->string('cv_file')->nullable();
            $table->string('github_url')->nullable();
            $table->string('linkedin_url')->nullable();
            $table->string('instagram_url')->nullable();
            $table->string('youtube_url')->nullable();
            $table->string('website_url')->nullable();
            $table->text('about_me')->nullable();
            $table->text('professional_summary')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('profiles');
    }
};