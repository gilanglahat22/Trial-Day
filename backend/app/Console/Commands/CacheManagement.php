<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\RestaurantCacheService;

class CacheManagement extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cache:restaurants {action : The action to perform (warm-up, clear, stats)}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Manage restaurant cache operations';

    protected $cacheService;

    /**
     * Create a new command instance.
     */
    public function __construct(RestaurantCacheService $cacheService)
    {
        parent::__construct();
        $this->cacheService = $cacheService;
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $action = $this->argument('action');

        switch ($action) {
            case 'warm-up':
                $this->warmUpCache();
                break;
            case 'clear':
                $this->clearCache();
                break;
            case 'stats':
                $this->showStats();
                break;
            default:
                $this->error('Invalid action. Available actions: warm-up, clear, stats');
                return 1;
        }

        return 0;
    }

    /**
     * Warm up the cache
     */
    private function warmUpCache()
    {
        $this->info('Starting cache warm-up...');
        
        try {
            $count = $this->cacheService->warmUpCache();
            $this->info("Cache warmed up successfully! Cached {$count} restaurants.");
        } catch (\Exception $e) {
            $this->error('Failed to warm up cache: ' . $e->getMessage());
        }
    }

    /**
     * Clear all caches
     */
    private function clearCache()
    {
        $this->info('Clearing all restaurant caches...');
        
        try {
            $this->cacheService->invalidateAllCaches();
            $this->info('All caches cleared successfully!');
        } catch (\Exception $e) {
            $this->error('Failed to clear cache: ' . $e->getMessage());
        }
    }

    /**
     * Show cache statistics
     */
    private function showStats()
    {
        $this->info('Fetching cache statistics...');
        
        try {
            $stats = $this->cacheService->getCacheStats();
            $available = $this->cacheService->isCacheAvailable();
            
            $this->info('Cache Status: ' . ($available ? 'Available' : 'Not Available'));
            
            if (isset($stats['error'])) {
                $this->error($stats['error']);
                return;
            }
            
            $this->table(
                ['Metric', 'Value'],
                [
                    ['Redis Version', $stats['redis_version']],
                    ['Used Memory', $stats['used_memory']],
                    ['Connected Clients', $stats['connected_clients']],
                    ['Total Commands Processed', $stats['total_commands_processed']],
                    ['Keyspace Hits', $stats['keyspace_hits']],
                    ['Keyspace Misses', $stats['keyspace_misses']],
                    ['Hit Rate', $stats['hit_rate']],
                ]
            );
        } catch (\Exception $e) {
            $this->error('Failed to get cache stats: ' . $e->getMessage());
        }
    }
} 