/**
 * constants.js - Costanti globali
 */

// Costanti BMI
const BMI_CONSTANTS = {
    UNDERWEIGHT: {
        min: 0,
        max: 18.4,
        category: 'Sottopeso',
        color: '#4caf50',
        advice: 'Potresti aver bisogno di aumentare l\'apporto calorico con cibi sani.',
        emoji: '🍎'
    },
    NORMAL: {
        min: 18.5,
        max: 24.9,
        category: 'Normopeso',
        color: '#8bc34a',
        advice: 'Ottimo! Mantieni questo stile di vita sano.',
        emoji: '💪'
    },
    OVERWEIGHT: {
        min: 25,
        max: 29.9,
        category: 'Sovrappeso',
        color: '#ff9800',
        advice: 'Aumenta l\'attività fisica e migliora l\'alimentazione.',
        emoji: '🚶'
    },
    OBESE: {
        min: 30,
        max: 100,
        category: 'Obesità',
        color: '#f44336',
        advice: 'Consulta un medico per un piano personalizzato.',
        emoji: '🏥'
    }
};

// Fattori MET per diverse attività
const MET_VALUES = {
    running: 9.0,
    walking: 3.5,
    cycling: 7.5,
    swimming: 8.0,
    yoga: 3.0,
    strength: 6.0,
    stretching: 2.5,
    jumping_jacks: 8.0,
    squats: 5.0,
    pushups: 8.0,
    burpees: 10.0,
    dancing: 5.5,
    climbing: 7.0,
    rowing: 8.5,
    hiit: 12.0
};

// Fattori di attività per TDEE
const ACTIVITY_FACTORS = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9
};

// Descrizioni dei livelli di attività
const ACTIVITY_LEVELS = {
    sedentary: {
        name: 'Sedentario',
        description: 'Poco o nessun esercizio, lavoro d\'ufficio',
        multiplier: 1.2
    },
    light: {
        name: 'Leggeramente attivo',
        description: 'Esercizio leggero 1-3 giorni/settimana',
        multiplier: 1.375
    },
    moderate: {
        name: 'Moderatamente attivo',
        description: 'Esercizio moderato 3-5 giorni/settimana',
        multiplier: 1.55
    },
    active: {
        name: 'Attivo',
        description: 'Esercizio intenso 6-7 giorni/settimana',
        multiplier: 1.725
    },
    very_active: {
        name: 'Molto attivo',
        description: 'Lavoro fisico + esercizio intenso quotidiano',
        multiplier: 1.9
    }
};

// Tipi di esercizio
const EXERCISE_TYPES = {
    strength: {
        name: 'Forza',
        icon: '💪',
        color: '#FF9800'
    },
    cardio: {
        name: 'Cardio',
        icon: '🏃',
        color: '#F44336'
    },
    flexibility: {
        name: 'Flessibilità',
        icon: '🧘',
        color: '#4CAF50'
    },
    stretching: {
        name: 'Stretching',
        icon: '🤸',
        color: '#00BCD4'
    },
    balance: {
        name: 'Equilibrio',
        icon: '⚖️',
        color: '#9C27B0'
    }
};

// Livelli di difficoltà
const DIFFICULTY_LEVELS = {
    beginner: {
        name: 'Principiante',
        icon: '🌱',
        color: '#4CAF50'
    },
    intermediate: {
        name: 'Intermedio',
        icon: '📈',
        color: '#FF9800'
    },
    advanced: {
        name: 'Avanzato',
        icon: '🏆',
        color: '#F44336'
    }
};

