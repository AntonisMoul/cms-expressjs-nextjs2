<?php

namespace Theme\React\Services;

use Botble\Blog\Models\Post;
use Botble\Blog\Models\Category;
use Botble\Blog\Models\Tag;
use Illuminate\Database\Eloquent\Builder;

class SearchServiceBlog
{
    public function buildQueryWithCategoryAndTagSlugs(
        array $categorySlugs = [],
        array $tagSlugs = [],
        ?string $keyword = null
    ): Builder {
        $query = Post::query()->wherePublished()->with('slugable');

        // Filter by category slugs
        if (!empty($categorySlugs)) {
            $query->whereHas('categories', function ($categoryQuery) use ($categorySlugs) {
                $categoryQuery->whereHas('slugable', function ($slugableQuery) use ($categorySlugs) {
                    $slugableQuery
                        ->whereIn('key', $categorySlugs)
                        ->where('reference_type', Category::class);
                });
            });
        }

        // Filter by tag slugs
        if (!empty($tagSlugs)) {
            $query->whereHas('tags', function ($tagQuery) use ($tagSlugs) {
                $tagQuery->whereHas('slugable', function ($slugableQuery) use ($tagSlugs) {
                    $slugableQuery
                        ->whereIn('key', $tagSlugs)
                        ->where('reference_type', Tag::class);
                });
            });
        }

        // Search keyword
        if ($keyword) {
            $query = $this->search($query, $keyword);
        }

        return $query;
    }

    /**
     * Search function for keyword filtering
     */
    protected function search(Builder $query, string $keyword): Builder
    {
        return $query->where(function ($q) use ($keyword) {
            $q->where('name', 'LIKE', '%' . $keyword . '%')
              ->orWhere('description', 'LIKE', '%' . $keyword . '%');
        });
    }
}
