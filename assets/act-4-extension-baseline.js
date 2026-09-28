(function(window, document, gsap){

/* ================= 合并运行时沙箱（自动生成，勿手改）================= */
var __realWin = window;
var __realDoc = document;
var __actNo = 4;
var __root = __realDoc.getElementById('act-4');
var __App = __realWin.App;
function __isActive(){ return __App.isActive(__actNo); }
function __scope(sel){
  sel = String(sel);
  if (!sel || sel.indexOf('#act-4') === 0) return sel;
  return '#act-4 ' + sel;
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


window.onerror = function(msg, url, line) {
  var d = document.getElementById('debug');
  if (d) d.textContent = 'ERR: ' + msg + ' (line ' + line + ')';
};

// ============================================================
//  适配
// ============================================================
const stage = document.getElementById('stage');
const DW = 750, DH = 1334;
const SEASON_COPY_IMAGES = {};
function loadSeasonCopyImages() {
  const names=['spring','summer','autumn','winter','counter'];
  return Promise.all(names.map(name => new Promise((resolve,reject) => {
    const img=new Image();
    img.onload=()=>{SEASON_COPY_IMAGES[name]=img;resolve();};
    img.onerror=reject;
    img.src='assets/第四幕/素材/season-copy-'+name+'.png?v=20260920-1';
  })));
}
function resize() {
  const s = Math.min(window.innerWidth / DW, window.innerHeight / DH);
  stage.style.transform = `scale(${s})`;
  stage.style.left = `${(window.innerWidth - DW * s) / 2}px`;
  stage.style.top = `${(window.innerHeight - DH * s) / 2}px`;
}
window.addEventListener('resize', resize);
resize();

// ============================================================
//  Canvas
// ============================================================
const canvas = document.getElementById('main-canvas');
const ctx = canvas.getContext('2d');
let DPR = 1;
function resizeCanvas() {
  DPR = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = DW * DPR;
  canvas.height = DH * DPR;
  canvas.style.width = DW + 'px';
  canvas.style.height = DH + 'px';
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
}
resizeCanvas();

// ============================================================
//  粒子渲染引擎（与图片转粒子工具一致）
// ============================================================
const TAU = Math.PI * 2;
const CAP = 1024; // 预渲染分辨率上限

function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }

// 饱和度调整（与粒子工具一致：基于亮度的线性插值）
function saturate(r, g, b, f) {
  const l = 0.299 * r + 0.587 * g + 0.114 * b;
  return [clamp(l + (r - l) * f, 0, 255), clamp(l + (g - l) * f, 0, 255), clamp(l + (b - l) * f, 0, 255)];
}

// 四层软边点绘（与图片转粒子工具一致：最外层柔化晕圈 + 三层主体）
function drawDot(g, x, y, sz, cr, cg, cb, aMult, soften) {
  if (soften > 0) {
    const a0 = clamp((4 + 10 * soften) * aMult, 2, 16) / 255;
    g.fillStyle = `rgba(${cr|0},${cg|0},${cb|0},${a0.toFixed(4)})`;
    g.beginPath(); g.arc(x, y, sz * (1.15 + 0.6 * soften), 0, TAU); g.fill();
  }
  const a1 = clamp(12 * aMult, 6, 20) / 255;
  g.fillStyle = `rgba(${cr|0},${cg|0},${cb|0},${a1.toFixed(4)})`;
  g.beginPath(); g.arc(x, y, sz * 0.9, 0, TAU); g.fill();
  const a2 = clamp(30 * aMult, 15, 45) / 255;
  g.fillStyle = `rgba(${cr|0},${cg|0},${cb|0},${a2.toFixed(4)})`;
  g.beginPath(); g.arc(x, y, sz * 0.6, 0, TAU); g.fill();
  const a3 = clamp(200 * aMult, 150, 240) / 255;
  g.fillStyle = `rgba(${cr|0},${cg|0},${cb|0},${a3.toFixed(4)})`;
  g.beginPath(); g.arc(x, y, sz * 0.3, 0, TAU); g.fill();
}

// 渲染参数预设（来自 presets.json）
const RENDER_PARAMS = {
  earth: { dotSize: 2.65, lightSize: 0.85, soften: 1, saturation: 0.9, boundary: true },
  chenhun: { dotSize: 2.4, lightSize: 0, soften: 1, saturation: 0.9, boundary: true, preservePaperParticles: true, preserveCoordinates: true },
  tree:  { dotSize: 3,    lightSize: 0.85, soften: 1, saturation: 1.05 },
  walk:  { dotSize: 2,    lightSize: 0.85, soften: 1, saturation: 1.15 }
};

// 预渲染粒子 JSON 到离屏 canvas
function prerender(json, params) {
  const dw = json.designWidth || 1600;
  const dh = json.designHeight || Math.round(dw * (json.aspect || 1));
  const s = Math.min(1, CAP / dw);
  const cw = Math.max(1, Math.round(dw * s));
  const ch = Math.max(1, Math.round(dh * s));
  const c = document.createElement('canvas');
  c.width = cw; c.height = ch;
  const g = c.getContext('2d');
  // 全部透明背景（舞台背景已是宣纸色）

  const dotSize = params.dotSize || 1;
  const lightSizeAmt = params.lightSize || 0;
  const softenAmt = params.soften || 0;
  const sat = params.saturation || 1;
  const computeBoundary = !!params.boundary;

  // 极坐标边界图（360度，每度一个最大半径，预渲染坐标系）
  const boundary = computeBoundary ? new Float32Array(360) : null;
  const bcx = cw / 2, bcy = ch / 2;

  const particles = json.particles || [];
  // 准确最小外接圆（Welzl 迭代算法），让粒子均匀填满圆
  let centerOffX = 0, centerOffY = 0;
  if (particles.length > 3 && !params.preserveCoordinates) {
    // 第一步：取离 bounding box 中心最远的 K 个边界粒子（减少计算量）
    let minX = 1, maxX = 0, minY = 1, maxY = 0;
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      if (p.x < minX) minX = p.x;
      if (p.x > maxX) maxX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.y > maxY) maxY = p.y;
    }
    const bbCx = (minX + maxX) / 2, bbCy = (minY + maxY) / 2;
    const K = Math.min(400, particles.length);
    const dists = [];
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      const dx = p.x - bbCx, dy = p.y - bbCy;
      dists.push({ i, d: dx*dx + dy*dy });
    }
    dists.sort((a, b) => b.d - a.d);
    const pts = [];
    for (let i = 0; i < K; i++) pts.push(particles[dists[i].i]);

    // 第二步：Welzl 迭代算法求最小外接圆
    // 随机打乱
    for (let i = pts.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pts[i], pts[j]] = [pts[j], pts[i]];
    }
    const c2 = (a, b) => ({
      x: (a.x + b.x) / 2, y: (a.y + b.y) / 2,
      r2: ((a.x-b.x)**2 + (a.y-b.y)**2) / 4
    });
    const c3 = (a, b, c) => {
      const ax = a.x, ay = a.y, bx = b.x, by = b.y, cx = c.x, cy = c.y;
      const d = 2 * (ax*(by-cy) + bx*(cy-ay) + cx*(ay-by));
      if (Math.abs(d) < 1e-12) return c2(a, b);
      const ux = ((ax*ax+ay*ay)*(by-cy) + (bx*bx+by*by)*(cy-ay) + (cx*cx+cy*cy)*(ay-by)) / d;
      const uy = ((ax*ax+ay*ay)*(cx-bx) + (bx*bx+by*by)*(ax-cx) + (cx*cx+cy*cy)*(bx-ax)) / d;
      return { x: ux, y: uy, r2: (ax-ux)**2 + (ay-uy)**2 };
    };
    const inside = (c, p) => (p.x-c.x)**2 + (p.y-c.y)**2 <= c.r2 + 1e-10;
    let circle = { x: pts[0].x, y: pts[0].y, r2: 0 };
    for (let i = 1; i < pts.length; i++) {
      if (!inside(circle, pts[i])) {
        circle = { x: pts[i].x, y: pts[i].y, r2: 0 };
        for (let j = 0; j < i; j++) {
          if (!inside(circle, pts[j])) {
            circle = c2(pts[i], pts[j]);
            for (let k = 0; k < j; k++) {
              if (!inside(circle, pts[k])) {
                circle = c3(pts[i], pts[j], pts[k]);
              }
            }
          }
        }
      }
    }
    // 平移偏移：让最小外接圆圆心对齐画布中心 0.5
    centerOffX = 0.5 - circle.x;
    centerOffY = 0.5 - circle.y;
  }
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    // 过滤极接近纸色且低透明度的粒子，减少边缘方块感
    if (!params.preservePaperParticles && p.a < 0.55) {
      const dr = p.r - 253, dg = p.g - 251, db = p.b - 247;
      if (dr*dr + dg*dg + db*db < 1200) continue;
    }
    // lightSize：亮处点小、暗处点大
    let ps = p.s;
    if (lightSizeAmt > 0) {
      const l = (0.299 * p.r + 0.587 * p.g + 0.114 * p.b) / 255;
      ps *= 1 + (0.4 - l * 0.75) * lightSizeAmt;
    }
    // 饱和度（contrast 已烘焙到 JSON 颜色中，不需再应用）
    const col = saturate(p.r, p.g, p.b, sat);
    const sz = ps * dw * s * dotSize;
    // 平移后坐标（让最小外接圆圆心对齐画布中心）
    const px = (p.x + centerOffX) * cw, py = (p.y + centerOffY) * ch;
    drawDot(g, px, py, sz, col[0], col[1], col[2], p.a, softenAmt);

    // 边界检测：所有粒子的最外边缘（含晕染半径），预渲染坐标系
    if (computeBoundary) {
      const dx = px - bcx, dy = py - bcy;
      const dist = Math.sqrt(dx*dx + dy*dy) + sz * 1.4;
      let ang = Math.atan2(dy, dx) * 180 / Math.PI;
      if (ang < 0) ang += 360;
      const idx = Math.round(ang) % 360;
      if (dist > boundary[idx]) boundary[idx] = dist;
    }
  }
  // 计算外接圆半径（所有角度中的最大边界）
  let maxBoundary = 0;
  let rawBoundary = null;
  let fitRadius = maxBoundary, fitCx = bcx, fitCy = bcy;
  let edgeProfile = null;
  if (boundary) {
    for (let i = 0; i < 360; i++) {
      if (boundary[i] > maxBoundary) maxBoundary = boundary[i];
    }
    // 保存原始锯齿边界（调试用）
    rawBoundary = new Float32Array(boundary);
    // 平滑边界（环形移动平均，窗口±10度，消除锯齿和凹陷）
    const smoothed = new Float32Array(360);
    const win = 10;
    for (let i = 0; i < 360; i++) {
      let sum = 0;
      for (let j = -win; j <= win; j++) {
        const idx = ((i + j) % 360 + 360) % 360;
        sum += boundary[idx];
      }
      smoothed[i] = sum / (win * 2 + 1);
    }
    boundary.set(smoothed);
    // 精确测量地球轮廓半径、忽略坑洼：对平滑边界点做加权最小二乘圆拟合
    const fitPts = [];
    for (let i = 0; i < 360; i++) {
      if (boundary[i] > 0) {
        const ang = i * Math.PI / 180;
        fitPts.push([bcx + Math.cos(ang) * boundary[i], bcy + Math.sin(ang) * boundary[i]]);
      }
    }
    fitRadius = maxBoundary; fitCx = bcx; fitCy = bcy;
    if (fitPts.length >= 3) {
      let cx = bcx, cy = bcy;
      const rs0 = fitPts.map(p => Math.hypot(p[0]-cx, p[1]-cy)).sort((a,b)=>a-b);
      let R = rs0[Math.floor(rs0.length/2)];
      for (let iter = 0; iter < 8; iter++) {
        let sw = 0, sxc = 0, syc = 0, sr = 0;
        for (const p of fitPts) {
          const d = Math.hypot(p[0]-cx, p[1]-cy);
          const resid = (d - R) / R;
          const w = 1 / (1 + resid*resid*8);
          sxc += w * p[0]; syc += w * p[1]; sr += w * d; sw += w;
        }
        cx = sxc / sw; cy = syc / sw; R = sr / sw;
      }
      fitCx = cx; fitCy = cy; fitRadius = R;
    }

    // ---- 从"拟合圆心"重采一遍真实轮廓 ----
    // 地球不是正圆：实测顶部比拟合圆小约 20px、左侧又大约 15px。用一条正圆画年轮，
    // 在地球略扁的方向就会浮出去（小女孩脚下最明显）。这里按每 2° 记录"看起来实心"的
    // 轮廓半径，年轮/年份/三餐逐角贴着它走。
    const EN = 180;
    edgeProfile = new Float32Array(EN);
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      if (!params.preservePaperParticles && p.a < 0.55) {
        const dr = p.r - 253, dg = p.g - 251, db = p.b - 247;
        if (dr * dr + dg * dg + db * db < 1200) continue;
      }
      let ps = p.s;
      if (lightSizeAmt > 0) {
        const l = (0.299 * p.r + 0.587 * p.g + 0.114 * p.b) / 255;
        ps *= 1 + (0.4 - l * 0.75) * lightSizeAmt;
      }
      const sz2 = ps * dw * s * dotSize;
      const px2 = (p.x + centerOffX) * cw, py2 = (p.y + centerOffY) * ch;
      const dx2 = px2 - fitCx, dy2 = py2 - fitCy;
      const rr2 = Math.sqrt(dx2 * dx2 + dy2 * dy2) + sz2 * 0.5; // 半个点半径 ≈ 视觉实心边缘
      let aa2 = Math.atan2(dy2, dx2);
      if (aa2 < 0) aa2 += TAU;
      const bi = Math.min(EN - 1, Math.floor(aa2 / TAU * EN));
      if (rr2 > edgeProfile[bi]) edgeProfile[bi] = rr2;
    }
    // 空 bin 用最近的有值 bin 补上（个别角度粒子稀疏）
    for (let i = 0; i < EN; i++) {
      if (edgeProfile[i] > 0) continue;
      let v = 0;
      for (let j = 1; j < EN && !v; j++) {
        const k1 = ((i - j) % EN + EN) % EN, k2 = (i + j) % EN;
        if (edgeProfile[k1] > 0) v = edgeProfile[k1];
        else if (edgeProfile[k2] > 0) v = edgeProfile[k2];
      }
      edgeProfile[i] = v || maxBoundary;
    }
    // 环形平滑（±3 bin = ±6°）：保留地球真实形状，但不跟着粒子抖动
    const esm = new Float32Array(EN);
    for (let i = 0; i < EN; i++) {
      let sum = 0;
      for (let j = -3; j <= 3; j++) sum += edgeProfile[((i + j) % EN + EN) % EN];
      esm[i] = sum / 7;
    }
    edgeProfile.set(esm);
  }
  return { canvas: c, dw, dh, cw, ch, boundary, rawBoundary, maxBoundary, fitRadius, fitCx, fitCy, edgeProfile, centerOff: { x: centerOffX, y: centerOffY } };
}

// 分镜工具的 size 计算公式：base = min(480/nw, 540/nh, 1), w = nw * base * size
function calcSize(prer, size) {
  const base = Math.min(480 / prer.dw, 540 / prer.dh, 1);
  return { w: prer.dw * base * size, h: prer.dh * base * size };
}

// 根据地球平滑极坐标边界计算小女孩y，使其脚始终踩在地球边缘上
// 原图最大连通颜料区域的闭合凸包（地球/晨昏地球.png，1657×1658）；排除游离墨点。
// 保留非圆外形；跨接纸白缺口，绝不把粒子空洞当作地面。坐标为原图归一化坐标。
const CHENHUN_SILHOUETTE = [[0.083283,0.516285],[0.08449,0.504222],[0.091732,0.454765],[0.092939,0.44994],[0.101388,0.418577],[0.105009,0.405308],[0.111044,0.387214],[0.112251,0.383595],[0.117079,0.372738],[0.149668,0.316043],[0.162945,0.295537],[0.165359,0.291918],[0.175015,0.282268],[0.179843,0.277443],[0.211225,0.248492],[0.219674,0.241255],[0.232951,0.231604],[0.2414,0.225573],[0.252263,0.218335],[0.299336,0.189385],[0.360893,0.164053],[0.366928,0.161641],[0.372963,0.159228],[0.376584,0.158022],[0.385033,0.156815],[0.401931,0.154403],[0.439348,0.15199],[0.521424,0.147165],[0.532287,0.147165],[0.541943,0.148372],[0.563669,0.15199],[0.582981,0.155609],[0.586602,0.156815],[0.672299,0.191797],[0.71213,0.208685],[0.73627,0.22316],[0.794206,0.278649],[0.806276,0.295537],[0.82076,0.323281],[0.850935,0.384801],[0.853349,0.390832],[0.863005,0.414958],[0.879903,0.482509],[0.882317,0.499397],[0.882317,0.541616],[0.879903,0.564536],[0.876282,0.587455],[0.872661,0.609168],[0.850935,0.677925],[0.847314,0.686369],[0.842486,0.697226],[0.836451,0.710495],[0.831623,0.718938],[0.817139,0.74427],[0.80869,0.756333],[0.786964,0.785283],[0.778515,0.794934],[0.777308,0.79614],[0.773687,0.799759],[0.767652,0.80579],[0.766445,0.806996],[0.739891,0.832328],[0.727821,0.841978],[0.707302,0.856454],[0.697646,0.861279],[0.685576,0.86731],[0.657815,0.879373],[0.628847,0.890229],[0.608328,0.897467],[0.585395,0.904704],[0.563669,0.910736],[0.512975,0.922799],[0.509354,0.922799],[0.436934,0.917973],[0.414001,0.914355],[0.406759,0.913148],[0.399517,0.911942],[0.393482,0.910736],[0.387447,0.90953],[0.382619,0.908323],[0.342788,0.897467],[0.331925,0.893848],[0.328304,0.892642],[0.312613,0.885404],[0.246228,0.850422],[0.211225,0.820265],[0.197948,0.808203],[0.178636,0.785283],[0.148461,0.74427],[0.125528,0.705669],[0.1207,0.696019],[0.119493,0.693607],[0.109837,0.669481],[0.091732,0.616405],[0.090525,0.61158],[0.088111,0.600724],[0.086904,0.593486],[0.085697,0.586248],[0.083283,0.539204]];
function installEarthSurface(pre) {
  const poly=CHENHUN_SILHOUETTE.map(p=>[(p[0]+pre.centerOff.x)*pre.cw,(p[1]+pre.centerOff.y)*pre.ch]);
  let area=0,cx=0,cy=0;
  for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length],k=a[0]*b[1]-b[0]*a[1];area+=k;cx+=(a[0]+b[0])*k;cy+=(a[1]+b[1])*k;}
  cx/=3*area;cy/=3*area;
  const raw=[];
  for(let i=0;i<360;i++){
    const ang=i*TAU/360,ux=Math.cos(ang),uy=Math.sin(ang);let r=Infinity;
    for(let j=0;j<poly.length;j++){
      const a=poly[j],b=poly[(j+1)%poly.length],vx=b[0]-a[0],vy=b[1]-a[1],dx=a[0]-cx,dy=a[1]-cy;
      const den=ux*vy-uy*vx;if(Math.abs(den)<1e-8)continue;
      const t=(dx*vy-dy*vx)/den,u=(dx*uy-dy*ux)/den;
      if(t>0&&u>=0&&u<=1)r=Math.min(r,t);
    }
    raw.push(r);
  }
  // 连续的低频轮廓；既不强套正圆，也不随稀疏粒子逐点上下抖动。
  pre.edgeProfile=Float32Array.from(raw,(_,i)=>{
    let sum=0,weight=0;for(let k=-10;k<=10;k++){const w=11-Math.abs(k);sum+=raw[(i+k+360)%360]*w;weight+=w;}return sum/weight;
  });
  pre.fitCx=cx;pre.fitCy=cy;pre.fitRadius=pre.edgeProfile.reduce((a,b)=>a+b,0)/360;
  pre.surfaceFromSource=true;
}
function calcGirlYOnBoundary(earthPrer, earthSize, earthX, earthY, rot, girlX) {
  if (!earthPrer) return null;
  const center=earthScreenCenter(earthPrer,earthSize,earthX,earthY,rot);
  const rotation=rot*Math.PI/180;
  const walkScale=earthPrer.surfaceFromSource?1:((phase==='siji'||phase==='shu')?walkRadiusScale:1);
  let top=Infinity,last=null;
  // 求竖直脚线与同一条旋转后轮廓的交点，不能把顶部半径当成任意横坐标的圆半径。
  for(let i=0;i<=360;i++){
    const a=i*TAU/360,r=globeEdgePx(earthPrer,earthSize,a)*walkScale;
    const p={x:center.x+Math.cos(a+rotation)*r,y:center.y+Math.sin(a+rotation)*r};
    if(last&&((last.x<=girlX&&p.x>=girlX)||(p.x<=girlX&&last.x>=girlX))&&Math.abs(p.x-last.x)>1e-6){
      const t=(girlX-last.x)/(p.x-last.x);top=Math.min(top,last.y+(p.y-last.y)*t);
    }
    last=p;
  }
  return Number.isFinite(top)?top-walkFootOffset()-debugFootOffset:null;
}

let debugFootOffset = 0; // 在实际精灵脚底之上的微调量。
function walkFootOffset() {
  const frame=getWalkFrame();
  if(!frame)return 115;
  if(frame.footY==null){
    const pixels=frame.canvas.getContext('2d').getImageData(0,0,frame.cw,frame.ch).data;
    frame.footY=frame.ch/2;
    for(let y=frame.ch-1;y>=0;y--){
      let support=0;for(let x=0;x<frame.cw;x++)if(pixels[(y*frame.cw+x)*4+3]>=80)support++;
      if(support>=4){frame.footY=y;break;}
    }
  }
  return (frame.footY/frame.ch-0.5)*calcSize(frame,LAYOUT.chenhun.girl.size).h;
}

