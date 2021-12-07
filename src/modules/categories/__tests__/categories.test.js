let authorization;
let id;
const category = {
  longNameEn: 'string',
  longNameFr: 'string',
  shortNameEn: 'string',
  shortNameFr: 'string',
  acronymFr: 'string',
  pluralNamelFr: 'string',
  femNameFr: 'string',
  otherNamesFr: [
    'string',
  ],
  otherNamesEn: [
    'string',
  ],
  descriptionFr: 'string',
  descriptionEn: 'string',
  // officialDocumentId: 'string',
  usualNameFr: 'string',
  usualNameEn: 'string',
};
beforeAll(async () => {
  authorization = await global.utils.createUser('user');
});

describe('API > categories > categories > create', () => {
  it('can create successfully', async () => {
    const response = await global.superapp
      .post('/categories')
      .set('Authorization', authorization)
      .send(category)
      .expect(201);
    expect(response.body.id).toBeTruthy();
    expect(response.body.usualNameFr).toBe('string');
    expect(response.body.createdBy.username).toBe('user');
    id = response.body.id;
  });
});

describe('API > categories > categories > update', () => {
  it('throws not found with wrong id', async () => {
    await global.superapp
      .patch('/categories/45frK')
      .set('Authorization', authorization)
      .send({ usualNameFr: 'test' })
      .expect(404);
  });
  it('can update successfully', async () => {
    const { body } = await global.superapp
      .patch(`/categories/${id}`)
      .set('Authorization', authorization)
      .send({ usualNameFr: 'test' })
      .expect(200);
    expect(body.usualNameFr).toBe('test');
  });
  it('throws with wrong data', async () => {
    await global.superapp
      .patch(`/categories/${id}`)
      .set('Authorization', authorization)
      .send({ usualName: 'test' })
      .expect(400);
  });
});

describe('API > categories > categories > read', () => {
  it('can read successfully', async () => {
    const response = await global.superapp
      .get(`/categories/${id}`)
      .set('Authorization', authorization)
      .expect(200);
    expect(response.body.usualNameFr).toBe('test');
    expect(response.body.usualNameEn).toBe('string');
    expect(response.body.id).toBe(id);
    expect(response.body.createdBy.username).toBe('user');
  });
  it('throws not found with unknown id', async () => {
    await global.superapp
      .get('/categories/45frK')
      .set('Authorization', authorization)
      .expect(404);
  });
});

describe('API > categories > categories > delete', () => {
  it('throws not found with wrong id', async () => {
    await global.superapp
      .delete('/categories/45frK')
      .set('Authorization', authorization)
      .expect(404);
  });
  it('can delete successfully', async () => {
    await global.superapp
      .delete(`/categories/${id}`)
      .set('Authorization', authorization)
      .expect(204);
  });
});

describe('API > categories > categories > list', () => {
  beforeAll(async () => {
    await global.superapp
      .post('/categories')
      .set('Authorization', authorization)
      .send(category)
      .expect(201);
    await global.superapp
      .post('/categories')
      .set('Authorization', authorization)
      .send({ ...category, usualNameFr: 'string2' })
      .expect(201);
    await global.superapp
      .post('/categories')
      .set('Authorization', authorization)
      .send({ ...category, usualNameFr: 'string3' })
      .expect(201);
  });
  it('can list successfully', async () => {
    const { body } = await global.superapp
      .get('/categories')
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.usualNameFr);
    expect(docs).toContain('string');
    expect(docs).toContain('string2');
    expect(docs).toContain('string3');
  });
  it('can skip successfully', async () => {
    const { body } = await global.superapp
      .get('/categories?skip=1')
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.usualNameFr);
    expect(docs).toContain('string2');
    expect(docs).toContain('string3');
    expect(body.totalCount).toBe(3);
  });
  it('can limit successfully', async () => {
    const { body } = await global.superapp
      .get('/categories?limit=1')
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.usualNameFr);
    expect(docs).toContain('string');
    expect(body.totalCount).toBe(3);
  });
  it('can sort successfully', async () => {
    const { body } = await global.superapp
      .get('/categories?sort=usualNameFr')
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.usualNameFr);
    expect(docs[0]).toBe('string');
    expect(body.totalCount).toBe(3);
  });
  it('can reversely sort successfully', async () => {
    const { body } = await global.superapp
      .get('/categories?sort=-usualNameFr')
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.usualNameFr);
    expect(docs[0]).toBe('string3');
    expect(body.totalCount).toBe(3);
  });
  it('can filter successfully', async () => {
    const { body } = await global.superapp
      .get('/categories?filters[usualNameFr]=string2')
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.usualNameFr);
    expect(docs).toContain('string2');
    expect(body.totalCount).toBe(1);
  });
});
