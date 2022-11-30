import express from 'express';

import { contact } from './contact.middlewares';

const router = new express.Router();

router.post('/contact', [contact]);

export default router;
