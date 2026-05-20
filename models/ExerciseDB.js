const fs = require('fs').promises;
const path = require('path');

const EXERCISES_FILE = path.join(__dirname, '../data/exercises.json');

// Database iniziale di esercizi (se il file non esiste)
const defaultExercises = [
    {
        id: 1,
        name: "Pull-up",
        muscles: ["dorsali", "bicipiti", "spalle"],
        difficulty: "avanzato",
        type: "trazione",
        instructions: "Impugnatura prona, mani larghe spalle. Sali fino a mento sopra la sbarra, scendi controllando.",
        tips: "Se non riesci, usa elastico o salto assistito"
    },
    {
        id: 2,
        name: "Push-up",
        muscles: ["petto", "tricipiti", "spalle"],
        difficulty: "principiante",
        type: "spinta",
        instructions: "Mani a terra allargate, corpo dritto. Scendi fino a petto vicino al suolo, risali.",
        tips: "Variante facile: ginocchia a terra"
    },
    {
        id: 3,
        name: "Squat",
        muscles: ["quadricipiti", "glutei", "femoriali"],
        difficulty: "principiante",
        type: "gambe",
        instructions: "Piedi larghi spalle, schiena dritta. Scendi come per sederti, risali.",
        tips: "Mantieni talloni a terra"
    },
    {
        id: 4,
        name: "Dip",
        muscles: ["tricipiti", "petto", "spalle"],
        difficulty: "intermedio",
        type: "spinta",
        instructions: "Su parallele, scendi fino a gomiti a 90°, risali.",
        tips: "Non scendere troppo per evitare infortuni alle spalle"
    },
    {
        id: 5,
        name: "Leg Raise",
        muscles: ["addominali", "flessori anca"],
        difficulty: "principiante",
        type: "core",
        instructions: "Sdraiato, gambe tese. Solleva a 90°, scendi senza toccare terra.",
        tips: "Mani sotto glutei per stabilità"
    },
    {
        id: 6,
        name: "Australian Pull-up",
        muscles: ["dorsali", "bicipiti", "traps"],
        difficulty: "principiante",
        type: "trazione",
        instructions: "Sotto una sbarra bassa, corpo inclinato. Tira il petto alla sbarra.",
        tips: "Più sei orizzontale, più è difficile"
    },
    {
        id: 7,
        name: "Pike Push-up",
        muscles: ["spalle", "tricipiti"],
        difficulty: "intermedio",
        type: "spinta",
        instructions: "A V rovesciata, testa verso terra, spingi su.",
        tips: "Prepara per handstand push-up"
    },
    {
        id: 8,
        name: "Lunges",
        muscles: ["quadricipiti", "glutei", "femorali"],
        difficulty: "principiante",
        type: "gambe",
        instructions: "Affondo in avanti, ginocchio posteriore tocca terra, risali.",
        tips: "Mantieni busto dritto"
    },
    {
        id: 9,
        name: "Plank",
        muscles: ["addominali", "core", "spalle"],
        difficulty: "principiante",
        type: "core",
        instructions: "Posizione push-up, corpo dritto. Mantieni 30-60 secondi.",
        tips: "Non inarcare la schiena"
    },
    {
        id: 10,
        name: "Handstand Push-up",
        muscles: ["spalle", "tricipiti", "traps"],
        difficulty: "avanzato",
        type: "spinta",
        instructions: "A testa in giù, scendi fino a testa tocca terra, spingi su.",
        tips: "Inizia contro un muro"
    },
    {
        id: 11,
        name: "Muscle-up",
        muscles: ["dorsali", "petto", "tricipiti", "spalle"],
        difficulty: "avanzato",
        type: "trazione",
        instructions: "Pull-up esplosivo + transizione + dip.",
        tips: "Richiede forza esplosiva"
    },
    {
        id: 12,
        name: "Bulgarian Split Squat",
        muscles: ["quadricipiti", "glutei"],
        difficulty: "intermedio",
        type: "gambe",
        instructions: "Piede posteriore su rialzo, affondo, scendi.",
        tips: "Ottimo per stabilità"
    },
    {
        id: 13,
        name: "L-sit",
        muscles: ["addominali", "flessori anca", "tricipiti"],
        difficulty: "intermedio",
        type: "core",
        instructions: "Seduto, gambe tese sollevate, mani a terra, solleva glutei.",
        tips: "Inizia con gambe piegate"
    },
    {
        id: 14,
        name: "Glute Bridge",
        muscles: ["glutei", "femorali", "core"],
        difficulty: "principiante",
        type: "gambe",
        instructions: "Sdraiato, ginocchia piegate, solleva bacino.",
        tips: "Stringi glutei in alto"
    },
    {
        id: 15,
        name: "Triceps Extension",
        muscles: ["tricipiti"],
        difficulty: "principiante",
        type: "spinta",
        instructions: "Su parallele o sedia, scendi con gomiti indietro, risali.",
        tips: "Isola i tricipiti"
    }
];

class ExerciseDB {
    static async getFile() {
        try {
            const data = await fs.readFile(EXERCISES_FILE, 'utf8');
            if (data && data.trim() !== '') {
                return JSON.parse(data);
            }
            return [...defaultExercises];
        } catch (error) {
            // File non esiste, crealo con default
            await fs.writeFile(EXERCISES_FILE, JSON.stringify(defaultExercises, null, 2));
            return [...defaultExercises];
        }
    }

    static async getAll() {
        return await this.getFile();
    }

    static async getById(id) {
        const exercises = await this.getFile();
        return exercises.find(e => e.id === parseInt(id));
    }

    static async getByMuscle(muscle) {
        const exercises = await this.getFile();
        return exercises.filter(e => e.muscles.includes(muscle.toLowerCase()));
    }

    static async getByDifficulty(difficulty) {
        const exercises = await this.getFile();
        return exercises.filter(e => e.difficulty === difficulty.toLowerCase());
    }

    static async getByType(type) {
        const exercises = await this.getFile();
        return exercises.filter(e => e.type === type.toLowerCase());
    }
}

module.exports = ExerciseDB;