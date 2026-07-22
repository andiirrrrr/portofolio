<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('experiences', function (Blueprint $table) {
            $table->id();
            $table->string('company_name');
            $table->string('company_logo')->nullable();
            $table->string('position');
            $table->date('start_date');
            $table->date('end_date')->nullable(); // null = masih bekerja
            $table->boolean('is_current')->default(false);
            $table->text('description')->nullable();
            $table->text('achievements')->nullable(); // JSON array
            $table->string('company_website')->nullable();
            $table->integer('order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('experiences');
    }
};