const logger = require('./logger');

const errorHandler = (error, request, response, next) => {
  logger.error(error.message);

  let errorMessage;
  let status = 0;

  switch (error.name) {
    case 'MongoServerError':
      if (error.message.includes('E11000 duplicate key error')) {
        errorMessage = 'expected `username` to be unique';
        status = 400;
      }
      break;
    case 'ValidationError':
      errorMessage = 'username minimum length is 3 characters';
      status = 400;
      break;
    case 'CastError':
      errorMessage = 'malformatted id';
      status = 400;
      break;
    default:
      next(error);
      break;
  }

  return response.status(status).json({ error: errorMessage });
};

module.exports = { errorHandler };
