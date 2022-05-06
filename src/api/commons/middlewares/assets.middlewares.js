import storage from 'swift/storage';
import config from '../../../config';
import swift from '../../../services/storage.service';
import { NotFoundError, ServerError } from '../../../libs/http-errors';

const { container } = config.objectStorage;

async function serveAsset(req, res) {
  const file = await storage.download(swift, container, req.url.slice(1))
    .catch(((e) => { throw new NotFoundError(e.message); }));
  res.setHeader('Content-Type', file.headers['content-type']);
  res.setHeader('Content-Length', file.headers['content-length']);
  file.pipe(res);
  file.on('end', () => res.end());
  file.on('error', () => { throw new ServerError(); });
}

export { serveAsset };
