// ===== FITCHECKER — CLIENT JS =====
let allExercises = [];
let currentUser  = null;
let currentDetailId = null;
let currentSubTab = 'all';
let completedSets = {}; // { exerciseId: count }
let timerInterval = null;
let workoutExercises = [];
let workoutSetsDone  = {}; // { idx: count }

/* ============================
   INIT
============================ */
document.addEventListener('DOMContentLoaded', async () => {
  await checkAuth();
  await loadMuscleGroupPills();
  await loadExercises();
  generateWorkout(false);
});

/* ============================
   MAIN TAB SWITCHING
============================ */
function switchMainTab(tab) {
  document.querySelectorAll('.tab-section').forEach(s => s.classList.add('hidden'));
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
  document.getElementById('tab-' + tab).classList.remove('hidden');
  document.querySelectorAll(`.nav-tab[data-tab="${tab}"]`).forEach(t => t.classList.add('active'));
  if (tab === 'stats') loadStats();
}

/* ============================
   AUTH
============================ */
async function checkAuth() {
  try {
    const res  = await fetch('/api/auth/me');
    const data = await res.json();
    if (data.success) setUser(data.user);
  } catch (_) {}
}

function setUser(user) {
  currentUser = user;
  document.getElementById('nav-guest').classList.add('hidden');
  document.getElementById('nav-user').classList.remove('hidden');
  document.getElementById('user-name-display').textContent = user.username;
  document.querySelector('.nav-tab-stats').classList.remove('hidden');
}

function clearUser() {
  currentUser = null;
  document.getElementById('nav-guest').classList.remove('hidden');
  document.getElementById('nav-user').classList.add('hidden');
  document.querySelector('.nav-tab-stats').classList.add('hidden');
  switchMainTab('home');
  showSubTab('all');
}

async function login() {
  const username = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value;
  const errEl    = document.getElementById('login-error');
  errEl.classList.add('hidden');
  if (!username || !password) { showError(errEl, 'Inserisci username e password'); return; }
  try {
    const res  = await fetch('/api/auth/login', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({username, password}) });
    const data = await res.json();
    if (!data.success) { showError(errEl, data.error); return; }
    setUser(data.user);
    closeModal('login-modal');
    showToast(`Bentornato, ${data.user.username}! 👋`);
    renderGrid(allExercises);
  } catch(_) { showError(errEl, 'Errore di connessione'); }
}

async function register() {
  const username = document.getElementById('reg-username').value.trim();
  const password = document.getElementById('reg-password').value;
  const errEl    = document.getElementById('reg-error');
  errEl.classList.add('hidden');
  if (!username || !password) { showError(errEl, 'Inserisci username e password'); return; }
  try {
    const res  = await fetch('/api/auth/register', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({username, password}) });
    const data = await res.json();
    if (!data.success) { showError(errEl, data.error); return; }
    setUser(data.user);
    closeModal('register-modal');
    showToast(`Account creato! Benvenuto, ${data.user.username}! 🎉`);
    renderGrid(allExercises);
  } catch(_) { showError(errEl, 'Errore di connessione'); }
}

async function logout() {
  await fetch('/api/auth/logout', { method:'POST' });
  clearUser();
  showToast('Sei uscito ✌️');
  renderGrid(allExercises);
}

/* ============================
   ESERCIZI
============================ */
async function loadExercises(params = '') {
  try {
    const res  = await fetch('/api/exercises' + params);
    const data = await res.json();
    allExercises = data.data;
    renderGrid(allExercises);
  } catch(_) { showToast('Errore nel caricamento esercizi'); }
}

async function loadMuscleGroupPills() {
  try {
    const res  = await fetch('/api/exercises/musclegroups');
    const data = await res.json();
    const container = document.getElementById('filter-pills');
    data.data.forEach(g => {
      const btn = document.createElement('button');
      btn.className = 'pill';
      btn.dataset.group = g;
      btn.textContent = g;
      btn.onclick = () => filterByGroup(btn, g);
      container.appendChild(btn);
    });
  } catch(_) {}
}

