<x-filament-panels::page>
    @php
        $__ganttTasksCount = $this->getGanttTasksCount();
        $__ganttConfig = config('filament-gantt');
        $__ganttAssets = $__ganttConfig['assets'] ?? [];
        $__ganttCss = $__ganttAssets['css'] ?? 'css/gantt.css';
        $__ganttJs = $__ganttAssets['js'] ?? ['js/gantt.js', 'js/gantt-boot.js'];
        $__ganttHeight = $__ganttConfig['height'] ?? '75vh';
        $__ganttMaterialIcons = (bool) ($__ganttConfig['include_material_icons'] ?? true);
        $__resolveAsset = function (string $path): string {
            return \Illuminate\Support\Str::startsWith($path, ['http://', 'https://', '//']) ? $path : asset($path);
        };
    @endphp

    <div class="space-y-4 rounded-xl bg-white dark:bg-gray-900 p-4 shadow-sm ring-1 ring-gray-950/5 dark:ring-white/10" x-data>
        {{-- Toolbar: Filters, Export, Zoom --}}
        <div class="flex flex-wrap gap-2 items-center">
            <div class="flex items-center gap-3 rounded-lg px-3 py-2 dark:bg-[#202327] bg-gray-50 ring-1 ring-gray-950/5 dark:ring-white/10">
                <div class="relative flex items-center gap-3" x-data="{ open: false }" @keydown.escape.window="open = false">
                    <x-filament::button color="secondary" size="md" icon="heroicon-o-funnel" tooltip="Filters" class="p-2! rounded-full" @click="open = !open">
                        {{ __('Filters') }}
                    </x-filament::button>
                    <span class="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300" title="{{ __('Total tasks shown in Gantt') }}">
                        <span>{{ $__ganttTasksCount }}</span>
                        <span>{{ Str::plural('Task', $__ganttTasksCount) }}</span>
                    </span>
                    <div x-show="open" x-transition x-cloak @click.away="open = false" class="absolute z-50 mt-2 w-96 bg-white dark:bg-[#212429] border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl p-6 space-y-6" style="display: none;">
                        <div class="filters_wrapper flex flex-wrap items-center gap-4" id="filters_wrapper">
                            <span class="text-sm font-semibold text-gray-700 dark:text-gray-300 w-full">{{ __('Priority') }}:</span>
                            <label class="checked_label inline-flex items-center gap-2 cursor-pointer py-1 rounded hover:bg-blue-50 dark:hover:bg-gray-800 transition" data-priority="high">
                                <input type="checkbox" name="high" value="1" class="hidden" checked>
                                <i class="material-icons icon_color text-red-500">check_box</i>
                                <span class="text-xs font-medium">{{ __('High') }}</span>
                            </label>
                            <label class="checked_label inline-flex items-center gap-2 cursor-pointer px-2 py-1 rounded hover:bg-blue-50 dark:hover:bg-gray-800 transition" data-priority="medium">
                                <input type="checkbox" name="medium" value="1" class="hidden" checked>
                                <i class="material-icons icon_color text-yellow-500">check_box</i>
                                <span class="text-xs font-medium">{{ __('Normal') }}</span>
                            </label>
                            <label class="checked_label inline-flex items-center gap-2 cursor-pointer px-2 py-1 rounded hover:bg-blue-50 dark:hover:bg-gray-800 transition" data-priority="low">
                                <input type="checkbox" name="low" value="1" class="hidden" checked>
                                <i class="material-icons icon_color text-green-500">check_box</i>
                                <span class="text-xs font-medium">{{ __('Low') }}</span>
                            </label>
                        </div>
                        <div class="flex flex-col gap-2">
                            <span class="text-sm font-semibold text-gray-700 dark:text-gray-300">{{ __('Sort by') }}:</span>
                            <div class="flex gap-4">
                                <label class="inline-flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="sort_option" value="priority" class="rounded-full border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700">
                                    <span class="text-xs font-medium">{{ __('Priority') }}</span>
                                </label>
                                <label class="inline-flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="sort_option" value="name" class="rounded-full border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700">
                                    <span class="text-xs font-medium">{{ __('Name') }}</span>
                                </label>
                            </div>
                        </div>
                        <div class="flex flex-col gap-2">
                            <span class="text-sm font-semibold text-gray-700 dark:text-gray-300">{{ __('Columns') }}:</span>
                            <label class="inline-flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" class="gantt-col-toggle form-checkbox rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700" data-col="priority" checked>
                                <span class="text-xs font-medium">{{ __('Priority Column') }}</span>
                            </label>
                            <label class="inline-flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" class="gantt-col-toggle form-checkbox rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700" data-col="status" checked>
                                <span class="text-xs font-medium">{{ __('Status Column') }}</span>
                            </label>
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
                    <link href="{{ $__resolveAsset($__ganttCss) }}" rel="stylesheet" />
                    @if ($__ganttMaterialIcons)
                        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
                    @endif
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

            <div id="gantt_here" style="width: 100%; height:{{ $__ganttHeight }}" data-gantt-data='@json($ganttData)'></div>
        </div>
    </div>
</x-filament-panels::page>
