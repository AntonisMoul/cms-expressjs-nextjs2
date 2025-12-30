<?php

return [
    'admin_menu' => [
        'title' => 'Özel Alanlar',
        'description' => 'Özel Alanları görüntüle ve yönet',
    ],

    'page_title' => 'Özel Alanlar',

    'all_field_groups' => 'Tüm alan grupları',

    'form' => [
        'create_field_group' => 'Alan grubu oluştur',
        'edit_field_group' => 'Alan grubunu düzenle',
        'field_items_information' => 'Alan öğesi bilgileri',

        'repeater_fields' => 'Tekrarlayıcı',
        'add_field' => 'Alan ekle',
        'remove_field' => 'Alanı kaldır',
        'close_field' => 'Alanı kapat',
        'new_field' => 'Yeni alan',

        'field_label' => 'Etiket',
        'field_label_helper' => 'Bu, alan öğesinin başlığıdır. Düzenleme sayfalarında gösterilecektir.',
        'field_name' => 'Alan adı',
        'field_name_helper' => 'Alan öğesinin takma adı. Sayılar, karakterler ve alt çizgi kabul edilir.',
        'field_type' => 'Alan türü',
        'field_type_helper' => 'Lütfen bu alanın türünü seçin.',
        'field_instructions' => 'Alan talimatları',
        'field_instructions_helper' => 'Kullanıcının ne girmesi gerektiğini daha kolay bilmesi için talimatlar kılavuzu.',

        'default_value' => 'Varsayılan değer',
        'default_value_helper' => 'Boş bırakıldığında alanın varsayılan değeri',
        'placeholder' => 'Yer tutucu',
        'placeholder_helper' => 'Yer tutucu metni',
        'rows' => 'Satırlar',
        'rows_helper' => 'Bu metin alanının satırları',
        'choices' => 'Seçenekler',
        'choices_helper' => 'Her seçeneği yeni bir satıra girin.<br>Daha fazla kontrol için, hem değeri hem de etiketi şu şekilde belirtebilirsiniz:<br>red: Kırmızı<br>blue: Mavi',
        'button_label' => 'Tekrarlayıcı için düğme',
        'date_format' => 'Tarih biçimi',
        'date_format_helper' => 'Tarihler için görüntüleme biçimini seçin',
        'time_format' => 'Saat biçimi',
        'time_format_helper' => 'Saat için görüntüleme biçimini seçin',

        'groups' => [
            'basic' => 'Temel',
            'content' => 'İçerik',
            'choice' => 'Seçenekler',
            'other' => 'Diğer',
        ],

        'types' => [
            'text' => 'Metin alanı',
            'textarea' => 'Metin alanı',
            'number' => 'Sayı',
            'email' => 'E-posta',
            'password' => 'Şifre',
            'url' => 'URL',
            'date' => 'Tarih seçici',
            'datetime' => 'Tarih ve saat seçici',
            'time' => 'Saat seçici',
            'color' => 'Renk seçici',
            'wysiwyg' => 'WYSIWYG editörü',
            'image' => 'Resim',
            'file' => 'Dosya',
            'select' => 'Seç',
            'checkbox' => 'Onay kutusu',
            'radio' => 'Radyo düğmesi',
            'repeater' => 'Tekrarlayıcı',
        ],

        'rules' => [
            'rules' => 'Görüntüleme kuralları',
            'rules_helper' => 'Bu alan grubunu göster eğer',
            'add_rule_group' => 'Kural grubu ekle',
            'is_equal_to' => 'Eşittir',
            'is_not_equal_to' => 'Eşit değildir',
            'and' => 'Ve',
            'or' => 'Veya',
        ],
    ],

    'import' => 'İçe aktar',
    'export' => 'Dışa aktar',
    'publish' => 'Yayınla',
    'remove_this_line' => 'Bu satırı kaldır',
    'collapse_this_line' => 'Bu satırı daralt',
    'error_occurred' => 'Hata oluştu',
    'request_completed' => 'İstek tamamlandı',
    'item_not_existed' => 'Öğe mevcut değil',
];
