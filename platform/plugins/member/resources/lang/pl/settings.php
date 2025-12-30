<?php

return [
    'title' => 'Członek',
    'description' => 'Wyświetl i zaktualizuj ustawienia członków',
    'verify_account_email' => 'Zweryfikować e-mail konta?',
    'verify_account_email_helper' => 'Gdy jest włączone, link weryfikacyjny zostanie wysłany na e-mail konta, klienci muszą kliknąć ten link, aby zweryfikować swój e-mail, zanim będą mogli się zalogować. Należy skonfigurować e-mail w Admin -> Ustawienia -> E-mail, aby wysłać weryfikację e-mail.',
    'verification_expire_minutes' => 'Czas wygaśnięcia linku weryfikacyjnego (minuty)',
    'verification_expire_minutes_helper' => 'Liczba minut, przez którą link weryfikacyjny e-mail powinien być uznawany za ważny. Domyślnie 60 minut (1 godzina). Maksymalnie 10080 minut (7 dni).',
    'enabled_login' => 'Zezwolić odwiedzającym na logowanie?',
    'enabled_login_helper' => 'Gdy jest włączone, odwiedzający mogą zalogować się do Twojej witryny, jeśli mają konto.',
    'enabled_registration' => 'Zezwolić odwiedzającym na rejestrację konta?',
    'enabled_registration_helper' => 'Gdy jest włączone, odwiedzający mogą zarejestrować konto w Twojej witrynie.',
    'enable_post_approval' => 'Włączyć zatwierdzanie postów?',
    'enable_post_approval_helper' => 'Gdy jest włączone, nieruchomości opublikowane przez agenta będą musiały zostać zatwierdzone przez administratora, zanim zostaną opublikowane i wyświetlone w Twojej witrynie.',
    'default_avatar' => 'Domyślny awatar',
    'default_avatar_helper' => 'Domyślny awatar dla członka, gdy nie ma awatara. Jeśli nie wybierzesz żadnego obrazu, zostanie wygenerowany przy użyciu Twojego logo lub pierwszej litery nazwy członka.',
    'show_terms_checkbox' => 'Pokazać pole wyboru Regulaminu i Polityki?',
    'show_terms_checkbox_helper' => 'Gdy jest włączone, użytkownicy będą musieli zaakceptować Twój Regulamin i Politykę Prywatności, zanim będą mogli zarejestrować konto.',
    'email' => [
        'templates' => [
            'confirm_email' => [
                'title' => 'Potwierdź e-mail',
                'description' => 'Wyślij e-mail do użytkownika, gdy rejestruje konto, aby zweryfikować swój e-mail',
                'subject' => 'Powiadomienie o potwierdzeniu e-maila',
                'verify_link' => 'Link weryfikacyjny e-mail',
                'member_name' => 'Nazwa członka',
            ],
            'password_reminder' => [
                'title' => 'Zresetuj hasło',
                'description' => 'Wyślij e-mail do użytkownika, gdy żąda zresetowania hasła',
                'subject' => 'Zresetuj hasło',
                'reset_link' => 'Link do resetowania hasła',
            ],
            'new_pending_post' => [
                'title' => 'Nowy oczekujący post',
                'description' => 'Wyślij e-mail do administratora, gdy zostanie utworzony nowy post',
                'subject' => 'Nowy post oczekuje na {{ site_title }} przez {{ post_author }}',
                'post_author' => 'Autor posta',
                'post_name' => 'Nazwa posta',
                'post_url' => 'Adres URL posta',
            ],
        ],
    ],
];
