import CustomError from './custom.error';

class BadRequestError extends CustomError {
  constructor(message, errors = []) {
    super(message || 'Bad request');
    this.errors = errors;
    this.statusCode = 400;
  }
}

export default BadRequestError;
