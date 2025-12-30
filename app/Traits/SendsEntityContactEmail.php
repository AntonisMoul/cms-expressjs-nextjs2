<?php

namespace App\Traits;

use Botble\Contact\Notifications\EntityContactNotification;
use Illuminate\Support\Facades\Notification;
use Botble\ACL\Models\User;

trait SendsEntityContactEmail
{
    public function sendEntityContactEmail($entity, array $data)
    {
        $locale = app()->getLocale() ?? 'el';

        // Stelnoume sthn entity email
        if (!empty($entity->email)) {
            Notification::route('mail', $entity->email)
                ->notify(new EntityContactNotification($locale, $data, $entity));
        }

        // Stelnoume kai ston idiokthth an yparxei
        if (isset($entity->user) && !empty($entity->user->email)) {
            Notification::route('mail', $entity->user->email)
                ->notify(new EntityContactNotification($locale, $data, $entity));
        } else {
            // An den yparxei idiokthths, stelnoume se super user
            $superUser = User::query()->where('super_user', 1)->first();

            if ($superUser && $superUser->email) {
                Notification::route('mail', $superUser->email)
                    ->notify(new EntityContactNotification($locale, $data, $entity));
            }
        }
    }
}
