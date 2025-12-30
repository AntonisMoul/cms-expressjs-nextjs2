<?php

return [
    'title' => 'Anggota',
    'description' => 'Lihat dan perbarui pengaturan anggota',
    'verify_account_email' => 'Verifikasi email akun?',
    'verify_account_email_helper' => 'Ketika diaktifkan, tautan verifikasi akan dikirim ke email akun, pelanggan perlu mengklik tautan ini untuk memverifikasi email mereka sebelum mereka dapat masuk. Perlu mengonfigurasi email di Admin -> Pengaturan -> Email untuk mengirim verifikasi email.',
    'verification_expire_minutes' => 'Kedaluwarsa tautan verifikasi (menit)',
    'verification_expire_minutes_helper' => 'Jumlah menit tautan verifikasi email harus dianggap valid. Default adalah 60 menit (1 jam). Maksimum adalah 10080 menit (7 hari).',
    'enabled_login' => 'Izinkan pengunjung untuk masuk?',
    'enabled_login_helper' => 'Ketika diaktifkan, pengunjung dapat masuk ke situs Anda jika mereka memiliki akun.',
    'enabled_registration' => 'Izinkan pengunjung untuk mendaftar akun?',
    'enabled_registration_helper' => 'Ketika diaktifkan, pengunjung dapat mendaftar akun di situs Anda.',
    'enable_post_approval' => 'Aktifkan persetujuan posting?',
    'enable_post_approval_helper' => 'Ketika diaktifkan, properti yang diposting oleh agen perlu disetujui oleh admin sebelum dipublikasikan dan ditampilkan di situs Anda.',
    'default_avatar' => 'Avatar default',
    'default_avatar_helper' => 'Avatar default untuk anggota ketika mereka tidak memiliki avatar. Jika Anda tidak memilih gambar apa pun, gambar akan dibuat menggunakan logo Anda atau karakter pertama dari nama anggota.',
    'show_terms_checkbox' => 'Tampilkan kotak centang Ketentuan dan Kebijakan?',
    'show_terms_checkbox_helper' => 'Ketika diaktifkan, pengguna perlu menyetujui Ketentuan dan Kebijakan Privasi Anda sebelum mereka dapat mendaftar akun.',
    'email' => [
        'templates' => [
            'confirm_email' => [
                'title' => 'Konfirmasi email',
                'description' => 'Kirim email ke pengguna saat mereka mendaftar akun untuk memverifikasi email mereka',
                'subject' => 'Pemberitahuan Konfirmasi Email',
                'verify_link' => 'Tautan verifikasi email',
                'member_name' => 'Nama anggota',
            ],
            'password_reminder' => [
                'title' => 'Setel ulang kata sandi',
                'description' => 'Kirim email ke pengguna saat meminta setel ulang kata sandi',
                'subject' => 'Setel Ulang Kata Sandi',
                'reset_link' => 'Tautan setel ulang kata sandi',
            ],
            'new_pending_post' => [
                'title' => 'Posting baru yang tertunda',
                'description' => 'Kirim email ke admin saat posting baru dibuat',
                'subject' => 'Posting baru tertunda di {{ site_title }} oleh {{ post_author }}',
                'post_author' => 'Penulis Posting',
                'post_name' => 'Nama Posting',
                'post_url' => 'URL Posting',
            ],
        ],
    ],
];
