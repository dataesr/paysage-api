let authorization;
let id;
let resourceId;

const collection = 'structures';
const payload = {
  url: 'https://website.fr',
  type: 'website',
  language: 'fr',
};

beforeAll(async () => {
  authorization = await global.utils.createUser('user');
  const { body } = await global.superapp
    .post(`/${collection}`)
    .set('Authorization', authorization)
    .send({
      creationDate: '2021-02',
      structureStatus: 'active',
      usualName: 'Université',
    });
  resourceId = body.id;
});

beforeEach(async () => {
  const { body } = await global.superapp
    .post(`/${collection}/${resourceId}/weblinks`)
    .set('Authorization', authorization)
    .send(payload);
  id = body.id;
});

afterEach(async () => {
  if (id) {
    await global.superapp
      .delete(`/${collection}/${resourceId}/weblinks/${id}`)
      .set('Authorization', authorization);
  }
});

describe('API > structures > weblinks > create', () => {
  it('should create a new weblink', async () => {
    const { body } = await global.superapp
      .post(`/${collection}/${resourceId}/weblinks`)
      .set('Authorization', authorization)
      .send(payload)
      .expect(201);
    expect(body.id).toBeTruthy();
    expect(body.resourceId).toBe(resourceId);
    expect(body.type).toBe(payload.type);
    expect(body.url).toBe(payload.url);
    expect(body.language).toBe(payload.language);
    expect(body.createdBy.username).toBe('user');

    await global.superapp
      .delete(`/${collection}/${resourceId}/weblinks/${body.id}`)
      .set('Authorization', authorization);
  });

  it('should throw not found if resourceId does not exist', async () => {
    await global.superapp
      .post(`/${collection}/ghe67/weblinks`)
      .set('Authorization', authorization)
      .send(payload)
      .expect(404);
  });

  it('should throw bad request if url is missing', async () => {
    const { url, ...rest } = payload;
    await global.superapp
      .post(`/${collection}/${resourceId}/weblinks`)
      .set('Authorization', authorization)
      .send(rest)
      .expect(400);
  });

  it('should throw bad request if type is missing', async () => {
    const { type, ...rest } = payload;
    await global.superapp
      .post(`/${collection}/${resourceId}/weblinks`)
      .set('Authorization', authorization)
      .send(rest)
      .expect(400);
  });

  it('should throw bad request if type is not allowed', async () => {
    await global.superapp
      .post(`/${collection}/${resourceId}/weblinks`)
      .set('Authorization', authorization)
      .send({ ...payload, type: 'i am not allowed' })
      .expect(400);
  });
  it('should throw bad request if language is not allowed', async () => {
    await global.superapp
      .post(`/${collection}/${resourceId}/weblinks`)
      .set('Authorization', authorization)
      .send({ ...payload, language: 'françois le français' })
      .expect(400);
  });
});

describe('API > structures > weblinks > update', () => {
  it('should update an existing weblink', async () => {
    const type = 'websiteCatForm';
    const { body } = await global.superapp
      .patch(`/${collection}/${resourceId}/weblinks/${id}`)
      .set('Authorization', authorization)
      .send({ type })
      .expect(200);
    expect(body.type).toBe(type);
  });

  it('should throw bad request if id too short', async () => {
    await global.superapp
      .patch(`/${collection}/${resourceId}/weblinks/45frK`)
      .set('Authorization', authorization)
      .send(payload)
      .expect(400);
  });

  it('should throw not found if unexisting id', async () => {
    await global.superapp
      .patch(`/${collection}/${resourceId}/weblinks/45dlrt5dkkhhuu7`)
      .set('Authorization', authorization)
      .send(payload)
      .expect(404);
  });

  it('should throw bad request with badly formatted payload', async () => {
    await global.superapp
      .patch(`/${collection}/${resourceId}/weblinks/${id}`)
      .set('Authorization', authorization)
      .send({ type: 'I am not allowed' })
      .expect(400);
  });
});

