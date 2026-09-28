(function(window, document, gsap){

/* ================= 合并运行时沙箱（自动生成，勿手改）================= */
var __realWin = window;
var __realDoc = document;
var __actNo = 5;
var __root = __realDoc.getElementById('act-5');
var __App = __realWin.App;
function __isActive(){ return __App.isActive(__actNo); }
function __scope(sel){
  sel = String(sel);
  if (!sel || sel.indexOf('#act-5') === 0) return sel;
  return '#act-5 ' + sel;
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


if (!window.gsap) {
  window.gsap = {
    _tweens: [], _raf: null,
    _toList: function(t){
      if (typeof t === 'string') return Array.prototype.slice.call(document.querySelectorAll(t));
      if (Array.isArray(t)) return t;
      return [t];
    },
    to: function(target, vars){
      var list = this._toList(target);
      var skip = {duration:1,delay:1,ease:1,onComplete:1,overwrite:1,yoyo:1,repeat:1};
      var props = Object.keys(vars).filter(function(k){ return !skip[k]; });
      var from = list.map(function(el){
        var o = {};
        props.forEach(function(p){
          if (el && el.nodeType) {
            if (p === 'opacity') o[p] = parseFloat(getComputedStyle(el).opacity) || 0;
            else if (p === 'scale') o[p] = 1;
            else o[p] = 0;
          } else {
            o[p] = (el && typeof el[p] === 'number') ? el[p] : 0;
          }
        });
        return o;
      });
      var tw = {
        list: list, from: from, props: props, vars: vars,
        start: performance.now() + (vars.delay || 0) * 1000,
        dur: Math.max(1, (vars.duration || 0.5) * 1000)
      };
      this._tweens.push(tw);
      this._wake();
      return tw;
    },
    killTweensOf: function(target){
      var list = this._toList(target);
      this._tweens = this._tweens.filter(function(tw){
        for (var i = 0; i < tw.list.length; i++) {
          if (list.indexOf(tw.list[i]) >= 0) return false;
        }
        return true;
      });
    },
    _wake: function(){
      var self = this;
      if (self._raf) return;
      (function tick(){
        var now = performance.now(), alive = [];
        self._tweens.forEach(function(tw){
          var k = (now - tw.start) / tw.dur;
          if (k < 0) k = 0;
          var done = k >= 1;
          if (k > 1) k = 1;
          var e = 1 - Math.pow(1 - k, 3);
          tw.list.forEach(function(el, idx){
            tw.props.forEach(function(p){
              var v = tw.from[idx][p] + (tw.vars[p] - tw.from[idx][p]) * e;
              if (el && el.nodeType) {
                if (p === 'opacity') el.style.opacity = v;
                else if (p === 'scale') el.style.transform = 'scale(' + v + ')';
              } else {
                el[p] = v;
              }
            });
          });
          if (done) { if (tw.vars.onComplete) tw.vars.onComplete(); }
          else alive.push(tw);
        });
        self._tweens = alive;
        self._raf = alive.length ? requestAnimationFrame(tick) : null;
      })();
    }
  };
}


/* ========== 舞台适配 ========== */
var stageEl=document.getElementById('stage');
var DESIGN_W=750, DESIGN_H=1334;
function resize(){
  var s=Math.min(innerWidth/DESIGN_W, innerHeight/DESIGN_H);
  stageEl.style.transform='scale('+s+')';
  stageEl.style.left=((innerWidth-DESIGN_W*s)/2)+'px';
  stageEl.style.top=((innerHeight-DESIGN_H*s)/2)+'px';
}
window.addEventListener('resize',resize); resize();

var sceneOrder=['scene-5']; var sceneInit=[]; var currentScene=0;
function goToScene(i){
  if(i<0||i>=sceneOrder.length)return;
  var prev=document.getElementById(sceneOrder[currentScene]);
  var next=document.getElementById(sceneOrder[i]);
  if(prev){prev.classList.remove('active');prev.style.visibility='hidden';prev.style.opacity='';}
  next.classList.add('active');next.style.visibility='visible';next.style.opacity='1';
  currentScene=i; if(sceneInit[i])sceneInit[i]();
}

/* ========== S5 状态 ========== */
var S5 = {
  W:750,H:1334,
  hearts:{ pink:{x:214,y:1124,hex:'#e0a6b4'}, blue:{x:539,y:197,hex:'#8fb0c9'},
    from:{x:214,y:1106}, to:{x:539,y:220} },
  LINES:[
    {type:'happy',color:'#e0a0a8',w:4.0,a:0.9,off:-2,cur:0,target:0},
    {type:'sad',color:'#9bb6d2',w:3.0,a:0.82,off:-1,cur:0,target:0},
    {type:'angry',color:'#cf9b8c',w:3.3,a:0.85,off:0,cur:0,target:0},
    {type:'anxious',color:'#d8b483',w:3.0,a:0.8,off:1,cur:0,target:0},
    {type:'touched',color:'#c9a3bd',w:3.2,a:0.8,off:2,cur:0,target:0}
  ],
  seg:0,t:0,raf:0,
  reduced: !!(typeof window.matchMedia==='function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches),
  clicked:false, happyBoost:1, focus:-1,
  mode:'none', dots:[], particles:[], crackPhase:0, vanishPhase:0,
  heartEmitters:[], peakH:0, barrage:[], barrageQueue:[], lanes:{}, lastLaunch:0,
  mouse:{x:375,y:667}, hoverIdx:-1, matrixPin:-1, dragging:false, matrixPhase:0,
  emitSide:'both', emitTarget:0, helixFade:0,
  finished:false,
  MONTHS:[
    ['2020-08',17,65,71],['2020-09',18,72,89],['2020-10',17,82,76],['2020-11',4,50,100],['2020-12',10,60,70],
    ['2021-01',14,64,93],['2021-02',17,59,65],['2021-03',6,67,100],['2021-04',12,50,67],['2021-05',10,40,70],['2021-06',11,64,64],['2021-07',16,56,75],['2021-08',14,86,57],['2021-09',15,80,67],['2021-10',13,62,69],['2021-11',11,73,64],['2021-12',12,75,83],
    ['2022-01',19,74,74],['2022-02',14,64,57],['2022-03',18,50,44],['2022-04',20,75,60],['2022-05',15,67,80],['2022-06',15,67,73],['2022-07',31,48,65],['2022-08',20,90,85],['2022-09',19,89,95],['2022-10',14,57,86],['2022-11',16,69,94],['2022-12',22,64,95],
    ['2023-01',22,27,73],['2023-02',12,25,50],['2023-03',9,44,33],['2023-04',13,38,62],['2023-05',7,57,71],['2023-06',20,65,30],['2023-07',31,61,52],['2023-08',30,60,27],['2023-09',24,33,46],['2023-10',26,58,58],['2023-11',29,55,55],['2023-12',25,28,56],
    ['2024-01',30,73,57],['2024-02',29,62,48],['2024-03',28,46,43],['2024-04',28,71,46],['2024-05',31,55,52],['2024-06',29,66,52],['2024-07',28,64,64],['2024-08',28,68,75],['2024-09',29,76,48],['2024-10',30,33,90],['2024-11',29,66,86],['2024-12',25,36,96],
    ['2025-01',22,32,73],['2025-02',15,40,73],['2025-03',25,44,72],['2025-04',25,28,60],['2025-05',26,46,58],['2025-06',26,46,69],['2025-07',26,54,69],['2025-08',26,58,73],['2025-09',25,56,64],['2025-10',27,59,81],['2025-11',25,52,80],['2025-12',22,64,91],
    ['2026-01',18,50,83],['2026-02',16,44,81],['2026-03',19,47,68],['2026-04',23,48,87],['2026-05',21,62,71],['2026-06',20,60,75],['2026-07',30,67,60],['2026-08',12,25,58]
  ]
};

function $(id){return document.getElementById(id);}
var cv=$('s5-canvas'), g=cv.getContext('2d');
var textLayer=$('s5-text');

/* ---------- 水彩心 ---------- */
function hexRgb(hex){var n=parseInt(hex.slice(1),16);return{r:n>>16&255,g:n>>8&255,b:n&255};}
function seededRNG(seed){var s=seed|0;return function(){s=(s+0x6D2B79F5)|0;var t=Math.imul(s^(s>>>15),1|s);t=(t+Math.imul(t^(t>>>7),61|t))^t;return((t^(t>>>14))>>>0)/4294967296;};}
function heartPts(cx,cy,scale,rng,jitter,expand){
  var j=jitter||4,e=expand||3,pts=[];
  for(var t=0;t<=Math.PI*2+0.03;t+=0.04){
    var s=Math.sin(t);
    var px=16*s*s*s;
    var py=13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t);
    pts.push([cx+px*scale*(1/33)+(rng()-.5)*j*2, cy-py*scale*(1/33)+(rng()-.5)*j*2]);
  }
  for(var i=0;i<pts.length;i++){var a=Math.atan2(pts[i][1]-cy,pts[i][0]-cx);pts[i][0]+=Math.cos(a)*e;pts[i][1]+=Math.sin(a)*e;}
  return pts;
}
function heartPath(ctx,cx,cy,scale,rng,jitter,expand){
  var pts=heartPts(cx,cy,scale,rng,jitter,expand);
  ctx.beginPath();
  pts.forEach(function(p,i){i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]);});
  ctx.closePath();
}
function rgba(c,a){return 'rgba('+(c[0]|0)+','+(c[1]|0)+','+(c[2]|0)+','+a+')';}
function drawWatercolorHeart(canvas,cfg){
  var size=cfg.size||330,dpr=2;
  canvas.width=canvas.height=size*dpr;
  var ctx=canvas.getContext('2d'),w=size*dpr,h=size*dpr;
  var rng=seededRNG(cfg.seed||42),cx=w/2,cy=h*.48,scale=w*.38;
  heartPath(ctx,cx,cy,scale*1.08,rng,2.5,5);
  var g1=ctx.createRadialGradient(cx,cy-scale*.1,0,cx,cy,scale*.9);
  g1.addColorStop(0,rgba(cfg.colors[0],.55));g1.addColorStop(.6,rgba(cfg.colors[1],.35));g1.addColorStop(1,rgba(cfg.colors[2],.12));
  ctx.fillStyle=g1;ctx.fill();
  heartPath(ctx,cx,cy,scale*.92,rng,1.5,2);
  var g2=ctx.createLinearGradient(cx-scale*.3,cy-scale*.3,cx+scale*.3,cy+scale*.3);
  g2.addColorStop(0,rgba(cfg.colors[0],.28));g2.addColorStop(.5,rgba(cfg.colors[1],.38));g2.addColorStop(1,rgba(cfg.colors[2],.22));
  ctx.globalCompositeOperation='multiply';ctx.fillStyle=g2;ctx.fill();ctx.globalCompositeOperation='source-over';
  ctx.save();heartPath(ctx,cx,cy,scale*.88,rng,1,0);ctx.clip();
  for(var i=0;i<16;i++){var a=rng()*Math.PI*2,d=scale*(.32+rng()*.12);ctx.beginPath();ctx.arc(cx+Math.cos(a)*d,cy+Math.sin(a)*d,2+rng()*6+rng()*4,0,Math.PI*2);ctx.fillStyle=rgba(rng()<.5?cfg.colors[1]:cfg.colors[2],.06+rng()*.14);ctx.fill();}
  for(var i2=0;i2<8;i2++){var sa=rng()*Math.PI*2,al=.15+rng()*.35;ctx.beginPath();for(var t2=0;t2<=1;t2+=.05){var a2=sa+al*t2,d2=scale*(.28+rng()*.18),px2=cx+Math.cos(a2)*d2+(rng()-.5)*8,py2=cy+Math.sin(a2)*d2+(rng()-.5)*8;t2===0?ctx.moveTo(px2,py2):ctx.lineTo(px2,py2);}ctx.strokeStyle=rgba(cfg.colors[2],.08+rng()*.15);ctx.lineWidth=1.5+rng()*4;ctx.lineCap='round';ctx.stroke();}
  ctx.restore();
  var id=ctx.getImageData(0,0,w,h),d3=id.data;
  for(var k=0;k<d3.length;k+=4){var n2=(rng()-.5)*12;d3[k]=Math.max(0,Math.min(255,d3[k]+n2));d3[k+1]=Math.max(0,Math.min(255,d3[k+1]+n2));d3[k+2]=Math.max(0,Math.min(255,d3[k+2]+n2));}
  ctx.putImageData(id,0,0);
  for(var i3=0;i3<3+(rng()*3|0);i3++){var hx=w*(.20+rng()*.45),hy=h*(.10+rng()*.40),hr=6+rng()*18,hg=ctx.createRadialGradient(hx,hy,0,hx,hy,hr);hg.addColorStop(0,'rgba(255,255,255,'+(.12+rng()*.18)+')');hg.addColorStop(1,'rgba(255,255,255,0)');ctx.fillStyle=hg;ctx.beginPath();ctx.arc(hx,hy,hr,0,Math.PI*2);ctx.fill();}
  for(var i4=0;i4<10;i4++){var a3=rng()*Math.PI*2,d4=scale*(.42+rng()*.12);ctx.beginPath();ctx.arc(cx+Math.cos(a3)*d4,cy+Math.sin(a3)*d4,.8+rng()*3.5,0,Math.PI*2);ctx.fillStyle=rgba(rng()<.5?cfg.colors[0]:cfg.colors[1],.05+rng()*.12);ctx.fill();}
  var soft=document.createElement('canvas');soft.width=w;soft.height=h;
  var sctx=soft.getContext('2d');sctx.filter='blur(1.6px)';sctx.drawImage(canvas,0,0);sctx.filter='none';
  ctx.clearRect(0,0,w,h);ctx.drawImage(soft,0,0);
  return canvas.toDataURL('image/png');
}

/* ---------- 情绪线几何 ---------- */
function lineEndpoints(off){
  var n={x:0.795,y:0.6}, d=78*off;
  return [{x:S5.hearts.from.x+n.x*d,y:S5.hearts.from.y+n.y*d},
          {x:S5.hearts.to.x+n.x*d,y:S5.hearts.to.y+n.y*d}];
}
function waveY(type,x01,t,amp){
  var a=30;
  var env=function(x){return 1+0.18*Math.sin(x*Math.PI*2.1+0.8);};
  switch(type){
    case 'happy': return Math.sin(x01*Math.PI*2*4-t*1.5)*a*env(x01);
    case 'sad': return -a*1.0+Math.sin(x01*Math.PI*2*3-t*0.6)*a*0.55*env(x01);
    case 'anxious': { var segN=3; var ms=((x01*segN-t*0.6)%1+1)%1;
      if(ms>0.6)return 0; return a*0.3+Math.sin(x01*Math.PI*2*4-t*1.2)*a*0.45*env(x01); }
    case 'angry': { var per=6; var raw=(x01*per-t*1.6)%1; var mv=((raw%1)+1)%1;
      var pid=Math.floor(x01*per)%3; var H=a*(pid===1?1.1:pid===2?1.4:1.8); var w=0.16;
      if(mv>=0.5-w/2&&mv<=0.5+w/2){var dd=Math.abs(mv-0.5)/(w/2);return H*(1-dd);} return 0; }
    case 'touched': { var arc=a*0.85*Math.sin(Math.PI*x01); var segN2=3;
      var ms2=((x01*segN2-t*0.6)%1+1)%1; if(ms2>0.6)return 0; return arc; }
  }
  return 0;
}
function sampleLine(type,off,t,amp,peakH){
  var P={x:S5.hearts.from.x,y:S5.hearts.from.y}, Q={x:S5.hearts.to.x,y:S5.hearts.to.y};
  var dx=Q.x-P.x, dy=Q.y-P.y, len=Math.hypot(dx,dy);
  var nx=-dy/len, ny=dx/len, N=150, pts=[];
  for(var i=0;i<=N;i++){
    var u=i/N, edge=Math.sin(Math.PI*u);
    var spread=Math.pow(Math.sin(Math.PI*u),0.55)*120*off;
    var x=P.x+dx*u+nx*spread, y=P.y+dy*u+ny*spread;
    var wv=waveY(type,u,t,amp);
    x+=nx*wv*edge; y+=ny*wv*edge;
    if(peakH){var g2=Math.exp(-Math.pow((u-0.55)/0.17,2));x+=nx*peakH*g2;y+=ny*peakH*g2;}
    pts.push([x,y]);
  }
  return pts;
}
function samplePoint(type,off,u,t,amp,peakH){
  var P={x:S5.hearts.from.x,y:S5.hearts.from.y}, Q={x:S5.hearts.to.x,y:S5.hearts.to.y};
  var dx=Q.x-P.x, dy=Q.y-P.y, len=Math.hypot(dx,dy);
  var nx=-dy/len, ny=dx/len;
  var edge=Math.sin(Math.PI*u);
  var spread=Math.pow(Math.sin(Math.PI*u),0.55)*120*off;
  var x=P.x+dx*u+nx*spread, y=P.y+dy*u+ny*spread;
  var wv=waveY(type,u,t,amp);
  x+=nx*wv*edge; y+=ny*wv*edge;
  if(peakH){var g2=Math.exp(-Math.pow((u-0.55)/0.17,2));x+=nx*peakH*g2;y+=ny*peakH*g2;}
  return [x,y];
}
function pointAt(type,off,u,t,amp,peakH){
  var E=lineEndpoints(off), A=E[0], B=E[1];
  var x=A.x+(B.x-A.x)*u;
  var y=A.y+(B.y-A.y)*u+waveY(type,u,t,amp);
  if(peakH) y-=peakH*Math.exp(-Math.pow((u-0.55)/0.17,2));
  return [x,y];
}
function roundRect(ctx,x,y,w,h,r){
  ctx.beginPath();ctx.moveTo(x+r,y);
  ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);
  ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath();
}
function strokeLaser(pts,color,alpha,width){
  if(pts.length<2) return;
  var core=width*1.2;
  var layers=[[core*3.4,alpha*0.12],[core*2.0,alpha*0.28],[core*1.4,Math.min(1,alpha*0.6)],[core,Math.min(1,alpha*0.95)]];
  for(var i=0;i<layers.length;i++){
    g.beginPath();pts.forEach(function(p,k){k?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]);});
    g.strokeStyle=color;g.globalAlpha=layers[i][1];g.lineWidth=layers[i][0];
    g.lineCap='round';g.lineJoin='round';g.stroke();
  }
  g.globalAlpha=1;
}
function strokeSpray(pts,color,alpha,width,t){
  if(pts.length<2) return;
  var dashOn=width*2.8,dashOff=width*5.5,flow=t*45;
  var gate=0.35+0.65*Math.max(0,Math.sin(t*2.0));
  var layers=[[width*3.4,alpha*0.13],[width*2.0,alpha*0.26],[width*1.4,alpha*0.55*gate],[width,alpha*0.92*gate]];
  for(var i=0;i<layers.length;i++){
    g.beginPath();pts.forEach(function(p,k){k?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]);});
    g.strokeStyle=color;g.globalAlpha=layers[i][1];g.lineWidth=layers[i][0];
    g.lineCap='round';g.lineJoin='round';
    g.setLineDash([dashOn,dashOff]);g.lineDashOffset=-flow;g.stroke();
  }
  g.setLineDash([]);g.globalAlpha=1;
}
function strokeWeave(pts,alpha,width){
  if(pts.length<2) return;
  var a=pts[0],b=pts[pts.length-1];
  var grad=g.createLinearGradient(a[0],a[1],b[0],b[1]);
  grad.addColorStop(0,'#e0a6b4');grad.addColorStop(1,'#8fb0c9');
  var path=function(){g.beginPath();pts.forEach(function(p,i){i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]);});};
  path();g.strokeStyle=grad;g.globalAlpha=alpha*0.15;g.lineWidth=width*3.4;g.lineCap='round';g.stroke();
  path();g.globalAlpha=alpha*0.35;g.lineWidth=width*1.8;g.stroke();
  path();g.globalAlpha=alpha*0.88;g.lineWidth=width;g.stroke();
  g.globalAlpha=1;
}
function drawHelix(t,ascale,speed){
  var as=(ascale===undefined?1:ascale);
  var sp=(speed===undefined?2.4:speed);
  var E=lineEndpoints(0), A=E[0], B=E[1];
  var N=72, ampH=32, k=Math.PI*2.4, p1=[], p2=[];
  for(var i=0;i<=N;i++){
    var u=i/N, x=A.x+(B.x-A.x)*u, y0=A.y+(B.y-A.y)*u;
    p1.push([x,y0+ampH*Math.sin(u*k*Math.PI+t*sp)]);
    p2.push([x,y0+ampH*Math.sin(u*k*Math.PI+t*sp+Math.PI)]);
  }
  strokeLaser(p1,'#e0a6b4',0.8*as,3.4);
  strokeLaser(p2,'#8fb0c9',0.8*as,3.4);
  for(var j=0;j<5;j++){
    var u2=((j/5)+t*0.1)%1;
    var x2=A.x+(B.x-A.x)*u2, y2=A.y+(B.y-A.y)*u2;
    g.fillStyle=j%2?'rgba(224,166,180,0.25)':'rgba(143,176,201,0.25)';
    g.beginPath(); g.arc(x2,y2,6+Math.sin(t*3+j)*2,0,Math.PI*2); g.fill();
  }
}

