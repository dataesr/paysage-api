let authorization;
let id;
let resourceId;

const collection = 'structures';
const payload = {
  type: 'Secrétariat',
  email: 'secretariat@univ.fr',
};

beforeAll(async () => {
  authorization = await global.utils.createUser('user');
  const { body } = await global.superapp
    .post(`/${collection}`)
    .set('Authorization', authorization)
    .send({
      structureStatus: 'active',
      creationDate: '2021-02',
      usualName: 'Université',
    });
  resourceId = body.id;
});

beforeEach(async () => {
  const { body } = await global.superapp
    .post(`/${collection}/${resourceId}/emails`)
    .set('Authorization', authorization)
    .send(payload);
  id = body.id;
});

afterEach(async () => {
  if (id) {
    await global.superapp
      .delete(`/${collection}/${resourceId}/emails/${id}`)
      .set('Authorization', authorization);
  }
});

describe('API > structures > emails > create', () => {
  it('should create a new email', async () => {
    const { body } = await global.superapp
      .post(`/${collection}/${resourceId}/emails`)
      .set('Authorization', authorization)
      .send(payload)
      .expect(201);
    expect(body.id).toBeTruthy();
    expect(body.resourceId).toBe(resourceId);
    expect(body.type).toBe(payload.type);
    expect(body.email).toBe(payload.email);
    expect(body.createdBy.username).toBe('user');

    await global.superapp
      .delete(`/${collection}/${resourceId}/emails/${body.id}`)
      .set('Authorization', authorization);
  });

  it('should throw bad request if type is missing', async () => {
    const { type, ...rest } = payload;
    await global.superapp
      .post(`/${collection}/${resourceId}/emails`)
      .set('Authorization', authorization)
      .send(rest)
      .expect(400);
  });

  it('should accept whatever email type', async () => {
    const { type, ...rest } = payload;
    const { body } = await global.superapp
      .post(`/${collection}/${resourceId}/emails`)
      .set('Authorization', authorization)
      .send({ ...rest, type: 'whatevertype' })
      .expect(201);

    await global.superapp
      .delete(`/${collection}/${resourceId}/emails/${body.id}`)
      .set('Authorization', authorization);
  });

  it('should throw bad request if email is missing', async () => {
    const { email, ...rest } = payload;
    await global.superapp
      .post(`/${collection}/${resourceId}/emails`)
      .set('Authorization', authorization)
      .send(rest)
      .expect(400);
  });

  it('should throw bad request if email is malformed', async () => {
    await global.superapp
      .post(`/${collection}/${resourceId}/emails`)
      .set('Authorization', authorization)
      .send({ ...payload, email: 'not an email' })
      .expect(400);
  });
});

describe('API > structures > emails > update', () => {
  it('should update an existing email', async () => {
    const type = 'Président';
    const { body } = await global.superapp
      .patch(`/${collection}/${resourceId}/emails/${id}`)
      .set('Authorization', authorization)
      .send({ type })
      .expect(200);
    expect(body.type).toBe(type);
  });

  it('should throw bad request if id too short', async () => {
    await global.superapp
      .patch(`/${collection}/${resourceId}/emails/45frK`)
      .set('Authorization', authorization)
      .send({ type: 'Président' })
      .expect(400);
  });

  it('should throw not found if unexisting id', async () => {
    await global.superapp
      .patch(`/${collection}/${resourceId}/emails/45dlrt5dkkhhuu7`)
      .set('Authorization', authorization)
      .send({ type: 'Président' })
      .expect(404);
  });

  it('should throw bad request with badly formatted payload', async () => {
    await global.superapp
      .patch(`/${collection}/${resourceId}/emails/${id}`)
      .set('Authorization', authorization)
      .send({ email: 'not an email' })
      .expect(400);
  });
});

