document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================
     * 1. ホイール操作を横スクロールに変換
     * ========================================== */
    const closetGrids = document.querySelectorAll('.closet-grid');
    if (closetGrids.length > 0) {
        closetGrids.forEach(grid => {
            grid.addEventListener('wheel', (e) => {
                if (e.deltaY !== 0) {
                    e.preventDefault();
                    grid.scrollLeft += e.deltaY;
                }
            }, { passive: false });
        });
    }


    /* ==========================================
     * 2. お気に入りボタンの切り替え処理
     * ========================================== */
    const favoriteButtons = document.querySelectorAll('.favorite-btn');
    if (favoriteButtons.length > 0) {
        favoriteButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation(); // カード全体のクリック（モーダル起動）との競合を防ぐ
                const card = button.closest('.item-card');
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
     * 3. メインのタイトルフィルター処理（修正版）
     * ========================================== */
    const closetFilter = document.getElementById('closetFilter');

    if (closetFilter) {
        closetFilter.addEventListener('change', (e) => {
            const filterType = e.target.value;
            
            // 💡 ここがポイント：#closetGrid の中にある .item-card だけを対象にする
            const itemCards = document.querySelectorAll('#closetGrid .item-card');

            itemCards.forEach(card => {
                const isFavorite = card.getAttribute('data-favorite') === 'true';
                const category = card.getAttribute('data-category');

                if (filterType === 'all') {
                    card.classList.remove('hidden');
                } else if (filterType === 'favorite') {
                    card.classList.toggle('hidden', !isFavorite);
                } else {
                    card.classList.toggle('hidden', category !== filterType);
                }
            });
        });
    }


    /* ==========================================
     * 4. サブフィルター（お気に入りセクション用）
     * ========================================== */
    const favoritesFilter = document.getElementById('favoritesFilter');
    const favoriteCards = document.querySelectorAll('#favoritesGrid .item-card');

    function applyFavoritesFilter() {
        if (!favoritesFilter) return;
        const filterType = favoritesFilter.value;

        favoriteCards.forEach(card => {
            const isFavorite = card.getAttribute('data-favorite') === 'true';
            const category = card.getAttribute('data-category');

            if (filterType === 'all') {
                card.classList.remove('hidden');
            } else if (filterType === 'favorite') {
                card.classList.toggle('hidden', !isFavorite);
            } else {
                card.classList.toggle('hidden', category !== filterType);
            }
        });
    }

    if (favoritesFilter && favoriteCards.length > 0) {
        favoritesFilter.addEventListener('change', applyFavoritesFilter);
        applyFavoritesFilter(); // 初期状態の適用
    }


    /* ==========================================
     * 5. 詳細モーダルの開閉処理
     * ========================================== */
    const detailModal = document.querySelector('.item-detail-modal-overlay');
    const previewImage = document.getElementById('previewImage');
    const cancelBtn = document.getElementById('modalCancelBtn');

    document.addEventListener('click', (e) => {
        if (e.target.closest('.favorite-btn')) {
            return; 
        }

        const itemCard = e.target.closest('.item-card');
        if (itemCard) {
            const cardImg = itemCard.querySelector('.image-wrapper img');
            
            if (cardImg && previewImage) {
                previewImage.src = cardImg.src;
            }

            const category = itemCard.getAttribute('data-category');
            console.log('👕 選択されたカテゴリ:', category);

            if (detailModal) {
                detailModal.classList.add('is-active');
            }
        }
    });

    if (cancelBtn && detailModal) {
        cancelBtn.addEventListener('click', () => {
            detailModal.classList.remove('is-active');
        });
    }

    if (detailModal) {
        detailModal.addEventListener('click', (e) => {
            if (e.target === detailModal) {
                detailModal.classList.remove('is-active');
            }
        });
    }

});