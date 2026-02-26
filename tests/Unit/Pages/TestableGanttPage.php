<?php

declare(strict_types=1);

namespace Codenzia\FilamentGantt\Tests\Unit\Pages;

use Codenzia\FilamentGantt\Pages\Gantt;

class TestableGanttPage extends Gantt
{
    public static function shouldRegisterNavigation(): bool
    {
        return false;
    }

    protected function getGanttColumns(): array
    {
        return [
            ['name' => 'text', 'label' => 'Task', 'width' => 200, 'tree' => true],
            ['name' => 'start_date', 'label' => 'Start', 'width' => 100],
            ['name' => 'duration', 'label' => 'Duration', 'width' => 80],
        ];
    }

    protected function getGanttDataArray(?int $projectId = null, array $assigneeFilter = []): array
    {
        return [
            'data' => [],
            'links' => [],
        ];
    }
}
