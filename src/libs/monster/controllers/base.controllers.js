import mongodb from 'mongodb';
import { NotFoundError, ServerError } from '../errors';

export default class BaseController {
  constructor(repository, { storeContext, eventStore, catalogue } = {}) {
    this._repository = repository;
    this._storeContext = storeContext;
    this._eventStore = eventStore;
    this._catalogue = catalogue;
  }

  create = async (req, res) => {
    const ctx = req.ctx || {};
    const id = (this._catalogue)
      ? await this._catalogue.getUniqueId(this._repository.collectionName)
      : mongodb.ObjectId();
    const payload = { id, ...req.body };
    const data = this._storeContext ? { ...payload, ...ctx } : payload;
    const insertedId = await this._repository.create(data);
    if (this._eventStore) {
      const nextState = await this._repository.get(insertedId, { useQuery: 'writeQuery' });
      this._eventStore.create({
        userId: ctx.user,
        resource: `${req.path}/${id}`,
        pathParams: [...Object.values(req.params), id],
        action: 'create',
        nextState,
      });
    }
    const resource = await this._repository.get(id, { useQuery: 'readQuery' });
    if (!resource) throw new ServerError();
    res.status(201).json(resource);
  };

  patch = async (req, res) => {
    const ctx = req.ctx || {};
    const { id } = req.params;
    const data = this._storeContext ? { ...req.body, ...ctx } : { ...req.body };
    const prevState = await this._repository.get(id, { useQuery: 'writeQuery' });
    if (!prevState) throw new NotFoundError();
    const { ok } = await this._repository.patch(id, data);
    if (ok && this._eventStore) {
      const nextState = await this._repository.get(id, { useQuery: 'writeQuery' });
      this._eventStore.create({
        userId: ctx.user,
        path: req.path,
        pathParams: Object.values(req.params),
        action: 'patch',
        prevState,
        nextState,
      });
    }
    const resource = await this._repository.get(id, { useQuery: 'readQuery' });
    if (!resource) throw new ServerError();
    res.status(200).json(resource);
  };

  delete = async (req, res) => {
    const ctx = req.ctx || {};
    const { id } = req.params;
    const prevState = await this._repository.get(id, { useQuery: 'writeQuery' });
    if (!prevState) throw new NotFoundError();
    const { ok } = await this._repository.remove(id);
    if (ok && this._eventStore) {
      this._eventStore.create({
        userId: ctx.user,
        resource: req.path,
        pathParams: Object.values(req.params),
        action: 'delete',
        prevState,
      });
    }
    res.status(204).json();
  };

  read = async (req, res) => {
    const { id } = req.params;
    const resource = await this._repository.get(id, { useQuery: 'readQuery' });
    if (!resource) throw new NotFoundError();
    res.status(200).json(resource);
  };

  list = async (req, res) => {
    const { query } = req;
    const { data, totalCount } = await this._repository.find({ ...query, useQuery: 'readQuery' });
    res.status(200).json({ data, totalCount: totalCount || 0 });
  };

  events = async (req, res) => {
    const { query } = req;
    const { id } = req.params;
    const { filters, ...options } = query;
    const { data, totalCount } = await this._eventStore.find({
      ...options,
      useQuery: 'readQuery',
      filters: { ...filters, id },
    });
    res.status(200).json({ data, totalCount: totalCount || 0 });
  };
}
