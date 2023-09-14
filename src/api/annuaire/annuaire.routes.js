import express from 'express';
import { db } from '../../services/mongo.service';

const annuaire = db.collection('annuaire');
const router = new express.Router();

router.get('/annuaire', async (req, res) => {
  const { relationType, structure, category, mandateTypeGroup, keepInactive, skip = "0", limit = "0" } = req.query;
  const filters = {
    ...(relationType && { relationType }),
    ...(structure && { structureName: structure }),
    ...(category && { category }),
    ...(mandateTypeGroup && { mandateTypeGroup }),
  };
  filters.active = keepInactive === 'true' ? { $in: [true, false] } : true;
  console.log(filters);
  const data = (parseInt(limit, 10) > 0)
    ? await annuaire.find(filters).skip(parseInt(skip, 10)).limit(parseInt(limit, 10)).toArray()
    : [];
  const relationTypes = await annuaire.distinct('relationType', filters);
  const structures = await annuaire.distinct('structureName', filters);
  const categories = await annuaire.distinct('category', filters);
  const mandateTypeGroups = await annuaire.distinct('mandateTypeGroup', filters);
  return res.json({ data, relationTypes, structures, categories, mandateTypeGroups });
});

export default router;