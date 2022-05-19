import { NotFoundError, ServerError } from '../../../libs/http-errors';

const read = (repository, useQuery) => async (req, res, next) => {
  const { id } = req.params;
  const resource = await repository.get(id, { useQuery });
  if (!resource) throw new NotFoundError();
  res.status(200).json(resource);
  return next();
};

const list = (repository, useQuery) => async (req, res, next) => {
  const { query } = req;
  const { filters, limit, skip, sort } = query;
  const { data, totalCount = 0 } = await repository.find({ filters, limit, skip, sort, useQuery });
  res.status(200).json({ data, totalCount });
  return next();
};

const create = (repository, useQuery) => async (req, res, next) => {
  const { body, context, params } = req;
  const insertedId = await repository.create({ ...body, ...params, ...context });
  if (!insertedId) throw new ServerError();
  const resource = await repository.get(insertedId, { useQuery });
  res.status(201).json(resource);
  return next();
};

const patch = (repository, useQuery) => async (req, res, next) => {
  const { context, params, body } = req;
  const { id } = params;
  const exists = await repository.get(id);
  if (!exists) throw new NotFoundError();
  const { ok } = await repository.patch(id, { ...body, ...context });
  if (!ok) throw new ServerError();
  const resource = await repository.get(id, { useQuery });
  res.status(200).json(resource);
  return next();
};

const remove = (repository) => async (req, res, next) => {
  const { params } = req;
  const { id } = params || {};
  const exists = await repository.get(id);
  if (!exists) throw new NotFoundError();
  const { ok } = await repository.remove(id);
  if (!ok) throw new ServerError();
  res.status(204).json();
  return next();
};

export default {
  create,
  list,
  patch,
  read,
  remove,
};
