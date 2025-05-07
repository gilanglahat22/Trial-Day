<?php

namespace App\Services;

use App\Models\Restaurant;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class RestaurantCacheService
{
    const CACHE_TTL = 3600; // 1 hour
    const CACHE_PREFIX = 'restaurants:';
    const ALL_RESTAURANTS_KEY = 'restaurants:all';
    const FILTERED_RESTAURANTS_PREFIX = 'restaurants:filtered:';
    const RESTAURANT_PREFIX = 'restaurant:';

    /**
     * Get all restaurants from cache or database
     */
    public function getAllRestaurants()
    {
        return Cache::remember(self::ALL_RESTAURANTS_KEY, self::CACHE_TTL, function () {
            Log::info('Fetching all restaurants from database');
            return Restaurant::all();
        });
    }

    /**
     * Get a specific restaurant from cache or database
     */
    public function getRestaurant($id)
    {
        $cacheKey = self::RESTAURANT_PREFIX . $id;
        
        return Cache::remember($cacheKey, self::CACHE_TTL, function () use ($id) {
            Log::info("Fetching restaurant {$id} from database");
            return Restaurant::find($id);
        });
    }

    /**
     * Get filtered restaurants with caching
     */
    public function getFilteredRestaurants($filters = [])
    {
        $cacheKey = $this->generateFilterCacheKey($filters);
        
        return Cache::remember($cacheKey, self::CACHE_TTL, function () use ($filters) {
            Log::info('Fetching filtered restaurants from database', ['filters' => $filters]);
            
            $query = Restaurant::query();
            
            // Apply name filter
            if (!empty($filters['name'])) {
                $query->where('name', 'like', '%' . $filters['name'] . '%');
            }
            
            return $query->get();
        });
    }

    /**
     * Store restaurant in cache
     */
    public function cacheRestaurant(Restaurant $restaurant)
    {
        $cacheKey = self::RESTAURANT_PREFIX . $restaurant->id;
        Cache::put($cacheKey, $restaurant, self::CACHE_TTL);
        
        Log::info("Cached restaurant {$restaurant->id}");
    }

    /**
     * Invalidate all restaurant caches
     */
    public function invalidateAllCaches()
    {
        // Clear all restaurants cache
        Cache::forget(self::ALL_RESTAURANTS_KEY);
        
        // Clear filtered caches (we'll use tags for this in production)
        $this->clearFilteredCaches();
        
        Log::info('Invalidated all restaurant caches');
    }

    /**
     * Invalidate specific restaurant cache
     */
    public function invalidateRestaurantCache($id)
    {
        $cacheKey = self::RESTAURANT_PREFIX . $id;
        Cache::forget($cacheKey);
        
        // Also invalidate all restaurants and filtered caches
        $this->invalidateAllCaches();
        
        Log::info("Invalidated cache for restaurant {$id}");
    }

    /**
     * Generate cache key for filtered results
     */
    private function generateFilterCacheKey($filters)
    {
        $filterString = '';
        
        if (!empty($filters['name'])) {
            $filterString .= 'name:' . md5($filters['name']);
        }
        
        if (!empty($filters['day'])) {
            $filterString .= ':day:' . $filters['day'];
        }
        
        if (!empty($filters['time'])) {
            $filterString .= ':time:' . md5($filters['time']);
        }
        
        return self::FILTERED_RESTAURANTS_PREFIX . md5($filterString);
    }

    /**
     * Clear all filtered caches
     * In production, you might want to use Redis tags for better cache management
     */
    private function clearFilteredCaches()
    {
        // This is a simple implementation
        // In production, consider using Redis SCAN or cache tags
        try {
            $redis = Cache::getRedis();
            $keys = $redis->keys(self::FILTERED_RESTAURANTS_PREFIX . '*');
            
            if (!empty($keys)) {
                $redis->del($keys);
            }
        } catch (\Exception $e) {
            Log::warning('Failed to clear filtered caches: ' . $e->getMessage());
        }
    }

    /**
     * Get cache statistics
     */
    public function getCacheStats()
    {
        try {
            $redis = Cache::getRedis();
            $info = $redis->info();
            
            return [
                'redis_version' => $info['redis_version'] ?? 'unknown',
                'used_memory' => $info['used_memory_human'] ?? 'unknown',
                'connected_clients' => $info['connected_clients'] ?? 'unknown',
                'total_commands_processed' => $info['total_commands_processed'] ?? 'unknown',
                'keyspace_hits' => $info['keyspace_hits'] ?? 0,
                'keyspace_misses' => $info['keyspace_misses'] ?? 0,
                'hit_rate' => $this->calculateHitRate($info),
            ];
        } catch (\Exception $e) {
            Log::error('Failed to get cache stats: ' . $e->getMessage());
            return ['error' => 'Unable to retrieve cache statistics'];
        }
    }

    /**
     * Calculate cache hit rate
     */
    private function calculateHitRate($info)
    {
        $hits = $info['keyspace_hits'] ?? 0;
        $misses = $info['keyspace_misses'] ?? 0;
        $total = $hits + $misses;
        
        if ($total === 0) {
            return '0%';
        }
        
        return round(($hits / $total) * 100, 2) . '%';
    }

    /**
     * Warm up cache with all restaurants
     */
    public function warmUpCache()
    {
        Log::info('Starting cache warm-up');
        
        // Warm up all restaurants
        $restaurants = $this->getAllRestaurants();
        
        // Warm up individual restaurant caches
        foreach ($restaurants as $restaurant) {
            $this->cacheRestaurant($restaurant);
        }
        
        Log::info('Cache warm-up completed', ['restaurants_cached' => $restaurants->count()]);
        
        return $restaurants->count();
    }

    /**
     * Check if cache is available
     */
    public function isCacheAvailable()
    {
        try {
            Cache::put('cache_test', 'test', 10);
            $result = Cache::get('cache_test');
            Cache::forget('cache_test');
            
            return $result === 'test';
        } catch (\Exception $e) {
            Log::error('Cache availability check failed: ' . $e->getMessage());
            return false;
        }
    }
} 