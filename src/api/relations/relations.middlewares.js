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
  const resource = await catalogRepository._collection.findOne({ _id: resourceId });
  const related = await catalogRepository._collection.findOne({ _id: relatedObjectId });
  if (!resource) {
    errors.push({
      path: '.body.resourceId',
      message: `Object '${resourceId}' does not exist`,
    });
  }
  if (!related) {
    errors.push({
      path: '.body.relatedObjectId',
      message: `Object '${relatedObjectId}' does not exist`,
    });
  }
  if (relationTypeId) {
    const type = await relationTypesRepository._collection.findOne({ id: relationTypeId });
    if (!type) {
      errors.push({
        path: '.body.relationTypeId',
        message: `RelationType '${relationTypeId}' does not exist`,
      });
    }
  }
  if (relationsGroupId) {
    const group = await relationsGroupsRepository._collection.findOne({ id: relationsGroupId });
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