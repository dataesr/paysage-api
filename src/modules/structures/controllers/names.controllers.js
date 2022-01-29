import { client } from '../../commons/services/database.service';
import { BadRequestError, NotFoundError, ServerError } from '../../commons/errors';
import structuresRepo from '../structures.repo';
import eventsRepo from '../../commons/repositories/events.repo';

export default {
  create: async (req, res) => {
    const { structureId } = req.params;
    const { id: userId } = req.currentUser;
    const now = new Date();
    const data = req.body;
    if (!await structuresRepo.findById(structureId)) throw new NotFoundError();
    let nameId;
    const session = client.startSession();
    const { result } = await session.withTransaction(async () => {
      nameId = await structuresRepo.names.insert(
        structureId, { ...data, createdBy: userId, createdAt: now, structureId }, { session },
      );
      const nextState = await structuresRepo.names.getStateById(structureId, nameId, { session });
      await eventsRepo.insert({
        userId,
        resourceUri: `${req.path}/${nameId}`,
        action: 'create',
        resourceId: structureId,
        resourceType: 'structures',
        subResourceId: 'names',
        subResourceType: nameId,
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
    const clNameId = parseInt(nameId, 10);
    const structure = await structuresRepo.findById(structureId);
    const { id: userId } = req.currentUser;
    const prevState = await structuresRepo.names.getStateById(structureId, clNameId);
    if (!prevState) throw new NotFoundError();
    const session = client.startSession();

    if (Object.keys(req.body).length > 0) {
      const resource = await structuresRepo.names.findById(structureId, clNameId);
      const key = Object.keys(req.body)[0];
      const newArray = resource[key].filter((item) => (item !== req.body[key]));
      const newData = { ...resource, ...{ [key]: newArray } };

      const { result } = await session.withTransaction(async () => {
        await structuresRepo.names.updateById(structureId, clNameId, newData, { session });
        const nextState = await structuresRepo.names.getStateById(structureId, clNameId, { session });
        await eventsRepo.insert({
          userId,
          resourceUri: `${req.path}/${nameId}`,
          operationType: 'update',
          resourceId: structureId,
          resourceType: 'structures',
          subResourceId: clNameId,
          subResourceType: 'names',
          prevState,
          nextState,
        }, { session });
      }).catch(() => {
        session.endSession();
      });
      session.endSession();
      if (!result.ok) throw new ServerError();
      const newResource = await structuresRepo.names.findById(structureId, clNameId);
      res.status(200).json(newResource);
    } else {
      if (structure.currentName.id === clNameId) {
        throw new BadRequestError(
          null,
          [{
            path: '.',
            message: 'Cannot delete this name as it is defined as current. Set another current name to delete',
          }],
        );
      }

      const { result } = await session.withTransaction(async () => {
        await structuresRepo.names.deleteById(structureId, clNameId);
        await eventsRepo.insert({
          userId,
          resourceUri: `${req.path}/${nameId}`,
          operationType: 'delete',
          resourceId: structureId,
          resourceType: 'structures',
          subResourceId: clNameId,
          subResourceType: 'names',
          prevState,
          nextState: null,
        }, { session });
      }).catch(() => {
        session.endSession();
      });

      session.endSession();
      if (!result.ok) throw new ServerError();
      await structuresRepo.names.deleteById(structureId, clNameId);
      res.status(204).json();
    }
  },

  update: async (req, res) => {
    const { structureId, nameId } = req.params;
    const prevState = await structuresRepo.names.getStateById(structureId, parseInt(nameId, 10));
    if (!prevState) throw new NotFoundError();
    const { id: userId } = req.currentUser;
    const now = new Date();
    const data = { ...req.body, updatedBy: userId, updatedAt: now };
    const session = client.startSession();
    const { result } = await session.withTransaction(async () => {
      await structuresRepo.names.updateById(structureId, parseInt(nameId, 10), data, { session });
      const nextState = await structuresRepo.names.getStateById(structureId, parseInt(nameId, 10), { session });
      await eventsRepo.insert({
        userId,
        resourceUri: `${req.path}/${nameId}`,
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

  put: async (req, res) => {
    const { structureId, nameId } = req.params;
    const key = Object.keys(req.body)[0];
    const clNameId = parseInt(nameId, 10);
    const { id: userId } = req.currentUser;
    const prevState = await structuresRepo.names.getStateById(structureId, clNameId);
    if (!prevState) throw new NotFoundError();

    const session = client.startSession();
    const resource = await structuresRepo.names.findById(structureId, clNameId);
    const newObj = { [key]: [...resource[key], req.body[key]] };
    const newData = { ...resource, ...newObj };

    const { result } = await session.withTransaction(async () => {
      await structuresRepo.names.updateById(structureId, clNameId, newData, { session });
      const nextState = await structuresRepo.names.getStateById(structureId, clNameId, { session });
      await eventsRepo.insert({
        userId,
        resourceUri: `${req.path}/${nameId}`,
        operationType: 'update',
        resourceId: structureId,
        resourceType: 'structures',
        subResourceId: clNameId,
        subResourceType: 'names',
        prevState,
        nextState,
      }, { session });
    }).catch(() => {
      session.endSession();
    });
    session.endSession();
    if (!result.ok) throw new ServerError();
    const newResource = await structuresRepo.names.findById(structureId, clNameId);
    res.status(200).json(newResource);
  },

  list: async (req, res) => {
    const { structureId } = req.params;
    const { filters, ...options } = req.query;
    const { data, totalCount } = await structuresRepo.names.find(structureId, filters, options);
    res.status(200).json({ data, totalCount: totalCount || 0 });
  },
};
