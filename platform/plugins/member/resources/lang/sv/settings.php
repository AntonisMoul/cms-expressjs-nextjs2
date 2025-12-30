<?php

return [
    'title' => 'Medlem',
    'description' => 'Visa och uppdatera medlemsinställningar',
    'verify_account_email' => 'Verifiera kontots e-postadress?',
    'verify_account_email_helper' => 'När det är aktiverat skickas en verifieringslänk till kontots e-postadress, kunder måste klicka på denna länk för att verifiera sin e-postadress innan de kan logga in. Du behöver konfigurera e-post i Admin -> Inställningar -> E-post för att skicka e-postverifiering.',
    'verification_expire_minutes' => 'Verifieringslänkens utgångstid (minuter)',
    'verification_expire_minutes_helper' => 'Antalet minuter som e-postverifieringslänken ska anses giltig. Standard är 60 minuter (1 timme). Max är 10080 minuter (7 dagar).',
    'enabled_login' => 'Tillåt besökare att logga in?',
    'enabled_login_helper' => 'När det är aktiverat kan besökare logga in på din webbplats om de har ett konto.',
    'enabled_registration' => 'Tillåt besökare att registrera konto?',
    'enabled_registration_helper' => 'När det är aktiverat kan besökare registrera ett konto på din webbplats.',
    'enable_post_approval' => 'Aktivera godkännande av inlägg?',
    'enable_post_approval_helper' => 'När det är aktiverat måste inlägg som publiceras av en agent godkännas av en administratör innan de publiceras och visas på din webbplats.',
    'default_avatar' => 'Standardavatar',
    'default_avatar_helper' => 'Standardavatar för medlem när de inte har en avatar. Om du inte väljer någon bild kommer den att genereras med din logotyp eller det första tecknet i medlemsnamnet.',
    'show_terms_checkbox' => 'Visa kryssruta för villkor och policy?',
    'show_terms_checkbox_helper' => 'När det är aktiverat måste användarna godkänna dina villkor och sekretesspolicy innan de kan registrera ett konto.',
    'email' => [
        'templates' => [
            'confirm_email' => [
                'title' => 'Bekräfta e-post',
                'description' => 'Skicka e-post till användaren när de registrerar ett konto för att verifiera sin e-postadress',
                'subject' => 'Bekräfta e-postmeddelande',
                'verify_link' => 'Verifiera e-postlänk',
                'member_name' => 'Medlemsnamn',
            ],
            'password_reminder' => [
                'title' => 'Återställ lösenord',
                'description' => 'Skicka e-post till användaren när de begär återställning av lösenord',
                'subject' => 'Återställ lösenord',
                'reset_link' => 'Återställ lösenordslänk',
            ],
            'new_pending_post' => [
                'title' => 'Nytt väntande inlägg',
                'description' => 'Skicka e-post till administratören när ett nytt inlägg skapas',
                'subject' => 'Nytt inlägg väntar på {{ site_title }} av {{ post_author }}',
                'post_author' => 'Inläggsförfattare',
                'post_name' => 'Inläggsnamn',
                'post_url' => 'Inläggs-URL',
            ],
        ],
    ],
];
