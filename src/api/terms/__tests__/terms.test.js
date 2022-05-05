let authorization;
let id;

const payload = {
  usualNameFr: 'Term A',
  acronymFr: 'Term A',
};
const updatePayLoad = {
  usualNameFr: 'Term C',
  acronymFr: 'T C',
};

beforeAll(async () => {
  authorization = await global.utils.createUser('user');
});

describe('API > terms > create', () => {
  it('can create successfully', async () => {
    const { body } = await global.superapp
      .post('/terms')
      .set('Authorization', authorization)
      .send(payload)
      .expect(201);
    Object.entries(payload).map((entry) => expect(body[entry[0]]).toBe(entry[1]));
    expect(body.id).toBeTruthy();
    expect(body.createdBy.username).toBe('user');
    id = body.id;
  });

  it('ignore additionalProperties', async () => {
    const { body } = await global.superapp
      .post('/terms')
      .set('Authorization', authorization)
      .send({ ...payload, arbitrary: 'test' })
      .expect(201);
    expect(body.arbitrary).toBeFalsy();
    const data = await global.db.collection('terms').findOne({ id: body.id });
    expect(data.arbitrary).toBe(undefined);
  });

  it('should fail if usualNameFr is missing', async () => {
    const { usualNameFr, ...rest } = payload;
    await global.superapp
      .post('/terms')
      .set('Authorization', authorization)
      .send(rest)
      .expect(400);
  });
});

describe('API > terms > update', () => {
  it('throws not found with wrong id', async () => {
    await global.superapp
      .patch('/terms/45frK')
      .set('Authorization', authorization)
      .send(updatePayLoad)
      .expect(404);
  });
  it('can update successfully', async () => {
    const { body } = await global.superapp
      .patch(`/terms/${id}`)
      .set('Authorization', authorization)
      .send(updatePayLoad);
    const updated = { ...payload, ...updatePayLoad };
    Object.entries(updated).map((entry) => expect(body[entry[0]]).toBe(entry[1]));
    expect(body.id).toBeTruthy();
    expect(body.createdBy.username).toBe('user');
  });
  it('ignore additionalProperties', async () => {
    await global.superapp
      .patch(`/terms/${id}`)
      .set('Authorization', authorization)
      .send({ arbitrary: 'test' })
      .expect(400);
  });
  it('throws with no data', async () => {
    await global.superapp
      .patch(`/terms/${id}`)
      .set('Authorization', authorization)
      .send({})
      .expect(400);
  });
});

describe('API > terms > read', () => {
  it('can read successfully', async () => {
    const { body } = await global.superapp
      .get(`/terms/${id}`)
      .set('Authorization', authorization)
      .expect(200);
    const expected = { ...payload, ...updatePayLoad };
    Object.entries(expected).map((entry) => expect(body[entry[0]]).toBe(entry[1]));
    expect(body.id).toBe(id);
    expect(body.createdBy.username).toBe('user');
  });
  it('throws not found with unknown id', async () => {
    await global.superapp
      .get('/terms/45frK')
      .set('Authorization', authorization)
      .expect(404);
  });
});

describe('API > terms > delete', () => {
  it('throws not found with wrong id', async () => {
    await global.superapp
      .delete('/terms/45frK')
      .set('Authorization', authorization)
      .expect(404);
  });
  it('can delete successfully', async () => {
    await global.superapp
      .delete(`/terms/${id}`)
      .set('Authorization', authorization)
      .expect(204);
  });
});

describe('API > terms > list', () => {
  beforeAll(async () => {
    await global.utils.db.collection('terms').deleteMany({});
    await global.superapp
      .post('/terms')
      .set('Authorization', authorization)
      .send(payload)
      .expect(201);
    await global.superapp
      .post('/terms')
      .set('Authorization', authorization)
      .send({ ...payload, usualNameFr: 'Term B' })
      .expect(201);
    await global.superapp
      .post('/terms')
      .set('Authorization', authorization)
      .send({ ...payload, usualNameFr: 'Term C' })
      .expect(201);
  });
  it('can list successfully', async () => {
    const { body } = await global.superapp
      .get('/terms')
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.usualNameFr);
    expect(docs).toContain('Term A');
    expect(docs).toContain('Term B');
    expect(docs).toContain('Term C');
  });
  it('can skip successfully', async () => {
    const { body } = await global.superapp
      .get('/terms?skip=1')
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.usualNameFr);
    expect(docs).toContain('Term B');
    expect(docs).toContain('Term C');
    expect(body.totalCount).toBe(3);
  });
  it('can limit successfully', async () => {
    const { body } = await global.superapp
      .get('/terms?limit=1')
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.usualNameFr);
    expect(docs).toContain('Term A');
    expect(body.totalCount).toBe(3);
  });
  it('can sort successfully', async () => {
    const { body } = await global.superapp
      .get('/terms?sort=usualNameFr')
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.usualNameFr);
    expect(docs[0]).toBe('Term A');
    expect(body.totalCount).toBe(3);
  });
  it('can reversely sort successfully', async () => {
    const { body } = await global.superapp
      .get('/terms?sort=-usualNameFr')
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.usualNameFr);
    expect(docs[0]).toBe('Term C');
    expect(body.totalCount).toBe(3);
  });
  it('can filter successfully', async () => {
    const { body } = await global.superapp
      .get('/terms?filters[usualNameFr]=Term A')
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.usualNameFr);
    expect(docs).toContain('Term A');
    expect(body.totalCount).toBe(1);
  });
});
