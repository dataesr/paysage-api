import { error as OAVError } from 'express-openapi-validator';
import { HTTPError } from '../http-errors';
import logger from '../../../services/logger.service';

export function handleErrors(err, req, res, next) {
  logger.info(err);
  if (err instanceof HTTPError) {
    if (err.statusCode === 500) { logger.error(err); }
    return res.status(err.statusCode).json({
      error: err.message,
      details: err.errors,
    });
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
    logger.error(err);
    return res.status(500).json({
      error: 'Something went wrong',
      details: err.errors,
    });
  }
  if (err instanceof OAVError.Unauthorized) {
    logger.error(err);
    return res.status(401).json({
      error: 'User must be logged in',
      details: err.errors,
    });
  }
  if (err) {
    logger.error(err);
    return res.status(err.status || 500).json({
      message: 'Something went wrong', details: [],
    });
  }
  return next();
}
