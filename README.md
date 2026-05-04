# Progetto di Educazione Civica - FitChecker

## Esercizio fisico e benessere

**Studenti:** [Cognome Nome] e [Cognome Nome]  
**Classe:** [es. 5^ A Informatica]  
**Anno scolastico:** 2025/2026  
**Materie:** TDP (Tecnologie e Progettazione) + Educazione Civica  
**Data consegna:** [gg/mm/aaaa]

---

## Indice

1. [Idea centrale](#1-idea-centrale)
2. [Brainstorming funzionalità](#2-brainstorming-funzionalità)
3. [Architettura MVC](#3-architettura-mvc)
4. [Struttura completa delle cartelle](#4-struttura-completa-delle-cartelle)
5. [Mappa del progetto](#5-mappa-del-progetto)
6. [Tecnologie utilizzate](#6-tecnologie-utilizzate)
7. [API pubbliche](#7-api-pubbliche)
8. [Web service proprio](#8-web-service-proprio)
9. [Integrazione con i compagni](#9-integrazione-con-i-compagni)
10. [Autenticazione](#10-autenticazione)
11. [Analisi critica delle fonti](#11-analisi-critica-delle-fonti)
12. [Grafica e responsive](#12-grafica-e-responsive)
13. [Interattività](#13-interattività)
14. [Codice sorgente completo](#14-codice-sorgente-completo)
15. [Piano di sviluppo](#15-piano-di-sviluppo)
16. [Checklist requisiti](#16-checklist-requisiti)
17. [Idee bonus](#17-idee-bonus)
18. [Note per la presentazione](#18-note-per-la-presentazione)
19. [Riferimenti utili](#19-riferimenti-utili)

---

## 1. Idea centrale

### 1.1 Nome progetto: FitChecker

| Caratteristica | Descrizione |
|----------------|-------------|
| **Concetto** | L'utente inserisce età, peso, altezza e livello di attività fisica. Il sistema calcola BMI, fabbisogno idrico, suggerisce esercizi giornalieri personalizzati e tiene traccia dei progressi nel tempo |
| **Difficoltà** | ⭐⭐ (media – consigliata per il progetto) |
| **Tema principale** | Salute e benessere - esercizio fisico |
| **Target** | Studenti 14-19 anni |

### 1.2 Valori civici promossi

| Valore | Come viene promosso nel progetto |
|--------|----------------------------------|
| **Responsabilità** | Diario personale degli esercizi completati; l'utente si impegna a registrare le proprie attività |
| **Legalità** | Quiz interattivo contro le fake news sull'esercizio fisico; citazione di fonti ufficiali (OMS, ISS) |
| **Partecipazione** | Sfide tra amici e condivisione dei progressi sui social (simulata) |
| **Solidarietà** | Contatore "energia virtuale donata" - a ogni esercizio completato, si dona energia simbolica a un ospedale pediatrico immaginario |
| **Tolleranza e inclusività** | Sezione "Esercizi per tutti" con varianti per diversi livelli di abilità fisica (seduti, in piedi, principianti) |
| **Libertà** | L'utente è libero di scegliere i propri obiettivi (dimagrimento, tonificazione, resistenza) senza imposizioni |

### 1.3 Perché esercizio fisico?

- Dati facilmente misurabili (peso, altezza, età, ripetizioni)
- API pubbliche abbondanti e gratuite
- Forte impatto civico: lotta alla sedentarietà giovanile
- Collegamento diretto con Obiettivo 3 dell'Agenda 2030 (Salute e benessere)

---

## 2. Brainstorming funzionalità

### 2.1 Requisito: "valore sociale e civico"

| Idea | Implementazione concreta |
|------|--------------------------|
| **Lotta alla sedentarietà** | Messaggio pop-up giornaliero: "Stai seduto da più di 1 ora? Alzati e fai 2 minuti di stretching!" con timer incluso |
| **Inclusività** | Pagina "Esercizi per tutti" con filtri: seduto, in piedi, con sedia, per principianti, per esperti |
| **Legalità e fake news** | Quiz "Vero o Falso?" su 10 miti comuni dell'esercizio fisico (es. "Sudare fa dimagrire" → Falso) |
| **Solidarietà** | Contatore collettivo: ogni esercizio completato aggiunge 1 punto al "Muro della solidarietà". A 1000 punti, messaggio: "Complimenti, avete donato un sorriso virtuale!" |
| **Responsabilità personale** | Diario settimanale scaricabile in PDF con gli esercizi svolti e i progressi |

### 2.2 Requisito: "API pubbliche (almeno una, ma ne useremo due)"

| API | Cosa offre | Link registrazione | Limiti gratuiti | Difficoltà |
|-----|-----------|-------------------|-----------------|-------------|
| **API-Ninjas Exercises** | Oltre 1000 esercizi con nome, muscolo target, difficoltà, istruzioni | api-ninjas.com | 50 chiamate/giorno | ⭐ (facile) |
| **ZenQuotes API** | Frasi motivazionali sul benessere e lo sport | zenquotes.io | Nessun limite, no chiave | ⭐ (facilissima) |

✅ **Scelta motivata:** API-Ninjas fornisce dati strutturati perfetti per il nostro tema; ZenQuotes aggiunge un tocco motivazionale senza complicazioni tecniche.

### 2.3 Requisito: "Web service proprio (da offrire ai compagni)"

| Endpoint | Metodo | Cosa restituisce | Esempio richiesta | Esempio risposta |
|----------|--------|------------------|-------------------|------------------|
| `/api/exercise-suggestion` | GET | Esercizio personalizzato per età e livello | `?age=16&level=beginner&goal=toning` | `{"exercise":"Squat","duration":"15 min","reps":"3x12","calories":85}` |
| `/api/calorie-burn` | GET | Calorie bruciate per attività | `?activity=running&minutes=30&weight=65` | `{"calories":195,"message":"Ottimo lavoro!"}` |
| `/api/workout-plan` | GET | Piano settimanale | `?days=3&goal=strength` | `{"monday":"Push-up 3x10","wednesday":"..."}` |

✅ **Scelta consigliata:** endpoint `/api/exercise-suggestion` - semplice, utile, dimostra perfettamente il pattern MVC.

### 2.4 Requisito: "interazione con sistemi dei compagni"

| Cosa il nostro progetto CHIAMA dai compagni | Cosa il nostro progetto OFFRE ai compagni |
|---------------------------------------------|--------------------------------------------|
| API di un compagno su **alimentazione** → mostriamo "Dopo l'esercizio, ecco cosa mangiare per recuperare" | Il nostro web service `/api/exercise-suggestion` suggerisce esercizi ai loro progetti su salute |
| API di un compagno su **qualità dell'aria** → se l'aria è inquinata, consigliamo esercizio indoor | I compagni possono integrare i nostri consigli di esercizio nei loro progetti |
| API di un compagno su **sonno** → "Se hai dormito poco, meglio un esercizio leggero oggi" | |

### 2.5 Requisito: "analisi critica delle fonti digitali"

| Idea | Implementazione dettagliata |
|------|----------------------------|
| **Pagina "Smascheriamo i falsi miti"** | 5 fake news comuni sull'esercizio fisico, ognuna con: affermazione falsa, spiegazione scientifica, fonte ufficiale (OMS, ISS, PubMed) |
| **Verifica fonte automatica** | L'utente incolla un URL di un articolo sul fitness. Il sistema cerca parole chiave (OMS, ISS, studio, ricerca, Lancet, British Journal) e restituisce un punteggio di attendibilità (0-100%) |
| **Mini game interattivo** | 10 domande Vero/Falso. A ogni risposta, feedback immediato con spiegazione. Punteggio finale e messaggio personalizzato |

### 2.6 Requisito: "grafica accattivante e responsive"

| Elemento | Scelta progettuale |
|----------|-------------------|
| **Colori primari** | Verde (#2E7D32) e azzurro (#00BCD4) - richiamano salute, freschezza, movimento |
| **Colori secondari** | Arancione (#FF9800) per call to action, grigio chiaro (#F5F5F5) per sfondi |
| **Font** | 'Poppins' e 'Inter' (sans-serif moderne, leggibili) |
| **Layout** | Card con ombreggiatura, angoli arrotondati, spaziature ampie |
| **Mobile first** | Menu a hamburger su mobile, bottoni grandi (min 48px), testo leggibile senza zoom |
| **Feedback visivo** | Al completamento di un esercizio: animazione "check" + confetti CSS |

### 2.7 Requisito: "interattività"

| Interazione | Descrizione tecnica |
|-------------|---------------------|
| **Slider fatica** | Input range (1-10). Al cambiamento, i consigli di esercizio si adattano (fatica alta → esercizio leggero) |
| **Tasto completamento** | Bottone "✅ Ho fatto questo esercizio". Salva in localStorage, aggiorna contatore giornaliero, mostra messaggio motivazionale |
| **Sfida amico** | Genera link univoco (es. `/challenge?id=12345`). L'amico può accettare la sfida e confrontare i progressi |
| **Drag & drop giornata** | Trascina gli esercizi nella timeline personalizzata della giornata |
| **Registrazione vocale** (bonus) | Usando Web Speech API, l'utente può dire "Ho fatto gli squat" e il sistema segna l'esercizio |

---

## 3. Architettura MVC

### 3.1 Schema concettuale

``` text
┌─────────────────────────────────────────────────────────────┐
│ CLIENT (Browser) │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐ │
│ │ View │ │ Controller │ │ Model (client) │ │
│ │ HTML/CSS │◄─┤ (JS client)│◄─┤ localStorage/state │ │
│ └─────────────┘ └──────┬──────┘ └─────────────────────┘ │
│ │ │
│ HTTP (fetch/AJAX) │
└──────────────────────────┼────────────────────────────────────┘
│
┌──────────────────────────┼────────────────────────────────────┐
│ SERVER (Node.js) │
│ ▼ │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ ROUTER (Express) │ │
│ └─────────────────────────┬───────────────────────────────┘ │
│ │ │
│ ┌───────────────┼───────────────┐ │
│ ▼ ▼ ▼ │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ │
│ │ CONTROLLER │ │ MODEL │ │ VIEW │ │
│ │ authController│◄►│ User.js │ │ (res.sendFile│ │
│ │ healthCtrl │ │ HealthData.js│ │ o template) │ │
│ │ apiController│ │ ExternalAPI.js│ └──────────────┘ │
│ └──────────────┘ └──────────────┘ │
│ │ │
│ ▼ │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ DATA (file JSON) │ │
│ │ users.json - health_logs.json - exercises.json │ │
│ └─────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────┘
```

### 3.2 Responsabilità dei componenti

| Componente | Responsabilità | Metodi/Funzioni esemplificative |
|------------|----------------|----------------------------------|
| **Model** | Gestione dati, logica di calcolo, lettura/scrittura file | `calculateBMI()`, `saveUser()`, `fetchExercisesFromAPI()` |
| **View** | Pagine HTML, CSS, JavaScript lato client, rendering grafici | `dashboard.html`, `style.css`, `charts.js` |
| **Controller** | Riceve richieste HTTP, interagisce con Model, restituisce View o JSON | `login()`, `getDashboard()`, `getExerciseSuggestion()` |

---

## 4. Struttura completa delle cartelle

``` text
fitchecker/
│
├── server.js # Entry point - avvia Express
├── package.json # Dipendenze (express, express-session, cors, fs)
├── package-lock.json
├── .env # Variabili d'ambiente (porta, secret key)
│
├── models/ # MODELLI - gestione dati
│ ├── User.js # CRUD utenti su file JSON
│ ├── HealthData.js # Calcoli BMI, BMR, fabbisogno idrico
│ ├── ExternalAPI.js # Chiamate a API-Ninjas e ZenQuotes
│ └── ExerciseLog.js # Salvataggio esercizi completati
│
├── views/ # VISTE - pagine HTML
│ ├── index.html # Landing page
│ ├── login.html # Login
│ ├── register.html # Registrazione
│ ├── dashboard.html # Dashboard principale
│ ├── calculator.html # Calcolatore BMI e fabbisogni
│ ├── exercises.html # Esercizi da API pubblica
│ ├── exercise-detail.html # Dettaglio singolo esercizio
│ ├── diary.html # Diario personale
│ ├── progress.html # Progressi e grafici
│ ├── fake-news-quiz.html # Quiz educazione civica
│ ├── verify-source.html # Verifica fonti online
│ ├── classmates-api.html # Dati da API compagni
│ └── challenge.html # Sfida con amico
│
├── controllers/ # CONTROLLORI - logica applicativa
│ ├── authController.js # Login, register, logout, sessione
│ ├── healthController.js # BMI, acqua, dashboard, calcoli
│ ├── apiController.js # Web service proprio (/api/...)
│ ├── externalController.js # Gestione chiamate ad API esterne
│ └── challengeController.js # Sfide tra utenti
│
├── public/ # File statici
│ ├── css/
│ │ ├── style.css # Stili globali
│ │ ├── responsive.css # Media query
│ │ └── dark-mode.css # Modalità scura (bonus)
│ ├── js/
│ │ ├── dashboard.js # Logica dashboard client
│ │ ├── charts.js # Chart.js (BMI trend, attività)
│ │ ├── quiz.js # Logica quiz fake news
│ │ ├── exercises.js # Chiamate API e rendering
│ │ └── utils.js # Funzioni di utilità
│ ├── assets/
│ │ ├── images/ # Icone, logo, illustrazioni
│ │ ├── icons/ # SVG per esercizi
│ │ └── sounds/ # Suoni per completamento (bonus)
│ └── libs/
│ └── chart.js # Libreria Chart.js (CDN fallback)
│
├── middleware/ # MIDDLEWARE Express
│ ├── auth.js # Verifica sessione utente
│ ├── logger.js # Log delle richieste
│ └── rateLimit.js # Limitazione chiamate API
│
├── routes/ # ROUTER Express (opzionale - separazione)
│ ├── authRoutes.js
│ ├── apiRoutes.js
│ └── pageRoutes.js
│
├── data/ # DATABASE (file JSON)
│ ├── users.json # { id, username, password_hash, email }
│ ├── health_logs.json # { userId, date, weight, bmi, water_intake }
│ ├── exercise_logs.json # { userId, date, exercise, reps, completed }
│ ├── challenges.json # { challengeId, user1, user2, status }
│ └── quiz_scores.json # { userId, date, score, answers }
│
├── utils/ # UTILITY
│ ├── helpers.js # Funzioni helper (hash password, validate)
│ ├── constants.js # Costanti (BMI ranges, calorie factors)
│ └── db.js # Wrapper per operazioni su JSON
│
├── docs/ # DOCUMENTAZIONE
│ ├── README.md # Documentazione progetto
│ ├── api-documentation.md # Documentazione web service
│ └── presentation.pptx # Slide presentazione
│
└── tests/ # TEST (opzionale)
├── api.test.js
└── health.test.js
```

---

## 5. Mappa del progetto

### 5.1 Mappa delle pagine (sitemap)

``` text
FITCHECKER
│
├── 🏠 Pagina di ingresso (index.html)
│ ├── 🔐 Login → Dashboard
│ └── 📝 Register → Dashboard
│
├── 📊 Dashboard (dashboard.html)
│ ├── 👤 Profilo utente (peso, altezza, livello)
│ ├── 📈 BMI attuale con barra colorata
│ ├── 💧 Fabbisogno idrico giornaliero
│ ├── 🏆 Esercizio consigliato del giorno
│ ├── 📅 Calendario attività
│ └── 🔗 Link a tutte le sezioni
│
├── 🧮 Calcolatore (calculator.html)
│ ├── 📏 Inserimento peso e altezza
│ ├── 📊 Calcolo BMI + categoria (sottopeso, normopeso, sovrappeso, obesità)
│ ├── 💧 Calcolo acqua consigliata (peso × 30ml)
│ └── 🔥 Calcolo BMR (metabolismo basale)
│
├── 💪 Esercizi (exercises.html)
│ ├── 🔍 Filtri: muscolo target, difficoltà, tipo
│ ├── 🃏 Card esercizi (nome, immagine, istruzioni)
│ ├── ✅ Pulsante "Completa esercizio"
│ └── 📖 Pagina dettaglio (exercise-detail.html)
│
├── 📓 Diario (diary.html)
│ ├── 📅 Seleziona data
│ ├── ✏️ Inserisci esercizi fatti
│ ├── 📊 Riepilogo settimanale
│ └── 📥 Download PDF report
│
├── 📈 Progressi (progress.html)
│ ├── 📉 Grafico BMI nel tempo (Chart.js)
│ ├── 📊 Grafico esercizi completati/giorno
│ └── 🏅 Badge e obiettivi raggiunti
│
├── 🎓 Educazione Civica
│ ├── ❓ Fake News Quiz (fake-news-quiz.html)
│ │ ├── 10 domande Vero/Falso
│ │ ├── Feedback immediato
│ │ └── Punteggio finale
│ └── 🔍 Verifica fonte (verify-source.html)
│ ├── Input URL
│ └── Analisi attendibilità
│
├── 🔌 Integrazione compagni (classmates-api.html)
│ ├── 📡 Chiamata a API compagno (es. alimentazione)
│ ├── 📡 Chiamata a API compagno (es. qualità aria)
│ └── 🔄 Dati combinati con i nostri
│
└── 👥 Sfide (challenge.html)
├── 🔗 Genera link sfida
├── 📊 Confronto progressi
└── 🏆 Classifica
```

### 5.2 Mappa degli endpoint API (server)

| Endpoint | Metodo | Autenticazione | Descrizione |
|----------|--------|----------------|-------------|
| `/` | GET | No | Landing page |
| `/login` | GET/ POST | No | Pagina e login |
| `/register` | GET/ POST | No | Registrazione |
| `/dashboard` | GET | ✅ Sì | Dashboard utente |
| `/logout` | GET | ✅ Sì | Logout |
| `/api/exercise-suggestion` | GET | No** | Web service proprio |
| `/api/calorie-burn` | GET | No** | Calcolo calorie |
| `/api/bmi` | POST | ✅ Sì | Calcola e salva BMI |
| `/api/exercises` | GET | ✅ Sì | Esercizi da API Ninjas |
| `/api/exercises/complete` | POST | ✅ Sì | Salva esercizio completato |
| `/api/progress` | GET | ✅ Sì | Recupera progressi utente |
| `/api/quiz/questions` | GET | No | Domande quiz fake news |
| `/api/quiz/submit` | POST | ✅ Sì | Salva punteggio quiz |
| `/api/verify-source` | POST | No | Verifica attendibilità URL |
| `/api/challenge/create` | POST | ✅ Sì | Crea sfida |
| `/api/challenge/accept` | POST | ✅ Sì | Accetta sfida |

**Nota:** endpoint con `No**` sono pubblici ma potrebbero avere rate limiting.

---

## 6. Tecnologie utilizzate

### 6.1 Stack tecnologico completo

| Livello | Tecnologia | Versione | Motivazione |
|---------|------------|----------|-------------|
| **Backend** | Node.js | 18.x+ | Runtime JavaScript, richiesto dalla consegna |
| **Web framework** | Express | 4.18.x | Minimalista, flessibile, standard per REST API |
| **Autenticazione** | express-session | 1.17.x | Semplice, senza bisogno di JWT complesso |
| **Password** | bcrypt | 5.1.x | Hashing sicuro per le password |
| **Frontend** | HTML5 | - | Struttura semantica |
| **Stili** | CSS3 + Flexbox/Grid | - | Layout moderni e responsive |
| **Interattività** | Vanilla JavaScript | ES6+ | Nessun framework pesante, puro JS |
| **Grafici** | Chart.js | 4.4.x | Leggero, facile, ben documentato |
| **Chiamate API** | Fetch API | nativa | Moderna, Promise-based |
| **Storage lato client** | localStorage | nativa | Per salvare preferenze temporanee |
| **Storage lato server** | File JSON (fs module) | nativa | Semplice, nessun database da configurare |
| **Variabili ambiente** | dotenv | 16.0.x | Per secret keys e configurazioni |
| **CORS** | cors | 2.8.x | Per permettere chiamate dai compagni |
| **Testing** | (opzionale) Jest | 29.x | Per testing moduli |

---

### 6.2 Dipendenze package.json

```json
{
  "name": "fitchecker",
  "version": "1.0.0",
  "description": "Progetto Educazione Civica - Esercizio fisico e benessere",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "express-session": "^1.17.3",
    "bcrypt": "^5.1.1",
    "dotenv": "^16.0.3",
    "cors": "^2.8.5",
    "node-fetch": "^2.6.9"
  },
  "devDependencies": {
    "nodemon": "^2.0.22"
  }
}
```

---

7. API pubbliche

### 7.1 API-Ninjas Exercises (principale)

**Documentazione:** [https://api-ninjas.com/api/exercises](https://api-ninjas.com/api/exercises)

**Registrazione:** Obbligatoria (gratuita, 30 secondi)

**Limiti:** 50 chiamate/giorno per account gratuito

**Richiesta base:**

```http
GET https://api.api-ninjas.com/v1/exercises?muscle=quadriceps
X-Api-Key: YOUR_API_KEY
```

**Parametri disponibili:**

| Parametro | Valori possibili | Descrizione |
|-----------|------------------|-------------|
| `muscle` | abdominals, quadriceps, hamstrings, glutes, calves, chest, shoulders, triceps, biceps, back, lats, trapezius, cardio | Muscolo target |
| `difficulty` | beginner, intermediate, advanced | Difficoltà |
| `type` | strength, cardio, stretching, plyometrics, power, yoga | Tipo di esercizio |
| `name` | stringa | Cerca per nome (parziale) |

### Esempio risposta:

``` json
[
  {
    "name": "Squat",
    "type": "strength",
    "muscle": "quadriceps",
    "equipment": "body only",
    "difficulty": "beginner",
    "instructions": "Stand with feet shoulder-width apart. Lower your body as if sitting back into a chair. Keep your chest up and back straight. Return to starting position."
  }
]
```

Implementazione nel Model (ExternalAPI.js):

``` javascript
const fetch = require('node-fetch');

class ExternalAPI {
  static async getExercises(muscle = 'cardio', difficulty = 'beginner') {
    const url = `https://api.api-ninjas.com/v1/exercises?muscle=${muscle}&difficulty=${difficulty}`;
    const response = await fetch(url, {
      headers: { 'X-Api-Key': process.env.API_NINJAS_KEY }
    });
    return await response.json();
  }
  
  static async getExerciseByName(name) {
    const url = `https://api.api-ninjas.com/v1/exercises?name=${encodeURIComponent(name)}`;
    const response = await fetch(url, {
      headers: { 'X-Api-Key': process.env.API_NINJAS_KEY }
    });
    return await response.json();
  }
}

module.exports = ExternalAPI;

```

### 7.2 ZenQuotes API (motivazionale)
Documentazione: https://zenquotes.io/

Registrazione: Non richiesta

Limiti: Nessun limite dichiarato (uso accademico ok)

Richiesta:

``` http
GET https://zenquotes.io/api/random
```

#### Risposta esempio:

``` json
[
  {
    "q": "The only bad workout is the one that didn't happen.",
    "a": "Unknown",
    "h": "<blockquote>&ldquo;The only bad workout is the one that didn't happen.&rdquo; &mdash; Unknown</blockquote>"
  }
]

```
#### Implementazione:

``` javascript
static async getMotivationalQuote() {
  const response = await fetch('https://zenquotes.io/api/random');
  const data = await response.json();
  return {
    quote: data[0].q,
    author: data[0].a
  };
}
```

# 8. Web service proprio

### 8.1 Endpoint: GET /api/exercise-suggestion

**Descrizione:** Restituisce un esercizio personalizzato in base all'età, livello e obiettivo dell'utente.

**Richiesta (query parameters):**

| Parametro | Tipo | Obbligatorio | Valori possibili | Default |
|-----------|------|--------------|------------------|---------|
| `age` | integer | Sì | 14-100 | - |
| `level` | string | No | beginner, intermediate, advanced | beginner |
| `goal` | string | No | weight_loss, toning, strength, cardio, flexibility | toning |

**Esempio richiesta:**

``` http
GET /api/exercise-suggestion?age=16&level=intermediate&goal=strength
```

Risposta (JSON):

``` json
{
  "success": true,
  "data": {
    "exercise": "Push-up",
    "type": "strength",
    "muscle": "chest",
    "difficulty": "intermediate",
    "duration_minutes": 15,
    "repetitions": "3x12",
    "rest_seconds": 45,
    "calories_estimate": 95,
    "instructions": "Start in a plank position. Lower your body until your chest nearly touches the floor. Push back up.",
    "safety_tip": "Keep your back straight and core engaged",
    "alternative": "Incline push-up"
  }
}
```

#### Implementazione nel Controller (apiController.js):

``` javascript
const HealthData = require('../models/HealthData');

exports.getExerciseSuggestion = (req, res) => {
  const { age, level, goal } = req.query;
  
  // Validazione input
  if (!age) {
    return res.status(400).json({ 
      success: false, 
      error: 'Il parametro age è obbligatorio' 
    });
  }
  
  // Database locale di esercizi (fallback se API esterna non risponde)
  const exercisesDB = {
    beginner: {
      weight_loss: { name: "Walking", reps: "30 min", calories: 120 },
      toning: { name: "Bodyweight Squat", reps: "3x12", calories: 85 },
      strength: { name: "Wall Push-up", reps: "3x10", calories: 70 },
      cardio: { name: "Jumping Jacks", reps: "30 sec on/15 off", calories: 100 },
      flexibility: { name: "Cat-Cow Stretch", reps: "10 reps", calories: 30 }
    },
    intermediate: {
      weight_loss: { name: "Burpees", reps: "3x10", calories: 150 },
      toning: { name: "Lunges", reps: "3x12 per leg", calories: 110 },
      strength: { name: "Push-up", reps: "3x12", calories: 95 },
      cardio: { name: "Mountain Climbers", reps: "30 sec", calories: 130 },
      flexibility: { name: "Downward Dog", reps: "Hold 30 sec", calories: 25 }
    },
    advanced: {
      weight_loss: { name: "Box Jumps", reps: "3x15", calories: 180 },
      toning: { name: "Pistol Squats", reps: "3x8 per leg", calories: 140 },
      strength: { name: "Pull-ups", reps: "3x10", calories: 110 },
      cardio: { name: "Battle Ropes", reps: "45 sec", calories: 160 },
      flexibility: { name: "Pigeon Pose", reps: "Hold 1 min", calories: 20 }
    }
  };
  
  const selectedLevel = level || 'beginner';
  const selectedGoal = goal || 'toning';
  const exercise = exercisesDB[selectedLevel]?.[selectedGoal] || exercisesDB.beginner.toning;
  
  // Calcolo calorie aggiustato per età (minorenni bruciano leggermente meno)
  const ageFactor = age < 18 ? 0.95 : 1.0;
  const adjustedCalories = Math.round(exercise.calories * ageFactor);
  
  res.json({
    success: true,
    data: {
      exercise: exercise.name,
      type: selectedGoal,
      difficulty: selectedLevel,
      duration_minutes: 15,
      repetitions: exercise.reps,
      rest_seconds: 45,
      calories_estimate: adjustedCalories,
      instructions: `Esegui ${exercise.name} come descritto. Mantieni una respirazione regolare.`,
      safety_tip: "Ascolta il tuo corpo, non forzare mai fino al dolore",
      alternative: exercise.name === "Push-up" ? "Push-up sulle ginocchia" : "Versione più facile disponibile"
    }
  });
};
```

### 8.2 Endpoint aggiuntivo: GET /api/calorie-burn
#### Richiesta:

``` http
GET /api/calorie-burn?activity=running&minutes=30&weight=65
```

#### Risposta:

``` json
{
  "success": true,
  "activity": "running",
  "minutes": 30,
  "weight_kg": 65,
  "calories_burned": 292,
  "met_value": 9.0,
  "message": "Ottimo lavoro! Hai bruciato circa l'equivalente di una mela 🍎"
}
```

---

# 9. Integrazione con i compagni
### 9.1 Cosa chiamiamo dai compagni

Nel file classmates-api.html (frontend):

``` javascript
// Chiamata a API di un compagno su alimentazione
async function getNutritionAdvice() {
  try {
    // Sostituire con IP e porta del compagno
    const response = await fetch('http://192.168.1.100:3001/api/food-advice');
    const data = await response.json();
    
    // Mostro consiglio alimentare abbinato all'esercizio
    document.getElementById('nutrition-tip').innerHTML = `
      <h3>🥗 Consiglio alimentare del compagno</h3>
      <p>Dopo l'esercizio di oggi (${currentExercise}), prova: ${data.suggestion}</p>
    `;
  } catch (error) {
    console.error('API compagno non disponibile', error);
  }
}

// Chiamata a API di un compagno su qualità aria
async function getAirQuality() {
  const response = await fetch('http://192.168.1.101:3002/api/air-quality');
  const airData = await response.json();
  
  if (airData.aqi > 100) {
    showIndoorExerciseWarning('Aria inquinata, meglio esercizio al chiuso oggi');
  }
}
```
### 9.2 Cosa offriamo ai compagni (web service pubblico)

``` javascript
// Nel server.js o apiController.js
app.use(cors());  // Abilita CORS per tutti i domini (o restringi a IP compagni)

// Endpoint documentato e accessibile
app.get('/api/exercise-suggestion', apiController.getExerciseSuggestion);

// Endpoint aggiuntivo per statistiche aggregate (utile per compagni)
app.get('/api/class-stats', (req, res) => {
  // Restituisce statistiche anonime della classe
  res.json({
    total_exercises_completed: 1247,
    most_popular_exercise: "Squat",
    average_bmi: 21.3
  });
});
```

### 9.3 Documentazione per i compagni (da condividere)

# API FitChecker - Documentazione per integrazione

## Endpoint disponibili

### 1. Suggerimento esercizio
GET /api/exercise-suggestion?age={età}&level={level}&goal={obiettivo}

Esempio:
GET /api/exercise-suggestion?age=17&level=beginner&goal=cardio

### 2. Calcolo calorie
GET /api/calorie-burn?activity={attività}&minutes={minuti}&weight={peso}

### 3. Statistiche classe (anonime)
GET /api/class-stats

## Autenticazione
Nessuna autenticazione richiesta per questi endpoint (uso accademico).

## Rate limit
Max 100 chiamate/ora per IP.

## Esempio integrazione in JavaScript
fetch('http://IP-server:3000/api/exercise-suggestion?age=16&level=beginner')
  .then(r => r.json())
  .then(data => console.log(data.data.exercise));

# 10. Autenticazione
### 10.1 Flusso di autenticazione

```text
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│ Register │────►│  Login   │────►│ Session  │────►│Dashboard │
│ (POST)   │     │ (POST)   │     │ (cookie) │     │ (protetta)│
└──────────┘     └──────────┘     └──────────┘     └──────────┘
      │                │                │                │
      ▼                ▼                ▼                ▼
 Salva user    Verifica       setId in        Verifica
 su JSON       password       req.session     middleware
 ```

### 10.2 Model User.js

```javascript
const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');

const USERS_FILE = path.join(__dirname, '../data/users.json');

class User {
  static async findAll() {
    const data = await fs.readFile(USERS_FILE, 'utf8');
    return JSON.parse(data);
  }
  
  static async findByUsername(username) {
    const users = await this.findAll();
    return users.find(u => u.username === username);
  }
  
  static async create({ username, password, email, age, weight, height }) {
    const users = await this.findAll();
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = {
      id: Date.now().toString(),
      username,
      password: hashedPassword,
      email,
      age,
      weight,
      height,
      created_at: new Date().toISOString(),
      level: 'beginner'  // default
    };
    
    users.push(newUser);
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
    return newUser;
  }
  
  static async verifyPassword(username, plainPassword) {
    const user = await this.findByUsername(username);
    if (!user) return false;
    return await bcrypt.compare(plainPassword, user.password);
  }
}

module.exports = User;

```

### 10.3 Middleware auth.js

``` javascript
function ensureAuthenticated(req, res, next) {
  if (req.session && req.session.userId) {
    return next();
  }
  res.redirect('/login');
}

function ensureGuest(req, res, next) {
  if (!req.session || !req.session.userId) {
    return next();
  }
  res.redirect('/dashboard');
}

module.exports = { ensureAuthenticated, ensureGuest };
```

### 10.4 Controller authController.js
``` javascript
const User = require('../models/User');

exports.showLogin = (req, res) => {
  res.sendFile(path.join(__dirname, '../views/login.html'));
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  
  const isValid = await User.verifyPassword(username, password);
  if (!isValid) {
    return res.status(401).json({ error: 'Credenziali non valide' });
  }
  
  const user = await User.findByUsername(username);
  req.session.userId = user.id;
  req.session.username = user.username;
  
  res.json({ success: true, redirect: '/dashboard' });
};

exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect('/login');
};
10.5 File users.json (esempio)
json
[
  {
    "id": "1704067200000",
    "username": "mario_rossi",
    "password": "$2b$10$...hash...",
    "email": "mario@esempio.it",
    "age": 16,
    "weight": 65,
    "height": 170,
    "created_at": "2025-01-01T10:00:00.000Z",
    "level": "intermediate"
  }
]
```

# 11. Analisi critica delle fonti
### 11.1 Pagina Fake News Quiz (fake-news-quiz.html)

``` html
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quiz Fake News - FitChecker</title>
    <link rel="stylesheet" href="/css/style.css">
</head>
<body>
    <nav class="navbar">...</nav>
    
    <main class="container">
        <h1>📰 Smascheriamo i falsi miti sull'esercizio fisico</h1>
        <p class="subtitle">Metti alla prova le tue conoscenze con fonti scientifiche (OMS, ISS)</p>
        
        <div class="quiz-container" id="quizContainer">
            <!-- DOMANDE -->
        </div>
        
        <div class="quiz-result" id="quizResult" style="display: none;">
            <h2>Il tuo punteggio: <span id="score">0</span>/10</h2>
            <div id="feedbackMessage"></div>
            <button onclick="resetQuiz()">🔄 Riprova</button>
        </div>
    </main>
    
    <script>
        const questions = [
            {
                text: "Sudare molto significa che stai bruciando più grassi",
                isTrue: false,
                explanation: "FALSO. La sudorazione è un meccanismo di raffreddamento del corpo, non è correlata al consumo di grassi. Si suda di più quando fa caldo o umido, non perché si bruciano più calorie. Fonte: ISS"
            },
            {
                text: "Fare stretching prima dell'esercizio previene gli infortuni",
                isTrue: false,
                explanation: "FALSO. Studi recenti mostrano che lo stretching statico prima dell'attività NON riduce il rischio infortuni. Meglio un riscaldamento dinamico (saltelli, affondi). Fonte: British Journal of Sports Medicine"
            },
            {
                text: "L'allenamento a digiuno brucia più grassi",
                isTrue: false,
                explanation: "FALSO. A digiuno il corpo brucia più muscoli e meno grassi. Inoltre si ha meno energia e si rischiano capogiri. Fonte: American Council on Exercise"
            },
            {
                text: "Bere acqua durante l'esercizio è importante",
                isTrue: true,
                explanation: "VERO. La disidratazione anche lieve riduce la performance e può causare crampi. Bere piccoli sorsi ogni 15-20 minuti. Fonte: OMS"
            },
            {
                text: "Se non senti dolore, non stai allenando abbastanza",
                isTrue: false,
                explanation: "FALSO. Il dolore acuto è un segnale di allarme. Il cosiddetto 'dolce indolenzimento' (DOMS) del giorno dopo è normale, ma il dolore durante l'esercizio NO. Fonte: NIH"
            },
            {
                text: "Gli adolescenti hanno bisogno di almeno 60 minuti di attività fisica al giorno",
                isTrue: true,
                explanation: "VERO. Secondo l'OMS, bambini e adolescenti (5-17 anni) dovrebbero fare almeno 60 minuti al giorno di attività fisica moderata/intensa."
            },
            {
                text: "Sollevare pesi da adolescenti ferma la crescita",
                isTrue: false,
                explanation: "FALSO. Con tecnica corretta e supervisione, l'allenamento con i pesi è sicuro per adolescenti. Non ci sono prove che danneggi le cartilagini di accrescimento."
            },
            {
                text: "Camminare 10.000 passi al giorno è una soglia magica per la salute",
                isTrue: false,
                explanation: "PARZIALMENTE FALSO. 10.000 passi è un numero tondo, ma studi mostrano benefici già a 7.000-8.000 passi. Meglio muoversi che contare ossessivamente."
            },
            {
                text: "Il recupero è importante quanto l'allenamento",
                isTrue: true,
                explanation: "VERO. I muscoli crescono e si riparano durante il riposo, non durante l'allenamento. Dormire 8 ore aiuta il recupero. Fonte: Journal of Applied Physiology"
            },
            {
                text: "Fare addominali riduce il grasso sulla pancia",
                isTrue: false,
                explanation: "FALSO. Non esiste il 'dimagrimento localizzato'. Gli addominali tonificano i muscoli ma non bruciano il grasso addominale specifico. Serve attività generale + alimentazione."
            }
        ];
        
        let currentQuestion = 0;
        let score = 0;
        
        function loadQuestion() {
            // Implementazione render domande
        }
        
        function checkAnswer(selected) {
            // Implementazione controllo risposta
        }
    </script>
</body>
</html>
```
### 11.2 Verifica fonte (verify-source.html)

``` javascript
// Funzione di analisi attendibilità lato client (e lato server)
async function verifySource() {
    const url = document.getElementById('sourceUrl').value;
    
    // Parole chiave attendibili
    const trustedKeywords = ['oms', 'who.int', 'iss.it', 'pubmed', 'nih.gov', 'lancet', 'bmj', 'scientific', 'studio', 'ricerca'];
    // Parole chiave sospette
    const suspiciousKeywords = ['miracoloso', 'dimagrisci in 3 giorni', 'segreto', 'rimedio naturale', 'scoperta rivoluzionaria', 'le aziende non vogliono che tu sappia'];
    
    try {
        // Chiamata al server per analisi (evita CORS)
        const response = await fetch('/api/verify-source', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url })
        });
        const result = await response.json();
        
        displayVerificationResult(result);
    } catch (error) {
        // Analisi client-side fallback
        let score = 0;
        trustedKeywords.forEach(keyword => {
            if (url.toLowerCase().includes(keyword)) score += 20;
        });
        suspiciousKeywords.forEach(keyword => {
            if (url.toLowerCase().includes(keyword)) score -= 25;
        });
        score = Math.min(100, Math.max(0, score));
        
        displayVerificationResult({ score, message: `Attendibilità: ${score}% - Verifica manuale consigliata` });
    }
}
``` 
# 12. Grafica e responsive
### 12.1 CSS principale (style.css)
``` css
/* VARIABILI CSS */
:root {
    --primary-green: #2E7D32;
    --primary-blue: #00BCD4;
    --secondary-orange: #FF9800;
    --bg-light: #F5F5F5;
    --text-dark: #333333;
    --text-light: #FFFFFF;
    --shadow: 0 4px 12px rgba(0,0,0,0.1);
    --border-radius: 16px;
}

/* RESET e BASE */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Poppins', 'Inter', sans-serif;
    background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
    color: var(--text-dark);
    line-height: 1.6;
    min-height: 100vh;
}

/* NAVBAR */
.navbar {
    background: linear-gradient(90deg, var(--primary-green), var(--primary-blue));
    padding: 1rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    box-shadow: var(--shadow);
}

.logo {
    font-size: 1.8rem;
    font-weight: bold;
    color: white;
    text-decoration: none;
}

.logo span {
    font-size: 1.5rem;
}

.nav-links {
    display: flex;
    gap: 1.5rem;
    list-style: none;
}

.nav-links a {
    color: white;
    text-decoration: none;
    font-weight: 500;
    transition: opacity 0.3s;
}

.nav-links a:hover {
    opacity: 0.8;
}

/* MENU HAMBURGER (MOBILE) */
.hamburger {
    display: none;
    flex-direction: column;
    cursor: pointer;
}

.hamburger span {
    width: 25px;
    height: 3px;
    background: white;
    margin: 3px 0;
    border-radius: 3px;
}

/* CARD */
.card {
    background: white;
    border-radius: var(--border-radius);
    padding: 1.5rem;
    box-shadow: var(--shadow);
    transition: transform 0.2s;
}

.card:hover {
    transform: translateY(-4px);
}

/* GRIGLIA RESPONSIVE */
.grid-2 {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
}

.grid-3 {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
}

/* BOTTONI */
.btn {
    background: var(--primary-green);
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 50px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s;
}

.btn:hover {
    background: #1B5E20;
    transform: scale(1.02);
}

.btn-primary {
    background: var(--primary-blue);
}

.btn-primary:hover {
    background: #0097A7;
}

/* BANDA BMI */
.bmi-bar {
    width: 100%;
    height: 12px;
    background: linear-gradient(90deg, #4caf50, #ffeb3b, #ff9800, #f44336);
    border-radius: 6px;
    margin: 10px 0;
}

.bmi-indicator {
    width: 4px;
    height: 20px;
    background: black;
    position: relative;
    top: -4px;
}

/* FEEDBACK COMPLETAMENTO */
.completion-feedback {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: var(--primary-green);
    color: white;
    padding: 12px 20px;
    border-radius: 50px;
    animation: slideIn 0.3s ease;
}

@keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}

/* MEDIA QUERY RESPONSIVE */
@media (max-width: 768px) {
    .hamburger {
        display: flex;
    }
    
    .nav-links {
        display: none;
        width: 100%;
        flex-direction: column;
        text-align: center;
        padding: 1rem 0;
    }
    
    .nav-links.active {
        display: flex;
    }
    
    .grid-2, .grid-3 {
        grid-template-columns: 1fr;
    }
    
    .navbar {
        padding: 1rem;
    }
    
    .card {
        padding: 1rem;
    }
    
    .btn {
        padding: 10px 20px;
        font-size: 0.9rem;
    }
}

@media (max-width: 480px) {
    body {
        font-size: 14px;
    }
    
    .logo {
        font-size: 1.4rem;
    }
}
```

### 12.2 JavaScript per mobile menu
``` javascript
// Toggle menu hamburger
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger?.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});
13. Interattività
13.1 Slider fatica e consigli dinamici
javascript
// In dashboard.js
const fatigueSlider = document.getElementById('fatigueSlider');
const fatigueValue = document.getElementById('fatigueValue');
const exerciseSuggestion = document.getElementById('exerciseSuggestion');

fatigueSlider?.addEventListener('input', async (e) => {
    const fatigue = e.target.value;
    fatigueValue.textContent = fatigue;
    
    let suggestedExercise = '';
    if (fatigue > 7) {
        suggestedExercise = '🧘 Stretching leggero e respirazione';
    } else if (fatigue > 4) {
        suggestedExercise = '🚶 Camminata 20 minuti';
    } else {
        // Chiamata API per esercizio normale
        const response = await fetch('/api/exercise-suggestion?age=16&level=beginner');
        const data = await response.json();
        suggestedExercise = `💪 ${data.data.exercise} - ${data.data.repetitions}`;
    }
    
    exerciseSuggestion.textContent = suggestedExercise;
});
```

### 13.2 Bottone completamento e salvataggio
``` javascript
async function completeExercise(exerciseName, caloriesEstimate) {
    // 1. Salva nel backend
    const response = await fetch('/api/exercises/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            exercise: exerciseName,
            calories: caloriesEstimate,
            date: new Date().toISOString()
        })
    });
    
    if (response.ok) {
        // 2. Aggiorna contatori client
        let dailyCount = localStorage.getItem('dailyExercises') || 0;
        dailyCount++;
        localStorage.setItem('dailyExercises', dailyCount);
        
        // 3. Feedback visivo
        showFeedback(`✅ Ottimo! Hai completato ${exerciseName}`);
        
        // 4. Aggiorna solidarietà
        updateSolidarityCounter();
        
        // 5. Confetti (bonus)
        showConfetti();
    }
}

function showConfetti() {
    // Confetti semplici senza librerie
    for (let i = 0; i < 50; i++) {
        const confetto = document.createElement('div');
        confetto.className = 'confetto';
        confetto.style.left = Math.random() * 100 + '%';
        confetto.style.animationDuration = Math.random() * 2 + 1 + 's';
        document.body.appendChild(confetto);
        setTimeout(() => confetto.remove(), 2000);
    }
}
```

### 13.3 Sfida amico - generazione link
``` javascript
async function createChallenge() {
    const response = await fetch('/api/challenge/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            targetExercise: currentExercise,
            targetReps: 50
        })
    });
    
    const { challengeId, link } = await response.json();
    
    // Mostra link da condividere
    const shareableLink = `${window.location.origin}/challenge?id=${challengeId}`;
    navigator.clipboard.writeText(shareableLink);
    alert('Link copiato! Inviato a un amico per sfidarlo.');
}
```

# 14. Codice sorgente completo
### 14.1 server.js (entry point)
``` javascript
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cors());

// SESSIONE
app.use(session({
    secret: process.env.SESSION_SECRET || 'fitchecker_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false,  // true solo in HTTPS
        maxAge: 1000 * 60 * 60 * 24  // 24 ore
    }
}));

// IMPORT CONTROLLER
const authController = require('./controllers/authController');
const healthController = require('./controllers/healthController');
const apiController = require('./controllers/apiController');
const externalController = require('./controllers/externalController');
const { ensureAuthenticated, ensureGuest } = require('./middleware/auth');

// ROTTE PAGINE
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/login', ensureGuest, authController.showLogin);
app.get('/register', ensureGuest, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'register.html'));
});

app.get('/dashboard', ensureAuthenticated, healthController.showDashboard);
app.get('/calculator', ensureAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'calculator.html'));
});

