import express from 'express';
import { patchContext, createContext, setGeneratedInternalIdInContext } from '../../commons/middlewares/context.middlewares';
import { saveInStore } from '../../commons/middlewares/event.middlewares';
import { structureLogosRepository as repository } from '../../commons/repositories';
import { setFileInfo, saveFile, deleteFile } from '../../commons/middlewares/files.middlewares';
import controllers from '../../commons/middlewares/crud-nested.middlewares';
import readQuery from '../../commons/queries/logos.query';
import { structures as resource, logos as subresource } from '../../resources';

const router = new express.Router();

router.route(`/${resource}/:resourceId/${subresource}`)
  .get(controllers.list(repository, readQuery))
  .post([
    createContext,
    setGeneratedInternalIdInContext(subresource),
    setFileInfo(subresource),
    saveFile,
    controllers.create(repository, readQuery),
    saveInStore(subresource),
  ]);

router.route(`/${resource}/:resourceId/${subresource}/:id`)
  .get(controllers.read(repository, readQuery))
  .patch([
    patchContext,
    setFileInfo(subresource),
    saveFile,
    controllers.patch(repository, readQuery),
    saveInStore(subresource),
  ])
  .delete([
    patchContext,
    deleteFile(subresource),
    controllers.remove(repository),
    saveInStore(subresource),
  ]);

export default router;