describe('API > structures > emails > read', () => {
  it('should read existing email', async () => {
    const { body } = await global.superapp
      .get(`/${collection}/${resourceId}/emails/${id}`)
      .set('Authorization', authorization)
      .expect(200);
    expect(body.type).toBe(payload.type);
    expect(body.email).toBe(payload.email);
    expect(body.createdBy.username).toBe('user');
  });

  it('should throw bad request if id too short', async () => {
    await global.superapp
      .get(`/${collection}/${resourceId}/emails/265vty`)
      .set('Authorization', authorization)
      .expect(400);
  });

  it('should throw not found if unexisting id', async () => {
    await global.superapp
      .get(`/${collection}/${resourceId}/emails/45dlrt5dkkhhuu7`)
      .set('Authorization', authorization)
      .expect(404);
  });
});

describe('API > structures > emails > delete', () => {
  it('should throw bad request if id too short', async () => {
    await global.superapp
      .delete(`/${collection}/${resourceId}/emails/vgy775`)
      .set('Authorization', authorization)
      .expect(400);
  });

  it('should throw not found if unexisting id', async () => {
    await global.superapp
      .delete(`/${collection}/${resourceId}/emails/45dlrt5dkkhhuu7`)
      .set('Authorization', authorization)
      .expect(404);
  });

  it('should delete existing email', async () => {
    await global.superapp
      .delete(`/${collection}/${resourceId}/emails/${id}`)
      .set('Authorization', authorization)
      .expect(204);
  });
});

describe('API > structures > emails > list', () => {
  beforeAll(async () => {
    await global.superapp
      .post(`/${collection}/${resourceId}/emails/`)
      .set('Authorization', authorization)
      .send(payload);
    await global.superapp
      .post(`/${collection}/${resourceId}/emails/`)
      .set('Authorization', authorization)
      .send({ type: 'Président', email: 'pres@univ.fr' });
    await global.superapp
      .post(`/${collection}/${resourceId}/emails/`)
      .set('Authorization', authorization)
      .send({ type: 'Vice-président', email: 'vicepres@univ.fr' });
  });

  beforeEach(async () => {
    if (id) {
      await global.superapp
        .delete(`/${collection}/${resourceId}/emails/${id}`)
        .set('Authorization', authorization);
    }
  });

  it('should list', async () => {
    const { body } = await global.superapp
      .get(`/${collection}/${resourceId}/emails`)
      .set('Authorization', authorization);
    const docs = body.data.map((doc) => doc.type);
    expect(docs).toHaveLength(3);
    expect(docs).toContain('Secrétariat');
    expect(docs).toContain('Président');
    expect(docs).toContain('Vice-président');
  });

  it('should skip emails in list', async () => {
    const { body } = await global.superapp
      .get(`/${collection}/${resourceId}/emails?skip=1`)
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.type);
    expect(docs).toHaveLength(2);
    expect(docs).toContain('Président');
    expect(docs).toContain('Vice-président');
    expect(body.totalCount).toBe(3);
  });

  it('should limit emails in list', async () => {
    const { body } = await global.superapp
      .get(`/${collection}/${resourceId}/emails?limit=1`)
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.type);
    expect(docs).toHaveLength(1);
    expect(docs).toContain('Secrétariat');
    expect(body.totalCount).toBe(3);
  });

  it('should sort emails in list', async () => {
    const { body } = await global.superapp
      .get(`/${collection}/${resourceId}/emails?sort=email`)
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.email);
    expect(docs).toHaveLength(3);
    expect(docs[0]).toBe('pres@univ.fr');
    expect(body.totalCount).toBe(3);
  });

  it('should reversely sort emails in list', async () => {
    const { body } = await global.superapp
      .get(`/${collection}/${resourceId}/emails?sort=-email`)
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.email);
    expect(docs).toHaveLength(3);
    expect(docs[0]).toBe('vicepres@univ.fr');
    expect(body.totalCount).toBe(3);
  });

  it('should filter emails in list', async () => {
    const { body } = await global.superapp
      .get(`/${collection}/${resourceId}/emails?filters[type]=Président`)
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.email);
    expect(docs).toHaveLength(1);
    expect(docs).toContain('pres@univ.fr');
    expect(body.totalCount).toBe(1);
  });
});
