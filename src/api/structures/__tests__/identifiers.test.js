import {
  structures as resource,
  identifiers as subresource,
} from '../../resources';

let authorization;
let resourceId;

const payload = {
  active: false,
  endDate: '2014-12-31',
  startDate: '2012-01-01',
  type: 'siret',
  value: '12345678912345',
};

beforeAll(async () => {
  authorization = await global.utils.createUser('user');
  const { body } = await global.superapp
    .post(`/${resource}`)
    .set('Authorization', authorization)
    .send({
      structureStatus: 'active',
      creationDate: '2021-02',
      usualName: 'Université',
    });
  resourceId = body.id;
});

afterEach(async () => {
  // Delete all structures identifiers
  const { body } = await global.superapp
    .get(`/${resource}/${resourceId}/${subresource}`)
    .set('Authorization', authorization);
  const promises = body.data.map((identifier) => global.superapp
    .delete(`/${resource}/${resourceId}/${subresource}/${identifier.id}`)
    .set('Authorization', authorization));

  await Promise.all(promises);
});

describe('API > structures > identifiers > create', () => {
  it('should create a new identifier', async () => {
    const { body } = await global.superapp
      .post(`/${resource}/${resourceId}/${subresource}`)
      .set('Authorization', authorization)
      .send(payload)
      .expect(201);
    expect(body.id).toBeTruthy();
    expect(body.resourceId).toBe(resourceId);
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

  it('should return 204 if an identifier with same type and same value already exists', async () => {
    const paylod = { type: 'siret', value: '12345678912346' };

    await global.superapp
      .post(`/${resource}/${resourceId}/${subresource}`)
      .set('Authorization', authorization)
      .send(paylod)
      .expect(201);

    await global.superapp
      .post(`/${resource}/${resourceId}/${subresource}`)
      .set('Authorization', authorization)
      .send(paylod)
      .expect(204);
  });
});

describe('API > structures > identifiers > update', () => {
  it('should update an existing identifier', async () => {
    const { body: { id } } = await global.superapp
      .post(`/${resource}/${resourceId}/${subresource}`)
      .set('Authorization', authorization)
      .send(payload);

    const type = 'wikidata';
    const { body: updatedBody } = await global.superapp
      .patch(`/${resource}/${resourceId}/${subresource}/${id}`)
      .set('Authorization', authorization)
      .send({ type })
      .expect(200);
    expect(updatedBody.type).toBe(type);
  });

  it('should throw bad request if id too short', async () => {
    await global.superapp
      .patch(`/${resource}/${resourceId}/${subresource}/45frK`)
      .set('Authorization', authorization)
      .send({ type: 'wikidata' })
      .expect(400);
  });

  it('should throw not found if unexisting id', async () => {
    await global.superapp
      .patch(`/${resource}/${resourceId}/${subresource}/45dlrt5dkkhhuu7`)
      .set('Authorization', authorization)
      .send({ type: 'wikidata' })
      .expect(404);
  });

  it('should throw bad request with badly formatted payload', async () => {
    const { body: { id } } = await global.superapp
      .post(`/${resource}/${resourceId}/${subresource}`)
      .set('Authorization', authorization)
      .send(payload);

    await global.superapp
      .patch(`/${resource}/${resourceId}/${subresource}/${id}`)
      .set('Authorization', authorization)
      .send({ startDate: 'wikidata' })
      .expect(400);
  });

  it('should accept empty dates', async () => {
    const { body: { id } } = await global.superapp
      .post(`/${resource}/${resourceId}/${subresource}`)
      .set('Authorization', authorization)
      .send(payload);

    await global.superapp
      .patch(`/${resource}/${resourceId}/${subresource}/${id}`)
      .set('Authorization', authorization)
      .send({ startDate: '' })
      .expect(200);
  });
});

describe('API > structures > identifiers > read', () => {
  it('should read existing identifier', async () => {
    const { body } = await global.superapp
      .post(`/${resource}/${resourceId}/${subresource}`)
      .set('Authorization', authorization)
      .send(payload);
    const { id } = body;

    const { body: readBody } = await global.superapp
      .get(`/${resource}/${resourceId}/${subresource}/${id}`)
      .set('Authorization', authorization)
      .expect(200);
    expect(readBody.type).toBe(payload.type);
    expect(readBody.value).toBe(payload.value);
    expect(readBody.active).toBeFalsy();
    expect(readBody.createdBy.lastName).toBe('user');
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

describe('API > structures > identifiers > delete', () => {
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
    const { body: { id } } = await global.superapp
      .post(`/${resource}/${resourceId}/${subresource}`)
      .set('Authorization', authorization)
      .send(payload);

    await global.superapp
      .delete(`/${resource}/${resourceId}/${subresource}/${id}`)
      .set('Authorization', authorization)
      .expect(204);
  });
});

describe('API > structures > identifiers > list', () => {
  beforeAll(async () => {
    await global.superapp
      .post(`/${resource}/${resourceId}/${subresource}/`)
      .set('Authorization', authorization)
      .send({
        type: 'siret',
        value: 'siretID',
        active: true,
        startDate: '2012-01-01',
        endDate: '2014-12-31',
      });
    await global.superapp
      .post(`/${resource}/${resourceId}/${subresource}/`)
      .set('Authorization', authorization)
      .send({
        type: 'wikidata',
        value: 'wikidataID',
        active: true,
        startDate: '2012-01-01',
        endDate: '2014-12-31',
      });
    await global.superapp
      .post(`/${resource}/${resourceId}/${subresource}/`)
      .set('Authorization', authorization)
      .send({
        type: 'idref',
        value: 'idrefID',
        active: true,
        startDate: '2012-01-01',
        endDate: '2014-12-31',
      });
  });

  it('should list', async () => {
    const { body } = await global.superapp
      .get(`/${resource}/${resourceId}/${subresource}`)
      .set('Authorization', authorization);
    const docs = body.data.map((doc) => doc.type);
    expect(docs).toHaveLength(3);
    expect(docs).toContain('siret');
    expect(docs).toContain('wikidata');
    expect(docs).toContain('idref');
  });
});
