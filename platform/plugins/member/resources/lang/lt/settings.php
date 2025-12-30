<?php

return [
    'title' => 'Narys',
    'description' => 'Peržiūrėti ir atnaujinti narių nustatymus',
    'verify_account_email' => 'Patvirtinti paskyros el. paštą?',
    'verify_account_email_helper' => 'Kai įjungta, patvirtinimo nuoroda bus išsiųsta į paskyros el. paštą, klientai turi spustelėti šią nuorodą, kad patvirtintų savo el. paštą prieš prisijungdami. Reikia sukonfigūruoti el. paštą Administratorius -> Nustatymai -> El. paštas, kad būtų išsiųstas el. pašto patvirtinimas.',
    'verification_expire_minutes' => 'Patvirtinimo nuorodos galiojimo laikas (minutės)',
    'verification_expire_minutes_helper' => 'Minučių skaičius, kurį el. pašto patvirtinimo nuoroda turėtų būti laikoma galiojančia. Numatytasis yra 60 minučių (1 valanda). Maksimalus yra 10080 minučių (7 dienos).',
    'enabled_login' => 'Leisti lankytojams prisijungti?',
    'enabled_login_helper' => 'Kai įjungta, lankytojai gali prisijungti prie jūsų svetainės, jei turi paskyrą.',
    'enabled_registration' => 'Leisti lankytojams registruoti paskyrą?',
    'enabled_registration_helper' => 'Kai įjungta, lankytojai gali užsiregistruoti paskyrą jūsų svetainėje.',
    'enable_post_approval' => 'Įjungti įrašų patvirtinimą?',
    'enable_post_approval_helper' => 'Kai įjungta, agento paskelbti objektai turės būti patvirtinti administratoriaus prieš juos paskelbus ir rodant jūsų svetainėje.',
    'default_avatar' => 'Numatytasis avataras',
    'default_avatar_helper' => 'Numatytasis nario avataras, kai jie neturi avataro. Jei nepasirinksite jokio vaizdo, jis bus sugeneruotas naudojant jūsų logotipą arba pirmąjį nario vardo simbolį.',
    'show_terms_checkbox' => 'Rodyti sąlygų ir politikos žymimąjį laukelį?',
    'show_terms_checkbox_helper' => 'Kai įjungta, vartotojai turės sutikti su jūsų sąlygomis ir privatumo politika, kad galėtų užsiregistruoti paskyrą.',
    'email' => [
        'templates' => [
            'confirm_email' => [
                'title' => 'Patvirtinti el. paštą',
                'description' => 'Siųsti el. laišką vartotojui, kai jis užsiregistruoja paskyrą, kad patvirtintų savo el. paštą',
                'subject' => 'El. pašto patvirtinimo pranešimas',
                'verify_link' => 'El. pašto patvirtinimo nuoroda',
                'member_name' => 'Nario vardas',
            ],
            'password_reminder' => [
                'title' => 'Slaptažodžio atstatymas',
                'description' => 'Siųsti el. laišką vartotojui, kai prašoma iš naujo nustatyti slaptažodį',
                'subject' => 'Slaptažodžio atstatymas',
                'reset_link' => 'Slaptažodžio atstatymo nuoroda',
            ],
            'new_pending_post' => [
                'title' => 'Naujas laukiantis įrašas',
                'description' => 'Siųsti el. laišką administratoriui, kai sukuriamas naujas įrašas',
                'subject' => 'Naujas įrašas laukia {{ site_title }} svetainėje, autorius {{ post_author }}',
                'post_author' => 'Įrašo autorius',
                'post_name' => 'Įrašo pavadinimas',
                'post_url' => 'Įrašo URL',
            ],
        ],
    ],
];
