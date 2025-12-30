<?php

return [
    'title' => 'Medlem',
    'description' => 'Vis og oppdater medlemsinnstillinger',
    'verify_account_email' => 'Bekreft kontoens e-post?',
    'verify_account_email_helper' => 'Når det er aktivert, vil en bekreftelseslenke bli sendt til kontoens e-post, kunder må klikke på denne lenken for å bekrefte e-posten sin før de kan logge inn. Må konfigurere e-post i Admin -> Innstillinger -> E-post for å sende e-postbekreftelse.',
    'verification_expire_minutes' => 'Utløpstid for bekreftelseslenke (minutter)',
    'verification_expire_minutes_helper' => 'Antall minutter som e-postbekreftelseslenken skal anses som gyldig. Standard er 60 minutter (1 time). Maksimum er 10080 minutter (7 dager).',
    'enabled_login' => 'Tillat besøkende å logge inn?',
    'enabled_login_helper' => 'Når det er aktivert, kan besøkende logge inn på nettstedet ditt hvis de har en konto.',
    'enabled_registration' => 'Tillat besøkende å registrere konto?',
    'enabled_registration_helper' => 'Når det er aktivert, kan besøkende registrere en konto på nettstedet ditt.',
    'enable_post_approval' => 'Aktiver godkjenning av innlegg?',
    'enable_post_approval_helper' => 'Når det er aktivert, må eiendommer som publiseres av en agent godkjennes av en administrator før de publiseres og vises på nettstedet ditt.',
    'default_avatar' => 'Standard avatar',
    'default_avatar_helper' => 'Standard avatar for medlem når de ikke har en avatar. Hvis du ikke velger noe bilde, vil det bli generert ved hjelp av logoen din eller den første tegnet i medlemsnavnet.',
    'show_terms_checkbox' => 'Vis avmerkingsboks for vilkår og retningslinjer?',
    'show_terms_checkbox_helper' => 'Når det er aktivert, må brukere godta dine vilkår og personvernerklæring før de kan registrere en konto.',
    'email' => [
        'templates' => [
            'confirm_email' => [
                'title' => 'Bekreft e-post',
                'description' => 'Send e-post til bruker når de registrerer en konto for å bekrefte e-posten sin',
                'subject' => 'E-postbekreftelse',
                'verify_link' => 'Lenke for e-postbekreftelse',
                'member_name' => 'Medlemsnavn',
            ],
            'password_reminder' => [
                'title' => 'Tilbakestill passord',
                'description' => 'Send e-post til bruker ved forespørsel om tilbakestilling av passord',
                'subject' => 'Tilbakestill passord',
                'reset_link' => 'Lenke for tilbakestilling av passord',
            ],
            'new_pending_post' => [
                'title' => 'Nytt ventende innlegg',
                'description' => 'Send e-post til administrator når et nytt innlegg opprettes',
                'subject' => 'Nytt innlegg venter på {{ site_title }} av {{ post_author }}',
                'post_author' => 'Innleggsforfatter',
                'post_name' => 'Innleggsnavn',
                'post_url' => 'Innleggs-URL',
            ],
        ],
    ],
];
