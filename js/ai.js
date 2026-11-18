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

// SVGアイコンを切り替える関数
function updateWeatherSVG(code) {
    const iconContainer = document.getElementById('weatherIconContainer');
    const textEl = document.getElementById('weatherText');
    let svgContent = '';
    let text = '晴れ';

    if (code === 0) {
        text = '晴れ';
        // style="color: ..." で色だけを残し、幅・高さはCSSに任せる
        svgContent = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #f59e0b;"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
    } else if (code >= 1 && code <= 3) {
        text = 'くもり';
        svgContent = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #64748b;"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path></svg>`;
    } else if (code >= 51 && code <= 67) {
        text = '雨';
        svgContent = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #3b82f6;"><line x1="16" y1="13" x2="16" y2="21"></line><line x1="8" y1="13" x2="8" y2="21"></line><line x1="12" y1="15" x2="12" y2="23"></line><path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"></path></svg>`;
    } else {
        text = '晴れ';
        svgContent = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #f59e0b;"><circle cx="12" cy="12" r="5"></circle></svg>`;
    }

    if (iconContainer) iconContainer.innerHTML = svgContent;
    if (textEl) textEl.textContent = `今日の天気に合わせる（${text}）`;
}