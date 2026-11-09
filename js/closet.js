document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================
     * ① ホイール操作を横スクロールに変換
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
     * ② お気に入りボタンの切り替え処理
     * ========================================== */
    const favoriteButtons = document.querySelectorAll('.favorite-btn');
    if (favoriteButtons.length > 0) {
        favoriteButtons.forEach(button => {
            button.addEventListener('click', () => {
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
     * ③ メインのタイトルフィルター処理
     * ========================================== */
    const closetFilter = document.getElementById('closetFilter');
    const itemCards = document.querySelectorAll('.item-card');

    if (closetFilter && itemCards.length > 0) {
        closetFilter.addEventListener('change', (e) => {
            const filterType = e.target.value;

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
     * ④ サブフィルター（お気に入りセクション用）
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
        applyFavoritesFilter(); // ページを開いた初期状態の適用
    }

});