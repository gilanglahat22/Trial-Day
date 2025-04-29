<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Restaurant>
 */
class RestaurantFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        $randomStartDay = $this->faker->numberBetween(0, 4); // Mon to Fri
        $randomEndDay = $this->faker->numberBetween($randomStartDay, 6); // Start day to Sun
        
        $openingHour = $this->faker->numberBetween(6, 11);
        $closingHour = $this->faker->numberBetween(17, 23);

        $openingHours = $days[$randomStartDay] . '-' . $days[$randomEndDay] . ' ' .
                       $openingHour . 'am-' . ($closingHour - 12) . 'pm';

        return [
            'name' => $this->faker->company() . ' ' . $this->faker->word() . ' Restaurant',
            'opening_hours' => $openingHours,
        ];
    }
} 