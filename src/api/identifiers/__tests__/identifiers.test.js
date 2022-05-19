let authorization;
const rid = 'AZERT';

const payload = {
  type: 'Siret',
  value: '12345678912345',
  active: true,
  startDate: '2012-01-01',
  endDate: '2014-12-31',
};

beforeAll(async () => {
  authorization = await global.utils.createUser('user');
});

describe('API > identifiers > create', () => {
  it('should create a new identifier', async () => {
    const { body } = await global.superapp
      .post(`/identifiers/${rid}`)
      .set('Authorization', authorization)
      .send(payload)
      .expect(201);
    expect(body.id).toBeTruthy();
    expect(body.type).toBe('Siret');
    expect(body.value).toBe('12345678912345');
    expect(body.active).toBeTruthy();
    expect(body.resourceId).toBe(rid);
    expect(body.createdBy.username).toBe('user');
  });
});

describe('API > identifiers > list', () => {
  beforeAll(async () => {
    await global.utils.db.collection('identifiers').deleteMany({});
    await global.superapp
      .post(`/identifiers/${rid}`)
      .set('Authorization', authorization)
      .send(payload)
      .expect(201);
    await global.superapp
      .post(`/identifiers/${rid}`)
      .set('Authorization', authorization)
      .send({ ...payload, value: '12' })
      .expect(201);
    await global.superapp
      .post(`/identifiers/${rid}`)
      .set('Authorization', authorization)
      .send({ ...payload, value: '42' })
      .expect(201);
  });
  it('can list successfully', async () => {
    const { body } = await global.superapp
      .get(`/identifiers/${rid}`)
      .set('Authorization', authorization)
      .expect(200);
    expect(body.data[0].resourceId).toBe(rid);
    expect(body.data[0].value).toBe('12345678912345');
    expect(body.data[1].resourceId).toBe(rid);
    expect(body.data[1].value).toBe('12');
    expect(body.data[2].resourceId).toBe(rid);
    expect(body.data[2].value).toBe('42');
  });
});
