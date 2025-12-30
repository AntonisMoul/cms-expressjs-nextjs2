<?php

return  [
  'title' => 'Thành viên',
  'description' => 'Xem và cập nhật cài đặt thành viên',
  'verify_account_email' => 'Xác thực email tài khoản?',
  'verify_account_email_helper' => 'Khi bật, một liên kết xác thực sẽ được gửi đến email của tài khoản, khách hàng cần nhấp vào liên kết này để xác thực email trước khi đăng nhập. Cần cấu hình email trong Quản trị -> Cài đặt -> Email để gửi xác thực email.',
  'verification_expire_minutes' => 'Thời hạn liên kết xác thực (phút)',
  'verification_expire_minutes_helper' => 'Số phút mà liên kết xác thực email có hiệu lực. Mặc định là 60 phút (1 giờ). Tối đa là 10080 phút (7 ngày).',
  'enabled_login' => 'Cho phép khách truy cập đăng nhập?',
  'enabled_login_helper' => 'Khi được bật, khách truy cập có thể đăng nhập vào trang web nếu họ có tài khoản.',
  'enabled_registration' => 'Cho phép khách truy cập đăng ký tài khoản?',
  'enabled_registration_helper' => 'Khi được bật, khách truy cập có thể đăng ký tài khoản trên trang web.',
  'enable_post_approval' => 'Bật phê duyệt bài viết?',
  'enable_post_approval_helper' => 'Khi được bật, các bài viết được đăng bởi người dùng sẽ cần được quản trị viên phê duyệt trước khi xuất bản và hiển thị trên trang web.',
  'default_avatar' => 'Ảnh đại diện mặc định',
  'default_avatar_helper' => 'Ảnh đại diện mặc định cho thành viên khi họ chưa có ảnh đại diện. Nếu bạn không chọn ảnh nào, nó sẽ được tạo bằng logo hoặc ký tự đầu tiên của tên thành viên.',
  'show_terms_checkbox' => 'Hiển thị ô đánh dấu Điều khoản và Chính sách?',
  'show_terms_checkbox_helper' => 'Khi được bật, người dùng sẽ cần đồng ý với Điều khoản và Chính sách bảo mật của bạn trước khi đăng ký tài khoản.',
  'email' =>
   [
    'templates' =>
     [
      'confirm_email' =>
       [
        'title' => 'Xác nhận email',
        'description' => 'Gửi email cho người dùng khi họ đăng ký tài khoản để xác thực email',
        'subject' => 'Thông báo xác nhận email',
        'verify_link' => 'Liên kết xác thực email',
        'member_name' => 'Tên thành viên',
      ],
      'password_reminder' =>
       [
        'title' => 'Đặt lại mật khẩu',
        'description' => 'Gửi email cho người dùng khi yêu cầu đặt lại mật khẩu',
        'subject' => 'Đặt lại mật khẩu',
        'reset_link' => 'Liên kết đặt lại mật khẩu',
      ],
      'new_pending_post' =>
       [
        'title' => 'Bài viết mới đang chờ',
        'description' => 'Gửi email cho quản trị viên khi có bài viết mới được tạo',
        'subject' => 'Bài viết mới đang chờ trên {{ site_title }} bởi {{ post_author }}',
        'post_author' => 'Tác giả bài viết',
        'post_name' => 'Tên bài viết',
        'post_url' => 'URL bài viết',
      ],
    ],
  ],
];
