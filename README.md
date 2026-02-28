# Filament Gantt

An interactive Gantt chart page for Filament v4 powered by dhtmlxGantt — with drag-and-drop task scheduling, filtering, zoom controls, export, and full dark mode support.

## Features

- **Interactive Gantt Chart** — Drag-and-drop task scheduling with real-time updates
- **Task Dependencies** — Visual links between related tasks
- **Filtering** — Filter by priority, assignee, project, status, and type
- **Sorting** — Sort tasks by priority or name
- **Column Management** — Toggle column visibility with persistence
- **Zoom Controls** — Multiple zoom levels from hour to decade
- **Export** — Export to PDF or PNG
- **Assignee Avatars** — Display user avatars with fallback generation
- **Priority Badges** — Color-coded priority indicators (high, medium, low)
- **Status Icons** — Custom Heroicon status indicators on task bars
- **Change Tracking** — Batch save with pending changes indicator
- **Dark Mode** — Full Filament dark mode support with automatic theme detection
- **Filter Persistence** — Saves filter preferences for 30 days
- **Row Resizing** — Adjustable row heights

## Requirements

- PHP 8.3+
- Laravel 12+
- Filament 4.x
- Livewire 3.x

## Installation

Install via Composer:

```bash
composer require codenzia/filament-gantt
```

Publish the assets:

```bash
php artisan vendor:publish --tag="filament-gantt-assets"
```

Publish the config (optional):

```bash
php artisan vendor:publish --tag="filament-gantt-config"
```

## Setup

### 1. Create a Gantt Page

Create a Filament page that extends the base Gantt class:

```php
namespace App\Filament\Pages;

use Codenzia\FilamentGantt\Pages\Gantt as BaseGantt;

class Gantt extends BaseGantt
{
    protected function getGanttColumns(): array
    {
        return [
            [
                'name' => 'text',
                'label' => 'Task',
                'tree' => true,
                'width' => '*',
                'resize' => true,
            ],
            [
                'name' => 'start_date',
                'label' => 'Start',
                'align' => 'center',
                'width' => 100,
            ],
            [
                'name' => 'priority',
                'label' => 'Priority',
                'template' => 'priority',
                'align' => 'center',
                'width' => 100,
            ],
            [
                'name' => 'assignee',
                'label' => 'Assigned',
                'template' => 'assignee',
                'align' => 'center',
                'width' => 100,
            ],
        ];
    }

    protected function getGanttDataArray(
        ?int $projectId = null,
        array $assigneeFilter = [],
    ): array {
        $tasks = Task::query()
            ->when($projectId, fn ($q) => $q->where('project_id', $projectId))
            ->when($assigneeFilter, fn ($q) => $q->whereIn('assignee_id', $assigneeFilter))
            ->with(['assignee', 'project'])
            ->get();

        return [
            'data' => $tasks->map(fn ($task) => [
                'id' => $task->id,
                'text' => $task->title,
                'start_date' => $task->start_date->format('Y-m-d'),
                'end_date' => $task->end_date->format('Y-m-d'),
                'progress' => $task->progress,
                'priority' => $task->priority,
                'assignee' => $task->assignee,
                'parent' => $task->parent_id ?? 0,
            ])->toArray(),
            'links' => [],
        ];
    }
}
```

### 2. Register the Page

Add your Gantt page to your panel provider:

```php
public function panel(Panel $panel): Panel
{
    return $panel
        ->pages([
            \App\Filament\Pages\Gantt::class,
        ]);
}
```

## Data Format

### Task Data

The `getGanttDataArray()` method must return an array with `data` and `links`:

```php
[
    'data' => [
        [
            'id' => 1,
            'text' => 'Task name',
            'start_date' => '2025-01-01',
            'end_date' => '2025-01-10',
            'progress' => 0.5,              // 0.0 to 1.0
            'parent' => 0,                  // 0 = root level
            'open' => true,                 // expand in tree
            'type' => 'project',            // optional: 'project' for grouping
            'priority' => 'high',           // 'high', 'medium', 'low' or 1, 2, 3
            'status' => 'in_progress',      // optional
            'status_icon' => 'heroicon-o-play-circle', // optional
            'assignee' => [                 // optional
                'id' => 1,
                'name' => 'John Doe',
                'profile_photo_url' => 'https://...',
            ],
        ],
    ],
    'links' => [
        [
            'id' => 1,
            'source' => 1,                  // from task ID
            'target' => 2,                  // to task ID
            'type' => 1,                    // finish-to-start
        ],
    ],
]
```

