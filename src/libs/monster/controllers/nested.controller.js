import mongodb from 'mongodb';

import { NotFoundError, ServerError } from '../../http-errors';

class NestedControllers {
  constructor(repository, { storeContext, eventStore, catalogue } = {}) {
    this._repository = repository;
    this._storeContext = storeContext;
    this._eventStore = eventStore;
    this._catalogue = catalogue;
  }

  create = async (req, res, next) => {
    const { resourceId } = req.params;
    if (!await this._repository.checkResource(resourceId)) throw new NotFoundError(`Resource ${resourceId} does not exist`);
    const ctx = req.ctx || {};
    let { id } = req.ctx;
    if (!id) {
      id = (this._catalogue)
        ? await this._catalogue.getUniqueId(this._repository.collectionName)
        : mongodb.ObjectId();
    }
    const payload = { id, ...req.body };
    const data = this._storeContext ? { ...payload, ...ctx } : payload;
    const insertedId = await this._repository.create(resourceId, data);
    if (this._eventStore) {
      const nextState = await this._repository.get(resourceId, insertedId, { useQuery: 'writeQuery' });
      this._eventStore.create({
        actor: ctx.user,
        id: resourceId,
        collection: this._repository.collectionName,
        field: this._repository.fieldName,
        fieldId: id,
        resource: req.path,
        action: 'create',
        nextState,
      });
    }
    const resource = await this._repository.get(resourceId, id, { useQuery: 'readQuery' });
    if (!resource) throw new ServerError();
    res.status(201).json(resource);
    return next();
  };

  patch = async (req, res, next) => {
    const { resourceId, id } = req.params;
    if (!await this._repository.checkResource(resourceId)) throw new NotFoundError(`Resource ${resourceId} does not exist`);
    const ctx = req.ctx || {};
    const data = this._storeContext ? { ...req.body, ...ctx } : { ...req.body };
    const prevState = await this._repository.get(resourceId, id, { useQuery: 'writeQuery' });
    if (!prevState) throw new NotFoundError();
    const { ok } = await this._repository.patch(resourceId, id, data);
    if (ok && this._eventStore) {
      const nextState = await this._repository.get(resourceId, id, { useQuery: 'writeQuery' });
      this._eventStore.create({
        actor: ctx.user,
        id: resourceId,
        collection: this._repository.collectionName,
        field: this._repository.fieldName,
        fieldId: id,
        resource: req.path,
        action: 'patch',
        prevState,
        nextState,
      });
    }
    const resource = await this._repository.get(resourceId, id, { useQuery: 'readQuery' });
    if (!resource) throw new ServerError();
    res.status(200).json(resource);
    return next();
  };

  delete = async (req, res, next) => {
    const { resourceId, id } = req.params;
    if (!await this._repository.checkResource(resourceId)) throw new NotFoundError(`Resource ${resourceId} does not exist`);
    const ctx = req.ctx || {};
    const prevState = await this._repository.get(resourceId, id, { useQuery: 'writeQuery' });
    if (!prevState) throw new NotFoundError();
    const { ok } = await this._repository.remove(resourceId, id);
    if (ok && this._eventStore) {
      this._eventStore.create({
        actor: ctx.user,
        id: resourceId,
        collection: this._repository.collectionName,
        field: this._repository.fieldName,
        fieldId: id,
        resource: req.path,
        action: 'delete',
        prevState,
      });
    }
    res.status(204).json();
    return next();
  };

  read = async (req, res, next) => {
    const { resourceId, id } = req.params;
    if (!await this._repository.checkResource(resourceId)) throw new NotFoundError(`Resource ${resourceId} does not exist`);
    const resource = await this._repository.get(resourceId, id, { useQuery: 'readQuery' });
    if (!resource) throw new NotFoundError();
    res.status(200).json(resource);
    return next();
  };

  list = async (req, res, next) => {
    const { resourceId } = req.params;
    if (!await this._repository.checkResource(resourceId)) throw new NotFoundError(`Resource ${resourceId} does not exist`);
    const { query } = req;
    const { data, totalCount } = await this._repository.find({ resourceId, ...query, useQuery: 'readQuery' });
    res.status(200).json({ data, totalCount: totalCount || 0 });
    return next();
  };
}

export default NestedControllers;