// 绘制预渲染素材到主 canvas（支持位置、大小、旋转、透明度、底部裁剪）
function drawPrer(prer, x, y, size, rot, opacity, clipFromBottom) {
  const { w, h } = calcSize(prer, size);
  ctx.save();
  ctx.translate(x, y);
  if (rot) ctx.rotate(rot * Math.PI / 180);
  ctx.globalAlpha = opacity == null ? 1 : opacity;
  if (clipFromBottom != null && clipFromBottom > 0) {
    const visibleH = h * (1 - clipFromBottom);
    ctx.beginPath();
    ctx.rect(-w/2, h/2 - visibleH, w, visibleH);
    ctx.clip();
  }
  ctx.drawImage(prer.canvas, -w/2, -h/2, w, h);
  ctx.restore();
}

// 四季背景白：取自 siji 场景实际渲染背景取样 RGB≈(250,248,243)，小女孩实心轮廓用它垫底
const FOUR_SEASON_PAPER = '#FAF8F3';
// 小女孩"实心化"：先以不透明实心轮廓（四季背景白）盖住后面的树/弹幕，再叠正常粒子细节。
// 注意：不能用粒子颜色平均（黑发+浅裙平均≈灰），否则女孩会发灰。
function buildGirlSolid(json, prer, params) {
  const cw = prer.cw, ch = prer.ch;
  const c = document.createElement('canvas');
  c.width = cw; c.height = ch;
  const g = c.getContext('2d');
  const co = prer.centerOff || { x: 0, y: 0 };
  const dw = json.designWidth || 1600;
  const s = Math.min(1, CAP / dw);
  const dotSize = params.dotSize || 1;
  g.fillStyle = FOUR_SEASON_PAPER;
  const pad = 1.5; // 略放大以闭合粒子缝隙，保证不透出后面的树/弹幕
  for (const p of json.particles) {
    if (p.a < 0.06) continue;
    const sz = p.s * dw * s * dotSize * pad;
    const px = (p.x + co.x) * cw, py = (p.y + co.y) * ch;
    g.beginPath(); g.arc(px, py, Math.max(0.6, sz), 0, Math.PI * 2); g.fill();
  }
  return c;
}
function drawGirlSolid(prer, x, y, size, rot, opacity, backingA) {
  const { w, h } = calcSize(prer, size);
  ctx.save();
  ctx.translate(x, y);
  if (rot) ctx.rotate(rot * Math.PI / 180);
  const baseA = opacity == null ? 1 : opacity;
  // 白底实心轮廓：用独立 alpha 渐变淡入，避免小女孩"突然变亮"
  if (prer.solid && backingA > 0.002) {
    ctx.globalAlpha = baseA * backingA;
    ctx.drawImage(prer.solid, -w/2, -h/2, w, h);
  }
  ctx.globalAlpha = baseA;
  ctx.drawImage(prer.canvas, -w/2, -h/2, w, h);
  ctx.restore();
}

// ============================================================
//  素材加载（用 <script> 标签加载 .js，支持 file:// 直接打开）
// ============================================================
const ASSETS = {
  chenhun:    { file: 'assets/第四幕/素材/晨昏地球.json?v=20260920-4', fallback: 'assets/第四幕/素材/晨昏地球.js?v=20260920-4', var: 'P_CHENHUN' },
  siji:       { file: 'assets/第四幕/素材/四季地球.js',   var: 'P_SIJI' },
  treeSpring: { file: 'assets/第四幕/素材/春-樱花树.js',  var: 'P_TREE_SPRING' },
  treeSummer: { file: 'assets/第四幕/素材/夏-绿树.js',    var: 'P_TREE_SUMMER' },
  treeAutumn: { file: 'assets/第四幕/素材/秋-枫树.js',    var: 'P_TREE_AUTUMN' },
  treeWinter: { file: 'assets/第四幕/素材/冬-雪树.js',    var: 'P_TREE_WINTER' },
  walk1:      { file: 'assets/第四幕/素材/走路01.js',     var: 'P_WALK1' },
  walk2:      { file: 'assets/第四幕/素材/走路02.js',     var: 'P_WALK2' },
  walk3:      { file: 'assets/第四幕/素材/走路03.js',     var: 'P_WALK3' },
  walk4:      { file: 'assets/第四幕/素材/走路04.js',     var: 'P_WALK4' },
  walk5:      { file: 'assets/第四幕/素材/走路05.js',     var: 'P_WALK5' },
  walk6:      { file: 'assets/第四幕/素材/走路06.js',     var: 'P_WALK6' },
  walk7:      { file: 'assets/第四幕/素材/走路07.js',     var: 'P_WALK7' }
};
const prerendered = {};

function loadScript(url) {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = url;
    s.onload = () => { s.remove(); resolve(); };
    s.onerror = () => { s.remove(); reject(new Error('脚本加载失败: ' + url)); };
    document.head.appendChild(s);
  });
}

function decodeParticleMask(encoded) {
  if (!encoded || typeof atob !== 'function') return null;
  try {
    const bin=atob(encoded), out=new Uint8Array(bin.length);
    for(let i=0;i<bin.length;i++) out[i]=bin.charCodeAt(i);
    return out;
  } catch(e) { return null; }
}
function filterChenhunEraseMask(json) {
  const mask=decodeParticleMask(json.eraseMask);
  if(!mask || !mask.length) return json;
  const mw=240,mh=Math.max(1,Math.floor(mask.length/mw));
  const keep=p=>{
    const x=Math.min(mw-1,Math.max(0,Math.floor(p.x*mw)));
    const y=Math.min(mh-1,Math.max(0,Math.floor(p.y*mh)));
    return !mask[y*mw+x];
  };
  return Object.assign({},json,{particles:(json.particles||[]).filter(keep),manualParticles:(json.manualParticles||[]).filter(keep)});
}

const ASSET_PARAMS = {
  chenhun: RENDER_PARAMS.chenhun,
  siji: RENDER_PARAMS.earth,
  treeSpring: RENDER_PARAMS.tree,
  treeSummer: RENDER_PARAMS.tree,
  treeAutumn: RENDER_PARAMS.tree,
  treeWinter: RENDER_PARAMS.tree,
  walk1: RENDER_PARAMS.walk,
  walk2: RENDER_PARAMS.walk,
  walk3: RENDER_PARAMS.walk,
  walk4: RENDER_PARAMS.walk,
  walk5: RENDER_PARAMS.walk,
  walk6: RENDER_PARAMS.walk,
  walk7: RENDER_PARAMS.walk
};

async function loadAssets() {
  const keys = Object.keys(ASSETS);
  const fill = document.getElementById('load-fill');
  const pct = document.getElementById('load-pct');
  const errEl = document.getElementById('load-err');
  let done = 0;

  for (const key of keys) {
    try {
      let json;
      if (ASSETS[key].file.endsWith('.json?v=20260920-4')) {
        try {
          const response = await fetch(ASSETS[key].file, { cache: 'no-store' });
          if (!response.ok) throw new Error('JSON HTTP ' + response.status);
          json = await response.json();
          window.__CHENHUN_SOURCE = 'json';
        } catch (jsonError) {
          try {
            json = await new Promise((resolve, reject) => {
              const xhr = new XMLHttpRequest(); xhr.open('GET', ASSETS[key].file, true);
              xhr.onload = () => { if (xhr.status === 0 || (xhr.status >= 200 && xhr.status < 300)) { try { resolve(JSON.parse(xhr.responseText)); } catch(e) { reject(e); } } else reject(new Error('JSON XHR ' + xhr.status)); };
              xhr.onerror = reject; xhr.send();
            });
            window.__CHENHUN_SOURCE = 'json-xhr';
          } catch (xhrError) {
            await loadScript(ASSETS[key].fallback);
            json = window[ASSETS[key].var];
            window.__CHENHUN_SOURCE = 'legacy-js-fallback';
          }
        }
      } else {
        await loadScript(ASSETS[key].file);
        json = window[ASSETS[key].var];
      }
      if (!json) throw new Error('数据未找到: ' + ASSETS[key].var);
      prerendered[key] = prerender(json, ASSET_PARAMS[key]);
      if (key === 'chenhun') installEarthSurface(prerendered[key]);
      if (key.indexOf('walk') === 0) {
        prerendered[key].solid = buildGirlSolid(json, prerendered[key], ASSET_PARAMS[key]);
      }
      delete window[ASSETS[key].var];
    } catch (e) {
      errEl.style.display = 'block';
      errEl.textContent = '加载失败：' + e.message + '。请确认 assets/第四幕/素材/ 目录下的 .js 文件存在。';
      throw e;
    }
    done++;
    const p = Math.round(done / keys.length * 100);
    fill.style.width = p + '%';
    pct.textContent = p + '%';
    await new Promise(r => setTimeout(r, 0));
  }
}

// ============================================================
//  分镜布局数据（来自 scenes.json）
// ============================================================
const LAYOUT = {
  chenhun: {
    earth: { x: 379, y: 661, size: 1.5 },
    girl: { x: 389, y: 290, size: 0.5 }
  },
  siji: {
    earth: { x: 369, y: 682, size: 1.45, rotation: 45 },
    girl: { x: 389, y: 290, size: 0.5 }
  },
  shu: {
    earth: { x: 369, y: 682, size: 1.45, rotation: 45 },
    girl: { x: 310, y: 308, size: 0.5 },
    tree: { x: 371, y: 145, size: 1.37, opacity: 0.4 }
  }
};

const SEASONS = ['spring', 'summer', 'autumn', 'winter'];
const SEASON_TREES = { spring: 'treeSpring', summer: 'treeSummer', autumn: 'treeAutumn', winter: 'treeWinter' };

// ============================================================
//  场景状态
// ============================================================
let phase = 'loading'; // loading | chenhun | siji | shu
// The fourth act has several megabytes of inline drawing data plus decoded
// canvases. Keep the previous act on screen until this promise-like gate is
// ready, so entering the act never exposes a blank/loading canvas.
let act4Ready = false;
let act4ReadyWaiters = [];
window.__act4Ready = false;
window.__act4WhenReady = function (cb) {
  if (act4Ready) { cb(); return; }
  act4ReadyWaiters.push(cb);
};
function markAct4Ready() {
  if (act4Ready) return;
  act4Ready = true;
  window.__act4Ready = true;
  const waiters = act4ReadyWaiters.splice(0);
  waiters.forEach(function (cb) { try { cb(); } catch (e) {} });
}
let subState = ''; // 子状态
let earthRotation = 0; // 地球旋转角度
let earthRotSpeed = 0; // 旋转速度
let inTransition = false;
let transitionWhite = 0; // 转场白色遮罩透明度（0=全透明，1=全白）
let transitionReveal = 0; // 转场径向渐显进度（0=只中心，1=全部）
let transFrom = 'siji';   // 转场来源场景（底色地球）
let transTo = 'chenhun';  // 转场目标场景（径向渐显切入的新地球）
let transSourcePos = null;  // 转场期间来源地球的实时绘制位置/尺寸（漂移到目标位置）
let transSourceAlpha = 1;   // 转场期间来源地球的透明度（阶段2 从 1 渐隐到 0）
let transTl = null;         // 转场时间线（快进时需 kill）
const transCanvas = document.createElement('canvas'); // 转场离屏canvas（径向渐显用）
const transCtx = transCanvas.getContext('2d');
const whiteBallCanvas = document.createElement('canvas'); // 阶段2 的白球剪影（只生成一次）
const whiteBallCtx = whiteBallCanvas.getContext('2d');
let whiteBallReady = false; // 白球是否已生成
// 平滑插值（smoothstep），转场各通道共用，保证首尾导数为 0，不会突变
function smoothstep(a, b, x) {
  if (b <= a) return x < a ? 0 : 1;
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}
let walkRadiusScale = 0.93; // 小女孩行走半径缩放（四季场景，[/]微调）
// 每个季节独立的树偏移（w/a/s/d调节当前季节）
const seasonTreeOffsets = {
  spring: {x: 0, y: 28},
  summer: {x: 16, y: 43},
  autumn: {x: 15, y: 46},
  winter: {x: 44, y: 39}
};
function getTreeOffset() { return seasonTreeOffsets[SEASONS[currentSeason]] || {x:0, y:0}; }
let girlWalking = false; // 小女孩是否在走路
let walkFrame = 0; // 当前走路帧索引 0-6 (0=走路01站定, 1-6=走路02-07)
let walkAcc = 0; // 走路帧累加器
const WALK_FPS = 9; // 用户要求放慢
const WALK_FRAME_MS = 1000 / WALK_FPS;
let brightness = 1; // 画面亮度（阴阳面联动）
let targetBrightness = 1;
let currentSeason = 0; // 0=春 1=夏 2=秋 3=冬
let treeClip = 1; // 树的裁剪：1=完全隐藏, 0=完全显示
let treeOpacity = 0; // 树的透明度
let girlBacking = 0; // 小女孩白底实心轮廓的渐变进度（0=无白底，1=完全白底）
let sceneOpacity = 1; // 当前场景整体透明度（过渡用）
let girlX = 389, girlY = 290; // 小女孩当前绘制位置（用于平滑过渡）
let nextPhase = null; // 过渡目标
let hintEl = document.getElementById('hint');
let canTap = false; // 是否可以点击推进

// 双圈行走：第一圈点击驱动（出树），第二圈自动（出交界箭头，循环）
let firstLapDone = false;
let lapTime = 0;
const arrowAlpha = [0, 0, 0, 0];   // 四枚交界箭头当前透明度
const arrowTarget = [0, 0, 0, 0];  // 目标透明度（用于渐显/渐隐）
let lastFiredSeason = -1;
// 交界箭头定义（按"到达的季节"索引：0春→春夏绿 / 1夏→夏秋橙 / 2秋→秋冬蓝 / 3冬→冬春粉）
// hour 为地球上的经度（0/6/12/18 四个交界点，随地球旋转浮动）；颜色=下一季；文案=指定句
const SEASON_TRANSITIONS = [
  { hour: 2.14,  color: 'rgb(240,170,90)',  label: '2022-08-19', time: '最低温度14° 秋天真的来了' },
  { hour: 8.07,  color: 'rgb(130,175,225)', label: '2020-11-20', time: '啊，这周下雪了' },
  { hour: 14.21, color: 'rgb(255,170,195)', label: '2024-03-13', time: '春天到了' },
  { hour: 20.21, color: 'rgb(120,200,135)', label: '2022-04-10', time: '一秒入夏' }
];

function showHint(text) {
  // 场景仍保留点击推进能力，但不再显示“点击……”提示语。
  hintEl.textContent = '';
  hintEl.classList.remove('show');
  const ripple = document.getElementById('tap-ripple');
  if (ripple) ripple.classList.add('show');
}
function hideHint() { hintEl.classList.remove('show'); const ripple=document.getElementById('tap-ripple'); if(ripple) ripple.classList.remove('show'); }

// ============================================================
//  走路帧获取
// ============================================================
function getWalkFrame() {
  if (!girlWalking) return prerendered.walk1;
  const frames = [prerendered.walk2, prerendered.walk3, prerendered.walk4,
                  prerendered.walk5, prerendered.walk6, prerendered.walk7];
  return frames[walkFrame % 6];
}

// ============================================================
//  场景：01 晨昏
// ============================================================
let chenhunStartTimer = null; // 晨昏入场后延迟启动走路的定时器（快进时需清除）
function enterChenhun(instant) {
  phase = 'chenhun';
  subState = 'enter';
  earthRotation = 0;
  earthRotSpeed = 0;
  girlWalking = false;
  walkFrame = 0;
  brightness = 1;
  targetBrightness = 1;
  sceneOpacity = 0;
  girlX = LAYOUT.chenhun.girl.x;
  girlY = LAYOUT.chenhun.girl.y;
  canTap = false;

  // 入场渐显
  gsap.to({ o: 0 }, {
    o: 1, duration: instant ? 0.45 : 1, ease: 'power2.out',
    onUpdate: function() { sceneOpacity = this.targets()[0].o; },
    onComplete: () => {
      subState = 'idle';
      const startWalk = () => {
        if (phase !== 'chenhun') return; // 已快进离开晨昏则作废
        girlWalking = true;
        earthRotSpeed = -0.25; // 逆时针，适中速度
        subState = 'walking';
        canTap = true;
        showHint('点击进入年轮');
      };
      if (instant) {
        startWalk(); // 调试快进：跳过入场静止等待
      } else {
        // 1.5秒后小女孩开始走路，地球开始旋转
        chenhunStartTimer = setTimeout(startWalk, 1500);
      }
    }
  });
}

function updateChenhun(dt) {
  // 地球旋转（canvas 中负角度=顺时针）
  if (earthRotSpeed !== 0) {
    earthRotation += earthRotSpeed * dt;
  }
  // 阴阳面亮度：阳面(蓝绿)初始在左，顺时针旋转时转到下方
  const rad = (earthRotation - 90) * Math.PI / 180;
  targetBrightness = 0.5 + 0.5 * Math.cos(rad);
  targetBrightness = clamp(targetBrightness, 0.2, 1.0);
  brightness += (targetBrightness - brightness) * 0.06;

  // 小女孩始终踩在地球边界上（外接圆圆心固定，用 circleOffset）
  const e = LAYOUT.chenhun.earth;
  if (!inTransition) {
    const gy = calcGirlYOnBoundary(prerendered.chenhun, e.size, e.x, e.y, earthRotation, girlX);
    if (gy != null) girlY = gy;
  }
}

// 昼夜分界线背景遮罩：夜半球那侧压暗、昼半球那侧透亮，跟随地球真实昼夜。
// 用「相位球体」模型——满昼全亮、满夜全暗、半相昼夜各半；终止线随自转在昼/夜 limb 间移动，
// 与地球贴图真实的明暗分界对齐（晨昏地球白天中心在 rot=0 时≈178°，随自转移动）。
let nightMaskCanvas=null;
function drawDayNightMask(cx,cy,R,rot,alpha=1,excludeDisk=false) {
  const angle=(rot-90)*Math.PI/180,bright=clamp(0.5+0.5*Math.cos(angle),0,1);
  if(bright>=0.999||alpha<=0)return;
  if(!nightMaskCanvas){nightMaskCanvas=document.createElement('canvas');nightMaskCanvas.width=DW;nightMaskCanvas.height=DH;}
  const g=nightMaskCanvas.getContext('2d'),a=0.30*(1-bright)*alpha,sun=(178+rot)*Math.PI/180;
  g.clearRect(0,0,DW,DH);g.save();g.translate(cx,cy);g.rotate(sun);
  const diag=Math.max(DW,DH)*1.5,terminator=-R*Math.cos(angle);
  const wash=g.createLinearGradient(terminator,0,terminator+diag,0);
  wash.addColorStop(0,'rgba(42,52,92,'+a+')');wash.addColorStop(1,'rgba(42,52,92,'+(a*Math.max(0,-Math.cos(angle)))+')');
  g.fillStyle=wash;g.fillRect(-diag,-diag,2*diag,2*diag);g.restore();
  if(excludeDisk){
    // 保护已经绘制的水彩颜料，白色留空自然接背景；不再挖硬边圆孔。
    const pre=prerendered.chenhun,base=LAYOUT.chenhun.earth.size;
    const size=base*R/earthRadiusPx(pre,base),offset=earthScreenCenter(pre,size,0,0,rot),dims=calcSize(pre,size);
    g.save();g.globalCompositeOperation='destination-out';g.translate(cx-offset.x,cy-offset.y);g.rotate(rot*Math.PI/180);
    g.drawImage(pre.canvas,-dims.w/2,-dims.h/2,dims.w,dims.h);g.restore();
  }
  ctx.save();ctx.setTransform(DPR,0,0,DPR,0,0);ctx.drawImage(nightMaskCanvas,0,0);ctx.restore();
}

function drawChenhun() {
  ctx.save();
  ctx.globalAlpha = sceneOpacity;

  // 晨昏地球（粒子已自动居中）
  const e = LAYOUT.chenhun.earth;
  drawPrer(prerendered.chenhun, e.x, e.y, e.size, earthRotation, 1);

  // 小女孩
  drawPrer(getWalkFrame(), girlX, girlY, LAYOUT.chenhun.girl.size, 0, 1);

  ctx.restore();

  // 昼夜分界线背景遮罩（与年轮场景一致）：夜半球压暗、昼半球透亮，跟随地球真实昼夜
  {
    const R = earthRadiusPx(prerendered.chenhun, e.size);
    // 必须用"地球真实视觉圆心"：预渲染画布的最小二乘拟合圆心相对画布中心是偏的（实测偏约 13px），
    // 直接拿布局锚点 e.x/e.y 当圆心，挖洞圆就会和地球错开，露出一圈没被压暗的白边。
    const ec = earthScreenCenter(prerendered.chenhun, e.size, e.x, e.y, earthRotation);
    drawDayNightMask(ec.x, ec.y, R, earthRotation, 1, true);
  }
}

// ============================================================
//  场景：02 四季
// ============================================================
function enterSiji() {
  phase = 'siji';
  subState = 'enter';
  currentSeason = 0; // 春
  firstLapDone = false; // 每次进入四季都从第一圈（点击）重新开始
  earthRotation = LAYOUT.siji.earth.rotation; // 45度，春天在脚下
  earthRotSpeed = 0;
  girlWalking = false;
  sceneOpacity = 0;
  treeClip = 1;
  treeOpacity = 0;
  girlX = LAYOUT.siji.girl.x;
  girlY = LAYOUT.siji.girl.y;
  canTap = false;

  gsap.to({ o: 0 }, {
    o: 1, duration: 0.8, ease: 'power2.out',
    onUpdate: function() { sceneOpacity = this.targets()[0].o; },
    onComplete: () => {
      subState = 'seasonIdle';
      canTap = true;
      showHint('点击看' + seasonName(currentSeason) + '的树');
    }
  });
}

