/* ============================================================
   Francesco Pizza Napoletana · animaciones e interacción
   Diseño y desarrollo: Leandro Segovia
   ============================================================ */
document.getElementById("yr").textContent = new Date().getFullYear();
function cartTotal(){ return [...cart].reduce((s,[k,q]) => s + ITEMS[k].price*q, 0); }

/* 8 · número que cuenta */
function countTo(el, from, to){
  if (from===to) { el.textContent = ARS(to); return; }
  const t0 = performance.now(), dur = 550;
  const step = t => { const p = Math.min(1,(t-t0)/dur), e = 1-Math.pow(1-p,3);
    el.textContent = ARS(Math.round(from + (to-from)*e)); if (p<1) requestAnimationFrame(step); };
  requestAnimationFrame(step);
}
/* 8 · la foto vuela a la barra del pedido */
function flyToBar(btn){
  const target = document.getElementById("barTotal");
  const bump = () => { const s = document.querySelector("#bar .sum"); s.classList.remove("bump"); void s.offsetWidth; s.classList.add("bump");
    const n = btn.querySelector && btn.querySelector(".n"); if (n){ n.classList.remove("bump"); void n.offsetWidth; n.classList.add("bump"); } };
  if (!target.getBoundingClientRect().width) { bump(); return; }
  const src = btn.closest(".dish")?.querySelector(".ph img") || btn.closest("#qv")?.querySelector("#qvImg") || btn.closest(".spin-result")?.querySelector("img");
  const from = (src || btn).getBoundingClientRect(), to = target.getBoundingClientRect();
  let el;
  if (src && src.complete && src.naturalWidth) { el = new Image(); el.src = src.currentSrc || src.src; el.className = "flyer"; }
  else { el = document.createElement("div"); el.className = "flyer dot"; }
  const size = src ? Math.min(from.width, 220) : 22;
  const sx = from.left + from.width/2 - size/2, sy = from.top + from.height/2 - size*0.375;
  Object.assign(el.style, { left: sx+"px", top: sy+"px", width: size+"px", height: (src? size*0.75 : size)+"px" });
  document.body.appendChild(el);
  const dx = to.left + to.width/2 - (sx + size/2), dy = to.top + to.height/2 - (sy + size*0.375);
  const anim = el.animate([
    { transform: "translate(0,0) scale(1)", opacity: 1 },
    { transform: `translate(${dx*0.5}px, ${dy*0.5 - 120}px) scale(.55) rotate(-8deg)`, opacity: 1, offset: .55 },
    { transform: `translate(${dx}px, ${dy}px) scale(.12) rotate(12deg)`, opacity: .3 }
  ], { duration: 720, easing: "cubic-bezier(.4,.1,.3,1)" });
  anim.onfinish = () => { el.remove(); bump(); };
}

/* 7 · ficha del plato */
const qv = document.getElementById("qv"), qvBg = document.getElementById("qvBg");
let qvLast = null;
function openQV(id){
  const d = DATA[id]; if (!d) return; const it = d.it;
  qvLast = document.activeElement;
  const img = document.getElementById("qvImg"), ph = document.getElementById("qvPh");
  ph.classList.remove("noimg"); ph.dataset.initial = it.name.charAt(0);
  img.hidden = false; img.onerror = () => { img.hidden = true; ph.classList.add("noimg"); };
  img.src = IMG(id); img.alt = it.name;
  document.getElementById("qvCat").textContent = d.cat;
  document.getElementById("qvName").textContent = it.name;
  document.getElementById("qvPrice").textContent = ARS(it.price);
  const desc = document.getElementById("qvDesc"); desc.textContent = it.desc || ""; desc.hidden = !it.desc;
  document.getElementById("qvFoot").innerHTML = `<button class="add" type="button" data-add="${esc(id)}">Agregar al pedido <span class="n"></span></button>` +
    (it.extras||[]).map(([n,p]) => `<button class="extra" type="button" data-add="${esc(id+"::"+n)}">+ ${esc(n)} ${ARS(p)}</button>`).join("");
  qv.hidden = false; qvBg.hidden = false;
  const inn = document.getElementById("qvIn"); inn.style.animation = "none"; void inn.offsetWidth; inn.style.animation = "";
  render(); document.getElementById("qvClose").focus();
}
function closeQV(){ if (qv.hidden) return; qv.hidden = true; qvBg.hidden = true; if (qvLast && qvLast.focus) qvLast.focus(); }
document.getElementById("qvClose").addEventListener("click", closeQV);
qvBg.addEventListener("click", closeQV);

