import express from 'express';
import { db } from '../../services/mongo.service';

const annuaire = db.collection('annuaire');
const rt = db.collection('relationtypes');
const router = new express.Router();

const lightProjection = {
  _id: 0,
  id: 1,
  person: "$relatedObject.displayName",
  personGender: "$relatedObject.gender",
  structureName: "$resource.displayName",
  startDate: 1,
  endDate: 1,
  status: 1,
  active: 1,
  endDatePrevisional: 1,
  mandateEmail: 1,
  mandateTemporary: 1,
  personalEmail: 1,
  mandatePhonenumber: 1,
  personId: "$relatedObject.id",
  structureId: "$resource.id",
  relationType: {
    $cond: {
      if: { $eq: ["$relatedObject.gender", 'Homme'] },
      then: "$relationType.maleName",
      else: {
        $cond: {
          if: { $eq: ["$relatedObject.gender", 'Homme'] },
          then: "$relationType.feminineName",
          else: "$relationType.name"
        }
      }
    }
  },
}


router.get('/annuaire/aggregations', async (req, res) => {
  const relationTypesDocs = await rt
    .find({ for: "persons" })
    .project({ _id: 0, name: 1, priority: { $ifNull: ['$priority', 99] } })
    .toArray();
  const relationTypes = relationTypesDocs.sort((a, b) => a.priority - b.priority).map(rt => rt.name);
  const structures = await annuaire.distinct('resource.displayName');
  const categories = await annuaire.distinct('resource.categories.usualNameFr');
  const mandateTypeGroups = await annuaire.distinct('relationType.mandateTypeGroup');
  return res.json({ relationTypes, structures, categories, mandateTypeGroups });
});

router.get('/annuaire', async (req, res) => {
  const { relationType, structure, category, mandateTypeGroup, skip = "0", limit = "0" } = req.query;
  const filters = {
    ...(relationType && { "relationType.name": { $in: relationType.split(',') } }),
    ...(structure && { "resource.displayName": { $in: structure.split(',') } }),
    ...(category && { "resource.categories.usualNameFr": { $in: category.split(',') } }),
    ...(mandateTypeGroup && { "relationType.mandateTypeGroup": { $in: mandateTypeGroup.split(',') } }),
  };
  const data = (parseInt(limit, 10) > 0)
    ? await annuaire.find(filters).project(lightProjection).skip(parseInt(skip, 10)).limit(parseInt(limit, 10)).toArray()
    : [];
  const totalCount = await annuaire.countDocuments(filters);
  return res.json({ data, totalCount });
});

router.get('/annuaire/export', async (req, res) => {
  const { relationType, structure, category, mandateTypeGroup } = req.query;
  const filters = {
    ...(relationType && { "relationType.name": { $in: relationType.split(',') } }),
    ...(structure && { "resource.displayName": { $in: structure.split(',') } }),
    ...(category && { "resource.categories.usualNameFr": { $in: category.split(',') } }),
    ...(mandateTypeGroup && { "relationType.mandateTypeGroup": { $in: mandateTypeGroup.split(',') } }),
  };
  const data = await annuaire.find(filters).toArray()
  console.log(data);
  return res.json(data);
});

export default router;