function seasonName(i) {
  return ['春', '夏', '秋', '冬'][i];
}

function updateSiji(dt) {
  if (earthRotSpeed !== 0) {
    earthRotation += earthRotSpeed * dt;
    // 检查是否到达目标角度
    if (subState === 'rotating') {
      const target = LAYOUT.siji.earth.rotation - 90 * (currentSeason + 1);
      if ((earthRotSpeed < 0 && earthRotation <= target) ||
          (earthRotSpeed > 0 && earthRotation >= target)) {
        earthRotation = target;
        earthRotSpeed = 0;
        girlWalking = false;
        const prev = currentSeason;
        currentSeason = (currentSeason + 1) % 4;
        // 第一圈走完（冬→春）：切到第二圈自动模式（连续走 + 交界箭头）
        if (!firstLapDone && prev === 3) {
          firstLapDone = true;
          enterAutoLap();
          return;
        }
        subState = 'seasonIdle';
        canTap = true;
        showHint('点击看' + seasonName(currentSeason) + '的树');
      }
    } else if (subState === 'autoLap') {
      // 第二圈：连续走，到每季原本要停的位置浮现对应交界箭头（上一枚渐隐）
      lapTime += dt;
      const base = LAYOUT.siji.earth.rotation;
      const prog = (base - earthRotation) / 90;
      const reached = ((Math.floor(prog) - 1) % 4 + 4) % 4;
      if (reached !== lastFiredSeason) {
        const hadAll4 = autoLapSeen.size >= 4;
        lastFiredSeason = reached;
        autoLapSeen.add(reached);
        const hasAll4 = autoLapSeen.size >= 4;
        // 四枚箭头都亮过后，进入第三圈（冬天回忆）的收尾阶段，不再显示新箭头
        if (!hasAll4 || (!hadAll4 && hasAll4)) {
          for (let i = 0; i < 4; i++) arrowTarget[i] = (i === reached ? 1 : 0);
        } else {
          for (let i = 0; i < 4; i++) { arrowTarget[i] = 0; arrowAlpha[i] = 0; }
        }
      }
      // 转完一圈（四枚交界箭头都亮过）后，停在"夏天"位置（reached=0 即夏天），进入冬天回忆
      if (autoLapSeen.size >= 4 && reached === 0) {
        enterWinterMemory();
        return;
      }
    }
  }
  // 交界箭头透明度缓动（渐显 / 渐隐）；四枚都亮过后快速淡出，第三圈不再出现箭头
  const arrowFadeRate = (autoLapSeen.size >= 4) ? 0.25 : 0.05;
  for (let i = 0; i < 4; i++) {
    arrowAlpha[i] += (arrowTarget[i] - arrowAlpha[i]) * (1 - Math.exp(-dt * arrowFadeRate));
  }
  // 小女孩始终踩在地球边界上（外接圆圆心固定）
  const e = LAYOUT.siji.earth;
  if (!inTransition) {
    const gy = calcGirlYOnBoundary(prerendered.siji, e.size, e.x, e.y, earthRotation, girlX);
    if (gy != null) girlY = gy;
  }
}

function drawSiji() {
  ctx.save();
  ctx.globalAlpha = sceneOpacity;

  // 四季地球（粒子已自动居中）
  const e = LAYOUT.siji.earth;
  drawPrer(prerendered.siji, e.x, e.y, e.size, earthRotation, 1);

  // 过渡到树时，树渐显（在小女孩后面）
  if (subState === 'toShu' && treeClip < 1) {
    const t = LAYOUT.shu.tree;
    const treeKey = SEASON_TREES[SEASONS[currentSeason]];
    if (prerendered[treeKey]) {
      const off = getTreeOffset();
      drawPrer(prerendered[treeKey], t.x + off.x, t.y + off.y, t.size, 0, t.opacity, treeClip);
    }
  }

  // 小女孩
  drawPrer(getWalkFrame(), girlX, girlY, LAYOUT.siji.girl.size, 0, 1);
  if (subState === 'winterMemory') drawSeasonCopy(SEASONS[currentSeason], true);

  // 第二圈：四季交界三角箭头（复用"三餐"悬浮三角样式），随地球旋转、文字保持水平
  if (subState === 'autoLap') {
    const e = LAYOUT.siji.earth;
    const R = earthRadiusPx(prerendered.siji, e.size);
    const center = earthScreenCenter(prerendered.siji, e.size, e.x, e.y, earthRotation);
    withEarthCoords(center.x, center.y, earthRotation, () => {
      for (let i = 0; i < 4; i++) {
        if (arrowAlpha[i] > 0.01) {
          // 三角贴着四季地球的真圆外缘（不用逐角轮廓）
          drawMealMarker(R + 10, R, SEASON_TRANSITIONS[i], arrowAlpha[i], arrowAlpha[i], i, lapTime, 0, true);
        }
      }
    });
  }

  ctx.restore();
}

// 从四季过渡到树：小女孩走过去 + 树渐显
function sijiToShu() {
  canTap = false;
  hideHint();
  subState = 'toShu';
  girlWalking = true; // 小女孩开始走路
  treeClip = 1;

  const tl = gsap.timeline();
  const target = LAYOUT.shu.girl;

  // 小女孩走向树的位置（只插值x，y由地球边界自动计算）
  tl.to({ x: girlX }, {
    x: target.x,
    duration: 1.0, ease: 'power1.inOut',
    onUpdate: function() {
      girlX = this.targets()[0].x;
    }
  }, 0);

  // 延迟0.2秒后树开始从下往上渐显
  tl.to({ c: 1 }, {
    c: 0, duration: 1.3, ease: 'power2.out',
    onUpdate: function() { treeClip = this.targets()[0].c; }
  }, 0.2);

  // 小女孩到达后站定
  tl.call(() => { girlWalking = false; }, null, 1.0);

  // 树完全显示后进入树场景
  tl.call(() => {
    phase = 'shu';
    subState = 'treeIdle';
    canTap = true;
    showHint('点击返回');
  }, null, 1.5);
}

// ============================================================
//  场景：03 树
// ============================================================
function enterShu() {
  phase = 'shu';
  subState = 'enter';
  treeClip = 1; // 从完全隐藏开始
  treeOpacity = LAYOUT.shu.tree.opacity;
  sceneOpacity = 0;
  canTap = false;

  gsap.to({ o: 0 }, {
    o: 1, duration: 0.5, ease: 'power2.out',
    onUpdate: function() { sceneOpacity = this.targets()[0].o; },
    onComplete: () => {
      subState = 'treeReveal';
      // 树自下而上渐渐显示
      gsap.to({ c: 1 }, {
        c: 0, duration: 2, ease: 'power2.out',
        onUpdate: function() { treeClip = this.targets()[0].c; },
        onComplete: () => {
          subState = 'treeIdle';
          canTap = true;
          showHint('点击返回');
        }
      });
    }
  });
}

function updateShu(dt) {
  // 树场景中地球不转，但小女孩仍需踩在边界上（外接圆圆心固定）
  const e = LAYOUT.shu.earth;
  const gy = calcGirlYOnBoundary(prerendered.siji, e.size, e.x, e.y, earthRotation, girlX);
  if (gy != null) girlY = gy;
}

function drawShu() {
  ctx.save();
  ctx.globalAlpha = sceneOpacity;

  // 四季地球（保持当前季节的旋转角度，粒子已自动居中）
  const e = LAYOUT.shu.earth;
  drawPrer(prerendered.siji, e.x, e.y, e.size, earthRotation, 1);

  // 树（当前季节），从下往上显示
  const t = LAYOUT.shu.tree;
  const treeKey = SEASON_TREES[SEASONS[currentSeason]];
  if (prerendered[treeKey] && treeClip < 1) {
    const off = getTreeOffset();
    drawPrer(prerendered[treeKey], t.x + off.x, t.y + off.y, t.size, 0, t.opacity, treeClip);
  }

  // 小女孩（在树前方，位置不同，营造距离感）
  drawGirlSolid(getWalkFrame(), girlX, girlY, LAYOUT.shu.girl.size, 0, 1, girlBacking);
  drawSeasonCopy(SEASONS[currentSeason], false, 1-smoothstep(0.18,0.92,treeClip));

  ctx.restore();
}

// 树消散并返回四季：小女孩走回去 + 树消散
function shuToSiji() {
  canTap = false;
  hideHint();
  subState = 'treeDissolve';
  girlWalking = true; // 小女孩开始走路

  const tl = gsap.timeline();
  const target = LAYOUT.siji.girl;

  // 树粒子消散（透明度渐隐）
  tl.to({ o: LAYOUT.shu.tree.opacity }, {
    o: 0, duration: 0.7, ease: 'power2.in',
    onUpdate: function() { window._treeFadeOpacity = this.targets()[0].o; }
  }, 0);

  // 小女孩走回四季位置（只插值x，y由地球边界自动计算）
  tl.to({ x: girlX }, {
    x: target.x,
    duration: 0.8, ease: 'power1.inOut',
    onUpdate: function() {
      girlX = this.targets()[0].x;
    }
  }, 0);

  // 到达后站定，进入旋转状态
  tl.call(() => {
    window._treeFadeOpacity = null;
    treeClip = 1;
    girlWalking = false;
    enterSijiReturn();
  }, null, 0.8);
}

// 从树返回四季后，小女孩走路+地球转90度到下一个季节
function enterSijiReturn() {
  phase = 'siji';
  subState = 'rotating';
  sceneOpacity = 1;
  girlWalking = true;
  earthRotSpeed = -0.55; // 逆时针转90度，稍慢
  canTap = false;
}

// 第二圈自动模式：女孩连续走、不停，每到"原本要停的位置"浮现对应交界三角箭头（复用三餐样式）
function enterAutoLap() {
  subState = 'autoLap';
  earthRotSpeed = -0.4; // 地球持续自转，小女孩连续走
  girlWalking = true;
  canTap = false;
  hideHint();
  lapTime = 0;
  lastFiredSeason = -1;
  autoLapSeen = new Set();
  arrowTarget[0] = arrowTarget[1] = arrowTarget[2] = arrowTarget[3] = 0;
  arrowAlpha[0] = arrowAlpha[1] = arrowAlpha[2] = arrowAlpha[3] = 0;
}
// 第三圈·冬天回忆：在夏天停下，不出树，飘冬色淡彩粒子 + 冬天蓝色弹幕（在夏日里回忆冬天）
function enterWinterMemory() {
  subState = 'winterMemory';
  currentSeason = 1; // 停在夏天位置（尽管回忆的是冬天）
  earthRotSpeed = 0;
  girlWalking = false;
  canTap = true;
  for (let i = 0; i < 4; i++) { arrowTarget[i] = 0; arrowAlpha[i] = 0; } // 第三圈彻底没有箭头
  hideHint();
  showHint('点击继续');
  syncSeasonAmbience();
}

// 四季→晨昏转场：一条缓动曲线贯穿全程 —— 加速自转并被白纱洗成白球（同步漂移到晨昏位置）
// → 白球上从中心径向晕开晨昏 → 减速停住。全程不会出现"四季与晨昏同时可见"。
// 晨昏→年轮转场：晨昏地球高速自转并被白纱洗白 → 从中心径向晕开年轮。
// 晨昏地球自带昼夜（暖昼冷夜），分界线天然成为年轮第一圈，昼暖夜冷顺延染进内圈两道弧。
function chenhunToNianlunTransition() {
  canTap = false;
  hideHint();
  inTransition = true;
  transitionWhite = 0;
  transitionReveal = 0;
  transFrom = 'chenhun';
  transTo = 'nianlun';
  transSourceAlpha = 1;
  whiteBallReady = false;
  subState = 'transition';
  sceneOpacity = 1;
  phase = 'chenhun';   // 阶段1 仍是晨昏地球在转
  earthRotSpeed = 0;   // 角度由时间线插值驱动，避免速度突变
  girlWalking = true;

  const gx = girlX;
  const tx = LAYOUT.chenhun.girl.x;

  const startRot = isFinite(earthRotation) ? earthRotation : 0;
  // 收尾落在"从黑夜走向白天"的交界：endRot 取与 startRot 同圈内 ≡180° 的等价角，
  // 自转连续且终值恰好为 180，与 enterNianlun 的硬性 180 完全一致（小女孩不瞬移）
  // 延续地球原本的逆时针自转（角度递减）：取与 startRot 同圈、≡180° 且不超过 startRot 的等价角。
  // 旧写法只保证 |endRot-startRot|≤360，会取到 startRot 上方的等价角 → 转场反向"倒着转"。
  let endRot = 180 + 360 * Math.floor((startRot - 180) / 360);
  const WHITE_END = 0.34;  // 白纱铺满的进度点（早于 reveal，使阶段1末尾已是全白、阶段2无缝接上）
  const REVEAL_AT = 0.40;  // 年轮开始洗白淡出的进度点

  if (transTl) transTl.kill();
  transTl = gsap.to({ p: 0 }, {
    p: 1, duration: 2.5, ease: 'power2.inOut',
    onUpdate: function() {
      const p = this.targets()[0].p;
      transitionWhite = 0.85 * smoothstep(0.06, WHITE_END, p);
      transitionReveal = smoothstep(REVEAL_AT, 1, p);
      const g = smoothstep(0.08, 0.70, p);
      girlX = gx + (tx - gx) * g;
      const gy = calcGirlYOnBoundary(prerendered.chenhun, LAYOUT.chenhun.earth.size, LAYOUT.chenhun.earth.x, LAYOUT.chenhun.earth.y, earthRotation, girlX);
      if (gy != null) girlY = gy;
      const rot = startRot + (endRot - startRot) * p;
      earthRotation = isFinite(rot) ? rot : startRot; // 终值=endRot(≡180)，自转连续，与 enterNianlun 一致
    },
    onComplete: function() {
      transitionWhite = 0;
      transitionReveal = 1;
      transSourceAlpha = 0;
      transSourcePos = null;
      whiteBallReady = false;
      transTl = null;
      inTransition = false;
      enterNianlun(true); // 从 nianlunTime=0 继续生长年轮（地球昼夜=年轮第一圈，无闪烁）
    }
  });
}

// 四季→年轮转场：四季地球高速自转并被白纱洗白 → 从中心径向晕开年轮。
// 直接接年轮，跳过晨昏地球；年轮地球复用晨昏地球，收尾落在"从黑夜走向白天"的交界。
function sijiToNianlunTransition() {
  canTap = false;
  hideHint();
  inTransition = true;
  transitionWhite = 0;
  transitionReveal = 0;
  transFrom = 'siji';
  transTo = 'nianlun';
  transSourceAlpha = 1;
  whiteBallReady = false;
  subState = 'transition';
  sceneOpacity = 1;
  phase = 'nianlun';  // 与目的地一致：女子Y的边界半径系数(walkRadiusScale)全程统一，落点不瞬移
  earthRotSpeed = 0; // 角度由时间线插值驱动，避免速度突变
  girlWalking = true;

  const gx = girlX;
  const tx = LAYOUT.chenhun.girl.x;
  // 来源位置：四季地球 → 年轮地球（复用晨昏布局）
  const startPos = { x: LAYOUT.siji.earth.x, y: LAYOUT.siji.earth.y, size: LAYOUT.siji.earth.size };
  const endPos = { x: LAYOUT.chenhun.earth.x, y: LAYOUT.chenhun.earth.y, size: LAYOUT.chenhun.earth.size };
  transSourcePos = { ...startPos };

  const startRot = isFinite(earthRotation) ? earthRotation : 0;
  // 收尾落在"从黑夜走向白天"的交界：endRot 取与 startRot 同圈内 ≡180° 的等价角，
  // 自转连续且终值恰好为 180，与 enterNianlun 的硬性 180 完全一致（小女孩不瞬移）
  // 延续地球原本的逆时针自转（角度递减）：取与 startRot 同圈、≡180° 且不超过 startRot 的等价角。
  // 旧写法只保证 |endRot-startRot|≤360，会取到 startRot 上方的等价角 → 转场反向"倒着转"。
  let endRot = 180 + 360 * Math.floor((startRot - 180) / 360);
  const WHITE_END = 0.34;  // 白纱铺满的进度点（早于 reveal，使阶段1末尾已是全白、阶段2无缝接上）
  const REVEAL_AT = 0.40;  // 年轮开始洗白淡出的进度点

  stopSeasonAmbience(); // 立即停止冬天粒子/弹幕的生成并清空现有弹幕
  fadeOutAmbience(0.9); // 让剩下的粒子层随白纱一起淡出

  if (transTl) transTl.kill();
  transTl = gsap.to({ p: 0 }, {
    p: 1, duration: 2.5, ease: 'power2.inOut',
    onUpdate: function() {
      const p = this.targets()[0].p;
      // 白纱：四季彩色 → 白球（脚下地球同步漂移到年轮位置）；峰值 0.85 避免纯白刺眼
      transitionWhite = 0.85 * smoothstep(0.06, WHITE_END, p);
      const k = smoothstep(0, 0.30, p); // 地球在 reveal 开始前就漂到年轮位置，避免阶段2位置跳变
      transSourcePos = {
        x: startPos.x + (endPos.x - startPos.x) * k,
        y: startPos.y + (endPos.y - startPos.y) * k,
        size: startPos.size + (endPos.size - startPos.size) * k
      };
      // 小女孩：X 线性走到位，Y 始终贴合地球边界（用当前自转角算），转场结束即与年轮场景连续、不瞬移
      const g = smoothstep(0.08, 0.70, p);
      girlX = gx + (tx - gx) * g;
      const gy = calcGirlYOnBoundary(prerendered.chenhun, LAYOUT.chenhun.earth.size, LAYOUT.chenhun.earth.x, LAYOUT.chenhun.earth.y, earthRotation, girlX);
      if (gy != null) girlY = gy;
      // 地球角度：单条缓动，加速→减速，全程速度连续；终值=endRot(≡180)，
      // 与 enterNianlun 的硬性 180 完全一致（消除小女孩 Y 的瞬移）
      let rot = startRot + (endRot - startRot) * p;
      earthRotation = isFinite(rot) ? rot : startRot;
      // 年轮随 reveal 由白光淡出（洗白在 drawTransition 阶段2 用 source-atop 处理）
      transitionReveal = smoothstep(REVEAL_AT, 1, p);
    },
    onComplete: function() {
      transitionWhite = 0;
      transitionReveal = 1;
      transSourceAlpha = 0;
      transSourcePos = null;
      whiteBallReady = false;
      transTl = null;
      inTransition = false;
      enterNianlun(true); // 年轮从"从黑夜走向白天的交界"继续生长（地球昼夜=年轮第一圈，无闪烁）
    }
  });
}

// 转场期间：地球角度由时间线插值驱动（不再用速度累加）。
// 若转场目标是年轮，亮度直接跟随地球角度（与年轮场景一致），避免转场结束瞬间"昼夜"突跳。
function updateTransition(dt) {
  if (transTo === 'nianlun') {
    const rad = (earthRotation - 90) * Math.PI / 180;
    targetBrightness = clamp(0.5 + 0.5 * Math.cos(rad), 0.2, 1.0);
    brightness += (targetBrightness - brightness) * 0.06;
  } else {
    brightness += (1 - brightness) * 0.08; // 阴阳面遮罩在转场后自然淡入
  }
}

// 生成"白球剪影"：晨昏地球形状的纯白版本，作为径向晕开时的底色。
// 用离屏 canvas 做，避免 source-atop 把整幅画面（含背景）一起刷白。
function buildWhiteBall() {
  const tPos = (LAYOUT[transTo] || LAYOUT.chenhun).earth;
  const preTo = prerendered[transTo] || prerendered.chenhun;
  if (!preTo || !preTo.canvas) return;
  if (!whiteBallReady) {
    if (whiteBallCanvas.width !== DW) { whiteBallCanvas.width = DW; whiteBallCanvas.height = DH; }
    const c = whiteBallCtx;
    c.clearRect(0, 0, DW, DH);
    c.save();
    c.translate(tPos.x, tPos.y);
    const sz = calcSize(preTo, tPos.size);
    c.drawImage(preTo.canvas, -sz.w / 2, -sz.h / 2, sz.w, sz.h);
    c.restore();
    c.globalCompositeOperation = 'source-atop';
    c.fillStyle = '#ffffff';
    c.fillRect(0, 0, DW, DH);
    c.globalCompositeOperation = 'source-over';
  }
  whiteBallReady = true;
}

// 白色薄纱：只覆盖已绘制的地球（source-atop），不闪整屏
function applyWhiteVeil(a) {
  if (!(a > 0.001)) return;
  ctx.save();
  ctx.globalCompositeOperation = 'source-atop';
  ctx.fillStyle = 'rgba(255,255,255,' + Math.min(1, a) + ')';
  ctx.fillRect(0, 0, DW, DH);
  ctx.restore();
}

// 年轮径向晕开（transTo==='nianlun' 专用）：程序化年轮无法预渲染为单图，
// 故直接在主画布上以地球中心做径向裁剪，半径随 reveal 扩大；地球自带昼夜，
// 分界线即年轮第一圈。再于地球边缘叠一道暖昼弧 + 冷夜弧，强调"昼暖夜冷染进内圈"。
function drawNianlunReveal() {
  // 转场期间：仅绘制地球+标题（nianlunTime 冻结在开场帧，年轮随后由 enterNianlun 生长），
  // 不裁剪、不染色，交由 drawTransition 的白光晕做整体淡出，确保与阶段1无缝衔接。
  const savedT = nianlunTime; nianlunTime = 0;
  const savedOp = sceneOpacity; sceneOpacity = 1;
  drawNianlun();
  sceneOpacity = savedOp; nianlunTime = savedT;
}

