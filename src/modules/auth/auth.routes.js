import express from 'express';
import authControllers from './auth.controllers';
import { addInsertMetaToPayload } from '../commons/middlewares/metas.middlewares';
import { requireAuth } from '../commons/middlewares/rbac.middlewares';
import {
  verifyActivationCode,
  verifyPasswordRenewalCode,
  verifyRefreshToken,
  verifyUserCredential,
  verifyUserExists,
} from './auth.middlewares';

const authRoutes = new express.Router();
authRoutes.post('/auth/signup', addInsertMetaToPayload, authControllers.signup);
authRoutes.post('/auth/signin', verifyUserCredential, authControllers.signin);
authRoutes.post('/auth/signout', requireAuth, authControllers.signout);
authRoutes.post('/auth/activate-account', requireAuth, verifyActivationCode, authControllers.activateAccount);
authRoutes.post('/auth/refresh-access-token', verifyRefreshToken, authControllers.refreshAccessToken);
authRoutes.get('/auth/renew-activation-code', requireAuth, authControllers.renewActivationCode);
authRoutes.post('/auth/send-password-renewal-code', verifyUserExists, authControllers.sendPasswordRenewalCode);
authRoutes.post('/auth/reset-password', verifyUserExists, verifyPasswordRenewalCode, authControllers.resetPassword);

export default authRoutes;
