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
                e.stopPropagation(); // カード全体のクリックイベント等との競合を防ぐ
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
     * ③ メインのタイトルフィルター処理（Myコーデ用）
     * ========================================== */
    const outfitFilter = document.querySelector('.outfit-title-filter select'); 
    const coordCards = document.querySelectorAll('.coord-card');

    if (outfitFilter && coordCards.length > 0) {
        outfitFilter.addEventListener('change', (e) => {
            const filterType = e.target.value; // 'all', 'favorite', 'spring', 'summer', 'autumn', 'winter'

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
        });
    }


    /* ==========================================
     * ④ Myコーデ用モーダルの開閉処理
     * ========================================== */
    // コーデ専用のクラス名・IDを指定するのが安全です
    const coordModal = document.querySelector('.coord-detail-modal-overlay'); // または共通のオーバーレイ
    const coordPreviewImage = document.getElementById('coordPreviewImage'); // モーダル内の画像プレビューID
    const cancelBtn = document.getElementById('coordModalCancelBtn'); // モーダルのキャンセルボタンID

    // コーデカードをクリックしてモーダルを開く
    document.addEventListener('click', (e) => {
        if (e.target.closest('.favorite-btn')) {
            return; // お気に入りボタンのクリックは無視
        }

        const coordCard = e.target.closest('.coord-card');
        if (coordCard) {
            const cardImg = coordCard.querySelector('.image-wrapper img');
            
            if (cardImg && coordPreviewImage) {
                coordPreviewImage.src = cardImg.src;
            }

            if (coordModal) {
                coordModal.classList.add('is-active');
            }
        }
    });

    // キャンセルボタンで閉じる
    if (cancelBtn && coordModal) {
        cancelBtn.addEventListener('click', () => {
            coordModal.classList.remove('is-active');
        });
    }

    // 背景クリックで閉じる
    if (coordModal) {
        coordModal.addEventListener('click', (e) => {
            if (e.target === coordModal) {
                coordModal.classList.remove('is-active');
            }
        });
    }

});