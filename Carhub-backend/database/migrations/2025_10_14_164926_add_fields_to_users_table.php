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
        Schema::table('users', function (Blueprint $table) {
            $table->string('first_name', 100)->after('name');
            $table->string('last_name', 100)->after('first_name');
            $table->string('phone', 20)->nullable()->after('email');
            $table->date('birth_date')->nullable()->after('phone');
            $table->string('profile_photo_url', 500)->nullable()->after('birth_date');
            $table->boolean('is_active')->default(true)->after('profile_photo_url');
            $table->timestamp('email_verified_at')->nullable()->change();
            $table->timestamp('last_login_at')->nullable()->after('email_verified_at');
            
            // Índices para optimización
            $table->index(['first_name', 'last_name']);
            $table->index('phone');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex(['first_name', 'last_name']);
            $table->dropIndex(['phone']);
            $table->dropColumn([
                'first_name', 
                'last_name', 
                'phone', 
                'birth_date', 
                'profile_photo_url', 
                'is_active',
                'last_login_at'
            ]);
        });
    }
};
