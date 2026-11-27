// document.addEventListener('DOMContentLoaded', () => {

//     /* ==========================================
//      * 1. ホイール操作を横スクロールに変換
//      * ========================================== */
//     const closetGrids = document.querySelectorAll('.closet-grid');
//     if (closetGrids.length > 0) {
//         closetGrids.forEach(grid => {
//             grid.addEventListener('wheel', (e) => {
//                 if (e.deltaY !== 0) {
//                     e.preventDefault();
//                     grid.scrollLeft += e.deltaY;
//                 }
//             }, { passive: false });
//         });
//     }


//     /* ==========================================
//      * 2. お気に入りボタンの切り替え処理
//      * ========================================== */
//     const favoriteButtons = document.querySelectorAll('.favorite-btn');
//     if (favoriteButtons.length > 0) {
//         favoriteButtons.forEach(button => {
//             button.addEventListener('click', (e) => {
//                 e.stopPropagation();
//                 const card = button.closest('.item-card');
//                 if (!card) return;

//                 const isFavorite = card.getAttribute('data-favorite') === 'true';

//                 if (isFavorite) {
//                     card.setAttribute('data-favorite', 'false');
//                     card.classList.remove('favorited');
//                 } else {
//                     card.setAttribute('data-favorite', 'true');
//                     card.classList.add('favorited');
//                 }
//             });
//         });
//     }


//     /* ==========================================
//      * 3 & 4. フィルター処理（共通関数で1行ずつにする！）
//      * ========================================== */
//     // メインフィルター（初期値：すべて）
//     initCategoryFilter('closetFilter', '#closetGrid .item-card', 'all');

//     // お気に入りフィルター（初期値：お気に入り）
//     initCategoryFilter('favoritesFilter', '#favoritesGrid .item-card', 'favorite');

//     // 👇 これから作る「コーデ編集ドロアー」のフィルターも、ここへ1行追加するだけでOK！
//     // initCategoryFilter('drawerCategoryFilter', '#drawerGrid .item-card', 'all');


//     /* ==========================================
//      * 5. 詳細モーダルの開閉処理
//      * ========================================== */
//     const detailModal = document.querySelector('.item-detail-modal-overlay');
//     const previewImage = document.getElementById('previewImage');
//     const cancelBtn = document.getElementById('modalCancelBtn');

//     document.addEventListener('click', (e) => {
//         if (e.target.closest('.favorite-btn')) {
//             return; 
//         }

//         const itemCard = e.target.closest('.item-card');
//         if (itemCard) {
//             const cardImg = itemCard.querySelector('.image-wrapper img');
            
//             if (cardImg && previewImage) {
//                 previewImage.src = cardImg.src;
//             }

//             const category = itemCard.getAttribute('data-category');
//             console.log('👕 選択されたカテゴリ:', category);

//             if (detailModal) {
//                 detailModal.classList.add('is-active');
//             }
//         }
//     });

//     if (cancelBtn && detailModal) {
//         cancelBtn.addEventListener('click', () => {
//             detailModal.classList.remove('is-active');
//         });
//     }

//     if (detailModal) {
//         detailModal.addEventListener('click', (e) => {
//             if (e.target === detailModal) {
//                 detailModal.classList.remove('is-active');
//             }
//         });
//     }

// });


