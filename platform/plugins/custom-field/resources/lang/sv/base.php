<?php

return [
    'admin_menu' => [
        'title' => 'Anpassade fält',
        'description' => 'Visa och hantera anpassade fält',
    ],

    'page_title' => 'Anpassade fält',

    'all_field_groups' => 'Alla fältgrupper',

    'form' => [
        'create_field_group' => 'Skapa fältgrupp',
        'edit_field_group' => 'Redigera fältgrupp',
        'field_items_information' => 'Information om fältelement',

        'repeater_fields' => 'Upprepare',
        'add_field' => 'Lägg till fält',
        'remove_field' => 'Ta bort fält',
        'close_field' => 'Stäng fält',
        'new_field' => 'Nytt fält',

        'field_label' => 'Etikett',
        'field_label_helper' => 'Detta är titeln på fältelementet. Den kommer att visas på redigeringssidor.',
        'field_name' => 'Fältnamn',
        'field_name_helper' => 'Alias för fältelementet. Accepterar siffror, tecken och understreck.',
        'field_type' => 'Fälttyp',
        'field_type_helper' => 'Vänligen välj typ för detta fält.',
        'field_instructions' => 'Fältinstruktioner',
        'field_instructions_helper' => 'Instruktioner som hjälper användaren att lättare förstå vad som ska matas in.',

        'default_value' => 'Standardvärde',
        'default_value_helper' => 'Standardvärdet för fältet när det lämnas tomt',
        'placeholder' => 'Platshållare',
        'placeholder_helper' => 'Platshållartext',
        'rows' => 'Rader',
        'rows_helper' => 'Antal rader för detta textområde',
        'choices' => 'Val',
        'choices_helper' => 'Ange varje val på en ny rad.<br>För mer kontroll kan du ange både ett värde och en etikett så här:<br>rod: Röd<br>bla: Blå',
        'button_label' => 'Knapp för upprepare',
        'date_format' => 'Datumformat',
        'date_format_helper' => 'Välj visningsformat för datum',
        'time_format' => 'Tidsformat',
        'time_format_helper' => 'Välj visningsformat för tid',

        'groups' => [
            'basic' => 'Grundläggande',
            'content' => 'Innehåll',
            'choice' => 'Val',
            'other' => 'Annat',
        ],

        'types' => [
            'text' => 'Textfält',
            'textarea' => 'Textområde',
            'number' => 'Nummer',
            'email' => 'E-post',
            'password' => 'Lösenord',
            'url' => 'URL',
            'date' => 'Datumväljare',
            'datetime' => 'Datum- och tidsväljare',
            'time' => 'Tidsväljare',
            'color' => 'Färgväljare',
            'wysiwyg' => 'WYSIWYG-redigerare',
            'image' => 'Bild',
            'file' => 'Fil',
            'select' => 'Urval',
            'checkbox' => 'Kryssruta',
            'radio' => 'Radioknapp',
            'repeater' => 'Upprepare',
        ],

        'rules' => [
            'rules' => 'Visningsregler',
            'rules_helper' => 'Visa denna fältgrupp om',
            'add_rule_group' => 'Lägg till regelgrupp',
            'is_equal_to' => 'Lika med',
            'is_not_equal_to' => 'Inte lika med',
            'and' => 'Och',
            'or' => 'Eller',
        ],
    ],

    'import' => 'Importera',
    'export' => 'Exportera',
    'publish' => 'Publicera',
    'remove_this_line' => 'Ta bort denna rad',
    'collapse_this_line' => 'Fäll ihop denna rad',
    'error_occurred' => 'Ett fel uppstod',
    'request_completed' => 'Förfrågan slutförd',
    'item_not_existed' => 'Objektet finns inte',
];
