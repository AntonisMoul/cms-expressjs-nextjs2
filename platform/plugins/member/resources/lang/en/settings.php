<?php

return [
    'title' => 'Member',
    'description' => 'View and update member settings',
    'verify_account_email' => "Verify account's email?",
    'verify_account_email_helper' => "When it's enabled, a verification link will be sent to account's email, customers need to click on this link to verify their email before they can log in. Need to config email in Admin -> Settings -> Email to send email verification.",
    'verification_expire_minutes' => 'Verification link expiration (minutes)',
    'verification_expire_minutes_helper' => 'The number of minutes that the email verification link should be considered valid. Default is 60 minutes (1 hour). Maximum is 10080 minutes (7 days).',
    'enabled_login' => 'Allow visitors to login?',
    'enabled_login_helper' => 'When it is enabled, visitors can log in to your site if they have an account.',
    'enabled_registration' => 'Allow visitors to register account?',
    'enabled_registration_helper' => 'When it is enabled, visitors can register an account on your site.',
    'enable_post_approval' => 'Enable post approval?',
    'enable_post_approval_helper' => 'When it is enabled, properties which posted by an agent will need to be approved by an admin before they are published and display on your site.',
    'default_avatar' => 'Default avatar',
    'default_avatar_helper' => 'Default avatar for member when they do not have an avatar. If you do not select any image, it will be generated using your logo or the first character of member name.',
    'show_terms_checkbox' => 'Show Terms and Policy checkbox?',
    'show_terms_checkbox_helper' => 'When it is enabled, users will need to agree to your Terms and Privacy Policy before they can register an account.',
    'email' => [
        'templates' => [
            'confirm_email' => [
                'title' => 'Confirm email',
                'description' => 'Send email to user when they register an account to verify their email',
                'subject' => 'Confirm Email Notification',
                'verify_link' => 'Verify email link',
                'member_name' => 'Member name',
            ],
            'password_reminder' => [
                'title' => 'Reset password',
                'description' => 'Send email to user when requesting reset password',
                'subject' => 'Reset Password',
                'reset_link' => 'Reset password link',
            ],
            'new_pending_post' => [
                'title' => 'New pending post',
                'description' => 'Send email to admin when a new post created',
                'subject' => 'New post is pending on {{ site_title }} by {{ post_author }}',
                'post_author' => 'Post Author',
                'post_name' => 'Post Name',
                'post_url' => 'Post URL',
            ],
        ],
    ],
];
