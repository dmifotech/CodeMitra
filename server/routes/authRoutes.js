const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
require("dotenv").config();

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

router.post("/sign-up", async (req, res) => {
  const { name, email, password, phone, role } = req.body;

  // Check if all required fields are provided
  if (!name || !email || !password || !phone || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if user already exists (by email)
    const query = "SELECT * FROM users WHERE email = ?";
    db.execute(query, [email], async (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
      }

      if (results.length > 0) {
        return res.status(409).json({ message: "Email is already registered" });
      }

      // Hash the password before saving it in the database
      const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

      // Insert the new user into the database
      const insertQuery =
        "INSERT INTO users (name, email, password, phone, role) VALUES (?, ?, ?, ?, ?)";
      db.execute(
        insertQuery,
        [name, email, hashedPassword, phone, role],
        (err, results) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ message: "Failed to create user" });
          }

          // Create JWT token for the new user
          const payload = { userId: results.insertId, role }; // Use the inserted user ID
          const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" }); // Token expires in 1 hour

          // Send success response with token
          res.status(201).json({
            message: "User registered successfully",
            token: token,
          });
        }
      );
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/sign-in", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      error:
        "Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, and one number",
    });
  }

  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], (err, results) => {
    if (err) {
      console.error("Failed to select user:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = results[0]; // Correctly define user

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        console.error("Failed to compare passwords:", err);
        return res.status(500).json({ error: "Internal server error" });
      }

      if (!isMatch) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Generate JWT token using the user object
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.json({
        message: "Login successful",
        token,
      });
    });
  });
});

module.exports = router;