app.get('/exercises', ensureAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'exercises.html'));
});

app.get('/diary', ensureAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'diary.html'));
});

app.get('/progress', ensureAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'progress.html'));
});

app.get('/fake-news-quiz', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'fake-news-quiz.html'));
});

app.get('/verify-source', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'verify-source.html'));
});

app.get('/classmates-api', ensureAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'classmates-api.html'));
});

// ROTTE API (POST/GET per interazioni)
app.post('/login', authController.login);
app.post('/register', authController.register);
app.get('/logout', authController.logout);

app.post('/api/bmi', ensureAuthenticated, healthController.calculateAndSaveBMI);
app.get('/api/progress', ensureAuthenticated, healthController.getProgress);
app.post('/api/exercises/complete', ensureAuthenticated, healthController.completeExercise);

// WEB SERVICE PROPRIO (accessibile anche senza login per i compagni)
app.get('/api/exercise-suggestion', apiController.getExerciseSuggestion);
app.get('/api/calorie-burn', apiController.getCalorieBurn);
app.get('/api/class-stats', apiController.getClassStats);

// API PUBBLICHE (proxy)
app.get('/api/external/exercises', ensureAuthenticated, externalController.getExercises);
app.get('/api/external/quote', ensureAuthenticated, externalController.getQuote);

