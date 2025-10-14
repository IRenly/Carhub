<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class SimpleApiTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test que la API de autenticación funciona
     */
    public function test_auth_api_works()
    {
        // Test registro
        $userData = [
            'name' => 'Test User',
            'first_name' => 'Test',
            'last_name' => 'User',
            'email' => 'test@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'phone' => '1234567890',
            'birth_date' => '1990-01-01'
        ];

        $response = $this->postJson('/api/auth/register', $userData);
        $response->assertStatus(201)
                ->assertJson(['message' => 'User successfully registered']);

        // Test login
        $loginData = [
            'email' => 'test@example.com',
            'password' => 'password123'
        ];

        $response = $this->postJson('/api/auth/login', $loginData);
        $response->assertStatus(200)
                ->assertJsonStructure(['access_token', 'token_type', 'expires_in']);

        $token = $response->json('access_token');

        // Test obtener usuario autenticado
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])->postJson('/api/auth/me');

        $response->assertStatus(200)
                ->assertJson(['email' => 'test@example.com']);
    }

    /**
     * Test que los endpoints requieren autenticación
     */
    public function test_protected_endpoints_require_auth()
    {
        $response = $this->getJson('/api/cars');
        $response->assertStatus(401);

        $response = $this->postJson('/api/cars', []);
        $response->assertStatus(401);
    }

    /**
     * Test básico de creación de carro (sin validaciones complejas)
     */
    public function test_can_create_car_with_auth()
    {
        // Crear usuario y obtener token
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => Hash::make('password123')
        ]);

        $loginResponse = $this->postJson('/api/auth/login', [
            'email' => 'test@example.com',
            'password' => 'password123'
        ]);

        $token = $loginResponse->json('access_token');

        // Test crear carro con datos mínimos
        $carData = [
            'make' => 'Toyota',
            'model' => 'Corolla',
            'year' => 2020,
            'color' => 'Blue',
            'license_plate' => 'ABC123',
            'mileage' => 50000,
            'fuel_type' => 'Gasoline',
            'transmission' => 'Automatic',
            'price' => 25000.00,
            'status' => 'available'
        ];

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])->postJson('/api/cars', $carData);

        $response->assertStatus(201)
                ->assertJson(['success' => true]);
    }
}
