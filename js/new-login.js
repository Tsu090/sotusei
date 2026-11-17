
document.getElementById("registerForm").addEventListener("submit", function(event) {

    // ページの自動送信を停止
    event.preventDefault();

    // 入力内容を取得
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("password-confirm").value;

    // パスワードの一致確認
    if (password !== passwordConfirm) {
        alert("パスワードが一致していません。");
        return;
    }

    // パスワードの文字数確認
    if (password.length < 6) {
        alert("パスワードは6文字以上にしてください。");
        return;
    }

    // 入力内容を一時保存
    sessionStorage.setItem("name", name);
    sessionStorage.setItem("email", email);
    sessionStorage.setItem("password", password);

    // 確認ページへ移動
    window.location.href = "kakunin.html";

});
