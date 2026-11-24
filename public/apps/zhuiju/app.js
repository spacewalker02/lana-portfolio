(function(){
'use strict';
const CJK = /[\u4e00-\u9fff\u3007]/;
const KEY = 'zhuiju:v1';
const S = {}; STORIES.forEach(s => { S[s.id] = s; });

function defaults(){ return { progress:{}, roles:{}, words:[], last:null, prefs:{py:true, tr:false, fs:1}, hint:true, doneLog:[], exams:{}, log:[], updated:0 }; }
/* words saved from the retired nine-scene fic belong to the five-chapter one */
function migrate(o){ (o.words || []).forEach(w => { if (w.sid === 'futile' || w.sid === 'futile5') w.sid = 'futile6'; }); return o; }
function load(){
  try { const raw = localStorage.getItem(KEY); if (raw) { const d = JSON.parse(raw); const o = defaults(); Object.assign(o, d); o.prefs = Object.assign(defaults().prefs, d.prefs || {});
      if (!Array.isArray(d.doneLog)) { o.doneLog = []; STORIES.forEach(st => ((o.progress[st.id] || {}).done || []).slice().sort().forEach(ci => { if (st.chapters[ci]) o.doneLog.push({ s: st.id, c: ci, l: st.chapters[ci].hsk }); })); }
      if (!o.exams) o.exams = {};
      if (!Array.isArray(o.log)) o.log = [];
      return migrate(o); } } catch(e) {}
  return defaults();
}
let store = load();
function save(){ store.updated = Date.now(); try { localStorage.setItem(KEY, JSON.stringify(store)); } catch(e) {} cloudPush(); }
function logEvent(t, x){ store.log.push({ at: Date.now(), t, x }); if (store.log.length > 300) store.log.splice(0, store.log.length - 300); }

/* ---------- cloud save ---------- */
const cloud = { state: 'local', ref: null, busy: false, again: false, timer: null };
function cloudPush(){ if (!cloud.ref) return; clearTimeout(cloud.timer); cloud.timer = setTimeout(cloudWrite, 1200); }
async function cloudWrite(){
  if (!cloud.ref) return;
  if (cloud.busy) { cloud.again = true; return; }
  cloud.busy = true;
  try { await cloud.ref.set({ json: JSON.stringify(store), updated: store.updated || Date.now() }); }
  catch(e) { const c = e && e.code; if (c === 'invalid_argument' || c === 'not_granted' || c === 'capability_disabled' || c === 'capability_removed') { cloud.ref = null; cloud.state = 'local'; refreshSync(); } }
  cloud.busy = false;
  if (cloud.again) { cloud.again = false; cloudWrite(); }
}
function mergeStores(a, b){
  const o = defaults();
  const newer = (a.updated || 0) >= (b.updated || 0) ? a : b, older = newer === a ? b : a;
  const m = new Map();
  [].concat(older.doneLog || [], newer.doneLog || []).forEach(d => { const id = d.s + '#' + d.c; const cur = m.get(id); if (!cur || (d.at || 0) < (cur.at || 0)) m.set(id, d); });
  o.doneLog = Array.from(m.values()).filter(d => S[d.s] && S[d.s].chapters[d.c]).sort((x, y) => (x.at || 0) - (y.at || 0));
  o.progress = {}; o.doneLog.forEach(d => { (o.progress[d.s] = o.progress[d.s] || { done: [] }).done.push(d.c); });
  [older.exams || {}, newer.exams || {}].forEach(ex => Object.keys(ex).forEach(k => {
    const x = ex[k], c = o.exams[k];
    o.exams[k] = !c ? Object.assign({}, x) : { best: Math.max(c.best || 0, x.best || 0), total: x.total || c.total, last: (x.at || 0) >= (c.at || 0) ? x.last : c.last, passed: !!(c.passed || x.passed), at: Math.max(c.at || 0, x.at || 0) };
  }));
  const lm = new Map(); [].concat(older.log || [], newer.log || []).forEach(e => lm.set(e.at + '|' + e.t + '|' + e.x, e));
  o.log = Array.from(lm.values()).sort((x, y) => x.at - y.at).slice(-300);
  o.words = (newer.words || []).slice();
  o.roles = Object.assign({}, older.roles || {}, newer.roles || {});
  o.last = newer.last || older.last || null;
  o.prefs = Object.assign(defaults().prefs, older.prefs || {}, newer.prefs || {});
  o.hint = !!(a.hint && b.hint);
  o.updated = Math.max(a.updated || 0, b.updated || 0);
  return o;
}
async function cloudInit(){
  if (!window.claude || typeof window.claude.use !== 'function') return;
  try {
    cloud.state = 'connecting'; refreshSync();
    const res = await Promise.all([window.claude.use('db'), window.claude.use('user')]);
    const db = res[0], user = res[1];
    if (!db || !user) { cloud.state = 'local'; refreshSync(); return; }
    const id = await user.id();
    if (!id) { cloud.state = 'local'; refreshSync(); return; }
    const ref = db.doc('data/users/' + id + '/progress');
    const snap = await ref.get();
    if (snap.exists) {
      const body = snap.data();
      try { const remote = JSON.parse(body.json); store = migrate(mergeStores(store, remote)); localStorage.setItem(KEY, JSON.stringify(store)); } catch(e) {}
    }
    cloud.ref = ref; cloud.state = 'on';
    await cloudWrite();
    if (state.screen === 'lib') renderLib(); else if (state.screen === 'path') renderPath(); else if (state.screen === 'story') renderStory(); else if (state.screen === 'words') renderWords();
    refreshSync();
  } catch(e) { cloud.ref = null; cloud.state = 'local'; refreshSync(); }
}
function syncNote(){
  return cloud.state === 'on' ? 'Прогресс сохраняется в вашем аккаунте и доступен на других устройствах.'
    : cloud.state === 'connecting' ? 'Подключаем сохранение…'
    : 'Прогресс хранится в этом браузере.';
}
function refreshSync(){ const el = document.getElementById('sync'); if (el) { el.className = 'sub sync' + (cloud.state === 'on' ? ' on' : ''); el.lastChild.textContent = syncNote(); } }

const state = { screen:'lib', sid:null, ci:0, run:null, cards:null, selW:null };
const app = document.getElementById('app');
const layer = document.getElementById('layer');
const live = document.getElementById('live');
const FS = [22, 26, 30];
const FS_NAMES = ['Мелкий', 'Средний', 'Крупный'];
const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function esc(s){ return String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }
function say(msg){ live.textContent = ''; setTimeout(() => { live.textContent = msg; }, 30); }

const I = {
  back:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>',
  close:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  play:'<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4.5v15l12-7.5z"/></svg>',
  stop:'<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>',
  sound:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M16 9a4 4 0 0 1 0 6"/></svg>',
  mic:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"/></svg>',
  mark:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true"><path d="M6.5 3.5h11v17l-5.5-4-5.5 4z"/></svg>',
  marked:'<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true"><path d="M6.5 3.5h11v17l-5.5-4-5.5 4z"/></svg>',
  check:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  lock:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',
  trash:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 7h14M10 7V4.5h4V7M7 7l1 13h8l1-13"/></svg>',
  books:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true"><path d="M5 4h6v16H5zM13 4h6v16h-6z"/></svg>',
  checkS:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  doc:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M6 3h9l4 4v14H6z"/><path d="M9 12h7M9 16h5"/></svg>',
  path:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="6" cy="5.5" r="2.5"/><circle cx="18" cy="18.5" r="2.5"/><path d="M8.5 5.5H15a3.5 3.5 0 0 1 0 7H9a3.5 3.5 0 0 0 0 7h6.5"/></svg>',
  cards:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="6" width="12" height="15" rx="2"/><path d="M8 3h10a2 2 0 0 1 2 2v13"/></svg>'
};

/* ---------- covers ---------- */
const badge = (t, dark) => `<span class="cv-badge"${dark ? ' style="color:#1F2A30;border-color:rgba(31,42,48,.6)"' : ''}>${t}</span>`;
const vstack = t => Array.from(t).map(c => `<span style="display:block">${c}</span>`).join('');
const COVERS = {
  jiudian: `<div class="a" style="inset:0;background:radial-gradient(circle at 80% 16%,rgba(255,196,128,.55) 0,rgba(255,196,128,0) 36%),radial-gradient(circle at 24% 40%,rgba(255,214,160,.32) 0,rgba(255,214,160,.32) 5%,rgba(255,214,160,0) 5.5%),radial-gradient(circle at 44% 24%,rgba(255,226,180,.22) 0,rgba(255,226,180,.22) 3.5%,rgba(255,226,180,0) 4%),radial-gradient(circle at 12% 66%,rgba(150,175,255,.24) 0,rgba(150,175,255,.24) 6%,rgba(150,175,255,0) 6.5%),radial-gradient(circle at 62% 56%,rgba(255,200,140,.2) 0,rgba(255,200,140,.2) 4%,rgba(255,200,140,0) 4.5%),radial-gradient(circle at 34% 78%,rgba(255,186,120,.16) 0,rgba(255,186,120,.16) 7%,rgba(255,186,120,0) 7.5%),linear-gradient(180deg,#1D2648 0%,#121931 62%,#0B0F21 100%)"></div>
    <span class="a" style="left:14px;top:150px;font-family:'Noto Sans',sans-serif;font-weight:200;font-size:118px;letter-spacing:-.03em;color:rgba(255,255,255,.1)">9:10</span>
    <div class="a" style="inset:0;background:linear-gradient(0deg,rgba(8,10,22,.88) 0%,rgba(8,10,22,0) 42%)"></div>
    ${badge('HSK 1–3')}
    <div class="a" style="right:20px;top:22px;display:flex;gap:10px;align-items:flex-start">
      <span style="writing-mode:vertical-rl;font-family:'Noto Serif SC',serif;font-size:13px;letter-spacing:.25em;color:#EBCFAE">他说我来晚了</span>
      <span style="writing-mode:vertical-rl;font-family:'Noto Serif SC',serif;font-weight:900;font-size:62px;line-height:1;letter-spacing:.06em;color:#F8EEE2">九点十分</span>
    </div>
    <div class="a" style="left:20px;bottom:22px;display:flex;flex-direction:column;gap:4px"><span style="font-size:20px;font-weight:600">Девять десять</span><span style="font-size:12px;color:#EBCFAE">офисный роман</span></div>`,
  '1998': `<div class="a" style="inset:0;background:radial-gradient(circle at 0% 0%,rgba(255,138,61,.85) 0,rgba(255,138,61,0) 58%),radial-gradient(circle at 100% 100%,rgba(214,69,122,.55) 0,rgba(214,69,122,0) 52%),linear-gradient(160deg,#4A3326 0%,#26180F 100%)"></div>
    <div class="a" style="inset:0;background:repeating-linear-gradient(0deg,rgba(255,255,255,.05) 0,rgba(255,255,255,.05) 1px,rgba(255,255,255,0) 1px,rgba(255,255,255,0) 3px)"></div>
    <div class="a" style="inset:0;background:linear-gradient(0deg,rgba(20,10,6,.8) 0%,rgba(20,10,6,0) 50%)"></div>
    ${badge('HSK 1–3')}
    <span class="a" style="right:18px;top:22px;font-family:'Noto Sans',sans-serif;font-weight:500;font-size:14px;letter-spacing:.08em;text-shadow:0 0 6px rgba(255,255,255,.6)">PLAY ▶</span>
    <div class="a" style="left:20px;bottom:82px;display:flex;flex-direction:column;color:#FFF1D6;text-shadow:0 2px 0 rgba(0,0,0,.25)"><span style="font-family:'ZCOOL QingKe HuangYou',sans-serif;font-size:42px;line-height:1.05">回到</span><span style="font-family:'ZCOOL QingKe HuangYou',sans-serif;font-size:64px;line-height:1">一九九八</span></div>
    <div class="a" style="left:20px;bottom:22px;display:flex;flex-direction:column;gap:4px"><span style="font-size:20px;font-weight:600">Назад в 1998</span><span style="font-size:12px;color:#FFD3A8">попаданка</span></div>
    <span class="a" style="right:18px;bottom:24px;font-family:'Noto Sans',sans-serif;font-weight:500;font-size:13px;letter-spacing:.06em;color:#FFB259;text-shadow:0 0 6px rgba(255,150,60,.8)">1998 07 01</span>`,
  gong: `<div class="a" style="inset:0;background:radial-gradient(circle at 72% 20%,#F3E9C9 0,#F3E9C9 10%,rgba(243,233,201,0) 10.5%),radial-gradient(circle at 72% 20%,rgba(243,233,201,.3) 0,rgba(243,233,201,0) 32%),linear-gradient(180deg,#134543 0%,#0E2F2E 70%)"></div>
    <div class="a" style="left:0;right:0;bottom:120px;height:14px;background:repeating-linear-gradient(90deg,#B8913D 0,#B8913D 10px,#D6B25B 10px,#D6B25B 20px)"></div>
    <div class="a" style="left:0;right:0;bottom:0;height:120px;background:#7A2620"></div>
    <svg class="a" width="46" height="56" viewBox="0 0 46 56" fill="#0A1F1E" style="left:196px;bottom:132px"><path d="M14 9L15 0l6 6zM25 6l6-6 1 9z"/><circle cx="23" cy="13" r="10"/><ellipse cx="23" cy="38" rx="15" ry="17"/><path d="M35 50c9-2 11-12 5-18" fill="none" stroke="#0A1F1E" stroke-width="4" stroke-linecap="round"/></svg>
    ${badge('HSK 2–4')}
    <div class="a" style="left:18px;top:58px;display:flex;gap:8px;align-items:flex-start"><span style="display:flex;flex-direction:column;font-family:'Ma Shan Zheng',cursive;font-size:70px;line-height:1;color:#F5E6C4">${vstack('宫里的猫')}</span><span style="writing-mode:vertical-rl;font-family:'Noto Serif SC',serif;font-size:13px;letter-spacing:.25em;color:#CFE3D9">皇上，猫不见了</span></div>
    <div class="a" style="left:20px;bottom:22px;display:flex;flex-direction:column;gap:4px"><span style="font-size:20px;font-weight:600;color:#F5E6C4">Кошка во дворце</span><span style="font-size:12px;color:#F4CFA6">дворцовая комедия</span></div>`,
  huli: `<div class="a" style="inset:0;background:linear-gradient(180deg,#2E2350 0%,#6F4F9E 42%,#C98FB4 72%,#F4C2AE 100%)"></div>
    <span class="a" style="left:186px;top:44px;width:62px;height:62px;border-radius:50%;box-shadow:14px -8px 0 0 #FFF1DC"></span>
    <span class="a" style="left:40px;top:120px;width:14px;height:9px;border-radius:50% 0;background:rgba(255,222,232,.85);transform:rotate(-20deg)"></span>
    <span class="a" style="left:230px;top:170px;width:12px;height:8px;border-radius:50% 0;background:rgba(255,222,232,.8);transform:rotate(30deg)"></span>
    <span class="a" style="left:96px;top:330px;width:16px;height:10px;border-radius:50% 0;background:rgba(255,232,238,.9);transform:rotate(10deg)"></span>
    <span class="a" style="left:252px;top:300px;width:11px;height:7px;border-radius:50% 0;background:rgba(255,232,238,.85);transform:rotate(-35deg)"></span>
    ${badge('HSK 2–4')}
    <div class="a" style="left:0;right:0;top:200px;display:flex;flex-direction:column;align-items:center;gap:6px"><span style="font-family:'ZCOOL XiaoWei',serif;font-size:48px;letter-spacing:.04em;color:#FFF6EC;text-shadow:0 2px 12px rgba(46,35,80,.45)">隔壁的狐狸</span><span style="font-family:'Noto Sans',sans-serif;font-size:12px;letter-spacing:.12em;color:#FFF6EC">Gébì de húli</span></div>
    <div class="a" style="left:20px;bottom:22px;display:flex;flex-direction:column;gap:4px;color:#3B2350"><span style="font-size:20px;font-weight:600">Лис по соседству</span><span style="font-size:12px">фэнтези-романтика</span></div>`,
  shan: `<div class="a" style="inset:0;background:linear-gradient(180deg,#E3E8EA 0%,#C9D2D6 48%,#A3B1B8 100%)"></div>
    <div class="a" style="left:0;right:0;bottom:150px;height:170px;background:#9AABB4;clip-path:polygon(0 70%,12% 40%,22% 58%,38% 18%,52% 50%,64% 30%,80% 55%,100% 25%,100% 100%,0 100%)"></div>
    <div class="a" style="left:0;right:0;bottom:70px;height:190px;background:#6B7E88;clip-path:polygon(0 45%,15% 62%,30% 30%,45% 55%,58% 20%,72% 48%,86% 35%,100% 60%,100% 100%,0 100%)"></div>
    <div class="a" style="left:0;right:0;bottom:0;height:150px;background:#33444D;clip-path:polygon(0 30%,20% 18%,42% 34%,60% 10%,78% 28%,100% 14%,100% 100%,0 100%)"></div>
    <span class="a" style="left:169px;top:297px;width:22px;height:11px;border-radius:11px 11px 0 0;background:#C8342B"></span>
    <span class="a" style="left:179px;top:307px;width:2px;height:11px;background:#1F2A30"></span>
    <div class="a" style="inset:0;background:repeating-linear-gradient(100deg,rgba(255,255,255,0) 0,rgba(255,255,255,0) 7px,rgba(255,255,255,.28) 7px,rgba(255,255,255,.28) 8px);opacity:.55"></div>
    ${badge('HSK 1', true)}
    <div class="a" style="right:20px;top:24px;display:flex;gap:10px;align-items:flex-start"><span style="writing-mode:vertical-rl;font-family:'Noto Serif SC',serif;font-size:13px;letter-spacing:.25em;color:#3A4A52">伞是我师兄的</span><span style="display:flex;flex-direction:column;font-family:'Zhi Mang Xing',cursive;font-size:54px;line-height:1;color:#1F2A30">${vstack('山上下雨了')}</span></div>
    <div class="a" style="left:20px;bottom:22px;display:flex;flex-direction:column;gap:4px"><span style="font-size:20px;font-weight:600">В горах пошёл дождь</span><span style="font-size:12px;color:#C9D3D8">сянься</span></div>`
  ,duishou: `<div class="a" style="inset:0;background:radial-gradient(ellipse 60% 78% at 26% 0%,rgba(255,236,210,.42) 0,rgba(255,236,210,0) 70%),radial-gradient(ellipse 60% 78% at 76% 0%,rgba(205,220,255,.36) 0,rgba(205,220,255,0) 70%),linear-gradient(180deg,#2A2230 0%,#17131C 70%,#100D13 100%)"></div>
    <div class="a" style="left:0;right:0;bottom:0;height:16px;background:repeating-linear-gradient(135deg,#F1EEF4 0,#F1EEF4 14px,#17131C 14px,#17131C 28px)"></div>
    ${badge('HSK 2–4')}
    <span class="a" style="right:18px;top:22px;font-family:'Noto Sans SC',sans-serif;font-size:12px;letter-spacing:.14em;color:#D9CBBE">第一场 第三次</span>
    <div class="a" style="left:0;right:0;top:122px;display:flex;flex-direction:column;align-items:center;gap:12px"><span style="font-family:'Noto Sans SC',sans-serif;font-weight:900;font-size:80px;letter-spacing:.08em;line-height:1;color:#F7F1EA">对手戏</span><span style="font-family:'Noto Serif SC',serif;font-size:13px;letter-spacing:.3em;color:#D9CBBE">再来一次，我等你</span></div>
    <div class="a" style="left:20px;bottom:36px;display:flex;flex-direction:column;gap:4px"><span style="font-size:20px;font-weight:600">Сцена на двоих</span><span style="font-size:12px;color:#D9CBBE">шоу-бизнес</span></div>`


};
function cover(id, w){ return `<div class="cv" style="width:${w}px;height:${Math.round(w*1.5)}px" aria-hidden="true"><div class="cv-in" style="transform:scale(${w/300})">${COVERS[id]}</div></div>`; }
function appW(){ return Math.min(document.documentElement.clientWidth || 390, 480); }

/* ---------- helpers ---------- */
function lookup(tok){
  const parts = tok.split('|'); const base = parts[0];
  const e = DICT[tok] || DICT[base]; if (!e) return { w: base, py: parts[1] || '', ru: '', hsk: -1 };
  return { w: base, py: parts[1] || e[0], ru: e[1], hsk: e[2] };
}
function hskLabel(h){ return h === 0 ? 'имя' : (h === -1 ? 'сложнее HSK 3' : 'HSK ' + h); }
function prog(sid){ return store.progress[sid] || (store.progress[sid] = { done: [] }); }
function isDone(sid, ci){ return prog(sid).done.indexOf(ci) >= 0; }
function nextCi(sid){ const s = S[sid]; for (let i = 0; i < s.chapters.length; i++) if (!isDone(sid, i)) return i; return s.chapters.length - 1; }
function markDone(){
  const p = prog(state.sid);
  if (p.done.indexOf(state.ci) < 0) {
    p.done.push(state.ci); store.doneLog.push({ s: state.sid, c: state.ci, l: chapter().hsk, at: Date.now() });
    logEvent('ch', 'Глава ' + (state.ci + 1) + ' «' + chapter().zh + '», ' + S[state.sid].ru); save();
  }
  updateExamCta();
}
function levels(){
  const m = {}; STORIES.forEach(st => st.chapters.forEach(c => { m[c.hsk] = (m[c.hsk] || 0) + 1; }));
  return Object.keys(m).map(Number).sort((a, b) => a - b).map(l => ({ l, total: m[l], parts: Math.ceil(m[l] / 3) }));
}
function partSize(L, k){ const lv = levels().find(x => x.l === L); return lv ? Math.min(3, lv.total - 3 * (k - 1)) : 3; }
function partChs(L, k){ return store.doneLog.filter(d => d.l === L).slice(3 * (k - 1), 3 * k); }
function partOf(sid, ci){
  const c = S[sid].chapters[ci]; const items = store.doneLog.filter(d => d.l === c.hsk);
  const pos = items.findIndex(d => d.s === sid && d.c === ci);
  return pos < 0 ? null : { L: c.hsk, k: Math.floor(pos / 3) + 1 };
}
function need(total){ return Math.ceil(total * 0.7); }
function updateExamCta(){
  const el = document.getElementById('examcta'); if (!el || state.screen !== 'read') return;
  const s = S[state.sid]; const pi = partIdx(s, state.ci); if (pi < 0) { el.innerHTML = ''; return; }
  const size = partSizeS(s, pi), have = partHave(s, pi); const r = store.exams[examKey(s.id, pi)];
  if (have >= size && !(r && r.passed)) el.innerHTML = `<button class="rpill exam-cta" data-a="exam" data-s="${s.id}" data-p="${pi}">${I.doc} Открыт экзамен: ${esc(partLabel(s, pi))}</button>`;
  else if (have < size) el.innerHTML = `<p class="k2">${esc(partLabel(s, pi))}: прочитано ${have} из ${size}. Когда прочитаете все, откроется экзамен.</p>`;
  else el.innerHTML = '';
}
function chapter(){ return S[state.sid].chapters[state.ci]; }
function castName(s, id){ return id === 'n' ? 'Автор' : s.cast[id].ru; }
function plain(t){ return t.split(' ').map(x => x.split('|')[0]).join(''); }
function quoteOf(t){ const toks = t.split(' ').map(x => x.split('|')[0]); const a = toks.indexOf('“'), b = toks.lastIndexOf('”'); return (a >= 0 && b > a ? toks.slice(a + 1, b) : toks).join(''); }
function savedIdx(w){ return store.words.findIndex(x => x.w === w); }
function setMode(m){ document.documentElement.classList.remove('lib','rd'); document.documentElement.classList.add(m); }

/* ---------- speech ---------- */
const synth = window.speechSynthesis || null;
let zhVoice = null;
function pickVoice(){ if (!synth) return; const vs = synth.getVoices() || []; zhVoice = vs.find(v => /zh[-_]CN/i.test(v.lang)) || vs.find(v => /^zh/i.test(v.lang)) || null; }
if (synth) { pickVoice(); try { synth.addEventListener('voiceschanged', pickVoice); } catch(e) { synth.onvoiceschanged = pickVoice; } }
const PITCH = { n: 1, f: 1.2, f2: 1.05, m: 0.85, m2: 1, m3: 0.72, m4: 0.95, c: 1.4 };
function speak(text, v, onend){
  if (!synth) { if (onend) setTimeout(onend, 0); return false; }
  try {
    synth.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'zh-CN'; if (zhVoice) u.voice = zhVoice;
    u.rate = 0.8; u.pitch = PITCH[v] || 1;
    let fired = false; const fin = () => { if (!fired) { fired = true; if (onend) onend(); } };
    u.onend = fin; u.onerror = fin;
    synth.speak(u);
    setTimeout(fin, 2500 + text.length * 450);
    return true;
  } catch(e) { if (onend) setTimeout(onend, 0); return false; }
}
function userSpeak(text, v){
  const r = state.run;
  if (r && !r.waiting && !r.done) { r.token = Math.random(); r.manual = true; renderTool(); }
  speak(text, v);
}
function voiceOf(s, who){ return who === 'n' ? 'n' : (s.cast[who] ? s.cast[who].v : 'n'); }

/* ---------- recording ---------- */
const canRec = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder);
let recObj = null;
function startRec(){
  const r = state.run; if (!r) return;
  navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
    if (!state.run) { stream.getTracks().forEach(t => t.stop()); return; }
    const mr = new MediaRecorder(stream); const chunks = [];
    mr.ondataavailable = e => { if (e.data && e.data.size) chunks.push(e.data); };
    mr.onstop = () => {
      stream.getTracks().forEach(t => t.stop());
      if (state.run && chunks.length) { const blob = new Blob(chunks, { type: mr.mimeType || 'audio/webm' }); if (state.run.myUrl) URL.revokeObjectURL(state.run.myUrl); state.run.myUrl = URL.createObjectURL(blob); }
      if (state.run) { state.run.rec = 'idle'; renderTool(); }
    };
    recObj = mr; mr.start(); r.rec = 'on'; renderTool(); say('Идёт запись');
  }).catch(() => { if (state.run) { state.run.micFail = true; state.run.rec = 'idle'; renderTool(); } });
}
function stopRec(silent){ if (recObj && recObj.state === 'recording') { try { recObj.stop(); } catch(e) {} } recObj = null; if (!silent && state.run) { state.run.rec = 'idle'; } }

