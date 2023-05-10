import express from 'express';
import { db } from '../../services/mongo.service';

const router = new express.Router();

router.route('/curiexplore/actors')
  .get(async (req, res) => {
    const data = await db.collection('curiexploreactors').find({}).toArray();
    res.status(200).json(data);
  });

export default router;
