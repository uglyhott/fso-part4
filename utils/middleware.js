/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');
const logger = require('./logger');
const User = require('../models/user');

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.startsWith('Bearer ')) {
    const token = authorization.replace('Bearer ', '');
    request.token = token;
  }
  next();
};

const userExtractor = async (request, response, next) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' });
  }

  const user = await User.findById(decodedToken.id);
  if (user === null) {
    return response.status(400).json({ error: 'user not found' });
  }
  request.user = user;
  next();
};

const errorHandler = (error, request, response, next) => {
  logger.error(error.message);

  if (error.name === 'ValidationError') {
    if (error.message.includes('User validation failed')) {
      return response.status(400).json({ error: 'username minimum length is 3 characters' });
    }
    return response.status(400).end();
  }
  if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
    return response.status(400).json({ error: 'expected `username` to be unique' });
  }
  if (error.name === 'CastError') {
    return response.status(400).json({ error: 'malformatted id' });
  }
  if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'Token Invalid. Is the header correctly formatted?' });
  }

  next(error);
};

module.exports = {
  errorHandler,
  tokenExtractor,
  userExtractor,
};
