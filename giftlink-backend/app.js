/*jshint esversion: 8 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pinoLogger = require('./logger');

const connectToDatabase = require('./models/db');
const { loadData } = require("./util/import-mongo/index");

const app = express();
app.use(cors()); // allow all origins
const port = 3060;

// Connect to MongoDB; do this one time
connectToDatabase()
  .then(() => {
    pinoLogger.info('Connected to DB');
  })
  .catch((e) => console.error('Failed to connect to DB', e));

// Parse JSON requests
app.use(express.json());

// Route files
const giftRoutes = require('./routes/giftRoutes');       // Gift API Task 1
const searchRoutes = require('./routes/searchRoutes');   // Search API Task 1

const pinoHttp = require('pino-http');
const logger = require('./logger');

app.use(pinoHttp({ logger }));

// Use Routes
app.use('/api/gifts', giftRoutes);    // Gift API Task 2
app.use('/api/search', searchRoutes); // Search API Task 2

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Internal Server Error');
});

// Test route
app.get("/", (req, res) => {
  res.send("Inside the server");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
