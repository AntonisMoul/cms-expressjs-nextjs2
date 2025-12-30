<?php

namespace Theme\React\Services;

use Botble\Base\Http\Resources\API\RecommendedCollection;
use Botble\Base\Http\Resources\SearchableCollection;
use Botble\Business\Models\Business;
use Botble\Event\Models\Event;
use Carbon\Carbon;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
// Ta prosthesa ego
use Botble\PointsOfInterest\Models\PointsOfInterest;
use Botble\Ads\Models\Ads;
use Botble\City\Models\City;
use Botble\Business\Models\Category as BusinessCategory;
use Botble\Wishlist\Models\Wish;

class SearchService
{
    protected $businessQuery;
    protected $eventQuery;
    protected $poiQuery;
    protected $adsQuery;

    public function __construct()
    {
        $this->businessQuery = null;
        $this->eventQuery = null;
        $this->poiQuery = null;
        $this->adsQuery = null;
    }
    public function index(array $filters)
    {

        // Ta allaksa ego
        $typeSelected = isset($filters['business_categories']) || isset($filters['event_types']) || isset($filters['poi_categories']);
        $scopesSelected = isset($filters['searchScope']);
        $searchScopes = [];
        
        //if scope selected, query scopes
        if ($scopesSelected) {
            $searchScopes = (array) ($filters['searchScope'] ?? []);
            if (in_array('Business', $searchScopes)) {
                $this->businessQuery = Business::SearchByScope($filters, 'business_categories');
            }
            if (in_array('Event', $searchScopes)) {
                $this->eventQuery = Event::SearchByScope($filters, 'event_types');
            }
            if (in_array(strtolower('PointsOfInterest'), array_map('strtolower', $searchScopes))) {
                $this->poiQuery = PointsOfInterest::SearchByScope($filters, 'poi_categories');
            }
            if (in_array('JobSearch', $searchScopes)) {
               
                $this->adsQuery = Ads::query()
                    // To prosthesa ego
                    ->wherePublished()
                    ->business($filters)
                    ->with(['business', 'business.categories', 'business.city']);
            }
        }

        //if at least 1 type selected query types
        if ($typeSelected) {
            if (isset($filters['business_categories']) && !(count($searchScopes) === 1 && in_array('JobSearch', $searchScopes))) {
                $this->businessQuery = Business::searchByCategory($filters, 'business_categories');
                
                /*$this->adsQuery = Ads::query()
                ->business($filters)
                ->with(['business', 'business.categories', 'business.city']);*/
            }
            if (isset($filters['event_types'])) {
                $this->eventQuery = Event::searchByType($filters, 'event_types');
            }
            if (isset($filters['poi_categories'])) {
                $this->poiQuery = PointsOfInterest::searchByCategory($filters, 'poi_categories');
            }
        }

        // Ta prosthesa ego
        // Special case: Only event_from and/or event_to provided => return only Events
        $onlyEventDateFilter = isset($filters['event_from']) || isset($filters['event_to']);
        $noOtherFilters = !$typeSelected && !$scopesSelected && !isset($filters['name']);

        if ($onlyEventDateFilter && $noOtherFilters) {
            $this->eventQuery = Event::applyBasicFilters($filters);

            // Apply the date filtering immediately
            $startDate = isset($filters['event_from'])
                ? Carbon::createFromFormat('Y-m-d', $filters['event_from'])->startOfDay()
                : null;

            $endDate = isset($filters['event_to'])
                ? Carbon::createFromFormat('Y-m-d', $filters['event_to'])->endOfDay()
                : null;

            if ($startDate) {
                $this->eventQuery->whereDate('start_date', '>=', $startDate);
            }

            if ($endDate) {
                $this->eventQuery->whereDate('end_date', '<=', $endDate);
            }

            $collection = $this->mergeCollections();
            return new SearchableCollection($this->paginateItems($collection));
        }

        // Apply date filters on eventQuery if set
        if (isset($this->eventQuery)) {
            if (isset($filters['event_from'])) {
                $startDate = Carbon::createFromFormat('Y-m-d', $filters['event_from'])->startOfDay();
                $this->eventQuery->whereDate('start_date', '>=', $startDate);
            }
            if (isset($filters['event_to'])) {
                $endDate = Carbon::createFromFormat('Y-m-d', $filters['event_to'])->endOfDay();
                $this->eventQuery->whereDate('end_date', '<=', $endDate);
            }
        }

        //neither type or scope, initialize all queries
        if (!$typeSelected && !$scopesSelected) {
            $this->businessQuery = Business::applyBasicFilters($filters);
            $this->eventQuery = Event::applyBasicFilters($filters);
            $this->poiQuery = PointsOfInterest::applyBasicFilters($filters);
            
        }


        if (isset($filters['name'])) {

            if (isset($this->businessQuery)) {
                $this->businessQuery = $this->businessQuery->withTranslationSearch($filters);
            }

            if (isset($this->eventQuery))
                $this->eventQuery = $this->eventQuery->withTranslationSearch($filters);

            if (isset($this->poiQuery))
                $this->poiQuery = $this->poiQuery->withTranslationSearch($filters);
            
            if (isset($this->adsQuery))
                $this->adsQuery = $this->adsQuery->withTranslationSearch($filters);
        }

        $collection = $this->mergeCollections();
        return new SearchableCollection($this->paginateItems($collection));
    }

