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
            $table->string('make', 100); // Marca
            $table->string('model', 100); // Modelo
            $table->integer('year'); // Año
            $table->string('color', 50); // Color
            $table->string('license_plate', 20)->unique(); // Número de placa
            $table->string('vin', 17)->nullable()->unique(); // VIN
            $table->integer('mileage')->default(0); // Kilometraje
            $table->string('fuel_type', 50); // Tipo de combustible
            $table->string('transmission', 50); // Transmisión
            $table->string('engine_size', 50)->nullable(); // Tamaño del motor
            $table->text('description')->nullable(); // Descripción opcional
            $table->decimal('price', 10, 2); // Precio
            $table->string('status', 50)->default('available'); // Estado del auto
            $table->timestamps();
            
            // Índices para optimizar búsquedas
            $table->index(['user_id', 'make']);
            $table->index(['user_id', 'model']);
            $table->index(['user_id', 'year']);
            $table->index(['user_id', 'color']);
            $table->index(['user_id', 'status']);
            $table->index('license_plate');
            $table->index('vin');
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
