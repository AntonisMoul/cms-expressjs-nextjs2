<?php

return  [
  'title' => '会员',
  'description' => '查看和更新会员设置',
  'verify_account_email' => '验证账户邮箱？',
  'verify_account_email_helper' => '启用后，验证链接将发送到账户的电子邮件，客户需要点击此链接来验证他们的电子邮件才能登录。需要在管理员 -> 设置 -> 电子邮件中配置电子邮件以发送电子邮件验证。',
  'verification_expire_minutes' => '验证链接过期时间（分钟）',
  'verification_expire_minutes_helper' => '电子邮件验证链接应被视为有效的分钟数。默认为60分钟（1小时）。最长为10080分钟（7天）。',
  'enabled_login' => '允许访客登录？',
  'enabled_login_helper' => '启用后，如果访客有账户，他们可以登录您的网站。',
  'enabled_registration' => '允许访客注册账户？',
  'enabled_registration_helper' => '启用后，访客可以在您的网站上注册账户。',
  'enable_post_approval' => '启用文章审批？',
  'enable_post_approval_helper' => '启用后，代理发布的属性需要管理员批准才能在您的网站上发布和显示。',
  'default_avatar' => '默认头像',
  'default_avatar_helper' => '会员没有头像时的默认头像。如果您不选择任何图像，它将使用您的徽标或会员名称的第一个字符生成。',
  'show_terms_checkbox' => '显示条款和政策复选框？',
  'show_terms_checkbox_helper' => '启用后，用户需要同意您的条款和隐私政策才能注册账户。',
  'email' =>
   [
    'templates' =>
     [
      'confirm_email' =>
       [
        'title' => '确认电子邮件',
        'description' => '当用户注册账户时发送电子邮件以验证其电子邮件',
        'subject' => '确认电子邮件通知',
        'verify_link' => '验证电子邮件链接',
        'member_name' => '会员姓名',
      ],
      'password_reminder' =>
       [
        'title' => '重置密码',
        'description' => '当请求重置密码时向用户发送电子邮件',
        'subject' => '重置密码',
        'reset_link' => '重置密码链接',
      ],
      'new_pending_post' =>
       [
        'title' => '新待审文章',
        'description' => '创建新文章时向管理员发送电子邮件',
        'subject' => '{{ site_title }} 上有新的待审文章，作者：{{ post_author }}',
        'post_author' => '文章作者',
        'post_name' => '文章名称',
        'post_url' => '文章网址',
      ],
    ],
  ],
];
