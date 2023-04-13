const { custom } = require('joi');
const { CustomAPIError } = require('../errors');
const { StatusCodes } = require('http-status-codes');

const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong try again later',
  };

  if (err.name === 'ValidationError') {
    customError.msg = Object.values(err.errors)
      .map((el) => el.message)
      .join(',');
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  if (err.name === 'CastError') {
    customError.msg = `Invalid ${err.path}: ${err.value}`;
    customError.statusCode = StatusCodes.NOT_FOUND;
  }

  if (err.code && err.code === 11000) {
    customError.msg = `Duplicate value entered for ${Object.keys(
      err.keyValue
    )} field, please choose another value`;
    customError.statusCode = 400;
  }

  return res.status(customError.statusCode).json({ msg: customError.msg });
};

module.exports = errorHandlerMiddleware;
