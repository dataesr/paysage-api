import express from 'express';
import authControllers from '../controllers/auth';
import usersControllers from '../controllers/users';

const router = new express.Router();
router.post('/auth/signup', authControllers.signup);
router.post('/auth/signin', authControllers.signin);
router.post('/auth/signout', authControllers.signout);
router.post('/auth/activate-account', authControllers.activateAccount);
router.post('/auth/refresh-access-token', authControllers.refreshAccessToken);
router.get('/auth/renew-activation-code', authControllers.renewActivationCode);
router.post('/auth/send-password-renewal-code', authControllers.sendPasswordRenewalCode);
router.post('/auth/reset-password', authControllers.resetPassword);

router.get('/users/:id', usersControllers.getUser);

export default router;
