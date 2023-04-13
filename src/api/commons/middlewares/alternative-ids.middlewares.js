import { NotFoundError } from '../http-errors';

export function setAlternative(repository, useQuery) {
  return async (req, res, next) => {
    const { id, alternative } = req.params;
    const savedObject = await repository.get(id);
    if (!savedObject) throw new NotFoundError();
    const { alternativePaysageIds = [] } = savedObject;
    const body = { ...req.context, alternativePaysageIds: [...alternativePaysageIds, alternative] };
    const resource = await repository.patch(id, body, { useQuery });
    res.status(200).json(resource);
    return next();
  };
}
export function deleteAlternative(repository) {
  return async (req, res, next) => {
    const { id, alternative } = req.params;
    const savedObject = await repository.get(id);
    if (!savedObject) throw new NotFoundError();
    const { alternativePaysageIds = [] } = savedObject;
    const body = { ...req.context, alternativePaysageIds: alternativePaysageIds.filter((e) => e !== alternative) };
    await repository.patch(id, body);
    res.status(204).json();
    return next();
  };
}
