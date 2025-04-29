<?php

namespace Database\Seeders;

use App\Models\Restaurant;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class RestaurantSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get data from the text file
        $filePath = base_path('../test.txt');
        if (!File::exists($filePath)) {
            $this->command->error('Restaurant data file not found at: ' . $filePath);
            
            // Try another path
            $filePath = 'E:/test.txt';
            if (!File::exists($filePath)) {
                $this->command->error('Restaurant data file not found at: ' . $filePath);
                return;
            }
        }

        $fileContent = File::get($filePath);
        $lines = explode("\n", $fileContent);

        $count = 0;
        $currentRestaurant = null;
        $currentHours = '';

        foreach ($lines as $line) {
            $line = trim($line);
            if (empty($line)) {
                continue;
            }

            // Check if this is a full restaurant line with hours
            if (preg_match('/^"([^"]+)","([^"]+)"$/', $line, $matches)) {
                // If we have a previous restaurant being processed, save it first
                if ($currentRestaurant && !empty($currentHours)) {
                    Restaurant::create([
                        'name' => $currentRestaurant,
                        'opening_hours' => $currentHours,
                    ]);
                    $count++;
                }

                // Start new restaurant
                $currentRestaurant = $matches[1];
                $currentHours = $matches[2];
            } 
            // Check if this is a continuation of hours (wrapping to next line)
            else if ($currentRestaurant && preg_match('/^([^"]+)"$/', $line, $matches)) {
                $currentHours .= ' ' . $matches[1];
            }
        }

        // Save the last restaurant if there is one
        if ($currentRestaurant && !empty($currentHours)) {
            Restaurant::create([
                'name' => $currentRestaurant,
                'opening_hours' => $currentHours,
            ]);
            $count++;
        }

        $this->command->info("Imported $count restaurants successfully!");
    }
} 