<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Car;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CarTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test de creación de carro
     */
    public function test_can_create_car()
    {
        $user = User::factory()->create();

        $carData = [
            'user_id' => $user->id,
            'make' => 'Toyota',
            'model' => 'Corolla',
            'year' => 2020,
            'color' => 'Blue',
            'license_plate' => 'ABC123',
            'vin' => '1HGBH41JXMN109186',
            'mileage' => 50000,
            'fuel_type' => 'Gasoline',
            'transmission' => 'Automatic',
            'engine_size' => '2.0L',
            'description' => 'A reliable car',
            'price' => 25000.00,
            'status' => 'available'
        ];

        $car = Car::create($carData);

        $this->assertInstanceOf(Car::class, $car);
        $this->assertEquals('Toyota', $car->make);
        $this->assertEquals('Corolla', $car->model);
        $this->assertEquals(2020, $car->year);
        $this->assertEquals('Blue', $car->color);
        $this->assertEquals(25000.00, $car->price);
    }

    /**
     * Test de atributos fillable
     */
    public function test_car_has_correct_fillable_attributes()
    {
        $fillable = [
            'user_id',
            'make',
            'model',
            'year',
            'color',
            'license_plate',
            'vin',
            'mileage',
            'fuel_type',
            'transmission',
            'engine_size',
            'description',
            'price',
            'status'
        ];

        $car = new Car();
        $this->assertEquals($fillable, $car->getFillable());
    }

    /**
     * Test de casting de atributos
     */
    public function test_car_casts_attributes_correctly()
    {
        $car = Car::factory()->create([
            'year' => '2020',
            'mileage' => '50000',
            'price' => '25000.50'
        ]);

        $this->assertIsInt($car->year);
        $this->assertIsInt($car->mileage);
        $this->assertIsNumeric($car->price);
        $this->assertEquals(2020, $car->year);
        $this->assertEquals(50000, $car->mileage);
        $this->assertEquals(25000.50, $car->price);
    }

    /**
     * Test de relación con User
     */
    public function test_car_belongs_to_user()
    {
        $user = User::factory()->create();
        $car = Car::factory()->create(['user_id' => $user->id]);

        $this->assertInstanceOf(User::class, $car->user);
        $this->assertEquals($user->id, $car->user->id);
        $this->assertEquals($user->name, $car->user->name);
    }

    /**
     * Test de creación con factory
     */
    public function test_car_factory_creates_valid_car()
    {
        $car = Car::factory()->create();

        $this->assertInstanceOf(Car::class, $car);
        $this->assertNotEmpty($car->make);
        $this->assertNotEmpty($car->model);
        $this->assertIsInt($car->year);
        $this->assertIsInt($car->mileage);
        $this->assertIsNumeric($car->price);
        $this->assertDatabaseHas('cars', [
            'id' => $car->id
        ]);
    }

    /**
     * Test de actualización de carro
     */
    public function test_can_update_car()
    {
        $car = Car::factory()->create([
            'make' => 'Old Make',
            'price' => 20000.00
        ]);

        $car->update([
            'make' => 'New Make',
            'price' => 30000.00
        ]);

        $this->assertEquals('New Make', $car->make);
        $this->assertEquals(30000.00, $car->price);
        
        $this->assertDatabaseHas('cars', [
            'id' => $car->id,
            'make' => 'New Make',
            'price' => 30000.00
        ]);
    }

    /**
     * Test de eliminación de carro
     */
    public function test_can_delete_car()
    {
        $car = Car::factory()->create();

        $carId = $car->id;
        $car->delete();

        $this->assertDatabaseMissing('cars', [
            'id' => $carId
        ]);
    }

    /**
     * Test de búsqueda de carros por marca
     */
    public function test_can_find_cars_by_make()
    {
        Car::factory()->create(['make' => 'Toyota']);
        Car::factory()->create(['make' => 'Honda']);
        Car::factory()->create(['make' => 'Toyota']);

        $toyotaCars = Car::where('make', 'Toyota')->get();

        $this->assertCount(2, $toyotaCars);
        foreach ($toyotaCars as $car) {
            $this->assertEquals('Toyota', $car->make);
        }
    }

    /**
     * Test de búsqueda de carros por año
     */
    public function test_can_find_cars_by_year()
    {
        Car::factory()->create(['year' => 2020]);
        Car::factory()->create(['year' => 2021]);
        Car::factory()->create(['year' => 2020]);

        $cars2020 = Car::where('year', 2020)->get();

        $this->assertCount(2, $cars2020);
        foreach ($cars2020 as $car) {
            $this->assertEquals(2020, $car->year);
        }
    }

    /**
     * Test de búsqueda de carros por rango de precio
     */
    public function test_can_find_cars_by_price_range()
    {
        Car::factory()->create(['price' => 15000.00]);
        Car::factory()->create(['price' => 25000.00]);
        Car::factory()->create(['price' => 35000.00]);

        $expensiveCars = Car::where('price', '>', 20000.00)->get();

        $this->assertCount(2, $expensiveCars);
        foreach ($expensiveCars as $car) {
            $this->assertGreaterThan(20000.00, $car->price);
        }
    }

    /**
     * Test de carros por usuario
     */
    public function test_can_get_cars_by_user()
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();

        Car::factory()->count(3)->create(['user_id' => $user1->id]);
        Car::factory()->count(2)->create(['user_id' => $user2->id]);

        $user1Cars = Car::where('user_id', $user1->id)->get();
        $user2Cars = Car::where('user_id', $user2->id)->get();

        $this->assertCount(3, $user1Cars);
        $this->assertCount(2, $user2Cars);
        
        foreach ($user1Cars as $car) {
            $this->assertEquals($user1->id, $car->user_id);
        }
        
        foreach ($user2Cars as $car) {
            $this->assertEquals($user2->id, $car->user_id);
        }
    }

    /**
     * Test de validación de campos requeridos
     */
    public function test_car_requires_user_id()
    {
        $this->expectException(\Illuminate\Database\QueryException::class);
        
        Car::create([
            'make' => 'Toyota',
            'model' => 'Corolla',
            'year' => 2020
            // user_id faltante
        ]);
    }

    /**
     * Test de múltiples carros
     */
    public function test_can_create_multiple_cars()
    {
        $user = User::factory()->create();
        
        $cars = Car::factory()->count(5)->create(['user_id' => $user->id]);

        $this->assertCount(5, $cars);
        $this->assertCount(5, Car::all());
        
        foreach ($cars as $car) {
            $this->assertInstanceOf(Car::class, $car);
            $this->assertEquals($user->id, $car->user_id);
        }
    }

    /**
     * Test de estados de carro
     */
    public function test_car_status_values()
    {
        $statuses = ['available', 'sold', 'reserved', 'maintenance'];
        
        foreach ($statuses as $status) {
            $car = Car::factory()->create(['status' => $status]);
            $this->assertEquals($status, $car->status);
        }
    }

    /**
     * Test de tipos de combustible
     */
    public function test_car_fuel_types()
    {
        $fuelTypes = ['Gasoline', 'Diesel', 'Electric', 'Hybrid', 'LPG'];
        
        foreach ($fuelTypes as $fuelType) {
            $car = Car::factory()->create(['fuel_type' => $fuelType]);
            $this->assertEquals($fuelType, $car->fuel_type);
        }
    }

    /**
     * Test de tipos de transmisión
     */
    public function test_car_transmission_types()
    {
        $transmissions = ['Manual', 'Automatic', 'CVT', 'Semi-Automatic'];
        
        foreach ($transmissions as $transmission) {
            $car = Car::factory()->create(['transmission' => $transmission]);
            $this->assertEquals($transmission, $car->transmission);
        }
    }
}