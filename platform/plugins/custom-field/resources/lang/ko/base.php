<?php

return [
    'admin_menu' => [
        'title' => '사용자 정의 필드',
        'description' => '사용자 정의 필드 보기 및 관리',
    ],

    'page_title' => '사용자 정의 필드',

    'all_field_groups' => '모든 필드 그룹',

    'form' => [
        'create_field_group' => '필드 그룹 생성',
        'edit_field_group' => '필드 그룹 편집',
        'field_items_information' => '필드 항목 정보',

        'repeater_fields' => '반복기',
        'add_field' => '필드 추가',
        'remove_field' => '필드 제거',
        'close_field' => '필드 닫기',
        'new_field' => '새 필드',

        'field_label' => '레이블',
        'field_label_helper' => '필드 항목의 제목입니다. 편집 페이지에 표시됩니다.',
        'field_name' => '필드 이름',
        'field_name_helper' => '필드 항목의 별칭입니다. 숫자, 문자 및 밑줄을 허용합니다.',
        'field_type' => '필드 유형',
        'field_type_helper' => '이 필드의 유형을 선택하세요.',
        'field_instructions' => '필드 지침',
        'field_instructions_helper' => '사용자가 무엇을 입력해야 하는지 쉽게 알 수 있도록 돕는 지침입니다.',

        'default_value' => '기본값',
        'default_value_helper' => '비워둘 때 필드의 기본값',
        'placeholder' => '플레이스홀더',
        'placeholder_helper' => '플레이스홀더 텍스트',
        'rows' => '행',
        'rows_helper' => '이 텍스트 영역의 행 수',
        'choices' => '선택지',
        'choices_helper' => '각 선택지를 새 줄에 입력하세요.<br>더 세밀한 제어를 위해 다음과 같이 값과 레이블을 모두 지정할 수 있습니다:<br>red: 빨강<br>blue: 파랑',
        'button_label' => '반복기 버튼',
        'date_format' => '날짜 형식',
        'date_format_helper' => '날짜 표시 형식을 선택하세요',
        'time_format' => '시간 형식',
        'time_format_helper' => '시간 표시 형식을 선택하세요',

        'groups' => [
            'basic' => '기본',
            'content' => '콘텐츠',
            'choice' => '선택지',
            'other' => '기타',
        ],

        'types' => [
            'text' => '텍스트 필드',
            'textarea' => '텍스트 영역',
            'number' => '숫자',
            'email' => '이메일',
            'password' => '비밀번호',
            'url' => 'URL',
            'date' => '날짜 선택기',
            'datetime' => '날짜 및 시간 선택기',
            'time' => '시간 선택기',
            'color' => '색상 선택기',
            'wysiwyg' => 'WYSIWYG 편집기',
            'image' => '이미지',
            'file' => '파일',
            'select' => '선택',
            'checkbox' => '체크박스',
            'radio' => '라디오',
            'repeater' => '반복기',
        ],

        'rules' => [
            'rules' => '표시 규칙',
            'rules_helper' => '다음 경우에 이 필드 그룹 표시',
            'add_rule_group' => '규칙 그룹 추가',
            'is_equal_to' => '같음',
            'is_not_equal_to' => '같지 않음',
            'and' => '그리고',
            'or' => '또는',
        ],
    ],

    'import' => '가져오기',
    'export' => '내보내기',
    'publish' => '게시',
    'remove_this_line' => '이 줄 제거',
    'collapse_this_line' => '이 줄 접기',
    'error_occurred' => '오류가 발생했습니다',
    'request_completed' => '요청 완료',
    'item_not_existed' => '항목이 존재하지 않습니다',
];
