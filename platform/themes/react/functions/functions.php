<?php

use Botble\Base\Forms\FormAbstract;
use Botble\Base\Rules\MediaImageRule;
use Botble\Event\Forms\EventForm;
use Botble\Menu\Repositories\Interfaces\MenuInterface;
use Botble\Base\Enums\BaseStatusEnum;
use Botble\Theme\Supports\ThemeSupport;
use Botble\Base\Forms\Fields\MediaImageField;
use Botble\Base\Forms\FieldOptions\MediaImageFieldOption;
use Botble\Event\Models\Event;


register_page_template([
    'default' => 'Default',
]);

register_sidebar([
    'id'          => 'second_sidebar',
    'name'        => 'Second sidebar',
    'description' => 'This is a sample sidebar for react theme',
]);

RvMedia::setUploadPathAndURLToPublic();
ThemeSupport::registerSiteCopyright();
ThemeSupport::registerSocialLinks();


FormAbstract::extend(function (FormAbstract $form): void {
    $model = $form->getModel();

    $availableModels = ['event'];

    if(!in_array($model instanceof Event,$availableModels)){
        return;
    }
//    if (! $model instanceof Post && ! $model instanceof Page) {
//        return;
//    }

    $form
        ->addAfter(
            'image',
            'banner_image',
            MediaImageField::class,
            MediaImageFieldOption::make()->label(__('Banner image (1920x170px)'))->metadata()->toArray()
        );
}, 124);

FormAbstract::afterSaving(function (FormAbstract $form): void {
    $availableModels = ['event'];
    $model = $form->getModel();

    if(!in_array($model instanceof Event,$availableModels)){
        return;
    }



    $request = $form->getRequest();

    $request->validate([
        'banner_image_input' => ['nullable', new MediaImageRule()],
    ]);

    $form->getModel()->saveMetaDataFromFormRequest('banner_image', $request);
}, 175);


