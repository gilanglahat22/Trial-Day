<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Restaurant;
use App\Services\RestaurantFilterService;
use App\Services\RestaurantCacheService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class RestaurantController extends Controller
{
    protected $filterService;
    protected $cacheService;

    public function __construct(RestaurantFilterService $filterService, RestaurantCacheService $cacheService)
    {
        $this->filterService = $filterService;
        $this->cacheService = $cacheService;
    }

    /**
     * Get list of all restaurants with optional filtering
     */
    public function index(Request $request)
    {
        try {
            $startTime = microtime(true);
            
            // Check if cache is available
            if (!$this->cacheService->isCacheAvailable()) {
                Log::warning('Cache not available, falling back to database');
                return $this->indexWithoutCache($request);
            }

            // Get filters from request
            $filters = [
                'name' => $request->get('name'),
                'day' => $request->get('day'),
                'time' => $request->get('time'),
            ];

            // For simple name filtering, use cached filtered results
            if (!empty($filters['name']) && empty($filters['day']) && empty($filters['time'])) {
                $restaurants = $this->cacheService->getFilteredRestaurants(['name' => $filters['name']]);
            } else {
                // Get all restaurants from cache
                $restaurants = $this->cacheService->getAllRestaurants();
                
                // Apply name filter
                if (!empty($filters['name'])) {
                    $restaurants = $this->filterService->filterByName($restaurants, $filters['name']);
                }

                // Apply day and time filters (these are complex and not cached separately)
                if (!empty($filters['day']) || !empty($filters['time'])) {
                    $restaurants = $this->filterService->filterByDayAndTime(
                        $restaurants, 
                        $filters['day'], 
                        $filters['time']
                    );
                }
            }

            // Convert back to array for JSON response
            $restaurants = $restaurants->values();
            
            $executionTime = round((microtime(true) - $startTime) * 1000, 2);
            
            return response()->json([
                'data' => $restaurants,
                'meta' => [
                    'total' => $restaurants->count(),
                    'execution_time_ms' => $executionTime,
                    'cached' => true,
                    'filters_applied' => array_filter($filters)
                ]
            ]);
            
        } catch (\Exception $e) {
            Log::error('Error in cached restaurant index: ' . $e->getMessage());
            return $this->indexWithoutCache($request);
        }
    }

    /**
     * Fallback method without cache
     */
    private function indexWithoutCache(Request $request)
    {
        $startTime = microtime(true);
        
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
        
        $executionTime = round((microtime(true) - $startTime) * 1000, 2);

        return response()->json([
            'data' => $restaurants,
            'meta' => [
                'total' => $restaurants->count(),
                'execution_time_ms' => $executionTime,
                'cached' => false,
                'filters_applied' => array_filter([
                    'name' => $request->get('name'),
                    'day' => $day,
                    'time' => $time
                ])
            ]
        ]);
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

        try {
            // Create new restaurant
            $restaurant = Restaurant::create($request->all());
            
            // Cache the new restaurant
            $this->cacheService->cacheRestaurant($restaurant);
            
            // Invalidate all caches to ensure consistency
            $this->cacheService->invalidateAllCaches();
            
            Log::info('New restaurant created and cached', ['restaurant_id' => $restaurant->id]);
            
            return response()->json([
                'data' => $restaurant,
                'message' => 'Restaurant created successfully'
            ], 201);
            
        } catch (\Exception $e) {
            Log::error('Error creating restaurant: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to create restaurant'], 500);
        }
    }

    /**
     * Get a specific restaurant
     */
    public function show(Restaurant $restaurant)
    {
        try {
            $startTime = microtime(true);
            
            // Try to get from cache first
            $cachedRestaurant = $this->cacheService->getRestaurant($restaurant->id);
            
            $executionTime = round((microtime(true) - $startTime) * 1000, 2);
            
            return response()->json([
                'data' => $cachedRestaurant ?? $restaurant,
                'meta' => [
                    'execution_time_ms' => $executionTime,
                    'cached' => $cachedRestaurant !== null
                ]
            ]);
            
        } catch (\Exception $e) {
            Log::error('Error fetching restaurant: ' . $e->getMessage());
            return response()->json(['data' => $restaurant]);
        }
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

        try {
            // Update restaurant
            $restaurant->update($request->all());
            
            // Update cache with new data
            $this->cacheService->cacheRestaurant($restaurant);
            
            // Invalidate all caches to ensure consistency
            $this->cacheService->invalidateAllCaches();
            
            Log::info('Restaurant updated and cache refreshed', ['restaurant_id' => $restaurant->id]);
            
            return response()->json([
                'data' => $restaurant,
                'message' => 'Restaurant updated successfully'
            ]);
            
        } catch (\Exception $e) {
            Log::error('Error updating restaurant: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to update restaurant'], 500);
        }
    }

    /**
     * Delete a restaurant
     */
    public function destroy(Restaurant $restaurant)
    {
        try {
            $restaurantId = $restaurant->id;
            
            // Delete restaurant
            $restaurant->delete();
            
            // Remove from cache
            $this->cacheService->invalidateRestaurantCache($restaurantId);
            
            Log::info('Restaurant deleted and cache invalidated', ['restaurant_id' => $restaurantId]);
            
            return response()->json([
                'message' => 'Restaurant deleted successfully'
            ], 200);
            
        } catch (\Exception $e) {
            Log::error('Error deleting restaurant: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to delete restaurant'], 500);
        }
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

    /**
     * Get cache statistics
     */
    public function getCacheStats()
    {
        try {
            $stats = $this->cacheService->getCacheStats();
            
            return response()->json([
                'cache_stats' => $stats,
                'cache_available' => $this->cacheService->isCacheAvailable()
            ]);
            
        } catch (\Exception $e) {
            Log::error('Error getting cache stats: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to retrieve cache statistics'], 500);
        }
    }

    /**
     * Warm up cache
     */
    public function warmUpCache()
    {
        try {
            $count = $this->cacheService->warmUpCache();
            
            return response()->json([
                'message' => 'Cache warmed up successfully',
                'restaurants_cached' => $count
            ]);
            
        } catch (\Exception $e) {
            Log::error('Error warming up cache: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to warm up cache'], 500);
        }
    }

    /**
     * Clear all caches
     */
    public function clearCache()
    {
        try {
            $this->cacheService->invalidateAllCaches();
            
            return response()->json([
                'message' => 'All caches cleared successfully'
            ]);
            
        } catch (\Exception $e) {
            Log::error('Error clearing cache: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to clear cache'], 500);
        }
    }
} 