// CONTROLLER — gestisce le richieste e coordina Model ↔ View
const { ExerciseModel, UserModel } = require('../model/model'); //importo i model

//Funzione che invia il file index.html quando viene richiesta la home page
const ViewController = {
  home(req, res) { res.sendFile('index.html', { root: './views' }); }
};

//Controller per gestire le richieste relative agli esercizi
const ExerciseController = {
  getAll(req, res) {
    const { muscleGroup, search } = req.query; //req.query contiene parametri nell'url dopo ?
    let data;
    if (search)      data = ExerciseModel.search(search);
    else if (muscleGroup) data = ExerciseModel.getByMuscleGroup(muscleGroup);
    else             data = ExerciseModel.getAll();
    res.json({ success: true, data });
  },
  getById(req, res) {
    const ex = ExerciseModel.getById(req.params.id);
    if (!ex) return res.status(404).json({ success: false, error: 'Non trovato' });
    res.json({ success: true, data: ex });
  },
  getMuscleGroups(req, res) {
    res.json({ success: true, data: ExerciseModel.getMuscleGroups() });
  }
};

//Controller per gestire le richieste relative all'autenticazione e alla gestione degli utenti
const AuthController = {
  login(req, res) {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ success: false, error: 'Dati mancanti' });
    const user = UserModel.authenticate(username, password);
    if (!user) return res.status(401).json({ success: false, error: 'Credenziali non valide' });
    req.session.user = user;
    res.json({ success: true, user });
  },
  register(req, res) {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ success: false, error: 'Dati mancanti' });
    if (password.length < 4)   return res.status(400).json({ success: false, error: 'Password troppo corta (min 4 caratteri)' });
    const result = UserModel.register(username, password);
    if (result.error) return res.status(409).json({ success: false, error: result.error });
    req.session.user = result.user;
    res.json({ success: true, user: result.user });
  },
  logout(req, res) { req.session.destroy(); res.json({ success: true }); },
  me(req, res) {
    if (!req.session.user) return res.status(401).json({ success: false, error: 'Non autenticato' });
    res.json({ success: true, user: req.session.user });
  }
};

//Controller per gestire le richieste relative ai preferiti degli utenti
const FavoriteController = {
  toggle(req, res) {
    if (!req.session.user) return res.status(401).json({ success: false, error: 'Devi essere loggato' });
    const favorites = UserModel.toggleFavorite(req.session.user.id, req.params.exerciseId);
    req.session.user.favorites = favorites;
    res.json({ success: true, favorites });
  },
  getAll(req, res) {
    if (!req.session.user) return res.status(401).json({ success: false, error: 'Devi essere loggato' });
    res.json({ success: true, data: UserModel.getFavorites(req.session.user.id) });
  }
};

//Controller per gestire le richieste relative ai commenti degli utenti sugli esercizi
const CommentController = {
  set(req, res) {
    if (!req.session.user) return res.status(401).json({ success: false, error: 'Devi essere loggato' });
    const { text } = req.body;
    const comments = UserModel.setComment(req.session.user.id, req.params.exerciseId, text || '');
    req.session.user.comments = comments;
    res.json({ success: true, comments });
  },
  get(req, res) {
    if (!req.session.user) return res.status(401).json({ success: false, error: 'Devi essere loggato' });
    const comments = req.session.user.comments || {};
    const c = comments[req.params.exerciseId];
    res.json({ success: true, comment: c || null });
  }
};

//Controller per gestire le richieste relative alle statistiche degli utenti
const StatsController = {
  get(req, res) {
    if (!req.session.user) return res.status(401).json({ success: false, error: 'Devi essere loggato' });
    const stats = UserModel.getStats(req.session.user.id);
    res.json({ success: true, data: stats });
  }
};

//Controller per gestire le richieste relative al web service pubblico
const WebServiceController = {
  publicExercises(req, res) {
    res.json({ service: 'FitChecker WebService', version: '1.0', data: ExerciseModel.getAll() });
  },
  byMuscle(req, res) {
    const data = ExerciseModel.getByMuscleGroup(req.params.muscle);
    res.json({ success: true, muscle: req.params.muscle, data });
  }
};

//Middleware per verificare se l'utente è autenticato prima di accedere a certe rotte
//next --> se l'utente è autenticato, passo al controller successivo, altrimenti rispondo con un errore 401
function requireAuth(req, res, next) {
  if (!req.session.user) return res.status(401).json({ success: false, error: 'Autenticazione richiesta' });
  next();
}

module.exports = {
  ViewController, ExerciseController, AuthController,
  FavoriteController, CommentController, StatsController,
  WebServiceController, requireAuth
};
