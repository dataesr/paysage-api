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
        descriptionFr: 'descriptionFr',
        descriptionEn: 'descriptionEn',
        status: 'active',
      }).expect(201);
    expect(response.body.id).toBeTruthy();
    expect(response.body.descriptionFr).toBe('descriptionFr');
    expect(response.body.descriptionEn).toBe('descriptionEn');
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
        descriptionFr: 'test',
      }).expect(404);
  });
  it('can update successfully', async () => {
    const { body } = await global.superapp
      .patch(`/structures/${id}`)
      .set('Authorization', authorization)
      .send({ descriptionFr: 'test' })
      .expect(200);
    expect(body.descriptionFr).toBe('test');
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
    expect(response.body.descriptionFr).toBe('test');
    expect(response.body.descriptionEn).toBe('descriptionEn');
    expect(response.body.status).toBe('active');
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
        descriptionFr: 'descriptionFr',
        descriptionEn: 'descriptionEn',
        status: 'active',
      }).expect(201);
    await global.superapp
      .post('/structures')
      .set('Authorization', authorization)
      .send({
        descriptionFr: 'descriptionFr2',
        descriptionEn: 'descriptionEn2',
        status: 'active',
      }).expect(201);
    await global.superapp
      .post('/structures')
      .set('Authorization', authorization)
      .send({
        descriptionFr: 'descriptionFr3',
        descriptionEn: 'descriptionEn3',
        status: 'active',
      }).expect(201);
  });
  it('can list successfully', async () => {
    const { body } = await global.superapp
      .get('/structures')
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.descriptionFr);
    expect(docs).toContain('descriptionFr');
    expect(docs).toContain('descriptionFr2');
    expect(docs).toContain('descriptionFr3');
  });
  it('can skip successfully', async () => {
    const { body } = await global.superapp
      .get('/structures?skip=1')
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.descriptionFr);
    expect(docs).toContain('descriptionFr2');
    expect(docs).toContain('descriptionFr3');
    expect(body.totalCount).toBe(3);
  });
  it('can limit successfully', async () => {
    const { body } = await global.superapp
      .get('/structures?limit=1')
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.descriptionFr);
    expect(docs).toContain('descriptionFr');
    expect(body.totalCount).toBe(3);
  });
  it('can sort successfully', async () => {
    const { body } = await global.superapp
      .get('/structures?sort=descriptionFr')
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.descriptionFr);
    expect(docs[0]).toBe('descriptionFr');
    expect(body.totalCount).toBe(3);
  });
  it('can reversely sort successfully', async () => {
    const { body } = await global.superapp
      .get('/structures?sort=-descriptionFr')
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.descriptionFr);
    expect(docs[0]).toBe('descriptionFr3');
    expect(body.totalCount).toBe(3);
  });
  it('can filter successfully', async () => {
    const { body } = await global.superapp
      .get('/structures?filters[descriptionFr]=descriptionFr2&filters[descriptionEn]=descriptionEn2')
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.descriptionFr);
    expect(docs).toContain('descriptionFr2');
    expect(body.totalCount).toBe(1);
  });
});
