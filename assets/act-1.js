(function(window, document, gsap){

/* ================= 合并运行时沙箱（自动生成，勿手改）================= */
var __realWin = window;
var __realDoc = document;
var __actNo = 1;
var __root = __realDoc.getElementById('act-1');
var __App = __realWin.App;
function __isActive(){ return __App.isActive(__actNo); }
function __scope(sel){
  sel = String(sel);
  if (!sel || sel.indexOf('#act-1') === 0) return sel;
  return '#act-1 ' + sel;
}
var __pausedRaf = [];
var __rafReal = __realWin.requestAnimationFrame.bind(__realWin);
var __rafCancelReal = __realWin.cancelAnimationFrame.bind(__realWin);
function __rafGate(cb){
  // 活动幕保持源文件的原生帧节奏；非活动幕只保留每个循环的一次待恢复回调。
  return __rafReal(function(t){
    if (__isActive()) cb(t);
    else if (__pausedRaf.indexOf(cb) < 0) __pausedRaf.push(cb);
  });
}
function __resumeRaf(){
  if (!__pausedRaf.length) return;
  var list = __pausedRaf; __pausedRaf = [];
  for (var i = 0; i < list.length; i++) { try { list[i](performance.now()); } catch (e) {} }
}
var __listeners = new Map();
function __gate(fn){
  if (typeof fn !== 'function') return fn;
  var w = function(){ if (!__isActive()) return; return fn.apply(this, arguments); };
  __listeners.set(fn, w);
  return w;
}
var __doc = new Proxy(__realDoc, {
  get: function(t, p){
    if (p === 'body') return __root;
    if (p === 'getElementById') return function(id){ return __root.querySelector('#' + id) || t.getElementById(id); };
    if (p === 'querySelector') return function(sel){
      var hit = __root.querySelector(__scope(sel));
      if (hit) return hit;
      // 舞台元素在幕容器之外：允许 #stage / .stage 回落到全局舞台
      var raw = String(sel);
      if (raw === '#stage' || raw === '.stage') return __realDoc.querySelector(raw);
      return String(sel).charAt(0) === '#' ? __realDoc.querySelector(sel) : null;
    };
    if (p === 'querySelectorAll') return function(sel){ return __root.querySelectorAll(__scope(sel)); };
    if (p === 'addEventListener') return function(a, b, c){ return t.addEventListener(a, __gate(b), c); };
    if (p === 'removeEventListener') return function(a, b, c){ return t.removeEventListener(a, __listeners.get(b) || b, c); };
    var v = t[p];
    return typeof v === 'function' ? v.bind(t) : v;
  },
  set: function(t, p, v){ t[p] = v; return true; }
});
var __win = new Proxy(__realWin, {
  get: function(t, p){
    if (p === 'addEventListener') return function(a, b, c){ return t.addEventListener(a, __gate(b), c); };
    if (p === 'removeEventListener') return function(a, b, c){ return t.removeEventListener(a, __listeners.get(b) || b, c); };
    if (p === 'requestAnimationFrame') return __rafGate;
    if (p === 'cancelAnimationFrame') return __rafCancelReal;
    var v = t[p];
    return typeof v === 'function' ? v.bind(t) : v;
  },
  set: function(t, p, v){ t[p] = v; return true; }
});
var __gsapScoped = new Proxy(gsap, {
  get: function(t, p){
    var v = t[p];
    if (typeof v !== 'function') return v;
    return function(){
      var args = Array.prototype.slice.call(arguments);
      if (typeof args[0] === 'string') args[0] = __scope(args[0]);
      else if (Array.isArray(args[0])) args[0] = args[0].map(function(x){ return typeof x === 'string' ? __scope(x) : x; });
      return v.apply(t, args);
    };
  }
});
document = __doc;
window = __win;
gsap = __gsapScoped;
function requestAnimationFrame(cb){ return __rafGate(cb); }
function cancelAnimationFrame(h){ return __rafCancelReal(h); }
/* ================= 以下为原幕脚本（逻辑未改动）================= */


// 全局错误捕获，显示在调试区
window.onerror = function(msg, url, line) {
  var d = document.getElementById('debug');
  if (d) d.textContent = 'ERR: ' + msg + ' (line ' + line + ')';
};

// ============================================================
//  适配：750×1334 逻辑尺寸 → 等比缩放居中
// ============================================================
const stage = document.getElementById('stage');
const DESIGN_W = 750, DESIGN_H = 1334;

function resize() {
  const scale = Math.min(
    window.innerWidth / DESIGN_W,
    window.innerHeight / DESIGN_H
  );
  stage.style.transform = `scale(${scale})`;
  stage.style.left = `${(window.innerWidth - DESIGN_W * scale) / 2}px`;
  stage.style.top = `${(window.innerHeight - DESIGN_H * scale) / 2}px`;
}
window.addEventListener('resize', resize);
resize();

// ============================================================
//  场景管理
// ============================================================
const sceneOrder = [
  'scene-1-1','scene-1-2','scene-1-3','scene-1-4','scene-1-5',
  'scene-1-6','scene-1-7',
  'scene-2-1','scene-2-2','scene-2-3','scene-2-4','scene-2-5',
  'scene-2-6','scene-2-7','scene-2-8','scene-2',
  'scene-3','scene-4','scene-5','scene-6','scene-7'
];
let currentScene = 0;

function goToScene(index, options = {}) {
  if (index < 0 || index >= sceneOrder.length) return;
  if (index === currentScene) return;
  const prev = document.getElementById(sceneOrder[currentScene]);
  const next = document.getElementById(sceneOrder[index]);

  // 同底色、同主体的连续镜头：下一幕完整垫底，只淡出上一幕。
  // 若两幕同时改变 opacity，过渡中点会让深色 stage 透出，形成一次暗闪。
  const solidReveal = options.solidReveal === true;
  next.classList.add('active');
  next.style.visibility = 'visible';
  gsap.set(next, { opacity: solidReveal ? 1 : 0, zIndex: solidReveal ? 0 : '' });
  if (!solidReveal) {
    gsap.to(next, { opacity: 1, duration: 0.5, ease: 'power1.inOut',
      onComplete: () => { next.style.opacity = ''; } });
  } else {
    gsap.set(prev, { zIndex: 1, pointerEvents: 'none' });
  }

  // 上一幕淡出后再隐藏；solidReveal 时下方始终有完整纸色背景，不会露出深色舞台。
  gsap.to(prev, { opacity: 0, duration: 0.5, ease: 'power1.inOut',
    onComplete: () => {
      prev.classList.remove('active');
      prev.style.visibility = 'hidden';
      prev.style.opacity = '';
      prev.style.zIndex = '';
      prev.style.pointerEvents = '';
      next.style.opacity = '';
      next.style.zIndex = '';
    } });

  currentScene = index;
  // 切换场景时清除叠幕对比（调试用）
  document.querySelectorAll('.dbg-compare').forEach(s => s.classList.remove('dbg-compare'));
  window.__compareDir = 0;
  document.getElementById('debug').textContent = 'scene:' + index + ' ' + sceneOrder[index];
  updateProgress();

  // 触发新场景的入场动画
  if (sceneInit[index]) sceneInit[index]();
}

// 调试快捷键：按数字键跳转场景（测试用，正式版移除）
document.addEventListener('keydown', (e) => {
  if (e.key >= '0' && e.key <= '9') {
    const idx = parseInt(e.key);
    if (idx < sceneOrder.length) goToScene(idx);
  }
});

// ============================================================
//  线稿 JSON 渲染（assets/第一幕-启封/窗.json 等）
// ============================================================
function renderLineArtJSON(url, container, nullFill, texOverride) {
  const debug = document.getElementById('debug');
  let data = window.WINDOW_DATA;
  if (data) {
    if (texOverride) {
      // 分镜级纹理覆盖（来自 assets/scenes.json 元素 tex）：浅拷贝，不污染 window.WINDOW_DATA
      data = Object.assign({}, data);
      data.textures = Object.assign({}, data.textures || {});
      data.textureTrans = Object.assign({}, data.textureTrans || {});
      let tn = null;
      (data.paths || []).forEach(p => { if (!tn && p.fill && p.fill.t === 'tex') tn = p.fill.name; });
      if (tn) {
        data.textures[tn] = texOverride.img !== undefined ? texOverride.img : null;
        data.textureTrans[tn] = {
          s: texOverride.s != null ? texOverride.s : 1,
          x: texOverride.x != null ? texOverride.x : 0,
          y: texOverride.y != null ? texOverride.y : 0
        };
      }
    }
    try {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('viewBox', `0 0 ${data.width} ${data.height}`);
      svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
      svg.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;';

      const stroke = '#6b5a4a'; // 暖棕灰线条，配合木窗框
      const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');

      // 水彩外晕 filter：模糊 + 轻微位移
      const haloFilter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
      haloFilter.setAttribute('id', 'wc-halo');
      haloFilter.setAttribute('x', '-10%'); haloFilter.setAttribute('y', '-10%');
      haloFilter.setAttribute('width', '120%'); haloFilter.setAttribute('height', '120%');
      const hTurb = document.createElementNS('http://www.w3.org/2000/svg', 'feTurbulence');
      hTurb.setAttribute('type', 'fractalNoise');
      hTurb.setAttribute('baseFrequency', '0.02 0.04');
      hTurb.setAttribute('numOctaves', '2');
      hTurb.setAttribute('seed', '5');
      hTurb.setAttribute('result', 'noise');
      haloFilter.appendChild(hTurb);
      const hDisp = document.createElementNS('http://www.w3.org/2000/svg', 'feDisplacementMap');
      hDisp.setAttribute('in', 'SourceGraphic');
      hDisp.setAttribute('in2', 'noise');
      hDisp.setAttribute('scale', '2.5');
      hDisp.setAttribute('xChannelSelector', 'R');
      hDisp.setAttribute('yChannelSelector', 'G');
      hDisp.setAttribute('result', 'displaced');
      haloFilter.appendChild(hDisp);
      const hBlur = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur');
      hBlur.setAttribute('in', 'displaced');
      hBlur.setAttribute('stdDeviation', '1.2');
      haloFilter.appendChild(hBlur);
      defs.appendChild(haloFilter);

      // 实色层毛边 filter：轻微位移
      const wcFilter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
      wcFilter.setAttribute('id', 'wc-edge');
      wcFilter.setAttribute('x', '-5%'); wcFilter.setAttribute('y', '-5%');
      wcFilter.setAttribute('width', '110%'); wcFilter.setAttribute('height', '110%');
      const turb = document.createElementNS('http://www.w3.org/2000/svg', 'feTurbulence');
      turb.setAttribute('type', 'fractalNoise');
      turb.setAttribute('baseFrequency', '0.02 0.04');
      turb.setAttribute('numOctaves', '2');
      turb.setAttribute('seed', '3');
      turb.setAttribute('result', 'noise');
      wcFilter.appendChild(turb);
      const disp = document.createElementNS('http://www.w3.org/2000/svg', 'feDisplacementMap');
      disp.setAttribute('in', 'SourceGraphic');
      disp.setAttribute('in2', 'noise');
      disp.setAttribute('scale', '1.0');
      disp.setAttribute('xChannelSelector', 'R');
      disp.setAttribute('yChannelSelector', 'G');
      wcFilter.appendChild(disp);
      defs.appendChild(wcFilter);
      const texMap = {};
      const texPromises = [];

      // 创建纹理 pattern（异步获取图片真实尺寸）
      if (data.textures) {
        Object.keys(data.textures).forEach(name => {
          const imgData = data.textures[name];
          if (!imgData) return;             // 纹理可为空（设为无纹理）
          const pat = document.createElementNS('http://www.w3.org/2000/svg', 'pattern');
          const patId = 'tex-' + name.replace(/[^\w]/g, '_');
          pat.setAttribute('id', patId);
          pat.setAttribute('patternUnits', 'userSpaceOnUse');
          // 默认尺寸，加载后更新
          pat.setAttribute('width', data.width || 800);
          pat.setAttribute('height', '600');
          const trans = data.textureTrans && data.textureTrans[name];
          if (trans) {
            const sx = trans.s || 1;
            const tx = trans.x || 0;
            const ty = trans.y || 0;
            pat.setAttribute('patternTransform', `translate(${tx},${ty}) scale(${sx})`);
          }
          const img = document.createElementNS('http://www.w3.org/2000/svg', 'image');
          img.setAttribute('href', imgData);
          img.setAttribute('width', data.width || 800);
          img.setAttribute('height', '600');
          pat.appendChild(img);
          defs.appendChild(pat);
          texMap[name] = patId;

          // 异步获取真实尺寸并更新
          const p = new Promise(resolve => {
            const im = new Image();
            im.onload = () => {
              pat.setAttribute('width', im.naturalWidth);
              pat.setAttribute('height', im.naturalHeight);
              img.setAttribute('width', im.naturalWidth);
              img.setAttribute('height', im.naturalHeight);
              resolve();
            };
            im.onerror = resolve;
            im.src = imgData;
          });
          texPromises.push(p);
        });
      }
      svg.appendChild(defs);

      const NS = 'http://www.w3.org/2000/svg';
      // 木窗框明暗两色
      const LIGHT_WOOD = '#c2b5a5';  // 明部：受光正面
      const DARK_WOOD  = '#8f7f6f';  // 暗部：侧面厚度
      const WALL_COLOR = '#e8e0d0';  // 玻璃格填充色（接近墙面米白）

      // 用 pts 计算 bbox，判断正面(明)还是侧面(暗)
      const judgeShade = (p) => {
        if (!p.pts || p.pts.length < 2) return 'light';
        let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
        p.pts.forEach(pt => {
          if (pt[0] < minX) minX = pt[0];
          if (pt[0] > maxX) maxX = pt[0];
          if (pt[1] < minY) minY = pt[1];
          if (pt[1] > maxY) maxY = pt[1];
        });
        const w = maxX - minX, h = maxY - minY;
        // 横条（宽扁）或大面积 → 正面明部；窄竖条/小面积 → 侧面暗部
        if (h < 45 && w > 200) return 'light';
        if (w * h > 25000) return 'light';
        return 'dark';
      };

      const mkPath = (p, fill) => {
        const g = document.createElementNS(NS, 'g');
        // 纯色填充：原始粉色才做明暗分配，手动改的颜色直接用
        const ORIGINAL_PINKS = ['#e0b0a0', '#efc4b5', '#f0d4d8', '#e8c4c0', '#ecc8c4'];
        let mappedFill = fill;
        if (typeof fill === 'string' && fill !== 'none' && !fill.startsWith('url(')) {
          if (ORIGINAL_PINKS.includes(fill.toLowerCase())) {
            mappedFill = judgeShade(p) === 'light' ? LIGHT_WOOD : DARK_WOOD;
          }
          // 否则直接用用户手动设置的颜色
        } else if (p._shade === 'dark') {
          mappedFill = DARK_WOOD;
        }
        // 填充层：无描边，保持规整
        if (mappedFill && mappedFill !== 'none') {
          const f = document.createElementNS(NS, 'path');
          f.setAttribute('d', p.d);
          f.setAttribute('fill', mappedFill);
          f.setAttribute('fill-rule', 'evenodd');
          g.appendChild(f);
        }
        const sw = p.sw || data.sw || 2.5;
        // 水彩外晕层：粗、半透明、模糊
        const halo = document.createElementNS(NS, 'path');
        halo.setAttribute('d', p.d);
        halo.setAttribute('fill', 'none');
        halo.setAttribute('stroke', 'rgba(80,58,42,0.28)');
        halo.setAttribute('stroke-width', sw + 1.5);
        halo.setAttribute('stroke-linejoin', 'round');
        halo.setAttribute('stroke-linecap', 'round');
        halo.setAttribute('filter', 'url(#wc-halo)');
        g.appendChild(halo);
        // 水彩实色层：细、实色、轻微毛边
        const core = document.createElementNS(NS, 'path');
        core.setAttribute('d', p.d);
        core.setAttribute('fill', 'none');
        core.setAttribute('stroke', 'rgba(80,58,42,0.72)');
        core.setAttribute('stroke-width', sw);
        core.setAttribute('stroke-linejoin', 'round');
        core.setAttribute('stroke-linecap', 'round');
        core.setAttribute('filter', 'url(#wc-edge)');
        g.appendChild(core);
        return g;
      };

      // 直接渲染所有 path，不用 mask：
      // 1. 先渲染纯色窗框
      // 2. 再渲染玻璃格（null fill），用墙色覆盖在窗框上
      // 3. 最后渲染纹理（中间大玻璃窗）
      data.paths.forEach(p => {
        if (typeof p.fill === 'string') {
          svg.appendChild(mkPath(p, p.fill));
        }
      });
      // 玻璃格：只有大面积 null（面积>3000）才用墙色填充；
      // 小面积 null 是窗框细节/噪点，忽略不渲染，让窗框填充透出来
      data.paths.forEach(p => {
        if (p.fill === null || p.fill === undefined) {
          if (!p.pts || p.pts.length < 3) return;
          let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
          p.pts.forEach(pt => {
            if (pt[0] < minX) minX = pt[0];
            if (pt[0] > maxX) maxX = pt[0];
            if (pt[1] < minY) minY = pt[1];
            if (pt[1] > maxY) maxY = pt[1];
          });
          const area = (maxX - minX) * (maxY - minY);
          if (area < 3000) return; // 小面积忽略
          const glass = document.createElementNS(NS, 'path');
          glass.setAttribute('d', p.d);
          glass.setAttribute('fill', WALL_COLOR);
          glass.setAttribute('fill-rule', 'evenodd');
          svg.appendChild(glass);
        }
      });
      // 纹理填充（中间大玻璃窗）
      data.paths.forEach(p => {
        if (p.fill && p.fill.t === 'tex') {
          const patId = texMap[p.fill.name];
          svg.appendChild(mkPath(p, patId ? `url(#${patId})` : 'none'));
        }
      });

      container.innerHTML = '';
      container.appendChild(svg);
      if (debug) debug.textContent += ' window:OK';
      return Promise.all(texPromises);
    } catch(e) {
      if (debug) debug.textContent += ' window:ERR(' + e.message + ')';
      return Promise.reject(e);
    }
  }
  // 降级：fetch
  return fetch(url)
    .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
    .then(data => {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('viewBox', `0 0 ${data.width} ${data.height}`);
      svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
      svg.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;';
      const stroke = data.stroke || '#2f3640';
      data.paths.forEach(p => {
        const el = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        el.setAttribute('d', p.d);
        el.setAttribute('fill', typeof p.fill === 'string' ? p.fill : 'none');
        el.setAttribute('fill-rule', 'evenodd');
        el.setAttribute('stroke', stroke);
        el.setAttribute('stroke-width', p.sw || data.sw || 2);
        el.setAttribute('stroke-linejoin', 'round');
        el.setAttribute('stroke-linecap', 'round');
        svg.appendChild(el);
      });
      container.innerHTML = '';
      container.appendChild(svg);
      container.dataset.rendered = '1';
      if (debug) debug.textContent += ' window:OK(fetch)';
    })
    .catch(e => {
      console.warn('线稿加载失败:', e);
      if (debug) debug.textContent += ' window:ERR(' + e.message + ')';
    });
}

// ============================================================
//  各场景入场动画初始化
// ============================================================
const sceneInit = [];

// 读 assets/scenes.json 取指定分镜元素的 tex（分镜级纹理），失败/无则返回 null（file:// 下忽略）
async function loadShotTex(sceneName, shotName, objName) {
  try {
    const r = await fetch('assets/scenes.json', { cache: 'no-store' });
    if (!r.ok) return null;
    const d = await r.json();
    const sc = (d.scenes || []).find(s => s.name === sceneName);
    const sh = sc && (sc.shots || []).find(s => s.name === shotName);
    const o = sh && (sh.objects || []).find(x => x.name === objName);
    return (o && o.tex) ? o.tex : null;
  } catch (e) { return null; }
}

// ---- 1.1 开头场景 ----
sceneInit[0] = function() {
  const scene3d = document.querySelector('#scene-1-1 .scene-3d');
  const winLayer = document.getElementById('window-layer');
  const desk = document.getElementById('desk-plane');
  const book = document.getElementById('book-on-desk');
  const wall = document.querySelector('#scene-1-1 .wall-bg');
  const light = document.getElementById('light-sweep');
  const hint = document.getElementById('hint-1');
  const volBtn = document.getElementById('volume-toggle');

  // 加载窗.json 线稿（带分镜级纹理覆盖：从 assets/scenes.json 读 1.1 窗元素的 tex；读不到则用线稿默认）
  if (!winLayer.dataset.loaded) {
    loadShotTex('第一幕-启封', '01 开头场景', '窗').then(tex => {
      renderLineArtJSON('assets/第一幕-启封/窗.json', winLayer, null, tex)
        .catch(err => console.warn('窗线稿加载失败:', err));
    });
    winLayer.dataset.loaded = '1';
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduceMotion) {
    gsap.set(scene3d, { '--eye-rx': 1, '--eye-ry': 1 });
    gsap.set([winLayer, desk, book, wall], { opacity: 1, filter: 'blur(0px)' });
    gsap.to(hint, { opacity: 1, delay: 0.5 });
    bindScene1Click();
    return;
  }

  const tl = gsap.timeline();

  // 初始：眼睛几乎闭合（一条线）+ 重度模糊
  gsap.set(scene3d, { '--eye-rx': 0.7, '--eye-ry': 0.03 });
  gsap.set([winLayer, desk], { opacity: 0, filter: 'blur(20px)' });
  gsap.set(wall, { filter: 'blur(30px)', opacity: 0.6 });
  gsap.set(book, { opacity: 0.15 });
  gsap.set(volBtn, { opacity: 0 });

  // 第一次慢慢张开：细线 → 半睁
  tl.to(scene3d, { '--eye-rx': 0.85, '--eye-ry': 0.4, duration: 0.9, ease: 'power2.out' })
    .to(winLayer, { opacity: 0.5, filter: 'blur(14px)', duration: 0.9 }, '<')
    .to(desk, { opacity: 0.45, filter: 'blur(14px)', duration: 0.9 }, '<')
    .to(wall, { filter: 'blur(20px)', opacity: 0.75, duration: 0.9 }, '<')
    .to(book, { opacity: 0.65, duration: 0.9 }, '<')
    .to(volBtn, { opacity: 0.7, duration: 0.9 }, '<')

  // 半睁停留
    .to({}, { duration: 0.2 })

  // 快速闭上（带弹性）
    .to(scene3d, { '--eye-rx': 0.7, '--eye-ry': 0.02, duration: 0.12, ease: 'power2.in' })
    .to([winLayer, desk], { filter: 'blur(18px)', duration: 0.12 }, '<')
    .to(wall, { filter: 'blur(28px)', opacity: 0.65, duration: 0.12 }, '<')
  // 弹性回弹
    .to(scene3d, { '--eye-rx': 0.75, '--eye-ry': 0.08, duration: 0.05 })
    .to(scene3d, { '--eye-rx': 0.7, '--eye-ry': 0.02, duration: 0.08 })

  // 闭眼保持
    .to({}, { duration: 0.4 })

  // 第二次慢慢张开：全睁（rx=ry=1 时 ellipse 铺满全屏）
    .to(scene3d, { '--eye-rx': 1, '--eye-ry': 1, duration: 1.1, ease: 'power2.out' })
    .to(winLayer, { opacity: 1, filter: 'blur(2px)', duration: 1.0 }, '<')
    .to(desk, { opacity: 1, filter: 'blur(2px)', duration: 1.0 }, '<')
    .to(wall, { filter: 'blur(0px)', opacity: 1, duration: 1.0 }, '<')
    .to(book, { opacity: 1, duration: 1.0 }, '<')
    .to(volBtn, { opacity: 1, duration: 1.0 }, '<')

  // 完全展开后清掉残余 blur
    .to([winLayer, desk], { filter: 'blur(0px)', duration: 0.3 })

  // 光扫过
    .to(light, { opacity: 1, x: '100%', duration: 0.6, ease: 'power1.inOut' }, '+=0.3')
    .to(light, { opacity: 0, duration: 0.2 }, '>-0.1')

  // 提示
    .to(hint, { opacity: 1, duration: 0.4 }, '+=0.2');

  bindScene1Click();
};

function bindScene1Click() {
  const scene = document.getElementById('scene-1-1');
  const book = document.getElementById('book-on-desk');
  const hint = document.getElementById('hint-1');
  let opened = false;
  let entering = false;
  let openTimer = null;

  // 进入 1.2：直接交叉淡化（goToScene 同步淡出 1.1、淡入 1.2，重叠无空档）
  // 不再先单独淡出 1.1，避免黑屏/卡顿
  function enterAct2() {
    if (entering) return;
    entering = true;
    gsap.to(hint, { opacity: 0, duration: 0.2 });
    goToScene(1);
  }

  function openBook() {
    if (opened) return;
    opened = true;
    gsap.to(hint, { opacity: 0, duration: 0.2 });
    book.classList.add('open');
    // 翻开后停留片刻自动进入 1.2，不再要求二次点击已翻开的画册
    openTimer = setTimeout(() => {
      openTimer = null;
      // 若用户已用数字键跳走，则不抢跳场景
      if (!scene.classList.contains('active')) return;
      enterAct2();
    }, 2000);
  }

  // 翻开前点击 = 翻开；翻开后点击 = 跳过停留直接进入 1.2
  function tryOpenOrSkip() {
    if (!opened) {
      openBook();
    } else if (openTimer) {
      clearTimeout(openTimer);
      openTimer = null;
      enterAct2();
    }
  }

  book.addEventListener('click', (e) => {
    e.stopPropagation();
    tryOpenOrSkip();
  });

  scene.addEventListener('click', tryOpenOrSkip);
}

// ---- 1.2 画册翻开（批注 02） ----
// 背景已在前一幕淡出（enterAct2）；本函数只负责批注 02 元素淡入：
// 画册平铺浮现 → 完整信封浮现（淡蓝边缘光晕由 CSS 缓慢呼吸）→ 自动推进到 1.3 信封特写（本幕无需点击）
// 注：这一幕不需要独立火漆印（assets/第一幕-启封/完整信封.png 已自带蜡封），按用户要求不显示 #wax-1
sceneInit[1] = function() {
  const book = document.getElementById('book-flat');
  const env  = document.getElementById('envelope-close');
  const wax  = document.getElementById('wax-1');    // 仍取引用，但不淡入
  gsap.set(wax, { opacity: 0 });

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 初始：批注 02 元素隐藏。居中由 xPercent/yPercent 保持，避免 GSAP 覆盖 CSS 的 translate(-50%,-50%)
  // env 重置 scale 1.0（之前 0.9→1.0 会让用户感觉"信封在动/跳位"——三幕必须同 scale 才像同一个信封）
  gsap.set(book, { xPercent: -50, yPercent: -50, y: 18, scale: 0.98, opacity: 0 });
  // 信封直接 1.0 进场（与 1.3/1.4 同尺寸），只做淡入，杜绝"生长感"造成的视觉错位
  gsap.set(env,  { xPercent: -50, yPercent: -50, y: 0, scale: 1, opacity: 0 });

  // 拆信节奏收敛：1.2 只做展示，停留后自动推近信封特写；
  // 唯一一次"拆信"点击留给 1.3 的火漆
  function autoEnter() {
    // 若用户已用数字键跳走，则不抢跳场景
    if (!document.getElementById('scene-1-2').classList.contains('active')) return;
    // 不单独淡出书本：由 goToScene 统一交叉淡化整幕，避免书先消失后旧背景裸露造成闪烁。
    // 信封保持 1.0 不动（与 1.3 严格同 scale/同位置），场景切换时自然承接。
    gsap.to({}, { duration: 0.4, onComplete: () => goToScene(2, { solidReveal: true }) });
  }

  if (reduceMotion) {
    gsap.set([book, env], { opacity: 1, x: 0, y: 0, scale: 1, xPercent: -50, yPercent: -50 });
    setTimeout(autoEnter, 1500);
    initEnvelopeDrag(env);
    return;
  }

  gsap.timeline()
  // 1. 画册平铺浮现
    .to(book, { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power2.out' })
  // 2. 信封浮现（淡蓝边缘光芒由 CSS 持续呼吸，不在此处理）
    .to(env, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '+=0.15')
  // 3. 蜡封已画在完整信封.png 上，02 不需要独立火漆
  // 4. 停留片刻让观众看清信封，再自动推近（1.6s：不赶、也不拖）
    .to({}, { duration: 1.6 })
    .call(autoEnter);

  initEnvelopeDrag(env);
};

// ---- 信封手动拖拽调试（批注：用户要能自己拖信封到正确位置） ----
// 按 D 键或 URL 加 ?drag=1 开启；拖动时屏幕底部实时显示 left/top 百分比，
// 松手自动存 localStorage（刷新仍保持）。拖到满意后把两个数告诉我即可固化进 CSS。
function initEnvelopeDrag(env) {
  if (window.__envDragReady) return;      // 只绑定一次
  window.__envDragReady = true;

  const stage = document.getElementById('stage');
  // 坐标浮标
  let coord = document.getElementById('env-coord');
  if (!coord) { coord = document.createElement('div'); coord.id = 'env-coord'; coord.className = 'env-coord'; document.body.appendChild(coord); }
  // 中轴参考线（挂在 stage 内，与信封同基准）
  let guide = document.getElementById('env-guide');
  if (!guide) { guide = document.createElement('div'); guide.id = 'env-guide'; guide.className = 'env-guide'; stage.appendChild(guide); }

  let debug = new URLSearchParams(location.search).has('drag');
  const DEF = { l: 50, t: 50 };       // 与 1.3/1.4 信封一致（屏幕正中心）

  function readPos() {
    const l = parseFloat(env.style.left);
    const t = parseFloat(env.style.top);
    return { l: isNaN(l) ? DEF.l : l, t: isNaN(t) ? DEF.t : t };
  }
  function applyPos(l, t) { env.style.left = l + '%'; env.style.top = t + '%'; }
  function showCoord() {
    const p = readPos();
    coord.textContent = '信封  left: ' + p.l.toFixed(2) + '%   top: ' + p.t.toFixed(2) + '%   （拖到满意后把这两个数告诉我即可固化）';
  }
  function setDebug(on) {
    debug = on;
    coord.style.display = on ? 'block' : 'none';
    guide.style.display = on ? 'block' : 'none';
    env.style.cursor = on ? 'grab' : 'pointer';
    if (on) showCoord();
  }

  // 应用已保存位置（普通模式也生效）；无保存时把 CSS 默认同步成 inline，避免首拖跳变
  const saved = localStorage.getItem('env_pos');
  if (saved) { try { const o = JSON.parse(saved); applyPos(o.l, o.t); } catch (e) {} }
  else { applyPos(DEF.l, DEF.t); }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'd' || e.key === 'D') {
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
      setDebug(!debug);
    }
  });

  let dragging = false, sx = 0, sy = 0, sl = 0, st = 0;
  env.addEventListener('pointerdown', (e) => {
    if (!debug) return;
    dragging = true; env.style.cursor = 'grabbing';
    try { env.setPointerCapture(e.pointerId); } catch (_) {}
    const op = env.offsetParent || stage;
    const r = op.getBoundingClientRect();
    const p = readPos(); sl = p.l; st = p.t; sx = e.clientX; sy = e.clientY;
    e.preventDefault();
  });
  env.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const op = env.offsetParent || stage;
    const r = op.getBoundingClientRect();
    const dxPct = (e.clientX - sx) / r.width * 100;
    const dyPct = (e.clientY - sy) / r.height * 100;
    const nl = Math.max(0, Math.min(100, sl + dxPct));
    const nt = Math.max(0, Math.min(100, st + dyPct));
    applyPos(nl, nt); showCoord();
  });
  function endDrag() {
    if (!dragging) return;
    dragging = false; env.style.cursor = 'grab';
    const p = readPos();
    localStorage.setItem('env_pos', JSON.stringify({ l: +p.l.toFixed(3), t: +p.t.toFixed(3) }));
    showCoord();
  }
  env.addEventListener('pointerup', endDrag);
  env.addEventListener('pointercancel', endDrag);

  if (debug) setDebug(true);
}

