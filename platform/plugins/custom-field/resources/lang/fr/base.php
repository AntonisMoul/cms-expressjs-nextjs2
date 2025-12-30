<?php

return [
    'admin_menu' => [
        'title' => 'Champs personnalisés',
        'description' => 'Afficher et gérer les champs personnalisés',
    ],

    'page_title' => 'Champs personnalisés',

    'all_field_groups' => 'Tous les groupes de champs',

    'form' => [
        'create_field_group' => 'Créer un groupe de champs',
        'edit_field_group' => 'Modifier le groupe de champs',
        'field_items_information' => 'Informations sur les éléments de champ',

        'repeater_fields' => 'Répéteur',
        'add_field' => 'Ajouter un champ',
        'remove_field' => 'Supprimer le champ',
        'close_field' => 'Fermer le champ',
        'new_field' => 'Nouveau champ',

        'field_label' => 'Libellé',
        'field_label_helper' => 'Ceci est le titre de l\'élément de champ. Il sera affiché sur les pages de modification.',
        'field_name' => 'Nom du champ',
        'field_name_helper' => 'L\'alias de l\'élément de champ. Accepte les chiffres, les caractères et le trait de soulignement.',
        'field_type' => 'Type de champ',
        'field_type_helper' => 'Veuillez sélectionner le type de ce champ.',
        'field_instructions' => 'Instructions du champ',
        'field_instructions_helper' => 'Le guide d\'instructions pour que l\'utilisateur sache plus facilement ce qu\'il doit saisir.',

        'default_value' => 'Valeur par défaut',
        'default_value_helper' => 'La valeur par défaut du champ lorsqu\'il est laissé vide',
        'placeholder' => 'Espace réservé',
        'placeholder_helper' => 'Texte de l\'espace réservé',
        'rows' => 'Lignes',
        'rows_helper' => 'Lignes de cette zone de texte',
        'choices' => 'Choix',
        'choices_helper' => 'Entrez chaque choix sur une nouvelle ligne.<br>Pour plus de contrôle, vous pouvez spécifier à la fois une valeur et un libellé comme ceci :<br>rouge : Rouge<br>bleu : Bleu',
        'button_label' => 'Bouton pour le répéteur',
        'date_format' => 'Format de date',
        'date_format_helper' => 'Choisissez le format d\'affichage des dates',
        'time_format' => 'Format de l\'heure',
        'time_format_helper' => 'Choisissez le format d\'affichage de l\'heure',

        'groups' => [
            'basic' => 'Basique',
            'content' => 'Contenu',
            'choice' => 'Choix',
            'other' => 'Autre',
        ],

        'types' => [
            'text' => 'Champ de texte',
            'textarea' => 'Zone de texte',
            'number' => 'Nombre',
            'email' => 'Email',
            'password' => 'Mot de passe',
            'url' => 'URL',
            'date' => 'Sélecteur de date',
            'datetime' => 'Sélecteur de date et heure',
            'time' => 'Sélecteur d\'heure',
            'color' => 'Sélecteur de couleur',
            'wysiwyg' => 'Éditeur WYSIWYG',
            'image' => 'Image (média)',
            'file' => 'Fichier',
            'select' => 'Sélectionner',
            'checkbox' => 'Case à cocher',
            'radio' => 'Bouton radio',
            'repeater' => 'Répéteur',
        ],

        'rules' => [
            'rules' => 'Règles d\'affichage',
            'rules_helper' => 'Afficher ce groupe de champs si',
            'add_rule_group' => 'Ajouter un groupe de règles',
            'is_equal_to' => 'Égal à',
            'is_not_equal_to' => 'Pas égal à',
            'and' => 'Et',
            'or' => 'Ou',
        ],
    ],

    'import' => 'Importer',
    'export' => 'Exporter',
    'publish' => 'Publier',
    'remove_this_line' => 'Supprimer cette ligne',
    'collapse_this_line' => 'Réduire cette ligne',
    'error_occurred' => 'Une erreur s\'est produite',
    'request_completed' => 'Demande terminée',
    'item_not_existed' => 'L\'élément n\'existe pas',
];
