import { BadRequestError } from '../../../libs/http-errors';
import localisations from './localisations.resource';

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
export async function validatePhoneNumber(req, res, next) {
  const phoneRegex = /^\+33[0-9]{9}$/;
  const { rid, id } = req.params;
  const { telephone, country } = req.body;
  const nextCountry = country || await localisations.repository.get(rid, id, { useQuery: 'readQuery' }).country;
  if (telephone && nextCountry === 'France' && !telephone.match(phoneRegex)) {
    throw new BadRequestError('Validation error', [{ path: '.body.telephone', message: 'Phone numbers from france should match pattern' }]);
  }
  return next();
}