// ===== 全元素调试（E 键 / ?edit=1）：拖拽移动 / 四角等比缩放 / 圆点旋转 =====
// 点击选中元素 → 拖本体=移动；拖四角=等比缩放；拖上方圆点=旋转；面板可精确输入。
// 「复制本元素 / 复制全部」会生成 CSS 定位代码，把代码发给我即可固化进页面。
// 拖过的元素位置自动保存（localStorage dbg_pos_*），刷新后普通模式也保持 left/top。
// 1.1 为 3D 透视场景（用户保留），不参与调试。
const DBG_SELECTOR = '#book-flat,#envelope-close,#envelope-large,#envelope-img,#wax-crack,#card-paper,#postcard,#map-wrap,#map-img,#star-xj,#star-gd';
const DBG_CENTERED = new Set(DBG_SELECTOR.split(',').map(s => s.slice(1)));

function initElementDebug() {
  if (window.__elDebugReady) return;
  window.__elDebugReady = true;

  const stage = document.getElementById('stage');
  let debug = new URLSearchParams(location.search).has('edit') || new URLSearchParams(location.search).has('drag');
  let sel = null, base = null, mode = null, drag = null;
  let compareDir = 0;                    // 叠幕对比：0=关 -1=上一幕 +1=下一幕
  window.__compareDir = compareDir;

  function mk(tag, cls, txt) {
    const el = document.createElement(tag);
    el.className = cls; if (txt) el.textContent = txt;
    return el;
  }
  // UI
  const hint = mk('div', 'dbg-hint', '拖动=移动 ｜ 拖四角=等比缩放 ｜ 拖上方圆点=旋转 ｜ 面板可精确输入 ｜ E 退出');
  const box = mk('div', 'dbg-box', '');
  const panel = mk('div', 'dbg-panel', '');
  const handles = {};
  ['nw','ne','sw','se'].forEach(k => { handles[k] = mk('div', 'dbg-handle corner', ''); });
  handles.rot = mk('div', 'dbg-handle rot', '⟳');
  document.body.append(hint, box, panel);
  Object.values(handles).forEach(h => document.body.appendChild(h));
  panel.innerHTML =
    '<div class="dbg-name" id="dbg-name">未选中元素</div>' +
    '<div class="dbg-row"><label>left</label><input id="dbg-l" type="number" step="0.1"><span class="unit">%</span></div>' +
    '<div class="dbg-row"><label>top</label><input id="dbg-t" type="number" step="0.1"><span class="unit">%</span></div>' +
    '<div class="dbg-row"><label>宽</label><input id="dbg-w" type="number" step="1"><span class="unit">px</span></div>' +
    '<div class="dbg-row"><label>高</label><input id="dbg-h" type="number" step="1"><span class="unit">px</span></div>' +
    '<div class="dbg-row"><label>旋转</label><input id="dbg-r" type="number" step="1"><span class="unit">°</span></div>' +
    '<div class="dbg-btns"><button id="dbg-copy1">复制本元素</button><button id="dbg-copyAll">复制全部</button></div>' +
    '<div class="dbg-btns"><button id="dbg-reset">重置本元素</button></div>' +
    '<div class="dbg-btns" style="margin-top:6px;border-top:1px dashed rgba(255,150,190,0.4);padding-top:6px"><button id="dbg-prev">◀ 叠上一幕</button><button id="dbg-next">叠下一幕 ▶</button></div>' +
    '<div class="dbg-copied" id="dbg-copied"></div>';
  const $ = id => panel.querySelector('#' + id);
  const inpL = $('dbg-l'), inpT = $('dbg-t'), inpW = $('dbg-w'), inpH = $('dbg-h'), inpR = $('dbg-r');
  const nameEl = $('dbg-name'), copiedEl = $('dbg-copied');

  // 读取元素当前旋转角（computed matrix → 度）
  function parseDeg(el) {
    const t = getComputedStyle(el).transform;
    if (!t || t === 'none') return 0;
    const m = t.match(/matrix\(([^)]+)\)/);
    if (!m) return 0;
    const v = m[1].split(',').map(Number);
    return Math.atan2(v[1], v[0]) * 180 / Math.PI;
  }
  // 读取 left/top 百分比（相对 offsetParent）
  function readPct(el) {
    const l = parseFloat(el.style.left), t = parseFloat(el.style.top);
    return { l: isNaN(l) ? 50 : l, t: isNaN(t) ? 50 : t };
  }
  // 应用 transform（旋转等），居中元素保持 translate(-50%,-50%) 语义
  function dbgTransform(el, props) {
    if (DBG_CENTERED.has(el.id)) { props.xPercent = -50; props.yPercent = -50; }
    gsap.set(el, props);
  }
  function save(el) {
    const p = readPct(el);
    try {
      localStorage.setItem('dbg_pos_' + el.id, JSON.stringify({
        l: +p.l.toFixed(3), t: +p.t.toFixed(3),
        w: el.offsetWidth, h: el.offsetHeight, r: +parseDeg(el).toFixed(2)
      }));
    } catch (e) {}
  }
  function syncBox() {
    if (!sel) return;
    const er = sel.getBoundingClientRect();
    box.style.left = er.left + 'px';
    box.style.top = er.top + 'px';
    box.style.width = er.width + 'px';
    box.style.height = er.height + 'px';
    const H = 12;
    const pos = {
      nw: [er.left - H / 2, er.top - H / 2],
      ne: [er.left + er.width - H / 2, er.top - H / 2],
      sw: [er.left - H / 2, er.top + er.height - H / 2],
      se: [er.left + er.width - H / 2, er.top + er.height - H / 2]
    };
    Object.keys(pos).forEach(k => {
      handles[k].style.left = pos[k][0] + 'px';
      handles[k].style.top = pos[k][1] + 'px';
    });
    handles.rot.style.left = (er.left + er.width / 2 - 8) + 'px';
    handles.rot.style.top = (er.top - 26) + 'px';
  }
  function fillPanel() {
    if (!sel) return;
    const p = readPct(sel);
    inpL.value = p.l.toFixed(2);
    inpT.value = p.t.toFixed(2);
    inpW.value = Math.round(sel.offsetWidth);
    inpH.value = Math.round(sel.offsetHeight);
    inpR.value = parseDeg(sel).toFixed(1);
    nameEl.textContent = '#' + sel.id;
  }
  function select(el) {
    sel = el;
    box.style.display = 'block';
    Object.values(handles).forEach(h => h.style.display = 'block');
    panel.style.display = 'block';
    syncBox(); fillPanel(); copiedEl.textContent = '';
  }
  function deselect() {
    sel = null; base = null; mode = null;
    box.style.display = 'none';
    Object.values(handles).forEach(h => h.style.display = 'none');
    panel.style.display = 'none';
  }
  function setDebug(on) {
    debug = on;
    hint.style.display = on ? 'block' : 'none';
    if (!on) { deselect(); setCompare(0); }
  }
  // 叠幕对比：半透明叠显示上一幕/下一幕（再按一次关闭），方便两幕对齐位置
  function setCompare(dir) {
    compareDir = dir;
    window.__compareDir = dir;
    document.querySelectorAll('.dbg-compare').forEach(s => s.classList.remove('dbg-compare'));
    if (!dir) { copiedEl.textContent = ''; return; }
    const idx = currentScene + dir;
    if (idx < 0 || idx >= sceneOrder.length) {
      copiedEl.textContent = (dir < 0 ? '已经是第一幕了' : '已经是最后一幕了');
      compareDir = 0; window.__compareDir = 0;
      return;
    }
    const s = document.getElementById(sceneOrder[idx]);
    if (s) {
      s.classList.add('dbg-compare');
      copiedEl.textContent = '半透明叠加：' + sceneOrder[idx] + '（' + (dir < 0 ? '上一幕' : '下一幕') + '）—— 再按一次或点按钮关闭';
    }
  }

  // 应用已保存的位置（普通模式也生效 left/top；宽高/旋转请复制代码给我固化）
  function applySaved() {
    document.querySelectorAll(DBG_SELECTOR).forEach(el => {
      const s = localStorage.getItem('dbg_pos_' + el.id);
      if (!s) return;
      try {
        const o = JSON.parse(s);
        if (typeof o.l === 'number') el.style.left = o.l + '%';
        if (typeof o.t === 'number') el.style.top = o.t + '%';
      } catch (e) {}
    });
  }
  applySaved();

  // 点击选中（capture 阶段，拦截场景自身的点击交互）
  document.addEventListener('click', (e) => {
    if (!debug) return;
    const el = e.target.closest ? e.target.closest(DBG_SELECTOR) : null;
    if (el) {
      e.stopPropagation();
      e.preventDefault();
      select(el);
    } else if (!e.target.closest('.dbg-box') && !e.target.closest('.dbg-handle') && !e.target.closest('.dbg-panel')) {
      deselect();
    }
  }, true);

  // 键盘开关（输入框聚焦时忽略）：E=调试开关，[ / ]=叠上一幕/下一幕
  window.addEventListener('keydown', (e) => {
    if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
    if (e.key === 'e' || e.key === 'E') { setDebug(!debug); return; }
    if (!debug) return;
    if (e.key === '[') setCompare(compareDir === -1 ? 0 : -1);
    else if (e.key === ']') setCompare(compareDir === 1 ? 0 : 1);
  });

  // ---- 拖拽交互（box 本体=移动，四角=缩放，上方圆点=旋转） ----
  function onPointerDown(e, m) {
    if (!debug || !sel) return;
    mode = m;
    const er = sel.getBoundingClientRect();
    base = {
      p: readPct(sel), w: er.width, h: er.height,
      rot: parseDeg(sel),
      cx: er.left + er.width / 2, cy: er.top + er.height / 2,
      d0: Math.hypot(er.width, er.height)
    };
    drag = { x: e.clientX, y: e.clientY };
    try { e.target.setPointerCapture(e.pointerId); } catch (_) {}
    e.preventDefault(); e.stopPropagation();
  }
  function onPointerMove(e) {
    if (!mode || !sel || !base || !drag) return;
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    const op = sel.offsetParent || stage;
    const r = op.getBoundingClientRect();
    if (mode === 'move') {
      const nl = Math.max(0, Math.min(100, base.p.l + dx / r.width * 100));
      const nt = Math.max(0, Math.min(100, base.p.t + dy / r.height * 100));
      sel.style.left = nl + '%';
      sel.style.top = nt + '%';
    } else if (mode === 'scale') {
      const dist = Math.hypot(e.clientX - base.cx, e.clientY - base.cy);
      const f = Math.max(0.05, dist / (base.d0 / 2));
      sel.style.width = Math.max(12, base.w * f) + 'px';
      sel.style.height = Math.max(12, base.h * f) + 'px';
    } else if (mode === 'rotate') {
      const ang = Math.atan2(e.clientY - base.cy, e.clientX - base.cx) * 180 / Math.PI;
      const start = Math.atan2(drag.y - base.cy, drag.x - base.cx) * 180 / Math.PI;
      dbgTransform(sel, { rotation: base.rot + (ang - start) });
    }
    syncBox(); fillPanel();
  }
  function onPointerUp() {
    if (!mode || !sel) return;
    mode = null; base = null; drag = null;
    save(sel); fillPanel();
  }
  box.addEventListener('pointerdown', (e) => onPointerDown(e, 'move'));
  box.addEventListener('pointermove', onPointerMove);
  box.addEventListener('pointerup', onPointerUp);
  box.addEventListener('pointercancel', onPointerUp);
  ['nw','ne','sw','se'].forEach(k => {
    handles[k].addEventListener('pointerdown', (e) => onPointerDown(e, 'scale'));
    handles[k].addEventListener('pointermove', onPointerMove);
    handles[k].addEventListener('pointerup', onPointerUp);
    handles[k].addEventListener('pointercancel', onPointerUp);
  });
  handles.rot.addEventListener('pointerdown', (e) => onPointerDown(e, 'rotate'));
  handles.rot.addEventListener('pointermove', onPointerMove);
  handles.rot.addEventListener('pointerup', onPointerUp);
  handles.rot.addEventListener('pointercancel', onPointerUp);

  // ---- 面板精确输入 ----
  function commitInput() {
    if (!sel) return;
    const l = parseFloat(inpL.value), t = parseFloat(inpT.value);
    const w = parseFloat(inpW.value), h = parseFloat(inpH.value), r = parseFloat(inpR.value);
    if (!isNaN(l)) sel.style.left = l + '%';
    if (!isNaN(t)) sel.style.top = t + '%';
    if (!isNaN(w) && w > 0) sel.style.width = w + 'px';
    if (!isNaN(h) && h > 0) sel.style.height = h + 'px';
    if (!isNaN(r)) dbgTransform(sel, { rotation: r });
    save(sel); syncBox(); fillPanel();
  }
  [inpL, inpT, inpW, inpH, inpR].forEach(inp => {
    inp.addEventListener('change', commitInput);
  });

  // ---- 复制 / 重置 ----
  function cssFor(el) {
    const p = readPct(el);
    const r = parseDeg(el);
    return '/* ' + el.id + ' */\nleft: ' + p.l.toFixed(2) + '%; top: ' + p.t.toFixed(2) + '%;\nwidth: ' + Math.round(el.offsetWidth) + 'px; height: ' + Math.round(el.offsetHeight) + 'px;\ntransform: translate(-50%,-50%) rotate(' + r.toFixed(1) + 'deg);';
  }
  function fallbackCopy(txt, done) {
    const ta = document.createElement('textarea');
    ta.value = txt; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); done(); } catch (e) {}
    document.body.removeChild(ta);
  }
  function copyText(txt) {
    copiedEl.textContent = '…';
    const done = () => { copiedEl.textContent = '已复制 ✓ 把代码发我即可固化'; };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(txt).then(done, () => fallbackCopy(txt, done));
    } else { fallbackCopy(txt, done); }
  }
  $('dbg-copy1').addEventListener('click', () => { if (sel) copyText(cssFor(sel)); });
  $('dbg-copyAll').addEventListener('click', () => {
    let out = '';
    document.querySelectorAll(DBG_SELECTOR).forEach(el => {
      if (localStorage.getItem('dbg_pos_' + el.id)) out += cssFor(el) + '\n\n';
    });
    if (out) copyText(out.trim()); else copiedEl.textContent = '还没有拖动过的元素';
  });
  $('dbg-reset').addEventListener('click', () => {
    if (!sel) return;
    localStorage.removeItem('dbg_pos_' + sel.id);
    sel.removeAttribute('style');
    applySaved();
    syncBox(); fillPanel();
    copiedEl.textContent = '已重置为代码里的默认位置';
  });
  $('dbg-prev').addEventListener('click', () => setCompare(compareDir === -1 ? 0 : -1));
  $('dbg-next').addEventListener('click', () => setCompare(compareDir === 1 ? 0 : 1));

  if (debug) setDebug(true);
}

