(function(window, document, gsap){

/* ================= 合并运行时沙箱（自动生成，勿手改）================= */
var __realWin = window;
var __realDoc = document;
var __actNo = 6;
var __root = __realDoc.getElementById('act-6');
var __App = __realWin.App;
function __isActive(){ return __App.isActive(__actNo); }
function __scope(sel){
  sel = String(sel);
  if (!sel || sel.indexOf('#act-6') === 0) return sel;
  return '#act-6 ' + sel;
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


(function(){
  var stage=document.querySelector('.stage');
  var scenes=[document.getElementById('scene-6-1'),document.getElementById('scene-6-2')];
  var s1=scenes[0],s2=scenes[1],cur=-1;
  var reveal=[].slice.call(s1.querySelectorAll('.reveal'));

  /* 6.2 拍立得：相纸 + 相机 */
  var card=document.getElementById('polCard');        /* 相纸 */
  var cam=document.getElementById('polCam');          /* 相机 */
  var video=document.getElementById('camVideo');      /* 取景窗里的视频 */
  var photo=document.getElementById('polPhoto');      /* 相纸上的照片(占位) */
  var vig=document.getElementById('polVig');
  var grain=document.getElementById('polGrain');
  var blink=document.getElementById('camBlink');      /* 取景窗白闪 */
  var flashBar=document.getElementById('camFlashBar');/* 闪光灯 */
  var glow=document.getElementById('camGlow');        /* 机身泛白 */
  var ret=document.getElementById('camRet');          /* 取景十字 */
  var shutter=document.getElementById('camShutter');
  var playBtn=document.getElementById('camPlay');
  var capBig=card.querySelector('.pol-cap .big');
  var tkA=document.getElementById('tkA'),tkB=document.getElementById('tkB');   /* 6.2 开场的两张车票 */
  /* 相机 CSS 在 top:960，取景阶段上移到 -293 → 中心 667（页面居中）；
     拍照后相机落回 960，相纸同时从它背后推出来，两者相对位移 560px = 吐片行程 */
  var CAM_UP=-293,HIDE_Y=CAM_UP+960-390;

  /* —— 可调参数 —— */
  var HINT_AFTER=600;   /* 6.1 字幕浮完后多久浮出「点一下继续」(ms) */
  var FLASH=110;        /* 快门白闪时长 (ms) */
  var SHUTTER=true;     /* 快门音效开关 */

  var timers=[];
  function later(fn,ms){timers.push(setTimeout(fn,ms));}
  function clearTimers(){for(var i=0;i<timers.length;i++)clearTimeout(timers[i]);timers=[];}
  var REVEAL_MS=250+340*Math.max(0,reveal.length-1)+420;   /* .reveal 全部浮完的时长 */
  function resize(){var scale=Math.min(window.innerWidth/750,window.innerHeight/1334);stage.style.transform='scale('+scale+')';stage.style.left=((window.innerWidth-750*scale)/2)+'px';stage.style.top=((window.innerHeight-1334*scale)/2)+'px'}

  /* 快门音：WebAudio 现场合成，不引入外部音频文件 */
  var actx=null;
  function audioCtx(){
    try{
      var AC=window.AudioContext||window.webkitAudioContext;if(!AC)return null;
      if(!actx)actx=new AC();
      if(actx.state==='suspended')actx.resume();
    }catch(e){actx=null;}
    return actx;
  }
  function shutterSound(){
    if(!SHUTTER)return;
    var c=audioCtx();if(!c||c.state!=='running')return;
    var bursts=[[0,.05,2600,.2],[.045,.035,1400,.13]];
    for(var b=0;b<bursts.length;b++){
      var o=bursts[b],n=Math.max(1,Math.floor(c.sampleRate*o[1]));
      var buf=c.createBuffer(1,n,c.sampleRate),d=buf.getChannelData(0);
      for(var i=0;i<n;i++){var k=1-i/n;d[i]=(Math.random()*2-1)*k*k;}
      var src=c.createBufferSource();src.buffer=buf;
      var bp=c.createBiquadFilter();bp.type='bandpass';bp.frequency.value=o[2];bp.Q.value=.9;
      var g=c.createGain();g.gain.value=o[3];
      src.connect(bp);bp.connect(g);g.connect(c.destination);src.start(c.currentTime+o[0]);
    }
  }
  window.addEventListener('pointerdown',audioCtx,{once:true});
  window.addEventListener('keydown',audioCtx,{once:true});

  /* ===== 6.1 ===== */
  var ready61=false;
  function play61(){
    clearTimers();
    ready61=false;
    gsap.killTweensOf(reveal);
    gsap.set(reveal,{opacity:0});
    gsap.to(reveal,{opacity:1,duration:.42,stagger:.34,delay:.25,ease:'power1.out'});
    later(function(){ready61=true;},REVEAL_MS+HINT_AFTER);
  }
  /* 6.1 播完后点一下进 6.2 */
  s1.addEventListener('click',function(){if(ready61)goToScene(1);});

  /* ===== 6.2 ===== */
  function reset62(){
    try{if(video.readyState>0){video.pause();video.currentTime=0;}}catch(e){}
    video.classList.remove('after');
    photo.classList.remove('dev');
    photo.style.transition='none';photo.style.opacity='0';void photo.offsetWidth;photo.style.transition='';
    vig.classList.remove('on');grain.classList.remove('on');
    capBig.style.opacity='0'; capBig.textContent='';
    blink.classList.remove('on');flashBar.classList.remove('on');glow.classList.remove('on');
    ret.style.opacity='1';playBtn.classList.remove('show');
    gsap.killTweensOf(card);gsap.killTweensOf(cam);gsap.killTweensOf(shutter);
    gsap.set(shutter,{scale:1,y:0});
    /* 车票和相机阶段不露出相纸，避免它垫在票下或从相机边缘漏出。 */
    card.style.opacity='0';
    gsap.set(card,{xPercent:-50,yPercent:-50,rotation:1.2,y:HIDE_Y});   /* 先整张藏进相机 */
    gsap.killTweensOf([tkA,tkB]);
    gsap.set([tkA,tkB],{opacity:0,y:26,filter:'blur(0px)'});
  }
  /* 6.2 开场：长京票先出现，京长票随后叠上来；两张都浮完后再模糊，让位给相机/拍立得 */
  function playTickets(){
    gsap.killTweensOf([tkA,tkB]);
    gsap.set([tkA,tkB],{opacity:0,y:26,filter:'blur(0px)'});
    gsap.to(tkA,{opacity:1,y:0,duration:.8,delay:.8,ease:'power2.out'});
    gsap.to(tkB,{opacity:1,y:0,duration:.8,delay:1.6,ease:'power2.out'});
    gsap.to([tkA,tkB],{filter:'blur(13px)',opacity:0,duration:1.0,delay:3.0,ease:'power2.inOut'});
  }
  function enter62(){
    reset62();
    playTickets();
    gsap.set(cam,{xPercent:-50,yPercent:-50,opacity:0,y:CAM_UP+22});
    /* 严格按顺序：两张票先出现并消失，再露出拍立得相机。 */
    gsap.to(cam,{opacity:1,y:CAM_UP,duration:.9,delay:4.0,ease:'power2.out'});
    later(playVideo,4350);
  }
  function playVideo(){
    var p=video.play();
    if(p&&p.catch)p.catch(function(){playBtn.classList.add('show')});   /* 自动播放被拦 → 给个▶ */
  }
  function capture(){
    if(cur!==1)return;
    /* ① 快门：闪光灯亮 + 取景窗白闪 + 机身泛白 + 快门键下压 + 快门音 */
    flashBar.classList.add('on');blink.classList.add('on');glow.classList.add('on');
    gsap.to(shutter,{scale:.9,y:2,duration:.09,yoyo:true,repeat:1,ease:'power1.inOut'});
    shutterSound();
    later(function(){blink.classList.remove('on');flashBar.classList.remove('on');glow.classList.remove('on');},FLASH);
    /* ② 吐片：相纸从相机顶部吐片口推出来，一边出片一边显影 */
    later(function(){
      ret.style.opacity='0';
      video.classList.add('after');
      /* 相机落到下方，相纸向上吐出；出片后机身继续留在画面里。 */
      gsap.to(cam,{opacity:1,y:0,duration:1.0,ease:'power2.inOut'});
      gsap.to(card,{opacity:1,y:0,duration:1.25,delay:.16,ease:'power2.out'});
      photo.style.opacity='1';
      requestAnimationFrame(function(){requestAnimationFrame(function(){photo.classList.add('dev')})});
      setTimeout(function(){window.__polaroidComplete=true;window.dispatchEvent(new CustomEvent('polaroid-complete'));},3300);
      vig.classList.add('on');grain.classList.add('on');   /* 暗角 + 颗粒 */
      capBig.style.opacity='1';
      window.__polaroidComplete=true;
      try{localStorage.setItem('album-six-polaroid','1');}catch(e){}
    },FLASH+30);
  }
  video.addEventListener('ended',capture);
  video.addEventListener('error',function(){playBtn.classList.add('show')});
  playBtn.addEventListener('click',function(){playBtn.classList.remove('show');playVideo();});

  /* ===== 场景调度 ===== */
  function goToScene(i){
    if(i<0||i>=scenes.length||i===cur)return;
    clearTimers();
    if(cur===1){try{video.pause();}catch(e){}}   /* 离开 6.2 才暂停，避免首次进场打断加载 */
    cur=i;
    ready61=false;
    for(var k=0;k<scenes.length;k++)scenes[k].classList.toggle('active',k===i);
    try{localStorage.setItem('album-six-scene',String(i));}catch(e){}
    if(i===0)play61();else enter62();
    if(window.App&&window.App.syncLocal) window.App.syncLocal(6,i);
  }
  s2.addEventListener('click',function(){
    if(cur===1 && window.__polaroidComplete && window.__beginFlashback) window.__beginFlashback();
  });
  window.addEventListener('resize',resize);
  window.addEventListener('keydown',function(e){if(e.key==='1')goToScene(0);else if(e.key==='2')goToScene(1);});
  window.__scene=goToScene;             /* 调试：控制台 window.__scene(1) 直接跳 6.2 */
  resize();goToScene(0);
})();


/* ================= 合并注入：模块导出（第六幕：相机/拍立得）================= */
(function(){
  var scenes = window.App.manifestScenes(__actNo);
  var __scene = window.__scene;
  if (typeof __scene === 'function') {
    window.__scene = function(local){
      if (local >= scenes.length) { window.App.next(); return; }
      __scene(local);
      window.App.syncLocal(__actNo, local);
    };
  }
  window.App.register(__actNo, {
    scenes: scenes,
    show: function(local){ if (typeof window.__scene === 'function') window.__scene(local); },
    enter: function(){ try { resize(); } catch (e) {} __resumeRaf(); }
  });
})();

})(window, document, gsap);
