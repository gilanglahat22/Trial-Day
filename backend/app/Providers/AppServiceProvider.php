<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Vite;
use Illuminate\Foundation\Vite as FoundationVite;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Handle Vite manifest missing errors for API routes
        $this->handleViteManifestMissing();
    }

    /**
     * Handle Vite manifest missing errors
     */
    private function handleViteManifestMissing(): void
    {
        // Check if the request path starts with 'api/'
        if (request()->is('api/*')) {
            // Swap the Vite implementation to handle missing manifest gracefully
            $this->app->singleton(FoundationVite::class, function () {
                return new class extends FoundationVite {
                    public function __invoke($assets): string
                    {
                        return '';
                    }

                    public function __toString(): string
                    {
                        return '';
                    }
                };
            });
        }
    }
}
