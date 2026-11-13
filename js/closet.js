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
                e.stopPropagation();
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
     * 3 & 4. フィルター処理（共通関数で1行ずつにする！）
     * ========================================== */
    // メインフィルター（初期値：すべて）
    initCategoryFilter('closetFilter', '#closetGrid .item-card', 'all');

    // お気に入りフィルター（初期値：お気に入り）
    initCategoryFilter('favoritesFilter', '#favoritesGrid .item-card', 'favorite');

    // 👇 これから作る「コーデ編集ドロアー」のフィルターも、ここへ1行追加するだけでOK！
    // initCategoryFilter('drawerCategoryFilter', '#drawerGrid .item-card', 'all');


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