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

// 1. ファイル選択用 input を用意（すでにHTMLになければ自動作成）
let hiddenInput = document.getElementById('hiddenImageInput');
if (!hiddenInput) {
    hiddenInput = document.createElement('input');
    hiddenInput.type = 'file';
    hiddenInput.id = 'hiddenImageInput';
    hiddenInput.accept = 'image/*';
    hiddenInput.style.display = 'none';
    document.body.appendChild(hiddenInput);
}

// 2. 「アルバム・ファイルから選択」カードがクリックされたら、inputを強制クリックする
window.addEventListener('click', (e) => {
    const albumCard = e.target.closest('.selection-card:nth-child(2)') || e.target.closest('[title="アルバム"]');
    
    if (albumCard) {
        hiddenInput.click();
    }
});

// 3. 写真が選ばれたときの処理
hiddenInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        // プレビュー画像にセット
        const previewImage = document.getElementById('previewImage');
        if (previewImage) {
            previewImage.src = URL.createObjectURL(file);
        }

        // 詳細入力モーダルを開く（is-activeクラスを追加）
        const detailModal = document.querySelector('.item-detail-modal-overlay');
        if (detailModal) {
            detailModal.classList.add('is-active');
        }
    }
});

const colorPalette = document.getElementById('colorPalette');
const customColorInput = document.getElementById('customColorInput');
const selectedColorNameSpan = document.getElementById('selectedColorName');

// 1. カラーパレットの丸いボタンが押されたときの処理
if (colorPalette) {
    colorPalette.addEventListener('click', (e) => {
        const dot = e.target.closest('.color-dot');
        if (!dot) return;

        // すべてのチップの枠線をリセット
        const allDots = colorPalette.querySelectorAll('.color-dot');
        allDots.forEach(d => d.style.border = 'none');

        // 押されたチップに枠線をつける
        dot.style.border = '2px solid #1c1917';

        // 色名を取得
        const colorName = dot.getAttribute('data-color');
        if (colorName) {
            // 表示用ボックスに反映
            if (selectedColorNameSpan) {
                selectedColorNameSpan.textContent = colorName;
            }
            // 自由入力側のテキストボックスを空にする（あるいは連動させる場合はそのままでもOKですが、手入力を優先させるために空にするか同期させます）
            // ここでは手入力をクリアしてスッキリさせたい場合の例です
            if (customColorInput) {
                customColorInput.value = ""; 
            }
        }
    });
}

// 2. 青色枠のテキストボックスに直接手入力されたときの処理
if (customColorInput && selectedColorNameSpan) {
    customColorInput.addEventListener('input', (e) => {
        const typedValue = e.target.value;
        
        if (typedValue.trim() !== "") {
            // ★ポイント：手入力が始まったら、上のカラーチップの選択（枠線）をすべて消す！
            if (colorPalette) {
                const allDots = colorPalette.querySelectorAll('.color-dot');
                allDots.forEach(d => d.style.border = 'none');
            }

            // 右側の表示ボックスに入力された文字を反映
            selectedColorNameSpan.textContent = typedValue;
        } else {
            // テキストが空になったときの表示
            selectedColorNameSpan.textContent = "未選択";
        }
    });
}

// ページの要素がすべて読み込まれてから安全にイベントを登録する
document.addEventListener('DOMContentLoaded', () => {
    // 画面全体をクリック監視して、favorite-toggle-btn が押されたかを判定する（後から出たモーダルでも確実に対応できる書き方）
    document.addEventListener('click', (e) => {
        // クリックされたのが favorite-toggle-btn またはその中の SVG かを判定
        const favoriteBtn = e.target.closest('.favorite-toggle-btn');
        
        if (favoriteBtn) {
            const heartSvg = favoriteBtn.querySelector('svg');
            
            // 現在アクティブ（お気に入り中）かどうかを判定
            const isCurrentlyActive = favoriteBtn.classList.contains('is-active');

            if (!isCurrentlyActive) {
                // OFF → ON（赤くする）
                favoriteBtn.classList.add('is-active');
                if (heartSvg) {
                    heartSvg.setAttribute('fill', '#e74c3c');
                    heartSvg.setAttribute('stroke', '#e74c3c');
                }
                console.log('❤️ お気に入り登録しました');
            } else {
                // ON → OFF（グレーに戻す）
                favoriteBtn.classList.remove('is-active');
                if (heartSvg) {
                    heartSvg.setAttribute('fill', 'none');
                    heartSvg.setAttribute('stroke', '#ccc');
                }
                console.log('🤍 お気に入りを解除しました');
            }
        }
    });
});