// Muscoli target
const MUSCLE_TARGETS = {
    abdominals: { name: 'Addominali', icon: '🎯' },
    quadriceps: { name: 'Quadricipiti', icon: '🦵' },
    hamstrings: { name: 'Femorali', icon: '🦵' },
    glutes: { name: 'Glutei', icon: '🍑' },
    calves: { name: 'Polpacci', icon: '🦵' },
    chest: { name: 'Pettorali', icon: '💪' },
    shoulders: { name: 'Spalle', icon: '💪' },
    triceps: { name: 'Tricipiti', icon: '💪' },
    biceps: { name: 'Bicipiti', icon: '💪' },
    back: { name: 'Schiena', icon: '🔙' },
    lats: { name: 'Dorsali', icon: '🔙' },
    trapezius: { name: 'Trapezi', icon: '💪' },
    cardio: { name: 'Cardio', icon: '🏃' }
};

// Limiti per API (rate limiting)
const API_LIMITS = {
    EXERCISES_PER_DAY: 50,
    REQUESTS_PER_HOUR: 100,
    CACHE_DURATION: 3600000
};

// Obiettivi di fitness
const FITNESS_GOALS = {
    weight_loss: {
        name: 'Perdita di peso',
        icon: '⚖️',
        description: 'Focus su cardio e deficit calorico',
        suggested_activities: ['running', 'hiit', 'walking']
    },
    muscle_gain: {
        name: 'Aumento massa muscolare',
        icon: '💪',
        description: 'Focus su forza e ipertrofia',
        suggested_activities: ['strength', 'pushups', 'squats']
    },
    endurance: {
        name: 'Resistenza',
        icon: '🏃',
        description: 'Focus su attività prolungate',
        suggested_activities: ['running', 'cycling', 'swimming']
    },
    flexibility: {
        name: 'Flessibilità',
        icon: '🧘',
        description: 'Focus su stretching e mobilità',
        suggested_activities: ['yoga', 'stretching']
    },
    general: {
        name: 'Salute generale',
        icon: '❤️',
        description: 'Mix equilibrato di attività',
        suggested_activities: ['walking', 'strength', 'stretching']
    }
};

// Range di età raccomandati
const AGE_RANGES = {
    children: { min: 5, max: 12, daily_activity_minutes: 60 },
    adolescents: { min: 13, max: 17, daily_activity_minutes: 60 },
    young_adults: { min: 18, max: 35, daily_activity_minutes: 45 },
    adults: { min: 36, max: 60, daily_activity_minutes: 30 },
    seniors: { min: 61, max: 120, daily_activity_minutes: 25 }
};

// Calorie approssimative per esercizi comuni
const EXERCISE_CALORIES = {
    walking: 70,
    running: 120,
    cycling: 100,
    swimming: 110,
    yoga: 40,
    strength: 85,
    hiit: 140,
    dancing: 75,
    jumping_jacks: 95,
    squats: 80,
    pushups: 90,
    burpees: 130
};

// Fonti affidabili per verifica
const TRUSTED_SOURCES = {
    oms: { domain: 'who.int', name: 'Organizzazione Mondiale della Sanità', credibility: 100 },
    iss: { domain: 'iss.it', name: 'Istituto Superiore di Sanità', credibility: 100 },
    nih: { domain: 'nih.gov', name: 'National Institutes of Health', credibility: 100 },
    pubmed: { domain: 'pubmed.ncbi.nlm.nih.gov', name: 'PubMed', credibility: 100 },
    lancet: { domain: 'thelancet.com', name: 'The Lancet', credibility: 100 },
    bmj: { domain: 'bmj.com', name: 'British Medical Journal', credibility: 100 },
    cdc: { domain: 'cdc.gov', name: 'CDC', credibility: 95 },
    harvard: { domain: 'harvard.edu', name: 'Harvard University', credibility: 95 },
    mayoclinic: { domain: 'mayoclinic.org', name: 'Mayo Clinic', credibility: 95 },
    epicentro: { domain: 'epicentro.iss.it', name: 'EPICENTRO (ISS)', credibility: 100 }
};