// 转场绘制：来源地球漂移并渐白 → 目标地球从中心径向渐显（平滑切入）
function drawTransition() {
  const to = LAYOUT[transTo] || LAYOUT.chenhun;
  const preFrom = prerendered[transFrom] || prerendered.siji;
  const preTo = prerendered[transTo] || prerendered.chenhun;
  // 来源地球的实时位置/尺寸（transSourcePos 为 null 时回退到来源场景默认位置）
  const fromLayout = LAYOUT[transFrom] || LAYOUT.siji;
  const sPos = transSourcePos || fromLayout.earth;
  const tPos = to.earth;

  ctx.save();
  if (transitionReveal <= 0) {
    // 阶段1：来源地球高速旋转 + 渐白；白光只裁切在地球圆盘内，绝不闪整屏
    ctx.save();
    ctx.globalAlpha = transSourceAlpha;
    drawPrer(preFrom, sPos.x, sPos.y, sPos.size, earthRotation, 1);
    ctx.restore();
    const pR = earthRadiusPx(preFrom, sPos.size);
    ctx.save();
    ctx.beginPath();
    ctx.arc(sPos.x, sPos.y, pR, 0, Math.PI * 2);
    ctx.clip();
    ctx.fillStyle = `rgba(255,255,255,${transitionWhite})`;
    ctx.fillRect(sPos.x - pR, sPos.y - pR, 2 * pR, 2 * pR);
    ctx.restore();
  } else {
    // 阶段2：目标地球（年轮/晨昏复用同一颗）从白中涌现；白光限制在地球圆盘内淡出，绝不闪整屏。
    // 只画地球圆盘+自身昼夜，不画整屏遮罩/环/标题（由 enterNianlun 后续生长）。
    const e = LAYOUT.chenhun.earth;
    const cx = transSourcePos ? transSourcePos.x : e.x;
    const cy = transSourcePos ? transSourcePos.y : e.y;
    const size = transSourcePos ? transSourcePos.size : e.size;
    const preTo2 = prerendered.chenhun;
    const R = earthRadiusPx(preTo2, size);
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.clip();
    drawPrer(preTo2, cx, cy, size, earthRotation, 1);
    // 挖洞圆心同样要用地球真实视觉圆心，否则压暗区会和圆盘错开
    const ecT = earthScreenCenter(preTo2, size, cx, cy, earthRotation);
    drawDayNightMask(ecT.x, ecT.y, R, earthRotation); // 昼夜染色仅作用于圆盘内
    const wa = Math.max(0, 1 - transitionReveal) * 0.85;
    if (wa > 0.001) {
      ctx.fillStyle = `rgba(255,255,255,${wa})`;
      ctx.fillRect(cx - R, cy - R, 2 * R, 2 * R);
    }
    ctx.restore();
  }
  // 小女孩（转场全程可见，从容走到位）；尺寸与目的地（年轮/晨昏）一致，避免落点瞬变
  ctx.globalAlpha = 1;
  drawPrer(getWalkFrame(), girlX, girlY, LAYOUT.chenhun.girl.size, 0, 1);
  ctx.restore();
}

// 季节粒子/弹幕层淡出（离开四季场景时用），以及重新进入时复位
function fadeOutAmbience(dur) {
  const sp = document.getElementById('season-particles');
  const dk = document.getElementById('season-danmaku');
  if (sp) gsap.to(sp, { opacity: 0, duration: dur, ease: 'power2.in' });
  if (dk) gsap.to(dk, { opacity: 0, duration: dur, ease: 'power2.in' });
}
function resetAmbienceOpacity() {
  const sp = document.getElementById('season-particles');
  const dk = document.getElementById('season-danmaku');
  if (sp) { gsap.killTweensOf(sp); gsap.set(sp, { opacity: 1 }); }
  if (dk) { gsap.killTweensOf(dk); gsap.set(dk, { opacity: 1 }); }
}

// ============================================================
//  场景：03 活跃时段迁移 + 三餐时间
// ============================================================

// 让 8:00 对齐地球昼夜分界线左端、20:00 对齐右端
// 年轮环相对地球的相位偏移：让时刻弧线对齐预渲染地球上的真实昼夜。
// 实测晨昏地球(rot=0)白天中心≈178°、夜晚中心≈0°；令 14:00 对准白天中心、
// 02:00 对准夜晚中心，反推得此值。改此值会让年轮弧/年份标签/三餐标记整体同步对齐地球昼夜。
const SCALE_RING_OFFSET = 1.0100;

// 年轮在"地球真实轮廓"之上再内缩的像素。
// 轮廓本身已经是逐角贴着地球实心边缘采样的（见 prerender 的 edgeProfile），
// 这里只要一点点重叠量，让最内圈的星点压住边缘、不留缝。
const RING_HUG = 2;

// 两年轮分组：2020-2023 一组、2024-2026 一组；两组顺序演出，各自内圈都贴紧地球
const GROUP_SPLIT = 4;

const ACTIVE_HOURS = [
  // 七年各一色：全部收进「地球同系的冷调蓝紫」——从最贴地球本色的淡湖蓝，渐变到淡藕紫，
  // 低饱和、与淡青蓝地球自然同源，无绿、仍保留温馨感
  { year: 2020, total: 6963,  hours: [23,20,21,13,17], pcts: [14.2,13.0,11.2,7.1,6.2], color: [165,200,215] },
  { year: 2021, total: 7110,  hours: [21,23,22,20,18], pcts: [12.5,10.6,10.2,9.8,9.3], color: [170,195,226] },
  { year: 2022, total: 13935, hours: [21,0,14,23,20],  pcts: [13.5,10.1,8.9,8.8,7.5], color: [178,190,228] },
  { year: 2023, total: 11933, hours: [14,20,21,22,23], pcts: [17.0,11.6,8.5,8.3,7.0], color: [188,182,224] },
  { year: 2024, total: 28351, hours: [22,23,0,13,21],  pcts: [13.5,12.8,9.7,7.8,6.7], color: [196,178,218] },
  { year: 2025, total: 11664, hours: [22,23,13,21,19], pcts: [8.9,8.9,8.7,8.7,6.3], color: [202,175,212] },
  { year: 2026, total: 11741, hours: [15,22,13,20,18], pcts: [8.8,8.0,7.9,7.8,7.7], color: [208,178,204] },
];

const MEALS = [
  { label: '早饭', time: '11:49', hour: 11 + 49/60, color: 'rgba(235,215,170,0.85)' },
  { label: '午饭', time: '16:36', hour: 16 + 36/60, color: 'rgba(240,205,180,0.85)' },
  { label: '晚饭', time: '21:05', hour: 21 + 5/60,  color: 'rgba(230,175,180,0.85)' },
  { label: '夜宵', time: '21:23', hour: 21 + 23/60, color: 'rgba(200,185,215,0.85)' },
];

let nianlunTime = 0;
let nianlunAuto = false;
let nianlunMaskFade = 0; // 四季/晨昏→年轮后，昼夜遮罩淡入系数（0=无遮罩，1=完整）

function earthRadiusPx(prer, size) {
  const { w } = calcSize(prer, size);
  const r = (prer.fitRadius != null && isFinite(prer.fitRadius) && prer.fitRadius > 0) ? prer.fitRadius : prer.maxBoundary;
  return r * (w / prer.cw);
}

// 地球在"球体本地角"方向上的真实轮廓半径（屏幕 px）。
// 年轮 / 年份标签 / 三餐三角都按它逐角贴合，而不是套一条正圆。
// localAng：球体本地角（弧度，0 = +x），等于"环坐标系角度 + SCALE_RING_OFFSET"。
function globeEdgePx(prer, size, localAng) {
  const prof = prer && prer.edgeProfile;
  if (!prof || !prof.length) return earthRadiusPx(prer, size);
  const { w } = calcSize(prer, size);
  const EN = prof.length;
  let a = localAng % TAU; if (a < 0) a += TAU;
  const f = a / TAU * EN;
  const i0 = Math.floor(f) % EN, i1 = (i0 + 1) % EN, t = f - Math.floor(f);
  return (prof[i0] * (1 - t) + prof[i1] * t) * (w / prer.cw);
}

// 地球真实视觉中心（按边界拟合中心 fitCx/fitCy 映射到屏幕；每帧重算以跟随地球旋转）
function earthScreenCenter(prer, size, earthX, earthY, rotDeg) {
  const { w, h } = calcSize(prer, size);
  const scaleX = w / prer.cw, scaleY = h / prer.ch;
  const fcx = (prer.fitCx != null && isFinite(prer.fitCx)) ? prer.fitCx : prer.cw / 2;
  const fcy = (prer.fitCy != null && isFinite(prer.fitCy)) ? prer.fitCy : prer.ch / 2;
  const ox = -w / 2 + fcx * scaleX;
  const oy = -h / 2 + fcy * scaleY;
  const a = rotDeg * Math.PI / 180;
  return {
    x: earthX + ox * Math.cos(a) - oy * Math.sin(a),
    y: earthY + ox * Math.sin(a) + oy * Math.cos(a)
  };
}

function localHourAngle(h) {
  return ((h / 24) * TAU) - Math.PI / 2;
}

function withEarthCoords(cx, cy, rotDeg, cb) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rotDeg * Math.PI / 180);
  ctx.rotate(SCALE_RING_OFFSET);
  cb();
  ctx.restore();
}

// ---------- 水彩年轮工具 ----------
function rgba(c, a){ return `rgba(${c[0]|0},${c[1]|0},${c[2]|0},${a})`; }
function lighten(c, amt){ return [Math.min(255,c[0]+(255-c[0])*amt), Math.min(255,c[1]+(255-c[1])*amt), Math.min(255,c[2]+(255-c[2])*amt)]; }
function darken(c, amt){ return [c[0]*(1-amt), c[1]*(1-amt), c[2]*(1-amt)]; }
function rgbOf(c){ if (Array.isArray(c)) return c; const m = (''+c).match(/rgba?\(([^)]+)\)/); if (!m) return [255,255,255]; const p = m[1].split(',').map(x => parseFloat(x)); return [p[0], p[1], p[2]]; }

// 沿弧描一段（半圆头），坐标在地球中心局部系
function arcStroke(r, ang, half){
  ctx.beginPath();
  ctx.arc(0, 0, r, ang - half, ang + half);
  ctx.stroke();
}

// 圆角多边形（支持三角形等），r 为圆角半径；用二次贝塞尔在顶点处倒角
function roundedPoly(ctx, pts, r) {
  const n = pts.length;
  ctx.beginPath();
  for (let i = 0; i < n; i++) {
    const p = pts[i];
    const prev = pts[(i - 1 + n) % n];
    const next = pts[(i + 1) % n];
    const v1x = prev.x - p.x, v1y = prev.y - p.y;
    const d1 = Math.hypot(v1x, v1y) || 1;
    const v2x = next.x - p.x, v2y = next.y - p.y;
    const d2 = Math.hypot(v2x, v2y) || 1;
    const cut = Math.min(r, d1 / 2, d2 / 2);
    const spx = p.x + v1x / d1 * cut;
    const spy = p.y + v1y / d1 * cut;
    const epx = p.x + v2x / d2 * cut;
    const epy = p.y + v2y / d2 * cut;
    if (i === 0) ctx.moveTo(spx, spy);
    else ctx.lineTo(spx, spy);
    ctx.quadraticCurveTo(p.x, p.y, epx, epy);
  }
  ctx.closePath();
}

// 带子与年份共用原图闭合轮廓；R仅用于计算环宽与间距。
// 沿带子厚度方向（径向）的柔和明暗，做出缎面/管状质感，而非平贴的"胶带"
// 计算年轮布局：按"最多一组的年数"计算带子宽度/间距；最内环略压进地球使其贴紧，
// 每环贴前一环外侧；自动避让画布边缘给三餐旗留位
function computeLayout(R){
  const W = 750, H = 1334;
  const cx = LAYOUT.chenhun.earth.x, cy = LAYOUT.chenhun.earth.y;
  const maxRingOuter = Math.min(cx, W - cx, cy, H - cy) - 16;
  const nYears = Math.max(GROUP_SPLIT, ACTIVE_HOURS.length - GROUP_SPLIT);
  let band = 15, gap = 9, gapEarth = 0; // 环更粗、间距更紧、第一圈直接贴地球

  let step = band + gap;
  const outerNeeded = Math.abs(gapEarth) + (nYears - 1) * step + band;
  const avail = maxRingOuter - R;
  if (outerNeeded > avail && avail > 0){
    const s = avail / outerNeeded;
    band *= s; gap *= s; gapEarth *= s; step = band + gap;
  }
  return { band, gap, gapEarth, step };
}

// 缓存发光精灵：一次生成蜜桃玫瑰金径向渐变光点，drawImage 复用（手机友好，避免逐帧 shadowBlur）
// 着色发光精灵：按年份色 tint，纯色柔光（无白核、无硬边，手机友好）
const _starSprites = {};
function starSpriteFor(rgb) {
  const key = rgb[0] + ',' + rgb[1] + ',' + rgb[2];
  if (_starSprites[key]) return _starSprites[key];
  const s = 32;
  const c = document.createElement('canvas'); c.width = c.height = s;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  grd.addColorStop(0.00, 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',0.85)');
  grd.addColorStop(0.30, 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',0.50)');
  grd.addColorStop(0.65, 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',0.18)');
  grd.addColorStop(1.00, 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',0)');
  g.fillStyle = grd; g.fillRect(0, 0, s, s);
  _starSprites[key] = c;
  return c;
}

// 每段时段的活动权重：年份整体活跃量(峰值占比)归一后作为缩放因子，
// 峰值=最粗最亮，其余按序号递减；低活跃年份整圈更细、峰值也相应变细
function hourWeight(y, i) {
  const peak = Math.max(...y.pcts);
  return peak > 0 ? y.pcts[i] / peak : 0;
}

// 每一年预生成 5 段离散弧（只算一次）：每段一个活跃时段，粗细=活动量
const _yearArcs = {};
function buildYearStars(y, band) {
  const _key = y.year + '_' + Math.round(band * 10);
  if (_yearArcs[_key]) return _yearArcs[_key];
  const H = 9 * Math.PI / 180;     // 每段角半宽（≈1 小时窗口）
  const arcs = [];
  for (let i = 0; i < y.hours.length; i++) {
    const ha = localHourAngle(y.hours[i]);
    const wgt = hourWeight(y, i);
    const th = Math.min(Math.max(2.4, band * wgt), band * 0.72); // 峰值段仍最粗，但给相邻年环保留清晰间隔          // 径向粗细
    const M = Math.round(6 + 58 * wgt);            // 密度随权重拉开，峰值更饱满
    const szBase = 2.8 + 9.5 * wgt;                // 星点大小也随权重明显变化
    const rnd = (seed) => { const x = Math.sin(seed * 127.1 + y.year * 9.7 + i * 3.3) * 43758.5453; return x - Math.floor(x); };
    const stars = [];
    for (let j = 0; j < M; j++) {
      const seed = j * 5.1 + y.year * 1.3 + i * 2.7;
      const ang = ha + (rnd(seed) - 0.5) * 2 * H;
      const rr = (rnd(seed + 1) - 0.5) * th * 1.05; // 稍展宽，让强弱年份的径向跨度差异更明显
      const sz = szBase * (0.85 + rnd(seed + 2) * 0.35);
      stars.push({ ang, rr, sz, seed });
    }
    arcs.push({ ha, wgt, th, H, stars, isPeak: y.pcts[i] === Math.max(...y.pcts) });
  }
  _yearArcs[_key] = arcs;
  return arcs;
}

// 画某一年：5 段按活动量分粗细的离散弧（峰值最粗+十字星芒），每段着年份色
// radAt(ang)：该角度上年轮中心线半径。用函数而不是常数，是为了逐角贴着地球真实轮廓。
function drawYearStars(y, radAt, band, op, t, revealT) {
  const spr = starSpriteFor(y.color);
  const arcs = buildYearStars(y, band);
  ctx.save();
  for (let arcIdx=0;arcIdx<arcs.length;arcIdx++) {
    const arc=arcs[arcIdx];
    const arcReveal=smoothstep(arcIdx*0.16,arcIdx*0.16+0.42,revealT);
    if(arcReveal<=0.01)continue;
    const isPeak = arc.isPeak;
    // 1) 段内星点：按活动量更密更亮（去掉实线弧底，弧形由星点群自行勾勒）

    ctx.save();
    for (const st of arc.stars) {
      const tw = 0.6 + 0.4 * Math.abs(Math.sin(t * (isPeak ? 2.0 : 1.4) + st.seed));
      const a = st.ang, rr = radAt(a) + st.rr;
      const x = Math.cos(a) * rr, yp = Math.sin(a) * rr, sz = st.sz;
      ctx.globalAlpha = op * arcReveal * (isPeak ? 1.0 : 0.92) * tw;
      ctx.drawImage(spr, x - sz, yp - sz, sz * 2, sz * 2);
    }
    ctx.restore();
    // 3) 峰值：柔光星点强调，大小随环宽缩放，避免跨环渗到相邻年轮
    if (isPeak) {
      const rPeak = radAt(arc.ha);
      const px = Math.cos(arc.ha) * rPeak, py = Math.sin(arc.ha) * rPeak;
      const pulse = 0.7 + 0.3 * Math.sin(t * 2.2);
      const glow = band * 1.25 * pulse; // 最大光晕直径≈1.25倍环宽，不跨到邻环
      ctx.save();
      ctx.translate(px, py);
      ctx.globalAlpha = op * arcReveal * pulse * 0.70;
      ctx.drawImage(spr, -glow / 2, -glow / 2, glow, glow);
      ctx.restore();
    }
  }
  ctx.restore();
}

// 年份标签：在各自环上，随地球一起转（固定局部角，落在环的下方），
// 形成一圈发散的年份、始终不挡顶部的小女孩；数字保持水平便于阅读
// 年份标签：在各自环上、随地球一起转；文字沿所在环的切线方向排布，
// 因此转到侧面/顶部时也不会横向叠字（不再保持水平）。可读性：必要时翻转 180° 避免倒立
function drawYearLabel(y, radAt, band, op){
  const a = -Math.PI / 3; // 局部角：t=0 时落在屏幕正下方，随地球自转移动
  const rMidA = radAt(a);
  const x = Math.cos(a) * rMidA, yp = Math.sin(a) * rMidA;
  const alpha = sceneOpacity * op;
  if (alpha <= 0.01) return;
  ctx.save();
  ctx.globalAlpha = alpha;
  // 环上的同色圆点：强调「这一圈就是这一年」
  ctx.fillStyle = rgba(y.color, 1);
  ctx.beginPath(); ctx.arc(x, yp, 4.4, 0, TAU); ctx.fill();
  ctx.lineWidth = 1.1; ctx.strokeStyle = 'rgba(250,246,238,0.7)'; ctx.stroke();
  // 年份数字：随地球一起转，文字沿环切线方向（a+π/2）；翻转保证不倒立
  ctx.translate(x, yp);
  let rot = a + Math.PI / 2;
  const screenRot = (earthRotation * Math.PI / 180 + SCALE_RING_OFFSET) + rot;
  if (Math.cos(screenRot) < 0) rot += Math.PI; // 倒立则翻转，保持可读
  ctx.rotate(rot);
  ctx.font = '700 22px "Noto Serif SC","PingFang SC",serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.lineWidth = 2.6; ctx.strokeStyle = 'rgba(250,246,238,0.7)';
  ctx.strokeText(y.year, 0, 0);
  ctx.fillStyle = rgba(darken(y.color, 0.12), 1);
  ctx.fillText(y.year, 0, 0);
  ctx.restore();
}

// 时间轴总览（nianlunTime 单位）：
//   两组年轮在「三餐登场前」的既有时间里均分；三餐登场时刻保持用户认可的时机不动
const MEAL_START = 17.5;   // 三餐登场时刻（年轮全部消失后），保持不变
const RING_END   = MEAL_START;        // 年轮在餐之前全部淡出
const GROUP0_END = RING_END / 2;      // 两组均分：2020-2023 → [0, 8.75]，2024-2026 → [8.75, 17.5]

function yearOpacity(year, t) {
  const idx = ACTIVE_HOURS.findIndex(a => a.year === year);
  const group = idx < GROUP_SPLIT ? 0 : 1;
  const localIdx = idx < GROUP_SPLIT ? idx : idx - GROUP_SPLIT;
  const gStart = group === 0 ? 0 : GROUP0_END;
  const gEnd   = group === 0 ? GROUP0_END : RING_END;
  const step = group === 0 ? 1.55 : 1.85;
  const start = gStart + localIdx * step;
  const inEnd = start + 0.8;
  const fadeDur = 1.0;         // 组尾统一淡出
  const holdEnd = gEnd - fadeDur;
  if (t < start) return 0;
  if (t < inEnd) return (t - start) / step;
  if (t < holdEnd) return 1;
  if (t < gEnd) return 1 - (t - holdEnd) / fadeDur;
  return 0;
}

function yearRevealTime(year,t){
  const idx=ACTIVE_HOURS.findIndex(a=>a.year===year),group=idx<GROUP_SPLIT?0:1;
  const localIdx=idx<GROUP_SPLIT?idx:idx-GROUP_SPLIT;
  const start=(group===0?0:GROUP0_END)+localIdx*(group===0?1.55:1.85);
  return Math.max(0,t-start);
}

function digitOpacity(year, t) {
  const idx = ACTIVE_HOURS.findIndex(a => a.year === year);
  const group = idx < GROUP_SPLIT ? 0 : 1;
  const localIdx = idx < GROUP_SPLIT ? idx : idx - GROUP_SPLIT;
  const appear = group === 0
    ? (localIdx * 0.5 + 0.5)
    : (GROUP0_END + localIdx * 0.5 + 0.3);
  if (t < appear) return 0;
  if (t < appear + 1.0) return 1;
  if (t < appear + 2.0) return 1 - (t - appear - 1.0);
  return 0;
}

