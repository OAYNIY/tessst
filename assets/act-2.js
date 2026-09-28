(function(window, document, gsap){

/* ================= 合并运行时沙箱（自动生成，勿手改）================= */
var __realWin = window;
var __realDoc = document;
var __actNo = 2;
var __root = __realDoc.getElementById('act-2');
var __App = __realWin.App;
function __isActive(){ return __App.isActive(__actNo); }
function __scope(sel){
  sel = String(sel);
  if (!sel || sel.indexOf('#act-2') === 0) return sel;
  return '#act-2 ' + sel;
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


window.onerror=function(msg,src,line,col,err){var d=document.getElementById("debug");if(d){var st=err&&err.stack?err.stack:"NO_STACK";d.style.fontSize="14px";d.style.whiteSpace="pre-wrap";d.style.maxWidth="740px";d.textContent="ERR "+msg+"\nL"+line+":"+col+"\n"+st;}else{document.title="ERR "+msg+" "+line+":"+col+" "+st;}};
// 舞台适配
const stage=document.getElementById("stage");
const DESIGN_W=750,DESIGN_H=1334;
function resize(){const s=Math.min(window.innerWidth/DESIGN_W,window.innerHeight/DESIGN_H);stage.style.transform="scale("+s+")";stage.style.left=((window.innerWidth-DESIGN_W*s)/2)+"px";stage.style.top=((window.innerHeight-DESIGN_H*s)/2)+"px";}
window.addEventListener("resize",resize);resize();
// 场景管理（仅第二幕）
const sceneOrder=["scene-2-1","scene-2-2","scene-2-3","scene-2-4","scene-2-5","scene-2-6","scene-2-8","scene-2-9","scene-2-11","scene-2-12","scene-2-13","scene-2-14","scene-2-15","scene-2"];
let currentScene=-1;
const sceneInit=[];
const sceneExit=[];   // 退场动画（如桌子1→桌子2 的左滑出），负责在 onComplete 中隐藏 prev
function goToScene(index){if(index<0||index>=sceneOrder.length)return;if(index===currentScene)return;const prev=document.getElementById(sceneOrder[currentScene]);const next=document.getElementById(sceneOrder[index]);next.classList.add("active");next.style.visibility="visible";next.style.opacity="1";if(sceneExit[currentScene]){sceneExit[currentScene]();}else if(prev){prev.classList.remove("active");prev.style.visibility="hidden";prev.style.opacity="";}currentScene=index;const d=document.getElementById("debug");if(d)d.textContent="scene:"+index+" "+sceneOrder[index];if(sceneInit[index])sceneInit[index]();}

function renderLineArtJSON(url, container, nullFill, texOverride, glassClip, dataOverride, lineMode) {
  const debug = document.getElementById('debug');
  // 每次渲染生成唯一 id 后缀，避免多场景 SVG 的 filter/pattern id 互相串用
  const uid = 'w' + (window.__winSeq = (window.__winSeq || 0) + 1);
  let data = dataOverride || window.WINDOW_DATA;
  if (data) {
    // 线稿模式：纯描边轮廓，用于 null 填充为主的插画（如assets/第二幕-烟火/拿手机.json）
    if (lineMode) {
      try {
        const SVGNS = 'http://www.w3.org/2000/svg';
        const svg = document.createElementNS(SVGNS, 'svg');
        svg.setAttribute('viewBox', `0 0 ${data.width} ${data.height}`);
        svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        svg.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;';
        const stroke = data.stroke || '#2f3640';
        data.paths.forEach(p => {
          const el = document.createElementNS(SVGNS, 'path');
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
        if (debug) debug.textContent += ' lineart:OK';
        return Promise.resolve();
      } catch (e) {
        if (debug) debug.textContent += ' lineart:ERR(' + e.message + ')';
        return Promise.reject(e);
      }
    }
    if (texOverride) {
      // 分镜级纹理覆盖（来自 scenes.json 元素 tex）：浅拷贝，不污染 window.WINDOW_DATA
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

      // 玻璃区域挖空（第二幕）：mask（唯一 id）挖空玻璃+镂空——纯色窗框完整渲染，group 应用 mask，
      // 白色全画布 + 黑色（玻璃路径 + 大面积 null 镂空）→ 玻璃/镂空透明、窗框完整保留
      let glassMaskRef = null;
      if (glassClip) {
        const maskId = 'glass-mask-' + uid;
        const mask = document.createElementNS('http://www.w3.org/2000/svg', 'mask');
        mask.setAttribute('id', maskId);
        mask.setAttribute('maskUnits', 'userSpaceOnUse');
        const white = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        white.setAttribute('x', '0'); white.setAttribute('y', '0');
        white.setAttribute('width', data.width); white.setAttribute('height', data.height);
        white.setAttribute('fill', 'white');
        mask.appendChild(white);
        data.paths.forEach(p => {
          let isHole = p.fill && p.fill.t === 'tex';
          if (!isHole && (p.fill === null || p.fill === undefined) && p.pts && p.pts.length >= 3) {
            // 大面积 null = 镂空（玻璃格），也要挖空
            let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
            p.pts.forEach(pt => {
              if (pt[0] < x0) x0 = pt[0]; if (pt[0] > x1) x1 = pt[0];
              if (pt[1] < y0) y0 = pt[1]; if (pt[1] > y1) y1 = pt[1];
            });
            if ((x1 - x0) * (y1 - y0) > 3000) isHole = true;
          }
          if (isHole) {
            const cp = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            cp.setAttribute('d', p.d);
            cp.setAttribute('fill', 'black');
            mask.appendChild(cp);
          }
        });
        defs.appendChild(mask);
        glassMaskRef = 'url(#' + maskId + ')';
      }

      // 水彩外晕 filter：模糊 + 轻微位移
      const haloFilter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
      haloFilter.setAttribute('id', 'wc-halo-' + uid);
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
      wcFilter.setAttribute('id', 'wc-edge-' + uid);
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
          const patId = 'tex-' + name.replace(/[^\w]/g, '_') + '-' + uid;
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

      const mkPath = (p, fill, ptsOverride) => {
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
        // pts→d 字符串（支持裁剪后的多边形）
        const ptsToD = (pts) => {
          let s = '';
          for (let i = 0; i < pts.length; i++) s += (i ? 'L' : 'M') + pts[i][0] + ' ' + pts[i][1];
          return s + 'Z';
        };
        const pD = ptsToD(ptsOverride || p.pts);
        // 填充层：无描边，保持规整；玻璃区域已通过裁剪消除
        if (mappedFill && mappedFill !== 'none') {
          const f = document.createElementNS(NS, 'path');
          f.setAttribute('d', pD);
          f.setAttribute('fill', mappedFill);
          f.setAttribute('fill-rule', 'evenodd');
          g.appendChild(f);
        }
        const sw = p.sw || data.sw || 2.5;
        // 水彩外晕层：粗、半透明、模糊
        const halo = document.createElementNS(NS, 'path');
        halo.setAttribute('d', pD);
        halo.setAttribute('fill', 'none');
        halo.setAttribute('stroke', 'rgba(80,58,42,0.28)');
        halo.setAttribute('stroke-width', sw + 1.5);
        halo.setAttribute('stroke-linejoin', 'round');
        halo.setAttribute('stroke-linecap', 'round');
        halo.setAttribute('filter', 'url(#wc-halo-' + uid + ')');
        g.appendChild(halo);
        // 水彩实色层：细、实色、轻微毛边
        const core = document.createElementNS(NS, 'path');
        core.setAttribute('d', pD);
        core.setAttribute('fill', 'none');
        core.setAttribute('stroke', 'rgba(80,58,42,0.72)');
        core.setAttribute('stroke-width', sw);
        core.setAttribute('stroke-linejoin', 'round');
        core.setAttribute('stroke-linecap', 'round');
        core.setAttribute('filter', 'url(#wc-edge-' + uid + ')');
        g.appendChild(core);
        return g;
      };

      // 渲染顺序：1.纯色窗框（完整渲染，mask 挖空玻璃） 2.玻璃格(null) 3.纹理(玻璃)
      let colorGroup = null;
      if (glassMaskRef) {
        colorGroup = document.createElementNS(NS, 'g');
        colorGroup.setAttribute('mask', glassMaskRef);
        svg.appendChild(colorGroup);
      }
      data.paths.forEach(p => {
        if (typeof p.fill === 'string') {
          (colorGroup || svg).appendChild(mkPath(p, p.fill));
        }
      });
      // 玻璃格：只有大面积 null（面积>3000）才填充；nullFill='none' 时不填充（透明玻璃，第二幕用）
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
          if (nullFill === 'none') return;   // 透明玻璃：不填墙色
          const glass = document.createElementNS(NS, 'path');
          glass.setAttribute('d', p.d);
          glass.setAttribute('fill', WALL_COLOR);
          glass.setAttribute('fill-rule', 'evenodd');
          (colorGroup || svg).appendChild(glass);
        }
      });
      // 纹理填充（中间大玻璃窗）：无纹理（img:null）→ 玻璃全透明，不渲染该区域；
      // 有纹理 → 只画 pattern 填充（无描边，避免玻璃边缘出现咖啡线）
      data.paths.forEach(p => {
        if (p.fill && p.fill.t === 'tex') {
          const patId = texMap[p.fill.name];
          if (!patId) return;
          const f = document.createElementNS(NS, 'path');
          f.setAttribute('d', p.d);
          f.setAttribute('fill', `url(#${patId})`);
          f.setAttribute('fill-rule', 'evenodd');
          svg.appendChild(f);
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
      if (debug) debug.textContent += ' window:OK(fetch)';
    })
    .catch(e => {
      console.warn('线稿加载失败:', e);
      if (debug) debug.textContent += ' window:ERR(' + e.message + ')';
    });
}

//  第二幕 · 天气（2.1-2.5）
// ============================================================
// 底纹淡色（1x1 RGBA PNG，pattern 放大铺满窗玻璃区域；几乎透明的极淡色）
const ACT2_TEX = {
  ylw: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4nGP4//mIIgAIgwLYxXekCgAAAABJRU5ErkJggg==',
  gry: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4nGO4fPWWIgAHpQKkWUt67wAAAABJRU5ErkJggg==',
  blu: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4nGPYd+21IgAHdgKhpFeWOwAAAABJRU5ErkJggg==',
  sno: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4nGN49u67IgAIdgLthZjptQAAAABJRU5ErkJggg==',
  snw: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4nGPgVff4DwACPQF8mL++2QAAAABJRU5ErkJggg=='   // 05 雪：夜空蓝（雪夜窗玻璃，不透明，仅窗框内的玻璃区域）
};
// 窗玻璃纹理区域（窗.json tex path#0 13 点，映射到 750×1334 画布坐标）
const ACT2_WIN = [[151.5,463.1],[588.2,463.1],[586.3,465.9],[573.3,468.7],[515.3,489.3],[514.3,864.3],[516.2,868.1],[567.6,891.4],[167.4,890.5],[217.9,866.2],[219.8,860.6],[219.8,490.3],[215.1,484.6]];
const ACT2_WIN_BBOX = { x0: 151.5, x1: 588.2, y0: 463.1, y1: 891.4 };
// 批注直线 [x1,y1,x2,y2]（首尾点拟合，用户批注）
const ANN_SUN = [[424,548,549,382],[376,535,374,387],[284,565,121,402],[256,608,104,510],[249,661,94,656],[256,706,94,844],[279,741,141,959],[319,776,259,942],[376,784,376,969],[421,784,514,914],[459,753,579,856],[579,856,646,921],[494,716,679,846],[501,663,671,676],[504,606,674,560],[476,568,659,473],[399,528,466,392],[459,545,656,400],[489,585,659,520],[506,628,684,628],[504,686,669,748],[499,743,664,864],[439,761,594,939],[399,791,456,957],[341,784,311,964],[289,766,199,954],[264,723,96,914],[236,678,79,721],[241,626,81,563],[256,570,96,438],[326,535,289,410]];
const ANN_CLOUD = [[81,69,199,71],[201,139,299,157],[416,71,561,71],[519,154,641,164],[119,239,271,247],[409,272,579,282],[346,192,454,189],[116,1094,314,1115],[91,1215,239,1220],[266,1165,394,1165],[439,1082,594,1069],[554,1197,641,1197],[354,1275,609,1265]];
const ANN_RAIN = [[104,386,106,938],[166,381,201,968],[244,381,249,943],[321,394,326,958],[421,421,419,933],[516,424,484,978],[574,426,571,938],[654,414,651,938]];
// 弹幕短句池（晴/阴/雨 = 真实聊天记录，用户 2026-08-28/29 提供，繁体与标点原样保留）
const SUN_LINES = ['天晴啦','晴天的时候就能看到这样的雪山','关于傍晚天空突然放晴这件事','我們今天下午剛下完雨立马放晴','真的是雨過天晴','这几天天晴 雪山也漂亮','好喜欢晴天啊','晴天！','可是过几天的确是晴天','给人一种晚晴的感觉','武汉终于天晴了','对哦 今天北京是大晴天','特别晴朗的一个月','北京天晴了','雨后天晴'];
const CLOUD_LINES = ['本来想拍雪山，结果天突然阴了，太难过了','阴天','阴天转小雪','阴雨天没有太阳','阴天的美感','今天变阴天了','阴天看不见','为什么总是阴沉','阴沉也好','阴天也有阴天的美妙'];
const RAIN_LINES = ['我们这里下大暴雨','新疆很少有大雨','淋雨真的很爽','我总觉得我们这里一年降雨总天数不超过40天','但是我又很讨厌湿漉漉的下雨天','我们这里也下大雨了','高温天来一场大雨也太棒了','在滂沱大雨中头顶忽然出现了一把伞','蒙蒙细雨','寒潮＝连绵不断的小雨，潮湿的楼道','不喜欢暴雨','但最近下暴雨快要变成海洋','暴雨天是可以正常生活的吗','在太阳雨的彩虹之下拍漂亮照片','然后四五点醒来听雨声到现在','下暴雨了 空气变得难以忍受的潮湿了','要是江浙沪没有雨季就好了','被雨淋的晕晕的','冷冷的冰雨在脸上胡乱地拍','雨到这里连成线','全球下雨最多的就是潮州','下雨变河滩','它今天还在飘雨','被雨水狠狠浇灌','长春下了一天的雨','讨厌下雨讨厌讨厌下雨','下大雨被困在景山上','不下雨就是好天气','但是我不想淋雨','下雨天在宿舍睡觉就是最顶的'];

// ===== 2.6 手机屏 · 真实雪天聊天（来自 聊天记录/雪_聊天记录.md，水彩聊天工具可识别格式） =====
const SNOW_CHAT_MD = String.raw`# 2020-01 雪

| 时间 | 说话人 | 内容 |
| --- | --- | --- |
| 2020年11月20日 21:27:00 | 我 | 啊，这周下雪了 |
| 2020年11月20日 21:27:00 | 我 | img:assets/照片/雪/雪1.jpg |
| 2020年11月20日 21:27:00 | 我 | img:assets/照片/雪/雪2.jpg |
| 2020年11月20日 21:27:00 | 我 | 是今年第一场大雪！ |
| 2020年11月20日 21:27:00 | 江江 | 好牛逼 |
| 2020年11月20日 21:27:00 | 江江 | 好牛逼啊 |
| 2020年11月20日 21:27:00 | 江江 | 我这辈子只见过两次[凋谢] |
| 2020年11月20日 21:27:00 | 江江 | 还可以堆雪人慕了[凋谢] |
| 2020年11月20日 21:27:00 | 江江 | 我们这里只有无尽的寒冷吗 |
| 2020年12月5日 18:46:00 | 我 | 这周早读和体育课都用来扫雪和打雪仗哈哈哈哈哈哈哈 我们班主任和体育老师都好好 没占掉冬天的体育课 还放我们下去玩 别的班羡慕哭了 |
| 2020年12月5日 18:46:00 | 江江 | 慕了 |
| 2020年12月5日 18:46:00 | 江江 | 我和舍友讲你在新疆上体育课打雪仗的时候 |
| 2020年12月5日 18:46:00 | 江江 | 全员泪目 |
| 2021年11月6日 21:38:00 | 江江 | 这辈子应该见过三次雪？ |
| 2021年11月6日 21:38:00 | 江江 | 还有一次是人工的 |
| 2021年11月6日 21:38:00 | 我 | 为什么会有人工的 |
| 2021年11月6日 21:38:00 | 江江 | 去冰雪世界玩 |
| 2022年3月19日 00:49:00 | 我 | 今天是雨夹雪 |
| 2022年3月19日 00:49:00 | 我 | 柔和的雨夹雪是那种蒙蒙细雨加上那种软绵绵的雪花 |
| 2022年3月19日 00:49:00 | 我 | 今天的雨夹雪是倾盆大冰沙 |
| 2022年3月19日 00:49:00 | 我 | 就是那种把冰沙机里的冰整盆倒下来的感觉 |
| 2022年3月19日 00:49:00 | 江江 | 我们这里好热好热 |
| 2022年3月19日 00:49:00 | 江江 | 我已经短裤短袖了 |
| 2023年7月15日 16:27:00 | 江江 | 我不知道我怎么在北京过冬 |
| 2023年7月15日 16:27:00 | 江江 | 可能无法移动 |
| 2023年7月15日 16:27:00 | 江江 | 商场有暖气吗？ |
| 2023年7月15日 16:27:00 | 我 | 有暖气吧 |
| 2023年7月15日 16:27:00 | 我 | 北方都有 |
| 2023年7月15日 16:27:00 | 我 | 没有的话也有空调 |
| 2023年7月15日 16:27:00 | 我 | 是不是你的第一个下雪的冬天 |
| 2023年7月15日 16:27:00 | 江江 | 对对对 |
| 2023年7月15日 16:27:00 | 江江 | 完蛋了完蛋了 |
| 2023年7月15日 16:27:00 | 我 | 买漂亮小棉衣小靴子！ |
| 2023年7月15日 16:27:00 | 我 | 耳套毛线帽 |
| 2024年11月26日 21:17:00 | 我 | 喵喵喵 |
| 2024年11月26日 21:17:00 | 我 | 到此一游 |
| 2024年11月26日 21:17:00 | 我 | img:assets/照片/雪/雪地写字.jpg |
| 2024年11月26日 21:17:00 | 江江 | 下雪了吗下雪了吗 |
| 2024年11月26日 21:17:00 | 江江 | 下雪啦下雪啦 |
| 2024年11月26日 21:17:00 | 江江 | 哇咔咔谢谢宝宝 |
| 2024年11月26日 21:17:00 | 江江 | 我想要发个朋友圈好酷呀 |
| 2025年12月12日 13:53:00 | 江江 | 今天是北京的初雪呢 |
| 2025年12月12日 13:53:00 | 我 | img:assets/照片/雪/认真的雪.png |
| 2025年12月12日 13:53:00 | 我 | 拿上小鸭夹子出门玩雪 |
| 2025年12月12日 13:53:00 | 我 | 耶耶耶 |
| 2026年7月4日 20:16:00 | 江江 | 原来这首歌是薛之谦的吗？认真的雪 |
| 2026年7月4日 20:16:00 | 我 | …… |
| 2026年7月4日 20:16:00 | 我 | 事已至此 再听一遍认真的雪吧 |
| 2026年7月4日 20:16:00 | 我 | 纠结纠结 明天吃什么呢 |
`;

const EMO_MAP = {
  '凋谢':'🥀','哇':'😮','色':'😍','哭':'😭','笑':'😊','发呆':'😳','害羞':'☺️','闭嘴':'🤐',
  '睡觉':'😴','难过':'😢','酷':'😎','抠鼻':'🤥','呲牙':'😁','偷笑':'🤭','生病':'🤒','脸红':'😳',
  '机智':'😏','皱眉':'😟','加油':'💪','胜利':'✌️','666':'👍','强':'👍','鼓掌':'👏','玫瑰':'🌹',
  '爱心':'❤️','心碎':'💔','流泪':'😭','太阳':'☀️','月亮':'🌙','星星':'⭐'
};

function snowFileUrl(p) {
  const u = p.trim().replace(/\\/g, '/');
  return u;
}
function parseChatMd(md) {
  const out = [];
  for (const raw of md.split('\n')) {
    const line = raw.trim();
    if (!line.startsWith('|')) continue;
    const p = line.replace(/^\||\|$/g, '').split('|').map(s => s.trim());
    if (p.length < 3) continue;
    const time = p[0], who = p[1], content = p[2];
    if (who === '时间' || who === '说话人' || time.includes('---')) continue;
    out.push({ time, who, content });
  }
  return out;
}
function renderEmoji(s) {
  return s.replace(/\[([^\]]+)\]/g, (m, name) => EMO_MAP[name] || ('[' + name + ']'));
}

function act2LoadWin(container, tex, nullFill) {
  return renderLineArtJSON('assets/第一幕-启封/窗.json', container, nullFill || null, tex, true)
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
// 底纹区域 = 7 个 tex path 多边形并集（画布坐标，来自窗.json）
const ACT2_TEXPOLYS = [[[151.5,463.1],[588.2,463.1],[586.3,465.9],[573.3,468.7],[515.3,489.3],[514.3,864.3],[516.2,868.1],[567.6,891.4],[167.4,890.5],[217.9,866.2],[219.8,860.6],[219.8,490.3],[215.1,484.6]],[[150.6,489.3],[194.5,500.5],[200.1,504.3],[199.2,612.8],[149.6,612.8]],[[587.3,490.3],[587.3,613.7],[535.8,612.8],[535.8,505.2]],[[168.3,626.8],[199.2,626.8],[200.1,724],[150.6,736.2],[149.6,627.7]],[[536.8,627.7],[587.3,628.7],[587.3,737.1],[535.8,725.9]],[[197.3,742.7],[199.2,742.7],[199.2,847.5],[150.6,869],[150.6,754.9]],[[536.8,744.6],[587.3,756.8],[587.3,871.8],[535.8,850.3]]];
function act2InTexArea(x, y) {
  for (const P of ACT2_TEXPOLYS) {
    let inside = false;
    for (let i = 0, j = P.length - 1; i < P.length; j = i++) {
      const xi = P[i][0], yi = P[i][1], xj = P[j][0], yj = P[j][1];
      if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) inside = !inside;
    }
    if (inside) return true;
  }
  return false;
}
// 线段与底纹区域求交：返回有效参数区间 [t0,t1]（线段 P(t)=A+t(B-A)）；无交叠返回 null
function act2ClipLine(x1, y1, x2, y2) {
  const N = 400, dx = x2 - x1, dy = y2 - y1;
  let best = null, cur = null;
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const inside = act2InTexArea(x1 + dx * t, y1 + dy * t);
    if (inside) { if (!cur) cur = { a: t, b: t }; else cur.b = t; }
    else if (cur) {
      if (!best || (cur.b - cur.a) > (best.b - best.a)) best = cur;
      cur = null;
    }
  }
  if (cur && (!best || (cur.b - cur.a) > (best.b - best.a))) best = cur;
  if (!best) return null;
  // 二分细化左边界
  let a0 = Math.max(0, best.a - 0.004), a1 = best.a;
  for (let k = 0; k < 8; k++) {
    const mid = (a0 + a1) / 2;
    if (act2InTexArea(x1 + dx * mid, y1 + dy * mid)) a1 = mid; else a0 = mid;
  }
  // 二分细化右边界
  let b0 = best.b, b1 = Math.min(1, best.b + 0.004);
  for (let k = 0; k < 8; k++) {
    const mid = (b0 + b1) / 2;
    if (act2InTexArea(x1 + dx * mid, y1 + dy * mid)) b0 = mid; else b1 = mid;
  }
  return [a1, b0];
}

// ---- 2.1 空窗户 ----
sceneInit[0] = function() {
  const winLayer = document.getElementById('win-2-1');
  if (!winLayer.dataset.loaded) {
    act2LoadWin(winLayer, { img: null }, 'none');   // 透明玻璃（无纹理区域也不渲染，null 玻璃格也不填墙色）
    winLayer.dataset.loaded = '1';
  }
  gsap.killTweensOf([winLayer]);
  gsap.set(winLayer, { opacity: 0 });

  // 空窗户淡入
  gsap.to(winLayer, { opacity: 1, duration: 1.2, delay: 0.3, ease: 'power2.out' });
  // 窗边提示出现后仍可左右滑动切换天气。
  const swipeHint = document.getElementById('swipe-hint-2-1');
  if (swipeHint) setTimeout(() => swipeHint.classList.add('on'), 1200);
};

// ---- 2.2 晴：太阳渐显 + 放射弹幕 + 金色粒子 ----
let sunEpoch = 0, sunPending = null, rainEpoch = 0;
function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const k = Math.floor(Math.random() * (i + 1)); const t = a[i]; a[i] = a[k]; a[k] = t; } return a; }
sceneInit[1] = function() {
  const winLayer = document.getElementById('win-2-2');
  if (!winLayer.dataset.loaded) {
    act2LoadWin(winLayer, { img: ACT2_TEX.ylw, x: 0, y: 0, s: 800 }, 'none');
    winLayer.dataset.loaded = '1';
  }
  const sun = document.getElementById('sun-2-2');
  const glow = document.getElementById('sun-glow-2-2');
  const layer = document.getElementById('dmk-2-2');
  gsap.killTweensOf([sun, glow, '#scene-2-2 .danmaku']);
  layer.querySelectorAll('.danmaku').forEach(el => el.remove());

  // 太阳（窗玻璃中心，scenes.json 坐标 375,664）+ 光晕
  gsap.set(sun, { left: 375, top: 664, xPercent: -50, yPercent: -50, width: 359, height: 359, opacity: 0, scale: 0.9 });
  gsap.set(glow, { left: 375, top: 664, xPercent: -50, yPercent: -50, width: 430, height: 430, opacity: 0, scale: 0.6 });
  gsap.to(sun, { opacity: 1, scale: 1, duration: 2.2, delay: 0.5, ease: 'power2.out' });
  gsap.to(glow, { opacity: 1, scale: 1.15, duration: 2.6, delay: 0.8, ease: 'power2.out' });
  gsap.to(glow, { opacity: 0.55, scale: 1.25, duration: 2.8, delay: 3.4, yoyo: true, repeat: -1, ease: 'sine.inOut' });

  // 弹幕：整批齐发——每一拨同时发射全部 15 句（同句不重叠：每句仅占 1 个位置）；长句走竖向线(上下)、短句走横向线(左右)；每拨位置随机；
  // 用尽一轮(15 句)才重洗位置发下一拨（先过一轮再重复）；太阳升起(0.5+2.2s)结束后 3.2s 才发第一拨；
  // 偶=金橙、奇=赭红；终点=距屏幕 60px 内缩矩形；字号 16-20；角度归一 ±90° → 文字永远正向
  const verts = [], horiz = [];
  ANN_SUN.forEach((p, i) => {
    const dx = p[2] - p[0], dy = p[3] - p[1];
    (Math.abs(dy) >= Math.abs(dx) ? verts : horiz).push({ p, i });     // 按批注线角度分竖/横
  });
  const sunSorted = SUN_LINES.map((t, j) => ({ t, j, len: t.length })).sort((a, b) => b.len - a.len);
  const MED = sunSorted[Math.floor(sunSorted.length / 2)].len;          // 长/短分界
  const myEpoch = ++sunEpoch;
  if (sunPending) { sunPending.kill(); sunPending = null; }
  function spawnSun(o, sent) {
    const { p, i } = o, txt = sent.t;
    const dx = p[2] - p[0], dy = p[3] - p[1], len = Math.hypot(dx, dy);
    if (len < 1) return;
    const ux = dx / len, uy = dy / len;
    const el = document.createElement('div');
    el.className = 'danmaku ' + (i % 2 ? 'sun-dmk alt' : 'sun-dmk');   // 偶=金橙，奇=赭红
    el.textContent = txt;
    let fs = 18 + Math.round((Math.random() - 0.5) * 4);               // 字号统一 16-20
    while (fs > 14 && fs * txt.length > len) fs--;                     // 长句遇短线略缩，下限 14
    if (fs * txt.length > len) return;
    el.style.fontSize = fs + 'px';
    const half = fs * txt.length / 2;
    const sx = p[0] - ux * half, sy = p[1] - uy * half;                // 起点在批注线之前
    // 终点：沿批注线方向延伸，碰到距屏幕边缘 60px 的内缩矩形边界即消失
    const M = 60, RX0 = M, RX1 = 750 - M, RY0 = M, RY1 = 1334 - M;
    let tb = Infinity;
    if (ux > 1e-6) tb = Math.min(tb, (RX1 - p[0]) / ux);
    else if (ux < -1e-6) tb = Math.min(tb, (RX0 - p[0]) / ux);
    if (uy > 1e-6) tb = Math.min(tb, (RY1 - p[1]) / uy);
    else if (uy < -1e-6) tb = Math.min(tb, (RY0 - p[1]) / uy);
    if (tb === Infinity) tb = len * 2;
    tb = Math.max(tb, half + 40);                                      // 至少让文字整段滑过起点
    const ex = p[0] + ux * tb, ey = p[1] + uy * tb;
    const baseOp = i % 2 ? 0.6 : 0.85;
    let ang = Math.atan2(dy, dx) * 180 / Math.PI;                      // 方向归一：±90° 内永远正向
    if (ang > 90) ang -= 180; else if (ang < -90) ang += 180;
    gsap.set(el, { left: sx, top: sy, xPercent: -50, yPercent: -50, rotation: ang, opacity: 0 });
    layer.appendChild(el);
    const dur = 3.0 + Math.random() * 1.0, moveDur = dur * 0.72;
    gsap.timeline()
      .fromTo(el, { x: 0, y: 0, opacity: 0 }, { opacity: baseOp, duration: 0.3, ease: 'none' })
      .to(el, { x: ex - sx, y: ey - sy, duration: moveDur, ease: 'none' })
      .to(el, { opacity: 0, duration: moveDur * 0.3, ease: 'none' }, moveDur * 0.7)
      .to(el, { opacity: 0, duration: 0.01, onComplete: () => el.remove() });   // 滚完即移除，下一拨重建
  }
  function fireSalvo() {
    if (myEpoch !== sunEpoch) return;                                  // 切场景即停
    const v = shuffle(verts.slice()), h = shuffle(horiz.slice());
    const longOnes = shuffle(sunSorted.filter(s => s.len >= MED));
    const shortOnes = shuffle(sunSorted.filter(s => s.len < MED));
    let vi = 0, hi = 0;
    function pick(wantVert) {                                          // 优先匹配朝向，缺则补另一朝向
      if (wantVert && vi < v.length) return v[vi++];
      if (!wantVert && hi < h.length) return h[hi++];
      if (vi < v.length) return v[vi++];
      if (hi < h.length) return h[hi++];
      return null;
    }
    [...longOnes, ...shortOnes].forEach(sent => {                      // 整批齐发：15 句同一时刻出场
      const o = pick(sent.len >= MED);
      if (o) spawnSun(o, sent);
    });
    sunPending = gsap.delayedCall(4.6, fireSalvo);                     // 整批改完(~4s)+小空档 → 下一拨（已过一轮）
  }
  sunPending = gsap.delayedCall(3.2, fireSalvo);

  // 金色粒子
  act2Particles(document.getElementById('pc-gold'), 'gold');
};

// ---- 2.3 阴：云朵划入 + 呼吸弹幕 ----
sceneInit[2] = function() {
  const winLayer = document.getElementById('win-2-3');
  if (!winLayer.dataset.loaded) {
    act2LoadWin(winLayer, { img: ACT2_TEX.gry, x: 0, y: 0, s: 800 }, 'none');
    winLayer.dataset.loaded = '1';
  }
  const layer = document.getElementById('dmk-2-3');
  const cloudA = document.querySelector('#scene-2-3 .cloud-a');   // 云朵2 (280,531)
  const cloudB = document.querySelector('#scene-2-3 .cloud-b');   // 云朵1 (510,687)
  gsap.killTweensOf([cloudA, cloudB, '#scene-2-3 .danmaku']);
  layer.querySelectorAll('.danmaku').forEach(el => el.remove());

  // 云朵滑入（向左滑动 → 太阳向左淡出，乌云从左往右划入）
  // 滑入全程在窗内：cloudA（云朵2 终点 280,531）原位淡入；cloudB（云朵1 终点 480,687）从窗内左缘滑入
  // （起点中心 301.5 → 左缘 301.5-120=181.5 ≥151.5，不出窗；终点右缘 480+120=600 ≤610）
  gsap.set(cloudA, { left: '37.33%', top: '39.8%', xPercent: -50, yPercent: -50, x: 0, opacity: 0 });
  gsap.set(cloudB, { left: '64%', top: '51.5%', xPercent: -50, yPercent: -50, x: -178.5, opacity: 0 });
  gsap.to(cloudA, { opacity: 1, duration: 1.8, delay: 0.3, ease: 'power2.out' });
  gsap.to(cloudB, { x: 0, opacity: 1, duration: 2.0, delay: 0.9, ease: 'power2.out' });
  // 漂移改 yoyo 往返（0↔18 / 0↔-18）：循环无缝，不再有旧写法 repeat 时跳回记录起点的瞬移感
  gsap.to(cloudA, { x: 18, duration: 6, ease: 'sine.inOut', yoyo: true, repeat: -1 });
  gsap.to(cloudB, { x: -18, duration: 7, ease: 'sine.inOut', yoyo: true, repeat: -1 });   // 只向左漂：右缘峰值 600 ≤610 限在框内

  // 10 句真实记录 → 占满窗上方：最长一句单独成顶行横幅（可折行），其余 9 句在窗上方随机散布（大字、分散、不重叠、不整齐）
  const order = CLOUD_LINES.map((t, j) => ({ t, j, len: t.length })).sort((a, b) => b.len - a.len);
  const longOne = order[0], rest = order.slice(1);
  const clampFs = (v, lo, hi) => Math.max(lo, Math.min(hi, Math.round(v)));
  function placeCloud(t, x, y, fs, wrap, wrapW) {
    const el = document.createElement('div');
    el.className = 'danmaku cloud-dmk';
    el.textContent = t;
    el.style.fontSize = fs + 'px';
    el.style.textAlign = 'center';
    if (wrap) { el.style.whiteSpace = 'normal'; el.style.width = wrapW + 'px'; el.style.lineHeight = '1.3'; }
    else { el.style.whiteSpace = 'nowrap'; }
    gsap.set(el, { left: x, top: y, xPercent: -50, yPercent: -50, opacity: 0 });
    layer.appendChild(el);
    // 独立呼吸：先淡入到全亮，之后只在 0.82↔1.0 之间轻柔呼吸、永不整体隐去
    // → 10 句全部常驻窗上方、同时清晰可见，解决"太空"；仍保留轻微明暗变化（呼吸感）
    gsap.fromTo(el, { opacity: 0 }, {
      opacity: 1.0, duration: 1.2 + Math.random() * 0.6, ease: 'sine.inOut', delay: Math.random() * 1.0
    });
    gsap.to(el, {
      opacity: 0.82, duration: 2.6, ease: 'sine.inOut', yoyo: true, repeat: -1,
      delay: 1.5 + Math.random() * 0.8
    });
  }
  // 最长句横幅在 boxes 声明后放置（见下方）
  // 其余 9 句：在整块窗上方区域做泊松式随机散布（包围盒拒绝采样 + 最大化最小间距准则选点）
  // → 位置彻底随机、不再有网格结构；最长句优先占位（最难排先占），任意两句视觉不重叠
  const REGION = { x0: 80, x1: 690, y0: 62, y1: 405 };
  const boxes = [];
  // 最长一句：与散布句同字号（22px）、单行不折行、随机水平位置；并纳入碰撞盒，下方散布句不会压到它
  const bannerFs = 22;                                        // 与其他阴天弹幕同字号
  const bw = longOne.len * bannerFs * 0.95;                   // 单行实际宽度，用于碰撞盒
  const bx = 285 + Math.random() * 200, by = 100 + Math.random() * 24;   // 居中偏随机，保证 376px 宽不超出窗
  placeCloud(longOne.t, bx, by, bannerFs, false);              // wrap=false → 单行不折行
  boxes.push({ x: bx, y: by, w: bw, h: bannerFs * 1.3 });
  function scatterFit(t, len) {
    for (let step = 0; step < 3; step++) {
      const fs = clampFs(190 / len, 13, 22) - step * 2;        // 正常字号放不下就逐级缩小
      const w = len * fs * 0.9, h = fs * 1.3;
      let cand = null, bestGap = -1e9;
      for (let s = 0; s < 40; s++) {
        const cx = REGION.x0 + w / 2 + Math.random() * (REGION.x1 - REGION.x0 - w);
        const cy = REGION.y0 + h / 2 + Math.random() * (REGION.y1 - REGION.y0 - h);
        let gap = Infinity;
        for (const b of boxes) {
          const sep = Math.max(Math.abs(cx - b.x) - (w + b.w) / 2, Math.abs(cy - b.y) - (h + b.h) / 2);
          gap = Math.min(gap, sep);                            // 与所有已放置句的最小间隙
        }
        if (gap > bestGap) { bestGap = gap; cand = { cx, cy, fs, w, h }; }
        if (gap >= 16) break;                                  // 已达良好间距，直接采用
      }
      if (cand && bestGap >= 6) { boxes.push({ x: cand.cx, y: cand.cy, w: cand.w, h: cand.h }); return cand; }
    }
    const fs = 12, w = len * fs * 0.9, h = fs * 1.3;           // 兜底：区域极满也强行放（极少触发）
    const cx = REGION.x0 + w / 2 + Math.random() * (REGION.x1 - REGION.x0 - w);
    const cy = REGION.y0 + h / 2 + Math.random() * (REGION.y1 - REGION.y0 - h);
    boxes.push({ x: cx, y: cy, w, h });
    return { cx, cy, fs, w, h };
  }
  rest.forEach(({ t, len }) => {
    const r = scatterFit(t, len);
    placeCloud(t, r.cx, r.cy, r.fs, false);
  });
};

// ---- 2.4 雨：垂直弹幕 + 雨滴粒子 ----
sceneInit[3] = function() {
  const winLayer = document.getElementById('win-2-4');
  if (!winLayer.dataset.loaded) {
    act2LoadWin(winLayer, { img: ACT2_TEX.blu, x: 0, y: 0, s: 800 }, 'none');
    winLayer.dataset.loaded = '1';
  }
  const layer = document.getElementById('dmk-2-4');
  const drop = document.querySelector('#scene-2-4 .rain-drop');
  gsap.killTweensOf([drop, '#scene-2-4 .danmaku']);
  layer.querySelectorAll('.danmaku').forEach(el => el.remove());
  const myRainEpoch = ++rainEpoch;

  // 玻璃上的雨渍（scenes.json 坐标 378,667）
  gsap.set(drop, { left: 378, top: 667, xPercent: -50, yPercent: -50, opacity: 0 });
  gsap.to(drop, { opacity: 0.5, duration: 1.6, delay: 0.8 });

  // 20 条弹幕（8 条批注线：偶×3、奇×2）：整条竖排（上→下阅读），从玻璃上沿上方进入、一路下落到整块移出玻璃下沿。
  // 底部字先跨入玻璃上沿先出现，穿出下沿时底部字先消失、顶部字最后消失；全程不淡出。
  // 窗外部分被 #dmk-2-4 的 clip-path 裁掉；x 全局去重不重叠（间距>24px）；delay/速度错开 → 不同时发、持续有新弹幕
  // 滚动速度 SPEEDS 保持不变，仅加密+衔接：列数 12→20、循环空窗缩短(0.15-0.75s)几乎无缝、列间距>24px 不重叠
  // 20 列 x 在玻璃宽度内均匀铺开（间距≈21.8px），再打乱顺序 → 列错落但不重叠
  // 竖向每列仅 1 字宽≈fs(≤15)，21.8 间距保证 ≥6px 间隙，从根上消除重叠（滚动速度 SPEEDS 不变）
  const COLS = 20, GX0 = 151.5, GX1 = 588.2;
  const colXs = [];
  for (let c = 0; c < COLS; c++) colXs.push(GX0 + (c + 0.5) * (GX1 - GX0) / COLS);
  shuffle(colXs);
  let colPtr = 0;
  // 雨弹幕：20 列 x 在玻璃内均匀铺开（间距≈21.8px，竖列仅 1 字宽→不重叠）；每列每次循环从"30 句队列"依次取句，用尽一轮才重洗
  // → 用户给的每句都先过一遍再重复；滚动速度 SPEEDS 不变，循环空窗 0.15-0.75s 几乎无缝
  let rq = shuffle([...Array(RAIN_LINES.length).keys()]);   // 30 句索引随机队列
  let rqi = 0;
  function nextRain() {
    const idx = rq[rqi % rq.length]; rqi++;
    if (rqi % rq.length === 0) rq = shuffle(rq);            // 一轮用尽后重洗
    return RAIN_LINES[idx];
  }
  const SPEEDS = [70, 88, 105, 122];
  const GY0 = 463, GY1 = 891;
  ANN_RAIN.forEach((p, i) => {
    const seg = act2ClipLine(p[0], p[1], p[2], p[3]);
    if (!seg) return;
    const [t0, t1] = seg;
    const dx = p[2] - p[0], dy = p[3] - p[1];
    const ax = p[0] + dx * t0, ay = p[1] + dy * t0;   // 玻璃上沿
    const bx = p[0] + dx * t1, by = p[1] + dy * t1;   // 玻璃下沿
    const x0 = (ax + bx) / 2;
    const cnt = i % 2 ? 2 : 3;                          // 偶批注线 3 列、奇批注线 2 列 → 共 20 列
    for (let k = 0; k < cnt; k++) {
      const x = colXs[colPtr++ % COLS];                // 均匀铺开 + 打乱 → 不重叠
      const sp = SPEEDS[(i + k * 2) % SPEEDS.length];
      const firstDelay = i * 0.5 + k * 0.35 + Math.random() * 0.9;
      const el = document.createElement('div');
      el.className = 'danmaku rain-dmk';
      el.style.writingMode = 'vertical-rl';
      layer.appendChild(el);
      function runRain() {
        if (myRainEpoch !== rainEpoch) return;          // 切场景即停
        const txt = nextRain();                         // 取下一句（过一轮再重复）
        const fs = Math.max(12, Math.min(15, Math.round((by - ay) / (txt.length * 1.9))));   // 12-15px
        const gap = fs * 1.15;                          // 字间距
        const totalH = txt.length * gap;                // 竖排文字块总高
        const startY = GY0 - totalH;                   // 顶部在上沿之上，底部字贴住上沿
        const endY = GY1;                              // 顶部到下沿，整块移出玻璃
        const dist = endY - startY;
        el.style.fontSize = fs + 'px';
        el.style.lineHeight = gap + 'px';
        el.textContent = txt;
        gsap.set(el, { left: x, top: startY, xPercent: -50, yPercent: 0, opacity: 0.85 });   // yPercent:0 让 top 直接对齐
        gsap.timeline({ onComplete: () => gsap.delayedCall(0.12 + Math.random() * 0.4, runRain) })   // 滚完接下一句（几乎无缝）
          .fromTo(el, { y: 0 }, { y: dist, duration: dist / sp, ease: 'none' });
      }
      gsap.delayedCall(firstDelay, runRain);
    }
  });

  act2Particles(document.getElementById('pc-rain'), 'rain');
};

const SNOW_BOOST = { v: 1 };  // 雪加速按钮全局乘数（长按 = 加速）

// ---- 2.5 雪：窗内雪花堆积 + 全屏白粒子 ----
sceneInit[4] = function() {
  const winLayer = document.getElementById('win-2-5');
  if (!winLayer.dataset.loaded) {
    act2LoadWin(winLayer, { img: ACT2_TEX.snw, x: 0, y: 0, s: 800 }, 'none');   // 05 雪：中灰偏暖底
    winLayer.dataset.loaded = '1';
  }
  const canvas = document.getElementById('snow-2-5');
  const ctx = canvas.getContext('2d');
  const W = 750, H = 1334, PIXEL_RATIO = window.innerWidth < 600 ? 0.5 : 1;
  canvas.width = Math.round(W * PIXEL_RATIO); canvas.height = Math.round(H * PIXEL_RATIO);
  ctx.setTransform(PIXEL_RATIO, 0, 0, PIXEL_RATIO, 0, 0);
  const bbox = ACT2_WIN_BBOX;
  const cols = Math.ceil(bbox.x1 - bbox.x0) + 1;
  const baseNoise = Array.from({ length: cols }, (_, i) => Math.sin(i * 0.35) * 4 + Math.cos(i * 0.11) * 3);
  const scene = canvas.closest('.scene');
  const snowRunId = String(Number(scene.dataset.snowRunId || 0) + 1);
  scene.dataset.snowRunId = snowRunId;
  const flakes = [];
  const MAX_FLAKES = window.innerWidth < 600 ? 28 : 65;
  const ACC_TARGET = 1850;
  const maxH = (bbox.y1 - bbox.y0) * 0.33 * 0.5;   // 积雪最高高度：原 0.33 的一半（用户：下到一半即可停）
  let acc = 0, raf = 0, done = false, gone = false;
  gsap.killTweensOf([winLayer]);
  // 灰色玻璃底纹渐显（不突兀），彻底显示后才下雪
  gsap.set(winLayer, { opacity: 0 });
  gsap.to(winLayer, { opacity: 1, duration: 2.2, ease: 'power1.inOut' });

  // 雪加速按钮：长按加速下雪 + 积雪（按钮在右下角，避开下一幕手机位置，长按不会误触）
  const boostWrap = document.getElementById('snow-boost-wrap');
  const boostBtn = document.getElementById('snow-boost');
  if (boostBtn && boostWrap) {
    gsap.set(boostWrap, { opacity: 0 });
    boostWrap.style.pointerEvents = 'none';
    boostBtn.classList.remove('pressed');
    gsap.to(SNOW_BOOST, { v: 1, duration: 0.2, overwrite: true });
    gsap.delayedCall(2.4, () => {
      gsap.to(boostWrap, { opacity: 1, duration: 0.6, onStart: () => { boostWrap.style.pointerEvents = 'auto'; } });
    });
    const press = (e) => { e.preventDefault(); boostBtn.classList.add('pressed'); gsap.to(SNOW_BOOST, { v: 3.6, duration: 0.25, overwrite: true }); };
    const release = () => { boostBtn.classList.remove('pressed'); gsap.to(SNOW_BOOST, { v: 1, duration: 0.5, overwrite: true }); };
    boostBtn.onpointerdown = press;
    boostBtn.onpointerup = release;
    boostBtn.onpointerleave = release;
    boostBtn.onpointercancel = release;
  }

  function spawn() {
    if (flakes.length >= MAX_FLAKES) return;
    // 雪花只在底纹区域（7 块 tex 玻璃）生成，窗框/窗格上不落雪
    let x, y, tries = 0;
    do {
      x = bbox.x0 + Math.random() * (bbox.x1 - bbox.x0);
      y = bbox.y0 + Math.random() * (bbox.y1 - bbox.y0) * 0.35;
      tries++;
    } while (!act2InTexArea(x, y) && tries < 20);
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
    if (scene.dataset.snowRunId !== snowRunId || !scene.classList.contains('active')) { raf = 0; return; }
    if (Math.random() < Math.min(1, 0.55 * SNOW_BOOST.v)) spawn();
    const h = Math.min(acc / ACC_TARGET, 1) * maxH;
    for (let i = flakes.length - 1; i >= 0; i--) {
      const f = flakes[i];
      f.y += f.vy * SNOW_BOOST.v;
      f.x += (f.vx + Math.sin(f.ph += 0.03) * 0.3) * SNOW_BOOST.v;
      f.rot += f.vr;
      const col = Math.max(0, Math.min(cols - 1, Math.round(f.x - bbox.x0)));
      const snowTop = bbox.y1 - (h + baseNoise[col] * 0.6) - 2;
      if (f.y >= snowTop || f.y >= bbox.y1) { acc += 7 * SNOW_BOOST.v; flakes.splice(i, 1); }
    }
    ctx.clearRect(0, 0, W, H);
    ctx.save();
    // 雪只画在底纹区域（7 块 tex 玻璃并集：中间主玻璃 + 左右细条），窗框分隔条上不落雪。
    // 7 个多边形互不相交 → 复合路径（moveTo/lineTo/closePath 交替）按非零环绕规则填充 = 并集
    ctx.beginPath();
    ACT2_TEXPOLYS.forEach(P => {
      P.forEach((pt, i) => { i ? ctx.lineTo(pt[0], pt[1]) : ctx.moveTo(pt[0], pt[1]); });
      ctx.closePath();
    });
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
      setTimeout(() => {
        if (!gone && currentScene === 4) { gone = true; goToScene(5); }
      }, 1600);
    }
    raf = requestAnimationFrame(loop);
  }
  // 雪花先在窗内出现，玻璃底纹仍按原节奏渐显。
  setTimeout(() => {
    if (currentScene !== 4 || scene.dataset.snowRunId !== snowRunId) return;
    for (let i = 0; i < MAX_FLAKES / 2; i++) spawn();
    act2Particles(document.getElementById('pc-snow'), 'snow');
    loop();
  }, 350);
};

