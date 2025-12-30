<?php

return [
    'title' => 'Člen',
    'description' => 'Zobrazit a aktualizovat nastavení členů',
    'verify_account_email' => 'Ověřit e-mail účtu?',
    'verify_account_email_helper' => 'Když je tato funkce povolena, bude na e-mail účtu odeslán ověřovací odkaz, zákazníci musí kliknout na tento odkaz pro ověření svého e-mailu, než se budou moci přihlásit. Pro odeslání ověřovacího e-mailu je nutné nakonfigurovat e-mail v Administrace -> Nastavení -> E-mail.',
    'verification_expire_minutes' => 'Platnost ověřovacího odkazu (minuty)',
    'verification_expire_minutes_helper' => 'Počet minut, během kterých by měl být ověřovací odkaz e-mailu považován za platný. Výchozí hodnota je 60 minut (1 hodina). Maximum je 10080 minut (7 dní).',
    'enabled_login' => 'Povolit návštěvníkům přihlášení?',
    'enabled_login_helper' => 'Když je tato funkce povolena, návštěvníci se mohou přihlásit na vaše stránky, pokud mají účet.',
    'enabled_registration' => 'Povolit návštěvníkům registraci účtu?',
    'enabled_registration_helper' => 'Když je tato funkce povolena, návštěvníci se mohou zaregistrovat na vašich stránkách.',
    'enable_post_approval' => 'Povolit schvalování příspěvků?',
    'enable_post_approval_helper' => 'Když je tato funkce povolena, vlastnosti zveřejněné agentem budou muset být před zveřejněním a zobrazením na vašich stránkách schváleny správcem.',
    'default_avatar' => 'Výchozí avatar',
    'default_avatar_helper' => 'Výchozí avatar pro člena, když nemá avatar. Pokud nevyberete žádný obrázek, bude vygenerován pomocí vašeho loga nebo prvního znaku jména člena.',
    'show_terms_checkbox' => 'Zobrazit zaškrtávací políčko Podmínky a zásady?',
    'show_terms_checkbox_helper' => 'Když je tato funkce povolena, uživatelé budou muset souhlasit s vašimi Podmínkami a Zásadami ochrany osobních údajů, než si budou moci zaregistrovat účet.',
    'email' => [
        'templates' => [
            'confirm_email' => [
                'title' => 'Potvrdit e-mail',
                'description' => 'Odeslat e-mail uživateli při registraci účtu pro ověření jejich e-mailu',
                'subject' => 'Oznámení o potvrzení e-mailu',
                'verify_link' => 'Odkaz pro ověření e-mailu',
                'member_name' => 'Jméno člena',
            ],
            'password_reminder' => [
                'title' => 'Obnovit heslo',
                'description' => 'Odeslat e-mail uživateli při požadavku na obnovení hesla',
                'subject' => 'Obnovení hesla',
                'reset_link' => 'Odkaz pro obnovení hesla',
            ],
            'new_pending_post' => [
                'title' => 'Nový čekající příspěvek',
                'description' => 'Odeslat e-mail správci při vytvoření nového příspěvku',
                'subject' => 'Nový příspěvek čeká na {{ site_title }} od {{ post_author }}',
                'post_author' => 'Autor příspěvku',
                'post_name' => 'Název příspěvku',
                'post_url' => 'URL příspěvku',
            ],
        ],
    ],
];
