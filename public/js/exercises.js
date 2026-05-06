let currentExercises = [];

async function loadExercises(muscle = 'all', difficulty = 'all') {
    const grid = document.getElementById('exercisesGrid');
    grid.innerHTML = '<div class="loading-spinner">⏳ Caricamento esercizi...</div>';
    
    try {
        let url = '/api/external/exercises?';
        if (muscle !== 'all') url += `muscle=${muscle}&`;
        if (difficulty !== 'all') url += `difficulty=${difficulty}&`;
        url += 'limit=20';
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.success && data.exercises.length > 0) {
            currentExercises = data.exercises;
            displayExercises(data.exercises);
        } else {
            grid.innerHTML = '<div class="no-exercises">Nessun esercizio trovato. Prova altri filtri!</div>';
        }
    } catch (error) {
        console.error('Errore caricamento esercizi:', error);
        grid.innerHTML = '<div class="error-message">Errore nel caricamento degli esercizi. Riprova più tardi.</div>';
    }
}

function displayExercises(exercises) {
    const grid = document.getElementById('exercisesGrid');
    grid.innerHTML = '';
    
    exercises.forEach(exercise => {
        const card = document.createElement('div');
        card.className = 'exercise-card card';
        card.innerHTML = `
            <h4>${exercise.name || 'Esercizio'}</h4>
            <div class="exercise-tags">
                <span class="exercise-badge">${exercise.muscle || 'generale'}</span>
                <span class="exercise-badge difficulty-${exercise.difficulty || 'beginner'}">${exercise.difficulty || 'principiante'}</span>
                <span class="exercise-badge">${exercise.type || 'strength'}</span>
            </div>
            <p class="exercise-instructions">${exercise.instructions ? exercise.instructions.substring(0, 120) + '...' : 'Esegui l\'esercizio con la tecnica corretta.'}</p>
            <div class="exercise-actions">
                <button class="complete-btn" data-name="${exercise.name}" data-calories="50">✅ Completa esercizio</button>
            </div>
        `;
        grid.appendChild(card);
    });
    
    // Aggiungi event listener ai bottoni completa
    document.querySelectorAll('.complete-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const name = btn.dataset.name;
            const calories = parseInt(btn.dataset.calories);
            await completeExercise(name, calories);
        });
    });
}

async function completeExercise(name, calories) {
    try {
        const response = await fetch('/api/exercises/complete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ exercise: name, calories })
        });
        
        const data = await response.json();
        if (data.success) {
            showToast(data.message);
            showConfetti();
        }
    } catch (error) {
        showToast('Errore nel salvataggio');
    }
}

// Filtri
document.getElementById('applyFilters')?.addEventListener('click', () => {
    const muscle = document.getElementById('muscleFilter').value;
    const difficulty = document.getElementById('difficultyFilter').value;
    loadExercises(muscle, difficulty);
});

// Inclusività
document.querySelectorAll('.inclusivity-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const variant = btn.dataset.variant;
        const adviceDiv = document.getElementById('inclusiveAdvice');
        
        const advice = {
            seated: '🪑 Versione da seduti: Puoi fare sollevamenti delle gambe, torsioni del busto, e sollevamenti delle braccia restando comodamente seduto.',
            standing: '🧍 Versione in piedi: Ideale per chi può stare in piedi. Prova sollevamenti sulle punte, flessioni al muro, e circonduzioni delle braccia.',
            beginner: '🌱 Per principianti: Inizia con camminate di 10 minuti, stretching dolce, e esercizi a basso impatto.',
            chair: '🪑 Con sedia: Usa una sedia per supporto. Prova squat con sedia, flessioni inclinate, e sollevamenti delle gambe.'
        };
        
        adviceDiv.innerHTML = `<p>${advice[variant] || 'Scegli la variante più adatta a te!'}</p>`;
        adviceDiv.style.display = 'block';
    });
});

// Frase motivazionale giornaliera
async function loadDailyQuote() {
    try {
        const response = await fetch('/api/external/quote');
        const data = await response.json();
        const quoteDiv = document.getElementById('dailyQuote');
        if (data.quote) {
            quoteDiv.innerHTML = `💬 "${data.quote}" — ${data.author}`;
        }
    } catch (error) {
        document.getElementById('dailyQuote').innerHTML = '💪 "La costanza è più importante dell\'intensità"';
    }
}

// Carica esercizi all'avvio
document.addEventListener('DOMContentLoaded', () => {
    loadExercises();
    loadDailyQuote();
});

// Hamburger menu
document.querySelector('.hamburger')?.addEventListener('click', () => {
    document.querySelector('.nav-links').classList.toggle('active');
});