// ============================================================
//  第二幕 粒子引擎（gold / rain / snow）
// ============================================================
function act2Particles(canvas, kind) {
  const ctx = canvas.getContext('2d');
  const W = 750, H = 1334, PIXEL_RATIO = window.innerWidth < 600 ? 0.5 : 1;
  const runId = String(Number(canvas.dataset.particleRunId || 0) + 1);
  canvas.dataset.particleRunId = runId;
  canvas.width = Math.round(W * PIXEL_RATIO); canvas.height = Math.round(H * PIXEL_RATIO);
  ctx.setTransform(PIXEL_RATIO, 0, 0, PIXEL_RATIO, 0, 0);
  const cfg = {
    gold: { n: window.innerWidth < 600 ? 90 : 260, v: () => ({ x: Math.random() * W, y: -20 - Math.random() * H * 0.5, vy: 0.6 + Math.random() * 1.2, vx: (Math.random() - 0.5) * 0.3, r: 1 + Math.random() * 2.2, c: 'rgba(255,' + (190 + Math.floor(Math.random() * 40)) + ',90,', a: 0.35 + Math.random() * 0.4 }) },
    rain: { n: window.innerWidth < 600 ? 150 : 420, v: () => ({ x: Math.random() * W, y: -30 - Math.random() * H * 0.4, vy: 7 + Math.random() * 5, vx: -0.8 - Math.random() * 1.2, len: 14 + Math.random() * 14 }) },
    snow: { n: window.innerWidth < 600 ? 55 : 120, v: () => ({ x: ACT2_WIN_BBOX.x0 + Math.random() * (ACT2_WIN_BBOX.x1 - ACT2_WIN_BBOX.x0), y: ACT2_WIN_BBOX.y0 + Math.random() * (ACT2_WIN_BBOX.y1 - ACT2_WIN_BBOX.y0), vy: 0.5 + Math.random() * 1.0, vx: (Math.random() - 0.5) * 0.5, r: 1 + Math.random() * 2.5, ph: Math.random() * Math.PI * 2, c: 'rgba(255,255,255,', a: 0.5 + Math.random() * 0.4 }) }
  }[kind];
  const pts = Array.from({ length: cfg.n }, cfg.v);
  const scene = canvas.closest('.scene');
  let raf = 0;
  function loop() {
    if (canvas.dataset.particleRunId !== runId || !scene || !scene.classList.contains('active')) { raf = 0; ctx.clearRect(0, 0, W, H); return; }
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
        const m = (kind === 'snow') ? SNOW_BOOST.v : 1;
        p.y += p.vy * m;
        if (kind === 'snow') { p.x += (p.vx + Math.sin(p.ph += 0.02) * 0.4) * m; }
        else { p.x += p.vx; }
        if (kind === 'snow' && p.y > ACT2_WIN_BBOX.y1) {
          p.y = ACT2_WIN_BBOX.y0;
          p.x = ACT2_WIN_BBOX.x0 + Math.random() * (ACT2_WIN_BBOX.x1 - ACT2_WIN_BBOX.x0);
        } else if (kind !== 'snow' && p.y > H + 20) { p.y = -20; p.x = Math.random() * W; }
        if (kind === 'snow' && !act2InTexArea(p.x, p.y)) continue;
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

// ---- 第二幕 左右滑动切换（2-1 .. scene-2 标题页） ----
(function() {
  const SWIPE_MIN = 60;
  let sx = null, tracking = false;
  const stage = document.getElementById('stage');
  stage.addEventListener('pointerdown', e => {
    if (currentScene < 0 || currentScene > 8) return;
    sx = e.clientX; tracking = true;
  });
  stage.addEventListener('pointermove', e => {
    if (!tracking || sx == null) return;
    if (Math.abs(e.clientX - sx) > SWIPE_MIN) {
      tracking = false;
      const target = (e.clientX - sx) < 0 ? currentScene + 1 : currentScene - 1;
      if (target >= 0 && target <= sceneOrder.length - 1 && target !== currentScene) goToScene(target);
    }
  });
  stage.addEventListener('pointerup', () => { tracking = false; sx = null; });
  stage.addEventListener('pointercancel', () => { tracking = false; sx = null; });
})();

// 占位场景初始化（空函数）- 从索引 5 开始（2-6..2-15 及幕标题页）

for (let i = 5; i < sceneOrder.length; i++) {
  sceneInit[i] = function() {};
}

// ========== 「吃了什么」水彩分镜入场（scene-2-8 … scene-2-15） ==========
function ceInit(idx){
  const el = document.getElementById(sceneOrder[idx]);
  if (!el) return;
  const items = el.querySelectorAll('[data-anim]');
  gsap.killTweensOf(items);
  // 手账贴纸"落纸"手感：微缩 + 下沉 + 回弹，逐片叠落
  gsap.set(items, { opacity: 0, y: 26, scale: 0.94 });
  gsap.to(items, { opacity: 1, y: 0, scale: 1, duration: 0.75, ease: 'back.out(1.5)', stagger: 0.11, delay: 0.2 });
  // 轻触场景任意处 → 下一屏；末屏 scene-2-15 → 收尾 scene-2
  if (idx < sceneOrder.length - 1) {
    el.onclick = () => { if (currentScene === idx) goToScene(idx + 1); };
  }
}
for (let i = 6; i <= 7; i++) { sceneInit[i] = () => ceInit(i); }

// ========== 2.11–2.15 分屏专属入场：节奏跟着每屏的内容结构走 ==========
function sbNext(el, idx){
  if (idx < sceneOrder.length - 1) {
    el.onclick = () => { if (currentScene === idx) goToScene(idx + 1); };
  }
}

// 2.11 四年追踪 / 2.12 镜像未结案：时间轴先落笔，年份节点依次亮，卡片沿线叠落
function sbTimeline(idx, dir){
  const el = document.getElementById(sceneOrder[idx]);
  if (!el) return;
  const items = el.querySelectorAll('[data-anim]');
  const spine = el.querySelector('.k-spine');
  const nodes = el.querySelectorAll('.k-node');
  const years = el.querySelectorAll('.k-year');
  gsap.killTweensOf([items, spine, nodes, years]);
  gsap.set(items, { opacity: 0, y: 26, scale: 0.94 });
  gsap.set(nodes, { scale: 0 });
  gsap.set(years, { opacity: 0, x: -14 * dir });
  gsap.set(spine, { scaleY: 0, transformOrigin: 'top center' });
  gsap.to(spine, { scaleY: 1, duration: 1.15, ease: 'power2.out', delay: 0.15 });
  gsap.to(nodes, { scale: 1, duration: 0.5, ease: 'back.out(2.2)', stagger: 0.13, delay: 0.5 });
  gsap.to(years, { opacity: 1, x: 0, duration: 0.45, ease: 'power2.out', stagger: 0.13, delay: 0.55 });
  gsap.to(items, { opacity: 1, y: 0, scale: 1, duration: 0.72, ease: 'back.out(1.5)', stagger: 0.1, delay: 0.3 });
  sbNext(el, idx);
}
sceneInit[8] = () => sbTimeline(8, 1);    // 2.11 轴在左
sceneInit[9] = () => sbTimeline(9, -1);   // 2.12 轴在右（镜像）

// 2.13 改错：照片先落定，再划掉写错的名字，最后贴上更正
function sbCorrection(idx){
  const el = document.getElementById(sceneOrder[idx]);
  if (!el) return;
  const items = el.querySelectorAll('[data-anim]');
  const strike = el.querySelector('.k-fix-strike');
  const pops = el.querySelectorAll('.k-fix-pop');
  gsap.killTweensOf([items, strike, pops]);
  gsap.set(items, { opacity: 0, y: 26, scale: 0.94 });
  gsap.set(strike, { scaleX: 0, transformOrigin: 'left center' });
  gsap.set(pops, { opacity: 0, scale: 0.86 });
  gsap.timeline({ delay: 0.2 })
    .to(items, { opacity: 1, y: 0, scale: 1, duration: 0.75, ease: 'back.out(1.5)', stagger: 0.1 })
    .to(strike, { scaleX: 1, duration: 0.4, ease: 'power2.inOut' }, '+=0.35')
    .to(pops, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.8)', stagger: 0.12 }, '-=0.12');
  sbNext(el, idx);
}
sceneInit[10] = () => sbCorrection(10);

// 2.14 冠军：绶带与勋章先立起来，再逐个落下口碑，最后揭晓唯一例外
function sbChampion(idx){
  const el = document.getElementById(sceneOrder[idx]);
  if (!el) return;
  const items = el.querySelectorAll('[data-anim]');
  const ribbon = el.querySelector('.champ-ribbon');
  const medal = el.querySelector('.rosette');
  gsap.killTweensOf([items, ribbon, medal]);
  gsap.set(items, { opacity: 0, y: 26, scale: 0.94 });
  gsap.set(ribbon, { opacity: 0, y: -24, scale: 0.9 });
  gsap.set(medal, { opacity: 0, scale: 0.45 });
  gsap.timeline({ delay: 0.2 })
    .to(items, { opacity: 1, y: 0, scale: 1, duration: 0.75, ease: 'back.out(1.5)', stagger: 0.1 })
    .to(ribbon, { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'back.out(1.7)' }, '-=0.45')
    .to(medal, { opacity: 1, scale: 1, duration: 0.7, ease: 'back.out(1.6)' }, '-=0.5');
  sbNext(el, idx);
}
sceneInit[11] = () => sbChampion(11);

// 2.15 未兑现：清单一条条浮上来（全是虚的），最后才画出那张饼
function sbWishlist(idx){
  const el = document.getElementById(sceneOrder[idx]);
  if (!el) return;
  const items = el.querySelectorAll('[data-anim]');
  const rows = el.querySelectorAll('.todo-row');
  const pie = el.querySelector('.food-pie');
  gsap.killTweensOf([items, rows, pie]);
  gsap.set(items, { opacity: 0, y: 26, scale: 0.94 });
  gsap.set(rows, { opacity: 0, y: 12 });
  gsap.set(pie, { opacity: 0, scale: 0.92, transformOrigin: 'center center' });
  gsap.timeline({ delay: 0.2 })
    .to(items, { opacity: 1, y: 0, scale: 1, duration: 0.75, ease: 'back.out(1.5)', stagger: 0.1 })
    .to(rows, { opacity: 1, y: 0, duration: 0.4, stagger: 0.08 }, '-=0.6')
    .to(pie, { opacity: 1, scale: 1, duration: 0.7, ease: 'back.out(1.4)' }, '-=0.15');
  sbNext(el, idx);
}
sceneInit[12] = () => sbWishlist(12);

// ========== 2.6 镜头拉远 · 回到 1.1 房间（积雪的窗 + 摊开的书） ==========
let phoneChatCleanup = null;
sceneInit[5] = function() {
  if (phoneChatCleanup) { phoneChatCleanup(); phoneChatCleanup = null; }
  const room = document.getElementById('room-2-6');
  const furniture = document.getElementById('furniture-2-6');
  const winLayer = document.getElementById('win-2-6');
  const wall = document.querySelector('#scene-2-6 .room-wall');
  const phone = document.getElementById('phone-2-6');
  const phoneShake = phone.querySelector('.phone-shake');
  phone.onclick = null;
  phone.style.pointerEvents = 'none';
  const phoneImg = phone.querySelector('img');
  if (phoneImg) {
    phoneImg.loading = 'eager';
    phoneImg.decoding = 'async';
    if (phoneImg.decode) phoneImg.decode().catch(() => {});
  }
  if (!winLayer.dataset.loaded) {
    act2LoadWin(winLayer, { img: ACT2_TEX.snw, x: 0, y: 0, s: 800 }, 'none');
    winLayer.dataset.loaded = '1';
  }  const canvas = document.getElementById('snow-2-6');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = 750, H = 1100, PIXEL_RATIO = window.innerWidth < 600 ? 0.5 : 1;
  canvas.width = Math.round(W * PIXEL_RATIO); canvas.height = Math.round(H * PIXEL_RATIO);
  ctx.setTransform(PIXEL_RATIO, 0, 0, PIXEL_RATIO, 0, 0);
  // win-layer 使用 preserveAspectRatio="slice" 放进 750×1100 视口，垂直方向会裁掉上下各 117px。
  // 雪 canvas 采用同一裁切坐标，确保雪花、积雪和玻璃纹理始终重合。
  const WINDOW_CROP_Y = (1334 - H) / 2;
  const BBOX = {
    x0: ACT2_WIN_BBOX.x0,
    x1: ACT2_WIN_BBOX.x1,
    y0: ACT2_WIN_BBOX.y0 - WINDOW_CROP_Y,
    y1: ACT2_WIN_BBOX.y1 - WINDOW_CROP_Y
  };
  const POLYS = ACT2_TEXPOLYS.map(P => P.map(pt => [pt[0], pt[1] - WINDOW_CROP_Y]));
  const cols = Math.ceil(BBOX.x1 - BBOX.x0) + 1;
  const baseNoise = Array.from({ length: cols }, (_, i) => Math.sin(i * 0.35) * 4 + Math.cos(i * 0.11) * 3);
  const scene = canvas.closest('.scene');
  const flakes = [];
  const MAX_FLAKES = window.innerWidth < 600 ? 22 : 45;
  const ACC_TARGET = 1850;
  const maxH = (BBOX.y1 - BBOX.y0) * 0.33 * 0.5;
  let acc = ACC_TARGET * 0.5;          // 已经积雪：初始就堆了一半
  let raf = 0;
  let snowRunning = true;
  function inTex(x, y) {
    for (const P of POLYS) {
      let inside = false;
      for (let i = 0, j = P.length - 1; i < P.length; j = i++) {
        const xi = P[i][0], yi = P[i][1], xj = P[j][0], yj = P[j][1];
        if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) inside = !inside;
      }
      if (inside) return true;
    }
    return false;
  }
  gsap.killTweensOf([room, wall, furniture, winLayer]);
  // 房间(墙+窗+雪)整体从微拉近连贯拉远到 1.1 全景；窗户全程可见不消失；墙在拉远中渐显，书桌/书从下方滑入
  gsap.set(winLayer, { opacity: 1 });
  gsap.fromTo(wall, { opacity: 0 }, { opacity: 1, duration: 1.8, ease: 'power1.inOut', delay: 0.2 });
  gsap.fromTo(room, { scale: 1.15, y: 0, transformOrigin: '50% 46%' }, { scale: 1.0, y: 0, duration: 2.8, ease: 'power2.out', delay: 0.2 });
  gsap.fromTo(furniture, { y: 450 }, { y: 0, duration: 2.8, ease: 'power2.out', delay: 0.3 });
  // 重置 06 线稿层（防止重进时残留）
  const artEl = document.getElementById('phone-art-2-6');
  if (artEl) { artEl.innerHTML = ''; gsap.set(artEl, { opacity: 0 }); }
  const chatEl = document.getElementById('phone-chat-2-6');
  const chatList = document.getElementById('pc-list-2-6');
  const continueBtn = document.getElementById('pc-continue-2-6');
  const lightboxEl = document.getElementById('pc-lightbox-2-6');
  gsap.killTweensOf([phoneShake, chatEl]);
  gsap.set(phoneShake, { opacity: 1, x: 0, y: 0, scale: 1 });
  gsap.set(chatEl, { opacity: 0 });
  if (chatList) chatList.innerHTML = '';
  if (continueBtn) { continueBtn.style.display = 'none'; continueBtn.onclick = null; }
  if (lightboxEl) { lightboxEl.style.display = 'none'; lightboxEl.onclick = null; }
  document.getElementById('pc-ripple-2-6')?.classList.remove('on', 'gold');
  // 手机：随书桌滑入落定（furniture）后"停稳在桌面"，再才收到消息——振动两下→静止一会儿→又振动…循环，直到点击
  gsap.set([room, furniture], { filter: 'blur(0px)' });
  gsap.set(phone, { opacity: 1 });
  const sceneEl = document.getElementById('scene-2-6');
  sceneEl.dataset.revealed26 = '';
  const phoneRunId = String(Number(sceneEl.dataset.phoneRunId || 0) + 1);
  sceneEl.dataset.phoneRunId = phoneRunId;

  // 一次"收到消息"：振动两下
  // 屏幕上的抖动同步到真机：Android Chrome 支持 navigator.vibrate；iOS Safari 没有这个接口，自动跳过
  function haptic(pattern) {
    try { if (navigator.vibrate) navigator.vibrate(pattern); } catch (e) {}
  }
  function buzz() {
    return gsap.timeline()
      .add(function () { haptic([70, 110, 70]); })          // 与下面两下抖动同一拍
      .to(phoneShake, { x: 9, duration: 0.07, ease: 'power1.inOut' })
      .to(phoneShake, { x: 0, duration: 0.09, ease: 'power1.inOut' })
      .to(phoneShake, { x: 9, duration: 0.07, ease: 'power1.inOut' })
      .to(phoneShake, { x: 0, duration: 0.14, ease: 'power1.inOut' });
  }
  // 落定（~3.1s）后开始循环：两下振动 → 静止一会儿(1.8s) → 又振动… 直到点击
  const vibrateTL = gsap.timeline({ repeat: -1, repeatDelay: 1.8, delay: 3.3 });
  vibrateTL.add(buzz());
  // 离开这一屏（没点手机就走）→ 真机停止振动、抖动循环也停
  sceneExit[5] = function () {
    sceneEl.dataset.phoneRunId = '';
    if (phoneChatCleanup) { phoneChatCleanup(); phoneChatCleanup = null; }
    haptic(0);
    vibrateTL.kill();
    phone.onclick = null;
    phone.style.pointerEvents = 'none';
    snowRunning = false;
    cancelAnimationFrame(raf);
    sceneEl.classList.remove('active');
    sceneEl.style.visibility = 'hidden';
    sceneEl.style.opacity = '';
  };

 function reveal() {
    if (sceneEl.dataset.revealed26 === '1') return;
    sceneEl.dataset.revealed26 = '1';
    snowRunning = false;
    cancelAnimationFrame(raf);
    phone.style.pointerEvents = 'none';
    sceneEl.style.cursor = '';
    vibrateTL.kill();
    haptic(0);
    gsap.killTweensOf(phoneShake);
    gsap.set(phoneShake, { x: 0 });
    const tl = gsap.timeline();
    tl.to(phoneShake, { opacity: 0, y: 40, scale: 0.92, duration: 0.6, ease: 'power2.in' })                 // 手机完全消失后才切换《认真的雪》HiRes
      .add(() => { if (window.App && window.App.music) window.App.music.play('snowPhone', { gap: true }); })
      .to([room, furniture], { filter: 'blur(' + (window.innerWidth < 600 ? 8 : 22) + 'px)', duration: 1.0, ease: 'power2.out' }, 0.4)              // 房间化为模糊背景
      .add(() => {
        // 06 手机分镜：模糊房间背景上显现 assets/第二幕-烟火/拿手机.json 线稿（线稿模式 + 淡入）
        const art = document.getElementById('phone-art-2-6');
        if (art) {
          art.innerHTML = '';
          if (window.PHONE_DATA) {
            renderLineArtJSON('assets/第二幕-烟火/拿手机.json', art, null, null, false, window.PHONE_DATA, true);
          }
          gsap.fromTo(art, { opacity: 0 }, { opacity: 1, duration: 1.2, ease: 'power1.out' });
        }
        // 线稿淡入后，让手机屏幕里的聊天一条条弹出来
        gsap.delayedCall(0.45, startPhoneChat);
      }, 1.2);
  }

  // 手机屏幕挖空区（path[3]）→ 完全复刻「聊天记录工具」水彩聊天层
  // 屏幕在线稿坐标系中的 OBB：中心(524.8,824.7)、高1129.9、宽594.8、主轴81.47°
  function startPhoneChat() {
    if (currentScene !== 5 || sceneEl.dataset.phoneRunId !== phoneRunId || sceneEl.dataset.revealed26 !== '1') return;
    const el = document.getElementById('phone-chat-2-6');
    const list = document.getElementById('pc-list-2-6');
    if (!el || !list) return;
    let alive = true;
    let continueCleanup = null;
    let exitClick = null;
    phoneChatCleanup = () => {
      alive = false;
      if (continueCleanup) continueCleanup();
      if (exitClick) { sceneEl.removeEventListener('click', exitClick); sceneEl.removeEventListener('pointerup', exitClick); }
      gsap.killTweensOf([...list.children]);
      const box = document.getElementById('pc-lightbox-2-6');
      if (box) { box.style.display = 'none'; box.onclick = null; }
    };
    const LA_W = 1013, LA_H = 1800;
    const cx = 524.8, cy = 824.7;        // 屏幕中心（线稿坐标）
    const scrW = 594.8, scrH = 1129.9;   // 屏幕宽/高（线稿坐标）
    const rotDeg = -8.53;                // 主轴81.47° - 90°，与手机同倾角
    const svg = document.querySelector('#phone-art-2-6 svg');
    let sw = 750, sh = 1334;
    if (svg && svg.clientWidth) { sw = svg.clientWidth; sh = svg.clientHeight; }
    const scale = Math.min(sw / LA_W, sh / LA_H);
    const offX = (sw - LA_W * scale) / 2, offY = (sh - LA_H * scale) / 2;
    const inset = 18 * scale;
    const w = scrW * scale - inset * 2;
    const h = scrH * scale - inset * 2;
    el.style.left = (offX + cx * scale) + 'px';
    el.style.top = (offY + cy * scale) + 'px';
    el.style.width = Math.max(1, w) + 'px';
    el.style.height = Math.max(1, h) + 'px';
    el.style.borderRadius = (46 * scale) + 'px';
    gsap.set(el, { xPercent: -50, yPercent: -50, rotation: rotDeg });

    const avLeft = 'assets/分镜v1/素材/粉色头像.png';
    const avRight = 'assets/分镜v1/素材/蓝色头像.png';
    list.innerHTML = '';
    gsap.to(el, { opacity: 1, duration: 0.5 });

    // 解析真实雪天聊天（聊天记录/雪_聊天记录.md，水彩聊天工具可识别格式）
    const msgs = parseChatMd(SNOW_CHAT_MD).map(m => ({
      side: m.who === '江江' ? 'right' : 'left',
      time: m.time,
      text: m.content,
      img: m.content.startsWith('img:') ? m.content.slice(4) : null
    }));

    let lastKey = '';
    // 平滑跟随：把「当前正在弹出的这条」滚进可视区底部附近，让用户看清“一条一条弹出”
    const follow = (node) => {
      if (!node) return;
      const target = node.offsetTop - list.clientHeight + node.offsetHeight + 18;
      const t = Math.max(0, target);
      if (Math.abs(t - list.scrollTop) < 1) return;
      const o = { s: list.scrollTop };
      gsap.to(o, { s: t, duration: 0.45, ease: 'power2.out', overwrite: true,
        onUpdate: () => { list.scrollTop = o.s; } });
    };

    // ---- 构建消息序列（先全部入 DOM 并隐藏，再由控制器逐条播放）----
    const seq = [];
    let firstTs = true;
    let pendingTarget = false; // 上一条是「到此一游」→ 下一张图为目标大图
    msgs.forEach((m) => {
      const key = m.time.replace(/:\d{2}$/, '');
      if (key !== lastKey) {
        lastKey = key;
        const ts = document.createElement('div');
        ts.className = 'pc-time-stamp';
        ts.textContent = key;
        list.appendChild(ts);
        seq.push({ node: ts, kind: 'ts', isFirstTs: firstTs, isLastTs: false });
        firstTs = false;
      }
      const row = document.createElement('div');
      row.className = 'pc-msg-row ' + m.side;
      const av = m.side === 'left' ? avLeft : avRight;
      const isTarget = pendingTarget && !!m.img;
      pendingTarget = false;
      if (m.img) {
        row.innerHTML = '<div class="pc-avatar"><img src="' + av + '" alt="" onerror="this.style.display=\'none\'"></div>' +
          '<div class="pc-bwrap"><div class="pc-bubble ' + m.side + ' pc-img" data-side="' + m.side + '">' +
          '<img class="pc-photo" src="' + snowFileUrl(m.img) + '" alt=""></div></div>';
      } else {
        row.innerHTML = '<div class="pc-avatar"><img src="' + av + '" alt="" onerror="this.style.display=\'none\'"></div>' +
          '<div class="pc-bwrap"><div class="pc-bubble ' + m.side + '" data-side="' + m.side + '">' +
          '<svg class="pc-bsvg" preserveAspectRatio="none"></svg>' +
          '<div class="pc-btext">' + escapeHtml(renderEmoji(m.text)) + '</div></div></div>';
        if (m.text.trim() === '到此一游') pendingTarget = true;
      }
      list.appendChild(row);
      if (!m.img) {
        // 生成 SVG 水彩气泡（与聊天记录工具同算法）；底色与纹理用同一条 path，纹理严格贴合
        const bub = row.querySelector('.pc-bubble');
        const bsvg = bub.querySelector('.pc-bsvg');
        requestAnimationFrame(function() {
          const bw = bub.offsetWidth, bh = bub.offsetHeight;
          if (bw < 2 || bh < 2) return;
          const r = Math.min(12, bh * 0.28);
          const tailSize = Math.min(9, bh * 0.22);
          const tailH = tailSize * 1.35;
          const tailY = bh * 0.22;
          let d;
          if (m.side === 'left') {
            d = 'M ' + (tailSize+r) + ',0 L ' + (bw-r) + ',0 Q ' + bw + ',0 ' + bw + ',' + r + ' L ' + bw + ',' + (bh-r) + ' Q ' + bw + ',' + bh + ' ' + (bw-r) + ',' + bh + ' L ' + (tailSize+r) + ',' + bh + ' Q ' + tailSize + ',' + bh + ' ' + tailSize + ',' + (bh-r) + ' L ' + tailSize + ',' + (tailY+tailH) + ' L 0,' + (tailY+tailH/2) + ' L ' + tailSize + ',' + tailY + ' L ' + tailSize + ',' + r + ' Q ' + tailSize + ',0 ' + (tailSize+r) + ',0 Z';
          } else {
            d = 'M ' + r + ',0 L ' + (bw-tailSize-r) + ',0 Q ' + (bw-tailSize) + ',0 ' + (bw-tailSize) + ',' + r + ' L ' + (bw-tailSize) + ',' + tailY + ' L ' + bw + ',' + (tailY+tailH/2) + ' L ' + (bw-tailSize) + ',' + (tailY+tailH) + ' L ' + (bw-tailSize) + ',' + (bh-r) + ' Q ' + (bw-tailSize) + ',' + bh + ' ' + (bw-tailSize-r) + ',' + bh + ' L ' + r + ',' + bh + ' Q 0,' + bh + ' 0,' + (bh-r) + ' L 0,' + r + ' Q 0,0 ' + r + ',0 Z';
          }
          const base = m.side === 'left' ? '#fff0b8' : '#e2f0b0';
          const pat = m.side === 'left' ? 'pc-yellow' : 'pc-green';
          bsvg.setAttribute('viewBox', '0 0 ' + bw + ' ' + bh);
          bsvg.innerHTML = '<path d="' + d + '" fill="' + base + '"/><path d="' + d + '" fill="url(#' + pat + ')"/>';
        });
      }
      seq.push({ node: row, kind: 'msg', isTarget: isTarget, photoSrc: isTarget ? snowFileUrl(m.img) : null });
    });
    gsap.set(seq.map(s => s.node), { opacity: 0 });

    // 末尾的 2026 日期分隔符不暂停（直接冒出，随后把消息弹完）
    for (let i = seq.length - 1; i >= 0; i--) {
      if (seq[i].kind === 'ts') { seq[i].isLastTs = true; break; }
    }

    // ---- 逐条播放控制器：日期处暂停等滑动；到此一游图片处停留 + 点开大图 ----
    const continueHint = null;
    const lightbox = document.getElementById('pc-lightbox-2-6');
    const lbImg = lightbox ? lightbox.querySelector('.pc-lb-img') : null;
    let idx = 0;

    const animateItem = (item, done) => {
      if (item.kind === 'ts') {
        gsap.fromTo(item.node, { opacity: 0 }, { opacity: 1, duration: 0.4, onStart: () => follow(item.node), onComplete: done });
      } else {
        gsap.fromTo(item.node, { opacity: 0, y: 22, scale: 0.96 },
          { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: 'back.out(1.6)', onStart: () => follow(item.node), onComplete: done });
      }
    };
    const showContinue = () => {
      const rp = document.getElementById('pc-ripple-2-6');
      if (!rp) return;
      rp.classList.add('gold', 'on');
      rp.style.left = '375px'; rp.style.top = '690px';
      rp.style.width = rp.style.height = '170px'; rp.style.margin = '-85px 0 0 -85px';
    };
    const hideContinue = () => {
      const rp = document.getElementById('pc-ripple-2-6');
      if (rp) rp.classList.remove('gold', 'on');
    };

    // 聊天记录播完后：点这一屏的任意位置都能退出（和左右滑动一样去下一幕）
    let exitArmed = false;
    function armExit() {
      if (exitArmed || !sceneEl) return;
      exitArmed = true;
      const go = (e) => {
        if (e && e.target && e.target.closest && e.target.closest('.pc-lightbox')) return;
        sceneEl.removeEventListener('click', go);
        sceneEl.removeEventListener('pointerup', go);
        if (sceneEl.dataset.revealed26 === '1' && currentScene + 1 < sceneOrder.length) goToScene(currentScene + 1);
      };
      sceneEl.addEventListener('click', go);
      sceneEl.addEventListener('pointerup', go);
      exitClick = go;
    }

    function armContinue(cb) {
      const cleanup = () => {
        continueCleanup = null;
        list.removeEventListener('wheel', wheel);
        list.removeEventListener('touchstart', touchStart);
        document.removeEventListener('keydown', key);
        if (continueHint) continueHint.onclick = null;
        if (sceneEl) sceneEl.removeEventListener('click', sceneClick);
        if (sceneEl) sceneEl.removeEventListener('pointerup', sceneClick);
      };
      continueCleanup = cleanup;
      const wheel = (e) => { if (e.deltaY > 5) { cleanup(); cb(); } };
      const key = (e) => { if (['ArrowDown','PageDown','Enter',' '].includes(e.key)) { cleanup(); cb(); } };
      const touchStart = (e) => {
        const y0 = e.touches[0].clientY;
        const mv = (ev) => { if (ev.touches[0].clientY - y0 < -18) { cleanup(); cb(); } };
        const end = () => { list.removeEventListener('touchmove', mv); list.removeEventListener('touchend', end); };
        list.addEventListener('touchmove', mv); list.addEventListener('touchend', end);
      };
      const sceneClick = (e) => {
        if (e.target.closest('.pc-lightbox') || e.target.closest('.pc-photo')) return;
        cleanup(); cb();
      };
      if (continueHint) continueHint.onclick = (e) => { e.stopPropagation(); cleanup(); cb(); };
      list.addEventListener('wheel', wheel, { passive: true });
      list.addEventListener('touchstart', touchStart, { passive: true });
      document.addEventListener('keydown', key);
      if (sceneEl) sceneEl.addEventListener('click', sceneClick);
      if (sceneEl) sceneEl.addEventListener('pointerup', sceneClick);
    }

    function armPhoto(src) {
      const photoEl = seq[idx].node.querySelector('.pc-photo');
      const open = () => {
        hideContinue();
        const rp = document.getElementById('pc-ripple-2-6');
        if (rp) rp.classList.remove('on', 'gold');
        if (lbImg) lbImg.src = src;
        if (lightbox) lightbox.style.display = 'flex';
        lightbox.onclick = () => {
          lightbox.style.display = 'none'; lightbox.onclick = null; idx++; step();
        };
      };
      if (photoEl) {
        photoEl.style.cursor = 'pointer';
        photoEl.onclick = (e) => { e.stopPropagation(); open(); };
        // 这张图必须点开才能继续：在图片上叠一圈水波纹提示
        const rp = document.getElementById('pc-ripple-2-6');
        if (rp && sceneEl) {
          const r = photoEl.getBoundingClientRect(), s = sceneEl.getBoundingClientRect();
          if (r.width > 4 && s.width > 4) {
            rp.style.left = ((r.left + r.width / 2 - s.left) / s.width * 750) + 'px';
            rp.style.top = ((r.top + r.height / 2 - s.top) / s.height * 1334) + 'px';
            rp.style.width = rp.style.height = Math.max(120, Math.min(220, r.width * 1.5)) + 'px';
            rp.style.margin = (-parseFloat(rp.style.width) / 2) + 'px 0 0 ' + (-parseFloat(rp.style.width) / 2) + 'px';
            rp.classList.add('on');
          }
        }
      }
    }

    function afterItem() {
      if (!alive) return;
      const item = seq[idx];
      if (item.kind === 'msg' && item.isTarget) { armPhoto(item.photoSrc); return; }
      idx++; step();
    }
    function step() {
      if (!alive) return;
      if (idx >= seq.length) {
        hideContinue();
        // 手机聊天记录这一段播完 → 音乐到此为止（淡出）
        if (window.App && window.App.music) window.App.music.stop('snowPhone');
        armExit();
        return;
      }
      const item = seq[idx];
      if (item.kind === 'ts' && !item.isFirstTs && !item.isLastTs) {
        showContinue();
        armContinue(() => { hideContinue(); animateItem(item, afterItem); });
        return;
      }
      animateItem(item, afterItem);
    }
    step();
  }

  function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // 手机落定后（~3.5s）仅点击「振动的手机」才能进入下一幕（点空白/其他地方无效）
  gsap.delayedCall(3.5, () => {
    if (currentScene !== 5 || !sceneEl.classList.contains('active')) return;
    phone.style.cursor = 'pointer';
    phone.style.pointerEvents = 'auto';
    if (sceneEl.dataset.revealed26 !== '1') {
      phone.onclick = reveal;
    }
  });

  function spawn() {
    if (flakes.length >= MAX_FLAKES) return;
    let x, y, tries = 0;
    do {
      x = BBOX.x0 + Math.random() * (BBOX.x1 - BBOX.x0);
      y = BBOX.y0 + Math.random() * (BBOX.y1 - BBOX.y0) * 0.35;
      tries++;
    } while (!inTex(x, y) && tries < 20);
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
    if (!snowRunning || !scene.classList.contains('active')) { raf = 0; return; }
    if (Math.random() < 0.18) spawn();    // 极少量飘落
    const h = Math.min(acc / ACC_TARGET, 1) * maxH;
    for (let i = flakes.length - 1; i >= 0; i--) {
      const f = flakes[i];
      f.y += f.vy * SNOW_BOOST.v;
      f.x += (f.vx + Math.sin(f.ph += 0.03) * 0.3) * SNOW_BOOST.v;
      f.rot += f.vr;
      const col = Math.max(0, Math.min(cols - 1, Math.round(f.x - BBOX.x0)));
      const snowTop = BBOX.y1 - (h + baseNoise[col] * 0.6) - 2;
      if (f.y >= snowTop || f.y >= BBOX.y1) { acc += 5; flakes.splice(i, 1); }
    }
    ctx.clearRect(0, 0, W, H);
    ctx.save();
    ctx.beginPath();
    POLYS.forEach(P => {
      P.forEach((pt, i) => { i ? ctx.lineTo(pt[0], pt[1]) : ctx.moveTo(pt[0], pt[1]); });
      ctx.closePath();
    });
    ctx.clip();
    if (h > 1.5) {
      ctx.fillStyle = 'rgba(248,251,255,0.95)';
      ctx.beginPath();
      ctx.moveTo(BBOX.x0, BBOX.y1);
      for (let x = BBOX.x0; x <= BBOX.x1; x += 3) {
        const col = Math.round(x - BBOX.x0);
        ctx.lineTo(x, BBOX.y1 - (h + baseNoise[col] * 0.6));
      }
      ctx.lineTo(BBOX.x1, BBOX.y1);
      ctx.closePath();
      ctx.fill();
    }
    flakes.forEach(f => drawFlake(f.x, f.y, f.r, f.rot));
    ctx.restore();
    raf = requestAnimationFrame(loop);
  }
  loop();
};

// （旧「盘子」场景 sceneInit[6]/sceneExit[6]/sceneInit[7] 已移除 —— 2.7/2.8 已改为水彩分镜 scene-2-7 … scene-2-15）

// 键盘左右键调试
let _active=false;
document.addEventListener("keydown",e=>{if(e.key==="ArrowRight"||e.key===" "){e.preventDefault();if(currentScene<sceneOrder.length-1)goToScene(currentScene+1);}if(e.key==="ArrowLeft"){e.preventDefault();if(currentScene>0)goToScene(currentScene-1);}});
// 数字键跳转
// 启动（goToScene 才会加 active class 让场景可见；支持 ?scene=N 调试用）
goToScene(parseInt(new URLSearchParams(location.search).get('scene')) || 0);
// 占位点击进入下一幕
const psv=document.getElementById("debug");document.querySelectorAll(".placeholder-scene").forEach(el=>{el.style.cursor="pointer";el.onclick=()=>{const idx=sceneOrder.indexOf(el.id);if(idx<sceneOrder.length-1)goToScene(idx+1);};});
/* 调试坐标浮层（仅本地调坐标用）已由构建脚本移除 */


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
  var call = function(fn){ try { if (typeof fn === 'function') fn(); } catch (e) { console.warn('act2 初始化异常:', e); } };
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
