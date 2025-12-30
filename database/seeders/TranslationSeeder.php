<?php

namespace Database\Seeders;

use Botble\Base\Facades\Html;
use Botble\Base\Supports\BaseSeeder;
use Botble\Blog\Models\Category;
use Botble\Blog\Models\Post;
use Botble\Blog\Models\Tag;
use Botble\Gallery\Models\Gallery;
use Botble\Gallery\Models\GalleryMeta;
use Botble\Language\Facades\Language as LanguageFacade;
use Botble\Language\Models\Language;
use Botble\Language\Models\LanguageMeta;
use Botble\Menu\Database\Traits\HasMenuSeeder;
use Botble\Menu\Facades\Menu;
use Botble\Menu\Models\Menu as MenuModel;
use Botble\Menu\Models\MenuLocation;
use Botble\Menu\Models\MenuNode;
use Botble\Page\Models\Page;
use Botble\Setting\Facades\Setting;
use Botble\Theme\Facades\Theme;
use Botble\Theme\Facades\ThemeOption;
use Botble\Widget\Models\Widget;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

class TranslationSeeder extends BaseSeeder
{
    use HasMenuSeeder;

    public function run(): void
    {
        if (! is_plugin_active('language')) {
            return;
        }

        $this->createLanguages();

        $locales = $this->locales();

        $this->seedThemeOptions($locales);
        $this->seedMenus($locales);
        $this->seedWidgets($locales);

        if (is_plugin_active('language-advanced')) {
            $this->seedPageTranslations($locales);
            $this->seedCategoryTranslations($locales);
            $this->seedTagTranslations($locales);
            $this->seedPostTranslations($locales);
            $this->seedGalleryTranslations($locales);
            $this->seedGalleryMetaTranslations($locales);
        }
    }

    protected function locales(): array
    {
        return ['ar', 'vi', 'fr', 'id', 'tr'];
    }

    protected function createLanguages(): void
    {
        $languages = [
            [
                'lang_name' => 'Arabic',
                'lang_locale' => 'ar',
                'lang_is_default' => false,
                'lang_code' => 'ar',
                'lang_is_rtl' => true,
                'lang_flag' => 'sa',
                'lang_order' => 1,
            ],
            [
                'lang_name' => 'Tiếng Việt',
                'lang_locale' => 'vi',
                'lang_is_default' => false,
                'lang_code' => 'vi',
                'lang_is_rtl' => false,
                'lang_flag' => 'vn',
                'lang_order' => 2,
            ],
            [
                'lang_name' => 'Français',
                'lang_locale' => 'fr',
                'lang_is_default' => false,
                'lang_code' => 'fr',
                'lang_is_rtl' => false,
                'lang_flag' => 'fr',
                'lang_order' => 3,
            ],
            [
                'lang_name' => 'Bahasa Indonesia',
                'lang_locale' => 'id',
                'lang_is_default' => false,
                'lang_code' => 'id',
                'lang_is_rtl' => false,
                'lang_flag' => 'id',
                'lang_order' => 4,
            ],
            [
                'lang_name' => 'Türkçe',
                'lang_locale' => 'tr',
                'lang_is_default' => false,
                'lang_code' => 'tr',
                'lang_is_rtl' => false,
                'lang_flag' => 'tr',
                'lang_order' => 5,
            ],
        ];

        foreach ($languages as $language) {
            Language::query()->updateOrCreate(
                ['lang_code' => $language['lang_code']],
                $language
            );
        }
    }

    protected function seedThemeOptions(array $locales): void
    {
        $translations = $this->themeOptionTranslations();
        $defaultLocale = LanguageFacade::getDefaultLocaleCode();

        foreach ($locales as $locale) {
            if (! isset($translations[$locale])) {
                continue;
            }

            Setting::set(
                ThemeOption::prepareFromArray($translations[$locale], $locale, $defaultLocale)
            );
        }

        Setting::save();
    }

    protected function themeOptionTranslations(): array
    {
        return [
            'ar' => [
                'site_title' => 'مجرد موقع Botble CMS آخر',
                'seo_description' => 'بخبرتنا، نضمن إنجاز كل مشروع بسرعة وفي الوقت المحدد وبجودة عالية باستخدام Botble CMS https://1.envato.market/LWRBY',
                'site_description' => 'بخبرتنا، نضمن إنجاز كل مشروع بسرعة وفي الوقت المحدد وبجودة عالية باستخدام Botble CMS https://1.envato.market/LWRBY',
                'copyright' => '©%Y شركتك. جميع الحقوق محفوظة.',
                'address' => '214 West Arnold St. New York, NY 10002',
                'cookie_consent_message' => 'سيتم تحسين تجربتك على هذا الموقع بالسماح بملفات تعريف الارتباط',
                'cookie_consent_learn_more_text' => 'سياسة ملفات تعريف الارتباط',
            ],
            'vi' => [
                'site_title' => 'Một trang Botble CMS khác',
                'seo_description' => 'Với kinh nghiệm, chúng tôi đảm bảo hoàn thành mọi dự án rất nhanh và đúng hạn với chất lượng cao bằng Botble CMS https://1.envato.market/LWRBY',
                'site_description' => 'Với kinh nghiệm, chúng tôi đảm bảo hoàn thành mọi dự án rất nhanh và đúng hạn với chất lượng cao bằng Botble CMS https://1.envato.market/LWRBY',
                'copyright' => '©%Y Công ty của bạn. Mọi quyền được bảo lưu.',
                'address' => '214 West Arnold St. New York, NY 10002',
                'cookie_consent_message' => 'Trải nghiệm của bạn trên trang này sẽ được cải thiện khi cho phép cookie',
                'cookie_consent_learn_more_text' => 'Chính sách cookie',
            ],
            'fr' => [
                'site_title' => 'Encore un site Botble CMS',
                'seo_description' => 'Grâce à notre expérience, nous veillons à livrer chaque projet très rapidement et dans les délais avec une haute qualité en utilisant Botble CMS https://1.envato.market/LWRBY',
                'site_description' => 'Grâce à notre expérience, nous veillons à livrer chaque projet très rapidement et dans les délais avec une haute qualité en utilisant Botble CMS https://1.envato.market/LWRBY',
                'copyright' => '©%Y Votre entreprise. Tous droits réservés.',
                'address' => '214 West Arnold St. New York, NY 10002',
                'cookie_consent_message' => 'Votre expérience sur ce site sera améliorée en autorisant les cookies',
                'cookie_consent_learn_more_text' => 'Politique de cookies',
            ],
            'id' => [
                'site_title' => 'Situs Botble CMS lainnya',
                'seo_description' => 'Dengan pengalaman kami, kami memastikan setiap proyek selesai sangat cepat dan tepat waktu dengan kualitas tinggi menggunakan Botble CMS https://1.envato.market/LWRBY',
                'site_description' => 'Dengan pengalaman kami, kami memastikan setiap proyek selesai sangat cepat dan tepat waktu dengan kualitas tinggi menggunakan Botble CMS https://1.envato.market/LWRBY',
                'copyright' => '©%Y Perusahaan Anda. Hak cipta dilindungi.',
                'address' => '214 West Arnold St. New York, NY 10002',
                'cookie_consent_message' => 'Pengalaman Anda di situs ini akan ditingkatkan dengan mengizinkan cookie',
                'cookie_consent_learn_more_text' => 'Kebijakan Cookie',
            ],
            'tr' => [
                'site_title' => 'Bir Botble CMS sitesi daha',
                'seo_description' => 'Tecrübemizle, Botble CMS https://1.envato.market/LWRBY kullanarak her projeyi çok hızlı ve zamanında yüksek kaliteyle tamamlamayı sağlarız',
                'site_description' => 'Tecrübemizle, Botble CMS https://1.envato.market/LWRBY kullanarak her projeyi çok hızlı ve zamanında yüksek kaliteyle tamamlamayı sağlarız',
                'copyright' => '©%Y Şirketiniz. Tüm hakları saklıdır.',
                'address' => '214 West Arnold St. New York, NY 10002',
                'cookie_consent_message' => 'Bu sitedeki deneyiminiz çerezlere izin vererek geliştirilecektir',
                'cookie_consent_learn_more_text' => 'Çerez Politikası',
            ],
        ];
    }

    protected function seedMenus(array $locales): void
    {
        $defaultMenuSlugs = ['main-menu', 'social'];
        $menus = MenuModel::query()
            ->whereIn('slug', $defaultMenuSlugs)
            ->get()
            ->keyBy('slug');

        if ($menus->isEmpty()) {
            return;
        }

        $hasMainMenu = $menus->has('main-menu');
        $hasSocialMenu = $menus->has('social');

        $menuOrigins = [];
        foreach ($menus as $slug => $menu) {
            $menuOrigins[$slug] = $this->getLanguageMetaOrigin($menu);
        }

        $mainMenuLocation = MenuLocation::query()
            ->where('menu_id', $menus->get('main-menu')?->getKey())
            ->where('location', 'main-menu')
            ->first();

        $locationOrigin = $mainMenuLocation ? $this->getLanguageMetaOrigin($mainMenuLocation) : null;

        $pageIds = Page::query()->pluck('id', 'name')->all();
        $translations = $this->menuTranslations();

        foreach ($locales as $locale) {
            if (! isset($translations[$locale])) {
                continue;
            }

            $localeTranslations = $translations[$locale];

            if ($hasMainMenu) {
                $this->createMenuTranslation(
                    $locale,
                    'main-menu',
                    $localeTranslations['main-menu']['name'],
                    $this->buildMainMenuItems($localeTranslations['main-menu'], $pageIds),
                    $menuOrigins['main-menu'] ?? null,
                    $locationOrigin
                );
            }

            if ($hasSocialMenu) {
                $this->createMenuTranslation(
                    $locale,
                    'social',
                    $localeTranslations['social']['name'],
                    $this->buildSocialMenuItems(),
                    $menuOrigins['social'] ?? null,
                    null
                );
            }
        }

        Menu::clearCacheMenuItems();
    }

    protected function menuTranslations(): array
    {
        return [
            'ar' => [
                'main-menu' => [
                    'name' => 'القائمة الرئيسية',
                    'home' => 'الرئيسية',
                    'purchase' => 'شراء',
                    'blog' => 'مدونة',
                    'galleries' => 'معارض',
                    'contact' => 'اتصل بنا',
                ],
                'social' => [
                    'name' => 'التواصل الاجتماعي',
                ],
            ],
            'vi' => [
                'main-menu' => [
                    'name' => 'Menu chính',
                    'home' => 'Trang chủ',
                    'purchase' => 'Mua',
                    'blog' => 'Blog',
                    'galleries' => 'Bộ sưu tập',
                    'contact' => 'Liên hệ',
                ],
                'social' => [
                    'name' => 'Mạng xã hội',
                ],
            ],
            'fr' => [
                'main-menu' => [
                    'name' => 'Menu principal',
                    'home' => 'Accueil',
                    'purchase' => 'Acheter',
                    'blog' => 'Blog',
                    'galleries' => 'Galeries',
                    'contact' => 'Contact',
                ],
                'social' => [
                    'name' => 'Réseaux sociaux',
                ],
            ],
            'id' => [
                'main-menu' => [
                    'name' => 'Menu utama',
                    'home' => 'Beranda',
                    'purchase' => 'Beli',
                    'blog' => 'Blog',
                    'galleries' => 'Galeri',
                    'contact' => 'Kontak',
                ],
                'social' => [
                    'name' => 'Sosial',
                ],
            ],
            'tr' => [
                'main-menu' => [
                    'name' => 'Ana menü',
                    'home' => 'Ana Sayfa',
                    'purchase' => 'Satın Al',
                    'blog' => 'Blog',
                    'galleries' => 'Galeriler',
                    'contact' => 'İletişim',
                ],
                'social' => [
                    'name' => 'Sosyal',
                ],
            ],
        ];
    }

    protected function buildMainMenuItems(array $labels, array $pageIds): array
    {
        return [
            [
                'title' => $labels['home'],
                'url' => '/',
            ],
            [
                'title' => $labels['purchase'],
                'url' => 'https://botble.com/go/download-cms',
                'target' => '_blank',
            ],
            [
                'title' => $labels['blog'],
                'reference_id' => $pageIds['Blog'] ?? null,
                'reference_type' => Page::class,
            ],
            [
                'title' => $labels['galleries'],
                'reference_id' => $pageIds['Galleries'] ?? null,
                'reference_type' => Page::class,
            ],
            [
                'title' => $labels['contact'],
                'reference_id' => $pageIds['Contact'] ?? null,
                'reference_type' => Page::class,
            ],
        ];
    }

    protected function buildSocialMenuItems(): array
    {
        return [
            [
                'title' => 'Facebook',
                'url' => 'https://facebook.com',
                'icon_font' => 'ti ti-brand-facebook',
                'target' => '_blank',
            ],
            [
                'title' => 'Twitter',
                'url' => 'https://twitter.com',
                'icon_font' => 'ti ti-brand-x',
                'target' => '_blank',
            ],
            [
                'title' => 'GitHub',
                'url' => 'https://github.com',
                'icon_font' => 'ti ti-brand-github',
                'target' => '_blank',
            ],
            [
                'title' => 'Linkedin',
                'url' => 'https://linkedin.com',
                'icon_font' => 'ti ti-brand-linkedin',
                'target' => '_blank',
            ],
        ];
    }

    protected function createMenuTranslation(
        string $locale,
        string $baseSlug,
        string $name,
        array $items,
        ?string $menuOrigin,
        ?string $locationOrigin
    ): void {
        $slug = $this->localizedSlug($baseSlug, $locale);

        $menu = MenuModel::query()->updateOrCreate(
            ['slug' => $slug],
            ['name' => $name]
        );

        MenuNode::query()->where('menu_id', $menu->getKey())->delete();
        MenuLocation::query()->where('menu_id', $menu->getKey())->delete();

        if ($baseSlug === 'main-menu') {
            $menuLocation = MenuLocation::query()->create([
                'menu_id' => $menu->getKey(),
                'location' => 'main-menu',
            ]);

            if ($locationOrigin) {
                LanguageMeta::saveMetaData($menuLocation, $locale, $locationOrigin);
            } else {
                LanguageMeta::saveMetaData($menuLocation, $locale);
            }
        }

        foreach ($items as $position => $menuNode) {
            $this->createMenuNode($position, $menuNode, $menu->getKey());
        }

        if ($menuOrigin) {
            LanguageMeta::saveMetaData($menu, $locale, $menuOrigin);
        } else {
            LanguageMeta::saveMetaData($menu, $locale);
        }
    }

    protected function localizedSlug(string $slug, string $locale): string
    {
        return sprintf('%s-%s', $slug, $locale);
    }

    protected function getLanguageMetaOrigin(object $model): string
    {
        $origin = LanguageMeta::query()
            ->where('reference_type', $model::class)
            ->where('reference_id', $model->getKey())
            ->value('lang_meta_origin');

        return $origin ?: md5($model->getKey() . $model::class . Str::random(6));
    }

    protected function seedWidgets(array $locales): void
    {
        $translations = $this->widgetTranslations();
        $baseTheme = Theme::getThemeName();
        $baseWidgets = Widget::query()
            ->where('theme', $baseTheme)
            ->get();
        $useUuid = $this->widgetIdsUseUuid();
        $nextId = $useUuid ? null : (int) Widget::query()->max('id');
        $now = $this->now();

        foreach ($locales as $locale) {
            if (! isset($translations[$locale])) {
                continue;
            }

            $themeName = Widget::getThemeName($locale);

            $widgets = Widget::query()
                ->where('theme', $themeName)
                ->get();

            if ($widgets->isEmpty() && $baseWidgets->isNotEmpty()) {
                $clonedWidgets = $baseWidgets
                    ->map(function (Widget $widget) use ($themeName, $useUuid, &$nextId, $now): array {
                        return [
                            'id' => $useUuid ? (string) Str::uuid() : ++$nextId,
                            'widget_id' => $widget->widget_id,
                            'sidebar_id' => $widget->sidebar_id,
                            'theme' => $themeName,
                            'position' => $widget->position,
                            'data' => json_encode(
                                $widget->data,
                                JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE
                            ),
                            'created_at' => $now,
                            'updated_at' => $now,
                        ];
                    })
                    ->all();

                if (! empty($clonedWidgets)) {
                    Widget::query()->insert($clonedWidgets);
                }

                $widgets = Widget::query()
                    ->where('theme', $themeName)
                    ->get();
            }

            if ($widgets->isEmpty()) {
                continue;
            }

            foreach ($widgets as $widget) {
                $data = $widget->data ?? [];
                $data = $this->applyWidgetTranslations($data, $translations[$locale], $locale);
                $widget->update(['data' => $data]);
            }
        }
    }

    protected function widgetIdsUseUuid(): bool
    {
        $column = DB::selectOne("SHOW COLUMNS FROM widgets WHERE Field = 'id'");

        if (! $column || ! isset($column->Type)) {
            return false;
        }

        $type = strtolower((string) $column->Type);

        return str_contains($type, 'char')
            || str_contains($type, 'binary')
            || str_contains($type, 'uuid');
    }

