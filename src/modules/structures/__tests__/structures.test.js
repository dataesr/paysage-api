let authorization;
let id;
beforeAll(async () => {
  authorization = await global.utils.createUser('user');
});

describe('API > structures > structures > create', () => {
  it('can create successfully', async () => {
    const { body } = await global.superapp
      .post('/structures')
      .set('Authorization', authorization)
      .send({
        structureStatus: 'active',
      }).expect(201);
    expect(body.id).toBeTruthy();
    expect(body.createdBy.username).toBe('user');
    id = body.id;
  });
});

describe('API > structures > structures > update', () => {
  it('throws not found with wrong id', async () => {
    await global.superapp
      .patch('/structures/45frK')
      .set('Authorization', authorization)
      .send({
        structureStatus: 'inactive',
      }).expect(404);
  });
  it('can update successfully', async () => {
    const { body } = await global.superapp
      .patch(`/structures/${id}`)
      .set('Authorization', authorization)
      .send({ structureStatus: 'inactive' })
      .expect(200);
    expect(body.structureStatus).toBe('inactive');
  });
  it('ignore additional properties', async () => {
    await global.superapp
      .patch(`/structures/${id}`)
      .set('Authorization', authorization)
      .send({ status: 'test' })
      .expect(400);
  });
});

describe('API > structures > status > update', () => {
  it('throws not found with wrong id', async () => {
    await global.superapp
      .put('/structures/45frK/status')
      .set('Authorization', authorization)
      .send({ status: 'published' })
      .expect(404);
  });
  it('can set status to published successfully', async () => {
    const { body } = await global.superapp
      .put(`/structures/${id}/status`)
      .set('Authorization', authorization)
      .send({ status: 'published' })
      .expect(200);
    expect(body.status).toBe('published');
  });
  it('throws with unknown redirection', async () => {
    await global.superapp
      .put(`/structures/${id}/status`)
      .set('Authorization', authorization)
      .send({ status: 'redirected', redirection: '45frK' })
      .expect(400);
  });
  it('throws if redirected status is not set along redirection', async () => {
    await global.superapp
      .put(`/structures/${id}/status`)
      .set('Authorization', authorization)
      .send({ redirection: '45frK' })
      .expect(400);
  });
  it('throws with unset redirection', async () => {
    await global.superapp
      .put(`/structures/${id}/status`)
      .set('Authorization', authorization)
      .send({ status: 'redirected' })
      .expect(400);
  });
  it('can set redirection', async () => {
    const { body } = await global.superapp
      .post('/structures')
      .set('Authorization', authorization)
      .send({
        structureStatus: 'active',
      }).expect(201);
    const res = await global.superapp
      .put(`/structures/${id}/status`)
      .set('Authorization', authorization)
      .send({ status: 'redirected', redirection: body.id })
      .expect(200);
    expect(res.body.status).toBe('redirected');
    expect(res.body.redirection).toBe(body.id);
  });
});

describe('API > structures > structures > read', () => {
  it('can read successfully', async () => {
    const response = await global.superapp
      .get(`/structures/${id}`)
      .set('Authorization', authorization)
      .expect(200);
    expect(response.body.structureStatus).toBe('inactive');
    expect(response.body.id).toBe(id);
    expect(response.body.createdBy.username).toBe('user');
  });
  it('throws not found with unknown id', async () => {
    await global.superapp
      .get('/structures/45frK')
      .set('Authorization', authorization)
      .expect(404);
  });
});

describe('API > structures > structures > delete', () => {
  it('throws not found with wrong id', async () => {
    await global.superapp
      .delete('/structures/45frK')
      .set('Authorization', authorization)
      .expect(404);
  });
  it('can delete successfully', async () => {
    await global.superapp
      .delete(`/structures/${id}`)
      .set('Authorization', authorization)
      .expect(204);
  });
});

describe('API > structures > structures > list', () => {
  beforeAll(async () => {
    await global.utils.db.collection('structures').deleteMany({});
    await global.superapp
      .post('/structures')
      .set('Authorization', authorization)
      .send({
        structureStatus: 'active',
      }).expect(201);
    await global.superapp
      .post('/structures')
      .set('Authorization', authorization)
      .send({
        structureStatus: 'inactive',
      }).expect(201);
    await global.superapp
      .post('/structures')
      .set('Authorization', authorization)
      .send({
        structureStatus: 'forthcoming',
      }).expect(201);
  });
  it('can list successfully', async () => {
    const { body } = await global.superapp
      .get('/structures')
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.structureStatus);
    expect(docs).toContain('forthcoming');
    expect(docs).toContain('active');
    expect(docs).toContain('inactive');
  });
  it('can skip successfully', async () => {
    const { body } = await global.superapp
      .get('/structures?skip=1')
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.structureStatus);
    expect(docs).toContain('inactive');
    expect(docs).toContain('forthcoming');
    expect(body.totalCount).toBe(3);
  });
  it('can limit successfully', async () => {
    const { body } = await global.superapp
      .get('/structures?limit=1')
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.structureStatus);
    expect(docs).toContain('active');
    expect(body.totalCount).toBe(3);
  });
  it('can sort successfully', async () => {
    const { body } = await global.superapp
      .get('/structures?sort=structureStatus')
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.structureStatus);
    expect(docs[0]).toBe('active');
    expect(body.totalCount).toBe(3);
  });
  it('can reversely sort successfully', async () => {
    const { body } = await global.superapp
      .get('/structures?sort=-structureStatus')
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.structureStatus);
    expect(docs[0]).toBe('inactive');
    expect(body.totalCount).toBe(3);
  });
  it('can filter successfully', async () => {
    const { body } = await global.superapp
      .get('/structures?filters[structureStatus]=active')
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.structureStatus);
    expect(docs).toContain('active');
    expect(body.totalCount).toBe(1);
  });
});

describe('API > structures > structures > upsert', () => {
  it('can upsert with id successfully', async () => {
    const { body } = await global.superapp
      .put('/structures/iw59y')
      .set('Authorization', authorization)
      .send({
        structureStatus: 'active',
      }).expect(201);
    expect(body.id).toBeTruthy();
    expect(body.createdBy.username).toBe('user');
    const catalogue = await global.db.collection('_catalogue').findOne({ _id: body.id });
    expect(catalogue._id).toBe(body.id);
  });
});
