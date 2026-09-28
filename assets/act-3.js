(function(window, document, gsap){

/* ================= 合并运行时沙箱（自动生成，勿手改）================= */
var __realWin = window;
var __realDoc = document;
var __actNo = 3;
var __root = __realDoc.getElementById('act-3');
var __App = __realWin.App;
function __isActive(){ return __App.isActive(__actNo); }
function __scope(sel){
  sel = String(sel);
  if (!sel || sel.indexOf('#act-3') === 0) return sel;
  return '#act-3 ' + sel;
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


// ============================================================
//  第三幕 3.1 绝迹词汇（独立开发页，遵守 DEVELOPMENT.md）
//  - 750×1334 设计尺寸，等比缩放居中（resize 同主文件模板）
//  - 动画只用 transform + opacity（禁 top/left 动画）
//  - 真实词表（用户提供）：数组顺序 = 频次排名（从大到小），
//    字号/透明度按排名自动递减；页面坐标铺满全页散开
//  - 擦除顺序：就近擦除（从橡皮停靠点贪心找最近词，不强制从上到下）
//  - 橡皮初始不在页面：点击后渐显 → 停稳 → 再移动擦除
//    橡皮锚点 = 橡皮头尖端（图左下白头），用尖端对准词擦
//  - 合并主文件时：本页 sceneOrder 局部索引 0 → sceneInit[16]
// ============================================================
const ACT3_LOST_WORDS = [
  { t:'东华',     x:350, y:920 },
  { t:'救命',     x:520, y:1008 },
  { t:'好家伙',   x:150, y:115 },
  { t:'giao',     x:340, y:200 },
  { t:'核酸',     x:560, y:115 },
  { t:'小叔',     x:640, y:205 },
  { t:'试卷',     x:140, y:292 },
  { t:'返校',     x:500, y:288 },
  { t:'晚修',     x:300, y:382 },
  { t:'口罩',     x:620, y:378 },
  { t:'会谢',     x:110, y:472 },
  { t:'跑操',     x:430, y:468 },
  { t:'慕了',     x:580, y:558 },
  { t:'立体几何', x:250, y:560 },
  { t:'默写',     x:450, y:650 },
  { t:'监狱',     x:100, y:652 },
  { t:'写信',     x:280, y:742 },
  { t:'小柴胡',   x:620, y:738 },
  { t:'新冠',     x:130, y:832 },
  { t:'日记本',   x:470, y:828 },
  { t:'邮筒',     x:650, y:915 },
  { t:'水灵灵',   x:160, y:1012 },
  { t:'斯国一',   x:400, y:1100 }
];

// 字号/透明度按频次排名递减：第 1 名 47px 最实，第 23 名 27px 最淡
ACT3_LOST_WORDS.forEach((w, i) => {
  w.s = Math.round(59 - i * 0.9);
  w.o = +(0.82 - i * 0.012).toFixed(2);
});

// 擦除顺序：从上到下就近——按 y 分带（每带≈130px），带间从上到下，带内贪心就近。
// 第一带在顶部，从画布左上角(0,0)出发，所以第一个擦的必然是左上角词（好家伙）。
const ACT3_ERASE_ORDER = (function () {
  const W = ACT3_LOST_WORDS;
  const bands = {};
  W.forEach((w, i) => { const b = Math.round(w.y / 130); (bands[b] = bands[b] || []).push(i); });
  const keys = Object.keys(bands).map(Number).sort((a, b) => a - b);
  const ord = []; let cur = { x: 0, y: 0 };
  keys.forEach(bk => {
    const arr = bands[bk].slice();
    while (arr.length) {
      let bi = -1, bd = Infinity;
      for (const i of arr) {
        const w = W[i];
        const d = (w.x - cur.x) ** 2 + (w.y - cur.y) ** 2;
        if (d < bd) { bd = d; bi = i; }
      }
      ord.push(bi); cur = W[bi];
      arr.splice(arr.indexOf(bi), 1);
    }
  });
  return ord;
})();

const DESIGN_W = 750, DESIGN_H = 1334;
const REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const act3 = { tl:null, raf:0, parts:[], started:false, done:false };

// ===== 适配：等比缩放居中（与主文件 resize 一致）=====
const stage = document.getElementById('stage');
function resize() {
  const s = Math.min(window.innerWidth / DESIGN_W, window.innerHeight / DESIGN_H);
  stage.style.transform = 'scale(' + s + ')';
  stage.style.left = ((window.innerWidth - DESIGN_W * s) / 2) + 'px';
  stage.style.top = ((window.innerHeight - DESIGN_H * s) / 2) + 'px';
}
window.addEventListener('resize', resize);
resize();

// ===== Canvas：物理像素对齐（按当前缩放×dpr 取样）=====
function act3FitCanvas(cv) {
  const s = Math.min(window.innerWidth / DESIGN_W, window.innerHeight / DESIGN_H);
  const dpr = Math.min((window.devicePixelRatio || 1) * s, 3);
  cv.width = Math.round(DESIGN_W * dpr);
  cv.height = Math.round(DESIGN_H * dpr);
  cv.getContext('2d').setTransform(dpr, 0, 0, dpr, 0, 0);
}
function act3ClearCanvases() {
  [document.getElementById('act3Trace'), document.getElementById('act3Fx')].forEach((cv) => {
    act3FitCanvas(cv);
    cv.getContext('2d').clearRect(0, 0, DESIGN_W, DESIGN_H);
  });
}

function act3Build() {
  const wrap = document.getElementById('act3Words');
  wrap.innerHTML = '';
  ACT3_LOST_WORDS.forEach((w, i) => {
    const el = document.createElement('img');
    el.className = 'act3-word';
    el.src = 'assets/第三幕-絮语/words/' + String(i).padStart(2, '0') + '.png';
    el.alt = w.t;
    el.style.left = w.x + 'px';
    el.style.top = w.y + 'px';
    el.style.setProperty('--o', w.o);
    el.style.animation = 'none';
    el.style.opacity = '0';
    wrap.appendChild(el);
    // 以 (w.x,w.y) 为词中心：橡皮尖端会移动到此处擦除
    gsap.set(el, { xPercent: -50, yPercent: -50 });
  });
}

function act3Reset() {
  if (act3.tl) { act3.tl.kill(); act3.tl = null; }
  if (act3._openTl) { act3._openTl.kill(); act3._openTl = null; }
  cancelAnimationFrame(act3.raf); act3.raf = 0;
  act3.parts = []; act3.started = false; act3.done = false;
  act3Build();
  // 橡皮初始不在页面：透明 + 停在右下待显位置
  // 锚点 = 橡皮头尖端：像素级实测在图的 (8.4%, 70.9%)
  // 注意 xPercent/yPercent 必须为负（把图内该点挪到 x,y 上），
  // transformOrigin 同点 → 旋转时以尖端为轴
  const firstW = ACT3_LOST_WORDS[ACT3_ERASE_ORDER[0]];
  gsap.set('#act3Eraser', { x: firstW.x, y: firstW.y, rotation: -12, xPercent: -8, yPercent: -71, transformOrigin: '8% 71%', scale: 0.9, opacity: 0 });
  gsap.set('#act3Open', { opacity: 0 });
  gsap.set('#act3Caption', { opacity: 0 });
  gsap.set('#act3Narr', { opacity: 0 });
  gsap.set('#act3Words .act3-word', { opacity: 0 });
  document.querySelectorAll('#act3Words .act3-word').forEach((el) => {
    el.style.visibility = 'visible';
    el.style.animation = 'none';
  });
  act3._adv = false;
  act3ClearCanvases();
}

// ===== 粒子（灰烬：只出现在擦除瞬间，全局 ≤320）=====
function act3SpawnAsh(px, py, n) {
  for (let i = 0; i < n; i++) {
    const up = 30 + Math.random() * 34;        // 向上初速度
    const drift = (Math.random() - 0.5) * 18;  // 水平飘移
    act3.parts.push({
      x: px + (Math.random() - 0.5) * 60,
      y: py + (Math.random() - 0.5) * 22,
      vx: drift,
      vy: -up,
      g: 5 + Math.random() * 8,                 // 很轻的重力，让它慢慢飘上去再散
      r: 1.6 + Math.random() * 2.8,
      a: 0.55 + Math.random() * 0.25,
      life: 2.2 + Math.random() * 1.4,
      t: 0,
      phase: Math.random() * Math.PI * 2,       // 摇摆相位
      warm: Math.random() < 0.35                // 部分粒子偏暖，像真灰烬
    });
  }
  if (act3.parts.length > 320) act3.parts.splice(0, act3.parts.length - 320);
  if (!act3.raf) act3Tick();
}

function act3Tick() {
  const cv = document.getElementById('act3Fx');
  const ctx = cv.getContext('2d');
  let last = 0;
  function frame(now) {
    const dt = Math.min(((now - last) / 1000) || 0.016, 0.05);
    last = now;
    ctx.clearRect(0, 0, DESIGN_W, DESIGN_H);
    for (let i = act3.parts.length - 1; i >= 0; i--) {
      const q = act3.parts[i];
      q.t += dt;
      q.vy += q.g * dt;
      const sway = Math.sin(q.t * 1.6 + q.phase) * 5;
      q.x += (q.vx + sway) * dt;
      q.y += q.vy * dt;
      const k = 1 - q.t / q.life;
      if (k <= 0) { act3.parts.splice(i, 1); continue; }
      ctx.globalAlpha = Math.min(q.a, 1) * k;
      // 灰蓝色灰烬：主调偏冷蓝灰，部分偏暖灰蓝
      const c = q.warm ? [168,184,214] : [142,162,198];
      ctx.fillStyle = 'rgb(' + c[0] + ',' + c[1] + ',' + c[2] + ')';
      const grow = 1 + (1 - k) * 0.7;          // 越飘越散
      ctx.beginPath();
      ctx.arc(q.x, q.y, q.r * grow, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    if (act3.parts.length) { act3.raf = requestAnimationFrame(frame); }
    else { act3.raf = 0; ctx.clearRect(0, 0, DESIGN_W, DESIGN_H); }
  }
  act3.raf = requestAnimationFrame(frame);
}

// 擦痕：极淡灰色椭圆，落在 trace 层
function act3Smudge(px, py, rw) {
  const ctx = document.getElementById('act3Trace').getContext('2d');
  const grad = ctx.createRadialGradient(px, py, 0, px, py, rw);
  grad.addColorStop(0, 'rgba(140,134,124,0.10)');
  grad.addColorStop(1, 'rgba(140,134,124,0)');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.ellipse(px, py, rw, rw * 0.45, 0, 0, Math.PI * 2);
  ctx.fill();
}

// ===== 擦除（只用 transform：橡皮 x/y + rotation + opacity）=====
function act3Erase() {
  if (act3.started || act3.done) return;
  act3.started = true;
  if (act3._openTl) { act3._openTl.kill(); act3._openTl = null; }
  gsap.set('#act3Open', { opacity: 0 });
  gsap.set('#act3Narr', { opacity: 0 });

  if (REDUCED) {
    // 降级：直接终态，无粒子
    gsap.killTweensOf(document.querySelectorAll('#act3Words .act3-word'));
    const els = document.querySelectorAll('#act3Words .act3-word');
    ACT3_LOST_WORDS.forEach((w, i) => {
      els[i].style.animation = 'none';
      els[i].style.opacity = 0;
      act3Smudge(w.x, w.y, Math.max(40, w.t.length * w.s * 0.6));
    });
    document.getElementById('act3Caption').textContent = '但是似乎很久没有再说过了……';
    gsap.to('#act3Caption', { opacity: 0.92, duration: 0.6, ease: 'power1.inOut' });
    act3.done = true;
    gsap.delayedCall(2.0, () => { if (!act3._adv) { act3._adv = true; goToScene(1); } });
    return;
  }

  const eraser = document.getElementById('act3Eraser');
  const words = Array.from(document.querySelectorAll('#act3Words .act3-word'));
  gsap.killTweensOf(words);
  // 擦除顺序：从上到下就近——从画布左上角出发，每次移动到"当前未擦词中最近的一个"
  const order = ACT3_ERASE_ORDER;
  const tl = gsap.timeline();
  act3.tl = tl;
  // 擦除可以在词语入场动画尚未结束时触发；先统一恢复可见状态，
  // 再由时间线逐个淡出，避免“橡皮在动但词已经全透明”的空擦。
  words.forEach((el) => {
    el.style.visibility = 'visible';
    const o = parseFloat(el.style.getPropertyValue('--o')) || 0.8;
    gsap.set(el, { opacity: o });
  });

  // 1) 橡皮在左上角第一个词处渐渐浮现（opacity + 轻微放大，ease-out）
  tl.to(eraser, { opacity: 1, scale: 1, duration: 0.9, ease: 'power2.out' }, 0);
  // 完全浮现后轻晃一下，像"开始擦了"
  tl.to(eraser, { rotation: '+=4', yoyo: true, repeat: 3, duration: 0.3, ease: 'sine.inOut' }, 0.95);

  // 2) 浮现完成后，从首个词（左上角）开始，就近逐个擦除
  const first = ACT3_LOST_WORDS[order[0]];
  let t = 1.35;
  order.forEach((idx, k) => {
    const w = ACT3_LOST_WORDS[idx];
    const el = words[idx];
    const d = 0.34 * (1 + (k / order.length) * 1.0); // 越擦越犹豫（ease-in-out 移动）
    if (k > 0) {
      tl.to(eraser, { x: w.x, y: w.y, duration: d, ease: 'power1.inOut' }, t);
      t += d;
    }
    tl.add(() => {
      el.style.animation = 'none';
      // 短暂变实 0.2s：像被最后一次想起（PNG 图片只调 opacity，无可调 color）
      gsap.fromTo(el, { opacity: 1 }, {
        opacity: 0, duration: 0.28, delay: 0.2,
        onComplete: () => { el.style.visibility = 'hidden'; }
      });
      act3SpawnAsh(w.x, w.y, 11);
      act3Smudge(w.x, w.y, Math.max(44, (el.naturalWidth || el.offsetWidth) * 0.62));
    }, t - d * 0.5);
  });

  // 3) 擦完：仅「但是似乎很久没有再说过了……」→ 淡去 → 自动进 3.2
  //    （"不过新的词语正在登场！猜一猜…"已移到 3.2 开场 #act32Prompt，避免与 3.2 原提示语重复）
  const cap = document.getElementById('act3Caption');
  tl.add(() => { act3.done = true; }, t);
  tl.add(() => { cap.textContent = '但是似乎很久没有再说过了……'; }, t + 1.0);
  tl.to(cap, { opacity: 0.92, duration: 1.2, ease: 'power1.inOut' }, t + 1.0);
  tl.to(cap, { opacity: 0, duration: 1.0, ease: 'power1.inOut' }, t + 3.4);
  tl.add(() => { if (!act3._adv) { act3._adv = true; goToScene(1); } }, t + 5.0);
}

// ===== 入场（DEVELOPMENT.md 规范：sceneInit[N]；本页局部索引 0，
//      合并主文件时改为 sceneInit[16]）=====
function act3Scene1Init() {
  const scene = document.getElementById('scene-3-1');
  if (act3._onClick) scene.removeEventListener('click', act3._onClick);
  act3Reset();
  // 开场：标题先现 → 淡去 → 词语淡入并开始呼吸
  const words = document.querySelectorAll('#act3Words .act3-word');
  const tl0 = gsap.timeline();
  tl0.to('#act3Open', { opacity: 1, duration: 1.0, ease: 'power1.out' });
  tl0.to('#act3Open', { opacity: 0, duration: 1.0, ease: 'power1.inOut' }, '+=0.9');
  tl0.to(words, { opacity: (i, el) => parseFloat(el.style.getPropertyValue('--o')) || 0.8, duration: 1.0, stagger: 0.02 }, '<');
  tl0.add(() => {
    words.forEach((el) => {
      const o = parseFloat(el.style.getPropertyValue('--o')) || 0.8;
      gsap.to(el, { opacity: o * 0.8, duration: 2.2 + Math.random() * 1.2, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: Math.random() * 0.6 });
    });
  });
  act3._openTl = tl0;
  act3._onClick = (e) => {
    if (act3.done) { if (!act3._adv) { act3._adv = true; goToScene(1); } return; }
    if (!act3.started) { if (act3._openTl) { act3._openTl.kill(); act3._openTl = null; } act3Erase(); }
  };
  scene.addEventListener('click', act3._onClick);
}
const sceneInit = [];
sceneInit[0] = act3Scene1Init;   // 独立页局部索引；合并主文件时 → sceneInit[16]

// ===== 场景转场：淡出当前 → 切 active → 淡入 → 触发目标 sceneInit =====
function goToScene(idx) {
  const cur = document.querySelector('.scene.active');
  const next = document.querySelectorAll('.scene')[idx];
  if (!next || cur === next) return;
  const showBridge = false;
  gsap.to(cur, { opacity: 0, duration: 0.7, ease: 'power1.inOut', onComplete: () => {
    cur.classList.remove('active');
    next.classList.add('active');
    gsap.fromTo(next, { opacity: 0 }, { opacity: 1, duration: 0.7 });
    if (typeof sceneInit[idx] === 'function') sceneInit[idx]();
  }});
  // 3.1→3.2 中段浮现桥接文案
  if (showBridge) {
    const b = document.getElementById('act3Bridge');
    gsap.set(b, { opacity: 0 });
    gsap.timeline()
      .to(b, { opacity: 0.95, duration: 0.7, delay: 0.35, ease: 'power1.inOut' })
      .to(b, { opacity: 0, duration: 0.7, delay: 1.25, ease: 'power1.inOut' });
  }
}

// ?jump=N 直接跳到第 N 幕(1-based)，便于预览 3.4/3.5 无需过完前序交互
const _jumpParam = new URLSearchParams(location.search).get('jump');
if (_jumpParam) { const _j = parseInt(_jumpParam, 10); if (_j >= 1 && _j <= 6) setTimeout(() => goToScene(_j - 1), 350); }

// ===== 启动（独立页：单场景直接进；合并后由 goToScene 驱动）=====
act3Scene1Init();

// R 键重置（开发期，合并时移除）
document.addEventListener('keydown', (e) => {
  if (e.key === 'r' || e.key === 'R') act3Scene1Init();
});

// ?auto=1 自动触发擦除（开发期截图验证用，合并时移除）
if (new URLSearchParams(location.search).has('auto')) setTimeout(act3Erase, 2000);

// ?debug=1 显示词中心红点与橡皮头尖端绿点（合并时移除）
// ?pos=N  静态把橡皮放在第 N 个词上（不擦除，测对齐）
if (new URLSearchParams(location.search).has('debug')) {
  const debugLayer = document.createElement('div');
  debugLayer.id = 'act3Debug';
  debugLayer.style.cssText = 'position:absolute;inset:0;z-index:99;pointer-events:none;';
  ACT3_LOST_WORDS.forEach(w => {
    const d = document.createElement('div');
    d.style.cssText = `position:absolute;left:${w.x}px;top:${w.y}px;width:6px;height:6px;background:#ff4444;border-radius:50%;transform:translate(-50%,-50%);`;
    debugLayer.appendChild(d);
  });
  document.getElementById('scene-3-1').appendChild(debugLayer);
  const posParam = new URLSearchParams(location.search).get('pos');
  if (posParam !== null) {
    const idx = Math.max(0, Math.min(ACT3_LOST_WORDS.length - 1, parseInt(posParam, 10) || 0));
    const w = ACT3_LOST_WORDS[idx];
    gsap.set('#act3Eraser', { x: w.x, y: w.y, rotation: -12, xPercent: -8, yPercent: -71, scale: 1, opacity: 1 });
  }
}

// ========== 第三幕 3.2 新生词汇（IIFE 隔离，命名空间 act32，避免与 3.1 的 const 冲突）==========

(function () {
// 750×1334 设计尺寸，等比缩放居中（复用 #stage，坐标变量本作用域私有）
const WORDS = [
  { t:'苹果',     year:2021, total:42,  first:'2021-01-31', peak:'2026-7 提及最多，共提及 8 次' },
  { t:'病毒',     year:2022, total:17,  first:'2022-08-14', peak:'2023-3 提及最多，共提及 6 次' },
  { t:'市场营销', year:2022, total:9,   first:'2022-07-29', peak:'2024-4 提及最多，共提及 2 次' },
  { t:'薛之谦',   year:2023, total:362, first:'2022-07-14', peak:'2026-7 提及最多，共提及 188 次' },
  { t:'演唱会',   year:2023, total:220, first:'2022-03-14', peak:'2026-7 提及最多，共提及 59 次' },
  { t:'实习',     year:2024, total:77,  first:'2023-06-29', peak:'2025-5 提及最多，共提及 13 次' },
  { t:'武汉',     year:2024, total:63,  first:'2023-06-19', peak:'2025-2 提及最多，共提及 15 次' },
  { t:'保研',     year:2024, total:61,  first:'2023-10-21', peak:'2024-8 提及最多，共提及 22 次' },
  { t:'考研',     year:2024, total:43,  first:'2023-06-30', peak:'2024-8 提及最多，共提及 9 次' },
  { t:'机票',     year:2024, total:39,  first:'2023-07-22', peak:'2024-5 提及最多，共提及 6 次' },
  { t:'抢票',     year:2024, total:29,  first:'2024-03-25', peak:'2026-7 提及最多，共提及 7 次' },
  { t:'野人',     year:2024, total:7,   first:'2024-10-12', peak:'2026-3 提及最多，共提及 2 次' },
  { t:'拼豆',     year:2025, total:30,  first:'2023-07-01', peak:'2025-9 提及最多，共提及 14 次' },
  { t:'离职',     year:2025, total:14,  first:'2025-06-11', peak:'2026-8 提及最多，共提及 6 次' },
  { t:'实习生',   year:2025, total:8,   first:'2025-05-29', peak:'2025-6 提及最多，共提及 4 次' },
  { t:'带教',     year:2025, total:7,   first:'2025-06-18', peak:'2025-6 提及最多，共提及 2 次' },
  { t:'万兽之王', year:2026, total:34,  first:'2026-06-23', peak:'2026-7 提及最多，共提及 16 次' },
  { t:'专辑',     year:2026, total:18,  first:'2025-05-27', peak:'2026-7 提及最多，共提及 14 次' },
  { t:'缝纫机',   year:2026, total:16,  first:'2026-07-06', peak:'2026-7 提及最多，共提及 8 次' },
  { t:'情歌',     year:2026, total:15,  first:'2022-03-04', peak:'2026-7 提及最多，共提及 8 次' },
  { t:'雅典娜',   year:2026, total:14,  first:'2026-07-23', peak:'2026-7 提及最多，共提及 7 次' },
  { t:'天蓝色',   year:2026, total:10,  first:'2026-07-30', peak:'2026-8 提及最多，共提及 6 次' },
  { t:'美高梅',   year:2026, total:8,   first:'2026-07-19', peak:'2026-7 提及最多，共提及 5 次' },
  { t:'戒断',     year:2026, total:7,   first:'2024-10-10', peak:'2026-7 提及最多，共提及 5 次' },
  { t:'出票',     year:2026, total:7,   first:'2026-06-30', peak:'2026-7 提及最多，共提及 4 次' }
];

const DESIGN_W = 750, DESIGN_H = 1334;
const REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const SKIP_MIN = 3;                       // 看过≥3个后可点空白跳下一幕
const answer = WORDS.reduce((a, b) => b.total > a.total ? b : a); // 薛之谦(362)

// 频率 → 深浅（对数映射，跨度 7..362）
const LO = Math.log(7), HI = Math.log(362);
function shadeOf(c) {
  const t = (Math.log(c) - LO) / (HI - LO);
  return +(0.75 + 0.25 * Math.min(1, Math.max(0, t))).toFixed(2);
}
WORDS.forEach(w => { w.o = shadeOf(w.total); w.scale = 1.0; w.viewed = false; });

// 每词的淡彩光颜色（黄金角均匀取色 → 25 色各不相同、整体柔和，不刺眼不土）
function glowColor(i) {
  const h = (i * 137.508) % 360;
  return `hsla(${h.toFixed(1)}, 58%, 64%, 0.92)`;
}

// 预载 PNG 真实尺寸（用于碰撞半径）
const sizes = new Array(WORDS.length);
let sizeLoadStarted = false;
let sizeLoadCallbacks = [];
function preloadSizes(cb) {
  if (sizes.every(Boolean)) { cb(); return; }
  sizeLoadCallbacks.push(cb);
  if (sizeLoadStarted) return;
  sizeLoadStarted = true;
  let n = 0;
  const fin = () => {
    if (++n !== WORDS.length) return;
    const callbacks = sizeLoadCallbacks.splice(0);
    callbacks.forEach(fn => fn());
  };
  WORDS.forEach((w, i) => {
    const im = new Image();
    im.decoding = 'async';
    im.onload = () => { sizes[i] = { w: im.naturalWidth, h: im.naturalHeight }; fin(); };
    im.onerror = () => { sizes[i] = { w: 140, h: 70 }; fin(); };
    im.src = 'assets/第三幕-絮语/新生词汇_words/' + String(i).padStart(2, '0') + '.png';
  });
}
// 先在上一幕播放期间建立请求，避免进入 3.2 后再等待整批图片。
preloadSizes(() => {});

// 伪随机（固定种子 → 每次刷新布局一致，便于微调）
function mulberry32(a){ return function(){ a|=0; a=a+0x6D2B79F5|0; let t=Math.imul(a^a>>>15,1|a); t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; }; }

// 布局：词云式螺旋紧贴填充（最大词居中，其余从中心向外螺旋找首个不重叠位）
function computeLayout(words, sizes) {
  // 最大词固定在 750×1334 画布的真实中心，避免进入合并版后视觉上偏上。
  const CX = DESIGN_W / 2, CY = DESIGN_H / 2;
  const minX = 55, maxX = 695, minY = 200, maxY = 1255;
  const GAP = 14;
  const rnd = mulberry32(20260831);
  const idx = words.map((w, i) => i).sort((a, b) => words[b].total - words[a].total);
  const rad = {};
  idx.forEach(i => { const s = sizes[i] || { w: 140, h: 70 }; rad[i] = { rw: s.w / 2 + 4, rh: s.h / 2 + 4 }; });
  const placed = [];
  function fits(x, y, rw, rh) {
    if (x - rw < minX || x + rw > maxX || y - rh < minY || y + rh > maxY) return false;
    for (let p = 0; p < placed.length; p++) {
      const q = placed[p];
      if (Math.abs(x - q.x) < rw + q.rw + GAP && Math.abs(y - q.y) < rh + q.rh + GAP) return false;
    }
    return true;
  }
  const i0 = idx[0];
  placed.push({ i: i0, x: CX, y: CY, rw: rad[i0].rw, rh: rad[i0].rh });
  const r0 = rad[i0].rh;
  for (let k = 1; k < idx.length; k++) {
    const i = idx[k], rw = rad[i].rw, rh = rad[i].rh;
    let placedFlag = false;
    let angle = rnd() * Math.PI * 2;
    const da = 0.25, b = 3.3;
    let r = r0 + rh + GAP + 10;
    for (let step = 0; step < 3000; step++) {
      const x = CX + Math.cos(angle) * r;
      const y = CY + Math.sin(angle) * r;
      if (fits(x, y, rw, rh)) { placed.push({ i, x, y, rw, rh }); placedFlag = true; break; }
      angle += da;
      r = r0 + rh + GAP + b * angle;
    }
    if (!placedFlag) {
      let x = CX + Math.cos(angle) * r, y = CY + Math.sin(angle) * r;
      x = Math.max(minX + rw, Math.min(maxX - rw, x));
      y = Math.max(minY + rh, Math.min(maxY - rh, y));
      placed.push({ i, x, y, rw, rh });
    }
  }
  words.forEach((w, i) => {
    const p = placed.find(pp => pp.i === i);
    w.x = p.x; w.y = p.y; w.rot = (rnd() * 6 - 3);
  });
}

const stage = document.getElementById('stage');
let scale = 1, stageLeft = 0, stageTop = 0;
function resize() {
  scale = Math.min(window.innerWidth / DESIGN_W, window.innerHeight / DESIGN_H);
  stage.style.transform = 'scale(' + scale + ')';
  stageLeft = (window.innerWidth - DESIGN_W * scale) / 2;
  stageTop = (window.innerHeight - DESIGN_H * scale) / 2;
  stage.style.left = stageLeft + 'px';
  stage.style.top = stageTop + 'px';
}
window.addEventListener('resize', resize);
resize();
function toDesign(clientX, clientY) {
  return { x: (clientX - stageLeft) / scale, y: (clientY - stageTop) / scale };
}

const card = document.getElementById('act32Card');
const cardWord = card.querySelector('.c-word');
const cardTotal = card.querySelector('.c-total');
const cardFirst = card.querySelector('.c-first');
const cardPeak = card.querySelector('.c-peak');
let activeEl = null;
let phase = 'birth';          // birth → guess → reveal → detail → done → next
let pendingDetail = false;
const viewed = new Set();

function hideUI() {
  gsap.to('#act32Prompt', { opacity: 0, duration: .5 });
}
function markTappable() {
  const els = document.getElementById('act32Words').children;
  for (let i = 0; i < els.length; i++) els[i].classList.add('tappable');
  const target = els[1] || els[0];
  const ripple = document.getElementById('act32Ripple');
  if (target && ripple) {
    requestAnimationFrame(() => {
      const r = target.getBoundingClientRect();
      const s = scene.getBoundingClientRect();
      const x = ((r.left + r.width * .72 - s.left) / scale) + 42;
      const y = ((r.top - s.top) / scale) - 34;
      ripple.style.left = Math.max(74, Math.min(DESIGN_W - 74, x)) + 'px';
      ripple.style.top = Math.max(180, Math.min(DESIGN_H - 180, y)) + 'px';
      gsap.to(ripple, { opacity: 1, duration: .6 });
    });
  }
}

// 把一个已点开过的词标记为"看过"：光熄灭 + 计入已看集合 + 检查是否看完
function markViewed(el) {
  if (!el) return;
  if (phase === 'detail' && !pendingDetail) {
    const i = +el.dataset.i, w = WORDS[i];
    w.viewed = true; viewed.add(i); el.classList.remove('glow'); checkComplete();
  }
}
function closeCard() {
  const el = activeEl;
  if (el) {
    const i = +el.dataset.i, w = WORDS[i];
    gsap.to(el, { scale: w.scale, duration: 0.25 });
    markViewed(el);
  }
  activeEl = null;
  gsap.to(card, { opacity: 0, duration: 0.22, onComplete: () => {
    card.style.visibility = 'hidden';
    if (pendingDetail) startDetail();
  }});
}

function openCard(w, el, isAnswer) {
  // 切换词：原来打开的那个词也算"看过"（光熄灭），无需专门点✕或空白
  if (activeEl && activeEl !== el) {
    const pw = WORDS[+activeEl.dataset.i];
    gsap.to(activeEl, { scale: pw.scale, duration: 0.2 });
    markViewed(activeEl);
  }
  activeEl = el;
  pendingDetail = !!isAnswer;
  cardWord.textContent = w.t;
  cardTotal.textContent = w.total;
  cardFirst.textContent = w.first;
  cardPeak.textContent = w.peak;
  card.style.visibility = 'hidden';
  gsap.set(card, { opacity: 0 });
  requestAnimationFrame(() => {
    const cw = card.offsetWidth, ch = card.offsetHeight;
    let cx = w.x + (w.x < DESIGN_W / 2 ? 90 : -90 - cw);
    let cy = w.y - ch / 2;
    cx = Math.max(16, Math.min(DESIGN_W - cw - 16, cx));
    cy = Math.max(150, Math.min(DESIGN_H - ch - 16, cy));
    card.style.left = cx + 'px'; card.style.top = cy + 'px';
    card.style.visibility = 'visible';
    gsap.fromTo(card, { opacity: 0, scale: 0.82, y: 14 }, { opacity: 1, scale: 1, y: 0, duration: 0.48, ease: 'back.out(1.7)' });
    gsap.to(el, { scale: w.scale * 1.12, duration: 0.25 });
  });
}

// —— 猜词 ——
function handleGuess(w, wEl) {
  gsap.to('#act32Ripple', { opacity: 0, duration: .3 });
  if (w === answer) {
    hideUI();
    spawnRightCheck(wEl, w);
    openCard(w, wEl, true);
    // The answer is the reveal moment: let the whole vocabulary enter its
    // colour state immediately, while the answer card remains open.
    const els = document.getElementById('act32Words').children;
    for (let i = 0; i < els.length; i++) {
      els[i].classList.add('glow');
      els[i].classList.remove('tappable');
    }
  } else {
    spawnWrongX(wEl, w);
  }
}
// 词语脚下的落点（水平居中于词，紧贴底部）
function footPoint(wEl, w) {
  const hh = wEl.offsetHeight / 2;
  return { x: w.x, y: w.y + hh + 4 };
}
function placeMark(svg, x, y) {
  svg.style.left = x + 'px'; svg.style.top = y + 'px';
  document.getElementById('scene-3-2').appendChild(svg);
  gsap.set(svg, { xPercent: -50, yPercent: -50 });
  gsap.fromTo(svg, { scale: 0.2, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.32, ease: 'back.out(2.2)' });
  gsap.to(svg, { opacity: 0, duration: 0.5, delay: 0.8, onComplete: () => svg.remove() });
}
function spawnWrongX(wEl, w) {
  const p = footPoint(wEl, w);
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'wrong-x');
  svg.setAttribute('viewBox', '0 0 40 40');
  svg.innerHTML = '<line x1="11" y1="11" x2="29" y2="29" /><line x1="29" y1="11" x2="11" y2="29" />';
  placeMark(svg, p.x, p.y);
}
function spawnRightCheck(wEl, w) {
  const p = footPoint(wEl, w);
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'right-check');
  svg.setAttribute('viewBox', '0 0 40 40');
  svg.innerHTML = '<path d="M11 21 L17.5 28 L30 14" />';
  placeMark(svg, p.x, p.y);
}

// —— 互动完成后：所有词泛淡彩光，进入详情阶段 ——
function startDetail() {
  pendingDetail = false;
  phase = 'detail';
  const els = document.getElementById('act32Words').children;
  for (let i = 0; i < els.length; i++) { els[i].classList.add('glow'); els[i].classList.remove('tappable'); }
}

function checkComplete() {
  if (viewed.size >= WORDS.length) finishAll();
}
function finishAll() {
  phase = 'done';
  hideUI();
  const els = document.getElementById('act32Words').children;
  for (let i = 0; i < els.length; i++) gsap.killTweensOf(els[i]);
  gsap.to(els, { opacity: 0, duration: 1.1, stagger: 0.012, ease: 'power1.in' });
  gsap.to('#act32Final', { opacity: .95, duration: 1.6, delay: 1.0, ease: 'power1.out' });
}

function goNext() {
  if (phase === 'next') return;
  phase = 'next';
  gsap.to('#scene-3-2', { opacity: 0, duration: .7, ease: 'power1.inOut', onComplete: () => {
    goToScene(2);
  }});
}

const scene = document.getElementById('scene-3-2');
scene.addEventListener('click', (e) => {
  if (editMode) return;
  // 答案卡(薛之谦)正打开时：点击任何地方都只当作"退出"(与点✕/空白等效)，不再猜、不再打叉
  if (phase === 'guess' && activeEl) { closeCard(); return; }
  const wEl = e.target.closest('.act32-word');
  if (wEl) {
    const i = +wEl.dataset.i, w = WORDS[i];
    if (phase === 'guess') handleGuess(w, wEl);
    else if (phase === 'detail') openCard(w, wEl, false);
    return;
  }
  // 空白点击：先关卡（与点 ✕ 同效，光熄灭）；无卡片且看过≥3个时，再点一次才跳下一幕
  if (card.style.visibility === 'visible') {
    closeCard();
  } else if (phase === 'detail' && viewed.size >= SKIP_MIN) {
    goNext();
  }
});
card.addEventListener('click', (e) => {
  if (e.target.closest('.c-close')) { closeCard(); return; }
  e.stopPropagation();
});

// 编辑模式：拖拽微调（?edit=1 或按 E 切换）
let editMode = false, dragEl = null, dragW = null, dsx = 0, dsy = 0, dox = 0, doy = 0;
function setEdit(on) { editMode = on; document.body.style.cursor = on ? 'crosshair' : ''; if (!on) closeCard(); }
window.addEventListener('keydown', (e) => {
  if (e.key === 'e' || e.key === 'E') setEdit(!editMode);
  else if (e.key === 'r' || e.key === 'R') initScene();
  else if (e.key === 'Escape') closeCard();
  else if ((e.key === 'p' || e.key === 'P') && editMode) {
    console.log(WORDS.map(w => `{ t:'${w.t}', x:${Math.round(w.x)}, y:${Math.round(w.y)}, rot:${Math.round(w.rot||0)} }`).join(',\n'));
  }
});
scene.addEventListener('pointerdown', (e) => {
  if (!editMode) return;
  const wEl = e.target.closest('.act32-word'); if (!wEl) return;
  dragEl = wEl; dragW = WORDS[+wEl.dataset.i];
  const p = toDesign(e.clientX, e.clientY); dsx = p.x; dsy = p.y; dox = dragW.x; doy = dragW.y;
  wEl.setPointerCapture(e.pointerId);
});
scene.addEventListener('pointermove', (e) => {
  if (!dragEl) return;
  const p = toDesign(e.clientX, e.clientY);
  dragW.x = dox + (p.x - dsx); dragW.y = doy + (p.y - dsy);
  gsap.set(dragEl, { x: dragW.x, y: dragW.y });
});
scene.addEventListener('pointerup', () => { dragEl = null; });

function act32Build() {
  const wrap = document.getElementById('act32Words');
  wrap.innerHTML = '';
  WORDS.forEach((w, i) => {
    const el = document.createElement('img');
    el.className = 'act32-word';
    el.src = 'assets/第三幕-絮语/新生词汇_words/' + String(i).padStart(2, '0') + '.png';
    el.alt = w.t;
    el.dataset.i = i;
    wrap.appendChild(el);
    gsap.set(el, { xPercent: -50, yPercent: -50, x: w.x, y: w.y, rotation: w.rot || 0, opacity: 0, scale: w.scale * 0.5 });
    el.style.setProperty('--o', w.o);
    el.style.setProperty('--glow', glowColor(i));
  });
}

function birthAndBreathe() {
  const els = document.getElementById('act32Words').children;
  WORDS.forEach((w, i) => {
    const el = els[i];
    if (REDUCED) { gsap.set(el, { opacity: w.o, scale: w.scale }); return; }
    gsap.to(el, {
      opacity: w.o, scale: w.scale, duration: 0.9, delay: i * 0.05,
      ease: 'power2.out',
      onComplete: () => {
        if (!REDUCED) gsap.to(el, { opacity: w.o * 0.85, duration: 2 + Math.random() * 1.2, repeat: -1, yoyo: true, ease: 'sine.inOut' });
      }
    });
  });
}

function initScene() {
  phase = 'birth';
  viewed.clear();
  pendingDetail = false; activeEl = null;
  gsap.set('#act32Final', { opacity: 0 });
  gsap.set('#act32Prompt', { opacity: 0 });
  gsap.set('#act32Ripple', { opacity: 0 });
  const _nextScene = document.getElementById('scene-next');
  if (_nextScene) _nextScene.classList.remove('active');
  document.getElementById('scene-3-3').classList.remove('active');
  document.getElementById('scene-3-2').classList.add('active');
  gsap.set('#scene-3-2', { opacity: 1 });

  // 先等真实 PNG 尺寸，再一次性排版；原文件的节奏是“顶部提示 -> 提示退场 -> 词云出现”，
  // 不让提示语与词语共享中心区域，也避免占位尺寸造成词语先出现后跳位。
  preloadSizes(() => {
    if (!document.getElementById('scene-3-2').classList.contains('active')) return;
    computeLayout(WORDS, sizes);
    act32Build();
    if (REDUCED) {
      birthAndBreathe();
      phase = 'guess';
      markTappable();
      gsap.set('#act32Prompt', { opacity: .96 });
      return;
    }
    const tl = gsap.timeline();
    tl.to('#act32Prompt', { opacity: .96, duration: 1.0, delay: 0.35, ease: 'power1.out' })
      .to('#act32Prompt', { opacity: 0, duration: 0.9, ease: 'power1.inOut' }, '+=1.0')
      .add(() => { birthAndBreathe(); phase = 'guess'; markTappable(); });
  });
}
sceneInit[1] = initScene;   // 本页局部索引 1；合并主文件时整体偏移（+16）

// ?debug=1 显示词中心红点（合并时移除）
if (new URLSearchParams(location.search).has('debug')) {
  const dl = document.createElement('div');
  dl.style.cssText = 'position:absolute;inset:0;z-index:99;pointer-events:none;';
  WORDS.forEach(w => {
    const d = document.createElement('div');
    d.style.cssText = `position:absolute;left:${w.x}px;top:${w.y}px;width:6px;height:6px;background:#ff4444;border-radius:50%;transform:translate(-50%,-50%);`;
    dl.appendChild(d);
  });
  scene.appendChild(dl);
}
})();

// 开发期徽标（合并回主文件时删除）
(function() {
  void 0 /* 独立开发页徽标已由构建脚本移除 */;
})();

// 字体状态自检已移除：词汇改为 PNG 图片方案，手写体必然显示。
(function () {
const WORDS = [
  // 小周（0..9）暖橘/杏
  { t:'要不然',  who:'zhou',  self:65, other:1 },
  { t:'平常',    who:'zhou',  self:51, other:1 },
  { t:'哇哇',    who:'zhou',  self:34, other:3 },
  { t:'据说',    who:'zhou',  self:33, other:0 },
  { t:'尖叫',    who:'zhou',  self:29, other:0 },
  { t:'balabala',who:'zhou',  self:22, other:0 },
  { t:'TT',      who:'zhou',  self:18, other:0 },
  { t:'笑鼠',    who:'zhou',  self:16, other:0 },
  { t:'嘎嘎',    who:'zhou',  self:15, other:2 },
  { t:'美女子',  who:'zhou',  self:8,  other:2 },
  // 江江（10..32）雾蓝/薄紫
  { t:'好家伙',  who:'jiang', self:70, other:2 },
  { t:'OK',      who:'jiang', self:65, other:3 },
  { t:'giao',    who:'jiang', self:59, other:0 },
  { t:'玩意',    who:'jiang', self:50, other:2 },
  { t:'一大堆',  who:'jiang', self:49, other:3 },
  { t:'闺蜜',    who:'jiang', self:48, other:2 },
  { t:'可不可以',who:'jiang', self:47, other:3 },
  { t:'无语',    who:'jiang', self:36, other:2 },
  { t:'美妙',    who:'jiang', self:26, other:1 },
  { t:'说实话',  who:'jiang', self:23, other:0 },
  { t:'我勒个',  who:'jiang', self:23, other:2 },
  { t:'晚修',    who:'jiang', self:20, other:2 },
  { t:'然而',    who:'jiang', self:20, other:0 },
  { t:'老是',    who:'jiang', self:20, other:0 },
  { t:'诡异',    who:'jiang', self:20, other:3 },
  { t:'于是乎',  who:'jiang', self:19, other:0 },
  { t:'不得了',  who:'jiang', self:19, other:0 },
  { t:'Baby',    who:'jiang', self:18, other:0 },
  { t:'emmmmm',  who:'jiang', self:16, other:0 },
  { t:'求求',    who:'jiang', self:16, other:2 },
  { t:'没招',    who:'jiang', self:16, other:2 },
  { t:'着实',    who:'jiang', self:15, other:0 },
  { t:'请问',    who:'jiang', self:15, other:2 }
];
const WHO = {
  zhou:  { name:'小周', self:'小周', other:'江江' },
  jiang: { name:'江江', self:'江江', other:'小周' }
};

// ===== 真实句子弹幕（仅句子，无说话人/日期；按词分组）=====
const DANMAKU = {
  "要不然": [
    { who: 'zhou', t: "要不然老师会吐槽嘛hhh" },
    { who: 'zhou', t: "每次我跟别人说话要不然我仰头要不然他们俯身" },
    { who: 'zhou', t: "要不然就是拉上好朋友一起" },
    { who: 'zhou', t: "要不然是新烤的 要不然是受潮了" },
    { who: 'zhou', t: "要不然有门没锁" },
    { who: 'zhou', t: "要不然是三个人物事例" },
    { who: 'zhou', t: "要不然我真的听不懂" },
    { who: 'zhou', t: "要不然假期听听奇哥的课" },
    { who: 'zhou', t: "要不然就在讲台上唱黄土高坡" },
    { who: 'zhou', t: "要不然我以为什么都没发生" },
    { who: 'zhou', t: "要不然我会直接考虑去乌鲁木齐" },
    { who: 'zhou', t: "要不然我为什么这么了解旁边的米粉" },
    { who: 'zhou', t: "要不然寻找很贵但包邮的" },
    { who: 'zhou', t: "要不然就是 陕西省奎屯市……" },
    { who: 'zhou', t: "要不然就是神话" },
    { who: 'zhou', t: "要不然在门口会被看无数次（？）" },
    { who: 'zhou', t: "要不然抄材料" },
    { who: 'zhou', t: "要不然就是搞一些少数民族风格的" },
    { who: 'zhou', t: "然后他的同学要不然是种出了西红柿要不然做了一个超级厉害的事情" },
    { who: 'zhou', t: "要不然去美国吧" },
    { who: 'zhou', t: "要不然一天都没有" },
    { who: 'zhou', t: "要不然就是套模板" },
    { who: 'zhou', t: "要不然夏天来" },
    { who: 'zhou', t: "要不然你现在开始剪" },
    { who: 'zhou', t: "要不然就不写了" },
    { who: 'zhou', t: "要不然dream一个新疆成为包邮区也可以" },
    { who: 'zhou', t: "要不然158小女孩会玉玉的" },
    { who: 'zhou', t: "要不然他怎么能开到新疆的" },
    { who: 'zhou', t: "要不然看完演唱会什么都没了" },
    { who: 'zhou', t: "要不然就是导购帅帅的" },
    { who: 'zhou', t: "要不然就会！索然无味！" },
    { who: 'zhou', t: "我要不然进末九转专业" },
    { who: 'zhou', t: "要不然明天" },
    { who: 'zhou', t: "要不然留本校也行" },
    { who: 'zhou', t: "要不然我就要盘算带椒麻鸡还是奶疙瘩" },
    { who: 'zhou', t: "要不然火车坐三天" },
    { who: 'zhou', t: "要不然直达两三千" },
    { who: 'zhou', t: "感觉我去支教要不然在西北的大漠要不然在东北的深山" },
    { who: 'zhou', t: "要不然我会有灰暗的大一下" },
    { who: 'zhou', t: "要不然没地洗漱了" },
    { who: 'zhou', t: "要不然你们都滚啊啊啊啊" },
    { who: 'zhou', t: "要不然空教室也行" },
    { who: 'zhou', t: "要不然回族小孩就不会这么辛苦的找清真餐厅了" },
    { who: 'zhou', t: "要不然新疆孩子期中包垫底的" },
    { who: 'zhou', t: "要不然我要当一辈子野人了" },
    { who: 'zhou', t: "要不然红眼航班六七百" },
    { who: 'zhou', t: "要不然我去北京" },
    { who: 'zhou', t: "要不然我是女孩子" },
    { who: 'zhou', t: "要不然活都你干了" },
    { who: 'zhou', t: "要不然自己开酒店" },
    { who: 'zhou', t: "要不然你拿那种输液的板子" },
    { who: 'zhou', t: "他最好是解释清楚了要不然老师还以为是学生的问题" },
    { who: 'zhou', t: "回家的话要不然上海要不然东北" },
    { who: 'zhou', t: "我不行了你要不然买个吧" },
  ],
  "giao": [
    { who: 'jiang', t: "giao" },
    { who: 'jiang', t: "giao啊" },
    { who: 'jiang', t: "giao" },
    { who: 'jiang', t: "giao" },
    { who: 'jiang', t: "giao" },
    { who: 'jiang', t: "giao" },
    { who: 'jiang', t: "giao" },
    { who: 'jiang', t: "giao" },
    { who: 'jiang', t: "giao啊" },
    { who: 'jiang', t: "giao啊" },
    { who: 'jiang', t: "giao" },
    { who: 'jiang', t: "真的是giao啊" },
    { who: 'jiang', t: "giao" },
    { who: 'jiang', t: "giaogiao" },
    { who: 'jiang', t: "giao" },
    { who: 'jiang', t: "giao啊" },
    { who: 'jiang', t: "giao" },
    { who: 'jiang', t: "giao" },
    { who: 'jiang', t: "giao" },
    { who: 'jiang', t: "giao啊" },
    { who: 'jiang', t: "giao" },
    { who: 'jiang', t: "giao" },
    { who: 'jiang', t: "giao" },
    { who: 'jiang', t: "giao" },
    { who: 'jiang', t: "giao" },
    { who: 'jiang', t: "giao" },
    { who: 'jiang', t: "giao" },
    { who: 'jiang', t: "giao我偏科太可怕了" },
    { who: 'jiang', t: "giao周报" },
    { who: 'jiang', t: "我giao那种题目哈哈哈哈哈" },
    { who: 'jiang', t: "giao我纯属给自己找事" },
    { who: 'jiang', t: "giao我的岂不是PPT馅" },
    { who: 'jiang', t: "giao文思泉涌天哪" },
    { who: 'jiang', t: "giao" },
    { who: 'jiang', t: "giao七层其实够他跳的" },
    { who: 'jiang', t: "giao这也" },
    { who: 'jiang', t: "giao" },
    { who: 'jiang', t: "giao" },
    { who: 'jiang', t: "giao" },
    { who: 'jiang', t: "giao" },
    { who: 'jiang', t: "giao发现过后大概七八年我的农历生日只有2026年那一次在国庆里" },
    { who: 'jiang', t: "giao" },
    { who: 'jiang', t: "giao元旦还不休" },
    { who: 'jiang', t: "我giao为什么没有微信符号）" },
    { who: 'jiang', t: "giao？" },
    { who: 'jiang', t: "giao三百" },
    { who: 'jiang', t: "giao下下周期中考" },
    { who: 'jiang', t: "giao" },
    { who: 'jiang', t: "giao啊哈哈哈哈哈哈" },
    { who: 'jiang', t: "giao" },
    { who: 'jiang', t: "giao" },
    { who: 'jiang', t: "giao江苏来的称霸" },
    { who: 'jiang', t: "giao" },
    { who: 'jiang', t: "giao你们的天这么这么摆" },
    { who: 'jiang', t: "giao我爸的名言" },
    { who: 'jiang', t: "giao25岁的方谏简直了OMG" },
    { who: 'jiang', t: "giao？" },
  ],
  "玩意": [
    { who: 'jiang', t: "我以前也喜欢这玩意" },
    { who: 'jiang', t: "什么玩意" },
    { who: 'jiang', t: "这玩意好好玩" },
    { who: 'jiang', t: "这玩意好好写有机会登校报" },
    { who: 'jiang', t: "这啥玩意啊" },
    { who: 'jiang', t: "这什么玩意" },
    { who: 'jiang', t: "现在看什么玩意" },
    { who: 'jiang', t: "啥玩意啊这" },
    { who: 'jiang', t: "什么玩意" },
    { who: 'jiang', t: "给你整了两好玩意" },
    { who: 'jiang', t: "上了高中感觉就兴这玩意" },
    { who: 'jiang', t: "真的有这玩意" },
    { who: 'jiang', t: "那玩意叫每日一练" },
    { who: 'jiang', t: "老师说这玩意应该去幼儿园" },
    { who: 'jiang', t: "什么玩意啊" },
    { who: 'jiang', t: "？这是啥玩意" },
    { who: 'jiang', t: "這玩意好帥？" },
    { who: 'jiang', t: "這玩意" },
    { who: 'jiang', t: "中考靠着玩意" },
    { who: 'jiang', t: "就这玩意" },
    { who: 'jiang', t: "但真的这玩意什么都能刷" },
    { who: 'jiang', t: "这玩意都能发我真的是觉得很奇怪" },
    { who: 'jiang', t: "就这这玩意" },
    { who: 'jiang', t: "那什么玩意你知道吗" },
    { who: 'jiang', t: "好家伙葵糕可以有这玩意" },
    { who: 'jiang', t: "这玩意我妹当水杯" },
    { who: 'jiang', t: "这玩意也可以演戏吗" },
    { who: 'jiang', t: "啥玩意事" },
    { who: 'jiang', t: "这玩意不是叫" },
    { who: 'jiang', t: "真的这玩意太讲求自信" },
    { who: 'jiang', t: "这玩意好简单的" },
    { who: 'jiang', t: "这玩意考什么" },
    { who: 'jiang', t: "这玩意真难搞" },
    { who: 'jiang', t: "这玩意难搞啊" },
    { who: 'jiang', t: "我真的和这群玩意很像吗" },
    { who: 'jiang', t: "我去这玩意我额高考的时候天天做" },
    { who: 'jiang', t: "这玩意让我一直流鼻涕" },
    { who: 'jiang', t: "这玩意高中学过吗" },
    { who: 'jiang', t: "我当时买的时候心里就想这玩意和田玉？红色的？骗鬼呢" },
    { who: 'jiang', t: "啊？这玩意能响" },
    { who: 'jiang', t: "什么玩意" },
    { who: 'jiang', t: "这玩意是" },
    { who: 'jiang', t: "啥玩意" },
    { who: 'zhou', t: "我坐的离机械臂太远了啊啊我第一次看还在想那是啥玩意" },
    { who: 'jiang', t: "笑死了啥玩意 也是给她赚了哈哈哈" },
    { who: 'jiang', t: "啥玩意" },
    { who: 'jiang', t: "这啥玩意我去搜搜" },
    { who: 'jiang', t: "我说啥玩意" },
    { who: 'jiang', t: "不行，这啥玩意这乱七八糟的，我在网易云听了，好奇怪" },
    { who: 'jiang', t: "这玩意像漫展饭制品" },
  ],
  "一大堆": [
    { who: 'jiang', t: "然后就听到两个叔叔呜哩哇啦一大堆" },
    { who: 'jiang', t: "一大堆根本写不完" },
    { who: 'jiang', t: "一大堆章到处都是" },
    { who: 'jiang', t: "今天那真的一大堆贝壳类" },
    { who: 'jiang', t: "我真的要带一大堆补水" },
    { who: 'jiang', t: "车上一大堆新疆人" },
    { who: 'jiang', t: "我们关于梦的聊天记录都一大堆" },
    { who: 'jiang', t: "说他们那边一大堆这样的" },
    { who: 'jiang', t: "一大堆可怕的截止" },
    { who: 'jiang', t: "刚刚偷偷把剩菜扔掉了一大堆" },
    { who: 'jiang', t: "和看了一大堆日剧日漫" },
    { who: 'jiang', t: "想到给我们定了一大堆书 最后剩了一大堆" },
    { who: 'jiang', t: "读英语 快读晕倒了 为什么教材全是英文还有一大堆我不认识的单词" },
    { who: 'jiang', t: "来北京上学 一大堆园子等着你逛" },
    { who: 'jiang', t: "然后她的一大堆丑照" },
    { who: 'jiang', t: "打算回来之前还要去哪里买一大堆草莓" },
    { who: 'jiang', t: "刚刚取了一大堆外卖买了一大堆零食" },
    { who: 'jiang', t: "每一次我都要预留一大堆时间 特别是机场的话那就更加要留一大堆时间在机场瞎溜达瞎逛" },
    { who: 'jiang', t: "想起来我高考完也是自己一个人盖了一大堆章子" },
    { who: 'jiang', t: "最下面那一行的一大堆都非常好看" },
    { who: 'zhou', t: "我有一大堆愿望要许" },
    { who: 'jiang', t: "我上次看到一大堆肯德基麦当劳送上车" },
    { who: 'jiang', t: "商院也是一大堆转专业" },
    { who: 'jiang', t: "一不小心给我下载一大堆我不要的" },
    { who: 'jiang', t: "每天都要流一大堆鼻涕 完完全全的堵住了" },
    { who: 'jiang', t: "我这个学期学了一大堆课就为了刷分" },
    { who: 'jiang', t: "青指真的贪污一大堆" },
    { who: 'jiang', t: "我们法院每年一大堆人转去" },
    { who: 'jiang', t: "一大堆在那里" },
    { who: 'jiang', t: "每天都要上一大堆课" },
    { who: 'jiang', t: "但是宝宝你装了一大堆东西" },
    { who: 'jiang', t: "一大堆大人来" },
    { who: 'zhou', t: "我们这边一大堆小孩来" },
    { who: 'jiang', t: "我的天哪吃一大堆也差不多就四五十那这样" },
    { who: 'jiang', t: "乌泱泱坐了一大堆" },
    { who: 'jiang', t: "给我一大堆笔记真题" },
    { who: 'jiang', t: "我每次吃火锅都要打一大堆来吃" },
    { who: 'jiang', t: "学校种了一大堆牡丹" },
    { who: 'jiang', t: "哎呦喂投了一大堆" },
    { who: 'jiang', t: "买了一大堆花移栽到这里来" },
    { who: 'jiang', t: "说明面试官已经捞了一大堆人来面试" },
    { who: 'jiang', t: "终于考完了一大堆东西了" },
    { who: 'jiang', t: "那个人和我解释一大堆 作为财大的学生我很愧疚[" },
    { who: 'jiang', t: "其实我今天看这么一大堆，我感觉这个世界实在是癫狂" },
    { who: 'zhou', t: "我也没想到后面会有一大堆事情像鬼一样冒出来追着我跑" },
    { who: 'jiang', t: "看到一大堆绣球花即将前往" },
    { who: 'jiang', t: "按理来说，最近特朗普马斯克一大堆人来，应该VPN全部修好" },
    { who: 'jiang', t: "我拍了一大堆照片，我说等一下，等一下，回来看看，筛选一下，删吧，我知道有的可能就是他没有那么完美，但是我现在舍不得删了" },
    { who: 'jiang', t: "限购1这些买一大堆的人太厉害了" },
    { who: 'jiang', t: "这里一大堆布" },
    { who: 'jiang', t: "还有其他的，还有一大堆" },
    { who: 'jiang', t: "刚刚我在搜闲鱼寄快递，发现一大堆差评" },
  ],
  "哇哇": [
    { who: 'jiang', t: "哇哇哇呜呜呜呜" },
    { who: 'zhou', t: "哇哇哇" },
    { who: 'zhou', t: "哇哇哇哇哇" },
    { who: 'jiang', t: "哇哇哇哇哇好酷肯定酷爆了" },
    { who: 'jiang', t: "哇哇哇宝宝这是哪" },
    { who: 'zhou', t: "哇哇哇好幸福" },
    { who: 'zhou', t: "哇哇哇" },
    { who: 'zhou', t: "哇哇哇" },
    { who: 'zhou', t: "哇哇哇" },
    { who: 'zhou', t: "哇哇哇" },
    { who: 'zhou', t: "哇哇哇我在火车上" },
    { who: 'zhou', t: "哇哇哇" },
    { who: 'zhou', t: "哇哇哇回家真好！" },
    { who: 'jiang', t: "结果呜哇就哭出来了 在候机楼抱着爸爸妈妈哇哇大哭" },
    { who: 'zhou', t: "哇哇哇吃到啦" },
    { who: 'zhou', t: "哇哇哇哇哇" },
    { who: 'zhou', t: "哇哇哇" },
    { who: 'zhou', t: "哇哇哇" },
    { who: 'zhou', t: "哇哇哇哇恭喜呀！！！" },
    { who: 'zhou', t: "哇哇哇哇哇" },
    { who: 'zhou', t: "哇哇哇" },
    { who: 'zhou', t: "哇哇哇" },
    { who: 'zhou', t: "哇哇哇哇" },
    { who: 'zhou', t: "我也想去学游泳哇哇哇" },
    { who: 'zhou', t: "哇哇哇" },
    { who: 'zhou', t: "哇哇哇真好" },
    { who: 'zhou', t: "哇哇哇哇哇好好好好" },
    { who: 'zhou', t: "哇哇哇哇" },
    { who: 'jiang', t: "突然哇哇大哭" },
    { who: 'zhou', t: "哇哇" },
    { who: 'zhou', t: "哇哇" },
    { who: 'zhou', t: "哇哇哇！" },
    { who: 'zhou', t: "哇哇哇哇哈哈哈哈" },
    { who: 'zhou', t: "哇哇哇哇哇" },
    { who: 'zhou', t: "哇哇哇哇哇哇哇" },
  ],
  "尖叫": [
    { who: 'zhou', t: "[可怜][可怜]新疆一周下雨超过两天我就会尖叫发疯" },
    { who: 'zhou', t: "（蠕动）（发疯）（尖叫）" },
    { who: 'zhou', t: "我在出租车上发疯尖叫" },
    { who: 'zhou', t: "（尖叫（扭曲（蠕动" },
    { who: 'zhou', t: "只能躲在角落看丧尸发疯尖叫扭曲阴暗地爬行" },
    { who: 'zhou', t: "然后我一直追 它飞得很快很快 边飞边发出尖叫" },
    { who: 'zhou', t: "人类的尖叫" },
    { who: 'zhou', t: "（尖叫）" },
    { who: 'zhou', t: "（尖叫）" },
    { who: 'zhou', t: "（尖叫）" },
    { who: 'zhou', t: "（尖叫*2）" },
    { who: 'zhou', t: "（尖叫）" },
    { who: 'zhou', t: "飞机有没有学生优惠啊（尖叫）" },
    { who: 'zhou', t: "（尖叫）" },
    { who: 'zhou', t: "（尖叫）" },
    { who: 'zhou', t: "（尖叫）" },
    { who: 'zhou', t: "（尖叫）" },
    { who: 'zhou', t: "（尖叫）" },
    { who: 'zhou', t: "（尖叫" },
    { who: 'zhou', t: "（尖叫" },
    { who: 'zhou', t: "（尖叫" },
    { who: 'zhou', t: "（尖叫" },
    { who: 'zhou', t: "（尖叫" },
    { who: 'zhou', t: "（尖叫" },
    { who: 'zhou', t: "（尖叫" },
    { who: 'zhou', t: "（尖叫" },
    { who: 'zhou', t: "（尖叫" },
    { who: 'zhou', t: "（尖叫" },
    { who: 'zhou', t: "（尖叫" },
    { who: 'zhou', t: "而且我发现我以前不会尖叫" },
    { who: 'zhou', t: "尖叫声淹没了歌声" },
  ],
  "美妙": [
    { who: 'jiang', t: "太美妙了想起我做过一张全错的三卷" },
    { who: 'jiang', t: "如果可以听一场自己偶像的演唱会那将是无比美妙的一件事" },
    { who: 'jiang', t: "音乐好美妙" },
    { who: 'jiang', t: "啊太美妙了" },
    { who: 'jiang', t: "好美妙的校园环境啊" },
    { who: 'jiang', t: "非常美妙的睡眠呀" },
    { who: 'jiang', t: "但还好我的课表非常美妙啊" },
    { who: 'jiang', t: "非常美妙了" },
    { who: 'jiang', t: "天哪，这非常美妙了" },
    { who: 'jiang', t: "非常美妙啊，这个牛奶。" },
    { who: 'jiang', t: "洗完了澡，感觉非常美妙。" },
    { who: 'jiang', t: "那就非常美妙了。明天再吃一次" },
    { who: 'jiang', t: "实在是美妙啊" },
    { who: 'jiang', t: "阴天也有阴天的美妙" },
    { who: 'jiang', t: "果然非常美妙" },
    { who: 'zhou', t: "我选择了最美妙的一张" },
    { who: 'jiang', t: "美妙之啊这个公司" },
    { who: 'jiang', t: "哎呀，这感觉看了一场演唱会，然后入坑，非常美妙" },
    { who: 'jiang', t: "感觉喜欢一个人喜欢这么多年是一件很美妙的事情" },
    { who: 'jiang', t: "实在是很厉害啊，今天感觉非常美妙啊" },
    { who: 'jiang', t: "为什么他报了还是给你存呀？你不是只有100G的空间吗？他居然还可以继续存，那太美妙了" },
    { who: 'jiang', t: "实在是很厉害啊，今天感觉非常美妙啊" },
    { who: 'jiang', t: "好美妙啊" },
    { who: 'jiang', t: "其实很美妙了" },
    { who: 'jiang', t: "哎很美妙了" },
    { who: 'jiang', t: "很美妙" },
    { who: 'jiang', t: "好美妙，其实我觉得可行的" },
  ],
  "emmmmm": [
    { who: 'jiang', t: "其实这样的分班制度emmmmm" },
    { who: 'jiang', t: "emmmmm我想想" },
    { who: 'jiang', t: "emmmmm要重写噢" },
    { who: 'jiang', t: "学校的洗衣机emmmmmm" },
    { who: 'jiang', t: "emmmmm考完了" },
    { who: 'jiang', t: "我觉得emmmmm" },
    { who: 'jiang', t: "emmmmm学校不考虑加个链子吗" },
    { who: 'jiang', t: "弹射的英语emmmmm" },
    { who: 'jiang', t: "但是牌坊街emmmmm感觉变了味道准确来说是没有味道了" },
    { who: 'jiang', t: "水蜜桃软软的可能就emmmmm没那么喜欢" },
    { who: 'jiang', t: "历史emmmmm他的阶段划分就是很诡异" },
    { who: 'jiang', t: "emmmmm难道是羊肉串味的" },
    { who: 'jiang', t: "emmmmmm" },
    { who: 'jiang', t: "可是这次的语文作文emmmmm不如去年" },
    { who: 'jiang', t: "那emmmmmmmm" },
    { who: 'jiang', t: "那看看emmmmmm乌鲁木齐有没有亲戚什么的" },
    { who: 'jiang', t: "emmmmmmm" },
    { who: 'jiang', t: "我们。。。。。。。emmmmm" },
    { who: 'jiang', t: "emmmmmmmmm" },
    { who: 'jiang', t: "卷发棒emmmmmmmmm卷发棒已经不知道去哪了" },
    { who: 'jiang', t: "emmmmmmm可能是还是更加靠海" },
    { who: 'jiang', t: "emmmmmmm" },
    { who: 'jiang', t: "emmmmm" },
    { who: 'jiang', t: "emmmmm" },
  ],
  "我勒个": [
    { who: 'jiang', t: "我去哈哈哈哈哈笑死我了我勒个都" },
    { who: 'jiang', t: "我勒个豆啊，小姐姐你包强实力的" },
    { who: 'zhou', t: "我勒个豆" },
    { who: 'jiang', t: "我勒个大拿" },
    { who: 'jiang', t: "我勒个苍天大地便宜早餐啊" },
    { who: 'jiang', t: "我勒个苍天大地运送费啊" },
    { who: 'jiang', t: "我勒个童心向党啊" },
    { who: 'jiang', t: "我勒个灯光秀啊" },
    { who: 'jiang', t: "我勒个一桌子钱呀" },
    { who: 'jiang', t: "我勒个交换学校堪比变形记啊" },
    { who: 'zhou', t: "我勒个" },
    { who: 'jiang', t: "我勒个马长啊" },
    { who: 'jiang', t: "我勒个走1公里" },
    { who: 'jiang', t: "我勒个又停电了" },
    { who: 'jiang', t: "我勒个亿万富翁校友" },
    { who: 'jiang', t: "我勒个" },
    { who: 'jiang', t: "我勒个校友啊" },
    { who: 'jiang', t: "我勒个逗可怜的baby" },
    { who: 'jiang', t: "我勒个大逃杀呀" },
    { who: 'jiang', t: "我勒个雨姐" },
    { who: 'jiang', t: "我勒个贡品" },
    { who: 'jiang', t: "我勒个斩杀线" },
    { who: 'jiang', t: "我勒个" },
    { who: 'jiang', t: "我勒个民国风" },
    { who: 'jiang', t: "我勒个经济上行的歌曲" },
  ],
  "求求": [
    { who: 'jiang', t: "别考法律了求求" },
    { who: 'jiang', t: "千万别去考求求你了没有任何价值并且浪费钱" },
    { who: 'jiang', t: "求求了让我有学上吧[" },
    { who: 'jiang', t: "在地上打滚：美女美女你就做我老婆吧求求你了" },
    { who: 'jiang', t: "求求北方温带大陆 南方亚热带季风" },
    { who: 'jiang', t: "我去我求求你拿下他" },
    { who: 'jiang', t: "给我谈 求求你们了" },
    { who: 'zhou', t: "求求我517不要开出317的位置" },
    { who: 'jiang', t: "求求你一定要这么做" },
    { who: 'jiang', t: "希望我们去的时候也停下吧求求了" },
    { who: 'jiang', t: "求求了" },
    { who: 'jiang', t: "我求求老天爷给我一次机会" },
    { who: 'jiang', t: "我要保研求求你了我一定会努力学习的" },
    { who: 'jiang', t: "老师我错了，求求你老师老师老师我错了，求求你老师" },
    { who: 'jiang', t: "说求求你了" },
    { who: 'zhou', t: "求求你了" },
    { who: 'jiang', t: "薛之谦求求你了" },
    { who: 'jiang', t: "老师求求你爽快答应吧" },
    { who: 'jiang', t: "再做拼豆那个物料，那个手就要不行了。千万不能做拼豆物料，我求求他了" },
  ],
  "请问": [
    { who: 'jiang', t: "请问其意义" },
    { who: 'jiang', t: "请问广东包邮吗" },
    { who: 'jiang', t: "请问这是哪一科" },
    { who: 'zhou', t: "各高校来宣传，隔壁文科班：您好请问一下有没有不学高数的专业推荐？" },
    { who: 'jiang', t: "请问这会对从北方回来的我造成什么伤害" },
    { who: 'jiang', t: "请问柿子有几个放在树上不摘" },
    { who: 'jiang', t: "我请问我如果真能145+我为什么不直接高考裸分走清北呢" },
    { who: 'jiang', t: "硬卧上面只有三个插座是怎么回事我请问呢" },
    { who: 'jiang', t: "我请问呢其实可以抢的" },
    { who: 'jiang', t: "我请问什么时候可以触底反弹呢" },
    { who: 'jiang', t: "叫我们还是喝纯净水，我请问我们去哪里喝呢" },
    { who: 'jiang', t: "4点就3点了，那我请问早上是要4点吃饭吗" },
    { who: 'jiang', t: "8点就没有饭吃，我请问了我10点才起床啊" },
    { who: 'jiang', t: "请问还来得及吗" },
    { who: 'jiang', t: "中央财经大学我请问你为什么不早点出期末考试" },
    { who: 'jiang', t: "请问什么回事" },
    { who: 'jiang', t: "我请问" },
  ],
  "于是乎": [
    { who: 'jiang', t: "都多布置于是乎作业更多了" },
    { who: 'jiang', t: "于是乎我们上钉课" },
    { who: 'jiang', t: "于是乎" },
    { who: 'jiang', t: "于是乎我就乱了" },
    { who: 'jiang', t: "于是乎我是一个广东身份证却有湖南户籍" },
    { who: 'jiang', t: "于是乎我改了了个厦门大学" },
    { who: 'jiang', t: "于是乎他想要去见女友" },
    { who: 'jiang', t: "于是乎我原来提出了一个折中方案" },
    { who: 'jiang', t: "于是乎现在这个垫子变成了这样" },
    { who: 'jiang', t: "于是乎仔细听他们的话" },
    { who: 'jiang', t: "于是乎我们四个人躺在一起" },
    { who: 'jiang', t: "于是乎我要拿旧的平板但是我要去换拼" },
    { who: 'jiang', t: "于是乎我用的是" },
    { who: 'jiang', t: "于是乎我们直接选择了隔壁的串串香" },
    { who: 'jiang', t: "于是乎我说要退掉他们说好" },
    { who: 'jiang', t: "于是乎她退了然后另一个服务员端来了三碗豆花说不好意思久等了" },
    { who: 'jiang', t: "于是乎给我在意的人分了间房" },
    { who: 'jiang', t: "于是乎" },
    { who: 'jiang', t: "于是乎，我们就做一个净水器管" },
  ],
  "不得了": [
    { who: 'jiang', t: "我以为是真的，高兴的不得了" },
    { who: 'jiang', t: "这不得了啊" },
    { who: 'jiang', t: "不得了了" },
    { who: 'jiang', t: "不得了" },
    { who: 'jiang', t: "不得了不得了" },
    { who: 'jiang', t: "反正不得了" },
    { who: 'jiang', t: "正的不得了的" },
    { who: 'jiang', t: "你们那的甜的不得了" },
    { who: 'jiang', t: "这样就会说是好好好好的不得了" },
    { who: 'jiang', t: "都喜欢生物喜欢的不得了" },
    { who: 'jiang', t: "大家觉得小帅但是我喜欢就是帅的不得了" },
    { who: 'jiang', t: "这里的水果都贵的不得了" },
    { who: 'jiang', t: "笑死其实是杨树花但是恶心的不得了了" },
    { who: 'jiang', t: "就爽的不得了" },
    { who: 'jiang', t: "我去美味的不得了啊咸口的" },
    { who: 'jiang', t: "外卖员看着是三个汉堡包，开心的不得了" },
    { who: 'jiang', t: "塌的不得了了" },
    { who: 'jiang', t: "貌似不是长这个样子的，我有点记不得了" },
    { who: 'jiang', t: "满意的不得了" },
  ],
  "没招": [
    { who: 'jiang', t: "没招了，这回是真的要去上学了" },
    { who: 'jiang', t: "限电三百瓦没招了" },
    { who: 'jiang', t: "别拼豆了小姐姐实在是没招了" },
    { who: 'jiang', t: "没招了" },
    { who: 'jiang', t: "那没招了讨厌的舍友" },
    { who: 'jiang', t: "上一次从宝安机场打回我家，打了我400块，我没招了" },
    { who: 'zhou', t: "没招了没招了" },
    { who: 'zhou', t: "没招了明天就去" },
    { who: 'jiang', t: "这是真的没招了" },
    { who: 'jiang', t: "这把有点没招了" },
    { who: 'jiang', t: "我在端午的时候相中了一个电脑，那的时候买是8000多块钱，现在苹果涨价了，我没招了" },
    { who: 'jiang', t: "没招了" },
    { who: 'jiang', t: "咋显示周六晚上有雨啊？没招了" },
    { who: 'jiang', t: "没招了" },
    { who: 'jiang', t: "爱上我，没招了" },
    { who: 'jiang', t: "忘记看了，这酒店是2014年的，没招了，应该问题也不大吧" },
  ],
  "笑鼠": [
    { who: 'zhou', t: "笑鼠。" },
    { who: 'zhou', t: "笑鼠" },
    { who: 'zhou', t: "笑鼠" },
    { who: 'zhou', t: "笑鼠我发现我还是习惯性找新疆伊犁" },
    { who: 'zhou', t: "笑鼠" },
    { who: 'zhou', t: "笑鼠了" },
    { who: 'zhou', t: "笑鼠" },
    { who: 'zhou', t: "笑鼠" },
    { who: 'zhou', t: "笑鼠" },
    { who: 'zhou', t: "笑鼠" },
    { who: 'zhou', t: "笑鼠" },
    { who: 'zhou', t: "笑鼠" },
    { who: 'zhou', t: "大家都想转行吗笑鼠" },
    { who: 'zhou', t: "笑鼠了没有必要地谨慎中" },
    { who: 'zhou', t: "笑鼠我觉得那是一个很大的商业体 我们找个小店坐一下午也好" },
    { who: 'zhou', t: "笑鼠" },
    { who: 'zhou', t: "笑鼠了我们到时候去KTV吧" },
  ],
  "嘎嘎": [
    { who: 'zhou', t: "？嘎嘎嘎嘎嘎嘎嘎嘎嘎" },
    { who: 'zhou', t: "最后快交卷嘎嘎抄" },
    { who: 'zhou', t: "结果他只有数学嘎嘎写" },
    { who: 'zhou', t: "据说乌鲁木齐有个嘎嘎牛的中医" },
    { who: 'jiang', t: "嘎嘎嘎嘎嘎嘎" },
    { who: 'zhou', t: "嘎嘎脆 我怕真变成薯片就飞速炫完了" },
    { who: 'zhou', t: "我们小学数学老师说学精算嘎嘎赚钱" },
    { who: 'zhou', t: "嘎嘎地下水了" },
    { who: 'zhou', t: "东北盒饭嘎嘎好吃" },
    { who: 'zhou', t: "嘎嘎香" },
    { who: 'jiang', t: "我也要吃嘎嘎甜的草莓" },
    { who: 'zhou', t: "哈哈哈嘎嘎买一个" },
    { who: 'zhou', t: "嘎嘎嘎嘎超绝执行力" },
    { who: 'zhou', t: "嘎嘎嘎打拳归来" },
    { who: 'zhou', t: "嘎嘎嘎嘎嘎嘎" },
    { who: 'zhou', t: "嘎嘎嘎嘎嘎嘎嘎嘎" },
  ],
  "着实": [
    { who: 'jiang', t: "我着实记不得叫什么" },
    { who: 'jiang', t: "那着实有点惨" },
    { who: 'jiang', t: "着实" },
    { who: 'jiang', t: "这着实是的" },
    { who: 'jiang', t: "着实啊这" },
    { who: 'jiang', t: "但抄了十篇作文着实有点牛" },
    { who: 'jiang', t: "我觉得这着实是有一点点敷衍了" },
    { who: 'jiang', t: "着实是有点离谱了" },
    { who: 'jiang', t: "感觉着实需要沉淀了" },
    { who: 'jiang', t: "这紫峰大厦着实是很诱人啊" },
    { who: 'jiang', t: "对呀，但我着实没那么多钱" },
    { who: 'jiang', t: "着实让我跃跃欲试" },
    { who: 'jiang', t: "着实应该利用现有的资源去搭建一些东西" },
    { who: 'jiang', t: "商家还真拿这个来营销，着实有点不舒服" },
  ],
  "美女子": [
    { who: 'zhou', t: "晚安美女子" },
    { who: 'jiang', t: "早安新疆美女子" },
    { who: 'zhou', t: "晚安美女子" },
    { who: 'jiang', t: "晚安美女子" },
    { who: 'zhou', t: "晚安美女子" },
    { who: 'zhou', t: "晚安美女子" },
    { who: 'zhou', t: "晚安美女子" },
    { who: 'zhou', t: "假期快乐美女子😘" },
    { who: 'zhou', t: "晚安美女子" },
  ],
};

const DESIGN_W = 750, DESIGN_H = 1334;
const REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const SHOT = new URLSearchParams(location.search).has('shot');
const SKIP_MIN = 2;                       // 看过≥2个后即可点空白跳下一幕（降低门槛，免得点完所有词）

// 频率 → 字号（对数映射，本人条数跨度 8..70 → 34..62）
const LO = Math.log(8), HI = Math.log(70);
function fsize(c) {
  const t = (Math.log(c) - LO) / (HI - LO);
  return Math.round(34 + 28 * Math.max(0, Math.min(1, t)));
}
WORDS.forEach(w => { w.o = 0.95; w.scale = 1.0; w.viewed = false; w.fs = fsize(w.self); });

// 预载 PNG 真实尺寸（用于碰撞半径）
const sizes = new Array(WORDS.length);
function preloadSizes(cb) {
  let n = 0, done = false;
  const fin = () => { if (!done && ++n === WORDS.length) { done = true; cb(); } };
  WORDS.forEach((w, i) => {
    const im = new Image();
    im.onload = () => { sizes[i] = { w: im.naturalWidth, h: im.naturalHeight }; fin(); };
    im.onerror = () => { sizes[i] = { w: 140, h: 70 }; fin(); };
    im.src = 'assets/第三幕-絮语/口癖词_words/' + String(i).padStart(2, '0') + '.png';
  });
}

// 伪随机（固定种子 → 每次刷新布局一致）
function mulberry32(a){ return function(){ a|=0; a=a+0x6D2B79F5|0; let t=Math.imul(a^a>>>15,1|a); t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; }; }

// 颜色感知排序：大致按条数从高到低，但避免同一种颜色连续放 3 个，
// 使粉/蓝在词云中交错分布（不堆在一起），同时仍"按条数排大小"。
function buildOrder(words) {
  const remaining = words.map((w, i) => i).sort((a, b) => words[b].self - words[a].self);
  const placed = [], recent = [];
  const ok = (c) => recent.length < 1 || recent[recent.length - 1] !== c;
  while (remaining.length) {
    let pick = -1;
    for (let k = 0; k < remaining.length; k++) {
      if (ok(words[remaining[k]].who)) { pick = k; break; }
    }
    if (pick < 0) pick = 0;
    const idx = remaining.splice(pick, 1)[0];
    placed.push(idx);
    recent.push(words[idx].who);
    if (recent.length > 2) recent.shift();
  }
  return placed;
}

// 布局：单张词云（同 3.2 中心放射 + 碰撞松弛），占满画面、不重叠、不出血；
// 放置顺序走 buildOrder → 粉/蓝交错，不堆成一片。
function computeLayout(words, sizes) {
  const GAP = 8;
  const CX = 375, CY = 760;
  const minX = 36, maxX = 714, minY = 150, maxY = 1300;
  const rnd = mulberry32(20260834);
  const rad = {};
  // 碰撞半径按字形实际区域（扣掉 PNG 四周 16px 透明边），允许更紧但仍不重叠
  words.forEach((w, i) => {
    const s = sizes[i] || { w: 140, h: 70 };
    rad[i] = { rw: Math.max(16, (s.w - 26) / 2), rh: Math.max(8, (s.h - 26) / 2) };
  });
  const order = buildOrder(words);
  const placed = [], home = {};
  const i0 = order[0];
  placed.push({ i: i0, x: CX, y: CY, rw: rad[i0].rw, rh: rad[i0].rh });
  home[i0] = { x: CX, y: CY };

  let totalArea = rad[i0].rw * rad[i0].rh * 4;
  for (let k = 1; k < order.length; k++) {
    const i = order[k], rw = rad[i].rw, rh = rad[i].rh;
    const baseAngle = k * 2.399963;
    totalArea += rw * rh * 4;
    const idealR = Math.sqrt(totalArea / Math.PI) * 0.95;
    const r0 = Math.max(rad[i0].rh + rh + GAP, Math.min(idealR, 540));
    let angle = baseAngle, da = 0.35, b = 2.8, r = r0;
    let found = false, fx = CX, fy = CY;
    for (let step = 0; step < 5000; step++) {
      const x = CX + Math.cos(angle) * r, y = CY + Math.sin(angle) * r;
      if (x - rw < minX || x + rw > maxX || y - rh < minY || y + rh > maxY) { angle += da; r = r0 + b * (angle - baseAngle); continue; }
      let okp = true;
      for (const q of placed) { if (Math.abs(x - q.x) < rw + q.rw + GAP && Math.abs(y - q.y) < rh + q.rh + GAP) { okp = false; break; } }
      if (okp) { fx = x; fy = y; found = true; break; }
      angle += da; r = r0 + b * (angle - baseAngle);
    }
    if (!found) { fx = Math.max(minX + rw, Math.min(maxX - rw, CX + Math.cos(baseAngle) * 220)); fy = Math.max(minY + rh, Math.min(maxY - rh, CY + Math.sin(baseAngle) * 220)); }
    placed.push({ i, x: fx, y: fy, rw, rh });
    home[i] = { x: fx, y: fy };
  }
  const pos = {}; placed.forEach(p => pos[p.i] = { x: p.x, y: p.y });
  // 碰撞松弛 + 同色空间斥力：推开重叠、打散同色堆积，同时保持 home 记忆
  for (let it = 0; it < 10000; it++) {
    for (let a = 0; a < order.length; a++) {
      const ia = order[a], pa = pos[ia], ra = rad[ia];
      for (let b = a + 1; b < order.length; b++) {
        const ib = order[b], pb = pos[ib], rb = rad[ib];
        const dx = pb.x - pa.x, dy = pb.y - pa.y;
        const ox = (ra.rw + rb.rw + GAP) - Math.abs(dx);
        const oy = (ra.rh + rb.rh + GAP) - Math.abs(dy);
        if (ox > 0 && oy > 0) {
          if (ox < oy) { const s = (ox + 12) / 2 * (dx < 0 ? -1 : 1); pa.x -= s; pb.x += s; }
          else         { const s = (oy + 12) / 2 * (dy < 0 ? -1 : 1); pa.y -= s; pb.y += s; }
        }
      }
    }
    // 同色空间斥力：江江蓝 / 小周粉 各自不要堆成一片
    for (let a = 0; a < order.length; a++) {
      const ia = order[a], pa = pos[ia];
      for (let b = a + 1; b < order.length; b++) {
        const ib = order[b], pb = pos[ib];
        if (words[ia].who !== words[ib].who) continue;
        const dx = pb.x - pa.x, dy = pb.y - pa.y;
        const d = Math.hypot(dx, dy);
        if (d < 200 && d > 0) {
          const f = (200 - d) / 200 * 5.0;
          const nx = dx / d, ny = dy / d;
          pa.x -= nx * f; pa.y -= ny * f;
          pb.x += nx * f; pb.y += ny * f;
        }
      }
    }
    order.forEach(i => {
      const p = pos[i], h = home[i], r = rad[i];
      p.x += (h.x - p.x) * 0.002;
      p.y += (h.y - p.y) * 0.002;
      p.x = Math.max(minX + r.rw, Math.min(maxX - r.rw, p.x));
      p.y = Math.max(minY + r.rh, Math.min(maxY - r.rh, p.y));
    });
  }
  // 终段：只分离、不回拉，彻底清零重叠
  for (let it = 0; it < 3000; it++) {
    for (let a = 0; a < order.length; a++) {
      const ia = order[a], pa = pos[ia], ra = rad[ia];
      for (let b = a + 1; b < order.length; b++) {
        const ib = order[b], pb = pos[ib], rb = rad[ib];
        const dx = pb.x - pa.x, dy = pb.y - pa.y;
        const ox = (ra.rw + rb.rw + GAP) - Math.abs(dx);
        const oy = (ra.rh + rb.rh + GAP) - Math.abs(dy);
        if (ox > 0 && oy > 0) {
          if (ox < oy) { const s = (ox + 10) / 2 * (dx < 0 ? -1 : 1); pa.x -= s; pb.x += s; }
          else         { const s = (oy + 10) / 2 * (dy < 0 ? -1 : 1); pa.y -= s; pb.y += s; }
        }
      }
    }
    order.forEach(i => {
      const p = pos[i], r = rad[i];
      p.x = Math.max(minX + r.rw, Math.min(maxX - r.rw, p.x));
      p.y = Math.max(minY + r.rh, Math.min(maxY - r.rh, p.y));
    });
  }
  order.forEach(i => { const w = words[i]; w.x = pos[i].x; w.y = pos[i].y; w.rot = (rnd() * 6 - 3); });
}

const stage = document.getElementById('stage');
let scale = 1, stageLeft = 0, stageTop = 0;
function resize() {
  scale = Math.min(window.innerWidth / DESIGN_W, window.innerHeight / DESIGN_H);
  stage.style.transform = 'scale(' + scale + ')';
  stageLeft = (window.innerWidth - DESIGN_W * scale) / 2;
  stageTop = (window.innerHeight - DESIGN_H * scale) / 2;
  stage.style.left = stageLeft + 'px';
  stage.style.top = stageTop + 'px';
}
window.addEventListener('resize', resize);
resize();
function toDesign(clientX, clientY) {
  return { x: (clientX - stageLeft) / scale, y: (clientY - stageTop) / scale };
}

const card = document.getElementById('act33Card');
const cardWord = card.querySelector('.c-word');
const cardWho = card.querySelector('.c-who');
const cardSelfK = card.querySelector('.c-self-k');
const cardSelf = card.querySelector('.c-self');
const cardOtherK = card.querySelector('.c-other-k');
const cardOther = card.querySelector('.c-other');
const wordsEl = document.getElementById('act33Words');
const activeLayer = document.getElementById('act33ActiveLayer');
const blurEl = document.getElementById('act33Blur');
function showBlur() { blurEl.classList.add('on'); }
function hideBlur() { blurEl.classList.remove('on'); }
let activeEl = null;
let phase = 'birth';
const viewed = new Set();

// 把一个点开过的词标记为"看过"：淡至 0.42 + 计入已看集合 + 检查是否看完
function markViewed(el) {
  if (!el || phase !== 'detail') return;
  const i = +el.dataset.i, w = WORDS[i];
  if (w.viewed) return;
  w.viewed = true; viewed.add(i);
  gsap.killTweensOf(el);
  gsap.to(el, { opacity: 0.42, duration: 0.4 });
  checkComplete();
}
function closeCard() {
  const el = activeEl;
  if (el) {
    const w = WORDS[+el.dataset.i];
    gsap.set(el, { scale: w.scale });
    wordsEl.appendChild(el);          // 归位回词云
    markViewed(el);
  }
  activeEl = null;
  clearDanmaku();
  hideBlur();
  gsap.to(card, { opacity: 0, duration: 0.22, onComplete: () => { card.style.visibility = 'hidden'; } });
  // 卡片关闭后，若已满足跳转条件，重新亮起「继续」按钮
  const nb = document.getElementById('act33Next');
  if (nb.dataset.armed === '1') { nb.style.pointerEvents = 'auto'; gsap.to(nb, { opacity: 1, duration: .4 }); }
}

const danmakuLayer = document.getElementById('act33Danmaku');
let danmakuEls = [];
function escapeHtml(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
function escapeRegExp(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
function highlight(text, kw) {
  let s = escapeHtml(text);
  if (kw) { const re = new RegExp('(' + escapeRegExp(kw) + ')', 'g'); s = s.replace(re, '<span class="dm-kw">$1</span>'); }
  return s;
}
function clearDanmaku() {
  danmakuEls.forEach(e => gsap.killTweensOf(e));
  danmakuEls = [];
  danmakuLayer.innerHTML = '';
}
var DANMAKU_WORDS = ["要不然", "giao", "玩意", "一大堆", "哇哇", "尖叫", "美妙", "emmmmm", "我勒个", "求求", "请问", "于是乎", "不得了", "没招", "笑鼠", "嘎嘎", "着实", "美女子"];
var DANMAKU_W = {"要不然": [294, 560, 324, 384, 193, 272, 246, 298, 350, 324, 376, 429, 298, 345, 193, 403, 167, 403, 795, 193, 219, 219, 167, 246, 193, 478, 312, 324, 350, 272, 298, 272, 141, 219, 455, 219, 219, 638, 324, 219, 298, 219, 560, 350, 324, 272, 193, 219, 219, 219, 324, 612, 376, 298], "giao": [60, 86, 60, 60, 60, 60, 60, 60, 86, 86, 60, 165, 60, 110, 60, 86, 60, 60, 60, 86, 60, 60, 60, 60, 60, 60, 60, 243, 112, 322, 269, 267, 217, 60, 269, 112, 60, 60, 60, 60, 777, 60, 191, 348, 86, 112, 217, 60, 243, 60, 60, 217, 60, 296, 191, 334, 86], "玩意": [246, 115, 167, 324, 141, 141, 193, 141, 115, 219, 298, 167, 219, 324, 141, 167, 167, 88, 167, 115, 298, 403, 141, 246, 298, 219, 246, 115, 167, 272, 193, 167, 167, 167, 298, 403, 272, 219, 664, 193, 115, 115, 88, 664, 410, 88, 219, 141, 664, 246], "一大堆": [429, 219, 219, 298, 272, 219, 376, 298, 219, 350, 272, 489, 785, 384, 246, 455, 429, 1038, 560, 403, 246, 455, 272, 403, 489, 429, 246, 324, 167, 246, 324, 167, 272, 507, 219, 246, 376, 246, 219, 324, 429, 298, 576, 638, 664, 324, 718, 1554, 383, 167, 298, 481], "哇哇": [193, 88, 141, 324, 219, 167, 88, 88, 88, 88, 219, 88, 219, 620, 167, 141, 88, 88, 272, 141, 88, 88, 115, 272, 88, 141, 246, 115, 167, 62, 62, 115, 219, 141, 193], "尖叫": [589, 324, 272, 246, 533, 549, 141, 115, 115, 115, 141, 115, 376, 115, 115, 115, 115, 115, 88, 88, 88, 88, 88, 88, 88, 88, 88, 88, 88, 324, 219], "美妙": [429, 690, 141, 141, 246, 219, 324, 141, 246, 298, 324, 376, 167, 246, 167, 272, 219, 612, 586, 455, 1059, 455, 115, 167, 141, 88, 324], "emmmmm": [365, 208, 235, 308, 208, 208, 392, 261, 679, 496, 470, 339, 151, 470, 220, 544, 173, 365, 215, 582, 408, 173, 130, 130], "我勒个": [403, 403, 115, 141, 324, 298, 219, 193, 219, 350, 88, 167, 174, 193, 246, 88, 167, 252, 193, 141, 141, 167, 88, 167, 272], "求求": [193, 533, 254, 560, 410, 246, 227, 354, 246, 403, 88, 324, 455, 638, 141, 115, 193, 272, 874], "请问": [141, 193, 193, 847, 481, 350, 668, 507, 272, 376, 533, 507, 494, 193, 560, 167, 88], "于是乎": [324, 219, 88, 193, 481, 324, 272, 403, 376, 272, 324, 455, 193, 429, 324, 769, 350, 88, 376], "不得了": [350, 141, 115, 88, 167, 141, 167, 246, 376, 298, 481, 298, 455, 167, 324, 481, 167, 481, 167], "没招": [376, 219, 350, 88, 246, 634, 167, 193, 193, 193, 1040, 88, 376, 88, 193, 693], "笑鼠": [88, 62, 62, 429, 62, 88, 62, 62, 62, 62, 62, 62, 246, 298, 724, 62, 319], "嘎嘎": [272, 219, 272, 376, 167, 437, 429, 167, 219, 88, 272, 219, 246, 193, 167, 219], "着实": [246, 167, 62, 141, 115, 324, 376, 219, 246, 324, 324, 219, 481, 481], "美女子": [141, 193, 141, 141, 141, 141, 141, 201, 141]};
function startDanmaku(w) {
  clearDanmaku();
  const list = DANMAKU[w.t];
  if (!list || !list.length) return;            // 该词没有句子就不飘
  const kw = w.t;
  const tracks = [60,160,260,360,920,1020,1120,1220];
  const trackFree = new Array(tracks.length).fill(0);
  const baseDelay = 0.6;
  list.forEach((item, i) => {
    const cls = item.who === 'zhou' ? 'zhou' : 'jiang';   // 按每条句子的说话人上色
    const dm = document.createElement('div');
    dm.className = 'danmaku ' + cls;
    var dw = (DANMAKU_W[w.t] && DANMAKU_W[w.t][i] != null) ? DANMAKU_W[w.t][i] : 0;
    var wi = DANMAKU_WORDS.indexOf(w.t);
    dm.innerHTML = '<img class="dm-img" alt="" src="assets/第三幕-絮语/danmaku_png/d_' + wi + '_' + i + '.png"' + (dw ? ' style="width:' + dw + 'px"' : '') + '>';
    danmakuLayer.appendChild(dm);
    let start = i * baseDelay;
    let ti = trackFree.findIndex(t => t <= start);
    if (ti < 0) { const minFree = Math.min(...trackFree); start = minFree; ti = trackFree.indexOf(minFree); }
    const dur = 6 + Math.random() * 2;
    trackFree[ti] = start + dur + 0.4;
    const top = tracks[ti];
    dm.style.top = top + 'px';
    if (SHOT) {
      gsap.set(dm, { x: DESIGN_W - i * 88 - Math.random() * 36 });
    } else {
      dm.style.animationName = 'a3-dmScroll';
      dm.style.animationDuration = dur + 's';
      dm.style.animationTimingFunction = 'linear';
      dm.style.animationDelay = start + 's';
      dm.style.animationFillMode = 'both';
      dm.addEventListener('animationend', () => dm.remove());
    }
    danmakuEls.push(dm);
  });
}

function openCard(w, el) {
  // 切换词：原来打开的那个词也算"看过"（淡掉），无需专门点✕或空白
  if (activeEl && activeEl !== el) {
    const pw = WORDS[+activeEl.dataset.i];
    gsap.set(activeEl, { scale: pw.scale });
    wordsEl.appendChild(activeEl);    // 归位回词云（随之被模糊）
    markViewed(activeEl);
  }
  activeEl = el;
  activeLayer.appendChild(el);        // 移到顶层，保持清晰不被模糊
  gsap.set(el, { opacity: 1 });
  showBlur();
  // 卡片打开时收起「继续」按钮，避免遮挡卡片内容
  const nb = document.getElementById('act33Next');
  gsap.to(nb, { opacity: 0, duration: .2 }); nb.style.pointerEvents = 'none';
  const W = WHO[w.who];
  cardWord.textContent = w.t;
  cardWho.textContent = W.name + ' 的口头禅';
  cardSelfK.textContent = W.self;
  cardSelf.textContent = w.self;
  cardOtherK.textContent = W.other;
  cardOther.textContent = w.other;
  card.classList.toggle('c-zhou', w.who === 'zhou');
  card.classList.toggle('c-jiang', w.who === 'jiang');
  card.style.visibility = 'hidden';
  gsap.set(card, { opacity: 0 });
  requestAnimationFrame(() => {
    const cw = card.offsetWidth, ch = card.offsetHeight;
    let cx = w.x + (w.x < DESIGN_W / 2 ? 90 : -90 - cw);
    let cy = w.y - ch / 2;
    cx = Math.max(16, Math.min(DESIGN_W - cw - 16, cx));
    cy = Math.max(150, Math.min(DESIGN_H - ch - 16, cy));
    card.style.left = cx + 'px'; card.style.top = cy + 'px';
    card.style.visibility = 'visible';
    gsap.fromTo(card, { opacity: 0, scale: 0.82, y: 14 }, { opacity: 1, scale: 1, y: 0, duration: 0.48, ease: 'back.out(1.7)' });
    gsap.to(el, { scale: w.scale * 1.12, duration: 0.25 });
    startDanmaku(w);
  });
}

// 看过足够词即可显式点「继续 ›」离场（不再要求看完所有词，也绝不靠空白误触翻页）
function armNext() {
  const btn = document.getElementById('act33Next');
  if (btn.dataset.armed === '1') return;
  btn.dataset.armed = '1';
  btn.style.pointerEvents = 'auto';
  gsap.to(btn, { opacity: 1, duration: .8, ease: 'power1.out' });
}
function checkComplete() {
  if (viewed.size >= SKIP_MIN) armNext();
  if (viewed.size >= WORDS.length) finishAll();
}
function finishAll() {
  phase = 'done';
  const els = document.getElementById('act33Words').children;
  for (let i = 0; i < els.length; i++) gsap.killTweensOf(els[i]);
  gsap.to(els, { opacity: 0, duration: 1.1, stagger: 0.012, ease: 'power1.in' });
  gsap.to('#act33Final', { opacity: .95, duration: 1.6, delay: 1.0, ease: 'power1.out' });
  // 「继续 ›」在此之前已由 checkComplete 在看过≥SKIP_MIN 个词时 armed；这里确保终幕也可见
  armNext();
}

function goNext() {
  if (phase === 'next') return;
  phase = 'next';
  goToScene(3);   // goToScene 自身负责淡出当前场景并切换 active（勿在此先 remove active）
}

const scene = document.getElementById('scene-3-3');
scene.addEventListener('click', (e) => {
  if (editMode) return;
  if (e.target.closest('#act33Next')) return;   // 继续按钮自行处理，不在此冒泡
  const wEl = e.target.closest('.act33-word');
  if (wEl) {
    const i = +wEl.dataset.i, w = WORDS[i];
    if (phase === 'detail') openCard(w, wEl);
    return;
  }
  // 空白点击：仅关闭卡片，绝不翻页（翻页只走「继续 ›」按钮）
  if (card.style.visibility === 'visible') closeCard();
});
card.addEventListener('click', (e) => {
  if (e.target.closest('.c-close')) { closeCard(); return; }
  e.stopPropagation();
});
document.getElementById('act33Next').addEventListener('click', (e) => {
  e.stopPropagation();
  if (phase === 'next' || phase === 'birth') return;
  if (viewed.size >= SKIP_MIN) goNext();   // 按钮只在 armed 后可点，等价于已看够词
});

// 编辑模式：拖拽微调（?edit=1 或按 E 切换）
let editMode = false, dragEl = null, dragW = null, dsx = 0, dsy = 0, dox = 0, doy = 0;
function setEdit(on) { editMode = on; document.body.style.cursor = on ? 'crosshair' : ''; if (!on) closeCard(); }
window.addEventListener('keydown', (e) => {
  if (e.key === 'e' || e.key === 'E') setEdit(!editMode);
  else if (e.key === 'r' || e.key === 'R') initScene();
  else if (e.key === 'Escape') closeCard();
  else if ((e.key === 'p' || e.key === 'P') && editMode) {
    console.log(WORDS.map(w => `{ t:'${w.t}', x:${Math.round(w.x)}, y:${Math.round(w.y)}, rot:${Math.round(w.rot||0)} }`).join(',\n'));
  }
});
scene.addEventListener('pointerdown', (e) => {
  if (!editMode) return;
  const wEl = e.target.closest('.act33-word'); if (!wEl) return;
  dragEl = wEl; dragW = WORDS[+wEl.dataset.i];
  const p = toDesign(e.clientX, e.clientY); dsx = p.x; dsy = p.y; dox = dragW.x; doy = dragW.y;
  wEl.setPointerCapture(e.pointerId);
});
scene.addEventListener('pointermove', (e) => {
  if (!dragEl) return;
  const p = toDesign(e.clientX, e.clientY);
  dragW.x = dox + (p.x - dsx); dragW.y = doy + (p.y - dsy);
  gsap.set(dragEl, { x: dragW.x, y: dragW.y });
});
scene.addEventListener('pointerup', () => { dragEl = null; });

function act3Build() {
  const wrap = document.getElementById('act33Words');
  wrap.innerHTML = '';
  WORDS.forEach((w, i) => {
    const el = document.createElement('img');
    el.className = 'act33-word';
    el.src = 'assets/第三幕-絮语/口癖词_words/' + String(i).padStart(2, '0') + '.png';
    el.alt = w.t;
    el.dataset.i = i;
    wrap.appendChild(el);
    gsap.set(el, { xPercent: -50, yPercent: -50, x: w.x, y: w.y, rotation: w.rot || 0, opacity: 0, scale: w.scale * 0.5 });
    el.style.setProperty('--o', w.o);
  });
}

function birthAndBreathe() {
  const els = document.getElementById('act33Words').children;
  WORDS.forEach((w, i) => {
    const el = els[i];
    if (REDUCED || SHOT) { gsap.set(el, { opacity: w.o, scale: w.scale }); return; }
    gsap.to(el, {
      opacity: w.o, scale: w.scale, duration: 0.9, delay: i * 0.04,
      ease: 'power2.out',
      onComplete: () => {
        if (!REDUCED) gsap.to(el, { opacity: w.o * 0.85, duration: 2 + Math.random() * 1.2, repeat: -1, yoyo: true, ease: 'sine.inOut' });
      }
    });
  });
  if (REDUCED || SHOT) {
    gsap.set(['#act33Title', '#act33Legend'], { opacity: 1 });
  } else {
    gsap.to(['#act33Title', '#act33Legend'], { opacity: 1, duration: 1.0, delay: 0.6, stagger: 0.12 });
  }
}

function initScene() {
  phase = 'birth';
  viewed.clear();
  activeEl = null;
  gsap.set('#act33Final', { opacity: 0 });
  gsap.set(['#act33Title', '#act33Legend'], { opacity: 0 });
  const _nb = document.getElementById('act33Next'); _nb.style.pointerEvents = 'none'; gsap.set(_nb, { opacity: 0 }); _nb.dataset.armed = '';
  const _nextScene = document.getElementById('scene-next');
  if (_nextScene) _nextScene.classList.remove('active');
  document.getElementById('scene-3-3').classList.add('active');
  gsap.set('#scene-3-3', { opacity: 1 });

  computeLayout(WORDS, sizes);
  act3Build();
  birthAndBreathe();

  if (REDUCED) { phase = 'detail'; }
  else if (SHOT) {
    phase = 'detail';
    const u = new URLSearchParams(location.search);
    const ov = u.get('open');
    if (ov) {
      const term = decodeURIComponent(ov);
      const idx = WORDS.findIndex(w => w.t === term);
      if (idx >= 0) { const el = document.getElementById('act33Words').querySelector(`[data-i="${idx}"]`); if (el) openCard(WORDS[idx], el); }
    }
  }
  else {
    setTimeout(() => { if (phase === 'birth') { phase = 'detail'; } }, 3050);
  }
}


sceneInit[2] = function act33SceneInit() { preloadSizes(() => initScene()); };

// ========== 第三幕 3.4 表情的迁徙（IIFE 隔离）==========
(function(){
// ============================================================
// 第三幕 3.4 表情的迁徙 —— 独立开发页
// 数据全部来自用户提供的真实统计（详见对话）。
// ============================================================

// 73 个月（2020-08 ~ 2026-08）逐月占比（%）
const E = [11.8,17.2,13.4,19.4,13.6, 15.2,14.6,10.6,23.5,18.4,22.9,15.2,17.4,17.0,15.3,17.5,29.8, 18.5,15.1,12.0,10.9,15.4,8.8,11.9,14.0,15.2,13.4,16.5,10.9, 13.0,12.7,15.2,11.7,17.9,13.4,13.0,11.6,8.5,8.3,6.4,10.7, 8.6,9.2,8.0,7.6,5.9,4.4,5.7,7.2,5.7,4.5,3.3,2.1, 5.6,5.7,2.6,2.2,4.4,2.1,2.1,2.2,3.7,3.6,1.7,2.8, 3.9,1.7,5.6,1.1,0.7,1.1,1.6,2.0];
const M = [11.7,9.8,6.1,10.1,6.7, 9.1,12.0,10.6,8.2,10.0,9.7,11.6,8.9,10.1,6.3,4.2,12.8, 10.3,8.4,5.1,4.6,6.7,6.5,9.0,13.9,10.8,10.2,11.3,8.6, 16.1,4.9,3.9,11.0,19.6,7.0,8.2,7.2,9.5,7.6,6.3,9.2, 6.6,5.5,8.0,7.1,6.8,11.8,9.7,11.3,11.1,12.7,11.8,14.0, 12.9,10.6,12.2,11.1,9.1,12.5,14.9,17.2,16.2,21.3,18.0,20.7, 12.0,18.6,13.7,15.2,13.6,11.0,14.8,15.1];
const U = [2.5,1.3,1.7,0.0,1.1, 1.4,0.9,2.1,2.2,3.3,1.8,1.7,0.3,0.7,1.6,1.0,0.0, 0.4,0.5,1.1,1.0,2.6,0.8,0.6,0.6,1.7,1.4,1.6,1.6, 1.5,2.4,0.9,2.9,5.4,1.4,1.4,1.9,3.0,3.3,2.1,2.9, 2.4,2.5,1.2,2.7,1.8,0.9,1.8,1.3,0.7,1.7,1.1,1.4, 1.5,1.7,1.2,2.1,2.4,1.2,2.0,1.9,1.1,2.3,2.0,1.9, 1.0,0.0,0.6,0.9,0.9,0.2,1.6,1.4];
const N = E.length;

// 月份标签
function buildMonths(){
  let y=2020, mo=8; const arr=[];
  for(let i=0;i<N;i++){ arr.push(y+'-'+String(mo).padStart(2,'0')); mo++; if(mo>12){mo=1;y++;} }
  return arr;
}
const MONTHS = buildMonths();

// ---- 舞台缩放（与主文件一致，合并时由脚本剥离）----
const DESIGN_W = 750, DESIGN_H = 1334;
const stage = document.getElementById('stage');
let scale = 1, stageLeft = 0, stageTop = 0;
function resize(){
  scale = Math.min(window.innerWidth/DESIGN_W, window.innerHeight/DESIGN_H);
  stage.style.transform = 'scale('+scale+')';
  stageLeft = (window.innerWidth - DESIGN_W*scale)/2;
  stageTop  = (window.innerHeight - DESIGN_H*scale)/2;
  stage.style.left = stageLeft+'px'; stage.style.top = stageTop+'px';
}
window.addEventListener('resize', resize); resize();

// ===================== 阶段机（四页顺序） =====================
let phase = 'p1';                       // p1 → p2 → rank → chart → chartready
let chartBuilt = false;                 // 图表只构建一次
let dragOn = false;                     // 图表拖拽状态
let rainStarted = false;                // 背景表情雨只起一次
const SVGNS = 'http://www.w3.org/2000/svg';

// ---- Apple 雪碧图映射 ----
const APPLE_MAP = window.APPLE_EMOJI_MAP || {};
const APPLE_COLS = (window.APPLE_EMOJI_GRID || {cols:62}).cols;
const APPLE_ROWS = (window.APPLE_EMOJI_GRID || {rows:62}).rows;
const VS = new RegExp('[\\uFE0E\\uFE0F]', 'g');
function getAppleCell(ch){ const k=(ch||'').replace(VS,''); return APPLE_MAP[k]||null; }

// ---- 表情雨素材池（逐月表 + 排行榜表情）----
const EMPOOL = ["🙊","🙈","😂","💮","🐮","🐷","🙏","🤞","🙉","🥀","💪","😭","😳","🎇","🎆","👧","🍋","🍬","📉","🎉","📺","👍","🆘","💩","🈚","✨","🦄","😴","💤","🍢","🤤","🥺","🤮","🤣","🤪","😅","🉑","🍒","🏨","🌇","🐋","🐏","🥰","🏕","🧐","🌿","🛏","👉","👈","😍","😿","😻","😯","😔","🙄","🥭","🎂","😱","🌞","😲","😋","👊","😮","🍀","🐦","🥹","👌","😨","👂","😘","🦆","🐔","🧎","🤓","💌","🎵","🐻","🤗","😢","🥉","🚿","🏃","🤔","🙇","👋","🫢","🪳","😗","🥶","😦","🐑","🥳","📕","🐴","🥲","💃","👩","❤","🙌","💧","😧","🤕"];
const WPOOL = ['wangchai','liulei','kuse','wulian','ciya'];
const WPATH = k => 'assets/第三幕-絮语/表情通胀_words/stk_'+k+'.png';
function randItem(a){ return a[(Math.random()*a.length)|0]; }

function makeAppleSpan(ch, size){
  const s=document.createElement('span'); s.className='apple-emoji';
  const cell=getAppleCell(ch);
  if(!cell){ s.textContent=ch; } else {
    const px=cell[0]/(APPLE_COLS-1)*100, py=cell[1]/(APPLE_ROWS-1)*100;
    s.style.backgroundPosition=px+'% '+py+'%';
  }
  s.style.width=size+'px'; s.style.height=size+'px';
  return s;
}
function makeWechatImg(k, size){
  const img=document.createElement('img'); img.className='rain-wechat';
  img.src=WPATH(k); img.style.height=size+'px'; img.alt='['+k+']';
  return img;
}

// ---- 背景表情雨（全程） ----
function startRain(){
  if(rainStarted) return; rainStarted=true;
  const layer=document.getElementById('a34Rain');
  const COUNT=20;
  for(let i=0;i<COUNT;i++){
    const d=document.createElement('div'); d.className='rain-drop';
    const useW=Math.random()<0.22;
    d.appendChild(useW?makeWechatImg(randItem(WPOOL),24+Math.random()*16):makeAppleSpan(randItem(EMPOOL),22+Math.random()*16));
    d.style.left=(Math.random()*DESIGN_W)+'px';
    d.style.opacity=(0.14+Math.random()*0.20).toFixed(2);
    layer.appendChild(d);
    const dur=7+Math.random()*6;
    gsap.fromTo(d, {y:-80}, {y:DESIGN_H+120, duration:dur, ease:'none',
      delay:-Math.random()*dur,
      onRepeat:()=>{
        d.style.left=(Math.random()*DESIGN_W)+'px';
        d.innerHTML='';
        d.appendChild(Math.random()<0.22?makeWechatImg(randItem(WPOOL),24+Math.random()*16):makeAppleSpan(randItem(EMPOOL),22+Math.random()*16));
      }
    });
  }
}
// 答对后，下刚答对的那个表情的雨
function burstEmoji(kind, key){
  const layer=document.getElementById('a34Rain');
  for(let i=0;i<34;i++){
    const d=document.createElement('div'); d.className='rain-drop';
    d.appendChild(kind==='wechat'?makeWechatImg(key,38+Math.random()*22):makeAppleSpan(key,36+Math.random()*22));
    d.style.left=(Math.random()*DESIGN_W)+'px';
    d.style.opacity=(0.82+Math.random()*0.18).toFixed(2);
    layer.appendChild(d);
    gsap.fromTo(d, {y:-40}, {y:DESIGN_H+80, duration:1.5+Math.random()*0.6, ease:'none', delay:i*0.028,
      onComplete:()=>d.remove()});
  }
}

// ---- 选项表情贴图（真实 emoji 走 Apple 雪碧图） ----
function paintAppleOpts(){
  document.querySelectorAll('#scene-3-4 .opt.apple-emoji').forEach(s=>{
    const cell=getAppleCell(s.dataset.k);
    if(!cell) return;
    const px=cell[0]/(APPLE_COLS-1)*100, py=cell[1]/(APPLE_ROWS-1)*100;
    s.style.setProperty('--ap', px+'% '+py+'%');
  });
}
function setAppleEmoji(el, ch){
  const cell=getAppleCell(ch);
  if(!cell){ el.textContent=ch; return; }
  const px=cell[0]/(APPLE_COLS-1)*100, py=cell[1]/(APPLE_ROWS-1)*100;
  el.className='apple-emoji';
  el.style.backgroundPosition=px+'% '+py+'%';
}

// ---- 排行榜数据（真实统计） ----
const RANK = {
  zhou: { name:'小周', color:'var(--zhou)',
    wechat:[{k:'wangchai',n:1711},{k:'liulei',n:1254},{k:'kuse',n:708}],
    emoji:[{k:'🥺',n:253},{k:'😭',n:97},{k:'🥹',n:90}] },
  jiang: { name:'江江', color:'var(--jiang)',
    wechat:[{k:'wulian',n:1228},{k:'liulei',n:635},{k:'ciya',n:626}],
    emoji:[{k:'👌',n:112},{k:'😋',n:53},{k:'😂',n:35}] }
};
function buildRank(){
  const cols=document.getElementById('a34RankCols'); if(!cols) return; cols.innerHTML='';
  [['zhou',RANK.zhou],['jiang',RANK.jiang]].forEach(([kk,side])=>{
    const col=document.createElement('div'); col.className='rank-col';
    const head=document.createElement('div'); head.className='rank-head';
    const dot=document.createElement('span'); dot.className='rank-dot'; dot.style.background=side.color;
    head.appendChild(dot);
    col.appendChild(head);
    [['微信表情',side.wechat,'wechat'],['emoji',side.emoji,'emoji']].forEach(([label,arr,kind])=>{
      const sub=document.createElement('div'); sub.className='rank-sub'; sub.textContent=label; col.appendChild(sub);
      const list=document.createElement('div'); list.className='rank-list';
      arr.forEach(it=>{
        const item=document.createElement('div'); item.className='rank-item';
        const em=document.createElement('div'); em.className='rank-emoji';
        if(kind==='wechat'){ em.appendChild(makeWechatImg(it.k,52)); }
        else { const sp=document.createElement('span'); setAppleEmoji(sp,it.k); em.appendChild(sp); }
        const n=document.createElement('span'); n.className='rank-n'; n.textContent=it.n+' 次';
        item.appendChild(em); item.appendChild(n);
        list.appendChild(item);
      });
      col.appendChild(list);
    });
    cols.appendChild(col);
  });
}

// ---- 四页流程 ----
const PAGES=['a34Page1','a34Page2','a34Rank'];
function showPage(id){ PAGES.forEach(p=>{ document.getElementById(p).classList.toggle('on', p===id); }); }

let p1e=false,p1w=false,p2e=false,p2w=false;
function fadeHint(delay){
  const bh=document.querySelector('#scene-3-4 .bridge-hint');
  if(bh) gsap.to(bh,{opacity:1,duration:.7,delay:delay||0});
}
// 两题都答对 → 等这阵表情雨落下 → 自动翻页
function checkP1(){ if(p1e&&p1w){ phase='p1done';
  gsap.delayedCall(2.1,()=>{ if(phase!=='p1done')return; phase='p2'; showPage('a34Page2'); }); } }
function checkP2(){ if(p2e&&p2w){ phase='p2done';
  gsap.delayedCall(2.1,()=>{ if(phase!=='p2done')return; phase='rank'; showRank(); }); } }

// 打乱选项：随机重排后，把正确答案挪到指定位置（避免总在第一位）
function shuffleOpts(id, correctKey, targetIdx){
  const box=document.getElementById(id); if(!box) return;
  const items=Array.from(box.children);
  for(let i=items.length-1;i>0;i--){ const j=(Math.random()*(i+1))|0; const t=items[i]; items[i]=items[j]; items[j]=t; }
  const ci=items.findIndex(o=>o.dataset.k===correctKey);
  if(ci>=0 && ci!==targetIdx){ const t=items[ci]; items[ci]=items[targetIdx]; items[targetIdx]=t; }
  items.forEach(o=>box.appendChild(o));
}

function bindOptGroup(optsId, correctKey, kind, onCorrect){
  const opts=document.getElementById(optsId);
  opts.addEventListener('click', e=>{
    const opt=e.target.closest('.opt'); if(!opt) return;
    if(opt.classList.contains('fade')||opt.classList.contains('correct')) return;
    const k=opt.dataset.k;
    if(k!==correctKey){
      gsap.fromTo(opt,{x:-9},{x:0,duration:.5,ease:'elastic.out(1,0.35)'});
      opt.classList.add('fade'); return;
    }
    opts.querySelectorAll('.opt').forEach(o=>{ if(o!==opt) o.classList.add('fade'); });
    opt.classList.add('correct');
    burstEmoji(kind, k);
    onCorrect();
  });
}
bindOptGroup('a34Opts1E','👌','emoji',()=>{p1e=true;checkP1();});
bindOptGroup('a34Opts1W','wulian','wechat',()=>{p1w=true;checkP1();});
bindOptGroup('a34Opts2E','🥺','emoji',()=>{p2e=true;checkP2();});
bindOptGroup('a34Opts2W','wangchai','wechat',()=>{p2w=true;checkP2();});

// 排行榜页：点击任意处继续
document.getElementById('a34Rank').addEventListener('click',()=>{
  if(phase!=='rank') return;
  const bh=document.querySelector('#scene-3-4 .bridge-hint'); if(bh) gsap.set(bh,{opacity:0});
  enterChart();
});

function showRank(){
  showPage('a34Rank');
  fadeHint(0.9);
}

function enterChart(){
  phase='chart';
  showPage('');
  const ph=document.getElementById('ph-chart');
  gsap.to(ph,{autoAlpha:1,duration:.6}); ph.style.pointerEvents='auto';
  ensureChart();
  gsap.delayedCall(1.8,()=>{
    phase='chartready';
    const bh=document.querySelector('#scene-3-4 .bridge-hint'); if(bh) gsap.to(bh,{opacity:1,duration:.6});
    // 热力图读完后自然进入下一屏，不再要求用户点图表外空白。
    gsap.delayedCall(1.4,()=>{ if(phase==='chartready') goToScene(4); });
  });
}

function initScene34(){
  phase='p1';
  p1e=p1w=p2e=p2w=false;
  document.querySelectorAll('#scene-3-4 .opt').forEach(o=>{ o.classList.remove('fade','correct'); o.style.transform=''; o.style.pointerEvents='auto'; });
  // 选项顺序打乱：正确答案不再固定第一位，同页两题位置也错开
  shuffleOpts('a34Opts1E', RANK.jiang.emoji[0].k, 2);
  shuffleOpts('a34Opts1W', RANK.jiang.wechat[0].k, 1);
  shuffleOpts('a34Opts2E', RANK.zhou.emoji[0].k, 1);
  shuffleOpts('a34Opts2W', RANK.zhou.wechat[0].k, 3);
  const ph=document.getElementById('ph-chart');
  gsap.set(ph,{autoAlpha:0}); ph.style.pointerEvents='none';
  const bh=document.querySelector('#scene-3-4 .bridge-hint'); if(bh) gsap.set(bh,{opacity:0});
  buildRank();
  paintAppleOpts();
  showPage('a34Page1');
  startRain();
}

// ===================== 72 月趋势图 =====================
const YMAX = 32;
const PADL=46, PADR=14, PADT=22, PADB=34;
const W=600, H=360;
const plotW = W-PADL-PADR, plotH = H-PADT-PADB;
const X = i => PADL + i/(N-1)*plotW;
const Y = v => PADT + (1 - Math.min(v,YMAX)/YMAX)*plotH;

function el(tag, attrs){
  const e = document.createElementNS(SVGNS, tag);
  for(const k in attrs) e.setAttribute(k, attrs[k]);
  return e;
}

let guide, cE, cM, cU, tip;
function buildChart(){
  const svg = document.getElementById('a34Svg');
  svg.innerHTML = '';

  // 两段纪元底纹
  const band1 = el('rect', {class:'era-rect', x:X(0), y:PADT, width:X(28)-X(0), height:plotH, fill:'rgba(221,145,178,.12)'});
  const band2 = el('rect', {class:'era-rect', x:X(52), y:PADT, width:X(N-1)-X(52), height:plotH, fill:'rgba(88,158,214,.12)'});
  svg.appendChild(band1); svg.appendChild(band2);
  const t1 = el('text', {class:'era-text', x:(X(0)+X(28))/2, y:PADT+18, fill:'rgba(221,145,178,.7)', 'text-anchor':'middle'});
  t1.textContent = '表情包时代'; svg.appendChild(t1);
  const t2 = el('text', {class:'era-text', x:(X(52)+X(N-1))/2, y:PADT+18, fill:'rgba(88,158,214,.75)', 'text-anchor':'middle'});
  t2.textContent = '多媒体时代'; svg.appendChild(t2);

  // 网格 + Y 轴刻度
  [0,10,20,30].forEach(v=>{
    const yy = Y(v);
    svg.appendChild(el('line', {class:'grid-line', x1:PADL, y1:yy, x2:W-PADR, y2:yy}));
    const lab = el('text', {class:'ax-text', x:PADL-8, y:yy+4, 'text-anchor':'end'});
    lab.textContent = v+'%'; svg.appendChild(lab);
  });

  // X 轴年份
  const years = ['2020','2021','2022','2023','2024','2025','2026'];
  years.forEach(yr=>{
    let idx = MONTHS.findIndex(m=>m.indexOf(yr)===0);
    if(idx<0) return;
    const xx = X(idx);
    svg.appendChild(el('line', {class:'ax-line', x1:xx, y1:PADT, x2:xx, y2:PADT+plotH}));
    const lab = el('text', {class:'ax-text', x:xx, y:H-12, 'text-anchor':'middle'});
    lab.textContent = yr; svg.appendChild(lab);
  });

  // 三条折线
  function poly(arr, color, w){
    let pts='';
    arr.forEach((v,i)=>{ pts += X(i)+','+Y(v)+' '; });
    return el('polyline', {points:pts.trim(), fill:'none', stroke:color, 'stroke-width':w, 'stroke-linejoin':'round', 'stroke-linecap':'round'});
  }
  const lineU = poly(U, 'var(--u)', 2.2);
  const lineM = poly(M, 'var(--jiang)', 3.2);
  const lineE = poly(E, 'var(--zhou)', 3.2);
  svg.appendChild(lineU); svg.appendChild(lineM); svg.appendChild(lineE);

  // 引导线 + 高亮点
  guide = el('line', {x1:0,y1:PADT,x2:0,y2:PADT+plotH, stroke:'#b3acc0', 'stroke-width':1.5, opacity:0});
  svg.appendChild(guide);
  cE = el('circle', {r:5, fill:'var(--zhou)', opacity:0});
  cM = el('circle', {r:5, fill:'var(--jiang)', opacity:0});
  cU = el('circle', {r:4, fill:'var(--u)', opacity:0});
  svg.appendChild(cE); svg.appendChild(cM); svg.appendChild(cU);

  tip = document.getElementById('a34Tip');

  // 描边动画
  [lineU, lineM, lineE].forEach((ln, i)=>{
    const len = ln.getTotalLength();
    gsap.set(ln, {strokeDasharray:len, strokeDashoffset:len});
    gsap.to(ln, {strokeDashoffset:0, duration:1.7, delay:0.25 + i*0.18, ease:'power1.inOut'});
  });

  // 交互
  function onPoint(ev){
    const r = svg.getBoundingClientRect();
    const vbx = (ev.clientX - r.left)/r.width*W;
    let i = Math.round((vbx-PADL)/plotW*(N-1));
    i = Math.max(0, Math.min(N-1, i));
    guide.setAttribute('x1', X(i)); guide.setAttribute('x2', X(i));
    guide.style.opacity = 1;
    cE.setAttribute('cx', X(i)); cE.setAttribute('cy', Y(E[i])); cE.style.opacity=1;
    cM.setAttribute('cx', X(i)); cM.setAttribute('cy', Y(M[i])); cM.style.opacity=1;
    cU.setAttribute('cx', X(i)); cU.setAttribute('cy', Y(U[i])); cU.style.opacity=1;
    tip.textContent = MONTHS[i] + ' ｜ 微信表情 ' + E[i] + '% · 多媒体 ' + M[i] + '% · emoji ' + U[i] + '%';
  }
  svg.addEventListener('pointerdown', ev=>{ dragOn=true; try{svg.setPointerCapture(ev.pointerId);}catch(_){} onPoint(ev); });
  svg.addEventListener('pointermove', ev=>{ if(dragOn) onPoint(ev); });
  svg.addEventListener('pointerup',   ()=>{ dragOn=false; });
  svg.addEventListener('pointercancel', ()=>{ dragOn=false; });
}

function ensureChart(){
  if(chartBuilt) return;
  chartBuilt = true;
  buildChart();
}

// 图表页仅保留图表拖拽查看；离开由上面的自动转场负责。

// 开发期快捷跳转：仅 ?dev / ?edit 下，按 1–5 跳 3.1–3.5
(function(){
  const u = new URLSearchParams(location.search);
  if(u.has('dev') || u.has('edit')){
    document.addEventListener('keydown', e=>{
      const n = parseInt(e.key, 10);
      if(n>=1 && n<=5){ e.preventDefault(); goToScene(n-1); }
    });
  }
})();

if (typeof sceneInit !== 'undefined') sceneInit[3] = initScene34;
})();

// ========== 第三幕 3.5 称呼（IIFE 隔离）· 真实数据版 ==========
(function(){
const D35 = {"months": ["2020-10", "2020-11", "2020-12", "2021-01", "2021-02", "2021-03", "2021-04", "2021-05", "2021-06", "2021-07", "2021-08", "2021-09", "2021-10", "2021-11", "2021-12", "2022-01", "2022-02", "2022-03", "2022-04", "2022-05", "2022-06", "2022-07", "2022-08", "2022-09", "2022-10", "2022-11", "2022-12", "2023-01", "2023-02", "2023-03", "2023-04", "2023-05", "2023-06", "2023-07", "2023-08", "2023-09", "2023-10", "2023-11", "2023-12", "2024-01", "2024-02", "2024-03", "2024-04", "2024-05", "2024-06", "2024-07", "2024-08", "2024-09", "2024-10", "2024-11", "2024-12", "2025-01", "2025-02", "2025-03", "2025-04", "2025-05", "2025-06", "2025-07", "2025-08", "2025-09", "2025-10", "2025-11", "2025-12", "2026-01", "2026-02", "2026-03", "2026-04", "2026-05", "2026-06", "2026-07", "2026-08"], "heat": {"小周": [{"m": "2020-10", "w": null, "c": 0}, {"m": "2020-11", "w": null, "c": 0}, {"m": "2020-12", "w": null, "c": 0}, {"m": "2021-01", "w": null, "c": 0}, {"m": "2021-02", "w": null, "c": 0}, {"m": "2021-03", "w": null, "c": 0}, {"m": "2021-04", "w": null, "c": 0}, {"m": "2021-05", "w": null, "c": 0}, {"m": "2021-06", "w": null, "c": 0}, {"m": "2021-07", "w": null, "c": 0}, {"m": "2021-08", "w": null, "c": 0}, {"m": "2021-09", "w": null, "c": 0}, {"m": "2021-10", "w": null, "c": 0}, {"m": "2021-11", "w": "宝贝", "c": 1}, {"m": "2021-12", "w": null, "c": 0}, {"m": "2022-01", "w": "宝贝", "c": 1}, {"m": "2022-02", "w": "宝贝", "c": 1}, {"m": "2022-03", "w": "宝贝", "c": 1}, {"m": "2022-04", "w": null, "c": 0}, {"m": "2022-05", "w": null, "c": 0}, {"m": "2022-06", "w": null, "c": 0}, {"m": "2022-07", "w": null, "c": 0}, {"m": "2022-08", "w": null, "c": 0}, {"m": "2022-09", "w": null, "c": 0}, {"m": "2022-10", "w": null, "c": 0}, {"m": "2022-11", "w": null, "c": 0}, {"m": "2022-12", "w": "宝贝", "c": 1}, {"m": "2023-01", "w": null, "c": 0}, {"m": "2023-02", "w": null, "c": 0}, {"m": "2023-03", "w": null, "c": 0}, {"m": "2023-04", "w": null, "c": 0}, {"m": "2023-05", "w": null, "c": 0}, {"m": "2023-06", "w": null, "c": 0}, {"m": "2023-07", "w": null, "c": 0}, {"m": "2023-08", "w": "宝贝", "c": 1}, {"m": "2023-09", "w": "宝贝", "c": 3}, {"m": "2023-10", "w": null, "c": 0}, {"m": "2023-11", "w": null, "c": 0}, {"m": "2023-12", "w": null, "c": 0}, {"m": "2024-01", "w": "宝贝", "c": 2}, {"m": "2024-02", "w": "宝贝", "c": 2}, {"m": "2024-03", "w": "宝宝", "c": 4}, {"m": "2024-04", "w": "宝宝", "c": 3}, {"m": "2024-05", "w": "宝宝", "c": 14}, {"m": "2024-06", "w": "宝宝", "c": 30}, {"m": "2024-07", "w": "宝宝", "c": 27}, {"m": "2024-08", "w": "宝宝", "c": 33}, {"m": "2024-09", "w": "宝宝", "c": 50}, {"m": "2024-10", "w": "宝宝", "c": 33}, {"m": "2024-11", "w": "宝宝", "c": 27}, {"m": "2024-12", "w": "宝宝", "c": 32}, {"m": "2025-01", "w": "宝宝", "c": 19}, {"m": "2025-02", "w": "宝宝", "c": 7}, {"m": "2025-03", "w": "宝宝", "c": 15}, {"m": "2025-04", "w": "宝宝", "c": 11}, {"m": "2025-05", "w": "宝宝", "c": 20}, {"m": "2025-06", "w": "宝宝", "c": 13}, {"m": "2025-07", "w": "宝宝", "c": 5}, {"m": "2025-08", "w": "宝宝", "c": 4}, {"m": "2025-09", "w": "宝宝", "c": 1}, {"m": "2025-10", "w": "宝宝", "c": 5}, {"m": "2025-11", "w": "宝宝", "c": 1}, {"m": "2025-12", "w": null, "c": 0}, {"m": "2026-01", "w": "宝宝", "c": 3}, {"m": "2026-02", "w": "宝贝", "c": 1}, {"m": "2026-03", "w": "宝宝", "c": 9}, {"m": "2026-04", "w": null, "c": 0}, {"m": "2026-05", "w": "宝宝", "c": 3}, {"m": "2026-06", "w": "宝宝", "c": 7}, {"m": "2026-07", "w": "宝宝", "c": 11}, {"m": "2026-08", "w": "宝宝", "c": 7}], "江江": [{"m": "2020-10", "w": "宝贝", "c": 4}, {"m": "2020-11", "w": null, "c": 0}, {"m": "2020-12", "w": "宝贝", "c": 5}, {"m": "2021-01", "w": "宝贝", "c": 2}, {"m": "2021-02", "w": "宝贝", "c": 1}, {"m": "2021-03", "w": null, "c": 0}, {"m": "2021-04", "w": null, "c": 0}, {"m": "2021-05", "w": null, "c": 0}, {"m": "2021-06", "w": null, "c": 0}, {"m": "2021-07", "w": null, "c": 0}, {"m": "2021-08", "w": null, "c": 0}, {"m": "2021-09", "w": "宝贝", "c": 1}, {"m": "2021-10", "w": null, "c": 0}, {"m": "2021-11", "w": "宝贝", "c": 1}, {"m": "2021-12", "w": null, "c": 0}, {"m": "2022-01", "w": null, "c": 0}, {"m": "2022-02", "w": "宝贝", "c": 1}, {"m": "2022-03", "w": null, "c": 0}, {"m": "2022-04", "w": null, "c": 0}, {"m": "2022-05", "w": null, "c": 0}, {"m": "2022-06", "w": null, "c": 0}, {"m": "2022-07", "w": null, "c": 0}, {"m": "2022-08", "w": null, "c": 0}, {"m": "2022-09", "w": null, "c": 0}, {"m": "2022-10", "w": null, "c": 0}, {"m": "2022-11", "w": null, "c": 0}, {"m": "2022-12", "w": null, "c": 0}, {"m": "2023-01", "w": null, "c": 0}, {"m": "2023-02", "w": null, "c": 0}, {"m": "2023-03", "w": null, "c": 0}, {"m": "2023-04", "w": "宝贝", "c": 1}, {"m": "2023-05", "w": null, "c": 0}, {"m": "2023-06", "w": null, "c": 0}, {"m": "2023-07", "w": null, "c": 0}, {"m": "2023-08", "w": "宝贝", "c": 1}, {"m": "2023-09", "w": "宝贝", "c": 4}, {"m": "2023-10", "w": "宝贝", "c": 4}, {"m": "2023-11", "w": null, "c": 0}, {"m": "2023-12", "w": null, "c": 0}, {"m": "2024-01", "w": "宝贝", "c": 1}, {"m": "2024-02", "w": "宝宝", "c": 3}, {"m": "2024-03", "w": "宝宝", "c": 9}, {"m": "2024-04", "w": "宝宝", "c": 9}, {"m": "2024-05", "w": "宝宝", "c": 37}, {"m": "2024-06", "w": "宝宝", "c": 86}, {"m": "2024-07", "w": "宝宝", "c": 61}, {"m": "2024-08", "w": "宝宝", "c": 94}, {"m": "2024-09", "w": "宝宝", "c": 53}, {"m": "2024-10", "w": "宝宝", "c": 35}, {"m": "2024-11", "w": "宝宝", "c": 19}, {"m": "2024-12", "w": "baby", "c": 15}, {"m": "2025-01", "w": "baby", "c": 18}, {"m": "2025-02", "w": "baby", "c": 8}, {"m": "2025-03", "w": "baby", "c": 11}, {"m": "2025-04", "w": "baby", "c": 4}, {"m": "2025-05", "w": "baby", "c": 22}, {"m": "2025-06", "w": "baby", "c": 27}, {"m": "2025-07", "w": "baby", "c": 6}, {"m": "2025-08", "w": "宝宝", "c": 6}, {"m": "2025-09", "w": null, "c": 0}, {"m": "2025-10", "w": "baby", "c": 4}, {"m": "2025-11", "w": "baby", "c": 3}, {"m": "2025-12", "w": null, "c": 0}, {"m": "2026-01", "w": null, "c": 0}, {"m": "2026-02", "w": "宝宝", "c": 1}, {"m": "2026-03", "w": "baby", "c": 5}, {"m": "2026-04", "w": "baby", "c": 1}, {"m": "2026-05", "w": "baby", "c": 2}, {"m": "2026-06", "w": "baby", "c": 4}, {"m": "2026-07", "w": "baby", "c": 17}, {"m": "2026-08", "w": "宝宝", "c": 7}]}, "names": {"baobao": {"t": "宝宝", "count": 799, "pct": 79.8, "zhou": 0.49, "jiang": 0.51, "zc": 394, "jc": 405, "first": "2023-09-06", "firstS": "小周", "resp": "2023-10-21", "lag": 45, "respCnt": 405}, "baobei": {"t": "宝贝", "count": 41, "pct": 4.1, "zhou": 0.32, "jiang": 0.68, "zc": 13, "jc": 28, "first": "2020-10-04", "firstS": "江江", "resp": "2021-11-27", "lag": 419, "respCnt": 13}, "baby": {"t": "baby", "count": 152, "pct": 15.2, "zhou": 0.01, "jiang": 0.99, "zc": 1, "jc": 151, "first": "2024-09-21", "firstS": "江江", "resp": "2026-08-03", "lag": 681, "respCnt": 1}, "beibei": {"t": "贝贝", "count": 9, "pct": 0.9, "zhou": 0.0, "jiang": 1.0, "zc": 0, "jc": 9, "first": "2024-09-13", "firstS": "江江", "resp": null, "lag": null, "respCnt": 0}}, "tot": 1001, "pool": {"baobao":[{"who":"zhou","t":"宝宝你真的好小一只[可怜][可怜][可怜]","d":"2023-09-06","a":1},{"who":"jiang","t":"OMG那你是扭伤了两只脚宝宝","d":"2023-10-28","a":0},{"who":"zhou","t":"宝宝好可爱！！！抓过来亲一口/::*","d":"2024-01-05","a":0},{"who":"jiang","t":"新年快乐宝宝[呲牙]","d":"2024-02-10","a":0},{"who":"zhou","t":"宝宝你现在也是学生年代","d":"2024-02-18","a":0},{"who":"jiang","t":"哦可怜的宝宝可怜的宝宝","d":"2024-03-22","a":0},{"who":"jiang","t":"当然会哒宝宝[跳跳]","d":"2024-03-24","a":0},{"who":"jiang","t":"宝宝羟基一定要报[流泪]","d":"2024-04-13","a":0},{"who":"jiang","t":"宝宝高考还有很多变数就算算上乌鲁木齐","d":"2024-04-23","a":0},{"who":"jiang","t":"宝宝我等一下要考试了。。。。让我复习十五分钟","d":"2024-05-23","a":0},{"who":"jiang","t":"宝宝其实我的旅游经费都是我的压岁钱来的","d":"2024-05-27","a":0},{"who":"zhou","t":"宝宝教我怎么省下旅游经费[流泪][流泪]","d":"2024-05-27","a":0},{"who":"jiang","t":"[拥抱][拥抱][拥抱][拥抱]宝宝不要伤心","d":"2024-06-01","a":0},{"who":"zhou","t":"！！宝宝我好爱你[流泪][流泪][流泪]","d":"2024-06-04","a":0},{"who":"jiang","t":"我嘞逗宝宝我总算是吃完这场酣畅淋漓的烧烤了","d":"2024-07-14","a":0},{"who":"zhou","t":"宝宝你觉得这个行程是能赶完的吗[晕]","d":"2024-07-16","a":0},{"who":"zhou","t":"宝宝我差不多能听懂85%的听力了","d":"2024-08-19","a":0},{"who":"jiang","t":"北京欢迎你[流泪]宝宝我带你吃好吃的","d":"2024-08-19","a":1},{"who":"jiang","t":"宝宝我打算睡觉了 今天早点睡 明天早点起来学","d":"2024-08-20","a":0},{"who":"jiang","t":"宝宝，你已经水灵灵的在你的床上开始睡午觉了吗","d":"2024-08-23","a":0},{"who":"jiang","t":"可能那可能宝宝你要多晒太阳[捂脸][捂脸]","d":"2024-09-14","a":0},{"who":"zhou","t":"呜呜宝宝大二都会这样吗[流泪][流泪]","d":"2024-09-22","a":0},{"who":"jiang","t":"OK了啊宝宝你们这个志愿感觉真的是非常好赚啊","d":"2024-09-27","a":0},{"who":"jiang","t":"[拥抱][拥抱][拥抱]不同的style宝宝","d":"2024-10-06","a":0},{"who":"jiang","t":"宝宝你从一个肉多的地方来到了另一个肉多的地方","d":"2024-10-06","a":0},{"who":"zhou","t":"宝宝我高中没学过地理啊怎么默认大家都会！","d":"2024-10-12","a":0},{"who":"jiang","t":"诶宝宝你一个月在你那大概花多少钱呢","d":"2024-11-06","a":0},{"who":"jiang","t":"天哪宝宝高三已经烙下了这样的印记","d":"2024-11-14","a":0},{"who":"zhou","t":"宝宝感觉你大一的时候会发好多好多朋友圈","d":"2024-11-29","a":0},{"who":"jiang","t":"宝宝我刚刚说从你给我的图片里面汲取灵感","d":"2024-12-08","a":0},{"who":"jiang","t":"太自律了宝宝 这样干什么一定都会成功的","d":"2024-12-11","a":0},{"who":"zhou","t":"宝宝这一份11r 米饭泡菜辣酱海带汤无限续","d":"2024-12-19","a":0},{"who":"zhou","t":"宝宝其实我对世界地图一无所知","d":"2025-01-04","a":0},{"who":"jiang","t":"宝宝你有出门吗？这几天","d":"2025-01-19","a":0},{"who":"zhou","t":"宝宝我写微积分有点红温了😴🤒🤕🥵","d":"2025-02-03","a":0},{"who":"zhou","t":"宝宝你以后去当CEO吗","d":"2025-02-12","a":0},{"who":"zhou","t":"宝宝怎么两天就吃了这么多","d":"2025-02-22","a":0},{"who":"zhou","t":"宝宝你毕业了会不会变成七种语言拥有者","d":"2025-03-01","a":0},{"who":"zhou","t":"宝宝你懂男女比23：1的痛吗","d":"2025-03-07","a":0},{"who":"zhou","t":"宝宝学习通随堂测验可以切屏吗","d":"2025-03-25","a":0},{"who":"zhou","t":"北京刮大风吗宝宝","d":"2025-04-11","a":0},{"who":"zhou","t":"宝宝我有一天八点半就睡了","d":"2025-04-14","a":0},{"who":"jiang","t":"安安静静的就很乖呀小宝宝","d":"2025-05-01","a":0},{"who":"jiang","t":"都一样的呢，宝宝你可以先试试我的","d":"2025-05-25","a":0},{"who":"zhou","t":"不对宝宝你应该有个很好的分数保底了","d":"2025-06-14","a":0},{"who":"jiang","t":"天哪宝宝这行程满满","d":"2025-06-28","a":0},{"who":"zhou","t":"那宝宝你想想你在北京吃过最好吃的","d":"2025-06-28","a":0},{"who":"zhou","t":"宝宝我终于在床上了","d":"2025-07-01","a":0},{"who":"zhou","t":"诶宝宝你居然大三了","d":"2025-09-12","a":0},{"who":"zhou","t":"好了宝宝我真的要睡了","d":"2025-10-09","a":0},{"who":"zhou","t":"只会说卧槽了宝宝你们都是很好的人[流泪]","d":"2025-10-21","a":0},{"who":"zhou","t":"宝宝你是一只🦉侠","d":"2025-10-25","a":0},{"who":"zhou","t":"宝宝你怎么这么会画","d":"2026-01-28","a":0},{"who":"zhou","t":"[苦涩]我要去写题了宝宝","d":"2026-03-13","a":0},{"who":"zhou","t":"OMG宝宝我怎么忘回你了！","d":"2026-03-22","a":0},{"who":"zhou","t":"宝宝你已经面过很多场了吧","d":"2026-03-23","a":0},{"who":"jiang","t":"宝宝你一定要坚持下去","d":"2026-05-24","a":0},{"who":"zhou","t":"宝宝你有群吗想吃第一手的瓜","d":"2026-06-10","a":0},{"who":"zhou","t":"宝宝你7.11有空嘛","d":"2026-06-22","a":0}],"baby":[{"who":"jiang","t":"Baby这是什么东西呀我的天哪这只是一个学院楼","d":"2024-09-21","a":1},{"who":"jiang","t":"baby你是最高的[捂脸][捂脸][捂脸]","d":"2024-10-09","a":0},{"who":"jiang","t":"baby你怎么做到每天早上起那么早的","d":"2024-10-26","a":0},{"who":"jiang","t":"baby得在这个吉林大学好好休养生息一下","d":"2024-10-27","a":0},{"who":"jiang","t":"不难的baby而且高中学的都是背的东西","d":"2024-11-07","a":0},{"who":"jiang","t":"baby你们的这个推送做的好漂亮","d":"2024-11-11","a":0},{"who":"jiang","t":"我的天哪baby你已经可以听得出广东口音了","d":"2024-11-29","a":0},{"who":"jiang","t":"Baby你的这个状态的前奏好长","d":"2024-12-07","a":0},{"who":"jiang","t":"Baby我们那个文创并不会做出来其实","d":"2024-12-25","a":0},{"who":"jiang","t":"考完考试了让我来看看baby你发了什么","d":"2024-12-30","a":0},{"who":"jiang","t":"baby什么时候考完 难道是今天吗","d":"2025-01-04","a":0},{"who":"jiang","t":"嘶baby放心吧不会直接出世界地图的","d":"2025-01-04","a":0},{"who":"jiang","t":"baby快看我这个学期的不懈努力的成果","d":"2025-01-18","a":0},{"who":"jiang","t":"baby你那时候去是为了啥来着","d":"2025-02-22","a":0},{"who":"jiang","t":"baby你上车或者上飞机了吗","d":"2025-02-22","a":0},{"who":"jiang","t":"快看北京的腊梅开了baby","d":"2025-02-23","a":0},{"who":"jiang","t":"baby怎么去这么多地方玩","d":"2025-03-14","a":0},{"who":"jiang","t":"BABY你每天吃饭都拍一下照片","d":"2025-03-14","a":0},{"who":"jiang","t":"Baby, 你这是已经去到长春了吗？","d":"2025-03-16","a":0},{"who":"jiang","t":"天哪这是什么玩会baby","d":"2025-04-01","a":0},{"who":"jiang","t":"如何呢可以的baby","d":"2025-04-01","a":0},{"who":"jiang","t":"这是哪里baby","d":"2025-04-27","a":0},{"who":"jiang","t":"baby你有什么需要但是市面上没有的东西吗","d":"2025-05-13","a":0},{"who":"jiang","t":"Baby你这么快就要开始考试了吗","d":"2025-05-13","a":0},{"who":"jiang","t":"我想想baby其实我觉得石家庄没有什么好玩的","d":"2025-05-26","a":0},{"who":"jiang","t":"那太好了baby我们可以一起吃个饭","d":"2025-06-11","a":0},{"who":"jiang","t":"baby你能帮我在小红书一个帖子里评论一句吗","d":"2025-06-11","a":0},{"who":"jiang","t":"baby我们明天中午吃饭行吗","d":"2025-06-28","a":1},{"who":"jiang","t":"但baby你不用太着急啊啊啊啊","d":"2025-06-29","a":0},{"who":"jiang","t":"很快就到家了，再坚持一下baby","d":"2025-07-01","a":0},{"who":"jiang","t":"baby你是去旅游去玩吗","d":"2025-07-12","a":0},{"who":"jiang","t":"baby你是不是要提前回校来着","d":"2025-07-28","a":0},{"who":"jiang","t":"青旅吗baby","d":"2025-10-05","a":0},{"who":"jiang","t":"你做的吗baby","d":"2025-10-21","a":0},{"who":"jiang","t":"下雪了吗baby","d":"2025-11-12","a":0},{"who":"jiang","t":"nonono baby","d":"2025-11-27","a":0},{"who":"jiang","t":"一定可以的baby","d":"2026-03-20","a":0},{"who":"jiang","t":"现在肯定已经解放了，baby","d":"2026-03-20","a":0},{"who":"jiang","t":"咋了baby，为啥不能放第一志愿","d":"2026-03-26","a":0},{"who":"jiang","t":"加油啊baby","d":"2026-04-29","a":0},{"who":"jiang","t":"可以的baby可以的","d":"2026-05-24","a":0},{"who":"jiang","t":"baby这个薛之谦的","d":"2026-06-23","a":0},{"who":"jiang","t":"baby你太厉害了","d":"2026-06-30","a":0}],"baobei":[{"who":"jiang","t":"是爱情来了吗宝贝","d":"2020-10-04","a":1},{"who":"jiang","t":"大宝贝AAAAA","d":"2020-12-05","a":0},{"who":"jiang","t":"大宝贝[旺柴]我放假了","d":"2020-12-30","a":0},{"who":"jiang","t":"假期快乐大宝贝","d":"2020-12-30","a":0},{"who":"jiang","t":"大宝贝你在吗","d":"2021-01-09","a":0},{"who":"jiang","t":"大宝贝我走了[旺柴]","d":"2021-01-09","a":0},{"who":"jiang","t":"啊宝贝，中秋节快乐[亲亲]","d":"2021-09-21","a":0},{"who":"zhou","t":"宝贝儿晚安安！","d":"2021-11-27","a":1},{"who":"jiang","t":"不行宝贝我好困我今天跳的累死了[亲亲]","d":"2021-11-27","a":0},{"who":"zhou","t":"新年快乐宝贝","d":"2022-01-01","a":0},{"who":"jiang","t":"宝贝新年快乐[庆祝][庆祝][庆祝]","d":"2022-02-01","a":0},{"who":"zhou","t":"宝贝新年快乐！","d":"2022-02-01","a":0},{"who":"zhou","t":"嘿嘿谢谢宝贝[亲亲]","d":"2022-03-29","a":0},{"who":"zhou","t":"宝贝平平安安哦","d":"2022-12-25","a":0},{"who":"jiang","t":"你是高二宝贝","d":"2023-04-15","a":0},{"who":"jiang","t":"我靠宝贝你好瘦啊","d":"2023-08-13","a":0},{"who":"zhou","t":"给勇敢宝贝奖励糖糖[亲亲]","d":"2023-08-28","a":0},{"who":"jiang","t":"救命宝贝你到底是怎么了","d":"2023-09-06","a":0},{"who":"jiang","t":"宝贝你有没有压力很大[拥抱]","d":"2023-09-25","a":0},{"who":"zhou","t":"江江宝贝生日快乐[蛋糕][蛋糕]","d":"2023-09-28","a":0},{"who":"jiang","t":"宝贝你是被盗号了吗","d":"2023-09-30","a":0},{"who":"jiang","t":"晚安宝贝[呲牙]","d":"2023-10-10","a":0},{"who":"jiang","t":"但是你是在新疆考啊宝贝","d":"2023-10-30","a":0},{"who":"jiang","t":"加油宝贝真棒","d":"2024-01-13","a":0},{"who":"zhou","t":"宝贝新年快乐啊啊啊啊啊","d":"2024-02-10","a":0},{"who":"jiang","t":"宝贝我要睡觉了[可怜][可怜]","d":"2024-03-26","a":0},{"who":"jiang","t":"笑死了才看到这句中西结合上了宝贝你是","d":"2024-05-17","a":0},{"who":"jiang","t":"宝贝你还是太累了","d":"2024-09-21","a":0},{"who":"jiang","t":"那我只能放电脑和平板了啊宝贝","d":"2024-09-27","a":0},{"who":"zhou","t":"宝贝你怎么大二就这么厉害了。","d":"2024-11-07","a":0}],"beibei":[{"who":"jiang","t":"贝贝你","d":"2024-09-13","a":1},{"who":"jiang","t":"贝贝，我现在就来看","d":"2024-09-17","a":0},{"who":"jiang","t":"没听懂贝贝","d":"2024-09-17","a":0},{"who":"jiang","t":"贝贝你。。。。。","d":"2024-09-20","a":0},{"who":"jiang","t":"我嘞逗贝贝为什么你们宿舍都要六点起","d":"2024-09-22","a":1},{"who":"jiang","t":"可以的贝贝","d":"2024-09-27","a":0},{"who":"jiang","t":"OMG贝贝","d":"2025-08-14","a":0},{"who":"jiang","t":"贝贝你看了罗小黑吗","d":"2025-08-24","a":0}]}, "q819": [{"s": "小周", "t": "好吧宝宝咱们考研"}, {"s": "江江", "t": "宝宝[流泪]好好珍惜大学生活吧[流泪][流泪]我都在搞什么"}, {"s": "江江", "t": "宝宝你还没睡啊"}, {"s": "小周", "t": "宝宝我差不多能听懂85%的听力了"}, {"s": "江江", "t": "宝宝我上个学期的英语免修了之后 我就没学过了 一个学期[流泪]他就退化了[流泪]昨天我看闺蜜的六级题目"}, {"s": "小周", "t": "宝宝我听了三四五六遍写的[流泪]"}, {"s": "江江", "t": "宝宝你看这样是有用的！"}, {"s": "小周", "t": "宝宝你高数"}, {"s": "小周", "t": "宝宝我们转出看原专业绩点"}, {"s": "江江", "t": "我不能本科出来的宝宝"}, {"s": "江江", "t": "宝宝你每天都这么晚睡吗"}, {"s": "江江", "t": "[流泪]一定会的宝宝[流泪][流泪][流泪][流泪]"}, {"s": "江江", "t": "北京欢迎你[流泪]宝宝我带你吃好吃的"}, {"s": "江江", "t": "宝宝早安"}, {"s": "江江", "t": "哦哈哟宝宝早上好"}, {"s": "江江", "t": "宝宝我已在学习"}, {"s": "小周", "t": "噢宝宝我有点开学焦虑了"}, {"s": "江江", "t": "哦宝宝怎么回事"}, {"s": "小周", "t": "宝宝你觉得211能有多少保研名额"}, {"s": "江江", "t": "晚点开学挺好的宝宝"}, {"s": "江江", "t": "宝宝不要担心不要焦虑不要害怕 昨天我也想了想现在焦虑内耗好像没什么用了 现在开始做事到开学了继续努力 就不会担心了"}], "ask24": [{"s": "小周", "t": "宝宝我抢到了", "d": "2024-04-30"}, {"s": "小周", "t": "宝宝我在大巴扎给你选的礼物", "d": "2024-05-20"}, {"s": "小周", "t": "宝宝我们教学楼和你们长得不一样", "d": "2024-05-27"}], "ask25": [{"s": "江江", "t": "宝宝你没刘海吗", "d": "2024-04-01"}, {"s": "江江", "t": "宝宝你真的好厉害", "d": "2024-05-05"}, {"s": "江江", "t": "宝宝你收到了录取通知书了吗", "d": "2024-08-06"}], "sp": {"江江": 593, "小周": 408}, "cross": {"小周": {"宝宝": 394, "宝贝": 13, "贝贝": 0, "baby": 1}, "江江": {"宝宝": 405, "宝贝": 28, "贝贝": 9, "baby": 151}}, "night": {"2021": 1, "2023": 2, "2024": 39, "2025": 13, "2026": 5}, "anan": [{"d": "2020-10-07", "t": "安安子", "s": "匿名期"}, {"d": "2020-10-17", "t": "安安", "s": "匿名期"}, {"d": "2020-11-07", "t": "安安子", "s": "匿名期"}, {"d": "2020-12-05", "t": "你知道了我的真名", "s": "分界"}, {"d": "2021-01-28", "t": "安安（最后一次）", "s": "真名期"}], "W": {"baobao": "#D2541B", "baobei": "#DB5B93", "baby": "#E0B000", "beibei": "#8E6BBF"}};
const W35 = D35.W;
const PHASES = ['anan','words','heat','ask'];
const EL = id => document.getElementById(id);
const scene = document.getElementById('scene-3-5');
const bh = scene.querySelector('.bridge-hint');
let cur = -1, dmTimer = null, dmRunning = false;
const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

/* ---------- ph0 安安 ---------- */
function buildAnan(){
  const box = EL('a35Pencil'); box.innerHTML = '';
  D35.anan.forEach(r=>{
    const row = document.createElement('div');
    row.className = 'pr' + (r.s==='分界' ? ' cut' : '');
    const phaseLabel = r.s === '匿名期' ? '👤' : r.s === '分界' ? '❔' : '👩🏻';
    const phrase = r.t === '你知道了我的真名' ? '“快告诉我你叫什么”' : r.t;
    row.innerHTML = '<span class="pd">'+r.d+'</span><span class="pt">'+esc(phrase)+'</span><span class="ps">'+phaseLabel+'</span>';
    box.appendChild(row);
  });
}

/* ---------- ph1 四词 ---------- */
function buildWords(){
  const box = EL('act35Names'); box.innerHTML='';
  const row = document.createElement('div'); row.className='n-row';
  const keys = ['baobao','baby','baobei','beibei'];
  const sizes = {baobao:84, baby:54, baobei:44, beibei:36};
  keys.forEach(k=>{
    const o = D35.names[k];
    const w = document.createElement('div'); w.className='n-wrap'; w.dataset.k=k;
    w.addEventListener('click', function(e){ e.stopPropagation(); startDanmaku(k); });
    const h = sizes[k];
    w.innerHTML =
      '<div class="n-txt" style="font-size:'+h+'px;color:'+W35[k]+'">'+o.t+'</div>'+
      '<div class="n-bar" style="background:'+W35[k]+'"></div>'+
      '<div class="n-cnt">'+o.count+' <span>次 · '+o.pct+'%</span></div>'+
      '<div class="n-dots">'+
        (o.zc>0?'<span class="n-dot" style="background:var(--zhou)"></span>':'')+
        (o.jc>0?'<span class="n-dot" style="background:var(--jiang)"></span>':'')+
      '</div>';
    row.appendChild(w);
  });
  box.appendChild(row);
}

/* ---------- ph2 热力图 ---------- */
function buildHeat(){
  const box = EL('a35Heat'); box.innerHTML='';
  // —— 月度(71格太密) → 按季度聚合为 24 格 ——
  const QS = [];
  D35.months.forEach(m=>{
    const y = +m.slice(0,4), mo = +m.slice(5,7);
    const q = Math.floor((mo-1)/3) + 1;
    const tag = y + 'Q' + q;
    if(!QS.length || QS[QS.length-1].tag !== tag) QS.push({tag:tag, y:y, q:q, months:[]});
    QS[QS.length-1].months.push(m);
  });
  // 每人每季度的 主导词 / 总次数
  const agg = {};
  ['小周','江江'].forEach(p=>{
    agg[p] = QS.map(Q=>{
      const cnt = {}; let tot = 0;
      D35.heat[p].forEach(c=>{
        if(Q.months.indexOf(c.m) < 0) return;
        if(c.c){ cnt[c.w] = (cnt[c.w]||0) + c.c; tot += c.c; }
      });
      let dom = null, best = 0;
      Object.keys(cnt).forEach(w=>{ if(cnt[w] > best){ best = cnt[w]; dom = w; } });
      return {tag:Q.tag, y:Q.y, q:Q.q, w:dom, bc:best, c:tot, n:Q.months.length};
    });
  });
  let maxc = 1;
  ['小周','江江'].forEach(p=>agg[p].forEach(c=>{ if(c.c>maxc) maxc=c.c; }));

  ['小周','江江'].forEach(p=>{
    const row = document.createElement('div'); row.className='heat-row';
    const lab = document.createElement('div'); lab.className='heat-lab';
    lab.textContent = p; lab.style.color = (p==='小周'?'var(--zhou)':'var(--jiang)');
    const cells = document.createElement('div'); cells.className='heat-cells';
    agg[p].forEach(c=>{
      const el = document.createElement('div');
      el.className = 'heat-c';
      if(!c.c){ el.className += ' empty'; el.title = p+' '+c.tag+'（'+c.n+'个月）没有称呼'; }
      else{
        const rgb = hex2rgb(W35[keyOf(c.w)]);
        const a = (0.45 + 0.55 * Math.pow(c.c / maxc, 0.6)).toFixed(3);
        el.style.background = 'rgba('+rgb+','+a+')';
        el.title = p+' '+c.tag+'（'+c.n+'个月）｜以「'+c.w+'」为主 '+c.bc+' 次'
                 + (c.c>c.bc ? '，该季共 '+c.c+' 次' : '');
      }
      // 2024Q4 = 交接季（宝宝 36 : baby 33），2025Q1 baby 正式反超
      if(c.tag === '2025Q1'){ el.classList.add('cut'); }
      cells.appendChild(el);
    });
    row.appendChild(lab); row.appendChild(cells); box.appendChild(row);
  });

  // 年份轴：每年第一个季度下方标年份
  const ax = document.createElement('div'); ax.className='heat-ax';
  let lastY = null;
  QS.forEach(Q=>{
    const sp = document.createElement('span');
    if(Q.y !== lastY && Q.y !== 2020){ sp.textContent = Q.y; sp.className = 'ax-y'; lastY = Q.y; }
    ax.appendChild(sp);
  });
  box.appendChild(ax);

  // 图例
  const lg = EL('a35HeatLgd'); lg.innerHTML =
    ['宝宝','baby','宝贝','贝贝'].map(w=>'<div class="hi"><i style="background:'+W35[keyOf(w)]+'"></i>'+w+'</div>').join('')+
    '<div class="hi"><i style="background:repeating-linear-gradient(45deg,#e9e7e2 0 3px,#dbd7cf 3px 6px)"></i>没叫过</div>'+
    '<div class="hi cut-mk">▏ 从这格起，baby 超过了宝宝</div>';
}
function keyOf(w){ return {宝宝:'baobao',宝贝:'baobei',贝贝:'beibei',baby:'baby'}[w] || 'baobao'; }
function hex2rgb(h){ h=h.replace('#',''); return [0,2,4].map(i=>parseInt(h.substr(i,2),16)).join(','); }

/* ---------- ph3 安慰 ---------- */
function buildCare(){
  EL('a35CareStat').innerHTML =
    '<div class="st"><div class="sv">679</div><div class="sl">2024 年我们一共说了这么多次<br><span style="opacity:.75">占六年全部 67.8%</span></div></div>'+
    '<div class="st"><div class="sv">299</div><div class="sl">其中江江叫小周的「宝宝」<br><span style="opacity:.75">2023-09 ~ 2024-08</span></div></div>'+
    '<div class="st"><div class="sv">21</div><div class="sl">8 月 19 日<br><span style="opacity:.75">单日最多的一次</span></div></div>';
  const box = EL('a35Q819'); box.innerHTML='';
  const pick = ['噢宝宝我有点开学焦虑了','宝宝不要担心不要焦虑不要害怕','好吧宝宝咱们考研','北京欢迎你'];
  const shown = [];
  pick.forEach(sub=>{ const hit = D35.q819.find(q=>q.t.indexOf(sub)>=0); if(hit && !shown.includes(hit.t)) shown.push(hit.t), box.appendChild(mkQ(hit)); });
  if(!box.children.length) D35.q819.slice(0,5).forEach(q=>box.appendChild(mkQ(q)));
}
function mkQ(q){
  const el = document.createElement('div'); el.className='a35-q';
  const isZ = q.s==='小周';
  el.style.borderLeftColor = isZ ? 'var(--zhou)' : 'var(--jiang)';
  const txt = q.t.length>42 ? q.t.slice(0,42)+'…' : q.t;
  const head = document.createElement('span');
  head.className = 'qw';
  head.style.color = isZ ? 'var(--zhou)' : 'var(--jiang)';
  head.textContent = isZ ? '小周' : '江江';
  el.appendChild(head);
  el.appendChild(renderMsg(txt));
  return el;
}

/* ---------- ph4 关心 ---------- */
function buildAsk(){
  EL('a35AskRate').innerHTML = '江江 <b>120</b> 次接「你」，53 次接「我」；<br>'
    + '小周 <b>129</b> 次接「我」，103 次接「你」。<br>'
    + '<span style="font-size:19px;color:#8a8072">（江江 29% 的话是问句，小周 20%）</span>';
  const b24 = EL('a35Ask24'), b25 = EL('a35Ask25');
  b24.innerHTML='';
  b25.innerHTML='';
  D35.ask24.forEach(q=>b24.appendChild(mkAskQ(q, 'zhou')));
  b24.insertAdjacentHTML('beforeend','<div class="ask-note">（完全是在说自己的事吧！）</div>');
  D35.ask25.forEach(q=>b25.appendChild(mkAskQ(q, 'jiang')));
  b25.insertAdjacentHTML('beforeend','<div class="ask-note">（🥹一直在关心对面呢……）</div>');
}

function mkAskQ(q, who){
  const el = document.createElement('div'); el.className = 'a35-q ask-q ask-'+who;
  el.style.borderLeftColor = who === 'zhou' ? 'var(--zhou)' : 'var(--jiang)';
  el.appendChild(renderMsg(q.t));
  return el;
}

/* ---------- ph5 接力线 ---------- */
function buildRelay(){
  const box = EL('a35Relay'); if (!box) return;
  box.innerHTML='';
  const rows = [
    {k:'baobao', lag:45,   txt:'小周先叫的<br>江江 45 天后也跟着叫了'},
    {k:'baobei', lag:419,  txt:'江江先叫的<br>小周 14 个月后才跟着叫'},
    {k:'baby',   lag:681,  txt:'江江先叫的<br>22.7 个月后小周只叫过 1 次'},
    {k:'beibei', lag:null, txt:'江江先叫的<br><b>小周一次也没叫过</b>'},
    {k:'anan',   lag:null, txt:'江江给小周取的<br>4 次之后就再没有了'}
  ];
  const maxLag = 681;
  rows.forEach(r=>{
    const o = r.k==='anan' ? {t:'安安'} : D35.names[r.k];
    const el = document.createElement('div'); el.className='rrow';
    const lab = document.createElement('div'); lab.className='rlab';
    lab.textContent = o.t;
    lab.style.color = r.k==='anan' ? '#a2988a' : W35[r.k];
    const line = document.createElement('div'); line.className='rline'+(r.lag===null?' dash':'');
    if(r.lag!==null) line.style.width = Math.max(14, Math.round(100*r.lag/maxLag))+'%';
    const i = document.createElement('i'); i.style.color = (r.k==='anan'||r.k==='beibei'||r.k==='baby'||r.k==='baobei') ? 'var(--jiang)' : 'var(--zhou)';
    line.appendChild(i);
    if(r.lag!==null){
      const b = document.createElement('b');
      b.style.background = r.k==='baobao' ? 'var(--jiang)' : 'var(--zhou)';
      if(r.k==='baby') b.style.opacity='.4';
      line.appendChild(b);
    }
    const txt = document.createElement('div'); txt.className='rtxt';
    txt.innerHTML = r.txt;
    el.appendChild(lab); el.appendChild(line); el.appendChild(txt);
    box.appendChild(el);
  });
}

/* ---------- ph6 收尾 ---------- */
function buildFinal(){
}

/* ---------- 弹幕：点哪个词，飘哪个词的句子 ---------- */
const DM_LANES = [110, 165, 220, 275, 330, 960, 1015, 1070, 1125, 1180];
let dmLane = 0, dmDone = false, dmTimers = [], dmCur = null;

/* 高亮当前词，其余淡出；k 为 null 时全部复原 */
function focusWord(k, on){
  const wraps = document.querySelectorAll('#ph-words .n-wrap');
  Array.prototype.forEach.call(wraps, function(w){
    const is = (w.dataset.k === k);
    gsap.to(w, { opacity: on ? (is ? 1 : 0.22) : 1,
                 scale: (on && is) ? 1.12 : 1,
                 duration: .45, ease: 'power2.out' });
  });
  const tip = EL('a35DmTip');
  if(tip) gsap.to(tip, {opacity: on ? 0 : 1, duration:.35});
}
function spawnDm(item, wordKey){
  const el = document.createElement('div');
  el.className = 'dm ' + item.who;
  // 称呼弹幕复用聊天记录工具的 PNG 映射，避免 [宝宝] 等退回成方括号文字。
  el.appendChild(renderMsg(item.t, 27, 28));
  const y = DM_LANES[dmLane % DM_LANES.length]; dmLane++;
  const x = 800, tx = -760;
  el.style.left = x + 'px'; el.style.top = y + 'px';
  EL('act35Danmaku').appendChild(el);
  gsap.to(el, { x: tx - x, y: 0, duration: 13.5 + Math.random()*1.5, ease: 'none',
               onComplete: function(){ el.remove(); } });
}
/* 洗牌 */
function shuffle(a){ for(var i=a.length-1;i>0;i--){ var j=Math.floor(Math.random()*(i+1));
  var t=a[i]; a[i]=a[j]; a[j]=t; } return a; }
/* 每次点：锚点句必现 + 随机补足，按时间排序 */
const DM_TAKE = 12, DM_GAP = 850;
function drawPool(k){
  var all = D35.pool[k] || [];
  var anc = all.filter(function(x){ return x.a; });
  var rest = shuffle(all.filter(function(x){ return !x.a; }));
  var n = Math.min(DM_TAKE, all.length);
  var sel = anc.concat(rest.slice(0, Math.max(0, n - anc.length)));
  sel.sort(function(x,y){ return x.d < y.d ? -1 : (x.d > y.d ? 1 : 0); });
  return sel;
}
/* 点一个词 → 从这个词的句子里随机飘一批 */
function startDanmaku(k){
  const list = drawPool(k);
  if(!list.length) return;
  endDanmaku(true);
  dmRunning = true; dmDone = false; dmLane = 0; dmCur = k;
  focusWord(k, true);
  list.forEach(function(it, n){
    dmTimers.push(setTimeout(function(){ spawnDm(it, k); }, n * DM_GAP));
  });
  dmTimers.push(setTimeout(function(){ endDanmaku(); }, list.length * DM_GAP + 3400));
}
/* initScene35 / next 用这个名字调用；等价于 endDanmaku（立即清空） */
function stopDanmaku(hard){ endDanmaku(hard === undefined ? true : hard); }
function endDanmaku(hard){
  if(dmDone && !hard) return;
  dmDone = true;
  dmTimers.forEach(clearTimeout); dmTimers = []; dmRunning = false; dmCur = null;
  focusWord(null, false);
  gsap.to('#act35Danmaku .dm', { opacity: 0, duration: hard ? 0 : .8,
    onComplete: function(){ EL('act35Danmaku').innerHTML = ''; } });
}
/* ---------- 分步 ---------- */
function showPhase(i){
  cur = i;
  PHASES.forEach(p=>{ const e=EL('ph-'+p); if(e) e.classList.toggle('on', p===PHASES[i]); });
  gsap.set(bh,{opacity:0});
  const ph = EL('ph-'+PHASES[i]);
  const items = ph.querySelectorAll('.a35-kick,.a35-h,.a35-sub,.a35-note,.a35-tiny,.a35-pencil,.n-wrap,.a35-lgd,.heat-box,.a35-q,.rlab,.rtxt,.a35-stat,.a35-recbtn');
  gsap.set(items,{opacity:0, y:14});
  gsap.to(items,{opacity:1, y:0, duration:.8, stagger:.11, ease:'power2.out', delay:.15});
  const rb = ph.querySelector('.a35-recbtn');
  if(rb){ gsap.to(rb,{opacity:1, y:0, duration:.7, delay:.15 + items.length*0.11 + .25, ease:'power2.out'}); }

  if(PHASES[i]==='words'){
    const wraps = ph.querySelectorAll('.n-wrap');
    gsap.fromTo(wraps,{scale:.86},{scale:1,duration:.9,stagger:.16,ease:'back.out(1.7)',delay:.5});
    if(EL('a35DmTip')) gsap.set(EL('a35DmTip'),{opacity:1});
  } else if(PHASES[i]==='heat'){
    const labs = ph.querySelectorAll('.rlab'), rtxt = ph.querySelectorAll('.rtxt');
    ph.querySelectorAll('.rline').forEach((l,n)=>{
      gsap.fromTo(l,{scaleX:0},{scaleX:1,duration:.65,delay:1.2+n*.12,ease:'power2.out',transformOrigin:'left center'});
    });
    gsap.to([labs,rtxt],{opacity:1,y:0,duration:.65,stagger:.08,delay:1.05,ease:'power2.out'});
  } else {
    gsap.delayedCall(1.9, ()=>{ fadeHint(); });
  }
}
function fadeHint(){ gsap.to(bh,{opacity:1,duration:.7}); }

function next(){
  if(EL('a35RecBox').classList.contains('on')){ closeRecords(); return; }
  if(dmRunning){
    endDanmaku();
    if(cur >= PHASES.length-1 && typeof goToScene === 'function') goToScene(5);
    return;
  }
  if(cur < PHASES.length-1){ stopDanmaku(true); showPhase(cur+1); }
  else if(typeof window.App === 'object' && window.App.next){ stopDanmaku(true); window.App.next(); }
  else if(typeof goToScene === 'function'){ stopDanmaku(true); goToScene(5); }
}

/* ---------- 全量记录：点按钮就地展开（不新开一页） ---------- */

/* 微信表情 / emoji 映射渲染：与聊天记录工具同一套规则（emoji_map.json + Apple 雪碧图） */
const WC_STK = {
  '流泪':'assets/第三幕-絮语/表情通胀_words/流泪.png','拥抱':'assets/第三幕-絮语/表情通胀_words/拥抱.png','捂脸':'assets/第三幕-絮语/表情通胀_words/捂脸.png',
  '可怜':'assets/第三幕-絮语/表情通胀_words/可怜.png','苦涩':'assets/第三幕-絮语/表情通胀_words/苦涩.png','亲亲':'assets/第三幕-絮语/表情通胀_words/亲亲.png',
  '庆祝':'assets/第三幕-絮语/表情通胀_words/庆祝.png','呲牙':'assets/第三幕-絮语/表情通胀_words/呲牙.png','OK':'assets/第三幕-絮语/表情通胀_words/OK.png',
  '蛋糕':'assets/第三幕-絮语/表情通胀_words/蛋糕.png','拳头':'assets/第三幕-絮语/表情通胀_words/拳头.png','转圈':'assets/第三幕-絮语/表情通胀_words/转圈.png',
  '晕':'assets/第三幕-絮语/表情通胀_words/晕.png','色':'assets/第三幕-絮语/表情通胀_words/色.png','跳跳':'assets/第三幕-絮语/表情通胀_words/跳跳.png',
  '旺柴':'assets/第三幕-絮语/表情通胀_words/旺柴.png','哇':'assets/第三幕-絮语/表情通胀_words/哇.png','胜利':'assets/第三幕-絮语/表情通胀_words/胜利.png',
  '撇嘴':'assets/第三幕-絮语/表情通胀_words/撇嘴.png','吐':'assets/第三幕-絮语/表情通胀_words/吐.png','睡':'assets/第三幕-絮语/表情通胀_words/睡.png',
  '骷髅':'assets/第三幕-絮语/表情通胀_words/骷髅.png','裂开':'assets/第三幕-絮语/表情通胀_words/裂开.png'
};
const _A35MAP = window.APPLE_EMOJI_MAP || {};
const _A35COLS = (window.APPLE_EMOJI_GRID || {cols:62}).cols;
const _A35ROWS = (window.APPLE_EMOJI_GRID || {rows:62}).rows;
const _A35VS = /\uFE0F|\uFE0E/g;
function _a35cell(ch){ return _A35MAP[(ch||'').replace(_A35VS,'')] || null; }
function _a35span(ch, size){
  const s=document.createElement('span'); s.className='apple-emoji';
  const cell=_a35cell(ch);
  if(!cell){ s.textContent=ch; }
  else { const px=cell[0]/(_A35COLS-1)*100, py=cell[1]/(_A35ROWS-1)*100; s.style.backgroundPosition=px+'% '+py+'%'; }
  s.style.width=size+'px'; s.style.height=size+'px';
  return s;
}
function _a35stk(name, size){
  const img=document.createElement('img'); img.className='rec-stk';
  img.src=WC_STK[name]; img.alt='['+name+']'; img.style.height=size+'px'; img.draggable=false;
  return img;
}
/* 把消息文本渲染成 DOM：微信表情 [名]→PNG，真实 emoji→Apple 雪碧图，其余当文字 */
function renderMsg(text, emSize, stkSize){
  emSize = emSize || 20; stkSize = stkSize || 22;
  const frag = document.createDocumentFragment();
  const buf = [];
  const flush = function(){ if(buf.length){ frag.appendChild(document.createTextNode(buf.join(''))); buf.length = 0; } };
  const n = text ? text.length : 0;
  let i = 0;
  while(i < n){
    const ch = text[i];
    if(ch === '['){                          // 微信表情标记 [名]
      const j = text.indexOf(']', i);
      if(j !== -1){
        const name = text.slice(i+1, j);
        if(WC_STK[name]){ flush(); frag.appendChild(_a35stk(name, stkSize)); i = j + 1; continue; }
        buf.push(text.slice(i, j+1)); i = j + 1; continue;
      }
    }
    if(ch === '️' || ch === '‍'){ i++; continue; }   // 变体选择符 / 零宽连接符，并入上一 emoji
    let cp = ch, step = 1;
    const cc = ch.charCodeAt(0);
    if(cc >= 0xD800 && cc <= 0xDBFF && i+1 < n){
      const lo = text.charCodeAt(i+1);
      if(lo >= 0xDC00 && lo <= 0xDFFF){ cp = ch + text[i+1]; step = 2; }
    }
    const cell = _a35cell(cp);
    if(cell){ flush(); frag.appendChild(_a35span(cp, emSize)); } else { buf.push(cp); }
    i += step;
  }
  flush();
  return frag;
}

const RECS = [["2020-10-04","j","宝贝","是爱情来了吗宝贝"],["2020-10-05","j","宝贝","大宝贝"],["2020-10-06","j","宝贝","大宝贝啊"],["2020-10-08","j","宝贝","大宝贝儿"],["2020-12-05","j","宝贝","噢大宝贝"],["2020-12-05","j","宝贝","大宝贝AAAAA"],["2020-12-05","j","宝贝","大宝贝"],["2020-12-30","j","宝贝","大宝贝[旺柴]我放假了"],["2020-12-30","j","宝贝","假期快乐大宝贝"],["2021-01-09","j","宝贝","大宝贝我走了[旺柴]"],["2021-01-09","j","宝贝","大宝贝你在吗"],["2021-02-05","j","宝贝","大宝贝"],["2021-09-21","j","宝贝","啊宝贝，中秋节快乐[亲亲]"],["2021-11-27","j","宝贝","不行宝贝我好困我今天跳的累死了[亲亲]"],["2021-11-27","z","宝贝","宝贝儿晚安安！"],["2022-01-01","z","宝贝","新年快乐宝贝"],["2022-02-01","z","宝贝","宝贝新年快乐！"],["2022-02-01","j","宝贝","宝贝新年快乐[庆祝][庆祝][庆祝]"],["2022-03-29","z","宝贝","嘿嘿谢谢宝贝[亲亲]"],["2022-12-25","z","宝贝","宝贝平平安安哦"],["2023-04-15","j","宝贝","你是高二宝贝"],["2023-08-13","j","宝贝","我靠宝贝你好瘦啊"],["2023-08-28","z","宝贝","给勇敢宝贝奖励糖糖[亲亲]"],["2023-09-06","z","宝宝","宝宝你真的好小一只[可怜][可怜][可怜]"],["2023-09-06","j","宝贝","救命宝贝你到底是怎么了"],["2023-09-17","j","宝贝","好困啊我要睡了宝贝"],["2023-09-25","j","宝贝","宝贝你有没有压力很大[拥抱]"],["2023-09-28","z","宝贝","江江宝贝生日快乐[蛋糕][蛋糕]"],["2023-09-28","z","宝贝","今天是江琳宝贝的生日🎂这个时候生日的人  是未来之星🌟是国家栋梁🏠是都市小说的商业大颚💎是吾日三省吾身的自律者🉑️是相亲节目里的心动嘉宾💗是自然界的丛林之王👑是世间所有恶与丑的唾弃者🔥是世间所有美与好的创作者❗️❗️"],["2023-09-30","j","宝贝","宝贝你是被盗号了吗"],["2023-10-10","j","宝贝","晚安宝贝[呲牙]"],["2023-10-21","j","宝宝","抱抱宝宝"],["2023-10-28","j","宝宝","OMG那你是扭伤了两只脚宝宝"],["2023-10-30","j","宝贝","但是你是在新疆考啊宝贝"],["2024-01-01","z","宝贝","宝贝新年快乐[庆祝][庆祝][庆祝]"],["2024-01-05","z","宝宝","宝宝好可爱！！！抓过来亲一口/::*"],["2024-01-13","j","宝贝","加油宝贝真棒"],["2024-02-10","j","宝宝","新年快乐宝宝[呲牙]"],["2024-02-10","z","宝贝","宝贝新年快乐啊啊啊啊啊"],["2024-02-17","j","宝宝","晚安宝宝"],["2024-02-18","z","宝宝","宝宝你现在也是学生年代"],["2024-02-24","j","宝宝","宝宝生日快乐[庆祝][庆祝][庆祝][蛋糕][蛋糕][蛋糕] 在元宵节迎来了神奇的十八岁，在新的一岁里祝你身体健康 学业进步，高考考上喜欢的大学，在合适的时机和恋爱脑在一起，过一个快乐而充实的十八岁[转圈][转圈][转圈]"],["2024-03-08","j","宝宝","噢 怎么这么想呢宝宝 那个砸下来头都要爆了好痛的[晕][晕]"],["2024-03-13","z","宝宝","宝宝你生的不早"],["2024-03-16","z","宝宝","天杀的狗贩子我一眼就认出来这是我的宝宝"],["2024-03-22","j","宝宝","宝宝你以后再也不用僵了，因为你的江来了，再也不用淋了，因为你的琳来了，再也不用有……"],["2024-03-22","j","宝宝","哦可怜的宝宝可怜的宝宝"],["2024-03-22","j","宝宝","宝宝你一定要安安心心的啊现在什么的坎在未来回头看都会是轻舟已过万重山的"],["2024-03-23","z","宝宝","宝宝好米/:<L>"],["2024-03-24","j","宝宝","可怜的宝宝"],["2024-03-24","j","宝宝","当然会哒宝宝[跳跳]"],["2024-03-24","z","宝宝","宝宝好米"],["2024-03-26","j","宝宝","演唱会真的直接去做吧宝宝[可怜][可怜][可怜][可怜]"],["2024-03-26","j","宝贝","宝贝我要睡觉了[可怜][可怜]"],["2024-04-01","j","宝宝","宝宝你没刘海吗"],["2024-04-04","j","宝宝","哦可怜的宝宝头痛"],["2024-04-04","j","宝宝","晚安宝宝 祝你早早睡着"],["2024-04-04","z","宝宝","宝宝你好像旅行青蛙"],["2024-04-07","z","宝宝","特别厉害的宝宝"],["2024-04-12","j","宝宝","宝宝这"],["2024-04-13","j","宝宝","宝宝羟基一定要报[流泪]"],["2024-04-23","j","宝宝","宝宝可爱"],["2024-04-23","j","宝宝","宝宝高考还有很多变数就算算上乌鲁木齐"],["2024-04-23","j","宝宝","宝宝加油💪💪💪💪"],["2024-04-27","j","宝宝","漂亮的宝宝[色][色]"],["2024-04-30","z","宝宝","宝宝我抢到了"],["2024-05-01","j","宝宝","哦我的天宝宝那你要买下"],["2024-05-04","z","宝宝","宝宝给我一个收货地址"],["2024-05-04","j","宝宝","宝宝那你也给我一个你更新了的地址吧"],["2024-05-05","j","宝宝","宝宝你真的好厉害"],["2024-05-06","j","宝宝","宝宝不要伤心了 人有的时候留不住都会像水一样溜走的"],["2024-05-07","j","宝宝","夏天到了宝宝它怎么还在发情"],["2024-05-09","j","宝宝","宝宝我真的要做我的线代作业了"],["2024-05-11","j","宝宝","宝宝美美哒去参加成人礼"],["2024-05-12","j","宝宝","美美宝宝穿旗袍很漂亮 配了个帽子像民国会读书的小姐[呲牙]"],["2024-05-12","j","宝宝","宝宝很快就会涨起来了[呲牙]高考完之后出去胡吃海喝"],["2024-05-16","j","宝宝","对的宝宝保持住这种状态保持住[拳头][拳头][拳头]"],["2024-05-16","j","宝宝","宝宝你自己一个人去吗"],["2024-05-16","j","宝宝","晚安宝宝"],["2024-05-16","j","宝宝","好可怕虽然你睡了 但是我的手机说完晚安宝宝的时候 他自己在对话框里蹦出来一句：现在说晚安是不是有一点点早[撇嘴]"],["2024-05-17","j","宝贝","笑死了才看到这句中西结合上了宝贝你是"],["2024-05-17","j","宝宝","宝宝对不起我现在才想起来回信息"],["2024-05-17","j","宝宝","谢谢宝宝且看我给你什么惊喜"],["2024-05-17","z","宝宝","宝宝你吃奶制品吗"],["2024-05-17","j","宝宝","[拥抱][拥抱][拥抱][拥抱][拥抱]等等明天的演唱会会让宝宝少一点焦虑的 这次开的药也会有用的"],["2024-05-18","j","宝宝","宝宝你已经睡着了吧"],["2024-05-18","j","宝宝","宝宝你已经j到了一种程度"],["2024-05-18","j","宝宝","宝宝现在去奥体了吗"],["2024-05-18","z","宝宝","宝宝来乌鲁木齐一定要吃这个"],["2024-05-18","j","宝宝","宝宝你是看着晚霞开始演唱会的吗"],["2024-05-20","z","宝宝","宝宝我在大巴扎给你选的礼物"],["2024-05-20","j","宝宝","宝宝你不会已经被"],["2024-05-20","j","宝宝","我的天抱抱抱宝宝"],["2024-05-20","j","宝宝","晚安宝宝"],["2024-05-20","z","宝宝","晚安宝宝"],["2024-05-20","j","宝宝","不行宝宝你快睡吧因为我也的睡了"],["2024-05-22","z","宝宝","快递到了宝宝"],["2024-05-22","z","宝宝","宝宝它不是笛子哈哈哈哈"],["2024-05-23","j","宝宝","宝宝我等一下要考试了。。。。让我复习十五分钟"],["2024-05-25","j","宝宝","好困啊宝宝我想睡觉了"],["2024-05-25","j","宝宝","晚安宝宝"],["2024-05-25","z","宝宝","晚安宝宝"],["2024-05-26","z","宝宝","啊啊啊啊宝宝你有点太有魅力了……"],["2024-05-27","z","宝宝","宝宝我们教学楼和你们长得不一样"],["2024-05-27","j","宝宝","sorry宝宝"],["2024-05-27","z","宝宝","宝宝教我怎么省下旅游经费[流泪][流泪]"],["2024-05-27","j","宝宝","宝宝其实我的旅游经费都是我的压岁钱来的"],["2024-05-27","z","宝宝","特别厉害的宝宝"],["2024-05-27","j","宝宝","可怜的宝宝"],["2024-05-27","z","宝宝","宝宝你去看张信哲鸟巢演唱会吗"],["2024-05-27","j","宝宝","宝宝你不要伤心[流泪]"],["2024-05-28","j","宝宝","哦莫宝宝我明天去给你寄个东西"],["2024-05-29","j","宝宝","宝宝你变得喜欢记录一切了好美"],["2024-05-29","j","宝宝","宝宝你的电话号码真好"],["2024-05-29","j","宝宝","宝宝你妈妈的电话号码真好"],["2024-05-30","z","宝宝","宝宝你的字本来就很好看"],["2024-05-31","j","宝宝","一定会一切顺利的宝宝"],["2024-06-01","j","宝宝","[拥抱][拥抱][拥抱][拥抱]宝宝不要伤心"],["2024-06-01","j","宝宝","可能老师不善于表达没关系宝宝"],["2024-06-01","j","宝宝","宝宝我刚刚在坐公交车"],["2024-06-01","j","宝宝","喔不会的宝宝"],["2024-06-01","j","宝宝","[拥抱][拥抱][拥抱][拥抱]宝宝好好睡吧"],["2024-06-03","z","宝宝","宝宝你已经是成熟的大学生了"],["2024-06-04","z","宝宝","！！宝宝我好爱你[流泪][流泪][流泪]"],["2024-06-04","j","宝宝","[流泪][流泪][流泪]那是因为宝宝你好好[流泪][流泪][流泪]"],["2024-06-04","j","宝宝","但是宝宝你可以去设置里面搜索：双开"],["2024-06-04","j","宝宝","至少是会做题的宝宝"],["2024-06-05","j","宝宝","宝宝我偷偷摘了送去给你"],["2024-06-06","j","宝宝","还没睡宝宝"],["2024-06-06","z","宝宝","晚安宝宝"],["2024-06-06","j","宝宝","晚安宝宝 晚安好梦"],["2024-06-06","j","宝宝","不学不学 宝宝一定可以学到想学的"],["2024-06-06","j","宝宝","没关系宝宝已经有一张了"],["2024-06-06","j","宝宝","没事宝宝"],["2024-06-07","j","宝宝","棒棒宝宝"],["2024-06-07","j","宝宝","宝宝今天加油哦[拳头][拳头][拳头]"],["2024-06-07","j","宝宝","不用担心宝宝加油"],["2024-06-07","j","宝宝","宝宝你肯定睡啦 晚安好梦"],["2024-06-08","z","宝宝","考完了宝宝"],["2024-06-08","j","宝宝","期待宝宝的全新面貌"],["2024-06-09","j","宝宝","宝宝你真的我哭死"],["2024-06-09","j","宝宝","我的天宝宝那你带着这两块砖头到处跑啊？"],["2024-06-09","j","宝宝","我替你爽啊我真的替你感到开心啊宝宝"],["2024-06-09","j","宝宝","别咒我了宝宝[捂脸][捂脸][捂脸]"],["2024-06-09","j","宝宝","哦宝宝要付医药费[拥抱][拥抱]"],["2024-06-10","j","宝宝","omg宝宝我终于回到来了"],["2024-06-10","j","宝宝","这么多地方宝宝要玩遍了"],["2024-06-10","j","宝宝","其实现在也算安全啦只要宝宝你安全意识拉满就好"],["2024-06-10","j","宝宝","好自由啊宝宝好开心好舒服好爽啊"],["2024-06-10","j","宝宝","[呲牙][呲牙][呲牙][呲牙]宝宝值得这么幸福"],["2024-06-10","j","宝宝","我嘞逗宝宝那你就只剩下"],["2024-06-10","j","宝宝","不？宝宝你已经学会了excel记账了吗"],["2024-06-10","j","宝宝","[流泪][流泪]演我 宝宝真的不要学经管"],["2024-06-11","j","宝宝","诶宝宝我刚刚起床点开来看呢"],["2024-06-11","j","宝宝","诶宝宝你到乌鲁木齐了吧"],["2024-06-11","j","宝宝","谢谢宝宝[亲亲][亲亲][亲亲][亲亲]"],["2024-06-11","j","宝宝","不是宝宝？你这真的"],["2024-06-11","z","宝宝","宝宝我的压岁钱还没到能让我玩一圈那么多"],["2024-06-12","j","宝宝","我嘞逗宝宝你怎么看上这些书了"],["2024-06-12","j","宝宝","对的没错宝宝"],["2024-06-12","j","宝宝","好漂亮啊宝宝"],["2024-06-13","j","宝宝","哈哈哈宝宝你也是跑上章了"],["2024-06-14","j","宝宝","还有一个半钟宝宝你就要起床了"],["2024-06-14","z","宝宝","要起飞了宝宝"],["2024-06-14","j","宝宝","宝宝你应该到长沙了吧"],["2024-06-14","j","宝宝","不儿？宝宝你飞了五个钟吗"],["2024-06-14","z","宝宝","宝宝新疆飞哪都很久"],["2024-06-14","z","宝宝","嗨宝宝我在杜甫江阁旁边又给你寄了明信片"],["2024-06-15","j","宝宝","宝宝好瘦[色][色]"],["2024-06-15","j","宝宝","宝宝你什么时候听演唱会"],["2024-06-15","z","宝宝","噢宝宝我试着给你寄明信片大小的卡"],["2024-06-15","j","宝宝","nonono宝宝"],["2024-06-15","j","宝宝","宝宝瘦瘦的穿好多裙子都肯定很好看"],["2024-06-16","j","宝宝","宝宝我"],["2024-06-16","j","宝宝","宝宝"],["2024-06-16","j","宝宝","宝宝要吃饭啊"],["2024-06-17","j","宝宝","宝宝我现在要进考场了"],["2024-06-18","j","宝宝","宝宝你怎么4:00点了个肠粉"],["2024-06-18","j","宝宝","你现在才起床吗宝宝"],["2024-06-18","j","宝宝","宝宝现在去哪里"],["2024-06-20","z","宝宝","宝宝我改主意了我大概7月十几号在北京[哇][哇]"],["2024-06-20","z","宝宝","但是宝宝我决定我就在北京待一晚"],["2024-06-20","z","宝宝","宝宝我决定在天津住"],["2024-06-21","j","宝宝","宝宝今天去哪里玩啦"],["2024-06-21","z","宝宝","宝宝下次还是写满分吧 以后就150了"],["2024-06-21","z","宝宝","宝宝我这么大的时候还在挑清华北大[流泪][流泪]"],["2024-06-22","j","宝宝","宝宝我也要去南京"],["2024-06-22","j","宝宝","宝宝你下一步去南京吗"],["2024-06-23","j","宝宝","宝宝"],["2024-06-23","j","宝宝","谢谢宝宝[流泪][流泪][流泪][流泪]"],["2024-06-23","z","宝宝","宝宝我觉得这边应该秋天来"],["2024-06-23","j","宝宝","超好看这张宝宝"],["2024-06-23","z","宝宝","宝宝我腿要断了"],["2024-06-24","z","宝宝","宝宝你这么聪明能不能帮我报志愿[可怜][可怜][可怜]"],["2024-06-25","j","宝宝","我还以为宝宝你叫我帮你填志愿呢"],["2024-06-25","j","宝宝","宝宝我好喜欢你的照片啊"],["2024-06-25","z","宝宝","宝宝有北京游玩攻略吗"],["2024-06-25","j","宝宝","宝宝我都不敢开口和你说话"],["2024-06-25","z","宝宝","宝宝我紧张死了"],["2024-06-25","z","宝宝","写完宝宝你先看"],["2024-06-25","j","宝宝","宝宝你真好"],["2024-06-25","z","宝宝","宝宝你每个地方就待一天吗"],["2024-06-25","j","宝宝","两间房宝宝放心 [捂脸]"],["2024-06-25","j","宝宝","宝宝我看完了"],["2024-06-25","j","宝宝","不行了宝宝我要复习那个鬼微观经济学了[吐]"],["2024-06-25","j","宝宝","宝宝你抢到哪一天看薛之谦的票"],["2024-06-25","j","宝宝","啊宝宝这么迅速吗"],["2024-06-25","z","宝宝","宝宝我们一共9个学校"],["2024-06-25","z","宝宝","宝宝我上大学要卷实习"],["2024-06-26","z","宝宝","宝宝我查分之前睡很好"],["2024-06-26","j","宝宝","我嘞逗宝宝我爬起来"],["2024-06-26","z","宝宝","宝宝你"],["2024-06-26","j","宝宝","这是在哪里吃的宝宝"],["2024-06-26","j","宝宝","宝宝你去了南京大屠杀遇难者纪念馆吗"],["2024-06-27","j","宝宝","宝宝我还剩最后一科了"],["2024-06-27","z","宝宝","加油宝宝"],["2024-06-27","j","宝宝","什么时候放票宝宝"],["2024-06-27","j","宝宝","我嘞逗这么多宝宝"],["2024-06-27","j","宝宝","哇哇哇宝宝这是哪"],["2024-06-27","z","宝宝","宝宝我已经学会像本地人一样坐地铁了"],["2024-06-27","j","宝宝","宝宝你什么时候去山东"],["2024-06-27","j","宝宝","宝宝[流泪][流泪][流泪][流泪][流泪][流泪][流泪]"],["2024-06-27","j","宝宝","好漂亮好美宝宝"],["2024-06-27","z","宝宝","宝宝你说得对"],["2024-06-27","z","宝宝","宝宝半斤是多少"],["2024-06-29","j","宝宝","宝宝骚瑞一天才回你的消息"],["2024-06-29","j","宝宝","差点以为宝宝你就要在迪士尼了"],["2024-06-29","j","宝宝","哦莫宝宝[拥抱][拥抱][拥抱]周游列省"],["2024-06-29","j","宝宝","但是宝宝"],["2024-06-29","j","宝宝","今天在杭州走的腿都要断了 宝宝你好厉害每天走那么多"],["2024-06-30","z","宝宝","宝宝你说话能中英自由切换吗"],["2024-06-30","j","宝宝","不可以宝宝我最多中英夹杂"],["2024-06-30","j","宝宝","宝宝你住的是民宿吗"],["2024-07-01","j","宝宝","宝宝我来啦"],["2024-07-01","j","宝宝","宝宝这是上海火车站"],["2024-07-01","j","宝宝","记错了宝宝 人民广场站"],["2024-07-02","j","宝宝","宝宝你看"],["2024-07-02","j","宝宝","宝宝可是你敢信吗"],["2024-07-04","j","宝宝","宝宝什么小彩条"],["2024-07-04","j","宝宝","yeah宝宝我拿到啦"],["2024-07-04","j","宝宝","宝宝我们打算明天早上去喝早茶哈哈哈哈"],["2024-07-06","z","宝宝","噢宝宝我也看到了"],["2024-07-06","j","宝宝","回到这个北京了宝宝你还在江浙沪"],["2024-07-07","j","宝宝","宝宝对不起回来之后大睡特睡都忘了回信息了[晕]"],["2024-07-07","z","宝宝","宝宝你要听评弹记得早一周抢第一排"],["2024-07-07","z","宝宝","宝宝我总以为我的衣服一直没晒干"],["2024-07-07","j","宝宝","笑死了宝宝这可能是南北方人的差异可能"],["2024-07-09","z","宝宝","宝宝国博故宫如果一天逛完有可能吗"],["2024-07-09","j","宝宝","哦这个名宿好漂亮宝宝"],["2024-07-09","z","宝宝","噢宝宝你怎么了[可怜]"],["2024-07-09","z","宝宝","宝宝你看山塘街亮灯"],["2024-07-11","j","宝宝","宝宝你几时在天津"],["2024-07-11","z","宝宝","宝宝你去雍和宫拜过吗"],["2024-07-11","j","宝宝","去拜过宝宝"],["2024-07-11","j","宝宝","一定会实现的宝宝"],["2024-07-12","j","宝宝","谢谢宝宝😘😘"],["2024-07-12","j","宝宝","宝宝你到天津啦"],["2024-07-12","j","宝宝","宝宝你要在机场呆一晚上吗"],["2024-07-12","z","宝宝","然后想到宝宝你还没成年"],["2024-07-12","z","宝宝","宝宝别去世纪钟"],["2024-07-12","j","宝宝","宝宝别去西北角"],["2024-07-13","j","宝宝","八珍豆腐好吃吗宝宝"],["2024-07-13","z","宝宝","宝宝北京下雨吗[苦涩][苦涩][苦涩][苦涩]"],["2024-07-13","j","宝宝","下着呢宝宝"],["2024-07-13","z","宝宝","宝宝明天天津雷阵雨"],["2024-07-13","j","宝宝","[流泪][流泪][流泪][流泪][流泪][流泪][流泪]真的宝宝 上高中的时候我发誓不会做和钱强烈挂钩的东西"],["2024-07-13","z","宝宝","噢宝宝我要睡了"],["2024-07-13","j","宝宝","晚安宝宝"],["2024-07-13","j","宝宝","我嘞逗宝宝我收个衣服你咋醒了"],["2024-07-13","j","宝宝","宝宝来打卡了哈哈哈哈"],["2024-07-13","z","宝宝","没救了宝宝512G都救不活了"],["2024-07-14","z","宝宝","宝宝我跑了一下午领的物料全丢了"],["2024-07-14","j","宝宝","我嘞逗宝宝我总算是吃完这场酣畅淋漓的烧烤了"],["2024-07-14","j","宝宝","不是宝宝"],["2024-07-14","j","宝宝","我的天宝宝要不你点个外卖吃"],["2024-07-14","z","宝宝","宝宝你觉得这个点有什么外卖"],["2024-07-14","j","宝宝","宝宝你觉得这个点有什么外卖"],["2024-07-14","j","宝宝","所以说宝宝这个是4K的吗"],["2024-07-16","z","宝宝","宝宝你睡好晚"],["2024-07-16","z","宝宝","宝宝你觉得这个行程是能赶完的吗[晕]"],["2024-07-16","j","宝宝","我嘞逗啊宝宝你寄了个啥啊"],["2024-07-17","j","宝宝","宝宝你现在应该快到奥体了吧"],["2024-07-17","j","宝宝","宝宝你每一个都跪下来拜吗"],["2024-07-17","z","宝宝","宝宝"],["2024-07-17","j","宝宝","啊宝宝你已经坐上了？"],["2024-07-18","j","宝宝","哦莫宝宝你现在已经在飞机上啦"],["2024-07-20","j","宝宝","宝宝，你这是有多少的文件呀"],["2024-07-20","j","宝宝","宝宝，你这一趟到底是有多少东西啊"],["2024-07-20","j","宝宝","宝宝你大概有1000G"],["2024-07-23","z","宝宝","oh宝宝你这是玩了多久"],["2024-07-25","j","宝宝","宝宝你去哪个城市上学"],["2024-07-25","j","宝宝","宝宝可以去吉林找你玩了"],["2024-07-25","j","宝宝","宝宝你回去的几天要倒时差吗"],["2024-07-25","j","宝宝","去找宝宝玩"],["2024-07-25","j","宝宝","过线了就安心吧宝宝"],["2024-07-26","j","宝宝","期待 宝宝你填了啥"],["2024-07-26","j","宝宝","我嘞都好高级宝宝"],["2024-07-26","j","宝宝","快了快了好事多磨宝宝再等等"],["2024-07-26","j","宝宝","不要担心宝宝 大学转专业不困难的"],["2024-07-26","j","宝宝","真的大雪太容易懒散了宝宝"],["2024-07-26","z","宝宝","宝宝我考到这个专业松散不了一点"],["2024-07-26","j","宝宝","我的天宝宝，你是不是可以去俄罗斯玩"],["2024-07-27","j","宝宝","一个人在外面能玩一个月肯定是一个有主意的宝宝"],["2024-07-27","j","宝宝","宝宝不要担心一切刚刚开始呢"],["2024-07-27","z","宝宝","宝宝现在是下午"],["2024-07-28","j","宝宝","OMG宝宝怎么这么晚才睡觉"],["2024-07-28","j","宝宝","然后呢宝宝"],["2024-07-28","z","宝宝","我说宝宝你能自己数一数吗"],["2024-07-28","z","宝宝","宝宝你真的好多手指"],["2024-07-28","j","宝宝","我嘞逗啊宝宝"],["2024-07-28","j","宝宝","哎呀宝宝grab the 机会啊"],["2024-07-28","z","宝宝","🥹🥹宝宝救救我听力怎么办"],["2024-07-28","j","宝宝","要不宝宝你听听四级的听力题"],["2024-07-28","j","宝宝","宝宝这个要不你试试从今天起"],["2024-07-29","z","宝宝","宝宝我好像时差倒的有点过了…"],["2024-07-30","z","宝宝","Hi宝宝我又失眠了[睡]"],["2024-07-30","j","宝宝","宝宝我出发出去玩啦"],["2024-07-30","j","宝宝","呜呜呜宝宝我的天哪"],["2024-07-30","z","宝宝","噢宝宝我又开始疯狂做梦"],["2024-07-31","j","宝宝","我来看看宝宝这个网站是什么来的"],["2024-08-01","z","宝宝","噢宝宝你就这样点开了"],["2024-08-02","j","宝宝","没有考虑盗号这个问题[捂脸][捂脸]宝宝你要是号被盗了告诉我一声"],["2024-08-02","j","宝宝","我的天哪宝宝"],["2024-08-03","j","宝宝","出发噜宝宝"],["2024-08-03","z","宝宝","宝宝起好早！"],["2024-08-03","j","宝宝","宝宝我到了印度尼西亚了"],["2024-08-04","j","宝宝","哦宝宝既然这样你可以去试试"],["2024-08-06","j","宝宝","宝宝你收到了录取通知书了吗"],["2024-08-06","j","宝宝","开始睡觉吧宝宝[捂脸][OK][OK]"],["2024-08-06","j","宝宝","我嘞逗宝宝拿到啦"],["2024-08-06","j","宝宝","这是什么情况宝宝"],["2024-08-06","j","宝宝","哈哈哈哈哈哈宝宝原来是这样的"],["2024-08-06","z","宝宝","宝宝我要做一个有意思的东西"],["2024-08-06","j","宝宝","这是什么有意思的东西宝宝"],["2024-08-06","j","宝宝","好厉害啊宝宝"],["2024-08-06","j","宝宝","笑死了宝宝我感觉你是对的"],["2024-08-06","j","宝宝","笑死了宝宝我宣布你是新的商科生"],["2024-08-06","z","宝宝","宝宝那边有"],["2024-08-07","z","宝宝","噢宝宝我蛋糕放着几个小时没吃"],["2024-08-07","j","宝宝","中转😨😨宝宝你已经有经验了"],["2024-08-08","j","宝宝","宝宝我就这样水灵灵的从上午给你发消息的时候"],["2024-08-09","z","宝宝","宝宝你的口音会先出卖你"],["2024-08-09","j","宝宝","宝宝你坐飞机五个小时屁股不会痛吗"],["2024-08-09","j","宝宝","没事宝宝他们曾经吹的肯定也狼狈"],["2024-08-09","j","宝宝","[捂脸][捂脸][OK][OK]没有关系宝宝一步一步"],["2024-08-09","j","宝宝","我去宝宝我在看车票"],["2024-08-10","j","宝宝","没事宝宝把他缩小就看不见了"],["2024-08-10","j","宝宝","没事宝宝"],["2024-08-10","j","宝宝","转 包转的宝宝放心吧"],["2024-08-11","j","宝宝","嘟嘟换头像了宝宝"],["2024-08-11","j","宝宝","我快要笑死了宝宝[捂脸][OK][OK]"],["2024-08-12","j","宝宝","笑死了[捂脸][OK][OK]宝宝那你要拿旧手机出来吗"],["2024-08-12","j","宝宝","宝宝你现在已经有如此神功了吗"],["2024-08-12","z","宝宝","宝宝我梦到小猫小狗自己办学校"],["2024-08-12","j","宝宝","还是宝宝你有经验"],["2024-08-12","j","宝宝","宝宝要不你努力努力呢[捂脸][OK]"],["2024-08-12","j","宝宝","宝宝你就开始学吉米多维奇了"],["2024-08-12","j","宝宝","加油宝宝"],["2024-08-12","j","宝宝","宝宝我都没翻开过"],["2024-08-12","j","宝宝","我的天啊，宝宝这是多么厉害的地理位置啊"],["2024-08-12","j","宝宝","宝宝你想要下雨吗[呲牙]"],["2024-08-12","j","宝宝","宝宝你也要在大学当小白花吗"],["2024-08-12","j","宝宝","宝宝你一个学期之后包会水灵灵地爬出这个坑的"],["2024-08-13","j","宝宝","车到山前必有路 不要太担心了宝宝还没开学呢"],["2024-08-14","j","宝宝","放心吧 宝宝我根本不出去乱晃"],["2024-08-16","j","宝宝","这真的合理吗宝宝"],["2024-08-18","z","宝宝","宝宝他在学习你在躺凉席"],["2024-08-19","z","宝宝","好吧宝宝咱们考研"],["2024-08-19","j","宝宝","宝宝[流泪]好好珍惜大学生活吧[流泪][流泪]我都在搞什么"],["2024-08-19","j","宝宝","宝宝你还没睡啊"],["2024-08-19","z","宝宝","宝宝我差不多能听懂85%的听力了"],["2024-08-19","j","宝宝","宝宝我上个学期的英语免修了之后 我就没学过了 一个学期[流泪]他就退化了[流泪]昨天我看闺蜜的六级题目"],["2024-08-19","z","宝宝","宝宝我听了三四五六遍写的[流泪]"],["2024-08-19","j","宝宝","宝宝你看这样是有用的！"],["2024-08-19","z","宝宝","宝宝你高数"],["2024-08-19","z","宝宝","宝宝我们转出看原专业绩点"],["2024-08-19","j","宝宝","我不能本科出来的宝宝"],["2024-08-19","j","宝宝","宝宝你每天都这么晚睡吗"],["2024-08-19","j","宝宝","[流泪]一定会的宝宝[流泪][流泪][流泪][流泪]"],["2024-08-19","j","宝宝","北京欢迎你[流泪]宝宝我带你吃好吃的"],["2024-08-19","j","宝宝","宝宝早安"],["2024-08-19","j","宝宝","哦哈哟宝宝早上好"],["2024-08-19","j","宝宝","宝宝我已在学习"],["2024-08-19","z","宝宝","噢宝宝我有点开学焦虑了"],["2024-08-19","j","宝宝","哦宝宝怎么回事"],["2024-08-19","z","宝宝","宝宝你觉得211能有多少保研名额"],["2024-08-19","j","宝宝","晚点开学挺好的宝宝"],["2024-08-19","j","宝宝","宝宝不要担心不要焦虑不要害怕 昨天我也想了想现在焦虑内耗好像没什么用了 现在开始做事到开学了继续努力 就不会担心了"],["2024-08-20","j","宝宝","宝宝我打算睡觉了 今天早点睡 明天早点起来学"],["2024-08-20","j","宝宝","晚安宝宝"],["2024-08-20","z","宝宝","宝宝你睡早了"],["2024-08-20","j","宝宝","宝宝我睡之前去我家两边阳台的窗户看了"],["2024-08-21","z","宝宝","宝宝我在车上了"],["2024-08-21","j","宝宝","宝宝你已经在路上啦"],["2024-08-21","j","宝宝","会的宝宝 带着对家乡的眷恋出发吧"],["2024-08-21","j","宝宝","下个良医吧宝宝"],["2024-08-21","j","宝宝","但是宝宝你一开始是说你听力也不好的"],["2024-08-21","z","宝宝","宝宝我吸收不了"],["2024-08-21","j","宝宝","哦要转机啊宝宝"],["2024-08-21","z","宝宝","宝宝如果你坐飞机来新疆请不要选择中午到达[流泪]太阳会使你完全看不到雪山"],["2024-08-21","j","宝宝","嘟嘟宝宝你还在飞机上呀现在"],["2024-08-21","j","宝宝","宝宝你应该到了吧"],["2024-08-22","j","宝宝","宝宝你已经去到学校了"],["2024-08-22","j","宝宝","宝宝那你铺好宿舍床了吗"],["2024-08-22","z","宝宝","宝宝我还没有宿舍钥匙"],["2024-08-22","z","宝宝","宝宝我好开心"],["2024-08-22","j","宝宝","宝宝你是一个自立自强的宝宝"],["2024-08-22","z","宝宝","宝宝我是一个柔弱的大学生"],["2024-08-22","j","宝宝","但宝宝你真的好厉害啊真的好厉害"],["2024-08-23","j","宝宝","哇咔咔宝宝这是你的上床下桌啊"],["2024-08-23","j","宝宝","宝宝，你已经水灵灵的在你的床上开始睡午觉了吗"],["2024-08-24","j","宝宝","可是要保研宝宝"],["2024-08-24","z","宝宝","不宝宝"],["2024-08-24","j","宝宝","但宝宝你咋不吃肉"],["2024-08-25","j","宝宝","额的确该睡觉了宝宝"],["2024-08-27","z","宝宝","宝宝我今天六点就起床"],["2024-08-27","z","宝宝","宝宝我好崩溃"],["2024-08-27","j","宝宝","宝宝你怎么就开始上课了"],["2024-08-27","j","宝宝","宝宝你有课表吗"],["2024-08-27","j","宝宝","所以宝宝你打算如果可以保研"],["2024-08-27","z","宝宝","宝宝我真有过转法的想法"],["2024-08-27","j","宝宝","宝宝看了你给我发的"],["2024-08-27","j","宝宝","宝宝这个课要上到几点啊"],["2024-08-27","j","宝宝","宝宝你们什么时候军训"],["2024-08-29","j","宝宝","不儿宝宝你咋起了"],["2024-08-29","z","宝宝","宝宝我们要军训"],["2024-08-29","z","宝宝","宝宝我真的感觉忙到飞起"],["2024-08-29","j","宝宝","宝宝你这看起来是计算机专业的"],["2024-08-29","z","宝宝","宝宝我想转计[苦涩]所以多学点"],["2024-08-30","z","宝宝","宝宝！今天开学典礼！"],["2024-08-30","j","宝宝","可是宝宝你为什么早上吃新疆炒米粉"],["2024-08-31","j","宝宝","我嘞逗宝宝这过的也太好开心了吧"],["2024-08-31","j","宝宝","我的天宝宝真的好多好吃的"],["2024-08-31","z","宝宝","我要睡觉了宝宝"],["2024-08-31","j","宝宝","一定可以的宝宝"],["2024-08-31","j","宝宝","包润的宝宝"],["2024-08-31","j","宝宝","快睡觉吧宝宝我明天也得六点多起"],["2024-08-31","j","宝宝","晚安宝宝"],["2024-08-31","j","宝宝","宝宝你"],["2024-08-31","z","宝宝","但是宝宝我们出校门20分钟"],["2024-08-31","j","宝宝","我的天哪宝宝这个实力不是盖的"],["2024-08-31","j","宝宝","真的宝宝这个学院是真的有东西的"],["2024-08-31","j","宝宝","笑死了宝宝这个真的"],["2024-08-31","j","宝宝","真的要睡觉了宝宝[流泪][流泪]"],["2024-08-31","z","宝宝","晚安宝宝！"],["2024-09-02","j","宝宝","心碎了宝宝，你给我寄过明信片的[流泪][流泪]应该是新疆那一张"],["2024-09-02","z","宝宝","宝宝我困困的"],["2024-09-02","j","宝宝","好可怜的宝宝怎么失眠"],["2024-09-02","z","宝宝","好棒啊宝宝"],["2024-09-02","j","宝宝","快点睡觉吧 宝宝说不定可以早点睡觉今天"],["2024-09-02","z","宝宝","睡觉了宝宝[流泪]"],["2024-09-02","j","宝宝","晚安宝宝"],["2024-09-04","z","宝宝","宝宝我最近好忙好忙"],["2024-09-04","j","宝宝","我的天宝宝我突然想起今天中午你的消息在我的闹钟之后向起来还好吧我给叫醒了"],["2024-09-04","j","宝宝","宝宝没开玩笑我觉得你们的一个宿舍区域可能比我们一个学校都大"],["2024-09-05","z","宝宝","但是宝宝我们上课一公里起"],["2024-09-05","j","宝宝","快看宝宝"],["2024-09-05","z","宝宝","宝宝我进B班了"],["2024-09-05","z","宝宝","宝宝其实我不知道四级一共多少分"],["2024-09-05","z","宝宝","宝宝那时候我在睡觉"],["2024-09-05","j","宝宝","好困啊宝宝晚安"],["2024-09-06","z","宝宝","辛苦宝宝"],["2024-09-06","j","宝宝","宝宝我决定吃米村拌饭"],["2024-09-06","j","宝宝","宝宝你千万不要吃全家福饺子"],["2024-09-07","z","宝宝","吓死了宝宝"],["2024-09-07","z","宝宝","宝宝我来这里突然养成睡午觉的习惯"],["2024-09-07","z","宝宝","宝宝你经历了什么"],["2024-09-07","j","宝宝","什么宝宝我现在才看到"],["2024-09-08","j","宝宝","宝宝泥萌真的就水灵灵的"],["2024-09-08","j","宝宝","感到了宝宝刚刚到"],["2024-09-09","z","宝宝","宝宝你第一次选课会手忙脚乱吗[流泪]"],["2024-09-09","j","宝宝","会的啊宝宝"],["2024-09-09","j","宝宝","没事宝宝"],["2024-09-09","z","宝宝","宝宝你明天上午九点有时间吗"],["2024-09-09","z","宝宝","宝宝你是怎么抽出时间游山玩水的"],["2024-09-09","j","宝宝","宝宝我"],["2024-09-09","z","宝宝","宝宝你去年课表长啥样[流泪]"],["2024-09-09","j","宝宝","宝宝润的速速的吧"],["2024-09-09","j","宝宝","宝宝我要洗澡了，洗完澡要开会，开完会要吃饭"],["2024-09-09","z","宝宝","宝宝我要睡觉了"],["2024-09-10","j","宝宝","感觉其他好像都有啊宝宝"],["2024-09-10","j","宝宝","哈哈哈哈哈哈宝宝是都没课呀"],["2024-09-11","z","宝宝","宝宝可是我真的很想逃"],["2024-09-12","z","宝宝","宝宝 石锅拌饭"],["2024-09-12","z","宝宝","宝宝我发现我们食堂鸡鸭鱼牛羊猪都有"],["2024-09-13","j","贝贝","贝贝你"],["2024-09-13","z","宝宝","宝宝我们从现在开始放假"],["2024-09-13","z","宝宝","宝宝我真的太爱平板支架了"],["2024-09-13","j","宝宝","但是宝宝不应该看剧吗"],["2024-09-13","j","宝宝","宝宝你不会要"],["2024-09-14","z","宝宝","宝宝你是怎么样活力满满去旅游的"],["2024-09-14","j","宝宝","睡了三个小时不到宝宝"],["2024-09-14","j","宝宝","宝宝你不是从一个挺冷的地方来的吗"],["2024-09-14","j","宝宝","可能那可能宝宝你要多晒太阳[捂脸][捂脸]"],["2024-09-15","z","宝宝","宝宝玩的开心！！！"],["2024-09-16","z","宝宝","宝宝你接视频吗"],["2024-09-16","j","宝宝","宝宝我刚刚去"],["2024-09-17","j","贝贝","贝贝，我现在就来看"],["2024-09-17","j","贝贝","没听懂贝贝"],["2024-09-17","j","宝宝","宝宝可以助力我喝上这一杯酸奶吗"],["2024-09-17","j","宝宝","可以去山东玩玩宝宝"],["2024-09-17","z","宝宝","宝宝我能不能直接准备考研"],["2024-09-17","j","宝宝","会有的宝宝别太焦虑"],["2024-09-18","j","宝宝","广式腊肠不好吗宝宝"],["2024-09-18","j","宝宝","宝宝我刚刚洗完澡"],["2024-09-18","j","宝宝","哦宝宝你去吃那个先启半步颠的"],["2024-09-19","z","宝宝","宝宝我去给你寄信[流泪]"],["2024-09-20","j","贝贝","贝贝你。。。。。"],["2024-09-20","z","宝宝","宝宝我冻醒了"],["2024-09-20","j","宝宝","我嘞逗这是你学到的东西吗宝宝"],["2024-09-20","z","宝宝","宝宝我放了六天假然后又要放两天假了[流泪][流泪][流泪]"],["2024-09-20","z","宝宝","宝宝我发现我们上课有直播！"],["2024-09-21","j","baby","Baby这是什么东西呀我的天哪这只是一个学院楼"],["2024-09-21","j","宝贝","宝贝你还是太累了"],["2024-09-21","j","宝宝","可怜的宝宝被推上去参加这个讨厌的比赛 我去那这个人要被整个宿舍讨厌了现在"],["2024-09-21","z","宝宝","宝宝教我思政课怎么刷高分"],["2024-09-21","j","宝宝","我感觉宝宝你不会有问题的"],["2024-09-21","z","宝宝","但是宝宝我发现我一周有三天没课"],["2024-09-21","j","宝宝","非常可爱非常适合宝宝[胜利][胜利]"],["2024-09-22","j","贝贝","我嘞逗贝贝为什么你们宿舍都要六点起"],["2024-09-22","z","宝宝","宝宝这个一只一万"],["2024-09-22","z","宝宝","宝宝我今天去看中医"],["2024-09-22","z","宝宝","呜呜宝宝大二都会这样吗[流泪][流泪]"],["2024-09-22","j","宝宝","宝宝我要写概率论了[骷髅]"],["2024-09-22","z","宝宝","宝宝我今天买了好看的明信片"],["2024-09-23","j","宝宝","宝宝这是什么好日子好地方啊"],["2024-09-24","z","宝宝","宝宝我学微积分要困死了"],["2024-09-24","z","宝宝","宝宝！"],["2024-09-26","j","宝宝","要钱吗宝宝"],["2024-09-26","j","宝宝","宝宝你旷课了吗"],["2024-09-27","j","贝贝","可以的贝贝"],["2024-09-27","j","宝贝","那我只能放电脑和平板了啊宝贝"],["2024-09-27","z","宝宝","宝宝我去睡觉"],["2024-09-27","j","宝宝","宝宝快睡吧"],["2024-09-27","z","宝宝","宝宝帮我选一家"],["2024-09-27","z","宝宝","宝宝你觉得朋友圈集赞P图会被发现吗"],["2024-09-27","j","宝宝","OK了啊宝宝你们这个志愿感觉真的是非常好赚啊"],["2024-09-28","z","宝贝","今天是江琳宝贝的生日🎂这个时候生日的人  是未来之星🌟是国家栋梁🏠是都市小说的商业大颚💎是吾日三省吾身的自律者🉑️是相亲节目里的心动嘉宾💗是自然界的丛林之王👑是世间所有恶与丑的唾弃者🔥是世间所有美与好的创作者❗️❗️"],["2024-09-28","z","宝宝","江琳宝宝生日快乐！！！终于可以不被游戏防沉迷了🙈宝宝大学生活顺顺利利天天开心，保研成功，所愿皆所成～[蛋糕][蛋糕][蛋糕]"],["2024-09-28","j","宝宝","宝宝[流泪][流泪][流泪][流泪][流泪][流泪][流泪]"],["2024-09-28","z","宝宝","宝宝你写了吗"],["2024-09-28","z","宝宝","宝宝我去睡觉"],["2024-09-29","z","宝宝","宝宝我们学校有两个教辅出版社A和B 根据往年的资料编复习提纲 但是B抄A发家 我又是B的工作人员并且那边给我60个志愿时长"],["2024-09-29","z","宝宝","笑死了宝宝你好懂"],["2024-09-29","z","宝宝","宝宝我们开学有个分级考试嘛"],["2024-09-29","j","宝宝","笑死了宝宝你知道吗我们甚至"],["2024-09-30","z","宝宝","宝宝我没买到今晚的票"],["2024-10-01","j","baby","baby出门了"],["2024-10-02","z","宝宝","宝宝我在故宫要被挤爆了"],["2024-10-03","z","宝宝","宝宝我昨天在景点被挤爆了"],["2024-10-03","z","宝宝","宝宝我昨天走了三万步"],["2024-10-03","z","宝宝","宝宝我还没吃晚饭"],["2024-10-04","j","宝宝","宝宝你怎么也这么晚才吃饭"],["2024-10-04","z","宝宝","我明天就要去看海了宝宝[流泪][流泪][流泪]"],["2024-10-06","j","宝宝","宝宝你是怎么拍出来这个照片的"],["2024-10-06","j","宝宝","非常漂亮的海和漂亮的宝宝"],["2024-10-06","z","宝宝","宝宝我有点困困的"],["2024-10-06","j","宝宝","宝宝你从一个肉多的地方来到了另一个肉多的地方"],["2024-10-06","j","宝宝","[拥抱][拥抱][拥抱]不同的style宝宝"],["2024-10-06","z","宝宝","宝宝我给你截一段"],["2024-10-07","z","宝宝","宝宝期末考试是课表上的最后几节课吗"],["2024-10-08","z","宝宝","宝宝你有点太强了。。。"],["2024-10-09","j","baby","baby你是最高的[捂脸][捂脸][捂脸]"],["2024-10-09","z","宝宝","宝宝你之后去沙河吗"],["2024-10-09","z","宝宝","宝宝我们小组作业周日要交了"],["2024-10-09","z","宝宝","宝宝你说得对"],["2024-10-10","j","baby","baby这里面是有你的投稿吗"],["2024-10-11","z","宝宝","吓晕了宝宝种菜统计学都是坑了"],["2024-10-12","z","宝宝","宝宝我高中没学过地理啊怎么默认大家都会！"],["2024-10-12","z","宝宝","宝宝你真的好辛苦"],["2024-10-12","j","宝宝","你咋开始吃饭了宝宝我还在上课啊"],["2024-10-13","z","宝宝","宝宝你怎么换了个诗情画意的头像"],["2024-10-14","z","宝宝","宝宝祝我面试成功"],["2024-10-15","z","宝宝","宝宝我要冻死了。"],["2024-10-15","z","宝宝","WOW宝宝你好健康"],["2024-10-15","z","宝宝","0℃了宝宝"],["2024-10-15","j","宝宝","宝宝你真的还在教室吗我的妈"],["2024-10-16","j","宝宝","宝宝这左上角的和右上角的都是啥"],["2024-10-17","z","宝宝","宝宝我拿到社团offer了"],["2024-10-17","z","宝宝","天呢宝宝你简历能写三张。"],["2024-10-18","j","宝宝","宝宝你才大一[流泪]"],["2024-10-19","j","宝宝","宝宝你们今天也美食节吗"],["2024-10-19","j","宝宝","宝宝你以后可以分辨宝石"],["2024-10-20","j","baby","至少是吃到了baby"],["2024-10-20","j","baby","baby你会吗"],["2024-10-20","j","baby","baby没给我看过。。。。。"],["2024-10-20","z","宝宝","好牛啊宝宝！！！"],["2024-10-20","z","宝宝","我进城也要四十分钟宝宝"],["2024-10-21","z","宝宝","宝宝你笑的好可爱"],["2024-10-22","j","baby","Baby你怎么就水灵灵的建模了"],["2024-10-24","j","baby","baby我刚刚在微博上看"],["2024-10-24","j","宝宝","是地理课上学的吗宝宝"],["2024-10-24","j","宝宝","你这一串多少钱宝宝"],["2024-10-24","j","宝宝","但看起来非常美味宝宝"],["2024-10-24","z","宝宝","宝宝我其实能看懂的不超过五页"],["2024-10-24","z","宝宝","困困的宝宝我要睡觉了"],["2024-10-26","j","baby","baby你怎么做到每天早上起那么早的"],["2024-10-27","j","baby","baby这个其实是我的枕头"],["2024-10-27","j","baby","baby得在这个吉林大学好好休养生息一下"],["2024-10-27","j","baby","baby我每一天过的是什么日子"],["2024-10-27","j","baby","没有baby"],["2024-10-27","z","宝宝","好吧宝宝其实我现在还是没倒过来时差"],["2024-10-27","z","宝宝","宝宝其实我胳膊短短的"],["2024-10-27","j","宝宝","但是宝宝你装了一大堆东西"],["2024-10-27","z","宝宝","宝宝我愣是拉到18.0了"],["2024-10-27","j","宝宝","宝宝我知道你很瘦"],["2024-10-27","j","宝宝","宝宝你在吉大吃的没胖一点吗"],["2024-10-29","j","baby","好滴baby"],["2024-10-29","j","宝宝","宝宝你现在认得出各种乱七八糟的石头吗"],["2024-10-29","z","宝宝","宝宝我上思政课了我下课看"],["2024-10-30","z","宝宝","宝宝我为什么又失眠"],["2024-10-30","j","宝宝","宝宝你咋穿着白大褂"],["2024-10-30","j","宝宝","其实宝宝我高中没学会大学也没学会嘻嘻"],["2024-10-31","z","宝宝","宝宝你真的好厉害"],["2024-10-31","j","宝宝","我的妈宝宝"],["2024-11-01","j","baby","baby这个贼好吃"],["2024-11-01","z","宝宝","宝宝我们元旦前就考完期末了"],["2024-11-03","z","宝宝","宝宝教我卷发棒怎么用"],["2024-11-04","z","宝宝","本人急用钱，现转让大学水课十节！！(这学期刚上新的)才上了几节，平时一直放在课表里，不舍得上，99新基本没有上课痕迹中本人亲测，催眠效果极强失眠的宝宝可以无脑入假一赔十，水分十足价格私聊 双十一期间养买10节我送你3节养(劲爆福利)假如一次性承包，本人这学期所有水课者我再送你养下个学期的所有水课养我再送你 替我完成小组作业名额我再送你替我完成PPT演讲名额什么?还不够?我最后再送你 替我完成期末考试名额(福利加码)亏本 甩卖诚意十足\t欲购从速\t 最后，买不起的，可以帮我转发宣传\t和好朋友拼团来买 但别捣乱，别吃不到葡萄说葡萄酸"],["2024-11-05","j","宝宝","蛋糕吗还是模型来的宝宝"],["2024-11-06","j","宝宝","诶宝宝你一个月在你那大概花多少钱呢"],["2024-11-06","z","宝宝","宝宝其实我一周最多出去一次"],["2024-11-06","z","宝宝","宝宝我每天就是在学这个"],["2024-11-07","j","baby","不难的baby而且高中学的都是背的东西"],["2024-11-07","z","宝贝","宝贝你怎么大二就这么厉害了。"],["2024-11-07","z","宝宝","宝宝你现在怎么样"],["2024-11-07","z","宝宝","宝宝这个离我也远远的"],["2024-11-07","z","宝宝","宝宝这个公蟹母蟹是能看出来的吗"],["2024-11-07","j","宝宝","但是宝宝你不能吃太猛了"],["2024-11-08","z","宝宝","天呢宝宝现在四点多一点就天黑了。"],["2024-11-10","z","宝宝","水宝宝"],["2024-11-10","j","宝宝","水晶珠宝宝"],["2024-11-10","j","宝宝","我以为你把水宝宝搞了椰蓉啥的都"],["2024-11-11","j","baby","baby你们的这个推送做的好漂亮"],["2024-11-11","z","宝宝","宝宝手太巧了"],["2024-11-13","z","宝宝","噢宝宝我梦见"],["2024-11-13","j","宝宝","宝宝我被人力资源缠上了"],["2024-11-14","j","宝宝","天哪宝宝高三已经烙下了这样的印记"],["2024-11-14","j","宝宝","非常厉害啊宝宝功夫不负有心人[流泪][流泪][流泪]"],["2024-11-14","z","宝宝","宝宝你怎么睡这么晚"],["2024-11-15","j","baby","baby我昨晚把夜熬穿了"],["2024-11-20","z","宝宝","宝宝你为什么总在晚上出现"],["2024-11-20","z","宝宝","宝宝你是一个圣诞老人"],["2024-11-20","j","宝宝","宝宝你为什么只有六门"],["2024-11-21","j","baby","baby快来为我投票吧"],["2024-11-21","z","宝宝","宝宝你怎么还写诗"],["2024-11-21","z","宝宝","好厉害宝宝"],["2024-11-21","z","宝宝","宝宝你已经是伟大的贸易家了"],["2024-11-22","j","baby","这是什么东西baby"],["2024-11-22","j","baby","刚刚下课baby"],["2024-11-22","z","宝宝","感觉我真的习惯无纸化学习了宝宝"],["2024-11-24","z","宝宝","宝宝你是超人"],["2024-11-26","j","宝宝","哇咔咔谢谢宝宝"],["2024-11-27","j","baby","Baby你这是打算这么回去"],["2024-11-27","z","宝宝","宝宝我现在在宿舍床上"],["2024-11-29","j","baby","我的天哪baby你已经可以听得出广东口音了"],["2024-11-29","z","宝宝","宝宝感觉你大一的时候会发好多好多朋友圈"],["2024-11-29","z","宝宝","宝宝如果我降转我就"],["2024-11-29","z","宝宝","但是宝宝你好厉害见过很多世界又学有所成"],["2024-11-29","z","宝宝","宝宝你这个年龄完全不会有"],["2024-11-30","z","宝宝","宝宝你猜多少钱"],["2024-12-01","j","baby","baby你吃早饭了吗"],["2024-12-01","j","baby","Baby你咋又吃上了"],["2024-12-01","j","baby","Baby, 你吃完了吗？"],["2024-12-02","j","baby","baby我问你吃完饭没是因为"],["2024-12-02","j","baby","晚安baby"],["2024-12-02","z","宝宝","宝宝你怎么又睡这么晚🥹"],["2024-12-04","z","宝宝","宝宝说起来你可能不信"],["2024-12-04","z","宝宝","宝宝这是每个题型一道题"],["2024-12-04","z","宝宝","宝宝你现在在黑黑的屋子里吗"],["2024-12-05","j","baby","Baby你的宿舍在几楼"],["2024-12-05","z","宝宝","好有活力的宝宝"],["2024-12-05","z","宝宝","宝宝我上课十分钟起。"],["2024-12-07","j","baby","Baby你的这个状态的前奏好长"],["2024-12-07","z","宝宝","妈呀宝宝你真的听了！"],["2024-12-07","z","宝宝","宝宝这是我们商场"],["2024-12-08","j","宝宝","宝宝我刚刚说从你给我的图片里面汲取灵感"],["2024-12-08","j","宝宝","我必须开始继续学习了宝宝"],["2024-12-09","z","宝宝","宝宝我要给你看我们音乐会"],["2024-12-10","z","宝宝","宝宝我今天又两点吃饭"],["2024-12-11","j","宝宝","太自律了宝宝 这样干什么一定都会成功的"],["2024-12-11","z","宝宝","宝宝你猜一份多少钱"],["2024-12-13","z","宝宝","宝宝其实我们那边"],["2024-12-14","z","宝宝","宝宝我发现starnote也好用"],["2024-12-15","z","宝宝","宝宝怎么还不睡"],["2024-12-15","z","宝宝","我也要抑郁了宝宝"],["2024-12-15","j","宝宝","不会的宝宝"],["2024-12-15","j","宝宝","哎呦喂宝宝我感觉我五脏六腑不太对劲"],["2024-12-15","z","宝宝","不宝宝我从来不上早八"],["2024-12-15","z","宝宝","宝宝其实这是仅你可见"],["2024-12-16","z","宝宝","宝宝你吃了吗"],["2024-12-16","z","宝宝","宝宝我又忘了有没有和你说"],["2024-12-16","z","宝宝","宝宝你的培养方案真像大一计算机。"],["2024-12-19","z","宝宝","宝宝这一份11r 米饭泡菜辣酱海带汤无限续"],["2024-12-19","z","宝宝","太聪明了宝宝"],["2024-12-20","z","宝宝","宝宝其实我只有六门"],["2024-12-20","z","宝宝","宝宝你是超人"],["2024-12-22","j","baby","晚安baby"],["2024-12-22","z","宝宝","这是什么宝宝"],["2024-12-22","z","宝宝","宝宝我们宿舍都不通宵供电"],["2024-12-22","z","宝宝","宝宝早点休息"],["2024-12-22","z","宝宝","宝宝我复习了一周思政"],["2024-12-25","j","baby","Baby我们那个文创并不会做出来其实"],["2024-12-27","z","宝宝","宝宝我要出门学习了"],["2024-12-27","z","宝宝","宝宝我们今年大一一万多人啊"],["2024-12-28","z","宝宝","宝宝其实我也在床上"],["2024-12-28","z","宝宝","宝宝你能get到这个吗"],["2024-12-30","j","baby","考完考试了让我来看看baby你发了什么"],["2025-01-01","j","baby","新年快乐baby"],["2025-01-01","z","宝宝","宝宝新年快乐！"],["2025-01-02","j","baby","啊哈baby你搜出了这家店"],["2025-01-02","j","宝宝","喔天哪宝宝"],["2025-01-02","z","宝宝","宝宝我有空会给你寄一个"],["2025-01-02","z","宝宝","太强了宝宝"],["2025-01-04","j","baby","嘶baby放心吧不会直接出世界地图的"],["2025-01-04","j","baby","做的baby"],["2025-01-04","j","baby","baby什么时候考完 难道是今天吗"],["2025-01-04","j","baby","全给你baby"],["2025-01-04","z","宝宝","宝宝其实我对世界地图一无所知"],["2025-01-04","z","宝宝","宝宝你已经完全是新疆人了"],["2025-01-04","z","宝宝","宝宝你分我一点回忆"],["2025-01-04","z","宝宝","宝宝我发现我是文科生圣体"],["2025-01-05","j","baby","考试加油baby"],["2025-01-05","z","宝宝","宝宝我已到达地铁站"],["2025-01-08","z","宝宝","宝宝我在"],["2025-01-11","z","宝宝","噢宝宝"],["2025-01-12","j","宝宝","米米嘟宝宝啊"],["2025-01-12","j","宝宝","宝宝这个重庆的李若桃特别好喝"],["2025-01-13","z","宝宝","宝宝你们去香港是不是和"],["2025-01-13","z","宝宝","宝宝我回家了[流泪]"],["2025-01-14","j","baby","baby我的妹妹是世界上最好的妹妹[流泪][流泪][流泪]"],["2025-01-18","j","baby","baby快看我这个学期的不懈努力的成果"],["2025-01-18","z","宝宝","宝宝你怎么还没好🥹[拥抱]"],["2025-01-18","z","宝宝","真的吗宝宝"],["2025-01-19","j","baby","不是我说？baby你能分清吗？"],["2025-01-19","j","baby","Baby我要睡觉了因为我明天即将回东华高级中学进行回访"],["2025-01-19","j","宝宝","宝宝你有出门吗？这几天"],["2025-01-19","z","宝宝","宝宝我在学校买的东西"],["2025-01-19","z","宝宝","晚安宝宝"],["2025-01-19","z","宝宝","宝宝我在做考研数学"],["2025-01-24","j","baby","baby昨晚最是什么时候睡的"],["2025-01-28","z","宝宝","宝宝你有没有看过那个"],["2025-01-29","j","baby","Baby新年快乐"],["2025-01-29","j","baby","哦天呐baby"],["2025-01-29","z","宝宝","宝宝新年快乐！"],["2025-02-03","j","baby","要考啥啊baby"],["2025-02-03","j","baby","晚安baby"],["2025-02-03","z","宝宝","宝宝要去武汉玩吗"],["2025-02-03","z","宝宝","宝宝我写微积分有点红温了😴🤒🤕🥵"],["2025-02-03","z","宝宝","晚安宝宝"],["2025-02-05","j","baby","baby你吃的马肠"],["2025-02-12","j","baby","Baby你们什么时候开学？"],["2025-02-12","z","宝宝","宝宝你以后去当CEO吗"],["2025-02-15","z","宝宝","宝宝好手艺"],["2025-02-20","j","baby","baby我要出发去武汉了"],["2025-02-22","j","baby","baby你上车或者上飞机了吗"],["2025-02-22","j","baby","baby你那时候去是为了啥来着"],["2025-02-22","z","宝宝","噢宝宝我三点钟要出发"],["2025-02-22","z","宝宝","宝宝怎么两天就吃了这么多"],["2025-02-23","j","baby","快看北京的腊梅开了baby"],["2025-03-01","j","baby","baby看我的课表"],["2025-03-01","j","baby","baby其实我刚刚起床"],["2025-03-01","z","宝宝","宝宝你毕业了会不会变成七种语言拥有者"],["2025-03-01","z","宝宝","宝宝我现在又在学数学"],["2025-03-02","j","baby","baby我觉得我更加想看到这个自助餐的全局是什么样的"],["2025-03-02","z","宝宝","宝宝我刚坐下来干饭"],["2025-03-07","j","baby","baby这"],["2025-03-07","z","宝宝","宝宝你懂男女比23：1的痛吗"],["2025-03-07","z","宝宝","噢宝宝现在竞选吗"],["2025-03-07","z","宝宝","宝宝我怎么记得你已经"],["2025-03-07","z","宝宝","晚安宝宝"],["2025-03-11","j","baby","baby你去过这个吗"],["2025-03-12","z","宝宝","效率好高啊宝宝"],["2025-03-14","j","baby","BABY你每天吃饭都拍一下照片"],["2025-03-14","j","baby","baby怎么去这么多地方玩"],["2025-03-14","z","宝宝","我上学上的想死啊宝宝"],["2025-03-16","j","baby","Baby, 你这是已经去到长春了吗？"],["2025-03-16","z","宝宝","北京也下雪了吗宝宝"],["2025-03-17","z","宝宝","猜猜一碗多少钱宝宝"],["2025-03-19","j","baby","Baby你有去搓过澡吗"],["2025-03-19","z","宝宝","普通话考试有什么用吗宝宝"],["2025-03-19","z","宝宝","上课了宝宝"],["2025-03-20","z","宝宝","哦不宝宝"],["2025-03-25","z","宝宝","宝宝学习通随堂测验可以切屏吗"],["2025-03-26","j","baby","Baby地震了，地震了"],["2025-03-28","j","baby","baby你和喝上了吗"],["2025-04-01","j","baby","如何呢可以的baby"],["2025-04-01","j","baby","天哪这是什么玩会baby"],["2025-04-01","z","宝宝","噢宝宝"],["2025-04-02","z","宝宝","宝宝我要睡了"],["2025-04-11","z","宝宝","北京刮大风吗宝宝"],["2025-04-14","z","宝宝","宝宝我有一天八点半就睡了"],["2025-04-18","j","baby","baby你说你们"],["2025-04-27","j","baby","这是哪里baby"],["2025-04-27","z","宝宝","宝宝如果我有一个非节假日的假期可以去北京玩15个小时 我应该去哪里玩捏"],["2025-04-27","z","宝宝","宝宝你好信任我"],["2025-04-27","z","宝宝","因为宝宝你手机号填错了"],["2025-04-27","z","宝宝","去睡觉吧宝宝"],["2025-04-27","z","宝宝","噢宝宝宝宝"],["2025-04-30","z","宝宝","宝宝"],["2025-05-01","j","baby","baby五月快乐"],["2025-05-01","z","宝宝","宝宝你真好"],["2025-05-01","j","宝宝","安安静静的就很乖呀小宝宝"],["2025-05-01","j","宝宝","宝宝我先去洗澡"],["2025-05-01","z","宝宝","拜拜宝宝"],["2025-05-06","j","baby","baby[流泪][流泪][流泪]"],["2025-05-09","j","宝宝","可是宝宝你不是要转院嘛"],["2025-05-10","j","baby","看起来不错呀baby"],["2025-05-10","z","宝宝","这个呢宝宝"],["2025-05-12","z","宝宝","宝宝你本来就有一点眯眯眼"],["2025-05-13","j","baby","baby你有什么需要但是市面上没有的东西吗"],["2025-05-13","j","baby","Baby你这么快就要开始考试了吗"],["2025-05-13","z","宝宝","宝宝你是一个许愿池"],["2025-05-13","z","宝宝","宝宝为什么我在社团认识了很多很多文科同学聊了很久很久之后越来越怀疑当初为什么选理工科了🥹"],["2025-05-14","z","宝宝","噢宝宝[流泪]注意身体"],["2025-05-15","z","宝宝","宝宝[拥抱][拥抱][拥抱]"],["2025-05-19","j","baby","[流泪][流泪][流泪][流泪]多享受吧baby"],["2025-05-19","z","宝宝","噢感觉宝宝你每天都忙忙的"],["2025-05-24","z","宝宝","这样极品的人同时遇到三个你也是很有运气了宝宝"],["2025-05-25","j","baby","waitbaby"],["2025-05-25","j","baby","这是订阅链接呢baby"],["2025-05-25","j","baby","晚安baby"],["2025-05-25","z","宝宝","宝宝你是脾气很好的小女孩一枚"],["2025-05-25","z","宝宝","你太心软了宝宝"],["2025-05-25","j","宝宝","都一样的呢，宝宝你可以先试试我的"],["2025-05-25","z","宝宝","宝宝你们宿舍神人爆率这么高"],["2025-05-25","z","宝宝","我要睡觉了宝宝"],["2025-05-26","j","baby","我想想baby其实我觉得石家庄没有什么好玩的"],["2025-05-26","j","baby","一定不会挂的努力学加油baby"],["2025-05-26","j","baby","加油baby"],["2025-05-26","j","baby","Baby你要学c语言的话，你着急你就去学吧 不要被我拖住了，因为我可以一直聊下去，因为我走在路上"],["2025-05-26","z","宝宝","宝宝我很需要一个石家庄的攻略"],["2025-05-26","z","宝宝","宝宝我要学西语言了"],["2025-05-26","z","宝宝","但是宝宝你好厉害"],["2025-05-26","j","宝宝","可以的宝宝 敏感肌混油混干干皮油皮全部都可以用红包治百病"],["2025-05-27","z","宝宝","159粉丝啦宝宝"],["2025-05-27","z","宝宝","好了我又要去学微积分了宝宝"],["2025-05-28","j","baby","baby给你推荐这个"],["2025-05-28","j","baby","baby"],["2025-05-31","j","baby","为啥要搬宿舍呢？Baby？"],["2025-05-31","j","baby","这个是刚听起来也是不计入保研的呢，但是加油吧baby。"],["2025-05-31","z","宝宝","宝宝我去背史纲了"],["2025-06-02","z","宝宝","宝宝"],["2025-06-04","j","baby","baby你给我发的这个"],["2025-06-05","j","baby","额什么水平baby"],["2025-06-05","j","baby","太贵了baby"],["2025-06-05","j","baby","可以的baby"],["2025-06-05","z","宝宝","宝宝你买过PPT代做之类的吗"],["2025-06-06","j","baby","话说baby你的梦"],["2025-06-06","j","baby","晚安baby"],["2025-06-06","j","宝宝","好像是呢宝宝"],["2025-06-06","z","宝宝","宝宝我去睡觉了"],["2025-06-11","j","baby","baby你能帮我在小红书一个帖子里评论一句吗"],["2025-06-11","j","baby","谢谢你baby"],["2025-06-11","j","baby","实在是逼真，爱你baby"],["2025-06-11","j","baby","那太好了baby我们可以一起吃个饭"],["2025-06-14","z","宝宝","不对宝宝你应该有个很好的分数保底了"],["2025-06-17","j","宝宝","宝宝你看到了吗"],["2025-06-17","z","宝宝","我要去复习了宝宝"],["2025-06-17","j","宝宝","加油宝宝"],["2025-06-18","j","baby","干巴爹baby"],["2025-06-18","j","baby","baby你要学习快复习吧 不要被我拖住了，但是我也愿意跟你聊天的"],["2025-06-18","j","baby","OK的呀baby"],["2025-06-18","z","宝宝","宝宝我刚刚下课了"],["2025-06-18","z","宝宝","噢可能宝宝你的证件照"],["2025-06-18","z","宝宝","噢宝宝我终于上床了"],["2025-06-19","z","宝宝","放假快乐宝宝"],["2025-06-21","z","宝宝","oh宝宝感恩有你"],["2025-06-24","j","baby","baby你想听实话吗"],["2025-06-24","j","baby","哎呦喂baby"],["2025-06-27","j","baby","哎哟喂baby你今天去哪里玩啊"],["2025-06-27","j","baby","我勒个逗可怜的baby"],["2025-06-27","z","宝宝","看我状态宝宝"],["2025-06-28","j","baby","太好啦baby"],["2025-06-28","j","baby","baby我们明天中午吃饭行吗"],["2025-06-28","j","baby","baby你说的真的没错"],["2025-06-28","z","宝宝","那宝宝你想想你在北京吃过最好吃的"],["2025-06-28","z","宝宝","进来了宝宝"],["2025-06-28","j","宝宝","天哪宝宝这行程满满"],["2025-06-29","j","baby","但baby你不用太着急啊啊啊啊"],["2025-06-29","j","baby","玩的开心baby"],["2025-06-29","j","baby","咋了baby"],["2025-07-01","j","baby","飞到了吗baby"],["2025-07-01","j","baby","很快就到家了，再坚持一下baby"],["2025-07-01","j","baby","辛苦啦baby"],["2025-07-01","z","宝宝","进疆了宝宝"],["2025-07-01","z","宝宝","宝宝我终于在床上了"],["2025-07-03","z","宝宝","出去玩吧宝宝先逃离这里别想了[晕]"],["2025-07-09","z","宝宝","宝宝你去港澳吗"],["2025-07-12","j","baby","baby你是去旅游去玩吗"],["2025-07-28","j","baby","baby你是不是要提前回校来着"],["2025-07-28","z","宝宝","来吧漂亮宝宝"],["2025-08-01","z","宝宝","枣糕宝宝我来了"],["2025-08-01","z","宝宝","饭饭宝宝怎么背刺"],["2025-08-06","j","宝宝","啊啊啊啊啊啊啊宝宝"],["2025-08-14","j","贝贝","OMG贝贝"],["2025-08-16","j","宝宝","没事嘟宝宝"],["2025-08-17","z","宝宝","我到学校了宝宝"],["2025-08-24","j","贝贝","贝贝你看了罗小黑吗"],["2025-08-24","j","贝贝","贝贝"],["2025-08-28","j","宝宝","宝宝你可以伸手"],["2025-08-30","z","宝宝","我的论文宝宝"],["2025-09-12","z","宝宝","诶宝宝你居然大三了"],["2025-10-02","j","baby","baby guess what is this"],["2025-10-05","j","baby","青旅吗baby"],["2025-10-09","j","baby","Oh my god, 可怜的baby，福兮祸所倚，祸兮福所伏啊"],["2025-10-09","z","宝宝","多穿点宝宝"],["2025-10-09","z","宝宝","好了宝宝我真的要睡了"],["2025-10-19","z","宝宝","乖宝宝"],["2025-10-21","j","baby","你做的吗baby"],["2025-10-21","z","宝宝","只会说卧槽了宝宝你们都是很好的人[流泪]"],["2025-10-25","z","宝宝","宝宝你是一只🦉侠"],["2025-11-07","z","宝宝","特别厉害的宝宝"],["2025-11-12","j","baby","下雪了吗baby"],["2025-11-27","j","baby","nonono baby"],["2025-11-27","j","宝宝","我的天宝宝们这是什么课"],["2026-01-11","z","宝宝","我要睡觉了宝宝"],["2026-01-14","z","宝宝","哦宝宝我回家了"],["2026-01-28","z","宝宝","宝宝你怎么这么会画"],["2026-02-17","z","宝贝","江江宝贝新年快乐！！！天天开心顺顺利利心想事成[亲亲]"],["2026-02-17","j","宝宝","新年快乐宝宝[跳跳][转圈][跳跳][转圈]新的一年也要一切顺利呀"],["2026-03-03","z","宝宝","oh宝宝[拥抱]"],["2026-03-13","j","baby","加油baby"],["2026-03-13","z","宝宝","[苦涩]我要去写题了宝宝"],["2026-03-18","j","宝宝","加油宝宝"],["2026-03-20","j","baby","现在肯定已经解放了，baby"],["2026-03-20","j","baby","一定可以的baby"],["2026-03-20","z","宝宝","过线了宝宝"],["2026-03-22","z","宝宝","OMG宝宝我怎么忘回你了！"],["2026-03-22","z","宝宝","因为我耽误了一年宝宝"],["2026-03-23","z","宝宝","宝宝你已经面过很多场了吧"],["2026-03-23","z","宝宝","宝宝"],["2026-03-24","z","宝宝","宝宝我面完了"],["2026-03-26","j","baby","咋了baby，为啥不能放第一志愿"],["2026-03-26","z","宝宝","宝宝我放假了"],["2026-04-29","j","baby","加油啊baby"],["2026-05-05","z","宝宝","哎呀宝宝"],["2026-05-08","z","宝宝","哎呀宝宝"],["2026-05-16","z","宝宝","宝宝你萌"],["2026-05-24","j","baby","可以的baby可以的"],["2026-05-24","j","宝宝","宝宝你一定要坚持下去"],["2026-06-09","z","宝宝","太好了宝宝"],["2026-06-10","j","baby","哦，no, baby, 我已经退那个群了。我当时觉得我再也不会吃那个鹅腿了，我就把那个群退了。我让我朋友把我加进去看看"],["2026-06-10","z","宝宝","所以宝宝你吃过吗"],["2026-06-10","z","宝宝","宝宝你有群吗想吃第一手的瓜"],["2026-06-15","z","宝宝","宝宝宝宝你双休吗"],["2026-06-22","j","baby","OK呀，有空的啊，baby, 我刚刚在快乐地吃饭"],["2026-06-22","z","宝宝","宝宝你7.11有空嘛"],["2026-06-23","j","baby","baby这个薛之谦的"],["2026-06-23","z","宝宝","宝宝你看什么价位的"],["2026-06-30","j","baby","baby你太厉害了"],["2026-07-02","z","宝宝","哦宝宝你没有暑假了"],["2026-07-04","j","baby","你还有几门baby"],["2026-07-06","z","宝宝","宝宝"],["2026-07-07","j","baby","baby[裂开]"],["2026-07-07","j","baby","对不起baby[苦涩][苦涩][苦涩][苦涩][苦涩]"],["2026-07-07","z","宝宝","退不了了宝宝"],["2026-07-07","z","宝宝","宝宝我忙完一半了"],["2026-07-08","z","宝宝","宝宝你也要记得好好吃饭 照顾好自己 越是这种时候越不能垮掉 这两天我就不打扰你了 但如果你需要找人说话 我随时都在呢[拥抱]"],["2026-07-11","j","baby","美丽的baby啊"],["2026-07-11","j","baby","baby你坐在两个座位中间"],["2026-07-12","z","宝宝","噢宝宝我刚睡醒"],["2026-07-13","j","baby","我靠baby你咋这么有实力[流泪]"],["2026-07-13","j","baby","谢谢你baby"],["2026-07-13","j","baby","天呐，快睡觉吧，baby"],["2026-07-13","z","宝宝","我真的要睡觉了宝宝"],["2026-07-14","z","宝宝","宝宝我从昨天七点睡到现在"],["2026-07-18","j","baby","等我拍给你看，baby"],["2026-07-18","j","baby","是baby你的金手帮我开出了这个位置啊，不然我自己根本没办法抢到啊"],["2026-07-25","j","baby","心痛，Oh no, baby"],["2026-07-25","z","宝宝","宝宝我总觉得你说着说着就要唱起来了哈哈哈哈"],["2026-07-28","j","baby","baby你在哪个校区啊"],["2026-07-28","j","baby","不对，baby, 你是怎么喜欢上薛之谦的？我想知道"],["2026-07-28","j","宝宝","为啥这么着急宝宝"],["2026-07-28","z","宝宝","宝宝…"],["2026-07-29","j","baby","baby你每天可以什么时候起床"],["2026-07-29","j","baby","做完了吗baby"],["2026-07-30","j","baby","看这个baby"],["2026-08-02","j","baby","没关系啊，baby"],["2026-08-02","z","宝宝","宝宝…"],["2026-08-02","z","宝宝","那我可能看不了了宝宝"],["2026-08-02","z","宝宝","宝宝你定酒店了吗"],["2026-08-02","z","宝宝","小宝宝"],["2026-08-03","z","baby","啊哈哈哈哈哈哈不要冲动啊baby"],["2026-08-04","j","baby","找到数据源头了吗baby"],["2026-08-07","j","宝宝","宝宝你啥时候会去实习"],["2026-08-09","j","宝宝","没有要卖掉你的意思，缝纫机宝宝"],["2026-08-09","j","宝宝","好辛苦的宝宝"],["2026-08-10","z","宝宝","哇咔咔谢谢宝宝"],["2026-08-11","j","宝宝","小宝宝"],["2026-08-11","j","宝宝","晚安，宝宝，好久没有说晚安啦"],["2026-08-11","z","宝宝","晚安宝宝"]];
const WC35 = {'宝宝':'#D2541B','宝贝':'#DB5B93','贝贝':'#8E6BBF','baby':'#E0B000'};
let recBuilt = false;
function buildRecords(){
  if(recBuilt) return; recBuilt = true;
  const list = EL('a35RecList');
  const frag = document.createDocumentFragment();
  RECS.forEach(function(r){
    const row = document.createElement('div'); row.className = 'rb-row';
    row.dataset.w = r[2]; row.dataset.s = r[1]; row.dataset.t = r[3];
    row.innerHTML = '<div class="rb-d">' + r[0] + '</div>'
      + '<div class="rb-w"><i style="background:' + (WC35[r[2]]||'#ccc') + '"></i><span>'
      + (r[1] === 'z' ? '小周' : '江江') + '</span></div>'
      + '<div class="rb-t"></div>';
    row.querySelector('.rb-t').appendChild(renderMsg(r[3]));
    frag.appendChild(row);
  });
  list.appendChild(frag);
  applyRecFilter();
}
function applyRecFilter(){
  const fw = EL('a35RecW').value, fs = EL('a35RecS').value;
  let n = 0;
  Array.prototype.forEach.call(EL('a35RecList').children, function(row){
    if(!row.classList || !row.classList.contains('rb-row')) return;
    let ok = true;
    if(fw && row.dataset.w !== fw) ok = false;
    if(ok && fs && row.dataset.s !== fs) ok = false;
    row.style.display = ok ? '' : 'none';
    if(ok) n++;
  });
  const box = EL('a35RecList');
  let emp = box.querySelector('.rb-empty');
  if(n === 0){
    if(!emp){ emp = document.createElement('div'); emp.className='rb-empty';
      emp.textContent='没有匹配的记录'; box.appendChild(emp); }
  } else if(emp){ emp.remove(); }
}
function openRecords(){
  buildRecords();
  EL('a35RecBox').classList.add('on');
  EL('ph-words').classList.add('rec-open');
  gsap.fromTo(EL('a35RecBox'), {opacity:0, y:22}, {opacity:1, y:0, duration:.42, ease:'power2.out'});
  gsap.to(bh, {opacity:0, duration:.3});
}
function closeRecords(){
  gsap.to(EL('a35RecBox'), {opacity:0, y:16, duration:.28, ease:'power1.in',
    onComplete: function(){
      EL('a35RecBox').classList.remove('on');
      EL('ph-words').classList.remove('rec-open');
      gsap.set(EL('a35RecBox'), {y:0});
      if(cur >= 0 && PHASES[cur] === 'words') gsap.to(bh, {opacity:1, duration:.5});
    }});
}
EL('a35RecBtn').addEventListener('click', function(e){ e.stopPropagation(); openRecords(); });
EL('a35RecClose').addEventListener('click', function(e){ e.stopPropagation(); closeRecords(); });
EL('a35RecW').addEventListener('change', applyRecFilter);
EL('a35RecS').addEventListener('change', applyRecFilter);

/* ---------- 自定义筛选下拉 ---------- */
function closeAllSel(except){
  ['a35SelW','a35SelS'].forEach(function(id){
    if(id !== except){ var b = EL(id); if(b) b.classList.remove('on'); }
  });
}
function syncSel(boxId, selId){
  var box = EL(boxId), sel = EL(selId), v = sel.value;
  var opts = box.querySelectorAll('.sel-opt');
  var dot = box.querySelector('.sel-dot'), txt = box.querySelector('.sel-txt');
  var fallback = (boxId === 'a35SelW') ? '全部词' : '全部人';
  var matched = false;
  Array.prototype.forEach.call(opts, function(o){
    if(o.dataset.v === v){
      o.classList.add('on'); matched = true;
      txt.textContent = o.textContent.trim();
      var ic = o.querySelector('i');
      dot.style.background = (v && ic) ? (ic.getAttribute('style')||'').replace(/^.*background:/,'').replace(/;.*$/,'') : 'transparent';
    } else o.classList.remove('on');
  });
  if(!v){ txt.textContent = fallback; dot.style.background = 'transparent'; }
}
['a35SelW','a35SelS'].forEach(function(boxId){
  var box = EL(boxId);
  var selId = (boxId === 'a35SelW') ? 'a35RecW' : 'a35RecS';
  var btn = box.querySelector('.sel-btn');
  btn.addEventListener('click', function(e){
    e.stopPropagation();
    var wasOn = box.classList.contains('on');
    closeAllSel();
    if(!wasOn) box.classList.add('on');
  });
  Array.prototype.forEach.call(box.querySelectorAll('.sel-opt'), function(o){
    o.addEventListener('click', function(e){
      e.stopPropagation();
      EL(selId).value = o.dataset.v;
      syncSel(boxId, selId);
      closeAllSel();
      applyRecFilter();
    });
  });
  syncSel(boxId, selId);
});

EL('a35RecBox').addEventListener('click', function(e){
  e.stopPropagation();
  if(!(e.target && e.target.closest && e.target.closest('.a35-sel'))) closeAllSel();
});

let _touchAdvancedAt = 0;
scene.addEventListener('click', ()=>{
  if (Date.now() - _touchAdvancedAt < 450) return;
  if(EL('a35RecBox').classList.contains('on')) return;
  if(cur>=0) next();
});
scene.addEventListener('pointerup', (e)=>{
  if (e.pointerType !== 'touch' && e.pointerType !== 'pen') return;
  if(EL('a35RecBox').classList.contains('on')) return;
  if(cur>=0){ _touchAdvancedAt = Date.now(); next(); }
});

/* ---------- 入场 ---------- */
function initScene35(){
  stopDanmaku(true);
  EL('act35Danmaku').innerHTML='';
  EL('a35RecBox').classList.remove('on'); EL('ph-words').classList.remove('rec-open');
  buildAnan(); buildWords(); buildHeat(); buildAsk(); buildRelay(); buildFinal();
  showPhase(0);
}
if (typeof sceneInit !== 'undefined') sceneInit[4] = initScene35;
})();

})();


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
  var call = function(fn){ try { if (typeof fn === 'function') fn(); } catch (e) { console.warn('act3 初始化异常:', e); } };
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
