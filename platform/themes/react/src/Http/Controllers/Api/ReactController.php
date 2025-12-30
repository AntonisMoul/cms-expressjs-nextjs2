<?php

namespace Theme\React\Http\Controllers\Api;

// use Botble\Accomodation\Http\Resources\AccomodationHomepageResource;
use Botble\Base\Enums\BaseStatusEnum;
use Botble\Base\Facades\EmailHandler;
use Botble\Blog\Http\Resources\PostHomepageResource;
use Botble\Blog\Repositories\Interfaces\PostInterface;
use Botble\Contact\Events\SentContactEvent;
use Botble\Contact\Models\Contact;
use Botble\Menu\Repositories\Interfaces\MenuInterface;
use Botble\Menu\Repositories\Interfaces\MenuNodeInterface;
use Botble\Page\Http\Resources\PageResource;
use Botble\Place\Http\Resources\PlaceResource;
use Botble\Plan\Http\Resources\PlanResource;
use Botble\Theme\Facades\Theme;
use Botble\Theme\Http\Controllers\PublicController;
use Botble\Slug\Facades\SlugHelper;
use Exception;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Botble\Base\Facades\BaseHelper;
use Botble\Page\Models\Page;
use App\Traits\HttpResponses;
use Illuminate\Http\Request;
use Theme\React\Services\SearchService;
use Theme\React\Services\FilterService;


class ReactController extends PublicController
{
    use HttpResponses;

    public function __construct(
     )
    {
      
    }


    /**
     * @group Pages
     *
     *
     * Homepage
     *
     * @header Accept-Language en
     *
     *
     * @response 200 {"status": true, "data": "", "message": "Send message successfully!"}
     * @response 500 {"status": false, "data": "", "message": "Can't send message on this time, please try again later!"}
     */
    public function getIndex()
    {
       
    }


}
