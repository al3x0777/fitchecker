# FitChecker 

App per la salute e il benessere — esercizi fisici senza attrezzatura.

## Struttura MVC

```
fitchecker/
├── server.js              ← Entry point Express
├── model/
│   └── model.js           ← Model: accesso ai dati JSON
├── controller/
│   └── controller.js      ← Controller: logica delle route
├── views/
│   └── index.html         ← View: unica pagina HTML (SPA)
├── public/
│   ├── css/style.css      ← Stili
│   └── js/app.js          ← JavaScript client
└── data/
    ├── exercises.json     ← Dati esercizi
    └── users.json         ← Utenti registrati
```

## Installazione e avvio

```bash
# 1. Installa dipendenze
npm install

# 2. Avvia il server
npm start

# 3. Apri nel browser
http://localhost:3000
```

## API Endpoints

### Esercizi
| Metodo | URL | Descrizione |
|--------|-----|-------------|
| GET | `/api/exercises` | Tutti gli esercizi |
| GET | `/api/exercises?category=Forza` | Filtra per categoria |
| GET | `/api/exercises?search=squat` | Cerca per nome/muscolo |
| GET | `/api/exercises/:id` | Singolo esercizio |

### Autenticazione
| Metodo | URL | Descrizione |
|--------|-----|-------------|
| POST | `/api/auth/register` | Registra nuovo utente |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/me` | Utente corrente (sessione) |

### Preferiti (richiede login)
| Metodo | URL | Descrizione |
|--------|-----|-------------|
| GET | `/api/favorites` | Lista preferiti dell'utente |
| POST | `/api/favorites/:exerciseId` | Aggiungi/rimuovi preferito |

### Web Service pubblico (per i progetti dei compagni)
| Metodo | URL | Descrizione |
|--------|-----|-------------|
| GET | `/ws/exercises` | Tutti gli esercizi in formato JSON |
| GET | `/ws/exercises/muscle/:muscle` | Filtra per muscolo |

**Esempio:**
```
GET http://localhost:3000/ws/exercises
GET http://localhost:3000/ws/exercises/muscle/Gambe
```

## Account di test
- **username:** `admin`  
- **password:** `admin`

## Tecnologie usate
- **Backend:** Node.js + Express
- **Sessioni:** express-session
- **Database:** JSON file (exercises.json, users.json)
- **Frontend:** HTML5 + CSS3 + JavaScript vanilla
- **Font:** Syne + DM Sans (Google Fonts)
- **Architettura:** MVC (Model-View-Controller)
