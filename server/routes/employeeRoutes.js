const express = require('express');
const db = require("../config/db");
const  authenticateToken  = require('../middleware/authenticateToken'); // ✅ Correct path
const { authorizeRoles } = require('../middleware/authorizeRoles'); // ✅ Correct path
// console.log('authenticateToken:', authenticateToken); // Debugging
// console.log('authorizeRoles:', authorizeRoles); // Debugging

const router = express.Router();

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


router.post('/update-profile', authenticateToken, authorizeRoles('employee'), (req, res) => {
    const email = req.user.email;
    const {profile, gender, bio }= req.body;
    const sql = "UPDATE users SET profile =?, gender =?, bio =? WHERE email =?";
    db.query(sql, [profile, gender, bio, email], (err, result) => {
        if (err) return res.status(500).json({ message: "Server error" });
        res.json({ message: "Profile updated successfully" });
    });
});

module.exports = router;
