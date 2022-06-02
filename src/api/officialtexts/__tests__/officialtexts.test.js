let authorization;
let id;
const payload = {
  nature: 'Publication au JO',
  type: 'Loi',
  textNumber: 'textNumber',
  title: 'title',
  pageUrl: 'http://string.fr',
  signatureDate: '2020',
  endDate: '2020',
  textExtract: 'string',
};
const updatePayLoad = { nature: 'Publication au BOESR', type: 'Décret' };

beforeAll(async () => {
  authorization = await global.utils.createUser('user');
});

describe('API > official texts > create', () => {
  it('can create successfully', async () => {
    const { body } = await global.superapp
      .post('/official-texts')
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
      .post('/official-texts')
      .set('Authorization', authorization)
      .send({ ...payload, arbitrary: 'test' })
      .expect(201);
    const dbData = await global.db.collection('official-texts').findOne({ id });
    expect(dbData.arbitrary).toBe(undefined);
  });

  it('should fail if title is missing', async () => {
    const { title, ...rest } = payload;
    await global.superapp
      .post('/official-texts')
      .set('Authorization', authorization)
      .send(rest)
      .expect(400);
  });

  it('should fail if type is missing', async () => {
    const { type, ...rest } = payload;
    await global.superapp
      .post('/official-texts')
      .set('Authorization', authorization)
      .send(rest)
      .expect(400);
  });
});

describe('API > official texts > update', () => {
  it('throws not found with wrong id', async () => {
    await global.superapp
      .patch('/official-texts/45frK')
      .set('Authorization', authorization)
      .send(updatePayLoad)
      .expect(404);
  });
  it('can update successfully', async () => {
    const { body } = await global.superapp
      .patch(`/official-texts/${id}`)
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
      .patch(`/official-texts/${id}`)
      .set('Authorization', authorization)
      .send({ arbitrary: 'test' })
      .expect(400);
  });
  it('throws with no data', async () => {
    await global.superapp
      .patch(`/official-texts/${id}`)
      .set('Authorization', authorization)
      .send({})
      .expect(400);
  });
  it('throws when nullifying required', async () => {
    await global.superapp
      .patch(`/official-texts/${id}`)
      .set('Authorization', authorization)
      .send({ nature: null })
      .expect(400);
  });
});

describe('API > official texts > read', () => {
  it('can read successfully', async () => {
    const { body } = await global.superapp
      .get(`/official-texts/${id}`)
      .set('Authorization', authorization)
      .expect(200);
    const expected = { ...payload, ...updatePayLoad };
    Object.entries(expected).map((entry) => expect(body[entry[0]]).toBe(entry[1]));
    expect(body.id).toBe(id);
    expect(body.createdBy.username).toBe('user');
  });
  it('throws not found with unknown id', async () => {
    await global.superapp
      .get('/official-texts/45frK')
      .set('Authorization', authorization)
      .expect(404);
  });
});

describe('API > official texts > delete', () => {
  it('throws not found with wrong id', async () => {
    await global.superapp
      .delete('/official-texts/45frK')
      .set('Authorization', authorization)
      .expect(404);
  });
  it('can delete successfully', async () => {
    await global.superapp
      .delete(`/official-texts/${id}`)
      .set('Authorization', authorization)
      .expect(204);
  });
});

describe('API > official texts > list', () => {
  beforeAll(async () => {
    await global.utils.db.collection('official-texts').deleteMany({});
    await global.superapp
      .post('/official-texts')
      .set('Authorization', authorization)
      .send({ ...payload, title: 'od1' })
      .expect(201);
    await global.superapp
      .post('/official-texts')
      .set('Authorization', authorization)
      .send({ ...payload, title: 'od2' })
      .expect(201);
    await global.superapp
      .post('/official-texts')
      .set('Authorization', authorization)
      .send({ ...payload, title: 'od3' })
      .expect(201);
  });
  it('can list successfully', async () => {
    const { body } = await global.superapp
      .get('/official-texts')
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.title);
    expect(docs).toContain('od1');
    expect(docs).toContain('od2');
    expect(docs).toContain('od3');
  });
  it('can skip successfully', async () => {
    const { body } = await global.superapp
      .get('/official-texts?skip=1')
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.title);
    expect(docs).toContain('od2');
    expect(docs).toContain('od3');
    expect(body.totalCount).toBe(3);
  });
  it('can limit successfully', async () => {
    const { body } = await global.superapp
      .get('/official-texts?limit=1')
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.title);
    expect(docs).toContain('od1');
    expect(body.totalCount).toBe(3);
  });
  it('can sort successfully', async () => {
    const { body } = await global.superapp
      .get('/official-texts?sort=title')
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.title);
    expect(docs[0]).toBe('od1');
    expect(body.totalCount).toBe(3);
  });
  it('can reversely sort successfully', async () => {
    const { body } = await global.superapp
      .get('/official-texts?sort=-title')
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.title);
    expect(docs[0]).toBe('od3');
    expect(body.totalCount).toBe(3);
  });
  it('can filter successfully', async () => {
    const { body } = await global.superapp
      .get('/official-texts?filters[title]=od1')
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.title);
    expect(docs).toContain('od1');
    expect(body.totalCount).toBe(1);
  });
});