function renderGrid(exercises) {
  const grid  = document.getElementById('exercises-grid');
  const empty = document.getElementById('empty-state');
  if (!exercises || exercises.length === 0) {
    grid.innerHTML = '';
    empty.classList.remove('hidden');
    return;
  }
  empty.classList.add('hidden');
  grid.innerHTML = exercises.map((ex, i) => cardHTML(ex, i)).join('');
}

function cardHTML(ex, i) {
  const isFav = currentUser?.favorites?.includes(ex.id);
  const delay = Math.min(i * 50, 400);
  return `
  <div class="card" style="animation-delay:${delay}ms" onclick="openDetail(${ex.id})">
    <div class="card-img-wrap">
      <img class="card-img" src="${ex.image}" alt="${ex.name}" loading="lazy">
      <span class="card-group-badge">${ex.muscleGroup}</span>
      ${currentUser ? `<button class="fav-btn ${isFav?'active':''}" onclick="event.stopPropagation();toggleFavorite(${ex.id})" title="${isFav?'Rimuovi':'Aggiungi ai preferiti'}">${isFav?'❤':'♡'}</button>` : ''}
    </div>
    <div class="card-body">
      <div class="card-title">${ex.name}</div>
      <div class="card-muscle">${ex.muscle}</div>
      <div class="card-meta">
        <span class="diff-badge diff-${ex.difficulty.toLowerCase()}">${ex.difficulty}</span>
        <span class="card-reps">${ex.sets}×${ex.reps}</span>
      </div>
    </div>
  </div>`;
}

/* ============================
   FILTRI & RICERCA
============================ */
let searchTimeout;
function handleSearch() {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    const q = document.getElementById('search-input').value.trim();
    resetPills();
    if (q) loadExercises(`?search=${encodeURIComponent(q)}`);
    else   loadExercises();
  }, 300);
}

function filterByGroup(el, group) {
  document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('search-input').value = '';
  // Torna alla vista "Tutti" SENZA resettare le pill o ricaricare (evita la race e mantiene la pill evidenziata)
  currentSubTab = 'all';
  document.getElementById('subtab-all').classList.add('active');
  document.getElementById('subtab-fav').classList.remove('active');
  if (group) loadExercises(`?muscleGroup=${encodeURIComponent(group)}`);
  else       loadExercises();
}

function resetPills() {
  document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
  document.querySelector('.pill[data-group=""]').classList.add('active');
}

/* ============================
   SUB-TABS (tutti / preferiti)
============================ */
function showSubTab(tab) {
  currentSubTab = tab;
  document.getElementById('subtab-all').classList.toggle('active', tab === 'all');
  document.getElementById('subtab-fav').classList.toggle('active', tab === 'fav');
  if (tab === 'fav') {
    if (!currentUser) { openModal('login-modal'); showSubTab('all'); return; }
    loadFavorites();
  } else {
    resetPills();
    document.getElementById('search-input').value = '';
    loadExercises();
  }
}

async function loadFavorites() {
  try {
    const res  = await fetch('/api/favorites');
    const data = await res.json();
    if (!data.success) { showToast(data.error); return; }
    if (data.data.length === 0) {
      document.getElementById('exercises-grid').innerHTML = '';
      const empty = document.getElementById('empty-state');
      empty.classList.remove('hidden');
      document.getElementById('empty-text').textContent = 'Nessun preferito ancora — aggiungine qualcuno!';
    } else {
      document.getElementById('empty-state').classList.add('hidden');
      renderGrid(data.data);
    }
  } catch(_) { showToast('Errore nel caricamento preferiti'); }
}

