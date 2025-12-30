<?php

return [
    'title' => 'Membro',
    'description' => 'Visualizza e aggiorna le impostazioni dei membri',
    'verify_account_email' => "Verificare l'email dell'account?",
    'verify_account_email_helper' => "Quando è abilitato, un link di verifica verrà inviato all'email dell'account, i clienti devono fare clic su questo link per verificare la loro email prima di poter accedere. È necessario configurare l'email in Admin -> Impostazioni -> Email per inviare la verifica dell'email.",
    'verification_expire_minutes' => 'Scadenza del link di verifica (minuti)',
    'verification_expire_minutes_helper' => 'Il numero di minuti per cui il link di verifica email dovrebbe essere considerato valido. Il valore predefinito è 60 minuti (1 ora). Il massimo è 10080 minuti (7 giorni).',
    'enabled_login' => 'Consenti ai visitatori di accedere?',
    'enabled_login_helper' => 'Quando è abilitato, i visitatori possono accedere al tuo sito se hanno un account.',
    'enabled_registration' => 'Consenti ai visitatori di registrare un account?',
    'enabled_registration_helper' => 'Quando è abilitato, i visitatori possono registrare un account sul tuo sito.',
    'enable_post_approval' => 'Abilita approvazione dei post?',
    'enable_post_approval_helper' => 'Quando è abilitato, le proprietà pubblicate da un agente dovranno essere approvate da un amministratore prima di essere pubblicate e visualizzate sul tuo sito.',
    'default_avatar' => 'Avatar predefinito',
    'default_avatar_helper' => 'Avatar predefinito per il membro quando non ha un avatar. Se non selezioni alcuna immagine, verrà generata utilizzando il tuo logo o il primo carattere del nome del membro.',
    'show_terms_checkbox' => 'Mostra casella di controllo Termini e Policy?',
    'show_terms_checkbox_helper' => 'Quando è abilitato, gli utenti dovranno accettare i tuoi Termini e Informativa sulla privacy prima di poter registrare un account.',
    'email' => [
        'templates' => [
            'confirm_email' => [
                'title' => 'Conferma email',
                'description' => "Invia un'email all'utente quando registra un account per verificare la sua email",
                'subject' => 'Notifica di Conferma Email',
                'verify_link' => 'Link di verifica email',
                'member_name' => 'Nome del membro',
            ],
            'password_reminder' => [
                'title' => 'Reimposta password',
                'description' => "Invia un'email all'utente quando richiede il reset della password",
                'subject' => 'Reimposta Password',
                'reset_link' => 'Link di reset password',
            ],
            'new_pending_post' => [
                'title' => 'Nuovo post in attesa',
                'description' => "Invia un'email all'amministratore quando viene creato un nuovo post",
                'subject' => 'Nuovo post in attesa su {{ site_title }} di {{ post_author }}',
                'post_author' => 'Autore del Post',
                'post_name' => 'Nome del Post',
                'post_url' => 'URL del Post',
            ],
        ],
    ],
];
