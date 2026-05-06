let currentWeekOffset = 0;

async function loadWeeklySummary() {
    try {
        const response = await fetch('/api/progress');
        const data = await response.json();
        
        if (data.weeklyStats) {
            document.getElementById('weeklyTotal').textContent = data.weeklyStats.totalExercises || 0;
            document.getElementById('weeklyCalories').textContent = data.weeklyStats.totalCalories || 0;
            document.getElementById('streakDays').textContent = data.weeklyStats.streak || 0;
            
            const streakMsg = document.getElementById('streakMessage');
            if (data.weeklyStats.streak >= 7) {
                streakMsg.innerHTML = '🔥 Fantastico! Hai una streak di 7+ giorni! Continua così!';
            } else if (data.weeklyStats.streak >= 3) {
                streakMsg.innerHTML = '💪 Ottimo lavoro! Stai costruendo una bella abitudine!';
            } else if (data.weeklyStats.streak > 0) {
                streakMsg.innerHTML = '🌟 Ottimo inizio! Ogni giorno conta!';
            } else {
                streakMsg.innerHTML = '📅 Inizia oggi la tua streak!';
            }
        }
    } catch (error) {
        console.error('Errore caricamento summary:', error);
    }
}

async function loadExercisesList(date = null) {
    let url = '/api/diary';
    if (date) url += `?date=${date}`;
    
    try {
        const response = await fetch(url);
        const logs = await response.json();
        
        const listDiv = document.getElementById('exercisesList');
        if (logs.length === 0) {
            listDiv.innerHTML = '<div class="no-exercises">Nessun esercizio registrato per questo periodo</div>';
            return;
        }
        
        listDiv.innerHTML = '';
        logs.forEach(log => {
            const item = document.createElement('div');
            item.className = 'diary-item';
            item.innerHTML = `
                <div class="diary-date">${new Date(log.date).toLocaleDateString('it-IT')}</div>
                <div class="diary-exercise">
                    <strong>${log.exercise}</strong>
                    <span class="diary-reps">${log.reps || '3x10'}</span>
                    <span class="diary-calories">🔥 ${log.calories || 0} kcal</span>
                </div>
            `;
            listDiv.appendChild(item);
        });
    } catch (error) {
        console.error('Errore caricamento esercizi:', error);
    }
}

async function loadCalendar() {
    try {
        const response = await fetch('/api/diary');
        const logs = await response.json();
        
        // Raggruppa per data
        const exercisesByDate = {};
        logs.forEach(log => {
            if (!exercisesByDate[log.dateOnly]) {
                exercisesByDate[log.dateOnly] = [];
            }
            exercisesByDate[log.dateOnly].push(log);
        });
        
        // Genera calendario
        const today = new Date();
        const startDate = new Date(today);
        startDate.setDate(today.getDate() + (currentWeekOffset * 7));
        startDate.setDate(startDate.getDate() - startDate.getDay()); // Inizio alla domenica
        
        const calendarDiv = document.getElementById('calendarGrid');
        calendarDiv.innerHTML = '';
        
        const weekRange = document.getElementById('weekRange');
        const weekEnd = new Date(startDate);
        weekEnd.setDate(startDate.getDate() + 6);
        weekRange.textContent = `${startDate.toLocaleDateString('it-IT')} - ${weekEnd.toLocaleDateString('it-IT')}`;
        
        const days = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];
        
        for (let i = 0; i < 7; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            const dateStr = date.toISOString().split('T')[0];
            const exercises = exercisesByDate[dateStr] || [];
            
            const dayCard = document.createElement('div');
            dayCard.className = 'calendar-day';
            dayCard.innerHTML = `
                <div class="calendar-day-name">${days[date.getDay()]}</div>
                <div class="calendar-day-date">${date.getDate()}</div>
                <div class="calendar-day-exercises">
                    ${exercises.length > 0 ? 
                        `<span class="exercise-count">${exercises.length} esercizi</span>
                         <div class="exercise-icons">${exercises.map(e => '💪').join('')}</div>` : 
                        '<span class="no-exercise">⚪ Nessun esercizio</span>'}
                </div>
            `;
            calendarDiv.appendChild(dayCard);
        }
    } catch (error) {
        console.error('Errore caricamento calendario:', error);
    }
}

// Aggiungi esercizio
document.getElementById('addExerciseForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const exerciseName = document.getElementById('exerciseName').value;
    const exerciseReps = document.getElementById('exerciseReps').value || '3x10';
    const exerciseCalories = parseInt(document.getElementById('exerciseCalories').value) || 50;
    const exerciseDate = document.getElementById('exerciseDate').value || new Date().toISOString().split('T')[0];
    
    try {
        // Salva nel backend con data personalizzata
        const response = await fetch('/api/diary', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                exercise: exerciseName, 
                reps: exerciseReps, 
                calories: exerciseCalories,
                date: exerciseDate
            })
        });
        
        const data = await response.json();
        if (data.success) {
            showToast(`✅ Esercizio "${exerciseName}" salvato!`);
            document.getElementById('addExerciseForm').reset();
            loadWeeklySummary();
            loadExercisesList();
            loadCalendar();
        }
    } catch (error) {
        showToast('Errore nel salvataggio');
    }
});

// Filtri
document.getElementById('applyDateFilter')?.addEventListener('click', () => {
    const date = document.getElementById('filterDate').value;
    if (date) loadExercisesList(date);
});

document.getElementById('resetFilter')?.addEventListener('click', () => {
    document.getElementById('filterDate').value = '';
    loadExercisesList();
});

// Navigazione calendario
document.getElementById('prevWeek')?.addEventListener('click', () => {
    currentWeekOffset--;
    loadCalendar();
});

document.getElementById('nextWeek')?.addEventListener('click', () => {
    currentWeekOffset++;
    loadCalendar();
});

// Download PDF
document.getElementById('downloadPDF')?.addEventListener('click', async () => {
    try {
        const response = await fetch('/api/progress');
        const data = await response.json();
        
        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Report FitChecker</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 40px; }
                    h1 { color: #2E7D32; }
                    .stats { margin: 20px 0; }
                    .stat { margin: 10px 0; }
                </style>
            </head>
            <body>
                <h1>📊 Report settimanale FitChecker</h1>
                <p>Data: ${new Date().toLocaleDateString('it-IT')}</p>
                <div class="stats">
                    <div class="stat">📅 Esercizi totali: ${data.weeklyStats?.totalExercises || 0}</div>
                    <div class="stat">🔥 Calorie bruciate: ${data.weeklyStats?.totalCalories || 0}</div>
                    <div class="stat">⚡ Streak giorni: ${data.weeklyStats?.streak || 0}</div>
                    <div class="stat">📊 BMI attuale: ${data.currentBMI || 'N/D'}</div>
                </div>
                <p>Continua così! Ogni piccolo passo conta per la tua salute.</p>
                <p>FitChecker - Progetto Educazione Civica</p>
            </body>
            </html>
        `;
        
        const blob = new Blob([htmlContent], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `fitchecker_report_${new Date().toISOString().split('T')[0]}.pdf`;
        link.click();
        showToast('Report scaricato!');
    } catch (error) {
        showToast('Errore nella generazione del PDF');
    }
});

// Carica dati all'avvio
document.addEventListener('DOMContentLoaded', () => {
    loadWeeklySummary();
    loadExercisesList();
    loadCalendar();
    document.getElementById('exerciseDate').value = new Date().toISOString().split('T')[0];
});

// Hamburger menu
document.querySelector('.hamburger')?.addEventListener('click', () => {
    document.querySelector('.nav-links').classList.toggle('active');
});