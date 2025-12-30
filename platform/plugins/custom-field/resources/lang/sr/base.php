<?php

return [
    'admin_menu' => [
        'title' => 'Прилагођена поља',
        'description' => 'Преглед и управљање прилагођеним пољима',
    ],

    'page_title' => 'Прилагођена поља',

    'all_field_groups' => 'Све групе поља',

    'form' => [
        'create_field_group' => 'Креирај групу поља',
        'edit_field_group' => 'Измени групу поља',
        'field_items_information' => 'Информације о ставкама поља',

        'repeater_fields' => 'Понављач',
        'add_field' => 'Додај поље',
        'remove_field' => 'Уклони поље',
        'close_field' => 'Затвори поље',
        'new_field' => 'Ново поље',

        'field_label' => 'Ознака',
        'field_label_helper' => 'Ово је наслов ставке поља. Биће приказан на страницама за уређивање.',
        'field_name' => 'Назив поља',
        'field_name_helper' => 'Алијас ставке поља. Прихваћени су бројеви, знакови и доња црта.',
        'field_type' => 'Тип поља',
        'field_type_helper' => 'Молимо изаберите тип овог поља.',
        'field_instructions' => 'Упутства за поље',
        'field_instructions_helper' => 'Упутства која помажу кориснику да лакше зна шта треба да унесе.',

        'default_value' => 'Подразумевана вредност',
        'default_value_helper' => 'Подразумевана вредност поља када остане празно',
        'placeholder' => 'Замена за текст',
        'placeholder_helper' => 'Замена за текст',
        'rows' => 'Редови',
        'rows_helper' => 'Број редова овог текстуалног поља',
        'choices' => 'Избори',
        'choices_helper' => 'Унесите сваки избор у нови ред.<br>За већу контролу, можете навести и вредност и ознаку овако:<br>crvena: Црвена<br>plava: Плава',
        'button_label' => 'Дугме за понављач',
        'date_format' => 'Формат датума',
        'date_format_helper' => 'Изаберите формат приказа датума',
        'time_format' => 'Формат времена',
        'time_format_helper' => 'Изаберите формат приказа времена',

        'groups' => [
            'basic' => 'Основно',
            'content' => 'Садржај',
            'choice' => 'Избори',
            'other' => 'Остало',
        ],

        'types' => [
            'text' => 'Текстуално поље',
            'textarea' => 'Текстуална област',
            'number' => 'Број',
            'email' => 'Е-пошта',
            'password' => 'Лозинка',
            'url' => 'URL',
            'date' => 'Бирач датума',
            'datetime' => 'Бирач датума и времена',
            'time' => 'Бирач времена',
            'color' => 'Бирач боје',
            'wysiwyg' => 'WYSIWYG уређивач',
            'image' => 'Слика',
            'file' => 'Датотека',
            'select' => 'Избор',
            'checkbox' => 'Поље за потврду',
            'radio' => 'Радио дугме',
            'repeater' => 'Понављач',
        ],

        'rules' => [
            'rules' => 'Правила приказа',
            'rules_helper' => 'Прикажи ову групу поља ако',
            'add_rule_group' => 'Додај групу правила',
            'is_equal_to' => 'Једнако',
            'is_not_equal_to' => 'Није једнако',
            'and' => 'И',
            'or' => 'Или',
        ],
    ],

    'import' => 'Увези',
    'export' => 'Извezi',
    'publish' => 'Објави',
    'remove_this_line' => 'Уклони овај ред',
    'collapse_this_line' => 'Скупи овај ред',
    'error_occurred' => 'Дошло је до грешке',
    'request_completed' => 'Захтев завршен',
    'item_not_existed' => 'Ставка не постоји',
];
