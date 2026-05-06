function ensureAuthenticated(req, res, next) {
    if (req.session && req.session.userId) {
        return next();
    }
    res.redirect('/login');
}

function ensureGuest(req, res, next) {
    if (!req.session || !req.session.userId) {
        return next();
    }
    res.redirect('/dashboard');
}

module.exports = { ensureAuthenticated, ensureGuest };