    protected function paginateItems($items)
    {
        // Get all query parameters from the request
        $queryParameters = request()->query();

        $currentPage = LengthAwarePaginator::resolveCurrentPage();
        $perPage = isset($queryParameters['per_page']) ? $queryParameters['per_page'] : 16;
        $currentPageItems = $items->slice(($currentPage - 1) * $perPage, $perPage)->values();
        // Manually create a new paginator instance with the formatted results
        $results = new LengthAwarePaginator(
            $currentPageItems,
            count($items),
            $perPage,
            $currentPage
        );


        // Set the current URL and append query parameters for the paginator
        $results->setPath(request()->url())->appends($queryParameters);
        return $results;
    }


    public function searchWishlist(array $filters)
    {
        $searchScopes = $filters['searchScope'] ?? [];
        $typeSelected = isset($filters['business_categories']) || isset($filters['event_types']) || isset($filters['poi_categories']);


        $user = Auth::guard('member')->user() ?? request()->user('sanctum');
        $wishlist =  Wish::query()->where('member_id',$user?->id);
        $wishlistResults = collect();
       
        if(!$typeSelected && empty($searchScopes)){
           
            return $wishlist->get()
                ->map(fn($wishlist) => $wishlist->wishlistable);;
        }

        if (!empty($searchScopes)) {
            
            $shortNames = collect($searchScopes)
            ->map(fn($name) => $this->findClassByBasename($name))
            ->filter()
            ->all();;
            
            $wishlistScope = (clone $wishlist)->whereHasMorph('wishlistable', $shortNames);
            $wishlistScope = $wishlistScope->get();
       
            $wishlistResults = $wishlistResults->concat($wishlistScope);

        }
        

     
        if ($typeSelected) {
           
            if (isset($filters['business_categories']) && !(count($searchScopes) === 1 && in_array('JobSearch', $searchScopes))) {
                $filterss = $filters['business_categories'];

                $wishlistBusinessCategories = (clone $wishlist)->whereHas('wishlistable', function ($wishlistableQuery) use ($filterss) {

                    $wishlistableQuery->when(method_exists($wishlistableQuery->getModel(),'categories'),function($query) use($filterss){
                       
                        $query->whereHas('categories', function($categoryQuery) use($filterss){
                            $categoryQuery->whereHas('slugable', function ($slugableQuery) use ($filterss) {
                                $slugableQuery->whereIn('key', $filterss);
                            });
                        });
                    });
                                           
                });

                //dd($wishlist->get());
                $wishlistBusinessCategories = $wishlistBusinessCategories->get();
                $wishlistResults = $wishlistResults->concat($wishlistBusinessCategories);

                /*$wishlist = $wishlist->whereHasMorph('wishlistable', [Business::class], function ($query) {
                    if (method_exists($query->getModel(), 'categories')) {
                        $query->whereHas('categories');
                    }
                });*/


            }
            
        }

        
        
        /*return $wishlist->get()
        ->map(fn($wishlist) => $wishlist->wishlistable);;*/

        return $wishlistResults
            ->map(fn($wishlist) => $wishlist->wishlistable);
    }

    public function searchEntities(array $filters)
    {
        $scopesSelected = isset($filters['searchScope']);

        if (!$scopesSelected) {
            $this->businessQuery = Business::query()->wherePublished();
            $this->eventQuery = Event::query()->wherePublished();
            $this->poiQuery = PointsOfInterest::query()->wherePublished();
        } else {
            $searchScopes = (array) ($filters['searchScope'] ?? []);


            if (in_array('Business', $searchScopes)) {
                $this->businessQuery = Business::query()->wherePublished();
            }
            if (in_array('Event', $searchScopes)) {

                $this->eventQuery = Event::query()->wherePublished();
            }
            if (in_array('PointsOfInterest', $searchScopes)) {
                $this->poiQuery = PointsOfInterest::query()->wherePublished();
            }
            if (in_array('JobSearch', $searchScopes)) {
                $this->adsQuery = Ads::query()->wherePublished()->with(['business', 'business.categories', 'business.city']);
            }
        }

        $filters = $filters ?? [];


        if (!isset($filters['name'])) {
            return [];
        }

        //apply translation
        if (isset($this->businessQuery)) {
            $this->businessQuery = $this->businessQuery->withTranslationSearch($filters);
        }

        if (isset($this->eventQuery))
            $this->eventQuery = $this->eventQuery->withTranslationSearch($filters);

        if (isset($this->poiQuery))
            $this->poiQuery = $this->poiQuery->withTranslationSearch($filters);

        if (isset($this->adsQuery))
            $this->adsQuery = $this->adsQuery->withTranslationSearch($filters);

        $collection = $this->mergeCollections();
      
        return $collection;
    }


    protected function mergeCollections()
    {
        $businessCollection = isset($this->businessQuery) ? $this->businessQuery->get() : collect();
        $eventCollection = isset($this->eventQuery) ? $this->eventQuery->get() : collect();
        $poiCollection = isset($this->poiQuery) ? $this->poiQuery->get() : collect();
        $adsCollection = isset($this->adsQuery) ? $this->adsQuery->get() : collect();

        $mergedCollection = $businessCollection
            ->concat($eventCollection)
            ->concat($poiCollection)
            ->concat($adsCollection);

        return $mergedCollection;
    }

    protected function findClassByBasename($basename)
    {
        if($basename == 'Event'){
            return 'Botble\Event\Models\Event';
        }

        foreach (get_declared_classes() as $class) {

            if (class_basename($class) === $basename) {
                return $class;
            }
        }
        return null;
    }
    
}
