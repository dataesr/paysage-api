import express from 'express';

import { bulkImportStructures } from './import.middlewares';

const router = new express.Router();

router.route('/import/structures')
  .post([
    bulkImportStructures,
  ]);

export default router;
