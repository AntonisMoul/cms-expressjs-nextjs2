<?php

return  [
  'title' => 'Miembro',
  'description' => 'Ver y actualizar configuración de miembros',
  'verify_account_email' => '¿Verificar el correo electrónico de la cuenta?',
  'verify_account_email_helper' => 'Cuando está habilitado, se enviará un enlace de verificación al correo electrónico de la cuenta, los clientes deben hacer clic en este enlace para verificar su correo electrónico antes de poder iniciar sesión. Necesita configurar el correo electrónico en Admin -> Configuración -> Correo electrónico para enviar la verificación por correo electrónico.',
  'verification_expire_minutes' => 'Expiración del enlace de verificación (minutos)',
  'verification_expire_minutes_helper' => 'El número de minutos que el enlace de verificación de correo electrónico debe considerarse válido. El valor predeterminado es 60 minutos (1 hora). El máximo es 10080 minutos (7 días).',
  'enabled_login' => '¿Permitir que los visitantes inicien sesión?',
  'enabled_login_helper' => 'Cuando está habilitado, los visitantes pueden iniciar sesión en su sitio si tienen una cuenta.',
  'enabled_registration' => '¿Permitir que los visitantes registren una cuenta?',
  'enabled_registration_helper' => 'Cuando está habilitado, los visitantes pueden registrar una cuenta en su sitio.',
  'enable_post_approval' => '¿Habilitar aprobación de publicaciones?',
  'enable_post_approval_helper' => 'Cuando está habilitado, las propiedades publicadas por un agente necesitarán ser aprobadas por un administrador antes de ser publicadas y mostradas en su sitio.',
  'default_avatar' => 'Avatar predeterminado',
  'default_avatar_helper' => 'Avatar predeterminado para miembros cuando no tienen un avatar. Si no selecciona ninguna imagen, se generará usando su logotipo o el primer carácter del nombre del miembro.',
  'show_terms_checkbox' => '¿Mostrar casilla de Términos y Políticas?',
  'show_terms_checkbox_helper' => 'Cuando está habilitado, los usuarios deberán aceptar sus Términos y Política de Privacidad antes de poder registrar una cuenta.',
  'email' =>
   [
    'templates' =>
     [
      'confirm_email' =>
       [
        'title' => 'Confirmar correo electrónico',
        'description' => 'Enviar correo electrónico al usuario cuando registra una cuenta para verificar su correo electrónico',
        'subject' => 'Notificación de confirmación de correo electrónico',
        'verify_link' => 'Enlace de verificación de correo electrónico',
        'member_name' => 'Nombre del miembro',
      ],
      'password_reminder' =>
       [
        'title' => 'Restablecer contraseña',
        'description' => 'Enviar correo electrónico al usuario cuando solicita restablecer contraseña',
        'subject' => 'Restablecer contraseña',
        'reset_link' => 'Enlace para restablecer contraseña',
      ],
      'new_pending_post' =>
       [
        'title' => 'Nueva publicación pendiente',
        'description' => 'Enviar correo electrónico al administrador cuando se crea una nueva publicación',
        'subject' => 'Nueva publicación pendiente en {{ site_title }} por {{ post_author }}',
        'post_author' => 'Autor de la publicación',
        'post_name' => 'Nombre de la publicación',
        'post_url' => 'URL de la publicación',
      ],
    ],
  ],
];