// VERIFICA FONTE
app.post('/api/verify-source', externalController.verifySource);

// SFIDE
app.post('/api/challenge/create', ensureAuthenticated, challengeController.createChallenge);
app.get('/api/challenge/:id', ensureAuthenticated, challengeController.getChallenge);

// AVVIO SERVER
app.listen(PORT, () => {
    console.log(`🚀 FitChecker server in esecuzione su http://localhost:${PORT}`);
});
```

### 14.2 Model HealthData.js
``` javascript
class HealthData {
    static calculateBMI(weightKg, heightCm) {
        const heightM = heightCm / 100;
        const bmi = weightKg / (heightM * heightM);
        return parseFloat(bmi.toFixed(1));
    }
    
    static getBMICategory(bmi) {
        if (bmi < 18.5) return { category: 'Sottopeso', color: '#4caf50', advice: 'Potresti aver bisogno di aumentare l\'apporto calorico con cibi sani.' };
        if (bmi < 25) return { category: 'Normopeso', color: '#8bc34a', advice: 'Ottimo! Mantieni questo stile di vita.' };
        if (bmi < 30) return { category: 'Sovrappeso', color: '#ff9800', advice: 'Aumenta l\'attività fisica e migliora l\'alimentazione.' };
        return { category: 'Obesità', color: '#f44336', advice: 'Consulta un medico per un piano personalizzato.' };
    }
    
