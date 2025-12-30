<?php

return [
    'admin_menu' => [
        'title' => 'Benutzerdefinierte Felder',
        'description' => 'Benutzerdefinierte Felder anzeigen und verwalten',
    ],

    'page_title' => 'Benutzerdefinierte Felder',

    'all_field_groups' => 'Alle Feldgruppen',

    'form' => [
        'create_field_group' => 'Feldgruppe erstellen',
        'edit_field_group' => 'Feldgruppe bearbeiten',
        'field_items_information' => 'Feldelemente-Informationen',

        'repeater_fields' => 'Wiederholer',
        'add_field' => 'Feld hinzufügen',
        'remove_field' => 'Feld entfernen',
        'close_field' => 'Feld schließen',
        'new_field' => 'Neues Feld',

        'field_label' => 'Bezeichnung',
        'field_label_helper' => 'Dies ist der Titel des Feldelements. Es wird auf Bearbeitungsseiten angezeigt.',
        'field_name' => 'Feldname',
        'field_name_helper' => 'Der Alias des Feldelements. Akzeptiert Zahlen, Zeichen und Unterstrich.',
        'field_type' => 'Feldtyp',
        'field_type_helper' => 'Bitte wählen Sie den Typ dieses Feldes aus.',
        'field_instructions' => 'Feldanweisungen',
        'field_instructions_helper' => 'Die Anweisungen helfen dem Benutzer leichter zu wissen, was er eingeben muss.',

        'default_value' => 'Standardwert',
        'default_value_helper' => 'Der Standardwert des Feldes, wenn es leer gelassen wird',
        'placeholder' => 'Platzhalter',
        'placeholder_helper' => 'Platzhaltertext',
        'rows' => 'Zeilen',
        'rows_helper' => 'Zeilen dieses Textbereichs',
        'choices' => 'Auswahlmöglichkeiten',
        'choices_helper' => 'Geben Sie jede Auswahl in einer neuen Zeile ein.<br>Für mehr Kontrolle können Sie sowohl einen Wert als auch eine Bezeichnung so angeben:<br>red: Rot<br>blue: Blau',
        'button_label' => 'Schaltfläche für Wiederholer',
        'date_format' => 'Datumsformat',
        'date_format_helper' => 'Wählen Sie das Anzeigeformat für Datumsangaben',
        'time_format' => 'Zeitformat',
        'time_format_helper' => 'Wählen Sie das Anzeigeformat für die Zeit',

        'groups' => [
            'basic' => 'Grundlegend',
            'content' => 'Inhalt',
            'choice' => 'Auswahl',
            'other' => 'Andere',
        ],

        'types' => [
            'text' => 'Textfeld',
            'textarea' => 'Textbereich',
            'number' => 'Nummer',
            'email' => 'E-Mail',
            'password' => 'Passwort',
            'url' => 'URL',
            'date' => 'Datumsauswahl',
            'datetime' => 'Datums- und Zeitauswahl',
            'time' => 'Zeitauswahl',
            'color' => 'Farbauswahl',
            'wysiwyg' => 'WYSIWYG-Editor',
            'image' => 'Bild',
            'file' => 'Datei',
            'select' => 'Auswählen',
            'checkbox' => 'Kontrollkästchen',
            'radio' => 'Optionsfeld',
            'repeater' => 'Wiederholer',
        ],

        'rules' => [
            'rules' => 'Anzeigeregeln',
            'rules_helper' => 'Diese Feldgruppe anzeigen, wenn',
            'add_rule_group' => 'Regelgruppe hinzufügen',
            'is_equal_to' => 'Gleich',
            'is_not_equal_to' => 'Nicht gleich',
            'and' => 'Und',
            'or' => 'Oder',
        ],
    ],

    'import' => 'Importieren',
    'export' => 'Exportieren',
    'publish' => 'Veröffentlichen',
    'remove_this_line' => 'Diese Zeile entfernen',
    'collapse_this_line' => 'Diese Zeile einklappen',
    'error_occurred' => 'Fehler aufgetreten',
    'request_completed' => 'Anfrage abgeschlossen',
    'item_not_existed' => 'Element existiert nicht',
];
