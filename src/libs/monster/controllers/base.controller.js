import mongodb from 'mongodb';

import { BadRequestError, NotFoundError, ServerError } from '../../http-errors';

class BaseController {
  constructor(repository, { catalog, eventStore, storeContext } = {}) {
    this._catalog = catalog;
    this._eventStore = eventStore;
    this._repository = repository;
    this._storeContext = storeContext;
  }

  create = async (req, res, next) => {
    const ctx = req.ctx || {};
    if (!req.body || !Object.keys(req.body).length) throw new BadRequestError('Payload missing');
    let { id } = req.ctx;
    if (!id) {
      id = (this._catalog)
        ? await this._catalog.getUniqueId(this._repository.collectionName)
        : mongodb.ObjectId();
    }
    const payload = { id, ...req.body };
    const data = this._storeContext ? { ...payload, ...ctx } : payload;
    const insertedId = await this._repository.create(data);
    if (this._eventStore) {
      const nextState = await this._repository.get(insertedId, { useQuery: 'writeQuery' });
      this._eventStore.create({
        actor: ctx.user,
        id,
        collection: this._repository.collectionName,
        resource: req.path,
        action: 'create',
        nextState,
      });
    }
    const resource = await this._repository.get(id, { useQuery: 'readQuery' });
    if (!resource) throw new ServerError();
    res.status(201).json(resource);
    return next();
  };

  patch = async (req, res, next) => {
    const ctx = req.ctx || {};
    if (!req.body || !Object.keys(req.body).length) throw new BadRequestError('Payload missing');
    const { id } = req.params;
    const previousState = await this._repository.get(id, { useQuery: 'writeQuery' });
    if (!previousState) throw new NotFoundError();
    const data = this._storeContext ? { ...req.body, ...ctx } : { ...req.body };
    const { ok } = await this._repository.patch(id, data);
    if (ok && this._eventStore) {
      const nextState = await this._repository.get(id, { useQuery: 'writeQuery' });
      this._eventStore.create({
        actor: ctx.user,
        id,
        collection: this._repository.collectionName,
        resource: req.path,
        action: 'patch',
        previousState,
        nextState,
      });
    }
    const resource = await this._repository.get(id, { useQuery: 'readQuery' });
    if (!resource) throw new ServerError();
    res.status(200).json(resource);
    return next();
  };

  delete = async (req, res, next) => {
    const ctx = req.ctx || {};
    const { id } = req.params;
    const previousState = await this._repository.get(id, { useQuery: 'writeQuery' });
    if (!previousState) throw new NotFoundError();
    const { ok } = await this._repository.remove(id);
    if (ok && this._eventStore) {
      this._eventStore.create({
        actor: ctx.user,
        id,
        collection: this._repository.collectionName,
        resource: req.path,
        action: 'delete',
        previousState,
      });
    }
    res.status(204).json();
    return next();
  };

  read = async (req, res, next) => {
    const { id } = req.params;
    const resource = await this._repository.get(id, { useQuery: 'readQuery' });
    if (!resource) throw new NotFoundError();
    res.status(200).json(resource);
    return next();
  };

  list = async (req, res, next) => {
    const { query } = req;
    const { data, totalCount } = await this._repository.find({ ...query, useQuery: 'readQuery' });
    res.status(200).json({ data, totalCount: totalCount || 0 });
    return next();
  };

  events = async (req, res, next) => {
    const { query } = req;
    const { id } = req.params;
    const { filters, ...options } = query;
    const { data, totalCount } = await this._eventStore.find({
      ...options,
      useQuery: 'readQuery',
      filters: { ...filters, id },
    });
    res.status(200).json({ data, totalCount: totalCount || 0 });
    return next();
  };
}

export default BaseController;
