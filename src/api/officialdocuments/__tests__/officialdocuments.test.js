let authorization;
let id;
const payload = {
  nature: 'Publication au JO',
  type: 'Loi',
  documentNumber: 'documentNumber',
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

describe('API > official documents > create', () => {
  it('can create successfully', async () => {
    const { body } = await global.superapp
      .post('/officialdocuments')
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
      .post('/officialdocuments')
      .set('Authorization', authorization)
      .send({ ...payload, arbitrary: 'test' })
      .expect(201);
    const dbData = await global.db.collection('official-documents').findOne({ id });
    expect(dbData.arbitrary).toBe(undefined);
  });
  it('should fail if missing properties', async () => {
    let partialPayload = payload;
    delete payload.title;
    const { body } = await global.superapp
      .post('/officialdocuments')
      .set('Authorization', authorization)
      .send(partialPayload)
      .expect(400);
  });
});

describe('API > official documents > update', () => {
  it('throws not found with wrong id', async () => {
    await global.superapp
      .patch('/officialdocuments/45frK')
      .set('Authorization', authorization)
      .send(updatePayLoad)
      .expect(404);
  });
  it('can update successfully', async () => {
    const { body } = await global.superapp
      .patch(`/officialdocuments/${id}`)
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
      .patch(`/officialdocuments/${id}`)
      .set('Authorization', authorization)
      .send({ arbitrary: 'test' })
      .expect(400);
  });
  it('throws with no data', async () => {
    await global.superapp
      .patch(`/officialdocuments/${id}`)
      .set('Authorization', authorization)
      .send({})
      .expect(400);
  });
  it('throws when nullifying required', async () => {
    await global.superapp
      .patch(`/officialdocuments/${id}`)
      .set('Authorization', authorization)
      .send({ nature: null })
      .expect(400);
  });
});

describe('API > official documents > read', () => {
  it('can read successfully', async () => {
    const { body } = await global.superapp
      .get(`/officialdocuments/${id}`)
      .set('Authorization', authorization)
      .expect(200);
    const expected = { ...payload, ...updatePayLoad };
    Object.entries(expected).map((entry) => expect(body[entry[0]]).toBe(entry[1]));
    expect(body.id).toBe(id);
    expect(body.createdBy.username).toBe('user');
  });
  it('throws not found with unknown id', async () => {
    await global.superapp
      .get('/officialdocuments/45frK')
      .set('Authorization', authorization)
      .expect(404);
  });
});

describe('API > official documents > delete', () => {
  it('throws not found with wrong id', async () => {
    await global.superapp
      .delete('/officialdocuments/45frK')
      .set('Authorization', authorization)
      .expect(404);
  });
  it('can delete successfully', async () => {
    await global.superapp
      .delete(`/officialdocuments/${id}`)
      .set('Authorization', authorization)
      .expect(204);
  });
});

describe('API > official documents > list', () => {
  beforeAll(async () => {
    await global.utils.db.collection('official-documents').deleteMany({});
    await global.superapp
      .post('/officialdocuments')
      .set('Authorization', authorization)
      .send({ ...payload, title: 'od1' })
      .expect(201);
    await global.superapp
      .post('/officialdocuments')
      .set('Authorization', authorization)
      .send({ ...payload, title: 'od2' })
      .expect(201);
    await global.superapp
      .post('/officialdocuments')
      .set('Authorization', authorization)
      .send({ ...payload, title: 'od3' })
      .expect(201);
  });
  it('can list successfully', async () => {
    const { body } = await global.superapp
      .get('/officialdocuments')
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.title);
    expect(docs).toContain('od1');
    expect(docs).toContain('od2');
    expect(docs).toContain('od3');
  });
  it('can skip successfully', async () => {
    const { body } = await global.superapp
      .get('/officialdocuments?skip=1')
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.title);
    expect(docs).toContain('od2');
    expect(docs).toContain('od3');
    expect(body.totalCount).toBe(3);
  });
  it('can limit successfully', async () => {
    const { body } = await global.superapp
      .get('/officialdocuments?limit=1')
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.title);
    expect(docs).toContain('od1');
    expect(body.totalCount).toBe(3);
  });
  it('can sort successfully', async () => {
    const { body } = await global.superapp
      .get('/officialdocuments?sort=title')
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.title);
    expect(docs[0]).toBe('od1');
    expect(body.totalCount).toBe(3);
  });
  it('can reversely sort successfully', async () => {
    const { body } = await global.superapp
      .get('/officialdocuments?sort=-title')
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.title);
    expect(docs[0]).toBe('od3');
    expect(body.totalCount).toBe(3);
  });
  it('can filter successfully', async () => {
    const { body } = await global.superapp
      .get('/officialdocuments?filters[title]=od1')
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.title);
    expect(docs).toContain('od1');
    expect(body.totalCount).toBe(1);
  });
});
