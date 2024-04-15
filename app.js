// app.js

// load the environment variables from .env file
require('dotenv').config();
const express = require('express');

const { Pool } = require('pg');

// to allow cors
const cors = require('cors');

//express app
const app = express();


// enable CORS 
app.use(cors());


const port = 8000;

// create a PostgreSQL connection pool
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    max: 100, // capacity of server adjustment to handle traffic of 1000, load testing using cURL, postman and Apache Jmeter before setting this to a high value
    idleTimeoutMillis: 30000, // if connection is not active for idleTimeoutMillis, it will close
  });


// parse JSON requests middleware
app.use(express.json());


// API endpoint to fetch top authors emails and names
app.get('/top-authors', async (req, res) => {
  try {
    const authorName = req.query.author_name;

    let query = `
      SELECT name, email from authors;
    `;

    if (authorName) {
      query = `
        SELECT name, email from authors WHERE authors.name = authorName;
      `;
    }

    // execute SQL query
    const { rows } = await pool.query(query, authorName ? [authorName] : []);
    if (rows.length === 0 && authorName) {
      return res.status(404).json({ error: 'Author not found' });
    }

    res.json(rows);
  } catch (error) {
    //handle errors
    console.error('Error fetching top authors:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(port, () => {
  //listen on port
  console.log(`Server running on port ${port}`);
});
