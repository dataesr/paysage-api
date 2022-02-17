import { error as OAVError } from 'express-openapi-validator';
import MonsterError from '../../../libs/monster/errors/monster.error';
import { CustomError } from '../errors';
import logger from '../../../services/logger.service';

export function handleErrors(err, req, res, next) {
  logger.error(err.message);

  if (err instanceof CustomError) {
    const { statusCode, ...error } = err.extract();
    return res.status(statusCode).json(error);
  }
  if (err instanceof MonsterError) {
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
    return res.status(500).json({
      error: 'Something went wrong',
      details: err.errors,
    });
  }
  if (err) {
    return res.status(err.status || 500).json({
      message: 'Something went wrong', details: [],
    });
  }
  return next();
}
