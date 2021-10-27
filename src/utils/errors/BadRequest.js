import CustomError from './CustomError';

class BadRequestError extends CustomError {
  constructor(message, errors = []) {
    super(message || 'Bad request');
    this.errors = errors;
    this.statusCode = 400;
  }
}

export default BadRequestError;