// 一次性清理历史调试拖拽残留（env_pos / dbg_pos_*）：旧坐标会覆盖本次固化的位置，造成错位
(function () {
  try {
    if (!localStorage.getItem('pos_cleanup_v1')) {
      localStorage.removeItem('env_pos');
      DBG_SELECTOR.split(',').forEach(s => localStorage.removeItem('dbg_pos_' + s.slice(1)));
      localStorage.setItem('pos_cleanup_v1', '1');
    }
  } catch (e) {}
})();

initElementDebug();

// ---- 1.3 信封特写（原地放大，承接 1.2） ----
sceneInit[2] = function() {
  const envLarge = document.getElementById('envelope-large');
  const hint = document.getElementById('hint-3');

  // 信封与 1.2 的信封完全同位置同尺寸：直接显示，不再单独淡入。
  // 否则「场景交叉淡化」×「信封自身淡入」= 双重淡化，信封会一暗一亮闪一下。
  gsap.set(envLarge, { xPercent: -50, yPercent: -50, opacity: 1, scale: 1, y: 0 });
  gsap.fromTo(hint, { opacity: 0 }, { opacity: 1, duration: 0.4, delay: 0.3, ease: 'power2.out' });

  // 点击信封上的火漆（蜡封已画在完整信封.png 上）→ 1.4 输密码
  envLarge.onclick = () => {
    gsap.to(hint, { opacity: 0, duration: 0.2 });
    goToScene(3);
  };
};

