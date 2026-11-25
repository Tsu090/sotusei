document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================
     * 1. コーデグリッドのホイール操作を横スクロールに変換
     * ========================================== */
    const outfitGrids = document.querySelectorAll('.outfit-grid');
    outfitGrids.forEach(grid => {
        grid.addEventListener('wheel', (e) => {
            if (e.deltaY !== 0) {
                e.preventDefault();
                grid.scrollLeft += e.deltaY;
            }
        }, { passive: false });
    });


    /* ==========================================
     * 2. お気に入りボタンの切り替え処理（.coord-card用）
     * ========================================== */
    const favoriteButtons = document.querySelectorAll('.coord-card .favorite-btn');
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


    /* ==========================================
     * 3. Myコーデ専用のシーズン＆お気に入りフィルター
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
     * 4. コーデ編集ドロアー内の「服のフィルター」
     * ========================================== */
    initCategoryFilter('drawerCategoryFilter', '#drawerGrid .item-card', 'all');


    /* ==========================================
     * 5. コーデボード（スロット）を初期状態に戻す関数
     * ========================================== */
    const resetCoordBoard = () => {
        document.querySelectorAll('.coord-item-slot').forEach(slot => {
            slot.innerHTML = ''; 
            slot.classList.remove('has-item');
        });
    };


    /* ==========================================
     * 6. モーダル・ドロアーの開閉およびリセット処理
     * ========================================== */
    const coordModal = document.querySelector('.coord-detail-modal-overlay'); 
    const cancelBtn = document.getElementById('coordModalCancelBtn'); 

    if (cancelBtn && coordModal) {
        cancelBtn.addEventListener('click', () => {
            coordModal.classList.remove('is-active');
            resetCoordBoard();
        });
    }

    if (coordModal) {
        coordModal.addEventListener('click', (e) => {
            if (e.target === coordModal) {
                coordModal.classList.remove('is-active');
                resetCoordBoard();
            }
        });
    }

    const openDrawerBtn = document.getElementById('openDrawerBtn');
    const coordDrawer = document.querySelector('.coord-drawer');
    const closeBtn = document.querySelector('.coord-close-btn');

    if (openDrawerBtn && coordDrawer) {
        openDrawerBtn.addEventListener('click', () => {
            resetCoordBoard();
            coordDrawer.classList.add('is-open');
        });
    }

    if (closeBtn && coordDrawer) {
        closeBtn.addEventListener('click', () => {
            coordDrawer.classList.remove('is-open');
        });
    }

    if (coordDrawer) {
        coordDrawer.addEventListener('click', (e) => {
            if (e.target === coordDrawer) {
                coordDrawer.classList.remove('is-open');
                resetCoordBoard();
            }
        });
    }


    /* ==========================================
     * 7. 服一覧（#drawerGrid）のホイール横スクロール
     * ========================================== */
    const drawerGrid = document.getElementById('drawerGrid');
    if (drawerGrid) {
        drawerGrid.addEventListener('wheel', (e) => {
            if (e.deltaY !== 0) {
                e.preventDefault();
                drawerGrid.scrollLeft += e.deltaY;
            }
        }, { passive: false });
    }


    /* ==========================================
     * 8. ボード（スロット）をクリックしたら服が戻る（非表示になる）処理
     * ========================================== */
    const itemSlots = document.querySelectorAll('.coord-item-slot');
    itemSlots.forEach(slot => {
        slot.addEventListener('click', () => {
            slot.innerHTML = ''; 
            slot.classList.remove('has-item');
        });
    });


    /* ==========================================
     * 9. 服カードをクリックしたとき、対応するスロットに配置する処理
     * ========================================== */
    const itemCards = document.querySelectorAll('.drawer-grid .item-card');

    itemCards.forEach(card => {
        card.addEventListener('click', (e) => {
            e.stopPropagation(); 

            if (e.target.closest('.favorite-btn')) {
                return; 
            }

            const category = card.getAttribute('data-category'); 
            const cardImg = card.querySelector('.image-wrapper img');
            if (!cardImg) return;
            const imgSrc = cardImg.src;

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

            if (targetSlot) {
                targetSlot.innerHTML = `<img src="${imgSrc}" alt="selected item">`;
                targetSlot.classList.add('has-item');
            }
        });
    });


    /* ==========================================
     * 10. Myコーデ一覧のカードを押したら編集ドロアーを開く処理
     * ========================================== */
    coordCards.forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.closest('.favorite-btn')) return;

            const topsImg = card.querySelector('.slot-top img, [data-category="tops"] img')?.src;
            const outerImg = card.querySelector('.slot-outer img, [data-category="outer"] img')?.src;
            const bottomsImg = card.querySelector('.slot-bottom img, [data-category="bottoms"] img')?.src;
            const shoesImg = card.querySelector('.slot-shoes img, [data-category="shoes"] img')?.src;
            const accessoryImg = card.querySelector('.slot-accessory img, [data-category="accessory"] img')?.src;

            resetCoordBoard();

            if (topsImg) {
                const slot = document.querySelector('.coord-item-slot.item-top');
                if (slot) { slot.innerHTML = `<img src="${topsImg}" alt="tops">`; slot.classList.add('has-item'); }
            }
            if (outerImg) {
                const slot = document.querySelector('.coord-item-slot.item-outer');
                if (slot) { slot.innerHTML = `<img src="${outerImg}" alt="outer">`; slot.classList.add('has-item'); }
            }
            if (bottomsImg) {
                const slot = document.querySelector('.coord-item-slot.item-bottom');
                if (slot) { slot.innerHTML = `<img src="${bottomsImg}" alt="bottoms">`; slot.classList.add('has-item'); }
            }
            if (shoesImg) {
                const slot = document.querySelector('.coord-item-slot.item-shoes');
                if (slot) { slot.innerHTML = `<img src="${shoesImg}" alt="shoes">`; slot.classList.add('has-item'); }
            }
            if (accessoryImg) {
                const slot = document.querySelector('.coord-item-slot.item-accessory');
                if (slot) { slot.innerHTML = `<img src="${accessoryImg}" alt="accessory">`; slot.classList.add('has-item'); }
            }

            if (coordDrawer) {
                coordDrawer.classList.add('is-open');
            }
        });
    });


    /* ==========================================
     * 11. 「保存をする」ボタン（アラートなしでスマートに保存・閉じる）
     * ========================================== */
    const saveButton = document.querySelector('.save-btn');

    if (saveButton) {
        saveButton.addEventListener('click', () => {
            const currentCoord = {
                tops: document.querySelector('.coord-item-slot.item-top img')?.src || null,
                outer: document.querySelector('.coord-item-slot.item-outer img')?.src || null,
                bottoms: document.querySelector('.coord-item-slot.item-bottom img')?.src || null,
                shoes: document.querySelector('.coord-item-slot.item-shoes img')?.src || null,
                accessory: document.querySelector('.coord-item-slot.item-accessory img')?.src || null,
            };

            // 全て空のときは何もしない（またはアラートを出さない代わりにreturnする）
            const hasAnyItem = Object.values(currentCoord).some(src => src !== null);
            if (!hasAnyItem) {
                return;
            }

            // データをローカルストレージへ保存
            localStorage.setItem('savedCoordinate', JSON.stringify(currentCoord));
            console.log('💾 コーデを保存しました：', currentCoord);

            // アラートを出さずに、そのままドロアーを閉じてボードをリセット
            if (coordDrawer) {
                coordDrawer.classList.remove('is-open');
            }
            resetCoordBoard();
        });
    }

