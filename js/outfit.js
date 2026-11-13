document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================
     * ① ホイール操作を横スクロールに変換
     * ========================================== */
    const outfitGrids = document.querySelectorAll('.outfit-grid');
    if (outfitGrids.length > 0) {
        outfitGrids.forEach(grid => {
            grid.addEventListener('wheel', (e) => {
                if (e.deltaY !== 0) {
                    e.preventDefault();
                    grid.scrollLeft += e.deltaY;
                }
            }, { passive: false });
        });
    }


    /* ==========================================
     * ② お気に入りボタンの切り替え処理（.coord-card用）
     * ========================================== */
    const favoriteButtons = document.querySelectorAll('.coord-card .favorite-btn');
    if (favoriteButtons.length > 0) {
        favoriteButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation(); 
                const card = button.closest('.coord-card');
                if (!card) return;

                const isFavorite = card.getAttribute('data-favorite') === 'true';

                if (isFavorite) {
                    card.setAttribute('data-favorite', 'false');
                    card.classList.remove('favorited');
                } else {
                    card.setAttribute('data-favorite', 'true');
                    card.classList.add('favorited');
                }
            });
        });
    }


    /* ==========================================
     * ③ Myコーデ専用のシーズン＆お気に入りフィルター（【独自コード】として実装）
     * ========================================== */
    const outfitFilter = document.querySelector('.outfit-title-filter select'); 
    const coordCards = document.querySelectorAll('.coord-card');

    if (outfitFilter && coordCards.length > 0) {
        const applyOutfitFilter = () => {
            const filterType = outfitFilter.value; 

            coordCards.forEach(card => {
                const isFavorite = card.getAttribute('data-favorite') === 'true';
                const season = card.getAttribute('data-season');

                if (filterType === 'all') {
                    card.classList.remove('hidden');
                } else if (filterType === 'favorite') {
                    card.classList.toggle('hidden', !isFavorite);
                } else {
                    card.classList.toggle('hidden', season !== filterType);
                }
            });
        };

        outfitFilter.addEventListener('change', applyOutfitFilter);
        applyOutfitFilter(); // 初期表示時
    }


    /* ==========================================
     * ④ コーデ編集ドロアー内の「服のフィルター」（【共通関数】を利用！）
     * ========================================== */
    // common.js にある共通関数を呼び出すだけで、ドロアー内の服の絞り込みが動きます！
    // 第1引数: ドロアーのセレクトボックスID, 第2引数: ドロアー内の服カード, 第3引数: 初期値
    initCategoryFilter('drawerCategoryFilter', '#drawerGrid .item-card', 'all');


    /* ==========================================
     * ⑤ Myコーデ用モーダルの開閉処理
     * ========================================== */
    /* ==========================================
     * 💡 コーデボードの中身を初期状態に戻す関数
     * ========================================== */
    const resetCoordBoard = () => {
        // 各スロットを初期の絵文字に戻す
        const topSlot = document.querySelector('.coord-item-slot.item-top');
        const outerSlot = document.querySelector('.coord-item-slot.item-outer');
        const bottomSlot = document.querySelector('.coord-item-slot.item-bottom');
        const shoesSlot = document.querySelector('.coord-item-slot.item-shoes');
        const accessorySlot = document.querySelector('.coord-item-slot.item-accessory');

        // 選択済みクラスがあれば削除
        document.querySelectorAll('.coord-item-slot').forEach(slot => {
            slot.classList.remove('has-item');
        });
    };


    /* ==========================================
     * Myコーデ用モーダルの開閉処理（初期化を連動させる）
     * ========================================== */
    const coordModal = document.querySelector('.coord-detail-modal-overlay'); 
    const coordPreviewImage = document.getElementById('coordPreviewImage'); 
    const cancelBtn = document.getElementById('coordModalCancelBtn'); 

    // （既存のカードクリックで詳細が開く処理はそのまま…）

    // 💡 キャンセルボタンを押して閉じるときにリセットを走らせる
    if (cancelBtn && coordModal) {
        cancelBtn.addEventListener('click', () => {
            coordModal.classList.remove('is-active');
            resetCoordBoard(); // ←ここでリセット！
        });
    }

    // 💡 背景クリックで閉じるときにリセットを走らせる
    if (coordModal) {
        coordModal.addEventListener('click', (e) => {
            if (e.target === coordModal) {
                coordModal.classList.remove('is-active');
                resetCoordBoard(); // ←ここでリセット！
            }
        });
    }

    const openDrawerBtn = document.getElementById('openDrawerBtn');
    const coordDrawer = document.querySelector('.coord-drawer');

    // 1. ボタンを押したら開く
    if (openDrawerBtn && coordDrawer) {
        openDrawerBtn.addEventListener('click', () => {
            coordDrawer.classList.add('is-open');
        });
    }

    // 2. 背景（黒い幕の部分）をクリックしてドロアーを閉じるときにリセットを走らせる
    if (coordDrawer) {
        coordDrawer.addEventListener('click', (e) => {
            if (e.target === coordDrawer) {
                coordDrawer.classList.remove('is-open');
                resetCoordBoard(); // ←ここでリセット！
            }
        });
    }

    /* ==========================================
     * 服一覧（.drawer-grid）をマウスホイールで横スクロールさせる
     * ========================================== */
    const drawerGrid = document.getElementById('drawerGrid');

    if (drawerGrid) {
        drawerGrid.addEventListener('wheel', (e) => {
            // 縦方向のホイール入力を横方向の移動量に変換する
            if (e.deltaY !== 0) {
                e.preventDefault(); // 画面全体の縦スクロールを防ぐ
                drawerGrid.scrollLeft += e.deltaY; // ホイールの回転量に合わせて横スクロールさせる
            }
        }, { passive: false });
    }

    /* ==========================================
     * 服カードをクリックしたとき、対応するスロットに配置する処理
     * ========================================== */
    const itemCards = document.querySelectorAll('.drawer-grid .item-card');

    itemCards.forEach(card => {
        card.addEventListener('click', (e) => {
            e.stopPropagation(); // 外側のイベントへの伝播をストップ

            // ハートボタンが押された場合は除外
            if (e.target.closest('.favorite-btn')) {
                return; 
            }

            const category = card.getAttribute('data-category'); 
            
            // 💡【修正】画像要素（<img>）のsrcだけを安全に取得する
            const cardImg = card.querySelector('.image-wrapper img');
            if (!cardImg) return;
            const imgSrc = cardImg.src;

            // 対応するスロットを探す
            let targetSlot = null;
            if (category === 'tops') {
                targetSlot = document.querySelector('.coord-item-slot.item-top');
            } else if (category === 'outer') {
                targetSlot = document.querySelector('.coord-item-slot.item-outer');
            } else if (category === 'bottoms') {
                targetSlot = document.querySelector('.coord-item-slot.item-bottom');
            } else if (category === 'shoes') {
                targetSlot = document.querySelector('.coord-item-slot.item-shoes');
            } else if (category === 'accessory') {
                targetSlot = document.querySelector('.coord-item-slot.item-accessory');
            }

            // 💡【修正】スロットの中身を、サイズが綺麗に収まる `<img>` タグだけに書き換える
            if (targetSlot) {
                targetSlot.innerHTML = `<img src="${imgSrc}" alt="selected item">`;
                targetSlot.classList.add('has-item');
                console.log(`👕 ${category} のスロットに画像が配置されました！`);
            }
        });
    });

    // 編集画面を開く処理が書かれている場所（例）
    document.addEventListener('click', (e) => {
        const card = e.target.closest('.item-card');
        if (!card) return;

        // 💡 もしクリックされたカードが「マイコーデ画面（my-coord-drawer-grid）の中」にあるものだったら、
        // 編集画面を開く処理をここでストップ（キャンセル）する！
        if (card.closest('.my-coord-drawer-grid')) {
            return; // これにより、編集画面ドロアーが開かなくなります
        }

        // --- （ここに通常の「服の編集画面を開く」ための処理が書かれているはずです） ---
        // openEditDrawer(card); 
    });
});

