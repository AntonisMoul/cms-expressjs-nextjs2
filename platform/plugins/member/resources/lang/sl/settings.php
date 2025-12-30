<?php

return [
    'title' => 'Član',
    'description' => 'Oglejte si in posodobite nastavitve članov',
    'verify_account_email' => 'Preverite e-poštni naslov računa?',
    'verify_account_email_helper' => 'Ko je omogočeno, bo na e-poštni naslov računa poslana povezava za preverjanje, stranke morajo klikniti na to povezavo za preverjanje svojega e-poštnega naslova, preden se lahko prijavijo. Za pošiljanje e-pošte za preverjanje je treba konfigurirati e-pošto v Admin -> Nastavitve -> E-pošta.',
    'verification_expire_minutes' => 'Potek povezave za preverjanje (minute)',
    'verification_expire_minutes_helper' => 'Število minut, v katerih naj bo povezava za preverjanje e-pošte veljavna. Privzeto je 60 minut (1 ura). Največ je 10080 minut (7 dni).',
    'enabled_login' => 'Omogočite obiskovalcem prijavo?',
    'enabled_login_helper' => 'Ko je omogočeno, se lahko obiskovalci prijavijo na vašo spletno stran, če imajo račun.',
    'enabled_registration' => 'Omogočite obiskovalcem registracijo računa?',
    'enabled_registration_helper' => 'Ko je omogočeno, se lahko obiskovalci registrirajo na vaši spletni strani.',
    'enable_post_approval' => 'Omogočite odobritev objav?',
    'enable_post_approval_helper' => 'Ko je omogočeno, bodo objave, ki jih objavi agent, morale biti odobrene s strani skrbnika, preden bodo objavljene in prikazane na vaši spletni strani.',
    'default_avatar' => 'Privzeti avatar',
    'default_avatar_helper' => 'Privzeti avatar za člana, ko nima avatarja. Če ne izberete nobene slike, bo ustvarjen z uporabo vašega logotipa ali prve črke imena člana.',
    'show_terms_checkbox' => 'Prikažite potrditveno polje za pogoje in pravilnike?',
    'show_terms_checkbox_helper' => 'Ko je omogočeno, bodo morali uporabniki pred registracijo računa soglašati z vašimi pogoji in pravilnikom o zasebnosti.',
    'email' => [
        'templates' => [
            'confirm_email' => [
                'title' => 'Potrdite e-pošto',
                'description' => 'Pošljite e-pošto uporabniku, ko se registrira za račun, da preveri svoj e-poštni naslov',
                'subject' => 'Obvestilo o potrditvi e-pošte',
                'verify_link' => 'Povezava za preverjanje e-pošte',
                'member_name' => 'Ime člana',
            ],
            'password_reminder' => [
                'title' => 'Ponastavi geslo',
                'description' => 'Pošljite e-pošto uporabniku, ko zahteva ponastavitev gesla',
                'subject' => 'Ponastavi geslo',
                'reset_link' => 'Povezava za ponastavitev gesla',
            ],
            'new_pending_post' => [
                'title' => 'Nova čakajoča objava',
                'description' => 'Pošljite e-pošto skrbniku, ko je ustvarjena nova objava',
                'subject' => 'Nova objava čaka na {{ site_title }} od {{ post_author }}',
                'post_author' => 'Avtor objave',
                'post_name' => 'Ime objave',
                'post_url' => 'URL objave',
            ],
        ],
    ],
];
