import { client } from '../commons/services/database.service';
import { NotFoundError, ServerError } from '../commons/errors';
import officialDocumentsRepo from './official-documents.repo';
import eventsRepo from '../commons/repositories/events.repo';
import catalogueRepo from '../commons/repositories/catalogue.repo';

export default {
  create: async (req, res) => {
    const id = await catalogueRepo.getUniqueId('official-documents');
    const { id: userId } = req.currentUser;
    const data = { id, ...req.body, createdBy: userId };
    const session = client.startSession();
    const { result } = await session.withTransaction(async () => {
      await officialDocumentsRepo.insert(data, { session });
      await eventsRepo.insert({
        userId,
        resourceUri: `${req.path}/${id}`,
        action: 'create',
        resourceId: id,
        resourceType: 'structures',
        subResourceId: null,
        subResourceType: null,
        prevState: null,
        nextState: req.body,
      }, { session });
    }).catch(() => session.endSession());
    session.endSession();
    if (!result.ok) throw new ServerError();
    const resource = await officialDocumentsRepo.findById(id);
    res.status(201).json(resource);
  },

  read: async (req, res) => {
    const { officialDocumentId } = req.params;
    const resource = await officialDocumentsRepo.findById(officialDocumentId);
    if (!resource) throw new NotFoundError();
    res.status(200).json(resource);
  },

  delete: async (req, res) => {
    const { officialDocumentId } = req.params;
    const { id: userId } = req.currentUser;
    const prevState = await officialDocumentsRepo.getStateById(officialDocumentId);
    console.log(prevState);
    if (!prevState) throw new NotFoundError();
    const session = client.startSession();
    const { result } = await session.withTransaction(async () => {
      await officialDocumentsRepo.deleteById(officialDocumentId);
      await eventsRepo.insert({
        userId,
        resourceUri: req.path,
        operationType: 'delete',
        resourceId: officialDocumentId,
        resourceType: 'structures',
        prevState,
        nextState: null,
      }, { session });
    }).catch(() => session.endSession());
    session.endSession();
    if (!result.ok) throw new ServerError();
    res.status(204).json();
  },

  update: async (req, res) => {
    const { officialDocumentId } = req.params;
    const { id: userId } = req.currentUser;
    const prevState = await officialDocumentsRepo.getStateById(officialDocumentId);
    const session = client.startSession();
    const { result } = await session.withTransaction(async () => {
      await officialDocumentsRepo.updateById(officialDocumentId, { ...req.body, updatedBy: userId });
      const nextState = await officialDocumentsRepo.getStateById(officialDocumentId, { session });
      await eventsRepo.insert({
        userId,
        resourceUri: req.path,
        operationType: 'update',
        resourceId: officialDocumentId,
        resourceType: 'structures',
        prevState,
        nextState,
      }, { session });
    }).catch(() => session.endSession());
    session.endSession();
    if (!result.ok) throw new ServerError();
    const resource = await officialDocumentsRepo.findById(officialDocumentId);
    res.status(200).json(resource);
  },

  list: async (req, res) => {
    const { filters, ...options } = req.query;
    const { data, totalCount } = await officialDocumentsRepo.find({ ...filters }, options);
    res.status(200).json({ data, totalCount: totalCount || 0 });
  },
};
