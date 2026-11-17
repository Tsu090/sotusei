
document.getElementById("resetForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();

    try {
        const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin + "/new-password.html"
        });

        if (error) {
            console.error("メール送信エラー:", error);
            alert("メール送信に失敗しました。\n" + error.message);
            return;
        }

        alert("再設定メールの送信を受け付けました。\nメールボックスを確認してください。");

    } catch (error) {
        console.error("エラー:", error);
        alert("予期しないエラーが発生しました。");
    }
});
