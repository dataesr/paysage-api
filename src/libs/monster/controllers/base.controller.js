import { BadRequestError, NotFoundError } from '../../http-errors';

class BaseController {
  constructor(repository, { catalog, storeContext } = {}) {
    this._catalog = catalog;
    this._repository = repository;
    this._storeContext = storeContext;
  }

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
    const { body, ctx } = req;
    let { id } = ctx || {};
    id = id || await this._catalog.getUniqueId(this._repository.collectionName);
    const data = this._storeContext ? { id, ...body, ...ctx } : { id, ...body };
    await this._repository.create(data);
    const nextState = await this._repository.get(id, { useQuery: 'writeQuery' });
    req.event = { action: 'create', id, nextState };
    return this.read({ params: { id, statusCode: 201 } }, res, next);
  };

  patch = async (req, res, next) => {
    if (
      !req.body
      || !Object.keys(req.body).length
    ) throw new BadRequestError('Payload missing');
    const { body, ctx, params } = req;
    const { id } = params || {};
    const previousState = await this._repository.get(id, { useQuery: 'writeQuery' });
    if (!previousState) throw new NotFoundError();
    const data = this._storeContext ? { ...body, ...ctx } : { ...body };
    const { ok } = await this._repository.patch(id, data);
    if (ok) {
      const nextState = await this._repository.get(id, { useQuery: 'writeQuery' });
      req.event = { action: 'patch', id, nextState, previousState };
    }
    return this.read({ params: { id } }, res, next);
  };

  delete = async (req, res, next) => {
    const { params } = req;
    const { id } = params || {};
    const previousState = await this._repository.get(id, { useQuery: 'writeQuery' });
    if (!previousState) throw new NotFoundError();
    const { ok } = await this._repository.remove(id);
    req.event = ok ? { action: 'delete', id, previousState } : {};
    res.status(204).json();
    return next();
  };
}

export default BaseController;
