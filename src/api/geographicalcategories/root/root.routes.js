import express from 'express';

import { geographicalCategories as resource } from '../../resources';
import { geographicalCategoriesRepository as repository } from '../../commons/repositories';
import controllers from '../../commons/middlewares/crud.middlewares';
import elasticQuery from '../../commons/queries/geographical-categories.elastic';
import lightQuery from '../../commons/queries/geographical-categories.light.query';
import readQuery from '../../commons/queries/geographical-categories.query';

import { getGeographicalCategoryById, getStructureFromGeoCategory, validatePayload } from './root.middlewares';
import { createContext, patchContext, setGeneratedObjectIdInContext } from '../../commons/middlewares/context.middlewares';
import { saveInElastic, saveInStore } from '../../commons/middlewares/event.middlewares';
import { canIDelete } from '../../legalcategories/legalcategories.middlewares';

const router = new express.Router();

router.route(`/${resource}`)
  .get(controllers.list(repository, lightQuery))
  .post([
    validatePayload,
    createContext,
    setGeneratedObjectIdInContext(resource),
    controllers.create(repository, readQuery),
    saveInStore(resource),
    saveInElastic(repository, elasticQuery, resource),
  ]);

router.route(`/${resource}/:id`)
  .get(controllers.read(repository, readQuery))
  .patch([
    patchContext,
    validatePayload,
    controllers.patch(repository, readQuery),
    saveInStore(resource),
    saveInElastic(repository, elasticQuery, resource),
  ])
  .delete([
    patchContext,
    canIDelete,
    controllers.softDelete(repository),
    saveInStore(resource),
    saveInElastic(repository, elasticQuery, resource),
  ]);

router.route(`/${resource}/:id/structures`)
  .get(
    getGeographicalCategoryById,
    getStructureFromGeoCategory,
  );

export default router;
