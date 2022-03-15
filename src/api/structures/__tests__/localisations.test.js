let authorization;
let rid;
let id;
const payload = {
  cityId: 'string',
  distributionStatement: 'string',
  address: 'string',
  postalCode: 'string',
  locality: 'string',
  country: 'France',
  telephone: '+33665984565',
  coordinates: {
    lat: 12.48965321,
    lng: 24.258481,
  },
  startDate: '2015',
  endDate: '2013',
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

describe('API > structures > localisations > create', () => {
  it('can create successfully', async () => {
    const { body } = await global.superapp
      .post(`/structures/${rid}/localisations`)
      .set('Authorization', authorization)
      .send(payload).expect(201);
    Object.entries(payload).map((entry) => expect(body[entry[0]]).toStrictEqual(entry[1]));
    expect(body.id).toBeTruthy();
    expect(body.createdBy.username).toBe('user');
    id = body.id;
  });
  it('throws with required field missing', async () => {
    const { country, ...rest } = payload;
    await global.superapp
      .post(`/structures/${rid}/localisations`)
      .set('Authorization', authorization)
      .send(rest).expect(400);
  });
});

describe('API > structures > localisations > update', () => {
  it('can update successfully', async () => {
    const { body } = await global.superapp
      .patch(`/structures/${rid}/localisations/${id}`)
      .set('Authorization', authorization)
      .send({ locality: 'Strasbourg', coordinates: { lat: 2.56, lng: 69.1631 } })
      .expect(200);
    expect(body.locality).toBe('Strasbourg');
    expect(body.coordinates.lat).toBe(2.56);
    expect(body.coordinates.lng).toBe(69.1631);
  });
  it('throws bad request with wrong id', async () => {
    await global.superapp
      .patch(`/structures/${rid}/localisations/45frK`)
      .set('Authorization', authorization)
      .send({ locality: 'Strasbourg' })
      .expect(400);
  });
  it('throws not found with wrong id', async () => {
    await global.superapp
      .patch(`/structures/${rid}/localisations/45skrc65`)
      .set('Authorization', authorization)
      .send({ locality: 'Strasbourg' })
      .expect(404);
  });
  it('throws with wrong data', async () => {
    await global.superapp
      .patch(`/structures/${rid}/localisations/${id}`)
      .set('Authorization', authorization)
      .send({ startDate: 'string' })
      .expect(400);
  });
  it('throws with wrong data', async () => {
    await global.superapp
      .patch(`/structures/${rid}/localisations/${id}`)
      .set('Authorization', authorization)
      .send({ coordinates: { lat: 45.462168 } })
      .expect(400);
  });
  it('throws with wrong data', async () => {
    await global.superapp
      .patch(`/structures/${rid}/localisations/${id}`)
      .set('Authorization', authorization)
      .send({ telephone: { lat: 45.462168 } })
      .expect(400);
  });
});

describe('API > structures > localisations > read', () => {
  it('can read successfully', async () => {
    const { body } = await global.superapp
      .get(`/structures/${rid}/localisations/${id}`)
      .set('Authorization', authorization)
      .expect(200);
    expect(body.id).toBeTruthy();
    expect(body.locality).toBe('Strasbourg');
    const { locality, coordinates, ...rest } = payload;
    Object.entries(rest).map((entry) => expect(body[entry[0]]).toStrictEqual(entry[1]));
    expect(body.locality).toBe('Strasbourg');
    expect(body.coordinates.lat).toBe(2.56);
    expect(body.coordinates.lng).toBe(69.1631);
  });
  it('throws bad request with wrong id', async () => {
    await global.superapp
      .get(`/structures/${rid}/localisations/265vty`)
      .set('Authorization', authorization)
      .expect(400);
  });
  it('throws not found with unknown id', async () => {
    await global.superapp
      .get(`/structures/${rid}/localisations/265fkrld`)
      .set('Authorization', authorization)
      .expect(404);
  });
});

describe('API > structures > localisations > delete', () => {
  it('throws bad request with wrong id', async () => {
    await global.superapp
      .delete(`/structures/${rid}/localisations/vgy775`)
      .set('Authorization', authorization)
      .expect(400);
  });
  it('throws not found with unknown id', async () => {
    await global.superapp
      .delete(`/structures/${rid}/localisations/775flrks`)
      .set('Authorization', authorization)
      .expect(404);
  });
});

describe('API > structures > localisations > list', () => {
  beforeAll(async () => {
    await global.superapp
      .post(`/structures/${rid}/localisations/`)
      .set('Authorization', authorization)
      .send({ ...payload, locality: 'Colmar' })
      .expect(201);
    await global.superapp
      .post(`/structures/${rid}/localisations/`)
      .set('Authorization', authorization)
      .send({ ...payload, locality: 'Mulhouse' })
      .expect(201);
  });
  it('can list successfully', async () => {
    const { body } = await global.superapp
      .get(`/structures/${rid}/localisations`)
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.locality);
    expect(docs).toContain('Strasbourg');
    expect(docs).toContain('Colmar');
    expect(docs).toContain('Mulhouse');
  });
  it('can skip successfully', async () => {
    const { body } = await global.superapp
      .get(`/structures/${rid}/localisations?skip=1`)
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.locality);
    expect(docs).toContain('Colmar');
    expect(docs).toContain('Mulhouse');
    expect(docs).toHaveLength(2);
    expect(body.totalCount).toBe(3);
  });
  it('can limit successfully', async () => {
    const { body } = await global.superapp
      .get(`/structures/${rid}/localisations?limit=1`)
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.locality);
    expect(docs).toContain('Strasbourg');
    expect(docs).toHaveLength(1);
    expect(body.totalCount).toBe(3);
  });
  it('can sort successfully', async () => {
    const { body } = await global.superapp
      .get(`/structures/${rid}/localisations?sort=locality`)
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.locality);
    expect(docs[0]).toBe('Colmar');
    expect(docs).toHaveLength(3);
    expect(body.totalCount).toBe(3);
  });
  it('can reversely sort successfully', async () => {
    const { body } = await global.superapp
      .get(`/structures/${rid}/localisations?sort=-locality`)
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.locality);
    expect(docs[0]).toBe('Strasbourg');
    expect(docs).toHaveLength(3);
    expect(body.totalCount).toBe(3);
  });
  it('can filter successfully', async () => {
    const { body } = await global.superapp
      .get(`/structures/${rid}/localisations?filters[locality]=Strasbourg`)
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.locality);
    expect(docs).toContain('Strasbourg');
    expect(docs).toHaveLength(1);
    expect(body.totalCount).toBe(1);
  });
});
