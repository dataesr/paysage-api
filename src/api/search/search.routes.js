import express from 'express';

import esClient from '../../services/elastic.service';
import config from '../../config';
import { ServerError } from '../commons/http-errors';
import logger from '../../services/logger.service';

const allowedTypes = ['structures'];

const router = new express.Router();
const { index } = config.elastic;

router.route('/autocomplete')
  .get(async (req, res, next) => {
    const { query, types, limit = 10 } = req.query;
    const parsedTypes = types
      .split(',')
      .map((type) => type.trim())
      .filter((type) => allowedTypes.includes(type));
    const requestedTypes = parsedTypes.length ? parsedTypes : allowedTypes;
    const body = {
      _source: ['id', 'name'],
      suggest: {
        result: {
          text: query,
          completion: {
            field: 'text',
            contexts: {
              type: requestedTypes,
            },
          },
        },
      },
    };
    const esResults = await esClient.search({ index, body })
      .catch((e) => {
        logger.error(e);
        throw new ServerError();
      });
    const response = esResults.body.suggest.result?.[0]?.options
      .map((option) => ({
        score: option._score,
        ...option._source,
        type: option.contexts.type?.[0],
      }))
      .reduce((prev, current) => (
        (prev.map((item) => item.id).includes(current.id)) ? prev : [...prev, current]), [])
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
    res.json({ data: response });
    return next();
  });

export default router;
