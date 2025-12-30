<?php

use Illuminate\Support\Facades\Route;
use Theme\React\Http\Controllers\LoginController;
use Theme\React\Http\Controllers\ReactController;
use Theme\React\Http\Controllers\RegisterController;

//Route::get('/menu','Theme\React\Http\Controllers\API\PublicController@index');
//Route::get('/head-data','Theme\React\Http\Controllers\API\PublicController@getHeadData');
//Route::get('/home-data','Theme\React\Http\Controllers\API\PublicController@getHomeData');
//Route::get('/statistics','Theme\React\Http\Controllers\API\PublicController@getStatistics');
Theme::routes();

// Custom routes
// You can delete this route group if you don't need to add your custom routes.

Route::middleware(['web', 'core'])->group(function () {

    Route::group(['controller' => ReactController::class], function () {


        Route::group(apply_filters(BASE_FILTER_GROUP_PUBLIC_ROUTE, []), function () {



            Route::post('/contact', [
                'as' => 'public.contact.send',
                'uses' => 'sendEmail',
            ]);
            //Route::get('/','homePage')->name('public.index');
            // Add your custom route here
            // Ex: Route::get('hello', 'getHello');

            Route::get('/', [
                'as' => 'public.index',
                'uses' => 'getIndex',
            ]);

            Route::get('/contact', [
                'as' => 'public.contact',
                'uses' => 'getContact',
            ]);

            Route::get('/search', [
                'as' => 'public.search',
                'uses' => 'search',
            ]);

            Route::get('/page/404', [
                'as' => 'public.page404',
                'uses' => 'page404',
            ]);

            Route::get('{slug?}', [
                'as' => 'public.single',
                'uses' => 'getView',
            ]);
        });
    });
});
