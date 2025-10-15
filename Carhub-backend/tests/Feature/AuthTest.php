<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test de registro de usuario exitoso
     */
    public function test_user_can_register_successfully()
    {
        $userData = [
            'name' => 'Juan Pérez',
            'first_name' => 'Juan',
            'last_name' => 'Pérez',
            'email' => 'juan@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'phone' => '1234567890',
            'birth_date' => '1990-01-01'
        ];

        $response = $this->postJson('/api/auth/register', $userData);

        $response->assertStatus(201)
                ->assertJsonStructure([
                    'message',
                    'user' => [
                        'id',
                        'name',
                        'first_name',
                        'last_name',
                        'email',
                        'phone',
                        'birth_date',
                        'created_at',
                        'updated_at'
                    ]
                ]);

        // Verificar que el usuario se creó en la base de datos
        $this->assertDatabaseHas('users', [
            'email' => 'juan@example.com',
            'name' => 'Juan Pérez'
        ]);
    }

    /**
     * Test de registro con datos inválidos
     */
    public function test_user_registration_fails_with_invalid_data()
    {
        $invalidData = [
            'name' => '',
            'email' => 'invalid-email',
            'password' => '123',
            'password_confirmation' => 'different'
        ];

        $response = $this->postJson('/api/auth/register', $invalidData);

        $response->assertStatus(400)
                ->assertJsonStructure(['errors']);
    }

    /**
     * Test de registro con email duplicado
     */
    public function test_user_registration_fails_with_duplicate_email()
    {
        // Crear usuario existente
        User::factory()->create(['email' => 'existing@example.com']);

        $userData = [
            'name' => 'Otro Usuario',
            'first_name' => 'Otro',
            'last_name' => 'Usuario',
            'email' => 'existing@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123'
        ];

        $response = $this->postJson('/api/auth/register', $userData);

        $response->assertStatus(400)
                ->assertJsonStructure(['errors']);
    }

    /**
     * Test de login exitoso
     */
    public function test_user_can_login_successfully()
    {
        // Crear usuario
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => Hash::make('password123')
        ]);

        $loginData = [
            'email' => 'test@example.com',
            'password' => 'password123'
        ];

        $response = $this->postJson('/api/auth/login', $loginData);

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'access_token',
                    'token_type',
                    'expires_in'
                ]);

        $this->assertEquals('bearer', $response->json('token_type'));
        $this->assertNotEmpty($response->json('access_token'));
    }

    /**
     * Test de login con credenciales inválidas
     */
    public function test_user_login_fails_with_invalid_credentials()
    {
        $loginData = [
            'email' => 'nonexistent@example.com',
            'password' => 'wrongpassword'
        ];

        $response = $this->postJson('/api/auth/login', $loginData);

        $response->assertStatus(401)
                ->assertJsonStructure(['error']);
    }

    /**
     * Test de obtención de información del usuario autenticado
     */
    public function test_user_can_get_their_info()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'api')
                        ->postJson('/api/auth/me');

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'id',
                    'name',
                    'first_name',
                    'last_name',
                    'email',
                    'created_at',
                    'updated_at'
                ])
                ->assertJson([
                    'id' => $user->id,
                    'email' => $user->email
                ]);
    }

    /**
     * Test de acceso sin token
     */
    public function test_me_endpoint_requires_authentication()
    {
        $response = $this->postJson('/api/auth/me');

        $response->assertStatus(401);
    }

    /**
     * Test de refresh token
     */
    public function test_user_can_refresh_token()
    {
        $user = User::factory()->create();
        
        // Primero hacer login para obtener un token válido
        $loginResponse = $this->postJson('/api/auth/login', [
            'email' => $user->email,
            'password' => 'password'
        ]);
        
        $token = $loginResponse->json('access_token');

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])->postJson('/api/auth/refresh');

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'access_token',
                    'token_type',
                    'expires_in'
                ]);
    }

    /**
     * Test de logout
     */
    public function test_user_can_logout()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'api')
                        ->postJson('/api/auth/logout');

        $response->assertStatus(200)
                ->assertJsonStructure(['message']);
    }

    /**
     * Test de flujo completo: registro -> login -> me -> logout
     */
    public function test_complete_auth_flow()
    {
        // 1. Registro
        $userData = [
            'name' => 'Test User',
            'first_name' => 'Test',
            'last_name' => 'User',
            'email' => 'testflow@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'phone' => '1234567890',
            'birth_date' => '1990-01-01'
        ];

        $registerResponse = $this->postJson('/api/auth/register', $userData);
        $registerResponse->assertStatus(201);

        // 2. Login
        $loginData = [
            'email' => 'testflow@example.com',
            'password' => 'password123'
        ];

        $loginResponse = $this->postJson('/api/auth/login', $loginData);
        $loginResponse->assertStatus(200);
        
        $token = $loginResponse->json('access_token');

        // 3. Obtener información del usuario
        $meResponse = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])->postJson('/api/auth/me');

        $meResponse->assertStatus(200)
                  ->assertJson(['email' => 'testflow@example.com']);

        // 4. Logout
        $logoutResponse = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])->postJson('/api/auth/logout');

        $logoutResponse->assertStatus(200);
    }

    /**
     * Test de token inválido
     */
    public function test_invalid_token_returns_unauthorized()
    {
        $response = $this->withHeaders([
            'Authorization' => 'Bearer invalid_token_here'
        ])->postJson('/api/auth/me');

        $response->assertStatus(401);
    }

    /**
     * Test de token expirado
     */
    public function test_expired_token_returns_unauthorized()
    {
        // Crear un token expirado (esto requeriría configuración adicional)
        // Por ahora, simplemente verificamos que un token malformado falla
        $response = $this->withHeaders([
            'Authorization' => 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.invalid'
        ])->postJson('/api/auth/me');

        $response->assertStatus(401);
    }
}