/* ============================
   PREFERITI
============================ */
async function toggleFavorite(exerciseId) {
  if (!currentUser) { openModal('login-modal'); return; }
  try {
    const res  = await fetch(`/api/favorites/${exerciseId}`, { method:'POST' });
    const data = await res.json();
    if (!data.success) { showToast(data.error); return; }
    currentUser.favorites = data.favorites;
    const isFav = data.favorites.includes(exerciseId);
    showToast(isFav ? '❤ Aggiunto ai preferiti' : '♡ Rimosso dai preferiti');
    // aggiorna card nella griglia
    document.querySelectorAll('.fav-btn').forEach(btn => {
      const m = btn.getAttribute('onclick')?.match(/toggleFavorite\((\d+)\)/);
      if (m && parseInt(m[1]) === exerciseId) {
        btn.classList.toggle('active', isFav);
        btn.textContent = isFav ? '❤' : '♡';
      }
    });
    if (currentSubTab === 'fav') loadFavorites();
    // aggiorna modale
    if (currentDetailId === exerciseId) {
      const fb = document.getElementById('detail-fav-btn');
      fb.classList.toggle('active', isFav);
      fb.textContent = isFav ? '❤' : '♡';
    }
  } catch(_) { showToast('Errore, riprova'); }
}

async function toggleFavoriteFromDetail() {
  if (currentDetailId) await toggleFavorite(currentDetailId);
}

/* ============================
   MODALE DETTAGLIO
============================ */
async function openDetail(id) {
  try {
    const res  = await fetch(`/api/exercises/${id}`);
    const data = await res.json();
    if (!data.success) return;
    const ex = data.data;
    currentDetailId = ex.id;
    completedSets[ex.id] = completedSets[ex.id] || 0;

    // Popola campi
    document.getElementById('detail-img').src   = ex.image;
    document.getElementById('detail-img').alt   = ex.name;
    document.getElementById('detail-name').textContent = ex.name;
    document.getElementById('detail-group').textContent = ex.muscleGroup;
    document.getElementById('detail-muscle').textContent = ex.muscle;
    document.getElementById('detail-difficulty').textContent = ex.difficulty;
    document.getElementById('detail-desc').textContent = ex.description;
    document.getElementById('detail-reps').textContent = ex.reps;
    document.getElementById('detail-rest').textContent = ex.restSeconds + 's';

    // Preferiti
    const isFav = currentUser?.favorites?.includes(ex.id);
    const fb = document.getElementById('detail-fav-btn');
    if (currentUser) {
      fb.classList.remove('hidden');
      fb.classList.toggle('active', isFav);
      fb.textContent = isFav ? '❤' : '♡';
    } else {
      fb.classList.add('hidden');
    }

    // Serie dots
    renderSetsDots(ex.id, parseInt(ex.sets), ex.restSeconds);

    // Nascondi timer
    stopTimer();
    document.getElementById('timer-section').classList.add('hidden');

    // Commento
    const cs = document.getElementById('comment-section');
    if (currentUser) {
      cs.classList.remove('hidden');
      await loadComment(ex.id);
    } else {
      cs.classList.add('hidden');
    }

    openModal('detail-modal');
  } catch(_) { showToast('Errore nel caricamento'); }
}

function renderSetsDots(exId, totalSets, restSeconds) {
  const done = completedSets[exId] || 0;
  const container = document.getElementById('sets-dots');
  container.innerHTML = '';
  for (let i = 0; i < totalSets; i++) {
    const dot = document.createElement('div');
    dot.className = 's-dot' + (i < done ? ' done' : '');
    dot.textContent = i + 1;
    dot.onclick = () => completeSet(exId, i + 1, totalSets, restSeconds);
    container.appendChild(dot);
  }
  updateSetsProgress(exId, totalSets);
}

function updateSetsProgress(exId, totalSets) {
  const done = completedSets[exId] || 0;
  document.getElementById('sets-progress-text').textContent = `${done} / ${totalSets}`;
  const pct = totalSets > 0 ? (done / totalSets) * 100 : 0;
  document.getElementById('sets-progress-bar').style.width = pct + '%';
}

