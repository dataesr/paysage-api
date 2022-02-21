import Context from 'swift/context';
import storage from 'swift/storage';
import config from '../../config/app.config';
import { BadRequestError, ServerError } from '../../libs/monster/errors';
import { fileCatalogue } from '../commons/monster';
import documents from './documents.resource';

const { creds, container, url } = config.objectStorage;

async function createFileInfo(req, res, next) {
  if (!req.files || !req.files.length) throw new BadRequestError('Cannot upload file.');
  [req.file] = req.files;
  const id = await fileCatalogue.getUniqueId('documents');
  const extension = req.file.mimetype.substring(req.file.mimetype.indexOf('/') + 1);
  const path = `documents/${id}.${extension}`;
  req.ctx = { ...req.ctx,
    fileInfo: {
      url: `${url}/${container}/${path}`,
      mimetype: req.file.mimetype,
      id,
      path,
      originalName: req.file.originalname,
    } };
  return next();
}

async function updateFileInfo(req, res, next) {
  if (!req.files || !req.files.length) { return next(); }
  const { fileInfo } = documents.repository.get(req.params.id);
  [req.file] = req.files;
  const extension = req.file.mimetype.substring(req.file.mimetype.indexOf('/') + 1);
  const path = `documents/${fileInfo.id}.${extension}`;
  req.ctx = { ...req.ctx,
    fileInfo: {
      url: `${url}/${container}/${path}`,
      mimetype: req.file.mimetype,
      id: fileInfo.id,
      path,
      originalName: req.file.originalname,
    } };
  return next();
}

async function saveFile(req, res, next) {
  if (!req.file) { return next(); }
  const swift = await Context.build(creds);
  await storage.putStream(swift, req.file.buffer, container, req.ctx.fileInfo.filePath)
    .catch(() => { throw new ServerError('Error saving file'); });
  return next();
}

async function deleteFile(req, res, next) {
  const swift = await Context.build(creds);
  const { fileInfo } = documents.repository.get(req.params.id);
  await storage.deleteFile(swift, container, fileInfo.path)
    .catch(() => { throw new ServerError('Error deleting file'); });
  return next();
}

export {
  createFileInfo,
  updateFileInfo,
  saveFile,
  deleteFile,
};