/* 10 · ruleta con forma de pizza (física: inercia, clavijas, luces y confeti)
   Rendimiento: el disco que gira es una capa propia rotada con transform (la mueve la placa de video);
   la tabla, las luces y la flecha están en capas fijas. */
(function(){
  const box = document.getElementById("wheelBox"); if (!box) return;
  const pizzas = MENU.filter(s => s.id==="rosse" || s.id==="bianche")
    .flatMap(s => s.groups[0].items.map(it => ({ ...it, cat: s.id })));
  const N = pizzas.length, seg = 360/N, R = 150, VB = "-190 -190 380 380";
  const pt = (deg, r) => { const a = (deg-90)*Math.PI/180; return [ +(r*Math.cos(a)).toFixed(2), +(r*Math.sin(a)).toFixed(2) ]; };
  const wedge = (a0, a1, r) => { const [x0,y0] = pt(a0, r), [x1,y1] = pt(a1, r); return `M0 0L${x0} ${y0}A${r} ${r} 0 0 1 ${x1} ${y1}Z`; };
  const WIMG = id => `assets/img/ruleta/${id}.jpg`;
  let seed = 7; const rnd = () => (seed = (seed*9301 + 49297) % 233280) / 233280;

  /* tabla de madera + aro oscuro (fijo) */
  box.querySelector(".wheel-base").innerHTML = `<svg viewBox="${VB}" aria-hidden="true">
    <defs><linearGradient id="wood" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8a5a31"/><stop offset=".5" stop-color="#6a4122"/><stop offset="1" stop-color="#4a2c16"/></linearGradient></defs>
    <circle r="${R+34}" fill="url(#wood)"/>
    <circle r="${R+34}" fill="none" stroke="rgba(0,0,0,.35)" stroke-width="2"/>
    <circle r="${R+18}" fill="#1c1716"/></svg>`;

  /* disco: se dibuja UNA vez en un canvas (fotos, masa, textos) y después solo se gira la imagen */
  const disc = box.querySelector(".wheel-disc");
  disc.innerHTML = `<canvas role="img" aria-label="Ruleta con las 14 pizzas del menú"></canvas>
    <svg viewBox="${VB}" aria-hidden="true"><path class="win-ring" d=""/></svg>`;
  const cv = disc.querySelector("canvas"), D = Math.PI/180;
  const imgs = pizzas.map(p => { const im = new Image(); im.decoding = "async"; im.src = WIMG(p.id); return im; });
  const spotData = Array.from({length:46}, () => [rnd()*360, R+3+rnd()*8, 1.2+rnd()*2.2, .35+rnd()*.35]);
  function drawDisc(){
    const size = Math.round(disc.clientWidth * Math.min(2, devicePixelRatio || 1)); if (!size) return;
    if (cv.width !== size) { cv.width = size; cv.height = size; }
    const ctx = cv.getContext("2d"), k = size/380;
    ctx.setTransform(k,0,0,k,size/2,size/2); ctx.clearRect(-190,-190,380,380);
    ctx.fillStyle = "#3a2418"; ctx.beginPath(); ctx.arc(0,0,R,0,Math.PI*2); ctx.fill();
    pizzas.forEach((p,i) => {
      const im = imgs[i]; if (!(im.complete && im.naturalWidth)) return;
      const S = R*1.12; ctx.save(); ctx.rotate((i+0.5)*seg*D);
      ctx.beginPath(); ctx.moveTo(0,0); ctx.arc(0,0,R+1,(-90-seg/2)*D,(-90+seg/2)*D); ctx.closePath(); ctx.clip();
      ctx.drawImage(im, -S/2, -R*0.56 - S/2, S, S); ctx.restore();
    });
    const sh = ctx.createRadialGradient(0,0,R*0.3,0,0,R); sh.addColorStop(0,"rgba(0,0,0,0)"); sh.addColorStop(1,"rgba(0,0,0,.5)");
    ctx.fillStyle = sh; ctx.beginPath(); ctx.arc(0,0,R,0,Math.PI*2); ctx.fill();
    ctx.strokeStyle = "rgba(255,244,226,.85)"; ctx.lineWidth = 2;
    pizzas.forEach((p,i) => { const [x,y] = pt(i*seg, R); ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(x,y); ctx.stroke(); });
    const cr = ctx.createRadialGradient(0,0,0,0,0,R+13); cr.addColorStop((R-3)/(R+13),"#f5cf92"); cr.addColorStop(.95,"#d58c45"); cr.addColorStop(1,"#8f4f1f");
    ctx.strokeStyle = cr; ctx.lineWidth = 16; ctx.beginPath(); ctx.arc(0,0,R+5,0,Math.PI*2); ctx.stroke();
    spotData.forEach(([a,r,s,o]) => { const [x,y] = pt(a,r); ctx.fillStyle = `rgba(70,30,10,${o})`; ctx.beginPath(); ctx.arc(x,y,s,0,Math.PI*2); ctx.fill(); });
    pizzas.forEach((p,i) => { const [x,y] = pt(i*seg, R+5); ctx.fillStyle = "#f6d58e"; ctx.strokeStyle = "#5a3415"; ctx.lineWidth = 1.3; ctx.beginPath(); ctx.arc(x,y,3.6,0,Math.PI*2); ctx.fill(); ctx.stroke(); });
    const ff = getComputedStyle(document.body).fontFamily;
    ctx.font = `700 11.5px ${ff}`; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.lineJoin = "round";
    pizzas.forEach((p,i) => { ctx.save(); ctx.rotate(((i+0.5)*seg - 90)*D);
      ctx.strokeStyle = "rgba(20,8,4,.75)"; ctx.lineWidth = 3.2; ctx.strokeText(p.name, R*0.63, 0);
      ctx.fillStyle = "#fff"; ctx.fillText(p.name, R*0.63, 0); ctx.restore(); });
    ctx.fillStyle = "#1c1716"; ctx.beginPath(); ctx.arc(0,0,R*0.22,0,Math.PI*2); ctx.fill();
  }
  drawDisc();
  let pend = 0; const redraw = () => { cancelAnimationFrame(pend); pend = requestAnimationFrame(drawDisc); };
  imgs.forEach(im => im.addEventListener("load", redraw));
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(redraw);
  if (window.ResizeObserver) new ResizeObserver(redraw).observe(disc);

  /* capa fija: brillo, luces, flecha */
  const bulbs = Array.from({length:30}, (_,i) => { const [x,y] = pt(i*12 + 6, R+26); return `<circle class="bulb" cx="${x}" cy="${y}" r="4"/>`; }).join("");
  box.querySelector(".wheel-top").innerHTML = `<svg viewBox="${VB}" aria-hidden="true">
    <defs><radialGradient id="wSheen" cx="35%" cy="22%" r="70%"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/></radialGradient>
      <linearGradient id="pin" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff7a52"/><stop offset="1" stop-color="#c22a24"/></linearGradient></defs>
    <circle r="${R}" fill="url(#wSheen)"/>
    ${bulbs}</svg>`;
  box.querySelector(".wheel-pin").innerHTML = `<svg viewBox="${VB}" aria-hidden="true">
    <defs><linearGradient id="pin2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff7a52"/><stop offset="1" stop-color="#c22a24"/></linearGradient></defs>
      <path d="M0 ${-R+16} C -10 ${-R-2} -18 ${-R-14} -18 ${-R-24} A18 18 0 0 1 18 ${-R-24} C 18 ${-R-14} 10 ${-R-2} 0 ${-R+16} Z" fill="url(#pin2)" stroke="#fff3df" stroke-width="2.5" stroke-linejoin="round"/>
      <circle cx="0" cy="${-R-24}" r="6.5" fill="#fff3df"/></svg>`;

  const pinEl = box.querySelector(".wheel-pin"), bulbEls = [...box.querySelectorAll(".bulb")], winRing = disc.querySelector(".win-ring");
  const btns = [document.getElementById("spinBtn"), document.getElementById("hub")];
  const out = document.getElementById("spinResult");

  /* confeti */
  function confetti(){
    const cv = document.createElement("canvas"); cv.className = "confetti"; box.appendChild(cv);
    const dpr = Math.min(2, devicePixelRatio||1), w = cv.width = cv.offsetWidth*dpr, h = cv.height = cv.offsetHeight*dpr, k0 = w/540;
    const ctx = cv.getContext("2d");
    const cols = ["#ff5a4f", "#22c55e", "#ffd36b", "#ffffff", "#f59e0b"];
    const ps = Array.from({length:100}, () => { const a = Math.random()*Math.PI*2, v = (4+Math.random()*9)*k0;
      return { x:w/2, y:h/2, vx:Math.cos(a)*v, vy:Math.sin(a)*v-5*k0, s:(5+Math.random()*6)*k0, r:Math.random()*6, vr:(Math.random()-.5)*.4, c:cols[Math.random()*cols.length|0] }; });
    const t0 = performance.now();
    (function frame(t){
      const k = (t-t0)/1800; ctx.clearRect(0,0,w,h); ctx.globalAlpha = Math.max(0,1-k);
      for (const p of ps){ p.vy += .32*k0; p.vx *= .99; p.x += p.vx; p.y += p.vy; p.r += p.vr;
        ctx.setTransform(Math.cos(p.r),Math.sin(p.r),-Math.sin(p.r),Math.cos(p.r),p.x,p.y); ctx.fillStyle = p.c; ctx.fillRect(-p.s/2,-p.s/4,p.s,p.s/2); }
      ctx.setTransform(1,0,0,1,0,0);
      if (k < 1) requestAnimationFrame(frame); else cv.remove();
    })(t0);
  }

  /* luces */
  let bulbMode = "idle", bulbStep = -1;
  function paintBulbs(step){
    if (step === bulbStep) return; bulbStep = step;
    for (let i=0;i<bulbEls.length;i++){
      const on = bulbMode === "win" ? step%2===0 : bulbMode === "spin" ? (i+step)%5===0 : (i+step)%2===0;
      if (bulbEls[i]._on !== on){ bulbEls[i]._on = on; bulbEls[i].classList.toggle("on", on); }
    }
  }
  let idleT = 0; setInterval(() => { if (bulbMode === "idle") paintBulbs(++idleT); }, 700);

  /* física: el bucle corre solo mientras la ruleta se mueve */
  let rot = 0, vel = 0, flap = 0, lastPeg = 0, spinning = false, dragging = false, wind = 0, running = false, last = 0, t0spin = 0;
  const apply = () => { disc.style.transform = `rotate(${rot}deg)`; pinEl.style.transform = `rotate(${flap.toFixed(1)}deg)`; };
  function loop(t){
    const dt = Math.min(0.1, (t - last)/1000); last = t;
    if (wind > 0) { wind -= dt; rot -= 70*dt; if (wind <= 0) vel = 1050 + Math.random()*650; }
    else if (spinning && !dragging) {
      rot += vel*dt;
      const dec = (55 + 0.62*Math.abs(vel))*dt;
      vel = Math.abs(vel) <= dec ? 0 : vel - Math.sign(vel)*dec;
      if (Math.abs(vel) < 4) { vel = 0; spinning = false; finish(); }
    }
    const peg = Math.floor(rot/seg);
    if (peg !== lastPeg) { lastPeg = peg; flap = -Math.sign(vel || 1) * Math.min(28, 10 + Math.abs(vel)*0.025); }
    flap *= Math.exp(-dt*16); if (Math.abs(flap) < 0.05) flap = 0;
    if (bulbMode === "spin") paintBulbs(Math.floor((t - t0spin)/120));
    apply();
    if (spinning || dragging || wind > 0 || flap !== 0) requestAnimationFrame(loop); else running = false;
  }
  function kick(){ if (!running){ running = true; last = performance.now(); requestAnimationFrame(loop); } }

  function start(v){
    if (spinning) return;
    out.hidden = true; winRing.classList.remove("on");
    spinning = true; bulbMode = "spin"; t0spin = performance.now(); box.closest(".spin-card").classList.add("is-spinning");
    btns.forEach(b => b.disabled = true);
    if (v) vel = v; else wind = 0.22;
    kick();
  }
  const ingredients = d => (d||"").replace(/\.$/,"").split(/, y |, | y (?=[a-záéíóú])/i).map(s => s.trim()).filter(Boolean);
  function finish(){
    const idx = Math.floor((((-rot) % 360) + 360) % 360 / seg) % N, p = pizzas[idx];
    box.closest(".spin-card").classList.remove("is-spinning");
    winRing.setAttribute("d", wedge(idx*seg, (idx+1)*seg, R)); winRing.classList.remove("on"); void winRing.getBBox(); winRing.classList.add("on");
    bulbMode = "win"; let n = 0; const blink = setInterval(() => { paintBulbs(++n); if (n > 12){ clearInterval(blink); bulbMode = "idle"; } }, 130);
    confetti();
    const cat = p.cat === "rosse" ? "Pizza rossa · con salsa de tomate" : "Pizza bianca · sin tomate";
    const extras = (p.extras||[]).map(([n,pr]) => `${n} +${ARS(pr)}`).join(" · ");
    out.innerHTML = `<img src="${IMG(p.id)}" alt="${esc(p.name)}">
      <div class="sr-body">
        <div class="sr-kick">¡Te tocó! <span class="sr-cat">${cat}</span></div>
        <h4>${esc(p.name)}</h4>
        <p class="sr-ing-t">Lleva:</p>
        <ul class="sr-ing">${ingredients(p.desc).map(x => `<li>${esc(x.charAt(0).toUpperCase()+x.slice(1))}</li>`).join("")}</ul>
        ${extras ? `<p class="sr-extra">Podés sumarle: ${esc(extras)}</p>` : ""}
        <div class="sr-foot"><span class="sr-price">${ARS(p.price)}</span>
          <button class="add" type="button" data-add="${esc(p.id)}">Agregar al pedido <span class="n"></span></button>
          <a class="sr-link" href="#${p.cat}">Ver en el menú</a></div>
      </div>`;
    out.hidden = false; render();
    btns.forEach(b => b.disabled = false);
    document.getElementById("spinBtn").textContent = "Girar de nuevo";
    if (out.getBoundingClientRect().bottom > innerHeight - 90) setTimeout(() => out.scrollIntoView({ behavior:"smooth", block:"center" }), 1400);
  }
  btns.forEach(b => b.addEventListener("click", () => start()));

  /* girar con el dedo o el mouse */
  let prevA = 0, samples = [];
  const angleAt = e => { const r = box.getBoundingClientRect(); return Math.atan2(e.clientY - (r.top + r.height/2), e.clientX - (r.left + r.width/2)) * 180/Math.PI; };
  disc.addEventListener("pointerdown", e => {
    if (spinning) return;
    dragging = true; box.classList.add("grabbing"); prevA = angleAt(e); samples = [[performance.now(), rot]];
    disc.setPointerCapture(e.pointerId); kick();
  });
  disc.addEventListener("pointermove", e => {
    if (!dragging) return;
    let a = angleAt(e), d = a - prevA; if (d > 180) d -= 360; if (d < -180) d += 360;
    prevA = a; rot += d; samples.push([performance.now(), rot]); if (samples.length > 8) samples.shift();
  });
  const release = () => {
    if (!dragging) return; dragging = false; box.classList.remove("grabbing");
    const now = performance.now(), s0 = samples.find(s => now - s[0] < 120) || samples[0];
    const v = (rot - s0[1]) / Math.max(0.016, (now - s0[0])/1000);
    if (Math.abs(v) > 160) start(Math.sign(v) * Math.min(2400, Math.max(800, Math.abs(v))));
  };
  disc.addEventListener("pointerup", release); disc.addEventListener("pointercancel", release);
  apply(); paintBulbs(0);
})();

