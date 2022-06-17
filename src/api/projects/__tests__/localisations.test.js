let authorization;
let id;
let resourceId;
let tid;

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

const collection = 'projects';

beforeAll(async () => {
  authorization = await global.utils.createUser('user');
  const { body } = await global.superapp
    .post(`/${collection}`)
    .set('Authorization', authorization)
    .send({
      nameFr: 'Test',
      nameEn: 'Test',
      fullNameFr: 'Test',
      fullNameEn: 'Test',
      acronymFr: 'Test',
      acronymEn: 'Test',
      description: 'Test',
      startDate: '2000',
      endDate: '2001',
      grantPart: 'Test',
      comment: 'Test',
    });
  resourceId = body.id;
});

describe('API > projects > localisations > create', () => {
  it('can create successfully', async () => {
    const { body } = await global.superapp
      .post(`/${collection}/${resourceId}/localisations`)
      .set('Authorization', authorization)
      .send(payload).expect(201);
    Object.entries(payload).map((entry) => expect(body[entry[0]]).toStrictEqual(entry[1]));
    expect(body.id).toBeTruthy();
    expect(body.createdBy.username).toBe('user');
    id = body.id;
  });

  it('should fail if country is missing', async () => {
    const { country, ...rest } = payload;
    await global.superapp
      .post(`/${collection}/${resourceId}/localisations`)
      .set('Authorization', authorization)
      .send(rest)
      .expect(400);
  });

  it('can create with missing coordinates', async () => {
    const { coordinates, ...rest } = payload;
    const { body } = await global.superapp
      .post(`/${collection}/${resourceId}/localisations`)
      .set('Authorization', authorization)
      .send(rest);
    tid = body.id;
  });
});

describe('API > projects > localisations > update', () => {
  it('can update successfully', async () => {
    const { body } = await global.superapp
      .patch(`/${collection}/${resourceId}/localisations/${id}`)
      .set('Authorization', authorization)
      .send({ locality: 'Strasbourg', coordinates: { lat: 2.56, lng: 69.1631 } })
      .expect(200);
    expect(body.locality).toBe('Strasbourg');
    expect(body.coordinates.lat).toBe(2.56);
    expect(body.coordinates.lng).toBe(69.1631);
  });

  it('throws bad request with wrong id', async () => {
    await global.superapp
      .patch(`/${collection}/${resourceId}/localisations/45frK`)
      .set('Authorization', authorization)
      .send({ locality: 'Strasbourg' })
      .expect(400);
  });
  it('throws not found with wrong id', async () => {
    await global.superapp
      .patch(`/${collection}/${resourceId}/localisations/45dlrt5dkkhhuu7`)
      .set('Authorization', authorization)
      .send({ locality: 'Strasbourg' })
      .expect(404);
  });

  it('throws with wrong data', async () => {
    await global.superapp
      .patch(`/${collection}/${resourceId}/localisations/${id}`)
      .set('Authorization', authorization)
      .send({ startDate: 'string' })
      .expect(400);
  });
  it('throws with wrong data', async () => {
    await global.superapp
      .patch(`/${collection}/${resourceId}/localisations/${id}`)
      .set('Authorization', authorization)
      .send({ coordinates: { lat: 45.462168 } })
      .expect(400);
  });
  it('throws with wrong data', async () => {
    await global.superapp
      .patch(`/${collection}/${resourceId}/localisations/${id}`)
      .set('Authorization', authorization)
      .send({ telephone: { lat: 45.462168 } })
      .expect(400);
  });
});

describe('API > projects > localisations > read', () => {
  it('can read successfully', async () => {
    const { body } = await global.superapp
      .get(`/${collection}/${resourceId}/localisations/${id}`)
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
      .get(`/${collection}/${resourceId}/localisations/265vty`)
      .set('Authorization', authorization)
      .expect(400);
  });
  it('throws not found with unknown id', async () => {
    await global.superapp
      .get(`/structures/${resourceId}/localisations/45dlrt5dkkhhuu7`)
      .set('Authorization', authorization)
      .expect(404);
  });
});

describe('API > projects > localisations > delete', () => {
  it('can delete', async () => {
    await global.superapp
      .delete(`/${collection}/${resourceId}/localisations/${tid}`)
      .set('Authorization', authorization)
      .expect(204);
  });
  it('throws bad request with wrong id', async () => {
    await global.superapp
      .delete(`/${collection}/${resourceId}/localisations/vgy775`)
      .set('Authorization', authorization)
      .expect(400);
  });
  it('throws not found with unknown id', async () => {
    await global.superapp
      .delete(`/${collection}/${resourceId}/localisations/45dlrt5dkkhhuu7`)
      .set('Authorization', authorization)
      .expect(404);
  });
});

describe('API > projects > localisations > list', () => {
  beforeAll(async () => {
    await global.superapp
      .post(`/${collection}/${resourceId}/localisations/`)
      .set('Authorization', authorization)
      .send({ ...payload, locality: 'Colmar' })
      .expect(201);
    await global.superapp
      .post(`/${collection}/${resourceId}/localisations/`)
      .set('Authorization', authorization)
      .send({ ...payload, locality: 'Mulhouse' })
      .expect(201);
  });
  it('can list successfully', async () => {
    const { body } = await global.superapp
      .get(`/${collection}/${resourceId}/localisations`)
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.locality);
    expect(docs).toContain('Strasbourg');
    expect(docs).toContain('Colmar');
    expect(docs).toContain('Mulhouse');
  });
  it('can skip successfully', async () => {
    const { body } = await global.superapp
      .get(`/${collection}/${resourceId}/localisations?skip=1`)
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
      .get(`/${collection}/${resourceId}/localisations?limit=1`)
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.locality);
    expect(docs).toContain('Strasbourg');
    expect(docs).toHaveLength(1);
    expect(body.totalCount).toBe(3);
  });
  it('can sort successfully', async () => {
    const { body } = await global.superapp
      .get(`/${collection}/${resourceId}/localisations?sort=locality`)
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.locality);
    expect(docs[0]).toBe('Colmar');
    expect(docs).toHaveLength(3);
    expect(body.totalCount).toBe(3);
  });
  it('can reversely sort successfully', async () => {
    const { body } = await global.superapp
      .get(`/${collection}/${resourceId}/localisations?sort=-locality`)
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.locality);
    expect(docs[0]).toBe('Strasbourg');
    expect(docs).toHaveLength(3);
    expect(body.totalCount).toBe(3);
  });
  it('can filter successfully', async () => {
    const { body } = await global.superapp
      .get(`/${collection}/${resourceId}/localisations?filters[locality]=Strasbourg`)
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.locality);
    expect(docs).toContain('Strasbourg');
    expect(docs).toHaveLength(1);
    expect(body.totalCount).toBe(1);
  });
});