// 季節選択エリアの処理
const seasonPicker = document.getElementById('seasonPicker');

if (seasonPicker) {
    seasonPicker.addEventListener('click', (e) => {
        // 押されたのが季節ボタン（.season-btn）のときだけ反応させる
        const btn = e.target.closest('.season-btn');
        if (!btn) return;

        // クラスのON/OFFを切り替える（これで複数選べるようになります）
        btn.classList.toggle('is-active');

        // 現在選ばれている季節のリストを配列として取得（コンソール確認＆データ保存用）
        const selectedSeasons = Array.from(seasonPicker.querySelectorAll('.season-btn.is-active'))
                                     .map(b => b.getAttribute('data-season'));
        
        console.log('選択中の季節:', selectedSeasons);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const categorySelect = document.getElementById('categorySelect');
    const categoryInput = document.getElementById('categoryInput');
    const targetCategoryName = document.getElementById('targetCategoryName');

    if (targetCategoryName) {
        // ボタンの文字を更新する関数
        const updateButtonText = (text) => {
            if (text.trim() !== "") {
                targetCategoryName.textContent = text;
            }
        };

        // 1. プルダウン（select）が変更されたとき
        if (categorySelect) {
            categorySelect.addEventListener('change', (e) => {
                const selectedVal = e.target.value;
                updateButtonText(selectedVal);
                // プルダウンで選んだら、テキストボックス側は空にする（スッキリさせるため）
                if (categoryInput) categoryInput.value = "";
            });
        }

        // 2. テキストボックス（input）に直接入力されたとき
        if (categoryInput) {
            categoryInput.addEventListener('input', (e) => {
                const typedVal = e.target.value;
                if (typedVal.trim() !== "") {
                    updateButtonText(typedVal);
                    // 手入力されたら、プルダウンの選択をリセット（または非選択にする）
                    if (categorySelect) categorySelect.value = "";
                }
            });
        }
    }
});

const addToClosetBtn = document.getElementById('addToClosetBtn');
const detailModal = document.querySelector('.item-detail-modal-overlay'); // モーダルの全体背景など

if (addToClosetBtn && detailModal) {
    addToClosetBtn.addEventListener('click', () => {
        // 1. 入力されたデータ（カテゴリー、色、季節、お気に入りなど）をここで取得・確認できます
        console.log('✨ クローゼットにアイテムを追加しました！（仮）');

        // 2. モーダルを閉じる（is-activeクラスを外す）
        detailModal.classList.remove('is-active');

        // 3. （お好みで）入力欄やプレビューをリセットする処理をここに挟んでもOKです
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const cameraTriggerBtn = document.getElementById('cameraTriggerBtn');
    const cameraFileInput = document.getElementById('cameraFileInput');
    const previewImage = document.getElementById('previewImage'); // プレビュー用の<img>タグ（必要に応じてIDを確認してください）
    const detailModal = document.querySelector('.item-detail-modal-overlay'); // 詳細モーダル

    if (cameraTriggerBtn && cameraFileInput) {
        // 1. 「カメラで撮影」カードがクリックされたとき
        cameraTriggerBtn.addEventListener('click', () => {
            cameraFileInput.click(); // 裏側のファイル選択（カメラ）を強制起動
        });

        // 2. 写真が撮影・選択されたとき
        cameraFileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                console.log('📸 写真が選択されました:', file.name);

                // プレビュー画像にセット
                if (previewImage) {
                    previewImage.src = URL.createObjectURL(file);
                }

                // 詳細入力モーダルを開く
                if (detailModal) {
                    detailModal.classList.add('is-active');
                }
            }
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const aiTriggerBtn = document.getElementById('aiTriggerBtn');
    const aiModalOverlay = document.getElementById('aiModalOverlay');
    const aiCloseBtn = document.getElementById('aiCloseBtn');
    const generateBtn = document.getElementById('generateBtn');
    const aiResultArea = document.getElementById('aiResultArea');
    const aiPromptInput = document.getElementById('aiPromptInput');
    const aiErrorMessage = document.getElementById('aiErrorMessage');
    const previewImage = document.getElementById('previewImage');
    const detailModal = document.querySelector('.item-detail-modal-overlay');

    // 🧹 モーダルをリセットする関数
    function resetAiModal() {
        if (aiPromptInput) aiPromptInput.value = '';
        if (aiErrorMessage) aiErrorMessage.style.display = 'none';
        if (aiResultArea) aiResultArea.style.display = 'none'; // ここで一度隠す
        if (aiPromptInput) aiPromptInput.style.borderColor = '#ccc';
        if (generateBtn) generateBtn.textContent = "画像を生成する";
    }

    // 1. AI追加ボタンを押したとき
    if (aiTriggerBtn && aiModalOverlay) {
        aiTriggerBtn.addEventListener('click', () => {
            resetAiModal();
            aiModalOverlay.classList.add('is-active');
            if (aiPromptInput) aiPromptInput.focus();
        });
    }

    // 2. 閉じるボタン（✕）を押したとき
    if (aiCloseBtn && aiModalOverlay) {
        aiCloseBtn.addEventListener('click', () => {
            aiModalOverlay.classList.remove('is-active');
            resetAiModal();
        });
    }

    // 3. 💡「画像を生成する」ボタンを押したときの処理（ここを確認！）
    if (generateBtn && aiResultArea) {
        generateBtn.addEventListener('click', () => {
            // 空白チェック
            if (!aiPromptInput || aiPromptInput.value.trim() === "") {
                if (aiErrorMessage) {
                    aiErrorMessage.textContent = "⚠️ テキストボックスが空白です。生成したい服のキーワードを入力してください。";
                    aiErrorMessage.style.display = 'block';
                    aiPromptInput.style.borderColor = "#ef4444";
                }
                return;
            }

            // エラー表示を消す
            if (aiErrorMessage) {
                aiErrorMessage.style.display = 'none';
                aiPromptInput.style.borderColor = "#ccc";
            }

            // 生成中の演出
            generateBtn.textContent = "生成中...";
            
            setTimeout(() => {
                generateBtn.textContent = "画像を生成する";
                // 🔑 ここで確実に生成結果エリアを表示させる！
                aiResultArea.style.display = 'block'; 
                console.log('✨ 画像候補が表示されました');
            }, 800);
        });
    }

    // 4. 生成された画像を選択したとき
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('selectable-ai-img')) {
            const selectedUrl = e.target.getAttribute('data-img-url');

            if (aiModalOverlay) {
                aiModalOverlay.classList.remove('is-active');
            }

            resetAiModal(); // リセット

            if (previewImage) {
                previewImage.src = selectedUrl;
            }

            if (detailModal) {
                detailModal.classList.add('is-active');
            }
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const detailModal = document.querySelector('.item-detail-modal-overlay');
    const previewImage = document.getElementById('previewImage');
    const modalTitle = document.getElementById('modalTitle'); // 💡 ヘッダーのタイトル要素

    // 🧹 モーダルをリセットする関数（タイトルをデフォルトの「アイテムを追加」に戻す）
    function resetDetailModal() {
        if (previewImage) previewImage.src = '';
        if (modalTitle) modalTitle.textContent = "アイテムを追加"; // デフォルト
        
        // テキスト入力欄などもここでリセット
        const textInputs = detailModal.querySelectorAll('input[type="text"]');
        textInputs.forEach(input => input.value = '');
    }

    // 1. 👕 【クローゼットの服をクリックして開いたとき】 ➔ 「アイテムを編集」にする
    document.addEventListener('click', (e) => {
        if (e.target.closest('.favorite-btn')) return;

        const itemCard = e.target.closest('.item-card');
        if (itemCard) {
            const cardImg = itemCard.querySelector('.image-wrapper img');
            if (cardImg && previewImage) {
                previewImage.src = cardImg.src;
            }

            // 🔑 ここでタイトルを「アイテムを編集」に変更！
            if (modalTitle) {
                modalTitle.textContent = "アイテムを編集";
            }

            if (detailModal) {
                detailModal.classList.add('is-active');
            }
        }
    });

    // 2. ✨ 【AI自動追加の画像を選んで開いたとき、または新規追加のとき】 ➔ 「アイテムを追加」にする
    // （AI生成画像が選ばれたときの処理の中）
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('selectable-ai-img')) {
            const selectedUrl = e.target.getAttribute('data-img-url');

            const aiModalOverlay = document.getElementById('aiModalOverlay');
            if (aiModalOverlay) aiModalOverlay.classList.remove('is-active');

            if (previewImage) previewImage.src = selectedUrl;

            // 🔑 新規追加なので「アイテムを追加」にする
            if (modalTitle) {
                modalTitle.textContent = "アイテムを追加";
            }

            if (detailModal) {
                detailModal.classList.add('is-active');
            }
        }
    });

    // キャンセルボタンなどで閉じたときのリセット処理
    const cancelBtn = document.getElementById('modalCancelBtn');
    if (cancelBtn && detailModal) {
        cancelBtn.addEventListener('click', () => {
            detailModal.classList.remove('is-active');
            resetDetailModal();
        });
    }
});