    protected function widgetTranslations(): array
    {
        return [
            'ar' => [
                'Recent Posts' => 'أحدث المقالات',
                'Tags' => 'الوسوم',
                'Categories' => 'التصنيفات',
                'Social' => 'التواصل الاجتماعي',
                'Favorite Websites' => 'مواقع مفضلة',
                'My Links' => 'روابطي',
                'Home Page' => 'الصفحة الرئيسية',
                'Contact' => 'اتصل بنا',
                'Green Technology' => 'التكنولوجيا الخضراء',
                'Augmented Reality (AR)' => 'الواقع المعزز (AR)',
                'Galleries' => 'معارض',
            ],
            'vi' => [
                'Recent Posts' => 'Bài viết mới',
                'Tags' => 'Thẻ',
                'Categories' => 'Chuyên mục',
                'Social' => 'Mạng xã hội',
                'Favorite Websites' => 'Trang web yêu thích',
                'My Links' => 'Liên kết của tôi',
                'Home Page' => 'Trang chủ',
                'Contact' => 'Liên hệ',
                'Green Technology' => 'Công nghệ xanh',
                'Augmented Reality (AR)' => 'Thực tế tăng cường (AR)',
                'Galleries' => 'Bộ sưu tập',
            ],
            'fr' => [
                'Recent Posts' => 'Articles récents',
                'Tags' => 'Tags',
                'Categories' => 'Catégories',
                'Social' => 'Réseaux sociaux',
                'Favorite Websites' => 'Sites favoris',
                'My Links' => 'Mes liens',
                'Home Page' => 'Accueil',
                'Contact' => 'Contact',
                'Green Technology' => 'Technologie verte',
                'Augmented Reality (AR)' => 'Réalité augmentée (AR)',
                'Galleries' => 'Galeries',
            ],
            'id' => [
                'Recent Posts' => 'Postingan terbaru',
                'Tags' => 'Tag',
                'Categories' => 'Kategori',
                'Social' => 'Sosial',
                'Favorite Websites' => 'Situs favorit',
                'My Links' => 'Tautan saya',
                'Home Page' => 'Beranda',
                'Contact' => 'Kontak',
                'Green Technology' => 'Teknologi hijau',
                'Augmented Reality (AR)' => 'Realitas tertambah (AR)',
                'Galleries' => 'Galeri',
            ],
            'tr' => [
                'Recent Posts' => 'Son Yazılar',
                'Tags' => 'Etiketler',
                'Categories' => 'Kategoriler',
                'Social' => 'Sosyal',
                'Favorite Websites' => 'Favori Siteler',
                'My Links' => 'Bağlantılarım',
                'Home Page' => 'Ana Sayfa',
                'Contact' => 'İletişim',
                'Green Technology' => 'Yeşil Teknoloji',
                'Augmented Reality (AR)' => 'Artırılmış Gerçeklik (AR)',
                'Galleries' => 'Galeriler',
            ],
        ];
    }

    protected function applyWidgetTranslations(array $data, array $translations, string $locale): array
    {
        if (isset($data['name'])) {
            $name = $data['name'];
            $nameKey = is_string($name) ? $name : null;
            $trimmedNameKey = is_string($name) ? trim($name) : null;

            if ($nameKey !== null && isset($translations[$nameKey])) {
                $data['name'] = $translations[$nameKey];
            } elseif ($trimmedNameKey !== null && isset($translations[$trimmedNameKey])) {
                $data['name'] = $translations[$trimmedNameKey];
            }
        }

        if (($data['menu_id'] ?? null) === 'social') {
            $data['menu_id'] = $this->localizedSlug('social', $locale);
        }

        if (isset($data['items']) && is_array($data['items'])) {
            foreach ($data['items'] as $itemIndex => $item) {
                foreach ($item as $fieldIndex => $field) {
                    $label = Arr::get($field, 'value');
                    $labelKey = is_string($label) ? $label : null;
                    $trimmedLabelKey = is_string($label) ? trim($label) : null;

                    if (
                        Arr::get($field, 'key') === 'label' &&
                        $labelKey &&
                        isset($translations[$labelKey])
                    ) {
                        $data['items'][$itemIndex][$fieldIndex]['value'] = $translations[$labelKey];
                    } elseif (
                        Arr::get($field, 'key') === 'label' &&
                        $trimmedLabelKey &&
                        isset($translations[$trimmedLabelKey])
                    ) {
                        $data['items'][$itemIndex][$fieldIndex]['value'] = $translations[$trimmedLabelKey];
                    }
                }
            }
        }

        return $data;
    }

    protected function seedPageTranslations(array $locales): void
    {
        if (! Schema::hasTable('pages_translations')) {
            return;
        }

        $pageIds = Page::query()->pluck('id', 'name')->all();
        $categoryId = null;

        if (Schema::hasTable('categories')) {
            $categoryId = Category::query()->skip(1)->value('id');
            $categoryId = $categoryId ? (int) $categoryId : null;
        }

        $translations = $this->pageTranslations($categoryId);

        foreach ($locales as $locale) {
            if (! isset($translations[$locale])) {
                continue;
            }

            foreach ($translations[$locale] as $pageName => $data) {
                $pageId = $pageIds[$pageName] ?? null;

                if (! $pageId) {
                    continue;
                }

                DB::table('pages_translations')->updateOrInsert(
                    [
                        'lang_code' => $locale,
                        'pages_id' => $pageId,
                    ],
                    array_merge(
                        [
                            'lang_code' => $locale,
                            'pages_id' => $pageId,
                        ],
                        $data
                    )
                );
            }
        }
    }

    protected function pageTranslations(?int $categoryId): array
    {
        return [
            'ar' => [
                'Homepage' => [
                    'name' => 'الرئيسية',
                    'content' => $this->homepageContent('ar', $categoryId),
                ],
                'Blog' => ['name' => 'مدونة'],
                'Contact' => ['name' => 'اتصل بنا'],
                'Cookie Policy' => ['name' => 'سياسة ملفات تعريف الارتباط'],
                'Galleries' => ['name' => 'معارض'],
                'About Us' => ['name' => 'معلومات عنا'],
                'Privacy Policy' => ['name' => 'سياسة الخصوصية'],
                'Terms of Service' => ['name' => 'شروط الخدمة'],
            ],
            'vi' => [
                'Homepage' => [
                    'name' => 'Trang chủ',
                    'content' => $this->homepageContent('vi', $categoryId),
                ],
                'Blog' => ['name' => 'Blog'],
                'Contact' => ['name' => 'Liên hệ'],
                'Cookie Policy' => ['name' => 'Chính sách cookie'],
                'Galleries' => ['name' => 'Bộ sưu tập'],
                'About Us' => ['name' => 'Về chúng tôi'],
                'Privacy Policy' => ['name' => 'Chính sách bảo mật'],
                'Terms of Service' => ['name' => 'Điều khoản dịch vụ'],
            ],
            'fr' => [
                'Homepage' => [
                    'name' => 'Accueil',
                    'content' => $this->homepageContent('fr', $categoryId),
                ],
                'Blog' => ['name' => 'Blog'],
                'Contact' => ['name' => 'Contact'],
                'Cookie Policy' => ['name' => 'Politique de cookies'],
                'Galleries' => ['name' => 'Galeries'],
                'About Us' => ['name' => 'À propos'],
                'Privacy Policy' => ['name' => 'Politique de confidentialité'],
                'Terms of Service' => ['name' => 'Conditions d\'utilisation'],
            ],
            'id' => [
                'Homepage' => [
                    'name' => 'Beranda',
                    'content' => $this->homepageContent('id', $categoryId),
                ],
                'Blog' => ['name' => 'Blog'],
                'Contact' => ['name' => 'Kontak'],
                'Cookie Policy' => ['name' => 'Kebijakan Cookie'],
                'Galleries' => ['name' => 'Galeri'],
                'About Us' => ['name' => 'Tentang Kami'],
                'Privacy Policy' => ['name' => 'Kebijakan Privasi'],
                'Terms of Service' => ['name' => 'Ketentuan Layanan'],
            ],
            'tr' => [
                'Homepage' => [
                    'name' => 'Ana Sayfa',
                    'content' => $this->homepageContent('tr', $categoryId),
                ],
                'Blog' => ['name' => 'Blog'],
                'Contact' => ['name' => 'İletişim'],
                'Cookie Policy' => ['name' => 'Çerez Politikası'],
                'Galleries' => ['name' => 'Galeriler'],
                'About Us' => ['name' => 'Hakkımızda'],
                'Privacy Policy' => ['name' => 'Gizlilik Politikası'],
                'Terms of Service' => ['name' => 'Hizmet Şartları'],
            ],
        ];
    }

    protected function homepageContent(string $locale, ?int $categoryId): string
    {
        $titles = [
            'en' => [
                'whats_new' => 'What\'s new?',
                'best_for_you' => 'Best for you',
                'galleries' => 'Galleries',
            ],
            'ar' => [
                'whats_new' => 'ما الجديد؟',
                'best_for_you' => 'الأفضل لك',
                'galleries' => 'المعارض',
            ],
            'vi' => [
                'whats_new' => 'Có gì mới?',
                'best_for_you' => 'Tốt nhất cho bạn',
                'galleries' => 'Bộ sưu tập',
            ],
            'fr' => [
                'whats_new' => 'Quoi de neuf ?',
                'best_for_you' => 'Meilleur pour vous',
                'galleries' => 'Galeries',
            ],
            'id' => [
                'whats_new' => 'Apa yang baru?',
                'best_for_you' => 'Terbaik untuk Anda',
                'galleries' => 'Galeri',
            ],
            'tr' => [
                'whats_new' => 'Neler yeni?',
                'best_for_you' => 'Sizin için en iyisi',
                'galleries' => 'Galeriler',
            ],
        ];

        $localeTitles = $titles[$locale] ?? $titles['en'];

        return Html::tag('div', '[featured-posts enable_lazy_loading="yes"][/featured-posts]') .
            Html::tag(
                'div',
                '[recent-posts title="' . $localeTitles['whats_new'] . '" enable_lazy_loading="yes"][/recent-posts]'
            ) .
            Html::tag(
                'div',
                '[featured-categories-posts title="' . $localeTitles['best_for_you'] . '" category_id="' . $categoryId . '" enable_lazy_loading="yes"][/featured-categories-posts]'
            ) .
            Html::tag(
                'div',
                '[all-galleries limit="6" title="' . $localeTitles['galleries'] . '" enable_lazy_loading="yes"][/all-galleries]'
            );
    }

    protected function seedCategoryTranslations(array $locales): void
    {
        if (! Schema::hasTable('categories_translations')) {
            return;
        }

        if (! Schema::hasTable('categories')) {
            return;
        }

        $categoryIds = Category::query()->pluck('id', 'name')->all();
        $translations = $this->categoryTranslations();

        foreach ($locales as $locale) {
            if (! isset($translations[$locale])) {
                continue;
            }

            foreach ($translations[$locale] as $name => $translation) {
                $categoryId = $categoryIds[$name] ?? null;

                if (! $categoryId) {
                    continue;
                }

                DB::table('categories_translations')->updateOrInsert(
                    [
                        'lang_code' => $locale,
                        'categories_id' => $categoryId,
                    ],
                    [
                        'lang_code' => $locale,
                        'categories_id' => $categoryId,
                        'name' => $translation,
                    ]
                );
            }
        }
    }

    protected function seedTagTranslations(array $locales): void
    {
        if (! is_plugin_active('blog')) {
            return;
        }

        if (! Schema::hasTable('tags_translations')) {
            return;
        }

        if (! Schema::hasTable('tags')) {
            return;
        }

        $tagIds = Tag::query()->pluck('id', 'name')->all();
        $translations = $this->tagTranslations();

        foreach ($locales as $locale) {
            if (! isset($translations[$locale])) {
                continue;
            }

            foreach ($translations[$locale] as $name => $translation) {
                $tagId = $tagIds[$name] ?? null;

                if (! $tagId) {
                    continue;
                }

                DB::table('tags_translations')->updateOrInsert(
                    [
                        'lang_code' => $locale,
                        'tags_id' => $tagId,
                    ],
                    [
                        'lang_code' => $locale,
                        'tags_id' => $tagId,
                        'name' => $translation,
                    ]
                );
            }
        }
    }

    protected function categoryTranslations(): array
    {
        return [
            'ar' => [
                'Artificial Intelligence' => 'الذكاء الاصطناعي',
                'Cybersecurity' => 'الأمن السيبراني',
                'Blockchain Technology' => 'تقنية البلوك تشين',
                '5G and Connectivity' => 'الجيل الخامس والاتصال',
                'Augmented Reality (AR)' => 'الواقع المعزز (AR)',
                'Green Technology' => 'التكنولوجيا الخضراء',
                'Quantum Computing' => 'الحوسبة الكمية',
                'Edge Computing' => 'الحوسبة الطرفية',
            ],
            'vi' => [
                'Artificial Intelligence' => 'Trí tuệ nhân tạo',
                'Cybersecurity' => 'An ninh mạng',
                'Blockchain Technology' => 'Công nghệ blockchain',
                '5G and Connectivity' => '5G và kết nối',
                'Augmented Reality (AR)' => 'Thực tế tăng cường (AR)',
                'Green Technology' => 'Công nghệ xanh',
                'Quantum Computing' => 'Điện toán lượng tử',
                'Edge Computing' => 'Điện toán biên',
            ],
            'fr' => [
                'Artificial Intelligence' => 'Intelligence artificielle',
                'Cybersecurity' => 'Cybersécurité',
                'Blockchain Technology' => 'Technologie blockchain',
                '5G and Connectivity' => '5G et connectivité',
                'Augmented Reality (AR)' => 'Réalité augmentée (AR)',
                'Green Technology' => 'Technologie verte',
                'Quantum Computing' => 'Informatique quantique',
                'Edge Computing' => 'Informatique en périphérie',
            ],
            'id' => [
                'Artificial Intelligence' => 'Kecerdasan buatan',
                'Cybersecurity' => 'Keamanan siber',
                'Blockchain Technology' => 'Teknologi blockchain',
                '5G and Connectivity' => '5G dan konektivitas',
                'Augmented Reality (AR)' => 'Realitas tertambah (AR)',
                'Green Technology' => 'Teknologi hijau',
                'Quantum Computing' => 'Komputasi kuantum',
                'Edge Computing' => 'Komputasi tepi',
            ],
            'tr' => [
                'Artificial Intelligence' => 'Yapay zeka',
                'Cybersecurity' => 'Siber güvenlik',
                'Blockchain Technology' => 'Blok zinciri teknolojisi',
                '5G and Connectivity' => '5G ve bağlantı',
                'Augmented Reality (AR)' => 'Artırılmış gerçeklik (AR)',
                'Green Technology' => 'Yeşil teknoloji',
                'Quantum Computing' => 'Kuantum bilişim',
                'Edge Computing' => 'Uç bilişim',
            ],
        ];
    }

    protected function tagTranslations(): array
    {
        return [
            'ar' => [
                'AI' => 'الذكاء الاصطناعي',
                'Machine Learning' => 'تعلم الآلة',
                'Neural Networks' => 'الشبكات العصبية',
                'Cybersecurity' => 'الأمن السيبراني',
                'Blockchain' => 'البلوك تشين',
                'Cryptocurrency' => 'العملات المشفرة',
                'IoT' => 'إنترنت الأشياء',
                'AR/VR' => 'الواقع المعزز/الافتراضي',
                'Quantum Computing' => 'الحوسبة الكمومية',
                'Autonomous Vehicles' => 'المركبات ذاتية القيادة',
                'Space Tech' => 'تقنيات الفضاء',
                'Robotics' => 'الروبوتات',
                'Cloud Computing' => 'الحوسبة السحابية',
                'Big Data' => 'البيانات الضخمة',
                'DevOps' => 'DevOps',
                'Mobile Tech' => 'تقنيات المحمول',
                '5G' => 'الجيل الخامس',
                'Biotechnology' => 'التكنولوجيا الحيوية',
                'Clean Energy' => 'الطاقة النظيفة',
                'Smart Cities' => 'المدن الذكية',
            ],
            'vi' => [
                'AI' => 'Trí tuệ nhân tạo',
                'Machine Learning' => 'Học máy',
                'Neural Networks' => 'Mạng nơ-ron',
                'Cybersecurity' => 'An ninh mạng',
                'Blockchain' => 'Blockchain',
                'Cryptocurrency' => 'Tiền mã hóa',
                'IoT' => 'IoT',
                'AR/VR' => 'AR/VR',
                'Quantum Computing' => 'Điện toán lượng tử',
                'Autonomous Vehicles' => 'Xe tự hành',
                'Space Tech' => 'Công nghệ vũ trụ',
                'Robotics' => 'Robot',
                'Cloud Computing' => 'Điện toán đám mây',
                'Big Data' => 'Dữ liệu lớn',
                'DevOps' => 'DevOps',
                'Mobile Tech' => 'Công nghệ di động',
                '5G' => '5G',
                'Biotechnology' => 'Công nghệ sinh học',
                'Clean Energy' => 'Năng lượng sạch',
                'Smart Cities' => 'Thành phố thông minh',
            ],
            'fr' => [
                'AI' => 'IA',
                'Machine Learning' => 'Apprentissage automatique',
                'Neural Networks' => 'Réseaux de neurones',
                'Cybersecurity' => 'Cybersécurité',
                'Blockchain' => 'Blockchain',
                'Cryptocurrency' => 'Cryptomonnaie',
                'IoT' => 'IoT',
                'AR/VR' => 'RA/RV',
                'Quantum Computing' => 'Informatique quantique',
                'Autonomous Vehicles' => 'Véhicules autonomes',
                'Space Tech' => 'Technologies spatiales',
                'Robotics' => 'Robotique',
                'Cloud Computing' => 'Cloud computing',
                'Big Data' => 'Big data',
                'DevOps' => 'DevOps',
                'Mobile Tech' => 'Technologies mobiles',
                '5G' => '5G',
                'Biotechnology' => 'Biotechnologie',
                'Clean Energy' => 'Énergie propre',
                'Smart Cities' => 'Villes intelligentes',
            ],
            'id' => [
                'AI' => 'Kecerdasan buatan',
                'Machine Learning' => 'Pembelajaran mesin',
                'Neural Networks' => 'Jaringan saraf',
                'Cybersecurity' => 'Keamanan siber',
                'Blockchain' => 'Blockchain',
                'Cryptocurrency' => 'Mata uang kripto',
                'IoT' => 'IoT',
                'AR/VR' => 'AR/VR',
                'Quantum Computing' => 'Komputasi kuantum',
                'Autonomous Vehicles' => 'Kendaraan otonom',
                'Space Tech' => 'Teknologi antariksa',
                'Robotics' => 'Robotika',
                'Cloud Computing' => 'Komputasi awan',
                'Big Data' => 'Big data',
                'DevOps' => 'DevOps',
                'Mobile Tech' => 'Teknologi seluler',
                '5G' => '5G',
                'Biotechnology' => 'Bioteknologi',
                'Clean Energy' => 'Energi bersih',
                'Smart Cities' => 'Kota cerdas',
            ],
            'tr' => [
                'AI' => 'Yapay zeka',
                'Machine Learning' => 'Makine öğrenimi',
                'Neural Networks' => 'Sinir ağları',
                'Cybersecurity' => 'Siber güvenlik',
                'Blockchain' => 'Blok zinciri',
                'Cryptocurrency' => 'Kripto para',
                'IoT' => 'Nesnelerin İnterneti',
                'AR/VR' => 'AR/VR',
                'Quantum Computing' => 'Kuantum bilişim',
                'Autonomous Vehicles' => 'Otonom araçlar',
                'Space Tech' => 'Uzay teknolojileri',
                'Robotics' => 'Robotik',
                'Cloud Computing' => 'Bulut bilişim',
                'Big Data' => 'Büyük veri',
                'DevOps' => 'DevOps',
                'Mobile Tech' => 'Mobil teknoloji',
                '5G' => '5G',
                'Biotechnology' => 'Biyoteknoloji',
                'Clean Energy' => 'Temiz enerji',
                'Smart Cities' => 'Akıllı şehirler',
            ],
        ];
    }

