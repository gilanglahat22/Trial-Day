<?php

namespace Database\Seeders;

use App\Models\Restaurant;
use Illuminate\Database\Seeder;

class RestaurantSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $restaurantData = [
            ["Kushi Tsuru", "Mon-Sun 11:30 am - 9 pm"],
            ["Osakaya Restaurant", "Mon-Thu, Sun 11:30 am - 9 pm / Fri-Sat 11:30 am - 9:30 pm"],
            ["The Stinking Rose", "Mon-Thu, Sun 11:30 am - 10 pm / Fri-Sat 11:30 am - 11 pm"],
            ["McCormick & Kuleto's", "Mon-Thu, Sun 11:30 am - 10 pm / Fri-Sat 11:30 am - 11 pm"],
            ["Mifune Restaurant", "Mon-Sun 11 am - 10 pm"],
            ["The Cheesecake Factory", "Mon-Thu 11 am - 11 pm / Fri-Sat 11 am - 12:30 am / Sun 10 am - 11 pm"],
            ["New Delhi Indian Restaurant", "Mon-Sat 11:30 am - 10 pm / Sun 5:30 pm - 10 pm"],
            ["Iroha Restaurant", "Mon-Thu, Sun 11:30 am - 9:30 pm / Fri-Sat 11:30 am - 10 pm"],
            ["Rose Pistola", "Mon-Thu 11:30 am - 10 pm / Fri-Sun 11:30 am - 11 pm"],
            ["Alioto's Restaurant", "Mon-Sun 11 am - 11 pm"],
            ["Canton Seafood & Dim Sum Restaurant", "Mon-Fri 10:30 am - 9:30 pm / Sat-Sun 10 am - 9:30 pm"],
            ["All Season Restaurant", "Mon-Fri 10 am - 9:30 pm / Sat-Sun 9:30 am - 9:30 pm"],
            ["Bombay Indian Restaurant", "Mon-Sun 11:30 am - 10:30 pm"],
            ["Sam's Grill & Seafood Restaurant", "Mon-Fri 11 am - 9 pm / Sat 5 pm - 9 pm"],
            ["2G Japanese Brasserie", "Mon-Thu, Sun 11 am - 10 pm / Fri-Sat 11 am - 11 pm"],
            ["Restaurant Lulu", "Mon-Thu, Sun 11:30 am - 9 pm / Fri-Sat 11:30 am - 10 pm"],
            ["Sudachi", "Mon-Wed 5 pm - 12:30 am / Thu-Fri 5 pm - 1:30 am / Sat 3 pm - 1:30 am / Sun 3 pm - 11:30 pm"],
            ["Hanuri", "Mon-Sun 11 am - 12 am"],
            ["Herbivore", "Mon-Thu, Sun 9 am - 10 pm / Fri-Sat 9 am - 11 pm"],
            ["Penang Garden", "Mon-Thu 11 am - 10 pm / Fri-Sat 10 am - 10:30 pm / Sun 11 am - 11 pm"],
            ["John's Grill", "Mon-Sat 11 am - 10 pm / Sun 12 pm - 10 pm"],
            ["Quan Bac", "Mon-Sun 11 am - 10 pm"],
            ["Bamboo Restaurant", "Mon-Sat 11 am - 12 am / Sun 12 pm - 12 am"],
            ["Burger Bar", "Mon-Thu, Sun 11 am - 10 pm / Fri-Sat 11 am - 12 am"],
            ["Blu Restaurant", "Mon-Fri 11:30 am - 10 pm / Sat-Sun 7 am - 3 pm"],
            ["Naan 'N' Curry", "Mon-Sun 11 am - 4 am"],
            ["Shanghai China Restaurant", "Mon-Sun 11 am - 9:30 pm"],
            ["Tres", "Mon-Thu, Sun 11:30 am - 10 pm / Fri-Sat 11:30 am - 11 pm"],
            ["Isobune Sushi", "Mon-Sun 11:30 am - 9:30 pm"],
            ["Viva Pizza Restaurant", "Mon-Sun 11 am - 12 am"],
            ["Far East Cafe", "Mon-Sun 11:30 am - 10 pm"],
            ["Parallel 37", "Mon-Sun 11:30 am - 10 pm"],
            ["Bai Thong Thai Cuisine", "Mon-Sat 11 am - 11 pm / Sun 11 am - 10 pm"],
            ["Alhamra", "Mon-Sun 11 am - 11 pm"],
            ["A-1 Cafe Restaurant", "Mon, Wed-Sun 11 am - 10 pm"],
            ["Nick's Lighthouse", "Mon-Sun 11 am - 10:30 pm"],
            ["Paragon Restaurant & Bar", "Mon-Fri 11:30 am - 10 pm / Sat 5:30 pm - 10 pm"],
            ["Chili Lemon Garlic", "Mon-Fri 11 am - 10 pm / Sat-Sun 5 pm - 10 pm"],
            ["Bow Hon Restaurant", "Mon-Sun 11 am - 10:30 pm"],
            ["San Dong House", "Mon-Sun 11 am - 11 pm"],
            ["Thai Stick Restaurant", "Mon-Sun 11 am - 1 am"],
            ["Cesario's", "Mon-Thu, Sun 11:30 am - 10 pm / Fri-Sat 11:30 am - 10:30 pm"],
            ["Colombini Italian Cafe Bistro", "Mon-Fri 12 pm - 10 pm / Sat-Sun 5 pm - 10 pm"],
            ["Sabella & La Torre", "Mon-Thu, Sun 10 am - 10:30 pm / Fri-Sat 10 am - 12:30 am"],
            ["Soluna Cafe and Lounge", "Mon-Fri 11:30 am - 10 pm / Sat 5 pm - 10 pm"],
            ["Tong Palace", "Mon-Fri 9 am - 9:30 pm / Sat-Sun 9 am - 10 pm"],
            ["India Garden Restaurant", "Mon-Sun 10 am - 11 pm"],
            ["Sapporo-Ya Japanese Restaurant", "Mon-Sat 11 am - 11 pm / Sun 11 am - 10:30 pm"],
            ["Santorini's Mediterranean Cuisine", "Mon-Sun 8 am - 10:30 pm"],
            ["Kyoto Sushi", "Mon-Thu 11 am - 10:30 pm / Fri 11 am - 11 pm / Sat 11:30 am - 11 pm / Sun 4:30 pm - 10:30 pm"],
            ["Marrakech Moroccan Restaurant", "Mon-Sun 5:30 pm - 2 am"],
            ["Parallel 37", "Mon, Fri 5 pm - 6:15 pm / Tues 12:15 pm - 12:15 pm / Weds 1:15 pm - 5:45 pm / Thurs, Sat 10 am - 3 pm / Sun 6:30 am - 12:45 pm"]
        ];

        $count = 0;
        foreach ($restaurantData as $data) {
            Restaurant::create([
                'name' => $data[0],
                'opening_hours' => $data[1],
            ]);
            $count++;
        }

        $this->command->info("Seeded $count restaurants successfully!");
    }
} 