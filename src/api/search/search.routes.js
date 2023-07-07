import express from 'express';

import config from '../../config';
import esClient from '../../services/elastic.service';
import logger from '../../services/logger.service';
import { ServerError } from '../commons/http-errors';
import { categories, legalcategories, officialtexts, persons, prizes, projects, structures, terms, users } from '../resources';

const allowedTypes = [categories, legalcategories, officialtexts, persons, prizes, projects, structures, terms, users];
const searchedFields = [
  'acronym',
  'acronymFr',
  'acronymEn',
  'acronymLocal',
  'brandName',
  'category',
  'city',
  'firstName',
  'id',
  'identifiers',
  'alternativePaysageIds',
  'lastName',
  'locality',
  'name',
  'nameEn',
  'names',
  'names.acronymFr',
  'names.id',
  'names.nameEn',
  'names.officialName',
  'names.otherNames',
  'names.shortName',
  'names.usualName',
  'officialName',
  'otherNames',
  'otherNamesEn',
  'otherNamesFr',
  'shortName',
];

const router = new express.Router();
const { index } = config.elastic;

router.route('/autocomplete')
  .get(async (req, res, next) => {
    const { limit = 10, query, start = 0, types = '' } = req.query;
    const parsedTypes = types
      .split(',')
      .map((type) => type.trim())
      .filter((type) => allowedTypes.includes(type));
    // By default, search in all types but users
    const requestedTypes = parsedTypes.length ? parsedTypes : allowedTypes.filter((type) => type !== users);
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
          should: [{
            constant_score: {
              filter: {
                term: {
                  type: 'categories',
                },
              },
              boost: 4,
            },
          }, {
            constant_score: {
              filter: {
                term: {
                  type: 'structures',
                },
              },
              boost: 3,
            },
          }, {
            constant_score: {
              filter: {
                term: {
                  type: 'persons',
                },
              },
              boost: 2,
            },
          }],
        },
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
      body.query.bool.must = [{
        bool: {
          should: [{
            query_string: {
              query: `*"${query.replace(/-/g, ' ')}"*`,
              default_operator: 'AND',
              fields: searchedFields,
            },
          }, {
            query_string: {
              query: `*${query.replace(/-/g, ' ')}*`,
              default_operator: 'AND',
              fields: searchedFields,
            },
          }],
        },
      }];
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
