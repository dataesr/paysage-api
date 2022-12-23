import express from 'express';

import { bulkImportStructures, validatePayload } from './import.middlewares';

const router = new express.Router();

router.route('/import')
  .post([
    validatePayload,
    bulkImportStructures,
  ]);

export default router;
