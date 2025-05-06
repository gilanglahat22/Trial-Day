<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Restaurant;
use App\Models\User;

class TestApiSetup extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'test:api';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test API setup by checking restaurant and user data';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Testing API setup...');
        
        // Check for restaurants
        $restaurantCount = Restaurant::count();
        if ($restaurantCount > 0) {
            $this->info("✅ Found {$restaurantCount} restaurants in the database.");
            
            // Display a few sample restaurants
            $this->info("\nSample restaurants:");
            $samples = Restaurant::take(3)->get();
            foreach ($samples as $restaurant) {
                $this->info("- {$restaurant->name}: {$restaurant->opening_hours}");
            }
        } else {
            $this->error("❌ No restaurants found in the database. Run migrations and seeders.");
        }
        
        // Check for users
        $userCount = User::count();
        if ($userCount > 0) {
            $this->info("\n✅ Found {$userCount} users in the database.");
            
            // Check for admin user
            $adminUser = User::where('role', 'admin')->first();
            if ($adminUser) {
                $this->info("✅ Admin user found: {$adminUser->email}");
            } else {
                $this->error("❌ No admin user found.");
            }
        } else {
            $this->error("❌ No users found in the database. Run migrations and seeders.");
        }
        
        $this->info("\nAPI endpoints:");
        $this->info("- GET /api/restaurants - List all restaurants");
        $this->info("- GET /api/restaurants?name=value - Filter by name");
        $this->info("- GET /api/restaurants?day=Monday - Filter by day");
        $this->info("- GET /api/restaurants?time=14:30 - Filter by time (24-hour format)");
        $this->info("- POST /api/login - Login with admin@example.com / password");
        
        $this->info("\nSetup complete! Run 'php artisan serve' to start the API server.");
        
        return Command::SUCCESS;
    }
} 