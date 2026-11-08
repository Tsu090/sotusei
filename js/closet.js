document.addEventListener("DOMContentLoaded", () => {
    // すべての .closet-grid に対して、ホイール操作を横スクロールに変換する
    document.querySelectorAll('.closet-grid').forEach(grid => {
        grid.addEventListener('wheel', (e) => {
            // 縦方向のホイール回転量が検知された場合
            if (e.deltaY !== 0) {
                e.preventDefault(); // ページの縦スクロールをブロックする
                grid.scrollLeft += e.deltaY; // 横方向へスクロールさせる
            }
        }, { passive: false });
    });
});

// すべてのお気に入りボタンを取得
const favoriteButtons = document.querySelectorAll('.favorite-btn');

favoriteButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        // カード本体（親要素）を取得
        const card = button.closest('.item-card');
        
        // 現在お気に入り状態かどうかを判定
        const isFavorite = card.getAttribute('data-favorite') === 'true';

        if (isFavorite) {
            // お気に入りを解除する場合
            card.setAttribute('data-favorite', 'false');
            card.classList.remove('favorited');
        } else {
            // お気に入りに追加する場合
            card.setAttribute('data-favorite', 'true');
            card.classList.add('favorited');
        }
    });
});

// 1. タイトルフィルターの変更処理
const closetFilter = document.getElementById('closetFilter');
const itemCards = document.querySelectorAll('.item-card');

closetFilter.addEventListener('change', (e) => {
    const filterType = e.target.value;

    itemCards.forEach(card => {
        const isFavorite = card.getAttribute('data-favorite') === 'true';
        const category = card.getAttribute('data-category');

        if (filterType === 'all') {
            card.classList.remove('hidden');
        } else if (filterType === 'favorite') {
            if (isFavorite) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        } else {
            if (category === filterType) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        }
    });
});

// 下側のセクション用のフィルター処理
const favoritesFilter = document.getElementById('favoritesFilter');
const favoriteCards = document.querySelectorAll('#favoritesGrid .item-card');

// フィルター処理を実行する関数（まとめ）
function applyFavoritesFilter() {
    if (!favoritesFilter) return;

    const filterType = favoritesFilter.value;

    favoriteCards.forEach(card => {
        const isFavorite = card.getAttribute('data-favorite') === 'true';
        const category = card.getAttribute('data-category');

        if (filterType === 'all') {
            card.classList.remove('hidden');
        } else if (filterType === 'favorite') {
            if (isFavorite) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        } else {
            if (category === filterType) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        }
    });
}

if (favoritesFilter) {
    // ユーザーがセレクトボックスを変更したときに動く
    favoritesFilter.addEventListener('change', applyFavoritesFilter);

    // ★【ここがポイント！】画面を開いた直後に、最初から選ばれている「お気に入り」で一回絞り込む
    applyFavoritesFilter();
}

// 例：ユーザーが画像を設定した（またはAPIから画像URLを取得した）とき
const userHasPhoto = true; // 写真があるかどうか（フラグやURLの有無）
const avatarImg = document.getElementById('userAvatarImg');
const defaultIcon = document.querySelector('.default-icon');

if (userHasPhoto) {
    // 1. 画像のパス（URL）をセットする
    avatarImg.src = 'uploads/user-profile.jpg';
    
    // 2. 画像を表示し、デフォルトのアイコンを隠す
    avatarImg.style.display = 'block';
    defaultIcon.style.display = 'none';
} else {
    // 写真がない場合はデフォルトのままにする
    avatarImg.style.display = 'none';
    defaultIcon.style.display = 'block';
}