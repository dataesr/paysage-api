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
        action: 'insert',
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

  // read: async (req, res) => {
  //   const { structureId } = req.params;
  //   const structure = await structuresRepo.findById(structureId);
  //   if (!structure) throw new NotFoundError();
  //   res.status(200).json(structure);
  // },

  // update: async (req, res) => {
  //   const session = client.startSession();
  //   const { structureId } = req.params;
  //   const data = req.body;
  //   const prevState = await structuresRepo.getRowModel(structureId);
  //   const { result } = await session.withTransaction(async () => {
  //     await structuresRepo.updateById(structureId, data);
  //     const nextState = await structuresRepo.getRowModel(structureId, { session });
  //     await eventsRepo.insert({
  //       userId: req.currentUser.id,
  //       timestamp: new Date(),
  //       operationType: 'update',
  //       resourceId: structureId,
  //       resourceType: 'structures',
  //       prevState,
  //       nextState,
  //     }, { session });
  //   }).catch(async () => session.endSession());
  //   session.endSession();
  //   if (!result.ok) throw new ServerError();
  //   const resource = await structuresRepo.findById(structureId);
  //   res.status(200).json(resource);
  // },

  // list: async (req, res) => {
  //   const { filters, ...options } = req.query;
  //   const { data, totalCount } = await structuresRepo.find(filters, options);
  //   res.status(200).json({ data, totalCount });
  // },
};
