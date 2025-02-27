const logger = require('./logger');

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.startsWith('Bearer ')) {
    const token = authorization.replace('Bearer ', '');
    request.token = token;
  }
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
    return response.status(401).json({ error: 'token invalid ' });
  }

  next(error);
};

module.exports = { errorHandler, tokenExtractor };
