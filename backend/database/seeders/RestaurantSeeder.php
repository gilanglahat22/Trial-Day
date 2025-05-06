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
                'name' => 'Kushi Tsuru',
                'opening_hours' => 'Mon-Sun 11:30 am - 9 pm',
            ],
            [
                'name' => 'Osakaya Restaurant',
                'opening_hours' => 'Mon-Thu, Sun 11:30 am - 9 pm / Fri-Sat 11:30 am - 9:30 pm',
            ],
            [
                'name' => 'The Stinking Rose',
                'opening_hours' => 'Mon-Thu, Sun 11:30 am - 10 pm / Fri-Sat 11:30 am - 11 pm',
            ],
            [
                'name' => 'McCormick & Kuleto\'s',
                'opening_hours' => 'Mon-Thu, Sun 11:30 am - 10 pm / Fri-Sat 11:30 am - 11 pm',
            ],
            [
                'name' => 'Mifune Restaurant',
                'opening_hours' => 'Mon-Sun 11 am - 10 pm',
            ],
            [
                'name' => 'The Cheesecake Factory',
                'opening_hours' => 'Mon-Thu 11 am - 11 pm / Fri-Sat 11 am - 12:30 am / Sun 10 am - 11 pm',
            ],
            [
                'name' => 'New Delhi Indian Restaurant',
                'opening_hours' => 'Mon-Sat 11:30 am - 10 pm / Sun 5:30 pm - 10 pm',
            ],
            [
                'name' => 'Iroha Restaurant',
                'opening_hours' => 'Mon-Thu, Sun 11:30 am - 9:30 pm / Fri-Sat 11:30 am - 10 pm',
            ],
            [
                'name' => 'Rose Pistola',
                'opening_hours' => 'Mon-Thu 11:30 am - 10 pm / Fri-Sun 11:30 am - 11 pm',
            ],
            [
                'name' => 'Alioto\'s Restaurant',
                'opening_hours' => 'Mon-Sun 11 am - 11 pm',
            ],
            [
                'name' => 'Canton Seafood & Dim Sum Restaurant',
                'opening_hours' => 'Mon-Fri 10:30 am - 9:30 pm / Sat-Sun 10 am - 9:30 pm',
            ],
            [
                'name' => 'All Season Restaurant',
                'opening_hours' => 'Mon-Fri 10 am - 9:30 pm / Sat-Sun 9:30 am - 9:30 pm',
            ],
            [
                'name' => 'Bombay Indian Restaurant',
                'opening_hours' => 'Mon-Sun 11:30 am - 10:30 pm',
            ],
            [
                'name' => 'Sam\'s Grill & Seafood Restaurant',
                'opening_hours' => 'Mon-Fri 11 am - 9 pm / Sat 5 pm - 9 pm',
            ],
            [
                'name' => '2G Japanese Brasserie',
                'opening_hours' => 'Mon-Thu, Sun 11 am - 10 pm / Fri-Sat 11 am - 11 pm',
            ],
            [
                'name' => 'Restaurant Lulu',
                'opening_hours' => 'Mon-Thu, Sun 11:30 am - 9 pm / Fri-Sat 11:30 am - 10 pm',
            ],
            [
                'name' => 'Sudachi',
                'opening_hours' => 'Mon-Wed 5 pm - 12:30 am / Thu-Fri 5 pm - 1:30 am / Sat 3 pm - 1:30 am / Sun 3 pm - 11:30 pm',
            ],
            [
                'name' => 'Hanuri',
                'opening_hours' => 'Mon-Sun 11 am - 12 am',
            ],
            [
                'name' => 'Herbivore',
                'opening_hours' => 'Mon-Thu, Sun 9 am - 10 pm / Fri-Sat 9 am - 11 pm',
            ],
            [
                'name' => 'Penang Garden',
                'opening_hours' => 'Mon-Thu 11 am - 10 pm / Fri-Sat 10 am - 10:30 pm / Sun 11 am - 11 pm',
            ],
            [
                'name' => 'John\'s Grill',
                'opening_hours' => 'Mon-Sat 11 am - 10 pm / Sun 12 pm - 10 pm',
            ],
            [
                'name' => 'Quan Bac',
                'opening_hours' => 'Mon-Sun 11 am - 10 pm',
            ],
            [
                'name' => 'Bamboo Restaurant',
                'opening_hours' => 'Mon-Sat 11 am - 12 am / Sun 12 pm - 12 am',
            ],
            [
                'name' => 'Burger Bar',
                'opening_hours' => 'Mon-Thu, Sun 11 am - 10 pm / Fri-Sat 11 am - 12 am',
            ],
            [
                'name' => 'Blu Restaurant',
                'opening_hours' => 'Mon-Fri 11:30 am - 10 pm / Sat-Sun 7 am - 3 pm',
            ],
            [
                'name' => 'Naan \'N\' Curry',
                'opening_hours' => 'Mon-Sun 11 am - 4 am',
            ],
            [
                'name' => 'Shanghai China Restaurant',
                'opening_hours' => 'Mon-Sun 11 am - 9:30 pm',
            ],
            [
                'name' => 'Tres',
                'opening_hours' => 'Mon-Thu, Sun 11:30 am - 10 pm / Fri-Sat 11:30 am - 11 pm',
            ],
            [
                'name' => 'Isobune Sushi',
                'opening_hours' => 'Mon-Sun 11:30 am - 9:30 pm',
            ],
            [
                'name' => 'Viva Pizza Restaurant',
                'opening_hours' => 'Mon-Sun 11 am - 12 am',
            ],
            [
                'name' => 'Far East Cafe',
                'opening_hours' => 'Mon-Sun 11:30 am - 10 pm',
            ],
            [
                'name' => 'Parallel 37',
                'opening_hours' => 'Mon-Sun 11:30 am - 10 pm',
            ],
            [
                'name' => 'Bai Thong Thai Cuisine',
                'opening_hours' => 'Mon-Sat 11 am - 11 pm / Sun 11 am - 10 pm',
            ],
            [
                'name' => 'Alhamra',
                'opening_hours' => 'Mon-Sun 11 am - 11 pm',
            ],
            [
                'name' => 'A-1 Cafe Restaurant',
                'opening_hours' => 'Mon, Wed-Sun 11 am - 10 pm',
            ],
            [
                'name' => 'Nick\'s Lighthouse',
                'opening_hours' => 'Mon-Sun 11 am - 10:30 pm',
            ],
            [
                'name' => 'Paragon Restaurant & Bar',
                'opening_hours' => 'Mon-Fri 11:30 am - 10 pm / Sat 5:30 pm - 10 pm',
            ],
            [
                'name' => 'Chili Lemon Garlic',
                'opening_hours' => 'Mon-Fri 11 am - 10 pm / Sat-Sun 5 pm - 10 pm',
            ],
            [
                'name' => 'Bow Hon Restaurant',
                'opening_hours' => 'Mon-Sun 11 am - 10:30 pm',
            ],
            [
                'name' => 'San Dong House',
                'opening_hours' => 'Mon-Sun 11 am - 11 pm',
            ],
            [
                'name' => 'Thai Stick Restaurant',
                'opening_hours' => 'Mon-Sun 11 am - 1 am',
            ],
            [
                'name' => 'Cesario\'s',
                'opening_hours' => 'Mon-Thu, Sun 11:30 am - 10 pm / Fri-Sat 11:30 am - 10:30 pm',
            ],
            [
                'name' => 'Colombini Italian Cafe Bistro',
                'opening_hours' => 'Mon-Fri 12 pm - 10 pm / Sat-Sun 5 pm - 10 pm',
            ],
            [
                'name' => 'Sabella & La Torre',
                'opening_hours' => 'Mon-Thu, Sun 10 am - 10:30 pm / Fri-Sat 10 am - 12:30 am',
            ],
        ];

        foreach ($restaurants as $restaurant) {
            Restaurant::create($restaurant);
        }
    }
} 