/* ---------- library ---------- */
function renderLib(){
  setMode('lib'); state.screen = 'lib';
  const W = appW();
  const last = store.last && S[store.last.s] ? store.last : null;
  const ls = last ? S[last.s] : STORIES[0];
  const lc = last ? last.c : 0;
  const done = prog(ls.id).done.length;
  const colW = Math.min(150, Math.floor((W - 32 - 24) / 2.5));
  const GROUPS = [{ id: 'dushi', name: 'Современные', zh: '都市', py: 'dūshì' }, { id: 'guzhuang', name: 'Исторические', zh: '古装', py: 'gǔzhuāng' }, { id: 'qihuan', name: 'Фэнтези и попаданцы', zh: '奇幻', py: 'qíhuàn' }];
  const LVS = uniq(STORIES.map(st => st.chapters[0].hsk)).sort((a, b) => a - b);
  const sel = store.prefs.lvl || 'all';
  const fit = st => sel === 'all' || st.chapters[0].hsk === sel;
  const anyFit = STORIES.some(fit);
  app.innerHTML = `
  <header class="top"><div class="logo"><b lang="zh-CN">追剧</b><span class="pyf">zhuījù</span></div></header>
  <main class="lib-main">
    <button class="cont" data-a="open" data-s="${ls.id}" data-c="${lc}">
      ${cover(ls.id, Math.min(140, Math.floor(W * 0.36)))}
      <span class="cont-info">
        <span>
          <span class="k">${last ? 'Продолжить' : 'Начните с этой истории'}</span>
          <span class="t" style="display:block">${esc(ls.ru)}</span>
          <span class="z zhf" lang="zh-CN" style="display:block">${esc(ls.zh)}</span>
          <span class="c" style="display:block">Глава ${lc + 1}: <span class="zhf" lang="zh-CN">${esc(ls.chapters[lc].zh)}</span></span>
        </span>
        <span>
          <span class="bar4"><span style="width:${Math.round(done / ls.chapters.length * 100)}%"></span></span>
          <span class="k" style="display:block;margin-bottom:12px">${done} из ${ls.chapters.length} глав</span>
          <span class="pill">${I.play} Читать</span>
        </span>
      </span>
    </button>
    <p class="chips-l" id="lvl-l">С какого уровня начать</p>
    <div class="chips" role="group" aria-labelledby="lvl-l">
      <button class="chip" data-a="lvl" data-v="all" aria-pressed="${sel === 'all'}">Все</button>
      ${LVS.map(l => `<button class="chip" data-a="lvl" data-v="${l}" aria-pressed="${sel === l}">HSK ${l}</button>`).join('')}
    </div>
    ${anyFit ? '' : '<p class="nores">Для этого уровня историй пока нет.</p>'}
    ${GROUPS.map(g => { const list = STORIES.filter(s => s.cat === g.id && fit(s)); if (!list.length) return ''; return `
    <section aria-label="${g.name}">
      <div class="shelf-h"><h2>${g.name}<span class="gz"><span class="zhf" lang="zh-CN">${g.zh}</span> <span class="pyf">${g.py}</span></span></h2><span>${list.length} ${plural(list.length, 'история', 'истории', 'историй')}</span></div>
      <div class="shelf">${list.map(s => `<button class="card" data-a="story" data-s="${s.id}" style="width:${colW}px">
        ${cover(s.id, colW)}
        <span><span class="t" style="display:block">${esc(s.ru)}</span><span class="m" style="display:block">${esc(s.genre)}, ${esc(s.hsk)}</span></span>
      </button>`).join('')}</div>
    </section>`; }).join('')}
  </main>
  ${tabs('lib')}`;
}
function tabs(cur){
  const n = store.words.length;
  return `<nav class="tabs" aria-label="Разделы">
    <button data-a="tab-lib" ${cur === 'lib' ? 'aria-current="page"' : ''}>${I.books}Истории</button>
    <button data-a="tab-path" ${cur === 'path' ? 'aria-current="page"' : ''}>${I.path}Путь</button>
    <button data-a="tab-words" ${cur === 'words' ? 'aria-current="page"' : ''}>${I.cards}Слова${n ? ' (' + n + ')' : ''}</button>
  </nav>`;
}

