
document.getElementById("password-form")
    .addEventListener("submit", async function(e) {

    e.preventDefault();

    const password =
        document.getElementById("new-password").value;

    const confirm =
        document.getElementById("confirm-password").value;

    const errorMessage =
        document.getElementById("error-message");

    // パスワードの一致確認
    if (password !== confirm) {
        errorMessage.textContent =
            "パスワードが一致しません。";
        return;
    }

    // パスワードの文字数確認
    if (password.length < 6) {
        errorMessage.textContent =
            "パスワードは6文字以上にしてください。";
        return;
    }

    // Supabaseへの接続確認
    if (typeof supabaseClient === "undefined") {
        errorMessage.textContent =
            "Supabaseに接続できません。";
        return;
    }

    try {
        // Supabaseのパスワードを更新
        const { data, error } =
            await supabaseClient.auth.updateUser({
                password: password
            });

        if (error) {
            console.error("パスワード変更エラー:", error);

            errorMessage.textContent =
                "パスワードの変更に失敗しました。";

            return;
        }

      // 更新成功
        alert("パスワードを変更しました！");

        // ログアウトする
        const { error: logoutError } =
            await supabaseClient.auth.signOut();

        if (logoutError) {
            console.error("ログアウトエラー:", logoutError);
        }

        // 完了画面へ移動
        location.href = "new-password2.html";

    } catch (error) {
        console.error("予期しないエラー:", error);

        errorMessage.textContent =
            "エラーが発生しました。もう一度お試しください。";
    }
});
