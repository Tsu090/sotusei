/* ==========================================
 * 1. ログイン状態の確認
 * ========================================== */
async function checkLogin() {
    try {
        const { data, error } = await supabaseClient.auth.getSession();
        if (error || !data.session) {
            return false;
        }
        return true;
    } catch (error) {
        console.error("ログイン確認エラー:", error);
        return false;
    }
}

// ブラウザの戻る操作等でキャッシュから復元された場合のログイン確認
window.addEventListener('pageshow', async (event) => {
    if (event.persisted) {
        const isLoggedIn = await checkLogin();
        if (!isLoggedIn) {
            window.location.replace('login.html');
        }
    }
});


/* ==========================================
 * 2. ページ読み込み時の共通初期化処理
 * ========================================== */
document.addEventListener('DOMContentLoaded', async () => {

    /* ------------------------------------------
     * A. プロフィールドロワーの開閉管理
     * ------------------------------------------ */
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


    /* ------------------------------------------
     * B. ログアウト確認ダイアログ
     * ------------------------------------------ */
    const logoutTriggerBtns = document.querySelectorAll('.logout-btn');
    const logoutModal = document.getElementById('logoutModal');
    const confirmLogoutBtn = document.getElementById('confirmLogoutBtn');
    const morePopupMenuRef = document.getElementById('morePopupMenu');

    if (logoutModal) {
        const closeLogoutModal = () => {
            logoutModal.classList.remove('is-active');
        };

        logoutTriggerBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (morePopupMenuRef) morePopupMenuRef.classList.remove('is-active');
                logoutModal.classList.add('is-active');
            });
        });

        logoutModal.querySelectorAll('.logout-close-trigger').forEach(btn => {
            btn.addEventListener('click', closeLogoutModal);
        });

        logoutModal.addEventListener('click', (e) => {
            if (e.target === logoutModal) closeLogoutModal();
        });

        if (confirmLogoutBtn) {
            confirmLogoutBtn.addEventListener('click', async () => {
                confirmLogoutBtn.disabled = true;
                try {
                    const { error } = await window.supabaseClient.auth.signOut();
                    if (error) throw error;
                    closeLogoutModal();
                    window.location.replace('login.html');
                } catch (error) {
                    console.error('ログアウトエラー:', error);
                    alert('ログアウトに失敗しました。もう一度お試しください。');
                    confirmLogoutBtn.disabled = false;
                }
            });
        }
    }


    /* ------------------------------------------
     * C. 選択モード・長押し・右クリック・一括削除の管理
     * ------------------------------------------ */
    let isSelectMode = false;
    let pressTimer = null;
    let targetCard = null;

    const customContextMenu = document.getElementById('customContextMenu');
    const manualSelectBtn = document.getElementById('manualSelectBtn');
    const batchDeleteBtn = document.getElementById('batchDeleteBtn');
    const batchCancelBtn = document.getElementById('batchCancelBtn');

    if (manualSelectBtn) {
        manualSelectBtn.addEventListener('click', () => {
            if (!isSelectMode) {
                enterSelectMode();
            } else {
                exitSelectMode();
            }
        });
    }

    // スマホ用：長押し検知 (touchstart)
    document.addEventListener('touchstart', (e) => {
        const card = e.target.closest('.coord-card, .drawer-grid .item-card, .item-card');
        if (!card) return;
        if (e.target.closest('.brand-logo')) return;
        if (card.classList.contains('coord-card') || card.closest('.coord-drawer .item-drawer')) return;
        if (isSelectMode) return;

        const touch = e.touches[0];
        pressTimer = setTimeout(() => {
            targetCard = card;
            card.classList.add('is-selected');
            showContextMenu(touch.clientX, touch.clientY);
        }, 600);
    }, { passive: true });

    // PC用：右クリック検知 (contextmenu)
    document.addEventListener('contextmenu', (e) => {
        const card = e.target.closest('.coord-card, .drawer-grid .item-card, .item-card');
        if (!card) {
            hideContextMenu();
            return;
        }
        if (e.target.closest('.brand-logo')) return;
        if (card.classList.contains('coord-card') || card.closest('.coord-drawer .item-drawer')) {
            hideContextMenu();
            return;
        }

        e.preventDefault();
        targetCard = card;
        card.classList.add('is-selected');
        showContextMenu(e.clientX, e.clientY);
    });

    // クリック時の挙動（選択モード中はチェック切替、通常時は各種オープン）
    document.addEventListener('click', (e) => {
        const card = e.target.closest('.coord-card, .drawer-grid .item-card, .item-card');

        if (customContextMenu && !customContextMenu.contains(e.target) && !card) {
            hideContextMenu();
        }

        if (!card) return;
        if (e.target.closest('.favorite-btn')) return;

        if (isSelectMode) {
            e.preventDefault();
            e.stopPropagation();
            card.classList.toggle('is-selected');
            return;
        }

        if (card.classList.contains('coord-card')) {
            const coordDrawer = document.querySelector('.coord-drawer');
            if (coordDrawer) {
                const topsImg = card.querySelector('.slot-top img, [data-category="tops"] img')?.src;
                const outerImg = card.querySelector('.slot-outer img, [data-category="outer"] img')?.src;
                const bottomsImg = card.querySelector('.slot-bottom img, [data-category="bottoms"] img')?.src;
                const shoesImg = card.querySelector('.slot-shoes img, [data-category="shoes"] img')?.src;
                const accessoryImg = card.querySelector('.slot-accessory img, [data-category="accessory"] img')?.src;

                document.querySelectorAll('.coord-item-slot').forEach(slot => {
                    slot.innerHTML = '';
                    slot.classList.remove('has-item');
                });

                if (topsImg) { const s = document.querySelector('.coord-item-slot.item-top'); if (s) { s.innerHTML = `<img src="${topsImg}">`; s.classList.add('has-item'); } }
                if (outerImg) { const s = document.querySelector('.coord-item-slot.item-outer'); if (s) { s.innerHTML = `<img src="${outerImg}">`; s.classList.add('has-item'); } }
                if (bottomsImg) { const s = document.querySelector('.coord-item-slot.item-bottom'); if (s) { s.innerHTML = `<img src="${bottomsImg}">`; s.classList.add('has-item'); } }
                if (shoesImg) { const s = document.querySelector('.coord-item-slot.item-shoes'); if (s) { s.innerHTML = `<img src="${shoesImg}">`; s.classList.add('has-item'); } }
                if (accessoryImg) { const s = document.querySelector('.coord-item-slot.item-accessory'); if (s) { s.innerHTML = `<img src="${accessoryImg}">`; s.classList.add('has-item'); } }

                coordDrawer.classList.add('is-open');
            }
        }
    }, true);

    if (batchDeleteBtn) {
        batchDeleteBtn.addEventListener('click', async () => {
            const selectedCards = Array.from(
                document.querySelectorAll('.item-card.is-selected[data-item-id]')
            );

            if (selectedCards.length === 0) {
                alert('削除するアイテムが選択されていません');
                return;
            }

            if (!confirm('選択した服を削除しますか？')) return;

            batchDeleteBtn.disabled = true;

            try {
                const items = [
                    ...new Map(
                        selectedCards.map(card => [
                            card.dataset.itemId,
                            card.dataset.imagePath
                        ])
                    )
                ];

                const ids = items.map(item => item[0]);
                const imagePaths = items.map(item => item[1]);

                const { error: deleteError } = await supabaseClient
                    .from('clothing_items')
                    .delete()
                    .in('id', ids);

                if (deleteError) throw deleteError;

                const validPaths = imagePaths.filter(path => path);

                if (validPaths.length > 0) {
                    const { error: storageError } = await supabaseClient
                        .storage
                        .from('clothing-images')
                        .remove(validPaths);

                    if (storageError) {
                        console.error('画像削除エラー:', storageError);
                        alert('服のデータは削除しましたが、画像の削除に失敗しました。');
                    }
                }

                if (typeof window.loadClothingItems === 'function') {
                    await window.loadClothingItems();
                }

                exitSelectMode();
                alert('選択した服を削除しました！');

            } catch (error) {
                console.error('服の削除エラー:', error);
                alert('削除に失敗しました。\n' + error.message);

            } finally {
                batchDeleteBtn.disabled = false;
            }
        });
    }

    if (batchCancelBtn) {
        batchCancelBtn.addEventListener('click', () => {
            exitSelectMode();
        });
    }

    function enterSelectMode() {
        isSelectMode = true;
        document.body.classList.add('is-select-mode');
    }

    function exitSelectMode() {
        isSelectMode = false;
        document.body.classList.remove('is-select-mode');
        document.querySelectorAll('.is-selected').forEach(card => {
            card.classList.remove('is-selected');
        });
        hideContextMenu();
    }

    function showContextMenu(x, y) {
        if (!customContextMenu) return;
        let posX = x + 5;
        let posY = y + 5;
        const maxX = window.innerWidth - 150;
        const maxY = window.innerHeight - 100;
        if (posX > maxX) posX = maxX;
        if (posY > maxY) posY = maxY;

        customContextMenu.style.left = `${posX}px`;
        customContextMenu.style.top = `${posY}px`;
        customContextMenu.classList.add('is-active');
    }

    function hideContextMenu() {
        if (targetCard) {
            targetCard.classList.remove('is-selected');
        }
        if (!customContextMenu) {
            targetCard = null;
            return;
        }
        customContextMenu.classList.remove('is-active');
        targetCard = null;
    }

    if (customContextMenu) {
        const editBtn = customContextMenu.querySelector('.edit-btn');
        const deleteBtn = customContextMenu.querySelector('.delete-btn');

        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => {
                if (targetCard) {
                    targetCard.remove();
                }
                hideContextMenu();
            });
        }

        if (editBtn) {
            editBtn.addEventListener('click', () => {
                if (!targetCard) {
                    hideContextMenu();
                    return;
                }

                if (targetCard.classList.contains('coord-card')) {
                    const coordDrawer = document.querySelector('.coord-drawer');
                    if (coordDrawer) {
                        const topsImg = targetCard.querySelector('.slot-top img, [data-category="tops"] img')?.src;
                        const outerImg = targetCard.querySelector('.slot-outer img, [data-category="outer"] img')?.src;
                        const bottomsImg = targetCard.querySelector('.slot-bottom img, [data-category="bottoms"] img')?.src;
                        const shoesImg = targetCard.querySelector('.slot-shoes img, [data-category="shoes"] img')?.src;
                        const accessoryImg = targetCard.querySelector('.slot-accessory img, [data-category="accessory"] img')?.src;

                        document.querySelectorAll('.coord-item-slot').forEach(slot => {
                            slot.innerHTML = '';
                            slot.classList.remove('has-item');
                        });

                        if (topsImg) { const s = document.querySelector('.coord-item-slot.item-top'); if (s) { s.innerHTML = `<img src="${topsImg}">`; s.classList.add('has-item'); } }
                        if (outerImg) { const s = document.querySelector('.coord-item-slot.item-outer'); if (s) { s.innerHTML = `<img src="${outerImg}">`; s.classList.add('has-item'); } }
                        if (bottomsImg) { const s = document.querySelector('.coord-item-slot.item-bottom'); if (s) { s.innerHTML = `<img src="${bottomsImg}">`; s.classList.add('has-item'); } }
                        if (shoesImg) { const s = document.querySelector('.coord-item-slot.item-shoes'); if (s) { s.innerHTML = `<img src="${shoesImg}">`; s.classList.add('has-item'); } }
                        if (accessoryImg) { const s = document.querySelector('.coord-item-slot.item-accessory'); if (s) { s.innerHTML = `<img src="${accessoryImg}">`; s.classList.add('has-item'); } }

                        coordDrawer.classList.add('is-open');
                    }
                }
                else if (targetCard.classList.contains('item-card')) {
                    const itemModal = document.querySelector('.item-detail-modal-overlay');
                    if (itemModal) {
                        const itemImg = targetCard.querySelector('.image-wrapper img, img')?.src;
                        const previewImage = itemModal.querySelector('#previewImage');
                        if (previewImage && itemImg) {
                            previewImage.src = itemImg;
                        }
                        const modalTitle = itemModal.querySelector('#modalTitle');
                        if (modalTitle) {
                            modalTitle.textContent = 'アイテムを編集';
                        }
                        itemModal.classList.add('is-active');
                    }
                }

                hideContextMenu();
            });
        }
    }

});


