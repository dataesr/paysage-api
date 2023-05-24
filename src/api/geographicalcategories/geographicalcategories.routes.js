import express from 'express';

import { geographicalCategories as resource } from '../resources';

const router = new express.Router();

router.route(`/${resource}`)
  .get()
  .post();

router.route(`/${resource}/:id`)
  .get()
  .patch()
  .delete();

router.route(`/${resource}/:id/structures`)
  .get();
