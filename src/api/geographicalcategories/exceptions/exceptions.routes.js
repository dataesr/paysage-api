import express from 'express';

import { createContext, patchContext, setGeneratedInternalIdInContext } from '../../commons/middlewares/context.middlewares';
import controllers from '../../commons/middlewares/crud.middlewares';
import { saveInElastic, saveInStore } from '../../commons/middlewares/event.middlewares';
// import elasticQuery from '../../commons/queries/categories.elastic';
import { readQuery, readQueryWithLookup } from '../../commons/queries/exceptions.query';
import { geographicalCategoriesRepository, geographicalCategoriesExceptionsRepository as repository } from '../../commons/repositories';
import { categories as resource, exceptions as subresource } from '../../resources';

const router = new express.Router();

router.route(`/${resource}/:resourceId/${subresource}`)
    .get(controllers.list(repository, readQuery))
    .post([
        createContext,
        setGeneratedInternalIdInContext(subresource),
        controllers.create(repository, readQueryWithLookup),
        saveInStore(subresource),
        // saveInElastic(geographicalCategoriesRepository, elasticQuery, resource),
    ]);

router.route(`/${resource}/:resourceId/${subresource}/:id`)
    .get(controllers.read(repository, readQueryWithLookup))
    .patch([
        patchContext,
        controllers.patch(repository, readQueryWithLookup),
        saveInStore(subresource),
        // saveInElastic(geographicalCategoriesRepository, elasticQuery, resource),
    ])
    .delete([
        patchContext,
        controllers.remove(repository),
        saveInStore(subresource),
        // saveInElastic(geographicalCategoriesRepository, elasticQuery, resource),
    ]);

export default router;
