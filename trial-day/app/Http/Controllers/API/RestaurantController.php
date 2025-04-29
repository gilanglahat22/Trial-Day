<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Restaurant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class RestaurantController extends Controller
{
    /**
     * Get list of all restaurants
     */
    public function index(Request $request)
    {
        $query = Restaurant::query();

        // Filter by name
        if ($request->has('name')) {
            $query->where('name', 'like', '%' . $request->name . '%');
        }

        // Filter by time (checking if the restaurant is open at the specified time)
        if ($request->has('time')) {
            $time = $request->time;
            $query->whereRaw("opening_hours LIKE ?", ["%$time%"]);
        }

        // Filter by day
        if ($request->has('day')) {
            $day = $request->day;
            $query->whereRaw("opening_hours LIKE ?", ["%$day%"]);
        }

        $restaurants = $query->get();
        return response()->json($restaurants);
    }

    /**
     * Store a new restaurant
     */
    public function store(Request $request)
    {
        // Validate request
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'opening_hours' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Create new restaurant
        $restaurant = Restaurant::create($request->all());
        
        return response()->json($restaurant, 201);
    }

    /**
     * Get a specific restaurant
     */
    public function show(Restaurant $restaurant)
    {
        return response()->json($restaurant);
    }

    /**
     * Update a restaurant
     */
    public function update(Request $request, Restaurant $restaurant)
    {
        // Validate request
        $validator = Validator::make($request->all(), [
            'name' => 'string|max:255',
            'opening_hours' => 'string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Update restaurant
        $restaurant->update($request->all());
        
        return response()->json($restaurant);
    }

    /**
     * Delete a restaurant
     */
    public function destroy(Restaurant $restaurant)
    {
        $restaurant->delete();
        return response()->json(null, 204);
    }
} 