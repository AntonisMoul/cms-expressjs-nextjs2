<?php

use Illuminate\Support\Facades\Route;

Route::group(apply_filters(BASE_FILTER_GROUP_PUBLIC_ROUTE, []), function () {
    Route::group([
        'middleware' => 'api',
        'prefix' => 'api/v1',
        'namespace' => 'Theme\React\Http\Controllers\Api',
    ], function () {

        Route::get('/', 'ReactController@getIndex');
        Route::get('/filters', 'ReactController@filters');
        Route::get('/search', 'ReactController@search');
        Route::get('/social_links', 'ReactController@getSocialLinks');
        Route::get('/{slug?}', 'ReactController@getView');
        Route::post('/contact', 'ReactController@sendEmail');

    });
});
