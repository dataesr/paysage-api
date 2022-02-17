let authorization;
let id;
const payload = {
  lastName: 'Dupond',
  firstName: 'Jean',
  gender: 'Femme',
};
const updatePayLoad = { lastName: 'Dupont', firstName: null };

beforeAll(async () => {
  authorization = await global.utils.createUser('user');
});

describe('API > persons > create', () => {
  it('can create successfully', async () => {
    const { body } = await global.superapp
      .post('/persons')
      .set('Authorization', authorization)
      .send(payload)
      .expect(201);
    Object.entries(payload).map((entry) => expect(body[entry[0]]).toBe(entry[1]));
    expect(body.id).toBeTruthy();
    expect(body.createdBy.username).toBe('user');
    id = body.id;
  });
  it('ignore additionalProperties', async () => {
    await global.superapp
      .post('/persons')
      .set('Authorization', authorization)
      .send({ ...payload, arbitrary: 'test' })
      .expect(201);
    const dbData = await global.db.collection('persons').findOne({ id });
    expect(dbData.arbitrary).toBe(undefined);
  });
});

describe('API > persons > update', () => {
  it('throws not found with wrong id', async () => {
    await global.superapp
      .patch('/persons/45frK')
      .set('Authorization', authorization)
      .send(updatePayLoad)
      .expect(404);
  });
  it('can update successfully', async () => {
    const { body } = await global.superapp
      .patch(`/persons/${id}`)
      .set('Authorization', authorization)
      .send(updatePayLoad)
      .expect(200);
    const updated = { ...payload, ...updatePayLoad };
    Object.entries(updated).map((entry) => expect(body[entry[0]]).toBe(entry[1]));
    expect(body.id).toBeTruthy();
    expect(body.createdBy.username).toBe('user');
  });
  it('ignore additionalProperties', async () => {
    await global.superapp
      .patch(`/persons/${id}`)
      .set('Authorization', authorization)
      .send({ arbitrary: 'test' })
      .expect(400);
  });
  it('throws with no data', async () => {
    await global.superapp
      .patch(`/persons/${id}`)
      .set('Authorization', authorization)
      .send({})
      .expect(400);
  });
});

describe('API > persons > read', () => {
  it('can read successfully', async () => {
    const { body } = await global.superapp
      .get(`/persons/${id}`)
      .set('Authorization', authorization)
      .expect(200);
    const expected = { ...payload, ...updatePayLoad };
    Object.entries(expected).map((entry) => expect(body[entry[0]]).toBe(entry[1]));
    expect(body.id).toBe(id);
    expect(body.createdBy.username).toBe('user');
  });
  it('throws not found with unknown id', async () => {
    await global.superapp
      .get('/persons/45frK')
      .set('Authorization', authorization)
      .expect(404);
  });
});

describe('API > persons > delete', () => {
  it('throws not found with wrong id', async () => {
    await global.superapp
      .delete('/persons/45frK')
      .set('Authorization', authorization)
      .expect(404);
  });
  it('can delete successfully', async () => {
    await global.superapp
      .delete(`/persons/${id}`)
      .set('Authorization', authorization)
      .expect(204);
  });
});

describe('API > persons > list', () => {
  beforeAll(async () => {
    await global.utils.db.collection('persons').deleteMany({});
    await global.superapp
      .post('/persons')
      .set('Authorization', authorization)
      .send(payload)
      .expect(201);
    await global.superapp
      .post('/persons')
      .set('Authorization', authorization)
      .send({ ...payload, lastName: 'Dupont' })
      .expect(201);
    await global.superapp
      .post('/persons')
      .set('Authorization', authorization)
      .send({ ...payload, lastName: 'Dupon' })
      .expect(201);
  });
  it('can list successfully', async () => {
    const { body } = await global.superapp
      .get('/persons')
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.lastName);
    expect(docs).toContain('Dupond');
    expect(docs).toContain('Dupont');
    expect(docs).toContain('Dupon');
  });
  it('can skip successfully', async () => {
    const { body } = await global.superapp
      .get('/persons?skip=1')
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.lastName);
    expect(docs).toContain('Dupont');
    expect(docs).toContain('Dupon');
    expect(body.totalCount).toBe(3);
  });
  it('can limit successfully', async () => {
    const { body } = await global.superapp
      .get('/persons?limit=1')
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.lastName);
    expect(docs).toContain('Dupond');
    expect(body.totalCount).toBe(3);
  });
  it('can sort successfully', async () => {
    const { body } = await global.superapp
      .get('/persons?sort=lastName')
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.lastName);
    expect(docs[0]).toBe('Dupon');
    expect(body.totalCount).toBe(3);
  });
  it('can reversely sort successfully', async () => {
    const { body } = await global.superapp
      .get('/persons?sort=-lastName')
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.lastName);
    expect(docs[0]).toBe('Dupont');
    expect(body.totalCount).toBe(3);
  });
  it('can filter successfully', async () => {
    const { body } = await global.superapp
      .get('/persons?filters[lastName]=Dupont')
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.lastName);
    expect(docs).toContain('Dupont');
    expect(body.totalCount).toBe(1);
  });
});
