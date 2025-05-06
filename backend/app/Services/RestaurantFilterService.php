<?php

namespace App\Services;

use Carbon\Carbon;
use Illuminate\Support\Collection;

class RestaurantFilterService
{
    /**
     * Parse opening hours string and check if restaurant is open at specific day and time
     */
    public function isOpenAt(string $openingHours, ?string $day = null, ?string $time = null): bool
    {
        $schedules = $this->parseOpeningHours($openingHours);
        
        foreach ($schedules as $schedule) {
            // Check day match
            if ($day && !$this->isDayInSchedule($schedule, $day)) {
                continue;
            }
            
            // Check time match
            if ($time && !$this->isTimeInSchedule($schedule, $time)) {
                continue;
            }
            
            // If we reach here, both day and time match (or weren't specified)
            return true;
        }
        
        return false;
    }
    
    /**
     * Parse opening hours string into structured data
     */
    public function parseOpeningHours(string $openingHours): array
    {
        $schedules = [];
        $parts = explode('/', $openingHours);
        
        foreach ($parts as $part) {
            $part = trim($part);
            $schedule = $this->parseSchedulePart($part);
            if ($schedule) {
                $schedules[] = $schedule;
            }
        }
        
        return $schedules;
    }
    
    /**
     * Parse individual schedule part (e.g., "Mon-Thu, Sun 11:30 am - 9 pm")
     */
    private function parseSchedulePart(string $part): ?array
    {
        // Pattern to match: "Days TimeStart - TimeEnd"
        $pattern = '/^(.+?)\s+(\d+(?::\d+)?\s*[ap]m)\s*-\s*(\d+(?::\d+)?\s*[ap]m)$/i';
        
        if (preg_match($pattern, $part, $matches)) {
            $daysString = trim($matches[1]);
            $startTime = $this->normalizeTime($matches[2]);
            $endTime = $this->normalizeTime($matches[3]);
            
            $days = $this->parseDays($daysString);
            
            return [
                'days' => $days,
                'start_time' => $startTime,
                'end_time' => $endTime,
                'raw' => $part
            ];
        }
        
        return null;
    }
    
    /**
     * Parse days string (e.g., "Mon-Thu, Sun" or "Mon-Fri")
     */
    private function parseDays(string $daysString): array
    {
        $days = [];
        $dayMap = [
            'mon' => 'Monday',
            'tue' => 'Tuesday', 
            'wed' => 'Wednesday',
            'thu' => 'Thursday',
            'fri' => 'Friday',
            'sat' => 'Saturday',
            'sun' => 'Sunday'
        ];
        
        // Split by comma first
        $parts = explode(',', $daysString);
        
        foreach ($parts as $part) {
            $part = trim(strtolower($part));
            
            // Check for range (e.g., "mon-fri")
            if (strpos($part, '-') !== false) {
                $rangeParts = explode('-', $part);
                if (count($rangeParts) === 2) {
                    $startDay = trim($rangeParts[0]);
                    $endDay = trim($rangeParts[1]);
                    
                    if (isset($dayMap[$startDay]) && isset($dayMap[$endDay])) {
                        $days = array_merge($days, $this->getDayRange($startDay, $endDay));
                    }
                }
            } else {
                // Single day
                if (isset($dayMap[$part])) {
                    $days[] = $dayMap[$part];
                }
            }
        }
        
        return array_unique($days);
    }
    
    /**
     * Get range of days between start and end day
     */
    private function getDayRange(string $startDay, string $endDay): array
    {
        $dayOrder = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
        $startIndex = array_search($startDay, $dayOrder);
        $endIndex = array_search($endDay, $dayOrder);
        
        $days = [];
        $dayMap = [
            'mon' => 'Monday',
            'tue' => 'Tuesday', 
            'wed' => 'Wednesday',
            'thu' => 'Thursday',
            'fri' => 'Friday',
            'sat' => 'Saturday',
            'sun' => 'Sunday'
        ];
        
        if ($startIndex !== false && $endIndex !== false) {
            if ($endIndex >= $startIndex) {
                // Normal range (e.g., Mon-Fri)
                for ($i = $startIndex; $i <= $endIndex; $i++) {
                    $days[] = $dayMap[$dayOrder[$i]];
                }
            } else {
                // Wrap around range (e.g., Fri-Mon)
                for ($i = $startIndex; $i < count($dayOrder); $i++) {
                    $days[] = $dayMap[$dayOrder[$i]];
                }
                for ($i = 0; $i <= $endIndex; $i++) {
                    $days[] = $dayMap[$dayOrder[$i]];
                }
            }
        }
        
        return $days;
    }
    
    /**
     * Normalize time format (e.g., "11:30 am" -> "11:30 AM")
     */
    private function normalizeTime(string $time): string
    {
        $time = preg_replace('/\s+/', ' ', trim($time));
        $time = str_replace(['.', ','], '', $time);
        
        // Add minutes if missing (e.g., "11 am" -> "11:00 am")
        if (!preg_match('/:\d+/', $time)) {
            $time = preg_replace('/(\d+)\s*([ap]m)/i', '$1:00 $2', $time);
        }
        
        return strtoupper($time);
    }
    
    /**
     * Check if a day is included in the schedule
     */
    private function isDayInSchedule(array $schedule, string $day): bool
    {
        $day = ucfirst(strtolower($day));
        return in_array($day, $schedule['days']);
    }
    
    /**
     * Check if a time is within the schedule's time range
     */
    private function isTimeInSchedule(array $schedule, string $time): bool
    {
        try {
            $queryTime = Carbon::createFromFormat('H:i', $time);
            $startTime = Carbon::createFromFormat('g:i A', $schedule['start_time']);
            $endTime = Carbon::createFromFormat('g:i A', $schedule['end_time']);
            
            // Handle overnight schedules (e.g., 11 PM - 2 AM)
            if ($endTime->lt($startTime)) {
                // Check if time is after start time OR before end time (next day)
                return $queryTime->gte($startTime) || $queryTime->lte($endTime);
            } else {
                // Normal schedule within same day
                return $queryTime->gte($startTime) && $queryTime->lte($endTime);
            }
        } catch (\Exception $e) {
            return false;
        }
    }
    
    /**
     * Filter restaurants by name
     */
    public function filterByName(Collection $restaurants, string $name): Collection
    {
        return $restaurants->filter(function ($restaurant) use ($name) {
            return stripos($restaurant->name, $name) !== false;
        });
    }
    
    /**
     * Filter restaurants by day and time
     */
    public function filterByDayAndTime(Collection $restaurants, ?string $day = null, ?string $time = null): Collection
    {
        if (!$day && !$time) {
            return $restaurants;
        }
        
        return $restaurants->filter(function ($restaurant) use ($day, $time) {
            return $this->isOpenAt($restaurant->opening_hours, $day, $time);
        });
    }
} 