/* ==========================================
 * 3. その他メニュー（#menu）の開閉管理
 * ========================================== */
const moreBtn = document.getElementById('menu');
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


/* ==========================================
 * 4. 問題報告モーダルの処理
 * ========================================== */
const reportProblemBtn = document.getElementById('reportProblemBtn');
const reportModal = document.getElementById('reportModal');
const reportTextarea = document.getElementById('reportTextarea');
const submitReportBtn = document.getElementById('submitReportBtn');
const reportFormView = document.getElementById('reportFormView');
const reportSuccessView = document.getElementById('reportSuccessView');

// 添付ファイル関連の要素
const reportUploadBtn = document.getElementById('reportUploadBtn');
const reportFileInput = document.getElementById('reportFileInput');
const reportPreviewWrapper = document.getElementById('reportPreviewWrapper');
const reportPreviewImg = document.getElementById('reportPreviewImg');
const reportFileName = document.getElementById('reportFileName');
const reportRemoveFileBtn = document.getElementById('reportRemoveFileBtn');

if (reportProblemBtn && reportModal) {
    let attachedReportFile = null;

    const clearAttachedReportFile = () => {
        attachedReportFile = null;
        if (reportFileInput) reportFileInput.value = '';
        if (reportPreviewImg) {
            reportPreviewImg.src = '';
            reportPreviewImg.style.display = 'none';
        }
        if (reportFileName) {
            reportFileName.textContent = '';
            reportFileName.style.display = 'none';
        }
        if (reportPreviewWrapper) reportPreviewWrapper.style.display = 'none';
    };

    const handleReportFile = (file) => {
        if (!file) return;
        attachedReportFile = file;

        if (reportPreviewWrapper) reportPreviewWrapper.style.display = 'flex';

        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (reportPreviewImg) {
                    reportPreviewImg.src = e.target.result;
                    reportPreviewImg.style.display = 'block';
                }
                if (reportFileName) {
                    reportFileName.textContent = '';
                    reportFileName.style.display = 'none';
                }
            };
            reader.readAsDataURL(file);
        } else {
            if (reportPreviewImg) {
                reportPreviewImg.src = '';
                reportPreviewImg.style.display = 'none';
            }
            if (reportFileName) {
                reportFileName.textContent = `選択中のファイル: ${file.name}`;
                reportFileName.style.display = 'block';
            }
        }
    };

    const closeReportModal = () => {
        reportModal.classList.remove('is-active');
        setTimeout(() => {
            if (reportFormView) reportFormView.style.display = 'block';
            if (reportSuccessView) reportSuccessView.style.display = 'none';
            if (reportTextarea) {
                reportTextarea.value = '';
                reportTextarea.classList.remove('has-error');
            }
            clearAttachedReportFile();
        }, 200);
    };

    reportProblemBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (typeof morePopupMenu !== 'undefined' && morePopupMenu) {
            morePopupMenu.classList.remove('is-active');
        }
        if (reportFormView) reportFormView.style.display = 'block';
        if (reportSuccessView) reportSuccessView.style.display = 'none';
        reportModal.classList.add('is-active');
    });

    reportModal.querySelectorAll('.modal-close-trigger').forEach(btn => {
        btn.addEventListener('click', closeReportModal);
    });

    reportModal.addEventListener('click', (e) => {
        if (e.target === reportModal) closeReportModal();
    });

    if (reportTextarea) {
        reportTextarea.addEventListener('input', () => {
            if (reportTextarea.value.trim() !== '') {
                reportTextarea.classList.remove('has-error');
            }
        });

        reportTextarea.addEventListener('paste', (e) => {
            const items = e.clipboardData?.items;
            if (!items) return;

            for (const item of items) {
                if (item.type.startsWith('image/')) {
                    const file = item.getAsFile();
                    if (file) {
                        handleReportFile(file);
                        break;
                    }
                }
            }
        });
    }

    if (reportUploadBtn && reportFileInput) {
        reportUploadBtn.addEventListener('click', () => {
            reportFileInput.click();
        });

        reportFileInput.addEventListener('change', (e) => {
            const file = e.target.files?.[0];
            if (file) handleReportFile(file);
        });
    }

    if (reportRemoveFileBtn) {
        reportRemoveFileBtn.addEventListener('click', clearAttachedReportFile);
    }

    if (submitReportBtn && reportTextarea) {
        submitReportBtn.addEventListener('click', () => {
            if (reportTextarea.value.trim() === '') {
                reportTextarea.classList.add('has-error');
                reportTextarea.focus();
                return;
            }
            if (reportFormView) reportFormView.style.display = 'none';
            if (reportSuccessView) reportSuccessView.style.display = 'block';
        });
    }
}


