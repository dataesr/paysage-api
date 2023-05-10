import express from 'express';
import { db } from '../../services/mongo.service';

const router = new express.Router();

router.route('/curiexplore/actors')
  .get(async (req, res) => {
    const { filters } = req.query;
    console.log(filters);
    const data = await db.collection('curiexploreactors').find(filters).toArray();
    res.status(200).json(data);
  });

export default router;
