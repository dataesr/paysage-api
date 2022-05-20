let authorization;
let id;
let rid;

const payload = {
  type: 'Siret',
  value: '12345678912345',
  active: false,
  startDate: '2012-01-01',
  endDate: '2014-12-31',
};

beforeAll(async () => {
  authorization = await global.utils.createUser('user');
  const { body } = await global.superapp
    .post('/structures')
    .set('Authorization', authorization)
    .send({
      structureStatus: 'active',
      creationDate: '2021-02',
      usualName: 'Université',
    });
  rid = body.id;
});

beforeEach(async () => {
  const { body } = await global.superapp
    .post(`/structures/${rid}/identifiers`)
    .set('Authorization', authorization)
    .send(payload);
  id = body.id;
});

afterEach(async () => {
  if (id) {
    await global.superapp
      .delete(`/structures/${rid}/identifiers/${id}`)
      .set('Authorization', authorization);
  }
});

describe('API > structures > identifiers > create', () => {
  it('should create a new identifier', async () => {
    const { body } = await global.superapp
      .post(`/structures/${rid}/identifiers`)
      .set('Authorization', authorization)
      .send(payload)
      .expect(201);
    expect(body.id).toBeTruthy();
    expect(body.type).toBe('Siret');
    expect(body.value).toBe('12345678912345');
    expect(body.active).toBeFalsy();
    expect(body.createdBy.username).toBe('user');

    await global.superapp
      .delete(`/structures/${rid}/identifiers/${body.id}`)
      .set('Authorization', authorization);
  });

  it('should throw bad request if type is missing', async () => {
    const { type, ...rest } = payload;
    await global.superapp
      .post(`/structures/${rid}/identifiers`)
      .set('Authorization', authorization)
      .send(rest)
      .expect(400);
  });

  it('should throw bad request if value is missing', async () => {
    const { value, ...rest } = payload;
    await global.superapp
      .post(`/structures/${rid}/identifiers`)
      .set('Authorization', authorization)
      .send(rest)
      .expect(400);
  });
});

describe('API > structures > identifiers > update', () => {
  it('should update an existing identifier', async () => {
    const type = 'Wikidata';
    const { body } = await global.superapp
      .patch(`/structures/${rid}/identifiers/${id}`)
      .set('Authorization', authorization)
      .send({ type })
      .expect(200);
    expect(body.type).toBe(type);
  });

  it('should throw bad request if id too short', async () => {
    await global.superapp
      .patch(`/structures/${rid}/identifiers/45frK`)
      .set('Authorization', authorization)
      .send({ type: 'Wikidata' })
      .expect(400);
  });

  it('should throw not found if unexisting id', async () => {
    await global.superapp
      .patch(`/structures/${rid}/identifiers/45dlrt5d`)
      .set('Authorization', authorization)
      .send({ type: 'Wikidata' })
      .expect(404);
  });

  it('should throw bad request with badly formatted payload', async () => {
    await global.superapp
      .patch(`/structures/${rid}/identifiers/${id}`)
      .set('Authorization', authorization)
      .send({ startDate: 'Wikidata' })
      .expect(400);
  });

  it('should accept empty dates', async () => {
    await global.superapp
      .patch(`/structures/${rid}/identifiers/${id}`)
      .set('Authorization', authorization)
      .send({ startDate: '' })
      .expect(200);
  });
});

describe('API > structures > identifiers > read', () => {
  it('should read existing identifier', async () => {
    const { body } = await global.superapp
      .get(`/structures/${rid}/identifiers/${id}`)
      .set('Authorization', authorization)
      .expect(200);
    expect(body.type).toBe(payload.type);
    expect(body.value).toBe(payload.value);
    expect(body.active).toBeFalsy();
    expect(body.createdBy.username).toBe('user');
  });

  it('should throw bad request if id too short', async () => {
    await global.superapp
      .get(`/structures/${rid}/identifiers/265vty`)
      .set('Authorization', authorization)
      .expect(400);
  });

  it('should throw not found if unexisting id', async () => {
    await global.superapp
      .get(`/structures/${rid}/identifiers/265gtr5d`)
      .set('Authorization', authorization)
      .expect(404);
  });
});

describe('API > structures > identifiers > delete', () => {
  it('should throw bad request if id too short', async () => {
    await global.superapp
      .delete(`/structures/${rid}/identifiers/vgy775`)
      .set('Authorization', authorization)
      .expect(400);
  });

  it('should throw not found if unexisting id', async () => {
    await global.superapp
      .delete(`/structures/${rid}/identifiers/775glrs5`)
      .set('Authorization', authorization)
      .expect(404);
  });

  it('should delete existing identifier', async () => {
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
      });
    await global.superapp
      .post(`/structures/${rid}/identifiers/`)
      .set('Authorization', authorization)
      .send({
        type: 'Wikidata',
        value: 'wikidataID',
        active: true,
        startDate: '2012-01-01',
        endDate: '2014-12-31',
      });
    await global.superapp
      .post(`/structures/${rid}/identifiers/`)
      .set('Authorization', authorization)
      .send({
        type: 'idRef',
        value: 'idrefID',
        active: true,
        startDate: '2012-01-01',
        endDate: '2014-12-31',
      });
  });

  beforeEach(async () => {
    if (id) {
      await global.superapp
        .delete(`/structures/${rid}/identifiers/${id}`)
        .set('Authorization', authorization);
    }
  });

  it('should list', async () => {
    const { body } = await global.superapp
      .get(`/structures/${rid}/identifiers`)
      .set('Authorization', authorization);
    const docs = body.data.map((doc) => doc.type);
    expect(docs).toHaveLength(3);
    expect(docs).toContain('Siret');
    expect(docs).toContain('Wikidata');
    expect(docs).toContain('idRef');
  });

  it('should skip identifiers in list', async () => {
    const { body } = await global.superapp
      .get(`/structures/${rid}/identifiers?skip=1`)
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.type);
    expect(docs).toHaveLength(2);
    expect(docs).toContain('Wikidata');
    expect(docs).toContain('idRef');
    expect(body.totalCount).toBe(3);
  });

  it('should limit identifiers in list', async () => {
    const { body } = await global.superapp
      .get(`/structures/${rid}/identifiers?limit=1`)
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.type);
    expect(docs).toHaveLength(1);
    expect(docs).toContain('Siret');
    expect(body.totalCount).toBe(3);
  });

  it('should sort identifiers in list', async () => {
    const { body } = await global.superapp
      .get(`/structures/${rid}/identifiers?sort=value`)
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.value);
    expect(docs).toHaveLength(3);
    expect(docs[0]).toBe('idrefID');
    expect(body.totalCount).toBe(3);
  });

  it('should reversely sort identifiers in list', async () => {
    const { body } = await global.superapp
      .get(`/structures/${rid}/identifiers?sort=-value`)
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.value);
    expect(docs).toHaveLength(3);
    expect(docs[0]).toBe('wikidataID');
    expect(body.totalCount).toBe(3);
  });

  it('should filter identifiers in list', async () => {
    const { body } = await global.superapp
      .get(`/structures/${rid}/identifiers?filters[type]=Wikidata&filters[value]=wikidataID`)
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.value);
    expect(docs).toHaveLength(1);
    expect(docs).toContain('wikidataID');
    expect(body.totalCount).toBe(1);
  });
});
