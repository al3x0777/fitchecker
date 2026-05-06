// Dashboard principale
let inactivityInterval;
let inactiveMinutes = 0;

// Funzione per caricare messaggio motivazionale dalle constants
function loadDailyMotivation() {
    const quoteEl = document.getElementById('motivationalQuote');
    if (window.getRandomMotivationalMessage) {
        const msg = window.getRandomMotivationalMessage();
        quoteEl.textContent = `${msg.icon} "${msg.message}"`;
    } else {
        const messages = [
            "🌟 Ogni piccolo passo conta!",
            "💪 La costanza batte l'intensità",
            "🏃 Il movimento è vita!",
            "❤️ La tua salute è un investimento"
        ];
        quoteEl.textContent = messages[Math.floor(Math.random() * messages.length)];
    }
}

async function loadDashboard() {
    await loadUserInfo();
    await loadMotivationalQuote();
    await loadBMI();
    await loadWaterIntake();
    await loadTodayStats();
    await loadSolidarityCounter();
    await loadExerciseSuggestion();
    startInactivityTracker();
}

async function loadUserInfo() {
    try {
        const response = await fetch('/api/progress');
        const data = await response.json();
        if (data.user) {
            document.getElementById('username').textContent = 
                localStorage.getItem('username') || 'Utente';
        }
    } catch (error) {
        console.error('Errore caricamento user info:', error);
    }
}

async function loadMotivationalQuote() {
    try {
        const response = await fetch('/api/external/quote');
        const data = await response.json();
        const quoteEl = document.getElementById('motivationalQuote');
        if (data.quote) {
            quoteEl.textContent = `"${data.quote}" — ${data.author}`;
        } else if (window.getRandomMotivationalMessage) {
            const msg = window.getRandomMotivationalMessage();
            quoteEl.textContent = `${msg.icon} "${msg.message}"`;
        } else {
            loadDailyMotivation();
        }
    } catch (error) {
        console.error('Errore caricamento quote:', error);
        loadDailyMotivation();
    }
}

async function loadBMI() {
    try {
        const response = await fetch('/api/progress');
        const data = await response.json();
        if (data.currentBMI) {
            const bmi = data.currentBMI;
            const category = data.bmiCategory;
            document.getElementById('bmiDisplay').textContent = bmi;
            document.getElementById('bmiCategory').innerHTML = 
                `${category.emoji} ${category.category}`;
            
            let percent = 0;
            if (bmi < 18.5) percent = (bmi / 18.5) * 25;
            else if (bmi < 25) percent = 25 + ((bmi - 18.5) / 6.5) * 25;
            else if (bmi < 30) percent = 50 + ((bmi - 25) / 5) * 25;
            else percent = 75 + Math.min(25, ((bmi - 30) / 10) * 25);
            
            document.getElementById('bmiIndicator').style.left = `${Math.min(95, percent)}%`;
        }
    } catch (error) {
        console.error('Errore caricamento BMI:', error);
    }
}

async function loadWaterIntake() {
    try {
        const response = await fetch('/api/progress');
        const data = await response.json();
        if (data.user && data.user.weight) {
            const waterMl = data.user.weight * 30;
            document.getElementById('waterIntake').textContent = `${waterMl} ml`;
            
            const consumed = localStorage.getItem('waterConsumed') || 0;
            const percent = (consumed / waterMl) * 100;
            const waterProgress = document.getElementById('waterProgress');
            if (waterProgress) waterProgress.value = percent;
        }
    } catch (error) {
        console.error('Errore caricamento acqua:', error);
    }
}

async function loadTodayStats() {
    try {
        const response = await fetch('/api/diary?date=' + new Date().toISOString().split('T')[0]);
        const logs = await response.json();
        
        const totalExercises = logs.length;
        const totalCalories = logs.reduce((sum, log) => sum + (log.calories || 0), 0);
        
        const todayCountEl = document.getElementById('todayCount');
        const todayCaloriesEl = document.getElementById('todayCalories');
        if (todayCountEl) todayCountEl.textContent = totalExercises;
        if (todayCaloriesEl) todayCaloriesEl.textContent = totalCalories;
    } catch (error) {
        console.error('Errore caricamento stats oggi:', error);
    }
}

async function loadSolidarityCounter() {
    try {
        const response = await fetch('/api/class-stats');
        const data = await response.json();
        if (data.success) {
            const count = data.total_exercises_completed;
            const solidarityCountEl = document.getElementById('solidarityCount');
            const solidarityBarEl = document.getElementById('solidarityBar');
            if (solidarityCountEl) solidarityCountEl.textContent = count;
            if (solidarityBarEl) {
                const percent = Math.min(100, (count % 100) * 1);
                solidarityBarEl.style.width = `${percent}%`;
            }
        }
    } catch (error) {
        console.error('Errore caricamento solidarietà:', error);
    }
}

