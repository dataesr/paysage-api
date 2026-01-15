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
        res.setHeader('Content-Type', 'application/x-ndjson');
        res.setHeader('Content-Encoding', 'gzip');
        res.setHeader('Content-Disposition', 'attachment; filename="structures-dump.ndjson.gz"');
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
        console.error(error);
        return res.status(500).json({ error: 'Failed to generate dump', message: error.message });
      }
    },
  ]);

export default router;