// ---- 1.4 拆信与密码拨盘（分镜v1 1.4 + 批注 02 烧毁覆盖） ----
// 交互：1.3 点击火漆 → 进入本幕，直接弹出密码（不重复点火漆）；火漆在密码正确前保持完整，
// 输对后才贴位轻裂 → 开信。输错走「一摇二毁」。
sceneInit[3] = function() {
 const envImg = document.getElementById('envelope-img');
  const envImgAlt = document.getElementById('envelope-img-alt');
  const frontCover = document.getElementById('envelope-front');
  const crack = document.getElementById('wax-crack');
  const waxSeal = document.getElementById('wax-14');
  const frost = document.getElementById('frost-mask');
  const card = document.getElementById('card-paper');
  const burn = document.getElementById('burn-14');
  const hint = document.getElementById('hint-4');
  const paperLock = document.getElementById('paper-lock');
  const lockBody = document.getElementById('lock-body');
  const lockShackle = document.getElementById('lock-shackle');
  const burnScreen = document.getElementById('burn-screen');
  const burnQuote = document.getElementById('burn-quote');
  const dial = document.getElementById('dial');
  const dialTicks = document.getElementById('dial-ticks');
  const dialCurrent = document.getElementById('dial-current');
  const progress = Array.from(document.querySelectorAll('#combo-progress .combo-step'));

  const CORRECT_PWD = [0, 9, 2, 8];
  const TICK_COUNT = 40;
  const DIGIT_SPAN = 36;
  const motion = { rotation: 0 };
  let phase = 'password';
  let enteredDigits = [];
  let wrongCount = 0;
  let dragging = false;
  let pointerId = null;
  let lastPointerAngle = 0;
  let lastMoveTime = 0;
  let moveSamples = [];
  let lastShownDigit = null;
  let audioCtx = null;

  // 40 个刻度，每 4 格显示一个 0-9 数字。数字带轻微错落，不追求机械对齐。
  if (!dialTicks.childElementCount) {
    for (let i = 0; i < TICK_COUNT; i++) {
      const tick = document.createElement('span');
      tick.className = 'dial-tick';
      const major = i % 4 === 0;
      if (major) {
        tick.classList.add('major');
        const digit = (i / 4) % 10;
        const num = document.createElement('span');
        num.className = 'tick-num';
        num.textContent = String(digit);
        tick.appendChild(num);
      }
      tick.style.setProperty('--a', (i * 9) + 'deg');
      tick.style.setProperty('--counter', (-i * 9) + 'deg');
      tick.style.setProperty('--jitter', (((i * 7) % 7) - 3) * 0.32 + 'deg');
      dialTicks.appendChild(tick);
    }
  }

  function getAudioContext() {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    if (!audioCtx) audioCtx = new Ctx();
    if (audioCtx.state === 'suspended') audioCtx.resume().catch(() => {});
    return audioCtx;
  }

  // 纸面摩擦式轻响：过滤后的短噪声，不用金属点击采样。
  function playPaperTick(strength) {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const length = Math.max(1, Math.floor(ctx.sampleRate * 0.035));
      const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < length; i++) {
        const decay = 1 - i / length;
        data[i] = (Math.random() * 2 - 1) * decay * decay;
      }
      const source = ctx.createBufferSource();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();
      filter.type = 'lowpass';
      filter.frequency.value = 1500;
      filter.Q.value = 0.55;
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.012 * (strength || 1), now + 0.004);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);
      source.buffer = buffer;
      source.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      source.start(now);
      source.stop(now + 0.05);
    } catch (e) {}
  }

  function playProgressTone(step) {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(430 + step * 46, now);
      osc.frequency.exponentialRampToValueAtTime(510 + step * 42, now + 0.12);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.032, now + 0.018);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.27);
    } catch (e) {}
  }

  function playUnlockChord() {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      [392, 523, 659].forEach(function(freq, i) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.0001, now + i * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.028, now + i * 0.06 + 0.025);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.06 + 0.48);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.06);
        osc.stop(now + i * 0.06 + 0.52);
      });
    } catch (e) {}
  }

  function playWrongTone() {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      [196, 147].forEach(function(freq, i) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.08);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.82, now + i * 0.08 + 0.22);
        gain.gain.setValueAtTime(0.0001, now + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.022, now + i * 0.08 + 0.018);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.08 + 0.30);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.32);
      });
    } catch (e) {}
  }

  function mod(value, size) {
    return ((value % size) + size) % size;
  }

  function digitFromRotation(value) {
    return mod(Math.round(-value / DIGIT_SPAN), 10);
  }

  function shortestDelta(angle) {
    let delta = mod(angle + 180, 360) - 180;
    return delta;
  }

  function renderDial() {
    dial.style.transform = 'translate(-50%, -50%) rotate(' + motion.rotation + 'deg)';
    const digit = digitFromRotation(motion.rotation);
    if (digit !== lastShownDigit) {
      dialCurrent.textContent = String(digit);
      dial.setAttribute('aria-valuenow', String(digit));
      dial.setAttribute('aria-valuetext', '拨盘数字 ' + digit);
      if (lastShownDigit !== null && (dragging || Math.abs(motion.rotation - lastShownDigit * -DIGIT_SPAN) > 1)) {
        playPaperTick(0.78);
      }
      lastShownDigit = digit;
    }
  }

  function pointerAngle(event) {
    const rect = dial.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    return Math.atan2(event.clientY - cy, event.clientX - cx) * 180 / Math.PI + 90;
  }

  function snapTo(targetRotation, onDone) {
    gsap.killTweensOf(motion);
    const distance = Math.abs(targetRotation - motion.rotation);
    const duration = Math.max(0.62, Math.min(1.15, 0.58 + distance / 150));
    gsap.to(motion, {
      rotation: targetRotation,
      duration: duration,
      ease: 'power3.out',
      onUpdate: renderDial,
      onComplete: function() {
        renderDial();
        if (onDone) onDone();
      }
    });
  }

  function checkDial(stable, selectedDigit) {
    if (!stable || phase !== 'password' || dragging || enteredDigits.length >= CORRECT_PWD.length) return;
    const digit = Number.isFinite(selectedDigit) ? selectedDigit : digitFromRotation(motion.rotation);
    enteredDigits.push(digit);

    const stepEl = progress[enteredDigits.length - 1];
    stepEl.classList.remove('found', 'wrong');
    stepEl.classList.add('entered');
    stepEl.setAttribute('aria-label', '已输入第 ' + enteredDigits.length + ' 位');

    gsap.fromTo(stepEl,
      { scale: 0.86 },
      { scale: 1.1, duration: 0.15, yoyo: true, repeat: 1, ease: 'sine.inOut', clearProps: 'scale' });

    if (enteredDigits.length === CORRECT_PWD.length) {
      phase = 'checking';
      const correct = enteredDigits.every(function(value, i) { return value === CORRECT_PWD[i]; });
      if (correct) {
        progress.forEach(function(el, i) {
          gsap.delayedCall(0.08 * i, function() {
            el.classList.remove('entered');
            el.classList.add('found');
            playProgressTone(i);
          });
        });
        gsap.delayedCall(0.62, function() {
          phase = 'unlocking';
          unlockLock();
        });
      } else {
        wrongAttempt();
      }
      return;
    }

    phase = 'resetting';
    const zeroTurn = Math.round(motion.rotation / 360);
    const zeroRotation = zeroTurn * 360;
    if (Math.abs(motion.rotation - zeroRotation) < 0.5) {
      motion.rotation = zeroRotation;
      renderDial();
      phase = 'password';
    } else {
      snapTo(zeroRotation, function() {
        phase = 'password';
      });
    }
  }

  function clearProgress() {
    progress.forEach(function(step) {
      step.classList.remove('entered', 'found', 'wrong');
      step.removeAttribute('aria-label');
    });
  }

  function resetAfterWrong() {
    enteredDigits = [];
    clearProgress();
    phase = 'resetting';
    lastShownDigit = null;
    const startDigit = 3 + Math.floor(Math.random() * 6);
    motion.rotation = -startDigit * DIGIT_SPAN + (Math.random() * 10 - 5);
    renderDial();
    phase = 'password';
  }

  function wrongAttempt() {
    wrongCount += 1;
    phase = 'checking';
    progress.forEach(function(step) {
      step.classList.remove('entered', 'found');
      step.classList.add('wrong');
    });
    playWrongTone();
    gsap.fromTo(lockBody,
      { x: 0 },
      { x: 7, duration: 0.055, repeat: 5, yoyo: true, ease: 'power1.inOut', clearProps: 'x' });

    if (wrongCount === 1) {
      hint.textContent = '暗号不对，再试一次';
      gsap.fromTo(hint, { opacity: 0 }, { opacity: 1, duration: 0.28, delay: 0.18 });
      gsap.delayedCall(1.05, resetAfterWrong);
    } else {
      hint.textContent = '今日不宜拆信……';
      gsap.fromTo(hint, { opacity: 0 }, { opacity: 1, duration: 0.35, delay: 0.32 });
      gsap.delayedCall(0.62, burnLetter);
    }
  }

  function burnLetter() {
    phase = 'burned';
    gsap.to([paperLock, hint], { opacity: 0, duration: 0.42, ease: 'power2.out' });
    gsap.to(frost, { opacity: 0, duration: 0.48, ease: 'power2.out' });
    gsap.to(envImg, { opacity: 0, scale: 0.985, duration: 0.92, ease: 'power2.inOut' });
    gsap.fromTo(burnScreen,
      { opacity: 0 },
      { opacity: 1, duration: 0.92, delay: 0.52, ease: 'power2.inOut' });
    gsap.fromTo(burnQuote,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.78, delay: 1.18, ease: 'power2.out' });
  }

  function settleDial(velocity) {
    dragging = false;
    dial.classList.remove('grabbing');
    let v = Math.max(-0.82, Math.min(0.82, velocity || 0));
    let lastTime = performance.now();

    function inertia(now) {
      const dt = Math.min(34, Math.max(8, now - lastTime));
      lastTime = now;
      v *= Math.pow(0.945, dt / 16);
      motion.rotation += v * dt;
      renderDial();
      if (Math.abs(v) > 0.012) {
        requestAnimationFrame(inertia);
      } else {
        checkDial(true, digitFromRotation(motion.rotation));
      }
    }
    requestAnimationFrame(inertia);
  }

  function onPointerDown(event) {
    if (phase !== 'password' || (event.button !== undefined && event.button !== 0)) return;
    getAudioContext();
    gsap.killTweensOf(motion);
    dragging = true;
    pointerId = event.pointerId;
    lastPointerAngle = pointerAngle(event);
    lastMoveTime = performance.now();
    moveSamples = [{ time: lastMoveTime, rotation: motion.rotation }];
    dial.classList.add('grabbing');
    dial.setPointerCapture(pointerId);
    event.preventDefault();
  }

  function onPointerMove(event) {
    if (!dragging || event.pointerId !== pointerId || phase !== 'password') return;
    const now = performance.now();
    const angle = pointerAngle(event);
    const delta = shortestDelta(angle - lastPointerAngle);
    const dt = Math.max(8, now - lastMoveTime);
    motion.rotation += delta;
    lastPointerAngle = angle;
    lastMoveTime = now;
    moveSamples.push({ time: now, rotation: motion.rotation });
    while (moveSamples.length > 2 && now - moveSamples[0].time > 130) moveSamples.shift();
    renderDial();
    event.preventDefault();
  }

  function onPointerUp(event) {
    if (!dragging || event.pointerId !== pointerId) return;
    const now = performance.now();
    let velocity = 0;
    if (moveSamples.length > 1) {
      const first = moveSamples[0];
      const last = moveSamples[moveSamples.length - 1];
      velocity = (last.rotation - first.rotation) / Math.max(16, last.time - first.time);
    } else if (now - lastMoveTime < 90) {
      velocity = 0;
    }
    try { dial.releasePointerCapture(pointerId); } catch (e) {}
    pointerId = null;
    settleDial(velocity);
    event.preventDefault();
  }

  dial.addEventListener('pointerdown', onPointerDown);
  dial.addEventListener('pointermove', onPointerMove);
  dial.addEventListener('pointerup', onPointerUp);
  dial.addEventListener('pointercancel', onPointerUp);
  dial.addEventListener('keydown', function(event) {
    if (phase !== 'password') return;
    if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
      event.preventDefault();
      event.stopPropagation();
      const digit = digitFromRotation(motion.rotation);
      const target = -mod(digit + 1, 10) * DIGIT_SPAN;
      const currentTurns = Math.round((motion.rotation - target) / 360);
      snapTo(target + currentTurns * 360);
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
      event.preventDefault();
      event.stopPropagation();
      const digit = digitFromRotation(motion.rotation);
      const target = -mod(digit - 1, 10) * DIGIT_SPAN;
      const currentTurns = Math.round((motion.rotation - target) / 360);
      snapTo(target + currentTurns * 360);
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      event.stopPropagation();
      checkDial(true);
    }
  });

  // 分镜 03 开信：信封各状态保持在原位置，仅替换图片与背景偏移。
  const STATES = {
    noseal:   { img: 'assets/第一幕-启封/没有火漆印的闭合信封.webp', bg: '-1px -50.5px', x: 50, y: 50, s: 540 },
    withcard: { img: 'assets/第一幕-启封/打开的有卡纸的信封.webp',   bg: '-1px -50.5px', x: 50, y: 50, s: 540 },
    half:     { img: 'assets/第一幕-启封/卡纸抽出了一半.webp',        bg: '-1px -50.5px', x: 50, y: 50, s: 540 },
    nocard:   { img: 'assets/第一幕-启封/打开的无卡纸的信封.webp',    bg: '-1px -50.5px', x: 50, y: 50, s: 540 }
  };
  function placeEnvOn(target, key) {
    const st = STATES[key];
    // 合并构建会把裸文件名预先补成 assets/...；源文件直开时仍需保留幕目录。
    const src = st.img.indexOf('/') >= 0 ? st.img : 'assets/第一幕-启封/' + st.img;
    target.style.backgroundImage = "url('" + src + "')";
    target.style.backgroundPosition = st.bg;
    target.style.backgroundSize = 'contain';
    target.style.backgroundRepeat = 'no-repeat';
    gsap.set(target, { left: st.x + '%', top: st.y + '%', width: st.s, height: st.s, xPercent: -50, yPercent: -50 });
  }
  function placeEnv(key) { placeEnvOn(envImg, key); }

  function beginLetterOpening() {
    phase = 'opening';
    dial.style.pointerEvents = 'none';
    gsap.to([paperLock, hint, frost], { opacity: 0, duration: 0.55, ease: 'power2.out' });
    gsap.fromTo(crack,
      { opacity: 0, scale: 0.4 },
      { opacity: 1, scale: 1, duration: 0.35, ease: 'power2.out', delay: 0.38 });
    gsap.fromTo(envImg,
      { scale: 1 },
      { scale: 1.016, duration: 0.18, delay: 0.38, yoyo: true, repeat: 1, ease: 'sine.inOut' });

    let front = envImg, back = envImgAlt;
    // 换信封状态：两层交替淡入淡出。写时间轴时先占位、运行时才换图，
    // 保证每个状态落在不同图层上（否则四个状态会反复写到同一层，最后一次直接盖掉前面所有状态）。
    const swapEnv = (key) => {
      const next = back, old = front;
      front = next; back = old;
      const swap = gsap.timeline();
      swap.add(() => {
        placeEnvOn(next, key);
        gsap.set(next, { opacity: 0, scale: 1 });
        gsap.to(next, { opacity: 1, duration: 0.3, ease: 'power1.inOut' });
        gsap.to(old, { opacity: 0, duration: 0.3, ease: 'power1.inOut' });
      }).to({}, { duration: 0.3 });
      return swap;
    };
    const tl = gsap.timeline({ delay: 1.05 });
    // ② 没有火漆印的闭合信封 + 那一枚碎了的火漆印（独立图层，位置与画在信封上的火漆重合）
    tl.add(() => { gsap.set(waxSeal, { opacity: 1, y: 0, scale: 1 }); })
      .add(swapEnv('noseal'))
      .to({}, { duration: 0.55 })                                   // 停一下，让人看清「碎在信封上」
      // ③ 火漆印震两下后脱落（裂纹跟着一起落）
      .to(waxSeal, { x: 2, duration: 0.06, yoyo: true, repeat: 3, ease: 'power1.inOut' })
      .to([waxSeal, crack], { y: 26, opacity: 0, duration: 0.5, ease: 'power1.in' })
      // ④ 打开的有卡纸的信封
      .add(swapEnv('withcard'))
      .to({}, { duration: 0.5 })
      // ⑤ 卡纸抽出了一半 + 卡纸（同时出现）
      .add(swapEnv('half'))
      .to({}, { duration: 0.35 })
      // ⑥ 卡纸斜着抽出，信封变成空的
      .add(() => { gsap.set(card, { opacity: 1 }); gsap.set(frontCover, { opacity: 1 }); })
      .add(swapEnv('nocard'))
      .to(card, { rotation: 14, x: -20, y: -28, duration: 0.6, ease: 'power2.inOut' })
      .call(function() { goToScene(4, { solidReveal: true }); });
  }

  function unlockLock() {
    playUnlockChord();
    paperLock.classList.add('unlocked');
    const tl = gsap.timeline({ onComplete: beginLetterOpening });
    tl.to(progress, { scale: 1.08, duration: 0.15, yoyo: true, repeat: 1, stagger: 0.045, ease: 'sine.inOut' }, 0)
      .to(lockShackle, { y: -62, rotation: -4, duration: 0.95, ease: 'elastic.out(1, 0.46)' }, 0.12)
      .to(lockBody, { y: -9, rotation: -0.8, duration: 0.62, ease: 'power2.out' }, 0.12)
      .to(dialCurrent, { scale: 1.08, duration: 0.26, yoyo: true, repeat: 1, ease: 'sine.inOut' }, 0.08);
  }

  // 重置 1.4。拨盘每次从一个非 0 数字附近开始，避免一进场自动对上第一位。
  gsap.killTweensOf([paperLock, lockShackle, lockBody, dial, crack, waxSeal, envImg, envImgAlt, frontCover, card, frost, hint, burnScreen, burnQuote]);
  gsap.killTweensOf(motion);
  gsap.set(envImg, { left: '50%', top: '50%', width: 540, height: 540, xPercent: -50, yPercent: -50, opacity: 1, scale: 1 });
    envImg.style.backgroundImage = "url('assets/第一幕-启封/完整信封.webp')";
  envImg.style.backgroundPosition = '-1px -50.5px';
  envImg.style.backgroundSize = 'contain';
  envImg.style.backgroundRepeat = 'no-repeat';
  placeEnvOn(envImgAlt, 'noseal');
  gsap.set(envImgAlt, { opacity: 0, scale: 1 });
  gsap.set(frontCover, { opacity: 0 });
  gsap.set(waxSeal, { opacity: 0, x: 0, y: 0, scale: 1 });
  gsap.set(crack, { left: '50.1%', top: '49.7%', width: 92, height: 92, xPercent: -50, yPercent: -50, opacity: 0, scale: 0.4, rotation: 12 });
  gsap.set(card, { left: '50.13%', top: '45.05%', width: 444, height: 444, rotation: 14, xPercent: -50, yPercent: -50, opacity: 0, x: 0, y: 0 });
  gsap.set(burn, { opacity: 0 });
  gsap.set(envImg, { filter: 'none' });
  gsap.set(burnScreen, { opacity: 0 });
  gsap.set(burnQuote, { opacity: 0, y: 10 });
  document.getElementById('scene-1-4').style.background = '';
  gsap.set(paperLock, { left: '50%', top: '52%', width: 620, height: 760, xPercent: -50, yPercent: -50, opacity: 0, scale: 0.95, y: 14 });
  gsap.set(lockShackle, { xPercent: -50, y: 0, rotation: 0, opacity: 1 });
  gsap.set(lockBody, { xPercent: -50, y: 0, rotation: 0, scale: 1 });
  dial.style.transform = '';
  clearProgress();
  paperLock.classList.remove('unlocked');
  dial.classList.remove('grabbing');
  dial.style.pointerEvents = '';
  frost.style.opacity = '1';
  hint.textContent = '转动拨盘，依次停在四位暗号上';
  gsap.set(hint, { opacity: 0 });
  phase = 'password';
  enteredDigits = [];
  wrongCount = 0;
  dragging = false;
  pointerId = null;
  moveSamples = [];
  lastShownDigit = null;
  const startDigit = 3 + Math.floor(Math.random() * 6);
  motion.rotation = -startDigit * DIGIT_SPAN + (Math.random() * 10 - 5);
  renderDial();

  // 入场：纸锁从纸面浮起，拨盘比锁体稍慢一步出现。
  paperLock.style.pointerEvents = 'auto';
  gsap.to(paperLock, { opacity: 1, scale: 1, y: 0, duration: 0.72, ease: 'power3.out' });
  gsap.fromTo(dialCurrent,
    { scale: 0.88, opacity: 0.35 },
    { scale: 1, opacity: 1, duration: 0.82, delay: 0.12, ease: 'power3.out' });
  gsap.to(hint, { opacity: 1, duration: 0.45, delay: 0.32 });
  window.__beginLetterOpening = beginLetterOpening;   // 自检/调试：直接重放开信状态序列
};
// ---- 1.5 明信片与地图 ----
sceneInit[4] = function() {
  // 清除之前的定时器和动画帧
  if (window._s15_timers) window._s15_timers.forEach(id => clearTimeout(id));
  if (window._s15_animId) cancelAnimationFrame(window._s15_animId);
  window._s15_timers = [];
  window._s15_animId = null;
  window._s15_start = Date.now();

  const postcard = document.getElementById('postcard');
  const mapImg = document.getElementById('map-img');
  const starXj = document.getElementById('star-xj');
  const starGd = document.getElementById('star-gd');
  const distLabel = document.getElementById('distance-label');
  const whiteout = document.getElementById('map-whiteout');
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');

  // 设置canvas尺寸（用固定尺寸，避免场景切换时getBoundingClientRect返回0）
  const W = 649, H = 500;            // 地图(04) 648.5×499.6（近似）
  canvas.width = W;
  canvas.height = H;

  // 星点位置（分镜批注笔精确质心：新疆 19.26%/24.4%，广东 60.21%/84.68%）
  const xj = { x: W * 0.1926, y: H * 0.2440 };
  const gd = { x: W * 0.6021, y: H * 0.8468 };
  // 弧线控制点：令二次贝塞尔在 t=0.5 处精确经过北京(63%,42.7%)
  const ctrl = { x: W * 0.8627, y: H * 0.3086 };
  // 碰撞点 = 北京（曲线中点，两星沿曲线相向汇聚于此）
  const collision = { x: W * 0.63, y: H * 0.427 };

  // 距离标注：旋转到与绿线平行，并置于线段中点旁（垂直偏移避免压线）
  const lineAng = Math.atan2(gd.y - xj.y, gd.x - xj.x) * 180 / Math.PI;  // ≈ 48.6°
  const midX = (xj.x + gd.x) / 2, midY = (xj.y + gd.y) / 2;
  const segLen = Math.hypot(gd.x - xj.x, gd.y - xj.y);
  const offX = -(gd.y - xj.y) / segLen * 18;   // 垂直方向偏移，让文字在线旁
  const offY =  (gd.x - xj.x) / segLen * 18;
  gsap.set(distLabel, {
    left: ((midX + offX) / W * 100) + '%',
    top:  ((midY + offY) / H * 100) + '%',
    xPercent: -50, yPercent: -50, rotation: lineAng
  });

  let particles = [];
  let animId = null;
  let phase = 'idle';

  // 重置
  postcard.style.opacity = '0';
  mapImg.style.opacity = '0';
  mapImg.classList.remove('show');   // 由 CSS 控制 mask-position（NW→SE 渐显）
  starXj.style.opacity = '0'; starXj.style.left = ''; starXj.style.top = '';
  starGd.style.opacity = '0'; starGd.style.left = ''; starGd.style.top = '';
  distLabel.style.opacity = '0';
  gsap.set(whiteout, { opacity: 0 });
  const ld0 = document.querySelector('#scene-1-5 .line-distance');
  const dhead0 = document.querySelector('#scene-1-5 .dist-head');
  if (ld0) { ld0.classList.remove('on'); gsap.set(ld0, { clearProps: 'opacity' }); }
  if (dhead0) gsap.set(dhead0, { opacity: 0 });
  // 弧线初始隐藏，待 ④ 再描绘
  const lt0 = document.querySelector('#scene-1-5 .traj-reveal');
  if (lt0 && lt0.getTotalLength) {
    const L0 = lt0.getTotalLength();
    lt0.style.strokeDasharray = L0;
    lt0.style.strokeDashoffset = L0;
  }
  const trajHead = document.querySelector('#scene-1-5 .traj-head');
  if (trajHead) trajHead.style.opacity = '0';
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles = [];

  // 时间线配置（方便后续调节奏）
  const T = {
    mapReveal: 800,
    distLine: 1700,      // ① 雾蓝虚线先浮现
    distLabel: 2500,    // ② 显示距离 4500km
    xjStar: 3300,       // ③ 新疆星点亮起
    gdStar: 3700,       // ③ 广东星点亮起
    distFade: 4300,     // ④ 距离文字与蓝色虚线先完全淡出
    trajLine: 5000,     // ⑤ 淡出完成后平滑描绘弧线
    particleFlow: 5000, // ⑤ 弧线描出同时粒子流
    travel: 6600,       // ⑥ 两星沿曲线相向驶向北京
    collide: 8200,      // ⑦ 在北京碰撞、白光转场
    debrisDelay: 120,   // 碰撞后碎片生成延迟
    whiteout: 800       // 白光扩散至淹没全屏
  };

  // 用setTimeout链式调用，避免gsap timeline延迟问题
  // 1. 明信片（卡纸）平滑放大淡入（批注 04：卡纸平滑放大到这里）
  gsap.fromTo(postcard, { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.8, ease: 'power2.out' });

  // 2. 地图毛笔渐显（0.8秒后，NW→SE mask）
  window._s15_timers.push(setTimeout(() => {
    mapImg.style.opacity = '1';
    mapImg.classList.add('show');
  }, T.mapReveal));
  // 2b. 直线距离（雾蓝虚线淡入）+ 沿线流动光点
  window._s15_timers.push(setTimeout(() => {
    const ld = document.querySelector('#scene-1-5 .line-distance');
    const dhead = document.querySelector('#scene-1-5 .dist-head');
    if (ld) ld.classList.add('on');
    if (ld && dhead && ld.getTotalLength) {
      const total = ld.getTotalLength();
      const proxy = { p: 0 };
      gsap.set(dhead, { opacity: 1 });
      gsap.to(proxy, { p: 1, duration: 1.6, ease: 'power1.inOut',
        onUpdate: () => {
          const pt = ld.getPointAtLength(proxy.p * total);
          dhead.setAttribute('cx', pt.x);
          dhead.setAttribute('cy', pt.y);
        }
      });
    }
  }, T.distLine));

  // 3. 新疆星点亮起
  window._s15_timers.push(setTimeout(() => {
    gsap.to(starXj, { opacity: 1, duration: 0.4, ease: 'power2.out' });
    gsap.to(starXj, { scale: 1.3, duration: 0.4, ease: 'sine.inOut', repeat: -1, yoyo: true });
  }, T.xjStar));

  // 4. 广东星点亮起（错开 0.4s）
  window._s15_timers.push(setTimeout(() => {
    gsap.to(starGd, { opacity: 1, duration: 0.4, ease: 'power2.out' });
    gsap.to(starGd, { scale: 1.3, duration: 0.6, ease: 'sine.inOut', repeat: -1, yoyo: true });
  }, T.gdStar));
  // 4b. 距离信息完全退场后，才允许弧线开始出现。
  window._s15_timers.push(setTimeout(() => {
    const ld = document.querySelector('#scene-1-5 .line-distance');
    const dhead = document.querySelector('#scene-1-5 .dist-head');
    gsap.to([ld, dhead, distLabel], {
      opacity: 0, duration: 0.6, ease: 'power1.inOut',
      onComplete: () => { if (ld) ld.classList.remove('on'); }
    });
  }, T.distFade));

  // 5. 平滑弧线“描绘”出来（沿二次贝塞尔生长，不再有锯齿）
  window._s15_timers.push(setTimeout(() => {
    const lt = document.querySelector('#scene-1-5 .traj-reveal');
    if (!lt || !lt.getTotalLength) return;
    const total = lt.getTotalLength();
    gsap.set(lt, { strokeDasharray: total, strokeDashoffset: total });
    gsap.to(lt, { strokeDashoffset: 0, duration: 1.4, ease: 'power1.inOut' });
  }, T.trajLine));

  // 5b. 粒子流（弧线描出同时）
  window._s15_timers.push(setTimeout(() => { startParticleFlow(); }, T.particleFlow));

  // 6. 距离标注（虚线后不久）
  window._s15_timers.push(setTimeout(() => {
    gsap.to(distLabel, { opacity: 1, duration: 0.5, ease: 'power2.out' });
  }, T.distLabel));

  // 7. 两星沿曲线驶向北京
  window._s15_timers.push(setTimeout(() => { startStarsTravel(); }, T.travel));

  // 8. 在北京碰撞爆发
  window._s15_timers.push(setTimeout(() => { triggerCollision(); }, T.collide));

  // 粒子流：沿二次贝塞尔曲线从新疆到广东
  function startParticleFlow() {
    phase = 'flow';
    const lt = document.querySelector('#scene-1-5 .line-traj');
    const total = lt && lt.getTotalLength ? lt.getTotalLength() : 0;
    const count = 46;
    for (let i = 0; i < count; i++) {
      particles.push({
        t: Math.random(),                       // 0-1 沿弧线的位置
        speed: 0.004 + Math.random() * 0.003,
        size: 1.5 + Math.random() * 2.2,
        alpha: 0.35 + Math.random() * 0.35,
        path: lt, total,
        offX: (Math.random() - 0.5) * 3,
        offY: (Math.random() - 0.5) * 3
      });
    }
    animateParticles();
  }

  // 柔玫红 #e8a7c4 → 香槟 #ecd6a8 按 t 插值（与弧线同色系）
  function arcColor(t) {
    const c0 = [232, 167, 196], c1 = [236, 214, 168];
    const r = Math.round(c0[0] + (c1[0] - c0[0]) * t);
    const g = Math.round(c0[1] + (c1[1] - c0[1]) * t);
    const b = Math.round(c0[2] + (c1[2] - c0[2]) * t);
    return r + ',' + g + ',' + b;
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (phase === 'flow') {
      particles.forEach(p => {
        p.t += p.speed;
        if (p.t > 1) p.t = 0;
        let x = 0, y = 0;
        if (p.path && p.total) {
          const pt = p.path.getPointAtLength(p.t * p.total);
          x = pt.x / 100 * W + p.offX;
          y = pt.y / 100 * H + p.offY;
        }
        const a = p.alpha * Math.min(p.t * 4, 1) * (1 - p.t * 0.55);
        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${arcColor(p.t)},${a})`;
        ctx.fill();
      });
    } else if (phase === 'collision') {
      // 碰撞碎片：只有在碎片生成后且全部消散才跳转
      if (particles.length > 0) {
        particles.forEach(p => {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.02;
          p.alpha -= 0.006;
          if (p.alpha > 0) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.globalAlpha = p.alpha;
            ctx.shadowBlur = 10;
            ctx.shadowColor = p.color;
            ctx.fillStyle = p.color;
            ctx.fill();
            ctx.shadowBlur = 0;
            ctx.globalAlpha = 1;
          }
        });
        particles = particles.filter(p => p.alpha > 0);
        if (particles.length === 0) {
          cancelAnimationFrame(animId);
          // 用户手动切走后不再跳转（防止异常跳转到 1.6）
          if (currentScene !== 4) return;
          return;
        }
      }
    }

    animId = requestAnimationFrame(animateParticles);
    window._s15_animId = animId;
  }

  // 两星沿曲线相向驶向北京（曲线中点），在北京相遇
  function startStarsTravel() {
    const lt = document.querySelector('#scene-1-5 .line-traj');
    if (!lt || !lt.getTotalLength) { triggerCollision(); return; }
    const total = lt.getTotalLength();
    gsap.killTweensOf([starXj, starGd]);
    // 新疆星：t 0 → 0.5（曲线起点→北京）；广东星：t 1 → 0.5（曲线终点→北京）
    const px = { p: 0 }, pg = { p: 1 };
    gsap.to(px, { p: 0.5, duration: 1.5, ease: 'power1.in',
      onUpdate: () => {
        const pt = lt.getPointAtLength(px.p * total);
        starXj.style.left = pt.x + '%';
        starXj.style.top = pt.y + '%';
      } });
    gsap.to(pg, { p: 0.5, duration: 1.5, ease: 'power1.in',
      onUpdate: () => {
        const pt = lt.getPointAtLength(pg.p * total);
        starGd.style.left = pt.x + '%';
        starGd.style.top = pt.y + '%';
      },
      onComplete: triggerCollision });
  }

  // 碰撞：两颗星点在北京相撞，星芒之后爆发强白光并转入聊天气泡。
  function triggerCollision() {
    if (phase === 'collision') return;
    phase = 'collision';
    particles = []; // 立即清空 flow 粒子
    gsap.killTweensOf([starXj, starGd]);

    // 距离标注淡出
    gsap.to(distLabel, { opacity: 0, duration: 0.3 });

    const wrap = document.getElementById('map-wrap');
    const ACCENT = '#e9c06a'; // 暖金（星尘爆裂，不用粉色）

    // ① 两星在碰撞点汇成持续高亮的暖金光核，直到被白光完全覆盖。
    // 不提前淡出，避免蓝线退场后误以为两个光点也一起消失。
    gsap.to([starXj, starGd], {
      scale: 1.65, opacity: 1, duration: 0.22, ease: 'back.out(2.4)'
    });

    if (wrap) {
      // ② 柔光涟漪：2 圈淡淡粉桃小波纹（不是大地震荡）
      for (let i = 0; i < 2; i++) {
        const r = document.createElement('div');
        r.className = 'collision-ring';
        r.style.borderColor = ACCENT;
        r.style.boxShadow = '0 0 12px ' + ACCENT;
        wrap.appendChild(r);
        gsap.set(r, { left: collision.x, top: collision.y, xPercent: -50, yPercent: -50, scale: 0.3, opacity: 0.85 });
        gsap.to(r, { scale: 3 + i * 1.6, opacity: 0, duration: 1.0 + i * 0.15, ease: 'power2.out', delay: i * 0.12,
          onComplete: () => r.remove() });
      }
      // ③ 金色星尘爆裂：小星点 ✦/✧ 上扬、闪烁、淡出（可爱核心，不用爱心）
      const STAR_GLYPHS = ['✦', '✧', '✶', '✷'];
      const starColors = ['#ffe9a8', '#fff3d0', '#f3cf7a', '#e9c06a', '#fff0c0'];
      for (let i = 0; i < 9; i++) {
        const h = document.createElement('div');
        h.className = 'collision-star';
        h.textContent = STAR_GLYPHS[i % STAR_GLYPHS.length];
        h.style.color = starColors[i % starColors.length];
        h.style.left = (collision.x + (Math.random() * 80 - 40)) + 'px';
        h.style.top = (collision.y + (Math.random() * 30 - 15)) + 'px';
        wrap.appendChild(h);
        gsap.set(h, { xPercent: -50, yPercent: -50, scale: 0.2, opacity: 0, rotate: (Math.random() * 40 - 20) });
        // 闪现
        gsap.to(h, { opacity: 1, scale: 0.7 + Math.random() * 0.5, duration: 0.26, ease: 'back.out(2)' });
        // 上扬 + 轻微闪烁 + 淡出
        gsap.to(h, { y: '-=' + (70 + Math.random() * 60), opacity: 0, duration: 1.3 + Math.random() * 0.6, ease: 'power1.out', delay: 0.28,
          onComplete: () => h.remove() });
      }
    }

    // ④ 白光从碰撞点迅速扩散，0.8 秒铺满屏幕后，以白场揭开 1.6。
    gsap.fromTo(whiteout,
      { opacity: 0, clipPath: 'circle(0% at 63% 42.7%)' },
      {
        opacity: 1,
        clipPath: 'circle(150% at 63% 42.7%)',
        duration: T.whiteout / 1000,
        ease: 'power3.in',
        onComplete: () => {
          if (currentScene === 4) goToScene(5, { solidReveal: true });
        }
      });

    // ⑤ 金色星尘粒子：白光覆盖前仍能短暂看见暖金余辉。
    const colors = ['#ffe9a8', '#fff3d0', '#f3cf7a', '#e9c06a', '#fff0c0'];
    window._s15_timers.push(setTimeout(() => {
      particles = [];
      for (let i = 0; i < 32; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.5 + Math.random() * 1.5;
        particles.push({
          x: collision.x, y: collision.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1.3, // 整体向上飘
          size: 1.4 + Math.random() * 2.6,
          alpha: 0.6 + Math.random() * 0.4,
          color: colors[Math.floor(Math.random() * colors.length)]
        });
      }
    }, T.debrisDelay));
  }
};

// ============================================================
//  第二幕 · 天气（2.1-2.5）
// ============================================================
// 底纹淡色（1x1 RGBA PNG，pattern 放大铺满窗玻璃区域）
const ACT2_TEX = {
  ylw: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4nGP4//lIDwAI7gNDjJEOlwAAAABJRU5ErkJggg==',
  gry: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4nGO4fPVWAwAIBAMDiNYT/AAAAABJRU5ErkJggg==',
  blu: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4nGPYd+11DwAH4QMMmlhfOQAAAABJRU5ErkJggg==',
  sno: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4nGN49u57DwAI4QNYqPu44QAAAABJRU5ErkJggg=='
};
// 窗玻璃纹理区域（assets/第一幕-启封/窗.json tex path#0 13 点，映射到 750×1334 画布坐标）
const ACT2_WIN = [[151.5,463.1],[588.2,463.1],[586.3,465.9],[573.3,468.7],[515.3,489.3],[514.3,864.3],[516.2,868.1],[567.6,891.4],[167.4,890.5],[217.9,866.2],[219.8,860.6],[219.8,490.3],[215.1,484.6]];
const ACT2_WIN_BBOX = { x0: 151.5, x1: 588.2, y0: 463.1, y1: 891.4 };
// 批注直线 [x1,y1,x2,y2]（首尾点拟合，用户批注）
const ANN_SUN = [[424,548,549,382],[376,535,374,387],[284,565,121,402],[256,608,104,510],[249,661,94,656],[256,706,94,844],[279,741,141,959],[319,776,259,942],[376,784,376,969],[421,784,514,914],[459,753,579,856],[579,856,646,921],[494,716,679,846],[501,663,671,676],[504,606,674,560],[476,568,659,473],[399,528,466,392],[459,545,656,400],[489,585,659,520],[506,628,684,628],[504,686,669,748],[499,743,664,864],[439,761,594,939],[399,791,456,957],[341,784,311,964],[289,766,199,954],[264,723,96,914],[236,678,79,721],[241,626,81,563],[256,570,96,438],[326,535,289,410]];
const ANN_CLOUD = [[81,69,199,71],[201,139,299,157],[416,71,561,71],[519,154,641,164],[119,239,271,247],[409,272,579,282],[346,192,454,189],[116,1094,314,1115],[91,1215,239,1220],[266,1165,394,1165],[439,1082,594,1069],[554,1197,641,1197],[354,1275,609,1265]];
const ANN_RAIN = [[104,386,106,938],[166,381,201,968],[244,381,249,943],[321,394,326,958],[421,421,419,933],[516,424,484,978],[574,426,571,938],[654,414,651,938]];
// 占位弹幕短句池（等用户提供真实聊天记录后替换）
const SUN_LINES = ['今天阳光真好呀','晒得人懒洋洋的','窗外的云像棉花糖','想和你去公园走走','阳光把影子拉得好长','这样的天适合发呆','风吹过来都是暖的','好想把阳光存起来','天空蓝得像洗过一样','光线穿过树叶真好看','这样的天气适合想你','阳光晒得书页发烫'];
const CLOUD_LINES = ['天阴沉沉的','好像要下雨了','云压得好低','心情也跟着灰灰的','适合窝在家里','天灰灰的','你那边天气怎么样','快下雨了吧','风凉凉的','太阳躲起来了'];
const RAIN_LINES = ['雨滴答滴答地下','好想给你送把伞','下雨天适合想你','窗外的雨好密','雨点打在玻璃上','这雨不知道要下多久','淋雨会感冒哦','雨天的路好滑','听着雨声发呆','雨停了一起去踩水吧'];

function act2LoadWin(container, tex) {
  return renderLineArtJSON('assets/第一幕-启封/窗.json', container, null, tex)
    .catch(err => console.warn('窗线稿加载失败:', err));
}
function act2PointInPoly(x, y) {
  let inside = false;
  const P = ACT2_WIN;
  for (let i = 0, j = P.length - 1; i < P.length; j = i++) {
    const xi = P[i][0], yi = P[i][1], xj = P[j][0], yj = P[j][1];
    if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) inside = !inside;
  }
  return inside;
}

// ---- 1.7 常青藤（第一幕独立场景，无窗，单主藤） ----
// 叶子布局由「常青藤叶子编排工具.html」导出（每片：img 类型 / x / y / rot / scale / z）
const IVY_LEAVES = [
  { img:1, x:393, y:138,   rot:-56,  scale:2.37, z:1 },
  { img:2, x:254, y:219,   rot:112,  scale:2.65, z:2 },
  { img:3, x:539, y:486,   rot:-51,  scale:2.64, z:3 },
  { img:4, x:221, y:247,   rot:-171, scale:2.46, z:4 },
  { img:5, x:621, y:63,    rot:-113, scale:2.51, z:5 },
  { img:3, x:169, y:483,   rot:158,  scale:2.43, z:6 },
  { img:1, x:297, y:1198,  rot:-59,  scale:2.43, z:7 },
  { img:4, x:204, y:792,   rot:-180, scale:2.37, z:8 },
  { img:5, x:523, y:1165,  rot:-105, scale:2.41, z:9 },
  { img:2, x:424, y:894,   rot:-142, scale:2.41, z:10 },
  { img:2, x:539, y:490,   rot:-142, scale:2.67, z:11 },
  { img:5, x:327, y:699,   rot:152,  scale:2.48, z:12 },
  { img:5, x:672, y:734,   rot:-95,  scale:2.32, z:13 },
];

// 13 片叶子上的词（与 IVY_LEAVES 同 z 序索引；图源已用 PIL+汉仪俊坡隶W.ttf 预渲染为透明 PNG）
// cx,cy = 叶片中心页面坐标（叶柄→叶心距离 D=s*(sp-51) + rotate(rot) 推得；sp=叶柄高%×104）
// textRot = rot-90 归一化到 (-90,90]（让文字沿叶片长轴排列；隶书字体配竖排更书卷气）
// textRot = rot（**不归一化**）：文字与叶子绝对同角度，|rot|>90 的叶子文字会倒立
// ——这是用户明确选择的取舍（角度一致优先于正立可读）。
// 位置：质心为基准 + 逐词二分到 100% 不溢出（安全系数 0.93）
const IVY_WORDS = [
  { file:'01_忘记.png', w:140.7, h:69.7, textRot: -56.0, cx:299.2, cy:77.6 },
  { file:'02_新疆.png', w:151.0, h:70.9, textRot: -45.0, cx:394.0, cy:273.5 },
  { file:'03_回家.png', w:134.7, h:66.3, textRot: 81.0, cx:445.5, cy:419.5 },
  { file:'04_起床.png', w:125.3, h:62.0, textRot: -38.5, cx:203.5, cy:354.5 },
  { file:'05_假期.png', w:146.0, h:72.6, textRot: 31.5, cx:520.0, cy:107.0 },
  { file:'06_广东.png', w:116.0, h:60.7, textRot: -60.5, cx:214.0, cy:578.5 },
  { file:'07_学校.png', w:142.7, h:74.7, textRot: -59.0, cx:201.9, cy:1143.7 },
  { file:'08_爱情.png', w:121.3, h:60.7, textRot: -52.0, cx:200.5, cy:900.2 },
  { file:'09_发展.png', w:120.0, h:61.3, textRot: 46.5, cx:419.0, cy:1203.3 },
  { file:'10_感情.png', w:124.7, h:62.4, textRot: 52.5, cx:350.5, cy:993.1 },
  { file:'11_帅哥.png', w:141.3, h:74.0, textRot: 53.5, cx:451.0, cy:602.0 },
  { file:'12_相机.png', w:159.0, h:71.4, textRot: -61.0, cx:384.0, cy:805.0 },
  { file:'13_老师.png', w:116.7, h:58.7, textRot: 57.5, cx:567.0, cy:748.0 },
];

// 每片叶子（按词名索引）的数据：第一行活跃月数，第二行一句话（待用户补充）
// 与 IVY_WORDS 分离存放——编辑器导出的纯几何数组不会被这层数据污染
const IVY_DATA = {
  '假期': { months: 43, note: '假期宝宝跑起来好吗……' },
  '忘记': { months: 40, note: '世界上最健忘的两个人！' },
  '新疆': { months: 66, note: '大美新疆欢迎你~' },
  '起床': { months: 38, note: '可能是中午两点……' },
  '广东': { months: 55, note: '四季如春的好地方！（也可能如夏' },
  '回家': { months: 60, note: '回家真是很幸福呀 但更多的是"我想回家"' },
  '帅哥': { months: 28, note: '嘿嘿嘿嘿嘿嘿嘿嘿' },
  '相机': { months: 14, note: '买来想拍薛之谦 但跑太快根本拍不到' },
  '老师': { months: 70, note: '菜菜捞捞' },
  '爱情': { months: 8,  note: '音乐安静 那是……' },
  '感情': { months: 16, note: '"我无法只是普通朋友"' },
  '发展': { months: 19, note: '居然是在聊一些时政吗' },
  '学校': { months: 71, note: '我不要上学。' },
};

// 每种叶子图形的叶柄位置（占图高百分比，从顶部算）
const IVY_STALK = { 1:94.2, 2:93.8, 3:88.5, 4:88.4, 5:87.9 };
const IVY_LEAF_W = 104, IVY_HALF_W = 52;

// 常青藤会在第一幕末尾才出现。提前发起低优先级请求，让移动端在进入该幕
// 前完成网络与解码；这里不创建 DOM，避免预加载本身造成首屏布局和合成压力。
function prewarmIvyAssets() {
  if (window.__ivyAssetPreloadPromise) return window.__ivyAssetPreloadPromise;
  const urls = [];
  for (let i = 1; i <= 5; i++) urls.push('assets/第一幕-启封/叶子' + i + '.webp');
  IVY_WORDS.forEach(w => urls.push('assets/第一幕-启封/藤词/' + w.file));
  window.__ivyAssetPreload = urls.map(src => new Promise(resolve => {
    const im = new Image();
    im.decoding = 'async';
    try { im.fetchPriority = 'high'; } catch (e) {}
    im.onload = () => (im.decode ? im.decode().catch(() => {}) : Promise.resolve()).then(resolve);
    im.onerror = resolve;
    im.src = src;
  }));
  window.__ivyAssetPreloadPromise = Promise.all(window.__ivyAssetPreload);
  return window.__ivyAssetPreloadPromise;
}
prewarmIvyAssets();

// 根据 IVY_LEAVES 构建叶子 DOM（以叶柄为轴心，等比缩放 + 旋转）
// 同时为每片叶子叠加词图（IVY_WORDS[z-1]）：居中于叶片中心、沿叶片长轴、multiply 融入
function buildIvyLeaves() {
  const box = document.getElementById('ivy-leaves');
  if (!box) return [];
  box.innerHTML = '';
  return IVY_LEAVES.slice().sort((a, b) => a.z - b.z).map(L => {
    const sp = IVY_STALK[L.img] / 100 * IVY_LEAF_W;
    const pair = document.createElement('div');
    pair.className = 'ivy-pair';
    pair.style.zIndex = 2 + L.z;
    pair._baseZ = 2 + L.z;

    const img = document.createElement('img');
    img.className = 'ivy-leaf';
    img.loading = 'eager';
    img.decoding = 'async';
    img.dataset.leaf = L.img;
    img.src = 'assets/第一幕-启封/叶子' + L.img + '.webp';
    img.onerror = function () {
      if (!this.src.endsWith('.png')) this.src = this.src.replace(/\.webp(?:\?.*)?$/, '.png');
    };
    img.style.left = L.x + 'px';
    img.style.top = L.y + 'px';
    img.style.width = IVY_LEAF_W + 'px';
    img.style.transformOrigin = '50% ' + IVY_STALK[L.img] + '%';
    img.style.pointerEvents = 'none';   // 叶子露出后再放开点击
    const fullT = 'translate(' + (-IVY_HALF_W) + 'px, ' + (-sp) + 'px) rotate(' + L.rot + 'deg) scale(' + L.scale + ')';
    img.dataset.fullT = fullT;
    // 沿用原文件的 35% 起始尺寸，叶片以叶柄为轴弹出；解码完成后才开始这一段。
    img.style.transform = fullT.replace('scale(' + L.scale + ')', 'scale(' + (L.scale * 0.35) + ')');
    pair.appendChild(img);

    // 词图：居中于叶片中心；初始 scale(0.2)+opacity:0，叶子出现后再"长出"
    const W = IVY_WORDS[L.z - 1];
    if (W) {
      const w = document.createElement('img');
      w.className = 'ivy-word';
      w.loading = 'eager';
      w.decoding = 'async';
      w.src = 'assets/第一幕-启封/藤词/' + W.file;
      w.style.left = W.cx + 'px';
      w.style.top  = W.cy + 'px';
      w.style.width = W.w + 'px';
      w.style.pointerEvents = 'none';
      w.dataset.fullT = 'translate(-50%,-50%) rotate(' + W.textRot + 'deg) scale(1)';
      w.style.transform = 'translate(-50%,-50%) rotate(' + W.textRot + 'deg) scale(0.2)';
      pair.appendChild(w);
      img._word = w; img._pair = pair;
      const name = W.file.replace(/^\d+_/, '').replace(/\.png$/i, '');
      const d = IVY_DATA[name] || { months: 0, note: '' };
      pair._data = { name: name, months: d.months, note: d.note };
      pair._leaf = img; pair._word = w;
      const focusFn = (e) => { e.stopPropagation(); focusPair(pair); };
      img.addEventListener('click', focusFn);
      w.addEventListener('click', focusFn);
      pair._L = L;
    }
    box.appendChild(pair);
    return img;
  });
}

// ===== 点击聚焦：该叶+词原地"微微放大"（叶柄为锚点不动），并弹出数据 =====
const WORD_GROW_DELAY = 340;   // 叶子先冒出，字稍后"长出"
let ivyFocused = null, ivyPopup = null;

function ensureIvyPopup() {
  const scene = document.getElementById('scene-1-7');
  if (!scene || ivyPopup) return;
  ivyPopup = document.createElement('div');
  ivyPopup.className = 'ivy-popup';
  scene.appendChild(ivyPopup);
}

function focusPair(pair) {
  ensureIvyPopup();
  if (ivyFocused === pair) { unfocusPair(); return; }
  if (ivyFocused) {
    // 已开别的卡：先让旧卡在原地淡出、旧叶还原，淡出结束后再显示新卡（新卡原地淡入，不滑动）
    unfocusPair();
    clearTimeout(ivyPopup._reposT);
    ivyPopup._reposT = setTimeout(() => showPair(pair), 300);
    return;
  }
  showPair(pair);
}

function showPair(pair) {
  ivyFocused = pair;
  pair.classList.add('focused');

  // 以"叶柄"为锚点做微放大：叶柄在画面(=pair)坐标系中的位置 = 叶子左上角 + transform-origin。
  // 叶子自身无论被旋转/缩放多少倍，其 transform-origin 点都固定不动，缩放围绕它即可让叶柄原地不动、不移到画面正中。
  const L = pair._L;
  const leaf = pair._leaf;
  const sp = (IVY_STALK[leaf.dataset.leaf] || 50) / 100;
  const stalkX = L.x + 0.5 * IVY_LEAF_W;          // 叶柄 x（画面内部坐标）
  const stalkY = L.y + sp * IVY_LEAF_W * (leaf.naturalHeight / leaf.naturalWidth || 1); // 叶柄 y
  const K = 1.22;                                 // 微微放大

  pair.style.transition = 'transform .5s cubic-bezier(.2,.7,.2,1)';
  pair.style.transformOrigin = stalkX + 'px ' + stalkY + 'px';
  pair.style.transform = 'scale(' + K + ')';

  const d = pair._data;
  const note = d.note ? d.note : '（这句话待你补充）';
  ivyPopup.innerHTML =
    '<div class="pp-head"><span class="pp-name">' + d.name + '</span>' +
    '<span class="pp-months">活跃 <b>' + d.months + '</b> 个月</span></div>' +
    '<div class="pp-note">' + note + '</div>';
  positionIvyPopup(pair);          // 原地摆位（无 left/top 过渡，不滑动）
  ivyPopup.classList.add('show');  // 原地淡入
}

// 把数据卡摆到叶子旁（叶在左→卡在右，叶在右→卡在左），并夹在场景内
function positionIvyPopup(pair) {
  if (!ivyPopup || !pair) return;
  const leaf = pair._leaf;
  const scene = document.getElementById('scene-1-7');
  if (!scene) return;
  const sr = scene.getBoundingClientRect();
  const S = sr.width / 750;                                  // 屏幕→设计坐标
  const lr = leaf.getBoundingClientRect();
  const lcx = (lr.left + lr.width / 2 - sr.left) / S;        // 叶中心（设计坐标）
  const lcy = (lr.top + lr.height / 2 - sr.top) / S;
  const leafHalfW = lr.width / (2 * S);
  const cw = ivyPopup.offsetWidth, ch = ivyPopup.offsetHeight;
  const gap = 16;
  let left = (lcx <= 375) ? (lcx + leafHalfW + gap) : (lcx - leafHalfW - gap - cw);
  let top = lcy - ch / 2;
  left = Math.max(10, Math.min(left, 750 - cw - 10));
  top = Math.max(10, Math.min(top, 1334 - ch - 10));
  ivyPopup.style.left = left + 'px';
  ivyPopup.style.top = top + 'px';
}

function unfocusPair() {
  if (!ivyFocused) return;
  const p = ivyFocused;
  p.classList.remove('focused');
  p.style.transform = '';
  p.style.transformOrigin = '';
  p.style.transition = '';
  ivyFocused = null;
  if (ivyPopup) ivyPopup.classList.remove('show');
}

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && ivyFocused) unfocusPair();
});
// 移动端旋转/缩放视口时，把卡片重新贴回叶子旁
window.addEventListener('resize', () => { if (ivyFocused) positionIvyPopup(ivyFocused); });

sceneInit[6] = function() {
  const stem = document.querySelector('#scene-1-7 .stem-path');
  const scene = document.getElementById('scene-1-7');
  if (!scene) return;
  // 屏上错误显示：仅当异常时出现，便于下次告诉我精确报错
  function showError(msg) {
    let dbg = document.getElementById('ivy-debug');
    if (!dbg) {
      dbg = document.createElement('div');
      dbg.id = 'ivy-debug';
      dbg.style.cssText = 'position:absolute;left:20px;top:20px;z-index:99;color:#a00;background:#fff8;font:13px/1.4 sans-serif;padding:6px;max-width:90%;white-space:pre-wrap;';
      scene.appendChild(dbg);
    }
    dbg.textContent = '常青藤调试: ' + msg;
  }
  try {
    // 只杀 stem 的旧 tween；不要把 scene 加进去——
    // 否则会杀死 goToScene 刚为本幕创建的"淡入" tween，让 scene 永远停在 opacity:0
    if (typeof gsap !== 'undefined' && gsap.killTweensOf) gsap.killTweensOf(stem);

    // 1) 重建叶子，初始隐藏且缩小（直接 style，不经 gsap）
    const leaves = buildIvyLeaves();
    // 重新进入时清掉上一轮可能残留的聚焦态（pair 已重建，旧引用失效）
    ivyFocused = null;
    if (ivyPopup) ivyPopup.classList.remove('show');
    // 点击场景空白处（卡片以外的任何地方）关闭聚焦；叶子/词自身已 stopPropagation，不会到这里
    scene.onclick = (e) => {
      if (!e.target.closest('.ivy-popup')) unfocusPair();
    };
    leaves.forEach(l => { l.style.opacity = '0'; l.dataset.ready = ''; l.dataset.shown = ''; });

    // 2) 主藤：用实测路径长度做 dasharray（自带 try/catch），保证一定能画出来
    let pathLen = 2600;
    try { if (stem && stem.getTotalLength) pathLen = Math.max(1, stem.getTotalLength()); } catch (e) {}

    // 2.5) 计算每片叶子在藤上的"出现阈值"：
    //      采样路径点，找离叶子叶柄最近处对应的长度比例（0=藤根,1=藤梢）。
    //      这样藤画到叶子位置时，叶子才进入"就绪队列"，绝不会比藤先出来。
    let thresholds = leaves.map(() => 0.5);
    try {
      if (stem && stem.getPointAtLength && pathLen > 1) {
        const N = 260;
        const pts = [];
        for (let i = 0; i <= N; i++) pts.push(stem.getPointAtLength(pathLen * i / N));
        thresholds = leaves.map(leaf => {
          const lx = parseFloat(leaf.style.left) || 0;
          const ly = parseFloat(leaf.style.top) || 0;
          let best = 0, bestD = Infinity;
          for (let i = 0; i < pts.length; i++) {
            const dx = pts[i].x - lx, dy = pts[i].y - ly;
            const d = dx * dx + dy * dy;
            if (d < bestD) { bestD = d; best = i / N; }
          }
          return best;
        });
      }
    } catch (e) { thresholds = leaves.map(() => 0.5); }

    if (stem) {
      stem.style.strokeDasharray = pathLen;
      stem.style.strokeDashoffset = pathLen;
    }

    // 3) 主藤自下而上生长 + 叶子连续出现。
    //    不再用逐帧 JS 同时写 SVG dashoffset 和透明大图 transform，避免电脑端
    //    每帧触发大量重绘而出现“一卡一卡”。藤交给 GSAP，叶片交给 CSS 过渡。
    const growMs = 5000;
    const REVEAL_STAGGER = 230;
    // 一次性按 y 降序排好：底部最先冒，绝不颠倒
    const ordered = leaves.slice().sort((a, b) => (parseFloat(b.style.top) || 0) - (parseFloat(a.style.top) || 0));
    const threshMap = new Map();
    leaves.forEach((l, i) => threshMap.set(l, thresholds[i] != null ? thresholds[i] : 0.5));
    const revealTimers = [];
    if (window.__ivyRevealTimers) window.__ivyRevealTimers.forEach(clearTimeout);
    window.__ivyRevealTimers = revealTimers;
    if (typeof gsap !== 'undefined' && stem) {
      gsap.killTweensOf(stem);
      gsap.to(stem, { strokeDashoffset: 0, duration: growMs / 1000, delay: 0.3, ease: 'none' });
    } else if (stem) {
      stem.style.strokeDashoffset = '0';
    }
    const revealAll = () => ordered.forEach((leaf, orderIndex) => {
      const th = threshMap.get(leaf);
      const delay = 300 + Math.max(0, th * growMs) + orderIndex * REVEAL_STAGGER;
      revealTimers.push(setTimeout(() => {
        if (!scene.classList.contains('active')) return;
        leaf.dataset.shown = '1';
        leaf.classList.add('is-growing');
        leaf.style.opacity = '1';
        leaf.style.pointerEvents = 'auto';
        if (leaf.dataset.fullT) leaf.style.transform = leaf.dataset.fullT;
        revealTimers.push(setTimeout(() => leaf.classList.remove('is-growing'), 1200));
        if (leaf._word) {
          const wEl = leaf._word;
          revealTimers.push(setTimeout(() => {
            if (!scene.classList.contains('active')) return;
            wEl.style.opacity = '0.95';
            wEl.style.pointerEvents = 'auto';
            if (wEl.dataset.fullT) wEl.style.transform = wEl.dataset.fullT;
          }, WORD_GROW_DELAY));
        }
      }, delay));
    });
    // 先等整批叶片/词图完成解码，再启动节奏；避免移动端在动画中途才创建合成层。
    const ivyReady = window.__ivyAssetPreloadPromise || Promise.resolve();
    ivyReady.catch(() => {}).then(() => {
      if (!scene.classList.contains('active')) return;
      revealTimers.push(setTimeout(revealAll, 80));
    });

    // 5) 用户要求：看完常青藤后停在本幕，不自动进下一幕（手动按 →/空格 才继续）
    //    （原 finishAt 自动 goToScene(7) 已移除）
    // 点击空白区域也推进，叶片/弹窗点击仍保留为查看详情。
    const ivyScene = document.getElementById('scene-1-7');
    if (ivyScene && !ivyScene.dataset.advanceBound) {
      ivyScene.dataset.advanceBound = '1';
      ivyScene.addEventListener('pointerup', (ev) => {
        if (ev.target.closest('.ivy-pair, .ivy-popup')) return;
        if (window.App && window.App.next) window.App.next();
      });
    }
  } catch (e) {
    showError(e && e.message ? e.message : String(e));
    console.error('常青藤异常：', e);
    document.querySelectorAll('#scene-1-7 .ivy-leaf').forEach(l => { l.style.opacity = '1'; l.style.pointerEvents = 'auto'; if (l.dataset.fullT) l.style.transform = l.dataset.fullT; });
    document.querySelectorAll('#scene-1-7 .ivy-word').forEach(w => { w.style.opacity = '0.95'; w.style.pointerEvents = 'auto'; if (w.dataset.fullT) w.style.transform = w.dataset.fullT; });
    if (stem) stem.style.strokeDashoffset = '0';
  }
};

// ---- 2.2 晴：太阳渐显 + 放射弹幕 + 金色粒子 ----
sceneInit[7] = function() {
  const winLayer = document.getElementById('win-2-2');
  if (!winLayer.dataset.loaded) {
    act2LoadWin(winLayer, { img: ACT2_TEX.ylw, x: 0, y: 0, s: 800 });
    winLayer.dataset.loaded = '1';
  }
  const sun = document.getElementById('sun-2-2');
  const glow = document.getElementById('sun-glow-2-2');
  const layer = document.getElementById('dmk-2-2');
  const hint = document.querySelector('#scene-2-2 .weather-hint');
  gsap.killTweensOf([sun, glow, hint, '#scene-2-2 .danmaku']);
  layer.querySelectorAll('.danmaku').forEach(el => el.remove());
  gsap.to(hint, { opacity: 0, duration: 0.2 });

  // 太阳（窗玻璃中心略上）+ 光晕
  gsap.set(sun, { left: 369, top: 620, xPercent: -50, yPercent: -50, width: 359, height: 359, opacity: 0, scale: 0.9 });
  gsap.set(glow, { left: 369, top: 620, xPercent: -50, yPercent: -50, width: 430, height: 430, opacity: 0, scale: 0.6 });
  gsap.to(sun, { opacity: 1, scale: 1, duration: 2.2, delay: 0.5, ease: 'power2.out' });
  gsap.to(glow, { opacity: 1, scale: 1.15, duration: 2.6, delay: 0.8, ease: 'power2.out' });
  gsap.to(glow, { opacity: 0.55, scale: 1.25, duration: 2.8, delay: 3.4, yoyo: true, repeat: -1, ease: 'sine.inOut' });

  // 31 条弹幕：沿首→尾直线从窗中心向外流动，到尾点消失
  ANN_SUN.forEach((p, i) => {
    const el = document.createElement('div');
    el.className = 'danmaku sun-dmk' + (i >= 16 ? ' blue' : '');
    el.textContent = SUN_LINES[i % SUN_LINES.length];
    el.style.fontSize = (18 + (i % 3) * 2) + 'px';
    const baseOp = i >= 16 ? 0.55 : 0.85;   // 蓝弹幕比黄弹幕更淡
    gsap.set(el, { left: p[0], top: p[1], xPercent: -50, yPercent: -50 });
    layer.appendChild(el);
    const dur = 5 + (i * 0.31) % 4;
    const moveDur = dur * 0.72, tail = dur * 0.2, gap = dur * 0.08;
    gsap.timeline({ repeat: -1, delay: (i * 0.57) % 3.2 })
      .fromTo(el, { x: 0, y: 0, opacity: 0 }, { opacity: baseOp, duration: 0.3, ease: 'none' })
      .to(el, { x: p[2] - p[0], y: p[3] - p[1], duration: moveDur, ease: 'none' })
      .to(el, { opacity: 0, duration: tail, ease: 'none' })
      .to({}, { duration: gap });
  });

  // 金色粒子
  act2Particles(document.getElementById('pc-gold'), 'gold');
  gsap.to(hint, { opacity: 1, duration: 0.6, delay: 2.2 });
};

// ---- 2.3 阴：云朵划入 + 呼吸弹幕 ----
sceneInit[8] = function() {
  const winLayer = document.getElementById('win-2-3');
  if (!winLayer.dataset.loaded) {
    act2LoadWin(winLayer, { img: ACT2_TEX.gry, x: 0, y: 0, s: 800 });
    winLayer.dataset.loaded = '1';
  }
  const layer = document.getElementById('dmk-2-3');
  const cloudA = document.querySelector('#scene-2-3 .cloud-a');   // 云朵2 (280,531)
  const cloudB = document.querySelector('#scene-2-3 .cloud-b');   // 云朵1 (510,687)
  const hint = document.querySelector('#scene-2-3 .weather-hint');
  gsap.killTweensOf([cloudA, cloudB, hint, '#scene-2-3 .danmaku']);
  layer.querySelectorAll('.danmaku').forEach(el => el.remove());
  gsap.to(hint, { opacity: 0, duration: 0.2 });

  // 云朵从左侧划入（向左滑动 → 太阳向左淡出，乌云从左往右划入）
  gsap.set(cloudA, { left: '37.33%', top: '39.8%', xPercent: -50, yPercent: -50, x: -620, opacity: 0 });
  gsap.set(cloudB, { left: '68%', top: '51.5%', xPercent: -50, yPercent: -50, x: -700, opacity: 0 });
  gsap.to(cloudA, { x: 0, opacity: 1, duration: 1.8, delay: 0.3, ease: 'power2.out' });
  gsap.to(cloudB, { x: 0, opacity: 1, duration: 2.0, delay: 0.9, ease: 'power2.out' });
  gsap.timeline({ repeat: -1, delay: 3.2 })
    .to(cloudA, { x: 18, duration: 6, ease: 'sine.inOut' })
    .to(cloudA, { x: -18, duration: 6, ease: 'sine.inOut' });
  gsap.timeline({ repeat: -1, delay: 4.0 })
    .to(cloudB, { x: 14, duration: 7, ease: 'sine.inOut' })
    .to(cloudB, { x: -20, duration: 7, ease: 'sine.inOut' });

  // 13 条弹幕：原位呼吸
  ANN_CLOUD.forEach((p, i) => {
    const el = document.createElement('div');
    el.className = 'danmaku cloud-dmk';
    el.textContent = CLOUD_LINES[i % CLOUD_LINES.length];
    el.style.fontSize = (15 + (i % 3) * 2) + 'px';
    const cx = (p[0] + p[2]) / 2, cy = (p[1] + p[3]) / 2;
    gsap.set(el, { left: cx, top: cy, xPercent: -50, yPercent: -50 });
    layer.appendChild(el);
    gsap.timeline({ repeat: -1, delay: 0.5 + i * 0.33, repeatDelay: 1.0 + (i % 4) * 0.45 })
      .fromTo(el, { opacity: 0.1 }, { opacity: 0.7, duration: 1.6, ease: 'sine.inOut' })
      .to(el, { opacity: 0.1, duration: 2.2, ease: 'sine.inOut' });
  });
  gsap.to(hint, { opacity: 1, duration: 0.6, delay: 2.2 });
};

// ---- 2.4 雨：垂直弹幕 + 雨滴粒子 ----
sceneInit[9] = function() {
  const winLayer = document.getElementById('win-2-4');
  if (!winLayer.dataset.loaded) {
    act2LoadWin(winLayer, { img: ACT2_TEX.blu, x: 0, y: 0, s: 800 });
    winLayer.dataset.loaded = '1';
  }
  const layer = document.getElementById('dmk-2-4');
  const drop = document.querySelector('#scene-2-4 .rain-drop');
  const hint = document.querySelector('#scene-2-4 .weather-hint');
  gsap.killTweensOf([drop, hint, '#scene-2-4 .danmaku']);
  layer.querySelectorAll('.danmaku').forEach(el => el.remove());
  gsap.to(hint, { opacity: 0, duration: 0.2 });

  // 玻璃上的雨渍
  gsap.set(drop, { left: 375, top: 680, xPercent: -50, yPercent: -50, opacity: 0 });
  gsap.to(drop, { opacity: 0.5, duration: 1.6, delay: 0.8 });

  // 8 条弹幕：从上沿垂直滚到下沿消失
  ANN_RAIN.forEach((p, i) => {
    const el = document.createElement('div');
    el.className = 'danmaku rain-dmk';
    el.textContent = RAIN_LINES[i % RAIN_LINES.length];
    el.style.fontSize = (17 + (i % 2) * 3) + 'px';
    gsap.set(el, { left: p[0], top: p[1], xPercent: -50, yPercent: -50 });
    layer.appendChild(el);
    const dy = p[3] - p[1];
    const dur = 3.2 + (i % 4) * 0.8;
    gsap.timeline({ repeat: -1, delay: i * 0.55 })
      .fromTo(el, { y: 0, opacity: 0 }, { opacity: 0.85, duration: dur * 0.12, ease: 'none' })
      .to(el, { y: dy, opacity: 0.85, duration: dur * 0.76, ease: 'none' })
      .to(el, { opacity: 0, duration: dur * 0.12, ease: 'none' })
      .to({}, { duration: dur * 0.3 });
  });

  act2Particles(document.getElementById('pc-rain'), 'rain');
  gsap.to(hint, { opacity: 1, duration: 0.6, delay: 2.2 });
};

// ---- 2.5 雪：窗内雪花堆积 + 全屏白粒子 ----
sceneInit[10] = function() {
  const winLayer = document.getElementById('win-2-5');
  if (!winLayer.dataset.loaded) {
    act2LoadWin(winLayer, { img: ACT2_TEX.sno, x: 0, y: 0, s: 800 });
    winLayer.dataset.loaded = '1';
  }
  const canvas = document.getElementById('snow-2-5');
  const ctx = canvas.getContext('2d');
  const W = canvas.width = 750, H = canvas.height = 1334;
  const bbox = ACT2_WIN_BBOX;
  const cols = Math.ceil(bbox.x1 - bbox.x0) + 1;
  const baseNoise = Array.from({ length: cols }, (_, i) => Math.sin(i * 0.35) * 4 + Math.cos(i * 0.11) * 3);
  const scene = canvas.closest('.scene');
  const hint = document.getElementById('snow-hint');
  const flakes = [];
  const MAX_FLAKES = 130;
  const ACC_TARGET = 5500;
  const maxH = (bbox.y1 - bbox.y0) * 0.62;
  let acc = 0, raf = 0, done = false, gone = false;
  gsap.killTweensOf(hint);
  gsap.to(hint, { opacity: 1, duration: 0.8 });

  function spawn() {
    if (flakes.length >= MAX_FLAKES) return;
    let x, y, tries = 0;
    do {
      x = bbox.x0 + Math.random() * (bbox.x1 - bbox.x0);
      y = bbox.y0 + Math.random() * (bbox.y1 - bbox.y0) * 0.35;
      tries++;
    } while (!act2PointInPoly(x, y) && tries < 20);
    flakes.push({ x, y, vy: 1 + Math.random() * 1.6, vx: (Math.random() - 0.5) * 0.5, r: 1.5 + Math.random() * 2.6, rot: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.12, ph: Math.random() * 6.28 });
  }
  function drawFlake(x, y, r, rot) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.strokeStyle = 'rgba(255,255,255,0.92)';
    ctx.lineWidth = Math.max(0.8, r * 0.35);
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-r, 0); ctx.lineTo(r, 0);
    ctx.moveTo(0, -r); ctx.lineTo(0, r);
    ctx.moveTo(-r * 0.7, -r * 0.7); ctx.lineTo(r * 0.7, r * 0.7);
    ctx.moveTo(-r * 0.7, r * 0.7); ctx.lineTo(r * 0.7, -r * 0.7);
    ctx.stroke();
    ctx.restore();
  }
  function loop() {
    if (!scene.classList.contains('active')) { raf = 0; ctx.clearRect(0, 0, W, H); return; }
    if (Math.random() < 0.75) spawn();
    const h = Math.min(acc / ACC_TARGET, 1) * maxH;
    for (let i = flakes.length - 1; i >= 0; i--) {
      const f = flakes[i];
      f.y += f.vy;
      f.x += f.vx + Math.sin(f.ph += 0.03) * 0.3;
      f.rot += f.vr;
      const col = Math.max(0, Math.min(cols - 1, Math.round(f.x - bbox.x0)));
      const snowTop = bbox.y1 - (h + baseNoise[col] * 0.6) - 2;
      if (f.y >= snowTop || f.y >= bbox.y1) { acc += 5; flakes.splice(i, 1); }
    }
    ctx.clearRect(0, 0, W, H);
    ctx.save();
    ctx.beginPath();
    ACT2_WIN.forEach((pt, i) => { i ? ctx.lineTo(pt[0], pt[1]) : ctx.moveTo(pt[0], pt[1]); });
    ctx.closePath();
    ctx.clip();
    if (h > 1.5) {
      ctx.fillStyle = 'rgba(248,251,255,0.95)';
      ctx.beginPath();
      ctx.moveTo(bbox.x0, bbox.y1);
      for (let x = bbox.x0; x <= bbox.x1; x += 3) {
        const col = Math.round(x - bbox.x0);
        ctx.lineTo(x, bbox.y1 - (h + baseNoise[col] * 0.6));
      }
      ctx.lineTo(bbox.x1, bbox.y1);
      ctx.closePath();
      ctx.fill();
    }
    flakes.forEach(f => drawFlake(f.x, f.y, f.r, f.rot));
    ctx.restore();
    if (!done && acc >= ACC_TARGET) {
      done = true;
      hint.textContent = '雪花堆满窗台啦 · 下一幕';
      gsap.to(hint, { opacity: 1, duration: 0.8 });
      setTimeout(() => {
        if (!gone && currentScene === 10) { gone = true; goToScene(11); }
      }, 1600);
    }
    raf = requestAnimationFrame(loop);
  }
  act2Particles(document.getElementById('pc-snow'), 'snow');
  loop();
};

// ============================================================
//  第二幕 粒子引擎（gold / rain / snow）
// ============================================================
function act2Particles(canvas, kind) {
  const ctx = canvas.getContext('2d');
  const W = canvas.width = 750, H = canvas.height = 1334;
  const density = (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) ? 0.68 : 1;
  const cfg = {
    gold: { n: 260, v: () => ({ x: Math.random() * W, y: -20 - Math.random() * H * 0.5, vy: 0.6 + Math.random() * 1.2, vx: (Math.random() - 0.5) * 0.3, r: 1 + Math.random() * 2.2, c: 'rgba(255,' + (190 + Math.floor(Math.random() * 40)) + ',90,', a: 0.35 + Math.random() * 0.4 }) },
    rain: { n: 420, v: () => ({ x: Math.random() * W, y: -30 - Math.random() * H * 0.4, vy: 7 + Math.random() * 5, vx: -0.8 - Math.random() * 1.2, len: 14 + Math.random() * 14 }) },
    snow: { n: 240, v: () => ({ x: Math.random() * W, y: -20 - Math.random() * H * 0.5, vy: 0.5 + Math.random() * 1.0, vx: (Math.random() - 0.5) * 0.5, r: 1 + Math.random() * 2.5, ph: Math.random() * Math.PI * 2, c: 'rgba(255,255,255,', a: 0.5 + Math.random() * 0.4 }) }
  }[kind];
  cfg.n = Math.max(90, Math.round(cfg.n * density));
  const pts = Array.from({ length: cfg.n }, cfg.v);
  let raf = 0;
  let lastFrame = 0;
  function loop() {
    const now = performance.now();
    if (now - lastFrame < 33) { raf = requestAnimationFrame(loop); return; }
    lastFrame = now;
    if (document.hidden) { raf = requestAnimationFrame(loop); return; }
    const scene = canvas.closest('.scene');
    if (!scene || !scene.classList.contains('active')) { raf = 0; ctx.clearRect(0, 0, W, H); return; }
    ctx.clearRect(0, 0, W, H);
    if (kind === 'rain') {
      ctx.lineWidth = 1.2;
      ctx.lineCap = 'round';
      for (const p of pts) {
        p.y += p.vy; p.x += p.vx;
        if (p.y > H + 30) { p.y = -30; p.x = Math.random() * W; }
        ctx.strokeStyle = 'rgba(120,175,225,' + (0.25 + Math.random() * 0.3) + ')';
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + p.vx * 3, p.y + p.len);
        ctx.stroke();
      }
    } else {
      for (const p of pts) {
        p.y += p.vy;
        if (kind === 'snow') { p.x += p.vx + Math.sin(p.ph += 0.02) * 0.4; }
        else { p.x += p.vx; }
        if (p.y > H + 20) { p.y = -20; p.x = Math.random() * W; }
        ctx.fillStyle = p.c + p.a + ')';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    raf = requestAnimationFrame(loop);
  }
  loop();
}

// 第二幕已改为占位，原左右滑动切换天气的手势处理已移除（避免干扰第一幕常青藤场景）。

// ---- 1.6 聊天气泡（由独立开发页合并） ----
const CHAT16_DATA = [
  { t:'2020-08-07 23:28:01', who:'jiang', text:'你好呀' },
  { t:'2020-08-07 23:28:20', who:'me', text:'˃̶͈🐽˂̶͈' },
  { t:'2020-08-07 23:28:21', who:'jiang', text:'温尔雅' },
  { t:'2020-08-07 23:28:25', who:'me', text:'你好呀' },
  { t:'2020-08-07 23:28:42', who:'me', text:'就叫我粥鱼就好啦' },
  { t:'2020-08-07 23:28:50', who:'jiang', text:'好的' },
  { t:'2020-08-07 23:28:56', who:'jiang', text:'你在哪上学啊' },
  { t:'2020-08-07 23:29:04', who:'me', text:'新疆！' },
  { t:'2020-08-07 23:29:18', who:'me', text:'你呢(◦˙▽˙◦)' },
  { t:'2020-08-07 23:29:45', who:'jiang', text:'哇塞' },
  { t:'2020-08-07 23:29:47', who:'jiang', text:'新疆' },
  { t:'2020-08-07 23:29:55', who:'jiang', text:'我在广东东莞' },
  { t:'2020-08-07 23:30:03', who:'jiang', text:'新疆诶' },
  { t:'2020-08-07 23:30:05', who:'jiang', text:'天哪' },
  { t:'2020-08-07 23:30:24', who:'jiang', text:'你是新疆人吗👀' },
  { t:'2020年10月5日 02:13:11', who:'jiang', text:'我觉得我们是24K纯金友谊' },
  { t:'2020年10月5日 22:49:44', who:'jiang', text:'和网友分享的内容尺度越来越大' },
  { t:'2020年10月5日 22:50:03', who:'jiang', text:'等我有能力了就去去面基[旺柴]' },
  { t:'2020年12月5日 19:29:04', who:'jiang', text:'你说我要叫你什么好呢' },
  { t:'2020年12月5日 19:29:17', who:'jiang', text:'话说你知道我叫什么吗[旺柴]' },
  { t:'2020年12月5日 19:29:44', who:'me', text:'小江同学[让我看看]' },
  { t:'2020年12月5日 19:30:29', who:'jiang', text:'江什么[旺柴]' },
  { t:'2020年12月5日 19:31:20', who:'jiang', text:'WOC' },
  { t:'2020年12月5日 19:31:27', who:'jiang', text:'快告诉我你叫什么' },
  { t:'2020年12月5日 19:31:29', who:'jiang', text:'快快快' },
  { t:'2020年12月5日 19:31:41', who:'jiang', text:'噢[旺柴]' },
  { t:'2020年12月5日 19:31:49', who:'jiang', text:'悦是我没想到的' },
  { t:'2020年12月5日 19:31:59', who:'jiang', text:'好亲切妈妈啊' },
  { t:'2020年12月5日 19:32:03', who:'jiang', text:'天哪' },
  { t:'2020年12月5日 19:32:25', who:'jiang', text:'悦' },
  { t:'2020年12月5日 19:32:30', who:'jiang', text:'啊！' },
  { t:'2020年12月5日 19:33:02', who:'jiang', text:'噢噢噢噢噢噢' },
  { t:'2020年12月5日 19:33:06', who:'jiang', text:'悦儿' },
  { t:'2020年12月5日 19:33:09', who:'jiang', text:'大宝贝AAAAA' },
  { t:'2021年2月10日 22:40:40', who:'me', text:'耶 我们一起过的第一个除夕夜' },
  { t:'2021年2月10日 22:41:18', who:'jiang', text:'第一次有一个聊的不亦乐乎的网友[跳跳]' },
  { t:'2021年2月10日 22:41:40', who:'me', text:'[跳跳]我也是！' }
];
const CHAT16_EMOJI = {
  '亲亲':'💋', '流泪':'😭', '蛋糕':'🎂', '阴险':'😏', '哇':'😮',
  '苦涩':'😖', 'OK':'👌', '太阳':'☀️', '庆祝':'🎉',
  '呲牙':'😁', '捂脸':'🤦', '可怜':'🥺', '色':'😍', '哇哇':'😲'
};
const CHAT16_AV = { me:'assets/分镜v1/素材/粉色头像.png', jiang:'assets/分镜v1/素材/蓝色头像.png' };
const CHAT16_AV_CACHE = {};

function chat16Text(value) {
  let html = (value || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return html.replace(/\[([^\]]+)\]/g, (match, name) => {
    const emoji = CHAT16_EMOJI[name];
    if (emoji) return '<span class="chat-emoji">' + emoji + '</span>';
    // 其余方括号表情用「聊天记录工具」那套微信表情 PNG（[旺柴] [转圈] [让我看看] …）
    const sticker = window.App && window.App.stickerHTML ? window.App.stickerHTML(name) : null;
    return sticker || match;
  });
}

function chat16DrawBubble(bubble, side) {
  const w = bubble.offsetWidth, h = bubble.offsetHeight;
  if (w < 2 || h < 2) return;
  const svg = bubble.querySelector('.chat-bubble-svg');
  const r = Math.min(14, h * 0.28);
  const tail = Math.min(11, h * 0.22);
  const tailH = tail * 1.35;
  const tailY = h * 0.22;
  const d = side === 'left'
    ? `M ${tail+r},0 L ${w-r},0 Q ${w},0 ${w},${r} L ${w},${h-r} Q ${w},${h} ${w-r},${h} L ${tail+r},${h} Q ${tail},${h} ${tail},${h-r} L ${tail},${tailY+tailH} L 0,${tailY+tailH/2} L ${tail},${tailY} L ${tail},${r} Q ${tail},0 ${tail+r},0 Z`
    : `M ${r},0 L ${w-tail-r},0 Q ${w-tail},0 ${w-tail},${r} L ${w-tail},${tailY} L ${w},${tailY+tailH/2} L ${w-tail},${tailY+tailH} L ${w-tail},${h-r} Q ${w-tail},${h} ${w-tail-r},${h} L ${r},${h} Q 0,${h} 0,${h-r} L 0,${r} Q 0,0 ${r},0 Z`;
  const pattern = side === 'left' ? 'chatWcYellow' : 'chatWcGreen';
  const base = side === 'left' ? '#fff0b8' : '#e2f0b0';
  svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
  svg.innerHTML = `<path d="${d}" fill="${base}"/><path d="${d}" fill="url(#${pattern})"/>`;
}

function chat16LoadAvatar(src) {
  if (CHAT16_AV_CACHE[src]) return CHAT16_AV_CACHE[src];
  CHAT16_AV_CACHE[src] = new Promise(resolve => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
  return CHAT16_AV_CACHE[src];
}

function chat16DrawAvatar(canvas) {
  chat16LoadAvatar(canvas.dataset.src).then(img => {
    if (!img) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    ctx.restore();
  });
}

sceneInit[5] = function() {
  if (window._chat16Timer) clearTimeout(window._chat16Timer);
  const stream = document.getElementById('chat-stream');
  const transitionLine = document.getElementById('chat-transition-line');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let index = 0;
  let scrollY = 0;
  let lastChatDate = '';

  gsap.killTweensOf(stream);
  gsap.killTweensOf(transitionLine);
  stream.innerHTML = '';
  gsap.set(stream, { y: 0, opacity: 1 });
  gsap.set(transitionLine, { opacity: 0 });

  function fadeTop() {
    Array.from(stream.children).forEach(el => {
      const y = el.offsetTop - scrollY;
      el.style.opacity = y < 150 ? Math.max(0, y / 150).toFixed(2) : '1';
    });
  }

  function updateScroll() {
    scrollY = Math.max(0, stream.scrollHeight - (DESIGN_H - 120));
    gsap.to(stream, { y: -scrollY, duration: .7, ease: 'power2.out', onUpdate: fadeTop });
  }

  function buildRow(message) {
    const side = message.who === 'me' ? 'left' : 'right';
    const chatDate = message.t.includes(' ') ? message.t.split(' ')[0] : message.t.slice(0, 10);
    if (chatDate !== lastChatDate) {
      const time = document.createElement('div');
      time.className = 'chat-time';
      time.textContent = chatDate;
      stream.appendChild(time);
      lastChatDate = chatDate;
    }
    const row = document.createElement('div');
    row.className = 'chat-msg-row ' + side;
    const avatar = document.createElement('canvas');
    avatar.className = 'chat-avatar';
    avatar.width = 120; avatar.height = 120;
    avatar.dataset.src = side === 'left' ? CHAT16_AV.me : CHAT16_AV.jiang;
    const wrap = document.createElement('div');
    wrap.className = 'chat-bubble-wrap';
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble ' + side;
    bubble.innerHTML = '<svg class="chat-bubble-svg"></svg><div class="chat-bubble-text">' + chat16Text(message.text) + '</div>';
    wrap.appendChild(bubble);
    row.appendChild(avatar);
    row.appendChild(wrap);
    stream.appendChild(row);
    requestAnimationFrame(() => { chat16DrawBubble(bubble, side); chat16DrawAvatar(avatar); });
    return row;
  }

  function finishChat() {
    window._chat16Timer = setTimeout(() => {
      if (currentScene !== 5) return;
      gsap.to(stream, { opacity: 0, duration: 1.4, ease: 'power1.inOut', onComplete: () => {
        if (currentScene !== 5) return;
        gsap.to(transitionLine, { opacity: 1, duration: 1.0, ease: 'power1.out' });
        window._chat16Timer = setTimeout(() => {
          if (currentScene === 5) goToScene(6);
        }, 2200);
      } });
    }, 2600);
  }

  function playNext() {
    if (currentScene !== 5) return;
    if (index >= CHAT16_DATA.length) { finishChat(); return; }
    const message = CHAT16_DATA[index];
    const row = buildRow(message, index++);
    gsap.fromTo(row, { opacity: 0 }, {
      opacity: 1, duration: .55, ease: 'power1.out',
      onStart: updateScroll,
      onComplete: () => { setTimeout(fadeTop, 50); }
    });
    const delay = 1300 + Math.min(900, message.text.length * 22);
    window._chat16Timer = setTimeout(playNext, delay);
  }

  if (reduced) {
    CHAT16_DATA.forEach(buildRow);
    updateScroll();
  } else {
    playNext();
  }
};
// 第二幕已全部改为占位：7 起均为空场景
for (let i = 7; i < sceneOrder.length; i++) {
  sceneInit[i] = function() {};
}

// ============================================================
//  键盘调试快捷键（开发期，正式版可移除）
// ============================================================
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight' || e.key === ' ') {
    e.preventDefault();
    if (currentScene < sceneOrder.length - 1) goToScene(currentScene + 1);
  }
  if (e.key === 'ArrowLeft') {
    e.preventDefault();
    if (currentScene > 0) goToScene(currentScene - 1);
  }
});

// ============================================================
//  启动
// ============================================================
sceneInit[0]();
updateProgress();
/* 进度条粒子改由全局核心统一初始化 */

// 占位场景点击进入下一幕（开发期方便导航）
document.querySelectorAll('.placeholder-scene').forEach((el, i) => {
  el.style.cursor = 'pointer';
  el.onclick = () => {
    const idx = sceneOrder.indexOf(el.id);
    if (idx < sceneOrder.length - 1) goToScene(idx + 1);
  };
});



/* ================= 合并注入：模块导出 ================= */
(function(){
  var scenes = window.App.manifestScenes(__actNo);
  if (typeof goToScene === 'function') {
    var __origGTS = goToScene;
    goToScene = function(i, o){
      if (i >= scenes.length) { if (i === scenes.length) window.App.next(); return; }
      if (i < 0) return;
      var r = __origGTS(i, o);
      window.App.syncLocal(__actNo, i);
      return r;
    };
  }
  var call = function(fn){ try { if (typeof fn === 'function') fn(); } catch (e) { console.warn('act1 初始化异常:', e); } };
  window.App.register(__actNo, {
    scenes: scenes,
    show: function(local, opts){
      if (typeof goToScene === 'function') goToScene(local, opts);
    },
    enter: function(){ call(function(){ resize(); }); __resumeRaf(); }
  });
  if (__actNo === 5) {
    var __act5Root = document.getElementById('act-5');
    if (__act5Root) __act5Root.addEventListener('pointerup', function () {
      if (typeof S5 !== 'undefined' && S5.finished && window.App && window.App.next) window.App.next();
    });
  }
})();

})(window, document, gsap);
