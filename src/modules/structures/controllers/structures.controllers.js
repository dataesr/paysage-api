import { client } from '../../commons/services/database.service';
import { NotFoundError, ServerError } from '../../commons/errors';
import structuresRepo from '../structures.repo';
import eventsRepo from '../../commons/repositories/events.repo';
import catalogueRepo from '../../commons/repositories/catalogue.repo';

export default {
  create: async (req, res) => {
    const id = await catalogueRepo.getUniqueId('structures');
    const { structureStatus } = req.body;
    const { id: userId } = req.currentUser;
    const expiresAt = new Date(new Date().setDate(new Date().getDate() + 2));
    const data = { id, structureStatus, status: 'draft', redirection: null, expiresAt, createdBy: userId };
    const session = client.startSession();
    const { result } = await session.withTransaction(async () => {
      await structuresRepo.insert(data, { session });
      const nextState = await structuresRepo.findById(id, { fields: ['structureStatus'], session });
      await eventsRepo.insert({
        userId,
        resourceUri: `${req.path}/${id}`,
        action: 'create',
        resourceId: id,
        resourceType: 'structures',
        subResourceId: null,
        subResourceType: null,
        prevState: null,
        nextState,
      }, { session });
    }).catch(() => session.endSession());
    session.endSession();
    if (!result.ok) throw new ServerError();
    const resource = await structuresRepo.findById(id);
    res.status(201).json(resource);
  },

  read: async (req, res) => {
    const { structureId } = req.params;
    const structure = await structuresRepo.findById(structureId);
    if (!structure) throw new NotFoundError();
    res.status(200).json(structure);
  },

  delete: async (req, res) => {
    const { structureId } = req.params;
    const { id: userId } = req.currentUser;
    const prevState = await structuresRepo.findById(structureId, { fields: ['structureStatus'] });
    if (!prevState) throw new NotFoundError();
    const session = client.startSession();
    const { result } = await session.withTransaction(async () => {
      await structuresRepo.deleteById(structureId);
      await eventsRepo.insert({
        userId,
        resourceUri: req.path,
        operationType: 'delete',
        resourceId: structureId,
        resourceType: 'structures',
        prevState,
        nextState: null,
      }, { session });
    }).catch(() => session.endSession());
    session.endSession();
    if (!result.ok) throw new ServerError();
    res.status(200).json({});
  },

  update: async (req, res) => {
    const { structureId } = req.params;
    const data = req.body;
    const { id: userId } = req.currentUser;
    const prevState = await structuresRepo.findById(structureId, { fields: ['structureStatus'] });
    const session = client.startSession();
    const { result } = await session.withTransaction(async () => {
      await structuresRepo.updateById(structureId, { ...data, updatedByBy: userId });
      const nextState = await structuresRepo.findById(structureId, { fields: ['structureStatus'], session });
      await eventsRepo.insert({
        userId,
        resourceUri: req.path,
        operationType: 'update',
        resourceId: structureId,
        resourceType: 'structures',
        prevState,
        nextState,
      }, { session });
    }).catch(() => session.endSession());
    session.endSession();
    if (!result.ok) throw new ServerError();
    const resource = await structuresRepo.findById(structureId);
    res.status(200).json(resource);
  },

  list: async (req, res) => {
    const { filters, ...options } = req.query;
    const { data, totalCount } = await structuresRepo.find({ ...filters }, options);
    res.status(200).json({ data, totalCount: totalCount || 0 });
  },
};
