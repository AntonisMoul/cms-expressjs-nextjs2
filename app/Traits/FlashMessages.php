<?php

namespace App\Traits;

use Carbon\Carbon;

trait FlashMessages
{
    /**
     * Flash a message.
     *
     * @param  string  $message
     * @param  string  $type
     * @return void
     */
    protected function flashMessage($message, $type = 'success')
    {
        session()->flash('message', [
            'data' => $message,
            'type' => $type,
            'uuid' => Carbon::now()->timestamp
        ]);
    }
}
