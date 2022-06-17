let authorization;
let lcid;
let id;
let resourceId;

const legalcategoryLink = {
  startDate: '2000-02-12',
  endDate: '2020-02-12',
};

beforeAll(async () => {
  authorization = await global.utils.createUser('user');

  const structure = await global.superapp
    .post('/structures')
    .set('Authorization', authorization)
    .send({
      structureStatus: 'active',
      creationDate: '2021-02',
      usualName: 'Université',
    })
    .expect(201);

  const legalcategory = await global.superapp
    .post('/legal-categories')
    .set('Authorization', authorization)
    .send({ longNameFr: 'This is a legal category' })
    .expect(201);

  resourceId = structure.body.id;
  lcid = legalcategory.body.id;
});

describe('API > structures > legal categories > create', () => {
  it('can create successfully', async () => {
    const { body } = await global.superapp
      .post(`/structures/${resourceId}/legal-categories`)
      .set('Authorization', authorization)
      .send({ legalcategoryId: lcid, ...legalcategoryLink })
      .expect(201);
    expect(body.id).toBeTruthy();
    id = body.id;
  });

  it('should accept approximate date with only year and month', async () => {
    const { body } = await global.superapp
      .post(`/structures/${resourceId}/legal-categories`)
      .set('Authorization', authorization)
      .send({ ...legalcategoryLink, startDate: '2000-02' })
      .expect(201);
    expect(body.id).toBeTruthy();
    id = body.id;
  });

  it('should accept approximate date with only year', async () => {
    const { body } = await global.superapp
      .post(`/structures/${resourceId}/legal-categories`)
      .set('Authorization', authorization)
      .send({ ...legalcategoryLink, startDate: '2000' })
      .expect(201);
    expect(body.id).toBeTruthy();
    id = body.id;
  });

  it('should throw a BadRequest error if date is malformed', async () => {
    const response = await global.superapp
      .post(`/structures/${resourceId}/legal-categories`)
      .set('Authorization', authorization)
      .send({ ...legalcategoryLink, startDate: '20' });
    expect(response.status).toBe(400);
    expect(response.text).toContain('Validation failed');
  });
});

describe('API > structures > legal categories > update', () => {
  beforeAll(async () => {
    const { body } = await global.superapp
      .post(`/structures/${resourceId}/legal-categories`)
      .set('Authorization', authorization)
      .send({ legalcategoryId: lcid, ...legalcategoryLink });
    id = body.id;
  });

  it('can update successfully', async () => {
    const { body } = await global.superapp
      .patch(`/structures/${resourceId}/legal-categories/${id}`)
      .set('Authorization', authorization)
      .send({ startDate: '2017-01-01' })
      .expect(200);
    expect(body.startDate).toBe('2017-01-01');
  });
  it('throws bad request with malformed id', async () => {
    await global.superapp
      .patch(`/structures/${resourceId}/legal-categories/45frK`)
      .set('Authorization', authorization)
      .send({ startDate: '2017-01-01' })
      .expect(400);
  });
  it('throws not found with wrong id', async () => {
    await global.superapp
      .patch(`/structures/${resourceId}/legal-categories/45skrc65`)
      .set('Authorization', authorization)
      .send({ startDate: '2017-01-01' })
      .expect(404);
  });
  it('throws with wrong data', async () => {
    await global.superapp
      .patch(`/structures/${resourceId}/legal-categories/${id}`)
      .set('Authorization', authorization)
      .send({ startDate: 'string' })
      .expect(400);
  });
  it('can empty dates', async () => {
    const { body } = await global.superapp
      .patch(`/structures/${resourceId}/legal-categories/${id}`)
      .set('Authorization', authorization)
      .send({ startDate: '' })
      .expect(200);
    expect(body.startDate).toBe(null);
  });
});

describe('API > structures > legal categories > read', () => {
  beforeAll(async () => {
    const { body } = await global.superapp
      .post(`/structures/${resourceId}/legal-categories`)
      .set('Authorization', authorization)
      .send({ legalcategoryId: lcid, ...legalcategoryLink });
    id = body.id;
  });

  it('can read successfully', async () => {
    const { body } = await global.superapp
      .get(`/structures/${resourceId}/legal-categories/${id}`)
      .set('Authorization', authorization)
      .expect(200);
    expect(body.id).toBe(id);
    expect(body.legalcategory.id).toBe(lcid);
    expect(body.legalcategory.longNameFr).toBe('This is a legal category');
    expect(body.createdBy.username).toBe('user');
  });
  it('throws bad request with wrong id', async () => {
    await global.superapp
      .get(`/structures/${resourceId}/legal-categories/265vty`)
      .set('Authorization', authorization)
      .expect(400);
  });
  it('throws not found with unknown id', async () => {
    await global.superapp
      .get(`/structures/${resourceId}/legal-categories/265fkrld`)
      .set('Authorization', authorization)
      .expect(404);
  });
});

describe('API > structures > legal categories > delete', () => {
  it('throws bad request with wrong id', async () => {
    await global.superapp
      .delete(`/structures/${resourceId}/legal-categories/vgy775`)
      .set('Authorization', authorization)
      .expect(400);
  });
  it('throws not found with unknown id', async () => {
    await global.superapp
      .delete(`/structures/${resourceId}/legal-categories/775flrks`)
      .set('Authorization', authorization)
      .expect(404);
  });
  it('can delete successfully', async () => {
    await global.superapp
      .delete(`/structures/${resourceId}/legal-categories/${id}`)
      .set('Authorization', authorization)
      .expect(204);
  });
});
