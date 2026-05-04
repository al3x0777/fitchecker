// server.js - Versione con file HTML separati

const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// ========================
// ROTTE PAGINE (VIEWS)
// ========================

// Home
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Login
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

// Register
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'register.html'));
});

// Dashboard (protetta - per ora accessibile a tutti)
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'dashboard.html'));
});

// Logout
app.get('/logout', (req, res) => {
    res.send('<h1>Logout effettuato</h1><a href="/">Torna alla home</a>');
});

// ========================
// ROTTE API (POST)
// ========================

// Login POST
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    console.log(`Tentativo login: ${username}`);
    
    // PER ORA: accetta sempre
    res.redirect('/dashboard');
});

// Register POST
app.post('/register', (req, res) => {
    const { username, email, password } = req.body;
    console.log(`Nuova registrazione: ${username} (${email})`);
    
    res.redirect('/login');
});

// ========================
// WEB SERVICE (API)
// ========================

app.get('/api/hello', (req, res) => {
    res.json({ 
        message: "API Funzionante!",
        timestamp: new Date().toISOString(),
        version: "1.0.0"
    });
});

// ========================
// AVVIO SERVER
// ========================

app.listen(PORT, () => {
    console.log(`
    🚀 FitChecker server avviato!
    📍 http://localhost:${PORT}
    📁 Views: ${path.join(__dirname, 'views')}
    🎨 CSS: http://localhost:${PORT}/css/style.css
    ✅ API test: http://localhost:${PORT}/api/hello
    `);
});