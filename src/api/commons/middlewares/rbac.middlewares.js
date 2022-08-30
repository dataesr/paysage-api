import { ForbiddenError, UnauthorizedError } from '../http-errors';

export function requireAuth(req, res, next) {
  if (process.env.NODE_ENV === 'development') return next();
  const nonSecurePaths = ['/signup', '/signin', '/token', '/recovery/password'];
  if (nonSecurePaths.includes(req.path)) return next();
  if (!req?.currentUser?.id) {
    throw new UnauthorizedError('You must be connected');
  }
  return next();
}

export function requireActiveUser(req, res, next) {
  if (process.env.NODE_ENV === 'development') return next();
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
    if (process.env.NODE_ENV === 'development') return next();
    if (!req.currentUser.id) {
      throw new UnauthorizedError('You must be connected');
    }
    if (req.currentUser.deleted) {
      throw new ForbiddenError('Inactive user');
    }
    if (!roles.includes(req.currentUser.role)) {
      throw new ForbiddenError('Insufficient user rights');
    }
    return next();
  };
}
