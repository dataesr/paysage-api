import CustomError from './CustomError';

class MongoError extends CustomError {
  constructor(message, errors = []) {
    super(message || 'Server error', errors);
    this.statusCode = 500;
    Object.setPrototypeOf(this, MongoError.prototype);
  }

  extract() {
    const duplicated = this.message.split('index:')[1].split('dup key')[0].split('_')[0].trim();
    if (!duplicated) {
      return {
        statusCode: this.statusCode,
        error: 'Server error',
        details: this.errors,
      };
    }
    return {
      statusCode: 400,
      error: 'Bad request',
      details: [{ path: `.body.${duplicated}`, message: `${duplicated} must be unique.` }],
    };
  }
}

export default MongoError;
