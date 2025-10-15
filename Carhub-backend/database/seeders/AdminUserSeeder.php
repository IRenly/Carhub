<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Crear usuario administrador si no existe
        User::firstOrCreate(
            ['email' => 'admin@carhub.com'],
            [
                'name' => 'Administrador',
                'first_name' => 'Admin',
                'last_name' => 'Sistema',
                'password' => Hash::make('admin123'),
                'phone' => '1234567890',
                'role' => 'admin',
            ]
        );

        // Actualizar el usuario juan@example.com existente para que sea admin también
        $juan = User::where('email', 'juan@example.com')->first();
        if ($juan) {
            $juan->update(['role' => 'admin']);
        }
    }
}