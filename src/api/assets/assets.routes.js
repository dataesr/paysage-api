import express from 'express';
import { serveAsset } from './assets.middlewares';

const router = new express.Router();

router.get('/assets/*', [serveAsset]);

export default router;
