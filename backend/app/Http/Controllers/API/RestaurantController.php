<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Restaurant;
use App\Services\RestaurantFilterService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class RestaurantController extends Controller
{
    protected $filterService;

    public function __construct(RestaurantFilterService $filterService)
    {
        $this->filterService = $filterService;
    }

    /**
     * Get list of all restaurants with optional filtering
     */
    public function index(Request $request)
    {
        // Start with all restaurants
        $restaurants = Restaurant::all();

        // Apply name filter
        if ($request->has('name') && !empty($request->name)) {
            $restaurants = $this->filterService->filterByName($restaurants, $request->name);
        }

        // Apply day and time filters
        $day = $request->has('day') && !empty($request->day) ? $request->day : null;
        $time = $request->has('time') && !empty($request->time) ? $request->time : null;

        if ($day || $time) {
            $restaurants = $this->filterService->filterByDayAndTime($restaurants, $day, $time);
        }

        // Convert back to array for JSON response
        $restaurants = $restaurants->values();

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

    /**
     * Get parsed opening hours for a restaurant (for debugging/testing)
     */
    public function getOpeningHours(Restaurant $restaurant)
    {
        $parsedHours = $this->filterService->parseOpeningHours($restaurant->opening_hours);
        
        return response()->json([
            'restaurant' => $restaurant->name,
            'raw_opening_hours' => $restaurant->opening_hours,
            'parsed_schedules' => $parsedHours
        ]);
    }

    /**
     * Check if a restaurant is open at specific day and time
     */
    public function checkOpenStatus(Request $request, Restaurant $restaurant)
    {
        $day = $request->get('day');
        $time = $request->get('time');

        $isOpen = $this->filterService->isOpenAt($restaurant->opening_hours, $day, $time);

        return response()->json([
            'restaurant' => $restaurant->name,
            'day' => $day,
            'time' => $time,
            'is_open' => $isOpen,
            'opening_hours' => $restaurant->opening_hours
        ]);
    }
} 