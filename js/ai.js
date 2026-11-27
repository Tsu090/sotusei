document.addEventListener('DOMContentLoaded', () => {
    const openLocationModalBtn = document.getElementById('openLocationModalBtn');
    const locationModal = document.getElementById('locationModal');
    const modalCancelBtn = document.getElementById('modalCancelBtn');
    const modalSubmitBtn = document.getElementById('modalSubmitBtn');
    const modalCityInput = document.getElementById('modalCityInput');
    const situationSelect = document.getElementById('situationSelect');

    // 1. 初期表示（デフォルトで「東京都」の天気を取得）
    fetchWeatherByPrefecture("東京都");

    // 2. 「東京都 📍 >」がクリックされたらモーダルを開く
    if (openLocationModalBtn && locationModal) {
        openLocationModalBtn.addEventListener('click', () => {
            locationModal.classList.add('is-active');
            if (modalCityInput) {
                modalCityInput.value = "";
                modalCityInput.focus();
                modalCityInput.style.borderColor = "#d1d5db";
            }
        });
    }

    // 3. モーダルを閉じる処理
    const closeLocationModal = () => {
        if (locationModal) locationModal.classList.remove('is-active');
    };

    if (modalCancelBtn) modalCancelBtn.addEventListener('click', closeLocationModal);
    if (locationModal) {
        locationModal.addEventListener('click', (e) => {
            if (e.target === locationModal) closeLocationModal();
        });
    }

    // 4. 「変更する」ボタンが押されたとき
    if (modalSubmitBtn && modalCityInput) {
        modalSubmitBtn.addEventListener('click', () => {
            const prefName = modalCityInput.value.trim();
            if (prefName !== "") {
                fetchWeatherByPrefecture(prefName);
                closeLocationModal(); 
            } else {
                modalCityInput.style.borderColor = "#ef4444";
            }
        });

        modalCityInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                modalSubmitBtn.click();
            }
        });
        
        modalCityInput.addEventListener('input', () => {
            modalCityInput.style.borderColor = "#d1d5db";
        });
    }

    // 5. シチュエーションが変更されたときの処理（必要に応じて拡張できます）
    if (situationSelect) {
        situationSelect.addEventListener('change', (e) => {
            console.log(`選択されたシチュエーション: ${e.target.value}`);
            // TODO: ここに選んだシーンに応じたAIコーデ切り替え処理などを繋げられます
        });
    }
});

