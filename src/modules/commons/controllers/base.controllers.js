import { NotFoundError, ServerError } from '../errors';
import events from '../../../services/events.service';
import catalogue from '../../../services/catalogue.service';

export default class BaseController {
  constructor(repository, { storeContext = true, storeEvent = true } = {}) {
    this._repository = repository;
    this._storeContext = storeContext;
    this._storeEvent = storeEvent;
  }

  create = async (req, res) => {
    const ctx = req.ctx || {};
    const id = await catalogue.getUniqueId(this._repository.collectionName);
    const payload = { id, ...req.body, ...req.params };
    const data = this._storeContext ? { ...payload, ...ctx } : payload;
    const insertedId = await this._repository.create(data);
    if (this._storeEvent) {
      const nextState = await this._repository.get(insertedId, { useModel: 'writeModel' });
      events.create({ userId: ctx.user, resource: `${req.path}/${id}`, action: 'create', nextState });
    }
    const resource = await this._repository.get(id, { useModel: 'readModel' });
    if (!resource) throw new ServerError();
    res.status(201).json(resource);
  };

  patch = async (req, res) => {
    const ctx = req.ctx || {};
    const { id, ...rest } = req.params;
    const data = this._storeContext ? { ...rest, ...req.body, ...ctx } : { ...rest, ...req.body };
    const prevState = await this._repository.get(id, { useModel: 'writeModel' });
    if (!prevState) throw new NotFoundError();
    const { ok } = await this._repository.patch(id, data);
    if (ok && this._storeEvent) {
      const nextState = await this._repository.get(id, { useModel: 'writeModel' });
      events.create({ userId: ctx.user, resource: `${req.path}/${id}`, action: 'patch', prevState, nextState });
    }
    const resource = await this._repository.get(id, { useModel: 'readModel' });
    if (!resource) throw new ServerError();
    res.status(200).json(resource);
  };

  delete = async (req, res) => {
    const ctx = req.ctx || {};
    const { id } = req.params;
    const prevState = await this._repository.get(id, { useModel: 'writeModel' });
    if (!prevState) throw new NotFoundError();
    const { ok } = await this._repository.remove(id);
    if (ok && this._storeEvent) {
      events.create({ userId: ctx.user, resource: `${req.path}/${id}`, action: 'delete', prevState });
    }
    res.status(204).json();
  };

  read = async (req, res) => {
    const { id } = req.params;
    const resource = await this._repository.get(id, { useModel: 'readModel' });
    if (!resource) throw new NotFoundError();
    res.status(200).json(resource);
  };

  list = async (req, res) => {
    const params = req.query;
    const { data, totalCount } = await this._repository.find({ ...params, useModel: 'readModel' });
    res.status(200).json({ data, totalCount: totalCount || 0 });
  };
}
