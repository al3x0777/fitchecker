let bmiChart, exercisesChart, caloriesChart;

async function loadProgressData() {
    try {
        const response = await fetch('/api/progress');
        const data = await response.json();
        
        // Statistiche totali
        document.getElementById('totalExercises').textContent = data.weeklyStats?.totalExercises || 0;
        document.getElementById('totalCalories').textContent = data.weeklyStats?.totalCalories || 0;
        document.getElementById('bestStreak').textContent = data.weeklyStats?.streak || 0;
        
        // Calcola giorni attivi
        const activeDays = data.healthLogs?.length || 0;
        document.getElementById('activeDays').textContent = activeDays;
        
        // Aggiorna badges
        updateBadges(data);
        
        // Consigli personalizzati
        updatePersonalAdvice(data);
        
        // Crea grafici con i dati disponibili
        createCharts(data);
        
    } catch (error) {
        console.error('Errore caricamento progressi:', error);
        showToast('Errore nel caricamento dei dati');
    }
}

function updateBadges(data) {
    const totalExercises = data.weeklyStats?.totalExercises || 0;
    const streak = data.weeklyStats?.streak || 0;
    const bmi = data.currentBMI;
    
    const badges = {
        first: totalExercises >= 1,
        streak3: streak >= 3,
        streak7: streak >= 7,
        exercises10: totalExercises >= 10,
        exercises50: totalExercises >= 50,
        bmiNormal: bmi >= 18.5 && bmi <= 24.9
    };
    
    for (const [badgeId, achieved] of Object.entries(badges)) {
        const badgeElement = document.querySelector(`.badge[data-badge="${badgeId}"]`);
        if (badgeElement) {
            if (achieved) {
                badgeElement.classList.remove('locked');
                badgeElement.classList.add('unlocked');
            }
        }
    }
}

function updatePersonalAdvice(data) {
    const adviceDiv = document.getElementById('personalAdvice');
    const totalExercises = data.weeklyStats?.totalExercises || 0;
    const streak = data.weeklyStats?.streak || 0;
    const bmi = data.currentBMI;
    
    let advice = '';
    
    if (totalExercises === 0) {
        advice = '🌱 Inizia oggi il tuo percorso! Prova un piccolo esercizio, anche solo 5 minuti contano.';
    } else if (streak >= 7) {
        advice = '🏆 Sei inarrestabile! Mantieni questa fantastica abitudine. La costanza è la chiave del successo!';
    } else if (streak >= 3) {
        advice = '💪 Ottimo inizio! Continua così, stai costruendo una sana routine.';
    } else {
        advice = '📅 Cerca di allenarti almeno 3 volte a settimana per vedere progressi significativi.';
    }
    
    if (bmi && bmi > 25) {
        advice += ' 📊 Il tuo BMI è nella fascia sovrappeso. Continua con l\'attività fisica e consulta un nutrizionista per una dieta equilibrata.';
    } else if (bmi && bmi < 18.5) {
        advice += ' 📊 Il tuo BMI indica sottopeso. Assicurati di assumere abbastanza calorie nutrienti.';
    } else if (bmi) {
        advice += ' 📊 BMI nella norma! Ottimo lavoro nel mantenere uno stile di vita sano.';
    }
    
    adviceDiv.innerHTML = `<p>${advice}</p>`;
}

function createCharts(data) {
    // Prepara dati per i grafici
    const healthLogs = data.healthLogs || [];
    const last30Days = healthLogs.slice(-30);
    
    const bmiData = last30Days.map(log => log.bmi);
    const bmiDates = last30Days.map(log => {
        const d = new Date(log.date);
        return `${d.getDate()}/${d.getMonth() + 1}`;
    });
    
    // Grafico BMI
    const bmiCtx = document.getElementById('bmiChart')?.getContext('2d');
    if (bmiCtx && bmiData.length > 0) {
        if (bmiChart) bmiChart.destroy();
        bmiChart = new Chart(bmiCtx, {
            type: 'line',
            data: {
                labels: bmiDates,
                datasets: [{
                    label: 'BMI',
                    data: bmiData,
                    borderColor: '#00BCD4',
                    backgroundColor: 'rgba(0, 188, 212, 0.1)',
                    tension: 0.3,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'top' },
                    tooltip: { callbacks: { label: (ctx) => `BMI: ${ctx.raw}` } }
                }
            }
        });
        
        // Trend advice BMI
        if (bmiData.length >= 2) {
            const first = bmiData[0];
            const last = bmiData[bmiData.length - 1];
            const trend = last - first;
            const advice = document.getElementById('bmiTrendAdvice');
            if (trend < -0.5) advice.innerHTML = '📉 BMI in diminuzione. Ottimo progresso!';
            else if (trend > 0.5) advice.innerHTML = '📈 BMI in aumento. Valuta di aumentare l\'attività fisica.';
            else advice.innerHTML = '📊 BMI stabile. Continua a monitorare i tuoi progressi.';
        }
    }
    
    // Grafico esercizi (simulato con dati settimanali)
    const exercisesCtx = document.getElementById('exercisesChart')?.getContext('2d');
    if (exercisesCtx) {
        const weekDays = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];
        const weeklyData = data.weeklyStats?.dailyBreakdown || {};
        const dailyExercises = weekDays.map((_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (6 - i));
            const dateStr = date.toISOString().split('T')[0];
            return weeklyData[dateStr] || 0;
        });
        
        if (exercisesChart) exercisesChart.destroy();
        exercisesChart = new Chart(exercisesCtx, {
            type: 'bar',
            data: {
                labels: weekDays,
                datasets: [{
                    label: 'Esercizi completati',
                    data: dailyExercises,
                    backgroundColor: '#2E7D32',
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'top' }
                }
            }
        });
    }
    
    // Grafico calorie
    const caloriesCtx = document.getElementById('caloriesChart')?.getContext('2d');
    if (caloriesCtx) {
        // Simula dati calorie
        const calorieData = [120, 200, 85, 150, 95, 220, 0];
        if (caloriesChart) caloriesChart.destroy();
        caloriesChart = new Chart(caloriesCtx, {
            type: 'line',
            data: {
                labels: ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'],
                datasets: [{
                    label: 'Calorie bruciate',
                    data: calorieData,
                    borderColor: '#FF9800',
                    backgroundColor: 'rgba(255, 152, 0, 0.1)',
                    tension: 0.3,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'top' }
                }
            }
        });
    }
}

// Carica dati all'avvio
document.addEventListener('DOMContentLoaded', () => {
    loadProgressData();
});

// Hamburger menu
document.querySelector('.hamburger')?.addEventListener('click', () => {
    document.querySelector('.nav-links').classList.toggle('active');
});