<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Car;

class CarSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Crear un usuario de ejemplo
        $user = User::create([
            'name' => 'Juan Pérez',
            'first_name' => 'Juan',
            'last_name' => 'Pérez',
            'email' => 'juan@example.com',
            'password' => bcrypt('password123'),
            'phone' => '+1234567890',
            'birth_date' => '1990-05-15',
        ]);

        // Crear autos de ejemplo
        $cars = [
            [
                'user_id' => $user->id,
                'brand' => 'Toyota',
                'model' => 'Corolla',
                'year' => 2022,
                'license_plate' => 'ABC-123',
                'color' => 'Blanco',
                'photo_url' => 'https://example.com/toyota-corolla.jpg',
                'description' => 'Auto en excelente estado, mantenimiento al día.',
                'is_active' => true,
            ],
            [
                'user_id' => $user->id,
                'brand' => 'Honda',
                'model' => 'Civic',
                'year' => 2021,
                'license_plate' => 'DEF-456',
                'color' => 'Negro',
                'photo_url' => 'https://example.com/honda-civic.jpg',
                'description' => 'Civic deportivo con pocos kilómetros.',
                'is_active' => true,
            ],
            [
                'user_id' => $user->id,
                'brand' => 'Ford',
                'model' => 'Mustang',
                'year' => 2020,
                'license_plate' => 'GHI-789',
                'color' => 'Rojo',
                'photo_url' => 'https://example.com/ford-mustang.jpg',
                'description' => 'Mustang GT, potencia y elegancia.',
                'is_active' => true,
            ],
            [
                'user_id' => $user->id,
                'brand' => 'BMW',
                'model' => 'X5',
                'year' => 2023,
                'license_plate' => 'JKL-012',
                'color' => 'Azul',
                'photo_url' => 'https://example.com/bmw-x5.jpg',
                'description' => 'SUV de lujo, perfecto para familia.',
                'is_active' => true,
            ],
            [
                'user_id' => $user->id,
                'brand' => 'Mercedes-Benz',
                'model' => 'C-Class',
                'year' => 2021,
                'license_plate' => 'MNO-345',
                'color' => 'Plata',
                'photo_url' => 'https://example.com/mercedes-c-class.jpg',
                'description' => 'Sedán elegante con tecnología avanzada.',
                'is_active' => true,
            ],
            [
                'user_id' => $user->id,
                'brand' => 'Audi',
                'model' => 'A4',
                'year' => 2022,
                'license_plate' => 'PQR-678',
                'color' => 'Gris',
                'photo_url' => 'https://example.com/audi-a4.jpg',
                'description' => 'A4 con diseño deportivo y confort.',
                'is_active' => false, // Auto inactivo para pruebas
            ],
        ];

        foreach ($cars as $carData) {
            Car::create($carData);
        }

        // Crear otro usuario con más autos
        $user2 = User::create([
            'name' => 'María García',
            'first_name' => 'María',
            'last_name' => 'García',
            'email' => 'maria@example.com',
            'password' => bcrypt('password123'),
            'phone' => '+0987654321',
            'birth_date' => '1985-12-03',
        ]);

        $moreCars = [
            [
                'user_id' => $user2->id,
                'brand' => 'Volkswagen',
                'model' => 'Golf',
                'year' => 2023,
                'license_plate' => 'STU-901',
                'color' => 'Verde',
                'photo_url' => 'https://example.com/vw-golf.jpg',
                'description' => 'Hatchback compacto y eficiente.',
                'is_active' => true,
            ],
            [
                'user_id' => $user2->id,
                'brand' => 'Nissan',
                'model' => 'Sentra',
                'year' => 2020,
                'license_plate' => 'VWX-234',
                'color' => 'Blanco',
                'photo_url' => 'https://example.com/nissan-sentra.jpg',
                'description' => 'Sedán confiable y económico.',
                'is_active' => true,
            ],
        ];

        foreach ($moreCars as $carData) {
            Car::create($carData);
        }

        $this->command->info('Datos de ejemplo creados exitosamente:');
        $this->command->info('- Usuarios: 2');
        $this->command->info('- Autos: 8');
        $this->command->info('');
        $this->command->info('Credenciales de prueba:');
        $this->command->info('Usuario 1: juan@example.com / password123');
        $this->command->info('Usuario 2: maria@example.com / password123');
    }
}
