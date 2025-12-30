<?php

return [
    'title' => 'Liige',
    'description' => 'Vaata ja uuenda liikmete seadeid',
    'verify_account_email' => 'Kontrolli konto e-posti aadressi?',
    'verify_account_email_helper' => 'Kui see on lubatud, saadetakse konto e-posti aadressile kinnituslink, kliendid peavad sellel lingil klõpsama, et oma e-posti aadressi kinnitada, enne kui nad saavad sisse logida. E-posti kinnituse saatmiseks peate konfigureerima e-posti aadresse Administraator -> Seaded -> E-post.',
    'verification_expire_minutes' => 'Kinnituslingi aegumine (minutit)',
    'verification_expire_minutes_helper' => 'Minutite arv, mille jooksul e-posti kinnituslinki tuleks kehtivaks pidada. Vaikimisi on 60 minutit (1 tund). Maksimaalselt 10080 minutit (7 päeva).',
    'enabled_login' => 'Luba külastajatel sisse logida?',
    'enabled_login_helper' => 'Kui see on lubatud, saavad külastajad teie saidile sisse logida, kui neil on konto.',
    'enabled_registration' => 'Luba külastajatel kontot registreerida?',
    'enabled_registration_helper' => 'Kui see on lubatud, saavad külastajad teie saidile kontot registreerida.',
    'enable_post_approval' => 'Luba postituste kinnitamine?',
    'enable_post_approval_helper' => 'Kui see on lubatud, peavad agendi poolt postitatud postitused olema administraatori poolt kinnitatud, enne kui need avaldatakse ja teie saidil kuvatakse.',
    'default_avatar' => 'Vaikimisi avatar',
    'default_avatar_helper' => 'Vaikimisi avatar liikmele, kui tal pole avatari. Kui te ei vali ühtegi pilti, genereeritakse see teie logo või liikme nime esimese tähe abil.',
    'show_terms_checkbox' => 'Näita tingimuste ja poliitika märkeruutu?',
    'show_terms_checkbox_helper' => 'Kui see on lubatud, peavad kasutajad enne konto registreerimist nõustuma teie tingimuste ja privaatsuspoliitikaga.',
    'email' => [
        'templates' => [
            'confirm_email' => [
                'title' => 'Kinnita e-post',
                'description' => 'Saada kasutajale e-kiri, kui ta registreerib konto oma e-posti aadressi kinnitamiseks',
                'subject' => 'E-posti kinnituse teade',
                'verify_link' => 'E-posti kinnituslink',
                'member_name' => 'Liikme nimi',
            ],
            'password_reminder' => [
                'title' => 'Lähtesta parool',
                'description' => 'Saada kasutajale e-kiri, kui ta taotleb parooli lähtestamist',
                'subject' => 'Parooli lähtestamine',
                'reset_link' => 'Parooli lähtestamise link',
            ],
            'new_pending_post' => [
                'title' => 'Uus ootel postitus',
                'description' => 'Saada administraatorile e-kiri, kui luuakse uus postitus',
                'subject' => 'Uus postitus ootab {{ site_title }} saidi {{ post_author }} poolt',
                'post_author' => 'Postituse autor',
                'post_name' => 'Postituse nimi',
                'post_url' => 'Postituse URL',
            ],
        ],
    ],
];
