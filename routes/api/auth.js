var express = require('express');
var router = express.Router();
var databaseConn = require ('../../config/database.js');
const bcrypt = require('bcrypt');

router.post('/signup', async (req, res) => {
    try {
        var SALT_ROUNDS = 5;

        // Ensure you have a password to hash
        if (!req.body.Customer_password) {
            return res.status(400).json({ success: false, message: "Password is required." });
        }

        // Hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(req.body.Customer_password, SALT_ROUNDS);

        // Parameterized query to prevent SQL injection
        const sqlQuery = `INSERT INTO acc_records (Customer_name, Customer_address, Customer_email, Customer_password, Customer_contactnum) 
                          VALUES (?, ?, ?, ?, ?)`;

        // Parameterized values
        const values = [
            req.body.Customer_name,
            req.body.Customer_address,
            req.body.Customer_email,
            hashedPassword,
            req.body.Customer_contactnum
        ];

        databaseConn.query(sqlQuery, values, function (error, results, fields) {
            if (error) {
                console.log(error);
                res.status(500).json({ success: false, message: "Error inserting data into acc_records table." });
            } else {
                res.status(200).json({ success: true, message: "Data inserted successfully." });
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
});



//log in
router.post('/login', (req, res) => {
    try {
        // Ensure you have an email and password for login
        if (!req.body.Customer_email || !req.body.Customer_password) {
            return res.status(400).json({ success: false, message: "Email and password are required." });
        }

        // Fetch user data based on the provided email
        const fetchUserQuery = "SELECT * FROM acc_records WHERE Customer_email = ?";
        databaseConn.query(fetchUserQuery, [req.body.Customer_email], async (error, results, fields) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ success: false, message: "Error fetching user data." });
            }

            // Check if the user with the provided email exists
            if (results.length === 0) {
                return res.status(404).json({ success: false, message: "User not found." });
            }

            const user = results[0];

            // Compare the provided password with the hashed password stored in the database
            const passwordMatch = await bcrypt.compare(req.body.Customer_password, user.Customer_password);

            if (passwordMatch) {
                res.status(200).json({ success: true, message: "Login successful." });
            } else {
                res.status(401).json({ success: false, message: "Invalid password." });
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
});
 
module.exports = router;