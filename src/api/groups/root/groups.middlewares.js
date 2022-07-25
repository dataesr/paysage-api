import { client } from '../../../services/mongo.service';
import { groupsRepository, groupMembersRepository } from '../../commons/repositories';
import readQuery from '../../commons/queries/groups.query';
import { ForbiddenError, NotFoundError } from '../../commons/http-errors';

export const createGroupController = async (req, res, next) => {
  const { id: userId } = req.currentUser;
  const { id: groupId } = req.context;
  const session = client.startSession();
  await session.withTransaction(async () => {
    await groupsRepository.create({ ...req.body, ...req.context });
    await groupMembersRepository.create({
      userId,
      groupId,
      role: 'owner',
      createdBy: userId,
      createdAt: new Date(),
    });
    await session.endSession();
  });
  const resource = await groupsRepository.get(groupId, { useQuery: readQuery });
  res.status(201).json(resource);
  return next();
};

export const requireGroupRoles = (roles) => async (req, res, next) => {
  if (!await groupsRepository.get(req.params.id)) throw new NotFoundError();
  const { id: userId, role } = req.currentUser;
  if (role === 'admin') return next();
  const { id: groupId } = req.params;
  const { data } = await groupMembersRepository.find({ filters: { userId, groupId } });
  if (!roles.includes(data?.[0].role)) throw new ForbiddenError();
  return next();
};
