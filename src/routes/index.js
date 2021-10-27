import express from 'express';
import authControllers from '../controllers/auth';
import usersControllers from '../controllers/users';

const router = new express.Router();
router.post('/signup', authControllers.signup);

router.get('/users/:id', usersControllers.getUser);

export default router;
