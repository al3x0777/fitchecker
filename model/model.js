// MODEL — gestisce i dati (lettura/scrittura JSON)
const fs = require('fs');
const path = require('path');
const crypto = require('crypto'); //per fare l'hash delle password

const EXERCISES_PATH = path.join(__dirname, '../data/exercises.json');
const USERS_PATH     = path.join(__dirname, '../data/users.json');

function readJSON(p)      { return JSON.parse(fs.readFileSync(p, 'utf8')); } //legge json e lo trasforma in oggetto JS
function writeJSON(p, d)  { fs.writeFileSync(p, JSON.stringify(d, null, 2), 'utf8'); } //salva l'oggetto JS come json, con indentazione di 2 spazi nel file specificato
function hashPwd(pw)      { return crypto.createHash('sha256').update(pw).digest('hex'); } //trasforma password in hash

/* ——— ESERCIZI ——— */
const ExerciseModel = {
  getAll()          { return readJSON(EXERCISES_PATH); },
  getById(id)       { return readJSON(EXERCISES_PATH).find(e => e.id === parseInt(id)); },
  getByMuscleGroup(g) { return readJSON(EXERCISES_PATH).filter(e => e.muscleGroup === g); },
  getMuscleGroups() { return [...new Set(readJSON(EXERCISES_PATH).map(e => e.muscleGroup))]; },
  search(q) {
    const ql = q.toLowerCase();
    return readJSON(EXERCISES_PATH).filter(e =>
      e.name.toLowerCase().includes(ql) ||
      e.muscle.toLowerCase().includes(ql) ||
      e.muscleGroup.toLowerCase().includes(ql)
    );
  }
};

/* ——— UTENTI ——— */
const UserModel = {
  getByUsername(username) { return readJSON(USERS_PATH).find(u => u.username === username); },
  getById(id)             { return readJSON(USERS_PATH).find(u => u.id === parseInt(id)); },

  register(username, password) {
    const users = readJSON(USERS_PATH);
    if (users.find(u => u.username === username)) return { error: 'Username già in uso' };
    const nu = {
      id: users.length ? Math.max(...users.map(u => u.id)) + 1 : 1,
      username, password: hashPwd(password),
      favorites: [], comments: {}, completedSets: {}
    };
    users.push(nu);
    writeJSON(USERS_PATH, users);
    return { success: true, user: { id: nu.id, username: nu.username, favorites: nu.favorites, comments: nu.comments } };
  },

  authenticate(username, password) {
    const u = readJSON(USERS_PATH).find(u => u.username === username);
    if (!u || u.password !== hashPwd(password)) return null;
    return { id: u.id, username: u.username, favorites: u.favorites, comments: u.comments || {} };
  },

  toggleFavorite(userId, exerciseId) {
    const users = readJSON(USERS_PATH);
    const u = users.find(u => u.id === parseInt(userId));
    if (!u) return null;
    const idx = u.favorites.indexOf(parseInt(exerciseId));
    // Se l'esercizio non è nei preferiti, lo aggiungo; altrimenti lo rimuovo
    idx === -1 ? u.favorites.push(parseInt(exerciseId)) : u.favorites.splice(idx, 1);
    writeJSON(USERS_PATH, users);
    return u.favorites;
  },

  getFavorites(userId) {
    // Legge l'utente e restituisce gli esercizi che ha nei preferiti
    const u = readJSON(USERS_PATH).find(u => u.id === parseInt(userId));
    if (!u) return [];
    return readJSON(EXERCISES_PATH).filter(e => u.favorites.includes(e.id));
  },

  setComment(userId, exerciseId, text) {
    const users = readJSON(USERS_PATH);
    const u = users.find(u => u.id === parseInt(userId));
    if (!u) return null;
    if (!u.comments) u.comments = {};
    // Se il testo è vuoto, rimuovo il commento; altrimenti lo aggiorno o creo
    if (text.trim() === '') {
      delete u.comments[exerciseId];
    } else {
      u.comments[exerciseId] = { text: text.trim(), updatedAt: new Date().toISOString() };
    }
    writeJSON(USERS_PATH, users);
    return u.comments;
  },

  getStats(userId) {
    const u = readJSON(USERS_PATH).find(u => u.id === parseInt(userId));
    if (!u) return null;
    const exercises = readJSON(EXERCISES_PATH);
    const favExs = exercises.filter(e => u.favorites.includes(e.id));
    const groupCount = {};
    favExs.forEach(e => { groupCount[e.muscleGroup] = (groupCount[e.muscleGroup] || 0) + 1; });
    return {
      totalFavorites: u.favorites.length,
      totalComments:  Object.keys(u.comments || {}).length,
      muscleGroups: groupCount,
      topGroup: Object.entries(groupCount).sort((a,b) => b[1]-a[1])[0]?.[0] || '—'
    };
  }
};

//pubblica i due oggetti così che controller.js possa importarli 
// con require('../model/model'). Il ciclo si chiude.
module.exports = { ExerciseModel, UserModel };
