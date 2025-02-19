const express = require('express');
const db = require("../config/db");
const  authenticateToken  = require('../middleware/authenticateToken'); // ✅ Correct path
const { authorizeRoles } = require('../middleware/authorizeRoles'); // ✅ Correct path
// console.log('authenticateToken:', authenticateToken); // Debugging
// console.log('authorizeRoles:', authorizeRoles); // Debugging

const router = express.Router();

router.get('/dashboard', authenticateToken, authorizeRoles('admin'), (req, res) => {
    const email = req.user.email;
    const sql = "SELECT * FROM users WHERE email = ?";
  
    db.query(sql, [email], (err, result) => {
      if (err) return res.status(500).json({ message: "Server error" });
      if (result.length === 0)
        return res.status(404).json({ message: "User not found" });
      res.json({
        userDetails: result[0],
        message: ` ${email}`,
      });
    });
});

module.exports = router;
