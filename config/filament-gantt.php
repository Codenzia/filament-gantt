<?php

return [
    // Asset paths or URLs. Local paths are resolved via asset().
    'assets' => [
        'css' => [
            'css/gantt.css',
            'css/gantt-custom.css',
        ],
        'js' => [
            'js/gantt.js',
            'js/gantt-boot.js',
        ],
    ],

    // Include Google Material Icons stylesheet.
    'include_material_icons' => true,

    // Gantt container height (CSS value).
    'height' => '75vh',

    // Show filters modal.
    'show_filters_modal' => false,

    // UI customization for gantt-boot.js
    'ui' => [
        // Priority colors for task bars and priority badges.
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

        // Avatar field keys on task.assignee (checked in order).
        'avatar_url_fields' => ['profile_photo_url', 'profile_photo_path', 'avatar', 'photo_url'],
        // Display name fields on task.assignee (checked in order).
        'avatar_name_fields' => ['name', 'full_name', 'email'],
        // Fallback avatar URL pattern (use {name} placeholder).
        'avatar_fallback' => 'https://ui-avatars.com/api/?name={name}&color=7F9CF5&background=EBF4FF',
    ],
];
