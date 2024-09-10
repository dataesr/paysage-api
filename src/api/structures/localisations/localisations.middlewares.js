import { db } from '../../../services/mongo.service';
import { BadRequestError } from '../../commons/http-errors';
import { readQuery } from '../../commons/queries/localisations.query';
import { structureLocalisationsRepository } from '../../commons/repositories';

export const setGeoJSON = (req, res, next) => {
  const { coordinates, ...rest } = req.body;
  if (coordinates?.lat && coordinates?.lng) {
    const geometry = {
      type: 'Point',
      coordinates: [coordinates.lng, coordinates.lat],
    };
    req.body = { geometry, ...rest };
  } else {
    req.body = { ...rest };
  }
  if (
    (coordinates?.lat && !coordinates?.lng)
    || (coordinates?.lng && !coordinates?.lat)
  ) {
    throw new BadRequestError('Validation error', [
      {
        path: '.body.coordinates',
        message: 'lat and lng must be set together',
      },
    ]);
  }
  return next();
};
export async function validatePhoneNumberAndIso3(req, res, next) {
  const phoneRegex = /^(\+(?:\d{1,3}))?[-. ]?\(?(\d{1,4})\)?[-. ]?(\d{1,4})[-. ]?(\d{1,4})[-. ]?(\d{1,9})$/;
  const { id, resourceId } = req.params;
  const { country, iso3, phonenumber } = req.body;
  const nextCountry = country
    || (await structureLocalisationsRepository.get(resourceId, id, {
      useQuery: readQuery,
    }).country);
  if (
    phonenumber
    && nextCountry === 'France'
    && !phonenumber.match(phoneRegex)
  ) {
    throw new BadRequestError('Validation error', [
      {
        path: '.body.phonenumber',
        message: `Phone number from France should match pattern ${phoneRegex}`,
      },
    ]);
  }
  if (iso3) {
    if (
      !iso3
        .toString()
        .toUpperCase()
        .match(/^[A-Z]{3}$/)
    ) {
      throw new BadRequestError('Validation error', [
        {
          path: '.body.iso3',
          message: 'iso3 for structure should be 3 letters in uppercase',
        },
      ]);
    }
  }
  return next();
}

export const listLocalisations = async (req, res, next) => {
  const { resourceId } = req.params;
  const localisations = await structureLocalisationsRepository.find({
    resourceId,
    useQuery: readQuery,
  });
  const queries = localisations?.data?.map((el) => {
    if (el?.coordinates?.lng && el?.coordinates?.lat) {
      return db
        .collection('geographicalcategories')
        .find({
          geometry: {
            $geoIntersects: {
              $geometry: {
                type: 'Point',
                coordinates: [el?.coordinates?.lng, el?.coordinates?.lat],
              },
            },
          },

        }, { projection: {
          geometry: 0,
        } })
        .toArray();
    }
    return [];
  });
  const result = await Promise.all(queries);
  const data = localisations?.data?.reduce((acc, current, i) => {
    const newLoc = { ...current, geoCategories: result[i] };
    return [...acc, newLoc];
  }, []);

  res.status(200).json({ data, totalCount: localisations.totalCount });
  return next();
};
