import storage from 'swift/storage';
import config from '../../../config';
import swift from '../../../services/storage.service';
import { ServerError } from '../../../libs/http-errors';
import logosRepository from './logos.repository';

const { container } = config.objectStorage;

async function setFileInfo(req, res, next) {
  if (!req.files || !req.files.length) { return next(); }
  [req.file] = req.files;
  const id = req.context.id ?? req.params.id;
  const path = `assets/structures/logos/${id}`;
  req.context = {
    ...req.context,
    url: `${req.protocol}://${req.headers.host}/${path}`,
    path,
    mimetype: req.file.mimetype,
    originalName: req.file.originalname,
  };
  return next();
}

async function saveFile(req, res, next) {
  if (!req.file) { return next(); }
  const { path, mimetype } = req.context;
  await storage.putStream(swift, req.file.buffer, container, path, { 'Content-Type': mimetype })
    .catch(() => { throw new ServerError('Error saving file'); });
  return next();
}

async function deleteFile(req, res, next) {
  const { resourceId, id } = req.params;
  const { path } = await logosRepository.get(resourceId, id);
  await storage.deleteFile(swift, container, path)
    .catch(() => { throw new ServerError('Error deleting file'); });
  return next();
}

export {
  deleteFile,
  saveFile,
  setFileInfo,
};
