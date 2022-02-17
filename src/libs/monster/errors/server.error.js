import MonsterError from './monster.error';

class ServerError extends MonsterError {
  constructor(message, errors = []) {
    super(message || 'Server error', errors);
    this.statusCode = 500;
  }
}

export default ServerError;
