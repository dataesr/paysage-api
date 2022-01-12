import { client } from '../../commons/services/database.service';
import { NotFoundError, ServerError } from '../../commons/errors';
import { getUniqueId } from '../../commons/services/ids.service';
import structuresRepo from '../structures.repo';
import eventsRepo from '../../commons/repositories/events.repo';

export default {
  create: async (req, res) => {
    const session = client.startSession();
    const id = await getUniqueId();
    const data = { id, ...req.body, __status: { status: 'draft' } };
    const { result } = await session.withTransaction(async () => {
      await structuresRepo.insert(data, { session });
      await eventsRepo.insert({
        userId: req.currentUser.id,
        timestamp: new Date(),
        action: 'insert',
        resourceId: id,
        resourceType: 'structures',
        subresourceId: null,
        subresourceType: null,
        prevState: null,
        nextState: data,
      }, { session });
    }).catch(async () => session.endSession());
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

  update: async (req, res) => {
    const session = client.startSession();
    const { structureId } = req.params;
    const data = req.body;
    const { result } = await session.withTransaction(async () => {
      await structuresRepo.update(structureId, data);
      await eventsRepo.insert({
        userId: req.currentUser.id,
        timestamp: new Date(),
        action: 'update',
        resourceId: structureId,
        resourceType: 'structures',
        prevState: null,
        nextState: data,
      }, { session });
    }).catch(async () => session.endSession());
    session.endSession();
    if (!result.ok) throw new ServerError();
    const resource = await structuresRepo.findById(structureId);
    res.status(200).json(resource);
  },

  // delete: async (req, res) => {
  //   const { structureId } = req.params;
  //   await structuresRepo.delete(structureId);
  //   res.status(204).end();
  // },

  // list: async (req, res) => {
  //   const { filters, ...options } = req.query;
  //   const { data, totalCount } = await structuresRepo.list(filters, options);
  //   res.status(200).json({ data, totalCount });
  // },
};
