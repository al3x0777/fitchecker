// Domande del quiz
const quizQuestions = [
    {
        text: "Sudare molto significa che stai bruciando più grassi",
        isTrue: false,
        explanation: "❌ FALSO. La sudorazione è un meccanismo di raffreddamento del corpo, non è correlata al consumo di grassi. Si suda di più quando fa caldo o umido, non perché si bruciano più calorie. Fonte: ISS"
    },
    {
        text: "Fare stretching prima dell'esercizio previene gli infortuni",
        isTrue: false,
        explanation: "❌ FALSO. Studi recenti mostrano che lo stretching statico prima dell'attività NON riduce il rischio infortuni. Meglio un riscaldamento dinamico (saltelli, affondi). Fonte: British Journal of Sports Medicine"
    },
    {
        text: "L'allenamento a digiuno brucia più grassi",
        isTrue: false,
        explanation: "❌ FALSO. A digiuno il corpo brucia più muscoli e meno grassi. Inoltre si ha meno energia e si rischiano capogiri. Fonte: American Council on Exercise"
    },
    {
        text: "Bere acqua durante l'esercizio è importante",
        isTrue: true,
        explanation: "✅ VERO. La disidratazione anche lieve riduce la performance e può causare crampi. Bere piccoli sorsi ogni 15-20 minuti. Fonte: OMS"
    },
    {
        text: "Se non senti dolore, non stai allenando abbastanza",
        isTrue: false,
        explanation: "❌ FALSO. Il dolore acuto è un segnale di allarme. Il cosiddetto 'dolce indolenzimento' (DOMS) del giorno dopo è normale, ma il dolore durante l'esercizio NO. Fonte: NIH"
    },
    {
        text: "Gli adolescenti hanno bisogno di almeno 60 minuti di attività fisica al giorno",
        isTrue: true,
        explanation: "✅ VERO. Secondo l'OMS, bambini e adolescenti (5-17 anni) dovrebbero fare almeno 60 minuti al giorno di attività fisica moderata/intensa."
    },
    {
        text: "Sollevare pesi da adolescenti ferma la crescita",
        isTrue: false,
        explanation: "❌ FALSO. Con tecnica corretta e supervisione, l'allenamento con i pesi è sicuro per adolescenti. Non ci sono prove che danneggi le cartilagini di accrescimento."
    },
    {
        text: "Camminare 10.000 passi al giorno è una soglia magica per la salute",
        isTrue: false,
        explanation: "❌ PARZIALMENTE FALSO. 10.000 passi è un numero tondo, ma studi mostrano benefici già a 7.000-8.000 passi. Meglio muoversi che contare ossessivamente."
    },
    {
        text: "Il recupero è importante quanto l'allenamento",
        isTrue: true,
        explanation: "✅ VERO. I muscoli crescono e si riparano durante il riposo, non durante l'allenamento. Dormire 8 ore aiuta il recupero. Fonte: Journal of Applied Physiology"
    },
    {
        text: "Fare addominali riduce il grasso sulla pancia",
        isTrue: false,
        explanation: "❌ FALSO. Non esiste il 'dimagrimento localizzato'. Gli addominali tonificano i muscoli ma non bruciano il grasso addominale specifico. Serve attività generale + alimentazione."
    }
];

let currentQuestionIndex = 0;
let userScore = 0;
let userAnswers = [];

function startQuiz() {
    document.querySelector('.quiz-intro').style.display = 'none';
    document.getElementById('quizContainer').style.display = 'block';
    currentQuestionIndex = 0;
    userScore = 0;
    userAnswers = [];
    showQuestion();
}

function showQuestion() {
    const question = quizQuestions[currentQuestionIndex];
    const container = document.getElementById('questionContainer');
    
    container.innerHTML = `
        <div class="quiz-question">
            <h3>${question.text}</h3>
            <div class="quiz-options">
                <button class="quiz-btn" data-answer="true">✅ VERO</button>
                <button class="quiz-btn" data-answer="false">❌ FALSO</button>
            </div>
            <div class="explanation" style="display: none;"></div>
        </div>
    `;
    
    // Aggiorna progresso
    const progress = ((currentQuestionIndex) / quizQuestions.length) * 100;
    document.getElementById('quizProgress').style.width = `${progress}%`;
    document.getElementById('questionCounter').textContent = `Domanda ${currentQuestionIndex + 1} di ${quizQuestions.length}`;
    
    // Aggiungi event listener
    container.querySelectorAll('.quiz-btn').forEach(btn => {
        btn.addEventListener('click', () => checkAnswer(btn.dataset.answer === 'true'));
    });
}

