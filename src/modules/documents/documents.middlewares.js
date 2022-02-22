import storage from 'swift/storage';
import config from '../../config/app.config';
import swift from '../../services/storage.service';
import { ServerError } from '../../libs/monster/errors';
import { objectCatalogue } from '../commons/monster';
import documents from './documents.resource';

const { container } = config.objectStorage;

async function createDocumentId(req, res, next) {
  const id = await objectCatalogue.getUniqueId('documents');
  req.ctx = { ...req.ctx, id };
  return next();
}
async function setFileInfo(req, res, next) {
  if (!req.files || !req.files.length) { return next(); }
  [req.file] = req.files;
  const id = req.ctx.id ?? req.params.id;
  const extension = req.file.originalname.substring(req.file.originalname.lastIndexOf('.') + 1);
  const path = `medias/documents/${id}.${extension}`;
  req.ctx = {
    ...req.ctx,
    fileInfo: {
      url: `${req.protocol}://${req.headers.host}/${path}`,
      path,
      mimetype: req.file.mimetype,
      originalName: req.file.originalname,
    },
  };
  return next();
}

async function saveFile(req, res, next) {
  if (!req.file) { return next(); }
  const { path } = req.ctx.fileInfo;
  storage.putStream(swift, req.file.buffer, container, path)
    .catch(() => { throw new ServerError('Error saving file'); });
  return next();
}

async function deleteFile(req, res, next) {
  const { fileInfo } = await documents.repository.get(req.params.id);
  storage.deleteFile(swift, container, fileInfo.path)
    .catch(() => { throw new ServerError('Error deleting file'); });
  return next();
}

async function getFile(req, res) {
  const file = await storage.download(swift, container, req.url.slice(1));
  res.setHeader('Content-Type', file.headers['content-type']);
  res.setHeader('Content-Length', file.headers['content-length']);
  file.pipe(res);
  file.on('end', () => res.end());
  file.on('error', () => { throw new ServerError(); });
}

export {
  createDocumentId,
  setFileInfo,
  saveFile,
  deleteFile,
  getFile,
};
