import mongodb from 'mongodb';

import { NotFoundError, ServerError } from '../../http-errors';

class NestedControllers {
  constructor(repository, { catalog, eventStore, storeContext } = {}) {
    this._catalog = catalog;
    this._eventStore = eventStore;
    this._repository = repository;
    this._storeContext = storeContext;
  }

  create = async (req, res, next) => {
    const { body, ctx, params, path } = req;
    let { id } = ctx || {};
    const { user } = ctx || {};
    const { resourceId } = params || {};
    if (!await this._repository.checkResource(resourceId)) throw new NotFoundError(`Resource ${resourceId} does not exist`);
    if (!id) {
      id = (this._catalog)
        ? await this._catalog.getUniqueId(this._repository.collectionName)
        : mongodb.ObjectId();
    }
    const data = this._storeContext ? { id, ...body, ...ctx } : { id, ...body };
    await this._repository.create(resourceId, data);
    if (this._eventStore) {
      const nextState = await this._repository.get(resourceId, id, { useQuery: 'writeQuery' });
      this._eventStore.create({
        actor: user,
        id: resourceId,
        collection: this._repository.collectionName,
        field: this._repository.fieldName,
        fieldId: id,
        resource: path,
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
    const { body, ctx, params, path } = req;
    const { user } = ctx || {};
    const { id, resourceId } = params || {};
    if (!await this._repository.checkResource(resourceId)) throw new NotFoundError(`Resource ${resourceId} does not exist`);
    const data = this._storeContext ? { ...body, ...ctx } : { ...body };
    const previousState = await this._repository.get(resourceId, id, { useQuery: 'writeQuery' });
    if (!previousState) throw new NotFoundError();
    const { ok } = await this._repository.patch(resourceId, id, data);
    if (ok && this._eventStore) {
      const nextState = await this._repository.get(resourceId, id, { useQuery: 'writeQuery' });
      this._eventStore.create({
        actor: user,
        id: resourceId,
        collection: this._repository.collectionName,
        field: this._repository.fieldName,
        fieldId: id,
        resource: path,
        action: 'patch',
        previousState,
        nextState,
      });
    }
    const resource = await this._repository.get(resourceId, id, { useQuery: 'readQuery' });
    if (!resource) throw new ServerError();
    res.status(200).json(resource);
    return next();
  };

  delete = async (req, res, next) => {
    const { ctx, params, path } = req;
    const { user } = ctx || {};
    const { id, resourceId } = params || {};
    if (!await this._repository.checkResource(resourceId)) throw new NotFoundError(`Resource ${resourceId} does not exist`);
    const previousState = await this._repository.get(resourceId, id, { useQuery: 'writeQuery' });
    if (!previousState) throw new NotFoundError();
    const { ok } = await this._repository.remove(resourceId, id);
    if (ok && this._eventStore) {
      this._eventStore.create({
        actor: user,
        id: resourceId,
        collection: this._repository.collectionName,
        field: this._repository.fieldName,
        fieldId: id,
        resource: path,
        action: 'delete',
        previousState,
      });
    }
    res.status(204).json();
    return next();
  };

  read = async (req, res, next) => {
    const { id, resourceId } = req.params;
    if (!await this._repository.checkResource(resourceId)) throw new NotFoundError(`Resource ${resourceId} does not exist`);
    const resource = await this._repository.get(resourceId, id, { useQuery: 'readQuery' });
    if (!resource) throw new NotFoundError();
    res.status(200).json(resource);
    return next();
  };

  list = async (req, res, next) => {
    const { params, query } = req;
    const { resourceId } = params || {};
    if (!await this._repository.checkResource(resourceId)) throw new NotFoundError(`Resource ${resourceId} does not exist`);
    const { data, totalCount = 0 } = await this._repository.find({ resourceId, ...query, useQuery: 'readQuery' });
    res.status(200).json({ data, totalCount });
    return next();
  };
}

export default NestedControllers;
