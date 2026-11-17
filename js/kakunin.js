
document.addEventListener("DOMContentLoaded", function() {

    // 一時保存したデータを取得
    const name = sessionStorage.getItem("name");
    const email = sessionStorage.getItem("email");
    const password = sessionStorage.getItem("password");

    // HTMLの表示部分を取得
    const nameElement = document.getElementById("confirmName");
    const emailElement = document.getElementById("confirmEmail");
    const passwordElement = document.getElementById("confirmPassword");
    const toggleButton = document.getElementById("togglePassword");
    const confirmButton = document.getElementById("confirmRegister");

    // ニックネームとメールアドレスを表示
    nameElement.textContent = name || "";
    emailElement.textContent = email || "";

    // パスワードが保存されていない場合
    if (!name || !email || !password) {
        alert("入力情報が確認できません。最初から登録してください。");
        window.location.href = "new-login.html";
        return;
    }

    // パスワードを最初は伏せ字で表示
    let isPasswordVisible = false;

    passwordElement.textContent = "＊".repeat(password.length);

    // 目のマークを押したとき
    toggleButton.addEventListener("click", function() {

        if (isPasswordVisible) {
            passwordElement.textContent = "＊".repeat(password.length);
            toggleButton.textContent = "👁";
            isPasswordVisible = false;

        } else {
            passwordElement.textContent = password;
            toggleButton.textContent = "🙈";
            isPasswordVisible = true;
        }

    });

    // 確定ボタンを押したとき
    confirmButton.addEventListener("click", async function(event) {

        event.preventDefault();

        // 二重登録を防止
        confirmButton.style.pointerEvents = "none";
        confirmButton.style.opacity = "0.5";

        // Supabaseの接続確認
        if (typeof supabaseClient === "undefined") {
            alert("Supabaseに接続できません。");
            confirmButton.style.pointerEvents = "auto";
            confirmButton.style.opacity = "1";
            return;
        }

        try {

            // Supabase Authに新規登録
            const { data, error } = await supabaseClient.auth.signUp({
                email: email,
                password: password,

                options: {
                    data: {
                        nickname: name
                    }
                }
            });

            // 登録エラー
            if (error) {
                alert("登録に失敗しました。\n" + error.message);

                confirmButton.style.pointerEvents = "auto";
                confirmButton.style.opacity = "1";
                return;
            }

            // 登録成功
            if (data.user) {

                // 一時保存した個人情報を削除
                sessionStorage.removeItem("name");
                sessionStorage.removeItem("email");
                sessionStorage.removeItem("password");

                if (!data.session) {
                    alert(
                        "仮登録が完了しました！\n" +
                        "登録したメールアドレスに確認メールを送信しました。\n" +
                        "メール内のURLから認証を完了してください。"
                    );
                } else {
                    alert("新規登録が完了しました！");
                }

                // ログイン画面へ移動
                window.location.href = "login.html";
            }

        } catch (error) {

            console.error("登録エラー:", error);
            alert("予期しないエラーが発生しました。");

            confirmButton.style.pointerEvents = "auto";
            confirmButton.style.opacity = "1";

        }

    });

});
