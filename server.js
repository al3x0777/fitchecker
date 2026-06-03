const express = require('express');
const session = require('express-session');
const path    = require('path');

const {
  ViewController, ExerciseController, AuthController,
  FavoriteController, CommentController, StatsController,
  WebServiceController, requireAuth
} = require('./controller/controller');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'fitchecker-secret-2024',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));

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

app.listen(PORT, () => console.log(`✅ FitChecker → http://localhost:${PORT}`));
