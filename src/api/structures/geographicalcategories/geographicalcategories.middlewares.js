import { db } from '../../../services/mongo.service';
import { geographicalCategoriesRepository as repository } from '../../commons/repositories';

export const listGeographicalCategories = async (req, res, next) => {
  const data = [];
  const { id } = req.params;
  const { data: geographicalCategories } = await repository.find();
  // eslint-disable-next-line no-restricted-syntax
  for (const geographicalCategory of geographicalCategories) {
    const geometry = geographicalCategory?.geometry;
    // eslint-disable-next-line max-len, no-await-in-loop
    const matches = await db.collection('structures').find({ id, 'localisations.0.geometry.coordinates': { $geoWithin: { $geometry: geometry } } }).toArray();
    if (matches.length) data.push(geographicalCategory);
  }
  res.status(200).json({ data, totalCount: data.length });
  return next();
};
