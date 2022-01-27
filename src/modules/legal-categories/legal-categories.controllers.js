import { client } from '../commons/services/database.service';
import { BadRequestError, NotFoundError, ServerError } from '../commons/errors';
import legalCategoriesRepo from './legal-categories.repo';
import officialDocumentsRepo from '../official-documents/official-documents.repo';
import eventsRepo from '../commons/repositories/events.repo';
import catalogueRepo from '../commons/repositories/catalogue.repo';

export default {
  create: async (req, res) => {
    const id = await catalogueRepo.getUniqueId('legal-categories');
    const { id: userId } = req.currentUser;
    const data = { id, ...req.body, createdBy: userId };
    const { officialDocumentId } = req.body;
    if (officialDocumentId && !await officialDocumentsRepo.exists(officialDocumentId)) {
      throw new BadRequestError(
        null, [{ path: '.body.officialDocumentId', message: 'Official document does not exists' }],
      );
    }
    const session = client.startSession();
    const { result } = await session.withTransaction(async () => {
      await legalCategoriesRepo.insert(data, { session });
      const nextState = await legalCategoriesRepo.getStateById(id, { session });
      await eventsRepo.insert({
        userId,
        resourceUri: `${req.path}/${id}`,
        action: 'create',
        resourceId: id,
        resourceType: 'legal-categories',
        subResourceId: null,
        subResourceType: null,
        prevState: null,
        nextState,
      }, { session });
    }).catch(() => session.endSession());
    session.endSession();
    if (!result.ok) throw new ServerError();
    const resource = await legalCategoriesRepo.findById(id);
    res.status(201).json(resource);
  },

  read: async (req, res) => {
    const { legalCategoryId } = req.params;
    const resource = await legalCategoriesRepo.findById(legalCategoryId);
    if (!resource) throw new NotFoundError();
    res.status(200).json(resource);
  },

  delete: async (req, res) => {
    const { legalCategoryId } = req.params;
    const { id: userId } = req.currentUser;
    const prevState = await legalCategoriesRepo.getStateById(legalCategoryId);
    if (!prevState) throw new NotFoundError();
    const session = client.startSession();
    const { result } = await session.withTransaction(async () => {
      await legalCategoriesRepo.deleteById(legalCategoryId);
      await eventsRepo.insert({
        userId,
        resourceUri: req.path,
        operationType: 'delete',
        resourceId: legalCategoryId,
        resourceType: 'legal-categories',
        prevState,
        nextState: null,
      }, { session });
    }).catch(() => session.endSession());
    session.endSession();
    if (!result.ok) throw new ServerError();
    res.status(204).json();
  },

  update: async (req, res) => {
    const { legalCategoryId } = req.params;
    const data = req.body;
    const { id: userId } = req.currentUser;
    const { officialDocumentId } = req.body;
    if (officialDocumentId && !await officialDocumentsRepo.exists(officialDocumentId)) {
      throw new BadRequestError(
        null, [{ path: '.body.officialDocumentId', message: 'Official document does not esxists' }],
      );
    }
    const prevState = await legalCategoriesRepo.findById(legalCategoryId);
    const session = client.startSession();
    const { result } = await session.withTransaction(async () => {
      await legalCategoriesRepo.updateById(legalCategoryId, { ...data, updatedBy: userId });
      const nextState = await legalCategoriesRepo.getStateById(legalCategoryId, { session });
      await eventsRepo.insert({
        userId,
        resourceUri: req.path,
        operationType: 'update',
        resourceId: legalCategoryId,
        resourceType: 'legal-categories',
        prevState,
        nextState,
      }, { session });
    }).catch(() => session.endSession());
    session.endSession();
    if (!result.ok) throw new ServerError();
    const resource = await legalCategoriesRepo.findById(legalCategoryId);
    res.status(200).json(resource);
  },

  list: async (req, res) => {
    const { filters, ...options } = req.query;
    const { data, totalCount } = await legalCategoriesRepo.find({ ...filters }, options);
    res.status(200).json({ data, totalCount: totalCount || 0 });
  },
};
