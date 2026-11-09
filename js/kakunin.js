
// 一時保存したデータを取得
const name = sessionStorage.getItem("name");
const email = sessionStorage.getItem("email");
const password = sessionStorage.getItem("password");

//ニックネーム表示
document.getElementById("confirmName").textContent = name || "";
// メールアドレスを表示
document.getElementById("confirmEmail").textContent = email || "";

// パスワード表示部分
const passwordElement = document.getElementById("confirmPassword");
const toggleButton = document.getElementById("togglePassword");

// 最初は伏せ字で表示
let isPasswordVisible = false;

passwordElement.textContent =
    password ? "＊".repeat(password.length) : "";

// 目のマークを押したときの処理
toggleButton.addEventListener("click", function() {

    if (isPasswordVisible) {
        // パスワードを伏せ字にする
        passwordElement.textContent = "＊".repeat(password.length);
        toggleButton.textContent = "👁";
        isPasswordVisible = false;

    } else {
        // パスワードを表示する
        passwordElement.textContent = password || "";
        toggleButton.textContent = "🙈";
        isPasswordVisible = true;
    }

});