function mealOpacity(i, t, type) {
  const start = MEAL_START + i * 0.6;   // 年轮全部消失后才登场
  if (t < start) return 0;
  if (t < start + 0.3) return (t - start) / 0.3; // 三角与文字一起淡入
  if (t < 22.0) return 1;                          // 一起停留（不再只剩箭头）
  if (t < 24.0) return 1 - (t - 22.0) / 2.0;       // 一起淡出
  return 0;
}

// 三餐 / 四季交界：小型 waypoint 悬浮三角 + 紧贴三角的极小两行字
// （分镜：箭头很小、不遮挡主视觉；"箭头出现时旁边浮出极小的词和时间"，
//   所以文字必须贴着三角，不能拉一条长线牵到画面别处）
function drawMealMarker(rootR, R, m, aa, wa, idx, t, textTier, calm) {
  const angle=localHourAngle(m.hour),r=typeof rootR==='function'?rootR(angle):rootR;
  const matrix=ctx.getTransform();
  const px=Math.cos(angle)*r,py=Math.sin(angle)*r;
  const anchor={x:(matrix.a*px+matrix.c*py+matrix.e)/DPR,y:(matrix.b*px+matrix.d*py+matrix.f)/DPR};
  const center={x:matrix.e/DPR,y:matrix.f/DPR};
  const dx=anchor.x-center.x,dy=anchor.y-center.y,len=Math.hypot(dx,dy)||1;
  const ux=dx/len,uy=dy/len,vx=-uy,vy=ux;
  const op=Math.min(aa,wa);if(op<=0.01)return;
  ctx.save();ctx.setTransform(DPR,0,0,DPR,0,0);ctx.globalAlpha=sceneOpacity*op;
  const font='"Noto Serif SC","PingFang SC",serif';
  ctx.font='500 24px '+font;const width=Math.max(106,Math.min(300,ctx.measureText(m.time).width+28));
  // 箭头尖端固定在刻度上；文字沿径向贴在箭头外侧，不做边缘夹取或人物避让，避免跳位。
  const labelDist=48;
  let sideShift=0,stagger=0;
  if(m.label==='晚饭'){sideShift=-34;stagger=-5;}
  else if(m.label==='夜宵'){sideShift=34;stagger=5;}
  const x=anchor.x+ux*(labelDist+stagger)+vx*sideShift;
  const y=anchor.y+uy*(labelDist+stagger)+vy*sideShift;
  const rgb=rgbOf(m.color);
  ctx.shadowColor=rgba(rgb,0.24);ctx.shadowBlur=12;
  ctx.save();ctx.translate(x,y);ctx.scale(width*0.72,45);
  const wash=ctx.createRadialGradient(0,0,0,0,0,1);
  wash.addColorStop(0,'rgba(253,250,247,0.98)');wash.addColorStop(0.55,'rgba(253,250,247,0.88)');wash.addColorStop(1,'rgba(253,250,247,0)');
  ctx.fillStyle=wash;ctx.fillRect(-1,-1,2,2);ctx.restore();
  ctx.shadowBlur=0;ctx.fillStyle=rgba(rgb,0.83);
  // 尖端落在刻度上并始终指向圆心；三角随圆周方向转动。
  const bx=anchor.x+ux*16,by=anchor.y+uy*16;
  roundedPoly(ctx,[anchor,{x:bx+vx*8,y:by+vy*8},{x:bx-vx*8,y:by-vy*8}],2);ctx.fill();
  ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle=rgba(darken(rgb,0.47),1);
  ctx.font='600 25px '+font;ctx.fillText(m.label,x,y-13,width-18);
  ctx.font='400 23px '+font;ctx.fillText(m.time,x,y+14,width-18);
  ctx.restore();
}

function enterNianlun(instant) {
  phase = 'nianlun';
  subState = 'playing';
  nianlunTime = 0;
  nianlunAuto = true;
  girlWalking = true;
  earthRotation = 180; // 年轮默认起始：从黑夜走向白天的交界（昼夜线）；地球逆时针转即"从黑夜走向白天"
  earthRotSpeed = -0.22; // 年轮场景地球缓慢自转，年份/小女孩随之一起转
  // 背景昼夜遮罩与地球昼夜一致：直接用当前地球角度算初始亮度（不再强行全亮），避免背景与地球"昼夜错位"
  const rad0 = (earthRotation - 90) * Math.PI / 180;
  targetBrightness = clamp(0.5 + 0.5 * Math.cos(rad0), 0.2, 1.0);
  brightness = targetBrightness;
  nianlunMaskFade = 0; // 刚进入年轮时先不应用昼夜背景，随后再淡入，避免"天突然黑了"
  girlX = LAYOUT.chenhun.girl.x; // 年轮复用晨昏地球，小女孩也站在它的边界上行走
  {
    const e = LAYOUT.chenhun.earth;
    const gy = calcGirlYOnBoundary(prerendered.chenhun, e.size, e.x, e.y, earthRotation, girlX);
    if (gy != null) girlY = gy;
  }
  hintEl.textContent = '';
  hintEl.classList.remove('show');
  hintEl.style.opacity = '0';
  if (instant) {
    sceneOpacity = 1; // 转场已把年轮径向晕开，直接进入无需再淡入（避免闪烁）
  } else {
    sceneOpacity = 0;
    gsap.to({ o: 0 }, {
      o: 1, duration: 0.8, ease: 'power2.out',
      onUpdate: function() { sceneOpacity = this.targets()[0].o; }
    });
  }
}

function updateNianlun(dt) {
  if (nianlunAuto) {
    nianlunTime += dt / 90;   // 放慢整体节奏，便于看清年轮与三餐标注
  }
  earthRotation += earthRotSpeed * 0.4 * dt;
  // 阴阳面亮度（与晨昏场景一致）：阳面随自转在屏幕中移动，阴面压暗带冷调
  const rad = (earthRotation - 90) * Math.PI / 180;
  targetBrightness = 0.5 + 0.5 * Math.cos(rad);
  targetBrightness = clamp(targetBrightness, 0.2, 1.0);
  brightness += (targetBrightness - brightness) * 0.06;
  // 昼夜遮罩淡入：刚切到年轮时背景先保持干净，约 3s 后再完全显现
  nianlunMaskFade = Math.min(1, nianlunMaskFade + dt / 180); // dt≈1/帧，180 帧≈3s
  // 小女孩沿地球边界行走（与晨昏场景一致），地球自转时她随边界一起移动
  const e = LAYOUT.chenhun.earth;
  const gy = calcGirlYOnBoundary(prerendered.chenhun, e.size, e.x, e.y, earthRotation, girlX);
  if (gy != null) girlY = gy;
  // 年轮全部演完（含三餐）后不接四季地球：
  // 小女孩继续在球上走；地球自转逐步加速，当她走入暗面时自动进入 4.4「夜半」
  if (nianlunTime >= 24) {
    nianlunAuto = false;
    // 餐后加速：从缓慢的 -0.22 过渡到 -0.55，约 5–8 秒走入暗面
    earthRotSpeed += (-0.55 - earthRotSpeed) * 0.04;
    const e = LAYOUT.chenhun.earth;
    const sunAng = (178 + earthRotation) * Math.PI / 180;
    const girlAng = Math.atan2(girlY - e.y, girlX - e.x);
    let diff = girlAng - sunAng;
    while (diff > Math.PI) diff -= TAU;
    while (diff < -Math.PI) diff += TAU;
    if (Math.cos(diff) < -0.1) {
      enterYeban();
    }
  }
}

function drawNianlun() {
  const isTrans = inTransition && transSourcePos;
  const cx = isTrans ? transSourcePos.x : LAYOUT.chenhun.earth.x;
  const cy = isTrans ? transSourcePos.y : LAYOUT.chenhun.earth.y;
  // 年轮场景里地球保持原始尺寸（与晨昏场景一致）；转场期间跟随 transSourcePos 漂移，避免与阶段1跳变
  const size = isTrans ? transSourcePos.size : LAYOUT.chenhun.earth.size;
  const pre = prerendered.chenhun;
  // 用地球真实视觉中心画环，解决「一侧在球内、一侧在球外」
  const center = earthScreenCenter(pre, size, cx, cy, earthRotation);
  // 环直接贴着地球外缘（不再内缩），第一圈与地球视觉边缘重叠/贴合
  const R = earthRadiusPx(pre, size);
  const t = nianlunTime;
  const lo = computeLayout(R);
  const maxLane = Math.max(GROUP_SPLIT, ACTIVE_HOURS.length - GROUP_SPLIT) - 1;

  ctx.save();
  ctx.globalAlpha = sceneOpacity;

  drawPrer(pre, cx, cy, size, earthRotation, 1); // 预渲染地球自带昼夜（蓝=白天 黑=夜晚），不另加遮罩

  // 年轮 / 年份 / 三餐（环在地球圆盘之外）
  withEarthCoords(center.x, center.y, earthRotation, () => {
    // 年轮沿独立闭合轮廓旋转，白色空缺已在原图轮廓中跨接。
    const ringRad = (lane) => a => globeEdgePx(pre, size, a + SCALE_RING_OFFSET) - RING_HUG + lane + lo.band / 2;
    // 1) 先画所有带子：按局部序号使 2020 与 2024 都贴紧地球
    for (let k = 0; k < ACTIVE_HOURS.length; k++) {
      const y = ACTIVE_HOURS[k];
      const op = yearOpacity(y.year, t);
      if (op <= 0.01) continue;
      const localIdx = k < GROUP_SPLIT ? k : k - GROUP_SPLIT;
      const lane = lo.gapEarth + localIdx * lo.step;
      drawYearStars(y, ringRad(lane), lo.band, op, t, yearRevealTime(y.year,t));
    }
    // 2) 年份标签：在各自环上、随地球一起转，文字沿环切线（不叠字）
    for (let k = 0; k < ACTIVE_HOURS.length; k++) {
      const y = ACTIVE_HOURS[k];
      const op = yearOpacity(y.year, t);
      if (op <= 0.01) continue;
      const localIdx = k < GROUP_SPLIT ? k : k - GROUP_SPLIT;
      const lane = lo.gapEarth + localIdx * lo.step;
      drawYearLabel(y, ringRad(lane), lo.band, op);
    }
  });

  // 三餐标注属于年轮层，先画；小女孩随后覆盖在整组年轮与标注之上。
  withEarthCoords(center.x, center.y, earthRotation, () => {
    const mealRoot = a => globeEdgePx(pre, size, a + SCALE_RING_OFFSET) + 8;
    for (let i = 0; i < MEALS.length; i++) {
      const m = MEALS[i];
      const aa = mealOpacity(i, t, 'arrow');
      const wa = mealOpacity(i, t, 'word');
      if (aa > 0.01 || wa > 0.01) {
        drawMealMarker(mealRoot, R, m, aa, wa, i, t, 0);
      }
    }
  });

  // 小女孩：沿地球边界走路，始终位于地球、年轮和三餐标注之上。
  drawPrer(getWalkFrame(), girlX, girlY, LAYOUT.chenhun.girl.size, 0, 1);

  ctx.restore();

  // 昼夜分界线背景遮罩（与晨昏场景完全一致：夜半球压暗、昼半球透亮，跟随地球真实昼夜）
  // 刚进入年轮时通过 nianlunMaskFade 淡入，避免转场后"天突然黑了"
  // excludeDisk=true：只染背景，不压暗地球自身的水彩明暗
  drawDayNightMask(center.x, center.y, R, earthRotation, nianlunMaskFade, true);

  // 标题 / 图例 / 三餐说明（画在遮罩之上，保持清晰可读）
  drawNianlunCaption(t);
}

function drawNianlunCaption(t) {
  const a = sceneOpacity;
  if (a <= 0.01) return;
  if (inTransition) return; // 转场期间不显示标题，避免突兀弹出
  ctx.save();
  ctx.globalAlpha = a;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  // 年度读数独立放在地球下方，避免挤在小女孩头顶。
  const dataY=DH-245;
  const visible=ACTIVE_HOURS.filter(y=>yearOpacity(y.year,t)>0.01);
  if(visible.length){
    const y=visible[visible.length-1];
    ctx.globalAlpha=a;
    ctx.fillStyle=rgba(darken(y.color,0.28),0.96);
    ctx.font='700 32px "Noto Serif SC","PingFang SC",serif';
    ctx.fillText(`${y.year} · ${y.total.toLocaleString()} 条消息`,DW/2,dataY);
    ctx.font='600 21px "Noto Serif SC","PingFang SC",serif';
    ctx.fillStyle=rgba(darken(y.color,0.18),0.92);
    for(let i=0;i<y.hours.length;i++){
      const row=i<3?0:1,idx=i<3?i:i-3,x=row===0?190+idx*185:282+idx*186;
      ctx.fillText(`${y.hours[i]}时 · ${y.pcts[i].toFixed(1)}%`,x,dataY+52+row*40);
    }
  }
  ctx.restore();
}

// ============================================================
//  场景：03.5 夜半（4.4 凌晨消息与晚安拉扯）
//  三餐之后，小女孩走入暗面，进入这一段
// ============================================================

const YEBAN_YEARS = [
  { year: 2020, count: 185, note: '8–12 月' },
  { year: 2021, count: 83 },
  { year: 2022, count: 61 },
  { year: 2023, count: 88 },
  { year: 2024, count: 806 },
  { year: 2025, count: 26 },
  { year: 2026, count: 344, note: '1–8 月' }
];

const YEBAN_GOODMORNING = 5; // 分镜与《夜的刻度》的字面早安统计。

const YEBAN_DAWN_LINES = [
  { time: '04:55:06', who: '小周', text: '你快替我看看世界' },
  { time: '04:55:42', who: '江江', text: '接下来我的大学生活中就只有学习 志愿 和看世界了' },
  { time: '04:56:07', who: '小周', text: '接下来我的大学生活只有转专业和保研了' },
  { time: '04:56:23', who: '小周', text: '主线明确' },
  { time: '04:56:27', who: '江江', text: '我要保研求求你了我一定会努力学习的' },
  { time: '04:56:56', who: '小周', text: '我妈妈说你朋友怎么考去北京天天旅游啊！' },
  { time: '04:57:27', who: '江江', text: '因为高中关怕了' },
  { time: '04:57:34', who: '小周', text: '白天想夜里哭做梦都想去首都' },
  { time: '04:57:45', who: '小周', text: '长春到北京就三小时的车' },
  { time: '04:57:58', who: '小周', text: '等我转完专业就去北京' },
  { time: '04:58:31', who: '江江', text: '北京欢迎你[流泪]宝宝我带你吃好吃的' },
  { time: '04:58:44', who: '江江', text: '到时候让我的绩点也提起来吧' },
  { time: '04:59:34', who: '小周', text: '但是转专业后第二学期要补一年的课 课表是满的' },
  { time: '04:59:43', who: '小周', text: '我都不敢想以后' },
  { time: '04:59:47', who: '小周', text: '转走就好了' },
  { time: '04:59:58', who: '江江', text: '还要补课' },
  { time: '04:59:58', who: '小周', text: '转走就一定好好出去玩[呲牙]' },
  { time: '05:00:12', who: '江江', text: '转走先开开心心玩一会' },
  { time: '05:01:04', who: '小周', text: '自学' },
  { time: '05:01:19', who: '小周', text: '线代也可以' },
  { time: '05:01:41', who: '小周', text: '我去睡了' },
  { time: '05:01:51', who: '小周', text: '梦里会有神仙为我指路的' },
  { time: '05:02:05', who: '江江', text: '宝宝早安' },
  { time: '05:02:11', who: '小周', text: '早安' },
  { time: '05:02:13', who: '江江', text: '我也睡觉去咯' },
  { time: '05:02:28', who: '小周', text: '我靠长春天亮了' },
  { time: '05:02:32', who: '小周', text: '天亮了！' },
  { time: '05:03:54', who: '小周', text: '2h40min的时差' }
];
const YEBAN_TUG_STATS = [
  { main: '115 次晚安里，69.6% 之后还有消息。', sub: '晚安之后，故事还没有立刻结束。' },
  { main: '但中位数只有 3 条。', sub: '多数晚安，其实是句号。' },
  { main: '真正停不下来的夜晚，只有 18.9%。', sub: '最长的一夜，150 条。' }
];

// 用于生成热力图的 7 行 × 24 列：行为 2020–2026，列为 0–23 时
// 数据源：《夜的刻度_六年聊天记录.html》window.DATA.hy_matrix；7×24，总和91,697。
const YEBAN_HEATMAP = [[148,243,179,1,4,1,0,0,22,38,212,221,371,497,212,311,234,435,358,376,908,782,424,986],[540,168,37,40,5,1,0,10,74,62,57,102,169,157,390,383,345,537,661,303,699,889,726,755],[1409,408,51,3,2,5,1,23,59,107,251,722,477,681,1247,658,351,807,738,745,1051,1883,1030,1226],[445,106,23,9,7,49,90,250,245,229,276,308,406,732,2024,618,552,301,304,735,1388,1016,991,829],[2746,704,265,62,423,56,144,94,153,512,1085,928,812,2224,1529,885,1128,1167,1402,1261,1407,1894,3831,3639],[727,89,19,7,0,0,17,51,32,293,446,647,705,1020,663,689,663,554,559,738,653,1010,1044,1038],[837,403,301,40,3,0,3,11,41,167,200,173,503,924,874,1028,829,767,903,616,911,773,938,496]];
const YEBAN_HEATMAP_MAX = 3831;
const YEBAN_YEAR_DURATIONS = [4,4,4,4,5.5,4,4.5];
const YEBAN_YEAR_END = 1 + YEBAN_YEAR_DURATIONS.reduce((a,b)=>a+b,0);
function yebanYearAt(t) {
  let start=1;
  for(let i=0;i<YEBAN_YEAR_DURATIONS.length;i++){
    const duration=YEBAN_YEAR_DURATIONS[i];
    if(t<start+duration||i===6)return {index:i,local:t-start,duration};
    start+=duration;
  }
}
function yebanNext(state) {
  yebanState=state;yebanTime=0;
  if(state==='dawnMinute'){yebanDawn.moonStart={x:yebanMoon.x,y:yebanMoon.y};}
  if(state==='brightFlip'){
    yebanBright.startRot=earthRotation;
    // 与夜半自转保持同一方向，亮面只继续向前转半圈。
    yebanBright.targetRot=earthRotation-180;
  }
  if(state==='brightReturn'){
    yebanBright.startRot=earthRotation;
    yebanBright.targetRot=earthRotation-180;
  }
  if(state==='moonTug'){
    yebanMoon.opacity=1;yebanMoon.glow=1;yebanTug.opacity=0;
    yebanMoon.x=112;yebanMoon.y=158;
  }
}

// 调试空降：停在星子完成铺陈、月亮尚未开始汇聚的瞬间。
function jumpToBeforeMoon() {
  if (transTl) { transTl.kill(); transTl = null; }
  if (chenhunStartTimer) { clearTimeout(chenhunStartTimer); chenhunStartTimer = null; }
  inTransition = false;
  transitionWhite = 0;
  transitionReveal = 1;
  transSourceAlpha = 0;
  transSourcePos = null;
  whiteBallReady = false;
  stopSeasonAmbience();
  resetAmbienceOpacity();
  enterYeban();
  yebanState = 'stars';
  yebanTime = Math.max(1, YEBAN_YEAR_END - 0.7);
  yebanAuto = true;
  yebanCheckpoint = '';
  earthRotSpeed = -0.05;
  girlWalking = true;
}

let yebanState = 'init';      // init, stars, moonForm, goodnight, guess, goodmorning, dawnMinute, brightFlip, brightReturn, moonTug, end
let yebanTime = 0;
let yebanAuto = false;
let yebanCheckpoint = '';
let yebanStars = [];
let yebanMoon = { x: 0, y: 0, r: 0, opacity: 0, formed: false, glow: 0 };
let yebanCaption = { main: '', sub: '', opacity: 0, y: 0 };
let yebanGuess = { value: 0, locked: false, feedback: '', feedbackOpacity: 0, feedbackSub: '' };
let yebanDawn = { lineOpacities: new Array(YEBAN_DAWN_LINES.length).fill(0), holdT: 0, allShown: false, fade: 0 };
let yebanBright = { rot: 0, targetRot: 0, heatmapOpacity: 0, heatmapScale: 0, noteOpacity: 0 };
let yebanTug = { cycle: 0, yOffset: 0, opacity: 0 };
let yebanEnd = { opacity: 0, holdT: 0 };

function enterYeban() {
  phase = 'yeban';
  inTransition = false;
  canTap = false;
  girlX = LAYOUT.chenhun.girl.x;
  subState = 'playing';
  yebanState = 'init';
  yebanTime = 0;
  yebanAuto = true;
  girlWalking = true;
  yebanGuess.value = 0;
  yebanGuess.locked = false;
  yebanGuess.feedback = '';
  yebanGuess.feedbackSub = '';
  yebanGuess.feedbackOpacity = 0;
  yebanDawn.lineOpacities.fill(0);
  yebanDawn.holdT = 0;
  yebanDawn.allShown = false;
  yebanDawn.fade = 0;
  yebanCheckpoint = '';
  yebanBright.rot = earthRotation;
  yebanBright.targetRot = earthRotation;
  yebanBright.heatmapOpacity = 0;
  yebanBright.heatmapScale = 0;
  yebanBright.noteOpacity = 0;
  yebanTug.cycle = 0;
  yebanTug.yOffset = 0;
  yebanTug.opacity = 0;
  yebanEnd.opacity = 0;
  yebanEnd.holdT = 0;
  // 初始化星子：按年份等比分布在暗面
  spawnYebanStars();
  // 月亮在地球左上外侧，星子从暗面向夜空汇聚。
  const e = LAYOUT.chenhun.earth;
  const R = earthRadiusPx(prerendered.chenhun, e.size);
  yebanMoon.x = 112;
  yebanMoon.y = 158;
  yebanMoon.r = R * 0.24;
  yebanMoon.opacity = 0;
  yebanMoon.formed = false;
  yebanMoon.glow = 0;
  // 4.4 全程地球都在极慢自转（用户要求"之后每一屏地球都要一直转"），
  // 只有亮面反转那一段改由 yebanBright.targetRot 驱动。
  earthRotSpeed = -0.05;
  sceneOpacity = 1;
  hintEl.textContent = '';
  hintEl.classList.remove('show');
  hintEl.style.opacity = '0';
}