function completeSet(exId, setNum, totalSets, restSeconds) {
  const current = completedSets[exId] || 0;
  // Toggle: se clicco su una già completata, la resetto
  if (setNum <= current) {
    completedSets[exId] = setNum - 1;
  } else {
    completedSets[exId] = setNum;
  }
  renderSetsDots(exId, totalSets, restSeconds);
  // Avvia timer se completata e non è l'ultima
  if (setNum === completedSets[exId] && setNum < totalSets) {
    startTimer(restSeconds);
  }
  if (completedSets[exId] === totalSets) {
    showToast('🎉 Tutte le serie completate!');
    stopTimer();
    document.getElementById('timer-section').classList.add('hidden');
  }
}

/* ============================
   TIMER DI RIPOSO
============================ */
function startTimer(seconds) {
  stopTimer();
  const section  = document.getElementById('timer-section');
  const textEl   = document.getElementById('timer-text');
  const ringFg   = document.getElementById('timer-ring-fg');
  const circumf  = 213.6;
  section.classList.remove('hidden');
  let remaining = seconds;

  function tick() {
    textEl.textContent = remaining;
    const offset = circumf * (1 - remaining / seconds);
    ringFg.style.strokeDashoffset = offset;
    if (remaining <= 0) {
      stopTimer();
      section.classList.add('hidden');
      showToast('⏱ Riposo finito — prossima serie!');
      return;
    }
    remaining--;
  }
  tick();
  timerInterval = setInterval(tick, 1000);
}

function stopTimer() {
  if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
}

// Salta il riposo: ferma il timer E nasconde la sezione
function skipRest() {
  stopTimer();
  document.getElementById('timer-section').classList.add('hidden');
}

/* ============================
   COMMENTI
============================ */
async function loadComment(exId) {
  try {
    const res  = await fetch(`/api/comments/${exId}`);
    const data = await res.json();
    document.getElementById('comment-input').value = data.comment ? data.comment.text : '';
  } catch(_) {}
}

async function saveComment() {
  if (!currentUser || !currentDetailId) return;
  const text = document.getElementById('comment-input').value;
  try {
    const res  = await fetch(`/api/comments/${currentDetailId}`, {
      method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ text })
    });
    const data = await res.json();
    if (data.success) {
      currentUser.comments = data.comments;
      showToast(text.trim() ? '📝 Nota salvata' : '🗑 Nota eliminata');
    }
  } catch(_) { showToast('Errore nel salvataggio'); }
}

/* ============================
   ALLENAMENTO DEL GIORNO
============================ */
function generateWorkout(showMsg = true) {
  const all = [...allExercises];
  if (all.length === 0) return;
  // Selezione bilanciata: prendi gruppi diversi
  const groups = [...new Set(all.map(e => e.muscleGroup))];
  const selected = [];
  const shuffled = groups.sort(() => Math.random() - .5);
  shuffled.forEach(g => {
    if (selected.length >= 5) return;
    const pool = all.filter(e => e.muscleGroup === g);
    const pick = pool[Math.floor(Math.random() * pool.length)];
    if (pick && !selected.find(s => s.id === pick.id)) selected.push(pick);
  });
  // Riempi se meno di 5
  while (selected.length < 5 && selected.length < all.length) {
    const remaining = all.filter(e => !selected.find(s => s.id === e.id));
    if (!remaining.length) break;
    selected.push(remaining[Math.floor(Math.random() * remaining.length)]);
  }
  workoutExercises = selected;
  workoutSetsDone  = {};
  renderWorkout();
  if (showMsg) showToast('🔄 Allenamento rigenerato!');
}

function renderWorkout() {
  const list = document.getElementById('workout-list');
  list.innerHTML = workoutExercises.map((ex, i) => workoutItemHTML(ex, i)).join('');
  updateWorkoutProgress();
  document.getElementById('workout-progress-wrap').classList.remove('hidden');
}

function workoutItemHTML(ex, idx) {
  const totalSets = parseInt(ex.sets);
  return `
  <div class="workout-item" id="witem-${idx}">
    <div class="workout-item-header" onclick="toggleWorkoutItem(${idx})">
      <div class="workout-num">${idx + 1}</div>
      <div class="workout-info">
        <div class="workout-name">${ex.name}</div>
        <div class="workout-meta">${ex.muscleGroup} · ${ex.sets} serie × ${ex.reps} · riposo ${ex.restSeconds}s</div>
      </div>
      <span class="workout-check" id="wcheck-${idx}">○</span>
    </div>
    <div class="workout-sets-wrap" id="wsets-${idx}">
      <div class="workout-sets-dots" id="wdots-${idx}"></div>
      <div id="wmini-timer-${idx}"></div>
    </div>
  </div>`;
}

