const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const config = require('./utils/config');
const logger = require('./utils/logger');

const app = express();
const blogsRouter = require('./controllers/blogs');

const mongoUrl = config.MONGODB_URI;

logger.info('Connecting to MongoDB');

mongoose.connect(mongoUrl)
  .then(() => {
    logger.info('Connected to MongoDB');
  })
  .catch((error) => {
    logger.error('Error connecting to MongoDB:', error.message);
  });

app.use(cors());
app.use(express.json());
app.use('/api/blogs', blogsRouter);

module.exports = app;
