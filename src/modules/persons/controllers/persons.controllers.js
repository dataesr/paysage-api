import { client } from '../../../services/mongo.service';
import { NotFoundError, ServerError } from '../../commons/errors';
import personsRepo from '../persons.repo';
import eventsRepo from '../../commons/repositories/events.repo';
import catalogueRepo from '../../commons/repositories/catalogue.repo';

export default {
  create: async (req, res) => {
    const id = await catalogueRepo.getUniqueId('persons');
    const { id: userId } = req.currentUser;
    const data = { id, ...req.body, createdBy: userId };
    const session = client.startSession();
    const { result } = await session.withTransaction(async () => {
      await personsRepo.insert(data, { session });
      const nextState = await personsRepo.getStateById(id, { session });
      await eventsRepo.insert({
        userId,
        resourceUri: `${req.path}/${id}`,
        action: 'create',
        resourceId: id,
        resourceType: 'persons',
        subResourceId: null,
        subResourceType: null,
        prevState: null,
        nextState,
      }, { session });
    }).catch(() => session.endSession());
    session.endSession();
    if (!result.ok) throw new ServerError();
    const resource = await personsRepo.findById(id);
    res.status(201).json(resource);
  },

  read: async (req, res) => {
    const { personId } = req.params;
    const resource = await personsRepo.findById(personId);
    if (!resource) throw new NotFoundError();
    res.status(200).json(resource);
  },

  delete: async (req, res) => {
    const { personId } = req.params;
    const { id: userId } = req.currentUser;
    const prevState = await personsRepo.getStateById(personId);
    if (!prevState) throw new NotFoundError();
    const session = client.startSession();
    const { result } = await session.withTransaction(async () => {
      await personsRepo.deleteById(personId);
      await eventsRepo.insert({
        userId,
        resourceUri: req.path,
        operationType: 'delete',
        resourceId: personId,
        resourceType: 'persons',
        prevState,
        nextState: null,
      }, { session });
    }).catch(() => session.endSession());
    session.endSession();
    if (!result.ok) throw new ServerError();
    res.status(204).json();
  },

  update: async (req, res) => {
    const { personId } = req.params;
    const data = req.body;
    const { id: userId } = req.currentUser;
    const prevState = await personsRepo.findById(personId);
    const session = client.startSession();
    const { result } = await session.withTransaction(async () => {
      await personsRepo.updateById(personId, { ...data, updatedBy: userId });
      const nextState = await personsRepo.getStateById(personId, { session });
      await eventsRepo.insert({
        userId,
        resourceUri: req.path,
        operationType: 'update',
        resourceId: personId,
        resourceType: 'persons',
        prevState,
        nextState,
      }, { session });
    }).catch(() => session.endSession());
    session.endSession();
    if (!result.ok) throw new ServerError();
    const resource = await personsRepo.findById(personId);
    res.status(200).json(resource);
  },

  list: async (req, res) => {
    const { filters, ...options } = req.query;
    const { data, totalCount } = await personsRepo.find({ ...filters }, options);
    res.status(200).json({ data, totalCount: totalCount || 0 });
  },
};
