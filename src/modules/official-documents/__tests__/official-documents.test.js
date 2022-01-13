let authorization;
let id;
const officialDocument = {
  nature: 'Publication au JO',
  type: 'Loi',
  documentNumber: 'string',
  title: 'string',
  textExtract: 'string',
  comment: 'string',
};

beforeAll(async () => {
  authorization = await global.utils.createUser('user');
});

describe('API > official documents > official documents > create', () => {
  it('can create successfully', async () => {
    const response = await global.superapp
      .post('/official-documents')
      .set('Authorization', authorization)
      .send(officialDocument)
      .expect(201);
    expect(response.body.id).toBeTruthy();
    expect(response.body.nature).toBe('Publication au JO');
    expect(response.body.createdBy.username).toBe('user');
    id = response.body.id;
  });
});

describe('API > official documents > official documents > update', () => {
  it('throws not found with wrong id', async () => {
    await global.superapp
      .patch('/official-documents/45frK')
      .set('Authorization', authorization)
      .send({ type: 'Décret' })
      .expect(404);
  });
  it('can update successfully', async () => {
    const { body } = await global.superapp
      .patch(`/official-documents/${id}`)
      .set('Authorization', authorization)
      .send({ type: 'Décret' })
      .expect(200);
    expect(body.type).toBe('Décret');
  });
  it('throws with wrong data', async () => {
    await global.superapp
      .patch(`/official-documents/${id}`)
      .set('Authorization', authorization)
      .send({ nature: 'Décret' })
      .expect(400);
  });
});

describe('API > official documents > official documents > read', () => {
  it('can read successfully', async () => {
    const response = await global.superapp
      .get(`/official-documents/${id}`)
      .set('Authorization', authorization)
      .expect(200);
    expect(response.body.type).toBe('Décret');
    expect(response.body.nature).toBe('Publication au JO');
    expect(response.body.id).toBe(id);
    expect(response.body.createdBy.username).toBe('user');
  });
  it('throws not found with unknown id', async () => {
    await global.superapp
      .get('/official-documents/45frK')
      .set('Authorization', authorization)
      .expect(404);
  });
});

describe('API > official documents > official documents > delete', () => {
  it('throws not found with wrong id', async () => {
    await global.superapp
      .delete('/official-documents/45frK')
      .set('Authorization', authorization)
      .expect(404);
  });
  it('can delete successfully', async () => {
    await global.superapp
      .delete(`/official-documents/${id}`)
      .set('Authorization', authorization)
      .expect(204);
  });
});

describe('API > official documents > official documents > list', () => {
  beforeAll(async () => {
    await global.superapp
      .post('/official-documents')
      .set('Authorization', authorization)
      .send(officialDocument)
      .expect(201);
    await global.superapp
      .post('/official-documents')
      .set('Authorization', authorization)
      .send({ ...officialDocument, nature: 'Publication au BOESR' })
      .expect(201);
    await global.superapp
      .post('/official-documents')
      .set('Authorization', authorization)
      .send({ ...officialDocument, type: 'Décret' })
      .expect(201);
  });
  it('can list successfully', async () => {
    const { body } = await global.superapp
      .get('/official-documents')
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.nature);
    expect(docs).toContain('Publication au JO');
    expect(docs).toContain('Publication au BOESR');
    expect(body.totalCount).toBe(3);
  });
  it('can skip successfully', async () => {
    const { body } = await global.superapp
      .get('/official-documents?skip=1')
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.nature);
    expect(docs).toContain('Publication au JO');
    expect(docs).toContain('Publication au BOESR');
    expect(body.totalCount).toBe(3);
  });
  it('can limit successfully', async () => {
    const { body } = await global.superapp
      .get('/official-documents?limit=1')
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.nature);
    expect(docs).toContain('Publication au JO');
    expect(body.totalCount).toBe(3);
  });
  it('can sort successfully', async () => {
    const { body } = await global.superapp
      .get('/official-documents?sort=nature')
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.nature);
    expect(docs[0]).toBe('Publication au BOESR');
    expect(body.totalCount).toBe(3);
  });
  it('can reversely sort successfully', async () => {
    const { body } = await global.superapp
      .get('/official-documents?sort=-nature')
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.nature);
    expect(docs[0]).toBe('Publication au JO');
    expect(body.totalCount).toBe(3);
  });
  it('can filter successfully', async () => {
    const { body } = await global.superapp
      .get('/official-documents?filters[nature]=Publication au JO')
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.nature);
    expect(docs).toContain('Publication au JO');
    expect(body.totalCount).toBe(2);
  });
});
