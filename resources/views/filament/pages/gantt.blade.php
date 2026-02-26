<x-filament-panels::page>
    @php
        $__ganttTasksCount = $this->getGanttTasksCount();
        $__ganttColumns = $this->getGanttColumns();
        $__ganttConfig = config('filament-gantt');
        $__ganttAssets = $__ganttConfig['assets'] ?? [];
        $__ganttCss = $__ganttAssets['css'] ?? ['css/gantt.css'];
        $__ganttCss[] = 'css/gantt-custom.css';
        if (is_string($__ganttCss)) {
            $__ganttCss = [$__ganttCss];
        }
        $__ganttJs = $__ganttAssets['js'] ?? ['js/gantt.js', 'js/gantt-boot.js'];
        $__ganttHeight = $__ganttConfig['height'] ?? '75vh';
        $__ganttMaterialIcons = (bool) ($__ganttConfig['include_material_icons'] ?? true);
        $__resolveAsset = function (string $path): string {
            if (\Illuminate\Support\Str::startsWith($path, ['http://', 'https://', '//'])) {
                return $path;
            }
            
            $assetUrl = asset($path);
            $fullPath = public_path($path);
            
            if (file_exists($fullPath)) {
                return $assetUrl . '?v=' . filemtime($fullPath);
            }
            
            return $assetUrl;
        };
    @endphp

    <div class="space-y-4 rounded-xl bg-white dark:bg-gray-900 p-4 shadow-sm ring-1 ring-gray-950/5 dark:ring-white/10" x-data data-gantt-livewire-id="{{ $this->getId() }}">
        {{-- Toolbar: Filters, Export, Zoom --}}
        <div class="flex flex-wrap gap-2 items-center">
            <div class="flex items-center gap-3 rounded-lg px-3 py-2 dark:bg-[#202327] bg-gray-50 ring-1 ring-gray-950/5 dark:ring-white/10">
                <div class="relative flex items-center gap-3" x-data="{ open: false }" @keydown.escape.window="open = false">
                    <x-filament::button
                        color="secondary"
                        size="md"
                        icon="heroicon-o-funnel"
                        tooltip="{{ __('Open filters') }}"
                        class="p-2! rounded-full"
                        @click="open = !open"
                    >
                        {{ __('Filters') }}
                    </x-filament::button>
                    <span class="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300" title="{{ __('Total tasks shown in Gantt') }}">
                        <span>{{ $__ganttTasksCount }}</span>
                        <span>{{ Str::plural('Task', $__ganttTasksCount) }}</span>
                    </span>
                    <div
                        x-show="open"
                        x-cloak
                        class="fixed inset-0 z-[9999]"
                        style="display: none;"
                        aria-modal="true"
                        role="dialog"
                        @click="open = false"
                    >
                        <div class="absolute inset-0 bg-slate-950/35 backdrop-blur-[1px]"></div>
                        <div
                            x-show="open"
                            x-transition:enter="transition ease-out duration-200"
                            x-transition:enter-start="translate-x-full opacity-0"
                            x-transition:enter-end="translate-x-0 opacity-100"
                            x-transition:leave="transition ease-in duration-150"
                            x-transition:leave-start="translate-x-0 opacity-100"
                            x-transition:leave-end="translate-x-full opacity-0"
                            class="gantt_filters_panel absolute inset-y-0 right-0 w-full max-w-md bg-white dark:bg-[#212429] border-l border-gray-200 dark:border-gray-700 shadow-2xl p-5 "
                            @click.stop
                        >
                                <div class="flex items-center justify-between mb-3">
                                    <div>
                                        <h3 class="text-sm font-semibold">{{ __('Filters') }}</h3>
                                        <p class="text-xs text-gray-500 dark:text-gray-400">{{ __('Refine what you see in the Gantt grid.') }}</p>
                                    </div>
                                    <button type="button" class="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800" @click="open = false" aria-label="{{ __('Close') }}">
                                        <x-heroicon-o-x-mark class="w-4 h-4" />
                                    </button>
                                </div>

                                <div class="flex flex-col gap-4 max-h-[calc(100vh-96px)] overflow-y-auto pr-1">
                                {{-- Priority chips --}}
                                <div
                                    id="filters_wrapper"
                                    class="filters_wrapper gantt_filter_card rounded-lg border border-dashed border-gray-200 dark:border-gray-700 bg-gray-50/60 dark:bg-gray-900/40 px-3 py-3 flex flex-col gap-3"
                                >
                                    <div class="flex items-center justify-between gap-2">
                                        <div>
                                            <span class="text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                                {{ __('Priority') }}
                                            </span>
                                            <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                                {{ __('Show tasks matching these priorities.') }}
                                            </p>
                                        </div>
                                    </div>
                                    <div class="flex flex-wrap gap-2">
                                        <label
                                            class="checked_label inline-flex items-center gap-2 cursor-pointer rounded-full px-3 py-1 text-xs font-medium bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-gray-700 transition text-gray-700 dark:text-gray-100"
                                            data-priority="high"
                                        >
                                            <input type="checkbox" name="high" value="1" class="hidden" checked>
                                            <i class="material-icons icon_color text-red-500 text-base">check_box</i>
                                            <span>{{ __('High') }}</span>
                                        </label>
                                        <label
                                            class="checked_label inline-flex items-center gap-2 cursor-pointer rounded-full px-3 py-1 text-xs font-medium bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-gray-700 transition text-gray-700 dark:text-gray-100"
                                            data-priority="medium"
                                        >
                                            <input type="checkbox" name="medium" value="1" class="hidden" checked>
                                            <i class="material-icons icon_color text-yellow-500 text-base">check_box</i>
                                            <span>{{ __('Normal') }}</span>
                                        </label>
                                        <label
                                            class="checked_label inline-flex items-center gap-2 cursor-pointer rounded-full px-3 py-1 text-xs font-medium bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-gray-700 transition text-gray-700 dark:text-gray-100"
                                            data-priority="low"
                                        >
                                            <input type="checkbox" name="low" value="1" class="hidden" checked>
                                            <i class="material-icons icon_color text-green-500 text-base">check_box</i>
                                            <span>{{ __('Low') }}</span>
                                        </label>
                                    </div>
                                </div>

                                {{-- Sorting --}}
                                <div class="gantt_filter_card rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50/60 dark:bg-gray-900/40 px-3 py-3 flex flex-col gap-3">
                                    <div>
                                        <span class="text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                            {{ __('Sort by') }}
                                        </span>
                                        <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                            {{ __('Change how tasks are ordered in the grid.') }}
                                        </p>
                                    </div>
                                    <div class="inline-flex gap-2 rounded-full bg-white/80 dark:bg-[#202327] p-1">
                                        <label class="gantt_sort_toggle inline-flex flex-1 items-center justify-center gap-1 cursor-pointer rounded-full px-3 py-1 text-xs font-medium text-gray-700 dark:text-gray-200 hover:bg-primary-50/80 dark:hover:bg-gray-700">
                                            <input
                                                type="radio"
                                                name="sort_option"
                                                value="priority"
                                                class="sr-only"
                                            >
                                            <span class="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                                            <span>{{ __('Priority') }}</span>
                                        </label>
                                        <label class="gantt_sort_toggle inline-flex flex-1 items-center justify-center gap-1 cursor-pointer rounded-full px-3 py-1 text-xs font-medium text-gray-700 dark:text-gray-200 hover:bg-primary-50/80 dark:hover:bg-gray-700">
                                            <input
                                                type="radio"
                                                name="sort_option"
                                                value="name"
                                                class="sr-only"
                                            >
                                            <span class="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
                                            <span>{{ __('Name') }}</span>
                                        </label>
                                    </div>
                                </div>

                            {{-- Column visibility --}}
                            <div class="gantt_filter_card rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50/60 dark:bg-gray-900/40 px-3 py-3 flex flex-col gap-3">
                                <div>
                                    <span class="text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                        {{ __('Columns') }}
                                    </span>
                                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                        {{ __('Toggle which fields are visible in the left grid.') }}
                                    </p>
                                </div>
                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    @foreach($this->ganttColumns as $column)
                                        @if(isset($column['name']))
                                            <label class="inline-flex items-center gap-2 cursor-pointer text-xs">
                                                <input
                                                    type="checkbox"
                                                    class="gantt-col-toggle form-checkbox rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700"
                                                    data-col="{{ $column['name'] }}"
                                                    checked
                                                >
                                                <span class="text-xs font-medium text-gray-700 dark:text-gray-200">
                                                    {{ __($column['label'] ?? ucfirst($column['name'])) }}
                                                </span>
                                            </label>
                                        @endif
                                    @endforeach
                                </div>
                                <div class="pt-1">
                                    <x-filament::button color="primary" size="sm" icon="heroicon-o-bookmark" class="rounded-md" @click="open = false; window.__ganttSaveFilters && window.__ganttSaveFilters();">
                                        {{ __('Save filters') }}
                                    </x-filament::button>
                                </div>
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="gantt_control flex items-center gap-2 rounded-lg px-3 py-2 dark:bg-[#202327] bg-gray-50 ring-1 ring-gray-950/5 dark:ring-white/10">
                <x-filament::button color="secondary" size="md" icon="heroicon-o-document" class="p-2! rounded-full" onclick="exportGantt('pdf')">
                    {{ __('Export to PDF') }}
                </x-filament::button>
                <x-filament::button color="secondary" size="md" icon="heroicon-o-photo" class="p-2! rounded-full" onclick="exportGantt('png')">
                    {{ __('Export to PNG') }}
                </x-filament::button>
            </div>

            <div class="gantt_control flex items-center gap-1 rounded-lg px-3 py-2 dark:bg-[#202327] bg-gray-50 ring-1 ring-gray-950/5 dark:ring-white/10">
                <x-filament::button color="secondary" size="md" icon="heroicon-o-arrows-pointing-out" class="p-2! rounded-full" id="gantt_zoom_to_fit_btn" onclick="typeof toggleMode === 'function' && toggleMode(document.getElementById('gantt_zoom_label'));">
                    <span class="zoom_toggle" id="gantt_zoom_label">{{ __('Zoom to Fit') }}</span>
                </x-filament::button>
                <x-filament::button color="secondary" size="md" icon="heroicon-o-magnifying-glass-plus" class="p-2! rounded-full" onclick="typeof zoom_in === 'function' && zoom_in();" title="{{ __('Zoom in') }}"></x-filament::button>
                <x-filament::button color="secondary" size="md" icon="heroicon-o-magnifying-glass-minus" class="p-2! rounded-full" onclick="typeof zoom_out === 'function' && zoom_out();" title="{{ __('Zoom out') }}"></x-filament::button>
            </div>
        </div>

        {{-- Empty state --}}
        @if ($__ganttTasksCount === 0)
            <div class="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 py-16 px-6 text-center">
                <x-heroicon-o-chart-bar class="w-14 h-14 text-gray-400 dark:text-gray-500 mb-4" />
                <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100">{{ __('No tasks to display') }}</h3>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400 max-w-sm">{{ __('Tasks with start and due dates will appear here. Create or assign tasks to see them on the Gantt chart.') }}</p>
            </div>
        @endif

        {{-- Gantt chart --}}
        <div wire:ignore @class(['hidden' => $__ganttTasksCount === 0])>
            @once
                @push('styles')
                    @if ($__ganttMaterialIcons)
                        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
                    @endif
                    @foreach ($__ganttCss as $__ganttCssFile)
                        <link href="{{ $__resolveAsset($__ganttCssFile) }}" rel="stylesheet" />
                    @endforeach
                @endpush

                @push('scripts')
                    @foreach ($__ganttJs as $__ganttScript)
                        <script src="{{ $__resolveAsset($__ganttScript) }}"></script>
                    @endforeach
                    <script>
                        document.addEventListener('DOMContentLoaded', () => {
                            if (window.__initGantt) window.__initGantt();
                        });
                        window.addEventListener('livewire:navigated', () =>
                            setTimeout(() => {
                                if (window.__initGantt) window.__initGantt();
                            }, 100)
                        );

                        window.addEventListener('gantt-data-refreshed', (event) => {
                            if (typeof gantt !== 'undefined') {
                                gantt.clearAll();
                                gantt.parse(event.detail.data);
                            }
                        });

                        // Handle modal/dialog open/close events
                        document.addEventListener('dialog.opened', () => {
                            // Gantt may disappear when modal opens, reset it
                            const ganttEl = document.getElementById('gantt_here');
                            if (ganttEl) {
                                delete ganttEl.dataset.ganttInited;
                            }
                        });

                        document.addEventListener('dialog.closed', () => {
                            // Reinitialize gantt when modal closes
                            setTimeout(() => {
                                if (window.__initGantt) window.__initGantt();
                            }, 100);
                        });
                    </script>
                @endpush
            @endonce

            <div id="gantt_here" style="width: 100%; height:{{ $__ganttHeight }}" data-gantt-data='@json($ganttData)' data-gantt-columns='@json($this->ganttColumns)' data-gantt-filters='@json($this->ganttFilterPrefs ?? [])'></div>
        </div>
    </div>
</x-filament-panels::page>