/* ---------- 73 月点阵 ---------- */
function monthPos(i){
  var A=S5.hearts.from,B=S5.hearts.to;
  var dx=B.x-A.x,dy=B.y-A.y,len=Math.hypot(dx,dy),nx=-dy/len,ny=dx/len;
  var u=0.06+(i/(S5.MONTHS.length-1))*0.88;
  var zig=(i%2?1:-1)*16;
  var days=S5.MONTHS[i][1];
  return {x:A.x+dx*u+nx*zig, y:A.y+dy*u+ny*zig, r:2.6+(days/31)*3.4};
}
function drawMatrix(){
  var a=S5.matrixPhase;
  var showIdx = S5.dragging ? S5.hoverIdx : (S5.hoverIdx>=0 ? S5.hoverIdx : S5.matrixPin);
  for(var i=0;i<S5.MONTHS.length;i++){
    var m=S5.MONTHS[i],p=monthPos(i);
    var col = m[2]>50 ? '#e0a6b4' : '#8fb0c9';
    var aa = Math.max(0, Math.min(1,(a-i*0.014)*5));
    if(aa<=0) continue;
    var hov = (showIdx===i);
    g.globalAlpha = aa*(hov?1:0.8);
    g.fillStyle=col;
    g.beginPath(); g.arc(p.x,p.y,p.r*(hov?1.7:1),0,6.2832); g.fill();
    if(hov){
      g.globalAlpha=aa;
      g.strokeStyle='rgba(255,255,255,0.95)'; g.lineWidth=2.2;
      g.beginPath(); g.arc(p.x,p.y,p.r+6,0,6.2832); g.stroke();
      g.globalAlpha=aa*0.45; g.strokeStyle=col; g.lineWidth=1.2;
      g.beginPath(); g.arc(p.x,p.y,p.r+12,0,6.2832); g.stroke();
    }
    g.globalAlpha=1;
  }
  if(showIdx>=0){
    var m2=S5.MONTHS[showIdx];
    var who = m2[2]>50 ? '小周' : '江江';
    var t1 = m2[0];
    var t2 = '活跃 '+m2[1]+' 天 · '+who+'开头 · 小周收尾 '+m2[3]+'%';
    g.font='18px "PingFang SC","Noto Serif SC",serif';
    var w1=g.measureText(t1).width, w2=g.measureText(t2).width;
    var bw=Math.max(w1,w2)+30, bh=58;
    var bx=(750-bw)/2;
    var pSel=monthPos(showIdx);
    var by=(pSel.y<667)?902:452;
    g.fillStyle='rgba(250,245,238,0.95)'; g.strokeStyle='rgba(180,160,150,0.5)'; g.lineWidth=1;
    roundRect(g,bx,by,bw,bh,9); g.fill(); g.stroke();
    g.fillStyle='rgba(74,62,58,0.9)'; g.fillText(t1,bx+15,by+24);
    g.fillStyle='rgba(74,62,58,0.6)'; g.fillText(t2,bx+15,by+46);
  }
}

