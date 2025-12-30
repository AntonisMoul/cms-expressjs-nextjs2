<?php

namespace App\Traits;

use App\Meta;
use Illuminate\Database\Eloquent\Model;
use Inertia\Inertia;

trait InertiaShareable
{
    public function shareCategoriesButtons($searchScope)
    {
        if (isset($searchScope)) {
            Inertia::share(['activeCategories' => array_values($searchScope)]);
        }
    }

    public function shareSeo(string|null $title, string|null $description, array|null $keywords)
    {
        $seo['title'] = $title;
        $seo['description'] = $description;
        $seo['metaKeywords'] = $keywords;

        Meta::addMeta('title', $seo['title']);
        Meta::addMeta('description', $seo['description']);
        Meta::addMeta('keywords',  $seo['metaKeywords']);

        Inertia::share('seo', $seo);
    }

    public function shareSeoModel(Model $model)
    {
        $seo = set_meta($model);
        Inertia::share('seo', $seo);
    }
}
