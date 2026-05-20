const User = require('../models/User');

exports.register = async (req, res) => {
    const { username, password, email } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ error: 'Username e password obbligatori' });
    }
    
    try {
        const newUser = await User.create({ username, password, email });
        res.json({ success: true, message: 'Registrazione completata!' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
    
    const user = await User.verifyAndLogin(username, password);
    if (!user) {
        return res.status(401).json({ error: 'Credenziali non valide' });
    }
    
    req.session.userId = user.id;
    req.session.username = user.username;
    
    res.json({ success: true, redirect: '/dashboard', streak: user.streak });
};

exports.logout = (req, res) => {
    req.session.destroy();
    res.json({ success: true, redirect: '/login' });
};

exports.getCurrentUser = async (req, res) => {
    const user = await User.findById(req.session.userId);
    if (!user) {
        return res.status(404).json({ error: 'Utente non trovato' });
    }
    res.json({
        id: user.id,
        username: user.username,
        streak: user.streak,
        last_login: user.last_login
    });
};