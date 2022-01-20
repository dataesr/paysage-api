import express from 'express';
import changelogsControllers from './events.controllers';

const router = new express.Router();

router.get('/events', changelogsControllers.list);

export default router;