/* ==========================================
 * 5. アイテム追加モーダル（選択カード・カメラ・アルバム・AI・詳細）
 * ========================================== */
// 11/26 データベースつなげるため追加
let selectedClothingFile = null;
let hiddenImageInputEl = null;

function handleClothingImage(file) {
    if (!file) return;

    if (!file.type || !file.type.startsWith('image/')) {
        alert('画像ファイルを選択してください。');
        return;
    }

    selectedClothingFile = file;

    const previewImage = document.getElementById('previewImage');
    if (previewImage) {
        previewImage.src = URL.createObjectURL(file);
    }

    const addItemModal = document.querySelector('.add-item-modal-overlay');
    if (addItemModal) {
        addItemModal.classList.remove('is-active');
    }

    const detailModal = document.querySelector('.item-detail-modal-overlay');
    const modalTitle = document.getElementById('modalTitle');

    if (modalTitle) modalTitle.textContent = 'アイテムを追加';
    if (detailModal) detailModal.classList.add('is-active');
}

document.addEventListener('DOMContentLoaded', () => {
    // 追加モーダルの開閉
    window.addEventListener('click', (e) => {
        const mainMenuBtn = e.target.closest('#main-menu');
        const openModalBtn = e.target.closest('#openModalBtn');
        const cancelBtn = e.target.closest('.btn-cancel');
        const modalOverlay = document.querySelector('.add-item-modal-overlay');

        if ((mainMenuBtn || openModalBtn) && modalOverlay) {
            modalOverlay.classList.add('is-active');
        }
        if (cancelBtn && modalOverlay) {
            modalOverlay.classList.remove('is-active');
        }
        if (modalOverlay && e.target === modalOverlay) {
            modalOverlay.classList.remove('is-active');
        }
    });

    // 1. カメラで撮影（#cameraTriggerBtn / #cameraFileInput）
    const cameraTriggerBtn = document.getElementById('cameraTriggerBtn');
    const cameraFileInput = document.getElementById('cameraFileInput');

    if (cameraTriggerBtn && cameraFileInput) {
        cameraTriggerBtn.addEventListener('click', (e) => {
            if (e.target === cameraFileInput) return;
            e.stopPropagation();
            cameraFileInput.click();
        });

        cameraFileInput.addEventListener('change', (e) => {
            const file = e.target.files?.[0];
            if (file) {
                handleClothingImage(file);
            }
            e.target.value = '';
        });
    }

    // 2. ファイル選択（アルバム）用のインプット取得・生成と処理
    hiddenImageInputEl = document.getElementById('hiddenImageInput');
    if (!hiddenImageInputEl) {
        hiddenImageInputEl = document.createElement('input');
        hiddenImageInputEl.type = 'file';
        hiddenImageInputEl.id = 'hiddenImageInput';
        hiddenImageInputEl.accept = 'image/*';
        hiddenImageInputEl.style.display = 'none';
        document.body.appendChild(hiddenImageInputEl);
    }

    window.addEventListener('click', (e) => {
        const albumCard = e.target.closest('.selection-card:nth-child(2)') || e.target.closest('[title="アルバム"]');
        if (albumCard && hiddenImageInputEl) {
            hiddenImageInputEl.click();
        }
    });

    hiddenImageInputEl.addEventListener('change', (e) => {
        const file = e.target.files?.[0];
        if (file) {
            handleClothingImage(file);
        }
        e.target.value = '';
    });
});