function checkAnswer(selectedAnswer) {
    const question = quizQuestions[currentQuestionIndex];
    const isCorrect = (selectedAnswer === question.isTrue);
    
    if (isCorrect) {
        userScore++;
        userAnswers.push({ correct: true, answer: selectedAnswer });
    } else {
        userAnswers.push({ correct: false, answer: selectedAnswer, correctAnswer: question.isTrue });
    }
    
    // Mostra spiegazione
    const explanationDiv = document.querySelector('.explanation');
    const correctText = question.isTrue ? "VERO" : "FALSO";
    explanationDiv.innerHTML = `
        <strong>${isCorrect ? '✅ Corretto!' : '❌ Sbagliato!'}</strong><br>
        ${question.explanation}<br>
        <small>Risposta corretta: ${correctText}</small>
    `;
    explanationDiv.style.display = 'block';
    
    // Disabilita i bottoni
    document.querySelectorAll('.quiz-btn').forEach(btn => {
        btn.disabled = true;
        if ((btn.dataset.answer === 'true' && question.isTrue) ||
            (btn.dataset.answer === 'false' && !question.isTrue)) {
            btn.classList.add('correct');
        } else if (btn.dataset.answer === (selectedAnswer ? 'true' : 'false') && !isCorrect) {
            btn.classList.add('wrong');
        }
    });
    
    // Passa alla prossima domanda dopo 2 secondi
    setTimeout(() => {
        if (currentQuestionIndex + 1 < quizQuestions.length) {
            currentQuestionIndex++;
            showQuestion();
        } else {
            endQuiz();
        }
    }, 2500);
}

function endQuiz() {
    document.getElementById('quizContainer').style.display = 'none';
    const resultDiv = document.getElementById('quizResult');
    const finalScoreSpan = document.getElementById('finalScore');
    const resultMessageDiv = document.getElementById('resultMessage');
    const resultAdviceDiv = document.getElementById('resultAdvice');
    
    finalScoreSpan.textContent = userScore;
    
    let message = '';
    let advice = '';
    
    if (userScore === 10) {
        message = '🏆 Perfetto! Sei un esperto di salute!';
        advice = 'Ottimo lavoro! Continua a informarti e a diffondere informazioni corrette.';
    } else if (userScore >= 7) {
        message = '🎉 Ottimo risultato! Hai buona conoscenza della salute!';
        advice = 'Bravo! Rivedi le domande che hai sbagliato per migliorare ancora.';
    } else if (userScore >= 5) {
        message = '📚 Buon inizio! Ma c\'è ancora da imparare.';
        advice = 'Alcune fake news sono subdole. Leggi le spiegazioni per capire meglio.';
    } else {
        message = '📖 Attenzione alle fake news! Informati meglio sulla salute.';
        advice = 'Le informazioni errate possono essere pericolose. Studia le spiegazioni e fai sempre affidamento a fonti ufficiali come OMS e ISS.';
    }
    
    resultMessageDiv.textContent = message;
    resultAdviceDiv.innerHTML = `<p>${advice}</p><p>Hai risposto correttamente a ${userScore} domande su 10.</p>`;
    
    resultDiv.style.display = 'block';
}

function resetQuiz() {
    document.getElementById('quizResult').style.display = 'none';
    document.querySelector('.quiz-intro').style.display = 'block';
    currentQuestionIndex = 0;
    userScore = 0;
    userAnswers = [];
}

function shareResult() {
    const text = `Ho fatto il quiz sulle fake news di FitChecker! Punteggio: ${userScore}/10. Mettiti alla prova anche tu! 🏃‍♂️`;
    if (navigator.share) {
        navigator.share({ title: 'FitChecker Quiz', text });
    } else {
        navigator.clipboard.writeText(text);
        showToast('Risultato copiato!');
    }
}

// Event listeners
document.getElementById('startQuiz')?.addEventListener('click', startQuiz);
document.getElementById('resetQuiz')?.addEventListener('click', resetQuiz);
document.getElementById('shareResult')?.addEventListener('click', shareResult);

// Hamburger menu
document.querySelector('.hamburger')?.addEventListener('click', () => {
    document.querySelector('.nav-links').classList.toggle('active');
});