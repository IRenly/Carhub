<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Car>
 */
class CarFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $makes = ['Toyota', 'Honda', 'Ford', 'Chevrolet', 'BMW', 'Mercedes-Benz', 'Audi', 'Nissan', 'Hyundai', 'Volkswagen'];
        $models = ['Corolla', 'Civic', 'Focus', 'Camaro', 'X3', 'C-Class', 'A4', 'Altima', 'Elantra', 'Jetta'];
        $colors = ['Red', 'Blue', 'Black', 'White', 'Silver', 'Gray', 'Green', 'Yellow'];
        $fuelTypes = ['Gasoline', 'Diesel', 'Electric', 'Hybrid', 'LPG'];
        $transmissions = ['Manual', 'Automatic', 'CVT', 'Semi-Automatic'];
        $statuses = ['available', 'sold', 'reserved', 'maintenance'];

        return [
            'user_id' => User::factory(),
            'make' => $this->faker->randomElement($makes),
            'model' => $this->faker->randomElement($models),
            'year' => $this->faker->numberBetween(2010, date('Y')),
            'color' => $this->faker->randomElement($colors),
            'license_plate' => $this->faker->unique()->regexify('[A-Z]{3}[0-9]{3}'),
            'vin' => $this->faker->unique()->regexify('[A-HJ-NPR-Z0-9]{17}'),
            'mileage' => $this->faker->numberBetween(1000, 200000),
            'fuel_type' => $this->faker->randomElement($fuelTypes),
            'transmission' => $this->faker->randomElement($transmissions),
            'engine_size' => $this->faker->randomElement(['1.6L', '2.0L', '2.4L', '3.0L', '3.5L']),
            'description' => $this->faker->sentence(10),
            'price' => $this->faker->randomFloat(2, 5000, 80000),
            'status' => $this->faker->randomElement($statuses),
        ];
    }

    /**
     * Indicate that the car is available.
     */
    public function available(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'available',
        ]);
    }

    /**
     * Indicate that the car is sold.
     */
    public function sold(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'sold',
        ]);
    }

    /**
     * Indicate that the car is reserved.
     */
    public function reserved(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'reserved',
        ]);
    }

    /**
     * Indicate that the car is in maintenance.
     */
    public function maintenance(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'maintenance',
        ]);
    }

    /**
     * Indicate that the car is electric.
     */
    public function electric(): static
    {
        return $this->state(fn (array $attributes) => [
            'fuel_type' => 'Electric',
            'engine_size' => null,
        ]);
    }

    /**
     * Indicate that the car is luxury.
     */
    public function luxury(): static
    {
        return $this->state(fn (array $attributes) => [
            'make' => $this->faker->randomElement(['BMW', 'Mercedes-Benz', 'Audi', 'Lexus', 'Porsche']),
            'price' => $this->faker->randomFloat(2, 40000, 150000),
        ]);
    }
}