<?php

return [
    'admin_menu' => [
        'title' => 'Egendefinerte felt',
        'description' => 'Vis og administrer egendefinerte felt',
    ],

    'page_title' => 'Egendefinerte felt',

    'all_field_groups' => 'Alle feltgrupper',

    'form' => [
        'create_field_group' => 'Opprett feltgruppe',
        'edit_field_group' => 'Rediger feltgruppe',
        'field_items_information' => 'Informasjon om feltelementer',

        'repeater_fields' => 'Gjentaker',
        'add_field' => 'Legg til felt',
        'remove_field' => 'Fjern felt',
        'close_field' => 'Lukk felt',
        'new_field' => 'Nytt felt',

        'field_label' => 'Etikett',
        'field_label_helper' => 'Dette er tittelen på feltelementet. Den vil vises på redigeringssider.',
        'field_name' => 'Feltnavn',
        'field_name_helper' => 'Aliasnavnet til feltelementet. Aksepterer tall, tegn og understrek.',
        'field_type' => 'Felttype',
        'field_type_helper' => 'Vennligst velg typen for dette feltet.',
        'field_instructions' => 'Feltinstruksjoner',
        'field_instructions_helper' => 'Instruksjonsveiledningen for brukeren slik at de lettere vet hva de skal taste inn.',

        'default_value' => 'Standardverdi',
        'default_value_helper' => 'Standardverdien for feltet når det er tomt',
        'placeholder' => 'Plassholder',
        'placeholder_helper' => 'Plassholdertekst',
        'rows' => 'Rader',
        'rows_helper' => 'Rader i denne tekstboksen',
        'choices' => 'Valg',
        'choices_helper' => 'Skriv inn hvert valg på en ny linje.<br>For mer kontroll kan du spesifisere både verdi og etikett slik:<br>red: Rød<br>blue: Blå',
        'button_label' => 'Knapp for gjentaker',
        'date_format' => 'Datoformat',
        'date_format_helper' => 'Velg visningsformat for datoer',
        'time_format' => 'Tidsformat',
        'time_format_helper' => 'Velg visningsformat for tid',

        'groups' => [
            'basic' => 'Grunnleggende',
            'content' => 'Innhold',
            'choice' => 'Valg',
            'other' => 'Annet',
        ],

        'types' => [
            'text' => 'Tekstfelt',
            'textarea' => 'Tekstområde',
            'number' => 'Nummer',
            'email' => 'E-post',
            'password' => 'Passord',
            'url' => 'URL',
            'date' => 'Datovalg',
            'datetime' => 'Dato- og tidsvalg',
            'time' => 'Tidsvalg',
            'color' => 'Fargevelger',
            'wysiwyg' => 'WYSIWYG-editor',
            'image' => 'Bilde',
            'file' => 'Fil',
            'select' => 'Velg',
            'checkbox' => 'Avkrysningsboks',
            'radio' => 'Radioknapp',
            'repeater' => 'Gjentaker',
        ],

        'rules' => [
            'rules' => 'Visningsregler',
            'rules_helper' => 'Vis denne feltgruppen hvis',
            'add_rule_group' => 'Legg til regelgruppe',
            'is_equal_to' => 'Er lik',
            'is_not_equal_to' => 'Er ikke lik',
            'and' => 'Og',
            'or' => 'Eller',
        ],
    ],

    'import' => 'Importer',
    'export' => 'Eksporter',
    'publish' => 'Publiser',
    'remove_this_line' => 'Fjern denne linjen',
    'collapse_this_line' => 'Skjul denne linjen',
    'error_occurred' => 'Feil oppstod',
    'request_completed' => 'Forespørsel fullført',
    'item_not_existed' => 'Element eksisterer ikke',
];
