const EMBEDDED_UI = {
  hotpoint: `<style>
@keyframes editorMarkerPulse { from { transform: scale(1); } to { transform: scale(1.1); } }
.ed-tab-row { display:grid; grid-template-columns:1fr 1fr; gap:6px; margin-bottom:12px; }
.ed-tab-btn { padding:7px; background:#1a2026; color:#aaa; border:1px solid #2c353f; border-radius:4px; font-size:11px; font-weight:bold; cursor:pointer; }
.ed-tab-btn.active { background:#ff8562; color:#fff; border-color:#ff8562; }
.ed-input { width:100%; padding:7px 8px; background:#1a2026; color:#fff; border:1px solid #2c353f; border-radius:4px; margin-bottom:9px; font-size:12px; box-sizing:border-box; }
</style>

<div id="editorPanel" style="position:fixed;top:1px;left:50px;z-index:999999;font-family:sans-serif;">
    <button id="toggleEditorBtn" style="background:#ff8562;color:white;border:none;padding:10px 15px;border-radius:6px;font-weight:bold;cursor:pointer;box-shadow:0 4px 10px rgba(0,0,0,0.3);font-size:13px;">🛠️ Режим редактора</button>
    <div id="editorControls" style="display:none;background:#14181d;color:white;padding:16px;border-radius:8px;margin-top:10px;width:350px;box-shadow:0 10px 25px rgba(0,0,0,0.5);border:1px solid #1a2026;max-height:85vh;overflow-y:auto;">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:12px;">
            <a href="/coords-finder.html" target="_blank" style="background:#2c353f;color:#fff;text-decoration:none;padding:7px 4px;border-radius:5px;font-size:11px;font-weight:bold;text-align:center;">📍 Карта</a>
            <a href="/view-finder.html" target="_blank" style="background:#2c353f;color:#fff;text-decoration:none;padding:7px 4px;border-radius:5px;font-size:11px;font-weight:bold;text-align:center;">🎥 Ракурсы</a>
            <a href="/configurator.html" target="_blank" style="background:#2c353f;color:#fff;text-decoration:none;padding:7px 4px;border-radius:5px;font-size:11px;font-weight:bold;text-align:center;">⚙️ Настройки</a>
            <a href="/ui-editor.html" target="_blank" style="background:#2c353f;color:#fff;text-decoration:none;padding:7px 4px;border-radius:5px;font-size:11px;font-weight:bold;text-align:center;">🎨 Интерфейс</a>
        </div>
        <p style="font-size:11px;color:#ff8562;margin-bottom:4px;text-transform:uppercase;font-weight:bold;">Текущая сцена:</p>
        <select id="editorCurrentSceneSelect" class="ed-input" style="border-color:#ff8562;font-weight:bold;"><option value="">Определение...</option></select>

        <div class="ed-tab-row">
            <button type="button" id="edModeLinkBtn" class="ed-tab-btn active">➡️ Переход</button>
            <button type="button" id="edModeInfoBtn" class="ed-tab-btn">ℹ️ Инфо-значок</button>
        </div>

        <div id="edLinkFields">
            <label style="display:block;margin-bottom:4px;font-size:11px;color:#ccc;">Куда вести переход:</label>
            <select id="editorTargetSelect" class="ed-input"><option value="">Загрузка...</option></select>
        </div>

        <div id="edInfoFields" style="display:none;">
            <input type="hidden" id="edInfoEditIndex" value="-1">
            <label style="display:block;margin-bottom:4px;font-size:11px;color:#ccc;">Иконка (.png из img/):</label>
            <select id="edInfoIconSelect" class="ed-input"></select>
            <label style="display:block;margin-bottom:4px;font-size:11px;color:#ccc;">Режим при клике:</label>
            <select id="edInfoOpenMode" class="ed-input">
                <option value="card">Карточка (заголовок + текст + ссылка)</option>
                <option value="link">Ярлык (подпись + переход по ссылке)</option>
            </select>
            <input type="text" id="edInfoTitle" class="ed-input" placeholder="Заголовок (напр. Диван модульный)">
            <textarea id="edInfoText" class="ed-input" rows="2" placeholder="Описание (для режима карточки)"></textarea>
            <input type="text" id="edInfoUrl" class="ed-input" placeholder="Внешняя ссылка https://... (необязательно)">
            <div style="display:flex;gap:14px;margin-bottom:10px;font-size:11px;color:#ccc;">
                <label style="display:flex;align-items:center;gap:5px;cursor:pointer;">
                    <input type="checkbox" id="edInfoShowBase" checked> Без ремонта
                </label>
                <label style="display:flex;align-items:center;gap:5px;cursor:pointer;">
                    <input type="checkbox" id="edInfoShowRepair" checked> С ремонтом (_REPAIR)
                </label>
            </div>
        </div>

        <div id="editorCoordsDisplay" style="font-size:11px;background:#1a2026;padding:7px;border-radius:4px;border-left:3px solid #ff8562;margin-bottom:10px;color:#ccc;">yaw: 0.0000, pitch: 0.0000</div>
        <button id="editorSaveBtn" style="width:100%;padding:9px;background:#4CAF50;color:white;border:none;border-radius:4px;font-weight:bold;cursor:pointer;text-transform:uppercase;font-size:12px;">💾 Сохранить</button>
        <div id="editorStatus" style="font-size:12px;text-align:center;margin-top:8px;font-weight:bold;display:none;"></div>

        <div style="margin-top:14px;border-top:1px solid #2c353f;padding-top:10px;">
            <p style="font-size:11px;color:#888;margin-bottom:6px;text-transform:uppercase;font-weight:bold;">Переходы сцены:</p>
            <table style="width:100%;border-collapse:collapse;font-size:11px;color:#eee;margin-bottom:12px;">
                <tbody id="editorHotspotsTableBody"></tbody>
            </table>
            <p style="font-size:11px;color:#888;margin-bottom:6px;text-transform:uppercase;font-weight:bold;">Инфо-значки сцены:</p>
            <table style="width:100%;border-collapse:collapse;font-size:11px;color:#eee;">
                <tbody id="editorInfoTableBody"></tbody>
            </table>
        </div>
    </div>
</div>

<div id="editorReticle" style="position:fixed;top:50%;left:50%;width:20px;height:20px;transform:translate(-50%,-50%);pointer-events:none;z-index:999998;display:none;">
    <div style="position:absolute;top:9px;left:0;width:20px;height:2px;background:#ff8562;"></div>
    <div style="position:absolute;top:0;left:9px;width:2px;height:20px;background:#ff8562;"></div>
</div>


<script>
(function(){
    const toggleBtn = document.getElementById('toggleEditorBtn'),
          controls = document.getElementById('editorControls'),
          reticle = document.getElementById('editorReticle'),
          targetSelect = document.getElementById('editorTargetSelect'),
          coordsDisplay = document.getElementById('editorCoordsDisplay'),
          saveBtn = document.getElementById('editorSaveBtn'),
          statusMsg = document.getElementById('editorStatus'),
          sceneSelect = document.getElementById('editorCurrentSceneSelect'),
          tableBody = document.getElementById('editorHotspotsTableBody'),
          infoTableBody = document.getElementById('editorInfoTableBody'),
          modeLinkBtn = document.getElementById('edModeLinkBtn'),
          modeInfoBtn = document.getElementById('edModeInfoBtn'),
          linkFields = document.getElementById('edLinkFields'),
          infoFields = document.getElementById('edInfoFields'),
          infoIconSel = document.getElementById('edInfoIconSelect'),
          infoOpenMode = document.getElementById('edInfoOpenMode'),
          infoTitle = document.getElementById('edInfoTitle'),
          infoText = document.getElementById('edInfoText'),
          infoUrl = document.getElementById('edInfoUrl'),
          infoShowBase = document.getElementById('edInfoShowBase'),
          infoShowRepair = document.getElementById('edInfoShowRepair'),
          infoEditIdx = document.getElementById('edInfoEditIndex');

    let editorActive = false, editorMode = 'link', fallbackSceneId = "1", lastRenderedSceneId = "", cachedInfoList = [];

    function setEditorMode(mode) {
        editorMode = mode;
        modeLinkBtn.classList.toggle('active', mode === 'link');
        modeInfoBtn.classList.toggle('active', mode === 'info');
        linkFields.style.display = mode === 'link' ? 'block' : 'none';
        infoFields.style.display = mode === 'info' ? 'block' : 'none';
        if (mode === 'link') infoEditIdx.value = '-1';
    }
    modeLinkBtn.addEventListener('click', () => setEditorMode('link'));
    modeInfoBtn.addEventListener('click', () => setEditorMode('info'));

    function detectId() {
        if (window.currentActiveSceneId) return window.currentActiveSceneId;
        if (typeof APP_DATA !== 'undefined' && APP_DATA.scenes && APP_DATA.scenes[0]) {
            return APP_DATA.scenes[0].id;
        }
        return fallbackSceneId;
    }

    function showToast(text, color) {
        statusMsg.textContent = text;
        statusMsg.style.color = color || "#4CAF50";
        statusMsg.style.display = "block";
        setTimeout(() => { statusMsg.style.display = "none"; }, 2500);
    }

    window.updateEditorSceneContext = function(forceUpdate = false) {
        const v = window.customWolfTourViewer || window.viewer;
        if (!v) return false;
        const cid = detectId();
        fallbackSceneId = cid;
        if (forceUpdate) lastRenderedSceneId = "";
        if (lastRenderedSceneId === cid && sceneSelect.value) return true;

        fetch('/get-scene-data?sceneId=' + encodeURIComponent(cid)).then(r => r.json()).then(data => {
            lastRenderedSceneId = cid;
            const baseName = data.name.replace('_REPAIR', '');
            if (typeof APP_DATA !== 'undefined' && APP_DATA.scenes) {
                const baseSc = APP_DATA.scenes.find(s => s.name === baseName);
                if (baseSc) sceneSelect.value = baseSc.id;
            }

                        tableBody.innerHTML = (!data.hotspots || !data.hotspots.length)
                ? '<tr><td style="color:#666;padding:4px 0;">Нет переходов</td></tr>'
                : data.hotspots.map((hp, idx) =>
                    '<tr style="border-bottom:1px solid #1a2026;">' +
                    '<td style="padding:5px 0;">' + hp.targetName + '</td>' +
                    '<td style="text-align:right;"><button onclick="window._edDelLink(\\'' + data.id + '\\',' + idx + ')" style="background:#f44336;color:#fff;border:none;padding:3px 7px;border-radius:3px;font-size:10px;cursor:pointer;">✕</button></td></tr>'
                ).join('');

            cachedInfoList = data.infoHotspots || [];
            infoTableBody.innerHTML = !cachedInfoList.length
                ? '<tr><td style="color:#666;padding:4px 0;">Нет инфо-значков</td></tr>'
                : cachedInfoList.map((inf, idx) =>
                    '<tr style="border-bottom:1px solid #1a2026;">' +
                    '<td style="padding:5px 0;">' + (inf.title || inf.icon || 'Значок #' + (idx+1)) + '</td>' +
                    '<td style="text-align:right;white-space:nowrap;">' +
                    '<button onclick="window._edEditInfo(' + idx + ')" style="background:#2196F3;color:#fff;border:none;padding:3px 6px;border-radius:3px;font-size:10px;cursor:pointer;margin-right:4px;">✎</button>' +
                    '<button onclick="window._edDelInfo(\\'' + data.id + '\\',' + idx + ')" style="background:#f44336;color:#fff;border:none;padding:3px 6px;border-radius:3px;font-size:10px;cursor:pointer;">✕</button>' +
                    '</td></tr>'
                ).join('');
        }).catch(() => {});
        return true;
    };

    window._edDelLink = function(sceneId, index) {
        if (!confirm('Удалить переход?')) return;
        fetch('/delete-hotspot', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sceneId, index })
        }).then(() => { showToast('✕ Переход удалён!', '#ff5252'); window.updateEditorSceneContext(true); });
    };

    window._edEditInfo = function(idx) {
        const item = cachedInfoList[idx];
        if (!item) return;
        setEditorMode('info');
        infoEditIdx.value = String(idx);
        infoIconSel.value = item.icon || 'img/info.png';
        infoOpenMode.value = item.openMode || 'card';
        infoTitle.value = item.title || '';
        infoText.value = item.text || '';
        infoUrl.value = item.url || '';
        const v = window.customWolfTourViewer || window.viewer;
        if (v && v.view()) { v.view().setYaw(item.yaw); v.view().setPitch(item.pitch); }
    };

    window._edDelInfo = function(sceneId, index) {
        if (!confirm('Удалить инфо-значок?')) return;
        fetch('/delete-info-hotspot', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sceneId, index, syncRepair: true })
        }).then(() => { showToast('✕ Значок удалён!', '#ff5252'); window.updateEditorSceneContext(true); });
    };

    sceneSelect.addEventListener('change', () => {
        if (sceneSelect.value && typeof window.editorSwitchToScene === 'function') {
            window.editorSwitchToScene(sceneSelect.value);
            setTimeout(() => window.updateEditorSceneContext(true), 100);
        }
    });

    toggleBtn.addEventListener('click', () => {
        editorActive = !editorActive;
        controls.style.display = editorActive ? 'block' : 'none';
        reticle.style.display = editorActive ? 'block' : 'none';
        if (editorActive) {
            fetch('/get-all-scenes-list').then(r => r.json()).then(scenes => {
                targetSelect.innerHTML = ''; sceneSelect.innerHTML = '';
                scenes.forEach(s => {
                    targetSelect.add(new Option(s.name + ' [' + s.id + ']', s.id));
                    if (!s.name.endsWith('_REPAIR')) sceneSelect.add(new Option(s.name + ' [' + s.id + ']', s.id));
                });
                window.updateEditorSceneContext(true);
            });
            fetch('/get-img-files').then(r => r.json()).then(files => {
                const pngs = (files || []).filter(f => f.toLowerCase().endsWith('.png'));
                infoIconSel.innerHTML = '';
                (pngs.length ? pngs : ['info.png']).forEach(f => infoIconSel.add(new Option('img/' + f, 'img/' + f)));
            });
        }
    });

    setInterval(() => {
        if (!editorActive) return;
        const v = window.customWolfTourViewer || window.viewer;
        window.updateEditorSceneContext();
        if (v && v.view()) {
            coordsDisplay.textContent = 'yaw: ' + v.view().yaw().toFixed(4) + ', pitch: ' + v.view().pitch().toFixed(4);
        }
    }, 250);

    saveBtn.addEventListener('click', () => {
        const v = window.customWolfTourViewer || window.viewer;
        if (!v || !v.view()) return alert('Плеер недоступен');
        const sourceSceneId = fallbackSceneId;
        const yaw = v.view().yaw(), pitch = v.view().pitch();

        if (editorMode === 'link') {
            fetch('/save-hotspot', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sourceSceneId, targetSceneId: targetSelect.value, yaw, pitch })
            }).then(() => { showToast('✓ Переход сохранён!'); window.updateEditorSceneContext(true); });
        } else {
            const editIndex = parseInt(infoEditIdx.value, 10);
            if (!infoShowBase.checked && !infoShowRepair.checked) {
                return alert('Отметьте хотя бы одну панораму (Без ремонта или С ремонтом)');
            }
            fetch('/save-info-hotspot', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sourceSceneId, editIndex,
                    showBase: infoShowBase.checked,
                    showRepair: infoShowRepair.checked,
                    spot: {
                        yaw, pitch,
                        icon: infoIconSel.value || 'img/info.png',
                        openMode: infoOpenMode.value || 'card',
                        title: infoTitle.value.trim(),
                        text: infoText.value.trim(),
                        url: infoUrl.value.trim()
                    }
                })
            }).then(() => {
                infoEditIdx.value = '-1'; infoTitle.value = ''; infoText.value = ''; infoUrl.value = '';
                showToast('✓ Инфо-значок сохранён!');
                window.updateEditorSceneContext(true);
            });
        }
    });
})();
</script>`,



  coords: `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Панель разметки 3D-туров</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0b0d10; color: #ffffff; padding: 30px; }
        h1 { font-size: 28px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 30px; color: #ffffff; border-bottom: 2px solid #1a2026; padding-bottom: 15px; }
        .container { display: flex; gap: 30px; }
        .panel { background: #14181d; padding: 25px; border-radius: 12px; width: 380px; height: fit-content; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5); border: 1px solid #1a2026; }
        .map-area { background: #14181d; padding: 25px; border-radius: 12px; flex-grow: 1; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5); border: 1px solid #1a2026; min-height: 500px; }
        label { display: block; margin-bottom: 10px; font-weight: 600; font-size: 14px; color: rgba(255, 255, 255, 0.9); text-transform: uppercase; letter-spacing: 0.5px; }
        select, button { width: 100%; padding: 12px; margin-bottom: 20px; border-radius: 6px; font-size: 14px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; transition: all 0.3s ease; }
        select { background: #1a2026; color: #ffffff; border: 1px solid #2c353f; cursor: pointer; }
        select:focus { outline: none; border-color: #ff8562; }
        button { background-color: #ff8562; color: white; border: none; cursor: pointer; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
        button:hover { background-color: #e06e4c; }
        .info-text { color: rgba(255, 255, 255, 0.6); font-size: 13px; margin-top: -10px; margin-bottom: 20px; background: #1a2026; padding: 8px 12px; border-radius: 4px; border-left: 3px solid #ff8562; }
        .scenes-table-container { margin-top: 10px; border-top: 1px solid #1a2026; padding-top: 20px; }
        .scenes-table { width: 100%; border-collapse: collapse; font-size: 13px; }
        .scenes-table th, .scenes-table td { text-align: left; padding: 10px 6px; border-bottom: 1px solid #1a2026; }
        .scenes-table th { font-weight: 700; color: rgba(255, 255, 255, 0.4); text-transform: uppercase; font-size: 11px; letter-spacing: 0.5px; }
        .scenes-table tr:hover { background: rgba(255, 255, 255, 0.02); }
        .badge-changed { background: #4CAF50; color: white; padding: 2px 6px; border-radius: 10px; font-size: 10px; font-weight: 700; text-transform: uppercase; margin-left: 8px; display: inline-block; letter-spacing: 0.3px; }
        #mapWrapper { position: relative; display: inline-block; border: 2px dashed #1a2026; border-radius: 8px; background: #0b0d10; overflow: auto; max-width: 100%; }
        #planMap { width: 800px; max-width: none; max-height: none; display: block; cursor: crosshair; transition: width 0.1s ease; }
        #mapMarker { position: absolute; width: 14px; height: 14px; background: #ff0000; border: 2px solid #ffffff; border-radius: 50%; transform: translate(-50%, -50%) rotate(270deg); display: none; pointer-events: none; box-shadow: 0 0 8px rgba(0, 0, 0, 0.8); transition: left 0.1s ease, top 0.1s ease; }
        #mapMarker::before { content: ''; position: absolute; top: 50%; left: 50%; width: 56px; height: 74px; transform-origin: top center; transform: translate(-50%, 0); background: linear-gradient(to bottom, rgba(255, 82, 82, 0.9) 0%, rgba(255, 82, 82, 0) 100%); clip-path: polygon(45% 0%, 55% 0%, 100% 100%, 0% 100%); pointer-events: none; }
        .angle-presets { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; margin-top: 8px; margin-bottom: 10px; }
        .angle-btn { padding: 6px 4px; margin-bottom: 0; background: #2c353f; color: #fff; font-size: 12px; border-radius: 4px; }
        .angle-btn:hover { background: #3b4654; }
        .file-upload-box { background: #1a2026; border: 1px dashed #2c353f; border-radius: 6px; padding: 12px; margin-bottom: 20px; }
        .file-upload-btn { display: inline-block; background: #2c353f; color: #ffffff; padding: 8px 14px; border-radius: 4px; font-size: 12px; font-weight: 600; text-transform: uppercase; cursor: pointer; margin-bottom: 0; }
        .file-upload-btn:hover { background: #3b4654; }
        .file-name-display { display: block; margin-top: 8px; font-size: 12px; color: rgba(255, 255, 255, 0.6); word-break: break-all; }
    </style>
</head>
<body>
    <h1>Настройка координат сцен на карте</h1>
    <div class="container">
        <div class="panel">
            <label for="projectImgSelect">0. Картинка из папки img/:</label>
            <div class="file-upload-box">
                <select id="projectImgSelect" style="margin-bottom: 10px;">
                    <option value="img/plan.jpg">img/plan.jpg</option>
                </select>
                <label for="mapFileInput" class="file-upload-btn">Или загрузить с ПК...</label>
                <input type="file" id="mapFileInput" accept="image/*" style="display: none;">
                <span id="selectedFileName" class="file-name-display">Текущая: img/plan.jpg</span>
            </div>

            <label for="sceneSelect">1. Выберите сцену:</label>
            <select id="sceneSelect" onchange="resetAndHighlightMarker()">
                <option value="">Загрузка списка сцен...</option>
            </select>

            <label>2. Поставьте точку на карте справа</label>
            <div id="coordDisplay" class="info-text">Точка не выбрана</div>

            <button id="saveToServerBtn">Сохранить в data.js</button>

            <div style="margin-bottom: 16px; background: #1a2026; padding: 12px; border-radius: 6px;">
                <label for="radarAngleSlider" style="margin-bottom: 5px; font-size: 12px;">
                    Угол луча радара (yaw=0): <span id="radarAngleValue" style="color: #ff8562; font-weight: bold;">270°</span>
                </label>
                <input type="range" id="radarAngleSlider" min="0" max="360" step="1" value="270" style="width: 100%; accent-color: #ff8562; cursor: pointer;">
                <div class="angle-presets">
                    <button type="button" class="angle-btn" onclick="setRadarPreset(0)">0°</button>
                    <button type="button" class="angle-btn" onclick="setRadarPreset(90)">90°</button>
                    <button type="button" class="angle-btn" onclick="setRadarPreset(180)">180°</button>
                    <button type="button" class="angle-btn" onclick="setRadarPreset(270)">270°</button>
                </div>
                <button type="button" id="saveRadarAngleBtn" style="margin-bottom: 0; padding: 9px; background: #2196F3; font-size: 12px;">Сохранить угол в index.js</button>
            </div>

            <div style="margin-bottom: 25px; background: #1a2026; padding: 12px; border-radius: 6px;">
                <label for="mapSizeSlider" style="margin-bottom: 5px; font-size: 12px;">
                    Размер карты: <span id="sizeValue" style="color: #ff8562; font-weight: bold;">800px</span>
                </label>
                <input type="range" id="mapSizeSlider" min="100" max="1500" step="50" value="800" style="width: 100%; accent-color: #ff8562; cursor: pointer;">
            </div>

            <div class="scenes-table-container">
                <label>Текущие координаты в data.js:</label>
                <table class="scenes-table">
                    <thead><tr><th>Сцена</th><th>Координаты (L / T)</th></tr></thead>
                    <tbody id="scenesTableBody"><tr><td colspan="2" style="color: rgba(255,255,255,0.3);">Загрузка данных...</td></tr></tbody>
                </table>
            </div>
        </div>
        <div class="map-area">
            <label>Карта планировки:</label>
            <div id="mapWrapper">
                <img id="planMap" src="img/plan.jpg" alt="Загрузка изображения..." onerror="tryPngFormat(this)">
                <div id="mapMarker"></div>
            </div>
        </div>
    </div>
    <script>
        let currentMapCoordinates = null;
        let localScenesData = [];
        const changedScenes = new Set();

        function tryPngFormat(img) {
            if (img.src.endsWith('.png')) {
                img.alt = "Ошибка: Карта не найдена в папке img/";
                return;
            }
            img.src = "img/plan.png";
        }

        function loadScenesFromServer() {
            const select = document.getElementById('sceneSelect');
            const tableBody = document.getElementById('scenesTableBody');
            const currentSelectedValue = select.value;
            
            fetch('http://localhost:3000/get-scenes')
                .then(res => { if (!res.ok) throw new Error('Ошибка сервера'); return res.json(); })
                .then(scenes => {
                    localScenesData = scenes;
                    select.innerHTML = '';
                    const baseScenes = scenes.filter(s => !(s.name && s.name.endsWith('_REPAIR')));

                    if (baseScenes.length === 0) {
                        select.innerHTML = '<option value="">Сцены не найдены</option>';
                        tableBody.innerHTML = '<tr><td colspan="2">Данные пусты</td></tr>';
                        return;
                    }

                    tableBody.innerHTML = '';

                    baseScenes.forEach(scene => {
                        const option = document.createElement('option');
                        option.value = scene.id;
                        option.textContent = scene.name + ' [id: ' + scene.id + ']';
                        if (scene.id === currentSelectedValue) option.selected = true;
                        select.appendChild(option);

                        const tr = document.createElement('tr');
                        const tdName = document.createElement('td');
                        tdName.style.fontWeight = '500';
                        tdName.textContent = scene.name;

                        if (changedScenes.has(scene.id)) {
                            const badge = document.createElement('span');
                            badge.className = 'badge-changed';
                            badge.textContent = 'Изменено';
                            tdName.appendChild(badge);
                        }

                        const tdCoords = document.createElement('td');
                        if (scene.mapCoords && scene.mapCoords.left && scene.mapCoords.top) {
                            tdCoords.textContent = scene.mapCoords.left + ' / ' + scene.mapCoords.top;
                            tdCoords.style.color = '#ffffff';
                        } else {
                            tdCoords.textContent = 'не заданы';
                            tdCoords.style.color = 'rgba(255,255,255,0.3)';
                        }

                        tr.appendChild(tdName);
                        tr.appendChild(tdCoords);
                        tableBody.appendChild(tr);
                    });

                    highlightExistingMarker();
                })
                .catch(err => {
                    console.error(err);
                    select.innerHTML = '<option value="">Ошибка загрузки!</option>';
                    tableBody.innerHTML = '<tr><td colspan="2" style="color:#ff8562;">Включите node сервер</td></tr>';
                });
        }

        function resetAndHighlightMarker() {
            currentMapCoordinates = null;
            highlightExistingMarker();
        }

        function highlightExistingMarker() {
            if (currentMapCoordinates) return;
            const sceneId = document.getElementById('sceneSelect').value;
            const currentScene = localScenesData.find(s => s.id === sceneId);
            const marker = document.getElementById('mapMarker');

            if (currentScene && currentScene.mapCoords && currentScene.mapCoords.left && currentScene.mapCoords.top) {
                marker.style.left = currentScene.mapCoords.left;
                marker.style.top = currentScene.mapCoords.top;
                marker.style.display = 'block';
                marker.style.backgroundColor = '#2196F3'; 
                document.getElementById('coordDisplay').textContent = 'Сохранено: left: ' + currentScene.mapCoords.left + ', top: ' + currentScene.mapCoords.top;
            } else {
                marker.style.display = 'none';
                document.getElementById('coordDisplay').textContent = 'Точка не выбрана';
            }
        }

        document.getElementById('planMap').addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const leftPercent = ((e.clientX - rect.left) / rect.width * 100).toFixed(2) + '%';
            const topPercent = ((e.clientY - rect.top) / rect.height * 100).toFixed(2) + '%';
            
            currentMapCoordinates = { left: leftPercent, top: topPercent };
            const marker = document.getElementById('mapMarker');
            marker.style.left = leftPercent;
            marker.style.top = topPercent;
            marker.style.display = 'block';
            marker.style.backgroundColor = '#ff0000'; 

            document.getElementById('coordDisplay').textContent = 'Новый выбор: left: ' + leftPercent + ', top: ' + topPercent;
        });

        document.getElementById('saveToServerBtn').addEventListener('click', async () => {
            const sceneId = document.getElementById('sceneSelect').value;
            if (!sceneId || !currentMapCoordinates) return;

            const currentScene = localScenesData.find(s => s.id === sceneId);
            if (!currentScene) return;

            const scenesToSave = [sceneId];
            const currentSceneName = currentScene.name || '';
            const targetRepairName = (currentSceneName + '_REPAIR').toLowerCase();
            const repairScene = localScenesData.find(s => s.name && s.name.toLowerCase() === targetRepairName);

            if (repairScene) scenesToSave.push(repairScene.id);

            try {
                const res = await fetch('http://localhost:3000/save', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ sceneIds: scenesToSave, coordinates: currentMapCoordinates })
                });

                if (!res.ok) throw new Error('Ошибка сервера при сохранении');
                scenesToSave.forEach(id => changedScenes.add(id));
                currentMapCoordinates = null; 
                loadScenesFromServer();
            } catch (err) {
                console.error(err);
                alert('Ошибка сохранения. Проверьте терминал Node.js');
            }
        });

        document.addEventListener('DOMContentLoaded', loadScenesFromServer);

        const sizeSlider = document.getElementById('mapSizeSlider');
        const sizeValueText = document.getElementById('sizeValue');
        const mapImage = document.getElementById('planMap');

        sizeSlider.addEventListener('input', function() {
            const currentSize = this.value + 'px';
            sizeValueText.textContent = currentSize;
            mapImage.style.width = currentSize;
        });

        document.getElementById('mapFileInput').addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = function(event) {
                document.getElementById('planMap').src = event.target.result;
                const nameDisplay = document.getElementById('selectedFileName');
                nameDisplay.textContent = 'Выбран файл: ' + file.name;
                nameDisplay.style.color = '#4CAF50';
            };
            reader.readAsDataURL(file);
        });

        function loadProjectImages() {
            const imgSelect = document.getElementById('projectImgSelect');
            fetch('/get-img-files')
                .then(res => res.json())
                .then(files => {
                    if (!files || files.length === 0) return;
                    imgSelect.innerHTML = '';
                    files.forEach(file => {
                        const opt = document.createElement('option');
                        opt.value = 'img/' + file;
                        opt.textContent = 'img/' + file;
                        if (file === 'plan.jpg') opt.selected = true;
                        imgSelect.appendChild(opt);
                    });
                })
                .catch(err => console.error('Ошибка загрузки списка картинок:', err));
        }

        document.getElementById('projectImgSelect').addEventListener('change', function() {
            const chosenPath = this.value;
            document.getElementById('planMap').src = chosenPath;
            const nameDisplay = document.getElementById('selectedFileName');
            nameDisplay.textContent = 'Текущая: ' + chosenPath;
            nameDisplay.style.color = '#4CAF50';
        });

        const radarSlider = document.getElementById('radarAngleSlider');
        const radarValueText = document.getElementById('radarAngleValue');
        const markerEl = document.getElementById('mapMarker');

        function applyMarkerAngle(deg) {
            radarSlider.value = deg;
            radarValueText.textContent = deg + '°';
            markerEl.style.transform = 'translate(-50%, -50%) rotate(' + deg + 'deg)';
        }

        window.setRadarPreset = function(deg) {
            applyMarkerAngle(deg);
        };

        radarSlider.addEventListener('input', function() {
            applyMarkerAngle(parseFloat(this.value));
        });

        fetch('/get-radar-angle')
            .then(res => res.json())
            .then(data => {
                if (data && typeof data.offset === 'number') {
                    applyMarkerAngle(data.offset);
                }
            })
            .catch(() => {});

        document.getElementById('saveRadarAngleBtn').addEventListener('click', async function() {
            const btn = this;
            const offset = parseFloat(radarSlider.value) || 0;
            try {
                const res = await fetch('/save-radar-angle', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ offset })
                });
                if (!res.ok) throw new Error();
                const oldText = btn.textContent;
                btn.textContent = '✓ Угол сохранён!';
                btn.style.background = '#4CAF50';
                setTimeout(() => { btn.textContent = oldText; btn.style.background = '#2196F3'; }, 1800);
            } catch (e) {
                alert('Ошибка сохранения угла в index.js');
            }
        });

        loadProjectImages();
    </script>
</body>
</html>`,

  config: `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="utf-8">
  <title>Конфигуратор 3D-тура</title>
  <style>
    * { box-sizing: border-box; }
    body { font-family: system-ui, -apple-system, sans-serif; background: #12151a; color: #e4e8ee; margin: 0; padding: 25px 15px; }
    .container { max-width: 860px; margin: 0 auto; }
    h1 { font-size: 22px; margin: 0 0 5px; color: #fff; }
    .sub { color: #8b95a5; font-size: 13px; margin-bottom: 20px; }
    .card { background: #1b2028; border: 1px solid #2a313d; border-radius: 10px; padding: 18px; margin-bottom: 16px; }
    .card h2 { font-size: 14px; text-transform: uppercase; color: #ff8562; margin: 0 0 14px; border-bottom: 1px solid #2a313d; padding-bottom: 8px; }
    .field { margin-bottom: 14px; }
    .field label { display: block; font-size: 12px; font-weight: 600; color: #cbd5e1; margin-bottom: 5px; }
    input[type="text"], select { width: 100%; padding: 8px 10px; background: #12151a; border: 1px solid #323b49; border-radius: 6px; color: #fff; font-size: 14px; }
    input::placeholder { color: #525e70; }
    input:focus, select:focus { outline: none; border-color: #ff8562; }
    .current-hint { font-size: 11px; color: #7c8899; margin-top: 4px; word-break: break-all; }
    .current-hint span { color: #94a3b8; font-family: monospace; }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
    .checks { display: flex; flex-direction: column; gap: 10px; margin-top: 8px; }
    .checks label { display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 13px; color: #fff; }
    .checks input { width: 16px; height: 16px; accent-color: #ff8562; }
    .menu-row { display: grid; grid-template-columns: 1fr 1.5fr auto; gap: 8px; margin-bottom: 8px; }
    .btn { padding: 9px 14px; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 13px; }
    .btn-add { background: #2a313d; color: #fff; }
    .btn-del { background: #d9383a; color: #fff; padding: 8px 11px; }
    .btn-save { background: #4CAF50; color: #fff; width: 100%; padding: 14px; font-size: 15px; }
    .btn-save:hover { background: #439a46; }
    #toast { position: fixed; bottom: 20px; right: 20px; background: #4CAF50; color: #fff; padding: 12px 20px; border-radius: 8px; font-weight: 600; display: none; box-shadow: 0 6px 16px rgba(0,0,0,0.4); }
    @media (max-width: 650px) { .grid-2, .menu-row { grid-template-columns: 1fr; } }
  </style>
</head>
<body>
  <div class="container">
    <h1>⚙️ Конфигуратор 3D-тура</h1>
    <div class="sub">Редактирование параметров в index.js и index.html (с автоматическим бэкапом)</div>

    <div class="card">
      <h2>1. Настройки запуска (index.js + H1 в index.html)</h2>
      <div class="grid-2">
        <div class="field">
          <label>Заголовок в верхней плашке (APARTMENT_TITLE и H1)</label>
          <input type="text" id="js_apartmentTitle">
          <div class="current-hint" id="hint_js_apartmentTitle"></div>
        </div>
        <div class="field">
          <label>Стартовая сцена при открытии (START_SCENE_INDEX)</label>
          <select id="js_startSceneIndex"></select>
          <div class="current-hint" id="hint_js_startSceneIndex"></div>
        </div>
      </div>
      <div class="checks">
        <label><input type="checkbox" id="js_enableMinimap"> Включить мини-карту планировки (ENABLE_MINIMAP)</label>
        <label><input type="checkbox" id="js_enableFullscreen"> Включить кнопку полноэкранного режима (ENABLE_FULLSCREEN)</label>
        <label><input type="checkbox" id="js_enableGyroscope"> Включить кнопку гироскопа на мобильных (ENABLE_GYROSCOPE)</label>
        <label><input type="checkbox" id="js_enableDemoWatermark"> Показывать тестовый водяной знак (ENABLE_DEMO_WATERMARK)</label>
        <label><input type="checkbox" id="js_enableRepairSwitch"> Включить тумблер отделки (ENABLE_REPAIR_SWITCH)</label>
        <label><input type="checkbox" id="js_startWithRepair"> Запускать сразу с ремонтом (START_WITH_REPAIR)</label>
        <label><input type="checkbox" id="js_keepViewAngle"> Сохранять направление взгляда при переходах (KEEP_VIEW_ANGLE — если выключено, берется ракурс из data.js)</label>
      </div>
      <div class="field" style="margin-top: 14px;">
        <label>Путь к папке с тайлами (TILES_URL)</label>
        <div style="display: flex; gap: 8px; margin-bottom: 6px;">
          <button type="button" class="btn btn-add" onclick="setTilesPreset('tiles')">📁 Локально (tiles)</button>
          <button type="button" class="btn btn-add" onclick="setTilesPreset('https://storage.yandexcloud.net/tours.wolf-studio.ru/other/wolftour/tiles')">☁️ Яндекс Облако (шаблон)</button>
        </div>
        <input type="text" id="js_tilesUrl" placeholder="tiles или https://yandexcloud.net...">
        <div class="current-hint" id="hint_js_tilesUrl"></div>
      </div>
    </div>

    <div class="card">
      <h2>2. Заголовки и SEO (index.html)</h2>
      <div class="field">
        <label>Заголовок вкладки (&lt;title&gt;)</label>
        <input type="text" id="html_title">
        <div class="current-hint" id="hint_html_title"></div>
      </div>
      <div class="field">
        <label>Описание (meta description)</label>
        <input type="text" id="html_description">
        <div class="current-hint" id="hint_html_description"></div>
      </div>
    </div>
    <div class="card">
      <h2>3. Превью для мессенджеров (Open Graph)</h2>
      <div class="grid-2">
        <div class="field">
          <label>og:title</label>
          <input type="text" id="html_ogTitle">
          <div class="current-hint" id="hint_html_ogTitle"></div>
        </div>
        <div class="field">
          <label>og:description</label>
          <input type="text" id="html_ogDescription">
          <div class="current-hint" id="hint_html_ogDescription"></div>
        </div>
        <div class="field">
          <label>og:url</label>
          <input type="text" id="html_ogUrl">
          <div class="current-hint" id="hint_html_ogUrl"></div>
        </div>
        <div class="field">
          <label>og:image</label>
          <input type="text" id="html_ogImage">
          <div class="current-hint" id="hint_html_ogImage"></div>
        </div>
      </div>
    </div>

    <div class="card">
      <h2>4. Брендинг, ссылки и планировка</h2>
      <div class="grid-2">
        <div class="field">
          <label>Ссылка с логотипа ЖК</label>
          <input type="text" id="html_zhkUrl">
          <div class="current-hint" id="hint_html_zhkUrl"></div>
        </div>
        <div class="field">
          <label>Название ЖК (alt логотипа и баннера)</label>
          <input type="text" id="html_zhkAlt">
          <div class="current-hint" id="hint_html_zhkAlt"></div>
        </div>
        <div class="field">
          <label>Описание планировки (alt plan.jpg)</label>
          <input type="text" id="html_planAlt">
          <div class="current-hint" id="hint_html_planAlt"></div>
        </div>
        <div class="field">
          <label>Ссылка с водяного знака</label>
          <input type="text" id="html_watermarkUrl">
          <div class="current-hint" id="hint_html_watermarkUrl"></div>
        </div>
      </div>
    </div>

    <div class="card">
      <h2>5. Выезжающее меню других квартир (#sceneList)</h2>
      <div id="menuContainer"></div>
      <button type="button" class="btn btn-add" onclick="addMenuRow('', 'https://')">+ Добавить пункт</button>
    </div>

    <button type="button" class="btn btn-save" onclick="saveAll()">💾 Сохранить все изменения</button>
  </div>

  <div id="toast">✓ Сохранено!</div>
  <script>
    function setFieldWithHint(inputId, hintId, value) {
      const inp = document.getElementById(inputId);
      const hint = document.getElementById(hintId);
      const val = String(value || '');
      if (inp) {
        inp.value = val;
        inp.placeholder = val ? 'Пример: ' + val : 'Не заполнено';
      }
      if (hint) {
        hint.innerHTML = val
          ? 'Сейчас в файле: <span>' + val.replace(/</g, '&lt;') + '</span>'
          : 'Сейчас в файле: <span>пусто</span>';
      }
    }

    function setTilesPreset(val) {
      document.getElementById('js_tilesUrl').value = val;
    }

    function addMenuRow(title, url) {
      const div = document.createElement('div');
      div.className = 'menu-row';
      const safeTitle = (title || '').replace(/"/g, '&quot;');
      const safeUrl = (url || '').replace(/"/g, '&quot;');
      div.innerHTML =
        '<input type="text" class="m-title" placeholder="' + (safeTitle || 'Например: Студия - 30м²') + '" value="' + safeTitle + '">' +
        '<input type="text" class="m-url" placeholder="' + (safeUrl || 'Например: https://wolf-studio.ru') + '" value="' + safeUrl + '">' +
        '<button type="button" class="btn btn-del" onclick="this.parentElement.remove()">✕</button>';
      document.getElementById('menuContainer').appendChild(div);
    }

    async function load() {
      const res = await fetch('/api/config');
      const data = await res.json();
      if (data.error) return alert(data.error);

      const { htmlConfig: h, jsConfig: j, scenes } = data;
      const startSel = document.getElementById('js_startSceneIndex');
      startSel.innerHTML = '';

      (scenes || []).forEach(s => {
        const label = '[' + s.index + '] ' + s.name + ' (' + s.id + ')';
        const opt = new Option(label, s.index);
        if (s.index === j.startSceneIndex) opt.selected = true;
        startSel.add(opt);
      });

      const currentStart = (scenes || [])[j.startSceneIndex];
      if (currentStart) {
        document.getElementById('hint_js_startSceneIndex').innerHTML =
          'Сейчас стартовая: <span>[' + currentStart.index + '] ' + currentStart.name + '</span>';
      }

      setFieldWithHint('js_apartmentTitle', 'hint_js_apartmentTitle', j.apartmentTitle);
      setFieldWithHint('js_tilesUrl', 'hint_js_tilesUrl', j.tilesUrl);
      document.getElementById('js_enableRepairSwitch').checked = Boolean(j.enableRepairSwitch);
      document.getElementById('js_enableMinimap').checked = j.enableMinimap !== false;
      document.getElementById('js_enableFullscreen').checked = Boolean(j.enableFullscreen);
      document.getElementById('js_enableGyroscope').checked = Boolean(j.enableGyroscope);
      document.getElementById('js_enableDemoWatermark').checked = j.enableDemoWatermark !== false;
      document.getElementById('js_startWithRepair').checked = j.startWithRepair;
      document.getElementById('js_keepViewAngle').checked = j.keepViewAngle !== false;

      ['title', 'description', 'ogTitle', 'ogDescription', 'ogUrl', 'ogImage', 'zhkUrl', 'zhkAlt', 'planAlt', 'watermarkUrl'].forEach(k => {
        setFieldWithHint('html_' + k, 'hint_html_' + k, h[k]);
      });

      const menuBox = document.getElementById('menuContainer');
      menuBox.innerHTML = '';
      (h.menuItems || []).forEach(m => addMenuRow(m.title, m.url));
    }

    async function saveAll() {
      const menuItems = [];
      document.querySelectorAll('#menuContainer .menu-row').forEach(r => {
        const title = r.querySelector('.m-title').value.trim();
        const url = r.querySelector('.m-url').value.trim();
        if (title || url) menuItems.push({ title, url });
      });

      const htmlConfig = { menuItems };
      ['title', 'description', 'ogTitle', 'ogDescription', 'ogUrl', 'ogImage', 'zhkUrl', 'zhkAlt', 'planAlt', 'watermarkUrl'].forEach(k => {
        htmlConfig[k] = document.getElementById('html_' + k).value;
      });

      const payload = {
        jsConfig: {
          apartmentTitle: document.getElementById('js_apartmentTitle').value,
          tilesUrl: document.getElementById('js_tilesUrl').value,
          startSceneIndex: parseInt(document.getElementById('js_startSceneIndex').value, 10) || 0,
          enableRepairSwitch: document.getElementById('js_enableRepairSwitch').checked,
          enableMinimap: document.getElementById('js_enableMinimap').checked,
          enableFullscreen: document.getElementById('js_enableFullscreen').checked,
          enableGyroscope: document.getElementById('js_enableGyroscope').checked,
          enableDemoWatermark: document.getElementById('js_enableDemoWatermark').checked,
          startWithRepair: document.getElementById('js_startWithRepair').checked,
          keepViewAngle: document.getElementById('js_keepViewAngle').checked
        },
        htmlConfig
      };

      const res = await fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const out = await res.json();
      if (out.ok) {
        const t = document.getElementById('toast');
        t.style.display = 'block';
        setTimeout(() => { t.style.display = 'none'; load(); }, 1500);
      } else {
        alert('Ошибка: ' + out.error);
      }
    }

    load();
  </script>
</body>
</html>`,

  viewFinder: `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>Настройка стартовых ракурсов сцен</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', system-ui, sans-serif; background: #0b0d10; color: #fff; padding: 25px; }
    h1 { font-size: 24px; text-transform: uppercase; margin-bottom: 20px; border-bottom: 2px solid #1a2026; padding-bottom: 12px; }
    .container { display: flex; gap: 25px; height: calc(100vh - 110px); min-height: 550px; }
    .panel { background: #14181d; padding: 20px; border-radius: 12px; width: 390px; border: 1px solid #1a2026; overflow-y: auto; display: flex; flex-direction: column; }
    .pano-area { background: #14181d; padding: 15px; border-radius: 12px; flex-grow: 1; border: 1px solid #1a2026; position: relative; display: flex; flex-direction: column; }
    #previewPano { width: 100%; height: 100%; border-radius: 8px; overflow: hidden; position: relative; background: #000; }
    label { display: block; margin-bottom: 8px; font-weight: 600; font-size: 13px; color: rgba(255,255,255,0.85); text-transform: uppercase; }
    select, button { width: 100%; padding: 11px; margin-bottom: 15px; border-radius: 6px; font-size: 14px; }
    select { background: #1a2026; color: #fff; border: 1px solid #2c353f; cursor: pointer; }
    button { background: #ff8562; color: #fff; border: none; cursor: pointer; font-weight: 600; text-transform: uppercase; transition: 0.2s; }
    button:hover { background: #e06e4c; }
    .btn-save { background: #4CAF50; }
    .btn-save:hover { background: #439a46; }
    .info-box { background: #1a2026; padding: 10px 12px; border-radius: 6px; border-left: 3px solid #ff8562; font-size: 13px; margin-bottom: 15px; font-family: monospace; line-height: 1.5; }
    .reticle { position: absolute; top: 50%; left: 50%; width: 24px; height: 24px; transform: translate(-50%, -50%); pointer-events: none; z-index: 10; }
    .reticle::before { content: ''; position: absolute; top: 11px; left: 0; width: 24px; height: 2px; background: rgba(255,133,98,0.8); }
    .reticle::after { content: ''; position: absolute; top: 0; left: 11px; width: 2px; height: 24px; background: rgba(255,133,98,0.8); }
    table { width: 100%; border-collapse: collapse; font-size: 12px; margin-top: 10px; }
    th, td { text-align: left; padding: 8px 4px; border-bottom: 1px solid #1a2026; }
    th { color: #777; font-size: 11px; text-transform: uppercase; }
    .badge { background: #4CAF50; color: #fff; padding: 2px 6px; border-radius: 8px; font-size: 10px; margin-left: 6px; }
  </style>
</head>
<body>
  <h1>🎥 Настройка ракурсов камер (initialViewParameters)</h1>
  <div class="container">
    <div class="panel">
      <label for="sceneSelect">1. Выберите сцену:</label>
      <select id="sceneSelect"></select>

      <label>2. Поверните камеру и сохраните:</label>
      <div class="info-box" id="liveCoords">Yaw: 0.0000 | Pitch: 0.0000 | FOV: 1.3090</div>
      <div class="info-box" id="savedCoords" style="border-left-color: #2196F3;">В data.js: загрузка...</div>

      <button id="saveViewBtn" class="btn-save">💾 Сохранить этот ракурс в data.js</button>
      <button id="resetToSavedBtn" style="background:#2c353f;">↺ Вернуть камеру к сохраненному</button>

      <div style="margin-top: 10px; border-top: 1px solid #1a2026; padding-top: 15px;">
        <label>Сохраненные ракурсы в data.js:</label>
        <table>
          <thead><tr><th>Сцена</th><th>Yaw / Pitch / FOV</th></tr></thead>
          <tbody id="scenesTable"></tbody>
        </table>
      </div>
    </div>

    <div class="pano-area">
      <div id="previewPano"><div class="reticle"></div></div>
    </div>
  </div>
  <script src="vendor/wolftour.js"></script>
  <script src="data.js"></script>
  <script>
    let viewer, sceneMap = {}, tilesUrl = 'tiles', savedSet = new Set();

    async function init() {
      const cfgRes = await fetch('/api/config');
      const cfg = await cfgRes.json();
      if (cfg.jsConfig && cfg.jsConfig.tilesUrl) {
        tilesUrl = cfg.jsConfig.tilesUrl.replace(new RegExp('/+$'), '');
      }

      viewer = new WolfTour.Viewer(document.getElementById('previewPano'), {
        controls: { mouseViewMode: (APP_DATA.settings && APP_DATA.settings.mouseViewMode) || 'drag' }
      });

      const ext = (APP_DATA.settings && APP_DATA.settings.tileFormat) || 'jpg';
      APP_DATA.scenes.forEach(sData => {
        const source = WolfTour.ImageUrlSource.fromString(
          tilesUrl + '/' + sData.id + '/{z}/{f}/{y}/{x}.' + ext,
          { cubeMapPreviewUrl: tilesUrl + '/' + sData.id + '/preview.' + ext }
        );
        const geometry = new WolfTour.CubeGeometry(sData.levels);
        const limiter = WolfTour.RectilinearView.limit.traditional(sData.faceSize * 2, 125 * Math.PI / 180, 140 * Math.PI / 180);
        const view = new WolfTour.RectilinearView(sData.initialViewParameters, limiter);
        const scene = viewer.createScene({ source, geometry, view, pinFirstLevel: true });
        sceneMap[sData.id] = { data: sData, scene, view };
      });

      renderList();

      const sel = document.getElementById('sceneSelect');
      if (sel.value) switchPreviewScene(sel.value);

      sel.addEventListener('change', () => switchPreviewScene(sel.value));

      viewer.addEventListener('viewChange', () => {
        const v = viewer.view();
        if (!v) return;
        document.getElementById('liveCoords').textContent =
          'Yaw: ' + v.yaw().toFixed(4) + ' | Pitch: ' + v.pitch().toFixed(4) + ' | FOV: ' + v.fov().toFixed(4);
      });

      document.getElementById('resetToSavedBtn').addEventListener('click', () => {
        const sc = sceneMap[sel.value];
        if (sc && sc.data.initialViewParameters) {
          sc.view.setParameters(sc.data.initialViewParameters);
        }
      });

      document.getElementById('saveViewBtn').addEventListener('click', async () => {
        const id = sel.value;
        const sc = sceneMap[id];
        const v = viewer.view();
        if (!sc || !v) return;

        const viewParams = {
          yaw: parseFloat(v.yaw().toFixed(6)),
          pitch: parseFloat(v.pitch().toFixed(6)),
          fov: parseFloat(v.fov().toFixed(6))
        };

        const baseName = (sc.data.name || '').replace('_REPAIR', '');
        const idsToUpdate = APP_DATA.scenes
          .filter(s => s.name === baseName || s.name === baseName + '_REPAIR')
          .map(s => s.id);

        const res = await fetch('/save-view', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sceneIds: idsToUpdate, viewParams })
        });

        if (res.ok) {
          idsToUpdate.forEach(uid => {
            if (sceneMap[uid]) sceneMap[uid].data.initialViewParameters = Object.assign({}, viewParams);
            savedSet.add(uid);
          });
          renderList();
          updateSavedLabel(id);
        } else {
          alert('Ошибка сохранения ракурса!');
        }
      });
    }

    function switchPreviewScene(id) {
      const sc = sceneMap[id];
      if (!sc) return;
      if (sc.data.initialViewParameters) {
        sc.view.setParameters(sc.data.initialViewParameters);
      }
      sc.scene.switchTo();
      updateSavedLabel(id);
    }

    function updateSavedLabel(id) {
      const sc = sceneMap[id];
      const p = sc && sc.data.initialViewParameters;
      document.getElementById('savedCoords').textContent = p
        ? 'В data.js: Yaw ' + p.yaw.toFixed(3) + ' | Pitch ' + p.pitch.toFixed(3) + ' | FOV ' + p.fov.toFixed(3)
        : 'В data.js: не задано';
    }

    function renderList() {
      const sel = document.getElementById('sceneSelect');
      const tbody = document.getElementById('scenesTable');
      const prevVal = sel.value;
      sel.innerHTML = '';
      tbody.innerHTML = '';

      const baseScenes = APP_DATA.scenes.filter(s => !(s.name && s.name.endsWith('_REPAIR')));
      baseScenes.forEach(s => {
        const opt = new Option((s.name || s.id) + ' [' + s.id + ']', s.id);
        if (s.id === prevVal) opt.selected = true;
        sel.add(opt);

        const p = s.initialViewParameters || { yaw: 0, pitch: 0, fov: 0 };
        const tr = document.createElement('tr');
        tr.innerHTML =
          '<td>' + (s.name || s.id) + (savedSet.has(s.id) ? '<span class="badge">OK</span>' : '') + '</td>' +
          '<td style="font-family:monospace;color:#ccc;">' + p.yaw.toFixed(2) + ' / ' + p.pitch.toFixed(2) + ' / ' + p.fov.toFixed(2) + '</td>';
        tbody.appendChild(tr);
      });
    }

    init();
  </script>
</body>
</html>`,
    uiEditor: `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>Редактор интерфейса 3D-тура</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: system-ui, sans-serif; background: #0b0d10; color: #fff; padding: 25px; }
    h1 { font-size: 22px; margin-bottom: 18px; border-bottom: 2px solid #1a2026; padding-bottom: 10px; }
    .layout { display: flex; gap: 24px; align-items: flex-start; max-width: 1200px; margin: 0 auto; }
    .wrap { width: 420px; flex-shrink: 0; }
    .preview-box { flex-grow: 1; background: #14181d; border: 1px solid #1a2026; border-radius: 10px; padding: 18px; position: sticky; top: 20px; }
    .card { background: #14181d; border: 1px solid #1a2026; border-radius: 10px; padding: 16px; margin-bottom: 14px; }
    .card h2 { font-size: 13px; text-transform: uppercase; color: #ff8562; margin-bottom: 12px; }
    .row { margin-bottom: 14px; }
    .row label { display: flex; justify-content: space-between; font-size: 12.5px; margin-bottom: 5px; color: #cbd5e1; }
    .row span { color: #ff8562; font-weight: bold; font-family: monospace; }
    .def-hint { font-size: 11px; color: #64748b; margin-top: 3px; font-family: monospace; }
    input[type="range"] { width: 100%; accent-color: #ff8562; cursor: pointer; }
    .color-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 12px; }
    .color-item { display: flex; align-items: center; justify-content: space-between; background: #1a2026; border: 1px solid #2c353f; border-radius: 6px; padding: 6px 10px; font-size: 12px; color: #cbd5e1; }
    .color-item input[type="color"] { width: 32px; height: 24px; border: none; background: transparent; cursor: pointer; padding: 0; }
    .preset-row { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 14px; }
    .preset-btn { padding: 7px 10px; background: #1a2026; color: #e2e8f0; border: 1px solid #2c353f; border-radius: 6px; font-size: 11.5px; font-weight: 600; cursor: pointer; }
    .preset-btn:hover { border-color: #ff8562; background: #222933; }
    select { width: 100%; padding: 8px; background: #1a2026; color: #fff; border: 1px solid #2c353f; border-radius: 6px; margin-bottom: 10px; }
    .chk { display: flex; align-items: center; gap: 10px; font-size: 13.5px; margin-bottom: 10px; cursor: pointer; }
    .chk input { width: 17px; height: 17px; accent-color: #ff8562; }
    button#saveUiBtn { width: 100%; padding: 13px; background: #4CAF50; color: #fff; border: none; border-radius: 6px; font-size: 14px; font-weight: bold; cursor: pointer; }
    button#saveUiBtn:hover { background: #439a46; }
    #msg { text-align: center; margin-top: 10px; font-weight: bold; color: #4CAF50; display: none; }

    /* Живой предпросмотр мини-карты */
    .pv-stage { background: #0b0d10; border: 1px dashed #2c353f; border-radius: 8px; padding: 16px; overflow: auto; display: flex; justify-content: center; }
    .pv-map { position: relative; container-type: inline-size; width: 30vw; min-width: 240px; }
    .pv-map img { width: 100%; height: auto; display: block; }
    .pv-pt { position: absolute; width: var(--pt, 2.6cqw); height: var(--pt, 2.6cqw); background: var(--ptc, #007bff); opacity: var(--pto, 0.75); border: 0.3cqw solid var(--ptb, #ffffff); border-radius: 50%; transform: translate(-50%,-50%); cursor: pointer; }
    .pv-dot { position: absolute; left: 50%; top: 50%; width: var(--dot, 3cqw); height: var(--dot, 3cqw); transform: translate(-50%,-50%) rotate(135deg); z-index: 5; }
    .pv-dot::after { content: ''; position: absolute; inset: 0; background: var(--dotc, #ff3333); border: 0.4cqw solid var(--dotb, #ffffff); border-radius: 50%; z-index: 2; }
    .pv-dot::before { content: ''; position: absolute; top: 50%; left: 50%; width: var(--rw, 13cqw); height: var(--rh, 17cqw); transform-origin: top center; transform: translate(-50%,0); z-index: 1; opacity: var(--ro, 0.9); background: linear-gradient(to bottom, var(--rc, #ffffff) 0%, transparent 100%); clip-path: polygon(46% 0%, 54% 0%, 100% 100%, 0% 100%); }
  </style>
</head>
<body>
  <div class="layout">
    <div class="wrap">
      <h1>🎨 Редактор интерфейса</h1>
      <div class="card">
        <h2>1. Масштаб мини-карты (style.css)</h2>
        <div class="row"><label>Ширина на ПК (--map-width-desktop): <span id="v_mapDesk">30vw</span></label><input type="range" id="mapDesk" min="15" max="60" step="1" value="30"><div class="def-hint">Стандарт: 30vw</div></div>
        <div class="row"><label>Ширина на смартфонах (--map-width-mobile): <span id="v_mapMob">90vw</span></label><input type="range" id="mapMob" min="40" max="95" step="1" value="90"><div class="def-hint">Стандарт: 90vw</div></div>
      </div>
      <div class="card">
        <h2>2. Масштаб, цвет и прозрачность точек и луча</h2>
        <div class="preset-row">
          <button type="button" class="preset-btn" onclick="applyMapTheme('dark')">🌙 Для тёмного плана</button>
          <button type="button" class="preset-btn" onclick="applyMapTheme('light')">☀️ Для светлого (белого) плана</button>
        </div>

        <div class="row"><label>Размер точек комнат (--map-point-size): <span id="v_ptSize">2.6cqw</span></label><input type="range" id="ptSize" min="1.0" max="6.0" step="0.1" value="2.6"></div>
        <div class="row"><label>Прозрачность точек комнат (--map-point-opacity): <span id="v_ptOp">0.75</span></label><input type="range" id="ptOp" min="0.15" max="1.0" step="0.05" value="0.75"></div>
        <div class="color-grid">
          <label class="color-item"><span>Заливка точек</span><input type="color" id="ptColor" value="#007bff"></label>
          <label class="color-item"><span>Обводка точек</span><input type="color" id="ptBorder" value="#ffffff"></label>
        </div>

        <div class="row"><label>Размер активной точки (--map-dot-size): <span id="v_dotSize">3.0cqw</span></label><input type="range" id="dotSize" min="1.2" max="7.0" step="0.1" value="3.0"></div>
        <div class="color-grid">
          <label class="color-item"><span>Активная точка</span><input type="color" id="dotColor" value="#ff3333"></label>
          <label class="color-item"><span>Обводка активной</span><input type="color" id="dotBorder" value="#ffffff"></label>
        </div>

        <div class="row"><label>Ширина луча радара (--map-radar-width): <span id="v_radW">13cqw</span></label><input type="range" id="radW" min="5" max="30" step="0.5" value="13"></div>
        <div class="row"><label>Длина луча радара (--map-radar-height): <span id="v_radH">17cqw</span></label><input type="range" id="radH" min="6" max="35" step="0.5" value="17"></div>
        <div class="row"><label>Насыщенность луча (--map-radar-opacity): <span id="v_radOp">0.9</span></label><input type="range" id="radOp" min="0.1" max="1.0" step="0.05" value="0.9"></div>
        <div class="color-grid">
          <label class="color-item" style="grid-column: span 2;"><span>Цвет луча радара</span><input type="color" id="radColor" value="#ffffff"></label>
        </div>
      </div>
      <div class="card">
        <h2>3. Текст верхней плашки (style.css)</h2>
        <div class="row"><label>Размер шрифта на ПК (--title-font-desktop): <span id="v_titleDesk">16px</span></label><input type="range" id="titleDesk" min="11" max="28" step="1" value="16"><div class="def-hint">Стандарт: 16px</div></div>
        <div class="row"><label>Размер шрифта на смартфонах (--title-font-mobile): <span id="v_titleMob">13px</span></label><input type="range" id="titleMob" min="9" max="22" step="1" value="13"><div class="def-hint">Стандарт: 13px (в оригинале было 16px)</div></div>
      </div>
      <div class="card">
        <h2>4. Плавность и инерция камеры (index.js)</h2>
        <div class="row"><label>Скорость вращения (CAMERA_DRAG_SPEED): <span id="v_dragSpeed">0.75</span></label><input type="range" id="dragSpeed" min="0.2" max="1.5" step="0.05" value="0.75"><div class="def-hint">Стандарт: 0.75 (в оригинале было 1.0)</div></div>
        <div class="row"><label>Торможение инерции (CAMERA_INERTIA): <span id="v_inertia">4.5</span></label><input type="range" id="inertia" min="1.5" max="10.0" step="0.5" value="4.5"><div class="def-hint">Стандарт: 4.5 (в оригинале было 6.0)</div></div>
      </div>
      <div class="card">
        <h2>5. Видимость элементов брендинга</h2>
        <label class="chk"><input type="checkbox" id="showBanner" checked> Показывать баннер ЖК</label>
        <label class="chk"><input type="checkbox" id="showWatermark" checked> Показывать водяной знак Wolf Studio</label>
      </div>
      <button id="saveUiBtn">💾 Сохранить настройки интерфейса</button>
      <div id="msg">✓ Интерфейс обновлён! Обновите страницу тура.</div>
    </div>

    <div class="preview-box">
      <h2 style="font-size:13px;text-transform:uppercase;color:#ff8562;margin-bottom:10px;">Живой предпросмотр мини-карты</h2>
      <select id="pvImgSelect"><option value="img/plan.jpg">img/plan.jpg</option></select>
      <div class="pv-stage">
        <div class="pv-map" id="pvMapBox">
          <img id="pvPlanImg" src="img/plan.jpg" alt="План">
          <div id="pvPointsLayer"></div>
          <div class="pv-dot" id="pvActiveDot"></div>
        </div>
      </div>
    </div>
  </div>
  <script>
    const pvBox = document.getElementById('pvMapBox');
    const pvImg = document.getElementById('pvPlanImg');
    const pvImgSel = document.getElementById('pvImgSelect');
    const pvPoints = document.getElementById('pvPointsLayer');
    const pvDot = document.getElementById('pvActiveDot');

    const sliders = [
      ['mapDesk', 'v_mapDesk', 'vw'], ['mapMob', 'v_mapMob', 'vw'],
      ['ptSize', 'v_ptSize', 'cqw'], ['ptOp', 'v_ptOp', ''],
      ['dotSize', 'v_dotSize', 'cqw'],
      ['radW', 'v_radW', 'cqw'], ['radH', 'v_radH', 'cqw'], ['radOp', 'v_radOp', ''],
      ['titleDesk', 'v_titleDesk', 'px'], ['titleMob', 'v_titleMob', 'px'],
      ['dragSpeed', 'v_dragSpeed', ''], ['inertia', 'v_inertia', '']
    ];
    const colorInputs = ['ptColor', 'ptBorder', 'dotColor', 'dotBorder', 'radColor'];

    function syncPreview() {
      pvBox.style.width = document.getElementById('mapDesk').value + 'vw';
      pvBox.style.setProperty('--pt', document.getElementById('ptSize').value + 'cqw');
      pvBox.style.setProperty('--pto', document.getElementById('ptOp').value);
      pvBox.style.setProperty('--ptc', document.getElementById('ptColor').value);
      pvBox.style.setProperty('--ptb', document.getElementById('ptBorder').value);
      pvBox.style.setProperty('--dot', document.getElementById('dotSize').value + 'cqw');
      pvBox.style.setProperty('--dotc', document.getElementById('dotColor').value);
      pvBox.style.setProperty('--dotb', document.getElementById('dotBorder').value);
      pvBox.style.setProperty('--rw', document.getElementById('radW').value + 'cqw');
      pvBox.style.setProperty('--rh', document.getElementById('radH').value + 'cqw');
      pvBox.style.setProperty('--ro', document.getElementById('radOp').value);
      pvBox.style.setProperty('--rc', document.getElementById('radColor').value);
    }

    window.applyMapTheme = function(theme) {
      const presets = theme === 'light'
        ? { ptColor: '#0f172a', ptBorder: '#ffffff', ptOp: '0.85', dotColor: '#dc2626', dotBorder: '#ffffff', radColor: '#0284c7', radOp: '0.75' }
        : { ptColor: '#007bff', ptBorder: '#ffffff', ptOp: '0.75', dotColor: '#ff3333', dotBorder: '#ffffff', radColor: '#ffffff', radOp: '0.9' };
      Object.keys(presets).forEach(k => {
        const el = document.getElementById(k);
        if (el) el.value = presets[k];
      });
      document.getElementById('v_ptOp').textContent = presets.ptOp;
      document.getElementById('v_radOp').textContent = presets.radOp;
      syncPreview();
    };

    sliders.forEach(([id, vid, unit]) => {
      const el = document.getElementById(id);
      el.addEventListener('input', () => {
        document.getElementById(vid).textContent = el.value + unit;
        syncPreview();
      });
    });
    colorInputs.forEach(id => {
      document.getElementById(id).addEventListener('input', syncPreview);
    });

    fetch('/get-img-files').then(r => r.json()).then(files => {
      if (!files || !files.length) return;
      pvImgSel.innerHTML = '';
      files.forEach(f => {
        const opt = new Option('img/' + f, 'img/' + f);
        if (f === 'plan.jpg') opt.selected = true;
        pvImgSel.add(opt);
      });
    });
    pvImgSel.addEventListener('change', () => { pvImg.src = pvImgSel.value; });

    fetch('/get-scenes').then(r => r.json()).then(scenes => {
      pvPoints.innerHTML = '';
      let firstCoords = null;
      (scenes || []).forEach(sc => {
        if (sc.name && sc.name.endsWith('_REPAIR')) return;
        if (sc.mapCoords && sc.mapCoords.left && sc.mapCoords.top) {
          if (!firstCoords) firstCoords = sc.mapCoords;
          const pt = document.createElement('div');
          pt.className = 'pv-pt';
          pt.style.left = sc.mapCoords.left;
          pt.style.top = sc.mapCoords.top;
          pt.title = sc.name;
          pt.addEventListener('click', () => {
            pvDot.style.left = sc.mapCoords.left;
            pvDot.style.top = sc.mapCoords.top;
          });
          pvPoints.appendChild(pt);
        }
      });
      if (firstCoords) {
        pvDot.style.left = firstCoords.left;
        pvDot.style.top = firstCoords.top;
      }
    });

    fetch('/api/ui-config').then(r => r.json()).then(cfg => {
      sliders.forEach(([id, vid, unit]) => {
        if (cfg[id] != null) {
          document.getElementById(id).value = cfg[id];
          document.getElementById(vid).textContent = cfg[id] + unit;
        }
      });
      colorInputs.forEach(id => {
        if (cfg[id]) document.getElementById(id).value = cfg[id];
      });
      document.getElementById('showBanner').checked = cfg.showBanner !== false;
      document.getElementById('showWatermark').checked = cfg.showWatermark !== false;
      document.getElementById('showDemoOverlay').checked = Boolean(cfg.showDemoOverlay);
      syncPreview();
    });

    document.getElementById('saveUiBtn').addEventListener('click', () => {
      const payload = {
        showBanner: document.getElementById('showBanner').checked,
        showWatermark: document.getElementById('showWatermark').checked,
        showDemoOverlay: document.getElementById('showDemoOverlay').checked
      };
      sliders.forEach(([id]) => { payload[id] = parseFloat(document.getElementById(id).value); });
      colorInputs.forEach(id => { payload[id] = document.getElementById(id).value; });
      fetch('/api/ui-save', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).then(r => r.json()).then(res => {
        if (res.ok) {
          const m = document.getElementById('msg');
          m.style.display = 'block';
          setTimeout(() => { m.style.display = 'none'; }, 2500);
        }
      });
    });
  </script>
</body>
</html>`
};

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const DATA_PATH = path.join(__dirname, 'data.js');
const INDEX_PATH = path.join(__dirname, 'index.html');
const JS_PATH = path.join(__dirname, 'index.js');
const CSS_PATH = path.join(__dirname, 'style.css');
const IMG_DIR = path.join(__dirname, 'img');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png'
};

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;').replace(/"/g, '&quot;')
    .replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function unescapeHtml(str) {
  return String(str || '')
    .replace(/&quot;/g, '"').replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>').replace(/&amp;/g, '&');
}

