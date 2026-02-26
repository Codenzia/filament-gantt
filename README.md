# Filament Gantt

Package for the Gantt Filament page.

## Install

```bash
composer require codenzia/filament-gantt
```

## Publish assets

```bash
php artisan vendor:publish --tag=filament-gantt-assets
```

This publishes:

- `public/css/gantt.css`
- `public/css/gantt-custom.css`
- `public/js/gantt.js`
- `public/js/gantt-boot.js`

## Publish config

```bash
php artisan vendor:publish --tag=filament-gantt-config
```

Config file: `config/filament-gantt.php`

## Usage

### 1. Extend the base Gantt page

Create a page class that extends `Codenzia\FilamentGantt\Pages\Gantt` and implement the abstract methods:

```php
namespace App\Filament\Pages;

use Codenzia\FilamentGantt\Pages\Gantt as BaseGantt;

class Gantt extends BaseGantt
{
    protected function getGanttColumns(): array
    {
        return [
            ['name' => 'text', 'label' => 'Task name', 'tree' => true, 'width' => '*', 'resize' => true],
            ['name' => 'start_date', 'label' => 'Start time', 'align' => 'center', 'resize' => true],
            ['name' => 'duration', 'label' => 'Duration', 'width' => 80],
        ];
    }

    protected function getGanttDataArray(?int $projectId = null, array $assigneeFilter = []): array
    {
        // Load tasks from your models and return dhtmlx-compatible format
        return [
            'data' => [ /* task objects */ ],
            'links' => [ /* optional dependency links */ ],
        ];
    }
}
```

Register the page in your Filament panel (e.g. in a `PanelProvider`):

```php
->pages([
    \App\Filament\Pages\Gantt::class,
    // ...
])
```

### 2. Passing data and columns into the Gantt page

The base `mount()` signature is:

```php
public function mount(
    ?int $projectId = null,
    array $assigneeFilter = [],
    array $ganttData = [],
    array $ganttColumns = []
): void
```

- If you pass **non-empty `ganttData`**, it is used as-is and `getGanttDataArray()` is not called.
- If you pass **non-empty `ganttColumns`**, they are used as-is; otherwise the result of `getGanttColumns()` is used.

**Example: redirect to Gantt with pre-built arrays**

```php
use App\Filament\Pages\Gantt;
use Filament\Facades\Filament;

$ganttData = [
    'data' => [
        [
            'id' => 1,
            'text' => 'Task A',
            'start_date' => '2025-01-01',
            'end_date' => '2025-01-10',
            'progress' => 0.5,
            'parent' => 0,
        ],
    ],
    'links' => [],
];

$ganttColumns = [
    ['name' => 'text', 'label' => 'Task', 'tree' => true, 'width' => '*'],
    ['name' => 'start_date', 'label' => 'Start', 'width' => 100],
];

return redirect()->to(
    Gantt::getUrl(['ganttData' => $ganttData, 'ganttColumns' => $ganttColumns])
);
```

**Example: open Gantt for a project with optional assignee filter**

```php
// Uses getGanttDataArray($projectId, $assigneeFilter) and getGanttColumns()
return redirect()->to(Gantt::getUrl([
    'projectId' => 42,
    'assigneeFilter' => [1, 2, 3],
]));
```

### 3. Expected array shapes

**`ganttData`** (dhtmlx Gantt format):

```php
[
    'data' => [
        [
            'id' => 1,
            'text' => 'Task name',
            'start_date' => 'Y-m-d',
            'end_date' => 'Y-m-d',
            'progress' => 0.0–1.0,
            'parent' => 0,        // 0 = root
            'open' => true,
            // Optional: 'type' => 'project' (excluded from task count), assignee, priority, status, etc.
        ],
    ],
    'links' => [
        // Optional: ['id' => 1, 'source' => 1, 'target' => 2, 'type' => 1]
    ],
]
```

**`ganttColumns`** (grid column config):

```php
[
    ['name' => 'text', 'label' => 'Task name', 'tree' => true, 'width' => '*', 'resize' => true],
    ['name' => 'start_date', 'label' => 'Start', 'align' => 'center', 'width' => 100],
    ['name' => 'duration', 'label' => 'Duration', 'width' => 80],
    // Optional: 'template' => 'priority' for custom cell renderer
]
```

Column entries should at least have `name`; use `label` for the header and `width` / `align` / `resize` / `tree` as needed.
