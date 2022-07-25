import bcrypt from 'bcryptjs';
import { BadRequestError, UnauthorizedError, ServerError } from '../commons/http-errors';
import usersQuery from '../commons/queries/users.query';
import { usersRepository } from '../commons/repositories';

export async function setUserIdInParams(req, res, next) {
  req.params.id = req.currentUser.id;
  next();
}

export async function setAvatarData(req, res, next) {
  const { mimetype, path, originalName, url, ...rest } = req.context;
  req.context = { ...rest, avatar: url };
  next();
}

export async function unsetAvatarData(req, res, next) {
  req.context.avatar = null;
  next();
}

export async function updatePassword(req, res, next) {
  const { newPassword, currentPassword } = req.body;
  const { id } = req.currentUser;
  if (!id) throw new UnauthorizedError();
  const { password: saved } = await usersRepository.get(id);
  const isMatch = await bcrypt.compare(currentPassword, saved);
  if (!isMatch) throw new BadRequestError('Mauvais mot de passe');
  const password = await bcrypt.hash(newPassword, 10);
  const { ok } = await usersRepository.put(id, { $set: { password, updatedAt: new Date(), updatedBy: id } });
  if (!ok) throw new ServerError();
  req.body = {};
  const resource = await usersRepository.get(id, { useQuery: usersQuery });
  res.status(200).json(resource);
  return next();
}
