import CustomError from './custom.error';

class ForbiddenError extends CustomError {
  constructor(message, errors = []) {
    super(message || 'Forbidden', errors);
    this.statusCode = 403;
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}

export default ForbiddenError;