/* ---------- 文字工具 ---------- */
function s5Txt(cfg){
  var el=document.createElement('div');
  el.className='s5-txt'+(cfg.wrap?' s5-wrap':'');
  var size=cfg.size||21;
  el.textContent=String(cfg.text);
  el.style.left=cfg.x+'px'; el.style.top=cfg.y+'px';
  el.style.fontSize=size+'px';
  if(cfg.wrap) el.style.width=(cfg.width||600)+'px';
  el.style.color=cfg.color||'rgba(58,58,58,0.72)';
  if(String(cfg.text).indexOf('\n')>=0) el.style.whiteSpace='pre-line';
  if(cfg.rotation!==undefined) el.style.transform='translate(-50%,-50%) rotate('+cfg.rotation+'deg)';
  el.style.opacity=0; textLayer.appendChild(el);
  // 长句以标点符号为分界换行（浏览器自动断 CJK 会切在词中间，读起来别扭）
  if(cfg.wrap){
    var fam=window.getComputedStyle(el).fontFamily;
    el.innerHTML=s5WrapText(String(cfg.text), fam, size, cfg.width||600);
  }
  return el;
}
/* 标点优先的手动断行：先按整行宽度贪心排，超出时回退到最近一个标点之后断 */
var S5_PUNCT_END = '，。！？；：、）」』》】”…—·,.!?;:)';
var S5_PUNCT_HEAD = '，。！？；：、）」』》】”…—·,.!?;:)';
function s5WrapText(text, family, size, width){
  var cvs = s5WrapText._c || (s5WrapText._c = document.createElement('canvas'));
  var ctx = cvs.getContext('2d');
  ctx.font = size + 'px ' + family;
  var hard = text.split('\n'), out = [];
  hard.forEach(function(para){
    if (!para) { out.push(''); return; }
    var line = '';
    for (var i = 0; i < para.length; i++) {
      line += para[i];
      if (ctx.measureText(line).width <= width) continue;
      var cut = -1;
      for (var k = line.length - 1; k > 1; k--) if (S5_PUNCT_END.indexOf(line.charAt(k - 1)) >= 0) { cut = k; break; }
      if (cut <= 0) cut = line.length - 1;                       // 没有标点就按字断
      while (cut < line.length - 1 && S5_PUNCT_HEAD.indexOf(line.charAt(cut)) >= 0) cut++;  // 别让标点跑到行首
      out.push(line.slice(0, cut));
      line = line.slice(cut);
    }
    if (line) out.push(line);
  });
  return out.map(function(l){ return l.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }).join('<br>');
}
function lineText(off,type,text,color,size,side,u){
  var P=S5.hearts.from,Q=S5.hearts.to;
  var dx=Q.x-P.x,dy=Q.y-P.y,len=Math.hypot(dx,dy),nx=-dy/len,ny=dx/len;
  var uu=(u===undefined)?0.5:u;
  var pt=function(tt){
    var spread=Math.pow(Math.sin(Math.PI*tt),0.55)*120*off;
    return {x:P.x+dx*tt+nx*spread, y:P.y+dy*tt+ny*spread};
  };
  var c=pt(uu), a1=pt(Math.max(0,uu-0.02)), a2=pt(Math.min(1,uu+0.02));
  var rot=Math.atan2(a2.y-a1.y,a2.x-a1.x)*180/Math.PI;
  return s5Txt({text:text,x:c.x+nx*26*side,y:c.y+ny*26*side,color:color,size:size,rotation:rot});
}
function fadeIn(el,dur,delay){ return gsap.to(el,{opacity:1,duration:dur||0.82,delay:delay||0,ease:'power1.out'}); }
function fadeOut(el,dur,delay){ return gsap.to(el,{opacity:0,duration:dur||0.72,delay:delay||0,ease:'power1.in'}); }
function clearTexts(){ textLayer.innerHTML=''; }

/* ---------- 渲染 ---------- */
function updateLineAlpha(){
  S5.LINES.forEach(function(L){
    var d=L.target-L.cur;
    if(Math.abs(d)<0.001){L.cur=L.target;return;}
    L.cur+=d*0.12;
  });
}
function render(){
  var t=S5.t;
  g.clearRect(0,0,S5.W,S5.H);
  var amp=112;
  var clipOn = true;
  if(clipOn){
    g.save();
    g.beginPath();
    g.rect(0,0,S5.W,S5.H);
    var hp=heartPts(S5.hearts.pink.x,S5.hearts.pink.y,125.4,seededRNG(42),4,9);
    hp.forEach(function(p,i){i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]);});
    g.closePath();
    var bp=heartPts(S5.hearts.blue.x,S5.hearts.blue.y,125.4,seededRNG(43),4,9);
    bp.forEach(function(p,i){i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]);});
    g.closePath();
    g.clip('evenodd');
  }
  if(S5.mode==='matrix'){ drawMatrix(); }
  else if(S5.mode==='five'||S5.mode==='fiveClicked'){
    var boost=S5.mode==='fiveClicked'?S5.happyBoost:1;
    updateLineAlpha();
    S5.LINES.forEach(function(L,i){
      if(L.cur<=0.01) return;
      var isHappy=i===0;
      var a=isHappy?Math.min(1,L.a*L.cur*boost):L.a*L.cur;
      if(S5.focus===-2) a*=0.35;
      else if(S5.focus>=0&&i!==S5.focus) a*=0.35;
      if(i===4&&a>0) a*=0.45+0.55*(0.5+0.5*Math.sin(t*1.8));
      var pts=sampleLine(L.type,L.off,t,amp*(isHappy?boost:1));
      if(i===4) strokeSpray(pts,L.color,a,L.w,t);
      else strokeLaser(pts,L.color,a,L.w*(isHappy?boost:1));
    });
  }
  else if(S5.mode==='dots'||S5.mode==='bounce'){
    drawHelix(t, 0.85, 3.2);
    drawDots(t,S5.mode==='bounce');
    if(clipOn){g.restore();clipOn=false;}
    drawHeartEmit(t);
  }
  else if(S5.mode==='peak'){
    if(S5.helixFade>0.01) drawHelix(t, S5.helixFade*0.55, 3.2);
    strokeWeave(sampleLine('happy',0,t*0.5,amp*0.7,S5.peakH||0),0.85,3.4);
  }
  else if(S5.mode==='staff'){ drawHelix(t,0.42,2.4); }
  else if(S5.mode==='crack'){ drawCrack(t); }
  else if(S5.mode==='vanish'){ drawVanish(t); }
  if(clipOn) g.restore();
}
function loop(){ S5.t+=0.016; render(); updateBarrage(); S5.raf=requestAnimationFrame(loop); }

/* ---------- 墨点 ---------- */
function drawDots(t,bounce){
  var E=lineEndpoints(0), sA=E[0], sB=E[1];
  for(var i=0;i<48;i++){
    var u=(i+0.5)/48;
    var bx=sA.x+(sB.x-sA.x)*u, by=sA.y+(sB.y-sA.y)*u;
    var rr=Math.sin(i*12.9898)*43758.5453, rnd=rr-Math.floor(rr);
    var lx=sB.x-sA.x, ly=sB.y-sA.y, L=Math.hypot(lx,ly), nx=-ly/L, ny=lx/L;
    var perp=(rnd-0.5)*52;
    var rr2=Math.sin(i*78.233)*12345.678, rnd2=rr2-Math.floor(rr2);
    g.fillStyle=i%2?'rgba(224,166,180,0.055)':'rgba(143,176,201,0.055)';
    g.globalAlpha=1; g.beginPath(); g.arc(bx+nx*perp,by+ny*perp,1.6+rnd2*3.6,0,Math.PI*2); g.fill();
  }
  while(S5.dots.length<(bounce?20:16)){
    var fromLeft=Math.random()<0.5;
    S5.dots.push({fromLeft:fromLeft,u:fromLeft?0:1,
      speed:(0.3+Math.random()*0.35)*(bounce?1.6:1),
      color:fromLeft?'#e0a6b4':'#8fb0c9', r:3.2+Math.random()*2.8,
      wob:Math.random()*6.28, wobAmp:2+Math.random()*3, trail:[]});
  }
  S5.dots.forEach(function(d){
    d.u+=d.speed*0.016*(bounce?1.7:1);
    if(d.u>1||d.u<0){d.u=d.fromLeft?0:1;d.trail.length=0;}
    var pa=pointAt('happy',0,d.u,t,88*0.9);
    var px=pa[0], py=pa[1];
    var A=S5.hearts.from, B=S5.hearts.to;
    var lx=B.x-A.x, ly=B.y-A.y, L=Math.hypot(lx,ly), nx=-ly/L, ny=lx/L;
    var sw=Math.sin(t*2+d.wob)*d.wobAmp+(d.fromLeft?5:-5);
    px+=nx*sw; py+=ny*sw;
    if(bounce){ px+=(Math.random()-0.5)*46; py+=(Math.random()-0.5)*34; }
    d.trail.push([px,py]); if(d.trail.length>18) d.trail.shift();
    var nT=d.trail.length;
    for(var i=1;i<nT;i++){
      var k=i/nT, a=(1-k)*0.30, w=d.r*(1.6-k*1.1);
      g.strokeStyle=d.color; g.globalAlpha=a; g.lineWidth=Math.max(0.4,w); g.lineCap='round';
      g.beginPath(); g.moveTo(d.trail[i-1][0],d.trail[i-1][1]); g.lineTo(d.trail[i][0],d.trail[i][1]); g.stroke();
    }
    var rgb=hexRgb(d.color);
    var grd=g.createRadialGradient(px,py,0,px,py,d.r*2.4);
    grd.addColorStop(0,'rgba('+rgb.r+','+rgb.g+','+rgb.b+',0.95)');
    grd.addColorStop(0.5,'rgba('+rgb.r+','+rgb.g+','+rgb.b+',0.6)');
    grd.addColorStop(1,'rgba('+rgb.r+','+rgb.g+','+rgb.b+',0)');
    g.fillStyle=grd; g.globalAlpha=1;
    g.beginPath(); g.arc(px,py,d.r*2.4,0,Math.PI*2); g.fill(); g.globalAlpha=1;
  });
}

