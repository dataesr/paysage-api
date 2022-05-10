import { UnauthorizedError, ForbiddenError } from '../../../libs/http-errors';

export function requireAuth(req, res, next) {
  if (!req.currentUser.id) {
    throw new UnauthorizedError('You must be connected');
  }
  return next();
}

export function requireActiveUser(req, res, next) {
  if (!req.currentUser.id) {
    throw new UnauthorizedError('You must be connected');
  }
  if (!req.currentUser.active) {
    throw new ForbiddenError('Inactive user');
  }
  return next();
}

export function requireRoles(roles) {
  return (req, res, next) => {
    if (!req.currentUser.id) {
      throw new UnauthorizedError('You must be connected');
    }
    if (!req.currentUser.active) {
      throw new ForbiddenError('Inactive user');
    }
    if (!roles.includes(req.currentUser.role)) {
      throw new ForbiddenError('Insufficient user rights');
    }
    return next();
  };
}