async function loadExerciseSuggestion() {
    try {
        const response = await fetch('/api/exercise-suggestion?age=16&level=beginner&goal=toning');
        const data = await response.json();
        const suggestionDiv = document.getElementById('suggestedExercise');
        if (data.success && suggestionDiv) {
            const exercise = data.data;
            suggestionDiv.innerHTML = `
                <div class="suggestion-card">
                    <h4>${exercise.exercise} ${exercise.type_icon || '💪'}</h4>
                    <p>${exercise.repetitions}</p>
                    <p class="suggestion-calories">🔥 ~${exercise.calories_estimate} kcal</p>
                    <button onclick="quickCompleteExercise('${exercise.exercise}', ${exercise.calories_estimate})" 
                            class="btn btn-small complete-btn">✅ Completa ora</button>
                </div>
            `;
        } else if (suggestionDiv) {
            suggestionDiv.innerHTML = `
                <p>🏋️ Prova 10 squat per iniziare!</p>
                <button onclick="quickCompleteExercise('Squat', 50)" class="btn btn-small">✅ Completa</button>
            `;
        }
    } catch (error) {
        const suggestionDiv = document.getElementById('suggestedExercise');
        if (suggestionDiv) {
            suggestionDiv.innerHTML = `
                <p>🏋️ Prova 10 squat per iniziare!</p>
                <button onclick="quickCompleteExercise('Squat', 50)" class="btn btn-small">✅ Completa</button>
            `;
        }
    }
}

async function quickCompleteExercise(exerciseName, calories) {
    try {
        const response = await fetch('/api/exercises/complete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ exercise: exerciseName, calories })
        });
        
        const data = await response.json();
        if (data.success) {
            showToast(data.message);
            await loadTodayStats();
            await loadSolidarityCounter();
            
            if (data.solidarityMilestone) {
                setTimeout(() => showToast(data.solidarityMilestone), 500);
            }
        }
    } catch (error) {
        showToast("Errore nel salvataggio dell'esercizio");
    }
}

function startInactivityTracker() {
    let lastActivity = Date.now();
    const inactiveSpan = document.getElementById('inactiveTime');
    
    function updateInactivity() {
        const now = Date.now();
        const diff = Math.floor((now - lastActivity) / 1000 / 60);
        inactiveMinutes = diff;
        if (inactiveSpan) inactiveSpan.textContent = diff;
        
        if (diff >= 60 && diff % 30 === 0) {
            showToast("🧘 Stai seduto da più di 1 ora? Fai stretching!");
        }
    }
    
    function resetInactivity() {
        lastActivity = Date.now();
    }
    
    document.addEventListener('mousemove', resetInactivity);
    document.addEventListener('keydown', resetInactivity);
    document.addEventListener('click', resetInactivity);
    
    inactivityInterval = setInterval(updateInactivity, 60000);
}

// Fatigue slider
const fatigueSlider = document.getElementById('fatigueSlider');
const fatigueValue = document.getElementById('fatigueValue');
const fatigueAdvice = document.getElementById('fatigueAdvice');

if (fatigueSlider) {
    fatigueSlider.addEventListener('input', (e) => {
        const fatigue = parseInt(e.target.value);
        if (fatigueValue) fatigueValue.textContent = fatigue;
        
        let advice = '';
        if (fatigue >= 8) {
            advice = '💤 Sei stanco. Oggi meglio stretching leggero e riposo.';
        } else if (fatigue >= 5) {
            advice = '🚶 Moderatamente stanco. Camminata o esercizio leggero.';
        } else {
            advice = '💪 Energia piena! Ottimo per allenamento intenso!';
        }
        if (fatigueAdvice) fatigueAdvice.textContent = advice;
    });
}

// Active break button
const activeBreakBtn = document.getElementById('activeBreakBtn');
if (activeBreakBtn) {
    activeBreakBtn.addEventListener('click', () => {
        showActiveBreakPopup();
    });
}

function showActiveBreakPopup() {
    const popup = document.createElement('div');
    popup.className = 'active-break-popup';
    popup.innerHTML = `
        <div class="active-break-content">
            <h3>🧘 È ora di muoverti!</h3>
            <p>Fai 10 jumping jack o 30 secondi di stretching!</p>
            <div id="breakTimer" class="break-timer">10</div>
            <button id="startBreakBtn" class="btn btn-primary">Inizia!</button>
            <button id="closeBreakBtn" class="btn btn-outline">Chiudi</button>
        </div>
    `;
    document.body.appendChild(popup);
    
    let timeLeft = 10;
    let timerInterval;
    
    function startTimer() {
        const timerEl = document.getElementById('breakTimer');
        timerInterval = setInterval(() => {
            timeLeft--;
            if (timerEl) timerEl.textContent = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                popup.remove();
                showToast("✅ Ottimo! Hai completato la pausa attiva!");
                quickCompleteExercise('Pausa attiva', 20);
            }
        }, 1000);
    }
    
    const startBtn = document.getElementById('startBreakBtn');
    const closeBtn = document.getElementById('closeBreakBtn');
    
    if (startBtn) startBtn.addEventListener('click', startTimer);
    if (closeBtn) closeBtn.addEventListener('click', () => {
        clearInterval(timerInterval);
        popup.remove();
    });
}

function showToast(message) {
    const existingToast = document.querySelector('.toast');
    if (existingToast) existingToast.remove();
    
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.remove(), 3000);
}

// Refresh suggestion button
const refreshBtn = document.getElementById('refreshSuggestion');
if (refreshBtn) refreshBtn.addEventListener('click', loadExerciseSuggestion);

// Load dashboard when ready
document.addEventListener('DOMContentLoaded', loadDashboard);

// Hamburger menu
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
if (hamburger) {
    hamburger.addEventListener('click', () => {
        if (navLinks) navLinks.classList.toggle('active');
    });
}