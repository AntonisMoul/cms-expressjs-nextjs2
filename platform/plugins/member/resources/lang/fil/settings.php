<?php

return [
    'title' => 'Miyembro',
    'description' => 'Tingnan at i-update ang mga setting ng miyembro',
    'verify_account_email' => 'I-verify ang email ng account?',
    'verify_account_email_helper' => 'Kapag ito ay naka-enable, isang verification link ay ipapadala sa email ng account, kailangan ng mga customer na i-click ang link na ito upang ma-verify ang kanilang email bago sila makapag-log in. Kailangan i-configure ang email sa Admin -> Settings -> Email upang makapagpadala ng email verification.',
    'verification_expire_minutes' => 'Pag-expire ng verification link (minuto)',
    'verification_expire_minutes_helper' => 'Ang bilang ng mga minuto na dapat ituring na valid ang email verification link. Default ay 60 minuto (1 oras). Maximum ay 10080 minuto (7 araw).',
    'enabled_login' => 'Payagan ang mga bisita na mag-login?',
    'enabled_login_helper' => 'Kapag ito ay naka-enable, maaaring mag-log in ang mga bisita sa iyong site kung mayroon silang account.',
    'enabled_registration' => 'Payagan ang mga bisita na magrehistro ng account?',
    'enabled_registration_helper' => 'Kapag ito ay naka-enable, maaaring magrehistro ang mga bisita ng account sa iyong site.',
    'enable_post_approval' => 'I-enable ang pag-apruba ng post?',
    'enable_post_approval_helper' => 'Kapag ito ay naka-enable, ang mga property na nai-post ng isang ahente ay kailangang aprubahan ng admin bago ito mai-publish at ipakita sa iyong site.',
    'default_avatar' => 'Default na avatar',
    'default_avatar_helper' => 'Default na avatar para sa miyembro kapag wala silang avatar. Kung hindi ka pumili ng kahit anong larawan, ito ay bubuo gamit ang iyong logo o ang unang character ng pangalan ng miyembro.',
    'show_terms_checkbox' => 'Ipakita ang checkbox ng Mga Tuntunin at Patakaran?',
    'show_terms_checkbox_helper' => 'Kapag ito ay naka-enable, kailangan ng mga user na sumang-ayon sa iyong Mga Tuntunin at Privacy Policy bago sila makapag-rehistro ng account.',
    'email' => [
        'templates' => [
            'confirm_email' => [
                'title' => 'Kumpirmahin ang email',
                'description' => 'Magpadala ng email sa user kapag nagrehistro sila ng account upang ma-verify ang kanilang email',
                'subject' => 'Abiso ng Pagkumpirma ng Email',
                'verify_link' => 'I-verify ang email link',
                'member_name' => 'Pangalan ng miyembro',
            ],
            'password_reminder' => [
                'title' => 'I-reset ang password',
                'description' => 'Magpadala ng email sa user kapag humiling ng pag-reset ng password',
                'subject' => 'I-reset ang Password',
                'reset_link' => 'I-reset ang password link',
            ],
            'new_pending_post' => [
                'title' => 'Bagong nakabinbing post',
                'description' => 'Magpadala ng email sa admin kapag may bagong post na nilikha',
                'subject' => 'Bagong post ay nakabinbin sa {{ site_title }} ni {{ post_author }}',
                'post_author' => 'May-akda ng Post',
                'post_name' => 'Pangalan ng Post',
                'post_url' => 'URL ng Post',
            ],
        ],
    ],
];
