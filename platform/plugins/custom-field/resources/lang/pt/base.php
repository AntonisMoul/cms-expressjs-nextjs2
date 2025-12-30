<?php

return [
    'admin_menu' => [
        'title' => 'Campos personalizados',
        'description' => 'Ver e gerenciar campos personalizados',
    ],

    'page_title' => 'Campos personalizados',

    'all_field_groups' => 'Todos os grupos de campos',

    'form' => [
        'create_field_group' => 'Criar grupo de campos',
        'edit_field_group' => 'Editar grupo de campos',
        'field_items_information' => 'Informações dos itens de campo',

        'repeater_fields' => 'Repetidor',
        'add_field' => 'Adicionar campo',
        'remove_field' => 'Remover campo',
        'close_field' => 'Fechar campo',
        'new_field' => 'Novo campo',

        'field_label' => 'Rótulo',
        'field_label_helper' => 'Este é o título do item de campo. Será exibido nas páginas de edição.',
        'field_name' => 'Nome do campo',
        'field_name_helper' => 'O alias do item de campo. Aceita números, caracteres e sublinhado.',
        'field_type' => 'Tipo de campo',
        'field_type_helper' => 'Por favor, selecione o tipo deste campo.',
        'field_instructions' => 'Instruções do campo',
        'field_instructions_helper' => 'O guia de instruções para o usuário saber mais facilmente o que precisa inserir.',

        'default_value' => 'Valor padrão',
        'default_value_helper' => 'O valor padrão do campo quando deixado em branco',
        'placeholder' => 'Marcador de posição',
        'placeholder_helper' => 'Texto do marcador de posição',
        'rows' => 'Linhas',
        'rows_helper' => 'Linhas desta área de texto',
        'choices' => 'Opções',
        'choices_helper' => 'Digite cada opção em uma nova linha.<br>Para mais controle, você pode especificar tanto um valor quanto um rótulo assim:<br>red: Vermelho<br>blue: Azul',
        'button_label' => 'Botão para repetidor',
        'date_format' => 'Formato de data',
        'date_format_helper' => 'Escolha o formato de exibição para datas',
        'time_format' => 'Formato de hora',
        'time_format_helper' => 'Escolha o formato de exibição para hora',

        'groups' => [
            'basic' => 'Básico',
            'content' => 'Conteúdo',
            'choice' => 'Opções',
            'other' => 'Outro',
        ],

        'types' => [
            'text' => 'Campo de texto',
            'textarea' => 'Área de texto',
            'number' => 'Número',
            'email' => 'E-mail',
            'password' => 'Senha',
            'url' => 'URL',
            'date' => 'Seletor de data',
            'datetime' => 'Seletor de data e hora',
            'time' => 'Seletor de hora',
            'color' => 'Seletor de cor',
            'wysiwyg' => 'Editor WYSIWYG',
            'image' => 'Imagem',
            'file' => 'Arquivo',
            'select' => 'Selecionar',
            'checkbox' => 'Caixa de seleção',
            'radio' => 'Botão de rádio',
            'repeater' => 'Repetidor',
        ],

        'rules' => [
            'rules' => 'Regras de exibição',
            'rules_helper' => 'Mostrar este grupo de campos se',
            'add_rule_group' => 'Adicionar grupo de regras',
            'is_equal_to' => 'Igual a',
            'is_not_equal_to' => 'Não igual a',
            'and' => 'E',
            'or' => 'Ou',
        ],
    ],

    'import' => 'Importar',
    'export' => 'Exportar',
    'publish' => 'Publicar',
    'remove_this_line' => 'Remover esta linha',
    'collapse_this_line' => 'Recolher esta linha',
    'error_occurred' => 'Ocorreu um erro',
    'request_completed' => 'Solicitação concluída',
    'item_not_existed' => 'O item não existe',
];
