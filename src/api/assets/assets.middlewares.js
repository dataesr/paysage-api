import storage from '../../services/storage.service';

async function serveAsset(req, res) {
  const file = await storage.download(req.path.slice(1));
  file.pipe(res);
}

export { serveAsset };
