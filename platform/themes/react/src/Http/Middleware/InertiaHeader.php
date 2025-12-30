<?php

namespace Theme\React\Http\Middleware;

use Closure;

class InertiaHeader
{

    public function handle($request, Closure $next)
    {

        $response = $next($request);

        $this->setHeaders($response);

        return $response;
    }

    /**
     * Set headers.
     *
     * @param  \Illuminate\Http\Response  $response
     * @return void
     */
    private function setHeaders($response)
    {
        $response->headers->set('X-Inertia', true);
        $response->headers->set('Vary', 'Accept');
    }


}
