// app.js

// load the environment variables from .env file
require('dotenv').config();
const express = require('express');
const rateLimit = require('express-rate-limit');


// postgres pool for concurrent requests
const { Pool } = require('pg');

// to allow cors
const cors = require('cors');

// redis 
const redis = require('redis');

//express app
const app = express();

const limiter = rateLimit({
  windowMs: 30 * 60 * 1000, // for 30 minutes time
  max: 150 // max req for this time
});
app.use(limiter);


// enable CORS 
app.use(cors());


const port = 8000;


// redis connection for caching
const redis_data = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  legacyMode: true

});

//await redis_data.connect();
(async () => {
  await redis_data.connect();
})();

redis_data.on('connect', () => {
  console.log('Connected to Redis');
});

redis_data.on('error', (err) => {
  console.error('Redis connection error:', err);
});


// create a PostgreSQL connection pool
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });


// parse JSON requests middleware
app.use(express.json());

// redis code for middleware 
const cacheMiddleware = (req, res, next) => {
  const key = req.originalUrl;
  redis_data.get(key, (err, data) => {
    if (err) throw err;
    if (data !== null) {
      res.send(JSON.parse(data));
    } else {
      next();
    }
  });
};


// API endpoint to fetch top authors emails and names
app.get('/top-authors', cacheMiddleware, async (req, res) => {
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

    // cache the data which we get from PostgreSQL
    const key = req.originalUrl;
    redis_data.setex(key, 3600, JSON.stringify(rows)); // it is cached for 1 hour

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
