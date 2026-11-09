
document.getElementById("registerForm").addEventListener("submit", function(event) {

    // ページの自動送信を停止
    event.preventDefault();

    // 入力内容を取得
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("password-confirm").value;

    // パスワードの一致確認
    if (password !== passwordConfirm) {
        alert("パスワードが一致していません。");
        return;
    }

    // 入力内容を一時保存（画面遷移用）
    sessionStorage.setItem("name", name);
    sessionStorage.setItem("email", email);
    sessionStorage.setItem("password", password);

    // 確認画面へ移動
    location.href = "kakunin.html";

});
