/**
 * WolfTour Engine — Основная логика виртуального тура
 * Разработка: Wolf Studio (https://wolf-studio.ru)
 */
'use strict';

(function() {
  var WolfTour = window.WolfTour;
  var data = window.APP_DATA;

  // =========================================================================
  // ГЛАВНЫЕ НАСТРОЙКИ ПРОЕКТА
  // =========================================================================
  var ENABLE_REPAIR_SWITCH = false; // true = тумблер отделки включен, false = полностью скрыт
  var START_WITH_REPAIR = false;    // true = старт с ремонтом (_REPAIR), false = без ремонта
  var START_SCENE_INDEX = 3;        // Индекс стартовой сцены (нумерация с 0)
  var APARTMENT_TITLE = "Тип-10Л | 2-ЕВРО 47м²";
  var TILES_URL = "tiles";          // Путь к тайлам: "tiles" или ссылка на Яндекс Облако (без слеша на конце)
  // =========================================================================

  var isWhiteStyle = ENABLE_REPAIR_SWITCH ? START_WITH_REPAIR : false;

  // Элементы DOM
  var panoElement = document.querySelector('#pano');
  var sceneNameElement = document.querySelector('#titleBar .sceneName');
  var sceneListElement = document.querySelector('#sceneList');
  var sceneListToggleElement = document.querySelector('#sceneListToggle');

  // Определение десктопа или мобильного устройства
  if (window.matchMedia) {
    var setMode = function() {
      if (mql.matches) {
        document.body.classList.remove('desktop');
        document.body.classList.add('mobile');
      } else {
        document.body.classList.remove('mobile');
        document.body.classList.add('desktop');
      }
    };
    var mql = matchMedia("(max-width: 500px), (max-height: 500px)");
    setMode();
    if (mql.addEventListener) {
      mql.addEventListener('change', setMode);
    } else if (mql.addListener) {
      mql.addListener(setMode);
    }
  } else {
    document.body.classList.add('desktop');
  }

  // Определение сенсорного экрана
  document.body.classList.add('no-touch');
  window.addEventListener('touchstart', function onFirstTouch() {
    document.body.classList.remove('no-touch');
    document.body.classList.add('touch');
    window.removeEventListener('touchstart', onFirstTouch);
  });

  // Инициализация вьюера WolfTour
  var viewer = new WolfTour.Viewer(panoElement, {
    controls: {
      mouseViewMode: data.settings.mouseViewMode
    }
  });
  window.viewer = viewer;

  // Создание сцен
  var scenes = data.scenes.map(function(sceneData) {
    var urlPrefix = TILES_URL.replace(/\/+$/, '');
    var ext = (data.settings && data.settings.tileFormat) ? data.settings.tileFormat : "jpg";
    var source = WolfTour.ImageUrlSource.fromString(
      urlPrefix + "/" + sceneData.id + "/{z}/{f}/{y}/{x}." + ext,
      { cubeMapPreviewUrl: urlPrefix + "/" + sceneData.id + "/preview." + ext }
    );

    var geometry = new WolfTour.CubeGeometry(sceneData.levels);

    var limiter = WolfTour.RectilinearView.limit.traditional(
      sceneData.faceSize * 2,
      125 * Math.PI / 180,
      140 * Math.PI / 180
    );

    var view = new WolfTour.RectilinearView(sceneData.initialViewParameters, limiter);

    var scene = viewer.createScene({
      source: source,
      geometry: geometry,
      view: view,
      pinFirstLevel: true
    });

    // Создание стрелок перехода
    if (sceneData.linkHotspots) {
      sceneData.linkHotspots.forEach(function(hotspot) {
        var element = createLinkHotspotElement(hotspot);
        scene.hotspotContainer().createHotspot(element, { yaw: hotspot.yaw, pitch: hotspot.pitch });
      });
    }

    return {
      data: sceneData,
      scene: scene,
      view: view
    };
  });
  // Меню списка квартир
  if (sceneListToggleElement && sceneListElement) {
    sceneListToggleElement.addEventListener('click', function() {
      sceneListElement.classList.toggle('enabled');
      sceneListToggleElement.classList.toggle('enabled');
    });
  }

  function hideSceneList() {
    if (sceneListElement) sceneListElement.classList.remove('enabled');
    if (sceneListToggleElement) sceneListToggleElement.classList.remove('enabled');
  }

  // Поиск парной сцены (с ремонтом или без)
  function resolveSceneVariant(scene) {
    if (!scene || !ENABLE_REPAIR_SWITCH) return scene;

    var currentName = scene.data.name;
    var targetName = null;

    if (isWhiteStyle && !currentName.endsWith('_REPAIR')) {
      targetName = currentName + '_REPAIR';
    } else if (!isWhiteStyle && currentName.endsWith('_REPAIR')) {
      targetName = currentName.replace('_REPAIR', '');
    }

    if (targetName) {
      for (var i = 0; i < scenes.length; i++) {
        if (scenes[i].data.name === targetName) {
          return scenes[i];
        }
      }
    }

    return scene;
  }

  // Переключение сцен с сохранением ракурса без рывков
  function switchScene(scene, keepViewAngle) {
    if (!scene) return;

    var finalScene = resolveSceneVariant(scene);
    var currentView = viewer.view();

    if (keepViewAngle && currentView && finalScene.view) {
      finalScene.view.setParameters({
        yaw: currentView.yaw(),
        pitch: currentView.pitch(),
        fov: currentView.fov()
      });
    }

    finalScene.scene.switchTo();

    if (sceneNameElement) {
      sceneNameElement.textContent = APARTMENT_TITLE;
    }

    // Перенос красной точки на мини-карте
    var mapDot = document.getElementById('mini-map-dot');
    if (mapDot && finalScene.data && finalScene.data.mapCoords) {
      mapDot.classList.add('switching');
      setTimeout(function() {
        mapDot.style.left = finalScene.data.mapCoords.left;
        mapDot.style.top = finalScene.data.mapCoords.top;
      }, 150);
      setTimeout(function() {
        mapDot.classList.remove('switching');
      }, 300);
    }
  }

  // Генерация синих точек комнат на мини-карте (исключая дубли _REPAIR)
  var pointsContainer = document.getElementById('mini-map-points');
  if (pointsContainer && data.scenes) {
    data.scenes.forEach(function(sceneData) {
      if (sceneData.name && sceneData.name.endsWith('_REPAIR')) {
        return;
      }

      if (sceneData.mapCoords && sceneData.mapCoords.left && sceneData.mapCoords.top) {
        var pointEl = document.createElement('div');
        pointEl.classList.add('map-nav-point');
        pointEl.setAttribute('data-scene-id', sceneData.id);
        pointEl.style.left = sceneData.mapCoords.left;
        pointEl.style.top = sceneData.mapCoords.top;

        pointEl.addEventListener('click', function(event) {
          event.stopPropagation();
          var targetScene = findSceneById(sceneData.id);
          if (targetScene) {
            switchScene(targetScene, true);
          }
        });

        pointsContainer.appendChild(pointEl);
      }
    });
  }

  // Создание элемента стрелки перехода
  function createLinkHotspotElement(hotspot) {
    var wrapper = document.createElement('div');
    wrapper.classList.add('hotspot', 'link-hotspot');

    var icon = document.createElement('img');
    icon.src = 'img/link.png';
    icon.classList.add('link-hotspot-icon');
    icon.style.transform = 'rotate(' + hotspot.rotation + 'rad)';

    wrapper.addEventListener('click', function() {
      switchScene(findSceneById(hotspot.target), true);
    });

    stopTouchAndScrollEventPropagation(wrapper);
    wrapper.appendChild(icon);

    return wrapper;
  }

  function stopTouchAndScrollEventPropagation(element) {
    var eventList = ['touchstart', 'touchmove', 'touchend', 'touchcancel', 'wheel', 'mousewheel'];
    for (var i = 0; i < eventList.length; i++) {
      element.addEventListener(eventList[i], function(event) {
        event.stopPropagation();
      }, { passive: true });
    }
  }

  function findSceneById(id) {
    for (var i = 0; i < scenes.length; i++) {
      if (scenes[i].data.id === id) {
        return scenes[i];
      }
    }
    return null;
  }
  // Запуск стартовой сцены с проверкой границ массива
  var baseStartScene = scenes[START_SCENE_INDEX] || scenes;
  var startScene = resolveSceneVariant(baseStartScene);

  if (startScene) {
    startScene.scene.switchTo();
    if (sceneNameElement) {
      sceneNameElement.textContent = APARTMENT_TITLE;
    }

    var initialMapDot = document.getElementById('mini-map-dot');
    if (initialMapDot && startScene.data && startScene.data.mapCoords) {
      initialMapDot.style.left = startScene.data.mapCoords.left;
      initialMapDot.style.top = startScene.data.mapCoords.top;
    }
  }
  hideSceneList();

  // Логика тумблера "Вариант отделки" и подсказки
  var switchWrapper = document.querySelector('.ios-switch-wrapper');
  var finishToggleInput = document.getElementById('finish-variant-toggle-btn');
  var mapImageEl = document.getElementById('mini-map-img');
  var hintBox = document.getElementById('finish-variant-hint');

  if (!ENABLE_REPAIR_SWITCH) {
    if (switchWrapper) switchWrapper.style.display = 'none';
    if (mapImageEl) mapImageEl.src = 'img/plan.jpg';
  } else {
    var syncInterfaceStyle = function() {
      if (!finishToggleInput) return;
      finishToggleInput.checked = isWhiteStyle;
      if (mapImageEl) {
        mapImageEl.src = isWhiteStyle ? 'img/plan_REPAIR.jpg' : 'img/plan.jpg';
      }
    };

    syncInterfaceStyle();

    if (finishToggleInput) {
      var showTimer = null;

      if (hintBox) {
        showTimer = setTimeout(function() {
          if (!finishToggleInput.checked && !hintBox.classList.contains('is-dismissed')) {
            hintBox.classList.add('is-visible');
          }
        }, 6000);
      }

      finishToggleInput.addEventListener('change', function(event) {
        event.stopPropagation();

        isWhiteStyle = this.checked;

        if (isWhiteStyle && hintBox) {
          clearTimeout(showTimer);
          hintBox.classList.remove('is-visible');
          hintBox.classList.add('is-dismissed');
        }

        syncInterfaceStyle();

        var currentScene = viewer.scene();
        if (currentScene) {
          for (var i = 0; i < scenes.length; i++) {
            if (scenes[i].scene === currentScene) {
              switchScene(scenes[i], true);
              break;
            }
          }
        }
      });
    }
  }

  // Вращение луча радара на мини-карте
  viewer.addEventListener('viewChange', function() {
    var currentScene = viewer.scene();
    var mapDot = document.getElementById('mini-map-dot');

    if (currentScene && mapDot) {
      var liveView = currentScene.view();
      if (!liveView) return;

      var degrees = liveView.yaw() * (180 / Math.PI);
      mapDot.style.transform = 'translate(-50%, -50%) rotate(' + (degrees + 180) + 'deg)';
    }
  });

  // Сворачивание и разворачивание мини-карты
  var mapOpenBtn = document.getElementById('mini-map-toggle-btn');
  var mapWrapper = document.getElementById('mini-map-wrapper');
  var mapCloseBtn = document.getElementById('mini-map-close-btn');

  if (mapOpenBtn && mapWrapper && mapCloseBtn) {
    mapOpenBtn.addEventListener('click', function(event) {
      event.stopPropagation();
      mapOpenBtn.classList.add('hidden-state');
      mapWrapper.classList.add('active-state');
    });

    mapCloseBtn.addEventListener('click', function(event) {
      event.stopPropagation();
      mapWrapper.classList.remove('active-state');
      mapOpenBtn.classList.remove('hidden-state');
    });
  }

})();
