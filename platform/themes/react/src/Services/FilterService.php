<?php

namespace Theme\React\Services;

// Ta prosthesa ego
use Botble\Event\Repositories\Interfaces\TypeInterface as TypeEventInterface;
use Botble\Business\Repositories\Interfaces\CategoryInterface as CategoryBusinessInterface;
use Botble\PointsOfInterest\Repositories\Interfaces\CategoryInterface as CategoryPOIInterface;
use Theme\React\Http\Resources\FilterCollection;
use Botble\City\Models\City;
use Botble\City\Http\Resources\CityResource;

class FilterService
{
    public function index()
    {
        // return [];
        // Ta prosthesa ego
        $data['eventType'] = new FilterCollection(app(TypeEventInterface::class)->getTypes(['id', 'name']));
        $data['businessCategory'] = new FilterCollection(app(CategoryBusinessInterface::class)->getBusinessCategories(['id', 'name'], [
            'order' => 'ASC',
        ]));
        $data['poiCategory'] = new FilterCollection(app(CategoryPOIInterface::class)->getPointsOfInterestCategories(['id', 'name'], [
            'order' => 'ASC',
        ]));
        // Prosthiki twn polewn
        $data['cities'] = CityResource::collection(
            City::with('slugable')->select(['id', 'name'])->orderBy('name')->get()
        );
        return $data;
    }

    public function homepage()
    {
        return [];
        //$data['accomodationType'] = new FilterCollection(app(TypeAccomodationInterface::class)->getTypes(['name', 'id']));
        //$data['areaType'] =  new FilterCollection(app(AreaInterface::class)->getAllAreas([], ['slugable']));
        return $data;
    }
}