document.addEventListener('DOMContentLoaded', () => {

    // 保存されている服のデータ
    let clothingItems = [];

    /* ==========================================
     * 1. ホイール操作を横スクロールに変換
     * ========================================== */
    const closetGrids = document.querySelectorAll('.closet-grid');

    closetGrids.forEach(grid => {
        grid.addEventListener('wheel', (e) => {
            if (e.deltaY !== 0) {
                e.preventDefault();
                grid.scrollLeft += e.deltaY;
            }
        }, { passive: false });
    });


    /* ==========================================
     * 2. カテゴリーをフィルター用の値に変換
     * ========================================== */
    function convertCategory(category) {
        if (category === 'トップス' || category === 'tops') {
            return 'tops';
        }

        if (category === 'ボトムス' || category === 'bottoms') {
            return 'bottoms';
        }

        return category;
    }


    /* ==========================================
     * 3. 服のカードを作成
     * ========================================== */
    function createClothingCard(item) {

        const card = document.createElement('div');

        card.dataset.itemId = item.id;
        card.dataset.imagePath = item.image_path;
        card.className = 'item-card';
        card.setAttribute('data-id', item.id);
        card.setAttribute('data-category', convertCategory(item.category));
        card.setAttribute('data-favorite', String(item.is_favorite));

        if (item.is_favorite) {
            card.classList.add('favorited');
        }

        const imageWrapper = document.createElement('div');
        imageWrapper.className = 'image-wrapper';

        const img = document.createElement('img');
        img.src = item.imageUrl;
        img.alt = item.item_name || '服の画像';

        imageWrapper.appendChild(img);

        const favoriteBtn = document.createElement('button');
        favoriteBtn.className = 'favorite-btn';
        favoriteBtn.type = 'button';
        favoriteBtn.setAttribute('aria-label', 'お気に入り');

        favoriteBtn.innerHTML = `
            <svg class="heart-icon"
                viewBox="0 0 24 24"
                width="18"
                height="18"
                stroke="currentColor"
                stroke-width="2"
                fill="none">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z">
                </path>
            </svg>
        `;

        card.appendChild(imageWrapper);
        card.appendChild(favoriteBtn);

        return card;
    }


    /* ==========================================
     * 4. 服を画面に表示
     * ========================================== */
    function renderClothingItems() {

        const closetGrid = document.getElementById('closetGrid');
        const favoritesGrid = document.getElementById('favoritesGrid');

        if (!closetGrid || !favoritesGrid) return;

        // 仮のカードを削除
        closetGrid.innerHTML = '';
        favoritesGrid.innerHTML = '';

        clothingItems.forEach(item => {

            const card = createClothingCard(item);
            closetGrid.appendChild(card);

            // お気に入りの場合は下の一覧にも表示
            if (item.is_favorite) {
                const favoriteCard = createClothingCard(item);
                favoritesGrid.appendChild(favoriteCard);
            }
        });

        // 服の件数を更新
        const closetCount = closetGrid
            .closest('.closet-section')
            ?.querySelector('.item-count');

        const favoritesCount = favoritesGrid
            .closest('.closet-section')
            ?.querySelector('.item-count');

        if (closetCount) {
            closetCount.textContent = `${clothingItems.length} items`;
        }

        if (favoritesCount) {
            favoritesCount.textContent =
                `${clothingItems.filter(item => item.is_favorite).length} items`;
        }
    }


    /* ==========================================
     * 5. Supabaseから服を取得
     * ========================================== */
    async function loadClothingItems() {
    
        try {

            const { data: userData, error: userError } =
                await supabaseClient.auth.getUser();

            if (userError || !userData.user) {
                throw new Error('ログイン情報を取得できません。');
            }

            const user = userData.user;

            const { data, error } = await supabaseClient
                .from('clothing_items')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;

            // 非公開画像のURLを取得
            clothingItems = await Promise.all(
                data.map(async (item) => {

                    const { data: imageData, error: imageError } =
                        await supabaseClient
                            .storage
                            .from('clothing-images')
                            .createSignedUrl(item.image_path, 3600);

                    if (imageError) {
                        console.error('画像取得エラー:', imageError);
                    }

                    return {
                        ...item,
                        imageUrl: imageData?.signedUrl || ''
                    };
                })
            );

            renderClothingItems();

            console.log('服の取得に成功しました！', clothingItems);

        } catch (error) {

            console.error('服の取得エラー:', error);
            alert('服の読み込みに失敗しました。\n' + error.message);

        }
    }window.loadClothingItems = loadClothingItems;


    /* ==========================================
     * 6. お気に入りボタンの切り替え
     * ========================================== */
    document.addEventListener('click', async (e) => {

        const favoriteBtn = e.target.closest('.favorite-btn');

        if (!favoriteBtn) return;

        e.stopPropagation();

        const card = favoriteBtn.closest('.item-card');
        if (!card) return;

        const itemId = card.getAttribute('data-id');

        const item = clothingItems.find(item => item.id === itemId);
        if (!item) return;

        const newFavorite = !item.is_favorite;

        try {

            const { error } = await supabaseClient
                .from('clothing_items')
                .update({ is_favorite: newFavorite })
                .eq('id', itemId);

            if (error) throw error;

            item.is_favorite = newFavorite;

            // 両方の一覧を更新
            renderClothingItems();

        } catch (error) {

            console.error('お気に入り更新エラー:', error);
            alert('お気に入りの更新に失敗しました。');

        }
    });


    /* ==========================================
     * 7. フィルター処理
     * ========================================== */
    initCategoryFilter('closetFilter', '#closetGrid .item-card', 'all');

    initCategoryFilter('favoritesFilter', '#favoritesGrid .item-card', 'favorite');


    /* ==========================================
     * 8. 詳細モーダルの開閉処理
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

            // クリックした服のデータを取得
            const item = clothingItems.find(
                clothing => clothing.id === itemCard.dataset.itemId
            );

            if (!item) return;

            // 画像を表示
            if (previewImage) {
                previewImage.src = item.imageUrl;
            }

            // アイテム名・ブランド
            const textInputs = detailModal.querySelectorAll('input[type="text"]');

            if (textInputs[0]) {
                textInputs[0].value = item.item_name || '';
            }

            if (textInputs[1]) {
                textInputs[1].value = item.brand || '';
            }

            // カテゴリー
            const categorySelect = document.getElementById('categorySelect');
            const categoryInput = document.getElementById('categoryInput');

            const categoryOptions = Array.from(categorySelect.options)
                .map(option => option.value);

            if (categoryOptions.includes(item.category)) {
                categorySelect.value = item.category;
                categoryInput.value = '';
            } else {
                categoryInput.value = item.category || '';
            }

            // カラー
            const selectedColorName = document.getElementById('selectedColorName');

            if (selectedColorName) {
                selectedColorName.textContent = item.color || '';
            }

            // 季節
            document.querySelectorAll('#seasonPicker .season-btn').forEach(btn => {
                btn.classList.toggle(
                    'is-active',
                    (item.seasons || []).includes(btn.dataset.season)
                );
    });

    // お気に入り
    const favoriteBtn = document.getElementById('favoriteBtn');

    if (favoriteBtn) {
        favoriteBtn.classList.toggle('is-active', item.is_favorite);
    }

    // モーダルを開く
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


    /* ==========================================
     * 9. 初回読み込み
     * ========================================== */
    loadClothingItems();
    // common.jsから一覧を再読み込みできるようにする
    window.loadClothingItems = loadClothingItems;

});
