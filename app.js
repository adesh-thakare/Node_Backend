// app.js
require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');

const cors = require('cors');

const app = express();

//app.use(cors());

const port = 8000;

const corsOptions = {
  origin: 'https://react-frontend-list.vercel.app',
};
app.use(cors(corsOptions));

// Create a PostgreSQL connection pool
const pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
    url: process.env.DATABASE_URL,
  });


// Middleware for parsing JSON requests
app.use(express.json());




// API endpoint to fetch top authors based on sales revenue
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

    const { rows } = await pool.query(query, authorName ? [authorName] : []);
    if (rows.length === 0 && authorName) {
      return res.status(404).json({ error: 'Author not found' });
    }

    res.json(rows);
  } catch (error) {
    console.error('Error fetching top authors:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
