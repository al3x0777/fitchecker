// Gestione calcolatore BMI
const bmiForm = document.getElementById('bmiForm');
if (bmiForm) {
    bmiForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const weight = parseFloat(document.getElementById('weight').value);
        const height = parseFloat(document.getElementById('height').value);
        
        if (!weight || !height) {
            showToast('Inserisci peso e altezza validi');
            return;
        }
        
        try {
            const response = await fetch('/api/bmi', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ weight, height })
            });
            
            const data = await response.json();
            if (data.success) {
                document.getElementById('bmiValue').textContent = data.bmi;
                document.getElementById('bmiCategoryDisplay').innerHTML = 
                    `<span class="category-${data.category.category.toLowerCase().replace(/[^a-z]/g, '')}">${data.category.emoji} ${data.category.category}</span>`;
                document.getElementById('bmiAdvice').textContent = data.category.advice;
                document.getElementById('bmiResult').style.display = 'block';
            }
        } catch (error) {
            showToast('Errore nel calcolo del BMI');
        }
    });
}

// Fabbisogno idrico
const waterForm = document.getElementById('waterForm');
if (waterForm) {
    waterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const weight = parseFloat(document.getElementById('waterWeight').value);
        const activity = document.getElementById('activityLevel').value;
        
        let waterMl = weight * 30;
        if (activity === 'moderate') waterMl += 500;
        if (activity === 'high') waterMl += 1000;
        if (activity === 'low') waterMl -= 250;
        
        document.getElementById('waterValue').textContent = `${Math.round(waterMl)} ml`;
        document.getElementById('waterAdvice').innerHTML = 
            `Per il tuo peso e livello di attività, dovresti bere circa ${Math.round(waterMl / 250)} bicchieri d'acqua al giorno.`;
        document.getElementById('waterResult').style.display = 'block';
    });
}

// BMR
const bmrForm = document.getElementById('bmrForm');
if (bmrForm) {
    bmrForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const weight = parseFloat(document.getElementById('bmrWeight').value);
        const height = parseFloat(document.getElementById('bmrHeight').value);
        const age = parseFloat(document.getElementById('bmrAge').value);
        const gender = document.getElementById('bmrGender').value;
        
        let bmr;
        if (gender === 'male') {
            bmr = 10 * weight + 6.25 * height - 5 * age + 5;
        } else {
            bmr = 10 * weight + 6.25 * height - 5 * age - 161;
        }
        
        document.getElementById('bmrValue').textContent = `${Math.round(bmr)} kcal/giorno`;
        document.getElementById('bmrResult').style.display = 'block';
    });
}

// TDEE
const tdeeForm = document.getElementById('tdeeForm');
if (tdeeForm) {
    tdeeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const weight = parseFloat(document.getElementById('tdeeWeight').value);
        const height = parseFloat(document.getElementById('tdeeHeight').value);
        const age = parseFloat(document.getElementById('tdeeAge').value);
        const gender = document.getElementById('tdeeGender').value;
        const activity = document.getElementById('tdeeActivity').value;
        
        let bmr;
        if (gender === 'male') {
            bmr = 10 * weight + 6.25 * height - 5 * age + 5;
        } else {
            bmr = 10 * weight + 6.25 * height - 5 * age - 161;
        }
        
        const multipliers = {
            sedentary: 1.2,
            light: 1.375,
            moderate: 1.55,
            active: 1.725,
            very_active: 1.9
        };
        
        const tdee = bmr * multipliers[activity];
        
        let advice = '';
        if (tdee < 2000) advice = 'Hai un fabbisogno calorico basso. Assicurati di assumere cibi nutrienti.';
        else if (tdee > 2500) advice = 'Hai un fabbisogno alto. Mantieni una dieta equilibrata.';
        else advice = 'Fabbisogno nella media. Continua così!';
        
        document.getElementById('tdeeDisplay').innerHTML = 
            `<span class="result-value-large">${Math.round(tdee)} kcal/giorno</span>`;
        document.getElementById('tdeeAdvice').innerHTML = `<p>${advice}</p>`;
        document.getElementById('tdeeResult').style.display = 'block';
    });
}

// Hamburger menu
document.querySelector('.hamburger')?.addEventListener('click', () => {
    document.querySelector('.nav-links').classList.toggle('active');
});