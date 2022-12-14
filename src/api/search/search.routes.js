import express from 'express';

import { search } from './search.middlewares';

const router = new express.Router();

router.route('/autocomplete')
  .get([search('autocomplete')]);

router.route('/search')
  .get([search('search')]);

export default router;
