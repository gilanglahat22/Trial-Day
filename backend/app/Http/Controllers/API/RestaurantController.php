<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Restaurant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class RestaurantController extends Controller
{
    /**
     * Get list of all restaurants with optional filtering
     */
    public function index(Request $request)
    {
        $query = Restaurant::query();

        // Filter by name
        if ($request->has('name') && !empty($request->name)) {
            $query->where('name', 'like', '%' . $request->name . '%');
        }

        // Filter by day (e.g., 'Mon', 'Tue', 'Wed', etc.)
        if ($request->has('day') && !empty($request->day)) {
            $day = ucfirst(strtolower(substr($request->day, 0, 3)));
            $possibleDayFormats = [
                $day,           // Mon
                $day . '-',     // Mon-
                ', ' . $day,    // , Mon
                '/' . $day,     // /Mon
                $day . ',',     // Mon,
            ];
            
            $dayConditions = [];
            foreach ($possibleDayFormats as $format) {
                $dayConditions[] = "opening_hours LIKE '%$format%'";
            }
            
            $query->whereRaw('(' . implode(' OR ', $dayConditions) . ')');
        }

        // Filter by time (checking if the restaurant is open at the specified time)
        if ($request->has('time') && !empty($request->time)) {
            try {
                // Parse the time
                $queryTime = Carbon::createFromFormat('H:i', $request->time);
                
                // Compare with opening hours
                $restaurants = $query->get();
                $filteredIds = [];
                
                foreach ($restaurants as $restaurant) {
                    $openingHours = $restaurant->opening_hours;
                    $schedules = explode('/', $openingHours);
                    
                    foreach ($schedules as $schedule) {
                        $schedule = trim($schedule);
                        
                        // Extract time part (e.g., "11:30 am - 9 pm")
                        if (preg_match('/(\d+(?::\d+)?\s*[ap]m)\s*-\s*(\d+(?::\d+)?\s*[ap]m)/', $schedule, $matches)) {
                            $openTime = Carbon::createFromFormat('g:i a', str_replace(['.', ' '], ['', ''], $matches[1]));
                            $closeTime = Carbon::createFromFormat('g:i a', str_replace(['.', ' '], ['', ''], $matches[2]));
                            
                            // Handle cases where closing time is after midnight
                            if ($closeTime->lt($openTime)) {
                                $closeTime->addDay();
                            }
                            
                            // Check if the restaurant is open at the query time
                            if ($queryTime->gte($openTime) && $queryTime->lte($closeTime)) {
                                $filteredIds[] = $restaurant->id;
                                break;
                            }
                        }
                    }
                }
                
                if (!empty($filteredIds)) {
                    $query->whereIn('id', $filteredIds);
                } else {
                    // No restaurants found for the specified time
                    return response()->json([]);
                }
            } catch (\Exception $e) {
                return response()->json(['error' => 'Invalid time format. Use HH:MM (24-hour format)'], 422);
            }
        }

        // Get the results and return
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