function heartEdgePointToward(heart, targetX, targetY, k){
  var kk=(k===undefined?1.0:k);
  var dx=targetX-heart.x, dy=targetY-heart.y;
  var dl=Math.hypot(dx,dy)||1;
  var ux=dx/dl, uy=dy/dl;
  var cands=[];
  for(var i=0;i<14;i++){
    var t=Math.random()*Math.PI*2;
    var s=Math.sin(t);
    var px=16*s*s*s;
    var py=13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t);
    var sc=3.8;
    var ex=px*sc*kk;
    var ey=-py*sc*kk;
    var dot=ex*ux+ey*uy;
    if(dot > -2){
      cands.push({x:heart.x+ex, y:heart.y+ey});
    }
  }
  if(cands.length===0){
    return {x:heart.x, y:heart.y};
  }
  return cands[Math.floor(Math.random()*cands.length)];
}
function drawHeartEmit(t){
  var P=S5.hearts.pink, B=S5.hearts.blue;
  var mode=S5.emitSide||'both';
  var fallback = (mode==='pink'||mode==='blue') ? 26 : 46;
  var target = S5.emitTarget || fallback;
  while(S5.heartEmitters.length<target){
    var fromPink;
    if(mode==='pink') fromPink=true;
    else if(mode==='blue') fromPink=false;
    else fromPink=Math.random()<0.5;
    var src=fromPink?P:B, dst=fromPink?B:P;
    var sp=heartEdgePointToward(src, dst.x, dst.y, 1.0);
    var tp=heartEdgePointToward(dst, src.x, src.y, 0.98);
    var maxLife=1.5+Math.random()*0.9;
    S5.heartEmitters.push({
      fromPink:fromPink,
      sx:sp.x, sy:sp.y, tx:tp.x, ty:tp.y,
      life:0, maxLife:maxLife,
      r:2.4+Math.random()*3.6,
      color:fromPink?'#e0a6b4':'#8fb0c9'
    });
  }
  for(var i=S5.heartEmitters.length-1;i>=0;i--){
    var p=S5.heartEmitters[i]; p.life+=0.016;
    if(p.life>p.maxLife){S5.heartEmitters.splice(i,1);continue;}
    var prog=p.life/p.maxLife;
    var ease = 1 - Math.pow(1 - prog, 2);
    var x = p.sx + (p.tx - p.sx) * ease;
    var y = p.sy + (p.ty - p.sy) * ease;
    var alpha;
    if(prog<0.12) alpha=prog/0.12*0.92;
    else if(prog>0.70) alpha=(1-(prog-0.70)/0.30)*0.92;
    else alpha=0.92;
    if(alpha<=0) continue;
    var rr=p.r*(1-prog*0.2);
    var rgb=hexRgb(p.color);
    var grd=g.createRadialGradient(x,y,0,x,y,rr*2.6);
    grd.addColorStop(0,'rgba('+rgb.r+','+rgb.g+','+rgb.b+','+alpha+')');
    grd.addColorStop(0.5,'rgba('+rgb.r+','+rgb.g+','+rgb.b+','+(alpha*0.55)+')');
    grd.addColorStop(1,'rgba('+rgb.r+','+rgb.g+','+rgb.b+',0)');
    g.fillStyle=grd;
    g.beginPath(); g.arc(x,y,rr*2.6,0,Math.PI*2); g.fill();
  }
}
function drawCrack(t){
  var E=lineEndpoints(0), A=E[0], B=E[1];
  var amp=88, N=56, mid=0.5, gap=0.18*S5.crackPhase, ptsL=[], ptsR=[];
  for(var i=0;i<=N;i++){
    var u=i/N, x=A.x+(B.x-A.x)*u, y=A.y+(B.y-A.y)*u+waveY('happy',u,t,amp*0.9);
    if(u<mid-gap/2) ptsL.push([x,y]); else if(u>mid+gap/2) ptsR.push([x,y]);
  }
  if(ptsL.length>1) strokeWeave(ptsL,0.72,3.4);
  if(ptsR.length>1) strokeWeave(ptsR,0.72,3.4);
  if(ptsL.length>1){
    var e1=ptsL[ptsL.length-1];
    g.fillStyle='rgba(230,200,180,0.55)';g.globalAlpha=0.5*S5.crackPhase;
    g.beginPath();g.arc(e1[0],e1[1],3.2,0,Math.PI*2);g.fill();g.globalAlpha=1;
  }
  if(ptsR.length>1){
    var e2=ptsR[0];
    g.fillStyle='rgba(230,200,180,0.55)';g.globalAlpha=0.5*S5.crackPhase;
    g.beginPath();g.arc(e2[0],e2[1],3.2,0,Math.PI*2);g.fill();g.globalAlpha=1;
  }
  var cxp=A.x+(B.x-A.x)*(mid-gap/2), cxm=A.x+(B.x-A.x)*(mid+gap/2);
  var cyp=A.y+(B.y-A.y)*(mid-gap/2)+waveY('happy',mid-gap/2,t,amp*0.9);
  var cym=A.y+(B.y-A.y)*(mid+gap/2)+waveY('happy',mid+gap/2,t,amp*0.9);
  for(var k=0;k<S5.particles.length;k++){
    var p=S5.particles[k]; p.x+=p.vx; p.y+=p.vy; p.life-=0.008;
    var base=p.cold?{x:cxp,y:cyp}:{x:cxm,y:cym};
    if(p.life<=0){
      p.x=base.x+(Math.random()-0.5)*10; p.y=base.y+(Math.random()-0.5)*10;
      p.vx=(Math.random()-0.5)*0.5; p.vy=(Math.random()-0.5)*0.4+(p.cold?0.2:-0.25); p.life=1;
    }
    g.fillStyle=p.cold?'rgba(90,106,122,0.5)':'rgba(216,168,120,0.55)';
    g.globalAlpha=Math.max(0,p.life)*(p.cold?0.5:0.55);
    g.beginPath(); g.arc(p.x,p.y,p.cold?1.8:2.4,0,Math.PI*2); g.fill();
  }
  g.globalAlpha=1;
}
function drawVanish(t){
  var v=S5.vanishPhase;
  var E=lineEndpoints(0), vA=E[0], vB=E[1];
  g.strokeStyle='rgba(180,150,160,0.5)'; g.globalAlpha=0.10*(1-v); g.lineWidth=1;
  g.setLineDash([2,7]); g.beginPath(); g.moveTo(vA.x,vA.y); g.lineTo(vB.x,vB.y); g.stroke();
  g.setLineDash([]); g.globalAlpha=1;
  if(v>=1) return;
  var A=E[0], B=E[1], amp=88*(1-v*0.8), N=56, pts=[];
  for(var i=0;i<=N;i++){
    var u=i/N, x=A.x+(B.x-A.x)*u;
    var y=A.y+(B.y-A.y)*u+waveY('happy',u,t*0.3,amp);
    var fade=1-v*(1.4-0.8*Math.pow(Math.abs(u-0.5)*2,2));
    if(fade<=0.01) continue;
    pts.push([x,y]);
  }
  if(pts.length>1) strokeLaser(pts,'#c8a4b4',Math.max(0,0.6*(1-v)),3.4);
}

/* ---------- 定时 / 段调度 ---------- */
var s5Timers=[];
function later(fn,ms){
  var d = S5.reduced ? Math.min(ms, 260) : ms;
  var id = setTimeout(function(){
    var i = s5Timers.indexOf(id);
    if(i>=0) s5Timers.splice(i,1);
    fn();
  }, d);
  s5Timers.push(id);
  return id;
}
function clearLater(){ s5Timers.forEach(clearTimeout); s5Timers=[]; }

function s5PlaySeg(n){
  clearLater(); clearBarrage(); S5.barrageQueue=[]; clearTexts();
  S5.dots=[]; S5.seg=n; S5.heartEmitters=[];
  S5.emitSide='both'; S5.emitTarget=0; S5.helixFade=0;
  if (window.gsap) { gsap.killTweensOf(S5); gsap.killTweensOf('.s5-heart'); }
  switch(n){
    case 0: case 1: s5Seg1(); break;
    case 2: s5Seg2(); break;
    case 3: s5Seg3(); break;
    case 4: s5Seg4(); break;
    case 5: s5Seg5(); break;
    case 6: s5Seg6(); break;
    case 7: s5Seg7(); break;
    case 8: case 9: s5Seg8(); break;
  }
}

/* ---------- 弹幕 ---------- */
var S5_BARRAGE={
  happy:['哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈妙啊','啊哈哈哈哈哈哈哈哈哈','问了就是我一夜没睡哈哈哈哈哈','hhhhhhhhhhhhhh',
    '哈哈哈哈哈哈哈哈哈哈哈','快乐摸鱼ing','哈哈哈哈我笑飞了','笑死了','啊哈哈红红火火恍恍惚惚哈哈哈哈哈','周末快乐',
    '今日第一好笑','假期快乐大宝贝','爆笑哈哈哈哈','不懂式哈哈哈哈','我giao那种题目哈哈哈哈哈','昨天在学校过了一次超级快乐的生日',
    '考完了数学非常开心','不行真的好好笑','嘿嘿嘿嘿嘿嘿嘿嘿','呜我收到你的信息好开心啊','什么鬼哈哈哈哈','不过还是开心开心',
    '嘿嘿下周也不开学','有好朋友的确是一件很开心的事啊','非常开心的为大家分了房子','笑的要死哈哈哈这个图我一开始还没看懂',
    '笑死了啊啊啊','yeah太好啦太好啦呀呼','什么雷霆表情包哈哈哈哈','我要笑死了','哈哈哈哈哈哈哈哈什么鬼哈哈哈哈什么鬼啊'],
  sad:['啊我哭了','太难过了','难过o(╥﹏╥)o','好难过','心碎了','为什么我真的好伤心','要哭了妈呀','呜呜呜呜呜',
    '我真的会很难过','明天返校 真的会很难过','现在一想到住校就很难过','已经在哭了'],
  anxious:['啊好烦','好烦','好烦哈哈哈','就崩溃','我崩溃了','好累','好崩溃 作业又要写不完','开始焦虑','突然焦虑',
    '好累好累这有什么意义啊','我有开学焦虑症','唉好焦虑啊','是不是工作压力太大了'],
  angry:['气死我了','无语','迷魂药气死我了','我直接无语','给我恶心坏了','无语住了','这个更加离谱了','好恶心','就很奇怪很恶心',
    '就真的好恶心啊啊','就真的很离谱','实在是离谱','啊这这也太无语了吧','虽然觉得这一首仔细想来怪恶心的','神经病吧','神经啊',
    '？不儿神经病啊','要不然你们都滚啊啊啊啊','我立马就无语了。。。。','真的很无语诶。。。。。','被占座的人气死了','我气死了呜呜呜呜',
    '教务系统点不开垃圾学校','但是远远没有中央财经大学神经','真的觉得这个学校有病','神经病'],
  touched:['我真的是泪目了','真好呀','真好啊','太好了[流泪]','同学们都好温柔好好耶','很感动但又笑的很开心','我当时快感动哭了',
    '呜呜呜呜他真好','看完就会很感动','天哪','我的天','哇塞','感动哭了要','啊啊啊啊这也太感动了吧','爱我的人 我真的谢谢你🥹好想哭']
};
function samplePt(type,off,u,t,amp){
  var P=S5.hearts.from,Q=S5.hearts.to;
  var dx=Q.x-P.x,dy=Q.y-P.y,len=Math.hypot(dx,dy),nx=-dy/len,ny=dx/len;
  var spread=Math.pow(Math.sin(Math.PI*u),0.55)*120*off;
  var edge=Math.sin(Math.PI*u), wv=waveY(type,u,t,amp);
  var x=P.x+dx*u+nx*spread, y=P.y+dy*u+ny*spread;
  return [x+nx*wv*edge, y+ny*wv*edge];
}
var S5_BASE_ANG=Math.atan2(S5.hearts.to.y-S5.hearts.from.y,
                            S5.hearts.to.x-S5.hearts.from.x)*180/Math.PI;
