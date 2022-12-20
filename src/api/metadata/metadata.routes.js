import express from 'express';
import { db } from '../../services/mongo.service';

const router = new express.Router();

router.route('/metadata/counts').get(async (req, res) => {
  const collections = ['structures', 'persons', 'prizes', 'projects', 'officialtexts', 'terms', 'categories'];
  const counts = await Promise.all(collections.map((collection) => db.collection(collection).countDocuments()));
  res.status(201).json(Object.assign(...collections.map((k, i) => ({ [k]: counts[i] }))));
});

export default router;
