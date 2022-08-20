import { persons as resource, identifiers as subresource } from '../../resources';

let authorization;
let id;
let resourceId;

const payload = {
  active: true,
  endDate: '2024-02-04',
  startDate: '2022-01-28',
  type: 'ORCID Id',
  value: 'person_id',
};

beforeAll(async () => {
  authorization = await global.utils.createUser('user');
  const { body } = await global.superapp
    .post(`/${resource}`)
    .set('Authorization', authorization)
    .send({
      firstName: 'Jean',
      gender: 'Femme',
      lastName: 'Dupond',
    });
  resourceId = body.id;
});

beforeEach(async () => {
  const { body } = await global.superapp
    .post(`/${resource}/${resourceId}/${subresource}`)
    .set('Authorization', authorization)
    .send(payload)
    .expect(201);
  id = body.id;
});

afterEach(async () => {
  if (id) {
    await global.superapp
      .delete(`/${resource}/${resourceId}/${subresource}/${id}`)
      .set('Authorization', authorization);
  }
});

describe('API > persons > identifiers > create', () => {
  it('should create a new identifier', async () => {
    const { body } = await global.superapp
      .post(`/${resource}/${resourceId}/${subresource}`)
      .set('Authorization', authorization)
      .send(payload)
      .expect(201);
    expect(body.id).toBeTruthy();
    expect(body.type).toBe(payload.type);
    expect(body.value).toBe(payload.value);
    expect(body.active).toBe(payload.active);
    expect(body.createdBy.lastName).toBe('user');

    await global.superapp
      .delete(`/${resource}/${resourceId}/${subresource}/${body.id}`)
      .set('Authorization', authorization);
  });

  it('should throw bad request if type is missing', async () => {
    const { type, ...rest } = payload;
    await global.superapp
      .post(`/${resource}/${resourceId}/${subresource}`)
      .set('Authorization', authorization)
      .send(rest)
      .expect(400);
  });

  it('should throw bad request if value is missing', async () => {
    const { value, ...rest } = payload;
    await global.superapp
      .post(`/${resource}/${resourceId}/${subresource}`)
      .set('Authorization', authorization)
      .send(rest)
      .expect(400);
  });
});

describe('API > persons > identifiers > update', () => {
  it('should update an existing identifier', async () => {
    const type = 'Wikidata';
    const { body } = await global.superapp
      .patch(`/${resource}/${resourceId}/${subresource}/${id}`)
      .set('Authorization', authorization)
      .send({ type })
      .expect(200);
    expect(body.type).toBe(type);
  });

  it('should throw bad request if id too short', async () => {
    await global.superapp
      .patch(`/${resource}/${resourceId}/${subresource}/45frK`)
      .set('Authorization', authorization)
      .send({ type: 'Wikidata' })
      .expect(400);
  });

  it('should throw not found if unexisting id', async () => {
    await global.superapp
      .patch(`/${resource}/${resourceId}/${subresource}/45dlrt5dkkhhuu7`)
      .set('Authorization', authorization)
      .send({ type: 'Wikidata' })
      .expect(404);
  });

  it('should throw bad request with badly formatted payload', async () => {
    await global.superapp
      .patch(`/${resource}/${resourceId}/${subresource}/${id}`)
      .set('Authorization', authorization)
      .send({ startDate: 'Wikidata' })
      .expect(400);
  });

  it('should accept empty dates', async () => {
    await global.superapp
      .patch(`/${resource}/${resourceId}/${subresource}/${id}`)
      .set('Authorization', authorization)
      .send({ startDate: '' })
      .expect(200);
  });
});

describe('API > persons > identifiers > read', () => {
  it('should read existing identifier', async () => {
    const { body } = await global.superapp
      .get(`/${resource}/${resourceId}/${subresource}/${id}`)
      .set('Authorization', authorization)
      .expect(200);
    expect(body.type).toBe(payload.type);
    expect(body.value).toBe(payload.value);
    expect(body.active).toBe(payload.active);
    expect(body.createdBy.lastName).toBe('user');
  });

  it('should throw bad request if id too short', async () => {
    await global.superapp
      .get(`/${resource}/${resourceId}/${subresource}/265vty`)
      .set('Authorization', authorization)
      .expect(400);
  });

  it('should throw not found if unexisting id', async () => {
    await global.superapp
      .get(`/${resource}/${resourceId}/${subresource}/45dlrt5dkkhhuu7`)
      .set('Authorization', authorization)
      .expect(404);
  });
});

