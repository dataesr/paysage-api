import { error as OAVError } from 'express-openapi-validator';
import { CustomError } from '../errors';
import logger from '../logger';

// eslint-disable-next-line no-unused-vars
export default function handleErrors(err, req, res, next) {
  logger.error(err.message);
  
  if (err instanceof CustomError) {
    const { statusCode, ...error } = err.extract();
    console.log(statusCode, error);
    return res.status(statusCode).json(error);
  }
  if (err instanceof OAVError.BadRequest) {
    return res.status(400).json({
      error: 'Validation failed',
      details: err.errors,
    });
  }
  if (err instanceof OAVError.NotFound) {
    return res.status(404).json({
      error: 'Not found',
      details: err.errors,
    });
  }
  if (err instanceof OAVError.InternalServerError) {
    return res.status(500).json({
      error: 'Something went wrong',
      details: err.errors,
    });
  }
  return res.status(err.status || 500).json({
    message: 'Something went wrong', details: [],
  });
}