function pauseYebanAt(checkpoint, hint) {
  if (yebanCheckpoint) return;
  yebanCheckpoint = checkpoint;
  yebanAuto = false;
  earthRotSpeed = 0;
  girlWalking = false;
  hintEl.style.opacity = '';
  showHint(hint || '点击继续');
}

function resumeYeban(state) {
  yebanCheckpoint = '';
  yebanAuto = true;
  hideHint();
  girlWalking = true;
  // 普通夜半段恢复缓慢自转；亮面翻转阶段由时间线接管角度，不能叠加速度。
  if (state !== 'brightFlip' && state !== 'brightReturn') earthRotSpeed = -0.05;
  yebanNext(state);
}

function updateYeban(dt) {
  if(yebanAuto)yebanTime+=dt/60;
  const t=yebanTime;
  if(!['brightFlip','brightReturn'].includes(yebanState)&&yebanAuto)earthRotation+=earthRotSpeed*dt;
  const e=LAYOUT.chenhun.earth;
  const gy=calcGirlYOnBoundary(prerendered.chenhun,e.size,e.x,e.y,earthRotation,girlX);
  if(gy!=null)girlY=gy;
  targetBrightness=clamp(0.5+0.5*Math.cos((earthRotation-90)*Math.PI/180),0.2,1);
  brightness+=(targetBrightness-brightness)*0.06;
  switch(yebanState){
    case 'init': if(t>=1)yebanNext('stars');break;
    case 'stars': updateYebanStars(dt);if(t>=YEBAN_YEAR_END)pauseYebanAt('moon','点击让星子聚成月亮');break;
    case 'moonForm':
      updateYebanStars(dt);yebanMoon.opacity=smoothstep(3.1,4.4,t);yebanMoon.glow=yebanMoon.opacity;
      if(t>=4.8){yebanMoon.formed=true;yebanStars.forEach(s=>s.opacity=0);yebanNext('goodnight');}break;
    case 'goodnight': if(t>=2.5)pauseYebanAt('guess','点击猜猜早安');break;
    case 'guess':
      if(yebanGuess.locked){yebanGuess.feedbackOpacity=Math.min(1,t/0.4);if(t>=4)yebanNext('goodmorning');}break;
    case 'goodmorning': if(t>=2.5)pauseYebanAt('dawn','点击继续');break;
    case 'dawnMinute': {
      const g=yebanEarthGeom(),move=smoothstep(0,1.1,t),start=yebanDawn.moonStart;
      // 月亮让出右侧的聊天留白；第3句开始停住，第6句开始化光。
      yebanMoon.x=start.x;
      yebanMoon.y=start.y+Math.min(t,2.4)*7;
      for(let i=0;i<YEBAN_DAWN_LINES.length;i++){
        const start=0.55+i*0.34;
        yebanDawn.lineOpacities[i]=smoothstep(start,start+0.38,t);
      }
      yebanMoon.opacity=1-smoothstep(6,10.6,t);
      yebanDawn.fade=0;
      if(t>=14.8)yebanNext('tugStats');break;
    }
    case 'tugStats': {
      if(t>=9.6)yebanNext('brightFlip');break;
    }
    case 'brightFlip':
      earthRotation=yebanBright.startRot+(yebanBright.targetRot-yebanBright.startRot)*smoothstep(0,4,t);
      girlWalking=t<4;
      yebanBright.heatmapOpacity=smoothstep(4.8,7,t);yebanBright.heatmapScale=yebanBright.heatmapOpacity;
      yebanBright.noteOpacity=smoothstep(7,7.8,t);
      if(t>=10)yebanNext('brightReturn');break;
    case 'brightReturn':
      earthRotation=yebanBright.startRot+(yebanBright.targetRot-yebanBright.startRot)*smoothstep(0,4,t);
      girlWalking=true;
      yebanBright.heatmapOpacity=1-smoothstep(0,1.5,t);
      if(t>=4)yebanNext('moonTug');break;
    case 'moonTug': {
      yebanTug.opacity=smoothstep(0,1,t);
      const cycle=Math.min(2,Math.floor(t/3.6)),local=(t-cycle*3.6)/3.6;
      yebanTug.yOffset=cycle<2?-20*Math.sin(Math.min(1,local)*Math.PI):-28*smoothstep(0,0.55,local);
      girlWalking=true;
      if(t>=10.8)yebanNext('end');break;
    }
    case 'end':if(t>=2){yebanAuto=false;earthRotSpeed=0;girlWalking=true;if(window.App&&window.App.next)yebanNext('done');}break;
    case 'done': girlWalking=true; break;
  }
  const footY=calcGirlYOnBoundary(prerendered.chenhun,e.size,e.x,e.y,earthRotation,girlX);
  if(footY!=null)girlY=footY;
}

function drawYeban() {
  const e = LAYOUT.chenhun.earth;
  const R = earthRadiusPx(prerendered.chenhun, e.size);

  ctx.save();
  ctx.globalAlpha = sceneOpacity;

  // 地球
  drawPrer(prerendered.chenhun, e.x, e.y, e.size, earthRotation, 1);



  // 星子（除了亮面反转后已落格时渐隐）
  const starAlpha = (yebanState === 'brightFlip' || yebanState === 'brightReturn')
    ? Math.max(0, 1 - yebanBright.heatmapOpacity * 1.5)
    : 1;
  if (starAlpha > 0.01) {
    ctx.globalAlpha = sceneOpacity * starAlpha;
    drawYebanStars();
  }

  // 月亮
  const moonAllowed = yebanState !== 'brightFlip' && yebanState !== 'brightReturn';
  if (moonAllowed && (yebanMoon.opacity > 0.01 || yebanTug.opacity > 0.01)) {
    drawYebanMoon(e.x, e.y, R);
  }

  // 小女孩
  ctx.globalAlpha = sceneOpacity;
  drawPrer(getWalkFrame(), girlX, girlY, LAYOUT.chenhun.girl.size, 0, 1);

  ctx.restore();

  // 昼夜遮罩：只作用于背景，避免生硬黑块压在水彩地球上（圆心用地球真实视觉圆心）
  const ecY = earthScreenCenter(prerendered.chenhun, e.size, e.x, e.y, earthRotation);
  drawDayNightMask(ecY.x, ecY.y, R, earthRotation, 1, true);

  // 数据与文字在背景夜色之上保持清晰。
  if (yebanState === 'brightFlip' || yebanState === 'brightReturn') drawYebanHeatmap(e.x,e.y,R);
  // 文案 / UI
  drawYebanCaption();
  if (yebanState === 'guess') drawYebanSlider();
  if (yebanState === 'dawnMinute') drawYebanDawn();
  if (yebanState === 'tugStats') drawYebanTugStats();
}

function spawnYebanStars() {
  yebanStars=[];
  const g=yebanEarthGeom();
  // 一枚可视星子约四条凌晨消息，按年份保留线性比例；全池约398枚。
  let seed=44;const rand=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
  YEBAN_YEARS.forEach((year,yi)=>{
    const n=Math.round(year.count/4);
    for(let i=0;i<n;i++){
      const angle=yi===6?(-1.18+rand()*2.36):(-1.3+rand()*2.6);
      const radius=g.R*(yi===6?(0.24+Math.sqrt(rand())*0.70):(0.10+Math.sqrt(rand())*0.80));
      let mx=-0.55,my=0;
      for(let tries=0;tries<30;tries++){
        const tx=rand()*2-1,ty=rand()*2-1;
        if(tx*tx+ty*ty<=1&&((tx-0.40)*(tx-0.40)+(ty+0.16)*(ty+0.16)>=0.88*0.88)){mx=tx;my=ty;break;}
      }
      yebanStars.push({angle,radius,yearIdx:yi,opacity:0,targetOpacity:0.58+rand()*0.35,r:1.2+rand()*1.2,x:0,y:0,mx,my,phase:rand()*TAU});
    }
  });
}
function updateYebanStars(dt) {
  const g=yebanEarthGeom(),year=yebanYearAt(yebanTime);
  for(const s of yebanStars){
    if(yebanState==='stars'){
      const desired=yebanTime>=1&&s.yearIdx===year.index?s.targetOpacity:0;
      s.opacity+=(desired-s.opacity)*(1-Math.exp(-dt*0.10));
      const a=s.angle+earthRotation*Math.PI/180;
      s.x=g.ec.x+Math.cos(a)*s.radius;s.y=g.ec.y+Math.sin(a)*s.radius;
    }else if(yebanState==='moonForm'){
      const tx=yebanMoon.x+s.mx*yebanMoon.r,ty=yebanMoon.y+s.my*yebanMoon.r;
      s.x+=(tx-s.x)*(1-Math.exp(-dt*0.035));
      s.y+=(ty-s.y)*(1-Math.exp(-dt*0.035));
      s.opacity+=(0.86-s.opacity)*(1-Math.exp(-dt*0.03));
    }
  }
}
function drawYebanStars() {
  ctx.save();
  for(const s of yebanStars){
    if(s.opacity<=0.01)continue;
    ctx.globalAlpha=sceneOpacity*s.opacity;
    ctx.fillStyle=yebanState==='moonForm'?'rgba(255,226,145,0.96)':'rgba(220,226,249,0.95)';
    ctx.shadowColor=yebanState==='moonForm'?'rgba(255,214,118,0.62)':'rgba(206,215,244,0.6)';ctx.shadowBlur=4;
    ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,TAU);ctx.fill();
  }
  ctx.restore();
}

// 水彩月亮精灵

// 水彩月亮精灵（一次性生成后复用）：
// 分镜要求"淡黄色月亮，水彩晕染，边缘模糊，像隔着纸看旧月光，表面残留几粒星子"。
// 用多层错位的柔斑叠出不规则毛边，而不是几个同心圆。
let _moonSprite = null;
function moonSprite() {
  if (_moonSprite) return _moonSprite;
  const S = 256;
  const c = document.createElement('canvas'); c.width = c.height = S;
  const g = c.getContext('2d');
  const cx0 = S / 2, cy0 = S / 2, r0 = S * 0.30;   // 月盘基准半径
  // 月牙：多层错位水彩晕斑叠出不规则毛边，再从右上方挖去一块。
  const moon = document.createElement('canvas'); moon.width = moon.height = S;
  const mg = moon.getContext('2d');
  const blobs = [
    [0.00, 0.00, 1.00, 0.42], [-0.08, 0.05, 0.94, 0.32], [0.06, -0.05, 0.90, 0.28],
    [-0.03, 0.09, 0.84, 0.24], [0.03, -0.08, 0.82, 0.22],
  ];
  for (const [ox, oy, sc, al] of blobs) {
    const bx = cx0 + ox * r0, by = cy0 + oy * r0, br = r0 * sc;
    const grd = mg.createRadialGradient(bx, by, br * 0.35, bx, by, br);
    grd.addColorStop(0, `rgba(255,243,205,${al})`);
    grd.addColorStop(0.72, `rgba(255,238,190,${(al * 0.55).toFixed(3)})`);
    grd.addColorStop(1, 'rgba(255,236,186,0)');
    mg.fillStyle = grd;
    mg.beginPath(); mg.arc(bx, by, br, 0, Math.PI * 2); mg.fill();
  }
  // 硬挖出右侧，保证月牙在所有后续状态都不会重新变圆。
  mg.globalCompositeOperation = 'destination-out';
  mg.fillStyle = '#000';
  mg.beginPath(); mg.arc(cx0 + r0 * 0.34, cy0 - r0 * 0.12, r0 * 0.98, 0, TAU); mg.fill();
  mg.globalCompositeOperation = 'source-over';
  g.drawImage(moon, 0, 0);
  // 残留星子只落在月牙附近，不再做月面斑点。
  g.fillStyle = 'rgba(255,252,240,0.78)';
  for (const [ox, oy, ds] of [[-0.34, 0.10, 1.2], [-0.20, -0.31, 0.9], [-0.12, 0.34, 0.8]]) {
    g.beginPath(); g.arc(cx0 + ox * r0, cy0 + oy * r0, ds, 0, TAU); g.fill();
  }
  _moonSprite = { canvas: c, size: S, discR: r0 };
  return _moonSprite;
}

function drawYebanMoon(cx, cy, R) {
  let mx = yebanMoon.x, my = yebanMoon.y, mr = yebanMoon.r, mop = yebanMoon.opacity;
  if (yebanState === 'moonTug' || yebanState === 'end') {
    my += yebanTug.yOffset;
    mop *= yebanTug.opacity;
  }
  if (mop <= 0.01) return;
  const spr = moonSprite();
  const sc = mr / spr.discR;
  const w = spr.size * sc;
  ctx.save();
  // 先铺一层暖色外晕，再叠加月牙本体；不依赖单次 shadow，保证小屏也能看见发光。
  ctx.globalAlpha = sceneOpacity * mop * (0.42 + 0.38 * yebanMoon.glow);
  ctx.shadowColor = 'rgba(255,224,142,0.98)';
  ctx.shadowBlur = 92;
  ctx.drawImage(spr.canvas, mx - w * 0.56, my - w * 0.56, w * 1.12, w * 1.12);
  ctx.globalAlpha = sceneOpacity * mop;
  ctx.shadowBlur = 26;
  ctx.drawImage(spr.canvas, mx - w / 2, my - w / 2, w, w);
  ctx.globalAlpha = sceneOpacity * mop * 0.86;
  ctx.shadowBlur = 10;
  ctx.drawImage(spr.canvas, mx - w / 2, my - w / 2, w, w);
  ctx.restore();
}

// ============================================================
//  4.4 文字锚点：数据、互动、聊天与热力图均使用地球下方留白，不覆盖主视觉。
// ============================================================
function yebanEarthGeom() {
  const e = LAYOUT.chenhun.earth;
  const R = earthRadiusPx(prerendered.chenhun, e.size);
  const ec = earthScreenCenter(prerendered.chenhun, e.size, e.x, e.y, earthRotation);
  let diskBottom=-Infinity,diskTop=Infinity;
  for(let i=0;i<360;i+=2){const a=i*TAU/360,r=globeEdgePx(prerendered.chenhun,e.size,a),y=ec.y+Math.sin(a+earthRotation*Math.PI/180)*r;diskBottom=Math.max(diskBottom,y);diskTop=Math.min(diskTop,y);}
  return { e, R, ec, diskBottom, diskTop };
}
// 该点是否落在地球"夜面"上：夜面是暗的，字要用浅色；纸面上用深色
function yebanOnDark(x, y, geom) {
  const g = geom || yebanEarthGeom();
  if (Math.hypot(x - g.ec.x, y - g.ec.y) > g.R * 0.96) return false;
  const sunAng = (178 + earthRotation) * Math.PI / 180;
  let d = Math.atan2(y - g.ec.y, x - g.ec.x) - sunAng;
  while (d > Math.PI) d -= TAU;
  while (d < -Math.PI) d += TAU;
  return Math.cos(d) < 0;
}
function yebanInk(onDark, k) {
  return onDark
    ? { onDark: true, strong: `rgba(252,247,236,${(0.97 * k).toFixed(3)})`, weak: `rgba(238,231,216,${(0.74 * k).toFixed(3)})`, halo: 'rgba(18,20,40,0.85)' }
    : { onDark: false, strong: `rgba(79,68,89,${(0.96 * k).toFixed(3)})`, weak: `rgba(98,83,107,${(0.86 * k).toFixed(3)})`, halo: 'rgba(250,246,238,0.92)' };
}
// 统一文字画法：暗底=浅字+柔暗影；纸面=深字+纸色描边
function yebanDrawText(text, x, y, font, ink, tone) {
  ctx.font = font;
  ctx.fillStyle = tone === 'strong' ? ink.strong : ink.weak;
  if (ink.onDark) {
    ctx.shadowColor = ink.halo;
    ctx.shadowBlur = 9;
    ctx.fillText(text, x, y, DW - 88);
    ctx.shadowBlur = 0;
  } else {
    ctx.shadowColor = ink.halo;
    ctx.shadowBlur = 3;
    ctx.fillText(text, x, y, DW - 88);
    ctx.shadowBlur = 0;
  }
}

function drawYebanCaption() {
  const a = sceneOpacity;
  if (a <= 0.01) return;
  const g = yebanEarthGeom();
  const t = yebanTime;
  const FONT = '"Noto Serif SC","PingFang SC",serif';
  const belowY = Math.min(DH-300,g.diskBottom+58);

  // 收集本帧要画的文字块
  const items = [];
  const add = (x, y, align, tone, lines, op) => {
    if (op > 0.01 && lines.length) items.push({ x, y, align, tone, lines, op });
  };

  if (yebanState === 'stars') {
    // 逐年只保留年份与条数，让星子本身承担叙事。
    const slot = yebanYearAt(t);
    const yi = slot.index;
    const yd = YEBAN_YEARS[yi];
    const localT = slot.local;
    if (t >= 1.0 && localT < slot.duration) {
      const op = smoothstep(0, 0.6, localT) * (1 - smoothstep(slot.duration-0.6, slot.duration, localT));
      add(DW / 2, DH-126, 'center', 1, [
        { text: `${yd.year} · ${yd.count.toLocaleString()} 条${yd.note ? '（' + yd.note + '）' : ''}`, size: 23, weight: 500, tone: 'strong' },
      ], op);
    }
    add(DW/2,DH-86,'center',1,[
      { text:'凌晨两点以后，天亮以前，消息落成了星子。',size:17,weight:400,tone:'weak' },
    ],smoothstep(0.8,1.5,t));
  } else if (yebanState === 'moonForm' || yebanState === 'goodnight' || yebanState === 'guess') {
    const op = yebanState==='moonForm' ? smoothstep(0.8,2.0,t) : 1;
    const fbOn = yebanState==='guess' && yebanGuess.feedbackOpacity > 0.01;
    if(!fbOn) {
      if(yebanState==='guess'){
        add(DW-116,112,'center',1,[
          { text:'晚安 · 115 次',size:24,weight:600,tone:'strong' },
          { text:'中位时刻 · 01:26',size:18,weight:400,tone:'weak',gap:34 },
        ],0.78);
      }else{
        add(DW / 2, belowY, 'center', 1, [
          { text: '晚安 · 115 次', size: 34, weight: 600, tone: 'strong' },
          { text: '中位时刻 · 01:26', size: 27, weight: 400, tone: 'weak', gap: 46 },
        ], op);
      }
    }
    // 猜测问题在渲染循环末尾单独排版，数字可随滑条实时变化。
  } else if (yebanState === 'goodmorning') {
    const op = Math.min(1, t * 1.8);
    add(DW / 2, Math.min(DH - 180, belowY + 95), 'center', 1, [
      { text: '早安：5 次。属于稀有事件。', size: 26, weight: 400, tone: 'weak' },
    ], op);
  } else if (yebanState === 'brightFlip') {
    if (yebanBright.noteOpacity > 0.01) {
      add(DW / 2, DH-170, 'center', 1, [
        { text: '凌晨 02:00—05:00 · 1.74%  →  白天 08:00—18:00 · 46.29%', size: 23, weight: 600, tone: 'strong' },
        { text: '重心偶尔落在夜里，聊天的主体仍在白天。', size: 21, weight: 400, tone: 'weak', gap: 32 },
      ], yebanBright.noteOpacity);
    }
  }

  ctx.save();
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  ctx.textBaseline = 'middle';
  for (const it of items) {
    const isQuestion=yebanState==='guess'&&it.lines.some(ln=>ln.text.includes('猜猜'));
    const onDark = isQuestion?false:yebanOnDark(it.x, it.y, g);
    const ink = (yebanState==='goodmorning'||isQuestion)
      ? { onDark:false, strong:'rgba(31,62,96,1)', weak:'rgba(52,86,121,0.98)', halo:'rgba(255,255,255,0.98)' }
      : yebanInk(onDark, 1);
    ctx.globalAlpha = a * it.op;
    ctx.textAlign = it.align;
    for (const ln of it.lines) {
      yebanDrawText(ln.text, it.x, it.y + (ln.gap || 0), `${ln.weight} ${ln.size}px ${FONT}`, ink, ln.tone);
    }
  }
  if(yebanState==='guess'&&!yebanGuess.locked){
    const qy=Math.min(DH-330, belowY+42);
    ctx.shadowColor='rgba(255,255,255,0.98)';ctx.shadowBlur=7;
    ctx.textAlign='center';ctx.fillStyle='rgba(31,62,96,1)';ctx.font=`600 25px ${FONT}`;
    ctx.fillText('六年里，我们说过',DW/2,qy-22);
    const num=String(yebanGuess.value),suffix=' 次“早安”？';
    ctx.font=`700 34px ${FONT}`;const nw=ctx.measureText(num).width;
    ctx.font=`600 29px ${FONT}`;const sw=ctx.measureText(suffix).width;
    const total=nw+sw+28,start=DW/2-total/2;
    ctx.font=`700 34px ${FONT}`;ctx.fillStyle='rgba(31,62,96,1)';ctx.fillText(num,start+nw/2,qy+22);
    ctx.strokeStyle='rgba(54,111,160,0.9)';ctx.lineWidth=2.2;ctx.strokeRect(start-9,qy-5,nw+18,48,7);
    ctx.font=`600 29px ${FONT}`;ctx.fillStyle='rgba(31,62,96,1)';ctx.textAlign='left';ctx.fillText(suffix,start+nw+28,qy+22);
    ctx.shadowBlur=0;
  }
  ctx.restore();
}

