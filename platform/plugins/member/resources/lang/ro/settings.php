<?php

return [
    'title' => 'Membru',
    'description' => 'Vizualizați și actualizați setările membrilor',
    'verify_account_email' => 'Verificați e-mailul contului?',
    'verify_account_email_helper' => 'Când este activat, un link de verificare va fi trimis la e-mailul contului, clienții trebuie să facă clic pe acest link pentru a-și verifica e-mailul înainte de a se putea autentifica. Trebuie să configurați e-mailul în Admin -> Setări -> E-mail pentru a trimite verificarea e-mailului.',
    'verification_expire_minutes' => 'Expirarea linkului de verificare (minute)',
    'verification_expire_minutes_helper' => 'Numărul de minute în care linkul de verificare a e-mailului ar trebui să fie considerat valid. Implicit este 60 de minute (1 oră). Maximum este 10080 de minute (7 zile).',
    'enabled_login' => 'Permiteți vizitatorilor să se autentifice?',
    'enabled_login_helper' => 'Când este activat, vizitatorii se pot autentifica pe site-ul dvs. dacă au un cont.',
    'enabled_registration' => 'Permiteți vizitatorilor să înregistreze un cont?',
    'enabled_registration_helper' => 'Când este activat, vizitatorii pot înregistra un cont pe site-ul dvs.',
    'enable_post_approval' => 'Activați aprobarea postărilor?',
    'enable_post_approval_helper' => 'Când este activat, proprietățile postate de un agent vor trebui să fie aprobate de un administrator înainte de a fi publicate și afișate pe site-ul dvs.',
    'default_avatar' => 'Avatar implicit',
    'default_avatar_helper' => 'Avatar implicit pentru membru când nu au un avatar. Dacă nu selectați nicio imagine, aceasta va fi generată folosind logo-ul dvs. sau primul caracter al numelui membrului.',
    'show_terms_checkbox' => 'Afișați caseta de bifat pentru Termeni și Politică?',
    'show_terms_checkbox_helper' => 'Când este activat, utilizatorii vor trebui să fie de acord cu Termenii și Politica de Confidențialitate înainte de a putea înregistra un cont.',
    'email' => [
        'templates' => [
            'confirm_email' => [
                'title' => 'Confirmă e-mailul',
                'description' => 'Trimiteți e-mail utilizatorului când își înregistrează un cont pentru a-și verifica e-mailul',
                'subject' => 'Notificare de confirmare e-mail',
                'verify_link' => 'Link de verificare e-mail',
                'member_name' => 'Numele membrului',
            ],
            'password_reminder' => [
                'title' => 'Resetare parolă',
                'description' => 'Trimiteți e-mail utilizatorului când solicită resetarea parolei',
                'subject' => 'Resetare parolă',
                'reset_link' => 'Link de resetare parolă',
            ],
            'new_pending_post' => [
                'title' => 'Postare nouă în așteptare',
                'description' => 'Trimiteți e-mail administratorului când este creată o postare nouă',
                'subject' => 'Postare nouă în așteptare pe {{ site_title }} de către {{ post_author }}',
                'post_author' => 'Autor postare',
                'post_name' => 'Nume postare',
                'post_url' => 'URL postare',
            ],
        ],
    ],
];