var LANE_OFFS=[-44,-22,0,22,44];
var BARRAGE_SPEED=0.0052;
var LAUNCH_MIN_MS=300;
var LINE_LEN=Math.hypot(S5.hearts.to.x-S5.hearts.from.x,S5.hearts.to.y-S5.hearts.from.y);
function initLanes(){
  S5.lanes={};
  ['happy','sad','angry','anxious','touched'].forEach(function(k){
    S5.lanes[k]=[];
    for(var i=0;i<LANE_OFFS.length;i++) S5.lanes[k].push({b:null,need:0});
  });
}
function textDelta(text,size){
  g.save();
  g.font=size+'px "PingFang SC","Noto Serif SC",serif';
  var w=g.measureText(text).width;
  g.restore();
  return (w+30)/LINE_LEN;
}
function queueBarrage(type,off,list,color){
  list.forEach(function(txt){
    S5.barrageQueue.push({type:type,off:off,text:txt,color:color,size:18});
  });
}
function tryLaunch(){
  if(!S5.barrageQueue.length) return;
  var now=performance.now();
  if(now-S5.lastLaunch<LAUNCH_MIN_MS) return;
  var item=S5.barrageQueue[0];
  var lanes=S5.lanes[item.type];
  if(!lanes) { S5.barrageQueue.shift(); return; }
  for(var i=0;i<lanes.length;i++){
    var L=lanes[i];
    if(L.b===null || L.b.u>=L.need){
      var el=document.createElement('div');
      el.className='s5-txt s5-barrage';
      el.textContent=item.text;
      el.style.fontSize=item.size+'px';
      el.style.color=item.color;
      el.style.opacity=0;
      textLayer.appendChild(el);
      var b={el:el,type:item.type,off:item.off,u:0,sp:BARRAGE_SPEED,noff:LANE_OFFS[i]};
      S5.barrage.push(b);
      L.b=b;
      var need=textDelta(item.text,item.size)+0.05;
      L.need=need<0.10?0.10:need;
      S5.lastLaunch=now;
      S5.barrageQueue.shift();
      return;
    }
  }
}
function waitBarrageDone(cb,maxMs){
  var t0=performance.now();
  (function check(){
    if(!S5.barrageQueue.length && !S5.barrage.length){ cb(); return; }
    if(performance.now()-t0>(maxMs||120000)){ cb(); return; }
    later(check,150);
  })();
}
function clearBarrage(){
  S5.barrage.forEach(function(b){ if(b.el&&b.el.parentNode) b.el.parentNode.removeChild(b.el); });
  S5.barrage=[];
}
function updateBarrage(){
  tryLaunch();
  if(!S5.barrage.length) return;
  var amp=112;
  var P=S5.hearts.from,Q=S5.hearts.to;
  var dx=Q.x-P.x,dy=Q.y-P.y,len=Math.hypot(dx,dy),nx=-dy/len,ny=dx/len;
  for(var i=S5.barrage.length-1;i>=0;i--){
    var b=S5.barrage[i];
    if(!b.el.parentNode){ S5.barrage.splice(i,1); continue; }
    b.u+=b.sp;
    if(b.u>=1.02){ if(b.el.parentNode) b.el.parentNode.removeChild(b.el); S5.barrage.splice(i,1); continue; }
    var pt=samplePt(b.type,b.off,b.u,S5.t,amp);
    var pt2=samplePt(b.type,b.off,Math.min(1,b.u+0.02),S5.t,amp);
    var local=Math.atan2(pt2[1]-pt[1],pt2[0]-pt[0])*180/Math.PI;
    var rot=S5_BASE_ANG+(local-S5_BASE_ANG)*0.12;
    var x=pt[0]+nx*b.noff, y=pt[1]+ny*b.noff;
    var k=b.u;
    var a=(k<0.12)?(k/0.12):((k>0.85)?((1.02-k)/0.17):1);
    b.el.style.opacity=Math.max(0,Math.min(1,a))*0.85;
    b.el.style.left=x+'px'; b.el.style.top=y+'px';
    b.el.style.transform='translate(-50%,-50%) rotate('+rot+'deg)';
  }
}
function makePct(cfg){
  var el=document.createElement('div');
  el.className='s5-pct';
  el.style.left='520px'; el.style.top='1150px';
  el.style.color=cfg.pc;
  el.style.setProperty('--c',cfg.rgb);
  el.innerHTML='<div class="s5-pct-emo">'+cfg.emo+'</div>'+
               '<div class="s5-pct-num">'+cfg.num+'</div>'+
               '<div class="s5-pct-desc">'+cfg.desc+'</div>';
  textLayer.appendChild(el);
  requestAnimationFrame(function(){
    requestAnimationFrame(function(){ el.classList.add('in'); });
  });
  return el;
}
function hidePct(el){
  el.classList.remove('in');
  el.style.opacity=0;
  setTimeout(function(){ if(el.parentNode) el.parentNode.removeChild(el); },1600);
}

/* ================= 真实语料 ================= */
var S5_MIRROR_FULL=[
['2020-08-23','太难过了','太难过了'],['2020-08-23','晚安美女子','晚安美女子'],['2020-08-25','实际：','实际？'],
['2020-08-31','巴陵郡','巴陵郡？'],['2020-08-31','我也想要','我也想要'],['2020-08-31','牛肉面','牛肉面🐮'],
['2020-09-01','啊哈哈哈哈','啊哈哈哈哈'],['2020-10-05','060928','060928'],['2020-10-05','想到','想到'],
['2021-01-28','假期快乐！','假期快乐'],['2021-01-31','哈哈哈哈哈哈哈哈哈哈哈','哈哈哈哈哈哈哈哈哈哈哈'],
['2021-04-05','字好看！','字好看'],['2021-06-05','好快','好快'],['2021-08-08','好猛','好猛'],
['2021-09-19','中秋快乐！！！','中秋快乐！'],['2021-10-01','mi manchi','mi manchi'],['2021-10-04','睡到现在','睡到现在？'],
['2021-10-23','然后！','然后！'],['2021-11-06','耶！','耶！'],['2022-02-11','双休？','双休'],
['2022-03-06','“形式主义”','形式主义'],['2022-03-06','下周见','下周见'],['2022-03-13','“内容不太对”','“内容不太对”'],
['2022-03-13','什么','什么？'],['2022-03-13','六张桌子','六张桌子'],['2022-03-23','哥白尼！','哥白尼'],
['2022-03-27','晚安','晚安'],['2022-03-27','麻了','麻了'],['2022-04-07','啊','啊？'],
['2022-06-06','明天我就','明天我就'],['2022-06-07','哈哈哈哈哈哈哈哈','哈哈哈哈哈哈哈哈'],['2022-07-15','尚能饭否','尚能饭否'],
['2022-07-21','可恶','可恶'],['2022-07-25','啊','啊'],['2022-08-28','嗯哼？','嗯哼'],
['2022-08-28','饭都没有','饭都没有'],['2022-10-09','乌纱帽更重要','乌纱帽更重要'],['2022-12-30','啊','啊'],
['2023-01-22','新年快乐！','新年快乐！！'],['2023-06-13','早起卡！','早起卡'],['2023-07-02','一周两节～','一周两节'],
['2023-07-03','太酷啦','太酷啦'],['2023-07-08','有丝分裂','有丝分裂'],['2023-07-24','华为——','华为'],
['2023-08-10','好酷啊','好酷啊'],['2023-08-24','救……','救'],['2023-12-24','平安夜快乐','平安夜快乐'],
['2024-01-19','交错带','交错带'],['2024-02-02','Larry','Larry？'],['2024-02-07','乐','乐'],
['2024-02-17','电子闺蜜','电子闺蜜'],['2024-04-19','俄罗斯','俄罗斯'],['2024-05-15','云片糕','云片糕'],
['2024-05-20','晚安宝宝','晚安宝宝'],['2024-07-19','买它','买它'],['2024-07-26','好事多磨','好事多磨！！！'],
['2024-08-29','晚上','晚上'],['2024-08-31','晚安宝宝！','晚安宝宝'],['2024-10-20','我嘞个五万四','我嘞个五万四'],
['2024-12-11','啊？','啊？'],['2025-05-08','越南米粉！','越南米粉'],['2025-06-17','财到','财到'],
['2025-07-14','飞来飞去','飞来飞去'],['2025-08-01','好想吃腊罗巴','好想吃腊罗巴'],['2025-08-16','天哪','天哪'],
['2025-09-23','怎么做到的','怎么做到的'],['2025-09-29','好突然','好突然'],['2025-10-19','想去长白山','想去长白山'],
['2025-10-19','晕倒了','晕倒了'],['2025-11-15','王冰冰吃过的面馆','王冰冰吃过的面馆'],['2025-11-27','我也想当网红','我也想当网红。'],
['2026-01-01','新年快乐','新年快乐！！！！'],['2026-01-01','新的一年越来越好🥳','新的一年越来越好'],['2026-01-01','越来越好','越来越好'],
['2026-01-02','好漂亮','好漂亮'],['2026-01-23','社会主义好啊','社会主义好啊'],['2026-01-24','然后','然后'],
['2026-03-26','真好','真好'],['2026-05-24','先学着','先学着'],['2026-05-24','加油加油加油','加油加油加油'],
['2026-06-02','offer请全部降临江琳手心','offer请全部降临江琳手心'],['2026-06-30','鸟巢你对我们好一次吧','鸟巢你对我们好一次吧'],
['2026-07-21','好想开票','好想开票'],['2026-07-24','ohno','ohno'],['2026-07-24','希望薛之谦一直唱','希望薛之谦一直唱'],
['2026-07-27','明天怎么要上班','明天怎么要上班'],['2026-07-31','不准','不准'],['2026-08-02','我靠？！','我靠'],
['2026-08-03','不够','不够'],['2026-08-03','不够','不够'],['2026-08-03','这个包我会用的','这个包我会用的'],
['2026-08-03','梦幻联动','梦幻联动'],['2026-08-04','杭州','杭州'],['2026-08-06','哇呀呀呀！','哇呀呀呀！！'],
['2026-08-06','太美味了','太美味了'],['2026-08-07','三开仙人驾到','三开仙人驾到'],['2026-08-08','浓度过高','浓度过高'],
['2026-08-09','希望有爽快的人','希望有爽快的人'],['2026-08-09','这才是真正的3亿黑屏','这才是真正的3亿黑屏'],
['2026-08-10','六年了！','六年了！'],['2026-08-10','上大学了','上大学了']
];
var S5_PRONOUN=[
['2020-08-22','而你','而我'],
['2023-01-01','祝我好运','祝你好运'],
['2026-04-07','你的窗户呢','我的窗户呢'],
['2026-07-22','我的大麦咋了','你的大麦咋了']
];
var S5_PEAK=[
{t:'04:01',w:'j',s:'宝宝你还没睡啊'},
{t:'04:01',w:'z',s:'宝宝我差不多能听懂85%的听力了'},
{t:'04:01',w:'j',s:'完全睡不着'},
{t:'04:01',w:'j',s:'闭眼就是保研'},
{t:'04:01',w:'z',s:'你别焦虑'},
{t:'04:01',w:'z',s:'明天的烦恼交给明天'},
{t:'04:03',w:'j',s:'如听天书'},
{t:'04:03',w:'j',s:'今天起床就听听力'},
{t:'04:05',w:'z',s:'伟大进步'},
{t:'04:36',w:'j',s:'看到保研两个字就眼红了'},
{t:'04:41',w:'j',s:'宝宝你每天都这么晚睡吗'},
{t:'04:55',w:'z',s:'我也能吹一辈子'},
{t:'04:56',w:'z',s:'接下来我的大学生活只有转专业和保研了'},
{t:'04:56',w:'j',s:'我要保研求求你了我一定会努力学习的'},
{t:'04:58',w:'j',s:'北京欢迎你　宝宝我带你吃好吃的'}
];
var S5_SYNC=[
{time:'2024-07-12 14:55',lines:[
  ['z','我没吃早饭'],['j','我上次看到一大堆肯德基麦当劳送上车'],['z','已饿晕'],['j','我天'],
  ['z','我点的！盐水鸭！'],['j','我以为你只是没吃'],['z','可能快餐可以'],['j','还有站吗'],
  ['z','我的鸭可能现杀有点慢（'],['j','还有可以点的吗'],['j','不要饿晕了'],['z','我有小面包！'],
  ['j','[捂脸][捂脸][捂脸]…'],['z','已炫一包'],['j','现卤的'],['z','我不是面包脑袋']
]},
{time:'2024-11-30 16:33',lines:[
  ['j','怎么会这样sad'],['z','sad'],['j','就像我以为我可以和我的朋友明天玩一天'],['z','然后我想去桂林路'],
  ['j','结果她只预留了和我拍视频，还有吃饭的时间'],['z','我约了所有我想到的人'],['j','然后我问他明天晚上吃啥'],['z','0人有空'],
  ['j','他跟我说吃食堂'],['z','[表情]'],['z','[表情]'],['j','Oh my god，非常sad'],
  ['z','田娜'],['j','如果我想去一个地方的话'],['z','我现在在回家的路上'],['j','我觉得一定要有人陪我，我一个人去就没意思了']
]}
];
function dropEl(el,ms){ later(function(){ if(el&&el.parentNode) el.parentNode.removeChild(el); },ms); }

