import config from '../../../config';
import esClient from '../../../services/elastic.service';

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
      type: 'structures',
    },
    refresh: true,
  });
  await esClient.index({
    index,
    body: {
      acronym: 'UE',
      identifiers: ['12345'],
      isDeleted: false,
      name: 'université épicée',
      names: [{
        otherNames: ['other'],
      }],
      type: 'structures',
    },
    refresh: true,
  });
  await esClient.index({
    index,
    body: {
      acronym: 'UL',
      isDeleted: true,
      name: 'université longjumeau',
      type: 'structures',
    },
    refresh: true,
  });
  await esClient.index({
    index,
    body: {
      acronym: 'UEK',
      isDeleted: false,
      name: 'université épicée de kerivach',
      type: 'structures',
    },
    refresh: true,
  });
  await esClient.index({
    index,
    body: {
      acronym: 'PGG',
      isDeleted: false,
      name: 'Lycée Pierre-Gilles de Gennes',
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
    expect(body.data).toHaveLength(5);
  });

  it('should search partial word', async () => {
    const { body } = await global.superapp
      .get('/autocomplete?query=centr')
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
    expect(body.data).toHaveLength(2);
    expect(body.data[0].acronym).toBe('UE');
    expect(body.data[0].isDeleted).toBeFalsy();
    expect(body.data[0].name).toBe('université épicée');
    expect(body.data[0].type).toBe('structures');
  });

  it('should search a 2 words query', async () => {
    const { body } = await global.superapp
      .get('/autocomplete?query=centrale marseille')
      .set('Authorization', authorization)
      .expect(200);
    expect(body.data).toHaveLength(1);
    expect(body.data[0].acronym).toBe('CM');
    expect(body.data[0].isDeleted).toBeFalsy();
    expect(body.data[0].name).toBe('centrale marseille');
    expect(body.data[0].type).toBe('structures');
  });

  it('should search in identifiers field', async () => {
    const { body } = await global.superapp
      .get('/autocomplete?query=12345')
      .set('Authorization', authorization)
      .expect(200);
    expect(body.data).toHaveLength(1);
    expect(body.data[0].acronym).toBe('UE');
    expect(body.data[0].isDeleted).toBeFalsy();
    expect(body.data[0].name).toBe('université épicée');
    expect(body.data[0].type).toBe('structures');
  });

  it('should be deleted', async () => {
    const { body } = await global.superapp
      .get('/autocomplete?query=longjumeau')
      .set('Authorization', authorization)
      .expect(200);
    expect(body.data).toHaveLength(0);
  });

  it('should search into nested fields', async () => {
    const { body } = await global.superapp
      .get('/autocomplete?query=other')
      .set('Authorization', authorization)
      .expect(200);
    expect(body.data).toHaveLength(1);
    expect(body.data[0].name).toBe('université épicée');
  });

  it('should search with an AND operator', async () => {
    const { body } = await global.superapp
      .get('/autocomplete?query=épicée kerivach')
      .set('Authorization', authorization)
      .expect(200);
    expect(body.data).toHaveLength(1);
    expect(body.data[0].name).toBe('université épicée de kerivach');
  });

  it('should search dash separated word', async () => {
    const { body } = await global.superapp
      .get('/autocomplete?query=pierre-gil')
      .set('Authorization', authorization)
      .expect(200);
    expect(body.data).toHaveLength(1);
    expect(body.data[0].name).toBe('Lycée Pierre-Gilles de Gennes');
  });

  it('should search dash separated word 2', async () => {
    const { body } = await global.superapp
      .get('/autocomplete?query=pierre gil')
      .set('Authorization', authorization)
      .expect(200);
    expect(body.data).toHaveLength(1);
    expect(body.data[0].name).toBe('Lycée Pierre-Gilles de Gennes');
  });
});
