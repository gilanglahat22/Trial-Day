<?php

namespace Tests\Feature;

use App\Models\Restaurant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class RestaurantTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_get_all_restaurants()
    {
        Restaurant::factory(3)->create();

        $response = $this->get('/api/restaurants');

        $response->assertStatus(200)
            ->assertJsonCount(3);
    }

    public function test_can_get_filtered_restaurants()
    {
        Restaurant::create([
            'name' => 'Test Restaurant 1',
            'opening_hours' => 'Mon-Fri 9am-5pm',
        ]);
        
        Restaurant::create([
            'name' => 'Test Restaurant 2',
            'opening_hours' => 'Sat-Sun 10am-3pm',
        ]);

        // Filter by name
        $response = $this->get('/api/restaurants?name=1');
        $response->assertStatus(200)
            ->assertJsonCount(1);

        // Filter by day
        $response = $this->get('/api/restaurants?day=Sat');
        $response->assertStatus(200)
            ->assertJsonCount(1);
    }

    public function test_admin_can_create_restaurant()
    {
        $admin = User::factory()->create([
            'role' => 'admin',
        ]);

        $response = $this->actingAs($admin)
            ->postJson('/api/restaurants', [
                'name' => 'New Restaurant',
                'opening_hours' => 'Mon-Sun 9am-9pm',
            ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('restaurants', [
            'name' => 'New Restaurant',
        ]);
    }

    public function test_non_admin_cannot_create_restaurant()
    {
        $user = User::factory()->create([
            'role' => 'user',
        ]);

        $response = $this->actingAs($user)
            ->postJson('/api/restaurants', [
                'name' => 'New Restaurant',
                'opening_hours' => 'Mon-Sun 9am-9pm',
            ]);

        $response->assertStatus(403);
    }
} 