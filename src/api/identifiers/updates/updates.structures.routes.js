import express from 'express';
import { ObjectId } from 'mongodb';

import controllers from '../../commons/middlewares/crud.middlewares';

import readQuery from '../../commons/queries/structures.identifiers.updates.query';
import { identifierUpdatesStructuresRepository as repository } from '../../commons/repositories';
import { db } from '../../../services/mongo.service';

const router = new express.Router();

router.route('/structures-identifier/updates').get(controllers.list(repository, readQuery));
router.route('/structures-identifier/updates/:id')
  .patch(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const { value } = await db.collection('_identifier_updates_structures').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { status } },
      { returnDocument: 'after' },
    );

    res.json(value);
  });

export default router;
