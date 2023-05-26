import { db } from '../../../services/mongo.service';
import { geographicalCategoriesRepository as repository, geographicalCategoriesExceptionsRepository } from '../../commons/repositories';
import readQuery from '../../commons/queries/geographical-categories.query';

export const listGeographicalCategories = async (req, res, next) => {
  const data = [];
  const { id } = req.params;
  const { data: geographicalCategories } = await repository.find({ useQuery: readQuery });
  // eslint-disable-next-line no-restricted-syntax
  for (const geographicalCategory of geographicalCategories) {
    const geometry = geographicalCategory?.geometry;
    // eslint-disable-next-line max-len, no-await-in-loop
    const matches = await db.collection('structures').find({ id, 'localisations.0.geometry.coordinates': { $geoWithin: { $geometry: geometry } } }).toArray();
    if (matches.length) data.push(geographicalCategory);
  }
  const geographicalExceptions = await geographicalCategoriesExceptionsRepository.find({ filters: { resourceId: id } });
  // eslint-disable-next-line no-restricted-syntax
  for (const geographicalException of geographicalExceptions.data) {
    // eslint-disable-next-line no-await-in-loop
    const geographicalCategory = await repository.get(geographicalException.geographicalCategoryId, { useQuery: readQuery });
    data.push(geographicalCategory);
  }
  res.status(200).json({ data, totalCount: data.length });
  return next();
};