describe('API > persons > identifiers > delete', () => {
  it('should throw bad request if id too short', async () => {
    await global.superapp
      .delete(`/${resource}/${resourceId}/${subresource}/vgy775`)
      .set('Authorization', authorization)
      .expect(400);
  });

  it('should throw not found if unexisting id', async () => {
    await global.superapp
      .delete(`/${resource}/${resourceId}/${subresource}/45dlrt5dkkhhuu7`)
      .set('Authorization', authorization)
      .expect(404);
  });

  it('should delete existing identifier', async () => {
    await global.superapp
      .delete(`/${resource}/${resourceId}/${subresource}/${id}`)
      .set('Authorization', authorization)
      .expect(204);
  });
});

describe('API > persons > identifiers > list', () => {
  beforeAll(async () => {
    await global.superapp
      .post(`/${resource}/${resourceId}/${subresource}/`)
      .set('Authorization', authorization)
      .send({
        type: 'Siret',
        value: 'siretID',
        active: true,
        startDate: '2012-01-01',
        endDate: '2014-12-31',
      });
    await global.superapp
      .post(`/${resource}/${resourceId}/${subresource}/`)
      .set('Authorization', authorization)
      .send({
        type: 'Wikidata',
        value: 'wikidataID',
        active: true,
        startDate: '2012-01-01',
        endDate: '2014-12-31',
      });
    await global.superapp
      .post(`/${resource}/${resourceId}/${subresource}/`)
      .set('Authorization', authorization)
      .send({
        type: 'idRef',
        value: 'idrefID',
        active: true,
        startDate: '2012-01-01',
        endDate: '2014-12-31',
      });
  });

  beforeEach(async () => {
    if (id) {
      await global.superapp
        .delete(`/${resource}/${resourceId}/${subresource}/${id}`)
        .set('Authorization', authorization);
    }
  });

  it('should list', async () => {
    const { body } = await global.superapp
      .get(`/${resource}/${resourceId}/${subresource}`)
      .set('Authorization', authorization);
    const docs = body.data.map((doc) => doc.type);
    expect(docs).toHaveLength(3);
    expect(docs).toContain('Siret');
    expect(docs).toContain('Wikidata');
    expect(docs).toContain('idRef');
  });

  it('should skip identifiers in list', async () => {
    const { body } = await global.superapp
      .get(`/${resource}/${resourceId}/${subresource}?skip=1`)
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.type);
    expect(docs).toHaveLength(2);
    expect(docs).toContain('Wikidata');
    expect(docs).toContain('idRef');
    expect(body.totalCount).toBe(3);
  });

  it('should limit identifiers in list', async () => {
    const { body } = await global.superapp
      .get(`/${resource}/${resourceId}/${subresource}?limit=1`)
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.type);
    expect(docs).toHaveLength(1);
    expect(docs).toContain('Siret');
    expect(body.totalCount).toBe(3);
  });

  it('should sort identifiers in list', async () => {
    const { body } = await global.superapp
      .get(`/${resource}/${resourceId}/${subresource}?sort=value`)
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.value);
    expect(docs).toHaveLength(3);
    expect(docs[0]).toBe('idrefID');
    expect(body.totalCount).toBe(3);
  });

  it('should reversely sort identifiers in list', async () => {
    const { body } = await global.superapp
      .get(`/${resource}/${resourceId}/${subresource}?sort=-value`)
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.value);
    expect(docs).toHaveLength(3);
    expect(docs[0]).toBe('wikidataID');
    expect(body.totalCount).toBe(3);
  });

  it('should filter identifiers in list', async () => {
    const { body } = await global.superapp
      .get(`/${resource}/${resourceId}/${subresource}?filters[type]=Wikidata&filters[value]=wikidataID`)
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.value);
    expect(docs).toHaveLength(1);
    expect(docs).toContain('wikidataID');
    expect(body.totalCount).toBe(1);
  });
});
