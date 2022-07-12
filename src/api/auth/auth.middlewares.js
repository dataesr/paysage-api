import usersService from '../users/services/users.service';
import codesService from '../users/services/codes.service';
import tokensService from '../users/services/tokens.service';
import { BadRequestError, NotFoundError } from '../commons/errors';

export async function verifyUserCredential(req, res, next) {
  const { account, password } = req.body;
  if (!await usersService.validateUserCredentials(account, password)) {
    throw new BadRequestError('Mauvaise combinaison utilisateur/mot de passe');
  }
  next();
}
export async function verifyActivationCode(req, res, next) {
  const { activationCode } = req.body;
  const userId = req.currentUser.id;
  if (!await codesService.verifyUserActivationCode(userId, activationCode)) {
    throw new BadRequestError('Code invalide');
  }
  next();
}
export async function verifyPasswordRenewalCode(req, res, next) {
  const { code } = req.body;
  const userId = req.currentUser.id;
  if (!await codesService.verifyUserPasswordRenewalCode(userId, code)) {
    throw new BadRequestError('Code invalide');
  }
  next();
}
export async function verifyRefreshToken(req, res, next) {
  req.currentUser = await tokensService.decodeUserRefreshToken(req.body.refreshToken, req.UserAgent);
  if (!req.currentUser.id) {
    throw new BadRequestError('Token invalide');
  }
  next();
}
export async function verifyUserExists(req, res, next) {
  const { account } = req.body;
  const user = await usersService.getUserByAccount(account);
  if (!user) throw new NotFoundError('Le compte n\'existe pas');
  req.currentUser = user;
  next();
}