    protected function seedPostTranslations(array $locales): void
    {
        if (! is_plugin_active('blog')) {
            return;
        }

        if (! Schema::hasTable('posts_translations')) {
            return;
        }

        $postIds = Post::query()->pluck('id', 'name')->all();

        if (empty($postIds)) {
            return;
        }

        $postOrder = $this->postOrder();
        $translations = $this->postTranslations();
        $paragraphs = $this->postParagraphs();
        $shortParagraphs = $this->postShortParagraphs();

        foreach ($locales as $locale) {
            if (! isset($translations[$locale], $paragraphs[$locale], $shortParagraphs[$locale])) {
                continue;
            }

            $localeTranslations = $translations[$locale];
            $localeParagraphs = $paragraphs[$locale];
            $localeShortParagraphs = $shortParagraphs[$locale];

            foreach ($postOrder as $index => $englishName) {
                $postId = $postIds[$englishName] ?? null;

                if (! $postId) {
                    continue;
                }

                $postTranslation = $localeTranslations[$index] ?? null;

                if (! $postTranslation) {
                    continue;
                }

                $content = $this->buildTranslatedPostContent(
                    $index,
                    $localeParagraphs,
                    $localeShortParagraphs
                );

                DB::table('posts_translations')->updateOrInsert(
                    [
                        'lang_code' => $locale,
                        'posts_id' => $postId,
                    ],
                    [
                        'lang_code' => $locale,
                        'posts_id' => $postId,
                        'name' => $postTranslation['name'],
                        'description' => $postTranslation['description'],
                        'content' => $content,
                    ]
                );
            }
        }
    }

    protected function buildTranslatedPostContent(
        int $index,
        array $paragraphs,
        array $shortParagraphs
    ): string {
        $paragraphCount = count($paragraphs);
        $shortCount = count($shortParagraphs);

        if ($paragraphCount === 0 || $shortCount === 0) {
            return '';
        }

        $content = '';

        if ($index % 3 === 0) {
            $content .= Html::tag(
                'p',
                '[youtube-video]https://www.youtube.com/watch?v=SlPhMPnQ58k[/youtube-video]'
            );
        }

        $content .= Html::tag('p', $paragraphs[$index % $paragraphCount]);
        $content .= Html::tag(
            'p',
            Html::image(
                $this->fileUrl('news/' . rand(1, 5) . '.jpg', size: 'medium'),
                'image',
                ['style' => 'width: 100%', 'class' => 'image_resized']
            )
                ->toHtml(),
            ['class' => 'text-center']
        );
        $content .= Html::tag('p', $shortParagraphs[$index % $shortCount]);
        $content .= Html::tag(
            'p',
            Html::image(
                $this->fileUrl('news/' . rand(6, 10) . '.jpg', size: 'medium'),
                'image',
                ['style' => 'width: 100%', 'class' => 'image_resized']
            )
                ->toHtml(),
            ['class' => 'text-center']
        );
        $content .= Html::tag('p', $paragraphs[($index + 3) % $paragraphCount]);
        $content .= Html::tag(
            'p',
            Html::image(
                $this->fileUrl('news/' . rand(11, 14) . '.jpg', size: 'medium'),
                'image',
                ['style' => 'width: 100%', 'class' => 'image_resized']
            )
                ->toHtml(),
            ['class' => 'text-center']
        );
        $content .= Html::tag('p', $paragraphs[($index + 5) % $paragraphCount]);

        return $content;
    }

    protected function postOrder(): array
    {
        return [
            'The Rise of Quantum Computing: IBM Unveils 1000-Qubit Processor',
            'Apple Vision Pro 2: The Future of Spatial Computing Has Arrived',
            'ChatGPT-5 Released: New AI Model Shows Human-Level Reasoning',
            'Tesla\'s Full Self-Driving Finally Approved for Highway Use in California',
            'Major Cybersecurity Breach: 500 Million Records Exposed in Cloud Storage Misconfiguration',
            'Microsoft Introduces AI-Powered Code Review: 40% Reduction in Production Bugs',
            'Boston Dynamics Robots Now Working in Amazon Warehouses',
            'Meta\'s New VR Gloves Let You Feel Virtual Objects',
            'Neuralink Begins Human Trials: First Patient Controls Computer with Thoughts',
            'Google\'s Project Starline: 3D Video Calls Without Headsets',
            'NVIDIA H200 GPU Breaks AI Training Records',
            'Ethereum 3.0 Launches: 100,000 Transactions Per Second Achieved',
            'SpaceX Starship Successfully Lands on Moon with NASA Astronauts',
            'Amazon\'s Drone Delivery Expands to 100 Cities Across the US',
            'Revolutionary Cancer Treatment: AI Discovers Personalized Drug Combinations',
            'Samsung\'s Transparent OLED Displays Transform Retail Shopping',
            'Waymo Robotaxis Now Operating in 25 Major Cities',
            'Solar Paint Achieves 30% Efficiency: Every Building Can Generate Power',
            'Blue Origin\'s Space Hotel Welcomes First Tourists',
            'AI Teachers in South Korea: Personalized Education for Every Student',
        ];
    }

