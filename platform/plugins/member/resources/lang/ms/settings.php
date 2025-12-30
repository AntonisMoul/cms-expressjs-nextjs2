<?php

return [
    'title' => 'Ahli',
    'description' => 'Lihat dan kemas kini tetapan ahli',
    'verify_account_email' => 'Sahkan e-mel akaun?',
    'verify_account_email_helper' => 'Apabila didayakan, pautan pengesahan akan dihantar ke e-mel akaun, pelanggan perlu klik pada pautan ini untuk mengesahkan e-mel mereka sebelum mereka boleh log masuk. Perlu konfigurasikan e-mel di Admin -> Tetapan -> E-mel untuk menghantar pengesahan e-mel.',
    'verification_expire_minutes' => 'Tempoh tamat pautan pengesahan (minit)',
    'verification_expire_minutes_helper' => 'Bilangan minit yang pautan pengesahan e-mel harus dianggap sah. Lalai adalah 60 minit (1 jam). Maksimum adalah 10080 minit (7 hari).',
    'enabled_login' => 'Benarkan pelawat log masuk?',
    'enabled_login_helper' => 'Apabila didayakan, pelawat boleh log masuk ke tapak anda jika mereka mempunyai akaun.',
    'enabled_registration' => 'Benarkan pelawat mendaftar akaun?',
    'enabled_registration_helper' => 'Apabila didayakan, pelawat boleh mendaftar akaun di tapak anda.',
    'enable_post_approval' => 'Dayakan kelulusan siaran?',
    'enable_post_approval_helper' => 'Apabila didayakan, hartanah yang disiarkan oleh ejen perlu diluluskan oleh pentadbir sebelum ia diterbitkan dan dipaparkan di tapak anda.',
    'default_avatar' => 'Avatar lalai',
    'default_avatar_helper' => 'Avatar lalai untuk ahli apabila mereka tidak mempunyai avatar. Jika anda tidak memilih sebarang imej, ia akan dijana menggunakan logo anda atau aksara pertama nama ahli.',
    'show_terms_checkbox' => 'Tunjukkan kotak semak Terma dan Dasar?',
    'show_terms_checkbox_helper' => 'Apabila didayakan, pengguna perlu bersetuju dengan Terma dan Dasar Privasi anda sebelum mereka boleh mendaftar akaun.',
    'email' => [
        'templates' => [
            'confirm_email' => [
                'title' => 'Sahkan e-mel',
                'description' => 'Hantar e-mel kepada pengguna apabila mereka mendaftar akaun untuk mengesahkan e-mel mereka',
                'subject' => 'Pemberitahuan Pengesahan E-mel',
                'verify_link' => 'Pautan pengesahan e-mel',
                'member_name' => 'Nama ahli',
            ],
            'password_reminder' => [
                'title' => 'Set semula kata laluan',
                'description' => 'Hantar e-mel kepada pengguna apabila meminta set semula kata laluan',
                'subject' => 'Set Semula Kata Laluan',
                'reset_link' => 'Pautan set semula kata laluan',
            ],
            'new_pending_post' => [
                'title' => 'Siaran baharu tertangguh',
                'description' => 'Hantar e-mel kepada pentadbir apabila siaran baharu dicipta',
                'subject' => 'Siaran baharu tertangguh di {{ site_title }} oleh {{ post_author }}',
                'post_author' => 'Pengarang Siaran',
                'post_name' => 'Nama Siaran',
                'post_url' => 'URL Siaran',
            ],
        ],
    ],
];
