<?php

return [
    'title' => '회원',
    'description' => '회원 설정 보기 및 업데이트',
    'verify_account_email' => '계정 이메일을 확인하시겠습니까?',
    'verify_account_email_helper' => '활성화되면 확인 링크가 계정 이메일로 전송되며, 고객은 로그인하기 전에 이메일을 확인하기 위해 이 링크를 클릭해야 합니다. 이메일 확인을 보내려면 관리자 -> 설정 -> 이메일에서 이메일을 구성해야 합니다.',
    'verification_expire_minutes' => '확인 링크 만료 시간(분)',
    'verification_expire_minutes_helper' => '이메일 확인 링크가 유효한 것으로 간주되어야 하는 시간(분)입니다. 기본값은 60분(1시간)입니다. 최대값은 10080분(7일)입니다.',
    'enabled_login' => '방문자의 로그인을 허용하시겠습니까?',
    'enabled_login_helper' => '활성화되면 계정이 있는 방문자가 사이트에 로그인할 수 있습니다.',
    'enabled_registration' => '방문자의 계정 등록을 허용하시겠습니까?',
    'enabled_registration_helper' => '활성화되면 방문자가 사이트에 계정을 등록할 수 있습니다.',
    'enable_post_approval' => '게시물 승인을 활성화하시겠습니까?',
    'enable_post_approval_helper' => '활성화되면 에이전트가 게시한 속성은 게시되고 사이트에 표시되기 전에 관리자의 승인이 필요합니다.',
    'default_avatar' => '기본 아바타',
    'default_avatar_helper' => '회원이 아바타가 없을 때 사용할 기본 아바타입니다. 이미지를 선택하지 않으면 로고 또는 회원 이름의 첫 글자를 사용하여 생성됩니다.',
    'show_terms_checkbox' => '약관 및 정책 체크박스를 표시하시겠습니까?',
    'show_terms_checkbox_helper' => '활성화되면 사용자는 계정을 등록하기 전에 이용 약관 및 개인정보 보호정책에 동의해야 합니다.',
    'email' => [
        'templates' => [
            'confirm_email' => [
                'title' => '이메일 확인',
                'description' => '사용자가 계정을 등록할 때 이메일을 확인하기 위해 이메일 보내기',
                'subject' => '이메일 확인 알림',
                'verify_link' => '이메일 확인 링크',
                'member_name' => '회원 이름',
            ],
            'password_reminder' => [
                'title' => '비밀번호 재설정',
                'description' => '비밀번호 재설정을 요청할 때 사용자에게 이메일 보내기',
                'subject' => '비밀번호 재설정',
                'reset_link' => '비밀번호 재설정 링크',
            ],
            'new_pending_post' => [
                'title' => '새로운 보류 중인 게시물',
                'description' => '새 게시물이 생성되면 관리자에게 이메일 보내기',
                'subject' => '{{ post_author }}님이 {{ site_title }}에 새 게시물을 대기 중입니다',
                'post_author' => '게시물 작성자',
                'post_name' => '게시물 이름',
                'post_url' => '게시물 URL',
            ],
        ],
    ],
];
