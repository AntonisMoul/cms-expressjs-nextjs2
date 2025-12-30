<?php

return [
    'admin_menu' => [
        'title' => 'Campi personalizzati',
        'description' => 'Visualizza e gestisci i campi personalizzati',
    ],

    'page_title' => 'Campi personalizzati',

    'all_field_groups' => 'Tutti i gruppi di campi',

    'form' => [
        'create_field_group' => 'Crea gruppo di campi',
        'edit_field_group' => 'Modifica gruppo di campi',
        'field_items_information' => 'Informazioni elementi del campo',

        'repeater_fields' => 'Ripetitore',
        'add_field' => 'Aggiungi campo',
        'remove_field' => 'Rimuovi campo',
        'close_field' => 'Chiudi campo',
        'new_field' => 'Nuovo campo',

        'field_label' => 'Etichetta',
        'field_label_helper' => 'Questo è il titolo dell\'elemento del campo. Sarà mostrato nelle pagine di modifica.',
        'field_name' => 'Nome campo',
        'field_name_helper' => 'L\'alias dell\'elemento del campo. Accetta numeri, caratteri e trattino basso.',
        'field_type' => 'Tipo di campo',
        'field_type_helper' => 'Seleziona il tipo di questo campo.',
        'field_instructions' => 'Istruzioni campo',
        'field_instructions_helper' => 'Le istruzioni guidano l\'utente per capire più facilmente cosa deve inserire.',

        'default_value' => 'Valore predefinito',
        'default_value_helper' => 'Il valore predefinito del campo quando è vuoto',
        'placeholder' => 'Segnaposto',
        'placeholder_helper' => 'Testo segnaposto',
        'rows' => 'Righe',
        'rows_helper' => 'Numero di righe di questa area di testo',
        'choices' => 'Scelte',
        'choices_helper' => 'Inserisci ogni scelta su una nuova riga.<br>Per un maggiore controllo, puoi specificare sia un valore che un\'etichetta in questo modo:<br>red: Rosso<br>blue: Blu',
        'button_label' => 'Pulsante per ripetitore',
        'date_format' => 'Formato data',
        'date_format_helper' => 'Scegli il formato di visualizzazione per le date',
        'time_format' => 'Formato ora',
        'time_format_helper' => 'Scegli il formato di visualizzazione per l\'ora',

        'groups' => [
            'basic' => 'Base',
            'content' => 'Contenuto',
            'choice' => 'Scelte',
            'other' => 'Altro',
        ],

        'types' => [
            'text' => 'Campo di testo',
            'textarea' => 'Area di testo',
            'number' => 'Numero',
            'email' => 'Email',
            'password' => 'Password',
            'url' => 'URL',
            'date' => 'Selettore data',
            'datetime' => 'Selettore data e ora',
            'time' => 'Selettore ora',
            'color' => 'Selettore colore',
            'wysiwyg' => 'Editor WYSIWYG',
            'image' => 'Immagine',
            'file' => 'File',
            'select' => 'Selezione',
            'checkbox' => 'Casella di controllo',
            'radio' => 'Radio',
            'repeater' => 'Ripetitore',
        ],

        'rules' => [
            'rules' => 'Regole di visualizzazione',
            'rules_helper' => 'Mostra questo gruppo di campi se',
            'add_rule_group' => 'Aggiungi gruppo di regole',
            'is_equal_to' => 'Uguale a',
            'is_not_equal_to' => 'Non uguale a',
            'and' => 'E',
            'or' => 'O',
        ],
    ],

    'import' => 'Importa',
    'export' => 'Esporta',
    'publish' => 'Pubblica',
    'remove_this_line' => 'Rimuovi questa riga',
    'collapse_this_line' => 'Comprimi questa riga',
    'error_occurred' => 'Si è verificato un errore',
    'request_completed' => 'Richiesta completata',
    'item_not_existed' => 'L\'elemento non esiste',
];
