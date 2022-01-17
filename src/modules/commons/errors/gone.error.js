import CustomError from './custom.error';

class Gone extends CustomError {
  constructor(message, errors = []) {
    super(message || 'Gone', errors);
    this.statusCode = 410;
    Object.setPrototypeOf(this, Gone.prototype);
  }
}

export default Gone;