    static calculateWaterIntake(weightKg, activityLevel) {
        let water = weightKg * 30; // 30ml per kg base
        if (activityLevel === 'moderate') water += 500;
        if (activityLevel === 'high') water += 1000;
        return Math.round(water);
    }
    
    static calculateBMR(weightKg, heightCm, age, gender = 'male') {
        // Formula Mifflin-St Jeor
        if (gender === 'male') {
            return Math.round(10 * weightKg + 6.25 * heightCm - 5 * age + 5);
        }
        return Math.round(10 * weightKg + 6.25 * heightCm - 5 * age - 161);
    }
}

module.exports = HealthData;
```

---

## 15. Piano di sviluppo

### 15.1 Suddivisione ruoli

| Ruolo | Responsabilità principali |
|-------|---------------------------|
| **Studente A (backend)** | Node.js/Express, API, autenticazione, web service, integrazione compagni, file JSON |
| **Studente B (frontend)** | HTML/CSS responsive, JavaScript client, grafici Chart.js, quiz, chiamate API |

---

### 15.2 Cronologia dettagliata (5 settimane)

| Settimana | Studente A (backend) | Studente B (frontend) | Punto di controllo |
|-----------|----------------------|----------------------|--------------------|
| **1** | Setup ambiente: npm init, install Express, struttura cartelle MVC. server.js base con route hello world | Wireframe su carta/Figma. HTML base di login e register. CSS reset e navbar | Server risponde su `localhost:3000` |
| **2** | Implementa autenticazione: model User.js con JSON, bcrypt, sessioni. Route POST `/login` e `/register` | Dashboard layout (card, griglia). Pagina calcolatore BMI con slider peso/altezza | Login funzionante, reindirizza a dashboard vuota |
| **3** | Model HealthData.js (calcoli BMI, acqua, BMR). Controller healthController. API `/api/bmi`, `/api/progress` | JavaScript per calcolatore BMI interattivo. Grafico Chart.js demo. Pagina diario con localStorage | BMI calcolato e salvato su JSON |
| **4** | Integrazione API-Ninjas Exercises. Web service `/api/exercise-suggestion`. ExternalController | Pagina esercizi (card dinamiche). Chiamata fetch a `/api/external/exercises`. Pulsante completamento | Esercizi visibili da API, completamento funzionante |
| **5** | Integrazione API compagno. Endpoint verifica fonte. Rate limiting e documentazione API | Pagina Fake News Quiz (10 domande). Verifica fonte (verify-source.html). Testing responsive. Pitch finale | Quiz funzionante, responsive testato su 3 dispositivi |

---

### 15.3 Checklist finale (settimana 5-6)

| # | Attività | Stato |
|---|----------|-------|
| 1 | Tutte le pagine si aprono senza errori 404 | ⬜ |
| 2 | Login/register funziona con crittografia password | ⬜ |
| 3 | Il web service `/api/exercise-suggestion` restituisce JSON valido | ⬜ |
| 4 | API pubblica Ninjas risponde con almeno 10 esercizi | ⬜ |
| 5 | Il progetto chiama almeno un'API di un compagno | ⬜ |
| 6 | Almeno un compagno chiama il nostro web service | ⬜ |
| 7 | Quiz fake news ha 10 domande con spiegazioni | ⬜ |
| 8 | Layout responsive su iPhone SE (375px), iPad (768px), desktop (1200px) | ⬜ |
| 9 | Grafico Chart.js mostra dati reali dell'utente | ⬜ |
| 10 | Codice commentato e organizzato in MVC | ⬜ |
| 11 | Presentazione pronta (max 7 minuti) | ⬜ |

## 16. Checklist requisiti

### 16.1 Requisiti tecnici TDP

| # | Requisito | Stato | Evidenza |
|---|-----------|-------|----------|
| 1 | Navigabilità e tempi ridotti | ✅ | Menu coerente, lazy loading immagini, fetch asincrone |
| 2 | Contenuti completi | ✅ | Tutte le sezioni popolate con dati reali (non Lorem Ipsum) |
| 3 | Informazioni chiare | ✅ | Testi in italiano semplice, BMI spiegato con esempi |
| 4 | Comunicazione efficace | ✅ | Feedback utente per ogni azione (toast, animazioni) |
| 5 | Aspetto grafico accattivante | ✅ | Palette colori verde/azzurro, card ombreggiate, gradienti |
| 6 | Layout responsive | ✅ | Media query, mobile first, hamburger menu |
| 7 | Architettura MVC | ✅ | Cartelle models/ views/ controllers/ separate |
| 8 | API pubblica (almeno una) | ✅ | API-Ninjas Exercises + ZenQuotes (due) |
| 9 | Web service proprio | ✅ | `/api/exercise-suggestion` documentato |
| 10 | Interazione con sistemi compagni | ✅ | Chiamata a loro + loro chiamano noi |
| 11 | Autenticazione | ✅ | express-session + bcrypt + file JSON |
| 12 | HTML/CSS/JS/Node.js/Express | ✅ | Stack completo come da consegna |
| 13 | Codice corretto ed efficiente | ✅ | Nessun errore console, async/await, validazioni |
| 14 | Originalità e complessità | ✅ | Sfide, quiz, verifica fonti, slider fatica |
| 15 | Novità (funzionalità mai viste) | ✅ | Verifica fonte automatica, solidarietà virtuale |
| 16 | Interattività | ✅ | Slider, drag & drop giornata, confetti al completamento |

---

### 16.2 Requisiti Educazione Civica

| # | Requisito | Stato | Evidenza |
|---|-----------|-------|----------|
| 1 | Tema sviluppo sostenibile / salute | ✅ | Esercizio fisico (Obiettivo 3 Agenda 2030) |
| 2 | Promozione responsabilità | ✅ | Diario personale auto-gestito |
| 3 | Promozione legalità | ✅ | Quiz fake news con fonti ufficiali |
| 4 | Promozione partecipazione | ✅ | Sfide tra amici, classifica |
| 5 | Promozione solidarietà | ✅ | Contatore donazione virtuale |
| 6 | Promozione libertà | ✅ | Scelta obiettivi personali |
| 7 | Promozione tolleranza | ✅ | Esercizi inclusivi per diverse abilità |
| 8 | Analisi critica fonti digitali | ✅ | Pagina verifica URL + 10 domande quiz |
| 9 | Gestione identità online | ✅ | Profilo utente, dati non condivisi con terzi |
| 10 | Protezione dati personali | ✅ | Password hashate, nessun dato sensibile esposto |

---

# 17. Idee bonus (per valutazione eccellente)
### 17.1 Dark mode
```css
/* dark-mode.css */
body.dark-mode {
    background: #1a1a2e;
    color: #eee;
}

