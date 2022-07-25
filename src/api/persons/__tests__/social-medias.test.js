import { persons as resource, socialmedias as subresource } from '../../resources';

let authorization;
let id;
let resourceId;

const payload = {
  account: 'my_account',
  type: 'Dailymotion',
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

describe('API > persons > socialmedias > create', () => {
  it('should create a new socialmedia', async () => {
    const { body } = await global.superapp
      .post(`/${resource}/${resourceId}/${subresource}`)
      .set('Authorization', authorization)
      .send(payload)
      .expect(201);
    expect(body.id).toBeTruthy();
    expect(body.resourceId).toBe(resourceId);
    expect(body.type).toBe(payload.type);
    expect(body.account).toBe(payload.account);
    expect(body.createdBy.lastName).toBe('user');

    await global.superapp
      .delete(`/${resource}/${resourceId}/${subresource}/${body.id}`)
      .set('Authorization', authorization);
  });

  it('should throw bad request if resourceId does not exist', async () => {
    const { account, ...rest } = payload;
    await global.superapp
      .post(`/${resource}/${resourceId}/${subresource}`)
      .set('Authorization', authorization)
      .send(rest)
      .expect(400);
  });

  it('should throw bad request if account is missing', async () => {
    const { account, ...rest } = payload;
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
});

describe('API > persons > socialmedias > update', () => {
  it('should update an existing socialmedia', async () => {
    const type = 'Github';
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
      .send({ type: false })
      .expect(400);
  });
});

describe('API > persons > socialmedias > read', () => {
  it('should read existing socialmedia', async () => {
    const { body } = await global.superapp
      .get(`/${resource}/${resourceId}/${subresource}/${id}`)
      .set('Authorization', authorization)
      .expect(200);
    expect(body.id).toBe(id);
    expect(body.resourceId).toBe(resourceId);
    expect(body.type).toBe(payload.type);
    expect(body.account).toBe(payload.account);
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

describe('API > persons > socialmedias > delete', () => {
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

describe('API > persons > socialmedias > list', () => {
  beforeAll(async () => {
    await global.superapp
      .post(`/${resource}/${resourceId}/${subresource}/`)
      .set('Authorization', authorization)
      .send({
        account: 'account_03',
        type: 'Twitter',
      });
    await global.superapp
      .post(`/${resource}/${resourceId}/${subresource}/`)
      .set('Authorization', authorization)
      .send({
        account: 'account_02',
        type: 'Facebook',
      });
    await global.superapp
      .post(`/${resource}/${resourceId}/${subresource}/`)
      .set('Authorization', authorization)
      .send({
        account: 'account_01',
        type: 'Youtube',
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
    expect(docs).toContain('Twitter');
    expect(docs).toContain('Facebook');
    expect(docs).toContain('Youtube');
  });

  it('should skip socialmedias in list', async () => {
    const { body } = await global.superapp
      .get(`/${resource}/${resourceId}/${subresource}?skip=1`)
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.type);
    expect(docs).toHaveLength(2);
    expect(docs).toContain('Facebook');
    expect(docs).toContain('Youtube');
    expect(body.totalCount).toBe(3);
  });

  it('should limit socialmedias in list', async () => {
    const { body } = await global.superapp
      .get(`/${resource}/${resourceId}/${subresource}?limit=1`)
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.type);
    expect(docs).toHaveLength(1);
    expect(docs).toContain('Twitter');
    expect(body.totalCount).toBe(3);
  });

  it('should sort socialmedias in list', async () => {
    const { body } = await global.superapp
      .get(`/${resource}/${resourceId}/${subresource}?sort=account`)
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.account);
    expect(docs).toHaveLength(3);
    expect(docs[0]).toBe('account_01');
    expect(body.totalCount).toBe(3);
  });

  it('should reversely sort socialmedias in list', async () => {
    const { body } = await global.superapp
      .get(`/${resource}/${resourceId}/${subresource}?sort=-account`)
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.account);
    expect(docs).toHaveLength(3);
    expect(docs[0]).toBe('account_03');
    expect(body.totalCount).toBe(3);
  });

  it('should filter socialmedias in list', async () => {
    const { body } = await global.superapp
      .get(`/${resource}/${resourceId}/${subresource}?filters[type]=Youtube&filters[account]=account_01`)
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.account);
    expect(docs).toHaveLength(1);
    expect(docs).toContain('account_01');
    expect(body.totalCount).toBe(1);
  });
});
