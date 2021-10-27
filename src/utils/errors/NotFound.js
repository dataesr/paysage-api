import CustomError from './CustomError';

class NotFoundError extends CustomError {
  constructor(message, errors = []) {
    super(message || 'Not found', errors);
    this.statusCode = 404;
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export default NotFoundError;
