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
      names: [{
        otherNames: 'other',
      }],
      search: 'université épicée UE other',
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
      search: 'université longjumeau UL',
      type: 'structures',
    },
    refresh: true,
  });
  await esClient.index({
    index,
    body: {
      acronym: 'PGG',
      isDeleted: false,
      name: 'lycée Pierre-Gilles de Gennes',
      search: 'lycée Pierre-Gilles de Gennes PGG',
      type: 'structures',
    },
    refresh: true,
  });
});

describe('API > search', () => {
  it('should autocomplete partial word', async () => {
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

  it('should autocomplete accentuated characters', async () => {
    const { body } = await global.superapp
      .get('/autocomplete?query=épic')
      .set('Authorization', authorization)
      .expect(200);
    expect(body.data).toHaveLength(1);
    expect(body.data[0].acronym).toBe('UE');
    expect(body.data[0].isDeleted).toBeFalsy();
    expect(body.data[0].name).toBe('université épicée');
    expect(body.data[0].type).toBe('structures');
  });

  it('should autocomplete a 2 words query', async () => {
    const { body } = await global.superapp
      .get('/autocomplete?query=centrale mars')
      .set('Authorization', authorization)
      .expect(200);
    expect(body.data).toHaveLength(1);
    expect(body.data[0].acronym).toBe('CM');
    expect(body.data[0].isDeleted).toBeFalsy();
    expect(body.data[0].name).toBe('centrale marseille');
    expect(body.data[0].type).toBe('structures');
  });

  it('should be deleted', async () => {
    const { body } = await global.superapp
      .get('/autocomplete?query=longjumeau')
      .set('Authorization', authorization)
      .expect(200);
    expect(body.data).toHaveLength(0);
  });

  it('should autocomplete into nested fields', async () => {
    const { body } = await global.superapp
      .get('/autocomplete?query=othe')
      .set('Authorization', authorization)
      .expect(200);
    expect(body.data).toHaveLength(1);
    expect(body.data[0].name).toBe('université épicée');
  });

  it('should autocomplete with special characters like hyphen', async () => {
    const { body: body1 } = await global.superapp
      .get('/autocomplete?query=Pierre-Gil')
      .set('Authorization', authorization)
      .expect(200);
    expect(body1.data).toHaveLength(1);
    expect(body1.data[0].acronym).toBe('PGG');
    expect(body1.data[0].isDeleted).toBeFalsy();
    expect(body1.data[0].name).toBe('lycée Pierre-Gilles de Gennes');
    expect(body1.data[0].type).toBe('structures');

    const { body: body2 } = await global.superapp
      .get('/autocomplete?query=Pierre Gil')
      .set('Authorization', authorization)
      .expect(200);
    expect(body2.data).toHaveLength(1);
    expect(body2.data[0].acronym).toBe('PGG');
    expect(body2.data[0].isDeleted).toBeFalsy();
    expect(body2.data[0].name).toBe('lycée Pierre-Gilles de Gennes');
    expect(body2.data[0].type).toBe('structures');
  });
});
