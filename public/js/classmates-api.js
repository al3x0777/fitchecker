// Test del nostro web service
async function testOurService() {
    const age = document.getElementById('testAge').value;
    const level = document.getElementById('testLevel').value;
    const goal = document.getElementById('testGoal').value;
    
    const resultDiv = document.getElementById('testResult');
    resultDiv.innerHTML = '<div class="loading">⏳ Chiamata in corso...</div>';
    
    try {
        const response = await fetch(`/api/exercise-suggestion?age=${age}&level=${level}&goal=${goal}`);
        const data = await response.json();
        
        if (data.success) {
            resultDiv.innerHTML = `
                <div class="test-success">
                    <h4>✅ Risposta ricevuta!</h4>
                    <div class="exercise-result">
                        <strong>🏋️ ${data.data.exercise}</strong>
                        <p>📋 ${data.data.repetitions}</p>
                        <p>🔥 ~${data.data.calories_estimate} kcal</p>
                        <p class="instructions">${data.data.instructions}</p>
                        <small>⚠️ ${data.data.safety_tip}</small>
                    </div>
                    <div class="json-response">
                        <details>
                            <summary>📄 Mostra JSON completo</summary>
                            <pre>${JSON.stringify(data, null, 2)}</pre>
                        </details>
                    </div>
                </div>
            `;
        } else {
            resultDiv.innerHTML = `<div class="error">❌ Errore: ${data.error}</div>`;
        }
    } catch (error) {
        resultDiv.innerHTML = `<div class="error">❌ Errore di connessione: ${error.message}</div>`;
    }
}

// Chiamata ad API compagno (alimentazione)
async function fetchNutritionAdvice() {
    const url = document.getElementById('companionNutritionUrl').value;
    if (!url) {
        showToast('Inserisci l\'URL dell\'API del compagno');
        return;
    }
    
    const resultDiv = document.getElementById('nutritionResult');
    resultDiv.innerHTML = '<div class="loading">⏳ Chiamata in corso...</div>';
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        resultDiv.innerHTML = `
            <div class="integration-success">
                <strong>🍎 Consiglio alimentare ricevuto:</strong>
                <p>${data.suggestion || data.message || JSON.stringify(data)}</p>
                <small>Fonte: API compagno</small>
            </div>
        `;
        
        // Mostra consiglio combinato
        showToast('Consiglio integrato con il tuo allenamento!');
        
    } catch (error) {
        resultDiv.innerHTML = `
            <div class="integration-error">
                ⚠️ API compagno non disponibile. Verifica che il server sia attivo.
                <br><small>Errore: ${error.message}</small>
            </div>
        `;
    }
}

// Chiamata ad API compagno (qualità aria)
async function fetchAirQuality() {
    const url = document.getElementById('companionAirUrl').value;
    if (!url) {
        showToast('Inserisci l\'URL dell\'API del compagno');
        return;
    }
    
    const resultDiv = document.getElementById('airQualityResult');
    resultDiv.innerHTML = '<div class="loading">⏳ Chiamata in corso...</div>';
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        let advice = '';
        if (data.aqi && data.aqi > 100) {
            advice = '⚠️ L\'aria è inquinata. Ti consigliamo di fare esercizio al chiuso oggi.';
        } else if (data.aqi) {
            advice = '✅ Qualità dell\'aria buona. Puoi allenarti all\'aperto!';
        }
        
        resultDiv.innerHTML = `
            <div class="integration-success">
                <strong>🌍 Dati qualità aria:</strong>
                <p>AQI: ${data.aqi || data.value || 'N/D'}</p>
                <p>${advice || data.advice || data.message || ''}</p>
                <small>Fonte: API compagno</small>
            </div>
        `;
        
        if (advice && data.aqi > 100) {
            showToast(advice);
        }
        
    } catch (error) {
        resultDiv.innerHTML = `
            <div class="integration-error">
                ⚠️ API compagno non disponibile.
                <br><small>Errore: ${error.message}</small>
            </div>
        `;
    }
}

// Chiamata ad API compagno (sonno)
async function fetchSleepAdvice() {
    const url = document.getElementById('companionSleepUrl').value;
    if (!url) {
        showToast('Inserisci l\'URL dell\'API del compagno');
        return;
    }
    
    const resultDiv = document.getElementById('sleepResult');
    resultDiv.innerHTML = '<div class="loading">⏳ Chiamata in corso...</div>';
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        let advice = '';
        if (data.hours && data.hours < 7) {
            advice = '😴 Hai dormito poco. Oggi meglio un esercizio leggero come stretching o camminata.';
        } else if (data.hours) {
            advice = '💪 Riposo adeguato! Puoi fare un allenamento più intenso oggi.';
        }
        
        resultDiv.innerHTML = `
            <div class="integration-success">
                <strong>😴 Dati sonno:</strong>
                <p>Ore di sonno: ${data.hours || data.value || 'N/D'}</p>
                <p>${advice || data.advice || data.message || ''}</p>
                <small>Fonte: API compagno</small>
            </div>
        `;
        
    } catch (error) {
        resultDiv.innerHTML = `
            <div class="integration-error">
                ⚠️ API compagno non disponibile.
                <br><small>Errore: ${error.message}</small>
            </div>
        `;
    }
}

// Event listeners
document.getElementById('testServiceBtn')?.addEventListener('click', testOurService);
document.getElementById('fetchNutrition')?.addEventListener('click', fetchNutritionAdvice);
document.getElementById('fetchAirQuality')?.addEventListener('click', fetchAirQuality);
document.getElementById('fetchSleep')?.addEventListener('click', fetchSleepAdvice);

// Test automatico al caricamento
document.addEventListener('DOMContentLoaded', () => {
    testOurService();
    
    // Popola esempi di URL per test
    const exampleUrls = {
        nutrition: 'http://localhost:3001/api/food-advice',
        air: 'http://localhost:3002/api/air-quality',
        sleep: 'http://localhost:3003/api/sleep-advice'
    };
});

// Hamburger menu
document.querySelector('.hamburger')?.addEventListener('click', () => {
    document.querySelector('.nav-links').classList.toggle('active');
});