function toggleWorkoutItem(idx) {
  const item = document.getElementById('witem-' + idx);
  const isOpen = item.classList.contains('open');
  // Chiudi tutti
  document.querySelectorAll('.workout-item').forEach(el => el.classList.remove('open'));
  if (!isOpen) {
    item.classList.add('open');
    renderWorkoutDots(idx);
  }
}

function renderWorkoutDots(idx) {
  const ex        = workoutExercises[idx];
  const totalSets = parseInt(ex.sets);
  const done      = workoutSetsDone[idx] || 0;
  const container = document.getElementById('wdots-' + idx);
  container.innerHTML = '';
  for (let i = 0; i < totalSets; i++) {
    const dot = document.createElement('div');
    dot.className = 'set-dot' + (i < done ? ' done' : '');
    dot.textContent = i + 1;
    dot.onclick = () => completeWorkoutSet(idx, i + 1, totalSets, ex.restSeconds);
    container.appendChild(dot);
  }
}

function completeWorkoutSet(idx, setNum, totalSets, restSeconds) {
  const current = workoutSetsDone[idx] || 0;
  if (setNum <= current) {
    workoutSetsDone[idx] = setNum - 1;
  } else {
    workoutSetsDone[idx] = setNum;
  }
  renderWorkoutDots(idx);
  updateWorkoutProgress();

  const item  = document.getElementById('witem-' + idx);
  const check = document.getElementById('wcheck-' + idx);

  if (workoutSetsDone[idx] === totalSets) {
    item.classList.add('done');
    check.textContent = '✅';
    // Chiudi dopo 800ms
    setTimeout(() => { item.classList.remove('open'); }, 800);
    showToast(`✅ ${workoutExercises[idx].name} completato!`);
  } else if (setNum === workoutSetsDone[idx] && setNum < totalSets) {
    startMiniTimer(idx, restSeconds);
  }
}

function startMiniTimer(idx, seconds) {
  const container = document.getElementById('wmini-timer-' + idx);
  container.innerHTML = `<div class="mini-timer">⏱ <span id="wt-${idx}">${seconds}</span>s di riposo</div>`;
  let rem = seconds;
  const iv = setInterval(() => {
    rem--;
    const el = document.getElementById('wt-' + idx);
    if (!el) { clearInterval(iv); return; }
    el.textContent = rem;
    if (rem <= 0) {
      clearInterval(iv);
      container.innerHTML = '';
      showToast('⏱ Riposo finito!');
    }
  }, 1000);
}

function updateWorkoutProgress() {
  let totalSeries = 0, doneSeries = 0;
  workoutExercises.forEach((ex, i) => {
    const t = parseInt(ex.sets);
    totalSeries += t;
    doneSeries  += Math.min(workoutSetsDone[i] || 0, t);
  });
  const pct = totalSeries > 0 ? (doneSeries / totalSeries) * 100 : 0;
  document.getElementById('progress-bar').style.width = pct + '%';
  document.getElementById('progress-text').textContent = `${doneSeries} / ${totalSeries} serie`;
}

