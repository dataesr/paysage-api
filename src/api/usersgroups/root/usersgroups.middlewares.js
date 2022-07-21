import { client } from '../../../services/mongo.service';
import { usersGroupsRepository, usersGroupMembersRepository } from '../../commons/repositories';
import readQuery from '../../commons/queries/usersgroups.query';

export const createGroupController = async (req, res, next) => {
  const { id: userId } = req.currentUser;
  const session = client.startSession();
  await session.withTransaction(async () => {
    const id = await usersGroupsRepository.create({ ...req.body, ...req.context });
    await usersGroupMembersRepository.create({
      userId,
      confirmed: true,
      role: 'admin',
      resourceId: id,
    });
    await session.endSession();
  });
  const resource = await usersGroupsRepository.get(req.context.id, { useQuery: readQuery });
  res.status(201).json(resource);
  return next();
};
