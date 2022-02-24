import { UnauthorizedError, ForbiddenError } from '../../../libs/monster/errors';

export function requireAuth(req, res, next) {
  if (!req.currentUser.id) {
    throw new UnauthorizedError('Vous devez être connecté');
  }
  return next();
}

export function requireActiveUser(req, res, next) {
  if (!req.currentUser.id) {
    throw new UnauthorizedError('Vous devez être connecté');
  }
  if (!req.currentUser.active) {
    throw new ForbiddenError('Utilisateur inactif');
  }
  return next();
}

export function requireRoles(roles) {
  return (req, res, next) => {
    if (!req.currentUser.id) {
      throw new UnauthorizedError('Vous devez être connecté');
    }
    if (!req.currentUser.active) {
      throw new ForbiddenError('Utilisateur inactif');
    }
    if (!roles.includes(req.currentUser.role)) {
      throw new ForbiddenError('Droits utilisateurs insuffisants');
    }
    return next();
  };
}
