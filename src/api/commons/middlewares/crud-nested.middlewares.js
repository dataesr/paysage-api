import { NotFoundError, ServerError } from '../../../libs/http-errors';

const read = (repository, useQuery) => async (req, res, next) => {
  const { id, resourceId } = req.params;
  if (!await repository.checkResource(resourceId)) throw new NotFoundError(`Resource ${resourceId} does not exist`);
  const resource = await repository.get(resourceId, id, { useQuery });
  if (!resource) throw new NotFoundError();
  res.status(200).json(resource);
  return next();
};

const list = (repository, useQuery) => async (req, res, next) => {
  const { params, query } = req;
  const { resourceId } = params || {};
  if (!await repository.checkResource(resourceId)) throw new NotFoundError(`Resource ${resourceId} does not exist`);
  const { data, totalCount = 0 } = await repository.find({ resourceId, ...query, useQuery });
  res.status(200).json({ data, totalCount });
  return next();
};

const create = (repository, useQuery) => async (req, res, next) => {
  const { body, context, params } = req;
  const { id } = context || {};
  const { resourceId } = params || {};
  if (!await repository.checkResource(resourceId)) throw new NotFoundError(`Resource ${resourceId} does not exist`);
  const insertedId = await repository.create(resourceId, { ...body, ...context });
  if (!insertedId) throw new ServerError();
  const resource = await repository.get(resourceId, id, { useQuery });
  res.status(201).json(resource);
  return next();
};

const patch = (repository, useQuery) => async (req, res, next) => {
  const { body, context, params } = req;
  const { id, resourceId } = params || {};
  if (!await repository.checkResource(resourceId)) throw new NotFoundError(`Resource ${resourceId} does not exist`);
  const exists = await repository.get(resourceId, id, { useQuery });
  if (!exists) throw new NotFoundError();
  const { ok } = await repository.patch(resourceId, id, { ...body, ...context });
  if (!ok) throw new ServerError();
  const resource = await repository.get(resourceId, id, { useQuery });
  res.status(200).json(resource);
  return next();
};

const remove = (repository) => async (req, res, next) => {
  const { params } = req;
  const { id, resourceId } = params || {};
  if (!await repository.checkResource(resourceId)) throw new NotFoundError(`Resource ${resourceId} does not exist`);
  const exists = await repository.get(resourceId, id);
  if (!exists) throw new NotFoundError();
  const { ok } = await repository.remove(resourceId, id);
  if (!ok) throw new ServerError();
  res.status(204).json();
  return next();
};

export default {
  read, remove, patch, create, list,
};
