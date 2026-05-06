const path = require('path');
const User = require('../models/User');

exports.showLogin = (req, res) => {
    res.sendFile(path.join(__dirname, '../views/login.html'));
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ error: 'Inserisci username e password' });
    }
    
    const isValid = await User.verifyPassword(username, password);
    if (!isValid) {
        return res.status(401).json({ error: 'Credenziali non valide' });
    }
    
    const user = await User.findByUsername(username);
    req.session.userId = user.id;
    req.session.username = user.username;
    
    res.json({ success: true, redirect: '/dashboard' });
};

exports.register = async (req, res) => {
    const { username, password, email, age, weight, height } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ error: 'Username e password sono obbligatori' });
    }
    
    try {
        const user = await User.create({ username, password, email, age, weight, height });
        req.session.userId = user.id;
        req.session.username = user.username;
        res.json({ success: true, redirect: '/dashboard' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.logout = (req, res) => {
    req.session.destroy();
    res.redirect('/login');
};