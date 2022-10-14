<?php
session_start();

if (!empty($_SESSION['id']) && !empty($_SESSION['name']) && !empty($_SESSION['level'])) {
  header('location: ./root/');
}
?>
<!DOCTYPE html>
<html lang="vi">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="./assets/css/login.css">
  <script defer src="https://unpkg.com/jquery@3.6.1/dist/jquery.min.js"></script>
  <script defer type="module" src="./assets/js/login.js"></script>
  <title>Đăng Nhập || Admin</title>
</head>

<body>
  <div id="signin">
    <div class="signin__header">
      <img class="signin__img" src="./assets/images/expert-team.gif" title="ADMIN LOGIN" alt="ADMIN LOGIN">
      <h1 id="signin__heading" title="ADMIN LOGIN">ADMIN LOGIN</h1>
    </div>
    <form id="signin__form" action="process_login_admin.php" method="post">
      <div class="form__group">
        <input required class="form__input" type="email" name="email" placeholder="Tên Đăng Nhập">
      </div>
      <div class="form__group">
        <input class="form__input" type="password" name="password" placeholder="Mật Khẩu" autocomplete="on">
      </div>
      <div class="form__group">
        <button type="submit" class="form__submit">Đăng Nhập</button>
      </div>
    </form>
  </div>
</body>

</html>