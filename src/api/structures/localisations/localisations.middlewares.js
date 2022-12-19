import { BadRequestError } from '../../commons/http-errors';
import { structureLocalisationsRepository } from '../../commons/repositories';
import readQuery from '../../commons/queries/localisations.query';

export function setGeoJSON(req, res, next) {
  const { coordinates, ...rest } = req.body;
  if (coordinates?.lat && coordinates?.lng) {
    const geometry = { type: 'Point', coordinates: [coordinates.lng, coordinates.lat] };
    req.body = { geometry, ...rest };
  } else {
    req.body = { ...rest };
  }
  if ((coordinates?.lat && !coordinates?.lng) || (coordinates?.lng && !coordinates?.lat)) {
    throw new BadRequestError('Validation error', [{ path: '.body.coordinates', message: 'lat and lng must be set together' }]);
  }
  return next();
}
export async function validatePhoneNumber(req, res, next) {
  const phoneRegex = /^\+33[0-9]{9}$/;
  const { id, resourceId } = req.params;
  const { country, phonenumber } = req.body;
  const nextCountry = country || await structureLocalisationsRepository.get(resourceId, id, { useQuery: readQuery }).country;
  if (phonenumber && nextCountry === 'France' && !phonenumber.match(phoneRegex)) {
    throw new BadRequestError('Validation error', [{
      path: '.body.phonenumber',
      message: `Phone number from France should match pattern ${phoneRegex}`,
    }]);
  }
  return next();
}
