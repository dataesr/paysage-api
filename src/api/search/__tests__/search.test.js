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
    refresh: true,
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
    refresh: true,
  });
  await esClient.index({
    index,
    body: {
      acronym: 'CM',
      isDeleted: false,
      name: 'centrale marseille',
      search: 'centrale marseille CM',
      type: 'structures',
    },
    refresh: true,
  });
  await esClient.index({
    index,
    body: {
      acronym: 'UE',
      isDeleted: false,
      name: 'université épicée',
      search: 'université épicée UE',
      type: 'structures',
    },
    refresh: true,
  });
});

describe('API > search', () => {
  it('should find all indexed documents', async () => {
    const { body } = await global.superapp
      .get('/autocomplete')
      .set('Authorization', authorization)
      .expect(200);
    expect(body.data).toHaveLength(3);
  });

  it('should autocomplete', async () => {
    const { body } = await global.superapp
      .get('/autocomplete?query=centra')
      .set('Authorization', authorization)
      .expect(200);
    expect(body.data).toHaveLength(1);
    expect(body.data[0].acronym).toBe('CM');
    expect(body.data[0].isDeleted).toBeFalsy();
    expect(body.data[0].name).toBe('centrale marseille');
    expect(body.data[0].type).toBe('structures');
  });

  it('should find accentuated characters', async () => {
    const { body } = await global.superapp
      .get('/autocomplete?query=épice')
      .set('Authorization', authorization)
      .expect(200);
    expect(body.data).toHaveLength(1);
    expect(body.data[0].acronym).toBe('UE');
    expect(body.data[0].isDeleted).toBeFalsy();
    expect(body.data[0].name).toBe('université épicée');
    expect(body.data[0].type).toBe('structures');
  });

  it('should search a 2 words query', async () => {
    const { body } = await global.superapp
      .get('/autocomplete?query=centr mars')
      .set('Authorization', authorization)
      .expect(200);
    expect(body.data).toHaveLength(1);
    expect(body.data[0].acronym).toBe('CM');
    expect(body.data[0].isDeleted).toBeFalsy();
    expect(body.data[0].name).toBe('centrale marseille');
    expect(body.data[0].type).toBe('structures');
  });

  it('should search all the terms of the query and not only one of it', async () => {
    const { body } = await global.superapp
      .get('/autocomplete?query=univ keri')
      .set('Authorization', authorization)
      .expect(200);
    expect(body.data).toHaveLength(1);
    expect(body.data[0].acronym).toBe('UK');
    expect(body.data[0].isDeleted).toBeFalsy();
    expect(body.data[0].name).toBe('Université de Kerivach');
    expect(body.data[0].type).toBe('structures');
  });
});
