const express = require("express");
const db = require("../config/db");
const router = express.Router();
// const authenticateToken = require("../middleware/authenticateToken");
require('dotenv').config();


router.get("/get-data", (req, res) => {

  db.query("SELECT * FROM it_employee", (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});
  
//   router.get("/dashboard", authenticateToken, (req, res) => {
//     const email = req.user.email;
//     const sql = "SELECT * FROM users WHERE email = ?";
  
//     db.query(sql, [email], (err, result) => {
//       if (err) return res.status(500).json({ message: "Server error" });
//       if (result.length === 0)
//         return res.status(404).json({ message: "User not found" });
//       res.json({
//         userDetails: result[0],
//         message: ` ${email}`,
//       });
//     });
//   });
  
module.exports = router;