/* ---------- story ---------- */
function renderStory(){
  setMode('lib'); state.screen = 'story';
  const s = S[state.sid]; const W = appW();
  const vi = s.versions ? ((store.prefs.ver || {})[s.id] || 0) : -1; const vparts = s.versions ? s.parts.filter(p => p.ver === s.versions[vi]) : null;
  const vfrom = vparts ? vparts[0].from : 0, vto = vparts ? vparts[vparts.length - 1].to : s.chapters.length - 1;
  let nx = vto; for (let c = vfrom; c <= vto; c++) if (!isDone(s.id, c)) { nx = c; break; }
  const role = store.roles[s.id];
  const lv = s.chapters[0].hsk;
  const doneN = prog(s.id).done.length;
  app.innerHTML = `
  <div class="story">
    <div class="backdrop" aria-hidden="true">${cover(s.id, W + 40)}</div>
    <div class="fade" aria-hidden="true"></div>
    <div class="sbar"><button class="ib" data-a="tab-lib" aria-label="Назад к историям">${I.back}</button></div>
    <div class="shead">
      ${cover(s.id, 150)}
      <div>
        <h1>${esc(s.ru)}</h1>
        <div class="zt"><span class="zhf" lang="zh-CN">${esc(s.zh)}</span>&nbsp;&nbsp;<span class="pyf">${esc(s.py)}</span></div>
        <div class="g">${esc(s.genre)}, ${esc(s.hsk)}</div>
      </div>
    </div>
    <div class="sbody">
      <p class="premise">${esc(s.premise)}</p>
      ${s.roles && s.roles.length ? `<div>
        <p class="lbl">Чтение по ролям: за кого читаете вы</p>
        <div class="rolepick">${s.roles.map(r => `<button class="rolebtn" data-a="role" data-r="${r}" aria-pressed="${role === r}"><span class="z" lang="zh-CN">${esc(s.cast[r].zh)}</span><span class="r">${esc(s.cast[r].ru)}</span></button>`).join('')}</div>
      </div>` : ''}
      <button class="pill full" data-a="open" data-s="${s.id}" data-c="${nx}">${s.chapters[nx].no ? 'Читать сцену ' + s.chapters[nx].no : 'Читать главу ' + (nx + 1)}</button>
      <section>
        ${s.versions ? `<div class="chips vchips" role="radiogroup" aria-label="Версия">${s.versions.map((v, i) => `<button class="chip" role="radio" aria-checked="${vi === i}" data-a="setver" data-s="${s.id}" data-v="${i}">${esc(v)}</button>`).join('')}</div>` : ''}
        ${(() => { const n = vto - vfrom + 1; let d = 0; for (let c = vfrom; c <= vto; c++) if (isDone(s.id, c)) d++; return `<div class="chhead"><h2>${s.season ? esc(s.season) : 'HSK ' + lv} <span>${s.versions ? esc(s.versions[vi]) : (s.season ? 'HSK ' + lv : '')}${s.versions || s.season ? ', ' : ''}${n} ${plural(n, s.versions ? 'сцена' : 'глава', s.versions ? 'сцены' : 'главы', s.versions ? 'сцен' : 'глав')}</span></h2><span class="n">${d} из ${n}</span></div>`; })()}
        ${(vparts || s.parts || [{ name: '', from: 0, to: s.chapters.length - 1 }]).map(pt => `
          ${pt.name ? `<h3 class="parth">${esc(pt.name)}</h3>` : ''}
          <ol class="chl" start="${pt.from + 1}">${s.chapters.slice(pt.from, pt.to + 1).map((c, j) => { const i = pt.from + j; return `<li><button class="ch${i === nx && !isDone(s.id, i) ? ' next' : ''}" data-a="open" data-s="${s.id}" data-c="${i}">
          <span class="no">${c.no || i + 1}</span>
          <span class="tt"><span class="z" lang="zh-CN">${esc(c.zh)}</span><span class="r">${esc(c.ru)}</span></span>
          ${isDone(s.id, i) ? `<span class="st" role="img" aria-label="Прочитана">${I.check}</span>` : (i === nx ? '<span class="st">дальше</span>' : '<span></span>')}
        </button></li>`; }).join('')}</ol>
          ${partGrammar(s, pt).length ? `<button class="gprow" data-a="gpart" data-p="${s.parts.indexOf(pt)}"><span class="gpi" aria-hidden="true">语</span><span class="tt"><span class="z">Грамматика части</span><span class="r">${partGrammar(s, pt).length} ${plural(partGrammar(s, pt).length, 'тема', 'темы', 'тем')}</span></span><span class="st" aria-hidden="true">›</span></button>` : ''}`).join('')}
        <div class="locked"><span>${s.next ? esc(s.next) : 'Главы ' + (s.chapters.length + 1) + '–' + (s.chapters.length + 3)}</span><span>${I.lock} скоро</span></div>
      </section>
    </div>
  </div>`;
}

/* ---------- reader ---------- */
const OPENP = new Set(['“', '‘', '《', '（', '(']);
function paraHTML(s, p, i, roleId){
  const who = p[0]; const gm = chapter().gm || {};
  /* punctuation never starts a line: closing marks stick to the word before, opening quotes to the word after */
  const units = []; let open = '';
  p[1].split(' ').forEach((t, k) => {
    if (CJK.test(t)) { const e = lookup(t); const g = gm[i + ',' + k]; units.push({ pre: open, w: `<button class="w${g ? ' gm' : ''}" data-a="word" data-i="${i}" data-k="${k}"${g ? ` data-g="${g}"` : ''}><ruby>${esc(e.w)}<rt>${esc(e.py)}</rt></ruby></button>`, post: '' }); open = ''; }
    else if (OPENP.has(t)) open += `<span class="pu">${esc(t)}</span>`;
    else if (units.length) units[units.length - 1].post += `<span class="pu">${esc(t)}</span>`;
    else open += `<span class="pu">${esc(t)}</span>`;
  });
  let h = units.map(u => u.pre || u.post ? `<span class="nb">${u.pre}${u.w}${u.post}</span>` : u.w).join('') + open;
  const mine = state.run && state.run.mode === 'role' && roleId === who;
  const label = who === 'n' ? '' : `<div class="who">${mine ? 'Вы, ' : ''}${esc(s.cast[who].ru)}</div>`;
  return `<div class="para${mine ? ' mine' : ''}" data-i="${i}"><div class="pc">${label}<p class="zh" lang="zh-CN">${h}</p><p class="ru">${esc(p[2])}</p></div><button class="pl" data-a="pspeak" data-i="${i}" aria-label="Послушать фразу">${I.sound}</button></div>`;
}
function renderReader(keepScroll){
  setMode('rd'); state.screen = 'read';
  const s = S[state.sid]; const c = chapter(); const role = store.roles[s.id];
  const y = window.scrollY;
  const last = state.ci === s.chapters.length - 1;
  app.innerHTML = `
  <header class="rbar">
    <button class="ib" data-a="story" data-s="${s.id}" aria-label="Назад к истории" style="color:var(--rd-text)">${I.back}</button>
    <div class="mid"><span class="a">${esc(s.ru)}</span><span class="b">${c.label ? esc(c.label) : `Глава ${state.ci + 1} из ${s.chapters.length}`}</span></div>
    <button class="ib aa" data-a="fs" aria-label="Текст и тема" aria-haspopup="dialog">Aa</button>
    <div class="prog" aria-hidden="true"><span id="pf"></span></div>
  </header>
  <article class="text${store.prefs.py ? '' : ' nopy'}${store.prefs.tr ? ' alltr' : ''}${state.run ? ' running' : ''}" style="--fs:${FS[store.prefs.fs]}px">
    <div class="chmeta">${c.label ? esc(c.label) : `Глава ${state.ci + 1}, HSK ${c.hsk}`}</div>
    <h1 lang="zh-CN">${esc(c.zh)}</h1>
    <div class="chpy">${esc(c.py)}</div>
    <div class="chru">${esc(c.ru)}</div>
    ${c.gram && c.gram.length ? `<p class="gleg"><span class="gsample">字</span>Пунктиром подчёркнута новая грамматика серии. Нажмите, чтобы прочитать правило.</p>` : ''}
    ${c.new && c.new.length ? `<details class="newwords"><summary>Новые слова серии: ${c.new.length}</summary><div class="nw">${c.new.map(w => { const e = lookup(w); return `<span><b lang="zh-CN">${esc(e.w)}</b>${esc(e.py)}</span>`; }).join('')}</div></details>` : ''}
    ${store.hint ? `<div class="hint"><span>Нажмите на слово, чтобы увидеть перевод. Нажмите на свободное место в абзаце, чтобы открыть перевод фразы.</span><button data-a="hint">Понятно</button></div>` : ''}
    <div class="paras">${c.p.map((p, i) => (i === c.eggAt ? `<div class="egg-h"><span lang="zh-CN" class="zhf">彩蛋</span><span>cǎidàn, сцена после титров</span></div>` : '') + paraHTML(s, p, i, role)).join('')}</div>
    <div class="endch" id="endch">
      <div class="k">${c.label ? 'Конец: ' + esc(c.label) : 'Конец главы ' + (state.ci + 1)}</div>
      <div id="examcta"></div>
      ${(() => { const pi = partEndingAt(s, state.ci); if (pi < 0) return ''; const pt = s.parts[pi];
        return `<button class="rpill" data-a="gpart" data-p="${pi}">Дальше: грамматика части</button>
          ${last ? '' : `<button class="rghost" data-a="next">Сразу дальше</button>`}`; })()}
      ${partEndingAt(s, state.ci) >= 0 ? '' : (last ? `<button class="rghost" data-a="story" data-s="${s.id}">Продолжение скоро. К истории</button>`
             : `<button class="rpill" data-a="next">${s.chapters[state.ci + 1].label ? esc(s.chapters[state.ci + 1].label) : 'Глава ' + (state.ci + 2)}: <span lang="zh-CN" class="zhf">${esc(s.chapters[state.ci + 1].zh)}</span></button>
                <button class="rghost" data-a="story" data-s="${s.id}">К истории</button>`)}
    </div>
  </article>
  <div class="tool" id="tool"></div>`;
  renderTool();
  if (keepScroll) window.scrollTo(0, y); else window.scrollTo(0, 0);
  if (state.run) highlight(state.run.idx, false);
  onScroll();
  observeEnd();
  updateExamCta();
}
let io = null;
function observeEnd(){
  if (io) { io.disconnect(); io = null; }
  const el = document.getElementById('endch');
  if (!el || !('IntersectionObserver' in window)) return;
  io = new IntersectionObserver(es => { es.forEach(e => { if (e.isIntersecting && state.screen === 'read' && window.scrollY > 40) markDone(); }); }, { threshold: 0.6 });
  io.observe(el);
}
function onScroll(){
  if (state.screen !== 'read') return;
  const pf = document.getElementById('pf'); if (!pf) return;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  pf.style.width = (max > 0 ? Math.min(100, Math.max(0, window.scrollY / max * 100)) : 100) + '%';
}
window.addEventListener('scroll', onScroll, { passive: true });

/* keep the line being read in place when the layout changes height */
let anchorToken = 0;
['touchstart', 'wheel', 'keydown'].forEach(ev => window.addEventListener(ev, () => { anchorToken++; }, { passive: true }));
function withAnchor(change){
  const paras = Array.from(document.querySelectorAll('.para'));
  if (!paras.length) { change(); return; }
  const bar = document.querySelector('.rbar'); const tool = document.getElementById('tool');
  const top = bar ? bar.getBoundingClientRect().bottom : 0;
  const bottom = tool ? tool.getBoundingClientRect().top : window.innerHeight;
  const lineY = top + (bottom - top) * 0.35;
  let target = state.run ? document.querySelector('.para.cur') : null;
  if (target) { const r = target.getBoundingClientRect(); if (r.bottom < top || r.top > bottom) target = null; }
  if (!target) target = paras.find(p => p.getBoundingClientRect().bottom >= lineY) || paras[paras.length - 1];
  const r0 = target.getBoundingClientRect();
  const frac = r0.height ? Math.min(1, Math.max(0, (lineY - r0.top) / r0.height)) : 0;
  const y0 = r0.top + frac * r0.height;
  const token = ++anchorToken;
  const fix = () => {
    if (token !== anchorToken || !target.isConnected) return;
    const r = target.getBoundingClientRect(); const d = r.top + frac * r.height - y0;
    if (Math.abs(d) > 1) window.scrollTo(0, window.scrollY + d);
    onScroll();
  };
  change();
  fix();
  requestAnimationFrame(() => { fix(); requestAnimationFrame(fix); });
  [80, 200, 400].forEach(ms => setTimeout(fix, ms));
}
function highlight(i, scroll){
  const r = state.run;
  document.querySelectorAll('.para').forEach(el => {
    const k = +el.dataset.i;
    el.classList.toggle('cur', !!r && k === i);
    el.classList.toggle('dim', !!r && k !== i);
  });
  if (scroll !== false && r && i >= 0) {
    const el = document.querySelector(`.para[data-i="${i}"]`);
    if (el) el.scrollIntoView({ block: 'center', behavior: reduce ? 'auto' : 'smooth' });
  }
}

function renderTool(){
  const tool = document.getElementById('tool'); if (!tool) return;
  const r = state.run; const s = S[state.sid];
  if (!r) {
    tool.innerHTML = `<div class="trow">
      <button class="tb" data-a="py" aria-pressed="${store.prefs.py}"><span lang="zh-CN" class="zhf">拼音</span></button>
      <button class="tb" data-a="tr" aria-pressed="${store.prefs.tr}">Перевод</button>
      <button class="tb" data-a="listen" aria-label="Слушать главу">${I.sound}</button>
      ${(S[state.sid].roles || []).length ? `<button class="tp" data-a="roles">${I.mic} По ролям</button>` : ''}
    </div>`;
    return;
  }
  const c = chapter();
  if (r.done) {
    tool.innerHTML = `<div class="tlabel"><span><b>${r.mode === 'role' ? 'Глава сыграна по ролям' : 'Глава прослушана'}</b></span></div>
      <div class="trow"><button class="tb" data-a="again" aria-pressed="true">Ещё раз</button><button class="tp" data-a="stoprun">Готово</button></div>`;
    return;
  }
  const p = c.p[r.idx];
  if (r.mode === 'listen') {
    tool.innerHTML = `<div class="tlabel"><span>${p[0] === 'n' ? 'Текст автора' : 'Говорит: <b>' + esc(castName(s, p[0])) + '</b>'}</span><button data-a="stoprun">Стоп</button></div>
      ${r.manual ? '<div class="trow"><button class="tp" data-a="nextline">Дальше</button></div>' + (synth ? '' : '<p class="note">Озвучка недоступна в этом браузере.</p>') : ''}`;
    return;
  }
  if (r.waiting) {
    const recBtn = canRec && !r.micFail
      ? (r.rec === 'on' ? `<button class="tb rec" data-a="recstop" aria-pressed="true">${I.stop} Стоп</button>` : `<button class="tb" data-a="rec" aria-pressed="true">${I.mic} Записать</button>`)
      : '';
    const mine = r.myUrl ? `<button class="tb" data-a="myplay" aria-pressed="true">${I.play} Моя запись</button>` : '';
    tool.innerHTML = `<div class="tlabel"><span><b>Ваша реплика.</b> Скажите её вслух</span><button data-a="stoprun">Выйти</button></div>
      <div class="trow" style="flex-wrap:wrap;row-gap:8px">
        <button class="tb" data-a="sample" aria-pressed="true">${I.sound} Образец</button>
        ${recBtn}${mine}
        <button class="tp" data-a="nextline">Дальше</button>
      </div>
      ${(!canRec || r.micFail) ? '<p class="note">Микрофон здесь недоступен. Скажите реплику вслух и сравните с образцом.</p>' : ''}`;
    return;
  }
  tool.innerHTML = `<div class="tlabel"><span>${p[0] === 'n' ? 'Текст автора' : 'Говорит: <b>' + esc(castName(s, p[0])) + '</b>'}</span><button data-a="stoprun">Выйти</button></div>
    ${r.manual ? '<div class="trow"><button class="tp" data-a="nextline">Дальше</button></div>' + (synth ? '' : '<p class="note">Озвучка недоступна в этом браузере.</p>') : ''}
    ${r.noLines ? '<p class="note">У вашего героя в этой главе нет реплик. Послушайте сцену целиком.</p>' : ''}`;
}