/* ==========================================
 * 6. カラーパレット & カラーカスタム入力
 * ========================================== */
const colorPalette = document.getElementById('colorPalette');
const customColorInput = document.getElementById('customColorInput');
const selectedColorNameSpan = document.getElementById('selectedColorName');

if (colorPalette) {
    colorPalette.addEventListener('click', (e) => {
        const dot = e.target.closest('.color-dot');
        if (!dot) return;

        colorPalette.querySelectorAll('.color-dot').forEach(d => d.style.border = 'none');
        dot.style.border = '2px solid #1c1917';

        const colorName = dot.getAttribute('data-color');
        if (colorName && selectedColorNameSpan) {
            selectedColorNameSpan.textContent = colorName;
            if (customColorInput) customColorInput.value = "";
        }
    });
}

if (customColorInput && selectedColorNameSpan) {
    customColorInput.addEventListener('input', (e) => {
        const typedValue = e.target.value;
        if (typedValue.trim() !== "") {
            if (colorPalette) {
                colorPalette.querySelectorAll('.color-dot').forEach(d => d.style.border = 'none');
            }
            selectedColorNameSpan.textContent = typedValue;
        } else {
            selectedColorNameSpan.textContent = "未選択";
        }
    });
}


/* ==========================================
 * 7. お気に入りトグル機能
 * ========================================== */
