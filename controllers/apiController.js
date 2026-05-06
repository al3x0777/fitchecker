const constants = require('../utils/constants');
const ExerciseLog = require('../models/ExerciseLog');

exports.getExerciseSuggestion = (req, res) => {
    const { age, level, goal } = req.query;
    
    if (!age) {
        return res.status(400).json({ 
            success: false, 
            error: 'Il parametro age è obbligatorio' 
        });
    }
    
    const difficultyData = constants.DIFFICULTY_LEVELS[level] || constants.DIFFICULTY_LEVELS.beginner;
    const goalData = constants.FITNESS_GOALS[goal] || constants.FITNESS_GOALS.general;
    
    const exercisesDB = {
        beginner: {
            weight_loss: { name: "Walking", reps: "30 min", calories: 120, instructions: "Cammina a passo svelto per 30 minuti", type: "cardio" },
            muscle_gain: { name: "Bodyweight Squat", reps: "3x12", calories: 85, instructions: "Esegui squat mantenendo la schiena dritta", type: "strength" },
            endurance: { name: "Jumping Jacks", reps: "30 sec on/15 off", calories: 100, instructions: "Alterna 30 secondi di jumping jack e 15 di riposo", type: "cardio" },
            flexibility: { name: "Cat-Cow Stretch", reps: "10 reps", calories: 30, instructions: "Movimenti fluidi della colonna vertebrale", type: "flexibility" },
            general: { name: "Bodyweight Squat", reps: "3x12", calories: 85, instructions: "Esegui squat mantenendo la schiena dritta", type: "strength" }
        },
        intermediate: {
            weight_loss: { name: "Burpees", reps: "3x10", calories: 150, instructions: "Squat, plank, salto - movimento completo", type: "cardio" },
            muscle_gain: { name: "Lunges", reps: "3x12 per leg", calories: 110, instructions: "Affondi alternati mantenendo il busto eretto", type: "strength" },
            endurance: { name: "Mountain Climbers", reps: "30 sec", calories: 130, instructions: "Alterna le ginocchia al petto velocemente", type: "cardio" },
            flexibility: { name: "Downward Dog", reps: "Hold 30 sec", calories: 25, instructions: "Allunga la schiena e le gambe", type: "flexibility" },
            general: { name: "Push-up", reps: "3x12", calories: 95, instructions: "Mantieni la schiena dritta e il core attivo", type: "strength" }
        },
        advanced: {
            weight_loss: { name: "Box Jumps", reps: "3x15", calories: 180, instructions: "Salta su una piattaforma stabile", type: "cardio" },
            muscle_gain: { name: "Pistol Squats", reps: "3x8 per leg", calories: 140, instructions: "Squat su una gamba sola", type: "strength" },
            endurance: { name: "Battle Ropes", reps: "45 sec", calories: 160, instructions: "Onde alternate con le corde", type: "cardio" },
            flexibility: { name: "Pigeon Pose", reps: "Hold 1 min", calories: 20, instructions: "Stretching profondo dei flessori dell'anca", type: "flexibility" },
            general: { name: "Pull-ups", reps: "3x10", calories: 110, instructions: "Trazioni alla sbarra", type: "strength" }
        }
    };
    
    const selectedLevel = level || 'general';
    const selectedGoal = goal || 'general';
    const exercise = exercisesDB[selectedLevel]?.[selectedGoal] || exercisesDB.beginner.general;
    
    const ageFactor = age < 18 ? 0.95 : 1.0;
    const adjustedCalories = Math.round(exercise.calories * ageFactor);
    
    const exerciseType = constants.EXERCISE_TYPES[exercise.type] || constants.EXERCISE_TYPES.strength;
    
    res.json({
        success: true,
        data: {
            exercise: exercise.name,
            type: exerciseType.name,
            type_icon: exerciseType.icon,
            difficulty: difficultyData.name,
            difficulty_icon: difficultyData.icon,
            goal: goalData.name,
            goal_icon: goalData.icon,
            duration_minutes: 15,
            repetitions: exercise.reps,
            rest_seconds: 45,
            calories_estimate: adjustedCalories,
            instructions: exercise.instructions,
            safety_tip: "Ascolta il tuo corpo, non forzare mai fino al dolore",
            alternative: exercise.name === "Push-up" ? "Push-up sulle ginocchia" : "Versione più facile disponibile"
        }
    });
};

exports.getCalorieBurn = (req, res) => {
    const { activity, minutes, weight } = req.query;
    
    const met = constants.MET_VALUES[activity] || 5.0;
    const weightKg = parseFloat(weight) || 70;
    const minutesNum = parseInt(minutes) || 30;
    
    const caloriesBurned = Math.round((met * 3.5 * weightKg * minutesNum) / 200);
    
    const messages = constants.MOTIVATIONAL_MESSAGES;
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    
    res.json({
        success: true,
        activity,
        minutes: minutesNum,
        weight_kg: weightKg,
        calories_burned: caloriesBurned,
        met_value: met,
        message: randomMessage.message,
        icon: randomMessage.icon
    });
};

exports.getClassStats = async (req, res) => {
    const allLogs = await ExerciseLog.getAllLogs();
    const userLogs = allLogs;
    
    const exerciseCount = {};
    userLogs.forEach(log => {
        exerciseCount[log.exercise] = (exerciseCount[log.exercise] || 0) + 1;
    });
    
    let mostPopular = "Squat";
    let maxCount = 0;
    for (const [exercise, count] of Object.entries(exerciseCount)) {
        if (count > maxCount) {
            maxCount = count;
            mostPopular = exercise;
        }
    }
    
    res.json({
        success: true,
        total_exercises_completed: userLogs.length,
        most_popular_exercise: mostPopular,
        active_users: [...new Set(userLogs.map(l => l.userId))].length,
        last_update: new Date().toISOString(),
        recommendations: {
            daily_goal: constants.AGE_RANGES.adolescents.daily_activity_minutes,
            message: "Continua così! Ogni esercizio conta per il tuo benessere."
        }
    });
};