var S5_SOLO=[
{who:'z',time:'2023-11-14',lines:[
'好忙碌的大学生','又做了一个梦','梦见我是某当红男团成员（成员都是血缘上的亲兄弟？）','然后刚好有一天学校放假公司也放假',
'还是新疆的沙滩','躺在沙地里日光浴，看到很大的热气球升起来','载游客的那种','然后热气球突然爆了坠落下来',
'零食、保温杯、雨伞什么的一起砸下来','天空就下起杂物雨','然后我在炽热的沙滩上烤着，丧失了部分智力','洋洋洒洒写了一篇凰文',
'《当代年轻人如何在热气球上xx》','发在 wb 上','醒来已经是在返程的车上，其他兄弟拿着我的手机看','发现那篇不到半天阅读破千万',
'但是因为 xx 被举报','官方还把我的号挂出来批评','噢我还中途真的醒了一次','怕我现实中真的身败名裂',
'梦中的我醒来，害怕我男团成员的身份暴露，然后被骂退圈','然后我就紧急炸号','我在梦中的小脑袋真的全是黄色废料','玩四阶魔方，但上面没有颜色只有汉字',
'每一行每一列都是一个成语','也不知道现实中有没有这样的魔方','我拼出来的都是——的词','天啊我记得我写的非常酣畅淋漓🤣'
]},
{who:'j',time:'2023-08-16',lines:[
'我也做了一个梦','梦见好像是要带我们一行人出去玩','结果把我们打包到大伯车之后','就往雪漠里面去开',
'然后把我们放在雪漠里面，让我们自己走出来','然后出来的路上我们见到了一个湖泊','雪地里的虎皮','然后靠近其实是一面巨大的玻璃镜子',
'然后我们继续往前走','挖到了大概是抗战时期老百姓为我们埋下来的食物','最终我们还是走出大漠了','发现这一趟算是额，设计好的那种项目',
'回去到了学校还叫我们文艺汇演','然后我们就把途中的所见所闻，编排成了节目','其中一个节目讲的是化蛹成蝶','但是主创人很巧妙地改编了节目',
'但是我看到的只是台台上一坨蛆在扭','啊这啊我不懂啊我还是没懂','我基本都是在梦里放弃数学题'
]}
];
var SOLO_SLOTS=[420, 480, 540, 600, 660, 720];
function playSolo(lines,who,startT,step){
  var side = who==='z' ? 296 : 454;
  var col  = who==='z' ? 'rgba(224,166,180,0.95)' : 'rgba(143,176,201,0.98)';
  lines.forEach(function(txt,i){
    later(function(){
      var y = SOLO_SLOTS[i % SOLO_SLOTS.length];
      var el = s5Txt({text:txt, x:side, y:y, color:col, size:18, wrap:true});
      el.style.maxWidth='318px';
      fadeIn(el, 0.30);
      later(function(){
        fadeOut(el, 0.40);
        dropEl(el, 460);
      }, 1800);
    }, startT + i*step);
  });
}

var STAFF_PINK=[-0.55,-0.26,-0.62,-0.30,-0.52,-0.25,-0.60,-0.28];
var STAFF_BLUE=[ 0.26, 0.55, 0.30, 0.62, 0.25, 0.52, 0.28, 0.60];
function staffSize(txt){
  var u=0;
  for(var i=0;i<txt.length;i++) u += (txt.charCodeAt(i)>0x2E80)?1:0.55;
  var cand=[20,18,16,14.5,13];
  for(var k=0;k<cand.length;k++) if(u*cand[k]<=200) return cand[k];
  return 13;
}
var MP_CYCLE=2150, MP_HOLD=1500, MP_STAGGER=45;
function playMirrorPages(rows,midText,startT,done,off){
  var total=rows.length, per=STAFF_PINK.length;
  var pages=Math.ceil(total/per), pi=0;
  var offPink=off?off.pink:STAFF_PINK, offBlue=off?off.blue:STAFF_BLUE;
  function showPage(){
    if(pi>=pages){ if(done) later(done,420); return; }
    var st=pi*per, batch=rows.slice(st,st+per), n=batch.length;
    var c=STAFF_PINK.length, off0=Math.floor((c-n)/2);
    var els=[];
    batch.forEach(function(r,i){
      later(function(){
        var up = 0.10 + (n>1 ? i/(n-1) : 0.5)*0.80;
        var ub = 0.10 + (n>1 ? (i+0.5)/(n-1) : 0.5)*0.80;
        var pIdx = off ? (st+i) : (off0+i);
        var e1=lineText(offPink[pIdx],'happy',r[1],'#e0a6b4',staffSize(r[1]),0,up);
        var e2=lineText(offBlue[pIdx],'happy',r[2],'#8fb0c9',staffSize(r[2]),0,ub);
        fadeIn(e1,0.34); fadeIn(e2,0.34,0.08);
        els.push(e1,e2);
      },i*MP_STAGGER);
    });
    later(function(){
      els.forEach(function(e){ fadeOut(e,0.35); dropEl(e,460); });
      pi++;
      later(showPage,200);
    }, MP_HOLD + n*MP_STAGGER - 260);
  }
  later(showPage,startT);
  return startT+pages*MP_CYCLE+500;
}

/* ========== 段1 · 情绪气象图 ========== */
function s5Seg1(){
  S5.mode='five'; S5.clicked=false; S5.happyBoost=1; S5.focus=-1;
  clearBarrage(); S5.barrageQueue=[]; initLanes();
  gsap.to('.s5-heart',{opacity:1,duration:0.9,overwrite:true});
  later(function(){ S5.LINES[0].target=1; },300);
  later(function(){ S5.LINES[1].target=1; },800);
  later(function(){ S5.LINES[2].target=1; },1300);
  later(function(){ S5.LINES[3].target=1; },1800);
  later(function(){ S5.LINES[4].target=1; },2300);
  var segs=[
    {idx:0,off:-2,type:'happy',  list:S5_BARRAGE.happy,   emo:'开心', num:'5.0%', desc:'占全部消息', rgb:'200,120,130', pc:'rgba(200,120,130,0.92)', bc:'rgba(200,120,130,0.78)'},
    {idx:1,off:-1,type:'sad',    list:S5_BARRAGE.sad,     emo:'难过', num:'1.0%', desc:'平均占比',   rgb:'100,132,165', pc:'rgba(100,132,165,0.92)', bc:'rgba(120,150,180,0.76)'},
    {idx:2,off:0, type:'angry',  list:S5_BARRAGE.angry,   emo:'愤怒', num:'0.3%', desc:'平均占比',   rgb:'176,124,110', pc:'rgba(176,124,110,0.92)', bc:'rgba(190,140,128,0.76)'},
    {idx:3,off:1, type:'anxious',list:S5_BARRAGE.anxious, emo:'焦虑', num:'0.4%', desc:'平均占比',   rgb:'186,142,98',  pc:'rgba(186,142,98,0.92)',  bc:'rgba(200,160,120,0.76)'},
    {idx:4,off:2, type:'touched',list:S5_BARRAGE.touched, emo:'感动 / 惊讶', num:'0.8%', desc:'平均占比', rgb:'168,124,158', pc:'rgba(168,124,158,0.92)', bc:'rgba(185,140,175,0.74)'}
  ];
  var i=0;
  function playLine(){
    if(i>=segs.length){ later(function(){ s5Seg1Click(); },500); return; }
    var s=segs[i];
    S5.focus=s.idx;
    var pct=makePct(s);
    queueBarrage(s.type,s.off,s.list,s.bc);
    waitBarrageDone(function(){
      hidePct(pct);
      later(function(){ S5.focus=-2; i++; playLine(); },900);
    }, s.list.length*3500+30000);
  }
  later(playLine,3300);
}
function s5Seg1Click(){
  if(S5.clicked) return; S5.clicked=true; S5.mode='fiveClicked';
  clearBarrage();
  gsap.to(S5,{happyBoost:1.25,duration:1.4,ease:'power2.out',overwrite:true});
  var fadeSeq=[1,3,2,4];
  fadeSeq.forEach(function(idx,i){ later(function(){ S5.LINES[idx].target=0; },150+i*260); });
  var c1=s5Txt({text:'我们之间，绝大多数时候是晴天。',x:375,y:590,color:'rgba(74,62,58,0.9)',size:27});
  later(function(){fadeIn(c1,0.9);},1300);
  later(function(){
    var cn=s5Txt({text:'全部消息里 92.5% 是日常闲聊；在有情绪的 7.5% 里，开心占了近七成！',x:375,y:660,color:'rgba(74,62,58,0.6)',size:21,wrap:true});
    fadeIn(cn,0.8);
    later(function(){
      var c2=s5Txt({text:'最快乐的月份 · 2020-12 · 开心 12.9%',x:375,y:730,color:'rgba(74,62,58,0.62)',size:19});
      fadeIn(c2,0.8);
      later(function(){
        fadeOut(c1,0.7); fadeOut(cn,0.7); fadeOut(c2,0.7);
        later(function(){s5PlaySeg(2);},800);
      },3000);
    },1800);
  },2800);
}

/* ========== 段2 · 谁开头，谁收尾 ========== */
function s5Seg2(){
  S5.mode='matrix'; S5.hoverIdx=-1; S5.matrixPin=-1; S5.dragging=false; S5.matrixPhase=0;
  gsap.to(S5,{matrixPhase:1,duration:2.2,ease:'power2.out',overwrite:true});
  later(function(){
    var a=s5Txt({text:'六年 1,481 个有聊天的日子：',x:375,y:568,color:'rgba(74,62,58,0.72)',size:20}); fadeIn(a,0.8);
    var b=s5Txt({text:'小周开头 843 次（57%）· 江江开头 638 次（43%）',x:375,y:630,color:'rgba(224,166,180,0.98)',size:22}); fadeIn(b,0.8,0.25);
    var c=s5Txt({text:'小周收尾 992 次（67%）· 江江收尾 489 次（33%）',x:375,y:692,color:'rgba(143,176,201,0.98)',size:22}); fadeIn(c,0.8,0.5);
    later(function(){ fadeOut(a,0.6); fadeOut(b,0.6); fadeOut(c,0.6); },3000);
  },2400);
  later(function(){
    var d=s5Txt({text:'这 73 个小点，是 73 个月：\n粉点=小周开头，蓝点=江江开头\n（轻触任意一个小圆点查看）',x:375,y:600,color:'rgba(74,62,58,0.65)',size:22,wrap:true});
    fadeIn(d,0.8);
    later(function(){
      fadeOut(d,0.6);
      later(function(){ s5PlaySeg(3); },1000);
    },4600);
  },6100);
}

