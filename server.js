const express = require('express');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// CORS - permetti cookies nelle richieste cross-origin
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// Sessione
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { 
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
        sameSite: 'lax'
    }
}));

// Import controller e middleware
const authController = require('./controllers/authController');
const { ensureAuthenticated } = require('./middleware/auth');
const exerciseController = require('./controllers/exerciseController');

// ========================
// ROTTE PAGINE
// ========================
app.get('/', (req, res) => {
    if (req.session.userId) {
        res.redirect('/dashboard');
    } else {
        res.redirect('/login');
    }
});

app.get('/login', (req, res) => {
    if (req.session.userId) {
        return res.redirect('/dashboard');
    }
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/register', (req, res) => {
    if (req.session.userId) {
        return res.redirect('/dashboard');
    }
    res.sendFile(path.join(__dirname, 'views', 'register.html'));
});

app.get('/dashboard', ensureAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'dashboard.html'));
});

app.get('/exercises', ensureAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'exercises.html'));
});

// ========================
// ROTTE API
// ========================
app.post('/api/register', authController.register);
app.post('/api/login', authController.login);
app.get('/api/logout', authController.logout);
app.get('/api/me', ensureAuthenticated, authController.getCurrentUser);
app.get('/api/exercises', exerciseController.getExercises);
app.get('/api/exercises/:id', exerciseController.getExerciseById);
app.get('/api/muscles', exerciseController.getMuscles);
app.get('/api/difficulties', exerciseController.getDifficulties);
app.get('/api/types', exerciseController.getTypes);

// ========================
// AVVIO SERVER
// ========================
app.listen(PORT, () => {
    console.log(`
    Server avviato!
    http://localhost:${PORT}
    Login: http://localhost:${PORT}/login
    `);
});