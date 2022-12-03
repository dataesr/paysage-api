import { structures as resource, names as subresource } from '../../resources';

let authorization;
let id;
let resourceId;

const structureName = {
  officialName: 'string',
  usualName: 'string',
  shortName: 'string',
  brandName: 'string',
  nameEn: 'string',
  acronymFr: 'string',
  acronymEn: 'string',
  otherNames: [
    'string',
  ],
  startDate: '2012-01-01',
  comment: 'string',
  article: "à l'",
};

beforeAll(async () => {
  authorization = await global.utils.createUser('user');
  const response = await global.superapp
    .post(`/${resource}`)
    .set('Authorization', authorization)
    .send({
      structureStatus: 'active',
      creationDate: '2021-02',
      usualName: 'Université',
    }).expect(201);
  resourceId = response.body.id;
});

describe('API > structures > names > create', () => {
  it('can create successfully', async () => {
    const response = await global.superapp
      .post(`/${resource}/${resourceId}/${subresource}`)
      .set('Authorization', authorization)
      .send(structureName)
      .expect(201);
    expect(response.body.id).toBeTruthy();
    expect(response.body.officialName).toBe('string');
    expect(response.body.usualName).toBe('string');
    expect(response.body.createdBy.lastName).toBe('user');
    id = response.body.id;
  });

  it('should fail if usualName is missing', async () => {
    const { usualName, ...rest } = structureName;
    await global.superapp
      .post(`/${resource}/${resourceId}/${subresource}`)
      .set('Authorization', authorization)
      .send(rest)
      .expect(400);
  });

  it('throws with unknown resource', async () => {
    await global.superapp
      .post(`/${resource}/re98D/${subresource}`)
      .set('Authorization', authorization)
      .send(structureName)
      .expect(404);
  });
});

describe('API > structures > names > update', () => {
  it('can update successfully', async () => {
    const { body } = await global.superapp
      .patch(`/${resource}/${resourceId}/${subresource}/${id}`)
      .set('Authorization', authorization)
      .send({ otherNames: ['string', 'string2'], article: null })
      .expect(200);
    expect(body.otherNames).toHaveLength(2);
    expect(body.otherNames).toContain('string2');
  });

  it('throws bad request with wrong id', async () => {
    await global.superapp
      .patch(`/${resource}/${resourceId}/${subresource}/45frK`)
      .set('Authorization', authorization)
      .send({ otherNames: ['string', 'string2'] })
      .expect(400);
  });

  it('throws not found with wrong id', async () => {
    await global.superapp
      .patch(`/${resource}/${resourceId}/${subresource}/45dlrt5dkkhhuu7`)
      .set('Authorization', authorization)
      .send({ otherNames: ['string', 'string2'] })
      .expect(404);
  });

  it('throws with wrong data', async () => {
    await global.superapp
      .patch(`/${resource}/${resourceId}/${subresource}/${id}`)
      .set('Authorization', authorization)
      .send({ startDate: 'string' })
      .expect(400);
  });

  it('can empty dates', async () => {
    const { body } = await global.superapp
      .patch(`/${resource}/${resourceId}/${subresource}/${id}`)
      .set('Authorization', authorization)
      .send({ startDate: '' })
      .expect(200);
    expect(body.startDate).toBe(null);
  });
});

describe('API > structures > names > read', () => {
  it('can read successfully', async () => {
    const response = await global.superapp
      .get(`/${resource}/${resourceId}/${subresource}/${id}`)
      .set('Authorization', authorization)
      .expect(200);
    expect(response.body.id).toBeTruthy();
    expect(response.body.officialName).toBe('string');
    expect(response.body.usualName).toBe('string');
    expect(response.body.createdBy.lastName).toBe('user');
    expect(response.body.otherNames).toHaveLength(2);
    expect(response.body.otherNames).toContain('string2');
  });

  it('throws bad request with wrong id', async () => {
    await global.superapp
      .get(`/${resource}/${resourceId}/${subresource}/265vty`)
      .set('Authorization', authorization)
      .expect(400);
  });

  it('throws not found with unknown id', async () => {
    await global.superapp
      .get(`/${resource}/${resourceId}/${subresource}/45dlrt5dkkhhuu7`)
      .set('Authorization', authorization)
      .expect(404);
  });
});

describe('API > structures > names > delete', () => {
  it('throws bad request with wrong id', async () => {
    await global.superapp
      .delete(`/${resource}/${resourceId}/${subresource}/vgy775`)
      .set('Authorization', authorization)
      .expect(400);
  });
  it('throws not found with unknown id', async () => {
    await global.superapp
      .delete(`/${resource}/${resourceId}/${subresource}/45dlrt5dkkhhuu7`)
      .set('Authorization', authorization)
      .expect(404);
  });
});

describe('API > structures > names > list', () => {
  beforeAll(async () => {
    await global.superapp
      .post(`/${resource}/${resourceId}/${subresource}/`)
      .set('Authorization', authorization)
      .send({ ...structureName, usualName: 'string2', startDate: null })
      .expect(201);
    await global.superapp
      .post(`/${resource}/${resourceId}/${subresource}/`)
      .set('Authorization', authorization)
      .send({ ...structureName, usualName: 'string3', startDate: '2017-01-01' })
      .expect(201);
  });

  it('can list successfully', async () => {
    const { body } = await global.superapp
      .get(`/${resource}/${resourceId}/${subresource}`)
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.usualName);
    expect(docs).toContain('Université');
    expect(docs).toContain('string2');
    expect(docs).toContain('string3');
  });

  it('returns currentName successfully', async () => {
    const { body } = await global.superapp
      .get(`/${resource}/${resourceId}`)
      .set('Authorization', authorization)
      .expect(200);
    expect(body.currentName.startDate).toBe('2017-01-01');
  });
});

describe('API > structures > names > currentName', () => {
  beforeAll(async () => {
    const { startDate, ...structure } = structureName;
    const response = await global.superapp
      .post(`/${resource}`)
      .set('Authorization', authorization)
      .send({
        structureStatus: 'active',
        creationDate: '2021-02',
        usualName: 'Université',
      }).expect(201);
    resourceId = response.body.id;
    await global.superapp
      .post(`/${resource}/${resourceId}/${subresource}/`)
      .set('Authorization', authorization)
      .send({ ...structure })
      .expect(201);
    await global.superapp
      .post(`/${resource}/${resourceId}/${subresource}/`)
      .set('Authorization', authorization)
      .send({ ...structure, usualName: 'string2' })
      .expect(201);
    await global.superapp
      .post(`/${resource}/${resourceId}/${subresource}/`)
      .set('Authorization', authorization)
      .send({ ...structure, usualName: 'string3' })
      .expect(201);
  });

  it('returns currentName successfully', async () => {
    const { body } = await global.superapp
      .get(`/${resource}/${resourceId}`)
      .set('Authorization', authorization)
      .expect(200);
    expect(body.currentName.usualName).toBe('string3');
  });
});
