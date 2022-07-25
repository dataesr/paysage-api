import express from 'express';
import rateLimit from 'express-rate-limit';
import {
  createContext,
  setGeneratedInternalIdInContext,
} from '../commons/middlewares/context.middlewares';
import { requireAuth } from '../commons/middlewares/rbac.middlewares';
import {
  signup,
  signin,
  signout,
  refreshAccessToken,
  resetPassword,
} from './auth.middlewares';

const authRoutes = new express.Router();

const maxRequestsPerHour = (max) => rateLimit({
  windowMs: 60 * 60 * 1000,
  max,
  message: 'Trop de requètes, essayez à nouveau dans une heure.',
});

authRoutes.post('/signup', [
  maxRequestsPerHour(5),
  createContext,
  setGeneratedInternalIdInContext('user'),
  signup,
]);
authRoutes.post('/signin', [maxRequestsPerHour(20), signin]);
authRoutes.post('/token/revoke', [requireAuth, signout]);
authRoutes.post('/token', [refreshAccessToken]);
authRoutes.post('/recovery/password', [maxRequestsPerHour(6), resetPassword]);

export default authRoutes;
