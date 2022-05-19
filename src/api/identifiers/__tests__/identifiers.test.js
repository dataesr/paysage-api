let authorization;
const rid = '42';

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
