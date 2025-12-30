<?php

return [
    'title' => 'Člen',
    'description' => 'Zobraziť a aktualizovať nastavenia členov',
    'verify_account_email' => 'Overiť e-mail účtu?',
    'verify_account_email_helper' => 'Keď je to povolené, overovací odkaz bude odoslaný na e-mail účtu, zákazníci musia kliknúť na tento odkaz, aby overili svoj e-mail, kým sa budú môcť prihlásiť. Je potrebné nakonfigurovať e-mail v Admin -> Nastavenia -> E-mail na odoslanie overenia e-mailu.',
    'verification_expire_minutes' => 'Vypršanie overovacieho odkazu (minúty)',
    'verification_expire_minutes_helper' => 'Počet minút, počas ktorých by mal byť overovací odkaz e-mailu považovaný za platný. Predvolené je 60 minút (1 hodina). Maximum je 10080 minút (7 dní).',
    'enabled_login' => 'Povoliť návštevníkom prihlásenie?',
    'enabled_login_helper' => 'Keď je to povolené, návštevníci sa môžu prihlásiť na váš web, ak majú účet.',
    'enabled_registration' => 'Povoliť návštevníkom registráciu účtu?',
    'enabled_registration_helper' => 'Keď je to povolené, návštevníci si môžu zaregistrovať účet na vašom webe.',
    'enable_post_approval' => 'Povoliť schvaľovanie príspevkov?',
    'enable_post_approval_helper' => 'Keď je to povolené, nehnuteľnosti, ktoré zverejní agent, budú musieť byť schválené administrátorom predtým, ako budú zverejnené a zobrazené na vašom webe.',
    'default_avatar' => 'Predvolený avatar',
    'default_avatar_helper' => 'Predvolený avatar pre člena, keď nemá avatar. Ak nevyberiete žiadny obrázok, bude vygenerovaný pomocou vášho loga alebo prvého znaku mena člena.',
    'show_terms_checkbox' => 'Zobraziť zaškrtávacie políčko Podmienky a Zásady?',
    'show_terms_checkbox_helper' => 'Keď je to povolené, používatelia budú musieť súhlasiť s vašimi Podmienkami a Zásadami ochrany osobných údajov predtým, ako si budú môcť zaregistrovať účet.',
    'email' => [
        'templates' => [
            'confirm_email' => [
                'title' => 'Potvrdiť e-mail',
                'description' => 'Odoslať e-mail používateľovi, keď si zaregistruje účet na overenie svojho e-mailu',
                'subject' => 'Oznámenie o potvrdení e-mailu',
                'verify_link' => 'Overovací odkaz e-mailu',
                'member_name' => 'Meno člena',
            ],
            'password_reminder' => [
                'title' => 'Obnovenie hesla',
                'description' => 'Odoslať e-mail používateľovi pri požiadavke na obnovenie hesla',
                'subject' => 'Obnovenie hesla',
                'reset_link' => 'Odkaz na obnovenie hesla',
            ],
            'new_pending_post' => [
                'title' => 'Nový čakajúci príspevok',
                'description' => 'Odoslať e-mail administrátorovi, keď je vytvorený nový príspevok',
                'subject' => 'Nový príspevok čaká na {{ site_title }} od {{ post_author }}',
                'post_author' => 'Autor príspevku',
                'post_name' => 'Názov príspevku',
                'post_url' => 'URL príspevku',
            ],
        ],
    ],
];