// Parole sospette per fake news
const SUSPICIOUS_KEYWORDS = [
    'miracoloso', 'dimagrisci velocemente', 'segreto che nessuno ti dice',
    'rimedio naturale incredibile', 'scoperta rivoluzionaria', 'le aziende non vogliono che tu sappia',
    'guarigione immediata', 'perdere peso senza sforzo', 'elimina il grasso in 3 giorni',
    'cura definitiva', 'sistema segreto', 'preparazione antica', 'disintossicante miracoloso',
    'brucia grassi immediato', 'integrato e scientificamente provato', 'risultati garantiti',
    'fai questo e poi mangia quello che vuoi', 'svelato il metodo', 'incredibile ma vero'
];

// Messaggi motivazionali giornalieri
const MOTIVATIONAL_MESSAGES = [
    { message: "Ogni piccolo passo conta. Oggi è il giorno perfetto per iniziare!", icon: "🌟" },
    { message: "Non devi essere perfetto, devi solo essere costante.", icon: "💪" },
    { message: "Il tuo corpo può fare cose incredibili. Fagli solo provare!", icon: "🏃" },
    { message: "Il dolore è temporaneo, ma il risultato è per sempre.", icon: "🎯" },
    { message: "La tua salute è un investimento, non una spesa.", icon: "❤️" },
    { message: "Non aspettare la motivazione, creala muovendoti!", icon: "⚡" },
    { message: "Il 90% della battaglia è presentarsi. Sei già qui!", icon: "✨" },
    { message: "Ogni rep è un passo verso una versione migliore di te.", icon: "📈" },
    { message: "Il corpo raggiunge ciò che la mente crede.", icon: "🧠" },
    { message: "La costanza batte l'intensità. Sempre.", icon: "🔄" }
];

// Esporta per Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        BMI_CONSTANTS,
        MET_VALUES,
        ACTIVITY_FACTORS,
        ACTIVITY_LEVELS,
        EXERCISE_TYPES,
        DIFFICULTY_LEVELS,
        MUSCLE_TARGETS,
        API_LIMITS,
        FITNESS_GOALS,
        AGE_RANGES,
        EXERCISE_CALORIES,
        TRUSTED_SOURCES,
        SUSPICIOUS_KEYWORDS,
        MOTIVATIONAL_MESSAGES
    };
}

// Disponibile anche lato client
if (typeof window !== 'undefined') {
    window.BMI_CONSTANTS = BMI_CONSTANTS;
    window.MET_VALUES = MET_VALUES;
    window.ACTIVITY_FACTORS = ACTIVITY_FACTORS;
    window.EXERCISE_TYPES = EXERCISE_TYPES;
    window.DIFFICULTY_LEVELS = DIFFICULTY_LEVELS;
    window.MUSCLE_TARGETS = MUSCLE_TARGETS;
    window.FITNESS_GOALS = FITNESS_GOALS;
    window.EXERCISE_CALORIES = EXERCISE_CALORIES;
    window.TRUSTED_SOURCES = TRUSTED_SOURCES;
    window.SUSPICIOUS_KEYWORDS = SUSPICIOUS_KEYWORDS;
    window.MOTIVATIONAL_MESSAGES = MOTIVATIONAL_MESSAGES;
    
    window.getRandomMotivationalMessage = function() {
        const randomIndex = Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length);
        return MOTIVATIONAL_MESSAGES[randomIndex];
    };
    
    window.getBMICategoryFromValue = function(bmi) {
        if (bmi < BMI_CONSTANTS.UNDERWEIGHT.max) return BMI_CONSTANTS.UNDERWEIGHT;
        if (bmi <= BMI_CONSTANTS.NORMAL.max) return BMI_CONSTANTS.NORMAL;
        if (bmi <= BMI_CONSTANTS.OVERWEIGHT.max) return BMI_CONSTANTS.OVERWEIGHT;
        return BMI_CONSTANTS.OBESE;
    };
    
    window.getEstimatedCalories = function(exerciseType, minutes, weight = 70) {
        const caloriesPerMinute = (EXERCISE_CALORIES[exerciseType] || 70) / 10;
        return Math.round(caloriesPerMinute * minutes * (weight / 70));
    };
}