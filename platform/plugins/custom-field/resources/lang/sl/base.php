<?php

return [
    'admin_menu' => [
        'title' => 'Polja po meri',
        'description' => 'Ogled in upravljanje polj po meri',
    ],

    'page_title' => 'Polja po meri',

    'all_field_groups' => 'Vse skupine polj',

    'form' => [
        'create_field_group' => 'Ustvari skupino polj',
        'edit_field_group' => 'Uredi skupino polj',
        'field_items_information' => 'Informacije o elementih polj',

        'repeater_fields' => 'Ponavljalec',
        'add_field' => 'Dodaj polje',
        'remove_field' => 'Odstrani polje',
        'close_field' => 'Zapri polje',
        'new_field' => 'Novo polje',

        'field_label' => 'Oznaka',
        'field_label_helper' => 'To je naslov elementa polja. Prikazan bo na straneh za urejanje.',
        'field_name' => 'Ime polja',
        'field_name_helper' => 'Vzdevek elementa polja. Sprejeta so števila, znaki in podčrtaji.',
        'field_type' => 'Vrsta polja',
        'field_type_helper' => 'Prosimo, izberite vrsto tega polja.',
        'field_instructions' => 'Navodila za polje',
        'field_instructions_helper' => 'Navodila, ki uporabniku pomagajo lažje razumeti, kaj mora vnesti.',

        'default_value' => 'Privzeta vrednost',
        'default_value_helper' => 'Privzeta vrednost polja, če ostane prazno',
        'placeholder' => 'Nadomestno besedilo',
        'placeholder_helper' => 'Nadomestno besedilo',
        'rows' => 'Vrstice',
        'rows_helper' => 'Število vrstic tega besedilnega območja',
        'choices' => 'Izbire',
        'choices_helper' => 'Vnesite vsako izbiro v novo vrstico.<br>Za več nadzora lahko določite vrednost in oznako takole:<br>rdeca: Rdeča<br>modra: Modra',
        'button_label' => 'Gumb za ponavljalec',
        'date_format' => 'Format datuma',
        'date_format_helper' => 'Izberite format prikaza datuma',
        'time_format' => 'Format časa',
        'time_format_helper' => 'Izberite format prikaza časa',

        'groups' => [
            'basic' => 'Osnovno',
            'content' => 'Vsebina',
            'choice' => 'Izbire',
            'other' => 'Ostalo',
        ],

        'types' => [
            'text' => 'Besedilno polje',
            'textarea' => 'Besedilno območje',
            'number' => 'Številka',
            'email' => 'E-pošta',
            'password' => 'Geslo',
            'url' => 'URL',
            'date' => 'Izbirnik datuma',
            'datetime' => 'Izbirnik datuma in časa',
            'time' => 'Izbirnik časa',
            'color' => 'Izbirnik barv',
            'wysiwyg' => 'WYSIWYG urejevalnik',
            'image' => 'Slika',
            'file' => 'Datoteka',
            'select' => 'Izbira',
            'checkbox' => 'Potrditveno polje',
            'radio' => 'Izbirni gumb',
            'repeater' => 'Ponavljalec',
        ],

        'rules' => [
            'rules' => 'Pravila prikaza',
            'rules_helper' => 'Prikaži to skupino polj, če',
            'add_rule_group' => 'Dodaj skupino pravil',
            'is_equal_to' => 'Enako kot',
            'is_not_equal_to' => 'Ni enako kot',
            'and' => 'In',
            'or' => 'Ali',
        ],
    ],

    'import' => 'Uvozi',
    'export' => 'Izvozi',
    'publish' => 'Objavi',
    'remove_this_line' => 'Odstrani to vrstico',
    'collapse_this_line' => 'Strni to vrstico',
    'error_occurred' => 'Prišlo je do napake',
    'request_completed' => 'Zahteva dokončana',
    'item_not_existed' => 'Element ne obstaja',
];
