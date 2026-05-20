const ExerciseDB = require('../models/ExerciseDB');

exports.getExercises = async (req, res) => {
    const { muscle, difficulty, type } = req.query;
    
    let exercises = await ExerciseDB.getAll();
    
    if (muscle) {
        exercises = exercises.filter(e => e.muscles.includes(muscle.toLowerCase()));
    }
    if (difficulty) {
        exercises = exercises.filter(e => e.difficulty === difficulty.toLowerCase());
    }
    if (type) {
        exercises = exercises.filter(e => e.type === type.toLowerCase());
    }
    
    res.json(exercises);
};

exports.getExerciseById = async (req, res) => {
    const exercise = await ExerciseDB.getById(req.params.id);
    if (!exercise) {
        return res.status(404).json({ error: 'Esercizio non trovato' });
    }
    res.json(exercise);
};

exports.getMuscles = async (req, res) => {
    const exercises = await ExerciseDB.getAll();
    const muscles = [...new Set(exercises.flatMap(e => e.muscles))];
    res.json(muscles.sort());
};

exports.getDifficulties = async (req, res) => {
    res.json(['principiante', 'intermedio', 'avanzato']);
};

exports.getTypes = async (req, res) => {
    const exercises = await ExerciseDB.getAll();
    const types = [...new Set(exercises.map(e => e.type))];
    res.json(types.sort());
};