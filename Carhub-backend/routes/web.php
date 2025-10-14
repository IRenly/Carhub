<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

// Rutas de debug para testing
Route::get('/create_test_car', function () {
    return response()->file(public_path('create_test_car.html'));
});

Route::get('/debug_cars_api', function () {
    return response()->file(public_path('debug_cars_api.html'));
});