    protected function postTranslations(): array
    {
        return [
            'ar' => [
                [
                    'name' => 'صعود الحوسبة الكمومية: IBM تكشف معالجًا بقدرة 1000 كيوبت',
                    'description' => 'تعلن IBM عن اختراق كبير مع معالجها الكمومي الجديد بقدرة 1000 كيوبت، واعدة بحل مشكلات معقدة في اكتشاف الأدوية والنمذجة المالية وأبحاث المناخ كانت ستستغرق الحواسيب التقليدية آلاف السنين لحلها.',
                ],
                [
                    'name' => 'Apple Vision Pro 2: مستقبل الحوسبة المكانية قد وصل',
                    'description' => 'تطلق Apple الجيل الثاني من سماعة Vision Pro مع عمر بطارية محسّن وتصميم أخف وقدرات تتبع العين الثورية التي تجعل الاجتماعات الافتراضية أكثر طبيعية من أي وقت مضى.',
                ],
                [
                    'name' => 'إطلاق ChatGPT-5: نموذج ذكاء اصطناعي جديد يُظهر استدلالًا بمستوى بشري',
                    'description' => 'يُظهر أحدث نموذج لغوي من OpenAI قدرات استدلال غير مسبوقة، فيحل براهين رياضية معقدة ويكتب الشيفرة بأخطاء قليلة جدًا، مما يثير الحماس والقلق الأخلاقي في مجتمع التقنية.',
                ],
                [
                    'name' => 'قيادة تسلا الذاتية الكاملة تحصل أخيرًا على الموافقة للاستخدام على الطرق السريعة في كاليفورنيا',
                    'description' => 'بعد سنوات من التطوير والاختبار، حصلت تسلا على موافقة الجهات التنظيمية للقيادة الذاتية الكاملة على الطرق السريعة في كاليفورنيا، ما يمثل لحظة محورية لصناعة المركبات الذاتية.',
                ],
                [
                    'name' => 'اختراق أمن سيبراني كبير: كشف 500 مليون سجل بسبب سوء تهيئة التخزين السحابي',
                    'description' => 'أدى ضبط غير صحيح لدلو AWS S3 إلى أحد أكبر اختراقات البيانات في التاريخ، كاشفًا معلومات شخصية لمستخدمين في عدة شركات من قائمة فورتشن 500 ومبرزًا أهمية أفضل ممارسات أمن السحابة.',
                ],
                [
                    'name' => 'مايكروسوفت تقدم مراجعة كود مدعومة بالذكاء الاصطناعي: انخفاض 40% في أخطاء الإنتاج',
                    'description' => 'يلتقط نظام مراجعة الكود الجديد من مايكروسوفت، المدمج في GitHub، الأخطاء المحتملة والثغرات الأمنية قبل النشر، ما يحسن جودة الشيفرة بشكل كبير عبر آلاف المستودعات.',
                ],
                [
                    'name' => 'روبوتات Boston Dynamics تعمل الآن في مستودعات أمازون',
                    'description' => 'تنشر أمازون 10,000 روبوت من Boston Dynamics في مراكزها اللوجستية، ما يزيد سرعة معالجة الطرود بنسبة 300% ويقلل إصابات العمل إلى النصف.',
                ],
                [
                    'name' => 'قفازات الواقع الافتراضي الجديدة من Meta تجعلك تشعر بالأشياء الافتراضية',
                    'description' => 'تكشف Meta عن قفازات لمسية توفر ردود فعل واقعية في الواقع الافتراضي، ما يسمح للمستخدمين بالشعور بالملمس ودرجات الحرارة والمقاومة عند التفاعل مع الكائنات الرقمية.',
                ],
                [
                    'name' => 'Neuralink تبدأ التجارب البشرية: أول مريض يتحكم بالحاسوب عبر الأفكار',
                    'description' => 'تُظهر شركة واجهة الدماغ والحاسوب التابعة لإيلون ماسك بنجاح مريضًا مشلولًا يلعب الشطرنج ويتصفح الإنترنت باستخدام أفكاره فقط، فاتحة آفاقًا جديدة لتقنيات المساعدة.',
                ],
                [
                    'name' => 'مشروع Starline من Google: مكالمات فيديو ثلاثية الأبعاد من دون خوذات',
                    'description' => 'يمكّن اختراق Google في تقنية العرض بالحقل الضوئي محادثات فيديو ثلاثية الأبعاد نابضة بالحياة من دون خوذات واقع افتراضي، ما يجعل التواصل عن بُعد طبيعيًا كأنك تجلس على الطاولة نفسها.',
                ],
                [
                    'name' => 'معالج الرسوميات NVIDIA H200 يحطم أرقام تدريب الذكاء الاصطناعي',
                    'description' => 'يدرّب أحدث معالج رسومي لمراكز البيانات من NVIDIA النماذج اللغوية الكبيرة بسرعة أكبر بخمس مرات من الجيل السابق، ما يمكّن الباحثين من تطوير نماذج أكثر تطورًا مع خفض استهلاك الطاقة بنسبة 40%.',
                ],
                [
                    'name' => 'إطلاق Ethereum 3.0: تحقيق 100,000 معاملة في الثانية',
                    'description' => 'تفي ترقية Ethereum المرتقبة بوعدها في قابلية التوسع، فتُعالج 100,000 معاملة في الثانية مع الحفاظ على اللامركزية وتقليل رسوم الغاز إلى سنتات.',
                ],
                [
                    'name' => 'ستارشيب من SpaceX تهبط بنجاح على القمر مع رواد ناسا',
                    'description' => 'أكملت ستارشيب من SpaceX أول هبوط قمري مأهول، ناقلةً رواد ناسا إلى القطب الجنوبي للقمر ضمن مهمة أرتيمس 3، ومعلنةً عودة البشرية بعد 50 عامًا.',
                ],
                [
                    'name' => 'توسّع توصيل الطائرات المسيّرة من أمازون إلى 100 مدينة في الولايات المتحدة',
                    'description' => 'يصل برنامج Amazon Prime Air إلى محطة مهمة مع توفر عمليات التسليم بالطائرات المسيّرة الذاتية في 100 مدينة أمريكية، لتسليم الطرود خلال أقل من 30 دقيقة وبمعدل نجاح 99.9%.',
                ],
                [
                    'name' => 'علاج ثوري للسرطان: الذكاء الاصطناعي يكتشف توليفات دوائية مخصصة',
                    'description' => 'يحدد AlphaFold 3 من DeepMind توليفات دوائية مثالية لمرضى السرطان بناءً على ملفاتهم الجينية، ما يؤدي إلى معدلات شفاء أعلى بنسبة 80% في التجارب السريرية.',
                ],
                [
                    'name' => 'شاشات OLED الشفافة من سامسونج تُحوّل تجربة التسوق بالتجزئة',
                    'description' => 'تحول تقنية OLED الشفافة الجديدة من سامسونج واجهات المتاجر إلى شاشات تفاعلية تعرض معلومات المنتجات وتجارب القياس الافتراضية مع الحفاظ على رؤية المنتجات الفعلية.',
                ],
                [
                    'name' => 'سيارات الأجرة الروبوتية من Waymo تعمل الآن في 25 مدينة كبرى',
                    'description' => 'توسع Waymo التابعة لألفابت خدمتها لسيارات الأجرة ذاتية القيادة بالكامل إلى 25 مدينة، وتنجز أكثر من مليون رحلة يوميًا دون حوادث تُنسب للنظام ذاتي القيادة.',
                ],
                [
                    'name' => 'طلاء شمسي يحقق كفاءة 30%: يمكن لكل مبنى توليد الطاقة',
                    'description' => 'يؤدي اختراق في تقنية خلايا بيروفسكايت الشمسية إلى ألواح شمسية قابلة للطلاء بكفاءة 30%، ما يجعل تحويل أي سطح إلى مولد طاقة أمرًا مجديًا اقتصاديًا.',
                ],
                [
                    'name' => 'فندق الفضاء من Blue Origin يستقبل أول السياح',
                    'description' => 'تفتتح Blue Origin التابعة لجيف بيزوس أول فندق فضائي تجاري في مدار أرضي منخفض، مقدمةً إقامات لمدة 10 أيام مع إطلالات مدهشة على الأرض مقابل مليون دولار للشخص.',
                ],
                [
                    'name' => 'معلّمو الذكاء الاصطناعي في كوريا الجنوبية: تعليم مخصص لكل طالب',
                    'description' => 'تطبق كوريا الجنوبية مساعدين تعليميين مدعومين بالذكاء الاصطناعي في جميع المدارس الحكومية، موفّرة مسارات تعلم مخصصة تتكيف مع وتيرة كل طالب وأسلوب تعلمه، ما يرفع نتائج الاختبارات بنسبة 35%.',
                ],
            ],
            'vi' => [
                [
                    'name' => 'Sự trỗi dậy của điện toán lượng tử: IBM công bố bộ xử lý 1.000 qubit',
                    'description' => 'IBM công bố một đột phá lớn với bộ xử lý lượng tử 1.000 qubit mới, hứa hẹn giải quyết các bài toán phức tạp trong khám phá thuốc, mô hình tài chính và nghiên cứu khí hậu mà máy tính cổ điển sẽ mất hàng nghìn năm.',
                ],
                [
                    'name' => 'Apple Vision Pro 2: Tương lai của điện toán không gian đã đến',
                    'description' => 'Tai nghe Vision Pro thế hệ thứ hai của Apple ra mắt với thời lượng pin tốt hơn, thiết kế nhẹ hơn và khả năng theo dõi mắt mang tính cách mạng, giúp các cuộc họp ảo trở nên tự nhiên hơn bao giờ hết.',
                ],
                [
                    'name' => 'ChatGPT-5 ra mắt: Mô hình AI mới thể hiện khả năng suy luận như con người',
                    'description' => 'Mô hình ngôn ngữ mới nhất của OpenAI cho thấy khả năng suy luận chưa từng có, giải các chứng minh toán học phức tạp và viết mã với rất ít lỗi, vừa tạo hứng khởi vừa đặt ra lo ngại đạo đức trong cộng đồng công nghệ.',
                ],
                [
                    'name' => 'Tự lái Hoàn toàn của Tesla cuối cùng được phê duyệt cho đường cao tốc ở California',
                    'description' => 'Sau nhiều năm phát triển và thử nghiệm, Tesla nhận được phê duyệt quản lý cho việc lái xe hoàn toàn tự động trên đường cao tốc ở California, đánh dấu bước ngoặt cho ngành xe tự hành.',
                ],
                [
                    'name' => 'Sự cố an ninh mạng lớn: 500 triệu bản ghi bị lộ do cấu hình lưu trữ đám mây sai',
                    'description' => 'Một thùng AWS S3 cấu hình sai dẫn đến một trong những vụ rò rỉ dữ liệu lớn nhất lịch sử, làm lộ thông tin cá nhân của người dùng từ nhiều công ty Fortune 500 và nhấn mạnh tầm quan trọng của thực hành bảo mật đám mây.',
                ],
                [
                    'name' => 'Microsoft giới thiệu đánh giá mã bằng AI: giảm 40% lỗi trên môi trường sản xuất',
                    'description' => 'Hệ thống đánh giá mã mới của Microsoft, tích hợp vào GitHub, phát hiện lỗi tiềm ẩn và lỗ hổng bảo mật trước khi triển khai, cải thiện đáng kể chất lượng mã ở hàng nghìn kho lưu trữ.',
                ],
                [
                    'name' => 'Robot Boston Dynamics hiện làm việc trong kho Amazon',
                    'description' => 'Amazon triển khai 10.000 robot Boston Dynamics tại các trung tâm hoàn tất đơn hàng, tăng tốc xử lý gói hàng lên 300% và giảm chấn thương lao động một nửa.',
                ],
                [
                    'name' => 'Găng tay VR mới của Meta cho phép bạn cảm nhận vật thể ảo',
                    'description' => 'Meta ra mắt găng tay xúc giác mang lại phản hồi cảm giác thực tế trong VR, cho phép người dùng cảm nhận kết cấu, nhiệt độ và lực cản khi tương tác với vật thể số.',
                ],
                [
                    'name' => 'Neuralink bắt đầu thử nghiệm trên người: bệnh nhân đầu tiên điều khiển máy tính bằng suy nghĩ',
                    'description' => 'Công ty giao diện não–máy tính của Elon Musk cho thấy một bệnh nhân bị liệt có thể chơi cờ và lướt web chỉ bằng suy nghĩ, mở ra những khả năng mới cho công nghệ hỗ trợ.',
                ],
                [
                    'name' => 'Dự án Starline của Google: cuộc gọi video 3D không cần headset',
                    'description' => 'Đột phá trong công nghệ hiển thị trường ánh sáng của Google cho phép các cuộc trò chuyện video 3D sống động mà không cần VR, khiến giao tiếp từ xa tự nhiên như ngồi đối diện.',
                ],
                [
                    'name' => 'GPU NVIDIA H200 phá kỷ lục huấn luyện AI',
                    'description' => 'GPU trung tâm dữ liệu mới nhất của NVIDIA huấn luyện các mô hình ngôn ngữ lớn nhanh hơn thế hệ trước 5 lần, giúp nhà nghiên cứu phát triển AI tinh vi hơn đồng thời giảm tiêu thụ năng lượng 40%.',
                ],
                [
                    'name' => 'Ethereum 3.0 ra mắt: đạt 100.000 giao dịch mỗi giây',
                    'description' => 'Bản nâng cấp Ethereum được mong đợi từ lâu thực hiện lời hứa về khả năng mở rộng, xử lý 100.000 giao dịch/giây đồng thời duy trì tính phi tập trung và giảm phí gas xuống còn vài xu.',
                ],
                [
                    'name' => 'Starship của SpaceX hạ cánh thành công trên Mặt Trăng cùng phi hành gia NASA',
                    'description' => 'Starship hoàn tất lần hạ cánh Mặt Trăng có người lái đầu tiên, đưa phi hành gia NASA đến cực nam Mặt Trăng trong nhiệm vụ Artemis III, đánh dấu sự trở lại của nhân loại sau 50 năm.',
                ],
                [
                    'name' => 'Giao hàng bằng drone của Amazon mở rộng tới 100 thành phố ở Mỹ',
                    'description' => 'Amazon Prime Air đạt cột mốc mới khi dịch vụ giao hàng bằng drone tự hành có mặt tại 100 thành phố Mỹ, giao hàng dưới 30 phút với tỷ lệ thành công 99,9%.',
                ],
                [
                    'name' => 'Liệu pháp ung thư mang tính cách mạng: AI phát hiện các tổ hợp thuốc cá nhân hóa',
                    'description' => 'AlphaFold 3 của DeepMind xác định các tổ hợp thuốc tối ưu cho từng bệnh nhân ung thư dựa trên hồ sơ di truyền, dẫn đến tỷ lệ thuyên giảm cao hơn 80% trong thử nghiệm lâm sàng.',
                ],
                [
                    'name' => 'Màn hình OLED trong suốt của Samsung thay đổi trải nghiệm mua sắm bán lẻ',
                    'description' => 'Công nghệ OLED trong suốt mới của Samsung biến cửa sổ cửa hàng thành màn hình tương tác, hiển thị thông tin sản phẩm và thử nghiệm ảo đồng thời vẫn nhìn thấy sản phẩm thật.',
                ],
                [
                    'name' => 'Taxi robot Waymo hiện hoạt động tại 25 thành phố lớn',
                    'description' => 'Waymo của Alphabet mở rộng dịch vụ taxi tự hành hoàn toàn tới 25 thành phố, thực hiện hơn 1 triệu chuyến mỗi ngày mà không có tai nạn do hệ thống tự lái gây ra.',
                ],
                [
                    'name' => 'Sơn năng lượng mặt trời đạt hiệu suất 30%: mọi tòa nhà đều có thể tạo điện',
                    'description' => 'Đột phá trong công nghệ tế bào quang điện perovskite tạo ra các tấm pin mặt trời dạng sơn với hiệu suất 30%, khiến việc biến mọi bề mặt thành nguồn phát điện trở nên khả thi về kinh tế.',
                ],
                [
                    'name' => 'Khách sạn không gian của Blue Origin đón những du khách đầu tiên',
                    'description' => 'Blue Origin của Jeff Bezos khai trương khách sạn không gian thương mại đầu tiên ở quỹ đạo thấp, cung cấp kỳ nghỉ 10 ngày với tầm nhìn ngoạn mục về Trái Đất với giá 1 triệu USD mỗi người.',
                ],
                [
                    'name' => 'Giáo viên AI ở Hàn Quốc: giáo dục cá nhân hóa cho mọi học sinh',
                    'description' => 'Hàn Quốc triển khai trợ lý giảng dạy bằng AI tại mọi trường công, cung cấp lộ trình học cá nhân hóa theo tốc độ và phong cách học của từng học sinh, giúp cải thiện điểm thi 35%.',
                ],
            ],
            'fr' => [
                [
                    'name' => 'L\'essor de l\'informatique quantique : IBM dévoile un processeur de 1 000 qubits',
                    'description' => 'IBM annonce une percée majeure avec son nouveau processeur quantique de 1 000 qubits, promettant de résoudre des problèmes complexes en découverte de médicaments, modélisation financière et recherche climatique qui prendraient des millénaires aux ordinateurs classiques.',
                ],
                [
                    'name' => 'Apple Vision Pro 2 : l\'avenir de l\'informatique spatiale est arrivé',
                    'description' => 'Le casque Vision Pro de deuxième génération d\'Apple arrive avec une meilleure autonomie, un design plus léger et des capacités révolutionnaires de suivi oculaire qui rendent les réunions virtuelles plus naturelles que jamais.',
                ],
                [
                    'name' => 'ChatGPT-5 est lancé : un nouveau modèle d\'IA montre un raisonnement de niveau humain',
                    'description' => 'Le dernier modèle linguistique d\'OpenAI démontre des capacités de raisonnement inédites, résout des preuves mathématiques complexes et écrit du code avec très peu d\'erreurs, suscitant à la fois enthousiasme et inquiétudes éthiques dans la communauté technologique.',
                ],
                [
                    'name' => 'La conduite entièrement autonome de Tesla enfin approuvée pour les autoroutes en Californie',
                    'description' => 'Après des années de développement et d\'essais, Tesla obtient l\'autorisation réglementaire pour la conduite entièrement autonome sur les autoroutes en Californie, marquant un moment charnière pour l\'industrie des véhicules autonomes.',
                ],
                [
                    'name' => 'Fuite majeure de cybersécurité : 500 millions d\'enregistrements exposés par une mauvaise configuration du stockage cloud',
                    'description' => 'Un compartiment AWS S3 mal configuré entraîne l\'une des plus grandes fuites de données de l\'histoire, exposant les informations personnelles d\'utilisateurs de plusieurs entreprises du Fortune 500 et soulignant l\'importance des bonnes pratiques de sécurité cloud.',
                ],
                [
                    'name' => 'Microsoft lance la revue de code assistée par IA : 40 % de bugs en production en moins',
                    'description' => 'Le nouveau système de revue de code de Microsoft, intégré à GitHub, détecte les bugs potentiels et les vulnérabilités de sécurité avant le déploiement, améliorant fortement la qualité du code dans des milliers de dépôts.',
                ],
                [
                    'name' => 'Les robots de Boston Dynamics travaillent désormais dans les entrepôts d\'Amazon',
                    'description' => 'Amazon déploie 10 000 robots Boston Dynamics dans ses centres logistiques, augmentant la vitesse de traitement des colis de 300 % et réduisant de moitié les blessures au travail.',
                ],
                [
                    'name' => 'Les nouveaux gants VR de Meta permettent de sentir les objets virtuels',
                    'description' => 'Meta dévoile des gants haptiques offrant un retour tactile réaliste en réalité virtuelle, permettant aux utilisateurs de ressentir textures, températures et résistance lorsqu\'ils interagissent avec des objets numériques.',
                ],
                [
                    'name' => 'Neuralink commence les essais humains : le premier patient contrôle un ordinateur par la pensée',
                    'description' => 'La société d\'interface cerveau‑ordinateur d\'Elon Musk montre qu\'un patient paralysé peut jouer aux échecs et naviguer sur Internet uniquement par la pensée, ouvrant de nouvelles possibilités pour les technologies d\'assistance.',
                ],
                [
                    'name' => 'Project Starline de Google : appels vidéo 3D sans casque',
                    'description' => 'La percée de Google dans l\'affichage à champ lumineux permet des conversations vidéo 3D réalistes sans casques VR, rendant la communication à distance aussi naturelle que d\'être assis face à face.',
                ],
                [
                    'name' => 'Le GPU NVIDIA H200 bat des records d\'entraînement IA',
                    'description' => 'Le dernier GPU de centre de données de NVIDIA entraîne les grands modèles linguistiques cinq fois plus vite que la génération précédente, permettant des modèles plus sophistiqués tout en réduisant la consommation d\'énergie de 40 %.',
                ],
                [
                    'name' => 'Ethereum 3.0 est lancé : 100 000 transactions par seconde atteintes',
                    'description' => 'La mise à niveau Ethereum très attendue tient sa promesse de scalabilité, traitant 100 000 transactions par seconde tout en maintenant la décentralisation et en réduisant les frais de gas à quelques centimes.',
                ],
                [
                    'name' => 'Starship de SpaceX atterrit avec succès sur la Lune avec des astronautes de la NASA',
                    'description' => 'Starship réalise son premier alunissage habité, déposant des astronautes de la NASA au pôle sud lunaire dans le cadre de la mission Artemis III, marquant le retour de l\'humanité après 50 ans.',
                ],
                [
                    'name' => 'La livraison par drone d\'Amazon s\'étend à 100 villes aux États‑Unis',
                    'description' => 'Amazon Prime Air atteint un jalon : les livraisons autonomes par drone sont désormais disponibles dans 100 villes américaines, avec des colis livrés en moins de 30 minutes et un taux de réussite de 99,9 %.',
                ],
                [
                    'name' => 'Traitement révolutionnaire du cancer : l\'IA découvre des combinaisons de médicaments personnalisées',
                    'description' => 'AlphaFold 3 de DeepMind identifie des combinaisons de médicaments optimales pour chaque patient atteint de cancer selon son profil génétique, conduisant à des taux de rémission 80 % plus élevés dans les essais cliniques.',
                ],
                [
                    'name' => 'Les écrans OLED transparents de Samsung transforment le commerce de détail',
                    'description' => 'La nouvelle technologie OLED transparente de Samsung transforme les vitrines en écrans interactifs, affichant des informations produit et des essayages virtuels tout en laissant voir les produits physiques.',
                ],
                [
                    'name' => 'Les robotaxis Waymo opèrent désormais dans 25 grandes villes',
                    'description' => 'Waymo, filiale d\'Alphabet, étend son service de taxis entièrement autonomes à 25 villes, effectuant plus d\'un million de courses par jour sans accidents attribués au système de conduite autonome.',
                ],
                [
                    'name' => 'La peinture solaire atteint 30 % d\'efficacité : chaque bâtiment peut produire de l\'énergie',
                    'description' => 'Une avancée dans les cellules solaires en perovskite permet des panneaux solaires peignables à 30 % d\'efficacité, rendant économiquement viable la transformation de n\'importe quelle surface en générateur d\'énergie.',
                ],
                [
                    'name' => 'L\'hôtel spatial de Blue Origin accueille ses premiers touristes',
                    'description' => 'Blue Origin, la société de Jeff Bezos, ouvre le premier hôtel spatial commercial en orbite basse, proposant des séjours de 10 jours avec des vues spectaculaires de la Terre pour 1 million de dollars par personne.',
                ],
                [
                    'name' => 'Des enseignants IA en Corée du Sud : une éducation personnalisée pour chaque élève',
                    'description' => 'La Corée du Sud déploie des assistants pédagogiques basés sur l\'IA dans toutes les écoles publiques, offrant des parcours d\'apprentissage personnalisés adaptés au rythme et au style de chaque élève, améliorant les résultats aux tests de 35 %.',
                ],
            ],
            'id' => [
                [
                    'name' => 'Kebangkitan komputasi kuantum: IBM mengungkap prosesor 1.000 qubit',
                    'description' => 'IBM mengumumkan terobosan besar dengan prosesor kuantum 1.000 qubit baru, menjanjikan pemecahan masalah kompleks dalam penemuan obat, pemodelan keuangan, dan riset iklim yang akan memerlukan ribuan tahun bagi komputer klasik.',
                ],
                [
                    'name' => 'Apple Vision Pro 2: Masa depan komputasi spasial telah tiba',
                    'description' => 'Headset Vision Pro generasi kedua Apple diluncurkan dengan daya tahan baterai yang lebih baik, desain lebih ringan, dan kemampuan pelacakan mata revolusioner yang membuat rapat virtual terasa lebih alami dari sebelumnya.',
                ],
                [
                    'name' => 'ChatGPT-5 dirilis: Model AI baru menunjukkan penalaran setara manusia',
                    'description' => 'Model bahasa terbaru OpenAI menunjukkan kemampuan penalaran yang belum pernah ada, menyelesaikan pembuktian matematika kompleks dan menulis kode dengan sangat sedikit kesalahan, memunculkan antusiasme sekaligus kekhawatiran etis di komunitas teknologi.',
                ],
                [
                    'name' => 'Full Self-Driving Tesla akhirnya disetujui untuk jalan tol di California',
                    'description' => 'Setelah bertahun-tahun pengembangan dan pengujian, Tesla menerima persetujuan regulator untuk berkendara sepenuhnya otonom di jalan tol California, menandai momen penting bagi industri kendaraan otonom.',
                ],
                [
                    'name' => 'Kebocoran keamanan siber besar: 500 juta catatan terekspos akibat salah konfigurasi penyimpanan cloud',
                    'description' => 'Bucket AWS S3 yang salah dikonfigurasi menyebabkan salah satu kebocoran data terbesar dalam sejarah, mengekspos informasi pribadi pengguna dari beberapa perusahaan Fortune 500 dan menyoroti pentingnya praktik terbaik keamanan cloud.',
                ],
                [
                    'name' => 'Microsoft memperkenalkan peninjauan kode bertenaga AI: penurunan 40% bug di produksi',
                    'description' => 'Sistem peninjauan kode baru Microsoft yang terintegrasi dengan GitHub menangkap bug potensial dan kerentanan keamanan sebelum penerapan, secara drastis meningkatkan kualitas kode di ribuan repositori.',
                ],
                [
                    'name' => 'Robot Boston Dynamics kini bekerja di gudang Amazon',
                    'description' => 'Amazon mengerahkan 10.000 robot Boston Dynamics di pusat pemenuhan pesanan, meningkatkan kecepatan pemrosesan paket sebesar 300% dan mengurangi cedera kerja hingga setengahnya.',
                ],
                [
                    'name' => 'Sarung tangan VR baru Meta memungkinkan Anda merasakan objek virtual',
                    'description' => 'Meta memperkenalkan sarung tangan haptik yang memberikan umpan balik sentuhan realistis dalam VR, memungkinkan pengguna merasakan tekstur, suhu, dan resistansi saat berinteraksi dengan objek digital.',
                ],
                [
                    'name' => 'Neuralink mulai uji coba pada manusia: pasien pertama mengendalikan komputer dengan pikiran',
                    'description' => 'Perusahaan antarmuka otak‑komputer milik Elon Musk menunjukkan pasien lumpuh bermain catur dan menjelajah internet hanya dengan pikiran, membuka kemungkinan baru untuk teknologi bantu.',
                ],
                [
                    'name' => 'Project Starline Google: panggilan video 3D tanpa headset',
                    'description' => 'Terobosan teknologi tampilan medan cahaya Google memungkinkan percakapan video 3D yang nyata tanpa headset VR, membuat komunikasi jarak jauh terasa alami seperti duduk di seberang meja.',
                ],
                [
                    'name' => 'GPU NVIDIA H200 memecahkan rekor pelatihan AI',
                    'description' => 'GPU pusat data terbaru NVIDIA melatih model bahasa besar lima kali lebih cepat daripada generasi sebelumnya, memungkinkan peneliti mengembangkan model AI yang lebih canggih sekaligus mengurangi konsumsi energi sebesar 40%.',
                ],
                [
                    'name' => 'Ethereum 3.0 meluncur: 100.000 transaksi per detik tercapai',
                    'description' => 'Peningkatan Ethereum yang lama dinanti menepati janji skalabilitasnya, memproses 100.000 transaksi per detik sambil menjaga desentralisasi dan menurunkan biaya gas menjadi hanya beberapa sen.',
                ],
                [
                    'name' => 'Starship SpaceX sukses mendarat di Bulan bersama astronot NASA',
                    'description' => 'Starship menyelesaikan pendaratan bulan berawak pertamanya, mengantarkan astronot NASA ke kutub selatan Bulan sebagai bagian dari misi Artemis III, menandai kembalinya umat manusia setelah 50 tahun.',
                ],
                [
                    'name' => 'Pengantaran drone Amazon meluas ke 100 kota di AS',
                    'description' => 'Amazon Prime Air mencapai tonggak saat pengiriman drone otonom kini tersedia di 100 kota di Amerika Serikat, mengirim paket dalam waktu kurang dari 30 menit dengan tingkat keberhasilan 99,9%.',
                ],
                [
                    'name' => 'Terapi kanker revolusioner: AI menemukan kombinasi obat yang dipersonalisasi',
                    'description' => 'AlphaFold 3 dari DeepMind mengidentifikasi kombinasi obat terbaik untuk pasien kanker berdasarkan profil genetik, menghasilkan tingkat remisi 80% lebih tinggi dalam uji klinis.',
                ],
                [
                    'name' => 'Layar OLED transparan Samsung mengubah belanja ritel',
                    'description' => 'Teknologi OLED transparan baru Samsung mengubah jendela toko menjadi layar interaktif, menampilkan informasi produk dan uji coba virtual sekaligus mempertahankan visibilitas produk fisik.',
                ],
                [
                    'name' => 'Robotaksi Waymo kini beroperasi di 25 kota besar',
                    'description' => 'Waymo milik Alphabet memperluas layanan taksi otonom penuh ke 25 kota, menyelesaikan lebih dari 1 juta perjalanan per hari tanpa kecelakaan yang disebabkan oleh sistem swakemudi.',
                ],
                [
                    'name' => 'Cat surya mencapai efisiensi 30%: setiap gedung bisa menghasilkan listrik',
                    'description' => 'Terobosan pada teknologi sel surya perovskit menghasilkan panel surya berbentuk cat dengan efisiensi 30%, membuatnya layak secara ekonomi untuk mengubah permukaan apa pun menjadi generator listrik.',
                ],
                [
                    'name' => 'Hotel antariksa Blue Origin menyambut wisatawan pertama',
                    'description' => 'Blue Origin milik Jeff Bezos membuka hotel antariksa komersial pertama di orbit rendah Bumi, menawarkan masa tinggal 10 hari dengan pemandangan spektakuler Bumi seharga 1 juta dolar per orang.',
                ],
                [
                    'name' => 'Guru AI di Korea Selatan: pendidikan yang dipersonalisasi untuk setiap siswa',
                    'description' => 'Korea Selatan menerapkan asisten pengajaran berbasis AI di semua sekolah negeri, menyediakan jalur belajar yang dipersonalisasi sesuai ritme dan gaya belajar setiap siswa, meningkatkan nilai ujian sebesar 35%.',
                ],
            ],
            'tr' => [
                [
                    'name' => 'Kuantum bilişimin yükselişi: IBM 1000 qubitlik işlemciyi tanıttı',
                    'description' => 'IBM, 1000 qubitlik yeni kuantum işlemcisiyle büyük bir atılım duyurdu; bu işlemci ilaç keşfi, finansal modelleme ve iklim araştırmalarındaki karmaşık sorunları, klasik bilgisayarların bin yıllar sürecek hesaplamalarıyla çözecek.',
                ],
                [
                    'name' => 'Apple Vision Pro 2: Mekânsal bilişimin geleceği geldi',
                    'description' => 'Apple\'ın ikinci nesil Vision Pro başlığı, daha uzun pil ömrü, daha hafif tasarım ve sanal toplantıları her zamankinden daha doğal kılan devrim niteliğinde göz takibi yetenekleriyle piyasaya çıktı.',
                ],
                [
                    'name' => 'ChatGPT-5 yayınlandı: Yeni AI modeli insan düzeyinde akıl yürütme gösteriyor',
                    'description' => 'OpenAI\'nin en yeni dil modeli benzersiz akıl yürütme yetenekleri sergiliyor; karmaşık matematiksel kanıtları çözüyor ve çok az hatayla kod yazıyor, teknoloji topluluğunda hem heyecan hem de etik kaygılar doğuruyor.',
                ],
                [
                    'name' => 'Tesla\'nın Tam Otonom Sürüşü California otoyolları için nihayet onaylandı',
                    'description' => 'Yıllar süren geliştirme ve testlerin ardından Tesla, California otoyollarında tamamen otonom sürüş için düzenleyici onay aldı; bu, otonom araç endüstrisi için dönüm noktasıdır.',
                ],
                [
                    'name' => 'Büyük siber güvenlik ihlali: Bulut depolama yapılandırma hatasıyla 500 milyon kayıt açığa çıktı',
                    'description' => 'Yanlış yapılandırılmış bir AWS S3 bucket\'ı, tarihteki en büyük veri ihlallerinden birine yol açarak birçok Fortune 500 şirketinin kullanıcılarına ait kişisel bilgileri ifşa etti ve bulut güvenliği en iyi uygulamalarının önemini vurguladı.',
                ],
                [
                    'name' => 'Microsoft AI destekli kod incelemesi sunuyor: üretim hatalarında %40 azalma',
                    'description' => 'GitHub\'a entegre edilen Microsoft\'un yeni AI kod inceleme sistemi, dağıtımdan önce olası hataları ve güvenlik açıklarını yakalayarak binlerce depoda kod kalitesini ciddi ölçüde iyileştiriyor.',
                ],
                [
                    'name' => 'Boston Dynamics robotları artık Amazon depolarında çalışıyor',
                    'description' => 'Amazon, Boston Dynamics\'in 10.000 robotunu lojistik merkezlerinde devreye alarak paket işlemeyi %300 hızlandırdı ve işyeri yaralanmalarını yarıya indirdi.',
                ],
                [
                    'name' => 'Meta\'nın yeni VR eldivenleri sanal nesneleri hissettiriyor',
                    'description' => 'Meta, sanal gerçeklikte gerçekçi dokunsal geri bildirim sağlayan eldivenler tanıttı; kullanıcılar dijital nesnelerle etkileşirken doku, sıcaklık ve direnç hissedebiliyor.',
                ],
                [
                    'name' => 'Neuralink insan denemelerine başladı: ilk hasta düşünceleriyle bilgisayar kontrol ediyor',
                    'description' => 'Elon Musk\'ın beyin‑bilgisayar arayüzü şirketi, felçli bir hastanın yalnızca düşünceleriyle satranç oynadığını ve internette gezindiğini başarılı şekilde göstererek yardımcı teknolojiler için yeni olasılıklar açtı.',
                ],
                [
                    'name' => 'Google\'ın Project Starline\'ı: başlıksız 3D video görüşmeleri',
                    'description' => 'Google\'ın ışık alanı görüntüleme teknolojisindeki atılımı, VR başlığı olmadan canlı 3D video konuşmalarını mümkün kılıyor ve uzaktan iletişimi aynı masada oturuyormuş gibi doğal hale getiriyor.',
                ],
                [
                    'name' => 'NVIDIA H200 GPU yapay zeka eğitiminde rekor kırdı',
                    'description' => 'NVIDIA\'nın en yeni veri merkezi GPU\'su, büyük dil modellerini önceki nesle göre 5 kat daha hızlı eğitiyor; araştırmacıların daha gelişmiş AI modelleri geliştirmesine olanak tanırken enerji tüketimini %40 azaltıyor.',
                ],
                [
                    'name' => 'Ethereum 3.0 çıktı: saniyede 100.000 işlem elde edildi',
                    'description' => 'Uzun zamandır beklenen Ethereum yükseltmesi ölçeklenebilirlik vaadini yerine getiriyor; merkeziyetsizliği korurken saniyede 100.000 işlem işliyor ve gas ücretlerini birkaç sente düşürüyor.',
                ],
                [
                    'name' => 'SpaceX Starship NASA astronotlarıyla Ay\'a başarıyla indi',
                    'description' => 'SpaceX\'in Starship\'i, Artemis III görevinin bir parçası olarak NASA astronotlarını Ay\'ın güney kutbuna taşıyarak ilk mürettebatlı ay inişini gerçekleştirdi ve insanlığın 50 yıl sonra dönüşünü işaretledi.',
                ],
                [
                    'name' => 'Amazon\'un drone teslimatı ABD\'de 100 şehre genişledi',
                    'description' => 'Amazon Prime Air, otonom drone teslimatlarını ABD\'deki 100 şehirde kullanılabilir hale getirerek önemli bir kilometre taşına ulaştı; paketler 30 dakikadan kısa sürede %99,9 başarı oranıyla teslim ediliyor.',
                ],
                [
                    'name' => 'Devrim niteliğinde kanser tedavisi: AI kişiye özel ilaç kombinasyonları keşfediyor',
                    'description' => 'DeepMind\'ın AlphaFold 3\'ü, kanser hastaları için genetik profillerine göre optimal ilaç kombinasyonlarını belirleyerek klinik denemelerde %80 daha yüksek remisyon oranlarına yol açtı.',
                ],
                [
                    'name' => 'Samsung\'un şeffaf OLED ekranları perakende alışverişi dönüştürüyor',
                    'description' => 'Samsung\'un yeni şeffaf OLED teknolojisi vitrinleri interaktif ekranlara dönüştürüyor; ürün bilgilerini ve sanal denemeleri gösterirken fiziksel ürünlerin görünürlüğünü koruyor.',
                ],
                [
                    'name' => 'Waymo robotaksiler şimdi 25 büyük şehirde çalışıyor',
                    'description' => 'Alphabet\'in Waymo\'su tamamen otonom taksi hizmetini 25 şehre genişleterek günde 1 milyondan fazla yolculuk gerçekleştiriyor ve kendi kendine sürüş sistemine atfedilen sıfır kazayla bunu yapıyor.',
                ],
                [
                    'name' => 'Güneş boyası %30 verimliliğe ulaştı: her bina enerji üretebilir',
                    'description' => 'Perovskit güneş hücresi teknolojisindeki atılım, %30 verimliliğe sahip boyanabilir güneş panellerini mümkün kılıyor ve her yüzeyi enerji üreticisine dönüştürmeyi ekonomik hale getiriyor.',
                ],
                [
                    'name' => 'Blue Origin\'in uzay oteli ilk turistlerini ağırladı',
                    'description' => 'Jeff Bezos\'un Blue Origin\'i, alçak Dünya yörüngesinde ilk ticari uzay otelini açıyor; kişi başı 1 milyon dolar karşılığında 10 günlük konaklama ve Dünya\'nın muhteşem manzaralarını sunuyor.',
                ],
                [
                    'name' => 'Güney Kore\'de AI öğretmenler: her öğrenci için kişiselleştirilmiş eğitim',
                    'description' => 'Güney Kore, tüm devlet okullarında AI destekli öğretim asistanlarını devreye alarak her öğrencinin hızına ve öğrenme tarzına uyum sağlayan kişiselleştirilmiş öğrenme yolları sunuyor ve test skorlarını %35 artırıyor.',
                ],
            ],
        ];
    }

