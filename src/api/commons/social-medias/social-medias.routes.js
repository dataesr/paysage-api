import express from 'express';

import { createContext, patchContext, setGeneratedInternalIdInContext } from '../middlewares/context.middlewares';
import { saveInStore } from '../middlewares/event.middlewares';
import controllers from '../middlewares/crud.middlewares';
import { validatePayload } from './social-medias.middlewares';
import { readQuery } from './social-medias.queries';
import repository from './social-medias.repository';

const getSocialMediasRoutes = (collection, field) => {
  const router = new express.Router();

  router.route(`/${collection}/:resourceId/${field}`)
    .get(controllers.list(repository, readQuery))
    .post([
      validatePayload,
      createContext,
      setGeneratedInternalIdInContext(field),
      controllers.create(repository, readQuery),
      saveInStore(field),
    ]);

  router.route(`/${collection}/:resourceId/${field}/:id`)
    .get(controllers.read(repository, readQuery))
    .patch([
      patchContext,
      controllers.patch(repository, readQuery),
      saveInStore(field),
    ])
    .delete([
      patchContext,
      controllers.remove(repository),
      saveInStore(field),
    ]);

  return router;
};

export default getSocialMediasRoutes;
