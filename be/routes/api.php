<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

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

Route::post('/register', [\App\Http\Controllers\API\AuthController::class, 'register']);
Route::post('/login', [\App\Http\Controllers\API\AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [\App\Http\Controllers\API\AuthController::class, 'logout']);
    Route::get('/me', [\App\Http\Controllers\API\AuthController::class, 'me']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});

Route::apiResource('categories', \App\Http\Controllers\API\CategoryController::class);
Route::apiResource('owners', \App\Http\Controllers\API\OwnerController::class);
Route::apiResource('color-options', \App\Http\Controllers\API\ColorOptionController::class);
Route::apiResource('size-sets', \App\Http\Controllers\API\SizeSetController::class);
Route::apiResource('products', \App\Http\Controllers\API\ProductController::class);
Route::apiResource('orders', \App\Http\Controllers\API\OrderController::class);