document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('click', (e) => {
        const favoriteBtn = e.target.closest('.favorite-toggle-btn');
        if (favoriteBtn) {
            const heartSvg = favoriteBtn.querySelector('svg');
            const isCurrentlyActive = favoriteBtn.classList.contains('is-active');

            if (!isCurrentlyActive) {
                favoriteBtn.classList.add('is-active');
                if (heartSvg) {
                    heartSvg.setAttribute('fill', '#e74c3c');
                    heartSvg.setAttribute('stroke', '#e74c3c');
                }
            } else {
                favoriteBtn.classList.remove('is-active');
                if (heartSvg) {
                    heartSvg.setAttribute('fill', 'none');
                    heartSvg.setAttribute('stroke', '#ccc');
                }
            }
        }
    });
});


/* ==========================================
 * 8. 季節選択ピッカー
 * ========================================== */
const seasonPicker = document.getElementById('seasonPicker');
if (seasonPicker) {
    seasonPicker.addEventListener('click', (e) => {
        const btn = e.target.closest('.season-btn');
        if (!btn) return;
        btn.classList.toggle('is-active');
    });
}


/* ==========================================
 * 9. カテゴリー選択・入力連動
 * ========================================== */
document.addEventListener('DOMContentLoaded', () => {
    const categorySelect = document.getElementById('categorySelect');
    const categoryInput = document.getElementById('categoryInput');
    const targetCategoryName = document.getElementById('targetCategoryName');

    if (targetCategoryName) {
        const updateButtonText = (text) => {
            if (text.trim() !== "") {
                targetCategoryName.textContent = text;
            }
        };

        if (categorySelect) {
            categorySelect.addEventListener('change', (e) => {
                updateButtonText(e.target.value);
                if (categoryInput) categoryInput.value = "";
            });
        }

        if (categoryInput) {
            categoryInput.addEventListener('input', (e) => {
                const typedVal = e.target.value;
                if (typedVal.trim() !== "") {
                    updateButtonText(typedVal);
                    if (categorySelect) categorySelect.value = "";
                }
            });
        }
    }
});


