import express from 'express';

import esClient from '../../services/elastic.service';
import config from '../../config';
import { ServerError } from '../commons/http-errors';
import logger from '../../services/logger.service';
import { categories, legalcategories, officialtexts, persons, prices, projects, structures, terms, users } from '../resources';

const allowedTypes = [categories, legalcategories, officialtexts, persons, prices, projects, structures, terms, users];

const router = new express.Router();
const { index } = config.elastic;

router.route('/autocomplete')
  .get(async (req, res, next) => {
    const { limit = 10, query, start = 0, types = '' } = req.query;
    const parsedTypes = types
      .split(',')
      .map((type) => type.trim())
      .filter((type) => allowedTypes.includes(type));
    const requestedTypes = parsedTypes.length ? parsedTypes : allowedTypes;
    const body = {
      query: {
        bool: {
          filter: [{
            terms: {
              'type.keyword': requestedTypes,
            },
          }, {
            term: {
              isDeleted: false,
            },
          }],
        },
      },
      _source: {
        excludes: ['search'],
      },
      aggs: {
        byTypes: {
          terms: {
            field: 'type.keyword',
          },
        },
      },
      from: start,
      size: limit,
    };
    if (query) {
      body.query.bool.must = [{ wildcard: { search: `*${query}*` } }];
    }
    const esResults = await esClient.search({ index, body })
      .catch((e) => {
        logger.error(e);
        throw new ServerError();
      });
    const response = esResults.body.hits.hits
      .map((hit) => ({
        id: hit._id,
        score: hit._score,
        ...hit._source,
      }))
      .reduce((prev, current) => (
        (prev.map((item) => item.id).includes(current.id)) ? prev : [...prev, current]), []);
    const buckets = esResults?.body?.aggregations?.byTypes?.buckets || [];
    const aggregation = buckets.map((bucket) => ({
      count: bucket.doc_count,
      key: bucket.key,
    }));
    res.json({ data: response, aggregation });
    return next();
  });

export default router;
