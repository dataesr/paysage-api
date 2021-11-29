import usersService from './services/users.service';
import { BadRequestError } from '../commons/errors';

export async function verifyCurrentPassword(req, res, next) {
  const { currentPassword: password } = req.body;
  const account = req.currentUser.email;
  if (!await usersService.validateUserCredentials(account, password)) {
    throw new BadRequestError('Mot de passe érroné');
  }
  next();
}
