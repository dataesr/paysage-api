import { BadRequestError } from '../../commons/http-errors';
import { geographicalCategoriesRepository as repository, structuresRepository } from '../../commons/repositories';
import readQuery from '../../commons/queries/structures.light.query';

export async function validatePayload(req, res, next) {
  if (Object.keys(req.body).length === 0) {
    throw new BadRequestError('Payload missing');
  }
  return next();
}

export async function getGeographicalCategoryById(req, res, next) {
  const { id } = req.params;
  try {
    const geographicalCategory = await repository.get(id);
    if (!geographicalCategory) {
      return res.status(404).json({ error: 'Geographical category not found' });
    }

    if (geographicalCategory.nameFr === 'France') {
      const { geometry, ...categoryWithoutGeometry } = geographicalCategory;
      req.geographicalCategory = categoryWithoutGeometry;
    } else {
      req.geographicalCategory = geographicalCategory;
    }

    return next();
  } catch (error) {
    return res.status(500).json({ error: 'An error occurred while fetching data' });
  }
}
export async function getStructureFromGeoCategory(req, res, next) {
  try {
    const { geographicalCategory } = req;

    const localisationsFilter = {};
    if (geographicalCategory.nameFr === 'France') {
      localisationsFilter['localisations.geometry'] = { $exists: false };
    } else {
      localisationsFilter['localisations.geometry'] = {
        $geoWithin: {
          $geometry: geographicalCategory.geometry,
        },
      };
    }

    const filters = {
      ...localisationsFilter,
      'localisations.active': { $ne: false },
    };

    const { data } = await structuresRepository.find({ filters, useQuery: readQuery });
    res.status(200).json({ data, totalCount: data.length });
    next();
  } catch (error) {
    res.status(500).json({ error: 'Une erreur s\'est produite lors de la récupération des données' });
    next(error);
  }
}
