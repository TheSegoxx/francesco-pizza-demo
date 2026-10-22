/* ============================================================
   Francesco Pizza Napoletana · menú, pedido por WhatsApp y horarios
   Diseño y desarrollo: Leandro Segovia
   ============================================================ */
const IMG = id => `assets/img/platos/${id}.jpg`;
/* ---------- render ---------- */
const esc = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const ITEMS = {};
const DATA = {};
MENU.forEach(s => s.groups.forEach(g => g.items.forEach(it => {
  DATA[it.id] = { it, cat: (s.accent ? s.title+" "+s.accent : s.title) + (g.label ? " · "+g.label : "") };
  ITEMS[it.id] = { name: (s.id==="calzone" ? "Calzone " : s.id==="panino" ? "Panino " : s.id==="insalate" && it.id==="insalata-caprese" ? "Ensalada " : s.id==="bianche" && it.id==="caprese-pizza" ? "Pizza " : s.id==="bianche" && it.id==="mortadela-pizza" ? "Pizza " : "") + it.name, price: it.price };
  (it.extras||[]).forEach(([n,p]) => { ITEMS[it.id+"::"+n] = { name: `Extra ${n.toLowerCase()} (${it.name})`, price:p }; });
})));

function dishCard(it){
  const extras = (it.extras||[]).map(([n,p]) =>
    `<button class="extra" type="button" data-add="${esc(it.id+"::"+n)}">+ ${esc(n)} ${ARS(p)}</button>`).join("");
  return `<article class="dish">
    <div class="ph" data-qv="${esc(it.id)}" role="button" tabindex="0" aria-label="Ver ${esc(it.name)} en grande" data-initial="${esc(it.name.replace(/^(Pane|Stracciatella) con /,"").charAt(0))}"><img src="${IMG(it.id)}" alt="${esc(it.name)}" loading="lazy" onerror="this.parentNode.classList.add('noimg');this.remove()"><span class="zoom" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg></span></div>
    <div class="dish-top"><h4>${esc(it.name)}</h4><span class="price">${ARS(it.price)}</span></div>
    ${it.desc ? `<p>${esc(it.desc)}</p>` : ""}
    ${it.tag ? `<span class="note">${esc(it.tag)}</span>` : ""}
    <div class="dish-foot"><button class="add" type="button" data-add="${esc(it.id)}">Agregar <span class="n"></span></button>${extras}</div>
  </article>`;
}
function drinkList(g){
  return `<div class="dlist"><h4>${esc(g.label)}</h4><ul>${g.items.map(it =>
    `<li><span class="nm">${esc(it.name)}${it.desc?`<small>${esc(it.desc)}</small>`:""}</span><span class="price">${ARS(it.price)}</span><button class="add-mini" type="button" data-add="${esc(it.id)}" aria-label="Agregar ${esc(it.name)}">+</button></li>`).join("")}</ul></div>`;
}
document.getElementById("sections").innerHTML = MENU.map(s => `
  <section class="sec" id="${s.id}"><div class="wrap">
    <div class="sec-head"><h3>${esc(s.title)}${s.accent?` <span>${esc(s.accent)}</span>`:""}</h3>${s.note?`<p>${esc(s.note)}</p>`:""}</div>
    ${s.kind==="drinks"
      ? `<div class="drinks">${s.groups.map(drinkList).join("")}</div>`
      : s.groups.map(g => `${g.label?`<div class="label group-label">${esc(g.label)}</div>`:""}<div class="grid">${g.items.map(dishCard).join("")}</div>`).join("")}
  </div></section>`).join("");

document.getElementById("credits").innerHTML = Object.entries(CREDITS).map(([id,[a,l,u]]) => {
  const it = ITEMS[id]; return `<li>${esc(it?it.name:id)}: <a href="${esc(u)}" target="_blank" rel="noopener">${esc(a)}</a>, ${esc(l)}</li>`; }).join("");
