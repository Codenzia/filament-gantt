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
        <div class="flex justify-between items-center">
            <div class="flex items-center gap-1">
                @if(config('filament-gantt.show_filters_modal'))
                    @include('filament-gantt::filament.components.gantt-filters-modal')
                @else
                    @include('filament-gantt::filament.components.gantt-filters')
                @endif
    
                <div class="gantt_control flex items-center gap-2 rounded-lg px-1 py-2">
                    <x-filament::dropdown placement="bottom-start">
                        <x-slot name="trigger">
                            <x-filament::button
                                color="secondary"
                                size="lg"
                                icon="heroicon-o-document"
                                icon-position="before"
                                class="p-2! rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40 dark:bg-[#202327] bg-gray-50"
                            >
                                {{ __('Export') }}
                            </x-filament::button>
                        </x-slot>
    
                        <x-filament::dropdown.list>
                            <x-filament::dropdown.list.item
                                tag="button"
                                type="button"
                                icon="heroicon-o-document"
                                onclick="exportGantt('pdf')"
                            >
                                {{ __('Export to PDF') }}
                            </x-filament::dropdown.list.item>
    
                            <x-filament::dropdown.list.item
                                tag="button"
                                type="button"
                                icon="heroicon-o-photo"
                                onclick="exportGantt('png')"
                            >
                                {{ __('Export to PNG') }}
                            </x-filament::dropdown.list.item>
                        </x-filament::dropdown.list>
                    </x-filament::dropdown>
                </div>
    
                <div class="gantt_control flex items-center gap-1 rounded-lg px-3 border border-gray-200 dark:border-gray-700">
                    <x-filament::button color="secondary" size="lg" icon="heroicon-o-arrows-pointing-out" class="p-2! rounded-full" id="gantt_zoom_to_fit_btn" onclick="typeof toggleMode === 'function' && toggleMode(document.getElementById('gantt_zoom_label'));"></x-filament::button>
                    <x-filament::button color="secondary" size="lg" icon="heroicon-o-magnifying-glass-plus" class="p-2! rounded-full" onclick="typeof zoom_in === 'function' && zoom_in();" title="{{ __('Zoom in') }}"></x-filament::button>
                    <x-filament::button color="secondary" size="lg" icon="heroicon-o-magnifying-glass-minus" class="p-2! rounded-full" onclick="typeof zoom_out === 'function' && zoom_out();" title="{{ __('Zoom out') }}"></x-filament::button>
                </div>
            </div>

            <div class="flex items-center gap-2 px-4 py-2 bg-primary-50 dark:bg-primary-900/30 rounded-lg border border-primary-100 dark:border-primary-800 hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors cursor-pointer" title="{{ __('Total tasks shown in Gantt') }}">
                <span>{{ $__ganttTasksCount }}</span>
                <span>{{ Str::plural('Task', $__ganttTasksCount) }}</span>
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
