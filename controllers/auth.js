// Middleware to Check Authentication
const jwt = require('jsonwebtoken');


const isAuthenticated = (req, res, next) => {
    try {
        if (!req.cookies.token) {
            return res.redirect('/login'); 
        } else {
            const decoded = jwt.verify(req.cookies.token, 'your_secret_key');
            req.user = decoded;
            next();
        }
    } catch (err) {
        res.clearCookie('token');
        return res.redirect('/login'); 
    }
}
module.exports = isAuthenticated;