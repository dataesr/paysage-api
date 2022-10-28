import esClient from '../../../services/elastic.service';
import config from '../../../config';

let authorization;
const { index } = config.elastic;

beforeAll(async () => {
  authorization = await global.utils.createUser('user');
  // Delete all indexed documents
  await esClient.deleteByQuery({
    index,
    body: {
      query: {
        match_all: {},
      },
    },
  });
  await esClient.index({
    index,
    body: {
      acronym: 'UK',
      isDeleted: false,
      name: 'Université de Kerivach',
      search: 'Université de Kerivach UK',
      type: 'structures',
    },
  });
});

describe('API > search', () => {
  it('should find all indexed documents', async () => {
    const { body } = await global.superapp
      .get('/autocomplete')
      .set('Authorization', authorization)
      .expect(200);
    expect(body.data).toHaveLength(1);
    expect(body.data[0].acronym).toBe('UK');
    expect(body.data[0].isDeleted).toBeFalsy();
    expect(body.data[0].name).toBe('Université de Kerivach');
    expect(body.data[0].type).toBe('structures');
  });
});
