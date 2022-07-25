import storage from '../../services/storage.service';

async function serveAsset(req, res) {
  const file = await storage.download(req.url.slice(1));
  file.pipe(res);
}

export { serveAsset };