// 都道府県名から天気を取得し、正式名称で表示する関数
function fetchWeatherByPrefecture(rawInput) {
    const tempElement = document.getElementById('weatherTemp');
    const locationNameEl = document.getElementById('locationName');
    
    if (tempElement) tempElement.textContent = '...';

    const prefName = rawInput.trim();

    // 画面表示用に「都・道・府・県」を自動補完
    let displayName = prefName;
    if (prefName === "北海道") {
        displayName = "北海道";
    } else if (prefName === "東京" || prefName === "東京都") {
        displayName = "東京都";
    } else if (prefName === "京都" || prefName === "京都府") {
        displayName = "京都府";
    } else if (prefName === "大阪" || prefName === "大阪府") {
        displayName = "大阪府";
    } else {
        if (!/[都道府県]$/.test(prefName)) {
            displayName = prefName + "県";
        }
    }

    // 検索用英語名マップ
    const prefToEnglish = {
        "北海道": "Hokkaido", "青森": "Aomori", "青森県": "Aomori", "岩手": "Iwate", "岩手県": "Iwate",
        "宮城": "Miyagi", "宮城県": "Miyagi", "秋田": "Akita", "秋田県": "Akita",
        "山形": "Yamagata", "山形県": "Yamagata", "福島": "Fukushima", "福島県": "Fukushima",
        "茨城": "Ibaraki", "茨城県": "Ibaraki", "栃木": "Tochigi", "栃木県": "Tochigi",
        "群馬": "Gunma", "群馬県": "Gunma", "埼玉": "Saitama", "埼玉県": "Saitama",
        "千葉": "Chiba", "千葉県": "Chiba", "東京": "Tokyo", "東京都": "Tokyo",
        "神奈川": "Kanagawa", "神奈川県": "Kanagawa", "新潟": "Niigata", "新潟県": "Niigata",
        "富山": "Toyama", "富山県": "Toyama", "石川": "Ishikawa", "石川県": "Ishikawa",
        "福井": "Fukui", "福井県": "Fukui", "山梨": "Yamanashi", "山梨県": "Yamanashi",
        "長野": "Nagano", "長野県": "Nagano", "岐阜": "Gifu", "岐阜県": "Gifu",
        "静岡": "Shizuoka", "静岡県": "Shizuoka", "愛知": "Aichi", "愛知県": "Aichi",
        "三重": "Mie", "三重県": "Mie", "滋賀": "Shiga", "滋賀県": "Shiga",
        "京都": "Kyoto", "京都府": "Kyoto", "大阪": "Osaka", "大阪府": "Osaka",
        "兵庫": "Hyogo", "兵庫県": "Hyogo", "奈良": "Nara", "奈良県": "Nara",
        "和歌山": "Wakayama", "和歌山県": "Wakayama", "鳥取": "Tottori", "鳥取県": "Tottori",
        "島根": "Shimane", "島根県": "Shimane", "岡山": "Okayama", "岡山県": "Okayama",
        "広島": "Hiroshima", "広島県": "Hiroshima", "山口": "Yamaguchi", "山口県": "Yamaguchi",
        "徳島": "Tokushima", "徳島県": "Tokushima", "香川": "Kagawa", "香川県": "Kagawa",
        "愛媛": "Ehime", "愛媛県": "Ehime", "高知": "Kochi", "高知県": "Kochi",
        "福岡": "Fukuoka", "福岡県": "Fukuoka", "佐賀": "Saga", "佐賀県": "Saga",
        "長崎": "Nagasaki", "長崎県": "Nagasaki", "熊本": "Kumamoto", "熊本県": "Kumamoto",
        "大分": "Oita", "大分県": "Oita", "宮崎": "Miyazaki", "宮崎県": "Miyazaki",
        "鹿児島": "Kagoshima", "鹿児島県": "Kagoshima", "沖縄": "Okinawa", "沖縄県": "Okinawa"
    };

    const searchName = prefToEnglish[prefName] || prefToEnglish[displayName] || prefName;
    const geocodeUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchName)}&count=1&language=ja`;

    fetch(geocodeUrl)
        .then(response => response.json())
        .then(data => {
            if (data && data.results && data.results.length > 0) {
                const location = data.results[0];
                if (locationNameEl) locationNameEl.textContent = displayName;
                getWeather(location.latitude, location.longitude);
            } else {
                if (tempElement) tempElement.textContent = '見つかりません';
            }
        })
        .catch(error => {
            console.error('位置情報の検索に失敗しました:', error);
            if (tempElement) tempElement.textContent = 'エラー';
        });
}

// 天気・気温の取得
function getWeather(lat, lon) {
    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code`;

    fetch(apiUrl)
        .then(res => res.json())
        .then(data => {
            if (data && data.current) {
                const temp = Math.round(data.current.temperature_2m);
                const tempElement = document.getElementById('weatherTemp');
                if (tempElement) tempElement.textContent = `${temp}°C`;
                updateWeatherSVG(data.current.weather_code);
            }
        });
}

