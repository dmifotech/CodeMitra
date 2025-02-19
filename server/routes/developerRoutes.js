const express = require('express');
const { authenticateToken, checkRole } = require('../middleware/authenticateToken');

const router = express.Router();

router.get('/dashboard', authenticateToken, checkRole('developer'), (req, res) => {
    res.json({ message: 'Welcome, Developer!' });
});

module.exports = router;
