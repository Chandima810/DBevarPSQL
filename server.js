const express = require('express');
const { Client } = require('pg');
const app = express();
const port = 3000;

// Create a PostgreSQL client
const client = new Client({
  user: 'postgres',  // Replace with your PostgreSQL username
  host: 'localhost',
  database: 'eatwell',  // Replace with your database name
  password: 'Post@1Post',  // Replace with your PostgreSQL password
  port: 5432,
});

client.connect();

// Middleware to parse JSON requests
app.use(express.json());

// Endpoint to fetch all vegetables
app.get('/vegetables', (req, res) => {
  client.query('SELECT * FROM vegetable', (err, result) => {
    if (err) {
      res.status(500).send('Error retrieving vegetables');
    } else {
      res.json(result.rows);  // Send the vegetable data as JSON
    }
  });
});

// Endpoint to add a new vegetable
app.post('/vegetables', (req, res) => {
  const { vegetable_name, carbohydrate, protein, lipid } = req.body;  // Get data from the request body

  // Check if all fields are provided
  if (!vegetable_name || !carbohydrate || !protein || !lipid) {
    return res.status(400).send('All fields are required');
  }

  // Insert the new vegetable into the database
  const query = `
    INSERT INTO vegetable (vegetable_name, carbohydrate, protein, lipid)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  const values = [vegetable_name, carbohydrate, protein, lipid];

  client.query(query, values, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error adding vegetable');
    } else {
      res.status(201).json(result.rows[0]);  // Return the newly added vegetable as JSON
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});