/* ========== 段3 · 语言镜像 ========== */
function s5Seg3(){
  S5.mode='staff';
  later(function(){
    var t=s5Txt({text:'六年里，一字不差复读对方 · '+S5_MIRROR_FULL.length+' 次',x:375,y:640,color:'rgba(74,62,58,0.8)',size:24});
    fadeIn(t,0.9); later(function(){fadeOut(t,0.6); dropEl(t,700);},2400);
  },900);

  var tEnd = playMirrorPages(
    S5_MIRROR_FULL.filter(function(r){return r[1]!=='offer请全部降临江琳手心';}),
    '', 3500, null);

  var offerRow = S5_MIRROR_FULL.filter(function(r){return r[1]==='offer请全部降临江琳手心';})[0];
  later(function(){
    var e1=lineText(STAFF_PINK[3],'happy',offerRow[1],'#e0a6b4',staffSize(offerRow[1])+4,0,0.5);
    var e2=lineText(STAFF_BLUE[3],'happy',offerRow[2],'#8fb0c9',staffSize(offerRow[2])+4,0,0.52);
    fadeIn(e1,0.5); fadeIn(e2,0.5,0.1);
    later(function(){ fadeOut(e1,0.6); fadeOut(e2,0.6); dropEl(e1,650); dropEl(e2,650); },2700);
  }, tEnd);

  later(function(){
    var t=s5Txt({text:'还有 '+S5_PRONOUN.length+' 次，只换了一个字',x:375,y:640,color:'rgba(74,62,58,0.8)',size:24});
    fadeIn(t,0.9); later(function(){fadeOut(t,0.6); dropEl(t,700);},2200);
  }, tEnd+3400);

  playMirrorPages(S5_PRONOUN,'↔', tEnd+3400+2800, function(){ seg3Tail(); },
    { pink:[-0.40,-0.40,-0.40,-0.40], blue:[0.40,0.40,0.40,0.40] });
}
function seg3Tail(){
  var s1=s5Txt({text:'全部 37,951 段里，平均每段 2.42 条；',x:375,y:576,color:'rgba(74,62,58,0.68)',size:20});
  var s2=s5Txt({text:'42% 是单条段，81% 在 3 条以内',x:375,y:626,color:'rgba(74,62,58,0.62)',size:20});
  var s2b=s5Txt({text:'就这样喷射式发言！',x:375,y:672,color:'rgba(74,62,58,0.78)',size:22});
  fadeIn(s1,0.7); fadeIn(s2,0.7,0.25); fadeIn(s2b,0.7,0.5);
  later(function(){ fadeOut(s1,0.5); fadeOut(s2,0.5); fadeOut(s2b,0.5); dropEl(s1,600); dropEl(s2,600); dropEl(s2b,600); },3200);
  later(function(){
    var c=s5Txt({text:'我们是彼此的复读机。',x:375,y:640,color:'rgba(74,62,58,0.9)',size:28});
    fadeIn(c,0.9);
    later(function(){ fadeOut(c,0.8); later(function(){s5PlaySeg(4);},700); },2500);
  },4200);
}

/* ========== 段4 · 回复速度 ========== */
function s5Seg4(){
  S5.mode='dots'; S5.dots=[];
  S5.emitSide='both';
  S5.emitTarget=8;
  var YEAR_MED=[['2020','11s'],['2021','13s'],['2022','10s'],['2023','10s'],['2024','8s'],['2025','8s'],['2026','11s']];
  var title=s5Txt({text:'回复中位数 · 8–13 秒（逐年）',x:375,y:585,color:'rgba(74,62,58,0.7)',size:21});
  later(function(){ fadeIn(title,0.7); },2600);
  var medEls=[];
  var speedSummary=[];
  YEAR_MED.forEach(function(ym,i){
    var x=70+i*100;
    var yl=s5Txt({text:ym[0],x:x,y:638,color:'rgba(74,62,58,0.55)',size:16});
    var sl=s5Txt({text:ym[1],x:x,y:670,color:(ym[1]==='8s'?'rgba(224,166,180,0.98)':'rgba(74,62,58,0.85)'),size:22});
    medEls.push(yl,sl);
    later(function(){ fadeIn(yl,0.5); fadeIn(sl,0.5,0.15); },3000+i*120);
  });
  later(function(){
    /* 先收起逐年数据，再单独呈现摘要，避免同一时序里上下叠字。 */
    medEls.forEach(function(el){ fadeOut(el,0.55); });
    var n=s5Txt({text:'大多数消息，一分钟内回复 · 约 80%',x:375,y:760,color:'rgba(74,62,58,0.68)',size:23});
    speedSummary.push(n); fadeIn(n,0.7,0.25);
    later(function(){
      var rows=[
        ['逐年最快：2024 / 2025 年 · 8 秒',838],
        ['逐年最慢：2021 年 · 13 秒',914],
        ['其余年份：10–11 秒',990]
      ];
      rows.forEach(function(row,i){
        var el=s5Txt({text:row[0],x:375,y:row[1],color:'rgba(74,62,58,0.5)',size:22});
        speedSummary.push(el); fadeIn(el,0.6,i*0.22);
      });
    },850);
  },7000);
  later(function(){
    fadeOut(title,0.6);
    speedSummary.forEach(function(el){ fadeOut(el,0.6); });
  },11600);
  later(function(){
    var a=s5Txt({text:'最长的一次等待：2023-05-17 ～ 06-05 · 459.6 小时',x:375,y:588,color:'rgba(74,62,58,0.68)',size:22,wrap:true}); fadeIn(a,0.7);
    var b=s5Txt({text:'（等待学姐高考中……）',x:375,y:656,color:'rgba(224,166,180,0.98)',size:21,wrap:true}); fadeIn(b,0.7,0.3);
    later(function(){ fadeOut(a,0.5); fadeOut(b,0.5); },3200);
  },14000);
  later(function(){
    var d=s5Txt({text:'2024 年起，最长的等待也没有超过 130.5 小时（<5.5 天）\n——再也没有几周的长失联。',x:375,y:640,color:'rgba(74,62,58,0.6)',size:22,wrap:true,width:680});
    d.style.maxWidth='680px';
    fadeIn(d,0.7); later(function(){fadeOut(d,0.5);},2800);
  },18400);
  later(function(){
    var c=s5Txt({text:'我们几乎永远在第一时间回应对方。',x:375,y:640,color:'rgba(74,62,58,0.9)',size:28});
    fadeIn(c,0.9);
    later(function(){ fadeOut(c,0.8); later(function(){s5PlaySeg(5);},700); },2400);
  },22000);
}

/* ========== 段5 · 刷屏 ========== */
function s5Seg5(){
  S5.mode='bounce'; S5.dots=[]; S5.heartEmitters=[];
  S5.emitSide='pink'; S5.emitTarget=26;

  later(function(){
    var h=s5Txt({text:'一个人刷',x:375,y:300,color:'rgba(74,62,58,0.42)',size:17});
    fadeIn(h,0.6); later(function(){fadeOut(h,0.5); dropEl(h,600);},2600);
  },500);

  later(function(){
    var t=s5Txt({text:'2023-11-14 · 小周一口气发了 45 条',x:375,y:352,color:'rgba(74,62,58,0.72)',size:21});
    fadeIn(t,0.7); later(function(){fadeOut(t,0.5); dropEl(t,600);},3000);
  },1600);
  playSolo(S5_SOLO[0].lines,'z',2300,380);

  later(function(){
    S5.emitSide='blue'; S5.emitTarget=26;
    S5.heartEmitters=[];
    var t=s5Txt({text:'2023-08-16 · 江江一口气发了 27 条',x:375,y:352,color:'rgba(74,62,58,0.72)',size:21});
    fadeIn(t,0.7); later(function(){fadeOut(t,0.5); dropEl(t,600);},3000);
  },12500);
  playSolo(S5_SOLO[1].lines,'j',13200,380);

  later(function(){
    var n1=s5Txt({text:'5 分钟内连发 4 条以上 · 5706 次',x:375,y:600,color:'rgba(74,62,58,0.68)',size:23}); fadeIn(n1,0.7);
    later(function(){
      var n2=s5Txt({text:'连发 11 条以上 · 337 段',x:375,y:660,color:'rgba(74,62,58,0.6)',size:22}); fadeIn(n2,0.7);
      later(function(){
        fadeOut(n1,0.5); fadeOut(n2,0.5); dropEl(n1,600); dropEl(n2,600);
        later(function(){
          var n3=s5Txt({text:'2 小时内 ≥11 条的刷屏事件：小周 96 段 · 江江 84 段',x:375,y:640,color:'rgba(74,62,58,0.62)',size:20}); fadeIn(n3,0.7);
          later(function(){ fadeOut(n3,0.5); dropEl(n3,600); },2600);
        },700);
      },2300);
    },1600);
  },21500);

  later(function(){
    S5.emitSide='both'; S5.emitTarget=46;
    var h=s5Txt({text:'两个人一起刷',x:375,y:300,color:'rgba(74,62,58,0.42)',size:17});
    var d=s5Txt({text:'一分钟 16 条 · 14 次交替',x:375,y:344,color:'rgba(74,62,58,0.72)',size:22});
    fadeIn(h,0.6); fadeIn(d,0.7,0.25);
    later(function(){fadeOut(h,0.5); fadeOut(d,0.5); dropEl(h,600); dropEl(d,600);},3200);
  },25500);

  var base=[26600, 36100];
  S5_SYNC.forEach(function(seg,si){
    var lines=seg.lines;
    later(function(){
      var t=s5Txt({text:seg.time,x:375,y:382,color:'rgba(74,62,58,0.5)',size:16});
      fadeIn(t,0.6); later(function(){fadeOut(t,0.5); dropEl(t,600);},3200);
    },base[si]);
    lines.forEach(function(L,i){
      later(function(){
        var col=L[0]==='z'?'rgba(224,166,180,0.92)':'rgba(143,176,201,0.95)';
        var x=L[0]==='z'?318:432;
        var y=420+i*29.4;
        var el=s5Txt({text:L[1],x:x,y:y,color:col,size:17});
        fadeIn(el,0.3);
        later(function(){ fadeOut(el,0.5); dropEl(el,600); },3000);
      },base[si]+500+i*280);
    });
  });

  later(function(){
    var c=s5Txt({text:'一激动，就谁也拦不住地刷屏。',x:375,y:588,color:'rgba(74,62,58,0.9)',size:26}); fadeIn(c,0.9);
    var c2=s5Txt({text:'有时候是一个人停不下来，有时候是我们两个一起停不下来。',x:375,y:648,color:'rgba(74,62,58,0.65)',size:21,wrap:true}); fadeIn(c2,0.9,0.3);
    var c3=s5Txt({text:'——每一句都接得住，这才是我们。',x:375,y:706,color:'rgba(74,62,58,0.78)',size:21,wrap:true}); fadeIn(c3,0.9,0.6);
    later(function(){
      fadeOut(c,0.8); fadeOut(c2,0.8); fadeOut(c3,0.8);
      later(function(){s5PlaySeg(6);},700);
    },3000);
  },44600);
}

