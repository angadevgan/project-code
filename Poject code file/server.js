const express = require('express');
const mysql = require('mysql');

const app = express();
app.use(express.json()); // Use built-in middleware for JSON parsing

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'health_tracker'
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err.message);
        process.exit(1); // Exit the app if database connection fails
    }
    console.log('MySQL Connected...');
});

// Add Record
app.post('/add-record', (req, res) => {
    const { date, steps, calories, sleep } = req.body;

    // Validate inputs
    if (!date || isNaN(steps) || isNaN(calories) || isNaN(sleep)) {
        return res.status(400).json({ error: 'Invalid input. Please provide valid date, steps, calories, and sleep.' });
    }

    const sql = 'INSERT INTO records (date, steps, calories, sleep) VALUES (?, ?, ?, ?)';
    db.query(sql, [date, steps, calories, sleep], (err, result) => {
        if (err) {
            console.error('Error inserting record:', err.message);
            return res.status(500).json({ error: 'Failed to add record' });
        }
        res.status(201).json({ message: 'Record added successfully', recordId: result.insertId });
    });
});

// Get All Records
app.get('/records', (req, res) => {
    const sql = 'SELECT * FROM records ORDER BY date DESC';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching records:', err.message);
            return res.status(500).json({ error: 'Failed to fetch records' });
        }
        res.status(200).json(results);
    });
});

// Handle undefined routes
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Start Server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

