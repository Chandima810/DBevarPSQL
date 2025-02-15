const express = require('express');
const cors = require('cors');
const { Pool } = require('pg'); // PostgreSQL client

const app = express();
const port = 5000;

// Enable CORS and parse incoming JSON requests
app.use(cors());
app.use(express.json());

// Set up PostgreSQL connection
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'Eatandlive', // Your database name
  password: 'your_password', // Your PostgreSQL password
  port: 5432,
});

// Simple test route
app.get('/', (req, res) => {
  res.send('Hello World from Express!');
});

// Route to get all customers (example)
app.get('/api/customers', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM customers');
    res.json(result.rows); // Send the rows as a JSON response
  } catch (err) {
    console.error('Error querying the database:', err.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