/* ========== 段6 · 消息密度巅峰 ========== */
function s5Seg6(){
  S5.mode='peak'; S5.peakH=0;
  S5.helixFade=1;
  gsap.to(S5,{peakH:95,duration:3.2,ease:'power1.inOut',overwrite:true});
  gsap.to(S5,{helixFade:0,duration:2.8,ease:'power2.inOut',overwrite:true});

  later(function(){
    var n1=s5Txt({text:'2024-08-19 · 凌晨 4 点',x:375,y:596,color:'rgba(74,62,58,0.7)',size:22}); fadeIn(n1,0.7);
    later(function(){
      var n2=s5Txt({text:'一小时 · 397 条 · 平均每 9 秒一条',x:375,y:648,color:'rgba(74,62,58,0.72)',size:22}); fadeIn(n2,0.7);
      later(function(){ fadeOut(n1,0.5); fadeOut(n2,0.5); dropEl(n1,600); dropEl(n2,600); },2200);
    },1500);
  },1200);

  var WAVES=[S5_PEAK.slice(0,5), S5_PEAK.slice(5,10), S5_PEAK.slice(10)];
  var WAVE_START=[4300, 8800, 13300];
  WAVES.forEach(function(wave, wi){
    wave.forEach(function(f, i){
      later(function(){
        var n=wave.length;
        var u = 0.10 + (n>1 ? i/(n-1) : 0.5)*0.80;
        var pt = samplePoint('happy',0,u,S5.t,112*0.7,S5.peakH);
        var side = (f.w==='z') ? -1 : 1;
        var nx=-0.6, ny=0.8;
        var ox = pt[0] + nx*44*side;
        var oy = pt[1] + ny*44*side;
        var col=f.w==='z'?'rgba(224,166,180,0.88)':'rgba(143,176,201,0.9)';
        var el=s5Txt({text:f.s,x:ox,y:oy,color:col,size:17});
        var tm=s5Txt({text:f.t,x:ox,y:oy-18,color:'rgba(74,62,58,0.32)',size:12});
        el.style.transform='translate(-50%,-50%) rotate('+(side*3)+'deg)';
        fadeIn(el,0.7); fadeIn(tm,0.7);
        later(function(){ fadeOut(el,0.6); fadeOut(tm,0.6); dropEl(el,700); dropEl(tm,700); },3000);
      }, WAVE_START[wi] + i*760);
    });
  });

  later(function(){
    var c=s5Txt({text:'什么六级啊保研啊，一个大一的学生和一个准大学生到底在焦虑什么？',x:375,y:596,color:'rgba(74,62,58,0.88)',size:22,wrap:true});
    fadeIn(c,0.9);
    later(function(){
      var c2=s5Txt({text:'好像回头看都不算什么了 享受当下才最好啊',x:375,y:668,color:'rgba(74,62,58,0.66)',size:22,wrap:true});
      fadeIn(c2,0.9,0.3);
      later(function(){
        fadeOut(c,0.8); fadeOut(c2,0.8);
        later(function(){ s5PlaySeg(7); },700);
      },3600);
    },1500);
  },19500);
}

/* ========== 段7 · 断联期 ========== */
function s5Seg7(){
  S5.mode='crack'; S5.crackPhase=0;
  gsap.to(S5,{crackPhase:1,duration:1.2,ease:'power1.inOut',overwrite:true});
  S5.particles=[];
  for(var i=0;i<52;i++){ S5.particles.push({cold:i<26,x:375,y:620,vx:0,vy:0,life:0,ph:Math.random()*6.28}); }
  later(function(){
    var n1=s5Txt({text:'六年里，超过 7 天没有说话 · 21 次。',x:375,y:530,color:'rgba(74,62,58,0.7)',size:23});
    var n2=s5Txt({text:'最长的一次 · 19 天。',x:375,y:588,color:'rgba(74,62,58,0.65)',size:21});
    var n3=s5Txt({text:'（哎……月假是这样的……）',x:375,y:656,color:'rgba(74,62,58,0.5)',size:22,wrap:true});
    fadeIn(n1,0.7); fadeIn(n2,0.7,0.25); fadeIn(n3,0.7,0.5);
    later(function(){ fadeOut(n1,0.5); fadeOut(n2,0.5); fadeOut(n3,0.5); },2600);
  },1500);

  var cards=[
    {t1:'2020-10-28 ～ 11-07 · 10 天', quotes:[
      {who:'j', t:'安安子'},
      {who:'j', t:'我'},
      {who:'j', t:'我一个东华人终于'},
      {who:'j', t:'可以长时间的碰一碰手机了'}
    ]},
    {t1:'2021-07-24 ～ 08-07 · 14 天', quotes:[
      {who:'z', t:'三年后我一定要去看一次海。'},
      {who:'z', t:'一年前的这一分钟，是我们第一次聊天。'}
    ]},
    {t1:'2023-05-17 ～ 06-05 · 19 天', quotes:[
      {who:'j', t:'而我两天没洗头。'},
      {who:'z', t:'高考加油！！！'}
    ]}
  ];
  var cardStarts=[4800, 9600, 14200];
  cards.forEach(function(card,ci){
    later(function(){
      var e1=s5Txt({text:card.t1,x:375,y:560,color:'rgba(74,62,58,0.75)',size:21});
      fadeIn(e1,0.6);
      var qEls=[];
      var qn=card.quotes.length;
      var qy0 = 664 - (qn-1)*21;
      card.quotes.forEach(function(q,qi){
        var col = q.who==='z'?'rgba(224,166,180,0.94)':'rgba(143,176,201,0.94)';
        var qt='「'+q.t+'」';
        var qe=s5Txt({text:qt,x:375,y:qy0+qi*42,color:col,size:19});
        fadeIn(qe,0.5,0.2+qi*0.15);
        qEls.push(qe);
      });
      later(function(){
        fadeOut(e1,0.5);
        qEls.forEach(function(qe){fadeOut(qe,0.5);});
      }, 3600);
    },cardStarts[ci]);
  });

  later(function(){
    gsap.to(S5,{crackPhase:0,duration:1.4,ease:'power1.inOut',overwrite:true});
    S5.particles=[];
  },18200);
  later(function(){
    var c=s5Txt({text:'这些超过 7 天的沉默，一共 21 次。',x:375,y:558,color:'rgba(74,62,58,0.9)',size:26});
    fadeIn(c,0.9);
    var c1b=s5Txt({text:'哎哎拿不到手机的学生就这样命苦吧。',x:375,y:626,color:'rgba(74,62,58,0.72)',size:22,wrap:true});
    fadeIn(c1b,0.9,0.28);
    var c2=s5Txt({text:'现在简直不敢想离开手机的日子啊。',x:375,y:692,color:'rgba(74,62,58,0.72)',size:22,wrap:true});
    fadeIn(c2,0.9,0.56);
    later(function(){
      fadeOut(c,0.8); fadeOut(c1b,0.8); fadeOut(c2,0.8);
      later(function(){s5PlaySeg(8);},700);
    },3600);
  },20000);
}

/* ========== 段8 · 沉默的厚度 ========== */
function s5Seg8(){
  S5.mode='vanish'; S5.vanishPhase=0;
  gsap.to(S5,{vanishPhase:1,duration:3.4,ease:'power1.inOut',overwrite:true});
  later(function(){
    var n=s5Txt({text:'超过 1 小时未回 · 3801 次',x:375,y:612,color:'rgba(74,62,58,0.68)',size:23});
    fadeIn(n,0.7); later(function(){fadeOut(n,0.5);},2000);
  },4200);
  later(function(){
    var n1=s5Txt({text:'累计等待 51,194 小时 ≈ 2,133 天',x:375,y:582,color:'rgba(74,62,58,0.72)',size:25}); fadeIn(n1,0.7);
    var n3=s5Txt({text:'超过 7 天的沉默，六年只有 21 次，只占 0.55%。',x:375,y:650,color:'rgba(74,62,58,0.62)',size:19}); fadeIn(n3,0.7,0.4);
    later(function(){ fadeOut(n1,0.5); fadeOut(n3,0.5); },3200);
  },6700);
  later(function(){
    var d=s5Txt({text:'这些等待里：\n1–8 小时 58.7%\n12–24 小时 18.0%\n7 天以上 0.55%',x:375,y:640,color:'rgba(74,62,58,0.6)',size:22,wrap:true});
    fadeIn(d,0.7); later(function(){fadeOut(d,0.5);},3000);
  },11200);
  later(function(){
    var c=s5Txt({text:'不管等多久，最后总会回的（嘻嘻',x:375,y:640,color:'rgba(74,62,58,0.9)',size:28});
    fadeIn(c,0.9);
    later(function(){
      fadeOut(c,0.8);
      later(function(){
        S5.finished=true;
        var bridge=document.getElementById('s5-tap-ripple'); if(bridge) bridge.classList.add('show');
      },800);
    },3200);
  },15600);
}

/* ========== 入口 ========== */
function s5Enter(){
  S5.seg=0; S5.finished=false; clearLater();
  var bridge=document.getElementById('s5-tap-ripple'); if(bridge) bridge.classList.remove('show');
  var _cp=document.createElement('canvas'), _cb=document.createElement('canvas');
  $('s5-heart-pink').style.backgroundImage='url('+drawWatercolorHeart(_cp,{colors:[[248,206,216],[224,118,148],[186,68,104]],size:330,seed:20260829})+')';
  $('s5-heart-blue').style.backgroundImage='url('+drawWatercolorHeart(_cb,{colors:[[176,214,236],[96,170,212],[48,118,182]],size:330,seed:20260830})+')';
  gsap.to('.s5-heart',{scale:1.045,duration:3,yoyo:true,repeat:-1,ease:'sine.inOut'});
  cancelAnimationFrame(S5.raf); S5.t=0; loop();
  s5PlaySeg(1);
}
sceneInit[0]=s5Enter;

// 第五幕结束后移动端没有键盘，点击画面任意位置进入第六幕。
// 监听根节点而不是只依赖 canvas，避免文字/心形动画层改变命中区域。
var s5Root=document.getElementById('scene-5');
if(s5Root){
  s5Root.addEventListener('click',function(){
    if(S5.finished && window.App && window.App.next) window.App.next();
  });
}

/* 点阵交互 */
function nearestMonth(mx,my,radius){
  var best=-1, bd=radius;
  for(var i=0;i<S5.MONTHS.length;i++){
    var p=monthPos(i), d=Math.hypot(p.x-mx,p.y-my);
    if(d<bd){ bd=d; best=i; }
  }
  return best;
}
function setMouse(e){
  var r=cv.getBoundingClientRect();
  S5.mouse.x=(e.clientX-r.left)/r.width*750;
  S5.mouse.y=(e.clientY-r.top)/r.height*1334;
}
cv.addEventListener('pointerdown',function(e){
  setMouse(e);
  if(S5.mode!=='matrix') return;
  S5.dragging=true;
  var idx=nearestMonth(S5.mouse.x,S5.mouse.y,34);
  S5.matrixPin=idx; S5.hoverIdx=idx;
});
cv.addEventListener('pointermove',function(e){
  setMouse(e);
  if(S5.mode!=='matrix') return;
  if(S5.dragging){
    var idx2=nearestMonth(S5.mouse.x,S5.mouse.y,34);
    S5.hoverIdx=idx2;
    if(idx2>=0) S5.matrixPin=idx2;
  } else {
    var idx3=nearestMonth(S5.mouse.x,S5.mouse.y,26);
    S5.hoverIdx=(idx3>=0)?idx3:-1;
  }
});
function endDrag(){ S5.dragging=false; }
cv.addEventListener('pointerup',endDrag);
cv.addEventListener('pointercancel',endDrag);
cv.addEventListener('pointerleave',function(){ if(!S5.dragging) S5.hoverIdx=-1; });
window.addEventListener('pointerup',endDrag);
window.addEventListener('pointercancel',endDrag);
window.addEventListener('blur',endDrag);

/* 键盘调试：0-9 跳段 */
document.addEventListener('keydown',function(e){
  var n=parseInt(e.key);
  if(n>=0&&n<=9) s5PlaySeg(n);
});
window.__s5Seg=s5PlaySeg;   /* 自检/调试：直接跳到第 n 段 */

goToScene(0);


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
  var call = function(fn){ try { if (typeof fn === 'function') fn(); } catch (e) { console.warn('act5 初始化异常:', e); } };
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
