<?php

namespace Theme\React\Http\Controllers;

use Botble\Blog\Http\Resources\PostHomepageResource;
use Botble\Contact\Http\Requests\ContactRequest;
use Botble\Menu\Repositories\Interfaces\MenuInterface;
use Botble\Menu\Repositories\Interfaces\MenuNodeInterface;
use Botble\Theme\Http\Controllers\PublicController;
use Inertia\Inertia;
use Botble\Slug\Facades\SlugHelper;
use Illuminate\Support\Str;
use Botble\Base\Facades\BaseHelper;
use Botble\Page\Models\Page;
use App\Meta;
use App\Traits\FlashMessages;
use App\Traits\HttpResponses;
use App\Traits\InertiaShareable;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Botble\Base\Http\Responses\BaseHttpResponse;
use Botble\Base\Facades\EmailHandler;
use Botble\Contact\Events\SentContactEvent;
use Botble\Contact\Models\Contact;
use Exception;
use Theme\React\Services\SearchService;
use Theme\React\Services\FilterService;
use Botble\Projects\Http\Resources\ProjectResource;
use Botble\Projects\Http\Resources\CategoryProjectResource;
use Botble\Projects\Models\ProjectCategory;
use Botble\Projects\Models\Projects;
use Botble\GovProjects\Models\Municipality;
use Botble\GovProjects\Http\Resources\MunicipalityResource;


class ReactController extends PublicController
{
    use HttpResponses, FlashMessages, InertiaShareable;

    protected $menuRepository;
    protected $menuNodeRepository;
    // Ta prosthesa ego
    protected $eventRepository;
    protected $businessRepository;
    protected $postRepository;
    // Prosoxh edw
    protected $businessCategoryRepository;

    public function __construct(

        MenuInterface $menuRepository,
        MenuNodeInterface $menuNodeRepository,
       
    ) {

        $this->menuRepository = $menuRepository;
        $this->menuNodeRepository = $menuNodeRepository;
        // Ta prosthesa ego
       
    }

    // Ta prosthesa ego
    public function search(Request $request, SearchService $searchService, FilterService $filterService)
    {
      

    }

    public function getIndex()
    {
        dd('fsg');
    }

    public function getContact()
    {
        $this->shareSeo(trans('plugins/contact::contact.menu'), theme_option('seo_description') && theme_option('seo_description') != '' ? theme_option('seo_description') : null, null);

        $data = [
            "email" => theme_option('contact_email'),
            "phone" => theme_option('contact_phone'),
        ];
        return Inertia::render('Contact/Contact', [
            "isAuth" => Auth::guard('member')->check(),
            'data' => $data
        ]);
    }
    
    // To prosthesa ego
    public function sendEmail(ContactRequest $request, BaseHttpResponse $response)
    {
        // To prosthesa ego
        // dd(app()->getLocale());

        $blacklistDomains = setting('blacklist_email_domains');

        if ($blacklistDomains) {
            $emailDomain = Str::after(strtolower($request->input('email')), '@');

            $blacklistDomains = collect(json_decode($blacklistDomains, true))->pluck('value')->all();

            if (in_array($emailDomain, $blacklistDomains)) {
                return $this->error('', __('Your email is in blacklist. Please use another email address.'));
            }
        }
        $blacklistWords = trim(setting('blacklist_keywords', ''));

        if ($blacklistWords) {
            $content = strtolower($request->input('content'));

            $badWords = collect(json_decode($blacklistWords, true))
                ->filter(function ($item) use ($content) {
                    $matches = [];
                    $pattern = '/\b' . $item['value'] . '\b/iu';

                    return preg_match($pattern, $content, $matches, PREG_UNMATCHED_AS_NULL);
                })
                ->pluck('value')
                ->all();

            if (count($badWords)) {
                return $this->error('', __('Your message contains blacklist words: ":words".', ['words' => implode(', ', $badWords)]));
            }
        }

        try {
            $contact = Contact::query()->create(array_merge($request->input(), [
                'name' => $request->name . ' ' . $request->lastname,
                'content' => $request->message,

            ]));

            event(new SentContactEvent($contact));

            $args = [];

            if ($contact->name && $contact->email) {
                $args = ['replyTo' => [$contact->name => $contact->email]];
            }

            EmailHandler::setModule(CONTACT_MODULE_SCREEN_NAME)
                ->setVariableValues([
                    'contact_name' => $contact->name ?? 'N/A',
                    'contact_email' => $contact->email ?? 'N/A',
                    'contact_phone' => $contact->phone ?? 'N/A',
                    'contact_address' => $contact->address ?? 'N/A',
                    'contact_content' => $contact->content ?? 'N/A',
                ])
                ->sendUsingTemplate('notice', null, $args);
            $this->flashMessage(trans('plugins/contact::contact.message_sent_success'));
            return back();
        } catch (Exception $exception) {
            info($exception->getMessage());
            return $this->error('', __('plugins/contact::contact.message_sent_error'));
        }
    }


    public function getView(string|null $key = null, string $prefix = '')
    {
        if (empty($key)) {
            //return $this->getIndex();
        }

        $slug = SlugHelper::getSlug($key, '');

        if (!$slug) {
            abort(404);
        }


        if (defined('PAGE_MODULE_SCREEN_NAME')) {
            if ($slug->reference_type == Page::class && BaseHelper::isHomepage($slug->reference_id)) {
                //return redirect()->route('public.index');
            }
        }

        $result = apply_filters(BASE_FILTER_PUBLIC_SINGLE_DATA_INERTIA, $slug);

        if (isset($result['slug']) && $result['slug'] !== Str::replaceLast(SlugHelper::getPublicSingleEndingURL(), '', $key)) {

            // return redirect()->route('public.single', $result['slug']);
            return Inertia::render('SinglePage\SinglePage', []);
        }

        //event(new RenderingSingleEvent($slug));

        if (!empty($result) && is_array($result)) { ///// if it is not Page e.g(POST)

            return Inertia::render($result['view'], [
                'page' => $result['page'],
                'data' => $result['data'],
                //'meta' => $result['meta']
            ]);
            // return Theme::scope($result['view'], $result['data'], Arr::get($result, 'default_view'))->render();
        }

        abort(404);
    }

    public function getSiteMapIndex(string $key = null, string $extension = 'xml')
    {
        return parent::getSiteMapIndex();
    }

    public function page404()
    {
        return Inertia::render('Page404', []);
    }
}
