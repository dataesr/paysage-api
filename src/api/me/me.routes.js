import express from 'express';

import { patchContext } from '../commons/middlewares/context.middlewares';
import controllers from '../commons/middlewares/crud.middlewares';
import { saveInElastic, saveInStore } from '../commons/middlewares/event.middlewares';
import { setFileInfo, saveFile, deleteFile } from '../commons/middlewares/files.middlewares';
import elasticQuery from '../commons/queries/users.elastic';
import readQuery from '../commons/queries/me.query';
import { usersRepository as repository } from '../commons/repositories';
import { keepBodyFields, setUserIdInParams, setAvatarData, unsetAvatarData, updatePassword } from './me.middlewares';
import { me as resource } from '../resources';

const PROFILE_FIELDS = ['firstName', 'lastName', 'position', 'service'];

const router = new express.Router();

router.route(`/${resource}`)
  .get([setUserIdInParams, controllers.read(repository, readQuery)])
  .patch([
    setUserIdInParams,
    keepBodyFields(PROFILE_FIELDS),
    patchContext,
    controllers.patch(repository, readQuery),
    saveInStore(resource),
    saveInElastic(repository, elasticQuery, resource),
  ]);

router.route(`/${resource}/avatar`)
  .put([
    setUserIdInParams,
    keepBodyFields([]),
    patchContext,
    setFileInfo('avatars'),
    saveFile,
    setAvatarData,
    controllers.patch(repository, readQuery),
    saveInStore(resource),
  ])
  .delete([
    setUserIdInParams,
    keepBodyFields([]),
    patchContext,
    deleteFile('avatars'),
    unsetAvatarData,
    controllers.patch(repository, readQuery),
    saveInStore(resource),
  ]);

router.route(`/${resource}/password`)
  .put([
    updatePassword,
    saveInStore(resource),
  ]);

export default router;
