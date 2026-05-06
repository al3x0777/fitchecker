const ExternalAPI = require('../models/ExternalAPI');
const constants = require('../utils/constants');

exports.getExercises = async (req, res) => {
    const { muscle = 'cardio', difficulty = 'beginner', limit = 12 } = req.query;
    
    try {
        const exercises = await ExternalAPI.getExercises(muscle, difficulty, parseInt(limit));
        
        const enrichedExercises = exercises.map(ex => ({
            ...ex,
            type_data: constants.EXERCISE_TYPES[ex.type] || constants.EXERCISE_TYPES.strength,
            difficulty_data: constants.DIFFICULTY_LEVELS[ex.difficulty] || constants.DIFFICULTY_LEVELS.beginner,
            muscle_data: constants.MUSCLE_TARGETS[ex.muscle] || { name: ex.muscle || 'Generale', icon: '💪' }
        }));
        
        res.json({
            success: true,
            count: enrichedExercises.length,
            exercises: enrichedExercises,
            source: exercises.length > 0 && exercises[0].instructions ? 'api-ninjas' : 'local'
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: 'Errore nel recupero degli esercizi',
            exercises: ExternalAPI.getLocalExercisesFiltered(muscle, difficulty, 12)
        });
    }
};

exports.getQuote = async (req, res) => {
    const quote = await ExternalAPI.getMotivationalQuote();
    res.json(quote);
};

exports.verifySource = async (req, res) => {
    const { url } = req.body;
    
    if (!url) {
        return res.status(400).json({ error: 'URL obbligatorio' });
    }
    
    let score = 0;
    let trustReason = [];
    let suspicionReason = [];
    
    for (const [key, source] of Object.entries(constants.TRUSTED_SOURCES)) {
        if (url.toLowerCase().includes(source.domain)) {
            score += source.credibility * 0.7;
            trustReason.push(`Fonte attendibile: ${source.name} (credibilità: ${source.credibility}%)`);
        }
    }
    
    for (const keyword of constants.SUSPICIOUS_KEYWORDS) {
        if (url.toLowerCase().includes(keyword.toLowerCase())) {
            score -= 25;
            suspicionReason.push(`Contiene linguaggio sospetto: "${keyword}"`);
        }
    }
    
    if (url.startsWith('https://')) {
        score += 10;
        trustReason.push('Connessione sicura (HTTPS)');
    }
    
    score = Math.min(100, Math.max(0, Math.round(score)));
    
    let recommendation = '';
    if (score >= 70) {
        recommendation = "✅ Fonte affidabile. Puoi fidarti di queste informazioni.";
    } else if (score >= 40) {
        recommendation = "⚠️ Fonte parzialmente affidabile. Verifica con più fonti ufficiali.";
    } else {
        recommendation = "❓ Bassa affidabilità. Cerca conferma su siti istituzionali come OMS o ISS.";
    }
    
    res.json({
        url,
        score,
        trustReason,
        suspicionReason,
        recommendation,
        tip: "Per verificare un articolo, controlla sempre: autore, data, fonti citate e dominio del sito"
    });
};