function startRun(mode){
  const s = S[state.sid];
  if (mode === 'role' && !store.roles[s.id]) { openRolePicker(); return; }
  stopRun(true);
  state.run = { mode, idx: 0, token: Math.random(), waiting: false, rec: 'idle', myUrl: null, micFail: false, manual: false, done: false,
    noLines: mode === 'role' && !chapter().p.some(p => p[0] === store.roles[s.id]) };
  closeSheet();
  renderReader(true);
  runStep(0);
}
function runStep(i){
  const r = state.run; if (!r) return;
  const c = chapter(); const s = S[state.sid];
  if (i >= c.p.length) { r.done = true; r.waiting = false; highlight(-1, false); document.querySelectorAll('.para').forEach(el => el.classList.remove('dim')); renderTool(); markDone(); say('Конец главы'); return; }
  r.idx = i; r.waiting = false; r.manual = false;
  if (r.myUrl) { URL.revokeObjectURL(r.myUrl); r.myUrl = null; }
  highlight(i);
  const p = c.p[i];
  if (r.mode === 'role' && p[0] === store.roles[s.id]) { r.waiting = true; renderTool(); say('Ваша реплика'); return; }
  renderTool();
  if (!synth) { r.manual = true; renderTool(); return; }
  const tok = r.token;
  speak(plain(p[1]), voiceOf(s, p[0]), () => {
    setTimeout(() => { if (state.run && state.run.token === tok && state.run.idx === i && !state.run.waiting) runStep(i + 1); }, 450);
  });
}
function stopRun(silent){
  if (state.run && state.run.myUrl) URL.revokeObjectURL(state.run.myUrl);
  stopRec(true);
  state.run = null;
  if (synth) { try { synth.cancel(); } catch(e) {} }
  if (!silent && state.screen === 'read') renderReader(true);
}

/* ---------- sheets ---------- */
function closeSheet(){ layer.innerHTML = ''; if (state.selW) { state.selW.classList.remove('sel'); state.selW = null; } }
function openWord(btn){
  const i = +btn.dataset.i, k = +btn.dataset.k;
  const tok = chapter().p[i][1].split(' ')[k];
  const e = lookup(tok);
  if (state.selW) state.selW.classList.remove('sel');
  btn.classList.add('sel'); state.selW = btn;
  if (store.hint) { store.hint = false; save(); const h = document.querySelector('.hint'); if (h) h.remove(); }
  const saved = savedIdx(e.w) >= 0;
  layer.innerHTML = `<div class="scrim" data-a="close"></div>
  <section class="sheet" role="dialog" aria-modal="true" aria-label="Слово ${esc(e.w)}">
    <div class="grab"></div>
    <div class="shd">
      <span class="big" lang="zh-CN">${esc(e.w)}</span>
      <div class="info"><span class="p">${esc(e.py)}</span><span class="r">${esc(e.ru)}</span><span class="tag">${hskLabel(e.hsk)}</span></div>
      <button class="ib shx" data-a="close" aria-label="Закрыть">${I.close}</button>
    </div>
    ${btn.dataset.g && GRAMMAR[btn.dataset.g] ? grammarCard(btn.dataset.g, i) : ''}
    <div class="sbtns">
      <button class="s1" data-a="wsay" data-w="${esc(e.w)}">${I.sound} Послушать</button>
      <button class="s2" data-a="wsave" data-tok="${esc(tok)}" aria-pressed="${saved}">${saved ? I.marked + ' В словах' : I.mark + ' В мои слова'}</button>
    </div>
  </section>`;
  const b = layer.querySelector('[data-a="wsave"]'); if (b) b.focus({ preventScroll: true });
  if (!state.run) speak(e.w, 'n');
}
function partGrammar(s, pt){ if (!pt || !s.parts) return []; const out = []; for (let ci = pt.from; ci <= pt.to; ci++) (s.chapters[ci].gx || []).forEach(x => out.push(Object.assign({ ci }, x))); return out; }
function partEndingAt(s, ci){ if (!s.parts) return -1; const pi = s.parts.findIndex(pt => pt.to === ci); return pi >= 0 && partGrammar(s, s.parts[pi]).length ? pi : -1; }
function renderGrammar(pi){
  setMode('rd'); state.screen = 'grammar'; state.gpart = pi;
  const s = S[state.sid]; const pt = s.parts[pi]; const items = partGrammar(s, pt); const nextCi = pt.to + 1;
  const byCh = []; items.forEach(x => { let g = byCh.find(b => b.ci === x.ci); if (!g) { g = { ci: x.ci, items: [] }; byCh.push(g); } g.items.push(x); });
  app.innerHTML = `
  <header class="rbar">
    <button class="ib" data-a="story" data-s="${s.id}" aria-label="Назад к истории" style="color:var(--rd-text)">${I.back}</button>
    <div class="mid"><span class="a">${esc(s.ru)}</span><span class="b">${esc(pt.name)}</span></div>
    <span></span>
    <div class="prog" aria-hidden="true"><span style="width:100%"></span></div>
  </header>
  <main class="text gpage">
    <h1>Грамматика: ${esc(partLabel(s, pi))}</h1>
    <p class="gbsub">${items.length} ${plural(items.length, 'тема', 'темы', 'тем')}. Нажмите на тему, чтобы раскрыть правило и примеры.</p>
    ${byCh.map(b => `<h2 class="gch">${esc(s.chapters[b.ci].label || 'Глава ' + (b.ci + 1))}: <span class="zhf" lang="zh-CN">${esc(s.chapters[b.ci].zh)}</span></h2>
      ${b.items.map(x => { const g = GRAMMAR[x.g]; return `<details class="gitem">
        <summary><span class="gt">${esc(g.t)}</span>${g.s ? `<span class="gs">${esc(g.s)}</span>` : ''}</summary>
        ${g.r ? `<p class="gr">${esc(g.r)}</p>` : ''}
        ${x.cur ? exampleHTML(s.chapters[x.ci], x.cur[0], x.cur[1], 'В главе ' + (x.ci + 1)) : ''}
        ${x.prev ? exampleHTML(s.chapters[x.prev[0]], x.prev[1], x.prev[2], 'Уже было в главе ' + (x.prev[0] + 1)) : ''}
        ${g.ex ? g.ex.map(ex => `<div class="gex2"><span class="gzrow"><span class="zhf" lang="zh-CN">${esc(ex[0])}</span><button class="ib gpl" data-a="gsay" data-t="${esc(ex[0])}" aria-label="Послушать пример">${I.sound}</button></span><span class="pyf">${esc(ex[1])}</span><span class="gru">${esc(ex[2])}</span></div>`).join('') : ''}
      </details>`; }).join('')}`).join('')}
    <div class="endch">
      ${nextCi < s.chapters.length ? `<button class="rpill" data-a="open" data-s="${s.id}" data-c="${nextCi}">Дальше: глава ${nextCi + 1} <span lang="zh-CN" class="zhf">${esc(s.chapters[nextCi].zh)}</span></button>` : ''}
      <button class="rghost" data-a="story" data-s="${s.id}">К истории</button>
    </div>
  </main>`;
  window.scrollTo(0, 0);
}
function exampleHTML(ch, i, k, label){
  const p = ch.p[i]; const toks = p[1].split(' ');
  const zh = toks.map((t, j) => { const b = esc(t.split('|')[0]); return j === k ? `<u>${b}</u>` : b; }).join('');
  return `<div class="gex2"><span class="gk">${label}</span>
    <span class="gzrow"><span class="zhf" lang="zh-CN">${zh}</span><button class="ib gpl" data-a="gsay" data-t="${esc(plain(p[1]))}" aria-label="Послушать пример">${I.sound}</button></span>
    <span class="pyf">${esc(pySent(p[1]))}</span><span class="gru">${esc(p[2])}</span></div>`;
}
function grammarBlock(c){
  const s = S[state.sid];
  return `<section class="gblock" aria-labelledby="gb-h">
    <h2 id="gb-h">Грамматика серии</h2>
    <p class="gbsub">${c.gx.length} ${plural(c.gx.length, 'тема', 'темы', 'тем')}. Примеры только из того, что вы уже прочитали.</p>
    ${c.gx.map(x => { const g = GRAMMAR[x.g]; return `<article class="gitem">
      <h3>${esc(g.t)}</h3>
      <p class="gr">${esc(g.r)}</p>
      <div class="gs">${esc(g.s)}</div>
      ${exampleHTML(c, x.cur[0], x.cur[1], 'В этой серии')}
      ${x.prev ? exampleHTML(s.chapters[x.prev[0]], x.prev[1], x.prev[2], 'Уже было в серии ' + (x.prev[0] + 1)) : ''}
    </article>`; }).join('')}
  </section>`;
}
function grammarCard(gid, i){
  const g = GRAMMAR[gid]; const p = chapter().p[i];
  return `<div class="gcard">
    <div class="gk">Грамматика серии</div>
    <h3>${esc(g.t)}</h3>
    <p class="gr">${esc(g.r)}</p>
    <div class="gs">${esc(g.s)}</div>
    <div class="gex"><span class="gk">Фраза из сцены</span>
      <span class="zhf" lang="zh-CN">${esc(plain(p[1]))}</span>
      <span class="pyf">${esc(pySent(p[1]))}</span>
      <span>${esc(p[2])}</span></div>
  </div>`;
}
const THEMES = [['auto', 'Как в системе'], ['light', 'Светлая'], ['dark', 'Тёмная']];
function applyTheme(){ const t = store.prefs.theme || 'auto'; if (t === 'auto') delete document.documentElement.dataset.reader; else document.documentElement.dataset.reader = t; }
function openTextSettings(){
  layer.innerHTML = `<div class="scrim" data-a="close"></div>
  <section class="sheet" role="dialog" aria-modal="true" aria-label="Текст и тема">
    <div class="grab"></div>
    <div class="shd" style="justify-content:space-between"><h2>Текст и тема</h2><button class="ib shx" data-a="close" aria-label="Закрыть">${I.close}</button></div>
    <p class="sub" style="margin:0">Размер иероглифов</p>
    <div class="sizes" role="radiogroup" aria-label="Размер иероглифов">${FS.map((f, i) => `<button class="sizeb" role="radio" aria-checked="${store.prefs.fs === i}" data-a="setfs" data-v="${i}"><span class="zhf" lang="zh-CN" style="font-size:${f}px">字</span><span>${FS_NAMES[i]}</span></button>`).join('')}</div>
    <p class="sub" style="margin:16px 0 0">Тема читалки</p>
    <div class="themes" role="radiogroup" aria-label="Тема читалки">${THEMES.map(([v, n]) => `<button class="themeb" role="radio" aria-checked="${(store.prefs.theme || 'auto') === v}" data-a="settheme" data-v="${v}">${n}</button>`).join('')}</div>
  </section>`;
  const b = layer.querySelector('.sizeb[aria-checked="true"]'); if (b) b.focus({ preventScroll: true });
}
function openRolePicker(){
  const s = S[state.sid];
  layer.innerHTML = `<div class="scrim" data-a="close"></div>
  <section class="sheet" role="dialog" aria-modal="true" aria-label="Выбор роли">
    <div class="grab"></div>
    <h2>За кого вы читаете?</h2>
    <p class="sub">Ваши реплики будут выделены, и вы скажете их вслух. Остальное прозвучит голосом.</p>
    <div class="rolepick">${s.roles.map(r => `<button class="rolebtn" data-a="pickrole" data-r="${r}"><span class="z" lang="zh-CN">${esc(s.cast[r].zh)}</span><span class="r">${esc(s.cast[r].ru)}</span></button>`).join('')}</div>
  </section>`;
  const b = layer.querySelector('.rolebtn'); if (b) b.focus({ preventScroll: true });
}

