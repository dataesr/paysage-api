let authorization;
let rid;
let id;
const structureName = {
  officialName: 'string',
  usualName: 'string',
  shortName: 'string',
  brandName: 'string',
  nameEn: 'string',
  acronymFr: 'string',
  acronymEn: 'string',
  otherName: [
    'string',
  ],
  startDate: '2012-01-01',
  comment: 'string',
  article: "à l'",
};
beforeAll(async () => {
  authorization = await global.utils.createUser('user');
  const response = await global.superapp
    .post('/structures')
    .set('Authorization', authorization)
    .send({
      structureStatus: 'active',
    }).expect(201);
  rid = response.body.id;
});

describe('API > structures > names > create', () => {
  it('can create successfully', async () => {
    const response = await global.superapp
      .post(`/structures/${rid}/names`)
      .set('Authorization', authorization)
      .send(structureName).expect(201);
    expect(response.body.id).toBeTruthy();
    expect(response.body.officialName).toBe('string');
    expect(response.body.usualName).toBe('string');
    expect(response.body.createdBy.username).toBe('user');
    id = response.body.id;
  });
  it('throws with required field missing', async () => {
    const { usualName, ...rest } = structureName;
    await global.superapp
      .post(`/structures/${rid}/names`)
      .set('Authorization', authorization)
      .send(rest).expect(400);
  });
  it('throws with unknown resource', async () => {
    await global.superapp
      .post('/structures/re98D/names')
      .set('Authorization', authorization)
      .send(structureName).expect(404);
  });
});

describe('API > structures > names > update', () => {
  it('can update successfully', async () => {
    const { body } = await global.superapp
      .patch(`/structures/${rid}/names/${id}`)
      .set('Authorization', authorization)
      .send({ otherName: ['string', 'string2'], article: null })
      .expect(200);
    expect(body.otherName).toHaveLength(2);
    expect(body.otherName).toContain('string2');
  });
  it('throws bad request with wrong id', async () => {
    await global.superapp
      .patch(`/structures/${rid}/names/45frK`)
      .set('Authorization', authorization)
      .send({ otherName: ['string', 'string2'] })
      .expect(400);
  });
  it('throws not found with wrong id', async () => {
    await global.superapp
      .patch(`/structures/${rid}/names/45skrc65`)
      .set('Authorization', authorization)
      .send({ otherName: ['string', 'string2'] })
      .expect(404);
  });
  it('throws with wrong data', async () => {
    await global.superapp
      .patch(`/structures/${rid}/names/${id}`)
      .set('Authorization', authorization)
      .send({ startDate: 'string' })
      .expect(400);
  });
});

describe('API > structures > names > read', () => {
  it('can read successfully', async () => {
    const response = await global.superapp
      .get(`/structures/${rid}/names/${id}`)
      .set('Authorization', authorization)
      .expect(200);
    expect(response.body.id).toBeTruthy();
    expect(response.body.officialName).toBe('string');
    expect(response.body.usualName).toBe('string');
    expect(response.body.createdBy.username).toBe('user');
    expect(response.body.otherName).toHaveLength(2);
    expect(response.body.otherName).toContain('string2');
  });
  it('throws bad request with wrong id', async () => {
    await global.superapp
      .get(`/structures/${rid}/names/265vty`)
      .set('Authorization', authorization)
      .expect(400);
  });
  it('throws not found with unknown id', async () => {
    await global.superapp
      .get(`/structures/${rid}/names/265fkrld`)
      .set('Authorization', authorization)
      .expect(404);
  });
});

describe('API > structures > names > delete', () => {
  it('throws bad request with wrong id', async () => {
    await global.superapp
      .delete(`/structures/${rid}/names/vgy775`)
      .set('Authorization', authorization)
      .expect(400);
  });
  it('throws not found with unknown id', async () => {
    await global.superapp
      .delete(`/structures/${rid}/names/775flrks`)
      .set('Authorization', authorization)
      .expect(404);
  });
});

describe('API > structures > names > list', () => {
  beforeAll(async () => {
    await global.superapp
      .post(`/structures/${rid}/names/`)
      .set('Authorization', authorization)
      .send({ ...structureName, usualName: 'string2', startDate: null })
      .expect(201);
    await global.superapp
      .post(`/structures/${rid}/names/`)
      .set('Authorization', authorization)
      .send({ ...structureName, usualName: 'string3', startDate: '2017-01-01' })
      .expect(201);
  });
  it('can list successfully', async () => {
    const { body } = await global.superapp
      .get(`/structures/${rid}/names`)
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.usualName);
    expect(docs).toContain('string');
    expect(docs).toContain('string2');
    expect(docs).toContain('string3');
  });
  it('can skip successfully', async () => {
    const { body } = await global.superapp
      .get(`/structures/${rid}/names?skip=1`)
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.usualName);
    expect(docs).toContain('string2');
    expect(docs).toContain('string3');
    expect(docs).toHaveLength(2);
    expect(body.totalCount).toBe(3);
  });
  it('can limit successfully', async () => {
    const { body } = await global.superapp
      .get(`/structures/${rid}/names?limit=1`)
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.usualName);
    expect(docs).toContain('string');
    expect(docs).toHaveLength(1);
    expect(body.totalCount).toBe(3);
  });
  it('can sort successfully', async () => {
    const { body } = await global.superapp
      .get(`/structures/${rid}/names?sort=usualName`)
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.usualName);
    expect(docs[0]).toBe('string');
    expect(docs).toHaveLength(3);
    expect(body.totalCount).toBe(3);
  });
  it('can reversely sort successfully', async () => {
    const { body } = await global.superapp
      .get(`/structures/${rid}/names?sort=-usualName`)
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.usualName);
    expect(docs[0]).toBe('string3');
    expect(docs).toHaveLength(3);
    expect(body.totalCount).toBe(3);
  });
  it('can filter successfully', async () => {
    const { body } = await global.superapp
      .get(`/structures/${rid}/names?filters[usualName]=string2`)
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.usualName);
    expect(docs).toContain('string2');
    expect(docs).toHaveLength(1);
    expect(body.totalCount).toBe(1);
  });
  it('returns currentName successfully', async () => {
    const { body } = await global.superapp
      .get(`/structures/${rid}`)
      .set('Authorization', authorization)
      .expect(200);
    expect(body.currentName.startDate).toBe('2017-01-01');
  });
});
