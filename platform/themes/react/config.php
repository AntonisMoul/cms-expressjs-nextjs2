<?php

use Botble\Theme\Theme;
use Inertia\Inertia;
use Illuminate\Foundation\AliasLoader;

return [

    /*
    |--------------------------------------------------------------------------
    | Inherit from another theme
    |--------------------------------------------------------------------------
    |
    | Set up inherit from another if the file is not exists,
    | this is work with "layouts", "partials" and "views"
    |
    | [Notice] assets cannot inherit.
    |
    */

    'inherit' => null, //default

    /*
    |--------------------------------------------------------------------------
    | Listener from events
    |--------------------------------------------------------------------------
    |
    | You can hook a theme when event fired on activities
    | this is cool feature to set up a title, meta, default styles and scripts.
    |
    | [Notice] these events can be overridden by package config.
    |
    */

    'events' => [

        // Before event inherit from package config and the theme that call before,
        // you can use this event to set meta, breadcrumb template or anything
        // you want inheriting.
        'before' => function($theme)
        {

            //$loader = AliasLoader::getInstance();
            //$loader->alias('Botble\Page\Services\PageService', 'Theme\React\Services\PageService');
            // You can remove this line anytime.
            Inertia::share('headerLogo1', get_image_url(theme_option('logo'))??'/vendor/core/core/base/images/logo.png');
            Inertia::share('favicon', get_image_url(theme_option('favicon'))??'/vendor/core/core/base/images/favicon.png');

        },

        // Listen on event before render a theme,
        // this event should call to assign some assets,
        // breadcrumb template.
        'beforeRenderTheme' => function (Theme $theme)
        {
            // Partial composer.
            // $theme->partialComposer('header', function($view) {
            //     $view->with('auth', \Auth::user());
            // });

            // You may use this event to set up your assets.
            $theme->asset()->usePath()->add('style', 'css/style.css');

            $theme->asset()->container('footer')->add('jquery', 'libraries/jquery.min.js');

            $theme->asset()->container('footer')->usePath()->add('script', 'js/script.js');

            if (function_exists('shortcode')) {
                $theme->composer(['page', 'post'], function (\Botble\Shortcode\View\View $view) {
                    $view->withShortcodes();
                });
            }
        },

        // Listen on event before render a layout,
        // this should call to assign style, script for a layout.
        'beforeRenderLayout' => [

            'default' => function ($theme)
            {
                // $theme->asset()->usePath()->add('ipad', 'css/layouts/ipad.css');
            }
        ]
    ]
];
