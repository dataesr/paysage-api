import { client } from '../commons/services/database.service';
import { NotFoundError, ServerError } from '../commons/errors';
import categoriesRepo from './categories.repo';
import eventsRepo from '../commons/repositories/events.repo';
import catalogueRepo from '../commons/repositories/catalogue.repo';

export default {
  create: async (req, res) => {
    const id = await catalogueRepo.getUniqueId('categories');
    const { id: userId } = req.currentUser;
    const data = { id, ...req.body, createdBy: userId };
    const session = client.startSession();
    const { result } = await session.withTransaction(async () => {
      await categoriesRepo.insert(data, { session });
      const nextState = await categoriesRepo.getStateById(id, { session });
      await eventsRepo.insert({
        userId,
        resourceUri: `${req.path}/${id}`,
        action: 'create',
        resourceId: id,
        resourceType: 'categories',
        subResourceId: null,
        subResourceType: null,
        prevState: null,
        nextState,
      }, { session });
    }).catch(() => session.endSession());
    session.endSession();
    if (!result.ok) throw new ServerError();
    const resource = await categoriesRepo.findById(id);
    res.status(201).json(resource);
  },

  read: async (req, res) => {
    const { categoryId } = req.params;
    const category = await categoriesRepo.findById(categoryId);
    if (!category) throw new NotFoundError();
    res.status(200).json(category);
  },

  delete: async (req, res) => {
    const { categoryId } = req.params;
    const { id: userId } = req.currentUser;
    const prevState = await categoriesRepo.getStateById(categoryId);
    if (!prevState) throw new NotFoundError();
    const session = client.startSession();
    const { result } = await session.withTransaction(async () => {
      await categoriesRepo.deleteById(categoryId);
      await eventsRepo.insert({
        userId,
        resourceUri: req.path,
        operationType: 'delete',
        resourceId: categoryId,
        resourceType: 'categories',
        prevState,
        nextState: null,
      }, { session });
    }).catch(() => session.endSession());
    session.endSession();
    if (!result.ok) throw new ServerError();
    res.status(204).json();
  },

  update: async (req, res) => {
    const { categoryId } = req.params;
    const data = req.body;
    const { id: userId } = req.currentUser;
    const prevState = await categoriesRepo.findById(categoryId);
    const session = client.startSession();
    const { result } = await session.withTransaction(async () => {
      await categoriesRepo.updateById(categoryId, { ...data, updatedBy: userId });
      const nextState = await categoriesRepo.getStateById(categoryId, { session });
      await eventsRepo.insert({
        userId,
        resourceUri: req.path,
        operationType: 'update',
        resourceId: categoryId,
        resourceType: 'categories',
        prevState,
        nextState,
      }, { session });
    }).catch(() => session.endSession());
    session.endSession();
    if (!result.ok) throw new ServerError();
    const resource = await categoriesRepo.findById(categoryId);
    res.status(200).json(resource);
  },

  list: async (req, res) => {
    const { filters, ...options } = req.query;
    const { data, totalCount } = await categoriesRepo.find({ ...filters }, options);
    res.status(200).json({ data, totalCount: totalCount || 0 });
  },
};
