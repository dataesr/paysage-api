import { BadRequestError } from '../commons/http-errors';
import { structuresRepository, relationTypesRepository, relationsGroupsRepository } from '../commons/repositories';

export function setFilters(req, res, next) {
  const { relationsGroupId } = req.params;
  if (!req.query.filters) { req.query.filters = {}; }
  req.query.filters.relationsGroupId = relationsGroupId;
  return next();
}

export async function validatePayload(req, res, next) {
  if (!Object.keys(req.body).length) throw new BadRequestError('Payload missing');
  const errors = [];
  const { resourceId, relationsGroupId } = req.params;
  const { relationTypeId } = req.body;
  const structure = await structuresRepository.get(resourceId);
  const group = await relationsGroupsRepository.get(relationsGroupId);

  if (!structure) {
    errors.push({
      path: '.param.resourceId',
      message: `Structure '${resourceId}' does not exist`,
    });
  }
  if (!group) {
    errors.push({
      path: '.param.relationsGroupId',
      message: `RelationGroup '${relationsGroupId}' does not exist`,
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
  if (!errors.length) return next();
  throw new BadRequestError('Referencing unknown resources', errors);
}

// TODO check if resourceID and relatedId exists with catalog
