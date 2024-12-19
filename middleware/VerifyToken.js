const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    const token = req.cookies['jwt-auth'];

    if (!token) return res.status(401).json({ error: 'Access denied' });
    try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        req.email = decoded.email;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};


module.exports = verifyToken;
