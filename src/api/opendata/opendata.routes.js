import express from 'express';
import { db } from '../../services/mongo.service';
import { BadRequestError } from '../commons/http-errors';

const router = new express.Router();

const OPTIONS = { projection: { _id: 0, dataset: 0 } };

const FILTERS = {
  'fr-esr-annelis-paysage-gouvernance': { annelis: 'Y', dataset: 'fr-esr-paysage-fonctions-gouvernance' },
  'fr-esr-paysage-fonctions-gouvernance': { dataset: 'fr-esr-paysage-fonctions-gouvernance' },
  'fr-esr-annelis-paysage-etablissements': { dataset: 'fr-esr-annelis-paysage-etablissements' },
  'fr-esr-paysage_structures_identifiants': { dataset: 'fr-esr-paysage_structures_identifiants' },
  'fr-esr-paysage_personnes_identifiants': { dataset: 'fr-esr-paysage_personnes_identifiants' },
  'fr-esr-paysage_structures_websites': { dataset: 'fr-esr-paysage_structures_websites' },
  'fr-esr-paysage_prix': { dataset: 'fr-esr-paysage_prix' },

};

router.route('/opendata/:datasetId')
  .get(async (req, res) => {
    const { datasetId } = req.params;
    const query = FILTERS[datasetId];
    if (!query) throw new BadRequestError('Unknown dataset');
    const data = await db.collection('opendata').find(query, OPTIONS).toArray();
    res.status(200).json(data);
  });

export default router;