function getAppData() {
  if (!fs.existsSync(DATA_PATH)) throw new Error('Файл data.js не найден!');
  const content = fs.readFileSync(DATA_PATH, 'utf8');
  const start = content.indexOf('{');
  const end = content.lastIndexOf('}') + 1;
  return JSON.parse(content.substring(start, end));
}

function findActualScene(appData, searchId) {
  if (!searchId) return null;
  let scene = appData.scenes.find(s => s.id === searchId);
  if (scene) return scene;
  const match = searchId.match(/\d+/);
  if (match) {
    scene = appData.scenes.find(s => s.id.startsWith(match[0] + '_') || s.id === match[0]);
    if (scene) return scene;
  }
  return appData.scenes.find(s => s.id.toLowerCase().includes(searchId.toLowerCase()));
}

function readAllConfig() {
  const html = fs.readFileSync(INDEX_PATH, 'utf8');
  const js = fs.readFileSync(JS_PATH, 'utf8');
  const appData = getAppData();

  const getTag = (regex) => {
    const m = html.match(regex);
    return (m && m[1]) ? unescapeHtml(m[1].trim()) : '';
  };

  const menuItems = [];
  const ulMatch = html.match(/<ul class="scenes">([\s\S]*?)<\/ul>/);
  if (ulMatch && ulMatch[1]) {
    const liRegex = /<li class="scene">\s*<a href="([^"]*)" class="text">([\s\S]*?)<\/a>\s*<\/li>/g;
    let m;
    while ((m = liRegex.exec(ulMatch[1])) !== null) {
      menuItems.push({ url: unescapeHtml(m[1].trim()), title: unescapeHtml(m[2].trim()) });
    }
  }

  const enableRepair = js.match(/var\s+ENABLE_REPAIR_SWITCH\s*=\s*(true|false)\s*;/);
  const enableMinimap = js.match(/var\s+ENABLE_MINIMAP\s*=\s*(true|false)\s*;/);
  const enableFull = js.match(/var\s+ENABLE_FULLSCREEN\s*=\s*(true|false)\s*;/);
  const enableGyro = js.match(/var\s+ENABLE_GYROSCOPE\s*=\s*(true|false)\s*;/);
  const enableDemo = js.match(/var\s+ENABLE_DEMO_WATERMARK\s*=\s*(true|false)\s*;/);
  const startRepair = js.match(/var\s+START_WITH_REPAIR\s*=\s*(true|false)\s*;/);
  const startScene = js.match(/var\s+START_SCENE_INDEX\s*=\s*(\d+)\s*;/);
  const keepView = js.match(/var\s+KEEP_VIEW_ANGLE\s*=\s*(true|false)\s*;/);
  const aptTitle = js.match(/var\s+APARTMENT_TITLE\s*=\s*["']([^"']*)["']\s*;/);
  const tilesUrl = js.match(/var\s+TILES_URL\s*=\s*["']([^"']*)["']\s*;/);

  return {
    htmlConfig: {
      title: getTag(/<title>([\s\S]*?)<\/title>/),
      description: getTag(/<meta name="description" content="([^"]*)">/),
      ogTitle: getTag(/<meta property="og:title" content="([^"]*)">/),
      ogDescription: getTag(/<meta property="og:description" content="([^"]*)">/),
      ogUrl: getTag(/<meta property="og:url" content="([^"]*)">/),
      ogImage: getTag(/<meta property="og:image" content="([^"]*)">/),
      zhkUrl: getTag(/<a href="([^"]*)"[^>]*class="custom-zhk-top-round">/),
      zhkAlt: getTag(/<img src="img\/logo_zhk\.png" alt="([^"]*)"/),
      planAlt: getTag(/<img src="img\/plan\.jpg" id="mini-map-img" alt="([^"]*)">/),
      watermarkUrl: getTag(/<a href="([^"]*)"[^>]*class="custom-wolf-watermark-bottom">/),
      menuItems
    },
    jsConfig: {
      enableRepairSwitch: enableRepair ? enableRepair[1] === 'true' : false,
      enableMinimap: enableMinimap ? enableMinimap[1] === 'true' : true,
      enableFullscreen: enableFull ? enableFull[1] === 'true' : false,
      enableGyroscope: enableGyro ? enableGyro[1] === 'true' : false,
      enableDemoWatermark: enableDemo ? enableDemo[1] === 'true' : true,
      startWithRepair: startRepair ? startRepair[1] === 'true' : false,
      startSceneIndex: startScene ? parseInt(startScene[1], 10) : 0,
      keepViewAngle: keepView ? keepView[1] === 'true' : true,
      apartmentTitle: aptTitle ? aptTitle[1] : '',
      tilesUrl: tilesUrl ? tilesUrl[1] : 'tiles'
    },
    scenes: (appData.scenes || []).map((s, idx) => ({
      index: idx, id: s.id, name: s.name || s.id
    }))
  };
}
function saveAllConfig(payload) {
  let html = fs.readFileSync(INDEX_PATH, 'utf8');
  let js = fs.readFileSync(JS_PATH, 'utf8');

  if (!fs.existsSync(INDEX_PATH + '.bak')) fs.writeFileSync(INDEX_PATH + '.bak', html, 'utf8');
  if (!fs.existsSync(JS_PATH + '.bak')) fs.writeFileSync(JS_PATH + '.bak', js, 'utf8');

  const { htmlConfig: h, jsConfig: j } = payload;

  if (j.enableRepairSwitch) {
    html = html.replace(/class="ios-switch-wrapper(?:\s+is-hidden)?"/, 'class="ios-switch-wrapper"');
  } else {
    html = html.replace(/class="ios-switch-wrapper(?:\s+is-hidden)?"/, 'class="ios-switch-wrapper is-hidden"');
  }

  html = html.replace(/<title>[\s\S]*?<\/title>/, () => `<title>${escapeHtml(h.title)}</title>`);
  html = html.replace(/<meta name="description" content="[^"]*">/, () => `<meta name="description" content="${escapeHtml(h.description)}">`);
  html = html.replace(/<meta property="og:title" content="[^"]*">/, () => `<meta property="og:title" content="${escapeHtml(h.ogTitle)}">`);
  html = html.replace(/<meta property="og:description" content="[^"]*">/, () => `<meta property="og:description" content="${escapeHtml(h.ogDescription)}">`);
  html = html.replace(/<meta property="og:url" content="[^"]*">/, () => `<meta property="og:url" content="${escapeHtml(h.ogUrl)}">`);
  html = html.replace(/<meta property="og:image" content="[^"]*">/, () => `<meta property="og:image" content="${escapeHtml(h.ogImage)}">`);
  html = html.replace(/<h1 class="sceneName">[\s\S]*?<\/h1>/, () => `<h1 class="sceneName">${escapeHtml(j.apartmentTitle)}</h1>`);

  html = html.replace(/(<a href=")[^"]*("[^>]*class="custom-zhk-top-round">)/, (_, a, b) => `${a}${escapeHtml(h.zhkUrl)}${b}`);
  html = html.replace(/(<img src="img\/logo_zhk\.png" alt=")[^"]*(")/, (_, a, b) => `${a}${escapeHtml(h.zhkAlt)}${b}`);
  html = html.replace(/(<img src="img\/text_zhk\.png" class="dynamic-responsive-img" alt=")[^"]*(")/, (_, a, b) => `${a}${escapeHtml(h.zhkAlt)}${b}`);
  html = html.replace(/(<img src="img\/plan\.jpg" id="mini-map-img" alt=")[^"]*(")/, (_, a, b) => `${a}${escapeHtml(h.planAlt)}${b}`);
  html = html.replace(/(<a href=")[^"]*("[^>]*class="custom-wolf-watermark-bottom">)/, (_, a, b) => `${a}${escapeHtml(h.watermarkUrl)}${b}`);

  if (Array.isArray(h.menuItems)) {
    const menuHtml = h.menuItems
      .map(item => `      <li class="scene">\n        <a href="${escapeHtml(item.url)}" class="text">${escapeHtml(item.title)}</a>\n      </li>`)
      .join('\n');
    html = html.replace(/<ul class="scenes">[\s\S]*?<\/ul>/, () => `<ul class="scenes">\n${menuHtml}\n    </ul>`);
  }

  const safeTitle = String(j.apartmentTitle || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  const startIdx = parseInt(j.startSceneIndex, 10) || 0;
  js = js.replace(/var\s+ENABLE_REPAIR_SWITCH\s*=\s*(true|false)\s*;/, `var ENABLE_REPAIR_SWITCH = ${Boolean(j.enableRepairSwitch)};`);
  if (js.match(/var\s+ENABLE_MINIMAP\s*=\s*(true|false)\s*;/)) {
    js = js.replace(/var\s+ENABLE_MINIMAP\s*=\s*(true|false)\s*;/, `var ENABLE_MINIMAP = ${Boolean(j.enableMinimap)};`);
  } else {
    js = js.replace(/(var\s+ENABLE_REPAIR_SWITCH\s*=\s*(?:true|false)\s*;)/, `$1\n  var ENABLE_MINIMAP = ${Boolean(j.enableMinimap)};`);
  }
  if (js.match(/var\s+ENABLE_FULLSCREEN\s*=\s*(true|false)\s*;/)) {
    js = js.replace(/var\s+ENABLE_FULLSCREEN\s*=\s*(true|false)\s*;/, `var ENABLE_FULLSCREEN = ${Boolean(j.enableFullscreen)};`);
  } else {
    js = js.replace(/(var\s+ENABLE_MINIMAP\s*=\s*(?:true|false)\s*;)/, `$1\n  var ENABLE_FULLSCREEN = ${Boolean(j.enableFullscreen)};`);
  }
  if (js.match(/var\s+ENABLE_GYROSCOPE\s*=\s*(true|false)\s*;/)) {
    js = js.replace(/var\s+ENABLE_GYROSCOPE\s*=\s*(true|false)\s*;/, `var ENABLE_GYROSCOPE = ${Boolean(j.enableGyroscope)};`);
  } else {
    js = js.replace(/(var\s+ENABLE_MINIMAP\s*=\s*(?:true|false)\s*;)/, `$1\n  var ENABLE_GYROSCOPE = ${Boolean(j.enableGyroscope)};`);
  }
  if (js.match(/var\s+ENABLE_DEMO_WATERMARK\s*=\s*(true|false)\s*;/)) {
    js = js.replace(/var\s+ENABLE_DEMO_WATERMARK\s*=\s*(true|false)\s*;/, `var ENABLE_DEMO_WATERMARK = ${Boolean(j.enableDemoWatermark)};`);
  } else {
    js = js.replace(/(var\s+ENABLE_GYROSCOPE\s*=\s*(?:true|false)\s*;)/, `$1\n  var ENABLE_DEMO_WATERMARK = ${Boolean(j.enableDemoWatermark)};`);
  }
  js = js.replace(/var\s+START_WITH_REPAIR\s*=\s*(true|false)\s*;/, `var START_WITH_REPAIR = ${Boolean(j.startWithRepair)};`);
  js = js.replace(/var\s+START_SCENE_INDEX\s*=\s*\d+\s*;/, `var START_SCENE_INDEX = ${startIdx};`);

  if (js.match(/var\s+KEEP_VIEW_ANGLE\s*=\s*(true|false)\s*;/)) {
    js = js.replace(/var\s+KEEP_VIEW_ANGLE\s*=\s*(true|false)\s*;/, `var KEEP_VIEW_ANGLE = ${Boolean(j.keepViewAngle)};`);
  } else {
    js = js.replace(/(var\s+START_SCENE_INDEX\s*=\s*\d+\s*;)/, `$1\n  var KEEP_VIEW_ANGLE = ${Boolean(j.keepViewAngle)};`);
  }

  js = js.replace(/var\s+APARTMENT_TITLE\s*=\s*["'][^"']*["']\s*;/, () => `var APARTMENT_TITLE = "${safeTitle}";`);
  const cleanTiles = String(j.tilesUrl || 'tiles').trim().replace(/\/+$/, '') || 'tiles';
  const safeTiles = cleanTiles.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  js = js.replace(/var\s+TILES_URL\s*=\s*["'][^"']*["']\s*;/, () => `var TILES_URL = "${safeTiles}";`);

  fs.writeFileSync(INDEX_PATH, html, 'utf8');
  fs.writeFileSync(JS_PATH, js, 'utf8');
}

function readJsonBody(req, callback) {
  let body = '';
  req.on('data', chunk => { body += chunk.toString(); });
  req.on('end', () => {
    try { callback(null, JSON.parse(body)); } catch (err) { callback(err); }
  });
}

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.writeHead(200); res.end(); return; }

  const parsedUrl = new URL(req.url, 'http://' + req.headers.host);
  const pathname = parsedUrl.pathname;

  // --- 1. API КОНФИГУРАТОРА (configurator.html) ---
  if (req.method === 'GET' && pathname === '/api/config') {
    try {
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(readAllConfig()));
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ error: e.message }));
    }
    return;
  }

  if (req.method === 'POST' && pathname === '/api/save') {
    readJsonBody(req, (err, payload) => {
      if (err) { res.writeHead(400); res.end(JSON.stringify({ error: err.message })); return; }
      try {
        saveAllConfig(payload);
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ ok: true }));
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }
  // --- 2. API КООРДИНАТ ПЛАНИРОВКИ (coords-finder.html) ---
  if (req.method === 'GET' && pathname === '/get-radar-angle') {
    try {
      const js = fs.readFileSync(JS_PATH, 'utf8');
      const m = js.match(/var\s+RADAR_ANGLE_OFFSET\s*=\s*(-?\d+(?:\.\d+)?)\s*;/);
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ offset: m ? parseFloat(m[1]) : 270 }));
    } catch (e) { res.writeHead(500); res.end(e.message); }
    return;
  }

  if (req.method === 'POST' && pathname === '/save-radar-angle') {
    readJsonBody(req, (err, body) => {
      if (err) { res.writeHead(400); res.end(err.message); return; }
      try {
        const offset = parseFloat(body.offset) || 0;
        let js = fs.readFileSync(JS_PATH, 'utf8');
        if (js.match(/var\s+RADAR_ANGLE_OFFSET\s*=\s*-?\d+(?:\.\d+)?\s*;/)) {
          js = js.replace(/var\s+RADAR_ANGLE_OFFSET\s*=\s*-?\d+(?:\.\d+)?\s*;/, `var RADAR_ANGLE_OFFSET = ${offset};`);
        } else {
          js = js.replace(/(var\s+CAMERA_INERTIA\s*=\s*[0-9.]+\s*;)/, `$1\n  var RADAR_ANGLE_OFFSET = ${offset};`);
        }
        fs.writeFileSync(JS_PATH, js, 'utf8');
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ ok: true }));
      } catch (e) { res.writeHead(500); res.end(e.message); }
    });
    return;
  }

  if (req.method === 'GET' && pathname === '/get-scenes') {
    try {
      const appData = getAppData();
      const list = appData.scenes.map(s => ({ id: s.id, name: s.name || s.id, mapCoords: s.mapCoords || null }));
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(list));
    } catch (e) { res.writeHead(500); res.end(e.message); }
    return;
  }

  if (req.method === 'POST' && pathname === '/save') {
    readJsonBody(req, (err, data) => {
      if (err) { res.writeHead(400); res.end(err.message); return; }
      try {
        const { sceneIds, coordinates } = data;
        const appData = getAppData();
        let count = 0;
        (sceneIds || []).forEach(id => {
          const sc = appData.scenes.find(s => s.id === id);
          if (sc) { sc.mapCoords = { left: coordinates.left, top: coordinates.top }; count++; }
        });
        if (!count) { res.writeHead(404); res.end('Сцены не найдены'); return; }
        fs.writeFileSync(DATA_PATH, 'var APP_DATA = ' + JSON.stringify(appData, null, 2) + ';', 'utf8');
        res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('OK');
      } catch (e) { res.writeHead(500); res.end(e.message); }
    });
    return;
  }

  if (req.method === 'GET' && pathname === '/get-img-files') {
    try {
      if (!fs.existsSync(IMG_DIR)) {
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify([]));
        return;
      }
      const allowedExt = ['.jpg', '.jpeg', '.png', '.webp'];
      const files = fs.readdirSync(IMG_DIR).filter(file => {
        return allowedExt.includes(path.extname(file).toLowerCase());
      });
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(files));
    } catch (e) {
      res.writeHead(500);
      res.end(e.message);
    }
    return;
  }

  // --- 3. API ХОТСПОТОВ В 3D-ТУРЕ ---
  if (req.method === 'GET' && pathname === '/get-all-scenes-list') {
    try {
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(getAppData().scenes.map(s => ({ id: s.id, name: s.name || s.id }))));
    } catch (e) { res.writeHead(500); res.end(e.message); }
    return;
  }

  if (req.method === 'GET' && pathname === '/get-scene-data') {
    try {
      const appData = getAppData();
      const scene = findActualScene(appData, parsedUrl.searchParams.get('sceneId'));
      if (!scene) { res.writeHead(404); res.end('Сцена не найдена'); return; }
      const hps = (scene.linkHotspots || []).map(hp => {
        const ts = appData.scenes.find(s => s.id === hp.target);
        return { targetId: hp.target, targetName: ts ? (ts.name || hp.target) : hp.target, yaw: hp.yaw, pitch: hp.pitch };
      });
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ id: scene.id, name: scene.name || scene.id, hotspots: hps, infoHotspots: scene.infoHotspots || [] }));
    } catch (e) { res.writeHead(500); res.end(e.message); }
    return;
  }

  if (req.method === 'POST' && pathname === '/save-hotspot') {
    readJsonBody(req, (err, body) => {
      if (err) { res.writeHead(400); res.end(err.message); return; }
      try {
        const { sourceSceneId, targetSceneId, yaw, pitch } = body;
        const appData = getAppData();
        const mainScene = findActualScene(appData, sourceSceneId);
        if (!mainScene) { res.writeHead(404); res.end('Сцена не найдена'); return; }

        const baseSourceName = mainScene.name.replace('_REPAIR', '');
        const targetScene = appData.scenes.find(s => s.id === targetSceneId);
        const baseTargetName = targetScene ? targetScene.name.replace('_REPAIR', '') : '';

        appData.scenes.filter(s => s.name === baseSourceName || s.name === baseSourceName + '_REPAIR').forEach(scene => {
          if (!scene.linkHotspots) scene.linkHotspots = [];
          let finalTargetId = targetSceneId;
          const suffix = scene.name.endsWith('_REPAIR') ? '_REPAIR' : '';
          const matchedTarget = appData.scenes.find(s => s.name === baseTargetName + suffix);
          if (matchedTarget) finalTargetId = matchedTarget.id;

          scene.linkHotspots.push({ yaw: parseFloat(yaw), pitch: parseFloat(pitch), rotation: 0, target: finalTargetId });
        });

        fs.writeFileSync(DATA_PATH, 'var APP_DATA = ' + JSON.stringify(appData, null, 2) + ';', 'utf8');
        res.writeHead(200); res.end('OK');
      } catch (e) { res.writeHead(500); res.end(e.message); }
    });
    return;
  }

  if (req.method === 'POST' && pathname === '/delete-hotspot') {
    readJsonBody(req, (err, body) => {
      if (err) { res.writeHead(400); res.end(err.message); return; }
      try {
        const { sceneId, index } = body;
        const appData = getAppData();
        const currentScene = findActualScene(appData, sceneId);
        if (!currentScene) { res.writeHead(404); res.end('Scene not found'); return; }

        const baseName = currentScene.name.replace('_REPAIR', '');
        appData.scenes.filter(s => s.name === baseName || s.name === baseName + '_REPAIR').forEach(scene => {
          if (scene.linkHotspots && scene.linkHotspots[index] !== undefined) scene.linkHotspots.splice(index, 1);
        });

        fs.writeFileSync(DATA_PATH, 'var APP_DATA = ' + JSON.stringify(appData, null, 2) + ';', 'utf8');
        res.writeHead(200); res.end('Deleted');
      } catch (e) { res.writeHead(500); res.end(e.message); }
    });
    return;
  }

  if (req.method === 'POST' && pathname === '/save-info-hotspot') {
    readJsonBody(req, (err, body) => {
      if (err) { res.writeHead(400); res.end(err.message); return; }
      try {
        const { sourceSceneId, spot, editIndex, showBase, showRepair } = body;
        const appData = getAppData();
        const mainScene = findActualScene(appData, sourceSceneId);
        if (!mainScene) { res.writeHead(404); res.end('Scene not found'); return; }
        const baseName = mainScene.name.replace('_REPAIR', '');
        const targets = appData.scenes.filter(s =>
          (showBase && s.name === baseName) || (showRepair && s.name === baseName + '_REPAIR')
        );
        targets.forEach(sc => {
          if (!sc.infoHotspots) sc.infoHotspots = [];
          const copy = Object.assign({}, spot);
          if (editIndex >= 0 && sc.infoHotspots[editIndex]) sc.infoHotspots[editIndex] = copy;
          else sc.infoHotspots.push(copy);
        });
        fs.writeFileSync(DATA_PATH, 'var APP_DATA = ' + JSON.stringify(appData, null, 2) + ';', 'utf8');
        res.writeHead(200); res.end('OK');
      } catch (e) { res.writeHead(500); res.end(e.message); }
    });
    return;
  }

  if (req.method === 'POST' && pathname === '/delete-info-hotspot') {
    readJsonBody(req, (err, body) => {
      if (err) { res.writeHead(400); res.end(err.message); return; }
      try {
        const { sceneId, index, syncRepair } = body;
        const appData = getAppData();
        const mainScene = findActualScene(appData, sceneId);
        if (!mainScene) { res.writeHead(404); res.end('Scene not found'); return; }
        const baseName = mainScene.name.replace('_REPAIR', '');
        const targets = syncRepair
          ? appData.scenes.filter(s => s.name === baseName || s.name === baseName + '_REPAIR')
          : [mainScene];
        targets.forEach(sc => {
          if (sc.infoHotspots && sc.infoHotspots[index] !== undefined) sc.infoHotspots.splice(index, 1);
        });
        fs.writeFileSync(DATA_PATH, 'var APP_DATA = ' + JSON.stringify(appData, null, 2) + ';', 'utf8');
        res.writeHead(200); res.end('OK');
      } catch (e) { res.writeHead(500); res.end(e.message); }
    });
    return;
  }

  if (req.method === 'GET' && pathname === '/api/ui-config') {
    const css = fs.readFileSync(CSS_PATH, 'utf8');
    const html = fs.readFileSync(INDEX_PATH, 'utf8');
    const js = fs.readFileSync(JS_PATH, 'utf8');
    const num = (prop, def) => {
      const m = css.match(new RegExp(prop + ':\\s*([0-9.]+)'));
      return m ? parseFloat(m[1]) : def;
    };
    const hex = (prop, def) => {
      const m = css.match(new RegExp(prop + ':\\s*(#[0-9a-fA-F]{3,8})'));
      return m ? m[1] : def;
    };
    const jsNum = (name, def) => {
      const m = js.match(new RegExp('var\\s+' + name + '\\s*=\\s*([0-9.]+)'));
      return m ? parseFloat(m[1]) : def;
    };
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({
      mapDesk: num('--map-width-desktop', 30),
      mapMob: num('--map-width-mobile', 90),
      ptSize: num('--map-point-size', 2.6),
      ptOp: num('--map-point-opacity', 0.75),
      ptColor: hex('--map-point-color', '#007bff'),
      ptBorder: hex('--map-point-border', '#ffffff'),
      dotSize: num('--map-dot-size', 3.0),
      dotColor: hex('--map-dot-color', '#ff3333'),
      dotBorder: hex('--map-dot-border', '#ffffff'),
      radW: num('--map-radar-width', 13),
      radH: num('--map-radar-height', 17),
      radOp: num('--map-radar-opacity', 0.9),
      radColor: hex('--map-radar-color', '#ffffff'),
      titleDesk: num('--title-font-desktop', 16),
      titleMob: num('--title-font-mobile', 13),
      dragSpeed: jsNum('CAMERA_DRAG_SPEED', 0.75),
      inertia: jsNum('CAMERA_INERTIA', 4.5),
      showBanner: !(html.includes('custom-dynamic-image-container is-hidden')),
      showWatermark: !(html.includes('custom-wolf-watermark-bottom is-hidden')),
      showDemoOverlay: html.includes('demo-watermark-layer"') && !html.includes('demo-watermark-layer is-hidden')
    }));
    return;
  }

  if (req.method === 'POST' && pathname === '/api/ui-save') {
    readJsonBody(req, (err, b) => {
      if (err) { res.writeHead(400); res.end(err.message); return; }
      let css = fs.readFileSync(CSS_PATH, 'utf8');
      let html = fs.readFileSync(INDEX_PATH, 'utf8');
      if (!fs.existsSync(CSS_PATH + '.bak')) fs.writeFileSync(CSS_PATH + '.bak', css, 'utf8');
      const setVar = (name, val, unit) => {
        css = css.replace(new RegExp('(' + name + ':\\s*)[0-9.]+' + unit), '$1' + val + unit);
      };
      const setHex = (name, val) => {
        if (/^#[0-9a-fA-F]{3,8}$/.test(val)) {
          css = css.replace(new RegExp('(' + name + ':\\s*)#[0-9a-fA-F]{3,8}'), '$1' + val);
        }
      };
      setVar('--map-width-desktop', b.mapDesk, 'vw');
      setVar('--map-width-mobile', b.mapMob, 'vw');
      setVar('--map-point-size', b.ptSize, 'cqw');
      setVar('--map-point-opacity', b.ptOp, '');
      setHex('--map-point-color', b.ptColor);
      setHex('--map-point-border', b.ptBorder);
      setVar('--map-dot-size', b.dotSize, 'cqw');
      setHex('--map-dot-color', b.dotColor);
      setHex('--map-dot-border', b.dotBorder);
      setVar('--map-radar-width', b.radW, 'cqw');
      setVar('--map-radar-height', b.radH, 'cqw');
      setVar('--map-radar-opacity', b.radOp, '');
      setHex('--map-radar-color', b.radColor);
      setVar('--title-font-desktop', b.titleDesk, 'px');
      setVar('--title-font-mobile', b.titleMob, 'px');
      let js = fs.readFileSync(JS_PATH, 'utf8');
      js = js.replace(/(var\s+CAMERA_DRAG_SPEED\s*=\s*)[0-9.]+/, '$1' + b.dragSpeed);
      js = js.replace(/(var\s+CAMERA_INERTIA\s*=\s*)[0-9.]+/, '$1' + b.inertia);
      html = html.replace(/class="custom-dynamic-image-container(?:\s+is-hidden)?"/, b.showBanner ? 'class="custom-dynamic-image-container"' : 'class="custom-dynamic-image-container is-hidden"');
      html = html.replace(/class="custom-wolf-watermark-bottom(?:\s+is-hidden)?"/, b.showWatermark ? 'class="custom-wolf-watermark-bottom"' : 'class="custom-wolf-watermark-bottom is-hidden"');
      html = html.replace(/class="demo-watermark-layer(?:\s+is-hidden)?"/, b.showDemoOverlay ? 'class="demo-watermark-layer"' : 'class="demo-watermark-layer is-hidden"');
      fs.writeFileSync(CSS_PATH, css, 'utf8');
      fs.writeFileSync(INDEX_PATH, html, 'utf8');
      fs.writeFileSync(JS_PATH, js, 'utf8');
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ ok: true }));
    });
    return;
  }

  // --- 4. API СТАРТОВЫХ РАКУРСОВ (view-finder.html) ---
  if (req.method === 'POST' && pathname === '/save-view') {
    readJsonBody(req, (err, body) => {
      if (err) { res.writeHead(400); res.end(err.message); return; }
      try {
        const { sceneIds, viewParams } = body;
        const appData = getAppData();
        let count = 0;
        (sceneIds || []).forEach(id => {
          const sc = appData.scenes.find(s => s.id === id);
          if (sc) {
            sc.initialViewParameters = {
              yaw: parseFloat(viewParams.yaw),
              pitch: parseFloat(viewParams.pitch),
              fov: parseFloat(viewParams.fov)
            };
            count++;
          }
        });
        if (!count) { res.writeHead(404); res.end('Сцены не найдены'); return; }
        fs.writeFileSync(DATA_PATH, 'var APP_DATA = ' + JSON.stringify(appData, null, 2) + ';', 'utf8');
        res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('OK');
      } catch (e) { res.writeHead(500); res.end(e.message); }
    });
    return;
  }

  // --- 5. ВСТРОЕННЫЕ HTML-СТРАНИЦЫ РЕДАКТОРА ---
  if (req.method === 'GET' && pathname === '/coords-finder.html') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(EMBEDDED_UI.coords);
    return;
  }
  if (req.method === 'GET' && pathname === '/configurator.html') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(EMBEDDED_UI.config);
    return;
  }
  if (req.method === 'GET' && pathname === '/view-finder.html') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(EMBEDDED_UI.viewFinder);
    return;
  }
  if (req.method === 'GET' && pathname === '/ui-editor.html') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(EMBEDDED_UI.uiEditor);
    return;
  }

  // --- 6. РАЗДАЧА ФАЙЛОВ И ВНЕДРЕНИЕ ПАНЕЛИ РЕДАКТОРА ---
  const filePath = path.join(__dirname, decodeURIComponent(pathname === '/' ? '/index.html' : pathname));
  const ext = path.extname(filePath).toLowerCase();

  if (fs.existsSync(filePath) && fs.lstatSync(filePath).isFile()) {
    res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
    if (filePath === INDEX_PATH) {
      let html = fs.readFileSync(filePath, 'utf8');
      let panelHtml = EMBEDDED_UI.hotpoint;
      res.end(html.includes('</body>') ? html.replace('</body>', panelHtml + '\n</body>') : html + panelHtml);
    } else if (filePath === JS_PATH) {
      let js = fs.readFileSync(filePath, 'utf8');
      if (js.includes('window.viewer = viewer;')) {
        js = js.replace(
          'window.viewer = viewer;',
          'window.viewer = viewer; window.customWolfTourViewer = viewer; window.editorSwitchToScene = function(id){ var sc = findSceneById(id); if(sc) switchScene(sc, false); }; setTimeout(function(){ if(window.customWolfTourViewer && window.updateEditorSceneContext) window.customWolfTourViewer.addEventListener("sceneChange", window.updateEditorSceneContext); }, 400);'
        );
      }
      if (js.includes('finalScene.scene.switchTo();')) {
        js = js.replace('finalScene.scene.switchTo();', 'window.currentActiveSceneId = finalScene && finalScene.data ? finalScene.data.id : null; finalScene.scene.switchTo();');
      }
      if (js.includes('startScene.scene.switchTo();')) {
        js = js.replace('startScene.scene.switchTo();', 'window.currentActiveSceneId = startScene && startScene.data ? startScene.data.id : null; startScene.scene.switchTo();');
      }
      res.end(js);
    } else {
      fs.createReadStream(filePath).pipe(res);
    }
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

server.listen(PORT, () => {
  console.log('\n==================================================');
  console.log('🚀 Единый 3D-Редактор запущен: http://localhost:' + PORT);
  console.log('📍 Точки на карте:  http://localhost:' + PORT + '/coords-finder.html');
  console.log('🎥 Ракурсы камер:   http://localhost:' + PORT + '/view-finder.html');
  console.log('⚙️  Настройки тура:  http://localhost:' + PORT + '/configurator.html');
  console.log('🛠️  Настройки интерфейса:  http://localhost:' + PORT + '/ui-editor.html');
  console.log('==================================================\n');
});
