import mongodb from 'mongodb';

import { BadRequestError, NotFoundError } from '../../http-errors';

class BaseController {
  constructor(repository, { catalog, eventStore, storeContext } = {}) {
    this._catalog = catalog;
    this._eventStore = eventStore;
    this._repository = repository;
    this._storeContext = storeContext;
  }

  _saveInStore = async ({ action, id, path, previousState = {}, user }) => {
    if (this._eventStore) {
      const nextState = action === 'delete' ? {} : await this._repository.get(id, { useQuery: 'writeQuery' });
      this._eventStore.create({
        action,
        actor: user,
        collection: this._repository.collectionName,
        id,
        nextState,
        previousState,
        resource: path,
      });
    }
  };

  _getId = async (id) => {
    let myId;
    if (!id) {
      myId = (this._catalog)
        ? await this._catalog.getUniqueId(this._repository.collectionName)
        : mongodb.ObjectId();
    } else {
      myId = id;
    }
    return myId;
  };

  read = async (req, res, next) => {
    const { id, statusCode = 200 } = req.params;
    const resource = await this._repository.get(id, { useQuery: 'readQuery' });
    if (!resource) throw new NotFoundError();
    res.status(statusCode).json(resource);
    return next();
  };

  list = async (req, res, next) => {
    const { query } = req;
    const { data, totalCount = 0 } = await this._repository.find({ ...query, useQuery: 'readQuery' });
    res.status(200).json({ data, totalCount });
    return next();
  };

  create = async (req, res, next) => {
    if (
      !req.body
      || !Object.keys(req.body).length
    ) throw new BadRequestError('Payload missing');
    const { body, ctx, path } = req;
    let { id } = ctx || {};
    const { user } = ctx || {};
    id = this._getId(id);
    const data = this._storeContext ? { id, ...body, ...ctx } : { id, ...body };
    await this._repository.create(data);
    await this._saveInStore({ action: 'create', id, path, user });
    return this.read({ params: { id, statusCode: 201 } }, res, next);
  };

  patch = async (req, res, next) => {
    if (
      !req.body
      || !Object.keys(req.body).length
    ) throw new BadRequestError('Payload missing');
    const { ctx, params, path } = req;
    const { user } = ctx || {};
    const { id } = params || {};
    const previousState = await this._repository.get(id, { useQuery: 'writeQuery' });
    if (!previousState) throw new NotFoundError();
    const data = this._storeContext ? { ...req.body, ...ctx } : { ...req.body };
    const { ok } = await this._repository.patch(id, data);
    if (ok) {
      await this._saveInStore({ action: 'patch', id, path, previousState, user });
    }
    return this.read({ params: { id } }, res, next);
  };

  delete = async (req, res, next) => {
    const { ctx, params, path } = req;
    const { user } = ctx || {};
    const { id } = params || {};
    const previousState = await this._repository.get(id, { useQuery: 'writeQuery' });
    if (!previousState) throw new NotFoundError();
    const { ok } = await this._repository.remove(id);
    if (ok) {
      await this._saveInStore({ action: 'delete', id, path, previousState, user });
    }
    res.status(204).json();
    return next();
  };

  events = async (req, res, next) => {
    const { query } = req;
    const { id } = req.params;
    const { filters, ...options } = query;
    const { data, totalCount = 0 } = await this._eventStore.find({
      ...options,
      useQuery: 'readQuery',
      filters: { ...filters, id },
    });
    res.status(200).json({ data, totalCount });
    return next();
  };
}

export default BaseController;
