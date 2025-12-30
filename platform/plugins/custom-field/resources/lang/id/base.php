<?php

return [
    'admin_menu' => [
        'title' => 'Bidang Kustom',
        'description' => 'Lihat dan kelola Bidang Kustom',
    ],

    'page_title' => 'Bidang Kustom',

    'all_field_groups' => 'Semua grup bidang',

    'form' => [
        'create_field_group' => 'Buat grup bidang',
        'edit_field_group' => 'Edit grup bidang',
        'field_items_information' => 'Informasi item bidang',

        'repeater_fields' => 'Pengulang',
        'add_field' => 'Tambah bidang',
        'remove_field' => 'Hapus bidang',
        'close_field' => 'Tutup bidang',
        'new_field' => 'Bidang baru',

        'field_label' => 'Label',
        'field_label_helper' => 'Ini adalah judul item bidang. Akan ditampilkan di halaman edit.',
        'field_name' => 'Nama bidang',
        'field_name_helper' => 'Alias item bidang. Menerima angka, karakter, dan garis bawah.',
        'field_type' => 'Jenis bidang',
        'field_type_helper' => 'Silakan pilih jenis bidang ini.',
        'field_instructions' => 'Instruksi bidang',
        'field_instructions_helper' => 'Panduan instruksi agar pengguna lebih mudah mengetahui apa yang perlu diinput.',

        'default_value' => 'Nilai default',
        'default_value_helper' => 'Nilai default bidang ketika dibiarkan kosong',
        'placeholder' => 'Placeholder',
        'placeholder_helper' => 'Teks placeholder',
        'rows' => 'Baris',
        'rows_helper' => 'Jumlah baris textarea ini',
        'choices' => 'Pilihan',
        'choices_helper' => 'Masukkan setiap pilihan pada baris baru.<br>Untuk kontrol lebih lanjut, Anda dapat menentukan nilai dan label seperti ini:<br>red: Merah<br>blue: Biru',
        'button_label' => 'Tombol untuk pengulang',
        'date_format' => 'Format tanggal',
        'date_format_helper' => 'Pilih format tampilan untuk tanggal',
        'time_format' => 'Format waktu',
        'time_format_helper' => 'Pilih format tampilan untuk waktu',

        'groups' => [
            'basic' => 'Dasar',
            'content' => 'Konten',
            'choice' => 'Pilihan',
            'other' => 'Lainnya',
        ],

        'types' => [
            'text' => 'Bidang teks',
            'textarea' => 'Area teks',
            'number' => 'Angka',
            'email' => 'Email',
            'password' => 'Kata sandi',
            'url' => 'URL',
            'date' => 'Pemilih tanggal',
            'datetime' => 'Pemilih tanggal & waktu',
            'time' => 'Pemilih waktu',
            'color' => 'Pemilih warna',
            'wysiwyg' => 'Editor WYSIWYG',
            'image' => 'Gambar',
            'file' => 'File',
            'select' => 'Pilih',
            'checkbox' => 'Kotak centang',
            'radio' => 'Radio',
            'repeater' => 'Pengulang',
        ],

        'rules' => [
            'rules' => 'Aturan tampilan',
            'rules_helper' => 'Tampilkan grup bidang ini jika',
            'add_rule_group' => 'Tambah grup aturan',
            'is_equal_to' => 'Sama dengan',
            'is_not_equal_to' => 'Tidak sama dengan',
            'and' => 'Dan',
            'or' => 'Atau',
        ],
    ],

    'import' => 'Impor',
    'export' => 'Ekspor',
    'publish' => 'Publikasikan',
    'remove_this_line' => 'Hapus baris ini',
    'collapse_this_line' => 'Ciutkan baris ini',
    'error_occurred' => 'Terjadi kesalahan',
    'request_completed' => 'Permintaan selesai',
    'item_not_existed' => 'Item tidak ada',
];
