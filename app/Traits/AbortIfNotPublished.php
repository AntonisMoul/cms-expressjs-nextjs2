<?php

namespace App\Traits;

use Botble\Base\Enums\BaseStatusEnum;

trait AbortIfNotPublished
{
    public function abortIfNotPublished($model)
    {
        if ((string) $model?->status != BaseStatusEnum::PUBLISHED) {
            abort(404);
        }
    }
}