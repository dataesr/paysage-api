import { persons as resource, weblinks as subresource } from '../../resources';

let authorization;
let id;
let resourceId;

const payload = {
  url: 'https://website.fr',
  type: 'website',
  language: 'fr',
};

beforeAll(async () => {
  authorization = await global.utils.createUser('user');
  const { body } = await global.superapp
    .post(`/${resource}`)
    .set('Authorization', authorization)
    .send({
      firstName: 'Boris',
      lastName: 'Durand',
    });
  resourceId = body.id;
});

beforeEach(async () => {
  const { body } = await global.superapp
    .post(`/${resource}/${resourceId}/${subresource}`)
    .set('Authorization', authorization)
    .send(payload);
  id = body.id;
});

afterEach(async () => {
  if (id) {
    await global.superapp
      .delete(`/${resource}/${resourceId}/${subresource}/${id}`)
      .set('Authorization', authorization);
  }
});

describe('API > persons > weblinks > create', () => {
  it('should create a new weblink', async () => {
    const { body } = await global.superapp
      .post(`/${resource}/${resourceId}/${subresource}`)
      .set('Authorization', authorization)
      .send(payload)
      .expect(201);
    expect(body.id).toBeTruthy();
    expect(body.resourceId).toBe(resourceId);
    expect(body.type).toBe(payload.type);
    expect(body.url).toBe(payload.url);
    expect(body.language).toBe(payload.language);
    expect(body.createdBy.lastName).toBe('user');

    await global.superapp
      .delete(`/${resource}/${resourceId}/${subresource}/${body.id}`)
      .set('Authorization', authorization);
  });

  it('should throw not found if resourceId does not exist', async () => {
    await global.superapp
      .post(`/${resource}/ghe67/${subresource}`)
      .set('Authorization', authorization)
      .send(payload)
      .expect(404);
  });

  it('should throw bad request if url is missing', async () => {
    const { url, ...rest } = payload;
    await global.superapp
      .post(`/${resource}/${resourceId}/${subresource}`)
      .set('Authorization', authorization)
      .send(rest)
      .expect(400);
  });

  it('should throw bad request if type is missing', async () => {
    const { type, ...rest } = payload;
    await global.superapp
      .post(`/${resource}/${resourceId}/${subresource}`)
      .set('Authorization', authorization)
      .send(rest)
      .expect(400);
  });

  it('should throw bad request if type is not allowed', async () => {
    await global.superapp
      .post(`/${resource}/${resourceId}/${subresource}`)
      .set('Authorization', authorization)
      .send({ ...payload, type: 'i am not allowed' })
      .expect(400);
  });
  it('should throw bad request if language is not allowed', async () => {
    await global.superapp
      .post(`/${resource}/${resourceId}/${subresource}`)
      .set('Authorization', authorization)
      .send({ ...payload, language: 'françois le français' })
      .expect(400);
  });
});

describe('API > persons > weblinks > update', () => {
  it('should update an existing weblink', async () => {
    const type = 'official';
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
      .send(payload)
      .expect(400);
  });

  it('should throw not found if unexisting id', async () => {
    await global.superapp
      .patch(`/${resource}/${resourceId}/${subresource}/45dlrt5dkkhhuu7`)
      .set('Authorization', authorization)
      .send(payload)
      .expect(404);
  });

  it('should throw bad request with badly formatted payload', async () => {
    await global.superapp
      .patch(`/${resource}/${resourceId}/${subresource}/${id}`)
      .set('Authorization', authorization)
      .send({ type: 'I am not allowed' })
      .expect(400);
  });
});

describe('API > persons > weblinks > read', () => {
  it('should read existing weblink', async () => {
    const { body } = await global.superapp
      .get(`/${resource}/${resourceId}/${subresource}/${id}`)
      .set('Authorization', authorization)
      .expect(200);
    expect(body.id).toBe(id);
    expect(body.resourceId).toBe(resourceId);
    expect(body.type).toBe(payload.type);
    expect(body.url).toBe(payload.url);
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

describe('API > persons > weblinks > delete', () => {
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

  it('should delete existing socialmedia', async () => {
    await global.superapp
      .delete(`/${resource}/${resourceId}/${subresource}/${id}`)
      .set('Authorization', authorization)
      .expect(204);
  });
});

describe('API > persons > weblinks > list', () => {
  beforeAll(async () => {
    await global.superapp
      .post(`/${resource}/${resourceId}/${subresource}`)
      .set('Authorization', authorization)
      .send({
        url: 'https://url_03',
        type: 'website',
      });
    await global.superapp
      .post(`/${resource}/${resourceId}/${subresource}`)
      .set('Authorization', authorization)
      .send({
        url: 'https://url_02',
        type: 'personal',
      });
    await global.superapp
      .post(`/${resource}/${resourceId}/${subresource}`)
      .set('Authorization', authorization)
      .send({
        url: 'https://url_01',
        type: 'official',
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
    expect(docs).toContain('website');
    expect(docs).toContain('personal');
    expect(docs).toContain('official');
  });

  it('should filter weblinks in list', async () => {
    const { body } = await global.superapp
      .get(`/${resource}/${resourceId}/${subresource}?filters[type]=official&filters[url]=https://url_01`)
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.url);
    expect(docs).toHaveLength(1);
    expect(docs).toContain('https://url_01');
    expect(body.totalCount).toBe(1);
  });
});
