<?php

return [
    'admin_menu' => [
        'title' => 'Brugerdefinerede felter',
        'description' => 'Vis og administrer brugerdefinerede felter',
    ],

    'page_title' => 'Brugerdefinerede felter',

    'all_field_groups' => 'Alle feltgrupper',

    'form' => [
        'create_field_group' => 'Opret feltgruppe',
        'edit_field_group' => 'Rediger feltgruppe',
        'field_items_information' => 'Information om feltelementer',

        'repeater_fields' => 'Gentager',
        'add_field' => 'Tilføj felt',
        'remove_field' => 'Fjern felt',
        'close_field' => 'Luk felt',
        'new_field' => 'Nyt felt',

        'field_label' => 'Etiket',
        'field_label_helper' => 'Dette er titlen på feltelementet. Det vil blive vist på redigeringssider.',
        'field_name' => 'Feltnavn',
        'field_name_helper' => 'Aliaset for feltelementet. Accepterer tal, tegn og understregning.',
        'field_type' => 'Felttype',
        'field_type_helper' => 'Vælg venligst typen af dette felt.',
        'field_instructions' => 'Feltinstruktioner',
        'field_instructions_helper' => 'Instruktionsvejledningen gør det lettere for brugeren at vide, hvad de skal indtaste.',

        'default_value' => 'Standardværdi',
        'default_value_helper' => 'Standardværdien af feltet, når det efterlades tomt',
        'placeholder' => 'Pladsholder',
        'placeholder_helper' => 'Pladsholdertekst',
        'rows' => 'Rækker',
        'rows_helper' => 'Antal rækker i dette tekstområde',
        'choices' => 'Valg',
        'choices_helper' => 'Indtast hvert valg på en ny linje.<br>For mere kontrol kan du angive både en værdi og etiket sådan her:<br>rød: Rød<br>blå: Blå',
        'button_label' => 'Knap til gentager',
        'date_format' => 'Datoformat',
        'date_format_helper' => 'Vælg visningsformatet for datoer',
        'time_format' => 'Tidsformat',
        'time_format_helper' => 'Vælg visningsformatet for tid',

        'groups' => [
            'basic' => 'Grundlæggende',
            'content' => 'Indhold',
            'choice' => 'Valg',
            'other' => 'Andet',
        ],

        'types' => [
            'text' => 'Tekstfelt',
            'textarea' => 'Tekstområde',
            'number' => 'Nummer',
            'email' => 'Email',
            'password' => 'Adgangskode',
            'url' => 'URL',
            'date' => 'Datovælger',
            'datetime' => 'Dato- og tidsvælger',
            'time' => 'Tidsvælger',
            'color' => 'Farvevælger',
            'wysiwyg' => 'WYSIWYG editor',
            'image' => 'Billede',
            'file' => 'Fil',
            'select' => 'Vælg',
            'checkbox' => 'Afkrydsningsfelt',
            'radio' => 'Radio',
            'repeater' => 'Gentager',
        ],

        'rules' => [
            'rules' => 'Visningsregler',
            'rules_helper' => 'Vis denne feltgruppe hvis',
            'add_rule_group' => 'Tilføj regelgruppe',
            'is_equal_to' => 'Lig med',
            'is_not_equal_to' => 'Ikke lig med',
            'and' => 'Og',
            'or' => 'Eller',
        ],
    ],

    'import' => 'Importer',
    'export' => 'Eksporter',
    'publish' => 'Publicer',
    'remove_this_line' => 'Fjern denne linje',
    'collapse_this_line' => 'Skjul denne linje',
    'error_occurred' => 'Der opstod en fejl',
    'request_completed' => 'Anmodning fuldført',
    'item_not_existed' => 'Element findes ikke',
];
