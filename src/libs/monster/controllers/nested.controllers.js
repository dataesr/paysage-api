import mongodb from 'mongodb';
import { NotFoundError, ServerError } from '../errors';

export default class NestedControllers {
  constructor(repository, { storeContext, eventStore, catalogue } = {}) {
    this._repository = repository;
    this._storeContext = storeContext;
    this._eventStore = eventStore;
    this._catalogue = catalogue;
  }

  create = async (req, res, next) => {
    const { rid } = req.params;
    if (!await this._repository.checkResource(rid)) throw new NotFoundError(`Resource ${rid} does not exist`);
    const ctx = req.ctx || {};
    const id = (this._catalogue)
      ? await this._catalogue.getUniqueId(this._repository.collectionName)
      : mongodb.ObjectId();
    const payload = { id, ...req.body };
    const data = this._storeContext ? { ...payload, ...ctx } : payload;
    const insertedId = await this._repository.create(rid, data);
    if (this._eventStore) {
      const nextState = await this._repository.get(rid, insertedId, { useQuery: 'writeQuery' });
      this._eventStore.create({
        userId: ctx.createdAt,
        resource: `${req.path}/${insertedId}`,
        pathParams: [rid, insertedId],
        action: 'create',
        nextState,
      });
    }
    const resource = await this._repository.get(rid, id, { useQuery: 'readQuery' });
    if (!resource) throw new ServerError();
    res.status(201).json(resource);
    return next();
  };

  patch = async (req, res, next) => {
    const { rid, id } = req.params;
    if (!await this._repository.checkResource(rid)) throw new NotFoundError(`Resource ${rid} does not exist`);
    const ctx = req.ctx || {};
    const data = this._storeContext ? { ...req.body, ...ctx } : { ...req.body };
    const prevState = await this._repository.get(rid, id, { useQuery: 'writeQuery' });
    if (!prevState) throw new NotFoundError();
    const { ok } = await this._repository.patch(rid, id, data);
    if (ok && this._eventStore) {
      const nextState = await this._repository.get(rid, id, { useQuery: 'writeQuery' });
      this._eventStore.create({
        userId: ctx.updatedAt,
        path: req.path,
        pathParams: [rid, id],
        action: 'patch',
        prevState,
        nextState,
      });
    }
    const resource = await this._repository.get(rid, id, { useQuery: 'readQuery' });
    if (!resource) throw new ServerError();
    res.status(200).json(resource);
    return next();
  };

  delete = async (req, res, next) => {
    const { rid, id } = req.params;
    if (!await this._repository.checkResource(rid)) throw new NotFoundError(`Resource ${rid} does not exist`);
    const ctx = req.ctx || {};
    const prevState = await this._repository.get(rid, id, { useQuery: 'writeQuery' });
    if (!prevState) throw new NotFoundError();
    const { ok } = await this._repository.remove(rid, id);
    if (ok && this._eventStore) {
      this._eventStore.create({
        userId: ctx.updatedAt,
        resource: req.path,
        pathParams: [rid, id],
        action: 'delete',
        prevState,
      });
    }
    res.status(204).json();
    return next();
  };

  read = async (req, res, next) => {
    const { rid, id } = req.params;
    if (!await this._repository.checkResource(rid)) throw new NotFoundError(`Resource ${rid} does not exist`);
    const resource = await this._repository.get(rid, id, { useQuery: 'readQuery' });
    if (!resource) throw new NotFoundError();
    res.status(200).json(resource);
    return next();
  };

  list = async (req, res, next) => {
    const { rid } = req.params;
    if (!await this._repository.checkResource(rid)) throw new NotFoundError(`Resource ${rid} does not exist`);
    const { query } = req;
    const { data, totalCount } = await this._repository.find({ rid, ...query, useQuery: 'readQuery' });
    res.status(200).json({ data, totalCount: totalCount || 0 });
    return next();
  };
}
