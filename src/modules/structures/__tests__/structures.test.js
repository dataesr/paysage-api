let authorization;
let id;
beforeAll(async () => {
  authorization = await global.utils.createUser('user');
});

describe('API > structures > structures > create', () => {
  it('can create successfully', async () => {
    const response = await global.superapp
      .post('/structures')
      .set('Authorization', authorization)
      .send({
        structureStatus: 'active',
      }).expect(201);
    expect(response.body.id).toBeTruthy();
    expect(response.body.createdBy.username).toBe('user');
    id = response.body.id;
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
  it('throws with wrong data', async () => {
    await global.superapp
      .patch(`/structures/${id}`)
      .set('Authorization', authorization)
      .send({ status: 'test' })
      .expect(400);
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
