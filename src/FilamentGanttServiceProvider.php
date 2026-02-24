<?php

namespace Codenzia\FilamentGantt;

use Illuminate\Support\ServiceProvider;

class FilamentGanttServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->mergeConfigFrom(__DIR__ . '/../config/filament-gantt.php', 'filament-gantt');
    }

    public function boot(): void
    {
        $this->loadViewsFrom(__DIR__ . '/../resources/views', 'filament-gantt');

        $this->publishes([
            __DIR__ . '/../config/filament-gantt.php' => config_path('filament-gantt.php'),
        ], 'filament-gantt-config');

        $this->publishes([
            __DIR__ . '/../resources/assets/css/gantt.css' => public_path('css/gantt.css'),
        ], 'filament-gantt-assets');

        $this->publishes([
            __DIR__ . '/../resources/assets/js/gantt.js' => public_path('js/gantt.js'),
            __DIR__ . '/../resources/assets/js/gantt-boot.js' => public_path('js/gantt-boot.js'),
        ], 'filament-gantt-assets');
    }
}
