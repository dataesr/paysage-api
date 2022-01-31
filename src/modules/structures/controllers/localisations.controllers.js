import { client } from '../../../services/mongo.service';
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
    let localisationId;
    const session = client.startSession();
    const { result } = await session.withTransaction(async () => {
      localisationId = await structuresRepo.localisations.insert(
        structureId,
        { ...data, createdBy: userId, createdAt: now, structureId },
        { session },
      );
      const nextState = await structuresRepo.localisations.getStateById(structureId, localisationId, { session });
      await eventsRepo.insert({
        userId,
        resourceUri: `${req.path}/${localisationId}`,
        action: 'create',
        resourceId: structureId,
        resourceType: 'structures',
        subResourceId: 'localisations',
        subResourceType: localisationId,
        prevState: null,
        nextState,
      }, { session });
    });
    session.endSession();
    if (!result.ok) throw new ServerError();
    const resource = await structuresRepo.localisations.findById(structureId, localisationId);
    res.status(201).json(resource);
  },

  read: async (req, res) => {
    const { structureId, localisationId } = req.params;
    const resource = await structuresRepo.localisations.findById(structureId, parseInt(localisationId, 10));
    if (!resource) throw new NotFoundError();
    res.status(200).json(resource);
  },

  delete: async (req, res) => {
    const { structureId, localisationId } = req.params;
    const { id: userId } = req.currentUser;
    const prevState = await structuresRepo.localisations.getStateById(structureId, parseInt(localisationId, 10));
    if (!prevState) throw new NotFoundError();
    const session = client.startSession();
    const { result } = await session.withTransaction(async () => {
      await structuresRepo.localisations.deleteById(structureId, parseInt(localisationId, 10));
      await eventsRepo.insert({
        userId,
        resourceUri: `${req.path}/${localisationId}`,
        operationType: 'delete',
        resourceId: structureId,
        resourceType: 'structures',
        subResourceId: parseInt(localisationId, 10),
        subResourceType: 'localisations',
        prevState,
        nextState: null,
      }, { session });
    }).catch(() => { session.endSession(); });
    session.endSession();
    if (!result.ok) throw new ServerError();
    await structuresRepo.localisations.deleteById(structureId, parseInt(localisationId, 10));
    res.status(204).json();
  },

  update: async (req, res) => {
    const { structureId, localisationId } = req.params;
    const prevState = await structuresRepo.localisations.getStateById(structureId, parseInt(localisationId, 10));
    const { id: userId } = req.currentUser;
    const now = new Date();
    const data = { ...req.body, updatedBy: userId, updatedAt: now };
    const session = client.startSession();
    const { result } = await session.withTransaction(async () => {
      await structuresRepo.localisations.updateById(structureId, parseInt(localisationId, 10), data, { session });
      const nextState = await structuresRepo.localisations.getStateById(
        structureId,
        parseInt(localisationId, 10),
        { session },
      );
      await eventsRepo.insert({
        userId,
        resourceUri: `${req.path}/${localisationId}`,
        operationType: 'update',
        resourceId: structureId,
        resourceType: 'structures',
        subResourceId: parseInt(localisationId, 10),
        subResourceType: 'localisations',
        prevState,
        nextState,
      }, { session });
    }).catch(() => { session.endSession(); });
    session.endSession();
    if (!result.ok) throw new ServerError();
    const resource = await structuresRepo.localisations.findById(structureId, parseInt(localisationId, 10));
    res.status(200).json(resource);
  },

  list: async (req, res) => {
    const { structureId } = req.params;
    const { filters, ...options } = req.query;
    const { data, totalCount } = await structuresRepo.localisations.find(structureId, filters, options);
    res.status(200).json({ data, totalCount: totalCount || 0 });
  },
};
