import express from 'express';
import meControllers from './me.controllers';
import { addUpdateMetaToPayload } from '../commons/middlewares/metas.middlewares';
import { verifyCurrentPassword } from './me.middlewares';
import { uploadImage } from '../commons/middlewares/uploads.middlewares';
import { requireActiveUser } from '../commons/middlewares/rbac.middlewares';

const meRoutes = new express.Router();

meRoutes.get('/me', requireActiveUser, meControllers.getMe);
meRoutes.patch('/me', addUpdateMetaToPayload, meControllers.updateMe);
meRoutes.delete('/me', requireActiveUser, meControllers.deleteMe);
meRoutes.put('/me/password', requireActiveUser, verifyCurrentPassword, meControllers.setPassword);
meRoutes.put('/me/avatar', requireActiveUser, uploadImage, meControllers.setAvatar);
meRoutes.delete('/me/avatar', requireActiveUser, meControllers.unsetAvatar);

export default meRoutes;
