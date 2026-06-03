const express = require('express');
const session = require('express-session');
const path    = require('path');

const {
  ViewController, ExerciseController, AuthController,
  FavoriteController, CommentController, StatsController,
  WebServiceController, requireAuth
} = require('./controller/controller');
//è un require che importa tutti i controller definiti alla fine di controller/controller.js,
//rendendoli disponibili per l'uso nell'applicazione Express.
//è come fare tanti require singoli per ogni controller, ma in modo più organizzato e centralizzato.

const app  = express();
const PORT = process.env.PORT || 3000;

//middleware per gestire le richieste, le sessioni e i dati JSON
app.use(express.json()); //legge il corpo delle richieste in formato JSON e lo trasforma in un oggetto JS
app.use(express.urlencoded({ extended: true })); //legge il corpo delle richieste in formato URL-encoded (come i form HTML) e lo trasforma in un oggetto JS
app.use(express.static(path.join(__dirname, 'public'))); //serve i file statici da public

//Quando fai login, il server crea una "sessione" e genera un cookie con un codice identificativo, che spedisce al browser.
app.use(session({
  secret: 'fitchecker-secret-2024', //chiave segreta per firmare i cookie
  resave: false, //non salva la sessione se non è stata modificata
  saveUninitialized: false, //non crea la sessione per i visitatori non autenticati
  cookie: { maxAge: 1000 * 60 * 60 * 24 } //durata del cookie (1 giorno)
}));


// Definizione delle rotte
//Associa ogni rotta a un controller specifico
// View
app.get('/', ViewController.home);

// Esercizi
app.get('/api/exercises',             ExerciseController.getAll);
app.get('/api/exercises/musclegroups',ExerciseController.getMuscleGroups);
app.get('/api/exercises/:id',         ExerciseController.getById);

// Auth
app.post('/api/auth/login',    AuthController.login);
app.post('/api/auth/register', AuthController.register);
app.post('/api/auth/logout',   AuthController.logout);
app.get('/api/auth/me',        AuthController.me);

// Preferiti
//eseguo prima requireAuth per verificare se l'utente è autenticato, e solo se lo è, eseguo il controller che gestisce la richiesta
app.get('/api/favorites',              requireAuth, FavoriteController.getAll);
app.post('/api/favorites/:exerciseId', requireAuth, FavoriteController.toggle);

// Commenti
app.get('/api/comments/:exerciseId',  requireAuth, CommentController.get);
app.post('/api/comments/:exerciseId', requireAuth, CommentController.set);

// Statistiche
app.get('/api/stats', requireAuth, StatsController.get);

// Web Service pubblico
app.get('/ws/exercises',               WebServiceController.publicExercises);
app.get('/ws/exercises/muscle/:muscle',WebServiceController.byMuscle);

app.listen(PORT, () => console.log(`FitChecker → http://localhost:${PORT}`));
