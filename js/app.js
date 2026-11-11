// ---- tema ----
const root=document.documentElement, btn=document.getElementById('themeBtn');
function setTheme(t){root.setAttribute('data-theme',t);btn.textContent=t==='dark'?'☾':'☀';try{localStorage.setItem('srm-theme',t)}catch(e){}}
let saved=null;try{saved=localStorage.getItem('srm-theme')}catch(e){}
setTheme(saved||'dark');
btn.onclick=()=>setTheme(root.getAttribute('data-theme')==='dark'?'light':'dark');
document.getElementById('year').textContent=new Date().getFullYear();

// ---- bienvenida ----
const form=document.getElementById('nameForm'),greet=document.getElementById('greeting'),uName=document.getElementById('userName'),inp=document.getElementById('nameInput');
function showGreeting(n){uName.textContent=n;form.style.display='none';greet.classList.add('show')}
let sn=null;try{sn=localStorage.getItem('srm-user')}catch(e){}
if(sn)showGreeting(sn);
form.onsubmit=e=>{e.preventDefault();const n=inp.value.trim()||'visitante';try{localStorage.setItem('srm-user',n)}catch(e){}showGreeting(n)};
document.getElementById('changeName').onclick=()=>{try{localStorage.removeItem('srm-user')}catch(e){}greet.classList.remove('show');form.style.display='flex';inp.value='';inp.focus()};

// ---- portafolio (reemplaza nombres y tipos) ----
const CUMPLE_IMG='img/cumple-demo.jpg';
const works=[
 ['Regalo de cumpleaños interactivo','Página web personalizada',{img:CUMPLE_IMG,href:'demo/feliz-cumple-demo.html',txt:'Libro de fotos con páginas que se voltean, sobre con sello de cera y carta animada. Versión de demostración con fotos y textos censurados.'}]
];
const grid=document.getElementById('grid');
works.forEach(([t,k,d],i)=>{
  if(d){grid.insertAdjacentHTML('beforeend',`<article class="work reveal"><div class="browser"><i></i><i></i><i></i></div><a class="shot" href="${d.href}" target="_blank" rel="noopener" aria-label="Ver demo: ${t}"><img class="cap" src="${d.img}" alt="${t}"></a><div class="info"><span>${k}</span><h4>${t}</h4><p style="font-size:.9rem;color:var(--muted);margin:8px 0 14px;line-height:1.55">${d.txt}</p><a href="${d.href}" target="_blank" rel="noopener" style="color:var(--accent);font-weight:600;font-size:.9rem;text-decoration:none">Ver demo →</a></div></article>`);return}
  grid.insertAdjacentHTML('beforeend',`
  <article class="work reveal">
    <div class="browser"><i></i><i></i><i></i></div>
    <label class="shot">
      <div class="ph"><img src="img/icon-dark.svg" alt="">Haz clic para subir captura</div>
      <input type="file" accept="image/*" hidden data-i="${i}">
    </label>
    <div class="info"><span>${k}</span><h4>${t}</h4></div>
  </article>`);
});
grid.addEventListener('change',e=>{
  const f=e.target.files&&e.target.files[0]; if(!f)return;
  const shot=e.target.closest('.shot'), r=new FileReader();
  r.onload=()=>{let im=shot.querySelector('img.cap');if(!im){im=document.createElement('img');im.className='cap';shot.prepend(im)}im.src=r.result;shot.querySelector('.ph').style.display='none'};
  r.readAsDataURL(f);
});

// ---- aparición al hacer scroll ----
const io=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

// ---- estrellas ----
const cv=document.getElementById('stars'),cx=cv.getContext('2d');let S=[];
function size(){cv.width=innerWidth;cv.height=innerHeight;S=Array.from({length:Math.min(160,innerWidth/7)},()=>({x:Math.random()*cv.width,y:Math.random()*cv.height,r:Math.random()*1.3+.2,p:Math.random()*6.28,s:Math.random()*.02+.005,c:Math.random()>.8?'212,175,55':'200,180,255'}))}
size();addEventListener('resize',size);
(function tick(){cx.clearRect(0,0,cv.width,cv.height);S.forEach(s=>{s.p+=s.s;const a=.3+.7*Math.abs(Math.sin(s.p));cx.fillStyle=`rgba(${s.c},${a})`;cx.beginPath();cx.arc(s.x,s.y,s.r,0,6.283);cx.fill()});requestAnimationFrame(tick)})();

