<?php

namespace Theme\React\Http\Resources;

use Botble\Slug\Http\Resources\SlugResource;
use Illuminate\Http\Resources\Json\JsonResource;

class FilterResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'name' => $this->name,
            'slug' => new SlugResource($this->whenLoaded('slugable')),
        ];
    }
}
