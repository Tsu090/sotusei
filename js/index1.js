
document.addEventListener("DOMContentLoaded", function () {

    // ======================================
    // 1. プロフィール情報の取得
    // ======================================

    async function loadProfileSettings() {
        const { data, error } =
            await supabaseClient.auth.getUser();

        if (error || !data.user) {
            console.error("ユーザー情報取得エラー:", error);
            return;
        }

        const user = data.user;

        document.getElementById("username").value =
            user.user_metadata?.display_name || "MODEX User";

        document.getElementById("email").value =
            user.email || "";

        // 保存済みプロフィール画像を表示
        const avatarUrl = user.user_metadata?.avatar_url;

        if (avatarUrl) {
            const profileImage = document.getElementById("profileImage");

            profileImage.src = avatarUrl;
            profileImage.style.display = "block";

            document.getElementById("profileInitial").style.display = "none";
        }
    }


    // ======================================
    // 2. プロフィール画像の変更
    // ======================================

    const changeIconBtn = document.getElementById("changeIconBtn");
    const iconFileInput = document.getElementById("iconFileInput");

    changeIconBtn.addEventListener("click", function () {
        iconFileInput.click();
    });

    iconFileInput.addEventListener("change", async function () {

        const file = this.files[0];

        if (!file) return;

        // 画像形式の確認
        if (!["image/jpeg", "image/png"].includes(file.type)) {
            alert("JPGまたはPNG形式の画像を選択してください。");
            this.value = "";
            return;
        }

        // 2MB制限
        if (file.size > 2 * 1024 * 1024) {
            alert("画像サイズは2MB以内にしてください。");
            this.value = "";
            return;
        }

        try {
            // ログインユーザー取得
            const { data: userData, error: userError } =
                await supabaseClient.auth.getUser();

            if (userError) throw userError;

            const user = userData.user;

            if (!user) {
                throw new Error("ログインしてください。");
            }

            // 保存先のファイル名
            const fileExt = file.type === "image/png" ? "png" : "jpg";
            const filePath = `${user.id}/${Date.now()}.${fileExt}`;

            // Supabase Storageにアップロード
            const { error: uploadError } = await supabaseClient
                .storage
                .from("avatars")
                .upload(filePath, file, {
                    contentType: file.type,
                    upsert: false
                });

            if (uploadError) throw uploadError;

            // 公開URLを取得
            const { data: urlData } = supabaseClient
                .storage
                .from("avatars")
                .getPublicUrl(filePath);

            const avatarUrl = urlData.publicUrl;

            // Supabaseのユーザー情報にURLを保存
            const { error: updateError } =
                await supabaseClient.auth.updateUser({
                    data: {
                        avatar_url: avatarUrl
                    }
                });

            if (updateError) throw updateError;

            // 画面に画像を表示
            const profileImage = document.getElementById("profileImage");

            profileImage.src = avatarUrl;
            profileImage.style.display = "block";

            document.getElementById("profileInitial").style.display = "none";

            alert("プロフィール画像を変更しました！");

        } catch (error) {
            console.error("画像変更エラー:", error);
            alert("画像の変更に失敗しました。\n" + error.message);

        } finally {
            this.value = "";
        }
    });


    // ======================================
    // 3. ユーザー名の保存
    // ======================================

    document.getElementById("profileForm")
        .addEventListener("submit", async function (e) {

            e.preventDefault();

            const username =
                document.getElementById("username").value.trim();

            if (!username) {
                alert("ユーザー名を入力してください。");
                return;
            }

            try {
                const { error } =
                    await supabaseClient.auth.updateUser({
                        data: {
                            display_name: username
                        }
                    });

                if (error) throw error;

                updateDisplayedUserName(username);

                alert("ユーザー名を保存しました！");

            } catch (error) {
                console.error("ユーザー名保存エラー:", error);
                alert("保存に失敗しました。\n" + error.message);
            }
        });


    // ======================================
    // 4. MODEX内のユーザー名を更新
    // ======================================

    function updateDisplayedUserName(username) {
        document.querySelectorAll("[data-user-name]")
            .forEach(element => {
                element.textContent = username;
            });
    }


    // ======================================
    // 5. パスワードの変更
    // ======================================

    document.getElementById("passwordForm")
        .addEventListener("submit", async function (e) {

            e.preventDefault();

            const currentPassword =
                document.getElementById("current-password").value;

            const newPassword =
                document.getElementById("new-password").value;

            const confirmPassword =
                document.getElementById("confirm-password").value;

            if (!currentPassword || !newPassword || !confirmPassword) {
                alert("すべての項目を入力してください。");
                return;
            }

            if (newPassword.length < 6) {
                alert("新しいパスワードは6文字以上にしてください。");
                return;
            }

            if (newPassword !== confirmPassword) {
                alert("新しいパスワードが一致しません。");
                return;
            }

            if (currentPassword === newPassword) {
                alert("現在と異なるパスワードを設定してください。");
                return;
            }

            try {
                const { data: userData, error: userError } =
                    await supabaseClient.auth.getUser();

                if (userError) throw userError;

                const user = userData.user;

                if (!user || !user.email) {
                    throw new Error("ログイン情報を取得できません。");
                }

                // 現在のパスワードを確認
                const { error: loginError } =
                    await supabaseClient.auth.signInWithPassword({
                        email: user.email,
                        password: currentPassword
                    });

                if (loginError) {
                    throw new Error("現在のパスワードが正しくありません。");
                }

                // 新しいパスワードを保存
                const { error: updateError } =
                    await supabaseClient.auth.updateUser({
                        password: newPassword
                    });

                if (updateError) throw updateError;

                alert("パスワードを変更しました！");

                document.getElementById("current-password").value = "";
                document.getElementById("new-password").value = "";
                document.getElementById("confirm-password").value = "";

            } catch (error) {
                console.error("パスワード変更エラー:", error);
                alert("パスワード変更に失敗しました。\n" + error.message);
            }
        });


            // ======================================
    // 7. アカウントの削除
    // ======================================

    const deleteAccountBtn =
        document.getElementById("deleteAccountBtn");

    deleteAccountBtn.addEventListener("click", async function () {

        // 削除確認
        const confirmDelete = confirm(
            "本当にアカウントを削除しますか？\nこの操作は取り消せません。"
        );

        if (!confirmDelete) return;

        try {
            // ログイン情報を取得
            const { data, error } =
                await supabaseClient.auth.getSession();

            if (error) throw error;

            const session = data.session;

            if (!session) {
                throw new Error("ログイン情報が確認できません。");
            }

            // Edge Functionを呼び出す
            const { data: result, error: functionError } =
                await supabaseClient.functions.invoke(
                    "delete-account",
                    {
                        method: "POST"
                    }
                );

            if (functionError) throw functionError;

            if (!result || !result.success) {
                throw new Error(
                    result?.error || "アカウント削除に失敗しました。"
                );
            }

            alert("アカウントを削除しました。");

            // ログアウト
            await supabaseClient.auth.signOut();

            // ログイン画面へ移動
            window.location.href = "login.html";

        } catch (error) {
            console.error("アカウント削除エラー:", error);

            alert(
                "アカウント削除に失敗しました。\n" +
                (error.message || "原因不明のエラーです。")
            );
        }
    });
    
    // ======================================
    // 6. 初期読み込み
    // ======================================

    loadProfileSettings();

});
