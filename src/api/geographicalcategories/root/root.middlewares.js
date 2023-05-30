import { BadRequestError } from '../../commons/http-errors';

import esClient from '../../../services/elastic.service';
import config from '../../../config';
import { geographicalCategoriesRepository as repository } from '../../commons/repositories';

const { index } = config.elastic;

export async function validatePayload(req, res, next) {
  if (!Object.keys(req.body).length) throw new BadRequestError('Payload missing');
  return next();
}

export async function getGeographicalCategoryById(req, res, next) {
  const { id } = req.params;
  try {
    const { data: geographicalCategory } = await repository.find({ filters: { id } });
    if (!geographicalCategory) {
      return res.status(404).json({ error: 'Geographical category not found' });
    }
    req.geographicalCategory = geographicalCategory;
    return next();
  } catch (error) {
    return res.status(500).json({ error: 'An error occurred while fetching data' });
  }
}

export async function getStructureFromGeoCategory(req, res, next) {
  try {
    const { geographicalCategory } = req;
    const body = JSON.stringify({
      query: {
        bool: {
          must: {
            match: {
              type: 'structures',
            },
          },
          filter: {
            geo_shape: {
              coordinates: {
                shape: geographicalCategory[0].geometry,
                relation: 'within',
              },
            },
          },
        },
      },
      size: 30,
    });

    const response = await esClient.search({ index, body });
    const data = response.body?.hits?.hits?.map((hit) => hit?._source) || [];
    res.status(200).json({ data, totalCount: data.length });
    next();
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching data' });
    next(error);
  }
}