/* ============================
   BODY MAP
============================ */
function selectMuscle(group) {
  // Evidenzia zona selezionata
  document.querySelectorAll('.muscle-zone').forEach(z => z.classList.remove('active'));
  document.querySelectorAll(`.muscle-zone[data-group="${group}"]`).forEach(z => z.classList.add('active'));

  const exercises = allExercises.filter(e => e.muscleGroup === group);
  const container = document.getElementById('body-exercises-list');
  const placeholder = document.querySelector('.body-results-placeholder');
  placeholder.classList.add('hidden');
  container.classList.remove('hidden');

  const titleId = 'body-muscle-title';
  container.innerHTML = `<div class="${titleId} body-muscle-title">${group} (${exercises.length} esercizi)</div>` +
    exercises.map(ex => `
    <div class="body-ex-card" onclick="openDetail(${ex.id})">
      <img class="body-ex-img" src="${ex.image}" alt="${ex.name}" loading="lazy">
      <div class="body-ex-info">
        <div class="body-ex-name">${ex.name}</div>
        <div class="body-ex-meta">${ex.muscle} · <span class="diff-badge diff-${ex.difficulty.toLowerCase()}">${ex.difficulty}</span> · ${ex.sets}×${ex.reps}</div>
      </div>
    </div>`).join('');
}

/* ============================
   STATISTICHE
============================ */
async function loadStats() {
  if (!currentUser) {
    document.getElementById('stats-content').classList.add('hidden');
    document.getElementById('stats-guest').classList.remove('hidden');
    return;
  }
  document.getElementById('stats-guest').classList.add('hidden');
  document.getElementById('stats-content').classList.remove('hidden');

  try {
    const [statsRes, favRes] = await Promise.all([
      fetch('/api/stats'),
      fetch('/api/favorites')
    ]);
    const stats = await statsRes.json();
    const favs  = await favRes.json();
    if (!stats.success) return;

    const d = stats.data;

    // Stat cards
    document.getElementById('stats-cards').innerHTML = `
      <div class="stat-card"><div class="stat-card-num">${d.totalFavorites}</div><div class="stat-card-label">Preferiti</div></div>
      <div class="stat-card"><div class="stat-card-num">${d.totalComments}</div><div class="stat-card-label">Note salvate</div></div>
      <div class="stat-card"><div class="stat-card-num">${Object.keys(d.muscleGroups).length}</div><div class="stat-card-label">Gruppi muscolari</div></div>
      <div class="stat-card"><div class="stat-card-num" style="font-size:22px">${d.topGroup}</div><div class="stat-card-label">Gruppo preferito</div></div>
    `;

    // Grafico a barre
    const maxVal = Math.max(...Object.values(d.muscleGroups), 1);
    document.getElementById('stats-chart').innerHTML = Object.entries(d.muscleGroups)
      .sort((a,b) => b[1]-a[1])
      .map(([g, count]) => `
        <div class="chart-row">
          <span class="chart-label">${g}</span>
          <div class="chart-bar-wrap">
            <div class="chart-bar" style="width:${(count/maxVal)*100}%">${count}</div>
          </div>
        </div>`).join('') || '<p style="color:var(--gray);font-size:14px">Nessun preferito ancora.</p>';

    // Lista preferiti cliccabili
    if (favs.success && favs.data.length > 0) {
      document.getElementById('stats-fav-list').innerHTML = favs.data
        .map(ex => `<div class="stats-fav-chip" onclick="openDetail(${ex.id})">${ex.name}</div>`)
        .join('');
    } else {
      document.getElementById('stats-fav-list').innerHTML = '<p style="color:var(--gray);font-size:14px">Nessun preferito ancora.</p>';
    }
  } catch(_) { showToast('Errore nel caricamento statistiche'); }
}

/* ============================
   MODALI
============================ */
function openModal(id) {
  document.getElementById(id).classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}
function closeModal(id) {
  document.getElementById(id).classList.add('hidden');
  document.body.style.overflow = '';
  if (id === 'detail-modal') stopTimer();
}
function switchModal(from, to) { closeModal(from); openModal(to); }

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay:not(.hidden)').forEach(m => m.classList.add('hidden'));
    document.body.style.overflow = '';
    stopTimer();
  }
});

/* ============================
   TOAST & UTILS
============================ */
let toastTimeout;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.remove('hidden');
  setTimeout(() => t.classList.add('show'), 10);
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    t.classList.remove('show');
    setTimeout(() => t.classList.add('hidden'), 300);
  }, 2600);
}

function showError(el, msg) {
  el.textContent = msg;
  el.classList.remove('hidden');
}
