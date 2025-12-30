<?php

return [
    'title' => 'Jäsen',
    'description' => 'Näytä ja päivitä jäsenasetukset',
    'verify_account_email' => 'Vahvista tilin sähköposti?',
    'verify_account_email_helper' => 'Kun tämä on käytössä, vahvistuslinkki lähetetään tilin sähköpostiin, asiakkaiden on napsautettava tätä linkkiä vahvistaakseen sähköpostinsa ennen kuin he voivat kirjautua sisään. Sähköpostin lähettämiseksi on määritettävä sähköposti kohdassa Ylläpito -> Asetukset -> Sähköposti.',
    'verification_expire_minutes' => 'Vahvistuslinkin voimassaoloaika (minuutit)',
    'verification_expire_minutes_helper' => 'Minuuttien määrä, jonka sähköpostin vahvistuslinkin tulisi olla voimassa. Oletus on 60 minuuttia (1 tunti). Enimmäisaika on 10080 minuuttia (7 päivää).',
    'enabled_login' => 'Salli vierailijoiden kirjautuminen?',
    'enabled_login_helper' => 'Kun tämä on käytössä, vierailijat voivat kirjautua sivustollesi, jos heillä on tili.',
    'enabled_registration' => 'Salli vierailijoiden rekisteröityä?',
    'enabled_registration_helper' => 'Kun tämä on käytössä, vierailijat voivat rekisteröidä tilin sivustollesi.',
    'enable_post_approval' => 'Ota käyttöön julkaisun hyväksyntä?',
    'enable_post_approval_helper' => 'Kun tämä on käytössä, agentin julkaisemat ominaisuudet on hyväksytettävä ylläpitäjällä ennen kuin ne julkaistaan ja näytetään sivustollasi.',
    'default_avatar' => 'Oletuskuva',
    'default_avatar_helper' => 'Jäsenen oletuskuva, kun heillä ei ole kuvaa. Jos et valitse kuvaa, se luodaan logostasi tai jäsenen nimen ensimmäisestä merkistä.',
    'show_terms_checkbox' => 'Näytä Ehdot ja käytännöt -valintaruutu?',
    'show_terms_checkbox_helper' => 'Kun tämä on käytössä, käyttäjien on hyväksyttävä Ehdot ja tietosuojakäytäntö ennen kuin he voivat rekisteröidä tilin.',
    'email' => [
        'templates' => [
            'confirm_email' => [
                'title' => 'Vahvista sähköposti',
                'description' => 'Lähetä sähköposti käyttäjälle, kun hän rekisteröi tilin vahvistaakseen sähköpostinsa',
                'subject' => 'Sähköpostin vahvistusilmoitus',
                'verify_link' => 'Vahvista sähköpostilinkki',
                'member_name' => 'Jäsenen nimi',
            ],
            'password_reminder' => [
                'title' => 'Nollaa salasana',
                'description' => 'Lähetä sähköposti käyttäjälle, kun hän pyytää salasanan nollaamista',
                'subject' => 'Nollaa salasana',
                'reset_link' => 'Nollaa salasanalinkki',
            ],
            'new_pending_post' => [
                'title' => 'Uusi odottava julkaisu',
                'description' => 'Lähetä sähköposti ylläpitäjälle, kun uusi julkaisu on luotu',
                'subject' => 'Uusi julkaisu odottaa sivustolla {{ site_title }} käyttäjältä {{ post_author }}',
                'post_author' => 'Julkaisun tekijä',
                'post_name' => 'Julkaisun nimi',
                'post_url' => 'Julkaisun URL',
            ],
        ],
    ],
];
