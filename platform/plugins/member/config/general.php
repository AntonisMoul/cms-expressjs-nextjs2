<?php

use Botble\Member\Notifications\ConfirmEmailNotification;

return [

    /*
    |--------------------------------------------------------------------------
    | Notification
    |--------------------------------------------------------------------------
    |
    | This is the notification class that will be sent to users when they receive
    | a confirmation code.
    |
    */
    'notification' => ConfirmEmailNotification::class,

    'verify_email' => env('CMS_MEMBER_VERIFY_EMAIL', false),

    /*
    |--------------------------------------------------------------------------
    | Email Verification Expiration
    |--------------------------------------------------------------------------
    |
    | This value is the number of minutes that the email verification link
    | should be considered valid. This security feature keeps verification
    | links short-lived so they may be less susceptible to being guessed
    | by malicious users.
    |
    */
    'verification_expire_minutes' => env('CMS_MEMBER_VERIFICATION_EXPIRE_MINUTES', 60),
];
