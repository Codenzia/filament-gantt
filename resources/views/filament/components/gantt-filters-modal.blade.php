<div class="p-2! rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40 dark:bg-[#202327] bg-gray-50">
    <div class="relative flex items-center gap-3" x-data="{ open: false }" @keydown.escape.window="open = false">
        <x-filament::button
            color="secondary"
            size="lg"
            icon="heroicon-o-funnel"
            tooltip="{{ __('Open filters') }}"
            class="p-2! rounded-full"
            @click="open = !open"
        >
            {{ __('Filters') }}
        </x-filament::button>
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