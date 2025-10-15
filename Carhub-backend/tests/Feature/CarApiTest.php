<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Car;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class CarApiTest extends TestCase
{
    use RefreshDatabase;

    private $user;
    private $token;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Crear usuario y obtener token
        $this->user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => Hash::make('password123')
        ]);

        // Login para obtener token
        $response = $this->postJson('/api/auth/login', [
            'email' => 'test@example.com',
            'password' => 'password123'
        ]);

        $this->token = $response->json('access_token');
    }

    /**
     * Test obtener lista de carros del usuario
     */
    public function test_get_user_cars()
    {
        // Crear algunos carros para el usuario
        Car::factory()->count(2)->create(['user_id' => $this->user->id]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token
        ])->getJson('/api/cars');

        $response->assertStatus(200)
                ->assertJson(['success' => true])
                ->assertJsonStructure([
                    'success',
                    'data' => [
                        '*' => ['id', 'make', 'model', 'year', 'user_id']
                    ],
                    'message'
                ]);

        $this->assertCount(2, $response->json('data'));
    }

    /**
     * Test crear un nuevo carro
     */
    public function test_create_car()
    {
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
            'Authorization' => 'Bearer ' . $this->token
        ])->postJson('/api/cars', $carData);

        $response->assertStatus(201)
                ->assertJson(['success' => true])
                ->assertJson([
                    'data' => [
                        'make' => 'Toyota',
                        'model' => 'Corolla',
                        'user_id' => $this->user->id
                    ]
                ]);

        $this->assertDatabaseHas('cars', [
            'make' => 'Toyota',
            'model' => 'Corolla',
            'user_id' => $this->user->id
        ]);
    }

    /**
     * Test obtener carro específico
     */
    public function test_get_specific_car()
    {
        $car = Car::factory()->create(['user_id' => $this->user->id]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token
        ])->getJson("/api/cars/{$car->id}");

        $response->assertStatus(200)
                ->assertJson(['success' => true])
                ->assertJson(['data' => ['id' => $car->id]]);
    }

    /**
     * Test actualizar carro
     */
    public function test_update_car()
    {
        $car = Car::factory()->create([
            'user_id' => $this->user->id,
            'make' => 'Old Make'
        ]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token
        ])->putJson("/api/cars/{$car->id}", [
            'make' => 'New Make'
        ]);

        $response->assertStatus(200)
                ->assertJson(['success' => true]);

        $this->assertDatabaseHas('cars', [
            'id' => $car->id,
            'make' => 'New Make'
        ]);
    }

    /**
     * Test eliminar carro
     */
    public function test_delete_car()
    {
        $car = Car::factory()->create(['user_id' => $this->user->id]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token
        ])->deleteJson("/api/cars/{$car->id}");

        $response->assertStatus(200)
                ->assertJson(['success' => true]);

        $this->assertDatabaseMissing('cars', ['id' => $car->id]);
    }

    /**
     * Test acceso sin autenticación
     */
    public function test_endpoints_require_authentication()
    {
        // Asegurar que no hay usuario autenticado
        auth()->logout();
        
        $response = $this->getJson('/api/cars');
        $response->assertStatus(401);

        $response = $this->postJson('/api/cars', []);
        $response->assertStatus(401);
    }

    /**
     * Test no puede acceder a carro de otro usuario
     */
    public function test_cannot_access_other_user_car()
    {
        $otherUser = User::factory()->create();
        $otherUserCar = Car::factory()->create(['user_id' => $otherUser->id]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token
        ])->getJson("/api/cars/{$otherUserCar->id}");

        $response->assertStatus(404);
    }
}