describe('API > structures > weblinks > read', () => {
  it('should read existing weblink', async () => {
    const { body } = await global.superapp
      .get(`/${collection}/${resourceId}/weblinks/${id}`)
      .set('Authorization', authorization)
      .expect(200);
    expect(body.id).toBe(id);
    expect(body.resourceId).toBe(resourceId);
    expect(body.type).toBe(payload.type);
    expect(body.url).toBe(payload.url);
    expect(body.createdBy.username).toBe('user');
  });

  it('should throw bad request if id too short', async () => {
    await global.superapp
      .get(`/${collection}/${resourceId}/weblinks/265vty`)
      .set('Authorization', authorization)
      .expect(400);
  });

  it('should throw not found if unexisting id', async () => {
    await global.superapp
      .get(`/${collection}/${resourceId}/weblinks/45dlrt5dkkhhuu7`)
      .set('Authorization', authorization)
      .expect(404);
  });
});

describe('API > structures > weblinks > delete', () => {
  it('should throw bad request if id too short', async () => {
    await global.superapp
      .delete(`/${collection}/${resourceId}/weblinks/vgy775`)
      .set('Authorization', authorization)
      .expect(400);
  });

  it('should throw not found if unexisting id', async () => {
    await global.superapp
      .delete(`/${collection}/${resourceId}/weblinks/45dlrt5dkkhhuu7`)
      .set('Authorization', authorization)
      .expect(404);
  });

  it('should delete existing socialmedia', async () => {
    await global.superapp
      .delete(`/${collection}/${resourceId}/weblinks/${id}`)
      .set('Authorization', authorization)
      .expect(204);
  });
});

describe('API > structures > weblinks > list', () => {
  beforeAll(async () => {
    await global.superapp
      .post(`/${collection}/${resourceId}/weblinks`)
      .set('Authorization', authorization)
      .send({
        url: 'https://url_03',
        type: 'OE1',
      });
    await global.superapp
      .post(`/${collection}/${resourceId}/weblinks`)
      .set('Authorization', authorization)
      .send({
        url: 'https://url_02',
        type: 'TheConversation',
      });
    await global.superapp
      .post(`/${collection}/${resourceId}/weblinks`)
      .set('Authorization', authorization)
      .send({
        url: 'https://url_01',
        type: 'jorfsearch',
      });
  });

  beforeEach(async () => {
    if (id) {
      await global.superapp
        .delete(`/${collection}/${resourceId}/weblinks/${id}`)
        .set('Authorization', authorization);
    }
  });

  it('should list', async () => {
    const { body } = await global.superapp
      .get(`/${collection}/${resourceId}/weblinks`)
      .set('Authorization', authorization);
    const docs = body.data.map((doc) => doc.type);
    expect(docs).toHaveLength(3);
    expect(docs).toContain('OE1');
    expect(docs).toContain('TheConversation');
    expect(docs).toContain('jorfsearch');
  });

  it('should skip weblinks in list', async () => {
    const { body } = await global.superapp
      .get(`/${collection}/${resourceId}/weblinks?skip=1`)
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.type);
    expect(docs).toHaveLength(2);
    expect(docs).toContain('TheConversation');
    expect(docs).toContain('jorfsearch');
    expect(body.totalCount).toBe(3);
  });

  it('should limit weblinks in list', async () => {
    const { body } = await global.superapp
      .get(`/${collection}/${resourceId}/weblinks?limit=1`)
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.type);
    expect(docs).toHaveLength(1);
    expect(docs).toContain('OE1');
    expect(body.totalCount).toBe(3);
  });

  it('should sort weblinks in list', async () => {
    const { body } = await global.superapp
      .get(`/${collection}/${resourceId}/weblinks?sort=url`)
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.url);
    expect(docs).toHaveLength(3);
    expect(docs[0]).toBe('https://url_01');
    expect(body.totalCount).toBe(3);
  });

  it('should reversely sort weblinks in list', async () => {
    const { body } = await global.superapp
      .get(`/${collection}/${resourceId}/weblinks?sort=-url`)
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.url);
    expect(docs).toHaveLength(3);
    expect(docs[0]).toBe('https://url_03');
    expect(body.totalCount).toBe(3);
  });

  it('should filter weblinks in list', async () => {
    const { body } = await global.superapp
      .get(`/${collection}/${resourceId}/weblinks?filters[type]=jorfsearch&filters[url]=https://url_01`)
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.url);
    expect(docs).toHaveLength(1);
    expect(docs).toContain('https://url_01');
    expect(body.totalCount).toBe(1);
  });
});
