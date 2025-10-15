<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Car;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\JsonResponse;

class CarController extends Controller
{
    /**
     * Display a listing of the user's cars.
     * Admins see all cars, regular users see only their own cars.
     */
    public function index(): JsonResponse
    {
        $user = auth()->user();
        
        // Si es admin, mostrar todos los autos
        if ($user->isAdmin()) {
            $cars = Car::with('user')->orderBy('created_at', 'desc')->get();
        } else {
            // Si es usuario regular, mostrar solo sus autos
            $cars = $user->cars()->orderBy('created_at', 'desc')->get();
        }

        return response()->json([
            'success' => true,
            'data' => $cars,
            'message' => 'Cars retrieved successfully'
        ]);
    }

    /**
     * Store a newly created car in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'make' => 'required|string|max:255',
            'model' => 'required|string|max:255',
            'year' => 'required|integer|min:1900|max:' . (date('Y') + 1),
            'color' => 'required|string|max:255',
            'license_plate' => 'required|string|max:20|unique:cars,license_plate',
            'vin' => 'nullable|string|max:17|unique:cars,vin',
            'mileage' => 'required|integer|min:0',
            'fuel_type' => 'required|string|in:Gasoline,Diesel,Electric,Hybrid,LPG',
            'transmission' => 'required|string|in:Manual,Automatic,CVT,Semi-Automatic',
            'engine_size' => 'nullable|string|max:50',
            'description' => 'nullable|string|max:1000',
            'price' => 'required|numeric|min:0',
            'status' => 'required|string|in:available,sold,reserved,maintenance'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $user = auth()->user();
        
        $car = $user->cars()->create($request->all());

        return response()->json([
            'success' => true,
            'data' => $car,
            'message' => 'Car created successfully'
        ], 201);
    }

    /**
     * Display the specified car.
     */
    public function show(Car $car): JsonResponse
    {
        $user = auth()->user();
        
        // Si es admin, puede ver cualquier auto. Si es usuario regular, solo sus propios autos
        if (!$user->isAdmin() && (int)$car->user_id !== (int)$user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Car not found or access denied'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $car,
            'message' => 'Car retrieved successfully'
        ]);
    }

    /**
     * Update the specified car in storage.
     */
    public function update(Request $request, Car $car): JsonResponse
    {
        $user = auth()->user();
        
        // Si es admin, puede editar cualquier auto. Si es usuario regular, solo sus propios autos
        if (!$user->isAdmin() && (int)$car->user_id !== (int)$user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Car not found or access denied'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'make' => 'sometimes|required|string|max:255',
            'model' => 'sometimes|required|string|max:255',
            'year' => 'sometimes|required|integer|min:1900|max:' . (date('Y') + 1),
            'color' => 'sometimes|required|string|max:255',
            'license_plate' => 'sometimes|required|string|max:20|unique:cars,license_plate,' . $car->id,
            'vin' => 'nullable|string|max:17|unique:cars,vin,' . $car->id,
            'mileage' => 'sometimes|required|integer|min:0',
            'fuel_type' => 'sometimes|required|string|in:Gasoline,Diesel,Electric,Hybrid,LPG',
            'transmission' => 'sometimes|required|string|in:Manual,Automatic,CVT,Semi-Automatic',
            'engine_size' => 'nullable|string|max:50',
            'description' => 'nullable|string|max:1000',
            'price' => 'sometimes|required|numeric|min:0',
            'status' => 'sometimes|required|string|in:available,sold,reserved,maintenance'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $car->update($request->all());

        return response()->json([
            'success' => true,
            'data' => $car->fresh(),
            'message' => 'Car updated successfully'
        ]);
    }

    /**
     * Remove the specified car from storage.
     */
    public function destroy(Car $car): JsonResponse
    {
        $user = auth()->user();
        
        // Si es admin, puede eliminar cualquier auto. Si es usuario regular, solo sus propios autos
        if (!$user->isAdmin() && (int)$car->user_id !== (int)$user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Car not found or access denied'
            ], 404);
        }

        $car->delete();

        return response()->json([
            'success' => true,
            'message' => 'Car deleted successfully'
        ]);
    }

    /**
     * Get cars by status
     */
    public function getByStatus(Request $request, $status): JsonResponse
    {
        $validator = Validator::make(['status' => $status], [
            'status' => 'required|string|in:available,sold,reserved,maintenance'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
                'message' => 'Invalid status provided'
            ], 400);
        }

        $user = auth()->user();
        $cars = $user->cars()
                    ->where('status', $status)
                    ->orderBy('created_at', 'desc')
                    ->get();

        return response()->json([
            'success' => true,
            'data' => $cars,
            'message' => "Cars with status '{$status}' retrieved successfully"
        ]);
    }

    /**
     * Search cars by make and model
     */
    public function search(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'make' => 'nullable|string|max:255',
            'model' => 'nullable|string|max:255',
            'year' => 'nullable|integer|min:1900|max:' . (date('Y') + 1),
            'min_price' => 'nullable|numeric|min:0',
            'max_price' => 'nullable|numeric|min:0|gte:min_price'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $user = auth()->user();
        $query = $user->cars();

        if ($request->filled('make')) {
            $query->where('make', 'like', '%' . $request->make . '%');
        }

        if ($request->filled('model')) {
            $query->where('model', 'like', '%' . $request->model . '%');
        }

        if ($request->filled('year')) {
            $query->where('year', $request->year);
        }

        if ($request->filled('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }

        if ($request->filled('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        $cars = $query->orderBy('created_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => $cars,
            'message' => 'Search results retrieved successfully'
        ]);
    }

    /**
     * Get cars statistics
     * Admins see all cars, regular users see only their own cars
     */
    public function statistics(): JsonResponse
    {
        $user = auth()->user();
        
        // Si es admin, obtener estadísticas de todos los autos
        if ($user->isAdmin()) {
            $cars = Car::all();
        } else {
            // Si es usuario regular, obtener solo sus autos
            $cars = $user->cars;
        }

        $stats = [
            'total_cars' => $cars->count(),
            'available_cars' => $cars->where('status', 'available')->count(),
            'sold_cars' => $cars->where('status', 'sold')->count(),
            'reserved_cars' => $cars->where('status', 'reserved')->count(),
            'maintenance_cars' => $cars->where('status', 'maintenance')->count(),
            'average_price' => $cars->avg('price'),
            'total_value' => $cars->sum('price'),
            'total_mileage' => $cars->sum('mileage')
        ];

        return response()->json([
            'success' => true,
            'data' => $stats,
            'message' => 'Statistics retrieved successfully'
        ]);
    }

    /**
     * Bulk update car status
     */
    public function bulkUpdateStatus(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'car_ids' => 'required|array|min:1',
            'car_ids.*' => 'integer|exists:cars,id',
            'status' => 'required|string|in:available,sold,reserved,maintenance'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $user = auth()->user();
        $updatedCount = 0;

        foreach ($request->car_ids as $carId) {
            $car = Car::where('id', $carId)
                     ->where('user_id', $user->id)
                     ->first();

            if ($car) {
                $car->update(['status' => $request->status]);
                $updatedCount++;
            }
        }

        return response()->json([
            'success' => true,
            'message' => "Successfully updated {$updatedCount} cars to status '{$request->status}'"
        ]);
    }
}