/* ---------- words ---------- */
function wLevel(w){ return lookup(w.w).hsk; }
function lvlName(h){ return h === 0 ? 'Имена' : (h === -1 ? 'Сложнее HSK 3' : 'HSK ' + h); }
function lvlOrd(h){ return h === 0 ? 99 : (h === -1 ? 50 : h); }
function setIdx(set){
  const ws = store.words; const all = ws.map((w, i) => i);
  if (!set || set === 'all') return all.filter(i => wLevel(ws[i]) !== 0);
  if (set === 'hard') return all.filter(i => ws[i].miss && wLevel(ws[i]) !== 0);
  if (set === 'today') return all.filter(i => isDueW(ws[i]) && wLevel(ws[i]) !== 0);
  const parts = set.split('|').map(x => x.split(':'));
  const hasLvl = parts.some(([k]) => k === 'lvl');
  return all.filter(i => parts.every(([k, v]) => k === 'story' ? ws[i].sid === v : String(wLevel(ws[i])) === v) && (hasLvl || wLevel(ws[i]) !== 0));
}
function setName(set){
  if (!set || set === 'all') return 'все слова';
  if (set === 'hard') return 'трудные слова';
  if (set === 'today') return 'на сегодня';
  return set.split('|').map(x => { const [k, v] = x.split(':'); return k === 'story' ? (S[v] ? S[v].ru : 'другое') : lvlName(+v); }).join(', ');
}
function lvlRange(idx){
  const hs = Array.from(new Set(idx.map(i => wLevel(store.words[i])).filter(h => h > 0))).sort((a, b) => a - b);
  return hs.length ? 'HSK ' + (hs.length > 1 ? hs[0] + '–' + hs[hs.length - 1] : hs[0]) : '';
}
function groupsBy(by){
  const ws = store.words; const m = new Map();
  ws.forEach((w, i) => { const key = by === 'story' ? w.sid : String(wLevel(w)); if (!m.has(key)) m.set(key, []); m.get(key).push(i); });
  const list = Array.from(m.entries()).map(([key, idx]) => ({ key, idx }));
  if (by === 'story') { const ids = STORIES.map(x => x.id); list.sort((a, b) => ids.indexOf(a.key) - ids.indexOf(b.key)); }
  else list.sort((a, b) => lvlOrd(+a.key) - lvlOrd(+b.key));
  return list;
}
function wordRow(i, meta){
  const w = store.words[i];
  return `<li class="wr">
    <span class="z" lang="zh-CN">${esc(w.w)}</span>
    <span class="i"><span class="p">${esc(w.py)}</span><span class="r">${esc(w.ru)}</span><span class="s">${meta}${w.miss ? '<span class="hardm">, трудное</span>' : ''}</span></span>
    <button class="ib" data-a="wsay" data-w="${esc(w.w)}" aria-label="Послушать ${esc(w.w)}">${I.sound}</button>
    <button class="ib" data-a="wdel" data-w="${esc(w.w)}" aria-label="Убрать ${esc(w.w)} из слов" style="color:var(--lib-muted)">${I.trash}</button>
  </li>`;
}
function renderWords(){
  setMode('lib'); state.screen = 'words'; state.cards = null; state.wsel = null;
  const ws = store.words; const by = store.prefs.wgroup || 'story';
  const hard = setIdx('hard').length;
  app.innerHTML = `
  <header class="whead"><h1>Мои слова</h1><span>${ws.length ? ws.length + ' ' + plural(ws.length, 'слово', 'слова', 'слов') : ''}</span></header>
  <main class="lib-main">
    ${ws.length ? `
    ${(() => { const due = setIdx('today').length; const nd = nextDueInfo();
      return `<div class="todaycard"><div class="tt"><span class="t">${due ? 'Повторить сегодня' : 'На сегодня всё'}</span><span class="m">${due ? due + ' ' + plural(due, 'слово', 'слова', 'слов') + ' по расписанию' : (nd ? 'Дальше ' + nd.when + ': ' + nd.n + ' ' + plural(nd.n, 'слово', 'слова', 'слов') : 'Сохраняйте слова, и они появятся здесь')}</span></div>${due ? `<button class="pill" data-a="cards" data-set="today">Начать</button>` : ''}</div>`; })()}
    <div class="wtop2">
      <button class="pill" data-a="cards" data-set="all">Повторить все</button>
      ${hard ? `<button class="ghost" data-a="cards" data-set="hard">Трудные: ${hard}</button>` : '<span></span>'}
    </div>
    <div class="wseg" role="radiogroup" aria-label="Делить слова">
      <button role="radio" aria-checked="${by === 'story'}" data-a="wgroup" data-v="story">По историям</button>
      <button role="radio" aria-checked="${by === 'lvl'}" data-a="wgroup" data-v="lvl">По уровням</button>
    </div>
    <ul class="wsets">${groupsBy(by).map(g => {
      const hardN = g.idx.filter(i => ws[i].miss).length;
      const n = g.idx.length + ' ' + plural(g.idx.length, 'слово', 'слова', 'слов');
      if (by === 'story') {
        const st = S[g.key];
        return `<li><button class="wset" data-a="wopen" data-by="story" data-k="${esc(g.key)}">
          ${st ? cover(st.id, 36) : '<span class="wbadge">?</span>'}
          <span class="tt"><span class="t">${st ? esc(st.ru) : 'Другое'}</span><span class="m">${n}${lvlRange(g.idx) ? ', ' + lvlRange(g.idx) : ''}${hardN ? ', трудных ' + hardN : ''}</span></span>
          <span class="chev" aria-hidden="true">›</span></button></li>`;
      }
      const h = +g.key; const stories = new Set(g.idx.map(i => ws[i].sid)).size;
      return `<li><button class="wset" data-a="wopen" data-by="lvl" data-k="${esc(g.key)}">
        <span class="wbadge${h === 0 ? ' muted' : ''}">${h > 0 ? h : (h === 0 ? '名' : '4+')}</span>
        <span class="tt"><span class="t">${lvlName(h)}</span><span class="m">${n}${h === 0 ? ', в общие карточки не входят' : ', ' + stories + ' ' + plural(stories, 'история', 'истории', 'историй')}${hardN ? ', трудных ' + hardN : ''}</span></span>
        <span class="chev" aria-hidden="true">›</span></button></li>`;
    }).join('')}</ul>`
    : `<div class="empty"><span class="zhf" lang="zh-CN">空</span>Здесь пока пусто. Нажмите на слово в любой главе и сохраните его.<div style="margin-top:20px"><button class="pill" data-a="tab-lib">К историям</button></div></div>`}
  </main>
  ${tabs('words')}`;
}
function renderWset(){
  setMode('lib'); state.screen = 'wset'; state.cards = null;
  const ws = store.words; const sel = state.wsel; const base = sel.by === 'story' ? 'story:' + sel.k : 'lvl:' + sel.k;
  const inSet = ws.map((w, i) => i).filter(i => sel.by === 'story' ? ws[i].sid === sel.k : String(wLevel(ws[i])) === sel.k);
  if (!inSet.length) { renderWords(); return; }
  const subBy = sel.by === 'story' ? 'lvl' : 'story';
  const subs = new Map(); inSet.forEach(i => { const k = subBy === 'lvl' ? String(wLevel(ws[i])) : ws[i].sid; if (!subs.has(k)) subs.set(k, []); subs.get(k).push(i); });
  let subList = Array.from(subs.entries());
  subList.sort((a, b) => subBy === 'lvl' ? lvlOrd(+a[0]) - lvlOrd(+b[0]) : STORIES.findIndex(x => x.id === a[0]) - STORIES.findIndex(x => x.id === b[0]));
  const f = sel.f && subs.has(sel.f) ? sel.f : 'all';
  const shown = f === 'all' ? inSet : subs.get(f);
  const set = f === 'all' ? base : base + '|' + subBy + ':' + f;
  const cardsN = setIdx(set).length;
  const title = sel.by === 'story' ? (S[sel.k] ? S[sel.k].ru : 'Другое') : lvlName(+sel.k);
  const subName = k => subBy === 'lvl' ? lvlName(+k) : (S[k] ? S[k].ru : 'Другое');
  app.innerHTML = `
  <div class="sbar"><button class="ib" data-a="tab-words" aria-label="Назад к словам" style="color:var(--lib-text)">${I.back}</button><h1 class="wsh">${esc(title)}</h1></div>
  <main class="lib-main">
    ${subList.length > 1 ? `<div class="chips" role="radiogroup" aria-label="Фильтр">
      <button class="chip" role="radio" aria-checked="${f === 'all'}" data-a="wfilter" data-v="all">Все ${inSet.length}</button>
      ${subList.map(([k, idx]) => `<button class="chip" role="radio" aria-checked="${f === k}" data-a="wfilter" data-v="${esc(k)}">${esc(subName(k))} ${idx.length}</button>`).join('')}
    </div>` : ''}
    <div class="wtop">${cardsN ? `<button class="pill full" data-a="cards" data-set="${esc(set)}">Повторить: ${cardsN} ${plural(cardsN, 'карточка', 'карточки', 'карточек')}</button>` : `<p class="nores" style="margin:0">Имена в карточки не входят.</p>`}</div>
    <ul class="wl">${shown.slice().reverse().map(i => wordRow(i, subBy === 'lvl' ? lvlName(wLevel(ws[i])) : (S[ws[i].sid] ? esc(S[ws[i].sid].ru) : ''))).join('')}</ul>
  </main>
  ${tabs('words')}`;
}
function plural(n, a, b, c){ const m10 = n % 10, m100 = n % 100; if (m10 === 1 && m100 !== 11) return a; if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return b; return c; }
function renderCards(){
  setMode('lib'); state.screen = 'cards';
  const cs = state.cards; const total = cs.order.length;
  if (cs.i >= total) {
    if (!cs.logged) { cs.logged = true; logEvent('rv', 'Повторение: карточки, ' + setName(cs.set) + ', ' + cs.known + ' из ' + total); save(); }
    app.innerHTML = `<header class="whead"><h1>Карточки</h1><span>${esc(setName(cs.set))}</span></header>
    <main class="cards lib-main"><div class="cbox"><span class="big" lang="zh-CN">好</span><span class="r">Помню ${cs.known} из ${total}</span><span class="h">Слова, которые вы не вспомнили, стоят первыми в следующем круге.</span></div>
    <div class="row2"><button class="ghost" data-a="wback">К словам</button><button class="pill" data-a="drill" data-m="cards" data-set="${esc(cs.set)}" style="height:52px;border-radius:26px">Ещё круг</button></div></main>
    ${tabs('words')}`;
    return;
  }
  const w = store.words[cs.order[cs.i]];
  app.innerHTML = `<header class="whead"><h1>Карточки</h1><span>${esc(setName(cs.set))}, ${cs.i + 1} из ${total}</span></header>
  <main class="cards lib-main">
    <div class="cbox">
      <span class="big" lang="zh-CN">${esc(w.w)}</span>
      ${cs.shown ? `<span class="p">${esc(w.py)}</span><span class="r">${esc(w.ru)}</span>` : '<span class="h">Вспомните чтение и значение</span>'}
      <button class="ib" data-a="wsay" data-w="${esc(w.w)}" aria-label="Послушать" style="margin-top:6px">${I.sound}</button>
    </div>
    ${cs.shown ? `<div class="row2"><button class="ghost" data-a="cno">Не помню</button><button class="pill" data-a="cyes" style="height:52px;border-radius:26px">Помню</button></div>`
               : `<button class="pill full" data-a="cshow">Показать ответ</button>`}
    <button class="ghost" data-a="wback" style="border:0;height:44px;color:var(--lib-muted);font-weight:500">Закончить</button>
  </main>
  ${tabs('words')}`;
}
function startCards(set){
  const fromSet = state.screen === 'wset' ? state.wsel : null;
  const ws = store.words; const idx = setIdx(set); if (!idx.length) return;
  for (let i = idx.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const t = idx[i]; idx[i] = idx[j]; idx[j] = t; }
  idx.sort((a, b) => (ws[a].miss ? 0 : 1) - (ws[b].miss ? 0 : 1));
  state.cards = { order: idx, i: 0, shown: false, known: 0, set: set || 'all' }; state.wsel = fromSet || state.wsel;
  renderCards(); window.scrollTo(0, 0);
}

/* ---------- spaced repetition ---------- */
const SRS_DAYS = [0, 1, 3, 7, 14];
const DAY = 86400000;
function dayStart(t){ const d = new Date(t); d.setHours(0, 0, 0, 0); return d.getTime(); }
function isDueW(w){ return !w.due || w.due <= dayStart(Date.now()) + DAY - 1; }
function srsGrade(w, ok){
  if (ok) { w.box = Math.min((w.box || 0) + 1, SRS_DAYS.length - 1); w.streak = (w.streak || 0) + 1; if (w.miss && w.streak >= 2) w.miss = false; }
  else { w.box = 0; w.streak = 0; w.miss = true; }
  w.due = dayStart(Date.now()) + SRS_DAYS[w.box] * DAY;
}
function nextDueInfo(){
  const ws = store.words.filter(w => wLevel(w) !== 0 && !isDueW(w));
  if (!ws.length) return null;
  const first = Math.min.apply(null, ws.map(w => w.due));
  const n = ws.filter(w => dayStart(w.due) === dayStart(first)).length;
  const days = Math.round((dayStart(first) - dayStart(Date.now())) / DAY);
  return { n, when: days <= 1 ? 'завтра' : 'через ' + days + ' ' + plural(days, 'день', 'дня', 'дней') };
}

