import { usersGroupsRepository, usersGroupMembersRepository } from '../../commons/repositories';
import readQuery from '../../commons/queries/usersgroups.query';
import { BadRequestError } from '../../commons/http-errors';

export const createGroupMemberController = async (req, res, next) => {
  const { resourceId } = req.params;
  if (!req?.body?.userId) {
    const exists = await usersGroupMembersRepository.find({ userId: req.currentUser.id, resourceId });
    if (exists && exists.confirmed) throw new BadRequestError('Vous etes déja membre du groupe');
  }
  if (req.currentUser.id === req.body.id) {} else {}
  const isMember = exists?.data?.[0];
  if (isMember) { await usersGroupMembersRepository.find({ userId }); }
  const resource = await usersGroupsRepository.get(req.context.id, { useQuery: readQuery });
  res.status(201).json(resource);
  return next();
};
