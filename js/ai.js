document.addEventListener('DOMContentLoaded', () => {
    const openLocationModalBtn = document.getElementById('openLocationModalBtn');
    const locationModal = document.getElementById('locationModal');
    const modalCancelBtn = document.getElementById('modalCancelBtn');
    const modalSubmitBtn = document.getElementById('modalSubmitBtn');
    const modalCityInput = document.getElementById('modalCityInput');

    // 1. 初期表示（東京都の天気を取得）
    fetchWeatherByCityName("東京都");

    // 2. 「東京都 📍 >」がクリックされたらモーダルを開く
    if (openLocationModalBtn && locationModal) {
        openLocationModalBtn.addEventListener('click', () => {
            locationModal.classList.add('is-active');
            if (modalCityInput) {
                modalCityInput.value = ""; // 入力欄をクリア
                modalCityInput.focus();     // すぐ入力できるようにフォーカス
            }
        });
    }

    // 3. キャンセルボタンまたは背景クリックで閉じる
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
            const cityName = modalCityInput.value.trim();
            if (cityName !== "") {
                fetchWeatherByCityName(cityName);
                closeLocationModal(); // モーダルを閉じる
            } else {
                modalCityInput.style.borderColor = "#ef4444"; // 未入力なら枠を赤くする
            }
        });

        // Enterキーでも決定できるようにする
        modalCityInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                modalSubmitBtn.click();
            }
        });
        
        modalCityInput.addEventListener('input', () => {
            modalCityInput.style.borderColor = "#d1d5db";
        });
    }
});

// 地名から緯度・経度を検索して天気を取得する関数（郡や町村も網羅した完全版）
function fetchWeatherByCityName(rawCityName) {
    const tempElement = document.getElementById('weatherTemp');
    const locationNameEl = document.getElementById('locationName');
    
    if (tempElement) tempElement.textContent = '...';

    // 💡 APIが苦手な「郡」や「町村」、主要な地名をここに自由に登録できます！
    const customLocations = {
        // 羽島郡・周辺エリア
        "羽島郡": { lat: 35.3855, lon: 136.7583, name: "羽島郡" },
        "岐南町": { lat: 35.3855, lon: 136.7583, name: "岐南町" },
        "笠松町": { lat: 35.3789, lon: 136.7383, name: "笠松町" },
        
        // その他の主要エリア（必要に応じて自由に追加可能）
        "岐阜市": { lat: 35.4233, lon: 136.7606, name: "岐阜市" },
        "羽島市": { lat: 35.3189, lon: 136.7119, name: "羽島市" },
        "各務原市": { lat: 35.3944, lon: 136.8322, name: "各務原市" },
        "大垣市": { lat: 35.3656, lon: 136.6114, name: "大垣市" }
    };

    // 1. まず手動辞書の中に完全一致するものがあるかチェック
    if (customLocations[rawCityName]) {
        const loc = customLocations[rawCityName];
        console.log(`📌 登録済みスポットから取得: ${loc.name}`);
        if (locationNameEl) locationNameEl.textContent = loc.name;
        getWeather(loc.lat, loc.lon);
        return;
    }

    // 2. 辞書にない場合は、これまで通り「市」「区」「町」「村」「郡」を削ってAPIで検索
    const cleanCityName = rawCityName.replace(/[市区町村郡]$/, '').trim();
    const geocodeUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cleanCityName)}&count=1&language=ja`;

    fetch(geocodeUrl)
        .then(response => response.json())
        .then(data => {
            if (data && data.results && data.results.length > 0) {
                const location = data.results[0];
                if (locationNameEl) locationNameEl.textContent = rawCityName;
                getWeather(location.latitude, location.longitude);
            } else {
                if (tempElement) tempElement.textContent = '見つかりません';
                console.warn(`⚠️ 地域「${rawCityName}」が見つかりませんでした。`);
            }
        })
        .catch(error => {
            console.error('位置情報の検索に失敗しました:', error);
            if (tempElement) tempElement.textContent = 'エラー';
        });
}

// 実際の天気・気温を取得する関数
function getWeather(lat, lon) {
    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code`;

    fetch(apiUrl)
        .then(res => res.json())
        .then(data => {
            if (data && data.current) {
                const temp = Math.round(data.current.temperature_2m);
                const tempElement = document.getElementById('weatherTemp');
                if (tempElement) {
                    tempElement.textContent = `${temp}°C`;
                }
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
        svgContent = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 20px; height: 20px; color: #f59e0b;"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
    } else if (code >= 1 && code <= 3) {
        text = 'くもり';
        svgContent = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 20px; height: 20px; color: #64748b;"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path></svg>`;
    } else if (code >= 51 && code <= 67) {
        text = '雨';
        svgContent = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 20px; height: 20px; color: #3b82f6;"><line x1="16" y1="13" x2="16" y2="21"></line><line x1="8" y1="13" x2="8" y2="21"></line><line x1="12" y1="15" x2="12" y2="23"></line><path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"></path></svg>`;
    } else {
        text = '晴れ';
        svgContent = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 20px; height: 20px; color: #f59e0b;"><circle cx="12" cy="12" r="5"></circle></svg>`;
    }

    if (iconContainer) iconContainer.innerHTML = svgContent;
    if (textEl) textEl.textContent = `今日の天気に合わせる（${text}）`;
}