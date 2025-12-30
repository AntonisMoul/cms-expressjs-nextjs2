<?php

return  [
  'title' => 'Mitglied',
  'description' => 'Mitgliedereinstellungen anzeigen und aktualisieren',
  'verify_account_email' => 'Konto-E-Mail verifizieren?',
  'verify_account_email_helper' => 'Wenn aktiviert, wird ein Verifizierungslink an die E-Mail-Adresse des Kontos gesendet. Kunden müssen auf diesen Link klicken, um ihre E-Mail zu verifizieren, bevor sie sich anmelden können. E-Mail muss in Admin -> Einstellungen -> E-Mail konfiguriert werden, um die E-Mail-Verifizierung zu senden.',
  'verification_expire_minutes' => 'Ablauf des Verifizierungslinks (Minuten)',
  'verification_expire_minutes_helper' => 'Die Anzahl der Minuten, die der E-Mail-Verifizierungslink als gültig betrachtet werden soll. Standard ist 60 Minuten (1 Stunde). Maximum ist 10080 Minuten (7 Tage).',
  'enabled_login' => 'Besuchern das Anmelden erlauben?',
  'enabled_login_helper' => 'Wenn aktiviert, können sich Besucher auf Ihrer Website anmelden, wenn sie ein Konto haben.',
  'enabled_registration' => 'Besuchern die Registrierung erlauben?',
  'enabled_registration_helper' => 'Wenn aktiviert, können Besucher ein Konto auf Ihrer Website registrieren.',
  'enable_post_approval' => 'Beitragsgenehmigung aktivieren?',
  'enable_post_approval_helper' => 'Wenn aktiviert, müssen von einem Agenten veröffentlichte Eigenschaften von einem Administrator genehmigt werden, bevor sie auf Ihrer Website veröffentlicht und angezeigt werden.',
  'default_avatar' => 'Standard-Avatar',
  'default_avatar_helper' => 'Standard-Avatar für Mitglieder, wenn sie keinen Avatar haben. Wenn Sie kein Bild auswählen, wird es mit Ihrem Logo oder dem ersten Buchstaben des Mitgliedsnamens generiert.',
  'show_terms_checkbox' => 'AGB und Richtlinien-Checkbox anzeigen?',
  'show_terms_checkbox_helper' => 'Wenn aktiviert, müssen Benutzer Ihren Nutzungsbedingungen und Datenschutzrichtlinien zustimmen, bevor sie ein Konto registrieren können.',
  'email' =>
   [
    'templates' =>
     [
      'confirm_email' =>
       [
        'title' => 'E-Mail bestätigen',
        'description' => 'E-Mail an den Benutzer senden, wenn er ein Konto registriert, um seine E-Mail zu verifizieren',
        'subject' => 'E-Mail-Bestätigungsbenachrichtigung',
        'verify_link' => 'E-Mail-Verifizierungslink',
        'member_name' => 'Mitgliedsname',
      ],
      'password_reminder' =>
       [
        'title' => 'Passwort zurücksetzen',
        'description' => 'E-Mail an den Benutzer senden bei Anfrage zum Zurücksetzen des Passworts',
        'subject' => 'Passwort zurücksetzen',
        'reset_link' => 'Link zum Zurücksetzen des Passworts',
      ],
      'new_pending_post' =>
       [
        'title' => 'Neuer ausstehender Beitrag',
        'description' => 'E-Mail an den Administrator senden, wenn ein neuer Beitrag erstellt wird',
        'subject' => 'Neuer ausstehender Beitrag auf {{ site_title }} von {{ post_author }}',
        'post_author' => 'Beitragsautor',
        'post_name' => 'Beitragsname',
        'post_url' => 'Beitrags-URL',
      ],
    ],
  ],
];
