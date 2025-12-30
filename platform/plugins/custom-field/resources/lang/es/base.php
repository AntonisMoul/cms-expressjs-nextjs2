<?php

return [
    'admin_menu' => [
        'title' => 'Campos personalizados',
        'description' => 'Ver y administrar campos personalizados',
    ],

    'page_title' => 'Campos personalizados',

    'all_field_groups' => 'Todos los grupos de campos',

    'form' => [
        'create_field_group' => 'Crear grupo de campos',
        'edit_field_group' => 'Editar grupo de campos',
        'field_items_information' => 'Información de elementos de campo',

        'repeater_fields' => 'Repetidor',
        'add_field' => 'Agregar campo',
        'remove_field' => 'Eliminar campo',
        'close_field' => 'Cerrar campo',
        'new_field' => 'Nuevo campo',

        'field_label' => 'Etiqueta',
        'field_label_helper' => 'Este es el título del elemento de campo. Se mostrará en las páginas de edición.',
        'field_name' => 'Nombre del campo',
        'field_name_helper' => 'El alias del elemento de campo. Acepta números, caracteres y guión bajo.',
        'field_type' => 'Tipo de campo',
        'field_type_helper' => 'Por favor seleccione el tipo de este campo.',
        'field_instructions' => 'Instrucciones del campo',
        'field_instructions_helper' => 'La guía de instrucciones para que el usuario sepa más fácilmente lo que necesita ingresar.',

        'default_value' => 'Valor predeterminado',
        'default_value_helper' => 'El valor predeterminado del campo cuando se deja en blanco',
        'placeholder' => 'Marcador de posición',
        'placeholder_helper' => 'Texto del marcador de posición',
        'rows' => 'Filas',
        'rows_helper' => 'Filas de esta área de texto',
        'choices' => 'Opciones',
        'choices_helper' => 'Ingrese cada opción en una nueva línea.<br>Para más control, puede especificar tanto un valor como una etiqueta así:<br>rojo: Rojo<br>azul: Azul',
        'button_label' => 'Botón para repetidor',
        'date_format' => 'Formato de fecha',
        'date_format_helper' => 'Elija el formato de visualización para las fechas',
        'time_format' => 'Formato de hora',
        'time_format_helper' => 'Elija el formato de visualización para la hora',

        'groups' => [
            'basic' => 'Básico',
            'content' => 'Contenido',
            'choice' => 'Opciones',
            'other' => 'Otro',
        ],

        'types' => [
            'text' => 'Campo de texto',
            'textarea' => 'Área de texto',
            'number' => 'Número',
            'email' => 'Correo electrónico',
            'password' => 'Contraseña',
            'url' => 'URL',
            'date' => 'Selector de fecha',
            'datetime' => 'Selector de fecha y hora',
            'time' => 'Selector de hora',
            'color' => 'Selector de color',
            'wysiwyg' => 'Editor WYSIWYG',
            'image' => 'Imagen',
            'file' => 'Archivo',
            'select' => 'Seleccionar',
            'checkbox' => 'Casilla de verificación',
            'radio' => 'Botón de radio',
            'repeater' => 'Repetidor',
        ],

        'rules' => [
            'rules' => 'Reglas de visualización',
            'rules_helper' => 'Mostrar este grupo de campos si',
            'add_rule_group' => 'Agregar grupo de reglas',
            'is_equal_to' => 'Igual a',
            'is_not_equal_to' => 'No igual a',
            'and' => 'Y',
            'or' => 'O',
        ],
    ],

    'import' => 'Importar',
    'export' => 'Exportar',
    'publish' => 'Publicar',
    'remove_this_line' => 'Eliminar esta línea',
    'collapse_this_line' => 'Contraer esta línea',
    'error_occurred' => 'Ocurrió un error',
    'request_completed' => 'Solicitud completada',
    'item_not_existed' => 'El elemento no existe',
];
