<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CarController;
use App\Http\Controllers\UserController;

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
    
    // Rutas protegidas para perfil
    Route::put('/profile', [AuthController::class, 'updateProfile'])->middleware('auth:api')->name('update-profile');
    Route::put('/change-password', [AuthController::class, 'changePassword'])->middleware('auth:api')->name('change-password');
    Route::post('/upload-photo', [AuthController::class, 'uploadPhoto'])->middleware('auth:api')->name('upload-photo');
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

// Rutas de usuarios (solo para administradores)
Route::group([
    'middleware' => ['api', 'auth:api', 'admin'],
    'prefix' => 'users'
], function ($router) {
    Route::get('/', [UserController::class, 'index'])->name('users.index');
    Route::get('/statistics', [UserController::class, 'statistics'])->name('users.statistics');
    Route::get('/{user}', [UserController::class, 'show'])->name('users.show');
    Route::put('/{user}', [UserController::class, 'update'])->name('users.update');
    Route::delete('/{user}', [UserController::class, 'destroy'])->name('users.destroy');
});
