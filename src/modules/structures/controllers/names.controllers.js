import { client } from '../../commons/services/database.service';
import { NotFoundError, ServerError } from '../../commons/errors';
import structuresRepo from '../structures.repo';
import eventsRepo from '../../commons/repositories/events.repo';

export default {
  create: async (req, res) => {
    const session = client.startSession();
    const { structureId } = req.params;
    let nameId;
    const data = req.body;
    const { result } = await session.withTransaction(async () => {
      nameId = await structuresRepo.names.insert(structureId, data, { session });
      const nextState = await structuresRepo.names.findById(structureId, nameId, { session });
      await eventsRepo.insert({
        userId: req.currentUser.id,
        timestamp: new Date(),
        action: 'create',
        resourceId: structureId,
        resourceType: 'structures',
        subresourceId: 'names',
        subresourceType: nameId,
        prevState: null,
        nextState,
      }, { session });
    });
    session.endSession();
    if (!result.ok) throw new ServerError();
    const resource = await structuresRepo.names.findById(structureId, nameId);
    res.status(201).json(resource);
  },

  read: async (req, res) => {
    const { structureId, nameId } = req.params;
    const resource = await structuresRepo.names.findById(structureId, parseInt(nameId, 10));
    if (!resource) throw new NotFoundError();
    res.status(200).json(resource);
  },

  delete: async (req, res) => {
    const { structureId, nameId } = req.params;
    const resource = await structuresRepo.names.findById(structureId, parseInt(nameId, 10));
    if (!resource) throw new NotFoundError();
    await structuresRepo.names.deleteById(structureId, parseInt(nameId, 10));
    res.status(204).json();
  },

  update: async (req, res) => {
    const session = client.startSession();
    const { structureId, nameId } = req.params;
    const data = req.body;
    const prevState = await structuresRepo.names.findById(structureId, parseInt(nameId, 10));
    const { result } = await session.withTransaction(async () => {
      await structuresRepo.names.updateById(structureId, parseInt(nameId, 10), data, { session });
      const nextState = await structuresRepo.names.findById(structureId, parseInt(nameId, 10), { session });
      await eventsRepo.insert({
        userId: req.currentUser.id,
        timestamp: new Date(),
        operationType: 'update',
        resourceId: structureId,
        resourceType: 'structures',
        subResourceId: parseInt(nameId, 10),
        subResourceType: 'names',
        prevState,
        nextState,
      }, { session });
    }).catch(() => { session.endSession(); });
    session.endSession();
    if (!result.ok) throw new ServerError();
    const resource = await structuresRepo.names.findById(structureId, parseInt(nameId, 10));
    res.status(200).json(resource);
  },

  list: async (req, res) => {
    const { structureId } = req.params;
    const { filters, ...options } = req.query;
    const { data, totalCount } = await structuresRepo.names.find(structureId, filters, options);
    res.status(200).json({ data, totalCount: totalCount || 0 });
  },
};
