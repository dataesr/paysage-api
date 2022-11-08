import agenda from '../../jobs';
import { usersRepository } from '../commons/repositories';

export const setConfirmToContext = (req, res, next) => {
  req.context = { ...req.context, confirmed: true };
  return next();
};
export const notifyUser = async (req, res, next) => {
  const { id } = req.params;
  const user = await usersRepository.get(id);
  agenda.now('send confirmed email', { user });
  return next();
};