document.getElementById("rail").innerHTML = MENU.map(s =>
  `<a href="#${s.id}" data-sec="${s.id}">${esc(s.accent ? s.title+" "+s.accent : s.title)}</a>`).join("");

/* scroll-spy */
const railLinks = [...document.querySelectorAll("#rail a")];
const spy = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) {
    railLinks.forEach(a => a.classList.toggle("on", a.dataset.sec === e.target.id));
    const on = railLinks.find(a => a.dataset.sec === e.target.id);
    if (on) on.parentNode.scrollTo({ left: on.offsetLeft - 16, behavior: "smooth" });
  }});
}, { rootMargin: "-140px 0px -65% 0px" });
MENU.forEach(s => spy.observe(document.getElementById(s.id)));

/* ---------- hours / open now ---------- */
const hhmm = m => String(Math.floor(m/60)%24).padStart(2,"0")+":"+String(m%60).padStart(2,"0");
function nowAR(){
  try{
    const p = new Intl.DateTimeFormat("en-US",{timeZone:"America/Argentina/Buenos_Aires",weekday:"short",hour:"2-digit",minute:"2-digit",hour12:false}).formatToParts(new Date());
    const g = t => p.find(x=>x.type===t).value;
    return { d:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].indexOf(g("weekday")), m:(parseInt(g("hour"),10)%24)*60+parseInt(g("minute"),10) };
  }catch(e){ const n=new Date(); return { d:n.getDay(), m:n.getHours()*60+n.getMinutes() }; }
}
(function(){
  const {d,m} = nowAR();
  const order = [2,3,4,5,6,0,1];
  document.getElementById("hours").innerHTML = order.map(i =>
    `<li class="${i===d?"today":""}"><span>${DAYS[i]}${i===d?" · hoy":""}</span><span>${SCHED[i].length? SCHED[i].map(([a,b])=>hhmm(a)+" a "+hhmm(b)).join(" y ") : "Cerrado"}</span></li>`).join("");
  const open = SCHED[d].some(([a,b]) => m>=a && m<b);
  const st = document.getElementById("status");
  let txt;
  if (open) { const r = SCHED[d].find(([a,b]) => m>=a && m<b); txt = "Abierto ahora · hasta las " + hhmm(r[1]); }
  else {
    const later = SCHED[d].find(([a]) => a>m);
    if (later) txt = "Cerrado · abre hoy a las " + hhmm(later[0]);
    else { let k=1; while(k<7 && !SCHED[(d+k)%7].length) k++; const nd=(d+k)%7; txt = "Cerrado · abre " + (k===1?"mañana":"el "+DAYS[nd].toLowerCase()) + " a las " + hhmm(SCHED[nd][0][0]); }
  }
  st.classList.toggle("open", open);
  st.querySelector("span").textContent = txt;
})();

/* ---------- order ---------- */
const cart = new Map();
try { const saved = JSON.parse(localStorage.getItem("francesco-pedido")||"[]"); saved.forEach(([k,q]) => { if (ITEMS[k] && q>0) cart.set(k,q); }); } catch(e){}
const save = () => { try { localStorage.setItem("francesco-pedido", JSON.stringify([...cart])); } catch(e){} };
const waLink = text => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;

