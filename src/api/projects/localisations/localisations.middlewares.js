import { BadRequestError } from '../../commons/http-errors';
import { readQuery } from '../../commons/queries/localisations.query';
import { projectLocalisationsRepository } from '../../commons/repositories';

export function setGeoJSON(req, res, next) {
  const { coordinates, ...rest } = req.body;
  if (coordinates?.lat && coordinates?.lng) {
    const geometry = { type: 'Point', coordinates: [coordinates.lng, coordinates.lat] };
    req.body = { geometry, ...rest };
  }
  if ((coordinates?.lat && !coordinates?.lng) || (coordinates?.lng && !coordinates?.lat)) {
    throw new BadRequestError('Validation error', [{ path: '.body.coordinates', message: 'lat and lng must be set together' }]);
  }
  return next();
}
export async function validatePhoneNumberAndIso3(req, res, next) {
  const phoneRegex = /^\+33[0-9]{9}$/;
  const { id, iso3, resourceId } = req.params;
  const { country, phonenumber } = req.body;
  const nextCountry = country || await projectLocalisationsRepository.get(resourceId, id, { useQuery: readQuery }).country;
  if (phonenumber && nextCountry === 'France' && !phonenumber.match(phoneRegex)) {
    throw new BadRequestError('Validation error', [{
      path: '.body.phonenumber',
      message: `Phone number from France should match pattern ${phoneRegex}`,
    }]);
  }
  if (iso3) {
    if (!iso3.toString().toUpperCase().match(/^[A-Z]{3}$/)) {
      throw new BadRequestError('Validation error', [{
        path: '.body.iso3',
        message: 'iso3 for structure should be 3 letters in uppercase',
      }]);
    }
  }
  return next();
}
