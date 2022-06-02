let authorization;
let cid;
let id;
let resourceId;

const categoryLink = {
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
  const category = await global.superapp
    .post('/categories')
    .set('Authorization', authorization)
    .send({ usualNameFr: 'Catégorie' })
    .expect(201);

  resourceId = structure.body.id;
  cid = category.body.id;
});

describe('API > structures > categories > create', () => {
  it('can create successfully', async () => {
    const { body } = await global.superapp
      .post(`/structures/${resourceId}/categories`)
      .set('Authorization', authorization)
      .send({ categoryId: cid, ...categoryLink })
      .expect(201);
    expect(body.id).toBeTruthy();
    id = body.id;
  });

  it('should accept approximate date with only year and month', async () => {
    const { body } = await global.superapp
      .post(`/structures/${resourceId}/categories`)
      .set('Authorization', authorization)
      .send({ ...categoryLink, startDate: '2000-02' })
      .expect(201);
    expect(body.id).toBeTruthy();
    id = body.id;
  });

  it('should accept approximate date with only year', async () => {
    const { body } = await global.superapp
      .post(`/structures/${resourceId}/categories`)
      .set('Authorization', authorization)
      .send({ ...categoryLink, startDate: '2000' })
      .expect(201);
    expect(body.id).toBeTruthy();
    id = body.id;
  });

  it('should throw a BadRequest error if date is malformed', async () => {
    const response = await global.superapp
      .post(`/structures/${resourceId}/categories`)
      .set('Authorization', authorization)
      .send({ ...categoryLink, startDate: '20' });
    expect(response.status).toBe(400);
    expect(response.text).toContain('Validation failed');
  });
});

describe('API > structures > categories > update', () => {
  beforeAll(async () => {
    const { body } = await global.superapp
      .post(`/structures/${resourceId}/categories`)
      .set('Authorization', authorization)
      .send({ categoryId: cid, ...categoryLink });
    id = body.id;
  });

  it('can update successfully', async () => {
    const { body } = await global.superapp
      .patch(`/structures/${resourceId}/categories/${id}`)
      .set('Authorization', authorization)
      .send({ startDate: '2017-01-01' })
      .expect(200);
    expect(body.startDate).toBe('2017-01-01');
  });
  it('throws bad request with malformed id', async () => {
    await global.superapp
      .patch(`/structures/${resourceId}/categories/45frK`)
      .set('Authorization', authorization)
      .send({ startDate: '2017-01-01' })
      .expect(400);
  });
  it('throws not found with wrong id', async () => {
    await global.superapp
      .patch(`/structures/${resourceId}/categories/45skrc65`)
      .set('Authorization', authorization)
      .send({ startDate: '2017-01-01' })
      .expect(404);
  });
  it('throws with wrong data', async () => {
    await global.superapp
      .patch(`/structures/${resourceId}/categories/${id}`)
      .set('Authorization', authorization)
      .send({ startDate: 'string' })
      .expect(400);
  });
  it('can empty dates', async () => {
    const { body } = await global.superapp
      .patch(`/structures/${resourceId}/categories/${id}`)
      .set('Authorization', authorization)
      .send({ startDate: '' })
      .expect(200);
    expect(body.startDate).toBe(null);
  });
});

describe('API > structures > categories > read', () => {
  beforeAll(async () => {
    const { body } = await global.superapp
      .post(`/structures/${resourceId}/categories`)
      .set('Authorization', authorization)
      .send({ categoryId: cid, ...categoryLink });
    id = body.id;
  });

  it('can read successfully', async () => {
    const { body } = await global.superapp
      .get(`/structures/${resourceId}/categories/${id}`)
      .set('Authorization', authorization)
      .expect(200);
    expect(body.id).toBe(id);
    expect(body.category.id).toBe(cid);
    expect(body.category.usualNameFr).toBe('Catégorie');
    expect(body.createdBy.username).toBe('user');
  });
  it('throws bad request with wrong id', async () => {
    await global.superapp
      .get(`/structures/${resourceId}/categories/265vty`)
      .set('Authorization', authorization)
      .expect(400);
  });
  it('throws not found with unknown id', async () => {
    await global.superapp
      .get(`/structures/${resourceId}/categories/265fkrld`)
      .set('Authorization', authorization)
      .expect(404);
  });
});

describe('API > structures > names > delete', () => {
  it('throws bad request with wrong id', async () => {
    await global.superapp
      .delete(`/structures/${resourceId}/categories/vgy775`)
      .set('Authorization', authorization)
      .expect(400);
  });
  it('throws not found with unknown id', async () => {
    await global.superapp
      .delete(`/structures/${resourceId}/categories/775flrks`)
      .set('Authorization', authorization)
      .expect(404);
  });
  it('can delete successfully', async () => {
    await global.superapp
      .delete(`/structures/${resourceId}/categories/${id}`)
      .set('Authorization', authorization)
      .expect(204);
  });
});