/* ==========================================
     * 12. スマホ向け：ハンドル／ヘッダー操作で服一覧を上下に切り替え
     * ========================================== */
    const drawerContent = document.querySelector('.coord-drawer-content');
    const drawerHandle = document.getElementById('drawerHandle');
    const drawerHeader = document.querySelector('.drawer-header');
    const dragTargets = [drawerHandle, drawerHeader].filter(Boolean);

    let startY = 0;
    let currentDeltaY = 0;
    let isDraggingDrawer = false;

    dragTargets.forEach((target) => {
        target.addEventListener('touchstart', (e) => {
            if (window.innerWidth > 600 || !drawerContent) return;
            startY = e.touches[0].clientY;
            currentDeltaY = 0;
            isDraggingDrawer = true;
            drawerContent.style.transition = 'none';
        }, { passive: true });

        target.addEventListener('touchmove', (e) => {
            if (!isDraggingDrawer || window.innerWidth > 600 || !drawerContent) return;
            currentDeltaY = e.touches[0].clientY - startY;
            const clampedDelta = Math.max(-100, Math.min(100, currentDeltaY));
            drawerContent.style.transform = `translateY(${clampedDelta * 0.3}px)`;
        }, { passive: true });

        const finishDrawerDrag = () => {
            if (!isDraggingDrawer || !drawerContent) return;
            isDraggingDrawer = false;
            drawerContent.style.transition = 'transform 0.2s ease';
            drawerContent.style.transform = '';

            // 25px以上上に引いたら展開、25px以上下に引いたら戻す
            if (currentDeltaY < -25) {
                drawerContent.classList.add('is-expanded');
            } else if (currentDeltaY > 25) {
                drawerContent.classList.remove('is-expanded');
            } else if (Math.abs(currentDeltaY) < 8) {
                // ほぼタップだけの場合はトグル切り替え
                drawerContent.classList.toggle('is-expanded');
            }
            currentDeltaY = 0;
        };

        target.addEventListener('touchend', finishDrawerDrag);
        target.addEventListener('touchcancel', finishDrawerDrag);
    });
});