/* ==========================================
     * 服カードをクリックしたとき、対応するスロットに配置する処理
     * ========================================== */
    const itemCards = document.querySelectorAll('.drawer-grid .item-card');

    itemCards.forEach(card => {
        card.addEventListener('click', (e) => {
            // 💡【重要】ここで他のイベント（編集画面を開く処理など）へクリックが伝わるのを完全にストップする！
            e.stopPropagation();

            // もしカード内の「ハートボタン」が押された場合は、配置ではなくお気に入り処理を優先する
            if (e.target.closest('.favorite-btn')) {
                return; 
            }

            // 1. クリックされたカードの「カテゴリ」と「画像」を取得する
            const category = card.getAttribute('data-category'); 
            const imageHtml = card.querySelector('.image-wrapper').innerHTML;

            // 2. 上部のボードの中から、対応するスロットを探す
            let targetSlot = null;
            if (category === 'tops') {
                targetSlot = document.querySelector('.coord-item-slot.item-top');
            } else if (category === 'outer') {
                targetSlot = document.querySelector('.coord-item-slot.item-outer');
            } else if (category === 'bottoms') {
                targetSlot = document.querySelector('.coord-item-slot.item-bottom');
            } else if (category === 'shoes') {
                targetSlot = document.querySelector('.coord-item-slot.item-shoes');
            } else if (category === 'accessory') {
                targetSlot = document.querySelector('.coord-item-slot.item-accessory');
            }

            // 3. 対応するスロットが見つかったら、中身をその服の画像に置き換える
            if (targetSlot) {
                targetSlot.innerHTML = imageHtml;
                targetSlot.classList.add('has-item');
                console.log(`👕 ${category} のスロットに服が配置されました！`);
            }
        });
    });