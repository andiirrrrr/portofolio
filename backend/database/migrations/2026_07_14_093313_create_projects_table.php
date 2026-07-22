<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('category')->nullable();
            $table->text('short_description');
            $table->longText('description')->nullable();
            $table->string('thumbnail')->nullable();
            $table->string('github_url')->nullable();
            $table->string('demo_url')->nullable();
            $table->string('tech_stack')->nullable(); // JSON array
            $table->text('challenges')->nullable();
            $table->text('solutions')->nullable();
            $table->text('key_features')->nullable(); // JSON array
            $table->integer('order')->default(0);
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_active')->default(true);
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};