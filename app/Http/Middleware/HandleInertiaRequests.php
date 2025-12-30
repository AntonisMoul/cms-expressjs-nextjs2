<?php

namespace App\Http\Middleware;

use Botble\Language\Facades\Language;
use Botble\Media\Facades\RvMedia;
use Botble\Theme\Facades\Theme;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Middleware;
use Botble\Menu\Repositories\Interfaces\MenuInterface;
use Botble\Menu\Repositories\Interfaces\MenuNodeInterface;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    protected MenuInterface $menuRepository;
    protected MenuNodeInterface $menuNodeRepository;

    public function __construct(
        MenuInterface $menuRepository,
        MenuNodeInterface $menuNodeRepository
    ) {
        $this->menuRepository = $menuRepository;
        $this->menuNodeRepository = $menuNodeRepository;
    }

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $locale = Language::getCurrentLocale();
       
        $localeFromRequest = request()->header('X-LANGUAGE') ?? request()->segment(1);
       
        if (Language::checkLocaleInSupportedLocales($localeFromRequest)) {
            $locale = $localeFromRequest;            
        } 
           
        session(['site-locale' => $locale]);

        return array_merge(parent::share($request), [
            'logo' => !empty(Theme::getLogo()) ? getConditionallyImage(Theme::getLogo(), 'logo') : RvMedia::getImageUrl('/vendor/core/core/base/images/logo.png'),
            'message' => fn () => $request->session()->get('message'),
            'member' => optional(Auth::guard('member')->user())->only('name', 'email', 'default_event'),
            "isAuth" => $this->isAuth(),
            'copyright' => Theme::getSiteCopyright(),
            'menus' => $this->getMenus(),
            'social' => $this->getSocialLinks(),
            'locale' => $locale,
            'captcha_key' => setting('captcha_site_key')
        ]);
    }

    protected function getSocialLinks(): array
    {
        $arr = [];
        $links = Theme::getSocialLinks();

        foreach ($links as $link) {
            // To prosthesa ego
            // An den exei URL, synexise sto epomeno
            if (blank($link->getUrl())) {
                continue;
            }

            $arr[] = [
                'name' => $link->getName(),
                'link' => $link->getUrl(),
                'icon' => $link->getIconHtml() ? $link->getIconHtml()->toHtml() : null,
                'image' => $link->getImage() ? Storage::url($link->getImage()) : null,
            ];
        }

        return $arr;
    }

    protected function getMenus()
    {
        $menu_header = $this->menuRepository->findBySlug('header'.'-'.Language::getCurrentLocale(), true);
        
        if ($menu_header){
            $menu_header_items = $this->menuNodeRepository->getByMenuId($menu_header->id, 0, ['title', 'url', 'target'])->toArray();
        }

        
        $menu_footer = $this->menuRepository->findBySlug('footer'.'-'.Language::getCurrentLocale(), true);
        if ($menu_footer)
            $menu_footer_items = $this->menuNodeRepository->getByMenuId($menu_footer->id, 0, ['title', 'url', 'target'])->toArray();

        return [
            'header' => isset($menu_header_items) ? $menu_header_items : null,
            'footer' => isset($menu_footer_items) ? $menu_footer_items : null
        ];
    }
    protected function isAuth(): bool
    {
        return Auth::guard('member')->check();
    }
}
