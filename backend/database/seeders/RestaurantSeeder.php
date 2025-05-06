<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Restaurant;

class RestaurantSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $restaurants = [
            [
                'name' => 'Restaurant A',
                'opening_hours' => 'Mon-Fri 8:00 am - 10:00 pm / Sat-Sun 9:00 am - 11:00 pm',
            ],
            [
                'name' => 'Restaurant B',
                'opening_hours' => 'Mon-Thu 11:30 am - 9:00 pm / Fri-Sat 11:30 am - 10:00 pm / Sun 12:00 pm - 8:00 pm',
            ],
            [
                'name' => 'Restaurant C',
                'opening_hours' => 'Mon, Wed, Thu 11:00 am - 8:30 pm / Fri-Sat 11:00 am - 9:00 pm / Sun 11:00 am - 6:00 pm',
            ],
            [
                'name' => 'Restaurant D',
                'opening_hours' => 'Mon-Fri 8:30 am - 9:30 pm / Sat 9:00 am - 10:00 pm / Sun 9:00 am - 8:00 pm',
            ],
        ];

        foreach ($restaurants as $restaurant) {
            Restaurant::create($restaurant);
        }
    }
} 