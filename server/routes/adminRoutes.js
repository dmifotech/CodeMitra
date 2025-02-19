const express = require('express');
const { authenticateToken, checkRole } = require('../middleware/authenticateToken');

const router = express.Router();

router.get('/dashboard', authenticateToken, checkRole('admin'), (req, res) => {
    res.json({ message: 'Welcome, Admin!', email: user.email });
});

module.exports = router;
