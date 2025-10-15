<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('cars', function (Blueprint $table) {
            // Eliminar el índice único existente en VIN
            $table->dropUnique(['vin']);
        });
        
        // En SQL Server, crear un índice único filtrado que excluya NULLs
        // Esto permite múltiples NULLs pero mantiene la unicidad para valores no-nulos
        DB::statement('CREATE UNIQUE INDEX cars_vin_unique_filtered ON cars (vin) WHERE vin IS NOT NULL AND vin != \'\'');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Eliminar el índice filtrado
        DB::statement('DROP INDEX IF EXISTS cars_vin_unique_filtered ON cars');
        
        Schema::table('cars', function (Blueprint $table) {
            // Restaurar el índice único original
            $table->unique('vin');
        });
    }
};
