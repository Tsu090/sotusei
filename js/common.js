document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================
     * ① プロフィールドロワーの開閉管理
     * ========================================== */
    const openBtn = document.querySelector('.profile-open');
    const drawer = document.getElementById('profileDrawer');
    const overlay = document.getElementById('drawerOverlay');

    if (openBtn && drawer && overlay) {
        const openDrawer = () => {
            drawer.classList.add('is-active');
            overlay.classList.add('is-active');
        };

        const closeDrawer = () => {
            drawer.classList.remove('is-active');
            overlay.classList.remove('is-active');
        };

        openBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (drawer.classList.contains('is-active')) {
                closeDrawer();
            } else {
                openDrawer();
            }
        });

        overlay.addEventListener('click', closeDrawer);
    }


    /* ==========================================
     * ② ログアウト確認ダイアログ（中央モーダル版）
     * ========================================== */
    const logoutTriggerBtns = document.querySelectorAll('.logout-btn'); // 複数ある場合を考慮
    const logoutModal = document.getElementById('logoutModal');
    const confirmLogoutBtn = document.getElementById('confirmLogoutBtn');
    const morePopupMenuRef = document.getElementById('morePopupMenu'); // その他メニュー（もしあれば）

    if (logoutModal) {
        // モーダルを閉じる関数
        const closeLogoutModal = () => {
            logoutModal.classList.remove('is-active');
        };

        // ログアウトボタンが押されたとき
        logoutTriggerBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                
                // 開いている「その他メニュー」があれば閉じる
                if (morePopupMenuRef) {
                    morePopupMenuRef.classList.remove('is-active');
                }
                
                // 画面中央のログアウトモーダルを表示
                logoutModal.classList.add('is-active');
            });
        });

        // キャンセルボタンなどで閉じる
        const closeTriggers = logoutModal.querySelectorAll('.logout-close-trigger');
        closeTriggers.forEach(btn => {
            btn.addEventListener('click', closeLogoutModal);
        });

        // 背景の暗い部分をクリックしても閉じる
        logoutModal.addEventListener('click', (e) => {
            if (e.target === logoutModal) {
                closeLogoutModal();
            }
        });

        // ★中央モーダル内の「本当にログアウトする」ボタンが押されたとき
        if (confirmLogoutBtn) {
            confirmLogoutBtn.addEventListener('click', () => {
                console.log('ログアウトしました');
                window.location.href = 'login.html';
                closeLogoutModal();
            });
        }
    }

});

const moreBtn = document.getElementById('menu'); // id="menu" に変更
const morePopupMenu = document.getElementById('morePopupMenu');

if (moreBtn && morePopupMenu) {
    moreBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        morePopupMenu.classList.toggle('is-active');
    });

    document.addEventListener('click', (e) => {
        if (!morePopupMenu.contains(e.target) && !moreBtn.contains(e.target)) {
            morePopupMenu.classList.remove('is-active');
        }
    });
}


const reportProblemBtn = document.getElementById('reportProblemBtn');
const reportModal = document.getElementById('reportModal');
const reportTextarea = document.getElementById('reportTextarea');
const submitBtn = document.getElementById('submitReportBtn');
const reportFormView = document.getElementById('reportFormView');
const reportSuccessView = document.getElementById('reportSuccessView');
const morePopupMenuRef = document.getElementById('morePopupMenu');

if (reportProblemBtn && reportModal) {
    // モーダルを閉じる関数（次回開くときに入力画面に戻す）
    const closeModal = () => {
        reportModal.classList.remove('is-active');
        setTimeout(() => {
            if (reportFormView) reportFormView.style.display = 'block';
            if (reportSuccessView) reportSuccessView.style.display = 'none';
            if (reportTextarea) {
                reportTextarea.value = '';
                reportTextarea.classList.remove('has-error');
            }
        }, 200);
    };

    // メニューから「問題を報告する」を押したとき
    reportProblemBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (morePopupMenuRef) morePopupMenuRef.classList.remove('is-active');
        
        // 開くときは必ず入力画面を最初に見せる
        if (reportFormView) reportFormView.style.display = 'block';
        if (reportSuccessView) reportSuccessView.style.display = 'none';
        
        reportModal.classList.add('is-active');
    });

    // 閉じるボタン
    const closeTriggers = reportModal.querySelectorAll('.modal-close-trigger');
    closeTriggers.forEach(btn => btn.addEventListener('click', closeModal));
    
    reportModal.addEventListener('click', (e) => {
        if (e.target === reportModal) closeModal();
    });

    // 入力したらエラーを消す
    if (reportTextarea) {
        reportTextarea.addEventListener('input', () => {
            if (reportTextarea.value.trim() !== '') {
                reportTextarea.classList.remove('has-error');
            }
        });
    }

    // 送信ボタンが押されたとき（未入力チェック ＋ 完了画面への切り替え）
    if (submitBtn && reportTextarea) {
        submitBtn.addEventListener('click', () => {
            if (reportTextarea.value.trim() === '') {
                reportTextarea.classList.add('has-error');
                reportTextarea.focus();
                return;
            }

            // バリデーションOKなら入力画面を隠して「ご報告ありがとうございます」を表示
            if (reportFormView) reportFormView.style.display = 'none';
            if (reportSuccessView) reportSuccessView.style.display = 'block';
        });
    }
}



document.addEventListener('DOMContentLoaded', () => {
    // 画面全体でクリックを監視する（ボタンが後から読み込まれても確実に反応します）
    window.addEventListener('click', (e) => {
        const mainMenuBtn = e.target.closest('#main-menu');
        const openModalBtn = e.target.closest('#openModalBtn');
        const cancelBtn = e.target.closest('.btn-cancel');
        const modalOverlay = document.querySelector('.add-item-modal-overlay');

        // 1. 「#main-menu」または「#openModalBtn」がクリックされたとき
        if ((mainMenuBtn || openModalBtn) && modalOverlay) {
            modalOverlay.classList.add('is-active');
        }

        // 2. 「キャンセルボタン」がクリックされたとき
        if (cancelBtn && modalOverlay) {
            modalOverlay.classList.remove('is-active');
        }

        // 3. モーダルの背景（オーバーレイ部分）がクリックされたとき
        if (modalOverlay && e.target === modalOverlay) {
            modalOverlay.classList.remove('is-active');
        }
    });

    // 各選択カードのクリックイベント（こちらは通常通りでOK）
    const modalOverlay = document.querySelector('.add-item-modal-overlay');
    if (modalOverlay) {
        const selectionCards = modalOverlay.querySelectorAll('.selection-card');
        selectionCards.forEach((card, index) => {
            card.addEventListener('click', () => {
                switch(index) {
                    case 0:
                        console.log('「カメラで撮影」が選択されました');
                        break;
                    case 1:
                        console.log('「アルバム・ファイルから選択」が選択されました');
                        break;
                    case 2:
                        console.log('「ウェブ検索」が選択されました');
                        break;
                    case 3:
                        console.log('「AI自動追加」が選択されました');
                        break;
                }
                modalOverlay.classList.remove('is-active');
            });
        });
    }
});