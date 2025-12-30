<?php

return [
    'title' => 'Biedrs',
    'description' => 'Skatīt un atjaunināt biedru iestatījumus',
    'verify_account_email' => 'Verificēt konta e-pastu?',
    'verify_account_email_helper' => 'Kad tas ir iespējots, verificēšanas saite tiks nosūtīta uz konta e-pastu, klientiem ir jānoklikšķina uz šīs saites, lai verificētu savu e-pastu, pirms viņi var pieteikties. Jākonfigurē e-pasts sadaļā Admin -> Iestatījumi -> E-pasts, lai nosūtītu e-pasta verificēšanu.',
    'verification_expire_minutes' => 'Verificēšanas saites derīguma termiņš (minūtes)',
    'verification_expire_minutes_helper' => 'Minūšu skaits, kurā e-pasta verificēšanas saitei jābūt derīgai. Noklusējums ir 60 minūtes (1 stunda). Maksimums ir 10080 minūtes (7 dienas).',
    'enabled_login' => 'Atļaut apmeklētājiem pieteikties?',
    'enabled_login_helper' => 'Kad tas ir iespējots, apmeklētāji var pieteikties jūsu vietnē, ja viņiem ir konts.',
    'enabled_registration' => 'Atļaut apmeklētājiem reģistrēt kontu?',
    'enabled_registration_helper' => 'Kad tas ir iespējots, apmeklētāji var reģistrēt kontu jūsu vietnē.',
    'enable_post_approval' => 'Iespējot ierakstu apstiprināšanu?',
    'enable_post_approval_helper' => 'Kad tas ir iespējots, īpašumi, ko publicējis aģents, būs jāapstiprina administratoram, pirms tie tiek publicēti un parādīti jūsu vietnē.',
    'default_avatar' => 'Noklusējuma avatārs',
    'default_avatar_helper' => 'Noklusējuma avatārs biedram, kad viņiem nav avatāra. Ja neatlasāt nevienu attēlu, tas tiks ģenerēts, izmantojot jūsu logotipu vai pirmo biedra vārda rakstzīmi.',
    'show_terms_checkbox' => 'Rādīt noteikumu un politikas izvēles rūtiņu?',
    'show_terms_checkbox_helper' => 'Kad tas ir iespējots, lietotājiem būs jāpiekrīt jūsu noteikumiem un privātuma politikai, pirms viņi var reģistrēt kontu.',
    'email' => [
        'templates' => [
            'confirm_email' => [
                'title' => 'Apstiprināt e-pastu',
                'description' => 'Nosūtīt e-pastu lietotājam, kad viņš reģistrē kontu, lai verificētu savu e-pastu',
                'subject' => 'E-pasta apstiprināšanas paziņojums',
                'verify_link' => 'E-pasta verificēšanas saite',
                'member_name' => 'Biedra vārds',
            ],
            'password_reminder' => [
                'title' => 'Atiestatīt paroli',
                'description' => 'Nosūtīt e-pastu lietotājam, kad pieprasa paroles atiestatīšanu',
                'subject' => 'Paroles atiestatīšana',
                'reset_link' => 'Paroles atiestatīšanas saite',
            ],
            'new_pending_post' => [
                'title' => 'Jauns gaidošs ieraksts',
                'description' => 'Nosūtīt e-pastu administratoram, kad tiek izveidots jauns ieraksts',
                'subject' => 'Jauns ieraksts gaida apstiprināšanu {{ site_title }} no {{ post_author }}',
                'post_author' => 'Ieraksta autors',
                'post_name' => 'Ieraksta nosaukums',
                'post_url' => 'Ieraksta URL',
            ],
        ],
    ],
];