/* 11 · cuenta regresiva */
function fmtMin(t){ const h = Math.floor(t/60), m = t%60; return h ? `${h} h ${String(m).padStart(2,"0")} min` : `${m} min`; }
function tickStatus(){
  const {d,m} = nowAR();
  let txt = "", open = false;
  outer: for (let k=0;k<8;k++){
    const day = (d+k)%7;
    for (const [a,b] of SCHED[day]){
      const A = k*1440+a, B = k*1440+b;
      if (m>=A && m<B){ open = true; txt = `Abierto ahora · cerramos en ${fmtMin(B-m)}`; break outer; }
      if (A>m){ const left = A-m;
        txt = left <= 12*60 ? `Cerrado · abrimos en ${fmtMin(left)}`
            : `Cerrado · abrimos ${k===1?"mañana":"el "+DAYS[day].toLowerCase()} a las ${hhmm(a)}`;
        break outer; }
    }
  }
  ["status","status2"].forEach(id => { const el = document.getElementById(id); if (!el) return;
    el.classList.toggle("open", open); el.querySelector("span").textContent = txt; });
}
tickStatus(); setInterval(tickStatus, 20000);

/* 15 · barra superior que se achica */
(function(){
  const top = document.querySelector(".top");
  const setH = () => document.documentElement.style.setProperty("--top-h", top.offsetHeight + "px");
  const onScroll = () => { top.classList.toggle("scrolled", scrollY > 40); };
  addEventListener("scroll", onScroll, { passive: true }); onScroll();
  if (window.ResizeObserver) new ResizeObserver(setH).observe(top); setH();
})();

