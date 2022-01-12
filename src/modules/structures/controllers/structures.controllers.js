import { client } from '../../commons/services/database.service';
import { NotFoundError, ServerError } from '../../commons/errors';
import { getUniqueId } from '../../commons/services/ids.service';
import structuresRepo from '../structures.repo';
import eventsRepo from '../../commons/repositories/events.repo';

export default {
  create: async (req, res) => {
    const session = client.startSession();
    const id = await getUniqueId();
    console.log('ID', id);
    const data = { id, ...req.body, __status: { status: 'draft' } };
    const { result } = await session.withTransaction(async () => {
      await structuresRepo.insert(data, { session });
      await eventsRepo.insert({
        userId: null,
        timestamp: '$$NOW',
        action: 'insert',
        resourceId: id,
        resourceType: 'structures',
        prevState: null,
        nextState: data,
      }, { session });
      session.endSession();
    });
    if (!result.ok) throw new ServerError();
    const structure = await structuresRepo.findById(id);
    res.status(201).json(structure);
  },

  // const session = client.startSession();
  // const { result } = await session.withTransaction(async () => {
  //   await db.collection('categories').deleteOne({ id }, { session });
  //   await db.collection('event-store').insertOne({
  //     userId: null,
  //     timestamp: '$$NOW',
  //     action: 'delete',
  //     resourceId: id,
  //     resourceType: 'category',
  //     prevState,
  //     nextState: null,
  //   }, { session });
  // })
  //   console.log(result.ok);
  // session.endSession();

  read: async (req, res) => {
    const { structureId } = req.params;
    const structure = await structuresRepo.findById(structureId);
    if (!structure) throw new NotFoundError();
    res.status(200).json(structure);
  },

  update: async (req, res) => {
    const { structureId } = req.params;
    const data = req.body;
    const structure = await structuresRepo.update(structureId, data);
    res.status(200).json(structure);
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
