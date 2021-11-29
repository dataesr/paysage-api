let refreshToken;
beforeAll(async () => {
  const { body } = await global.superapp
    .post('/auth/signup')
    .send({
      email: 'user@test.com',
      password: 'Passw0rd!',
      username: 'user',
      firstName: 'firstName',
      lastName: 'lastName',
    })
    .expect(201);
  refreshToken = body.refreshToken;
});

it('can get refreshed tokens', async () => {
  await global.superapp
    .post('/auth/refresh-access-token')
    .send({ refreshToken })
    .expect(200);
});
it('throws with wrong token', async () => {
  await global.superapp
    .post('/auth/refresh-access-token')
    .send({ refreshToken: 'token' })
    .expect(400);
});
it('throws with no token', async () => {
  await global.superapp
    .post('/auth/refresh-access-token')
    .send({})
    .expect(400);
});
