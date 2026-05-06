const fetch = require('node-fetch');
const constants = require('../utils/constants');

class ExternalAPI {
    static localExercises = [
        { name: "Squat", type: "strength", muscle: "quadriceps", difficulty: "beginner", equipment: "body only", instructions: "Stand with feet shoulder-width apart. Lower your body as if sitting back into a chair." },
        { name: "Push-up", type: "strength", muscle: "chest", difficulty: "beginner", equipment: "body only", instructions: "Start in a plank position. Lower your body until your chest nearly touches the floor." },
        { name: "Lunge", type: "strength", muscle: "glutes", difficulty: "beginner", equipment: "body only", instructions: "Step forward with one leg and lower your hips until both knees are bent at 90 degrees." },
        { name: "Plank", type: "strength", muscle: "abdominals", difficulty: "beginner", equipment: "body only", instructions: "Hold a push-up position with your body in a straight line." },
        { name: "Jumping Jacks", type: "cardio", muscle: "cardio", difficulty: "beginner", equipment: "body only", instructions: "Jump while spreading arms and legs, then return to starting position." },
        { name: "Burpees", type: "strength", muscle: "cardio", difficulty: "intermediate", equipment: "body only", instructions: "Drop into a squat, kick feet back into plank, return to squat, jump up." },
        { name: "Mountain Climbers", type: "cardio", muscle: "cardio", difficulty: "intermediate", equipment: "body only", instructions: "From plank position, alternate bringing knees to chest quickly." }
    ];
    
    static async getExercises(muscle = 'cardio', difficulty = 'beginner', limit = 12) {
        try {
            const apiKey = process.env.API_NINJAS_KEY;
            if (!apiKey) {
                console.log('API Ninjas key non configurata, uso fallback locale');
                return this.getLocalExercisesFiltered(muscle, difficulty, limit);
            }
            
            let url = `https://api.api-ninjas.com/v1/exercises?difficulty=${difficulty}`;
            if (muscle && muscle !== 'all') {
                url += `&muscle=${muscle}`;
            }
            
            const response = await fetch(url, {
                headers: { 'X-Api-Key': apiKey }
            });
            
            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }
            
            let exercises = await response.json();
            exercises = exercises.slice(0, limit);
            
            if (exercises.length === 0) {
                return this.getLocalExercisesFiltered(muscle, difficulty, limit);
            }
            
            return exercises;
        } catch (error) {
            console.error('Errore API Ninjas:', error.message);
            return this.getLocalExercisesFiltered(muscle, difficulty, limit);
        }
    }
    
    static getLocalExercisesFiltered(muscle, difficulty, limit) {
        let filtered = this.localExercises;
        
        if (muscle && muscle !== 'all') {
            filtered = filtered.filter(e => e.muscle === muscle);
        }
        
        if (difficulty && difficulty !== 'all') {
            filtered = filtered.filter(e => e.difficulty === difficulty);
        }
        
        return filtered.slice(0, limit);
    }
    
    static isTrustedSource(url) {
        for (const [key, source] of Object.entries(constants.TRUSTED_SOURCES)) {
            if (url.toLowerCase().includes(source.domain)) {
                return { trusted: true, source: source.name, credibility: source.credibility };
            }
        }
        return { trusted: false, source: null, credibility: 0 };
    }
    
    static containsSuspiciousKeywords(text) {
        const found = [];
        for (const keyword of constants.SUSPICIOUS_KEYWORDS) {
            if (text.toLowerCase().includes(keyword.toLowerCase())) {
                found.push(keyword);
            }
        }
        return found;
    }
    
    static getRandomMotivationalMessage() {
        const messages = constants.MOTIVATIONAL_MESSAGES;
        const randomIndex = Math.floor(Math.random() * messages.length);
        return messages[randomIndex];
    }
    
    static async getMotivationalQuote() {
        try {
            const response = await fetch('https://zenquotes.io/api/random');
            const data = await response.json();
            return {
                quote: data[0].q,
                author: data[0].a,
                success: true
            };
        } catch (error) {
            const fallback = this.getRandomMotivationalMessage();
            return { 
                quote: fallback.message, 
                author: "FitChecker",
                success: false 
            };
        }
    }
    
    static getDailyActivityRecommendation(age) {
        let range = null;
        for (const [key, value] of Object.entries(constants.AGE_RANGES)) {
            if (age >= value.min && age <= value.max) {
                range = { key, ...value };
                break;
            }
        }
        
        if (!range) {
            range = constants.AGE_RANGES.adults;
        }
        
        return {
            recommended_minutes: range.daily_activity_minutes,
            age_group: range.key,
            message: `Per la tua età (${age} anni), si raccomandano almeno ${range.daily_activity_minutes} minuti di attività fisica al giorno.`
        };
    }
}

module.exports = ExternalAPI;