function yebanSliderGeom(){const g=yebanEarthGeom();return {x:DW/2-260,y:Math.min(DH-190,g.diskBottom+170),w:520};}
function syncYebanControl(){
  const box=document.getElementById('yeban-control'),range=document.getElementById('yeban-range');
  box.hidden=phase!=='yeban'||yebanState!=='guess'||yebanGuess.locked;
  if(box.hidden)return;
  const geom=yebanSliderGeom();box.style.left=geom.x+'px';box.style.top=(geom.y-24)+'px';
  range.value=yebanGuess.value;range.disabled=yebanGuess.locked;
  document.getElementById('yeban-value').textContent=yebanGuess.value+' 次';
  box.style.setProperty('--progress',(yebanGuess.value/2)+'%');
}
function drawYebanSlider() {
  if(yebanGuess.feedbackOpacity<=0.01)return;
  const g=yebanEarthGeom(),fy=Math.min(DH-205,g.diskBottom+92);
  const ink={onDark:false,strong:'rgba(31,62,96,1)',weak:'rgba(52,86,121,0.98)',halo:'rgba(255,255,255,0.98)'},FONT='"Noto Serif SC","PingFang SC",serif';
  ctx.save();ctx.setTransform(DPR,0,0,DPR,0,0);ctx.globalAlpha=sceneOpacity*yebanGuess.feedbackOpacity;
  ctx.textAlign='center';ctx.textBaseline='middle';
  yebanDrawText(yebanGuess.feedback,DW/2,fy,'600 29px '+FONT,ink,'strong');
  yebanDrawText(yebanGuess.feedbackSub,DW/2,fy+43,'400 23px '+FONT,ink,'weak');
  ctx.restore();
}

function drawYebanDawn() {
  const g=yebanEarthGeom(),fade=1-yebanDawn.fade;
  const top=Math.min(DH-390,g.diskBottom+150),rowH=52;
  const font='"Noto Serif SC","PingFang SC",serif';
  ctx.save();ctx.setTransform(DPR,0,0,DPR,0,0);
  // 三批消息直接浮在宣纸留白上，不加底板。
  ctx.globalAlpha=sceneOpacity*smoothstep(0,0.6,yebanTime)*fade;
  const gathered=Math.round(170*smoothstep(0.6,10.8,yebanTime));
  for(let i=0;i<gathered;i++){
    const side=i%2,x=side?(635+(i*29%96)):(18+(i*37%96)),y=top-38+(i*47%205);
    ctx.globalAlpha=sceneOpacity*fade*(0.12+(i%5)*0.035);ctx.fillStyle='rgba(184,195,226,0.9)';
    ctx.beginPath();ctx.arc(x,y,1.1+(i%3)*0.35,0,TAU);ctx.fill();
  }
  ctx.globalAlpha=sceneOpacity*smoothstep(0,0.6,yebanTime)*fade;
  const pageSize=5,pageDur=2.3;
  const page=Math.min(Math.ceil(YEBAN_DAWN_LINES.length/pageSize)-1,Math.floor(Math.max(0,yebanTime-0.35)/pageDur));
  const local=Math.max(0,yebanTime-0.35-page*pageDur);
  const pageOpacity=smoothstep(0,0.28,local)*(page===Math.ceil(YEBAN_DAWN_LINES.length/pageSize)-1?1:1-smoothstep(1.92,2.25,local));
  const first=page*pageSize,last=Math.min(YEBAN_DAWN_LINES.length,first+pageSize);
  let y=top;
  for(let i=first;i<last;i++){
    const line=YEBAN_DAWN_LINES[i],lineOpacity=smoothstep((i-first)*0.16,(i-first)*0.16+0.24,local);
    ctx.globalAlpha=sceneOpacity*pageOpacity*lineOpacity*fade;
    ctx.textAlign='left';
    ctx.font='400 15px '+font;ctx.fillStyle='rgba(98,94,116,0.78)';ctx.fillText(line.time,34,y);
    ctx.font='600 17px '+font;ctx.fillStyle=line.who==='小周'?'#b8648f':'#4f82ad';ctx.fillText(line.who,120,y);
    const msgX=178,maxW=530,parts=[];
    ctx.font=(i===YEBAN_DAWN_LINES.length-1?'600 20px ':'500 19px ')+font;
    let part='';
    for(const ch of line.text){
      if(ctx.measureText(part+ch).width>maxW&&part){parts.push(part);part=ch;}else part+=ch;
    }
    if(part)parts.push(part);
    ctx.fillStyle='#443d4a';
    parts.slice(0,2).forEach((text,j)=>ctx.fillText(text,msgX,y+j*27));
    y+=parts.length>1?74:rowH;
  }
  // 总结放在聊天记录上方，避免压住最后一批消息。
  ctx.globalAlpha=sceneOpacity*smoothstep(10.2,11.5,yebanTime)*fade;
  ctx.textAlign='center';ctx.font='400 17px '+font;ctx.fillStyle='rgba(98,94,116,0.66)';
  ctx.fillText('这一夜 22:00—08:00 共 441 条，其中 418 条发生在凌晨 2—5 点。',DW/2,36);
  // 月亮化光只需少量装饰粒子，与消息数量无关。
  const light=smoothstep(6,7,yebanTime)*(1-smoothstep(9,11,yebanTime));
  for(let i=0;i<24;i++){
    const a=i*2.399,r=(yebanTime-5)*6+(i%5)*4;
    ctx.globalAlpha=sceneOpacity*light*0.45;ctx.fillStyle='#d9c4bb';ctx.beginPath();
    ctx.arc(yebanMoon.x+Math.cos(a)*r,yebanMoon.y+Math.sin(a)*r,1.5,0,TAU);ctx.fill();
  }
  ctx.restore();
}

function drawYebanTugStats(){
  const t=yebanTime,idx=Math.min(2,Math.floor(t/3.2)),local=t-idx*3.2,s=YEBAN_TUG_STATS[idx];
  const op=smoothstep(0,0.45,local)*(1-smoothstep(2.7,3.2,local));
  if(op<=0.01)return;
  const g=yebanEarthGeom(),y=Math.min(DH-165,g.diskBottom+72),FONT='"Noto Serif SC","PingFang SC",serif';
  ctx.save();ctx.setTransform(DPR,0,0,DPR,0,0);ctx.globalAlpha=sceneOpacity*op;ctx.textAlign='center';ctx.textBaseline='middle';
  const ink=yebanInk(yebanOnDark(DW/2,y,g),1);
  yebanDrawText(s.main,DW/2,y,`600 30px ${FONT}`,ink,'strong');
  yebanDrawText(s.sub,DW/2,y+42,`400 21px ${FONT}`,ink,'weak');
  ctx.restore();
}

function drawYebanHeatmap(cx,cy,R) {
  const returning=yebanState==='brightReturn';
  const move=returning?1:smoothstep(4.8,7.4,yebanTime);
  const fade=returning?yebanBright.heatmapOpacity:smoothstep(0,1.5,yebanTime);
  if(fade<=0.01)return;
  const g=yebanEarthGeom(),step=23,rowStep=31,cell=19,left=(DW-24*23)/2,top=Math.min(DH-430,g.diskBottom+24);
  ctx.save();ctx.setTransform(DPR,0,0,DPR,0,0);
  const gatherFade=fade*(1-smoothstep(0,0.32,move));
  for(let i=0;i<170;i++){
    const side=i%2,x=side?(635+(i*29%96)):(18+(i*37%96)),y=top-38+(i*47%205);
    ctx.globalAlpha=sceneOpacity*gatherFade*(0.12+(i%5)*0.035);ctx.fillStyle='rgba(184,195,226,0.9)';
    ctx.beginPath();ctx.arc(x,y,1.1+(i%3)*0.35,0,TAU);ctx.fill();
  }
  ctx.globalAlpha=sceneOpacity*fade*move;
  const paper=ctx.createLinearGradient(left-64,0,left+24*step+20,0);
  paper.addColorStop(0,'rgba(252,249,247,0)');paper.addColorStop(0.12,'rgba(252,249,247,0.88)');paper.addColorStop(0.88,'rgba(252,249,247,0.88)');paper.addColorStop(1,'rgba(252,249,247,0)');
  ctx.fillStyle=paper;ctx.fillRect(left-54,top-44,24*step+68,7*rowStep+74);
  YEBAN_HEATMAP.forEach((row,yi)=>row.forEach((value,hi)=>{
    const tx=left+hi*step+cell/2,ty=top+yi*rowStep+cell/2;
    const strength=value/YEBAN_HEATMAP_MAX;
    // 与原报告一样使用全矩阵统一量尺；所有格子只取真实消息计数。
    ctx.globalAlpha=sceneOpacity*fade*smoothstep(0.62,1,move);
    const cellRgb=(hi>=8&&hi<=18)?'218,157,126':((hi>=22||hi<=1)?'112,139,188':'155,145,185');
    ctx.fillStyle='rgba('+cellRgb+','+(0.06+strength*0.88)+')';
    ctx.beginPath();ctx.roundRect(tx-cell/2,ty-cell/2,cell,cell,3);ctx.fill();
    // 总量按280枚压缩，只用于落格动画；位置确定、数值不随机。
    const n=(hi>=2&&hi<=5)?Math.round(value/1593*180):0;
    for(let j=0;j<n;j++){
      const spread=((yi*97+j*53+hi*31)%997)/997;
      const angle=spread*TAU+earthRotation*Math.PI/180;
      const r=R*(0.08+0.88*(((yi*41+j*17+hi*13)%991)/991));
      const sx=g.ec.x+Math.cos(angle)*r,sy=g.ec.y+Math.sin(angle)*r;
      ctx.globalAlpha=sceneOpacity*fade*(1-smoothstep(0.75,1,move))*0.9;
      ctx.fillStyle=(hi>=8&&hi<=18)?'#f4d8bc':'#d5cee9';
      ctx.beginPath();ctx.arc(sx+(tx-sx)*move,sy+(ty-sy)*move,2.1,0,TAU);ctx.fill();
    }
  }));
  // 2024 是唯一深夜带明显抬高的一年，轻微强调 22–01 四格，让观众自己发现。
  if(yebanState==='brightFlip' && yebanTime>7){
    const hiPulse=0.12+0.10*Math.sin(yebanTime*2.2);
    ctx.globalAlpha=sceneOpacity*fade*hiPulse;ctx.strokeStyle='rgba(112,139,188,0.9)';ctx.lineWidth=2;
    ctx.strokeRect(left+22*step-3,top+4*rowStep-3,4*step+6,rowStep+6);
  }
  ctx.globalAlpha=sceneOpacity*fade*move;ctx.textBaseline='middle';ctx.fillStyle='#796982';
  ctx.font='400 20px "Noto Serif SC","PingFang SC",serif';ctx.textAlign='right';
  YEBAN_YEARS.forEach((y,i)=>ctx.fillText(y.year,left-12,top+i*rowStep+cell/2));
  ctx.textAlign='center';ctx.font='400 17px "Noto Serif SC","PingFang SC",serif';
  for(const h of [0,4,8,12,16,20,23])ctx.fillText(String(h).padStart(2,'0'),left+h*step+cell/2,top+7*rowStep+14);
  ctx.textAlign='left';ctx.font='500 21px "Noto Serif SC","PingFang SC",serif';ctx.fillText('六年里的每一个时刻',left-42,top-29);
  ctx.restore();
}

function setYebanGuessFromPointer(px) {
  const cx = DW / 2, w = 520;
  const x0 = cx - w / 2;
  let ratio = (px - x0) / w;
  ratio = Math.max(0, Math.min(1, ratio));
  yebanGuess.value = Math.round(ratio * 200);
}

function lockYebanGuess() {
  if (yebanGuess.locked) return;
  yebanGuess.locked = true;
  yebanTime = 0; // 反馈从松手开始计时，不能继承等用户作答的时间。
  const g = yebanGuess.value;
  const real = YEBAN_GOODMORNING;
  const diff = Math.abs(g - real);
  if (g === real) {
    yebanGuess.feedback = `${real} 次。`;
    yebanGuess.feedbackSub = '看来你对我们不爱说早安这件事，认知非常清晰。';
  } else if (g === 0) {
    yebanGuess.feedback = '0 次。';
    yebanGuess.feedbackSub = '你比我们本人还狠。不过，有 5 次。';
  } else if (diff <= 10) {
    yebanGuess.feedback = `你猜 ${g} 次，实际 ${real} 次。`;
    yebanGuess.feedbackSub = `只差 ${diff} 次。你确实懂我们有多不爱说早安。`;
  } else {
    const mult = Math.max(1, Math.round(g / real));
    yebanGuess.feedback = `你猜 ${g} 次，实际 ${real} 次。`;
    yebanGuess.feedbackSub = `你对我们早晨的期待，是现实的 ${mult} 倍。`;
  }
  yebanGuess.feedbackOpacity = 0;
}

// ============================================================
//  场景过渡
// ============================================================
function transitionTo(target) {
  canTap = false;
  hideHint();
  const from = phase;
  gsap.to({ o: sceneOpacity }, {
    o: 0, duration: 0.5, ease: 'power2.in',
    onUpdate: function() { sceneOpacity = this.targets()[0].o; },
    onComplete: () => {
      if (target === 'siji') enterSiji();
      else if (target === 'chenhun') enterChenhun();
      else if (target === 'nianlun') enterNianlun();
      else if (target === 'yeban') enterYeban();
    }
  });
}

// ============================================================
//  交互
// ============================================================
// 调试期：点击任意处进入下一场景（?edit=1 或 ?debug=1 开启）
const DEBUG = /[?&](edit|debug)=1\b/.test(location.search);
const SCENE_ORDER = ['siji', 'chenhun', 'nianlun', 'yeban'];
function goNextScene() {
  if (inTransition) return;
  const p = (phase === 'shu') ? 'siji' : phase;
  const idx = SCENE_ORDER.indexOf(p);
  if (idx < 0) return;
  transitionTo(SCENE_ORDER[(idx + 1) % SCENE_ORDER.length]);
}

document.getElementById('tap-layer').addEventListener('click', () => {
  if (phase === 'yeban') {
    // 夜半最终停留态：手机端点击画面进入第五幕。
    // 结尾会在 end 停留后自动进入 done；两种状态都允许点击进入第五幕。
    if ((yebanState === 'end' || yebanState === 'done') && yebanTime >= 0) {
      if (window.App && window.App.next) window.App.next();
      return;
    }
    if (yebanCheckpoint === 'moon') resumeYeban('moonForm');
    else if (yebanCheckpoint === 'guess') resumeYeban('guess');
    else if (yebanCheckpoint === 'dawn') resumeYeban('dawnMinute');
    else if (yebanCheckpoint === 'bright') resumeYeban('brightFlip');
    else if (yebanCheckpoint === 'return') resumeYeban('brightReturn');
    return;
  }
  if (DEBUG) { goNextScene(); return; }
  if (!canTap) return;
  if (phase === 'chenhun') {
    chenhunToNianlunTransition();
  } else if (phase === 'siji' && subState === 'seasonIdle') {
    sijiToShu();
  } else if (phase === 'shu' && subState === 'treeIdle') {
    shuToSiji();
  } else if (phase === 'siji' && subState === 'winterMemory') {
    sijiToNianlunTransition(); // 第三圈结束：高速旋转后平滑切入年轮（跳过晨昏地球）
  } else if (phase === 'nianlun') {
    // 4.4 由"小女孩走入暗面"自动触发，点击不再手动推进
    // 但调试模式下仍可进入下一场景
    if (DEBUG) goNextScene();
  }
});

