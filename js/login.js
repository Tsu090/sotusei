
document.addEventListener("DOMContentLoaded", async function() {

    // ======================================
    // ① ログイン状態の確認
    // ======================================

    const { data, error } =
        await supabaseClient.auth.getSession();

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
    // ② メールアドレス・パスワードでログイン
    // ======================================

    document.getElementById("loginForm").addEventListener("submit", async function(event) {

        event.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        const loginButton = this.querySelector('button[type="submit"]');
        loginButton.disabled = true;

        try {
            const { data, error } =
                await supabaseClient.auth.signInWithPassword({
                    email: email,
                    password: password
                });

            if (error) {
                alert("ログインに失敗しました。\nメールアドレスまたはパスワードを確認してください。");
                console.error(error);
                return;
            }

            alert("ログインしました！");
            location.replace("index.html");

        } catch (error) {
            console.error("ログインエラー:", error);
            alert("予期しないエラーが発生しました。");

        } finally {
            loginButton.disabled = false;
        }
    });

    // ======================================
    // ③ Googleログイン
    // ======================================

    document.getElementById("googleLogin").addEventListener("click", async function() {

        try {
            const { error } =
                await supabaseClient.auth.signInWithOAuth({
                    provider: "google",
                    options: {
                        redirectTo: new URL("index.html", window.location.href).href
                    }
                });

            if (error) {
                console.error("Googleログインエラー:", error);
                alert("Googleログインに失敗しました。");
            }

        } catch (error) {
            console.error(error);
            alert("予期しないエラーが発生しました。");
        }
    });

});
