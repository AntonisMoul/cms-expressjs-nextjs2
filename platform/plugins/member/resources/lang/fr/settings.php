<?php

return  [
  'title' => 'Membre',
  'description' => 'Voir et mettre à jour les paramètres des membres',
  'verify_account_email' => 'Vérifier l\'email du compte ?',
  'verify_account_email_helper' => 'Lorsque c\'est activé, un lien de vérification sera envoyé à l\'email du compte, les clients doivent cliquer sur ce lien pour vérifier leur email avant de pouvoir se connecter. Besoin de configurer l\'email dans Admin -> Paramètres -> Email pour envoyer la vérification par email.',
  'verification_expire_minutes' => 'Expiration du lien de vérification (minutes)',
  'verification_expire_minutes_helper' => 'Le nombre de minutes pendant lesquelles le lien de vérification d\'email doit être considéré comme valide. Par défaut 60 minutes (1 heure). Maximum 10080 minutes (7 jours).',
  'enabled_login' => 'Autoriser les visiteurs à se connecter ?',
  'enabled_login_helper' => 'Lorsque c\'est activé, les visiteurs peuvent se connecter à votre site s\'ils ont un compte.',
  'enabled_registration' => 'Autoriser les visiteurs à créer un compte ?',
  'enabled_registration_helper' => 'Lorsque c\'est activé, les visiteurs peuvent créer un compte sur votre site.',
  'enable_post_approval' => 'Activer l\'approbation des articles ?',
  'enable_post_approval_helper' => 'Lorsque c\'est activé, les propriétés publiées par un agent devront être approuvées par un administrateur avant d\'être publiées et affichées sur votre site.',
  'default_avatar' => 'Avatar par défaut',
  'default_avatar_helper' => 'Avatar par défaut pour les membres lorsqu\'ils n\'ont pas d\'avatar. Si vous ne sélectionnez aucune image, elle sera générée en utilisant votre logo ou le premier caractère du nom du membre.',
  'show_terms_checkbox' => 'Afficher la case Conditions et Politique ?',
  'show_terms_checkbox_helper' => 'Lorsque c\'est activé, les utilisateurs devront accepter vos Conditions et Politique de confidentialité avant de pouvoir créer un compte.',
  'email' =>
   [
    'templates' =>
     [
      'confirm_email' =>
       [
        'title' => 'Confirmer l\'email',
        'description' => 'Envoyer un email à l\'utilisateur lorsqu\'il crée un compte pour vérifier son email',
        'subject' => 'Notification de confirmation d\'email',
        'verify_link' => 'Lien de vérification d\'email',
        'member_name' => 'Nom du membre',
      ],
      'password_reminder' =>
       [
        'title' => 'Réinitialiser le mot de passe',
        'description' => 'Envoyer un email à l\'utilisateur lors de la demande de réinitialisation du mot de passe',
        'subject' => 'Réinitialiser le mot de passe',
        'reset_link' => 'Lien de réinitialisation du mot de passe',
      ],
      'new_pending_post' =>
       [
        'title' => 'Nouvel article en attente',
        'description' => 'Envoyer un email à l\'administrateur lorsqu\'un nouvel article est créé',
        'subject' => 'Nouvel article en attente sur {{ site_title }} par {{ post_author }}',
        'post_author' => 'Auteur de l\'article',
        'post_name' => 'Nom de l\'article',
        'post_url' => 'URL de l\'article',
      ],
    ],
  ],
];
