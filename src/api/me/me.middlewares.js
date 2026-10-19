import bcrypt from 'bcryptjs';
import { BadRequestError, UnauthorizedError, ServerError } from '../commons/http-errors';
import usersQuery from '../commons/queries/users.query';
import { tokensRepository, usersRepository } from '../commons/repositories';

export async function setUserIdInParams(req, res, next) {
  if (!req.currentUser.id) throw new UnauthorizedError();
  req.params.id = req.currentUser.id;
  next();
}

// The /me routes write to the user's own document: only the listed body fields may reach it.
export function keepBodyFields(fields) {
  return (req, res, next) => {
    req.body = Object.fromEntries(Object.entries(req.body || {}).filter(([field]) => fields.includes(field)));
    next();
  };
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
  // Sign out the other sessions: only the current user agent keeps its refresh token.
  await tokensRepository.remove({ userId: id, userAgent: { $ne: req.headers['user-agent'] } });
  req.body = {};
  const resource = await usersRepository.get(id, { useQuery: usersQuery });
  res.status(200).json(resource);
  return next();
}
