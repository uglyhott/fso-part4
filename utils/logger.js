/* eslint-disable no-console */
const { NODE_ENV } = require('./config');

const info = (...args) => {
  if (NODE_ENV !== 'test') console.log(...args);
};

const error = (...args) => {
  if (NODE_ENV !== 'test') console.error(...args);
};

module.exports = {
  info, error,
};
