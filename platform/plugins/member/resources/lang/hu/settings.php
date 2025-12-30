<?php

return [
    'title' => 'Tag',
    'description' => 'Tag beállítások megtekintése és frissítése',
    'verify_account_email' => 'Fiók e-mail címének ellenőrzése?',
    'verify_account_email_helper' => 'Ha ez engedélyezve van, egy ellenőrző linket küldünk a fiók e-mail címére, az ügyfeleknek rá kell kattintaniuk erre a linkre, hogy ellenőrizzék e-mail címüket, mielőtt bejelentkezhetnek. Az e-mail ellenőrzés küldéséhez konfigurálnia kell az e-mailt az Admin -> Beállítások -> E-mail menüpontban.',
    'verification_expire_minutes' => 'Ellenőrző link lejárata (perc)',
    'verification_expire_minutes_helper' => 'A percek száma, ameddig az e-mail ellenőrző linket érvényesnek kell tekinteni. Az alapértelmezett 60 perc (1 óra). A maximum 10080 perc (7 nap).',
    'enabled_login' => 'Engedélyezi a látogatók bejelentkezését?',
    'enabled_login_helper' => 'Ha ez engedélyezve van, a látogatók bejelentkezhetnek az oldalára, ha rendelkeznek fiókkal.',
    'enabled_registration' => 'Engedélyezi a látogatók regisztrációját?',
    'enabled_registration_helper' => 'Ha ez engedélyezve van, a látogatók regisztrálhatnak fiókot az oldalán.',
    'enable_post_approval' => 'Bejegyzés jóváhagyás engedélyezése?',
    'enable_post_approval_helper' => 'Ha ez engedélyezve van, az ügynök által közzétett tulajdonságokat jóvá kell hagynia egy adminisztrátornak, mielőtt közzétennék és megjelennének az oldalán.',
    'default_avatar' => 'Alapértelmezett avatar',
    'default_avatar_helper' => 'Alapértelmezett avatar a tagnak, ha nincs avatarja. Ha nem választ ki képet, akkor a logójából vagy a tag nevének első betűjéből fog generálódni.',
    'show_terms_checkbox' => 'Feltételek és Szabályzat jelölőnégyzet megjelenítése?',
    'show_terms_checkbox_helper' => 'Ha ez engedélyezve van, a felhasználóknak el kell fogadniuk a Feltételeket és Adatvédelmi Szabályzatot, mielőtt regisztrálhatnak fiókot.',
    'email' => [
        'templates' => [
            'confirm_email' => [
                'title' => 'E-mail megerősítése',
                'description' => 'E-mail küldése a felhasználónak, amikor regisztrál egy fiókot, hogy ellenőrizze e-mail címét',
                'subject' => 'E-mail megerősítési értesítés',
                'verify_link' => 'E-mail ellenőrző link',
                'member_name' => 'Tag neve',
            ],
            'password_reminder' => [
                'title' => 'Jelszó visszaállítása',
                'description' => 'E-mail küldése a felhasználónak, amikor jelszó-visszaállítást kér',
                'subject' => 'Jelszó visszaállítása',
                'reset_link' => 'Jelszó-visszaállító link',
            ],
            'new_pending_post' => [
                'title' => 'Új függőben lévő bejegyzés',
                'description' => 'E-mail küldése az adminisztrátornak, amikor új bejegyzés jön létre',
                'subject' => 'Új bejegyzés várakozik a {{ site_title }} oldalon {{ post_author }} által',
                'post_author' => 'Bejegyzés szerzője',
                'post_name' => 'Bejegyzés neve',
                'post_url' => 'Bejegyzés URL',
            ],
        ],
    ],
];
