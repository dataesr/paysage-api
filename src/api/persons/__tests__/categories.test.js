let authorization;
let cid;
let id;
let rid;

const categoryLink = {
  startDate: '2000-02-12',
  endDate: '2020-02-12',
};

beforeAll(async () => {
  authorization = await global.utils.createUser('user');
  const structure = await global.superapp
    .post('/persons')
    .set('Authorization', authorization)
    .send({
      lastName: 'Dupond',
      firstName: 'Jean',
      gender: 'Femme',
    })
    .expect(201);
  const category = await global.superapp
    .post('/categories')
    .set('Authorization', authorization)
    .send({ usualNameFr: 'Catégorie' })
    .expect(201);

  rid = structure.body.id;
  cid = category.body.id;
});

describe('API > persons > categories > create', () => {
  it('can create successfully', async () => {
    const response = await global.superapp
      .post(`/persons/${rid}/categories`)
      .set('Authorization', authorization)
      .send({ categoryId: cid, ...categoryLink })
      .expect(201);
    expect(response.body.id).toBeTruthy();
    id = response.body.id;
  });
});

describe('API > persons > categories > update', () => {
  it('can update successfully', async () => {
    const response = await global.superapp
      .patch(`/persons/${rid}/categories/${id}`)
      .set('Authorization', authorization)
      .send({ startDate: '2017-01-01' })
      .expect(200);
    expect(response.body.startDate).toBe('2017-01-01');
  });
  it('throws bad request with malformed id', async () => {
    await global.superapp
      .patch(`/persons/${rid}/categories/45frK`)
      .set('Authorization', authorization)
      .send({ startDate: '2017-01-01' })
      .expect(400);
  });
  it('throws not found with wrong id', async () => {
    await global.superapp
      .patch(`/persons/${rid}/categories/45dlrt5dkkhhuu7`)
      .set('Authorization', authorization)
      .send({ startDate: '2017-01-01' })
      .expect(404);
  });
  it('throws with wrong data', async () => {
    await global.superapp
      .patch(`/persons/${rid}/categories/${id}`)
      .set('Authorization', authorization)
      .send({ startDate: 'string' })
      .expect(400);
  });
  it('can empty dates', async () => {
    const { body } = await global.superapp
      .patch(`/persons/${rid}/categories/${id}`)
      .set('Authorization', authorization)
      .send({ startDate: '' })
      .expect(200);
    expect(body.startDate).toBe(null);
  });
});

describe('API > persons > categories > read', () => {
  beforeAll(async () => {
    const response = await global.superapp
      .post(`/persons/${rid}/categories`)
      .set('Authorization', authorization)
      .send({ categoryId: cid, ...categoryLink });
    id = response.body.id;
  });

  it('can read successfully', async () => {
    const response = await global.superapp
      .get(`/persons/${rid}/categories/${id}`)
      .set('Authorization', authorization)
      .expect(200);
    expect(response.body.id).toBe(id);
    expect(response.body.category.id).toBe(cid);
    expect(response.body.category.usualNameFr).toBe('Catégorie');
    expect(response.body.createdBy.username).toBe('user');
  });
  it('throws bad request with wrong id', async () => {
    await global.superapp
      .get(`/persons/${rid}/categories/265vty`)
      .set('Authorization', authorization)
      .expect(400);
  });
  it('throws not found with unknown id', async () => {
    await global.superapp
      .get(`/persons/${rid}/categories/45dlrt5dkkhhuu7`)
      .set('Authorization', authorization)
      .expect(404);
  });
});

describe('API > persons > names > delete', () => {
  it('throws bad request with wrong id', async () => {
    await global.superapp
      .delete(`/persons/${rid}/categories/vgy775`)
      .set('Authorization', authorization)
      .expect(400);
  });
  it('throws not found with unknown id', async () => {
    await global.superapp
      .delete(`/persons/${rid}/categories/45dlrt5dkkhhuu7`)
      .set('Authorization', authorization)
      .expect(404);
  });
  it('can delete successfully', async () => {
    await global.superapp
      .delete(`/persons/${rid}/categories/${id}`)
      .set('Authorization', authorization)
      .expect(204);
  });
});
