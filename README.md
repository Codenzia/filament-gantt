# Filament Gantt

Package for the Gantt Filament page.

## Install

run `composer require codenzia/filament-gantt`.

## Publish assets

```bash
php artisan vendor:publish --tag=filament-gantt-assets
```

This publishes:

- `public/css/gantt.css`
- `public/js/gantt.js`
- `public/js/gantt-boot.js`

## Publish config

```bash
php artisan vendor:publish --tag=filament-gantt-config
```

Config file: `config/filament-gantt.php`

## Usage

Use the package page class:

```php
Codenzia\FilamentGantt\Pages\Gantt::class
```

The view expects `ganttData` in the Livewire component.
