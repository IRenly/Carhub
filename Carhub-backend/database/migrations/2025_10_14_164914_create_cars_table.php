<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('cars', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('brand', 100); // Marca
            $table->string('model', 100); // Modelo
            $table->integer('year'); // Año
            $table->string('license_plate', 20)->unique(); // Número de placa
            $table->string('color', 50); // Color
            $table->string('photo_url', 500)->nullable(); // URL de foto (simulado)
            $table->text('description')->nullable(); // Descripción opcional
            $table->boolean('is_active')->default(true); // Estado del auto
            $table->timestamps();
            
            // Índices para optimizar búsquedas
            $table->index(['user_id', 'brand']);
            $table->index(['user_id', 'model']);
            $table->index(['user_id', 'year']);
            $table->index(['user_id', 'color']);
            $table->index('license_plate');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cars');
    }
};
