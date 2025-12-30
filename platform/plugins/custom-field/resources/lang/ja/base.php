<?php

return [
    'admin_menu' => [
        'title' => 'カスタムフィールド',
        'description' => 'カスタムフィールドの表示と管理',
    ],

    'page_title' => 'カスタムフィールド',

    'all_field_groups' => 'すべてのフィールドグループ',

    'form' => [
        'create_field_group' => 'フィールドグループを作成',
        'edit_field_group' => 'フィールドグループを編集',
        'field_items_information' => 'フィールドアイテム情報',

        'repeater_fields' => 'リピーター',
        'add_field' => 'フィールドを追加',
        'remove_field' => 'フィールドを削除',
        'close_field' => 'フィールドを閉じる',
        'new_field' => '新しいフィールド',

        'field_label' => 'ラベル',
        'field_label_helper' => 'これはフィールドアイテムのタイトルです。編集ページに表示されます。',
        'field_name' => 'フィールド名',
        'field_name_helper' => 'フィールドアイテムのエイリアス。数字、文字、アンダースコアを使用できます。',
        'field_type' => 'フィールドタイプ',
        'field_type_helper' => 'このフィールドのタイプを選択してください。',
        'field_instructions' => 'フィールドの説明',
        'field_instructions_helper' => 'ユーザーが入力する内容を理解しやすくするための説明。',

        'default_value' => 'デフォルト値',
        'default_value_helper' => '空白のままにした場合のフィールドのデフォルト値',
        'placeholder' => 'プレースホルダー',
        'placeholder_helper' => 'プレースホルダーテキスト',
        'rows' => '行数',
        'rows_helper' => 'このテキストエリアの行数',
        'choices' => '選択肢',
        'choices_helper' => '各選択肢を新しい行に入力してください。<br>より詳細な制御のために、値とラベルの両方を次のように指定できます:<br>red: 赤<br>blue: 青',
        'button_label' => 'リピーター用のボタン',
        'date_format' => '日付形式',
        'date_format_helper' => '日付の表示形式を選択',
        'time_format' => '時刻形式',
        'time_format_helper' => '時刻の表示形式を選択',

        'groups' => [
            'basic' => '基本',
            'content' => 'コンテンツ',
            'choice' => '選択肢',
            'other' => 'その他',
        ],

        'types' => [
            'text' => 'テキストフィールド',
            'textarea' => 'テキストエリア',
            'number' => '数値',
            'email' => 'メール',
            'password' => 'パスワード',
            'url' => 'URL',
            'date' => '日付ピッカー',
            'datetime' => '日時ピッカー',
            'time' => '時刻ピッカー',
            'color' => 'カラーピッカー',
            'wysiwyg' => 'WYSIWYGエディター',
            'image' => '画像',
            'file' => 'ファイル',
            'select' => '選択',
            'checkbox' => 'チェックボックス',
            'radio' => 'ラジオボタン',
            'repeater' => 'リピーター',
        ],

        'rules' => [
            'rules' => '表示ルール',
            'rules_helper' => 'このフィールドグループを表示する条件',
            'add_rule_group' => 'ルールグループを追加',
            'is_equal_to' => '等しい',
            'is_not_equal_to' => '等しくない',
            'and' => 'かつ',
            'or' => 'または',
        ],
    ],

    'import' => 'インポート',
    'export' => 'エクスポート',
    'publish' => '公開',
    'remove_this_line' => 'この行を削除',
    'collapse_this_line' => 'この行を折りたたむ',
    'error_occurred' => 'エラーが発生しました',
    'request_completed' => 'リクエストが完了しました',
    'item_not_existed' => 'アイテムが存在しません',
];
