import MonsterError from './monster.error';

class NotFoundError extends MonsterError {
  constructor(message, errors = []) {
    super(message || 'Not found', errors);
    this.statusCode = 404;
  }
}

export default NotFoundError;
