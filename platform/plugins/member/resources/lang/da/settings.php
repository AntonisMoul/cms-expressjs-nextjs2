<?php

return [
    'title' => 'Medlem',
    'description' => 'Vis og opdater medlemsindstillinger',
    'verify_account_email' => 'Bekræft kontoens e-mail?',
    'verify_account_email_helper' => 'Når det er aktiveret, sendes et bekræftelseslink til kontoens e-mail, kunder skal klikke på dette link for at bekræfte deres e-mail, før de kan logge ind. Du skal konfigurere e-mail i Admin -> Indstillinger -> E-mail for at sende e-mailbekræftelse.',
    'verification_expire_minutes' => 'Udløb af bekræftelseslink (minutter)',
    'verification_expire_minutes_helper' => 'Antallet af minutter, som e-mailbekræftelseslinket skal betragtes som gyldigt. Standard er 60 minutter (1 time). Maksimum er 10080 minutter (7 dage).',
    'enabled_login' => 'Tillad besøgende at logge ind?',
    'enabled_login_helper' => 'Når det er aktiveret, kan besøgende logge ind på din side, hvis de har en konto.',
    'enabled_registration' => 'Tillad besøgende at registrere konto?',
    'enabled_registration_helper' => 'Når det er aktiveret, kan besøgende registrere en konto på din side.',
    'enable_post_approval' => 'Aktiver godkendelse af indlæg?',
    'enable_post_approval_helper' => 'Når det er aktiveret, skal ejendomme, der er opslået af en agent, godkendes af en administrator, før de offentliggøres og vises på din side.',
    'default_avatar' => 'Standard avatar',
    'default_avatar_helper' => 'Standard avatar for medlem, når de ikke har en avatar. Hvis du ikke vælger et billede, genereres det ved hjælp af dit logo eller det første tegn i medlemmets navn.',
    'show_terms_checkbox' => 'Vis afkrydsningsfelt for Vilkår og Politik?',
    'show_terms_checkbox_helper' => 'Når det er aktiveret, skal brugerne acceptere dine Vilkår og Privatlivspolitik, før de kan registrere en konto.',
    'email' => [
        'templates' => [
            'confirm_email' => [
                'title' => 'Bekræft e-mail',
                'description' => 'Send e-mail til bruger, når de registrerer en konto for at bekræfte deres e-mail',
                'subject' => 'Bekræftelse af e-mail-meddelelse',
                'verify_link' => 'Bekræft e-mail link',
                'member_name' => 'Medlemsnavn',
            ],
            'password_reminder' => [
                'title' => 'Nulstil adgangskode',
                'description' => 'Send e-mail til bruger, når de anmoder om nulstilling af adgangskode',
                'subject' => 'Nulstil adgangskode',
                'reset_link' => 'Nulstil adgangskode link',
            ],
            'new_pending_post' => [
                'title' => 'Nyt afventende indlæg',
                'description' => 'Send e-mail til administrator, når et nyt indlæg er oprettet',
                'subject' => 'Nyt indlæg afventer på {{ site_title }} af {{ post_author }}',
                'post_author' => 'Indlægsforfatter',
                'post_name' => 'Indlægsnavn',
                'post_url' => 'Indlægs-URL',
            ],
        ],
    ],
];
