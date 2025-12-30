<?php

return [
    'title' => 'Član',
    'description' => 'Pregledaj i ažuriraj postavke članova',
    'verify_account_email' => 'Potvrditi e-mail računa?',
    'verify_account_email_helper' => 'Kada je omogućeno, poveznica za potvrdu bit će poslana na e-mail računa, korisnici moraju kliknuti na ovu poveznicu kako bi potvrdili svoju e-poštu prije nego što se mogu prijaviti. Potrebno je konfigurirati e-mail u Admin -> Postavke -> E-mail za slanje potvrde e-pošte.',
    'verification_expire_minutes' => 'Istek poveznice za potvrdu (minute)',
    'verification_expire_minutes_helper' => 'Broj minuta tijekom kojih bi poveznica za potvrdu e-pošte trebala biti važeća. Zadano je 60 minuta (1 sat). Maksimum je 10080 minuta (7 dana).',
    'enabled_login' => 'Dopustiti posjetiteljima prijavu?',
    'enabled_login_helper' => 'Kada je omogućeno, posjetitelji se mogu prijaviti na vašu stranicu ako imaju račun.',
    'enabled_registration' => 'Dopustiti posjetiteljima registraciju računa?',
    'enabled_registration_helper' => 'Kada je omogućeno, posjetitelji mogu registrirati račun na vašoj stranici.',
    'enable_post_approval' => 'Omogućiti odobrenje objave?',
    'enable_post_approval_helper' => 'Kada je omogućeno, svojstva koja objavi agent morat će biti odobrena od strane administratora prije nego što se objave i prikažu na vašoj stranici.',
    'default_avatar' => 'Zadani avatar',
    'default_avatar_helper' => 'Zadani avatar za člana kada nemaju avatar. Ako ne odaberete sliku, generirat će se korištenjem vašeg logotipa ili prvog znaka imena člana.',
    'show_terms_checkbox' => 'Prikaži potvrdni okvir za Uvjete i Politiku?',
    'show_terms_checkbox_helper' => 'Kada je omogućeno, korisnici će morati pristati na vaše Uvjete i Politiku privatnosti prije nego što mogu registrirati račun.',
    'email' => [
        'templates' => [
            'confirm_email' => [
                'title' => 'Potvrdi e-mail',
                'description' => 'Pošalji e-mail korisniku kada registrira račun kako bi potvrdio svoju e-poštu',
                'subject' => 'Obavijest o potvrdi e-pošte',
                'verify_link' => 'Potvrdi vezu e-pošte',
                'member_name' => 'Ime člana',
            ],
            'password_reminder' => [
                'title' => 'Resetuj lozinku',
                'description' => 'Pošalji e-mail korisniku kada zatraži resetovanje lozinke',
                'subject' => 'Resetuj lozinku',
                'reset_link' => 'Veza za resetovanje lozinke',
            ],
            'new_pending_post' => [
                'title' => 'Nova objava na čekanju',
                'description' => 'Pošalji e-mail administratoru kada se kreira nova objava',
                'subject' => 'Nova objava čeka na {{ site_title }} od {{ post_author }}',
                'post_author' => 'Autor objave',
                'post_name' => 'Naziv objave',
                'post_url' => 'URL objave',
            ],
        ],
    ],
];
