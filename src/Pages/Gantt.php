<?php

namespace Codenzia\FilamentGantt\Pages;

use Filament\Actions\Concerns\InteractsWithActions;
use Filament\Actions\Contracts\HasActions;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Pages\Page;
use Illuminate\Support\Facades\Cache;

abstract class Gantt extends Page implements HasActions, HasForms
{
    use InteractsWithActions;
    use InteractsWithForms;

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-chart-bar';

    protected string $view = 'filament-gantt::filament.pages.gantt';

    protected static ?string $navigationLabel = 'Gantt';

    protected static ?string $title = '';

    protected static string|\UnitEnum|null $navigationGroup = 'Tasks';

    protected static ?int $navigationSort = 20;

    protected static ?string $slug = 'gantt';

    public array $ganttData = [];

    public array $ganttColumns = [];

    public array $ganttFilterPrefs = [];

    protected $listeners = ['refresh' => 'refreshGantt', '$refresh' => 'refreshGantt'];

    public function mount(?int $projectId = null, array $assigneeFilter = [], array $ganttData = [], array $ganttColumns = []): void
    {
        $this->ganttData = ! empty($ganttData)
            ? $ganttData
            : $this->getGanttDataArray($projectId, $assigneeFilter);

        $this->ganttColumns = ! empty($ganttColumns)
            ? $ganttColumns
            : (! empty($this->ganttColumns) ? $this->ganttColumns : $this->getGanttColumns());

        $this->ganttFilterPrefs = $this->getCachedGanttFilters();
    }

    public function setGanttColumns(array $ganttColumns): void
    {
        $this->ganttColumns = $ganttColumns;
    }

    public function saveGanttFilters(array $filters): void
    {
        $key = $this->getGanttFiltersCacheKey();
        Cache::store('file')->put($key, $filters, now()->addDays(30));
        $this->ganttFilterPrefs = $filters;
    }

    protected function getCachedGanttFilters(): array
    {
        $key = $this->getGanttFiltersCacheKey();
        $filters = Cache::store('file')->get($key, []);
        return is_array($filters) ? $filters : [];
    }

    protected function getGanttFiltersCacheKey(): string
    {
        $userId = auth()->id() ?? 'guest';
        return 'filament_gantt_filters:' . static::class . ':' . $userId;
    }

    public function getGanttData(): array
    {
        return $this->ganttData;
    }

    abstract protected function getGanttColumns(): array;

    abstract protected function getGanttDataArray(?int $projectId = null, array $assigneeFilter = []): array;

    public function refreshGantt(): void
    {
        // Consumers should populate $ganttData before calling refresh.
        $this->dispatch('gantt-data-refreshed', data: $this->ganttData);
    }

    public static function shouldRegisterNavigation(): bool
    {
        return false;
    }

    public function getGanttTasksCount(): int
    {
        if (empty($this->ganttData) || ! isset($this->ganttData['data']) || ! is_array($this->ganttData['data'])) {
            return 0;
        }

        return count(array_filter($this->ganttData['data'], function ($item) {
            return ! isset($item['type']) || $item['type'] !== 'project';
        }));
    }

    protected function getHeaderActions(): array
    {
        return [];
    }
}
