let authorization;
let rid;
let id;
beforeAll(async () => {
  authorization = await global.utils.createUser('user');
  const response = await global.superapp
    .post('/structures')
    .set('Authorization', authorization)
    .send({
      descriptionFr: 'descriptionFr',
      descriptionEn: 'descriptionEn',
      status: 'active',
    }).expect(201);
  rid = response.body.id;
});

describe('API > structures > identifiers > create', () => {
  it('can create successfully', async () => {
    const response = await global.superapp
      .post(`/structures/${rid}/identifiers`)
      .set('Authorization', authorization)
      .send({
        type: 'Siret',
        value: '12345678912345',
        active: true,
        startDate: '2012-01-01',
        endDate: '2014-12-31',
      }).expect(201);
    expect(response.body.id).toBeTruthy();
    expect(response.body.type).toBe('Siret');
    expect(response.body.value).toBe('12345678912345');
    expect(response.body.active).toBe(true);
    expect(response.body.createdBy.username).toBe('user');
    id = response.body.id;
  });
  it('throws with required field missing', async () => {
    await global.superapp
      .post(`/structures/${rid}/identifiers`)
      .set('Authorization', authorization)
      .send({
        value: '12345678912345',
        active: true,
        startDate: '2012-01-01',
        endDate: '2014-12-31',
      }).expect(400);
  });
});

describe('API > structures > identifiers > update', () => {
  it('can update successfully', async () => {
    const { body } = await global.superapp
      .patch(`/structures/${rid}/identifiers/${id}`)
      .set('Authorization', authorization)
      .send({ type: 'Wikidata' })
      .expect(200);
    expect(body.type).toBe('Wikidata');
  });
  it('throws bad request with wrong id', async () => {
    await global.superapp
      .patch(`/structures/${rid}/identifiers/45frK`)
      .set('Authorization', authorization)
      .send({ type: 'Wikidata' })
      .expect(400);
  });
  it('throws not found with wrong id', async () => {
    await global.superapp
      .patch(`/structures/${rid}/identifiers/45`)
      .set('Authorization', authorization)
      .send({ type: 'Wikidata' })
      .expect(404);
  });
  it('throws with wrong data', async () => {
    await global.superapp
      .patch(`/structures/${rid}/identifiers/${id}`)
      .set('Authorization', authorization)
      .send({ startDate: 'Wikidata' })
      .expect(400);
  });
});

describe('API > structures > identifiers > read', () => {
  it('can read successfully', async () => {
    const response = await global.superapp
      .get(`/structures/${rid}/identifiers/${id}`)
      .set('Authorization', authorization)
      .expect(200);
    expect(response.body.type).toBe('Wikidata');
    expect(response.body.value).toBe('12345678912345');
    expect(response.body.active).toBe(true);
    expect(response.body.createdBy.username).toBe('user');
  });
  it('throws bad request with wrong id', async () => {
    await global.superapp
      .get(`/structures/${rid}/identifiers/265vty`)
      .set('Authorization', authorization)
      .expect(400);
  });
  it('throws not found with unknown id', async () => {
    await global.superapp
      .get(`/structures/${rid}/identifiers/265`)
      .set('Authorization', authorization)
      .expect(404);
  });
});

describe('API > structures > identifiers > delete', () => {
  it('throws bad request with wrong id', async () => {
    await global.superapp
      .delete(`/structures/${rid}/identifiers/vgy775`)
      .set('Authorization', authorization)
      .expect(400);
  });
  it('throws not found with unknown id', async () => {
    await global.superapp
      .delete(`/structures/${rid}/identifiers/775`)
      .set('Authorization', authorization)
      .expect(404);
  });
  it('can delete structure successfully', async () => {
    await global.superapp
      .delete(`/structures/${rid}/identifiers/${id}`)
      .set('Authorization', authorization)
      .expect(204);
  });
});

describe('API > structures > identifiers > list', () => {
  beforeAll(async () => {
    await global.superapp
      .post(`/structures/${rid}/identifiers/`)
      .set('Authorization', authorization)
      .send({
        type: 'Siret',
        value: 'siretID',
        active: true,
        startDate: '2012-01-01',
        endDate: '2014-12-31',
      }).expect(201);
    await global.superapp
      .post(`/structures/${rid}/identifiers/`)
      .set('Authorization', authorization)
      .send({
        type: 'Wikidata',
        value: 'wikidataID',
        active: true,
        startDate: '2012-01-01',
        endDate: '2014-12-31',
      }).expect(201);
    await global.superapp
      .post(`/structures/${rid}/identifiers/`)
      .set('Authorization', authorization)
      .send({
        type: 'idRef',
        value: 'idrefID',
        active: true,
        startDate: '2012-01-01',
        endDate: '2014-12-31',
      }).expect(201);
  });
  it('can list successfully', async () => {
    const { body } = await global.superapp
      .get(`/structures/${rid}/identifiers`)
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.type);
    expect(docs).toContain('Siret');
    expect(docs).toContain('Wikidata');
    expect(docs).toContain('idRef');
  });
  it('can skip successfully', async () => {
    const { body } = await global.superapp
      .get(`/structures/${rid}/identifiers?skip=1`)
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.type);
    expect(docs).toContain('Wikidata');
    expect(docs).toContain('idRef');
    expect(docs).toHaveLength(2);
    expect(body.totalCount).toBe(3);
  });
  it('can limit successfully', async () => {
    const { body } = await global.superapp
      .get(`/structures/${rid}/identifiers?limit=1`)
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.type);
    expect(docs).toContain('Siret');
    expect(docs).toHaveLength(1);
    expect(body.totalCount).toBe(3);
  });
  it('can sort successfully', async () => {
    const { body } = await global.superapp
      .get(`/structures/${rid}/identifiers?sort=value`)
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.value);
    expect(docs[0]).toBe('idrefID');
    expect(docs).toHaveLength(3);
    expect(body.totalCount).toBe(3);
  });
  it('can reversely sort successfully', async () => {
    const { body } = await global.superapp
      .get(`/structures/${rid}/identifiers?sort=-value`)
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.value);
    expect(docs[0]).toBe('wikidataID');
    expect(docs).toHaveLength(3);
    expect(body.totalCount).toBe(3);
  });
  it('can filter successfully', async () => {
    const { body } = await global.superapp
      .get(`/structures/${rid}/identifiers?filters[type]=Wikidata&filters[value]=wikidataID`)
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.value);
    expect(docs).toContain('wikidataID');
    expect(docs).toHaveLength(1);
    expect(body.totalCount).toBe(1);
  });
});
