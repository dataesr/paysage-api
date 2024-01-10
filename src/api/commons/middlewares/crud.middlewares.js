import { NotFoundError, ServerError } from '../http-errors';

const read = (repository, useQuery, keepDeleted = false) => async (req, res, next) => {
  const { id } = req.params;
  const resource = await repository.get(id, { useQuery, keepDeleted });
  if (!resource) throw new NotFoundError();
  res.status(200).json(resource);
  return next();
};

const list = (repository, useQuery, keepDeleted = false) => async (req, res, next) => {
  const { params, query } = req;
  const { limit, skip, sort } = query;
  let { filters } = query;
  const { resourceId } = params;
  if (resourceId) { filters = { ...filters, resourceId }; }
  const { data, totalCount = 0 } = await repository.find({ filters, keepDeleted, limit, skip, sort, useQuery });
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

const patch = (repository, useQuery, keepDeleted = false) => async (req, res, next) => {
  const { context, params, body } = req;
  const { id } = params;
  const exists = await repository.get(id, { keepDeleted });
  if (!exists) throw new NotFoundError();
  const { ok } = await repository.patch(id, { ...body, ...context });
  if (!ok) throw new ServerError();
  const resource = await repository.get(id, { useQuery, keepDeleted });
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

const softDelete = (repository) => async (req, res, next) => {
  const { params } = req;
  const { id } = params || {};
  const exists = await repository.get(id);
  if (!exists) throw new NotFoundError();
  const { ok } = await repository.patch(id, { isDeleted: true });
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
  softDelete,
};
