import express from 'express';
import { createGzip } from 'zlib';
import { Transform } from 'stream';
import { pipeline } from 'stream/promises';
import { db } from '../../services/mongo.service';
import { requireRoles } from '../commons/middlewares/rbac.middlewares';

const router = new express.Router();

/**
 * Transform stream that converts MongoDB documents to NDJSON format
 * (Newline Delimited JSON - perfect for Python consumption)
 */
class NDJSONTransform extends Transform {
  constructor() {
    super({ objectMode: true });
  }

  _transform(doc, encoding, callback) {
    try {
      const jsonLine = JSON.stringify(doc) + '\n';
      callback(null, jsonLine);
    } catch (error) {
      callback(error);
    }
  }
}

router.route('/dump/structures')
  .get([
    requireRoles(['admin']),
    async (req, res) => {
      try {
        // Check if it's a browser download (query param ?download=true for raw .gz file)
        const isBrowserDownload = req.query.download === 'true';

        if (isBrowserDownload) {
          // For browser downloads: send as raw gzip file (not auto-decompressed)
          res.setHeader('Content-Type', 'application/gzip');
          res.setHeader('Content-Disposition', 'attachment; filename="structures-dump.ndjson.gz"');
        } else {
          // For programmatic access: browsers will auto-decompress, Python sees compressed
          res.setHeader('Content-Type', 'application/x-ndjson');
          res.setHeader('Content-Encoding', 'gzip');
          res.setHeader('Content-Disposition', 'attachment; filename="structures-dump.ndjson.gz"');
        }

        res.setHeader('Transfer-Encoding', 'chunked');
        res.setHeader('Cache-Control', 'no-cache');

        const cursor = db.collection('structures-dump').find({}, {
          batchSize: 1000,
          noCursorTimeout: false,
        });

        const ndjsonTransform = new NDJSONTransform();
        const gzip = createGzip({ level: 6 });

        req.on('close', () => {
          cursor.close();
        });

        await pipeline(
          cursor.stream(),
          ndjsonTransform,
          gzip,
          res
        );
      } catch (error) {
        // Only send error if headers haven't been sent
        if (!res.headersSent) {
          res.status(500).json({ error: 'Failed to generate dump', message: error.message });
        } else {
          // If streaming has started, we can only close the connection
          res.end();
        }
      }
    },
  ]);

export default router;
