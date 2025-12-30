<?php

namespace Theme\React\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class MenuResource extends JsonResource
{
    
    public function toArray($request)
    {
        return [
            "type"                  => "collapse",
            "name"                  => $this->title,
            'id'                    => $this->id,
            'target'                => $this->id,
            'key'                   => $this->id,
            'label'                 => $this->title,
            'value'                 => $this->id,
            'collapse'              => MenuResource::collection($this->child),


           
        ];
    }


}
