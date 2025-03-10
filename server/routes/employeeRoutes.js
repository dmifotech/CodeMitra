const express = require('express');
const db = require("../config/db");
const fileUpload = require('express-fileupload');
const path = require('path');
const bcrypt = require("bcryptjs");
const fs = require('fs');
const  authenticateToken  = require('../middleware/authenticateToken'); // ✅ Correct path
const { authorizeRoles } = require('../middleware/authorizeRoles'); // ✅ Correct path
// console.log('authenticateToken:', authenticateToken); // Debugging
// console.log('authorizeRoles:', authorizeRoles); // Debugging

const router = express.Router();

router.use(fileUpload());
router.use(express.json());
router.get('/dashboard', authenticateToken, authorizeRoles('employee'), (req, res) => {
    const email = req.user.email;
    
    const getUserQuery = "SELECT user_id FROM users WHERE email = ?";

    db.query(getUserQuery, [email], (err, userResult) => {
        if (err) return res.status(500).json({ message: "Server error" });
        if (userResult.length === 0) return res.status(404).json({ message: "User not found" });

        const userId = userResult[0].user_id;

        const getEmployeeQuery = "SELECT employee_id FROM employee WHERE user_id = ?";
        
        db.query(getEmployeeQuery, [userId], (err, empResult) => {
            if (err) return res.status(500).json({ message: "Server error" });
            if (empResult.length === 0) return res.status(404).json({ message: "Employee not found" });

            const employeeId = empResult[0].employee_id;

            // Query 1: Fetch assigned projects and task summary per project
            const getProjectsQuery = `
                SELECT 
    p.project_id,
    p.project_name,
    p.description,
    p.start_date,
    p.end_date,
    p.status AS project_status,
    COUNT(t.task_id) AS total_tasks,
    SUM(CASE WHEN t.task_status = 'completed' THEN 1 ELSE 0 END) AS completed_tasks,
    SUM(CASE WHEN t.task_status = 'in_progress' THEN 1 ELSE 0 END) AS ongoing_tasks,
    u.email AS client_email
FROM project_assignments pa
JOIN projects p ON pa.project_id = p.project_id
LEFT JOIN tasks t ON p.project_id = t.project_id AND pa.employee_id = t.employee_id
JOIN client c ON p.client_id = c.client_id
JOIN users u ON c.user_id = u.user_id
WHERE pa.employee_id = ?
GROUP BY p.project_id, u.email;
            `;

            db.query(getProjectsQuery, [employeeId], (err, projectsResult) => {
                if (err) return res.status(500).json({ message: "Server error" });

                // Query 2: Fetch total tasks assigned to the employee
                const getTotalTasksQuery = `
                    SELECT 
                        COUNT(task_id) AS total_tasks,
                        SUM(CASE WHEN task_status = 'Completed' THEN 1 ELSE 0 END) AS completed_tasks,
                        SUM(CASE WHEN task_status = 'In Progress' THEN 1 ELSE 0 END) AS ongoing_tasks
                    FROM tasks
                    WHERE employee_id = ?;
                `;

                db.query(getTotalTasksQuery, [employeeId], (err, tasksSummary) => {
                    if (err) return res.status(500).json({ message: "Server error" });

                    res.json({
                        employeeId: employeeId,
                        totalTasksSummary: tasksSummary[0], // Total assigned tasks
                        projects: projectsResult // Tasks per project
                    });
                });
            });
        });
    });
});

router.get('/profile', authenticateToken, authorizeRoles('employee'), (req, res) => {
    const email = req.user.email;
    const sql = "SELECT * FROM users WHERE email = ?";
  
    db.query(sql, [email], (err, result) => {
      if (err) return res.status(500).json({ message: "Server error" });
      if (result.length === 0)
        return res.status(404).json({ message: "User not found" });
      res.json({
        userDetails: result[0]
      });
    });
});

router.post('/update-profile',authenticateToken, authorizeRoles('employee'), (req, res) => {
  const {email,phone,bio} = req.body;
    const image = req.files ? req.files.image : null; // Access the uploaded file
    if (!image) {
      return res.status(400).json({ error: 'No image uploaded' });
    }
  
    // Generate a unique name for the image
    const date = new Date();
    const randomStr = Math.random().toString(36).substring(2, 10); // Generate a random string
    const imageName = `${randomStr}-${date.getTime()}.jpeg`;
  
    // Path to store the image locally
    const uploadDir = path.join(__dirname, './../uploads'); // Moves to root 'uploads'

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    const imagePath = path.join(uploadDir, imageName);
  
    // Move the uploaded file to the 'uploads' directory
    image.mv(imagePath, (err) => {
      if (err) {
        return res.status(500).json({ error: 'Error uploading image' });
      }
  
      // Construct the image URL (Update this based on your actual domain)
      const imageUrl = `https://xyphor-nexus87.dmifotech.com/uploads/${imageName}`;
       const sql = `
      UPDATE users
      SET 
        bio = COALESCE(?, bio), 
        phone = COALESCE(?, phone), 
        profile_img = COALESCE(?, profile_img) 
      WHERE email = ?;
    `;

    // Execute the SQL query
    db.query(sql, [bio || null, phone || null, imageUrl || null, email], (err, result) => {
      if (err) {
        console.error("Error updating profile:", err);
        return res.status(500).json({ error: "Database update failed" });
      }

      res.status(200).json({
        message: "Profile updated successfully",
        user: {
          email,
          phone,
          bio,
          profile_img: imageUrl,
        },
      });
    });
  }
);
    });
    
router.post('/update-password', authenticateToken, async (req, res) => {
  const email = req.user.email;
  const { oldPassword, newPassword } = req.body;

  if (!email || !oldPassword || !newPassword) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Fetch existing password from DB
    const [rows] = await db.promise().query('SELECT password FROM users WHERE email = ?', [email]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Compare old password
    const passwordMatch = await bcrypt.compare(oldPassword, rows[0].password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Incorrect old password' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password in DB
    await db.promise().query('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, email]);

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
   
    
module.exports = router;