    protected function postParagraphs(): array
    {
        return [
            'ar' => [
                'يواصل التقدم السريع للتكنولوجيا إعادة تشكيل عالمنا بطرق غير مسبوقة. فمن الذكاء الاصطناعي إلى الحوسبة الكمومية، تحدث الاختراقات بوتيرة لم تكن تُتصور قبل عقد واحد فقط. هذه الابتكارات لا تحول الصناعات فحسب، بل تغيّر جذريًا طريقة عيشنا وعملنا وتواصلنا. ونحن على أعتاب عصر تقني جديد تبدو الإمكانات بلا حدود.',
                'يتوقع الخبراء أن تشهد السنوات الخمس القادمة تغيرات أكثر دراماتيكية في مشهد التكنولوجيا. فخوارزميات التعلم الآلي أصبحت أكثر تطورًا، مما يمكّن الحواسيب من أداء مهام كانت تُعد حكرًا على البشر. هذا التطور يخلق فرصًا جديدة ويثير في الوقت نفسه أسئلة مهمة حول الأخلاقيات والخصوصية ومستقبل العمل.',
                'أصبح تقاطع التكنولوجيا والاستدامة أكثر أهمية مع مواجهة التحديات البيئية العالمية. فحلول الطاقة النظيفة وأنظمة الشبكات الذكية وعمليات التصنيع الصديقة للبيئة ليست سوى أمثلة على كيفية مساهمة الابتكار في مواجهة تغير المناخ. تستثمر الشركات حول العالم بكثافة في التكنولوجيا الخضراء، إدراكًا لفوائدها البيئية وإمكاناتها الاقتصادية.',
                'ما يزال الأمن السيبراني أولوية قصوى للمؤسسات من جميع الأحجام مع استمرار تطور التهديدات الرقمية. لقد ازداد تعقيد الهجمات السيبرانية بشكل كبير، ما يتطلب يقظة دائمة واستثمارًا في إجراءات الحماية. من هجمات الفدية إلى الاختراقات المدعومة من الدول، أصبح مشهد التهديدات أكثر تعقيدًا من أي وقت مضى، ما يجعل ممارسات الأمن القوية ضرورية للبقاء في العصر الرقمي.',
                'تُسهم ديمقراطية التكنولوجيا في تمكين رواد الأعمال والشركات الصغيرة من المنافسة على نطاق عالمي. لقد خفّضت الحوسبة السحابية والبرمجيات مفتوحة المصدر وأدوات التطوير المتاحة حواجز الدخول عبر القطاعات. هذا التحول يعزز الابتكار ويخلق فرصًا اقتصادية جديدة في المجتمعات حول العالم، ويغير ديناميكيات المنافسة في الأسواق المختلفة.',
                'تدفع توقعات المستهلكين الابتكار السريع في تجربة المستخدم وتصميم الواجهات. يتوقع الناس اليوم تفاعلات سلسة وبديهية مع التكنولوجيا عبر جميع الأجهزة والمنصات. وقد أدى ذلك إلى تقدم كبير في معالجة اللغة الطبيعية والتعرّف على الإيماءات والواجهات التكيفية التي تتعلم من سلوك المستخدم لتوفير تجارب مخصصة.',
                'يتحول قطاع الرعاية الصحية بفعل الابتكار الرقمي، من الطب عن بُعد إلى التشخيص المدعوم بالذكاء الاصطناعي. هذه التقنيات تجعل الرعاية الصحية أكثر إتاحة وكفاءة وتخصيصًا من أي وقت مضى. فالأجهزة القابلة للارتداء وأنظمة المراقبة عن بُعد والسجلات الصحية الإلكترونية تخلق نهجًا أكثر ترابطًا واعتمادًا على البيانات في رعاية المرضى.',
                'تُحدث تقنيات التعليم ثورة في كيفية تعلم الناس واكتساب المهارات الجديدة. منصات التعلم عبر الإنترنت وبرامج التدريب بالواقع الافتراضي ومعلمو الذكاء الاصطناعي تجعل التعليم الجيد أكثر إتاحة للناس حول العالم. وتكتسب هذه التحول أهمية خاصة في أسواق عمل سريعة التغير حيث أصبح التعلم المستمر ضروريًا للنجاح المهني.',
                'إن صعود إنترنت الأشياء يربط مليارات الأجهزة ويخلق أنظمة بيئية ذكية في المنازل والمدن والصناعات. هذا الترابط يولد كميات هائلة من البيانات يمكن تحليلها لتحسين الكفاءة وتقليل الهدر وتعزيز جودة الحياة. ومن منظمات الحرارة الذكية إلى المركبات المتصلة، أصبحت تقنية إنترنت الأشياء جزءًا أساسيًا من الحياة اليومية.',
                'تدفع مخاوف الخصوصية إلى اعتماد أساليب جديدة لحماية البيانات وموافقة المستخدم. تعيد لوائح مثل GDPR وCCPA تشكيل طريقة جمع الشركات للمعلومات الشخصية وتخزينها واستخدامها. هذا التحول نحو مزيد من الشفافية وتحكم المستخدم يدفع الابتكار في تقنيات حفظ الخصوصية ويغير العلاقة بين المستهلكين ومقدمي الخدمات الرقمية.',
            ],
            'vi' => [
                'Sự tiến bộ nhanh chóng của công nghệ tiếp tục tái định hình thế giới của chúng ta theo những cách chưa từng có. Từ trí tuệ nhân tạo đến điện toán lượng tử, các đột phá đang diễn ra với tốc độ mà chỉ một thập kỷ trước còn khó tưởng tượng. Những đổi mới này không chỉ biến đổi các ngành công nghiệp mà còn thay đổi căn bản cách chúng ta sống, làm việc và tương tác với nhau. Khi đứng trước ngưỡng cửa của một kỷ nguyên công nghệ mới, các khả năng dường như vô hạn.',
                'Các chuyên gia dự đoán rằng năm năm tới sẽ mang lại những thay đổi còn mạnh mẽ hơn trong bức tranh công nghệ. Các thuật toán học máy ngày càng tinh vi, giúp máy tính thực hiện những nhiệm vụ từng được xem là độc quyền của con người. Sự tiến hóa này tạo ra cơ hội mới đồng thời đặt ra những câu hỏi quan trọng về đạo đức, quyền riêng tư và tương lai của công việc.',
                'Giao điểm giữa công nghệ và tính bền vững ngày càng quan trọng khi chúng ta đối mặt với các thách thức môi trường toàn cầu. Các giải pháp năng lượng sạch, hệ thống lưới điện thông minh và quy trình sản xuất thân thiện với môi trường chỉ là một vài ví dụ về cách đổi mới có thể giúp ứng phó biến đổi khí hậu. Các công ty trên toàn thế giới đang đầu tư mạnh vào công nghệ xanh, nhận thấy cả lợi ích môi trường lẫn tiềm năng kinh tế.',
                'An ninh mạng vẫn là ưu tiên hàng đầu của các tổ chức ở mọi quy mô khi các mối đe dọa số tiếp tục phát triển. Mức độ tinh vi của các cuộc tấn công mạng đã tăng mạnh, đòi hỏi sự cảnh giác liên tục và đầu tư vào biện pháp bảo vệ. Từ ransomware đến các vụ tấn công do nhà nước bảo trợ, bối cảnh đe dọa phức tạp hơn bao giờ hết, khiến các thực hành bảo mật vững chắc trở nên thiết yếu để tồn tại trong kỷ nguyên số.',
                'Việc dân chủ hóa công nghệ đang giúp các doanh nhân và doanh nghiệp nhỏ cạnh tranh trên phạm vi toàn cầu. Điện toán đám mây, phần mềm mã nguồn mở và các công cụ phát triển dễ tiếp cận đã hạ thấp rào cản gia nhập ở nhiều ngành. Sự dịch chuyển này thúc đẩy đổi mới và tạo ra cơ hội kinh tế mới cho cộng đồng trên khắp thế giới, đồng thời thay đổi động lực cạnh tranh của nhiều thị trường.',
                'Kỳ vọng của người tiêu dùng đang thúc đẩy đổi mới nhanh chóng trong trải nghiệm người dùng và thiết kế giao diện. Mọi người hiện mong đợi các tương tác liền mạch, trực quan với công nghệ trên mọi thiết bị và nền tảng. Điều này đã dẫn đến những tiến bộ đáng kể trong xử lý ngôn ngữ tự nhiên, nhận diện cử chỉ và các giao diện thích ứng học từ hành vi người dùng để cung cấp trải nghiệm cá nhân hóa.',
                'Ngành y tế đang được chuyển đổi bởi đổi mới số, từ khám chữa bệnh từ xa đến chẩn đoán bằng AI. Những công nghệ này khiến chăm sóc sức khỏe trở nên dễ tiếp cận hơn, hiệu quả hơn và cá nhân hóa hơn bao giờ hết. Thiết bị đeo, hệ thống theo dõi từ xa và hồ sơ sức khỏe điện tử đang tạo ra cách tiếp cận kết nối và dựa trên dữ liệu hơn trong chăm sóc bệnh nhân.',
                'Công nghệ giáo dục đang cách mạng hóa cách mọi người học tập và tiếp thu kỹ năng mới. Các nền tảng học trực tuyến, chương trình đào tạo thực tế ảo và gia sư AI khiến giáo dục chất lượng dễ tiếp cận hơn với người học trên toàn thế giới. Sự chuyển đổi này đặc biệt quan trọng trong các thị trường việc làm thay đổi nhanh, nơi việc học liên tục đã trở thành điều thiết yếu để thành công trong sự nghiệp.',
                'Sự trỗi dậy của Internet of Things đang kết nối hàng tỷ thiết bị và tạo ra các hệ sinh thái thông minh trong nhà ở, đô thị và ngành công nghiệp. Sự kết nối này tạo ra lượng dữ liệu khổng lồ có thể phân tích để nâng cao hiệu quả, giảm lãng phí và cải thiện chất lượng cuộc sống. Từ bộ điều nhiệt thông minh đến xe kết nối, công nghệ IoT đang trở thành phần không thể thiếu của đời sống hằng ngày.',
                'Những lo ngại về quyền riêng tư đang thúc đẩy các cách tiếp cận mới để bảo vệ dữ liệu và sự đồng ý của người dùng. Các quy định như GDPR và CCPA đang định hình lại cách các công ty thu thập, lưu trữ và sử dụng thông tin cá nhân. Sự chuyển dịch hướng tới minh bạch hơn và tăng quyền kiểm soát của người dùng đang thúc đẩy đổi mới trong các công nghệ bảo vệ quyền riêng tư và thay đổi mối quan hệ giữa người tiêu dùng và nhà cung cấp dịch vụ số.',
            ],
            'fr' => [
                'La progression rapide de la technologie continue de remodeler notre monde de manière inédite. De l\'intelligence artificielle à l\'informatique quantique, les percées se succèdent à un rythme inimaginable il y a seulement dix ans. Ces innovations ne transforment pas seulement les industries, elles changent aussi profondément notre façon de vivre, de travailler et d\'interagir. À l\'aube d\'une nouvelle ère technologique, les possibilités semblent infinies.',
                'Les experts prévoient que les cinq prochaines années apporteront des changements encore plus spectaculaires dans le paysage technologique. Les algorithmes d\'apprentissage automatique deviennent de plus en plus sophistiqués, permettant aux ordinateurs d\'accomplir des tâches autrefois considérées comme exclusivement humaines. Cette évolution crée de nouvelles opportunités tout en soulevant des questions importantes sur l\'éthique, la vie privée et l\'avenir du travail.',
                'L\'intersection entre technologie et durabilité devient de plus en plus importante face aux défis environnementaux mondiaux. Les solutions d\'énergie propre, les réseaux intelligents et les procédés de fabrication écologiques ne sont que quelques exemples de la manière dont l\'innovation peut aider à lutter contre le changement climatique. Les entreprises du monde entier investissent massivement dans les technologies vertes, reconnaissant à la fois leurs bénéfices environnementaux et leur potentiel économique.',
                'La cybersécurité reste une priorité absolue pour les organisations de toutes tailles alors que les menaces numériques évoluent. La sophistication des cyberattaques a considérablement augmenté, exigeant une vigilance permanente et des investissements dans des mesures de protection. Des rançongiciels aux piratages soutenus par des États, le paysage des menaces est plus complexe que jamais, rendant des pratiques de sécurité robustes essentielles à la survie dans l\'ère numérique.',
                'La démocratisation de la technologie permet aux entrepreneurs et aux petites entreprises de rivaliser à l\'échelle mondiale. Le cloud computing, les logiciels open source et les outils de développement accessibles ont abaissé les barrières d\'entrée dans de nombreux secteurs. Cette évolution stimule l\'innovation et crée de nouvelles opportunités économiques dans les communautés du monde entier, modifiant en profondeur les dynamiques concurrentielles de divers marchés.',
                'Les attentes des consommateurs stimulent une innovation rapide en matière d\'expérience utilisateur et de design d\'interface. Les gens attendent désormais des interactions fluides et intuitives avec la technologie sur tous les appareils et plateformes. Cela a conduit à des avancées significatives en traitement du langage naturel, en reconnaissance gestuelle et en interfaces adaptatives qui apprennent du comportement des utilisateurs pour offrir des expériences personnalisées.',
                'Le secteur de la santé est transformé par l\'innovation numérique, de la télémédecine aux diagnostics assistés par l\'IA. Ces technologies rendent les soins de santé plus accessibles, plus efficaces et plus personnalisés que jamais. Les appareils portables, les systèmes de surveillance à distance et les dossiers médicaux électroniques créent une approche des soins plus connectée et fondée sur les données.',
                'La technologie éducative révolutionne la manière dont les gens apprennent et acquièrent de nouvelles compétences. Les plateformes d\'apprentissage en ligne, les programmes de formation en réalité virtuelle et les tuteurs IA rendent une éducation de qualité plus accessible partout dans le monde. Cette transformation est particulièrement importante dans des marchés du travail en rapide évolution où l\'apprentissage continu est devenu essentiel à la réussite professionnelle.',
                'L\'essor de l\'Internet des objets connecte des milliards d\'appareils et crée des écosystèmes intelligents dans les foyers, les villes et les industries. Cette interconnexion génère d\'immenses volumes de données pouvant être analysés pour améliorer l\'efficacité, réduire le gaspillage et améliorer la qualité de vie. Des thermostats intelligents aux véhicules connectés, la technologie IoT devient un élément intégral de la vie quotidienne.',
                'Les préoccupations liées à la vie privée poussent à de nouvelles approches en matière de protection des données et de consentement des utilisateurs. Des réglementations telles que le RGPD et le CCPA remodèlent la façon dont les entreprises collectent, stockent et utilisent les informations personnelles. Ce mouvement vers plus de transparence et de contrôle des utilisateurs stimule l\'innovation dans les technologies de protection de la vie privée et change la relation entre consommateurs et fournisseurs de services numériques.',
            ],
            'id' => [
                'Kemajuan teknologi yang sangat cepat terus membentuk ulang dunia kita dengan cara yang belum pernah terjadi sebelumnya. Dari kecerdasan buatan hingga komputasi kuantum, terobosan terjadi dengan kecepatan yang bahkan satu dekade lalu sulit dibayangkan. Inovasi ini bukan hanya mentransformasi industri, tetapi juga mengubah secara mendasar cara kita hidup, bekerja, dan berinteraksi. Di ambang era teknologi baru, kemungkinan yang ada terasa tak terbatas.',
                'Para ahli memprediksi lima tahun ke depan akan membawa perubahan yang lebih dramatis dalam lanskap teknologi. Algoritme pembelajaran mesin semakin canggih, memungkinkan komputer melakukan tugas yang dulu dianggap hanya bisa dilakukan manusia. Evolusi ini menciptakan peluang baru sekaligus menimbulkan pertanyaan penting tentang etika, privasi, dan masa depan pekerjaan.',
                'Persimpangan antara teknologi dan keberlanjutan semakin penting saat kita menghadapi tantangan lingkungan global. Solusi energi bersih, sistem jaringan pintar, dan proses manufaktur ramah lingkungan hanyalah beberapa contoh bagaimana inovasi dapat membantu mengatasi perubahan iklim. Perusahaan di seluruh dunia berinvestasi besar dalam teknologi hijau, mengakui manfaat lingkungan dan potensi ekonominya.',
                'Keamanan siber tetap menjadi prioritas utama bagi organisasi dari berbagai ukuran ketika ancaman digital terus berkembang. Tingkat kecanggihan serangan siber meningkat drastis, menuntut kewaspadaan terus-menerus dan investasi pada langkah-langkah perlindungan. Dari ransomware hingga peretasan yang disponsori negara, lanskap ancaman lebih kompleks dari sebelumnya, sehingga praktik keamanan yang kuat menjadi esensial untuk bertahan di era digital.',
                'Demokratisasi teknologi memungkinkan para wirausahawan dan usaha kecil bersaing di skala global. Komputasi awan, perangkat lunak sumber terbuka, dan alat pengembangan yang mudah diakses menurunkan hambatan masuk di berbagai industri. Pergeseran ini mendorong inovasi dan menciptakan peluang ekonomi baru di komunitas di seluruh dunia, sekaligus mengubah dinamika persaingan di berbagai pasar.',
                'Ekspektasi konsumen mendorong inovasi cepat dalam pengalaman pengguna dan desain antarmuka. Orang kini mengharapkan interaksi yang mulus dan intuitif dengan teknologi di semua perangkat dan platform. Hal ini telah memicu kemajuan signifikan dalam pemrosesan bahasa alami, pengenalan gestur, dan antarmuka adaptif yang belajar dari perilaku pengguna untuk memberikan pengalaman yang dipersonalisasi.',
                'Industri kesehatan sedang ditransformasi oleh inovasi digital, dari telemedicine hingga diagnostik berbasis AI. Teknologi ini membuat layanan kesehatan lebih mudah diakses, lebih efisien, dan lebih personal daripada sebelumnya. Perangkat wearable, sistem pemantauan jarak jauh, dan rekam medis elektronik menciptakan pendekatan perawatan pasien yang lebih terhubung dan berbasis data.',
                'Teknologi pendidikan merevolusi cara orang belajar dan memperoleh keterampilan baru. Platform pembelajaran daring, program pelatihan realitas virtual, dan tutor AI membuat pendidikan berkualitas lebih mudah diakses oleh orang di seluruh dunia. Transformasi ini sangat penting di pasar kerja yang berubah cepat, di mana pembelajaran berkelanjutan menjadi esensial untuk keberhasilan karier.',
                'Kebangkitan Internet of Things menghubungkan miliaran perangkat dan menciptakan ekosistem cerdas di rumah, kota, dan industri. Keterhubungan ini menghasilkan data dalam jumlah sangat besar yang dapat dianalisis untuk meningkatkan efisiensi, mengurangi pemborosan, dan meningkatkan kualitas hidup. Dari termostat pintar hingga kendaraan terkoneksi, teknologi IoT menjadi bagian integral dari kehidupan sehari-hari.',
                'Kekhawatiran privasi mendorong pendekatan baru terhadap perlindungan data dan persetujuan pengguna. Regulasi seperti GDPR dan CCPA membentuk ulang cara perusahaan mengumpulkan, menyimpan, dan menggunakan informasi pribadi. Pergeseran menuju transparansi yang lebih besar dan kontrol pengguna mendorong inovasi dalam teknologi pelindung privasi serta mengubah hubungan antara konsumen dan penyedia layanan digital.',
            ],
            'tr' => [
                'Teknolojideki hızlı ilerleme dünyamızı benzeri görülmemiş biçimlerde yeniden şekillendirmeye devam ediyor. Yapay zekadan kuantum bilişime kadar, atılımlar yalnızca on yıl önce hayal edilemeyecek bir hızda gerçekleşiyor. Bu yenilikler yalnızca sektörleri dönüştürmekle kalmıyor, aynı zamanda nasıl yaşadığımızı, çalıştığımızı ve birbirimizle etkileşim kurduğumuzu da kökten değiştiriyor. Yeni bir teknolojik çağın eşiğinde, olasılıklar sonsuz görünüyor.',
                'Uzmanlar, önümüzdeki beş yılın teknoloji manzarasında daha da dramatik değişiklikler getireceğini öngörüyor. Makine öğrenimi algoritmaları giderek daha sofistike hale geliyor ve bilgisayarların bir zamanlar yalnızca insanlara özgü olduğu düşünülen görevleri yapmasını sağlıyor. Bu evrim yeni fırsatlar yaratırken etik, gizlilik ve işin geleceği hakkında önemli soruları da gündeme getiriyor.',
                'Küresel çevresel zorluklarla karşı karşıya olduğumuz bu dönemde teknoloji ile sürdürülebilirliğin kesişimi giderek daha önemli hale geliyor. Temiz enerji çözümleri, akıllı şebeke sistemleri ve çevre dostu üretim süreçleri, yeniliğin iklim değişikliğiyle mücadeleye nasıl yardımcı olabileceğine dair birkaç örnek. Dünya genelindeki şirketler, çevresel faydalarını ve ekonomik potansiyelini kabul ederek yeşil teknolojiye büyük yatırımlar yapıyor.',
                'Siber güvenlik, dijital tehditler gelişmeye devam ettikçe her ölçekteki kuruluş için en önemli önceliklerden biri olmaya devam ediyor. Siber saldırıların karmaşıklığı önemli ölçüde arttı; bu da sürekli dikkat ve koruyucu önlemlere yatırım gerektiriyor. Fidye yazılımlarından devlet destekli saldırılara kadar tehdit manzarası her zamankinden daha karmaşık, bu da dijital çağda ayakta kalmak için güçlü güvenlik uygulamalarını zorunlu kılıyor.',
                'Teknolojinin demokratikleşmesi, girişimcilerin ve küçük işletmelerin küresel ölçekte rekabet etmesini sağlıyor. Bulut bilişim, açık kaynak yazılım ve erişilebilir geliştirme araçları, sektörler genelinde giriş engellerini düşürdü. Bu değişim inovasyonu teşvik ediyor ve dünya çapındaki topluluklarda yeni ekonomik fırsatlar yaratırken çeşitli pazarların rekabet dinamiklerini kökten değiştiriyor.',
                'Tüketici beklentileri, kullanıcı deneyimi ve arayüz tasarımında hızlı yenilikleri tetikliyor. İnsanlar artık tüm cihazlar ve platformlarda teknolojiyle kesintisiz ve sezgisel etkileşimler bekliyor. Bu da doğal dil işleme, jest tanıma ve kullanıcı davranışından öğrenerek kişiselleştirilmiş deneyimler sunan uyarlanabilir arayüzlerde önemli ilerlemelere yol açtı.',
                'Sağlık sektörü, teletıptan yapay zeka destekli teşhislere kadar dijital inovasyonla dönüşüyor. Bu teknolojiler sağlık hizmetlerini her zamankinden daha erişilebilir, verimli ve kişiselleştirilmiş hale getiriyor. Giyilebilir cihazlar, uzaktan izleme sistemleri ve elektronik sağlık kayıtları, hasta bakımında daha bağlantılı ve veri odaklı bir yaklaşım oluşturuyor.',
                'Eğitim teknolojisi, insanların öğrenme ve yeni beceriler edinme biçimini kökten değiştiriyor. Çevrim içi öğrenme platformları, sanal gerçeklik eğitim programları ve yapay zeka eğitmenleri, kaliteli eğitimi dünya çapında daha erişilebilir kılıyor. Bu dönüşüm, hızlı değişen iş piyasalarında sürekli öğrenmenin kariyer başarısı için vazgeçilmez hale geldiği bir dönemde özellikle önemlidir.',
                'Nesnelerin İnterneti\'nin yükselişi milyarlarca cihazı birbirine bağlayarak evlerde, şehirlerde ve endüstrilerde akıllı ekosistemler oluşturuyor. Bu bağlantılılık, verimliliği artırmak, israfı azaltmak ve yaşam kalitesini yükseltmek için analiz edilebilecek devasa veri miktarları üretiyor. Akıllı termostatlardan bağlantılı araçlara kadar IoT teknolojisi günlük yaşamın ayrılmaz bir parçası haline geliyor.',
                'Gizlilik endişeleri, veri koruma ve kullanıcı onayı konusunda yeni yaklaşımları teşvik ediyor. GDPR ve CCPA gibi düzenlemeler şirketlerin kişisel bilgileri nasıl topladığını, sakladığını ve kullandığını yeniden şekillendiriyor. Daha fazla şeffaflık ve kullanıcı kontrolüne yönelim, gizliliği koruyan teknolojilerde inovasyonu hızlandırıyor ve tüketiciler ile dijital hizmet sağlayıcıları arasındaki ilişkiyi değiştiriyor.',
            ],
        ];
    }

