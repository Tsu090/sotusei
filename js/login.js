
document.getElementById("loginForm").addEventListener("submit", async function(event) {

    // ページの自動送信を停止
    event.preventDefault();

    // 入力内容を取得
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {

        // Supabaseでログイン認証
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password
        });

        // ログインに失敗した場合
        if (error) {
            alert("ログインに失敗しました。\nメールアドレスまたはパスワードを確認してください。");
            console.error(error);
            return;
        }

        // ログイン成功
        alert("ログインしました！");

        // ホーム画面へ移動
        location.href = "index.html";

    } catch (error) {
        console.error("ログインエラー:", error);
        alert("予期しないエラーが発生しました。");
    }

});