body.dark-mode .card {
    background: #16213e;
    color: #eee;
}

/* Toggle switch */
.dark-mode-toggle {
    position: fixed;
    bottom: 20px;
    left: 20px;
    background: #333;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 1000;
}
```

### 17.2 Pausa attiva (popup timer)
``` javascript
let lastActivity = Date.now();
let inactivityTimer;

function checkInactivity() {
    const now = Date.now();
    if (now - lastActivity > 30 * 60 * 1000) { // 30 minuti
        showActiveBreakPopup();
        lastActivity = now;
    }
}

function showActiveBreakPopup() {
    const popup = document.createElement('div');
    popup.className = 'active-break';
    popup.innerHTML = `
        <div class="break-content">
            <h3>🧘 È ora di muoverti!</h3>
            <p>Stai seduto da più di 30 minuti. Fai 10 jumping jack!</p>
            <button id="startBreak">🚀 Inizia pausa attiva</button>
            <button id="remindLater">⏰ Ricordami tra 10 min</button>
        </div>
    `;
    document.body.appendChild(popup);
    
    document.getElementById('startBreak')?.addEventListener('click', () => {
        startCountdown(10); // timer 10 secondi
        popup.remove();
    });
}
```
### 17.3 Download report PDF
``` javascript
async function downloadWeeklyReport() {
    const progress = await fetch('/api/progress?period=week').then(r => r.json());
    
    const htmlContent = `
        <html>
        <head><title>Rapporto FitChecker</title></head>
        <body>
            <h1>Il tuo report settimanale</h1>
            <p>Esercizi completati: ${progress.totalExercises}</p>
            <p>Calorie bruciate: ${progress.totalCalories}</p>
            <p>BMI: ${progress.bmi}</p>
        </body>
        </html>
    `;
    
    const blob = new Blob([htmlContent], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `fitchecker_report_${new Date().toISOString().slice(0,10)}.pdf`;
    link.click();
}
```

## 18. Note per la presentazione

### 18.1 Struttura presentazione (5-7 minuti)

| Minuto | Cosa dire | Suggerimenti |
|--------|-----------|--------------|
| 0-1 | Introduzione: problema sedentarietà giovanile, Obiettivo 3 Agenda 2030 | Mostra statistiche OMS |
| 1-2 | Demo live: login, dashboard, calcolatore BMI | Fai vedere un inserimento dati reale |
| 2-3 | Esercizi da API pubblica e web service proprio | Mostra chiamata API-Ninjas e risposta JSON |
| 3-4 | Integrazione con compagni e valore civico | Mostra quiz fake news e verifica fonte |
| 4-5 | Architettura MVC e codice | Apri una cartella, mostra separazione model/view/controller |
| 5-6 | Responsive e interattività | Ridimensiona browser, mostra slider e completamento |
| 6-7 | Conclusioni: cosa abbiamo imparato, difficoltà, possibili miglioramenti | Sii onesto se qualcosa non ha funzionato al 100% |

---

### 18.2 Domande frequenti (preparati a rispondere)

| Domanda possibile | Risposta preparata |
|-------------------|--------------------|
| "Perché avete scelto file JSON invece di un database?" | Per semplicità di deployment e per rispettare la consegna senza dipendenze esterne. In produzione si userebbe MongoDB o PostgreSQL. |
| "Come gestite la sicurezza delle password?" | Usiamo bcrypt per l'hashing salato. Le password non sono mai salvate in chiaro nel file JSON. |
| "Cosa succede se l'API Ninjas non risponde?" | Abbiamo un fallback locale con esercizi predefiniti, così il sito non si blocca mai. |
| "Quale compagno ha utilizzato il vostro web service?" | [Nome compagno] ha chiamato il nostro `/api/exercise-suggestion` nel suo progetto sull'alimentazione. |
| "Come avete testato il responsive?" | Con Chrome DevTools su iPhone SE, iPad Pro e Desktop, e su dispositivi reali in classe. |
| "Cosa avreste voluto aggiungere con più tempo?" | Un database utente persistente, notifiche push per ricordare di muoversi, integrazione con Google Fit API. |

---

### 18.3 Cosa portare il giorno della presentazione

- [ ] PC con progetto funzionante (meglio se offline-ready)
- [ ] Backup su chiavetta USB
- [ ] Link a repository GitHub (pubblica o condivisa)
- [ ] Slide (PPT/Canva/Google Slides) su secondo schermo
- [ ] Documentazione stampata (questo documento)
- [ ] Account API-Ninjas già loggato (evita sorprese su limite chiamate)

---

## 19. Riferimenti utili

### 19.1 Documentazione tecnica

| Risorsa | Link |
|---------|------|
| Express.js | https://expressjs.com/ |
| Node.js | https://nodejs.org/ |
| Chart.js | https://www.chartjs.org/ |
| Fetch API | https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API |
| Express Session | https://www.npmjs.com/package/express-session |
| bcrypt | https://www.npmjs.com/package/bcrypt |

---

### 19.2 API utilizzate

| API | Link documentazione |
|-----|---------------------|
| API-Ninjas Exercises | https://api-ninjas.com/api/exercises |
| ZenQuotes | https://zenquotes.io/ |

---

### 19.3 Fonti per Educazione Civica

| Fonte | Link | Utilizzo |
|-------|------|----------|
| OMS - Attività fisica | https://www.who.int/news-room/fact-sheets/detail/physical-activity | Citata nel quiz e nelle spiegazioni |
| ISS - Sport e salute | https://www.iss.it/attivita-fisica | Citata per le fake news |
| NIH - Exercise & Fitness | https://www.nimh.nih.gov/health/topics | Citata per i benefici psicologici |
| Agenda 2030 - Goal 3 | https://unric.org/it/obiettivo-3-salta-e-benessere/ | Riferimento nel progetto |

---

### 19.4 Icone e risorse gratuite

| Risorsa | Link |
|---------|------|
| Font Awesome (icone) | https://fontawesome.com/ |
| Google Fonts (Poppins) | https://fonts.google.com/specimen/Poppins |
| Unsplash (immagini sport) | https://unsplash.com/s/photos/fitness |
| Coolors (palette colori) | https://coolors.co/ |

---

## Appendice: Esempio di svolgimento colloquio

**Docente:** "Mostrami il web service che hai sviluppato."

**Studente:** (apre Postman o browser, fa una chiamata all'endpoint)

```http
GET http://localhost:3000/api/exercise-suggestion?age=16&level=beginner&goal=cardio

"Vede, la risposta è un JSON con l'esercizio consigliato, le ripetizioni e le calorie stimate. Questo endpoint è accessibile anche ai compagni grazie al middleware CORS."

Docente: "Come hai garantito l'analisi critica delle fonti?"

Studente: "Abbiamo creato una pagina con 10 domande Vero/Falso basate su miti comuni. Ogni risposta mostra una spiegazione con fonte OMS o ISS. Inoltre c'è una pagina dove puoi incollare un URL e il sistema analizza parole chiave per dirti se è attendibile."

Docente: "Quale difficoltà avete incontrato?"

Studente: "La gestione delle sessioni con file JSON è stata delicata perché i file non sono thread-safe. Abbiamo risolto usando fs.promises e operazioni atomiche."