    protected function postShortParagraphs(): array
    {
        return [
            'ar' => [
                'يستمر الابتكار في التسارع عبر جميع قطاعات صناعة التكنولوجيا. تُعلن اختراقات جديدة تقريبًا يوميًا، دافعة حدود ما كان ممكنًا سابقًا. هذا التسارع يخلق فرصًا وتحديات للشركات والمستهلكين على حد سواء.',
                'أصبح مجتمع التكنولوجيا العالمي أكثر ترابطًا من أي وقت مضى. يتعاون الباحثون والمطورون ورواد الأعمال عبر الحدود لحل مشكلات معقدة وابتكار حلول جديدة. هذا التعاون الدولي ضروري لمواجهة التحديات الكبرى التي تواجه البشرية.',
                'بلغ الاستثمار في البحث والتطوير مستويات قياسية بينما تتسابق الشركات لتطوير الجيل القادم من التقنيات. من الأنظمة الذاتية إلى المواد المتقدمة، أصبح نطاق الابتكار مذهلًا بحق. هذه الاستثمارات تمهد الطريق لاختراقات مستقبلية.',
                'يبقى العنصر البشري في قلب التقدم التقني رغم تزايد الأتمتة. الإبداع والتعاطف والتفكير النقدي هي مهارات لا تستطيع الآلات تقليدها بسهولة. أنجح الابتكارات هي تلك التي تعزز قدرات الإنسان بدلًا من استبداله.',
                'أصبحت المعايير والتشغيل البيني أكثر أهمية مع ازدياد تعقيد نظم التكنولوجيا. إن قدرة الأنظمة والأجهزة المختلفة على العمل معًا بسلاسة ضرورية لتحقيق كامل إمكانات التحول الرقمي. يتسارع تعاون الصناعة على تطوير المعايير.',
            ],
            'vi' => [
                'Đổi mới tiếp tục tăng tốc ở mọi lĩnh vực của ngành công nghệ. Những đột phá mới được công bố gần như hằng ngày, đẩy xa giới hạn của những gì từng được xem là có thể. Nhịp độ thay đổi nhanh chóng này tạo ra cả cơ hội lẫn thách thức cho doanh nghiệp và người tiêu dùng.',
                'Cộng đồng công nghệ toàn cầu gắn kết hơn bao giờ hết. Các nhà nghiên cứu, lập trình viên và doanh nhân hợp tác xuyên biên giới để giải quyết các vấn đề phức tạp và tạo ra các giải pháp mới. Sự hợp tác quốc tế này là thiết yếu để giải quyết các thách thức lớn của nhân loại.',
                'Đầu tư vào nghiên cứu và phát triển đã đạt mức kỷ lục khi các công ty chạy đua phát triển thế hệ công nghệ tiếp theo. Từ các hệ thống tự động đến vật liệu tiên tiến, phạm vi đổi mới thực sự đáng kinh ngạc. Các khoản đầu tư này đặt nền móng cho những đột phá trong tương lai.',
                'Yếu tố con người vẫn là trung tâm của tiến bộ công nghệ dù tự động hóa ngày càng tăng. Sáng tạo, sự thấu cảm và tư duy phản biện là những kỹ năng mà máy móc không dễ sao chép. Những đổi mới thành công nhất là những đổi mới nâng cao năng lực con người thay vì đơn thuần thay thế họ.',
                'Các tiêu chuẩn và khả năng tương tác ngày càng quan trọng khi hệ sinh thái công nghệ trở nên phức tạp hơn. Khả năng để các hệ thống và thiết bị khác nhau làm việc cùng nhau một cách liền mạch là yếu tố then chốt để hiện thực hóa toàn bộ tiềm năng của chuyển đổi số. Hợp tác của ngành trong việc phát triển tiêu chuẩn đang tăng tốc.',
            ],
            'fr' => [
                'L\'innovation continue de s\'accélérer dans tous les secteurs de l\'industrie technologique. De nouvelles percées sont annoncées presque chaque jour, repoussant les limites de ce que l\'on croyait possible. Ce rythme rapide de changement crée à la fois des opportunités et des défis pour les entreprises et les consommateurs.',
                'La communauté technologique mondiale est plus connectée que jamais. Chercheurs, développeurs et entrepreneurs collaborent au-delà des frontières pour résoudre des problèmes complexes et créer de nouvelles solutions. Cette coopération internationale est essentielle pour relever les grands défis de l\'humanité.',
                'Les investissements en recherche et développement ont atteint des niveaux records alors que les entreprises se précipitent pour développer la prochaine génération de technologies. Des systèmes autonomes aux matériaux avancés, l\'étendue de l\'innovation est véritablement remarquable. Ces investissements préparent le terrain pour les percées futures.',
                'Le facteur humain reste central dans le progrès technologique malgré l\'automatisation croissante. La créativité, l\'empathie et la pensée critique sont des compétences que les machines ne peuvent pas facilement reproduire. Les innovations les plus réussies sont celles qui renforcent les capacités humaines plutôt que de simplement les remplacer.',
                'Les normes et l\'interopérabilité deviennent de plus en plus importantes à mesure que les écosystèmes technologiques se complexifient. La capacité de différents systèmes et appareils à fonctionner ensemble de manière transparente est essentielle pour réaliser tout le potentiel de la transformation numérique. La coopération de l\'industrie sur le développement des normes s\'accélère.',
            ],
            'id' => [
                'Inovasi terus dipercepat di seluruh sektor industri teknologi. Terobosan baru diumumkan hampir setiap hari, mendorong batas apa yang sebelumnya dianggap mungkin. Kecepatan perubahan ini menghadirkan peluang sekaligus tantangan bagi bisnis dan konsumen.',
                'Komunitas teknologi global lebih terhubung daripada sebelumnya. Peneliti, pengembang, dan wirausahawan berkolaborasi lintas batas untuk memecahkan masalah kompleks dan menciptakan solusi baru. Kerja sama internasional ini penting untuk menghadapi tantangan besar umat manusia.',
                'Investasi dalam riset dan pengembangan mencapai rekor ketika perusahaan berlomba mengembangkan generasi teknologi berikutnya. Dari sistem otonom hingga material maju, cakupan inovasi benar-benar luar biasa. Investasi ini meletakkan dasar bagi terobosan masa depan.',
                'Elemen manusia tetap menjadi pusat kemajuan teknologi meski otomatisasi meningkat. Kreativitas, empati, dan pemikiran kritis adalah keterampilan yang tidak mudah ditiru mesin. Inovasi yang paling berhasil adalah yang memperkuat kemampuan manusia alih-alih sekadar menggantikannya.',
                'Standar dan interoperabilitas semakin penting ketika ekosistem teknologi semakin kompleks. Kemampuan berbagai sistem dan perangkat untuk bekerja sama secara mulus sangat penting untuk mewujudkan potensi penuh transformasi digital. Kerja sama industri dalam pengembangan standar terus dipercepat.',
            ],
            'tr' => [
                'İnovasyon, teknoloji sektörünün tüm alanlarında hızlanmaya devam ediyor. Yeni atılımlar neredeyse her gün duyuruluyor ve daha önce mümkün olduğu düşünülen sınırları zorluyor. Bu hızlı değişim, işletmeler ve tüketiciler için hem fırsatlar hem de zorluklar yaratıyor.',
                'Küresel teknoloji topluluğu hiç olmadığı kadar bağlantılı. Araştırmacılar, geliştiriciler ve girişimciler karmaşık sorunları çözmek ve yeni çözümler üretmek için sınırların ötesinde iş birliği yapıyor. Bu uluslararası iş birliği, insanlığın karşı karşıya olduğu büyük zorlukları ele almak için kritik önem taşıyor.',
                'Şirketler bir sonraki nesil teknolojileri geliştirmek için yarışırken araştırma ve geliştirmeye yapılan yatırım rekor seviyelere ulaştı. Otonom sistemlerden gelişmiş malzemelere kadar inovasyonun kapsamı gerçekten etkileyici. Bu yatırımlar gelecekteki atılımların temelini oluşturuyor.',
                'Otomasyon artsa da insan unsuru teknolojik ilerlemenin merkezinde kalıyor. Yaratıcılık, empati ve eleştirel düşünme, makinelerin kolayca kopyalayamayacağı becerilerdir. En başarılı yenilikler, insan yeteneklerini geliştiren; onları sadece yerine koyan değil.',
                'Teknoloji ekosistemleri karmaşıklaştıkça standartlar ve birlikte çalışabilirlik daha önemli hale geliyor. Farklı sistem ve cihazların sorunsuz şekilde birlikte çalışabilmesi, dijital dönüşümün tam potansiyelini gerçekleştirmek için hayati. Standart geliştirme konusunda endüstri iş birliği hızlanıyor.',
            ],
        ];
    }

