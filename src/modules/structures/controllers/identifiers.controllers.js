import { client } from '../../commons/services/database.service';
import { NotFoundError, ServerError } from '../../commons/errors';
import structuresRepo from '../structures.repo';
import eventsRepo from '../../commons/repositories/events.repo';

export default {
  create: async (req, res) => {
    const { structureId } = req.params;
    const { id: userId } = req.currentUser;
    const now = new Date();
    const data = req.body;
    if (!await structuresRepo.findById(structureId)) throw new NotFoundError();
    let identifierId;
    const session = client.startSession();
    const { result } = await session.withTransaction(async () => {
      identifierId = await structuresRepo.identifiers.insert(
        structureId, { ...data, createdBy: userId, createdAt: now }, { session },
      );
      const nextState = await structuresRepo.identifiers.getStateById(structureId, identifierId, { session });
      await eventsRepo.insert({
        userId,
        resourceUri: `${req.path}/${identifierId}`,
        action: 'create',
        resourceId: structureId,
        resourceType: 'structures',
        subResourceId: 'identifiers',
        subResourceType: identifierId,
        prevState: null,
        nextState,
      }, { session });
    });
    session.endSession();
    if (!result.ok) throw new ServerError();
    const resource = await structuresRepo.identifiers.findById(structureId, identifierId);
    res.status(201).json(resource);
  },

  read: async (req, res) => {
    const { structureId, identifierId } = req.params;
    const resource = await structuresRepo.identifiers.findById(structureId, parseInt(identifierId, 10));
    if (!resource) throw new NotFoundError();
    res.status(200).json(resource);
  },

  delete: async (req, res) => {
    const { structureId, identifierId } = req.params;
    const { id: userId } = req.currentUser;
    const prevState = await structuresRepo.identifiers.getStateById(structureId, parseInt(identifierId, 10));
    if (!prevState) throw new NotFoundError();
    const session = client.startSession();
    const { result } = await session.withTransaction(async () => {
      await structuresRepo.identifiers.deleteById(structureId, parseInt(identifierId, 10));
      await eventsRepo.insert({
        userId,
        resourceUri: `${req.path}/${identifierId}`,
        operationType: 'delete',
        resourceId: structureId,
        resourceType: 'structures',
        subResourceId: parseInt(identifierId, 10),
        subResourceType: 'identifiers',
        prevState,
        nextState: null,
      }, { session });
    }).catch(() => { session.endSession(); });
    session.endSession();
    if (!result.ok) throw new ServerError();
    await structuresRepo.identifiers.deleteById(structureId, parseInt(identifierId, 10));
    res.status(204).json();
  },

  update: async (req, res) => {
    const { structureId, identifierId } = req.params;
    const prevState = await structuresRepo.identifiers.getStateById(structureId, parseInt(identifierId, 10));
    const { id: userId } = req.currentUser;
    const now = new Date();
    const data = { ...req.body, updatedBy: userId, updatedAt: now };
    const session = client.startSession();
    const { result } = await session.withTransaction(async () => {
      await structuresRepo.identifiers.updateById(structureId, parseInt(identifierId, 10), data, { session });
      const nextState = await structuresRepo.identifiers.getStateById(
        structureId, parseInt(identifierId, 10), { session },
      );
      await eventsRepo.insert({
        userId,
        resourceUri: `${req.path}/${identifierId}`,
        operationType: 'update',
        resourceId: structureId,
        resourceType: 'structures',
        subResourceId: parseInt(identifierId, 10),
        subResourceType: 'identifiers',
        prevState,
        nextState,
      }, { session });
    }).catch(() => { session.endSession(); });
    session.endSession();
    if (!result.ok) throw new ServerError();
    const resource = await structuresRepo.identifiers.findById(structureId, parseInt(identifierId, 10));
    res.status(200).json(resource);
  },

  list: async (req, res) => {
    const { structureId } = req.params;
    const { filters, ...options } = req.query;
    const { data, totalCount } = await structuresRepo.identifiers.find(structureId, filters, options);
    res.status(200).json({ data, totalCount: totalCount || 0 });
  },
};
