<?php

return [
    'admin_menu' => [
        'title' => 'ฟิลด์กำหนดเอง',
        'description' => 'ดูและจัดการฟิลด์กำหนดเอง',
    ],

    'page_title' => 'ฟิลด์กำหนดเอง',

    'all_field_groups' => 'กลุ่มฟิลด์ทั้งหมด',

    'form' => [
        'create_field_group' => 'สร้างกลุ่มฟิลด์',
        'edit_field_group' => 'แก้ไขกลุ่มฟิลด์',
        'field_items_information' => 'ข้อมูลรายการฟิลด์',

        'repeater_fields' => 'ฟิลด์ซ้ำ',
        'add_field' => 'เพิ่มฟิลด์',
        'remove_field' => 'ลบฟิลด์',
        'close_field' => 'ปิดฟิลด์',
        'new_field' => 'ฟิลด์ใหม่',

        'field_label' => 'ป้ายชื่อ',
        'field_label_helper' => 'นี่คือชื่อของรายการฟิลด์ จะแสดงในหน้าแก้ไข',
        'field_name' => 'ชื่อฟิลด์',
        'field_name_helper' => 'นามแฝงของรายการฟิลด์ ยอมรับตัวเลข ตัวอักษร และขีดล่าง',
        'field_type' => 'ประเภทฟิลด์',
        'field_type_helper' => 'โปรดเลือกประเภทของฟิลด์นี้',
        'field_instructions' => 'คำแนะนำฟิลด์',
        'field_instructions_helper' => 'คำแนะนำที่ช่วยให้ผู้ใช้เข้าใจได้ง่ายขึ้นว่าต้องป้อนข้อมูลอะไร',

        'default_value' => 'ค่าเริ่มต้น',
        'default_value_helper' => 'ค่าเริ่มต้นของฟิลด์เมื่อเว้นว่างไว้',
        'placeholder' => 'ตัวยึดตำแหน่ง',
        'placeholder_helper' => 'ข้อความตัวยึดตำแหน่ง',
        'rows' => 'แถว',
        'rows_helper' => 'จำนวนแถวของพื้นที่ข้อความนี้',
        'choices' => 'ตัวเลือก',
        'choices_helper' => 'ป้อนแต่ละตัวเลือกในบรรทัดใหม่<br>สำหรับการควบคุมเพิ่มเติม คุณสามารถระบุทั้งค่าและป้ายชื่อได้แบบนี้:<br>red: แดง<br>blue: น้ำเงิน',
        'button_label' => 'ปุ่มสำหรับฟิลด์ซ้ำ',
        'date_format' => 'รูปแบบวันที่',
        'date_format_helper' => 'เลือกรูปแบบการแสดงวันที่',
        'time_format' => 'รูปแบบเวลา',
        'time_format_helper' => 'เลือกรูปแบบการแสดงเวลา',

        'groups' => [
            'basic' => 'พื้นฐาน',
            'content' => 'เนื้อหา',
            'choice' => 'ตัวเลือก',
            'other' => 'อื่นๆ',
        ],

        'types' => [
            'text' => 'ฟิลด์ข้อความ',
            'textarea' => 'พื้นที่ข้อความ',
            'number' => 'ตัวเลข',
            'email' => 'อีเมล',
            'password' => 'รหัสผ่าน',
            'url' => 'URL',
            'date' => 'เครื่องมือเลือกวันที่',
            'datetime' => 'เครื่องมือเลือกวันที่และเวลา',
            'time' => 'เครื่องมือเลือกเวลา',
            'color' => 'เครื่องมือเลือกสี',
            'wysiwyg' => 'ตัวแก้ไข WYSIWYG',
            'image' => 'รูปภาพ',
            'file' => 'ไฟล์',
            'select' => 'เลือก',
            'checkbox' => 'ช่องทำเครื่องหมาย',
            'radio' => 'ปุ่มตัวเลือก',
            'repeater' => 'ฟิลด์ซ้ำ',
        ],

        'rules' => [
            'rules' => 'กฎการแสดงผล',
            'rules_helper' => 'แสดงกลุ่มฟิลด์นี้หาก',
            'add_rule_group' => 'เพิ่มกลุ่มกฎ',
            'is_equal_to' => 'เท่ากับ',
            'is_not_equal_to' => 'ไม่เท่ากับ',
            'and' => 'และ',
            'or' => 'หรือ',
        ],
    ],

    'import' => 'นำเข้า',
    'export' => 'ส่งออก',
    'publish' => 'เผยแพร่',
    'remove_this_line' => 'ลบบรรทัดนี้',
    'collapse_this_line' => 'ยุบบรรทัดนี้',
    'error_occurred' => 'เกิดข้อผิดพลาด',
    'request_completed' => 'คำขอเสร็จสมบูรณ์',
    'item_not_existed' => 'รายการไม่มีอยู่',
];
