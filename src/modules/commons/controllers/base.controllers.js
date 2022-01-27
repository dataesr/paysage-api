import { NotFoundError, ServerError } from '../errors';
import events from '../services/events.service';
import catalogue from '../services/catalogue.service';

export default class BaseController {
  #repository;

  #storeContext;

  #storeEvent;

  constructor(repository, { storeContext = true, storeEvent = true } = {}) {
    this.#repository = repository;
    this.#storeContext = storeContext;
    this.#storeEvent = storeEvent;
  }

  create = async (req, res) => {
    const ctx = req.ctx || {};
    const id = await catalogue.getUniqueId(this.#repository.collectionName);
    const data = this.#storeContext ? { id, ...req.body, ...ctx } : { id, ...req.body };
    const insertedId = await this.#repository.create(data);
    if (this.#storeEvent) {
      const nextState = await this.#repository.get(insertedId, { useModel: 'writeModel' });
      events.create({ userId: ctx.user, resource: `${req.path}/${id}`, action: 'create', nextState });
    }
    const resource = await this.#repository.get(id);
    if (!resource) throw new ServerError();
    res.status(201).json(resource);
  };

  patch = async (req, res) => {
    const ctx = req.ctx || {};
    const { id, ...rest } = req.params;
    const data = this.#storeContext ? { ...rest, ...req.body, ...ctx } : { ...rest, ...req.body };
    const prevState = await this.#repository.get(id, { useModel: 'writeModel' });
    const { ok } = await this.#repository.patch(id, data);
    if (ok && this.#storeEvent) {
      const nextState = await this.#repository.get(id, { useModel: 'writeModel' });
      events.create({ userId: ctx.user, resource: `${req.path}/${id}`, action: 'patch', prevState, nextState });
    }
    const resource = await this.#repository.get(id);
    if (!resource) throw new ServerError();
    res.status(200).json(resource);
  };

  delete = async (req, res) => {
    const ctx = req.ctx || {};
    const { id } = req.params;
    const prevState = await this.#repository.get(id, { useModel: 'writeModel' });
    const { ok } = await this.#repository.remove(id);
    if (ok && this.#storeEvent) {
      events.create({ userId: ctx.user, resource: `${req.path}/${id}`, action: 'delete', prevState });
    }
    res.status(204).json();
  };

  read = async (req, res) => {
    const { id } = req.params;
    const resource = await this.#repository.get(id);
    if (!resource) throw new NotFoundError();
    res.status(200).json(resource);
  };

  list = async (req, res) => {
    const params = req.query;
    const { data, totalCount } = await this.#repository.find(params);
    res.status(200).json({ data, totalCount: totalCount || 0 });
  };
}