// 猜早安滑条：指针事件（仅在 4.4 guess 阶段响应）
(function setupYebanSlider() {
  const range=document.getElementById('yeban-range');let dragging=false;
  const active=()=>phase==='yeban'&&yebanState==='guess'&&!yebanGuess.locked;
  range.addEventListener('input',()=>{if(active())yebanGuess.value=Number(range.value);});
  range.addEventListener('pointerdown',e=>{e.stopPropagation();if(active()){dragging=true;range.setPointerCapture(e.pointerId);}});
  range.addEventListener('pointerup',e=>{e.stopPropagation();if(dragging&&active())lockYebanGuess();dragging=false;});
  range.addEventListener('pointercancel',()=>{dragging=false;});
  range.addEventListener('click',e=>e.stopPropagation());
  range.addEventListener('keydown',e=>e.stopPropagation());
  range.addEventListener('keyup',e=>{e.stopPropagation();if(active()&&['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(e.key))lockYebanGuess();});
})();

// 键盘事件

// 键盘事件
document.addEventListener('keydown', (e) => {
  // 场景切换（调试用）
  if (e.key === '1') { transitionTo('siji'); }
  if (e.key === '2') { transitionTo('chenhun'); }
  if (e.key === '3') { transitionTo('nianlun'); }
  if (e.key === '4') { enterYeban(); }
  if (e.key === 'ArrowRight') {
    e.preventDefault();
    jumpToBeforeMoon();
  }
  // 树位置微调（w上/s下/a左/d右，调节当前季节）
  if (e.key === 'w' || e.key === 's' || e.key === 'a' || e.key === 'd') {
    const off = getTreeOffset();
    if (e.key === 'w') off.y -= 1;
    if (e.key === 's') off.y += 1;
    if (e.key === 'a') off.x -= 1;
    if (e.key === 'd') off.x += 1;
    console.log(SEASONS[currentSeason], 'treeOffset:', off.x, off.y);
  }
  // 行走半径微调（[缩小/]放大，仅四季场景）
  if (e.key === '[') { walkRadiusScale = Math.max(0.5, walkRadiusScale - 0.01); console.log('walkRadiusScale:', walkRadiusScale.toFixed(2)); }
  if (e.key === ']') { walkRadiusScale = Math.min(1.2, walkRadiusScale + 0.01); console.log('walkRadiusScale:', walkRadiusScale.toFixed(2)); }
});

// ============================================================
//  主循环
// ============================================================

// ============================================================
//  四季弹幕 + 季节粒子（背景氛围；季节的树完全显现后触发）
// ============================================================
const SEASON_LINES = {
  spring: [
    "春天好像要来了","倒春寒嗎","很舒服的春天","花开了 花也快落了",
    "柳絮和吊死鬼乱飞的五月","春风亲吻我像蛋挞","新疆的春天还没完全来","春天要来了吗",
    "新疆的春天在三月","春天还有好远好远","春天不是湿润吗","灯红酒绿的春天",
    "春天怎么也能灯红酒绿啊","四季如春的地方真好","春天到了树也发芽了该谈恋爱了",
    "桂花开了 木棉花开了 荷花开了","人就是应该活在二十七八度的春天里",
    "北方的春天除了柳絮真的很舒服","春天是繁殖的季节（？）","而且我感觉北京的春天很不错",
    "杨柳岸晓风残月","倒春寒了","长春桃花未盛开","刚刚开春的长春","春天这个美丽啊",
    "长春的春！","二月春风似剪刀啊四月春风八剪刀","等来了属于我的春天"
  ],
  summer: [
    "蚊子多，蝴蝶多，蟑螂多，夏蝉多","羊肉串夏天烧烤","那你们的夏天什么时候到啊",
    "夏天水果自由不是梦","夏天的啤酒节实在太棒！","认识你的那个夏天也来海边了","转眼又是夏天",
    "一秒入夏","不过夏天除了热一点风景应该都很好","夏天山上温度也是个位数","荷花被新疆的烈日一晒",
    "夏天的冰雪融水","夏天夏天悄悄过去留下小秘密～","还有蝉和蜱虫 还要接受一年最毒的阳光",
    "湖里就是荷花和鹅","夏天的兰新线很漂亮","考到长春才知道长春夏天多舒服","夏天雪都化了"
  ],
  autumn: [
    "春夏咻冬","我这次是奶奶做桂花糕","板栗糖葫芦红薯 入秋必备","最低温度14° 秋天真的来了",
    "枫叶荻花秋瑟瑟","可能北京还在秋天","还没下雪就是秋天","有一种秋高气爽的感觉",
    "秋天的时候骑单车碾过落叶","晚秋景色还是很不错的","秋天气候好好","还是在他最喜欢的秋天",
    "到了你喜欢的秋天"
  ],
  winter: [
    "所以只剩滑冰打雪仗堆雪人了","我去户外给大家表演一个滑冰","这周早读和体育课都用来扫雪和打雪仗",
    "裹着羽绒服吃雪糕是什么感觉","那下雪了你们岂不是可以在那个大湖上滑冰","你见过冰山吗",
    "但是你们的冬天有雪真的超级羡慕","有一句话不是“北方冬天最好玩的不是雪，是南方人”",
    "我们这边现在还千里冰封万里雪飘呢","今天的雨夹雪是倾盆大冰沙","诶，其实我一直以为你们冬天应该一直有雪那种啊",
    "冬天真的很适合喝热热的巧克力诶","我不知道我怎么在北京过冬","是不是你的第一个下雪的冬天",
    "我都可以从那些叶子上边掰下来冰叶子","冬天是惨白的天空","我认为北方的人类是需要冬眠的",
    "我认为高中牲应该冬眠","冬天的时候都是灰蒙蒙的","冰是矿物吗","鸭鸭游动的一小块水不会结冰",
    "快看北京的腊梅开了baby"
  ]
};
// 第三圈·冬天回忆：在夏天停下，不出现树，飘冬色淡彩粒子 + 冬天蓝色弹幕（日期隐去年份）
const SEASON_COPY = {
  spring: { title:'春', lines:['春日迟迟，春景熙熙','是春节时便临东南的春景','是五一时才至西北的春意'], titleColor:'#ad3954', textColors:['#c45169','#d8788a','#e8a4af'] },
  summer: { title:'夏', lines:['But thy eternal summer shall not fade.','夏天，我们谈论叶缝里的阳光和蓝天','谈论荷花、雪山与鸣蝉','谈论时令瓜果的味道','不必想遥远的未来，幸福就在身边'], titleColor:'#28643f', textColors:['#357a4f','#4d9264','#67a77a','#82ba91','#9bcaab'] },
  autumn: { title:'秋', lines:['距离一尺 秋叶不止','在歌手最爱的季节里','在最适合见面的北国之北','在新生活缓缓开启的秋天'], titleColor:'#94451f', textColors:['#ad5b2c','#c5753f','#d8955f','#e4b080'] },
  winter: { title:'冬', lines:['“雪下得那么深 下得那么认真”','年终 一切都被洁白掩埋','人类只需要在糖葫芦里 在热巧克力里','在绒线围巾里 在暖烘烘的被窝里','心安理得地冬眠','If Winter comes, can Spring be far behind?'], titleColor:'#345b86', textColors:['#426b98','#577fac','#6e94bd','#87a8ca','#9db9d4','#b2c9dd'] }
};
function drawSeasonCopy(season, counterSeason, opacity=1) {
  const img=SEASON_COPY_IMAGES[counterSeason?'counter':season];
  if(!img)return;
  ctx.save(); ctx.setTransform(DPR,0,0,DPR,0,0); ctx.globalAlpha*=opacity;
  if(!counterSeason && season==='spring') {
    // 春单独拆成标题/正文两块，收窄间距并把组合移到画布中部。
    ctx.drawImage(img,170,160,260,270,80,990,180,187);
    ctx.drawImage(img,480,160,650,300,250,985,450,208);
  } else if(!counterSeason && season==='autumn') {
    // 秋沿用春的整体位置：标题在左、正文在右，并完整取出正文宽度。
    // 源裁切与目标保持同一宽高比，避免字形变瘦或右侧被截断。
    ctx.drawImage(img,160,140,1100,340,40,980,670,207);
  } else if(counterSeason) {
    // 反季节文案裁掉透明留白后居中放大，两行保持舒适行距。
    ctx.drawImage(img,500,250,700,210,65,1000,620,186);
  } else {
    ctx.drawImage(img,0,950,DW,350);
  }
  ctx.restore();
}
const WINTER_MEMORY_LINES = [
  { date: '2020-08-31', text: '冬天也可' },
  { date: '2021-08-28', text: '冬天洗澡会很冷' },
  { date: '2021-08-28', text: '但是暖气包不会让整个房间都很暖和' },
  { date: '2021-08-28', text: '还没体验过暖气' },
  { date: '2021-08-28', text: '一般冬天靠暖气包的座位都是风水宝地' },
  { date: '2021-08-28', text: '你家现在有暖气吗！？' },
  { date: '2021-08-28', text: '但是你们的冬天有雪真的超级羡慕' },
  { date: '2021-08-28', text: '哈哈哈哈哈啊那个雪人' },
  { date: '2021-08-28', text: '可是要扫雪' },
  { date: '2022-07-06', text: '江南也有雪敲窗吗' },
  { date: '2022-07-10', text: '贴满暖宝宝哈哈哈哈' },
  { date: '2022-07-10', text: '冬天的鞋子里都是毛茸茸的' },
  { date: '2022-07-30', text: '欸不过我很多冬天的睡衣' },
  { date: '2022-07-30', text: '冬天' },
  { date: '2022-07-30', text: '在开暖气的情况下适合' },
  { date: '2023-07-15', text: '我们这冬天十几度' },
  { date: '2023-07-15', text: '我不知道我怎么在北京过冬' },
  { date: '2023-07-15', text: '是不是你的第一个下雪的冬天' },
  { date: '2023-07-15', text: '防雪手套打雪仗' },
  { date: '2023-07-15', text: '奎屯零下二十度' },
  { date: '2023-07-15', text: '冬天' },
  { date: '2023-07-15', text: '之前零下三十度' },
  { date: '2023-07-15', text: '雪都少了' },
  { date: '2023-07-24', text: '冬天很舒服' }
];
const winterDmk = { queue: [], timer: null };
let autoLapSeen = new Set(); // 第二圈已亮过的交界箭头编号
const SEASON_PALETTE = {
  spring: { h0: 325, h1: 352 },
  summer: { h0: 118, h1: 158 },
  autumn: { h0: 18,  h1: 46  },
  winter: { h0: 200, h1: 226 }
};
function seasonHue(season, idx, n) {
  const p = SEASON_PALETTE[season];
  const t = n > 1 ? idx / (n - 1) : 0;
  return p.h0 + (p.h1 - p.h0) * t;
}
let globeCenterY = 682, globeR = 270, globeBottomY = 952, globeTopY = 412;
const seasonDmk = { active: false, season: null, timer: null, layer: null, lanes: new Set() };
const dmkQueues = {};
function shuffleArr(a){ for (let i=a.length-1;i>0;i--){ const k=Math.floor(Math.random()*(i+1)); const t=a[i]; a[i]=a[k]; a[k]=t; } return a; }
function nextSeasonLine(season){
  if (!dmkQueues[season] || dmkQueues[season].length===0) dmkQueues[season]=shuffleArr(SEASON_LINES[season].slice());
  return dmkQueues[season].pop();
}
function spawnSeasonDmk(season){
  if (!sijiDmkAllowed) return; // 第二圈自动循环不生成弹幕
  const lines = SEASON_LINES[season];
  const text = nextSeasonLine(season);
  const idx = lines.indexOf(text);
  const hue = seasonHue(season, idx, lines.length);
  const el = document.createElement('div');
  el.className = 'season-dmk';
  el.textContent = text;
  const len = text.length;
  const fs = Math.max(15, Math.min(23, Math.floor(680 / Math.max(len, 1))));
  el.style.fontSize = fs + 'px';
  // 更淡更柔：降饱和、提亮度（粉/绿/橙金/蓝都更浅）
  const c0 = 'hsl(' + hue.toFixed(0) + ',46%,87%)', c1 = 'hsl(' + hue.toFixed(0) + ',40%,72%)';
  el.style.background = 'linear-gradient(95deg, ' + c0 + ', ' + c1 + ')';
  el.style.webkitBackgroundClip = 'text';
  el.style.backgroundClip = 'text';
  el.style.color = 'transparent';
  el.style.webkitTextFillColor = 'transparent';
  const w = len * fs;
  // 弹幕区域：从屏幕正上方一直到小女孩脚底（球之下不放弹幕）。
  // 小女孩已是不透明实心、位于主画布上层；弹幕在它之下，经过她时会被自然遮挡，
  // 不会穿透她身体，因此整片区域都能铺满弹幕。
  let bandTop = 8;
  let bandBot = globeTopY - 12;
  try {
    const gsz = LAYOUT.shu.girl.size;
    const gs = calcSize(prerendered.walk1, gsz);
    const gBot = girlY + gs.h / 2; // 女孩脚下（包围盒底）
    bandBot = Math.min(gBot, globeTopY - 12);
  } catch(e){}
  // 纵向轨道分配：固定轨道高度，避免不同字号导致相邻轨道纵向重叠
  const LANE_H = 44; // 固定 >= 最大字号(23)+行距+间距，所有轨道一致间距
  const laneCount = Math.max(1, Math.floor((bandBot - bandTop) / LANE_H));
  const occ = seasonDmk.lanes;
  let lane = -1;
  for (let i = 0; i < laneCount; i++) { if (!occ.has(i)) { lane = i; break; } }
  if (lane < 0) return; // 轨道全满：本次跳过，确保绝不重叠
  const topY = bandTop + lane * LANE_H + Math.max(0, (LANE_H - fs) / 2);
  occ.add(lane);
  el._lane = lane;
  // 统一方向：全部右→左；轨道离屏后才释放，因此同轨不会追尾重叠。
  const startX = DW + 24, endX = -w - 24;
  el.style.top = topY + 'px';
  seasonDmk.layer.appendChild(el);
  gsap.fromTo(el, { x: startX, opacity: 0 }, { x: startX, opacity: 0.6, duration: 0.9, ease: 'none' });
  // 弹幕离开主要阅读区后即可释放轨道，增加密度；此时新条目从另一侧进入，不会与旧条目重叠。
  gsap.delayedCall(3.6, () => { if (el._lane != null) { seasonDmk.lanes.delete(el._lane); el._lane = null; } });
  gsap.to(el, { x: endX, duration: 8 + Math.random() * 5, ease: 'none', onComplete: () => { if (el._lane != null) seasonDmk.lanes.delete(el._lane); el.remove(); } });
}
function scheduleSeasonDmk(season){
  if (!seasonDmk.active || seasonDmk.season !== season) return;
  spawnSeasonDmk(season);
  seasonDmk.timer = gsap.delayedCall(0.8 + Math.random() * 0.9, () => scheduleSeasonDmk(season));
}
let spCanvas = null, spCtx = null, spPts = [], spRaf = 0, spSeason = null, spMode = 'season';
function spNew(pal, mode){
  let h, s, l;
  if (mode === 'rainbow'){
    // 第二圈：满轮淡彩，低饱和高亮，柔和不过艳
    h = Math.random() * 360;
    s = 40 + Math.random() * 14;   // 40-54% 淡彩
    l = 74 + Math.random() * 10;   // 74-84% 明亮柔和
  } else if (mode === 'winter'){
    // 冬天回忆：蓝白淡彩（雪感），低饱和高亮
    h = 196 + Math.random() * 38;  // 196-234 蓝
    s = 38 + Math.random() * 14;   // 38-52% 淡
    l = 79 + Math.random() * 9;    // 79-88% 明亮
  } else {
    h = pal.h0 + Math.random() * (pal.h1 - pal.h0);
    s = 72; l = 70;
  }
  return { x: Math.random()*DW, y: Math.random()*DH, vy: 0.35+Math.random()*1.0, vx:(Math.random()-0.5)*0.4,
           r: 1+Math.random()*2.4, a: (mode === 'season' ? 0.28 : 0.30) + Math.random()*(mode === 'season' ? 0.42 : 0.38),
           c: 'hsla(' + h.toFixed(0) + ',' + s.toFixed(0) + '%,' + l.toFixed(0) + '%,' };
}
function startSeasonParticles(season, mode){
  spSeason = season;
  spMode = mode || 'season';
  spCanvas = document.getElementById('season-particles');
  spCtx = spCanvas.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  spCanvas.width = DW * dpr; spCanvas.height = DH * dpr;
  spCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const pal = SEASON_PALETTE[season];
  const count = (spMode === 'season') ? 180 : 200;
  spPts = Array.from({ length: count }, () => spNew(pal, spMode));
  (function loop(){
    if (spSeason !== season || !seasonDmk.active){ if (spCtx) spCtx.clearRect(0,0,DW,DH); spRaf = 0; return; }
    spCtx.clearRect(0,0,DW,DH);
    for (const p of spPts){
      p.y += p.vy; p.x += p.vx;
      if (p.y > DH + 20){ p.y = -20; p.x = Math.random()*DW; }
      spCtx.fillStyle = p.c + p.a.toFixed(3) + ')';
      spCtx.beginPath(); spCtx.arc(p.x, p.y, p.r, 0, Math.PI*2); spCtx.fill();
    }
    spRaf = requestAnimationFrame(loop);
  })();
}
function stopSeasonParticles(){
  spSeason = null;
  if (spRaf){ cancelAnimationFrame(spRaf); spRaf = 0; }
  if (spCtx) spCtx.clearRect(0,0,DW,DH);
}
let sijiDmkAllowed = true; // 第二圈自动循环 / 冬天回忆：不生成季节弹幕
function startSeasonAmbience(season, mode, dmkWinter){
  if (seasonDmk.active && seasonDmk.season === season && spMode === mode && !!seasonDmk.winter === !!dmkWinter) return;
  stopSeasonAmbience();
  resetAmbienceOpacity(); // 重新进入四季时把淡出的粒子/弹幕层复位
  seasonDmk.active = true; seasonDmk.season = season; seasonDmk.winter = !!dmkWinter;
  seasonDmk.layer = document.getElementById('season-danmaku');
  startSeasonParticles(season, mode);
  if (dmkWinter){
    winterDmk.queue = shuffleArr(WINTER_MEMORY_LINES.slice());
    scheduleWinterDmk();
  } else {
    seasonDmk.timer = gsap.delayedCall(0.4, () => scheduleSeasonDmk(season));
  }
}
function nextWinterLine(){
  if (!winterDmk.queue || winterDmk.queue.length === 0) winterDmk.queue = shuffleArr(WINTER_MEMORY_LINES.slice());
  return winterDmk.queue.pop();
}
function spawnWinterDmk(){
  const item = nextWinterLine();
  const [yy, mm, dd] = item.date.split('-');
  const text = mm + '-' + dd + '  ' + item.text; // 日期隐去年份
  const el = document.createElement('div');
  el.className = 'season-dmk';
  el.textContent = text;
  const len = text.length;
  const fs = Math.max(15, Math.min(23, Math.floor(680 / Math.max(len, 1))));
  el.style.fontSize = fs + 'px';
  // 冬天蓝色弹幕（柔蓝）
  const c0 = 'hsl(208,60%,84%)', c1 = 'hsl(208,55%,68%)';
  el.style.background = 'linear-gradient(95deg, ' + c0 + ', ' + c1 + ')';
  el.style.webkitBackgroundClip = 'text';
  el.style.backgroundClip = 'text';
  el.style.color = 'transparent';
  el.style.webkitTextFillColor = 'transparent';
  const w = len * fs;
  let bandTop = 8;
  let bandBot = globeTopY - 12;
  try {
    const gsz = LAYOUT.shu.girl.size;
    const gs = calcSize(prerendered.walk1, gsz);
    const gBot = girlY + gs.h / 2;
    bandBot = Math.min(gBot, globeTopY - 12);
  } catch(e){}
  const LANE_H = 44;
  const laneCount = Math.max(1, Math.floor((bandBot - bandTop) / LANE_H));
  const occ = seasonDmk.lanes;
  let lane = -1;
  for (let i = 0; i < laneCount; i++) { if (!occ.has(i)) { lane = i; break; } }
  if (lane < 0) return; // 轨道全满：本次跳过，确保绝不重叠
  const topY = bandTop + lane * LANE_H + Math.max(0, (LANE_H - fs) / 2);
  occ.add(lane);
  el._lane = lane;
  const startX = DW + 24, endX = -w - 24;
  el.style.top = topY + 'px';
  seasonDmk.layer.appendChild(el);
  gsap.fromTo(el, { x: startX, opacity: 0 }, { x: startX, opacity: 0.6, duration: 0.9, ease: 'none' });
  gsap.delayedCall(3.6, () => { if (el._lane != null) { seasonDmk.lanes.delete(el._lane); el._lane = null; } });
  gsap.to(el, { x: endX, duration: 9 + Math.random() * 5, ease: 'none', onComplete: () => { if (el._lane != null) seasonDmk.lanes.delete(el._lane); el.remove(); } });
}
function scheduleWinterDmk(){
  if (!seasonDmk.active || !seasonDmk.winter) return;
  spawnWinterDmk();
  winterDmk.timer = gsap.delayedCall(0.8 + Math.random() * 0.9, () => scheduleWinterDmk());
}
function stopSeasonAmbience(){
  seasonDmk.active = false;
  if (seasonDmk.timer){ seasonDmk.timer.kill(); seasonDmk.timer = null; }
  if (winterDmk.timer){ winterDmk.timer.kill(); winterDmk.timer = null; }
  if (seasonDmk.layer) seasonDmk.layer.innerHTML = '';
  seasonDmk.lanes.clear();
  stopSeasonParticles();
}
function syncSeasonAmbience(){
  const tree = (phase === 'shu' && subState === 'treeIdle');
  const auto = (phase === 'siji' && subState === 'autoLap');
  // 转场期间不再维持任何四季氛围：sijiToNianlunTransition / chenhunToNianlunTransition 开头都已 stop + fadeOut。
  // 若继续判断为 winter，syncSeasonAmbience 会重新 start 冬天弹幕，导致弹幕残留在转场中。
  const winter = (phase === 'siji' && subState === 'winterMemory');
  sijiDmkAllowed = !auto && !winter; // 第二圈 / 冬天回忆：不生成季节弹幕（冬天回忆用专属蓝弹幕）
  let want = null, mode = 'season', dmkWinter = false;
  if (tree) { want = SEASONS[currentSeason]; mode = 'season'; }
  else if (auto) { want = SEASONS[currentSeason]; mode = 'rainbow'; }
  else if (winter) { want = 'winter'; mode = 'winter'; dmkWinter = true; }
  if (want) {
    if (!seasonDmk.active || seasonDmk.season !== want || spMode !== mode || !!seasonDmk.winter !== dmkWinter) {
      startSeasonAmbience(want, mode, dmkWinter);
    }
  } else if (seasonDmk.active) stopSeasonAmbience();
}

let lastTime = performance.now();

function loop(now) {
  const dt = Math.min((now - lastTime) / 16.67, 3);
  lastTime = now;

  // 小女孩白底进度：跟随树显现渐变淡入（treeClip: 1=隐藏 → 0=显示），离开树场景则渐隐
  const girlTarget = (phase === 'shu') ? Math.max(0, 1 - treeClip) : 0;
  girlBacking += (girlTarget - girlBacking) * (1 - Math.exp(-dt * 0.12));

  // 走路动画
  if (girlWalking) {
    walkAcc += (now - (loop._last || now));
    while (walkAcc >= WALK_FRAME_MS) {
      walkAcc -= WALK_FRAME_MS;
      walkFrame = (walkFrame + 1) % 6;
    }
  }
  loop._last = now;

  syncYebanControl();
  // 清空
  ctx.clearRect(0, 0, DW, DH);

  // 更新和绘制
  if (inTransition) {
    // 转场（四季→晨昏）：高速旋转渐白 → 从中心径向平滑切入
    updateTransition(dt);
    drawTransition();
  } else if (phase === 'chenhun') {
    updateChenhun(dt);
    drawChenhun();
  } else if (phase === 'siji') {
    updateSiji(dt);
    drawSiji();
  } else if (phase === 'nianlun') {
    updateNianlun(dt);
    drawNianlun();
  } else if (phase === 'yeban') {
    updateYeban(dt);
    drawYeban();
  } else if (phase === 'shu') {
    updateShu(dt);
    // 树消散时的透明度处理
    if (window._treeFadeOpacity != null) {
      const t = LAYOUT.shu.tree;
      // 重绘树场景但树用渐隐透明度
      ctx.save();
      ctx.globalAlpha = sceneOpacity;
      const e = LAYOUT.shu.earth;
      drawPrer(prerendered.siji, e.x, e.y, e.size, earthRotation, 1);
      const treeKey = SEASON_TREES[SEASONS[currentSeason]];
      if (prerendered[treeKey]) {
      const off = getTreeOffset();
        drawPrer(prerendered[treeKey], t.x + off.x, t.y + off.y, t.size, 0, window._treeFadeOpacity, 0);
      }
      drawGirlSolid(getWalkFrame(), girlX, girlY, LAYOUT.shu.girl.size, 0, 1, girlBacking);
      ctx.restore();
    } else {
      drawShu();
    }
  }

  syncSeasonAmbience();

  requestAnimationFrame(loop);
}

// ============================================================
//  启动
// ============================================================
async function main() {
  try {
    await Promise.all([loadSeasonCopyImages(), loadAssets()]);
    markAct4Ready();
    document.getElementById('loading').classList.add('hide');
    try { const _e = LAYOUT.shu.earth; globeR = earthRadiusPx(prerendered.siji, _e.size); globeCenterY = _e.y; globeBottomY = globeCenterY + globeR; globeTopY = globeCenterY - globeR; } catch(e){}
    document.getElementById('debug').textContent = DEBUG ? '第四幕 · 1 四季 / 2 晨昏 / 3 年轮 / 4 夜半' : '';
    enterSiji();
    requestAnimationFrame(loop);
  } catch (e) {
    console.error('加载失败:', e);
    // Do not leave the router waiting forever if one optional drawing asset
    // fails. The canvas loop still gets a chance to render its fallback.
    markAct4Ready();
    document.getElementById('loading').classList.add('hide');
    enterSiji();
    requestAnimationFrame(loop);
  }
}
main();


/* ================= 合并注入：模块导出（第四幕：阶段式）================= */
(function(){
  window.__act4Snapshot = function(){
    try {
      var snap = document.createElement('canvas'); snap.width = 750; snap.height = 1334;
      snap.getContext('2d').drawImage(canvas, 0, 0, 750, 1334);
      return snap.toDataURL('image/png');
    } catch (e) { return ''; }
  };
  var scenes = window.App.manifestScenes(__actNo);
  if (typeof transitionTo === 'function') {
    var __origTT = transitionTo;
    transitionTo = function(ph){
      var r = __origTT.apply(this, arguments);
      var i = scenes.indexOf(ph);
      if (i >= 0) window.App.syncLocal(__actNo, i);
      return r;
    };
  }
  if (typeof goNextScene === 'function') {
    var __origNext = goNextScene;
    goNextScene = function(){
      var p = (typeof phase !== 'undefined' && phase === 'shu') ? 'siji' : phase;
      var i = scenes.indexOf(p);
      if (i >= scenes.length - 1) { window.App.next(); return; }
      return __origNext.apply(this, arguments);
    };
  }
  window.App.register(__actNo, {
    scenes: scenes,
    ready: function(cb){
      if (window.__act4WhenReady) window.__act4WhenReady(cb);
      else cb();
    },
    show: function(local){
      var ph = scenes[local];
      if (ph && typeof phase !== 'undefined' && phase !== ph && typeof transitionTo === 'function') transitionTo(ph);
    },
    enter: function(){ try { resize(); } catch (e) {} __resumeRaf(); }
  });
})();

})(window, document, gsap);
