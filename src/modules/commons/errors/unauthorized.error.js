import CustomError from './custom.error';

class UnauthorizedError extends CustomError {
  constructor(message, errors = []) {
    super(message || 'Unauthorized', errors);
    this.statusCode = 401;
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}

export default UnauthorizedError;
