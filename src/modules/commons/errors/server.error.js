import CustomError from './custom.error';

class ServerError extends CustomError {
  constructor(message, errors = []) {
    super(message || 'Server error', errors);
    this.statusCode = 500;
    Object.setPrototypeOf(this, ServerError.prototype);
  }
}

export default ServerError;
