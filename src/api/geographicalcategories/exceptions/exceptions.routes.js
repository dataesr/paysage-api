import express from 'express';

import { createContext, patchContext, setGeneratedInternalIdInContext } from '../../commons/middlewares/context.middlewares';
import controllers from '../../commons/middlewares/crud.middlewares';
import { saveInStore } from '../../commons/middlewares/event.middlewares';
import { readQuery } from '../../commons/queries/exceptions.query';
import { geographicalCategoriesExceptionsRepository as repository } from '../../commons/repositories';
import { exceptions as resource } from '../../resources';

const router = new express.Router();

router.route(`/${resource}`)
    .post([
        createContext,
        setGeneratedInternalIdInContext(subresource),
        controllers.create(repository, readQuery),
        saveInStore(subresource),
    ]);

router.route(`/${resource}/:id`)
    .delete([
        patchContext,
        controllers.remove(repository),
        saveInStore(subresource),
    ]);

export default router;
