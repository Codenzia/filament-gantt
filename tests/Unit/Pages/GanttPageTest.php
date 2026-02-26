<?php

declare(strict_types=1);

use Codenzia\FilamentGantt\Pages\Gantt;
use Codenzia\FilamentGantt\Tests\Unit\Pages\TestableGanttPage;
use Illuminate\Support\Facades\Cache;
use Livewire\Livewire;

describe('Gantt Page', function () {
    it('returns zero task count when gantt data is empty', function () {
        $component = new TestableGanttPage();
        $component->ganttData = [];

        expect($component->getGanttTasksCount())->toBe(0);
    });

    it('returns zero when gantt data has no data key', function () {
        $component = new TestableGanttPage();
        $component->ganttData = ['links' => []];

        expect($component->getGanttTasksCount())->toBe(0);
    });

    it('returns zero when data is not an array', function () {
        $component = new TestableGanttPage();
        $component->ganttData = ['data' => null];

        expect($component->getGanttTasksCount())->toBe(0);
    });

    it('excludes project type items from task count', function () {
        $component = new TestableGanttPage();
        $component->ganttData = [
            'data' => [
                ['id' => 1, 'text' => 'Task A'],
                ['id' => 2, 'text' => 'Project', 'type' => 'project'],
                ['id' => 3, 'text' => 'Task B'],
            ],
            'links' => [],
        ];

        expect($component->getGanttTasksCount())->toBe(2);
    });

    it('returns full count when all items are tasks', function () {
        $component = new TestableGanttPage();
        $component->ganttData = [
            'data' => [
                ['id' => 1, 'text' => 'Task A'],
                ['id' => 2, 'text' => 'Task B'],
            ],
            'links' => [],
        ];

        expect($component->getGanttTasksCount())->toBe(2);
    });

    it('saveGanttFilters persists filters and updates ganttFilterPrefs', function () {
        Livewire::test(TestableGanttPage::class)
            ->call('saveGanttFilters', [
                'sort' => 'priority',
                'priorities' => ['high' => true, 'low' => true],
                'columns' => ['text' => true],
            ])
            ->assertSet('ganttFilterPrefs.sort', 'priority')
            ->assertSet('ganttFilterPrefs.priorities.high', true)
            ->assertSet('ganttFilterPrefs.columns.text', true);
    });

    it('loads cached filter prefs on mount', function () {
        $key = 'filament_gantt_filters:' . TestableGanttPage::class . ':guest';
        $prefs = [
            'sort' => 'name',
            'priorities' => ['medium' => true],
            'columns' => ['text' => true, 'start_date' => true],
        ];
        Cache::store('file')->put($key, $prefs, now()->addDays(30));

        $component = Livewire::test(TestableGanttPage::class);

        expect($component->get('ganttFilterPrefs'))->toEqual($prefs);
    });

    it('getGanttData returns current gantt data', function () {
        $data = ['data' => [['id' => 1, 'text' => 'Task']], 'links' => []];
        $component = new TestableGanttPage();
        $component->ganttData = $data;

        expect($component->getGanttData())->toEqual($data);
    });

    it('setGanttColumns updates ganttColumns', function () {
        $columns = [
            ['name' => 'custom', 'label' => 'Custom', 'width' => 150],
        ];

        $component = new TestableGanttPage();
        $component->setGanttColumns($columns);

        expect($component->ganttColumns)->toEqual($columns);
    });
});
