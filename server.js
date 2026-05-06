require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Assicurati che le cartelle data esistano
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// File JSON iniziali se non esistono
const initDataFiles = () => {
    const files = ['users.json', 'health_logs.json', 'exercise_logs.json'];
    files.forEach(file => {
        const filePath = path.join(dataDir, file);
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, '[]');
        }
    });
};
initDataFiles();

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
        secure: false,
        maxAge: 1000 * 60 * 60 * 24
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

// ROTTE API
app.post('/login', authController.login);
app.post('/register', authController.register);
app.get('/logout', authController.logout);

app.post('/api/bmi', ensureAuthenticated, healthController.calculateAndSaveBMI);
app.get('/api/progress', ensureAuthenticated, healthController.getProgress);
app.post('/api/exercises/complete', ensureAuthenticated, healthController.completeExercise);
app.get('/api/diary', ensureAuthenticated, healthController.getDiary);
app.post('/api/diary', ensureAuthenticated, healthController.saveDiaryEntry);

// WEB SERVICE PROPRIO
app.get('/api/exercise-suggestion', apiController.getExerciseSuggestion);
app.get('/api/calorie-burn', apiController.getCalorieBurn);
app.get('/api/class-stats', apiController.getClassStats);

// API PUBBLICHE
app.get('/api/external/exercises', ensureAuthenticated, externalController.getExercises);
app.get('/api/external/quote', ensureAuthenticated, externalController.getQuote);

// VERIFICA FONTE
app.post('/api/verify-source', externalController.verifySource);

// SFIDE (endpoint base)
app.post('/api/challenge/create', ensureAuthenticated, (req, res) => {
    res.json({ success: true, challengeId: Date.now(), link: '/challenge?id=' + Date.now() });
});

app.get('/api/challenge/:id', ensureAuthenticated, (req, res) => {
    res.json({ success: true, challenge: { id: req.params.id, status: 'active' } });
});

// AVVIO SERVER
app.listen(PORT, () => {
    console.log(`🚀 FitChecker server in esecuzione su http://localhost:${PORT}`);
    console.log(`📋 API Ninjas Key: ${process.env.API_NINJAS_KEY ? 'Configurata' : 'NON configurata - usa fallback locale'}`);
});