// ---- visores de proyectos destacados ----
(function(){
  const lb=document.getElementById('lb'),lbi=document.getElementById('lbImg');
  let active=null;
  document.querySelectorAll('.feat').forEach(feat=>{
    const img=feat.querySelector('.vImg'),t=feat.querySelector('.vTitle'),nm=feat.querySelector('.vName'),ds=feat.querySelector('.vDesc'),cnt=feat.querySelector('.vCount'),viewer=feat.querySelector('.viewer');
    const th=[...feat.querySelectorAll('.thumb')],desc=JSON.parse(feat.dataset.desc),key=feat.dataset.key;
    const SH=th.map((b,i)=>({t:b.getAttribute('aria-label'),d:desc[i],src:b.querySelector('img').src}));
    let cur=0;
    function show(n){
      cur=(n+SH.length)%SH.length;const s=SH[cur];
      img.style.opacity=0;
      setTimeout(()=>{img.src=s.src;img.alt=s.t;img.style.opacity=1;if(lb.classList.contains('on')&&active===api)lbi.src=s.src},150);
      t.textContent=key+' · '+s.t.toLowerCase();nm.textContent=s.t;ds.textContent=s.d;cnt.textContent=(cur+1)+' / '+SH.length;
      th.forEach((b,i)=>b.classList.toggle('on',i===cur));
    }
    const api={prev:()=>show(cur-1),next:()=>show(cur+1),src:()=>img.src,viewer};
    th.forEach((b,i)=>b.onclick=()=>show(i));
    feat.querySelector('.arrow.prev').onclick=api.prev;feat.querySelector('.arrow.next').onclick=api.next;
    img.onclick=()=>{active=api;lbi.src=img.src;lb.classList.add('on')};
    let x0=null;
    viewer.addEventListener('touchstart',e=>{x0=e.touches[0].clientX},{passive:true});
    viewer.addEventListener('touchend',e=>{if(x0===null)return;const dx=e.changedTouches[0].clientX-x0;x0=null;if(Math.abs(dx)>45)(dx<0?api.next:api.prev)()});
    viewer.addEventListener('mouseenter',()=>{active=api});
    feat._api=api;show(0);
  });
  document.getElementById('lbPrev').onclick=e=>{e.stopPropagation();active&&active.prev()};
  document.getElementById('lbNext').onclick=e=>{e.stopPropagation();active&&active.next()};
  lb.onclick=()=>lb.classList.remove('on');
  let lx=null;
  lb.addEventListener('touchstart',e=>{lx=e.touches[0].clientX},{passive:true});
  lb.addEventListener('touchend',e=>{if(lx===null||!active)return;const dx=e.changedTouches[0].clientX-lx;lx=null;if(Math.abs(dx)>45)(dx<0?active.next:active.prev)()});
  addEventListener('keydown',e=>{
    if(e.key==='Escape')lb.classList.remove('on');
    if(!active)return;
    const ok=lb.classList.contains('on')||active.viewer.matches(':hover')||document.activeElement===active.viewer;
    if(!ok)return;
    if(e.key==='ArrowLeft'){e.preventDefault();active.prev()}
    if(e.key==='ArrowRight'){e.preventDefault();active.next()}
  });
})();
// ---- acordeón: un solo proyecto abierto a la vez ----
(function(){
  const feats=[...document.querySelectorAll('.feat')];
  function setOpen(f,on){f.classList.toggle('open',on);f.querySelector('.feat-head').setAttribute('aria-expanded',on?'true':'false')}
  function toggle(f){
    const willOpen=!f.classList.contains('open');
    feats.forEach(o=>{if(o!==f)setOpen(o,false)});
    setOpen(f,willOpen);
    if(willOpen){setTimeout(()=>f.scrollIntoView({behavior:'smooth',block:'start'}),120);setTimeout(()=>f.scrollIntoView({behavior:'smooth',block:'start'}),700)}
  }
  feats.forEach((f,i)=>{
    const head=f.querySelector('.feat-head');
    head.addEventListener('click',()=>toggle(f));
    head.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle(f)}});
    setOpen(f,i===0);
  });
})();

// ---- ventana de contacto ----
(function(){
  const cm=document.getElementById('cm'),open=document.getElementById('ctaOpen'),x=document.getElementById('cmX');
  let last=null;
  function show(){last=document.activeElement;cm.hidden=false;document.body.classList.add('cm-lock');requestAnimationFrame(()=>cm.classList.add('on'));x.focus()}
  function hide(){cm.classList.remove('on');document.body.classList.remove('cm-lock');setTimeout(()=>{cm.hidden=true},250);if(last)last.focus({preventScroll:true})}
  open.addEventListener('click',show);x.addEventListener('click',hide);
  cm.addEventListener('click',e=>{if(e.target===cm)hide()});
  document.addEventListener('keydown',e=>{if(!cm.hidden&&e.key==='Escape')hide()});
})();
