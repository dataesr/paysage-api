import { ForbiddenError, UnauthorizedError } from '../http-errors';

export function requireAuth(req, res, next) {
  if (['testing'].includes(process.env.NODE_ENV)) return next();
  if (['/signup', '/signin', '/token', '/recovery/password'].includes(req.path)) return next();
  if (req.path.startsWith('/assets/avatars')) return next();
  if (req.path.startsWith('/assets/logos')) return next();
  if (!req?.currentUser?.id) {
    throw new UnauthorizedError('You must be connected');
  }
  return next();
}

export function requireActiveUser(req, res, next) {
  if (['development', 'testing'].includes(process.env.NODE_ENV)) return next();
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
    if (['development', 'testing'].includes(process.env.NODE_ENV)) return next();
    if (!req.currentUser.id) {
      throw new UnauthorizedError('You must be connected');
    }
    if (req.currentUser.isDeleted) {
      throw new ForbiddenError('Inactive user');
    }
    if (!roles.includes(req.currentUser.role)) {
      throw new ForbiddenError('Insufficient user rights');
    }
    return next();
  };
}