function orderText(){
  const lines = [...cart].map(([k,q]) => `• ${q} × ${ITEMS[k].name} — ${ARS(ITEMS[k].price*q)}`);
  const total = [...cart].reduce((s,[k,q]) => s + ITEMS[k].price*q, 0);
  const name = (document.getElementById("oName").value||"").trim();
  const note = (document.getElementById("oNote").value||"").trim();
  return `¡Hola Francesco! Quiero hacer este pedido:\n\n${lines.join("\n")}\n\nTotal: ${ARS(total)}` +
    (name?`\nNombre: ${name}`:"") + (note?`\nAclaraciones: ${note}`:"");
}
function render(){
  const count = [...cart.values()].reduce((a,b)=>a+b,0);
  const total = [...cart].reduce((s,[k,q]) => s + ITEMS[k].price*q, 0);
  document.getElementById("bar").hidden = count===0;
  document.getElementById("fab").hidden = count>0;
  document.getElementById("barTotal").textContent = ARS(total);
  document.getElementById("barCount").textContent = count + (count===1?" producto":" productos");
  document.getElementById("sheetTotal").textContent = ARS(total);
  document.querySelectorAll("[data-add]").forEach(b => {
    const q = cart.get(b.dataset.add)||0;
    b.classList.toggle("has", q>0);
    const n = b.querySelector(".n"); if (n) n.textContent = q||"";
    if (b.classList.contains("add-mini")) b.textContent = q>0 ? q : "+";
  });
  const ul = document.getElementById("lines");
  ul.innerHTML = count===0 ? `<li class="empty">Todavía no agregaste nada.</li>` : [...cart].map(([k,q]) =>
    `<li><span class="ln">${esc(ITEMS[k].name)}</span><span class="lp price">${ARS(ITEMS[k].price*q)}</span>
      <span class="qty"><button type="button" data-dec="${esc(k)}" aria-label="Quitar uno">−</button><span>${q}</span><button type="button" data-inc="${esc(k)}" aria-label="Sumar uno">+</button></span></li>`).join("");
  const href = count ? waLink(orderText()) : waLink("¡Hola Francesco! Quería hacer una consulta.");
  document.getElementById("barSend").href = href;
  document.getElementById("sheetSend").href = href;
  save();
}
document.addEventListener("click", e => {
  const a = e.target.closest("[data-add]"); if (a){
    const before = cartTotal();
    cart.set(a.dataset.add,(cart.get(a.dataset.add)||0)+1); render();
    flyToBar(a); countTo(document.getElementById("barTotal"), before, cartTotal());
    if (a.closest("#qv") && !a.classList.contains("extra")) setTimeout(closeQV, 380);
    return; }
  const q = e.target.closest("[data-qv]"); if (q){ openQV(q.dataset.qv); return; }
  const i = e.target.closest("[data-inc]"); if (i){ cart.set(i.dataset.inc,cart.get(i.dataset.inc)+1); render(); return; }
  const d = e.target.closest("[data-dec]"); if (d){ const q=cart.get(d.dataset.dec)-1; q>0?cart.set(d.dataset.dec,q):cart.delete(d.dataset.dec); render(); return; }
});
["oName","oNote"].forEach(id => document.getElementById(id).addEventListener("input", render));
const sheet = document.getElementById("sheet"), sheetBg = document.getElementById("sheetBg");
const openSheet = () => { sheet.hidden = false; sheetBg.hidden = false; document.getElementById("closeSheet").focus(); };
const closeSheet = () => { sheet.hidden = true; sheetBg.hidden = true; };
document.getElementById("openSheet").addEventListener("click", openSheet);
document.getElementById("closeSheet").addEventListener("click", closeSheet);
sheetBg.addEventListener("click", closeSheet);
document.addEventListener("keydown", e => {
  if (e.key==="Escape") { closeSheet(); closeQV(); }
  if ((e.key==="Enter"||e.key===" ") && e.target.matches && e.target.matches("[data-qv]")) { e.preventDefault(); openQV(e.target.dataset.qv); }
});

document.querySelectorAll(".js-wa").forEach(a => a.href = waLink("¡Hola Francesco! Quería hacer una consulta."));
document.getElementById("copyTel").addEventListener("click", ev => {
  const btn = ev.currentTarget, t = document.getElementById("tel");
  const done = () => { btn.textContent = "Copiado"; setTimeout(()=>btn.textContent="Copiar",1600); };
  const fallback = () => { const r=document.createRange(); r.selectNodeContents(t); const s=getSelection(); s.removeAllRanges(); s.addRange(r); btn.textContent="Seleccionado"; };
  try { navigator.clipboard.writeText("+543704777656").then(done, fallback); } catch(e){ fallback(); }
});
render();
