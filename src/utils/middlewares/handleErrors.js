import { error as OAVError } from 'express-openapi-validator';
import mongodb from 'mongodb';
import { CustomError } from '../errors';
import logger from '../../logger';

// eslint-disable-next-line no-unused-vars
export default function handleErrors(err, req, res, next) {
  logger.error(err.message);

  if (err instanceof CustomError) {
    const { statusCode, ...error } = err.extract();
    return res.status(statusCode).json(error);
  }
  if (err instanceof mongodb.MongoError) {
    const duplicated = err.message.split('index:')[1].split('dup key')[0].split('_')[0].trim();
    if (!duplicated) {
      return res.status(500).json({ error: 'Server error', details: [] });
    }
    return res.status(400).json({
      error: 'Bad request',
      details: [{ path: `.body.${duplicated}`, message: `${duplicated} must be unique.` }],
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
  return res.status(err.status || 500).json({
    message: 'Something went wrong', details: [],
  });
}
