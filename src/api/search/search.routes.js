import express from 'express';

import esClient from '../../services/elastic.service';
import config from '../../config';

const allowedTypes = ['structures'];

const router = new express.Router();
const { index } = config.elastic;

router.route('/autocompletes')
  .get(async (req, res, next) => {
    const { query, types } = req.query;
    const should = types
      .split(',')
      .map((type) => type.trim())
      .filter((type) => allowedTypes.includes(type))
      .map((type) => ({ term: { type } }));
    const body = {
      query: {
        bool: {
          must: [
            {
              match: {
                text: query,
              },
            },
          ],
          should,
        },
      },
    };
    const response = await esClient.search({ index, body });
    res.json(response);
    return next();
  });

export default router;
