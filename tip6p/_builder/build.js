/**
 * WolfTour Engine — Интерактивный сборщик, архиватор и обфускатор
 * Запуск: node build.js (или npm.cmd run build)
 */
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { execFileSync } = require('child_process');
const esbuild = require('esbuild');
const JavaScriptObfuscator = require('javascript-obfuscator');

const BUILDER_DIR = __dirname;
const BUILDER_NAME = path.basename(BUILDER_DIR);
const ROOT_DIR = path.resolve(BUILDER_DIR, '..');
const FOLDER_NAME = path.basename(ROOT_DIR);
const BACKUP_ZIP = path.join(ROOT_DIR, `${FOLDER_NAME}.zip`);
const DIST_DIR = path.join(ROOT_DIR, 'dist');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise((res) => rl.question(q, (ans) => res(ans.trim())));
const askYesNo = async (q, defYes = true) => {
  const hint = defYes ? '[Y/n]' : '[y/N]';
  const a = (await ask(`${q} ${hint}: `)).toLowerCase();
  if (!a) return defYes;
  return a === 'y' || a === 'yes' || a === 'д' || a === 'да';
};

function createBackupZip() {
  console.log(`\n📦 Создаю архив бэкапа: ${FOLDER_NAME}.zip ...`);
  const exclude = new Set([
    `${FOLDER_NAME}.zip`,
    'dist',
    '_builder',
    'all_editor-server_v4.js',
    'generatePRO_v2.py'
  ]);
  const items = fs.readdirSync(ROOT_DIR)
    .filter((name) => !exclude.has(name) && !name.endsWith('.bak') && !name.endsWith('.md'))
    .map((name) => `'${name.replace(/'/g, "''")}'`);

  if (!items.length) throw new Error('Не найдены файлы для архивации.');
  if (fs.existsSync(BACKUP_ZIP)) fs.unlinkSync(BACKUP_ZIP);

  const psCmd = `Compress-Archive -Path ${items.join(',')} -DestinationPath '${BACKUP_ZIP.replace(/'/g, "''")}' -Force`;
  execFileSync('powershell.exe', ['-NoProfile', '-Command', psCmd], { cwd: ROOT_DIR, stdio: 'inherit' });
  console.log(`✅ Бэкап успешно создан: ${FOLDER_NAME}.zip`);
}

function restoreFromBackupZip() {
  console.log(`\n♻️  Восстанавливаю исходники из ${FOLDER_NAME}.zip ...`);
  if (fs.existsSync(DIST_DIR)) {
    fs.rmSync(DIST_DIR, { recursive: true, force: true });
  }
  const psCmd = `Expand-Archive -Path '${BACKUP_ZIP.replace(/'/g, "''")}' -DestinationPath '${ROOT_DIR.replace(/'/g, "''")}' -Force`;
  execFileSync('powershell.exe', ['-NoProfile', '-Command', psCmd], { cwd: ROOT_DIR, stdio: 'inherit' });
  console.log('✅ Исходные файлы восстановлены! Папка dist/ удалена.');
}

function detectTilesUrl() {
  const jsPath = path.join(ROOT_DIR, 'index.js');
  if (!fs.existsSync(jsPath)) return 'tiles';
  const js = fs.readFileSync(jsPath, 'utf8');
  const m = js.match(/var\s+TILES_URL\s*=\s*["']([^"']*)["']\s*;/);
  return m ? m[1].trim() : 'tiles';
}

function copyDirRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDirRecursive(srcPath, destPath);
    else fs.copyFileSync(srcPath, destPath);
  }
}

function buildWatermarkGuardCode() {
  const html = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf8');
  if (html.includes('custom-wolf-watermark-bottom is-hidden')) return '';

  const toDataUri = (rel) => {
    const full = path.join(ROOT_DIR, rel);
    return fs.existsSync(full) ? 'data:image/png;base64,' + fs.readFileSync(full).toString('base64') : rel;
  };
  const bgUri = toDataUri('img/circle.png');
  const iconUri = toDataUri('img/site.png');

  return `
;(function(){
  var BG_SRC = ${JSON.stringify(bgUri)};
  var ICON_SRC = ${JSON.stringify(iconUri)};
  var TARGET_URL = "https://wolf-studio.ru";
  function ensureWatermark() {
    var el = document.querySelector('.custom-wolf-watermark-bottom');
    var broken = !el || !document.body.contains(el) || el.getAttribute('href') !== TARGET_URL;
    if (!broken) {
      var st = window.getComputedStyle(el);
      if (st.display === 'none' || st.visibility === 'hidden' || parseFloat(st.opacity) < 0.5 || el.offsetWidth < 20) broken = true;
    }
    if (broken) {
      if (el && el.parentNode) el.parentNode.removeChild(el);
      var a = document.createElement('a');
      a.href = TARGET_URL;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.className = 'custom-wolf-watermark-bottom';
      a.style.cssText = 'display:block!important;visibility:visible!important;opacity:1!important;position:fixed;bottom:20px;right:20px;width:70px;height:70px;z-index:99999;cursor:pointer;';
      a.innerHTML = '<img src="' + BG_SRC + '" class="wolf-watermark-bg" style="position:absolute;top:3px;right:3px;width:65px;height:65px;object-fit:contain;" alt=""><img src="' + ICON_SRC + '" class="wolf-watermark-icon" style="position:absolute;top:8px;right:8px;width:54px;height:54px;object-fit:contain;" alt="Wolf Studio">';
      document.body.appendChild(a);
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ensureWatermark);
  else ensureWatermark();
  setInterval(ensureWatermark, 2800);
})();`;
}

