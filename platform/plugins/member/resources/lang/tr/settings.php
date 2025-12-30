<?php

return [
    'title' => 'Üye',
    'description' => 'Üye ayarlarını görüntüle ve güncelle',
    'verify_account_email' => 'Hesap e-postasını doğrula?',
    'verify_account_email_helper' => 'Etkinleştirildiğinde, hesabın e-postasına bir doğrulama bağlantısı gönderilir, müşterilerin giriş yapmadan önce e-postalarını doğrulamak için bu bağlantıya tıklamaları gerekir. E-posta doğrulama göndermek için Yönetici -> Ayarlar -> E-posta\'da e-posta yapılandırması gerekir.',
    'verification_expire_minutes' => 'Doğrulama bağlantısı süresi (dakika)',
    'verification_expire_minutes_helper' => 'E-posta doğrulama bağlantısının geçerli kabul edilmesi gereken dakika sayısı. Varsayılan 60 dakikadır (1 saat). Maksimum 10080 dakikadır (7 gün).',
    'enabled_login' => 'Ziyaretçilerin giriş yapmasına izin ver?',
    'enabled_login_helper' => 'Etkinleştirildiğinde, hesabı olan ziyaretçiler sitenize giriş yapabilir.',
    'enabled_registration' => 'Ziyaretçilerin hesap kaydetmesine izin ver?',
    'enabled_registration_helper' => 'Etkinleştirildiğinde, ziyaretçiler sitenizde hesap kaydedebilir.',
    'enable_post_approval' => 'Gönderi onayını etkinleştir?',
    'enable_post_approval_helper' => 'Etkinleştirildiğinde, bir aracı tarafından gönderilen özellikler, sitenizde yayınlanıp görüntülenmeden önce bir yönetici tarafından onaylanması gerekir.',
    'default_avatar' => 'Varsayılan avatar',
    'default_avatar_helper' => 'Üye için avatarı olmadığında varsayılan avatar. Herhangi bir resim seçmezseniz, logonuz veya üye adının ilk karakteri kullanılarak oluşturulur.',
    'show_terms_checkbox' => 'Şartlar ve Politika onay kutusunu göster?',
    'show_terms_checkbox_helper' => 'Etkinleştirildiğinde, kullanıcıların hesap kaydetmeden önce Şartlarınızı ve Gizlilik Politikanızı kabul etmeleri gerekir.',
    'email' => [
        'templates' => [
            'confirm_email' => [
                'title' => 'E-postayı onayla',
                'description' => 'Kullanıcı hesap kaydolduğunda e-postalarını doğrulamak için e-posta gönder',
                'subject' => 'E-posta Onay Bildirimi',
                'verify_link' => 'E-posta doğrulama bağlantısı',
                'member_name' => 'Üye adı',
            ],
            'password_reminder' => [
                'title' => 'Şifre sıfırlama',
                'description' => 'Şifre sıfırlama talep edildiğinde kullanıcıya e-posta gönder',
                'subject' => 'Şifre Sıfırlama',
                'reset_link' => 'Şifre sıfırlama bağlantısı',
            ],
            'new_pending_post' => [
                'title' => 'Yeni bekleyen gönderi',
                'description' => 'Yeni bir gönderi oluşturulduğunda yöneticiye e-posta gönder',
                'subject' => '{{ site_title }} sitesinde {{ post_author }} tarafından yeni gönderi bekliyor',
                'post_author' => 'Gönderi Yazarı',
                'post_name' => 'Gönderi Adı',
                'post_url' => 'Gönderi URL\'si',
            ],
        ],
    ],
];
