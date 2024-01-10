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

    req.geographicalCategory = geographicalCategory;

    return next();
  } catch (error) {
    return res.status(500).json({ error: 'An error occurred while fetching data' });
  }
}

export async function getStructureFromGeoCategory(req, res, next) {
  try {
    const { geographicalCategory, query } = req;
    const { filters, limit, skip } = query;
    const filtersTmp = {
      ...filters,
      'localisations.geometry': {
        $geoWithin: {
          $geometry: geographicalCategory.geometry,
        },
      },
      'localisations.active': { $ne: false },
    };

    const { data } = await structuresRepository.find({ filters: filtersTmp, limit, skip, useQuery: readQuery });
    res.status(200).json({ data, totalCount: data.length });
    next();
  } catch (error) {
    res.status(500).json({ error: 'Une erreur s\'est produite lors de la récupération des données' });
    next(error);
  }
}
