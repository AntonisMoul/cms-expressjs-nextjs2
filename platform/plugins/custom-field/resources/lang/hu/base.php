<?php

return [
    'admin_menu' => [
        'title' => 'Egyéni mezők',
        'description' => 'Egyéni mezők megtekintése és kezelése',
    ],

    'page_title' => 'Egyéni mezők',

    'all_field_groups' => 'Összes mezőcsoport',

    'form' => [
        'create_field_group' => 'Mezőcsoport létrehozása',
        'edit_field_group' => 'Mezőcsoport szerkesztése',
        'field_items_information' => 'Mezőelemek információi',

        'repeater_fields' => 'Ismétlő',
        'add_field' => 'Mező hozzáadása',
        'remove_field' => 'Mező eltávolítása',
        'close_field' => 'Mező bezárása',
        'new_field' => 'Új mező',

        'field_label' => 'Címke',
        'field_label_helper' => 'Ez a mezőelem címe. A szerkesztési oldalakon fog megjelenni.',
        'field_name' => 'Mező neve',
        'field_name_helper' => 'A mezőelem álneve. Számokat, karaktereket és aláhúzást fogad el.',
        'field_type' => 'Mező típusa',
        'field_type_helper' => 'Kérjük, válassza ki ennek a mezőnek a típusát.',
        'field_instructions' => 'Mező utasításai',
        'field_instructions_helper' => 'Az utasítások segítenek a felhasználónak könnyebben megérteni, mit kell megadnia.',

        'default_value' => 'Alapértelmezett érték',
        'default_value_helper' => 'A mező alapértelmezett értéke, ha üresen hagyja',
        'placeholder' => 'Helyőrző',
        'placeholder_helper' => 'Helyőrző szöveg',
        'rows' => 'Sorok',
        'rows_helper' => 'Ennek a szövegterületnek a sorai',
        'choices' => 'Választások',
        'choices_helper' => 'Írja be minden választást új sorba.<br>Több szabályozáshoz megadhat értéket és címkét is így:<br>piros: Piros<br>kék: Kék',
        'button_label' => 'Gomb az ismétlőhöz',
        'date_format' => 'Dátumformátum',
        'date_format_helper' => 'Válassza ki a dátumok megjelenítési formátumát',
        'time_format' => 'Időformátum',
        'time_format_helper' => 'Válassza ki az idő megjelenítési formátumát',

        'groups' => [
            'basic' => 'Alap',
            'content' => 'Tartalom',
            'choice' => 'Választások',
            'other' => 'Egyéb',
        ],

        'types' => [
            'text' => 'Szövegmező',
            'textarea' => 'Szövegterület',
            'number' => 'Szám',
            'email' => 'Email',
            'password' => 'Jelszó',
            'url' => 'URL',
            'date' => 'Dátumválasztó',
            'datetime' => 'Dátum és idő választó',
            'time' => 'Időválasztó',
            'color' => 'Színválasztó',
            'wysiwyg' => 'WYSIWYG szerkesztő',
            'image' => 'Kép',
            'file' => 'Fájl',
            'select' => 'Választó',
            'checkbox' => 'Jelölőnégyzet',
            'radio' => 'Rádió',
            'repeater' => 'Ismétlő',
        ],

        'rules' => [
            'rules' => 'Megjelenítési szabályok',
            'rules_helper' => 'Mezőcsoport megjelenítése, ha',
            'add_rule_group' => 'Szabálycsoport hozzáadása',
            'is_equal_to' => 'Egyenlő',
            'is_not_equal_to' => 'Nem egyenlő',
            'and' => 'És',
            'or' => 'Vagy',
        ],
    ],

    'import' => 'Importálás',
    'export' => 'Exportálás',
    'publish' => 'Közzététel',
    'remove_this_line' => 'Sor eltávolítása',
    'collapse_this_line' => 'Sor összecsukása',
    'error_occurred' => 'Hiba történt',
    'request_completed' => 'Kérés teljesítve',
    'item_not_existed' => 'Az elem nem létezik',
];
