<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use PDO;
use PDOException;

class DatabaseMonitor extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'db:monitor';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Monitor database connection';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $host = env('DB_HOST');
        $port = env('DB_PORT');
        $database = env('DB_DATABASE');
        $username = env('DB_USERNAME');
        $password = env('DB_PASSWORD');

        try {
            $dsn = "mysql:host=$host;port=$port";
            $connection = new PDO($dsn, $username, $password);
            $this->info("Database connection successful!");
            return 0;
        } catch (PDOException $e) {
            $this->error("Database connection failed: " . $e->getMessage());
            return 1;
        }
    }
} 