// 天気コード（WMO）に応じてSVGと天気テキストを切り替える関数
function updateWeatherSVG(code) {
    const iconContainer = document.getElementById('weatherIconContainer');
    const textEl = document.getElementById('weatherText');
    let svgContent = '';
    let text = '晴れ';

    if (code === 0) {
        // 快晴・晴れ
        text = '晴れ';
        svgContent = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #f59e0b;"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
    } else if (code === 1 || code === 2) {
        // 晴れ時々くもり（太陽＋雲）
        text = '晴れ時々くもり';
        svgContent = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #f59e0b;"><path d="M12 2v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="M20 12h2"></path><path d="m19.07 4.93-1.41 1.41"></path><path d="M15.947 12.65a4 4 0 0 0-5.925-4.128"></path><path d="M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z" style="color: #64748b;"></path></svg>`;
    } else if (code === 3) {
        // くもり
        text = 'くもり';
        svgContent = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #64748b;"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path></svg>`;
    } else if (code === 45 || code === 48) {
        // 霧・もや
        text = '霧';
        svgContent = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #94a3b8;"><path d="M4 14h16"></path><path d="M4 18h16"></path><path d="M6 10h12"></path><path d="M8 6h8"></path></svg>`;
    } else if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) {
        // 雨・霧雨・にわか雨
        text = code >= 63 ? '強い雨' : '雨';
        svgContent = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #3b82f6;"><line x1="16" y1="13" x2="16" y2="21"></line><line x1="8" y1="13" x2="8" y2="21"></line><line x1="12" y1="15" x2="12" y2="23"></line><path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"></path></svg>`;
    } else if ((code >= 71 && code <= 77) || code === 85 || code === 86) {
        // 雪・みぞれ・雪のにわか雨
        text = '雪';
        svgContent = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #0ea5e9;"><path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25"></path><line x1="8" y1="16" x2="8.01" y2="16"></line><line x1="16" y1="16" x2="16.01" y2="16"></line><line x1="12" y1="19" x2="12.01" y2="19"></line><line x1="12" y1="14" x2="12.01" y2="14"></line></svg>`;
    } else if (code >= 95) {
        // 雷雨
        text = '雷雨';
        svgContent = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #eab308;"><path d="M19 16.9A5 5 0 0 0 18 7h-1.26a8 8 0 1 0-11.62 9"></path><polyline points="13 11 9 17 15 17 11 23"></polyline></svg>`;
    } else {
        // その他フォールバック
        text = '晴れ';
        svgContent = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #f59e0b;"><circle cx="12" cy="12" r="5"></circle></svg>`;
    }

    if (iconContainer) iconContainer.innerHTML = svgContent;
    if (textEl) textEl.textContent = `今日の天気に合わせる
    （${text}）`;
}

