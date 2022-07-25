import storage from '../../../services/storage.service';
import { NotFoundError, ServerError } from '../http-errors';

function setFileInfo(resource) {
  return async (req, res, next) => {
    if (!req.files || !req.files.length) { return next(); }
    [req.file] = req.files;
    const id = req.context.id ?? req.params.id;
    const path = `assets/${resource}/${id}`;
    req.context = {
      ...req.context,
      url: `${req.protocol}://${req.headers.host}/${path}`,
      path,
      mimetype: req.file.mimetype,
      originalName: req.file.originalname,
    };
    return next();
  };
}

async function saveFile(req, res, next) {
  if (!req.file) { return next(); }
  const { path, mimetype } = req.context;
  await storage.put(req.file.buffer, path, { contentType: mimetype })
    .catch(() => { throw new ServerError('Error saving file'); });
  return next();
}

function deleteFile(resource) {
  return async (req, res, next) => {
    const { id } = req.params;
    await storage.delete(`assets/${resource}/${id}`)
      .catch((err) => {
        if (err.statusCode === 404) throw new NotFoundError();
        throw new ServerError('Error deleting file');
      });
    return next();
  };
}

export {
  deleteFile,
  saveFile,
  setFileInfo,
};
