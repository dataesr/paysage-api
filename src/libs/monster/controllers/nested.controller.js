import mongodb from 'mongodb';

import { BadRequestError, NotFoundError } from '../../http-errors';

class NestedController {
  constructor(repository, { catalog, eventStore, storeContext } = {}) {
    this._catalog = catalog;
    this._eventStore = eventStore;
    this._repository = repository;
    this._storeContext = storeContext;
  }

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
    const { id, resourceId, statusCode = 200 } = req.params;
    if (!await this._repository.checkResource(resourceId)) throw new NotFoundError(`Resource ${resourceId} does not exist`);
    const resource = await this._repository.get(resourceId, id, { useQuery: 'readQuery' });
    if (!resource) throw new NotFoundError();
    res.status(statusCode).json(resource);
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

  create = async (req, res, next) => {
    if (
      !req.body
      || !Object.keys(req.body).length
    ) throw new BadRequestError('Payload missing');
    const { body, ctx, params } = req;
    let { id } = ctx || {};
    const { resourceId } = params || {};
    if (!await this._repository.checkResource(resourceId)) throw new NotFoundError(`Resource ${resourceId} does not exist`);
    id = this._getId(id);
    const data = this._storeContext ? { id, ...body, ...ctx } : { id, ...body };
    await this._repository.create(resourceId, data);
    const nextState = await this._repository.get(resourceId, id, { useQuery: 'writeQuery' });
    req.event = { action: 'create', id, nextState, resourceId };
    return this.read({ params: { id, resourceId, statusCode: 201 } }, res, next);
  };

  patch = async (req, res, next) => {
    if (
      !req.body
      || !Object.keys(req.body).length
    ) throw new BadRequestError('Payload missing');
    const { body, ctx, params } = req;
    const { id, resourceId } = params || {};
    if (!await this._repository.checkResource(resourceId)) throw new NotFoundError(`Resource ${resourceId} does not exist`);
    const data = this._storeContext ? { ...body, ...ctx } : { ...body };
    const previousState = await this._repository.get(resourceId, id, { useQuery: 'writeQuery' });
    if (!previousState) throw new NotFoundError();
    const { ok } = await this._repository.patch(resourceId, id, data);
    if (ok) {
      const nextState = await this._repository.get(resourceId, id, { useQuery: 'writeQuery' });
      req.event = { action: 'patch', id, nextState, resourceId };
    }
    return this.read({ params: { id, resourceId } }, res, next);
  };

  delete = async (req, res, next) => {
    const { params } = req;
    const { id, resourceId } = params || {};
    if (!await this._repository.checkResource(resourceId)) throw new NotFoundError(`Resource ${resourceId} does not exist`);
    const previousState = await this._repository.get(resourceId, id, { useQuery: 'writeQuery' });
    if (!previousState) throw new NotFoundError();
    const { ok } = await this._repository.remove(resourceId, id);
    req.event = ok ? { action: 'delete', id, resourceId } : {};
    res.status(204).json();
    return next();
  };
}

export default NestedController;
