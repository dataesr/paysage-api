import { db } from '../../../services/mongo.service';
import { geographicalCategoriesExceptionsRepository } from '../../commons/repositories';
import readExceptionsQuery from '../../commons/queries/geographical-exceptions.query';

export const listGeographicalCategories = async (req, res, next) => {
  const { id } = req.params;
  const findStructures = await db.collection('structures').findOne({ id });
  const { localisations } = findStructures;
  const queries = localisations.map((el) => db.collection('geographicalcategories')
    .find({
      geometry: {
        $geoIntersects: {
          $geometry: el.geometry,
        },
      },
    })
    .toArray());
  const result = await Promise.all(queries);
  const data = localisations.reduce((acc, current, i) => {
    const newLoc = { ...current, geoCategories: result[i] };
    return [...acc, newLoc];
  }, []);

  res.status(200).json({ data });
  return next();
};

export const listExceptionGeographicalCategories = async (req, res, next) => {
  const { id } = req.params;
  const data = [];
  const geographicalExceptions = await geographicalCategoriesExceptionsRepository.find({
    filters: { resourceId: id },
    useQuery: readExceptionsQuery,
  });
  data.push(...geographicalExceptions.data.map((geographicalException) => geographicalException.geographicalCategory));
  res.status(200).json({ data });
  return next();
};