/* ==========================================
 * 10. クローゼット追加ボタン・詳細モーダル管理
 * ========================================== */
const addToClosetBtn = document.getElementById('addToClosetBtn');
const detailModal = document.querySelector('.item-detail-modal-overlay');

if (addToClosetBtn && detailModal) {
    addToClosetBtn.addEventListener('click', async () => {

        if (!selectedClothingFile) {
            alert('服の画像を選択してください。');
            return;
        }

        addToClosetBtn.disabled = true;

        let uploadedPath = null;

        try {
            const { data: userData, error: userError } =
                await supabaseClient.auth.getUser();

            if (userError || !userData.user) {
                throw new Error('ログイン情報を取得できません。');
            }

            const user = userData.user;

            const fileExt = selectedClothingFile.name.split('.').pop().toLowerCase();
            const filePath = `${user.id}/${crypto.randomUUID()}.${fileExt}`;

            const { error: uploadError } = await supabaseClient
                .storage
                .from('clothing-images')
                .upload(filePath, selectedClothingFile, {
                    contentType: selectedClothingFile.type
                });

            if (uploadError) throw uploadError;

            uploadedPath = filePath;

            const textInputs = detailModal.querySelectorAll('input[type="text"]');

            const itemName = textInputs[0]?.value.trim() || '';
            const brand = textInputs[1]?.value.trim() || '';

            const categorySelect = document.getElementById('categorySelect');
            const categoryInput = document.getElementById('categoryInput');

            const category =
                categoryInput?.value.trim() ||
                categorySelect?.value || '';

            const color =
                document.getElementById('selectedColorName')?.textContent || '';

            const seasons = Array.from(
                document.querySelectorAll('#seasonPicker .season-btn.is-active')
            ).map(btn => btn.textContent.trim());

            const isFavorite =
                document.getElementById('favoriteBtn')?.classList.contains('is-active') || false;

            const { error: insertError } = await supabaseClient
                .from('clothing_items')
                .insert({
                    user_id: user.id,
                    image_path: filePath,
                    item_name: itemName,
                    brand: brand,
                    category: category,
                    color: color,
                    seasons: seasons,
                    is_favorite: isFavorite
                });

            if (insertError) throw insertError;

            alert('服をクローゼットに追加しました！');

            if (typeof window.loadClothingItems === 'function') {
                try {
                    await window.loadClothingItems();
                } catch (refreshError) {
                    console.error('一覧の更新エラー:', refreshError);
                }
            }

            selectedClothingFile = null;
            if (hiddenImageInputEl) hiddenImageInputEl.value = '';

            const cameraInput = document.getElementById('cameraFileInput');
            if (cameraInput) cameraInput.value = '';

            detailModal.classList.remove('is-active');

        } catch (error) {
            console.error('服の保存エラー:', error);

            if (uploadedPath) {
                await supabaseClient
                    .storage
                    .from('clothing-images')
                    .remove([uploadedPath]);
            }

            alert('服の保存に失敗しました。\n' + error.message);

        } finally {
            addToClosetBtn.disabled = false;
        }
    });
}


