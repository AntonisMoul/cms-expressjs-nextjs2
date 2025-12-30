<?php

return [
    'title' => 'メンバー',
    'description' => 'メンバー設定の表示と更新',
    'verify_account_email' => 'アカウントのメールアドレスを認証しますか？',
    'verify_account_email_helper' => '有効にすると、アカウントのメールアドレスに認証リンクが送信され、お客様はログインする前にこのリンクをクリックしてメールアドレスを確認する必要があります。メール認証を送信するには、管理者 -> 設定 -> メールでメールを設定する必要があります。',
    'verification_expire_minutes' => '認証リンクの有効期限（分）',
    'verification_expire_minutes_helper' => 'メール認証リンクが有効とみなされる分数。デフォルトは60分（1時間）です。最大は10080分（7日間）です。',
    'enabled_login' => '訪問者のログインを許可しますか？',
    'enabled_login_helper' => '有効にすると、アカウントを持っている訪問者はサイトにログインできます。',
    'enabled_registration' => '訪問者のアカウント登録を許可しますか？',
    'enabled_registration_helper' => '有効にすると、訪問者はサイトでアカウントを登録できます。',
    'enable_post_approval' => '投稿の承認を有効にしますか？',
    'enable_post_approval_helper' => '有効にすると、エージェントによって投稿されたプロパティは、サイトで公開および表示される前に管理者によって承認される必要があります。',
    'default_avatar' => 'デフォルトのアバター',
    'default_avatar_helper' => 'アバターを持っていないメンバーのデフォルトのアバター。画像を選択しない場合、ロゴまたはメンバー名の最初の文字を使用して生成されます。',
    'show_terms_checkbox' => '利用規約とプライバシーポリシーのチェックボックスを表示しますか？',
    'show_terms_checkbox_helper' => '有効にすると、ユーザーはアカウントを登録する前に利用規約とプライバシーポリシーに同意する必要があります。',
    'email' => [
        'templates' => [
            'confirm_email' => [
                'title' => 'メール確認',
                'description' => 'ユーザーがアカウントを登録したときにメールアドレスを確認するためのメールを送信する',
                'subject' => 'メール確認通知',
                'verify_link' => 'メール確認リンク',
                'member_name' => 'メンバー名',
            ],
            'password_reminder' => [
                'title' => 'パスワードリセット',
                'description' => 'パスワードのリセットを要求したときにユーザーにメールを送信する',
                'subject' => 'パスワードリセット',
                'reset_link' => 'パスワードリセットリンク',
            ],
            'new_pending_post' => [
                'title' => '新しい保留中の投稿',
                'description' => '新しい投稿が作成されたときに管理者にメールを送信する',
                'subject' => '{{ site_title }}で{{ post_author }}による新しい投稿が保留中です',
                'post_author' => '投稿者',
                'post_name' => '投稿名',
                'post_url' => '投稿URL',
            ],
        ],
    ],
];