/* ---------- review modes ---------- */
const MODES = [
  { id: 'cards', name: 'Карточки', hint: 'Посмотреть слово и вспомнить перевод', min: 1 },
  { id: 'scene', name: 'Из сцены', hint: 'Вставить слово во фразу из прочитанной главы', min: 1 },
  { id: 'tones', name: 'Тоны', hint: 'Выбрать, как звучит слово', min: 1 },
  { id: 'listen', name: 'На слух', hint: 'Узнать слово по звуку', min: 1 },
  { id: 'recall', name: 'Вспомни сама', hint: 'По переводу найти иероглифы', min: 1 },
];
const TONE = { a: 'āáǎà', e: 'ēéěè', i: 'īíǐì', o: 'ōóǒò', u: 'ūúǔù', 'ü': 'ǖǘǚǜ' };
const MARKED = {}; Object.keys(TONE).forEach(v => Array.from(TONE[v]).forEach((c, k) => { MARKED[c] = { v, t: k }; }));
function stripTones(py){ return Array.from(py).map(c => MARKED[c] ? MARKED[c].v : c).join(''); }
function hasTone(py){ return Array.from(py).some(c => MARKED[c]); }
function toneVariants(py){
  const chars = Array.from(py); const pos = chars.map((c, i) => MARKED[c] ? i : -1).filter(i => i >= 0);
  const out = new Set([py]); let guard = 0;
  while (out.size < 4 && guard++ < 60) {
    const v = chars.slice(); const n = pos.length > 1 && Math.random() < 0.5 ? 2 : 1;
    shuffleArr(pos.slice()).slice(0, n).forEach(i => { const m = MARKED[chars[i]]; let t; do { t = Math.floor(Math.random() * 4); } while (t === m.t); v[i] = TONE[m.v][t]; });
    out.add(v.join(''));
  }
  return shuffleArr(Array.from(out));
}
function shuffleArr(a){ for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
const PUNCT_END = new Set(['。', '？', '！', '……']);
function sceneFor(w){
  const order = STORIES.slice().sort((a, b) => (a.id === w.sid ? -1 : 0) - (b.id === w.sid ? -1 : 0));
  for (const s of order) {
    for (let ci = 0; ci < s.chapters.length; ci++) {
      if (!isDone(s.id, ci)) continue;
      const ps = s.chapters[ci].p;
      for (let pi = 0; pi < ps.length; pi++) {
        const toks = ps[pi][1].split(' '); const k = toks.findIndex(t => t.split('|')[0] === w.w);
        if (k < 0) continue;
        let a = k, b = k;
        while (a > 0 && !PUNCT_END.has(toks[a - 1].split('|')[0])) a--;
        while (b < toks.length - 1 && !PUNCT_END.has(toks[b].split('|')[0])) b++;
        if (toks[b + 1] && toks[b + 1].split('|')[0] === '”') b++;
        if (toks.slice(a, b + 1).filter(x => CJK.test(x.split('|')[0]) && x.split('|')[0] !== w.w).length < 2) { a = 0; b = toks.length - 1; }
        let part = toks.slice(a, b + 1); let kk = k - a; const base = x => x.split('|')[0];
        if (base(part[0]) === '“' && !part.some(x => base(x) === '”')) { part = part.slice(1); kk -= 1; }
        if (base(part[part.length - 1]) === '”' && !part.some(x => base(x) === '“')) part = part.slice(0, -1);
        return { toks: part, k: kk, ru: ps[pi][2], where: s.ru + ', глава ' + (ci + 1) };
      }
    }
  }
  return null;
}
function eligible(mode, idx){
  const ws = store.words;
  if (mode === 'scene') return idx.filter(i => sceneFor(ws[i]));
  if (mode === 'tones') return idx.filter(i => hasTone(ws[i].py || ''));
  return idx;
}
let DPOOL = null;
function distractorPool(){
  if (DPOOL) return DPOOL;
  DPOOL = Object.keys(DICT).filter(k => !k.includes('|') && CJK.test(k) && DICT[k][2] >= 1 && DICT[k][2] <= 3 && k.length <= 4);
  return DPOOL;
}
function pickOptions(word, how){
  const pool = Array.from(new Set(store.words.filter(w => wLevel(w) !== 0).map(w => w.w).concat(distractorPool()))).filter(x => x !== word);
  const sameLen = pool.filter(x => x.length === word.length);
  let pref = sameLen;
  if (how === 'look') { const share = sameLen.filter(x => Array.from(x).some(c => word.includes(c))); pref = shuffleArr(share).slice(0, 2).concat(shuffleArr(sameLen)); }
  const out = []; for (const x of pref.concat(shuffleArr(pool))) { if (out.length === 3) break; if (!out.includes(x) && lookup(x).ru !== lookup(word).ru) out.push(x); }
  return shuffleArr(out.concat(word));
}
function openDrillPicker(set){
  const idx = setIdx(set); const last = store.prefs.drill || 'cards';
  layer.innerHTML = `<div class="scrim" data-a="close"></div>
  <section class="sheet lib" role="dialog" aria-modal="true" aria-label="Как повторять">
    <div class="grab"></div>
    <div class="shd" style="justify-content:space-between"><h2>Как повторять</h2><button class="ib shx" data-a="close" aria-label="Закрыть">${I.close}</button></div>
    <p class="sub" style="margin:0 0 6px">${esc(setName(set))}: ${idx.length} ${plural(idx.length, 'слово', 'слова', 'слов')}</p>
    <div class="modes">${MODES.map(m => { const n = eligible(m.id, idx).length; const ok = n >= m.min && !(m.id === 'listen' && !synth);
      return `<button class="moderow${m.id === last ? ' last' : ''}" data-a="drill" data-m="${m.id}" data-set="${esc(set)}"${ok ? '' : ' disabled'}>
        <span class="mt"><span class="mn">${m.name}</span><span class="mh">${ok ? m.hint : (m.id === 'scene' ? 'Нет фраз из прочитанных глав с этими словами' : (m.id === 'listen' ? 'Браузер не умеет озвучивать' : 'Нужно хотя бы ' + m.min + ' слова'))}</span></span>
        <span class="mc">${ok ? n : ''}</span></button>`; }).join('')}</div>
  </section>`;
}
function startDrill(mode, set){
  const fromSet = state.screen === 'wset' ? state.wsel : null;
  const ws = store.words; let idx = shuffleArr(eligible(mode, setIdx(set)));
  idx.sort((a, b) => ((ws[a].miss ? 0 : 1) + (isDueW(ws[a]) ? 0 : 2)) - ((ws[b].miss ? 0 : 1) + (isDueW(ws[b]) ? 0 : 2)));
  idx = idx.slice(0, 15); if (!idx.length) return;
  state.drill = { mode, set, order: idx, i: 0, ok: 0, wrong: [], q: null, ans: null, t0: Date.now() };
  state.wsel = fromSet || state.wsel; state.cards = null;
  if (mode === 'pairs') newPairsRound();
  renderDrill(); window.scrollTo(0, 0);
}
function buildQ(){
  const d = state.drill; const w = store.words[d.order[d.i]];
  if (d.mode === 'tones') return { w, prompt: stripTones(w.py), opts: toneVariants(w.py), ans: w.py };
  if (d.mode === 'scene') { const sc = sceneFor(w); return { w, sc, opts: pickOptions(w.w, 'same'), ans: w.w }; }
  if (d.mode === 'listen') return { w, opts: pickOptions(w.w, 'same'), ans: w.w };
  return { w, opts: pickOptions(w.w, 'look'), ans: w.w };
}
function newPairsRound(){
  const d = state.drill; const ids = d.order.slice(d.i, d.i + 5);
  d.round = { ids, left: shuffleArr(ids.slice()), right: shuffleArr(ids.slice()), sel: null, done: [], errs: [], flash: null, t0: Date.now() };
}
function drillHead(){
  const d = state.drill; const m = MODES.find(x => x.id === d.mode);
  const n = d.order.length; const pos = d.mode === 'pairs' ? Math.min(d.i + d.round.ids.length, n) : d.i + 1;
  return `<header class="whead"><h1>${m.name}</h1><span>${esc(setName(d.set))}, ${pos} из ${n}</span></header>`;
}
function renderDrill(){
  setMode('lib'); state.screen = 'drill'; const d = state.drill; const n = d.order.length;
  if (d.i >= n) { renderDrillEnd(); return; }
  if (d.mode === 'pairs') { renderPairs(); return; }
  if (!d.q) { d.q = buildQ(); d.ans = null; }
  const q = d.q; const answered = d.ans !== null;
  const optLabel = o => d.mode === 'tones' ? `<span class="dpy">${esc(o)}</span>` : `<span class="dz" lang="zh-CN">${esc(o)}</span>`;
  let top = '';
  if (d.mode === 'tones') top = `<div class="dq"><span class="big" lang="zh-CN">${esc(q.w.w)}</span><span class="dprompt">${esc(q.prompt)}</span><span class="h">Как звучит это слово?</span></div>`;
  if (d.mode === 'recall') top = `<div class="dq"><span class="dru">${esc(q.w.ru)}</span><span class="h">Какое это слово?</span></div>`;
  if (d.mode === 'listen') top = `<div class="dq"><button class="lbtn" data-a="dsay" aria-label="Послушать ещё раз">${I.sound}</button><span class="h">Какое слово прозвучало?</span></div>`;
  if (d.mode === 'scene') {
    const toks = q.sc.toks;
    const zh = toks.map(t => t.split('|')[0] === q.w.w ? `<span class="blank">${answered ? esc(q.w.w) : '＿＿'}</span>` : esc(t.split('|')[0])).join('');
    const py = toks.filter(t => CJK.test(t.split('|')[0])).map(t => t.split('|')[0] === q.w.w && !answered ? '___' : lookup(t).py).join(' ');
    top = `<div class="dq scene"><span class="dsent" lang="zh-CN">${zh}</span><span class="dpys">${esc(py)}</span><span class="dtr">${esc(q.sc.ru)}</span><span class="h">${esc(q.sc.where)}</span></div>`;
  }
  const after = answered ? `<div class="dfb ${q.opts[d.ans] === q.ans ? 'good' : 'bad'}"><b>${q.opts[d.ans] === q.ans ? 'Верно' : 'Правильно так'}</b>
      <span><span class="dz" lang="zh-CN">${esc(q.w.w)}</span> ${esc(q.w.py)}, ${esc(q.w.ru)}</span>
      <button class="ib" data-a="wsay" data-w="${esc(q.w.w)}" aria-label="Послушать">${I.sound}</button></div>
    <button class="pill full" data-a="dnext">${d.i + 1 < n ? 'Дальше' : 'Итог'}</button>` : '';
  app.innerHTML = `${drillHead()}
  <main class="cards lib-main drill">
    ${top}
    <div class="dopts">${q.opts.map((o, j) => `<button class="dopt${answered ? (o === q.ans ? ' ok' : (j === d.ans ? ' bad' : ' dim')) : ''}" data-a="dopt" data-o="${j}"${answered ? ' disabled' : ''}>${optLabel(o)}</button>`).join('')}</div>
    ${after}
    <button class="ghost" data-a="wback" style="border:0;height:44px;color:var(--lib-muted);font-weight:500">Закончить</button>
  </main>
  ${tabs('words')}`;
  if (d.mode === 'listen' && !answered) speak(q.w.w, 'n');
}
function renderPairs(){
  const d = state.drill; const r = d.round;
  const cell = (side, id) => { const w = store.words[id]; const done = r.done.includes(id); const sel = r.sel && r.sel.side === side && r.sel.id === id; const fl = r.flash && r.flash.includes(side + id);
    return `<button class="pcell${done ? ' done' : ''}${sel ? ' sel' : ''}${fl ? ' bad' : ''}" data-a="pair" data-side="${side}" data-id="${id}"${done ? ' disabled' : ''}>${side === 'l' ? `<span class="dz" lang="zh-CN">${esc(w.w)}</span>` : `<span class="pr">${esc(w.ru)}</span>`}</button>`; };
  app.innerHTML = `${drillHead()}
  <main class="cards lib-main drill">
    <p class="h" style="margin:0 0 10px;text-align:center">Нажмите на слово, потом на его перевод</p>
    <div class="pgrid"><div class="pcol">${r.left.map(id => cell('l', id)).join('')}</div><div class="pcol">${r.right.map(id => cell('r', id)).join('')}</div></div>
    <button class="ghost" data-a="wback" style="border:0;height:44px;color:var(--lib-muted);font-weight:500">Закончить</button>
  </main>
  ${tabs('words')}`;
}
function pairTap(side, id){
  const d = state.drill; const r = d.round;
  if (!r.sel || r.sel.side === side) { r.sel = { side, id }; r.flash = null; renderPairs(); return; }
  const a = r.sel.side === 'l' ? r.sel.id : id; const b = r.sel.side === 'l' ? id : r.sel.id;
  if (a === b) { r.done.push(a); r.sel = null; r.flash = null; }
  else { if (!r.errs.includes(a)) r.errs.push(a); r.flash = ['l' + a, 'r' + b]; r.sel = null; }
  if (r.done.length === r.ids.length) {
    r.ids.forEach(x => { const ok = !r.errs.includes(x); srsGrade(store.words[x], ok); if (ok) d.ok += 1; else d.wrong.push(x); });
    save(); d.i += r.ids.length;
    if (d.i < d.order.length) newPairsRound();
    renderDrill(); return;
  }
  renderPairs();
}
function renderDrillEnd(){
  const d = state.drill; const n = d.order.length; const m = MODES.find(x => x.id === d.mode);
  if (!d.logged) { d.logged = true; logEvent('rv', 'Повторение: ' + m.name + ', ' + setName(d.set) + ', ' + d.ok + ' из ' + n); save(); }
  const secs = Math.round((Date.now() - d.t0) / 1000);
  const nd = nextDueInfo();
  app.innerHTML = `<header class="whead"><h1>${m.name}</h1><span>${esc(setName(d.set))}</span></header>
  <main class="cards lib-main drill">
    <div class="cbox"><span class="big" lang="zh-CN">${d.ok === n ? '好' : '加油'}</span><span class="r">Верно ${d.ok} из ${n}</span>
      <span class="h">${d.mode === 'pairs' ? 'Время: ' + secs + ' с. ' : ''}${nd ? 'Следующее повторение ' + nd.when + ': ' + nd.n + ' ' + plural(nd.n, 'слово', 'слова', 'слов') + '.' : ''}</span></div>
    ${d.wrong.length ? `<p class="lbl" style="margin:18px 0 4px">Повторить ещё</p><ul class="wl">${Array.from(new Set(d.wrong)).map(i => { const w = store.words[i]; return `<li class="wr"><span class="z" lang="zh-CN">${esc(w.w)}</span><span class="i"><span class="p">${esc(w.py)}</span><span class="r">${esc(w.ru)}</span></span><button class="ib" data-a="wsay" data-w="${esc(w.w)}" aria-label="Послушать ${esc(w.w)}">${I.sound}</button></li>`; }).join('')}</ul>` : ''}
    <div class="row2" style="margin-top:18px"><button class="ghost" data-a="wback">К словам</button><button class="pill" data-a="drill" data-m="${d.mode}" data-set="${esc(d.set)}" style="height:52px;border-radius:26px">Ещё раз</button></div>
  </main>
  ${tabs('words')}`;
}

/* ---------- path ---------- */
const HSK_SIZE = { 1: 300, 2: 200, 3: 500, 4: 1000 };
function wordsMet(L){
  const set = new Set();
  store.doneLog.forEach(d => S[d.s].chapters[d.c].p.forEach(p => p[1].split(' ').forEach(t => { if (!CJK.test(t)) return; const e = lookup(t); if (e.hsk === L) set.add(e.w); })));
  return set.size;
}
function levelHTML(x){
  const L = x.l;
  const read = Math.min(store.doneLog.filter(d => d.l === L).length, x.total);
  let cur = -1;
  for (let k = 1; k <= x.parts; k++) { if (partChs(L, k).length < partSize(L, k)) { cur = k; break; } }
  let nodes = '';
  let allPassed = true;
  for (let k = 1; k <= x.parts; k++) {
    const size = partSize(L, k); const chs = partChs(L, k); const full = chs.length >= size;
    const dot = full ? `<span class="dot full" aria-hidden="true">${I.checkS}</span>` : `<span class="dot${k === cur ? ' on' : ''}" aria-hidden="true">${chs.length}/${size}</span>`;
    const slots = [];
    for (let j = 0; j < size; j++) {
      const d = chs[j];
      if (d) { const st = S[d.s], c = st.chapters[d.c]; slots.push(`<li class="slot"><span class="zhf" lang="zh-CN">${esc(c.zh)}</span><span class="m">${esc(st.ru)}, глава ${d.c + 1}</span></li>`); }
      else slots.push(`<li class="slot empty">любая глава HSK ${L}</li>`);
    }
    nodes += `<li class="node">${dot}<div><h3>Часть ${k}<span class="sr">${full ? ', заполнена' : ', ' + chs.length + ' из ' + size}</span></h3><ul class="slots">${slots.join('')}</ul>${k === cur ? '<button class="mini" data-a="tab-lib">Выбрать главу</button>' : ''}</div></li>`;
    const r = store.exams[L + '-' + k];
    let edot, ebody;
    if (r && r.passed) { edot = `<span class="dot exam full" aria-hidden="true">${I.checkS}</span>`; ebody = `<p class="et">Сдан: ${r.best} из ${r.total}</p><button class="lnk" data-a="exam" data-l="${L}" data-k="${k}">Пройти ещё раз</button>`; }
    else if (full) {
      allPassed = false;
      edot = `<span class="dot exam on" aria-hidden="true">${I.doc}</span>`;
      ebody = r ? `<p class="et">Лучший результат: ${r.best} из ${r.total}. Для зачёта нужно ${need(r.total)}.</p><button class="pill" data-a="exam" data-l="${L}" data-k="${k}">Попробовать ещё раз</button>`
                : `<p class="et">Аудирование, чтение, слова и порядок слов. Вопросы только по главам этой части.</p><button class="pill" data-a="exam" data-l="${L}" data-k="${k}">Сдать экзамен</button>`;
    } else { allPassed = false; edot = `<span class="dot exam" aria-hidden="true">${I.lock}</span>`; ebody = `<p class="et">Откроется, когда в части будет ${size} ${plural(size, 'глава', 'главы', 'глав')}.</p>`; }
    nodes += `<li class="node">${edot}<div><h3>Экзамен ${k}</h3>${ebody}</div></li>`;
  }
  nodes += `<li class="node"><span class="dot${allPassed ? ' full' : ''}" aria-hidden="true">${allPassed ? I.checkS : ''}</span><div><h3>${allPassed ? 'Уровень HSK ' + L + ' пройден' : 'Финиш HSK ' + L}</h3><p class="et">${allPassed ? 'Можно переходить к историям следующего уровня.' : 'Сдайте все экзамены уровня, чтобы закрыть его.'}</p></div></li>`;
  return `<section class="lvl">
    <div class="lvl-h"><h2>HSK ${L}</h2><span>${read} из ${x.total} ${plural(x.total, 'главы', 'глав', 'глав')}</span></div>
    <div class="bar4"><span style="width:${Math.round(read / x.total * 100)}%"></span></div>
    <p class="sub">Слов HSK ${L} в прочитанных главах: ${wordsMet(L)} из ${HSK_SIZE[L] || '…'}</p>
    <ol class="tl">${nodes}</ol>
  </section>`;
}
const MONTHS = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
function dayKey(ts){ const d = new Date(ts); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
function when(ts){
  const d = new Date(ts); const hm = String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
  const k = dayKey(ts);
  if (k === dayKey(Date.now())) return 'сегодня, ' + hm;
  if (k === dayKey(Date.now() - 864e5)) return 'вчера, ' + hm;
  return d.getDate() + ' ' + MONTHS[d.getMonth()];
}
function diaryHTML(){
  const counts = {}; store.log.forEach(e => { const k = dayKey(e.at); counts[k] = (counts[k] || 0) + 1; });
  const today = new Date(); today.setHours(12, 0, 0, 0);
  const cells = []; let active = 0;
  for (let i = 27; i >= 0; i--) {
    const d = new Date(today.getTime()); d.setDate(today.getDate() - i);
    const n = counts[dayKey(d.getTime())] || 0; if (n) active++;
    cells.push(`<span class="day${n === 0 ? '' : n < 3 ? ' l1' : n < 6 ? ' l2' : ' l3'}${i === 0 ? ' today' : ''}"></span>`);
  }
  const recent = store.log.slice(-4).reverse().map(e => `<li class="ent"><span>${esc(e.x)}</span><span class="when">${when(e.at)}</span></li>`).join('');
  return `<section class="lvl">
    <div class="lvl-h"><h2>Дневник</h2><span>${active} ${plural(active, 'день', 'дня', 'дней')} с занятиями за 4 недели</span></div>
    <div class="days" role="img" aria-label="Дней с занятиями за последние 4 недели: ${active}">${cells.join('')}</div>
    <div class="dayl" aria-hidden="true"><span>4 недели назад</span><span>сегодня</span></div>
    <p class="sub sync${cloud.state === 'on' ? ' on' : ''}" id="sync"><i aria-hidden="true"></i><span>${syncNote()}</span></p>
  </section>`;
}
function storyPathHTML(s){
  const parts = storyParts(s); let nodes = ''; let allPassed = true; let cur = -1;
  parts.forEach((pt, pi) => { if (cur < 0 && partHave(s, pi) < partSizeS(s, pi)) cur = pi; });
  parts.forEach((pt, pi) => {
    const size = partSizeS(s, pi), have = partHave(s, pi), full = have >= size;
    const dot = full ? `<span class="dot full" aria-hidden="true">${I.checkS}</span>` : `<span class="dot${pi === cur ? ' on' : ''}" aria-hidden="true">${have}/${size}</span>`;
    const rows = []; for (let c = pt.from; c <= pt.to; c++) { const ch = s.chapters[c]; rows.push(`<li><button class="pch${isDone(s.id, c) ? ' done' : ''}" data-a="open" data-s="${s.id}" data-c="${c}"><span class="zhf" lang="zh-CN">${esc(ch.zh)}</span><span class="m">${esc(ch.label || 'Глава ' + (c + 1))}</span>${isDone(s.id, c) ? `<span class="ok" aria-label="прочитана">${I.checkS}</span>` : ''}</button></li>`); }
    nodes += `<li class="node">${dot}<div><h3>${esc(partLabel(s, pi))}</h3><ul class="pchs">${rows.join('')}</ul></div></li>`;
    const gr = partGrammar(s, pt).length;
    if (gr) nodes += `<li class="node"><span class="dot gram" aria-hidden="true">语</span><div><h3>Грамматика части</h3><p class="et">${gr} ${plural(gr, 'тема', 'темы', 'тем')}</p><button class="lnk" data-a="gpart" data-s="${s.id}" data-p="${pi}">Открыть</button></div></li>`;
    const r = store.exams[examKey(s.id, pi)]; let edot, ebody;
    if (r && r.passed) { edot = `<span class="dot exam full" aria-hidden="true">${I.checkS}</span>`; ebody = `<p class="et">Сдан: ${r.best} из ${r.total}</p><button class="lnk" data-a="exam" data-s="${s.id}" data-p="${pi}">Пройти ещё раз</button>`; }
    else if (full) { allPassed = false; edot = `<span class="dot exam on" aria-hidden="true">${I.doc}</span>`; ebody = r ? `<p class="et">Лучший результат: ${r.best} из ${r.total}. Для зачёта нужно ${need(r.total)}.</p><button class="pill" data-a="exam" data-s="${s.id}" data-p="${pi}">Попробовать ещё раз</button>` : `<p class="et">Аудирование, чтение, слова и порядок слов, только по главам этой части.</p><button class="pill" data-a="exam" data-s="${s.id}" data-p="${pi}">Сдать экзамен</button>`; }
    else { allPassed = false; edot = `<span class="dot exam" aria-hidden="true">${I.lock}</span>`; ebody = `<p class="et">Откроется, когда будут прочитаны все главы части.</p>`; }
    nodes += `<li class="node">${edot}<div><h3>Экзамен</h3>${ebody}</div></li>`;
  });
  nodes += `<li class="node"><span class="dot${allPassed ? ' full' : ''}" aria-hidden="true">${allPassed ? I.checkS : ''}</span><div><h3>${allPassed ? 'История пройдена' : 'Финиш'}</h3><p class="et">${allPassed ? 'Все экзамены сданы.' : 'Сдайте экзамены всех частей.'}</p></div></li>`;
  const read = prog(s.id).done.length;
  return `<section class="lvl">
    <div class="lvl-h"><h2>${esc(s.ru)}</h2><span>${read} из ${s.chapters.length}</span></div>
    <div class="bar4"><span style="width:${Math.round(read / s.chapters.length * 100)}%"></span></div>
    <ol class="tl">${nodes}</ol>
    ${s.next ? `<p class="sub" style="margin-top:4px">${esc(s.next)}: скоро</p>` : ''}
  </section>`;
}
function renderPath(){
  setMode('lib'); state.screen = 'path'; state.exam = null;
  const totalCh = STORIES.reduce((a, x) => a + x.chapters.length, 0);
  const totalParts = STORIES.reduce((a, x) => a + storyParts(x).length, 0);
  const passed = Object.keys(store.exams).filter(k => k.includes(':') && S[k.split(':')[0]] && store.exams[k].passed).length;
  const sel = S[store.prefs.pathS] ? store.prefs.pathS : (store.last && S[store.last.s] ? store.last.s : STORIES[0].id);
  const rank = x => (x.id === sel ? 0 : (prog(x.id).done.length ? 1 : 2));
  const order = STORIES.slice().sort((a, b) => rank(a) - rank(b));
  app.innerHTML = `
  <header class="whead"><h1>Путь</h1><span>истории, части, экзамены</span></header>
  <main class="lib-main">
    <div class="stats">
      <div class="stat"><b>${store.doneLog.filter(x => S[x.s]).length}<small> / ${totalCh}</small></b><span>глав прочитано</span></div>
      <div class="stat"><b>${passed}<small> / ${totalParts}</small></b><span>экзаменов сдано</span></div>
      <div class="stat"><b>${store.words.length}</b><span>слов сохранено</span></div>
    </div>
    ${diaryHTML()}
    <div class="chips pchips" role="radiogroup" aria-label="История">${order.map(x => `<button class="chip" role="radio" aria-checked="${x.id === sel}" data-a="pathstory" data-s="${x.id}">${esc(x.ru)}</button>`).join('')}</div>
    ${storyPathHTML(S[sel])}
  </main>
  ${tabs('path')}`;
}

/* ---------- exam ---------- */
const SECS = [
  { id: 'listen', zh: '听力', ru: 'Аудирование' },
  { id: 'read', zh: '阅读', ru: 'Чтение' },
  { id: 'word', zh: '词汇', ru: 'Слова' },
  { id: 'order', zh: '排序', ru: 'Порядок слов' }
];
const END = ['。', '？', '！'];
function shuffle(a){ for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
function uniq(a){ return a.filter((x, i) => a.indexOf(x) === i); }
function cjkCount(t){ return plain(t).replace(/[^\u4e00-\u9fff\u3007]/g, '').length; }
function pySent(t){ return t.split(' ').filter(x => CJK.test(x)).map(x => lookup(x).py).join(' '); }
const ALL_MEAN = Object.keys(DICT).filter(k => DICT[k][2] !== 0).map(k => DICT[k][1]);
function opts4(ans, primary, fallback){
  const pool = uniq(shuffle(primary.slice()).concat(shuffle((fallback || []).slice()))).filter(x => x !== ans);
  return shuffle([ans].concat(pool.slice(0, 3)));
}
function storyParts(s){ return s.parts && s.parts.length ? s.parts : [{ name: 'Главы 1–' + s.chapters.length, from: 0, to: s.chapters.length - 1 }]; }
function partLabel(s, pi){ const pt = storyParts(s)[pi]; return (pt.ver ? pt.ver + ', ' : '') + (pt.name || 'часть ' + (pi + 1)).replace(/^Часть \d+\. /, ''); }
function partIdx(s, ci){ return storyParts(s).findIndex(pt => ci >= pt.from && ci <= pt.to); }
function partHave(s, pi){ const pt = storyParts(s)[pi]; let n = 0; for (let c = pt.from; c <= pt.to; c++) if (isDone(s.id, c)) n++; return n; }
function partSizeS(s, pi){ const pt = storyParts(s)[pi]; return pt.to - pt.from + 1; }
function examKey(sid, pi){ return sid + ':' + pi; }
function genExam(sid, pi){
  const paras = []; const st = S[sid]; const pt = storyParts(st)[pi];
  for (let c = pt.from; c <= pt.to; c++) st.chapters[c].p.forEach(p => paras.push({ st, p }));
  const units = paras.slice(); const seenT = new Set(paras.map(x => x.p[1]));
  for (let c = pt.from; c <= pt.to; c++) (st.chapters[c].sents || []).forEach(sx => { if (!seenT.has(sx[0])) { seenT.add(sx[0]); units.push({ st, p: ['n', sx[0], sx[1]] }); } });
  const allRu = uniq(units.map(x => x.p[2]));
  const sent = shuffle(units.filter(x => { const n = cjkCount(x.p[1]); return n >= 3 && n <= 16; }));
  const qs = [];
  sent.slice(0, 4).forEach(x => qs.push({ sec: 'listen', t: x.p[1], v: voiceOf(x.st, x.p[0]), ans: x.p[2], opts: opts4(x.p[2], allRu) }));
  sent.slice(4, 8).forEach(x => qs.push({ sec: 'read', t: x.p[1], ans: x.p[2], opts: opts4(x.p[2], allRu) }));
  const seen = new Set(), wp = [];
  paras.forEach(x => x.p[1].split(' ').forEach(t => { if (!CJK.test(t)) return; const e = lookup(t); if (e.hsk === 0 || seen.has(e.w)) return; seen.add(e.w); wp.push(e); }));
  const wpRu = uniq(wp.map(e => e.ru));
  shuffle(wp).slice(0, 4).forEach(e => qs.push({ sec: 'word', w: e.w, py: e.py, ans: e.ru, opts: opts4(e.ru, wpRu, ALL_MEAN) }));
  const op = shuffle(units.filter(x => {
    const toks = x.p[1].split(' '); const ws = toks.filter(t => CJK.test(t)); const pu = toks.filter(t => !CJK.test(t));
    if (ws.length < 3 || ws.length > 6) return false;
    if (pu.some(t => t !== '“' && t !== '”' && END.indexOf(t) < 0)) return false;
    if (pu.filter(t => END.indexOf(t) >= 0).length !== 1) return false;
    const b = ws.map(t => t.split('|')[0]); return uniq(b).length === b.length;
  }));
  op.slice(0, 3).forEach(x => {
    const ws = x.p[1].split(' ').filter(t => CJK.test(t));
    const tiles = ws.map((t, i) => i); let tries = 0;
    do { shuffle(tiles); tries++; } while (tiles.every((v, i) => v === i) && tries < 12);
    qs.push({ sec: 'order', ws, tiles, ru: x.p[2], end: x.p[1].split(' ').find(t => END.indexOf(t) >= 0) || '' });
  });
  return qs;
}
function curQ(){ const e = state.exam; return e ? e.qs[e.i] : null; }
function autoPlay(){ const q = curQ(); if (q && q.sec === 'listen') speak(plain(q.t), q.v); }
function startExam(sid, pi){
  stopRun(true); closeSheet();
  const qs = genExam(sid, pi);
  state.exam = { sid, pi, qs, i: 0, sel: null, picked: [], checked: false, ok: [] };
  renderExam(); window.scrollTo(0, 0); autoPlay();
}
function examHead(sub){
  const e = state.exam;
  const segs = SECS.map(sx => {
    const idx = e.qs.map((q, j) => q.sec === sx.id ? j : -1).filter(j => j >= 0);
    if (!idx.length) return '<span class="seg"></span>';
    const done = idx.filter(j => j < e.i || (j === e.i && e.checked)).length;
    const q = curQ();
    return `<span class="seg${done === idx.length ? ' done' : (q && q.sec === sx.id ? ' on' : '')}"></span>`;
  }).join('');
  return `<header class="exh">
    <button class="ib" data-a="exit-exam" aria-label="Выйти из экзамена">${I.close}</button>
    <div class="mid"><span class="a">${esc(S[e.sid].ru)}, ${esc(partLabel(S[e.sid], e.pi))}</span><span class="b">${sub}</span></div>
    <span></span>
    <div class="segs" aria-hidden="true">${segs}</div>
  </header>`;
}
function renderExam(){
  setMode('rd'); state.screen = 'exam';
  const e = state.exam; const N = e.qs.length;
  if (e.i >= N) { renderResult(); return; }
  const q = curQ(); const sec = SECS.find(x => x.id === q.sec);
  let body = '';
  if (q.sec !== 'order') {
    const top = q.sec === 'listen' ? `<button class="playbig" data-a="qplay">${I.sound} Прослушать ещё раз</button><p class="qprompt">Что вы услышали?</p>`
      : q.sec === 'read' ? `<p class="qprompt">Выберите перевод</p><p class="qzh" lang="zh-CN">${esc(plain(q.t))}</p>`
      : `<p class="qprompt">Что значит это слово?</p><p class="qword" lang="zh-CN">${esc(q.w)}</p>`;
    const opts = q.opts.map((o, j) => {
      let cls = '', mark = '';
      if (e.checked) { if (o === q.ans) { cls = ' ok'; mark = `<span class="okm">${I.check}<span class="sr">верный ответ</span></span>`; } else if (j === e.sel) { cls = ' bad'; mark = `<span class="badm">${I.close}<span class="sr">ваш ответ, неверно</span></span>`; } }
      return `<button class="opt${cls}" role="radio" aria-checked="${e.sel === j}" data-a="opt" data-o="${j}"${e.checked ? ' disabled' : ''}><span>${esc(o)}</span>${mark}</button>`;
    }).join('');
    body = top + `<div class="opts" role="radiogroup" aria-label="Варианты ответа">${opts}</div>`;
  } else {
    const tileHTML = (ti, attrs, cls) => { const le = lookup(q.ws[ti]); return `<button class="tile${cls}" ${attrs}><span lang="zh-CN">${esc(le.w)}</span><small>${esc(le.py)}</small></button>`; };
    const chosen = e.picked.map((ti, j) => tileHTML(ti, `data-a="untile" data-j="${j}"${e.checked ? ' disabled' : ''} aria-label="Убрать ${esc(lookup(q.ws[ti]).w)}"`, '')).join('');
    const pool = q.tiles.map(ti => { const used = e.picked.indexOf(ti) >= 0; return tileHTML(ti, `data-a="tile" data-t="${ti}"${used || e.checked ? ' disabled' : ''}${used ? ' aria-hidden="true" tabindex="-1"' : ''}`, used ? ' used' : ''); }).join('');
    body = `<p class="qprompt">Соберите фразу из слов</p><p class="qru">${esc(q.ru)}</p>
      <div class="ans${e.checked ? (e.ok[e.i] ? ' ok' : ' bad') : ''}">${chosen || '<span class="ansph">Нажимайте на слова по порядку</span>'}</div>
      <div class="tiles">${pool}</div>`;
  }
  if (e.checked) {
    const ok = e.ok[e.i];
    let det = '';
    if (q.sec === 'word') det = `<p><span class="zhf" lang="zh-CN">${esc(q.w)}</span> <span class="pyf">${esc(q.py)}</span></p><p>${esc(q.ans)}</p>`;
    else if (q.sec === 'order') det = `<p><span class="zhf" lang="zh-CN">${esc(q.ws.map(t => t.split('|')[0]).join('') + q.end)}</span></p><p class="pyf">${esc(q.ws.map(t => lookup(t).py).join(' '))}</p>`;
    else det = `<p><span class="zhf" lang="zh-CN">${esc(plain(q.t))}</span></p><p class="pyf">${esc(pySent(q.t))}</p><p>${esc(q.ans)}</p>`;
    body += `<div class="fb" role="status"><p class="h ${ok ? 'ok' : 'bad'}">${ok ? 'Верно' : 'Не совсем. Правильно так:'}</p>${det}</div>`;
  }
  const can = q.sec === 'order' ? e.picked.length === q.ws.length : e.sel !== null;
  app.innerHTML = `${examHead('Вопрос ' + (e.i + 1) + ' из ' + N)}
  <div class="secname"><span class="zhf" lang="zh-CN">${sec.zh}</span>${sec.ru}</div>
  <main class="qbody">${body}</main>
  <div class="tool">${e.checked ? `<button class="rpill" data-a="qnext">${e.i === N - 1 ? 'Результаты' : 'Дальше'}</button>` : `<button class="rpill" data-a="check"${can ? '' : ' disabled'}>Проверить</button>`}</div>`;
}
function finishExam(){
  const e = state.exam; const total = e.qs.length; const score = e.ok.filter(Boolean).length;
  const key = examKey(e.sid, e.pi); const prev = store.exams[key];
  store.exams[key] = { best: Math.max(score, prev ? prev.best : 0), total, last: score, passed: score >= need(total) || !!(prev && prev.passed), at: Date.now() };
  logEvent('ex', 'Экзамен «' + S[e.sid].ru + '», ' + partLabel(S[e.sid], e.pi) + ': ' + score + ' из ' + total + (score >= need(total) ? ', сдан' : ''));
  save(); renderResult(); window.scrollTo(0, 0);
}
function missHTML(q){
  if (q.sec === 'word') return `<li><span class="zhf" lang="zh-CN">${esc(q.w)}</span> <span class="pyf">${esc(q.py)}</span><br>${esc(q.ans)}</li>`;
  if (q.sec === 'order') return `<li><span class="zhf" lang="zh-CN">${esc(q.ws.map(t => t.split('|')[0]).join('') + q.end)}</span><br><span class="pyf">${esc(q.ws.map(t => lookup(t).py).join(' '))}</span><br>${esc(q.ru)}</li>`;
  return `<li><span class="zhf" lang="zh-CN">${esc(plain(q.t))}</span><br><span class="pyf">${esc(pySent(q.t))}</span><br>${esc(q.ans)}</li>`;
}
function renderResult(){
  setMode('rd'); state.screen = 'exam';
  const e = state.exam; const N = e.qs.length; const score = e.ok.filter(Boolean).length; const pass = score >= need(N);
  const rows = SECS.map(sx => {
    const idx = e.qs.map((q, j) => q.sec === sx.id ? j : -1).filter(j => j >= 0); if (!idx.length) return '';
    return `<li class="srow"><span><span class="zhf" lang="zh-CN">${sx.zh}</span>${sx.ru}</span><b>${idx.filter(j => e.ok[j]).length} из ${idx.length}</b></li>`;
  }).join('');
  const miss = e.qs.map((q, j) => e.ok[j] ? '' : missHTML(q)).join('');
  app.innerHTML = `${examHead('Результат')}
  <main class="res">
    <div class="score">${score}<small> из ${N}</small></div>
    <p class="verdict">${pass ? 'Экзамен сдан, часть закрыта.' : 'Пока не хватило. Для зачёта нужно ' + need(N) + ' из ' + N + '.'}</p>
    <ul class="srows">${rows}</ul>
    ${miss ? `<h2 class="mh">Разбор ошибок</h2><ul class="miss">${miss}</ul>` : ''}
    <div class="resbtns"><button class="rpill" data-a="exit-exam">К пути</button><button class="rghost" data-a="exam" data-s="${e.sid}" data-p="${e.pi}">${pass ? 'Пройти ещё раз' : 'Пересдать'}</button></div>
  </main>`;
}

/* ---------- events ---------- */
document.addEventListener('click', ev => {
  const t = ev.target.closest('[data-a]');
  if (!t) {
    const para = ev.target.closest('.para');
    if (para && state.screen === 'read' && !store.prefs.tr) para.classList.toggle('tr');
    return;
  }
  const a = t.dataset.a;
  switch (a) {
    case 'tab-lib': stopRun(true); closeSheet(); state.exam = null; renderLib(); window.scrollTo(0, 0); break;
    case 'tab-words': stopRun(true); closeSheet(); renderWords(); window.scrollTo(0, 0); break;
    case 'tab-path': case 'exit-exam': stopRun(true); closeSheet(); renderPath(); window.scrollTo(0, 0); break;
    case 'exam': startExam(t.dataset.s, +t.dataset.p); break;
    case 'exam-next': { const st = S[t.dataset.s]; const pt = storyParts(st)[+t.dataset.p]; state.exam = null; state.sid = st.id; state.ci = Math.min(pt.to + 1, st.chapters.length - 1); store.last = { s: st.id, c: state.ci }; save(); renderReader(false); window.scrollTo(0, 0); break; }
    case 'pathstory': store.prefs.pathS = t.dataset.s; save(); renderPath(); break;
    case 'setver': store.prefs.ver = Object.assign({}, store.prefs.ver || {}, { [t.dataset.s]: +t.dataset.v }); save(); renderStory(); break;
    case 'lvl': store.prefs.lvl = t.dataset.v === 'all' ? 'all' : +t.dataset.v; save(); renderLib(); break;
    case 'qplay': { const q = curQ(); if (q) speak(plain(q.t), q.v); break; }
    case 'opt': if (state.exam && !state.exam.checked) { state.exam.sel = +t.dataset.o; renderExam(); } break;
    case 'tile': if (state.exam && !state.exam.checked) { state.exam.picked.push(+t.dataset.t); renderExam(); } break;
    case 'untile': if (state.exam && !state.exam.checked) { state.exam.picked.splice(+t.dataset.j, 1); renderExam(); } break;
    case 'check': {
      const e = state.exam; const q = curQ(); if (!e || !q || e.checked) break;
      const ok = q.sec === 'order' ? (e.picked.length === q.ws.length && e.picked.every((ti, j) => ti === j)) : (e.sel !== null && q.opts[e.sel] === q.ans);
      e.ok[e.i] = ok; e.checked = true; renderExam(); say(ok ? 'Верно' : 'Неверно'); break;
    }
    case 'qnext': {
      const e = state.exam; if (!e) break;
      e.i += 1; e.sel = null; e.picked = []; e.checked = false;
      if (e.i >= e.qs.length) finishExam(); else { renderExam(); window.scrollTo(0, 0); autoPlay(); }
      break;
    }
    case 'story': stopRun(true); closeSheet(); state.sid = t.dataset.s; renderStory(); window.scrollTo(0, 0); break;
    case 'open': stopRun(true); closeSheet(); state.sid = t.dataset.s; state.ci = +t.dataset.c; store.last = { s: state.sid, c: state.ci }; save(); renderReader(false); break;
    case 'next': stopRun(true); markDone(); state.ci += 1; store.last = { s: state.sid, c: state.ci }; save(); renderReader(false); break;
    case 'role': store.roles[state.sid] = t.dataset.r; save(); document.querySelectorAll('.rolebtn').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.r === t.dataset.r))); say('Ваша роль: ' + S[state.sid].cast[t.dataset.r].ru); break;
    case 'pickrole': store.roles[state.sid] = t.dataset.r; save(); closeSheet(); startRun('role'); break;
    case 'hint': store.hint = false; save(); { const h = document.querySelector('.hint'); if (h) h.remove(); } break;
    case 'fs': openTextSettings(); break;
    case 'setfs': store.prefs.fs = +t.dataset.v; save(); withAnchor(() => document.querySelector('.text').style.setProperty('--fs', FS[store.prefs.fs] + 'px')); layer.querySelectorAll('.sizeb').forEach(b => b.setAttribute('aria-checked', String(+b.dataset.v === store.prefs.fs))); onScroll(); break;
    case 'settheme': store.prefs.theme = t.dataset.v; save(); applyTheme(); layer.querySelectorAll('.themeb').forEach(b => b.setAttribute('aria-checked', String(b.dataset.v === store.prefs.theme))); break;
    case 'gpart': stopRun(true); closeSheet(); if (t.dataset.s) state.sid = t.dataset.s; if (state.screen === 'read') markDone(); renderGrammar(+t.dataset.p); break;
    case 'pspeak': {
      const i = +t.dataset.i; const s = S[state.sid]; const p = chapter().p[i];
      const r = state.run; if (r && !r.waiting && !r.done) { r.token = Math.random(); r.manual = true; renderTool(); }
      document.querySelectorAll('.para.speaking').forEach(el => el.classList.remove('speaking'));
      const el = t.closest('.para'); el.classList.add('speaking');
      speak(plain(p[1]), voiceOf(s, p[0]), () => el.classList.remove('speaking'));
      break;
    }
    case 'py': store.prefs.py = !store.prefs.py; save(); withAnchor(() => document.querySelector('.text').classList.toggle('nopy', !store.prefs.py)); renderTool(); break;
    case 'tr': store.prefs.tr = !store.prefs.tr; save(); withAnchor(() => document.querySelector('.text').classList.toggle('alltr', store.prefs.tr)); renderTool(); break;
    case 'word': openWord(t); break;
    case 'close': closeSheet(); break;
    case 'wsay': userSpeak(t.dataset.w, 'n'); break;
    case 'wsave': {
      const e = lookup(t.dataset.tok); const k = savedIdx(e.w);
      if (k >= 0) { store.words.splice(k, 1); t.setAttribute('aria-pressed', 'false'); t.innerHTML = I.mark + ' В мои слова'; say('Убрано из слов'); }
      else { store.words.push({ w: e.w, py: e.py, ru: e.ru, hsk: e.hsk, sid: state.sid }); logEvent('w', 'Новое слово ' + e.w + ' ' + e.py); t.setAttribute('aria-pressed', 'true'); t.innerHTML = I.marked + ' В словах'; say('Сохранено в слова'); }
      save(); break;
    }
    case 'wdel': { const k = savedIdx(t.dataset.w); if (k >= 0) { store.words.splice(k, 1); save(); if (state.screen === 'wset') renderWset(); else renderWords(); } break; }
    case 'listen': startRun('listen'); break;
    case 'roles': startRun('role'); break;
    case 'again': { const m = state.run ? state.run.mode : 'listen'; startRun(m); break; }
    case 'stoprun': stopRun(false); break;
    case 'nextline': if (state.run) { stopRec(true); if (synth) { try { synth.cancel(); } catch(e) {} } runStep(state.run.idx + 1); } break;
    case 'sample': if (state.run) { const s = S[state.sid]; const p = chapter().p[state.run.idx]; speak(quoteOf(p[1]), voiceOf(s, p[0])); } break;
    case 'rec': startRec(); break;
    case 'recstop': stopRec(false); break;
    case 'myplay': if (state.run && state.run.myUrl) { try { new Audio(state.run.myUrl).play(); } catch(e) {} } break;
    case 'cards': openDrillPicker(t.dataset.set || 'all'); break;
    case 'drill': { const m = t.dataset.m, set = t.dataset.set || 'all'; closeSheet(); store.prefs.drill = m; save(); if (m === 'cards') startCards(set); else startDrill(m, set); break; }
    case 'dopt': { const d = state.drill; if (!d || d.ans !== null) break; d.ans = +t.dataset.o; const ok = d.q.opts[d.ans] === d.q.ans; srsGrade(d.q.w, ok); if (ok) d.ok += 1; else d.wrong.push(d.order[d.i]); save(); renderDrill(); break; }
    case 'dnext': { const d = state.drill; d.i += 1; d.q = null; d.ans = null; renderDrill(); window.scrollTo(0, 0); break; }
    case 'dsay': speak(state.drill.q.w.w, 'n'); break;
    case 'pair': pairTap(t.dataset.side, +t.dataset.id); break;
    case 'wgroup': store.prefs.wgroup = t.dataset.v; save(); renderWords(); break;
    case 'wopen': state.wsel = { by: t.dataset.by, k: t.dataset.k, f: 'all' }; renderWset(); window.scrollTo(0, 0); break;
    case 'wfilter': state.wsel.f = t.dataset.v; renderWset(); break;
    case 'wback': if (state.wsel) renderWset(); else renderWords(); window.scrollTo(0, 0); break;
    case 'gsay': speak(t.dataset.t, 'n'); break;
    case 'cshow': state.cards.shown = true; renderCards(); { const w = store.words[state.cards.order[state.cards.i]]; speak(w.w, 'n'); } break;
    case 'cyes': case 'cno': {
      const w = store.words[state.cards.order[state.cards.i]];
      if (a === 'cyes') state.cards.known += 1;
      srsGrade(w, a === 'cyes');
      save(); state.cards.i += 1; state.cards.shown = false; renderCards(); break;
    }
  }
});
document.addEventListener('keydown', ev => { if (ev.key === 'Escape' && layer.innerHTML) { closeSheet(); } });
let rz = null;
window.addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(() => { if (state.screen === 'lib') renderLib(); else if (state.screen === 'story') renderStory(); }, 160); });

applyTheme();
renderLib();
cloudInit();
})();
