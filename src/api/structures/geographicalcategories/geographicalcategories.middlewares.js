import { db } from '../../../services/mongo.service';
import { geographicalCategoriesRepository as repository, geographicalCategoriesExceptionsRepository } from '../../commons/repositories';
import readQuery from '../../commons/queries/geographical-categories.query';
import readExceptionsQuery from '../../commons/queries/geographical-exceptions.query';

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
  const geographicalExceptions = await geographicalCategoriesExceptionsRepository.find({
    filters: { resourceId: id },
    useQuery: readExceptionsQuery,
  });
  data.push(...geographicalExceptions.data.map((geographicalException) => geographicalException.geographicalCategory));
  res.status(200).json({ data, totalCount: data.length });
  return next();
};
