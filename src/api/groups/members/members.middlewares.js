import { groupMembersRepository, groupsRepository, usersRepository } from '../../commons/repositories';
import readQuery from '../../commons/queries/group-members.query';
import { ForbiddenError, NotFoundError } from '../../commons/http-errors';

export const requireGroupRoles = (roles) => async (req, res, next) => {
  const { groupId, userId } = req.params;
  if (!await groupsRepository.get(groupId)) throw new NotFoundError();
  if (!await usersRepository.get(userId)) throw new NotFoundError();
  const { role } = req.currentUser;
  if (role === 'admin') return next();
  const { data } = await groupMembersRepository.find({ filters: { userId: req.currentUser.id, groupId } });
  if (!roles.includes(data?.[0]?.role)) throw new ForbiddenError();
  return next();
};

export const addUserToGroupController = async (req, res, next) => {
  const { groupId, userId } = req.params;
  const { role = 'member' } = req.body;
  const { data: exists } = await groupMembersRepository.find({ filters: { userId, groupId }, useQuery: readQuery });
  req.context = (exists?.[0])
    ? { updatedBy: req.currentUser.id, updatedAt: new Date() }
    : { createdBy: req.currentUser.id, createdAt: new Date() };
  await groupMembersRepository.upsert(
    { userId, groupId },
    { $set: { userId, groupId, role, ...req.context } },
  );
  const { data } = await groupMembersRepository.find({ filters: { userId, groupId }, useQuery: readQuery });
  res.status(200).json(data?.[0]);
  return next();
};

export const deleteUserFromGroupController = async (req, res, next) => {
  const { groupId, userId } = req.params;
  await groupMembersRepository.deleteOne({ userId, groupId });
  res.status(204).json();
  return next();
};

export const getMembersController = async (req, res, next) => {
  const { query, params } = req;
  const { limit, skip, sort } = query;
  const { groupId } = params;
  const filters = { ...query.filters, groupId };
  const { data, totalCount = 0 } = await groupMembersRepository.find(
    { filters, limit, skip, sort, useQuery: readQuery },
  );
  res.status(200).json({ data, totalCount });
  return next();
};
