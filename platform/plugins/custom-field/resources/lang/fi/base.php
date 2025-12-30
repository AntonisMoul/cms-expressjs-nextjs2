<?php

return [
    'admin_menu' => [
        'title' => 'Mukautetut kentät',
        'description' => 'Näytä ja hallinnoi mukautettuja kenttiä',
    ],

    'page_title' => 'Mukautetut kentät',

    'all_field_groups' => 'Kaikki kenttäryhmät',

    'form' => [
        'create_field_group' => 'Luo kenttäryhmä',
        'edit_field_group' => 'Muokkaa kenttäryhmää',
        'field_items_information' => 'Kenttäkohteiden tiedot',

        'repeater_fields' => 'Toistaja',
        'add_field' => 'Lisää kenttä',
        'remove_field' => 'Poista kenttä',
        'close_field' => 'Sulje kenttä',
        'new_field' => 'Uusi kenttä',

        'field_label' => 'Otsikko',
        'field_label_helper' => 'Tämä on kenttäkohteen otsikko. Se näytetään muokkaussivuilla.',
        'field_name' => 'Kentän nimi',
        'field_name_helper' => 'Kenttäkohteen alias. Hyväksyy numerot, merkit ja alaviivan.',
        'field_type' => 'Kentän tyyppi',
        'field_type_helper' => 'Valitse tämän kentän tyyppi.',
        'field_instructions' => 'Kentän ohjeet',
        'field_instructions_helper' => 'Ohjeet, jotka auttavat käyttäjää ymmärtämään, mitä syöttää.',

        'default_value' => 'Oletusarvo',
        'default_value_helper' => 'Kentän oletusarvo, kun se jätetään tyhjäksi',
        'placeholder' => 'Paikkamerkki',
        'placeholder_helper' => 'Paikkamerkkiteksti',
        'rows' => 'Rivit',
        'rows_helper' => 'Tämän tekstialueen rivien määrä',
        'choices' => 'Valinnat',
        'choices_helper' => 'Syötä jokainen valinta uudelle riville.<br>Tarkempaa hallintaa varten voit määrittää sekä arvon että otsikon näin:<br>punainen: Punainen<br>sininen: Sininen',
        'button_label' => 'Painike toistajalle',
        'date_format' => 'Päivämäärämuoto',
        'date_format_helper' => 'Valitse päivämäärien näyttömuoto',
        'time_format' => 'Aikamuoto',
        'time_format_helper' => 'Valitse ajan näyttömuoto',

        'groups' => [
            'basic' => 'Perus',
            'content' => 'Sisältö',
            'choice' => 'Valinnat',
            'other' => 'Muu',
        ],

        'types' => [
            'text' => 'Tekstikenttä',
            'textarea' => 'Tekstialue',
            'number' => 'Numero',
            'email' => 'Sähköposti',
            'password' => 'Salasana',
            'url' => 'URL',
            'date' => 'Päivämäärävalitsin',
            'datetime' => 'Päivämäärä- ja aikavalitsin',
            'time' => 'Aikavalitsin',
            'color' => 'Värivalitsin',
            'wysiwyg' => 'WYSIWYG-editori',
            'image' => 'Kuva',
            'file' => 'Tiedosto',
            'select' => 'Valitse',
            'checkbox' => 'Valintaruutu',
            'radio' => 'Radiopainike',
            'repeater' => 'Toistaja',
        ],

        'rules' => [
            'rules' => 'Näyttösäännöt',
            'rules_helper' => 'Näytä tämä kenttäryhmä, jos',
            'add_rule_group' => 'Lisää sääntöryhmä',
            'is_equal_to' => 'On yhtä suuri kuin',
            'is_not_equal_to' => 'Ei ole yhtä suuri kuin',
            'and' => 'Ja',
            'or' => 'Tai',
        ],
    ],

    'import' => 'Tuo',
    'export' => 'Vie',
    'publish' => 'Julkaise',
    'remove_this_line' => 'Poista tämä rivi',
    'collapse_this_line' => 'Kutista tämä rivi',
    'error_occurred' => 'Tapahtui virhe',
    'request_completed' => 'Pyyntö valmis',
    'item_not_existed' => 'Kohde ei ole olemassa',
];
