<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CarController;

// Rutas de autenticación (públicas)
Route::group([
    'middleware' => 'api',
    'prefix' => 'auth'
], function ($router) {
    Route::post('/register', [AuthController::class, 'register'])->name('register');
    Route::post('/login', [AuthController::class, 'login'])->name('login');
    Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:api')->name('logout');
    Route::post('/refresh', [AuthController::class, 'refresh'])->middleware('auth:api')->name('refresh');
    Route::post('/me', [AuthController::class, 'me'])->middleware('auth:api')->name('me');
});

// Rutas de carros (protegidas con JWT)
Route::group([
    'middleware' => ['api', 'auth:api'],
    'prefix' => 'cars'
], function ($router) {
    // Rutas específicas PRIMERO (antes de las rutas con parámetros)
    Route::get('/search', [CarController::class, 'search'])->name('cars.search');
    Route::get('/statistics', [CarController::class, 'statistics'])->name('cars.statistics');
    Route::patch('/bulk-status', [CarController::class, 'bulkUpdateStatus'])->name('cars.bulk-status');
    Route::get('/status/{status}', [CarController::class, 'getByStatus'])->name('cars.status');
    
    // CRUD básico
    Route::get('/', [CarController::class, 'index'])->name('cars.index');
    Route::post('/', [CarController::class, 'store'])->name('cars.store');
    
    // Rutas con parámetros AL FINAL
    Route::get('/{car}', [CarController::class, 'show'])->name('cars.show');
    Route::put('/{car}', [CarController::class, 'update'])->name('cars.update');
    Route::delete('/{car}', [CarController::class, 'destroy'])->name('cars.destroy');
});
