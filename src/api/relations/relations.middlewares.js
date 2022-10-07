import { BadRequestError } from '../commons/http-errors';
import { catalogRepository, relationTypesRepository, relationsGroupsRepository } from '../commons/repositories';

export function setFilters(req, res, next) {
  const { filters } = req.params;
  if (!req.query.filters) { req.query.filters = {}; }
  req.query.filters.relationsGroupId = filters;
  return next();
}

export async function validatePayload(req, res, next) {
  if (!Object.keys(req.body).length) throw new BadRequestError('Payload missing');
  const errors = [];
  const { resourceId, relatedObjectId, relationTypeId, relationsGroupId } = req.body;
  const resource = await catalogRepository.find({ filters: { _id: resourceId } });
  const related = await catalogRepository.find({ filters: { _id: relatedObjectId } });
  if (!resource?.totalCount) {
    errors.push({
      path: '.body.resourceId',
      message: `Object '${resourceId}' does not exist`,
    });
  }
  if (!related?.totalCount) {
    errors.push({
      path: '.body.relationsGroupId',
      message: `Object '${relatedObjectId}' does not exist`,
    });
  }
  if (relationTypeId) {
    const type = await relationTypesRepository.get(relationTypeId);
    if (!type) {
      errors.push({
        path: '.body.relationTypeId',
        message: `RelationType '${relationTypeId}' does not exist`,
      });
    }
  }
  if (relationsGroupId) {
    const group = await relationsGroupsRepository.get(relationsGroupId);
    if (!group) {
      errors.push({
        path: '.body.relationsGroupId',
        message: `RelationGroup '${relationsGroupId}' does not exist`,
      });
    }
  }
  if (!errors.length) return next();
  throw new BadRequestError('Referencing unknown resources', errors);
}

// TODO check if resourceID and relatedId exists with catalog
