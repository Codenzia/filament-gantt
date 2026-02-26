<?php

declare(strict_types=1);

describe('FilamentGanttServiceProvider', function () {
    it('merges filament-gantt config', function () {
        $config = config('filament-gantt');

        expect($config)->toBeArray()
            ->and($config)->toHaveKey('assets')
            ->and($config)->toHaveKey('include_material_icons')
            ->and($config)->toHaveKey('height')
            ->and($config)->toHaveKey('ui');
    });

    it('provides default assets paths', function () {
        $assets = config('filament-gantt.assets');

        expect($assets['css'])->toContain('css/gantt.css')
            ->and($assets['css'])->toContain('css/gantt-custom.css')
            ->and($assets['js'])->toContain('js/gantt.js')
            ->and($assets['js'])->toContain('js/gantt-boot.js');
    });

    it('provides default height', function () {
        expect(config('filament-gantt.height'))->toBe('75vh');
    });

    it('provides UI priority colors', function () {
        $ui = config('filament-gantt.ui');

        expect($ui)->toHaveKey('priority_colors')
            ->and($ui['priority_colors'])->toHaveKeys(['high', 'medium', 'low']);
    });

    it('registers filament-gantt views namespace', function () {
        $view = view()->getFinder()->find('filament-gantt::filament.pages.gantt');

        expect($view)->not->toBeNull();
    });
});