/* ==========================================
 * 11. AI自動追加モーダル機能
 * ========================================== */
document.addEventListener('DOMContentLoaded', () => {
    const aiTriggerBtn = document.getElementById('aiTriggerBtn');
    const aiModalOverlay = document.getElementById('aiModalOverlay');
    const aiCloseBtn = document.getElementById('aiCloseBtn');
    const generateBtn = document.getElementById('generateBtn');
    const aiResultArea = document.getElementById('aiResultArea');
    const aiPromptInput = document.getElementById('aiPromptInput');
    const aiErrorMessage = document.getElementById('aiErrorMessage');
    const previewImage = document.getElementById('previewImage');

    function resetAiModal() {
        if (aiPromptInput) aiPromptInput.value = '';
        if (aiErrorMessage) aiErrorMessage.style.display = 'none';
        if (aiResultArea) aiResultArea.style.display = 'none';
        if (aiPromptInput) aiPromptInput.style.borderColor = '#ccc';
        if (generateBtn) generateBtn.textContent = "画像を生成する";
    }

    if (aiTriggerBtn && aiModalOverlay) {
        aiTriggerBtn.addEventListener('click', () => {
            resetAiModal();
            aiModalOverlay.classList.add('is-active');
            if (aiPromptInput) aiPromptInput.focus();
        });
    }

    if (aiCloseBtn && aiModalOverlay) {
        aiCloseBtn.addEventListener('click', () => {
            aiModalOverlay.classList.remove('is-active');
            resetAiModal();
        });
    }

    if (generateBtn && aiResultArea) {
        generateBtn.addEventListener('click', () => {
            if (!aiPromptInput || aiPromptInput.value.trim() === "") {
                if (aiErrorMessage) {
                    aiErrorMessage.textContent = "⚠️ テキストボックスが空白です。生成したい服のキーワードを入力してください。";
                    aiErrorMessage.style.display = 'block';
                    aiPromptInput.style.borderColor = "#ef4444";
                }
                return;
            }

            if (aiErrorMessage) {
                aiErrorMessage.style.display = 'none';
                aiPromptInput.style.borderColor = "#ccc";
            }

            generateBtn.textContent = "生成中...";

            setTimeout(() => {
                generateBtn.textContent = "画像を生成する";
                aiResultArea.style.display = 'block';
            }, 800);
        });
    }

    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('selectable-ai-img')) {
            const selectedUrl = e.target.getAttribute('data-img-url');
            if (aiModalOverlay) aiModalOverlay.classList.remove('is-active');
            resetAiModal();

            if (previewImage) previewImage.src = selectedUrl;
            const modalTitle = document.getElementById('modalTitle');
            if (modalTitle) modalTitle.textContent = "アイテムを追加";
            if (detailModal) detailModal.classList.add('is-active');
        }
    });
});


