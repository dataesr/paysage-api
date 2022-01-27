import { NotFoundError, ServerError } from '../errors';
import events from '../repositories/events.repo';
import catalogue from '../repositories/catalogue.repo';

export default class BaseController {
  #test = 3
  constructor(repository, { storeContext = true, storeEvent = true } = {}) {
    this._repository = repository;
    this._storeContext = storeContext;
    this._storeEvent = storeEvent;
  }

  create = async (req, res, next) => {
    const { ctx } = req;
    console.log(this.#test);
    const id = await catalogue.getUniqueId('prices');
    const data = this._storeContext ? { id, ...req.body, ...ctx } : { id, ...req.body };
    const insertedId = await this._repository.create(data);
    if (this._storeEvent) {
      const nextState = await this._repository.get(insertedId, { useModel: 'writeModel' });
      events.add({ userId: ctx.user, resource: `${req.path}/${id}`, action: 'create', nextState });
    }
    const resource = await this._repository.get(id);
    if (!resource) throw new ServerError();
    res.status(201).json(resource);
  }

  patch = async (req, res, next) => {
    const { ctx } = req;
    const { id, ...rest } = req.params;
    const data = this._storeContext ? { ...rest, ...req.body, ...ctx } : { ...rest, ...req.body };
    const prevState = await this._repository.get(id, { useModel: 'writeModel' });
    const { ok } = await this._repository.patch(id, data);
    if (ok && this._storeEvent) {
      const nextState = await this._repository.get(id, { useModel: 'writeModel' });
      events.add({ userId: ctx.user, resource: `${req.path}/${id}`, action: 'patch', prevState, nextState });
    }
    const resource = await this._repository.get(id);
    if (!resource) throw new ServerError();
    res.status(201).json(resource);
  }

  delete = async (req, res, next) => {
    const { ctx } = req;
    const { id } = req.params;
    const prevState = await this._repository.get(id, { useModel: 'writeModel' });
    const { ok } = await this._repository.remove(id);
    if (ok && this._storeEvent) {
      events.add({ userId: ctx.user, resource: `${req.path}/${id}`, action: 'remove', prevState });
    }
    const resource = await this._repository.get(id);
    if (!resource) throw new ServerError();
    res.status(201).json(resource);
  }

  read = async (req, res, next) => {
    const { id } = req.params;
    const resource = await this._repository.get(id);
    if (!resource) throw new NotFoundError();
    res.status(200).json(resource);
  }

  list = async (req, res, next) => {
    const params = req.query;
    const { data, totalCount } = await this._repository.find(params);
    res.status(200).json({ data, totalCount: totalCount || 0 });
  }
}
