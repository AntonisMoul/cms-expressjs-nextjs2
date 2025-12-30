<?php

use Illuminate\Support\Facades\Route;
use Theme\React\Http\Controllers\ReactController;


Route::get('/menu','Theme\React\Http\Controllers\API\PublicController@index');
Route::get('/head-data','Theme\React\Http\Controllers\API\PublicController@getHeadData');
Route::get('/home-data','Theme\React\Http\Controllers\API\PublicController@getHomeData');
Route::get('/statistics','Theme\React\Http\Controllers\API\PublicController@getStatistics');
Theme::routes();

// Custom routes
// You can delete this route group if you don't need to add your custom routes.
Route::group(['controller' => ReactController::class, 'middleware' => ['web', 'core']], function () {
    Route::group(apply_filters(BASE_FILTER_GROUP_PUBLIC_ROUTE, []), function () {


        Route::get('/','homePage')->name('public.index');
        // Add your custom route here
        // Ex: Route::get('hello', 'getHello');

        Route::get('{slug?}', [
            'as' => 'public.single',
            'uses' => 'getView',
        ]);

    });
});