/* ==========================================
 * 12. 詳細モーダルのリセット＆キャンセル処理
 * ========================================== */
document.addEventListener('DOMContentLoaded', () => {
    const detailModal = document.querySelector('.item-detail-modal-overlay');
    const previewImage = document.getElementById('previewImage');
    const modalTitle = document.getElementById('modalTitle');

    function resetDetailModal() {
        if (previewImage) previewImage.src = '';
        if (modalTitle) modalTitle.textContent = "アイテムを追加";
        if (detailModal) {
            detailModal.querySelectorAll('input[type="text"]').forEach(input => input.value = '');
        }
    }

    const cancelBtn = document.getElementById('modalCancelBtn');
    if (cancelBtn && detailModal) {
        cancelBtn.addEventListener('click', () => {
            detailModal.classList.remove('is-active');
            resetDetailModal();
        });
    }
});


/* ==========================================
 * 13. 共通カテゴリフィルター関数
 * ========================================== */
function initCategoryFilter(selectId, cardSelector, defaultFilter = 'all') {
    const filterElement = document.getElementById(selectId);
    if (!filterElement) return;

    filterElement.value = defaultFilter;

    const applyFilter = () => {
        const filterType = filterElement.value;
        const cards = document.querySelectorAll(cardSelector);

        cards.forEach(card => {
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
    };

    filterElement.addEventListener('change', applyFilter);
    applyFilter();
}


// ======================================
// ログインユーザー情報を表示    11/24追加
// ======================================
async function loadUserProfile() {
    const { data, error } = await supabaseClient.auth.getUser();

    if (error || !data.user) {
        console.error("ユーザー情報取得エラー:", error);
        return;
    }

    const user = data.user;

    const userName =
        user.user_metadata?.display_name || "MODEX User";

    const userEmail = user.email || "";

    document.querySelectorAll("[data-user-name]")
        .forEach(element => {
            element.textContent = userName;
        });

    document.querySelectorAll("[data-user-email]")
        .forEach(element => {
            element.textContent = userEmail;
        });
}

loadUserProfile();


// ======================================
// プロフィール画像をホーム画面に表示
// ======================================
async function loadUserAvatar() {
    const { data, error } =
        await supabaseClient.auth.getUser();

    if (error || !data.user) {
        console.error("画像取得エラー:", error);
        return;
    }

    const avatarUrl = data.user.user_metadata?.avatar_url;

    if (avatarUrl) {
        document.querySelectorAll(".avatar-img")
            .forEach(img => {
                img.src = avatarUrl;
                img.style.display = "block";
            });
    }
}

loadUserAvatar();