import { BadRequestError } from '../../../libs/http-errors';
import persons from '../../persons/root/root.resource';
import roles from '../../roles/root/root.resource';

export async function validatePayload(req, res, next) {
  if (!Object.keys(req.body).length) throw new BadRequestError('Payload missing');
  const { personId } = req.body;
  const { roleId } = req.body;
  if (personId) {
    const exists = await persons.repository.get(
      personId,
      { useQuery: 'checkQuery' },
    );
    if (!exists) {
      throw new BadRequestError(
        'Referencing unknown resource',
        [{
          path: '.body.personId',
          message: `person '${personId}' does not exist`,
        }],
      );
    }
  }
  if (roleId) {
    const exists = await roles.repository.get(
      roleId,
      { useQuery: 'checkQuery' },
    );
    if (!exists) {
      throw new BadRequestError(
        'Referencing unknown resource',
        [{
          path: '.body.roleId',
          message: `role '${roleId}' does not exist`,
        }],
      );
    }
  }
  return next();
}
