import storage from 'swift/storage';
import config from '../../config';
import swift from '../../services/storage.service';
import { ServerError } from '../../libs/http-errors';
import documentsRepository from './documents.repository';

const { container } = config.objectStorage;

async function setFileInfo(req, res, next) {
  if (!req.files || !req.files.length) { return next(); }
  [req.file] = req.files;
  const id = req.context.id ?? req.params.id;
  const path = `assets/documents/${id}`;
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
  const { path } = await documentsRepository.get(req.params.id);
  await storage.deleteFile(swift, container, path)
    .catch(() => { throw new ServerError('Error deleting file'); });
  return next();
}

// async function setFileDataInContextAndSaveFile(req, res, next) {
//   if (!req.files || !req.files.length) { return next(); }
//   const id = req.context.id ?? req.params.id;
//   const document = await documents.repository.get(req.params.id);
//   const files = document?.files ?? [];
//   const deletedFiles = req.files.map((file) => file.originalname)
//     .filter((x) => files.map((file) => file.originalname).indexOf(x) === -1);
//   deletedFiles.forEach((file) => {
//     storage.deleteFile(swift, container, fileInfo.path)
//       .catch(() => { throw new ServerError('Error deleting file'); });
//   })
//   req.context = { ...req.context, files: [] };
//   req.files.forEach((file) => {
//     const path = `public/assets/documents/${id}/${file.orininalname}`;
//     const fileInfo = {
//       originalName: file.orininalname,
//       mimetype: file.mimetype,
//       fileUrl: `${req.protocol}://${req.headers.host}/${path}`,
//       path,
//     };
//     storage.putStream(swift, req.file.buffer, container, path)
//       .then(() => req.context.files.push(fileInfo))
//       .catch(() => { throw new ServerError('Error saving file'); });
//   });
//   return next();
// }

export {
  deleteFile,
  saveFile,
  setFileInfo,
  // getFile,
};
