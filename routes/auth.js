const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const verifyToken = require('../middleware/VerifyToken');

// User login
router.post('/login', (req, res) => {

    try {
        const { email, password } = req.body.data;

        const passwordMatch = password == "password";

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Authentication failed' });
        }
        const token = jwt.sign({ email: email }, process.env.TOKEN_SECRET);
        res.cookie('jwt-auth', token, { httpOnly: true });
        res.status(200).json({ message: "Login successfull" });
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
});

router.get('/verifyToken', verifyToken, (req, res) => {

    res.status(200).json({ "message": "Verificato" })

})

module.exports = router;