async function main() {
  console.log('==================================================');
  console.log(`🐺 WolfTour Engine — Сборщик проекта [${FOLDER_NAME}]`);
  console.log('==================================================');

  if (!fs.existsSync(BACKUP_ZIP)) {
    if (await askYesNo(`Архив бэкапа ${FOLDER_NAME}.zip не найден. Создать перед сборкой?`, true)) {
      createBackupZip();
    }
  } else {
    console.log(`\n📁 Найден архив бэкапа: ${FOLDER_NAME}.zip`);
    const mode = await ask('Выберите действие: [1] Собрать продакшен (dist)  [2] Откатить из бэкапа (по умолчанию 1): ');
    if (mode === '2') {
      restoreFromBackupZip();
      rl.close();
      return;
    }
    if (await askYesNo(`Обновить архив ${FOLDER_NAME}.zip текущими исходниками перед сборкой?`, false)) {
      createBackupZip();
    }
  }

  const embedData = await askYesNo('\n1. Вшить data.js внутрь единого app.min.js (максимальная защита)?', true);
  const minifyCss = await askYesNo('2. Сжать style.css в одну строку?', true);

  const tilesUrl = detectTilesUrl();
  const isCloud = /^https?:\/\//i.test(tilesUrl);
  let copyTiles = false;
  console.log(`\n🔎 Обнаружен TILES_URL в index.js: "${tilesUrl}"`);
  if (isCloud) {
    const okCloud = await askYesNo('3. Путь указывает на облако. Подтверждаете, что копировать папку tiles/ НЕ нужно?', true);
    if (!okCloud) {
      console.log('⛔ Сборка отменена. Измените TILES_URL через редактор или в index.js и запустите снова.');
      rl.close();
      return;
    }
  } else {
    copyTiles = await askYesNo('3. Путь локальный. Скопировать папку tiles/ в dist/tiles/?', true);
  }

  console.log('\n⚙️  Запускаю сборку и обфускацию...');
  if (fs.existsSync(DIST_DIR)) fs.rmSync(DIST_DIR, { recursive: true, force: true });
  fs.mkdirSync(DIST_DIR, { recursive: true });

  const parts = [];
  if (embedData) parts.push(fs.readFileSync(path.join(ROOT_DIR, 'data.js'), 'utf8'));
  parts.push(fs.readFileSync(path.join(ROOT_DIR, 'vendor', 'wolftour.js'), 'utf8'));
  parts.push(fs.readFileSync(path.join(ROOT_DIR, 'index.js'), 'utf8'));
  parts.push(buildWatermarkGuardCode());

  const bundled = esbuild.transformSync(parts.join('\n;\n'), { minify: true, target: 'es2018' }).code;
  const obfuscated = JavaScriptObfuscator.obfuscate(bundled, {
    compact: true,
    controlFlowFlattening: false,
    deadCodeInjection: false,
    identifierNamesGenerator: 'hexadecimal',
    renameGlobals: false,
    selfDefending: false,
    stringArray: true,
    stringArrayEncoding: ['base64'],
    stringArrayThreshold: 0.75,
    unicodeEscapeSequence: false
  }).getObfuscatedCode();

  fs.writeFileSync(path.join(DIST_DIR, 'app.min.js'), obfuscated, 'utf8');

  let css = fs.readFileSync(path.join(ROOT_DIR, 'style.css'), 'utf8');
  if (minifyCss) css = esbuild.transformSync(css, { loader: 'css', minify: true }).code;
  fs.writeFileSync(path.join(DIST_DIR, 'style.css'), css, 'utf8');

  let html = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf8');
  const scriptsBlock = embedData
    ? '<script src="app.min.js"></script>'
    : '<script src="data.js"></script>\n  <script src="app.min.js"></script>';
  html = html.replace(/<script src="vendor\/wolftour\.js"><\/script>\s*<script src="data\.js"><\/script>\s*<script src="index\.js"><\/script>/, scriptsBlock);
  fs.writeFileSync(path.join(DIST_DIR, 'index.html'), html, 'utf8');

  if (!embedData) fs.copyFileSync(path.join(ROOT_DIR, 'data.js'), path.join(DIST_DIR, 'data.js'));
  copyDirRecursive(path.join(ROOT_DIR, 'img'), path.join(DIST_DIR, 'img'));
  if (copyTiles) {
    console.log('📁 Копирую папку tiles/ в dist/tiles/...');
    copyDirRecursive(path.join(ROOT_DIR, 'tiles'), path.join(DIST_DIR, 'tiles'));
  }

  console.log('\n🎉 Сборка успешно завершена! Готовый проект находится в папке: dist/');
  rl.close();
}

main().catch((err) => {
  console.error('\n❌ Ошибка сборки:', err.message);
  rl.close();
  process.exit(1);
});
