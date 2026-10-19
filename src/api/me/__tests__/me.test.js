let authorization;

beforeAll(async () => {
  authorization = await global.utils.createUser('me');
});

describe('API > me > update', () => {
  it('can update its profile', async () => {
    const payload = { firstName: 'Jane', lastName: 'Doe', position: 'Cheffe de projet', service: 'DOAD' };
    const { body } = await global.superapp
      .patch('/me')
      .set('Authorization', authorization)
      .send(payload)
      .expect(200);
    Object.entries(payload).map((entry) => expect(body[entry[0]]).toBe(entry[1]));
  });

  it('can empty position and service', async () => {
    const { body } = await global.superapp
      .patch('/me')
      .set('Authorization', authorization)
      .send({ position: '', service: null })
      .expect(200);
    expect(body.position).toBe(null);
    expect(body.service).toBe(null);
  });

  it('ignore additionalProperties', async () => {
    await global.superapp
      .patch('/me')
      .set('Authorization', authorization)
      .send({ firstName: 'Janet', role: 'admin', confirmed: false, email: 'other@test.com' })
      .expect(200);
    const dbData = await global.db.collection('users').findOne({ email: 'me@test.com' });
    expect(dbData.firstName).toBe('Janet');
    expect(dbData.role).toBe('user');
    expect(dbData.confirmed).toBe(true);
  });
});
