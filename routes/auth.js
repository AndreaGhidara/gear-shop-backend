const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// User login
router.post('/login', (req, res) => {
    //res.set('Access-Control-Allow-Origin', 'http://localhost:5173');

    try {
        const { username, password } = req.body;

        const passwordMatch = password == "password";

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Authentication failed' });
        }
        const token = jwt.sign({ username: username }, process.env.TOKEN_SECRET);

        res.cookie('jwt-auth', token, { httpOnly: true });
        res.status(200).json({ message: "Login successfull" });
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
});

module.exports = router;

