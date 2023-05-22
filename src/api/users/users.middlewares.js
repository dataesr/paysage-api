import agenda from '../../jobs';
import { usersRepository } from '../commons/repositories';

export const setConfirmToContext = (req, res, next) => {
  req.context = { ...req.context, confirmed: true };
  return next();
};
export const notifyUser = async (req, res, next) => {
  const { id } = req.params;
  const user = await usersRepository.get(id);
  const { firstName, lastName, email } = user;
  agenda.now('send confirmed email', { user: { firstName, lastName, email } });
  return next();
};