    protected function seedGalleryTranslations(array $locales): void
    {
        if (! is_plugin_active('gallery')) {
            return;
        }

        if (! Schema::hasTable('galleries_translations') || ! Schema::hasTable('galleries')) {
            return;
        }

        $galleryIds = Gallery::query()->pluck('id', 'name')->all();
        $translations = $this->galleryTranslations();

        foreach ($locales as $locale) {
            if (! isset($translations[$locale])) {
                continue;
            }

            foreach ($translations[$locale] as $name => $translation) {
                $galleryId = $galleryIds[$name] ?? null;

                if (! $galleryId) {
                    continue;
                }

                DB::table('galleries_translations')->updateOrInsert(
                    [
                        'lang_code' => $locale,
                        'galleries_id' => $galleryId,
                    ],
                    [
                        'lang_code' => $locale,
                        'galleries_id' => $galleryId,
                        'name' => $translation['name'],
                        'description' => $translation['description'],
                    ]
                );
            }
        }
    }

    protected function seedGalleryMetaTranslations(array $locales): void
    {
        if (! is_plugin_active('gallery')) {
            return;
        }

        if (! Schema::hasTable('gallery_meta_translations') || ! Schema::hasTable('gallery_meta')) {
            return;
        }

        $metaItems = GalleryMeta::query()->select(['id', 'images'])->get();

        if ($metaItems->isEmpty()) {
            return;
        }

        $descriptions = $this->galleryImageDescriptions();

        foreach ($locales as $locale) {
            $localeDescriptions = $descriptions[$locale] ?? null;

            if (! $localeDescriptions) {
                continue;
            }

            foreach ($metaItems as $meta) {
                $images = $meta->images;

                if (is_string($images)) {
                    $images = json_decode($images, true);
                }

                if (! is_array($images)) {
                    continue;
                }

                $translatedImages = $this->translateGalleryImages($images, $localeDescriptions);

                DB::table('gallery_meta_translations')->updateOrInsert(
                    [
                        'lang_code' => $locale,
                        'gallery_meta_id' => $meta->getKey(),
                    ],
                    [
                        'lang_code' => $locale,
                        'gallery_meta_id' => $meta->getKey(),
                        'images' => json_encode(
                            $translatedImages,
                            JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE
                        ),
                    ]
                );
            }
        }
    }

    protected function translateGalleryImages(array $images, array $descriptions): array
    {
        $translated = [];

        foreach ($images as $index => $image) {
            $translatedImage = $image;

            if (isset($descriptions[$index])) {
                $translatedImage['description'] = $descriptions[$index];
            }

            $translated[] = $translatedImage;
        }

        return $translated;
    }

