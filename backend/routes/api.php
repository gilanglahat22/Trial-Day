<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\RestaurantController;
use App\Http\Controllers\API\AuthController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Auth routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
});

// Public routes
Route::get('/restaurants', [RestaurantController::class, 'index']);
Route::get('/restaurant', [RestaurantController::class, 'index']);
Route::get('/restaurants/{restaurant}', [RestaurantController::class, 'show']);
Route::get('/restaurant/{restaurant}', [RestaurantController::class, 'show']);

// Debug routes for testing opening hours parsing
Route::get('/restaurants/{restaurant}/opening-hours', [RestaurantController::class, 'getOpeningHours']);
Route::get('/restaurants/{restaurant}/check-open', [RestaurantController::class, 'checkOpenStatus']);

// Admin-only routes (protected with sanctum auth and admin middleware)
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::post('/restaurants', [RestaurantController::class, 'store']);
    Route::put('/restaurants/{restaurant}', [RestaurantController::class, 'update']);
    Route::delete('/restaurants/{restaurant}', [RestaurantController::class, 'destroy']);
    
    // Singular routes for compatibility
    Route::post('/restaurant', [RestaurantController::class, 'store']);
    Route::put('/restaurant/{restaurant}', [RestaurantController::class, 'update']);
    Route::delete('/restaurant/{restaurant}', [RestaurantController::class, 'destroy']);
});
