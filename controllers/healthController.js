const path = require('path');
const User = require('../models/User');
const HealthData = require('../models/HealthData');
const ExerciseLog = require('../models/ExerciseLog');

exports.showDashboard = async (req, res) => {
    res.sendFile(path.join(__dirname, '../views/dashboard.html'));
};

exports.getUserData = async (req, res) => {
    const user = await User.findById(req.session.userId);
    if (!user) {
        return res.status(404).json({ error: 'Utente non trovato' });
    }
    const { password, ...userData } = user;
    res.json(userData);
};

exports.calculateAndSaveBMI = async (req, res) => {
    const { weight, height } = req.body;
    const userId = req.session.userId;
    
    if (!weight || !height) {
        return res.status(400).json({ error: 'Peso e altezza sono obbligatori' });
    }
    
    const bmi = HealthData.calculateBMI(weight, height);
    const category = HealthData.getBMICategory(bmi);
    const waterIntake = HealthData.calculateWaterIntake(weight);
    
    // Aggiorna i dati dell'utente
    await User.update(userId, { weight, height });
    
    // Salva nel log
    await ExerciseLog.saveHealthLog(userId, weight, bmi);
    
    res.json({
        success: true,
        bmi,
        category,
        waterIntake,
        advice: category.advice
    });
};

exports.getProgress = async (req, res) => {
    const userId = req.session.userId;
    const user = await User.findById(userId);
    const weeklyStats = await ExerciseLog.getWeeklyStats(userId);
    const healthLogs = await ExerciseLog.getHealthLogs(userId);
    
    const currentBMI = user ? HealthData.calculateBMI(user.weight, user.height) : null;
    const bmiCategory = currentBMI ? HealthData.getBMICategory(currentBMI) : null;
    
    res.json({
        user: {
            weight: user?.weight,
            height: user?.height,
            age: user?.age
        },
        currentBMI,
        bmiCategory,
        weeklyStats,
        healthLogs: healthLogs.slice(-30) // Ultimi 30 giorni
    });
};

exports.completeExercise = async (req, res) => {
    const { exercise, calories, reps } = req.body;
    const userId = req.session.userId;
    
    if (!exercise) {
        return res.status(400).json({ error: 'Nome esercizio obbligatorio' });
    }
    
    const log = await ExerciseLog.addLog(userId, exercise, calories || 50, reps || '3x10');
    
    // Calcola contatore solidarietà
    const allLogs = await ExerciseLog.getAllLogs();
    const totalExercises = allLogs.length;
    
    res.json({
        success: true,
        message: `✅ Ottimo! Hai completato ${exercise}`,
        log,
        solidarityCount: totalExercises,
        solidarityMilestone: totalExercises % 100 === 0 ? `Complimenti! Hai raggiunto ${totalExercises} esercizi totali!` : null
    });
};

exports.getDiary = async (req, res) => {
    const userId = req.session.userId;
    const { date } = req.query;
    
    let logs = await ExerciseLog.getUserLogs(userId);
    
    if (date) {
        logs = logs.filter(log => log.dateOnly === date);
    } else {
        // Ultimi 7 giorni
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        logs = logs.filter(log => new Date(log.date) >= weekAgo);
    }
    
    res.json(logs);
};

exports.saveDiaryEntry = async (req, res) => {
    const { exercise, calories, reps, date } = req.body;
    const userId = req.session.userId;
    
    const log = await ExerciseLog.addLog(userId, exercise, calories, reps);
    res.json({ success: true, log });
};