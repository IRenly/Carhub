<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Car;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class UserTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test de creación de usuario
     */
    public function test_can_create_user()
    {
        $userData = [
            'name' => 'Juan Pérez',
            'first_name' => 'Juan',
            'last_name' => 'Pérez',
            'email' => 'juan@example.com',
            'password' => 'password123',
            'phone' => '1234567890',
            'birth_date' => '1990-01-01'
        ];

        $user = User::create($userData);

        $this->assertInstanceOf(User::class, $user);
        $this->assertEquals('Juan Pérez', $user->name);
        $this->assertEquals('juan@example.com', $user->email);
        $this->assertEquals('1234567890', $user->phone);
        $this->assertTrue(Hash::check('password123', $user->password));
    }

    /**
     * Test de atributos fillable
     */
    public function test_user_has_correct_fillable_attributes()
    {
        $fillable = [
            'name',
            'first_name',
            'last_name',
            'email',
            'password',
            'phone',
            'birth_date',
            'role'
        ];

        $user = new User();
        $this->assertEquals($fillable, $user->getFillable());
    }

    /**
     * Test de atributos hidden
     */
    public function test_user_hides_sensitive_attributes()
    {
        $user = User::factory()->create();
        
        $userArray = $user->toArray();
        
        $this->assertArrayNotHasKey('password', $userArray);
        $this->assertArrayNotHasKey('remember_token', $userArray);
    }

    /**
     * Test de casting de atributos
     */
    public function test_user_casts_attributes_correctly()
    {
        $user = User::factory()->create([
            'birth_date' => '1990-01-01',
            'password' => 'password123'
        ]);

        $this->assertInstanceOf(\Carbon\Carbon::class, $user->birth_date);
        $this->assertTrue(Hash::check('password123', $user->password));
    }

    /**
     * Test de relación con Car
     */
    public function test_user_has_many_cars()
    {
        $user = User::factory()->create();
        
        $car1 = Car::factory()->create(['user_id' => $user->id]);
        $car2 = Car::factory()->create(['user_id' => $user->id]);

        $this->assertInstanceOf(\Illuminate\Database\Eloquent\Collection::class, $user->cars);
        $this->assertCount(2, $user->cars);
        $this->assertTrue($user->cars->contains($car1));
        $this->assertTrue($user->cars->contains($car2));
    }

    /**
     * Test de JWT Subject implementation
     */
    public function test_user_implements_jwt_subject()
    {
        $user = User::factory()->create();
        
        $this->assertInstanceOf(\PHPOpenSourceSaver\JWTAuth\Contracts\JWTSubject::class, $user);
        $this->assertEquals($user->id, $user->getJWTIdentifier());
        $this->assertIsArray($user->getJWTCustomClaims());
    }

    /**
     * Test de validación de email único
     */
    public function test_user_email_must_be_unique()
    {
        User::factory()->create(['email' => 'test@example.com']);

        $this->expectException(\Illuminate\Database\QueryException::class);
        
        User::create([
            'name' => 'Another User',
            'first_name' => 'Another',
            'last_name' => 'User',
            'email' => 'test@example.com',
            'password' => 'password123'
        ]);
    }

    /**
     * Test de creación de usuario con factory
     */
    public function test_user_factory_creates_valid_user()
    {
        $user = User::factory()->create();

        $this->assertInstanceOf(User::class, $user);
        $this->assertNotEmpty($user->name);
        $this->assertNotEmpty($user->email);
        $this->assertNotEmpty($user->password);
        $this->assertDatabaseHas('users', [
            'id' => $user->id
        ]);
    }

    /**
     * Test de actualización de usuario
     */
    public function test_can_update_user()
    {
        $user = User::factory()->create([
            'name' => 'Old Name',
            'phone' => '1234567890'
        ]);

        $user->update([
            'name' => 'New Name',
            'phone' => '9876543210'
        ]);

        $this->assertEquals('New Name', $user->name);
        $this->assertEquals('9876543210', $user->phone);
        
        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'name' => 'New Name',
            'phone' => '9876543210'
        ]);
    }

    /**
     * Test de eliminación de usuario
     */
    public function test_can_delete_user()
    {
        $user = User::factory()->create();

        $userId = $user->id;
        $user->delete();

        $this->assertDatabaseMissing('users', [
            'id' => $userId
        ]);
    }

    /**
     * Test de búsqueda de usuario por email
     */
    public function test_can_find_user_by_email()
    {
        $user = User::factory()->create(['email' => 'search@example.com']);

        $foundUser = User::where('email', 'search@example.com')->first();

        $this->assertInstanceOf(User::class, $foundUser);
        $this->assertEquals($user->id, $foundUser->id);
    }

    /**
     * Test de hash automático de contraseña
     */
    public function test_password_is_automatically_hashed()
    {
        $user = User::create([
            'name' => 'Test User',
            'first_name' => 'Test',
            'last_name' => 'User',
            'email' => 'test@example.com',
            'password' => 'plaintext123'
        ]);

        $this->assertNotEquals('plaintext123', $user->password);
        $this->assertTrue(Hash::check('plaintext123', $user->password));
    }

    /**
     * Test de múltiples usuarios
     */
    public function test_can_create_multiple_users()
    {
        $users = User::factory()->count(5)->create();

        $this->assertCount(5, $users);
        $this->assertCount(5, User::all());
        
        foreach ($users as $user) {
            $this->assertInstanceOf(User::class, $user);
        }
    }
}