    protected function galleryTranslations(): array
    {
        return [
            'ar' => [
                'Tech Conference 2024' => [
                    'name' => 'مؤتمر التقنية 2024',
                    'description' => 'مؤتمر تقني سنوي يضم متحدثين رئيسيين وورش عمل وفرص تواصل للمحترفين في القطاع.',
                ],
                'Product Launch Event' => [
                    'name' => 'فعالية إطلاق المنتج',
                    'description' => 'كشف حصري عن أحدث منتجاتنا مع عروض حية وجلسات أسئلة وأجوبة مع فريق التطوير.',
                ],
                'Team Building Retreat' => [
                    'name' => 'خلوة بناء الفريق',
                    'description' => 'خلوة على مستوى الشركة تركز على التعاون والابتكار وتعزيز روابط الفريق في بيئة مريحة.',
                ],
                'Innovation Summit' => [
                    'name' => 'قمة الابتكار',
                    'description' => 'قمة لمدة يومين تجمع قادة الفكر لمناقشة التقنيات الناشئة والاتجاهات المستقبلية.',
                ],
                'Developer Meetup' => [
                    'name' => 'لقاء المطورين',
                    'description' => 'تجمع شهري للمطورين لتبادل المعرفة ومناقشة أفضل الممارسات والتعاون في مشاريع المصدر المفتوح.',
                ],
                'AI Workshop Series' => [
                    'name' => 'سلسلة ورش الذكاء الاصطناعي',
                    'description' => 'ورش عمل تطبيقية تغطي تعلم الآلة والشبكات العصبية وتطبيقات الذكاء الاصطناعي العملية.',
                ],
                'Startup Showcase' => [
                    'name' => 'عرض الشركات الناشئة',
                    'description' => 'منصة للشركات الناشئة لتقديم حلولها المبتكرة للمستثمرين وخبراء القطاع.',
                ],
                'Company Anniversary' => [
                    'name' => 'ذكرى تأسيس الشركة',
                    'description' => 'احتفال برحلتنا مع الموظفين والشركاء والعملاء الذين ساهموا في نجاحنا.',
                ],
                'Hackathon Weekend' => [
                    'name' => 'عطلة نهاية الأسبوع للهاكاثون',
                    'description' => 'ماراثون برمجة لمدة 48 ساعة تتنافس فيه الفرق لبناء حلول مبتكرة لمشكلات واقعية.',
                ],
                'Industry Awards Night' => [
                    'name' => 'ليلة جوائز الصناعة',
                    'description' => 'حفل سنوي يكرّم التميز والابتكار في التكنولوجيا عبر فئات متعددة.',
                ],
                'New Office Opening' => [
                    'name' => 'افتتاح المكتب الجديد',
                    'description' => 'افتتاح كبير لمنشأتنا الحديثة المصممة لتعزيز الإبداع والتعاون.',
                ],
                'Community Outreach' => [
                    'name' => 'مبادرات المجتمع',
                    'description' => 'مبادرات تركز على رد الجميل للمجتمع عبر التعليم وبرامج إتاحة التكنولوجيا.',
                ],
                'Tech Talks Series' => [
                    'name' => 'سلسلة أحاديث التقنية',
                    'description' => 'عروض أسبوعية يقدمها خبراء الصناعة حول أحدث التقنيات وأفضل الممارسات.',
                ],
                'Partnership Celebration' => [
                    'name' => 'احتفال الشراكة',
                    'description' => 'احتفاء بالشراكات الاستراتيجية التي تدفع الابتكار والنمو المتبادل.',
                ],
                'Year in Review' => [
                    'name' => 'مراجعة العام',
                    'description' => 'استعراض سنوي يسلط الضوء على الإنجازات والمحطات الرئيسية ووضع الرؤية للمستقبل.',
                ],
            ],
            'vi' => [
                'Tech Conference 2024' => [
                    'name' => 'Hội nghị Công nghệ 2024',
                    'description' => 'Hội nghị công nghệ thường niên với các bài phát biểu chính, workshop và cơ hội kết nối dành cho chuyên gia trong ngành.',
                ],
                'Product Launch Event' => [
                    'name' => 'Sự kiện ra mắt sản phẩm',
                    'description' => 'Ra mắt độc quyền dòng sản phẩm mới nhất với trình diễn trực tiếp và phiên hỏi đáp cùng đội ngũ phát triển.',
                ],
                'Team Building Retreat' => [
                    'name' => 'Chuyến retreat xây dựng đội ngũ',
                    'description' => 'Kỳ retreat toàn công ty tập trung vào hợp tác, đổi mới và gắn kết đội ngũ trong môi trường thư giãn.',
                ],
                'Innovation Summit' => [
                    'name' => 'Hội nghị Thượng đỉnh Đổi mới',
                    'description' => 'Hội nghị kéo dài hai ngày quy tụ các nhà lãnh đạo tư tưởng để thảo luận công nghệ mới nổi và xu hướng tương lai.',
                ],
                'Developer Meetup' => [
                    'name' => 'Gặp gỡ lập trình viên',
                    'description' => 'Buổi gặp gỡ hàng tháng của lập trình viên để chia sẻ kiến thức, thảo luận thực hành tốt và hợp tác trong các dự án mã nguồn mở.',
                ],
                'AI Workshop Series' => [
                    'name' => 'Chuỗi workshop AI',
                    'description' => 'Các workshop thực hành về học máy, mạng nơ-ron và các ứng dụng AI thực tiễn.',
                ],
                'Startup Showcase' => [
                    'name' => 'Trình diễn startup',
                    'description' => 'Nền tảng để các startup mới nổi trình bày giải pháp sáng tạo trước nhà đầu tư và chuyên gia ngành.',
                ],
                'Company Anniversary' => [
                    'name' => 'Kỷ niệm công ty',
                    'description' => 'Kỷ niệm hành trình cùng nhân viên, đối tác và khách hàng đã góp phần làm nên thành công.',
                ],
                'Hackathon Weekend' => [
                    'name' => 'Cuối tuần Hackathon',
                    'description' => 'Marathon lập trình 48 giờ nơi các đội thi đấu xây dựng giải pháp sáng tạo cho các vấn đề thực tế.',
                ],
                'Industry Awards Night' => [
                    'name' => 'Đêm trao giải ngành',
                    'description' => 'Lễ trao giải thường niên tôn vinh sự xuất sắc và đổi mới trong công nghệ ở nhiều hạng mục.',
                ],
                'New Office Opening' => [
                    'name' => 'Khai trương văn phòng mới',
                    'description' => 'Khai trương cơ sở hiện đại của chúng tôi, được thiết kế để thúc đẩy sáng tạo và hợp tác.',
                ],
                'Community Outreach' => [
                    'name' => 'Hoạt động cộng đồng',
                    'description' => 'Các sáng kiến hướng tới đóng góp cho cộng đồng thông qua giáo dục và chương trình tiếp cận công nghệ.',
                ],
                'Tech Talks Series' => [
                    'name' => 'Chuỗi Tech Talks',
                    'description' => 'Các buổi trình bày hàng tuần của chuyên gia ngành về công nghệ tiên tiến và thực hành tốt.',
                ],
                'Partnership Celebration' => [
                    'name' => 'Lễ kỷ niệm hợp tác',
                    'description' => 'Kỷ niệm các mối quan hệ hợp tác chiến lược thúc đẩy đổi mới và tăng trưởng cùng có lợi.',
                ],
                'Year in Review' => [
                    'name' => 'Tổng kết năm',
                    'description' => 'Tổng kết thường niên nêu bật thành tựu, cột mốc và định hướng tầm nhìn cho tương lai.',
                ],
            ],
            'fr' => [
                'Tech Conference 2024' => [
                    'name' => 'Conférence Tech 2024',
                    'description' => 'Conférence technologique annuelle avec des keynotes, des ateliers et des opportunités de réseautage pour les professionnels du secteur.',
                ],
                'Product Launch Event' => [
                    'name' => 'Événement de lancement produit',
                    'description' => 'Présentation exclusive de notre dernière gamme de produits avec démonstrations en direct et sessions de questions-réponses avec l’équipe de développement.',
                ],
                'Team Building Retreat' => [
                    'name' => 'Retraite de cohésion d’équipe',
                    'description' => 'Retraite à l’échelle de l’entreprise axée sur la collaboration, l’innovation et le renforcement des liens d’équipe dans un cadre détendu.',
                ],
                'Innovation Summit' => [
                    'name' => 'Sommet de l’innovation',
                    'description' => 'Sommet de deux jours réunissant des leaders d’opinion pour discuter des technologies émergentes et des tendances futures.',
                ],
                'Developer Meetup' => [
                    'name' => 'Rencontre des développeurs',
                    'description' => 'Rencontre mensuelle de développeurs pour partager des connaissances, discuter des bonnes pratiques et collaborer sur des projets open source.',
                ],
                'AI Workshop Series' => [
                    'name' => 'Série d’ateliers IA',
                    'description' => 'Ateliers pratiques couvrant l’apprentissage automatique, les réseaux de neurones et les applications concrètes de l’IA.',
                ],
                'Startup Showcase' => [
                    'name' => 'Vitrine des startups',
                    'description' => 'Plateforme permettant aux startups émergentes de présenter leurs solutions innovantes aux investisseurs et aux experts du secteur.',
                ],
                'Company Anniversary' => [
                    'name' => 'Anniversaire de l’entreprise',
                    'description' => 'Célébration de notre parcours avec les employés, partenaires et clients qui ont rendu notre succès possible.',
                ],
                'Hackathon Weekend' => [
                    'name' => 'Week-end hackathon',
                    'description' => 'Marathon de programmation de 48 heures où les équipes s’affrontent pour créer des solutions innovantes à des problèmes réels.',
                ],
                'Industry Awards Night' => [
                    'name' => 'Soirée des prix de l’industrie',
                    'description' => 'Cérémonie annuelle récompensant l’excellence et l’innovation technologique dans diverses catégories.',
                ],
                'New Office Opening' => [
                    'name' => 'Inauguration du nouveau bureau',
                    'description' => 'Inauguration de notre installation ultramoderne conçue pour favoriser la créativité et la collaboration.',
                ],
                'Community Outreach' => [
                    'name' => 'Actions communautaires',
                    'description' => 'Initiatives visant à redonner à la communauté par l’éducation et des programmes d’accès à la technologie.',
                ],
                'Tech Talks Series' => [
                    'name' => 'Série Tech Talks',
                    'description' => 'Présentations hebdomadaires d’experts du secteur sur les technologies de pointe et les bonnes pratiques.',
                ],
                'Partnership Celebration' => [
                    'name' => 'Célébration du partenariat',
                    'description' => 'Commémoration de partenariats stratégiques qui stimulent l’innovation et la croissance mutuelle.',
                ],
                'Year in Review' => [
                    'name' => 'Bilan de l’année',
                    'description' => 'Rétrospective annuelle mettant en avant les réalisations, les jalons et la vision pour l’avenir.',
                ],
            ],
            'id' => [
                'Tech Conference 2024' => [
                    'name' => 'Konferensi Teknologi 2024',
                    'description' => 'Konferensi teknologi tahunan dengan pembicara utama, lokakarya, dan peluang jejaring bagi profesional industri.',
                ],
                'Product Launch Event' => [
                    'name' => 'Acara peluncuran produk',
                    'description' => 'Peluncuran eksklusif lini produk terbaru kami dengan demo langsung dan sesi tanya jawab bersama tim pengembangan.',
                ],
                'Team Building Retreat' => [
                    'name' => 'Retret pembentukan tim',
                    'description' => 'Retret tingkat perusahaan yang berfokus pada kolaborasi, inovasi, dan memperkuat ikatan tim dalam suasana santai.',
                ],
                'Innovation Summit' => [
                    'name' => 'KTT Inovasi',
                    'description' => 'KTT dua hari yang mempertemukan para pemimpin pemikiran untuk membahas teknologi baru dan tren masa depan.',
                ],
                'Developer Meetup' => [
                    'name' => 'Pertemuan pengembang',
                    'description' => 'Pertemuan bulanan para pengembang untuk berbagi pengetahuan, membahas praktik terbaik, dan berkolaborasi pada proyek sumber terbuka.',
                ],
                'AI Workshop Series' => [
                    'name' => 'Seri lokakarya AI',
                    'description' => 'Lokakarya praktik yang membahas pembelajaran mesin, jaringan saraf, dan aplikasi AI yang nyata.',
                ],
                'Startup Showcase' => [
                    'name' => 'Pameran startup',
                    'description' => 'Platform bagi startup baru untuk mempresentasikan solusi inovatif kepada investor dan pakar industri.',
                ],
                'Company Anniversary' => [
                    'name' => 'Ulang tahun perusahaan',
                    'description' => 'Merayakan perjalanan kami bersama karyawan, mitra, dan pelanggan yang membuat kesuksesan kami terwujud.',
                ],
                'Hackathon Weekend' => [
                    'name' => 'Akhir pekan hackathon',
                    'description' => 'Maraton coding 48 jam di mana tim bersaing membangun solusi inovatif untuk masalah dunia nyata.',
                ],
                'Industry Awards Night' => [
                    'name' => 'Malam penghargaan industri',
                    'description' => 'Upacara tahunan yang mengakui keunggulan dan inovasi teknologi dalam berbagai kategori.',
                ],
                'New Office Opening' => [
                    'name' => 'Pembukaan kantor baru',
                    'description' => 'Pembukaan besar fasilitas modern kami yang dirancang untuk mendorong kreativitas dan kolaborasi.',
                ],
                'Community Outreach' => [
                    'name' => 'Program komunitas',
                    'description' => 'Inisiatif yang berfokus pada memberi kembali kepada komunitas melalui pendidikan dan program akses teknologi.',
                ],
                'Tech Talks Series' => [
                    'name' => 'Seri Tech Talks',
                    'description' => 'Presentasi mingguan oleh pakar industri tentang teknologi mutakhir dan praktik terbaik.',
                ],
                'Partnership Celebration' => [
                    'name' => 'Perayaan kemitraan',
                    'description' => 'Memperingati kemitraan strategis yang mendorong inovasi dan pertumbuhan bersama.',
                ],
                'Year in Review' => [
                    'name' => 'Tinjauan akhir tahun',
                    'description' => 'Tinjauan tahunan yang menyoroti pencapaian, tonggak, dan penetapan visi untuk masa depan.',
                ],
            ],
            'tr' => [
                'Tech Conference 2024' => [
                    'name' => 'Teknoloji Konferansı 2024',
                    'description' => 'Sektör profesyonelleri için açılış konuşmaları, atölyeler ve ağ kurma fırsatları içeren yıllık teknoloji konferansı.',
                ],
                'Product Launch Event' => [
                    'name' => 'Ürün Lansman Etkinliği',
                    'description' => 'En yeni ürün serimizin özel tanıtımı; canlı demolar ve geliştirme ekibiyle soru-cevap oturumları.',
                ],
                'Team Building Retreat' => [
                    'name' => 'Takım Oluşturma Kampı',
                    'description' => 'Şirket genelinde düzenlenen, iş birliği, yenilik ve takım bağlarını rahat bir ortamda güçlendirmeye odaklanan kamp.',
                ],
                'Innovation Summit' => [
                    'name' => 'İnovasyon Zirvesi',
                    'description' => 'Gelişen teknolojileri ve gelecekteki eğilimleri tartışmak için düşünce liderlerini bir araya getiren iki günlük zirve.',
                ],
                'Developer Meetup' => [
                    'name' => 'Geliştirici Buluşması',
                    'description' => 'Bilgi paylaşmak, en iyi uygulamaları tartışmak ve açık kaynak projelerinde iş birliği yapmak için geliştiricilerin aylık buluşması.',
                ],
                'AI Workshop Series' => [
                    'name' => 'Yapay Zeka Atölye Serisi',
                    'description' => 'Makine öğrenimi, sinir ağları ve pratik AI uygulamalarını kapsayan uygulamalı atölyeler.',
                ],
                'Startup Showcase' => [
                    'name' => 'Startup Vitrini',
                    'description' => 'Yükselen startup\'ların yenilikçi çözümlerini yatırımcılar ve sektör uzmanlarına sunmaları için bir platform.',
                ],
                'Company Anniversary' => [
                    'name' => 'Şirket Yıl Dönümü',
                    'description' => 'Başarımızı mümkün kılan çalışanlar, ortaklar ve müşterilerle yolculuğumuzu kutlama.',
                ],
                'Hackathon Weekend' => [
                    'name' => 'Hackathon Haftasonu',
                    'description' => 'Takımların gerçek dünya sorunlarına yenilikçi çözümler geliştirmek için yarıştığı 48 saatlik kodlama maratonu.',
                ],
                'Industry Awards Night' => [
                    'name' => 'Sektör Ödül Gecesi',
                    'description' => 'Teknoloji alanında çeşitli kategorilerde mükemmeliyet ve inovasyonu ödüllendiren yıllık tören.',
                ],
                'New Office Opening' => [
                    'name' => 'Yeni Ofis Açılışı',
                    'description' => 'Yaratıcılığı ve iş birliğini teşvik etmek için tasarlanmış son teknoloji tesisimizin büyük açılışı.',
                ],
                'Community Outreach' => [
                    'name' => 'Topluluk Çalışmaları',
                    'description' => 'Eğitim ve teknolojiye erişim programları yoluyla topluma geri vermeye odaklanan girişimler.',
                ],
                'Tech Talks Series' => [
                    'name' => 'Teknoloji Söyleşileri Serisi',
                    'description' => 'Sektör uzmanlarının en yeni teknolojiler ve en iyi uygulamalar hakkında haftalık sunumları.',
                ],
                'Partnership Celebration' => [
                    'name' => 'Ortaklık Kutlaması',
                    'description' => 'İnovasyonu ve karşılıklı büyümeyi destekleyen stratejik ortaklıkların anısına düzenlenen kutlama.',
                ],
                'Year in Review' => [
                    'name' => 'Yılın Değerlendirmesi',
                    'description' => 'Başarıları ve dönüm noktalarını vurgulayan ve geleceğe yönelik vizyon belirleyen yıllık değerlendirme.',
                ],
            ],
        ];
    }

    protected function galleryImageDescriptions(): array
    {
        return [
            'ar' => [
                'المتحدث الرئيسي يقدم عرضًا على المسرح أمام قاعة ممتلئة',
                'تعاون الفريق خلال جلسة عمل فرعية',
                'فعالية تواصل مع محترفي الصناعة',
                'عرض المنتج في جناح المعرض',
                'نقاش حلقي مع قادة التكنولوجيا',
                'ورشة برمجة عملية قيد التنفيذ',
                'لحظة من حفل الجوائز مع الفائز على المسرح',
                'منطقة عرض وتجربة لمنتج مبتكر',
                'الفريق يحتفل بإكمال المشروع',
                'الجمهور يشارك في جلسة الأسئلة والأجوبة',
                'مشاركو الورشة يعملون على أجهزة الحاسوب المحمولة',
                'عرض تقديمي لشركة ناشئة أمام المستثمرين',
                'تنفيذيّو الشركة يقصون الشريط في الافتتاح',
                'أفراد المجتمع يتعلمون مهارات جديدة',
                'عرض تقني للميزات الجديدة',
                'الشركاء يوقعون اتفاقية تعاون',
                'الفريق يعصف بالأفكار في مساحة عمل حديثة',
                'حضور المؤتمر خلال استراحة القهوة',
                'مختبر ابتكار بأحدث التقنيات',
                'صورة جماعية في حفل الختام',
            ],
            'vi' => [
                'Diễn giả chính trình bày trên sân khấu trước khán phòng kín chỗ',
                'Nhóm hợp tác trong phiên thảo luận nhóm',
                'Sự kiện kết nối với các chuyên gia trong ngành',
                'Trình diễn sản phẩm tại gian triển lãm',
                'Thảo luận bàn tròn với các lãnh đạo công nghệ',
                'Workshop lập trình thực hành đang diễn ra',
                'Khoảnh khắc lễ trao giải với người chiến thắng trên sân khấu',
                'Khu trưng bày và demo sản phẩm sáng tạo',
                'Nhóm ăn mừng hoàn thành dự án',
                'Khán giả tham gia phiên hỏi đáp',
                'Người tham gia workshop làm việc trên laptop',
                'Bài thuyết trình gọi vốn của startup trước nhà đầu tư',
                'Lãnh đạo công ty cắt băng khai trương',
                'Thành viên cộng đồng học kỹ năng mới',
                'Trình diễn kỹ thuật các tính năng mới',
                'Đối tác ký thỏa thuận hợp tác',
                'Nhóm brainstorming trong không gian làm việc hiện đại',
                'Người tham dự hội nghị trong giờ giải lao cà phê',
                'Phòng lab đổi mới với công nghệ mới nhất',
                'Ảnh nhóm tại lễ bế mạc',
            ],
            'fr' => [
                'Discours d’ouverture sur scène devant un auditorium plein',
                'Collaboration d’équipe pendant une session en ateliers',
                'Événement de réseautage avec des professionnels du secteur',
                'Démonstration de produit sur un stand d’exposition',
                'Table ronde avec des leaders technologiques',
                'Atelier de programmation pratique en cours',
                'Moment de la cérémonie de remise des prix avec le lauréat sur scène',
                'Espace de présentation et de démonstration d’un produit innovant',
                'Équipe célébrant la fin du projet',
                'Public impliqué lors d’une session de questions-réponses',
                'Participants à l’atelier travaillant sur des ordinateurs portables',
                'Présentation d’un pitch de startup devant des investisseurs',
                'Dirigeants de l’entreprise coupant le ruban lors de l’ouverture',
                'Membres de la communauté apprenant de nouvelles compétences',
                'Démonstration technique de nouvelles fonctionnalités',
                'Partenaires signant un accord de collaboration',
                'Équipe en séance de brainstorming dans un espace de travail moderne',
                'Participants à la conférence pendant la pause café',
                'Laboratoire d’innovation avec les dernières technologies',
                'Photo de groupe lors de la cérémonie de clôture',
            ],
            'id' => [
                'Pembicara utama menyampaikan presentasi di panggung di hadapan auditorium penuh',
                'Kolaborasi tim selama sesi breakout',
                'Acara jejaring dengan para profesional industri',
                'Demo produk di stan pameran',
                'Diskusi panel dengan para pemimpin teknologi',
                'Lokakarya coding praktik sedang berlangsung',
                'Momen upacara penghargaan dengan pemenang di panggung',
                'Area pameran dan demo produk inovatif',
                'Tim merayakan penyelesaian proyek',
                'Audiens terlibat dalam sesi tanya jawab',
                'Peserta lokakarya bekerja di laptop',
                'Presentasi pitch startup kepada investor',
                'Pimpinan perusahaan memotong pita pada pembukaan',
                'Anggota komunitas mempelajari keterampilan baru',
                'Demo teknis fitur-fitur baru',
                'Mitra menandatangani perjanjian kolaborasi',
                'Tim brainstorming di ruang kerja modern',
                'Peserta konferensi saat istirahat kopi',
                'Lab inovasi dengan teknologi terbaru',
                'Foto kelompok pada upacara penutupan',
            ],
            'tr' => [
                'Açılış konuşmacısı dolu bir salonda sahnede sunum yapıyor',
                'Ara oturum sırasında ekip iş birliği',
                'Sektör profesyonelleriyle ağ kurma etkinliği',
                'Fuar standında ürün demonstrasyonu',
                'Teknoloji liderleriyle panel tartışması',
                'Uygulamalı kodlama atölyesi sürüyor',
                'Ödül töreninde kazananın sahnede olduğu an',
                'Yenilikçi ürün sergisi ve demo alanı',
                'Ekip projenin tamamlanmasını kutluyor',
                'Soru-cevap oturumuna katılan izleyiciler',
                'Atölye katılımcıları dizüstü bilgisayarlarda çalışıyor',
                'Startup sunumu yatırımcılara yapılıyor',
                'Şirket yöneticileri açılışta kurdele kesiyor',
                'Topluluk üyeleri yeni beceriler öğreniyor',
                'Yeni özelliklerin teknik gösterimi',
                'Ortaklar iş birliği anlaşmasını imzalıyor',
                'Ekip modern çalışma alanında beyin fırtınası yapıyor',
                'Konferans katılımcıları kahve molasında',
                'En son teknolojiyle inovasyon laboratuvarı',
                'Kapanış töreninde grup fotoğrafı',
            ],
        ];
    }
}
