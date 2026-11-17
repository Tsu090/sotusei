
document.addEventListener("DOMContentLoaded", async function() {

    // ======================================
    // ① ログイン状態の確認
    // ======================================

    const { data, error } =
        await supabaseClient.auth.getSession();

    // ログイン状態を確認できない場合
    if (error) {
        console.error("ログイン状態の確認に失敗しました:", error);
        alert("ログイン状態を確認できませんでした。");
        return;
    }

    // すでにログインしている場合
    if (data.session) {
        location.replace("index.html");
        return;
    }

    // ======================================
    // ② ログイン処理
    // ======================================

    document.getElementById("loginForm").addEventListener("submit", async function(event) {

        // ページの自動送信を停止
        event.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        // ログインボタンを取得
        const loginButton = this.querySelector('button[type="submit"]');

        // 二重クリック防止
        loginButton.disabled = true;

        try {

            // Supabaseでログイン認証
            const { data, error } =
                await supabaseClient.auth.signInWithPassword({
                    email: email,
                    password: password
                });

            // ログイン失敗
            if (error) {
                alert("ログインに失敗しました。\nメールアドレスまたはパスワードを確認してください。");
                console.error(error);
                return;
            }

            // ログイン成功
            alert("ログインしました！");

            // ホーム画面へ移動
            location.replace("index.html");

        } catch (error) {

            console.error("ログインエラー:", error);
            alert("予期しないエラーが発生しました。");

        } finally {
            loginButton.disabled = false;
        }

    });

});
