import express from 'express';
import storage from '../../services/storage.service';
import { serveAsset } from './assets.middlewares';
import { ServerError } from '../commons/http-errors';

const options = {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
};

const generateFileId = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id = '';
  for (let i = 0; i < 32; i += 1) {
    id += chars.charAt(Math.floor(Math.random() * 32));
  }
  return id;
};

const saveFile = async (file, userId, baseUrl) => {
  const today = new Date().toLocaleString('fr-FR', options).replaceAll('/', '');
  const path = `assets/${today}/${userId}/${generateFileId()}/${encodeURI(file.originalname.normalize())}`;
  await storage.put(file.buffer, path, { contentType: file.mimetype })
    .catch(() => { throw new ServerError('Une erreur est survenue lors du dépot des fichiers'); });
  return { url: `${baseUrl}/${path}`, mimetype: file.mimetype, originalName: file.originalname, size: file.size };
};

const router = new express.Router();

router.get('/assets/*', [serveAsset]);
router.post(
  '/files',
  async (req, res, next) => {
    const { id = 'user' } = req.currentUser;
    const baseUrl = `${req.protocol}://${req.headers.host}`;
    if (!req.files || !req.files.length) { return next(); }
    const promises = req.files.map((file) => saveFile(file, id, baseUrl));
    const resolved = await Promise.all(promises);
    return res.json({ data: resolved });
  },
);

export default router;
