import { client } from '../../commons/services/database.service';
import { BadRequestError, NotFoundError, ServerError } from '../../commons/errors';
import structuresRepo from '../structures.repo';
import eventsRepo from '../../commons/repositories/events.repo';

export default {
  update: async (req, res) => {
    const session = client.startSession();
    const { structureId } = req.params;
    const { redirection, status } = req.body;
    const structure = await structuresRepo.findById(structureId);
    if (!structure) throw new NotFoundError();
    if (redirection && status !== 'redirected') throw new BadRequestError();
    if (status === 'redirected' && !redirection) throw new BadRequestError();
    if (redirection && !await structuresRepo.exists(redirection)) {
      throw new BadRequestError(
        'Validation failed',
        [{ path: 'body.redirection', message: 'redirection does not exists' }],
      );
    }
    if (!await structuresRepo.exists(structureId)) throw new NotFoundError();
    // delete expiresAt when status is not draft
    const { result } = await session.withTransaction(async () => {
      await structuresRepo.updateById(structureId, { redirection, status }, { session });
      const prevState = await structuresRepo.findById(structureId, { projection: { redirection, status }, session });
      await eventsRepo.insert({
        userId: req.currentUser.id,
        resourceUri: req.path,
        timestamp: new Date(),
        operationType: 'update',
        resourceId: structureId,
        resourceType: 'structures',
        subResourceType: 'status',
        subResourceId: null,
        prevState,
        nextState: { redirection, status },
      }, { session });
    }).catch(async () => session.endSession());
    session.endSession();
    if (!result.ok) throw new ServerError();
    const resource = await structuresRepo.findById(structureId);
    res.status(200).json(resource);
  },
};
