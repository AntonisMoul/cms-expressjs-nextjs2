<?php

return [
    'admin_menu' => [
        'title' => 'Prilagođena polja',
        'description' => 'Pregled i upravljanje prilagođenim poljima',
    ],

    'page_title' => 'Prilagođena polja',

    'all_field_groups' => 'Sve grupe polja',

    'form' => [
        'create_field_group' => 'Stvori grupu polja',
        'edit_field_group' => 'Uredi grupu polja',
        'field_items_information' => 'Informacije o stavkama polja',

        'repeater_fields' => 'Ponavljač',
        'add_field' => 'Dodaj polje',
        'remove_field' => 'Ukloni polje',
        'close_field' => 'Zatvori polje',
        'new_field' => 'Novo polje',

        'field_label' => 'Oznaka',
        'field_label_helper' => 'Ovo je naslov stavke polja. Bit će prikazan na stranicama za uređivanje.',
        'field_name' => 'Naziv polja',
        'field_name_helper' => 'Alias stavke polja. Prihvaća brojeve, znakove i podvlaku.',
        'field_type' => 'Vrsta polja',
        'field_type_helper' => 'Molimo odaberite vrstu ovog polja.',
        'field_instructions' => 'Upute za polje',
        'field_instructions_helper' => 'Upute koje pomažu korisniku da lakše zna što treba unijeti.',

        'default_value' => 'Zadana vrijednost',
        'default_value_helper' => 'Zadana vrijednost polja kada je prazno',
        'placeholder' => 'Zamjenski tekst',
        'placeholder_helper' => 'Zamjenski tekst',
        'rows' => 'Redovi',
        'rows_helper' => 'Broj redaka ovog tekstualnog područja',
        'choices' => 'Izbori',
        'choices_helper' => 'Unesite svaki izbor u novi redak.<br>Za veću kontrolu možete navesti i vrijednost i oznaku ovako:<br>red: Crvena<br>blue: Plava',
        'button_label' => 'Gumb za ponavljač',
        'date_format' => 'Format datuma',
        'date_format_helper' => 'Odaberite format prikaza za datume',
        'time_format' => 'Format vremena',
        'time_format_helper' => 'Odaberite format prikaza za vrijeme',

        'groups' => [
            'basic' => 'Osnovno',
            'content' => 'Sadržaj',
            'choice' => 'Izbori',
            'other' => 'Ostalo',
        ],

        'types' => [
            'text' => 'Tekstualno polje',
            'textarea' => 'Tekstualno područje',
            'number' => 'Broj',
            'email' => 'Email',
            'password' => 'Lozinka',
            'url' => 'URL',
            'date' => 'Birač datuma',
            'datetime' => 'Birač datuma i vremena',
            'time' => 'Birač vremena',
            'color' => 'Birač boja',
            'wysiwyg' => 'WYSIWYG uređivač',
            'image' => 'Slika',
            'file' => 'Datoteka',
            'select' => 'Odabir',
            'checkbox' => 'Potvrdni okvir',
            'radio' => 'Radio gumb',
            'repeater' => 'Ponavljač',
        ],

        'rules' => [
            'rules' => 'Pravila prikaza',
            'rules_helper' => 'Prikaži ovu grupu polja ako',
            'add_rule_group' => 'Dodaj grupu pravila',
            'is_equal_to' => 'Jednako',
            'is_not_equal_to' => 'Nije jednako',
            'and' => 'I',
            'or' => 'Ili',
        ],
    ],

    'import' => 'Uvoz',
    'export' => 'Izvoz',
    'publish' => 'Objavi',
    'remove_this_line' => 'Ukloni ovaj redak',
    'collapse_this_line' => 'Sažmi ovaj redak',
    'error_occurred' => 'Došlo je do greške',
    'request_completed' => 'Zahtjev dovršen',
    'item_not_existed' => 'Stavka ne postoji',
];