/* 6 · aparición al bajar */
(function(){
  if (!("IntersectionObserver" in window)) return;
  const els = [...document.querySelectorAll(".sec-head, .dish, .dlist, .menu-intro .wrap, .reserve .wrap, .visit .wrap > div, .spin-card, .group-label")];
  document.querySelectorAll(".grid").forEach(g => [...g.children].forEach((c,i) => c.style.setProperty("--d", (i%4)*80 + "ms")));
  els.forEach(e => e.classList.add("rv"));
  document.documentElement.classList.add("anim");
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -8% 0px" });
  document.querySelectorAll(".rv").forEach(e => io.observe(e));
})();

/* 13 · burbuja de WhatsApp */
(function(){
  const b = document.getElementById("bubble");
  let off = false; try { off = sessionStorage.getItem("francesco-bubble") === "off"; } catch(e){}
  if (off) return;
  setTimeout(() => { if (!document.getElementById("fab").hidden) b.hidden = false; }, 4500);
  document.getElementById("bubbleX").addEventListener("click", () => { b.hidden = true; try { sessionStorage.setItem("francesco-bubble","off"); } catch(e){} });
  new MutationObserver(() => { if (document.getElementById("fab").hidden) b.hidden = true; }).observe(document.getElementById("fab"), { attributes: true });
})();
document.querySelectorAll(".js-wa").forEach(a => a.href = waLink("¡Hola Francesco! Quería hacer una consulta."));
