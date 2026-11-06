  document.getElementById("account").textContent =
        sessionStorage.getItem("email") || "メールアドレスがありません";

    // パスワードの一致確認
    document.getElementById("password-form")
        .addEventListener("submit", function(e) {

        e.preventDefault();

        const password =
            document.getElementById("new-password").value;

        const confirm =
            document.getElementById("confirm-password").value;

        if (password !== confirm) {
            document.getElementById("error-message").textContent =
                "パスワードが一致しません。";
            return;
        }

        document.getElementById("error-message").textContent =
            "入力内容を確認しました。";
    });