import MonsterError from './monster.error';

class BadRequestError extends MonsterError {
  constructor(message, errors = []) {
    super(message || 'Bad request');
    this.errors = errors;
    this.statusCode = 400;
  }
}

export default BadRequestError;
