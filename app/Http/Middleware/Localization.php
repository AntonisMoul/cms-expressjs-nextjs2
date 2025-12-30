<?php

namespace App\Http\Middleware;

use Botble\Language\Facades\Language;
use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Closure;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;

class Localization
{
    public function handle(Request $request, Closure $next)
    {
        set_app_locale();
       
        return $next($request);
    }

    
}
