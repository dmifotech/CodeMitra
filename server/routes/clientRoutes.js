const express = require('express');
const { authenticateToken, checkRole } = require('../middleware/authenticateToken');

const router = express.Router();

router.get('/dashboard', authenticateToken, checkRole('client'), (req, res) => {
    res.json({ message: 'Welcome, Client!' });
});

module.exports = router;
