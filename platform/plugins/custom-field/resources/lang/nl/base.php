<?php

return [
    'admin_menu' => [
        'title' => 'Aangepaste velden',
        'description' => 'Bekijk en beheer aangepaste velden',
    ],

    'page_title' => 'Aangepaste velden',

    'all_field_groups' => 'Alle veldgroepen',

    'form' => [
        'create_field_group' => 'Veldgroep aanmaken',
        'edit_field_group' => 'Veldgroep bewerken',
        'field_items_information' => 'Velditeminformatie',

        'repeater_fields' => 'Herhaler',
        'add_field' => 'Veld toevoegen',
        'remove_field' => 'Veld verwijderen',
        'close_field' => 'Veld sluiten',
        'new_field' => 'Nieuw veld',

        'field_label' => 'Label',
        'field_label_helper' => 'Dit is de titel van het velditem. Het wordt weergegeven op bewerkingspagina\'s.',
        'field_name' => 'Veldnaam',
        'field_name_helper' => 'De alias van het velditem. Accepteert getallen, tekens en underscore.',
        'field_type' => 'Veldtype',
        'field_type_helper' => 'Selecteer het type van dit veld.',
        'field_instructions' => 'Veldinstructies',
        'field_instructions_helper' => 'De instructiegids zodat de gebruiker gemakkelijker weet wat hij moet invoeren.',

        'default_value' => 'Standaardwaarde',
        'default_value_helper' => 'De standaardwaarde van het veld wanneer het leeg wordt gelaten',
        'placeholder' => 'Tijdelijke aanduiding',
        'placeholder_helper' => 'Tijdelijke aanduidingstekst',
        'rows' => 'Rijen',
        'rows_helper' => 'Rijen van dit tekstgebied',
        'choices' => 'Keuzes',
        'choices_helper' => 'Voer elke keuze op een nieuwe regel in.<br>Voor meer controle kunt u zowel een waarde als een label opgeven zoals dit:<br>red: Rood<br>blue: Blauw',
        'button_label' => 'Knop voor herhaler',
        'date_format' => 'Datumformaat',
        'date_format_helper' => 'Kies het weergaveformaat voor datums',
        'time_format' => 'Tijdformaat',
        'time_format_helper' => 'Kies het weergaveformaat voor tijd',

        'groups' => [
            'basic' => 'Basis',
            'content' => 'Inhoud',
            'choice' => 'Keuzes',
            'other' => 'Overig',
        ],

        'types' => [
            'text' => 'Tekstveld',
            'textarea' => 'Tekstgebied',
            'number' => 'Nummer',
            'email' => 'E-mail',
            'password' => 'Wachtwoord',
            'url' => 'URL',
            'date' => 'Datumkiezer',
            'datetime' => 'Datum- en tijdkiezer',
            'time' => 'Tijdkiezer',
            'color' => 'Kleurkiezer',
            'wysiwyg' => 'WYSIWYG-editor',
            'image' => 'Afbeelding',
            'file' => 'Bestand',
            'select' => 'Selecteren',
            'checkbox' => 'Selectievakje',
            'radio' => 'Keuzerondje',
            'repeater' => 'Herhaler',
        ],

        'rules' => [
            'rules' => 'Weergaveregels',
            'rules_helper' => 'Toon deze veldgroep als',
            'add_rule_group' => 'Regelgroep toevoegen',
            'is_equal_to' => 'Is gelijk aan',
            'is_not_equal_to' => 'Is niet gelijk aan',
            'and' => 'En',
            'or' => 'Of',
        ],
    ],

    'import' => 'Importeren',
    'export' => 'Exporteren',
    'publish' => 'Publiceren',
    'remove_this_line' => 'Deze regel verwijderen',
    'collapse_this_line' => 'Deze regel inklappen',
    'error_occurred' => 'Er is een fout opgetreden',
    'request_completed' => 'Verzoek voltooid',
    'item_not_existed' => 'Item bestaat niet',
];
