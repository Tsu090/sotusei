
document.getElementById("registerForm").addEventListener("submit", async function(event) {

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

    // Supabaseが読み込まれているか確認
    if (typeof supabaseClient === "undefined") {
        alert("Supabaseに接続できません。設定を確認してください。");
        return;
    }

    try {

        // Supabase Authに新規登録
        const { data, error } = await supabaseClient.auth.signUp({
            email: email,
            password: password,

            // ニックネームも一緒に保存
            options: {
                data: {
                    nickname: name
                }
            }
        });

        // 登録エラーが発生した場合
        if (error) {
            alert("登録に失敗しました。\n" + error.message);
            return;
        }

        // メール確認が有効な場合
        if (data.user && !data.session) {
            alert("仮登録が完了しました！\n登録したメールアドレスに確認メールを送信しました。メールを確認してください。");
        } else {
            alert("新規登録が完了しました！");
        }

    } catch (error) {
        console.error("登録エラー:", error);
        alert("予期しないエラーが発生しました。");
    }

});
