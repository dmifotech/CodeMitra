const express = require('express');
const  authenticateToken  = require('../middleware/authenticateToken'); // ✅ Correct path
const { authorizeRoles } = require('../middleware/authorizeRoles'); // ✅ Correct path
// console.log('authenticateToken:', authenticateToken); // Debugging
// console.log('authorizeRoles:', authorizeRoles); // Debugging

const router = express.Router();

router.get('/dashboard', authenticateToken, authorizeRoles('client'), (req, res) => {
    res.json({ message: 'Welcome, Client!' });
});

module.exports = router;
