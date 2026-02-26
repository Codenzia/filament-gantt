<div class="flex items-center gap-3 rounded-lg px-1 py-2 ">
    <x-filament::dropdown>
        <x-slot name="trigger">
            <x-filament::button color="secondary" size="lg" icon="heroicon-o-funnel" 
            class="p-2! rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40 dark:bg-[#202327] bg-gray-50">
                {{ __('Priority') }}
            </x-filament::button>
        </x-slot>
        
        <x-filament::dropdown.list>
            <x-filament::dropdown.list.item>
                <label
                    class="flex items-center gap-2 cursor-pointer rounded px-1 py-1 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    data-priority="high"
                >
                    <input type="checkbox" name="high" value="1" class="text-primary-600 focus:ring-primary-500 shrink-0" checked>
                    <span>{{ __('High') }}</span>
                </label>
            </x-filament::dropdown.list.item>
            <x-filament::dropdown.list.item>
                <label
                    class="flex items-center gap-2 cursor-pointer rounded px-1 py-1 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    data-priority="medium"
                >
                    <input type="checkbox" name="medium" value="1" class="text-primary-600 focus:ring-primary-500 shrink-0" checked>
                    <span>{{ __('Normal') }}</span>
                </label>
            </x-filament::dropdown.list.item>
            <x-filament::dropdown.list.item>
                <label
                    class="flex items-center gap-2 cursor-pointer rounded px-1 py-1 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    data-priority="low"
                >
                    <input type="checkbox" name="low" value="1" class="text-primary-600 focus:ring-primary-500 shrink-0" checked>
                    <span>{{ __('Low') }}</span>
                </label>
            </x-filament::dropdown.list.item>
        </x-filament::dropdown.list>
    </x-filament::dropdown>
</div>

<div class="flex items-center gap-3 rounded-lg px-1 py-2 ">
    <x-filament::dropdown>
        <x-slot name="trigger">
            <x-filament::button color="secondary" size="lg" icon="heroicon-o-funnel" 
            class="p-2! rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40 dark:bg-[#202327] bg-gray-50">
                {{ __('Sort by') }}
            </x-filament::button>
        </x-slot>
        
        <x-filament::dropdown.list>
            <x-filament::dropdown.list.item>
                <label class="gantt_sort_toggle is-active flex w-full items-center gap-2 cursor-pointer rounded-md px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <input
                        type="radio"
                        name="sort_option"
                        value="priority"
                        class="form-radio text-primary-600 focus:ring-primary-500"
                        checked
                    >
                    <span>{{ __('Priority') }}</span>
                </label>
            </x-filament::dropdown.list.item>
            <x-filament::dropdown.list.item>
                <label class="gantt_sort_toggle flex w-full items-center gap-2 cursor-pointer rounded-md px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <input
                        type="radio"
                        name="sort_option"
                        value="name"
                        class="form-radio text-primary-600 focus:ring-primary-500"
                    >
                    <span>{{ __('Name') }}</span>
                </label>
            </x-filament::dropdown.list.item>
        </x-filament::dropdown.list>
    </x-filament::dropdown>
</div>

<div class="flex items-center gap-3 rounded-lg px-1 py-2 ">
    <x-filament::dropdown>
        <x-slot name="trigger">
            <x-filament::button color="secondary" size="lg" icon="heroicon-o-funnel" 
            class="p-2! rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40 dark:bg-[#202327] bg-gray-50">
                {{ __('Columns') }}
            </x-filament::button>
        </x-slot>
        
        <x-filament::dropdown.list>
                @foreach($this->ganttColumns as $column)
                    @if(isset($column['name']))
                    <x-filament::dropdown.list.item>
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
                    </x-filament::dropdown.list.item>
                    @endif
                @endforeach
        </x-filament::dropdown.list>
    </x-filament::dropdown>
</div>