### Column Configuration

```php
[
    'name' => 'text',           // field name (required)
    'label' => 'Task',          // header label
    'width' => '*',             // pixels or '*' for flexible
    'tree' => true,             // show tree expand controls
    'align' => 'center',       // text alignment
    'resize' => true,           // allow column resize
    'template' => 'priority',   // 'priority' or 'assignee' for custom rendering
]
```

## Navigation with Parameters

Pass data to the Gantt page via URL parameters:

```php
return redirect()->to(
    Gantt::getUrl([
        'projectId' => 42,
        'assigneeFilter' => [1, 2, 3],
    ])
);
```

Or pass data directly in `mount()`:

```php
return redirect()->to(
    Gantt::getUrl([
        'ganttData' => $preBuiltData,
        'ganttColumns' => $customColumns,
    ])
);
```

## Configuration

```php
// config/filament-gantt.php
return [
    // Asset paths
    'assets' => [
        'css' => ['css/gantt.css', 'css/gantt-custom.css'],
        'js' => ['js/gantt.js', 'js/gantt-boot.js'],
    ],

    // Include Material Icons (for filter UI)
    'include_material_icons' => true,

    // Container height
    'height' => '75vh',

    // Filter style: dropdown (false) or slide-out modal (true)
    'show_filters_modal' => false,

    // UI customization
    'ui' => [
        // Priority colors (RGB hex)
        'priority_colors' => [
            'high' => [
                'bar' => '#ef4444',
                'badge_bg' => '#fee2e2',
                'badge_text' => '#b91c1c',
            ],
            'medium' => [
                'bar' => '#f59e0b',
                'badge_bg' => '#fef3c7',
                'badge_text' => '#b45309',
            ],
            'low' => [
                'bar' => '#22c55e',
                'badge_bg' => '#dcfce7',
                'badge_text' => '#15803d',
            ],
        ],

        // Avatar field resolution (checked in order)
        'avatar_url_fields' => [
            'profile_photo_url', 'profile_photo_path', 'avatar', 'photo_url',
        ],
        'avatar_name_fields' => ['name', 'full_name', 'email'],

        // Fallback avatar URL ({name} is replaced)
        'avatar_fallback' => 'https://ui-avatars.com/api/?name={name}&color=7F9CF5&background=EBF4FF',
    ],
];
```

## Toolbar

The Gantt page includes a toolbar with:

| Control | Description |
|---------|-------------|
| **Filter** | Filter by priority (high, medium, low) |
| **Sort** | Sort by priority or task name |
| **Columns** | Toggle column visibility |
| **Export** | Export to PDF or PNG |
| **Zoom** | Zoom to fit, zoom in, zoom out |
| **Task Count** | Displays total number of tasks |

## API Integration

The JavaScript layer supports CRUD operations via a REST API:

- `PUT /api/tasks/{id}` — Update task
- `POST /api/tasks` — Create task
- `DELETE /api/tasks/{id}` — Delete task

Configure the base URL in your page or JavaScript:

```javascript
window.__ganttApiBase = '/api/tasks';
```

CSRF tokens are automatically included from the `meta[name="csrf-token"]` tag.

## Customization

### Navigation

Override navigation properties in your page class:

```php
protected static ?string $navigationIcon = 'heroicon-o-chart-bar';
protected static ?string $navigationGroup = 'Project Management';
protected static ?string $navigationLabel = 'Timeline';
protected static ?int $navigationSort = 10;
```

### Header Actions

Add custom actions to the page header:

```php
protected function getHeaderActions(): array
{
    return [
        Action::make('refresh')
            ->label('Refresh')
            ->action(fn () => $this->refreshGantt()),
    ];
}
```

## Testing

The package includes Pest PHP tests for core functionality:

```bash
vendor/bin/pest
```

## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.