document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.getElementById('otherCoordsCarousel');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');

    if (carousel && prevBtn && nextBtn) {
        // 右ボタンが押されたら右へスクロール
        nextBtn.addEventListener('click', () => {
            carousel.scrollBy({ left: 200, behavior: 'smooth' });
        });

        // 左ボタンが押されたら左へスクロール
        prevBtn.addEventListener('click', () => {
            carousel.scrollBy({ left: -200, behavior: 'smooth' });
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const openBtn = document.getElementById('textSuggestBtn');
    const closeBtn = document.getElementById('closeTextSuggestBtn');
    const saveBtn = document.getElementById('suggestSaveBtn');
    const overlay = document.getElementById('textSuggestOverlay');
    const submitBtn = document.getElementById('submitTextSuggestBtn');
    const promptInput = document.getElementById('suggestPromptInput');
    const errorMsg = document.getElementById('suggestErrorMessage');
    const coordItems = document.getElementById('suggestCoordItems');
    const tryOnBox = document.getElementById('suggestTryOnBox');

    const sampleCoords = [
        {
            items: [
                { label: 'Black Coat', className: 'item-coat' },
                { label: 'Red Tee', className: 'item-tops' },
                { label: 'Purple Skirt', className: 'item-bottoms' },
                { label: 'Leather Boots', className: 'item-shoes' }
            ],
            tryOnUrl: 'https://placehold.co/320x420/27313d/ffffff?text=Try-On+Look+1'
        },
        {
            items: [
                { label: 'Beige Trench', className: 'item-coat' },
                { label: 'White Shirt', className: 'item-tops' },
                { label: 'Navy Pants', className: 'item-bottoms' },
                { label: 'Loafers', className: 'item-shoes' }
            ],
            tryOnUrl: 'https://placehold.co/320x420/44403c/ffffff?text=Try-On+Look+2'
        }
    ];

    let currentIndex = 0;
    let hasSuggested = false; // 提案済みかどうかの状態

    // 保存ボタンの有効・無効を切り替える関数
    function updateSaveButtonState(enabled) {
        hasSuggested = enabled;
        if (saveBtn) {
            saveBtn.disabled = !enabled;
        }
    }

    // エラー表示を消す関数
    function clearSuggestError() {
        if (promptInput) {
            promptInput.classList.remove('is-error');
        }
        if (errorMsg) {
            errorMsg.textContent = '';
            errorMsg.style.display = 'none';
        }
    }

    // エラーを表示する関数
    function showSuggestError(message) {
        if (promptInput) {
            promptInput.classList.add('is-error');
            promptInput.focus();
        }
        if (errorMsg) {
            errorMsg.textContent = message;
            errorMsg.style.display = 'block';
        }
    }

    // ドロワー内のプレビューを初期状態（空）に戻す
    function resetDrawerState() {
        if (coordItems) coordItems.innerHTML = '';
        if (tryOnBox) tryOnBox.innerHTML = '';
        if (promptInput) promptInput.value = '';
        clearSuggestError();
        updateSaveButtonState(false); // 最初は「保存をする」を押せない状態にする
    }

    function renderSuggestedCoord(coordData) {
        if (coordItems) {
            coordItems.innerHTML = '';
            coordData.items.forEach((item) => {
                const card = document.createElement('div');
                card.className = `suggest-item-card ${item.className}`;
                card.textContent = item.label;
                coordItems.appendChild(card);
            });
        }

        if (tryOnBox) {
            tryOnBox.innerHTML = '';
            if (coordData.tryOnUrl) {
                const img = document.createElement('img');
                img.src = coordData.tryOnUrl;
                img.alt = '実際に着ている写真';
                img.className = 'suggest-tryon-img';
                tryOnBox.appendChild(img);
            }
        }
    }

    // ドロワーを開くとき
    if (openBtn && overlay) {
        openBtn.addEventListener('click', () => {
            resetDrawerState();
            overlay.classList.add('is-active');
        });
    }

    // 閉じるボタン
    if (closeBtn && overlay) {
        closeBtn.addEventListener('click', () => {
            overlay.classList.remove('is-active');
        });
    }

    // 背景クリックで閉じる
    if (overlay) {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.classList.remove('is-active');
            }
        });
    }

    // 文字を入力し始めたらエラー表示を消す
    if (promptInput) {
        promptInput.addEventListener('input', () => {
            if (promptInput.value.trim() !== '') {
                clearSuggestError();
            }
        });
    }

    // 「この内容で提案する」を押したときの処理
    if (submitBtn) {
        submitBtn.addEventListener('click', () => {
            const text = promptInput ? promptInput.value.trim() : '';

            // 空欄チェック
            if (text === '') {
                showSuggestError('提案してほしいコーデの内容やイメージを入力してください。');
                return;
            }

            clearSuggestError();

            let chosen;
            if (text.includes('きれい') || text.includes('オフィス') || text.includes('デート')) {
                chosen = sampleCoords[1];
            } else {
                chosen = sampleCoords[currentIndex % sampleCoords.length];
                currentIndex += 1;
            }

            renderSuggestedCoord(chosen);
            updateSaveButtonState(true); // 提案が完了したので「保存をする」を有効化
        });
    }

    // 「保存をする」を押したときの処理
    if (saveBtn && overlay) {
        saveBtn.addEventListener('click', () => {
            if (!hasSuggested) return;

            // TODO: 必要になったらここに保存処理（Supabase登録やメイン画面への反映など）を追加
            overlay.classList.remove('is-active');
        });
    }
});
document.addEventListener('DOMContentLoaded', () => {
    const prevBtn = document.getElementById('coordPrevBtn');
    const nextBtn = document.getElementById('coordNextBtn');
    const pageCountEl = document.getElementById('coordPageCount');
    const mediaImgs = document.querySelectorAll('.coord-sub-grid .coord-media-img');
    const adviceCommentEl = document.getElementById('aiAdviceComment');
    const advicePointsEl = document.getElementById('aiAdvicePoints');
    const carouselEl = document.getElementById('otherCoordsCarousel');

    const recommendedCoords = [
        {
            coordImg: 'https://via.placeholder.com/420x560?text=Coord+1',
            coordAlt: 'AI提案コーデ 1',
            tryOnImg: 'https://via.placeholder.com/420x560?text=Try-On+1',
            tryOnAlt: '着てみた画像 1',
            miniImg: 'https://via.placeholder.com/70x90?text=Coord1',
            comment: '今日は暖かいため、白シャツにデニムでさわやかにまとめています。',
            points: [
                '春らしい軽やかな印象に',
                'シンプルなアイテムでバランスよく',
                '動きやすくて快適',
                'カジュアルながらも清潔感のあるスタイル'
            ]
        },
        {
            coordImg: 'https://via.placeholder.com/420x560?text=Coord+2',
            coordAlt: 'AI提案コーデ 2',
            tryOnImg: 'https://via.placeholder.com/420x560?text=Try-On+2',
            tryOnAlt: '着てみた画像 2',
            miniImg: 'https://via.placeholder.com/70x90?text=Coord2',
            comment: '少し肌寒いので、羽織りものを足して温度調節しやすい組み合わせにしています。',
            points: [
                '脱ぎ着しやすいレイヤード構成',
                '落ち着いた色味で大人っぽく',
                '街歩きにもなじむシルエット',
                '重くなりすぎない軽快なバランス'
            ]
        },
        {
            coordImg: 'https://via.placeholder.com/420x560?text=Coord+3',
            coordAlt: 'AI提案コーデ 3',
            tryOnImg: 'https://via.placeholder.com/420x560?text=Try-On+3',
            tryOnAlt: '着てみた画像 3',
            miniImg: 'https://via.placeholder.com/70x90?text=Coord3',
            comment: 'リラックス感を重視しつつ、足元をまとめてだらしなく見えないように整えました。',
            points: [
                '長時間でも疲れにくい着心地',
                '色のトーンを揃えて統一感アップ',
                '写真映えするすっきりしたライン',
                '休日のお出かけにぴったり'
            ]
        }
    ];

    if (recommendedCoords.length === 0) return;

    let currentIndex = 0;

    function updateActiveMiniCard(index) {
        if (!carouselEl) return;
        const cards = carouselEl.querySelectorAll('.mini-coord-card');
        cards.forEach((card, i) => {
            card.classList.toggle('is-active', i === index);
        });
    }

    function renderMiniCards() {
        if (!carouselEl) return;
        carouselEl.innerHTML = '';

        recommendedCoords.forEach((coord, i) => {
            const card = document.createElement('div');
            card.className = 'mini-coord-card';

            const img = document.createElement('img');
            img.src = coord.miniImg || coord.coordImg;
            img.alt = `コーデ${i + 1}`;

            card.appendChild(img);
            card.addEventListener('click', () => {
                currentIndex = i;
                renderCoord(currentIndex);
            });

            carouselEl.appendChild(card);
        });
    }

    function renderCoord(index) {
        const coord = recommendedCoords[index];
        if (!coord) return;

        if (mediaImgs.length >= 2) {
            mediaImgs[0].src = coord.coordImg;
            mediaImgs[0].alt = coord.coordAlt;
            mediaImgs[1].src = coord.tryOnImg;
            mediaImgs[1].alt = coord.tryOnAlt;
        }

        if (pageCountEl) {
            pageCountEl.textContent = `${index + 1}/${recommendedCoords.length}`;
        }

        if (adviceCommentEl) {
            adviceCommentEl.textContent = coord.comment;
        }

        if (advicePointsEl) {
            advicePointsEl.innerHTML = '';
            coord.points.forEach((pointText) => {
                const li = document.createElement('li');
                li.className = 'advice-point-item';

                const badge = document.createElement('span');
                badge.className = 'check-badge';
                badge.textContent = '✓';

                const span = document.createElement('span');
                span.textContent = pointText;

                li.appendChild(badge);
                li.appendChild(span);
                advicePointsEl.appendChild(li);
            });
        }

        updateActiveMiniCard(index);
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + recommendedCoords.length) % recommendedCoords.length;
            renderCoord(currentIndex);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % recommendedCoords.length;
            renderCoord(currentIndex);
        });
    }

    renderMiniCards();
    renderCoord(currentIndex);
});