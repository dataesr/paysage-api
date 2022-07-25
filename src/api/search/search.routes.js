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
    console.log(should);
    const body = {
      query: {
        bool: {
          must: [
            {
              match: {
                name: query,
              },
            },
          ],
          should,
        },
      },
    };
    console.log(JSON.stringify(body));
    const response = await esClient.search({ index, body });
    console.log(response);
    res.json(response);
    return next();
  });

export default router;
