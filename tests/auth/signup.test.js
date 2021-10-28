it('can register new user successfully', async () => {
  const response = await global.superapp
    .post('/auth/signup')
    .send({
      email: 'user@test.com',
      password: 'Passw0rd!',
      username: 'user',
      firstName: 'firstName',
      lastName: 'lastName',
    })
    .expect(201);
  expect(response.body.accessToken).toBeTruthy();
  expect(response.body.refreshToken).toBeTruthy();
});
it('throws error on duplicate email at registration', async () => {
  await global.superapp
    .post('/auth/signup')
    .send({
      email: 'user@test.com',
      password: 'Passw0rd!',
      username: 'user1',
    })
    .expect(400);
});
it('throws error on duplicate username at registration', async () => {
  await global.superapp
    .post('/auth/signup')
    .send({
      email: 'user1@test.com',
      password: 'Passw0rd!',
      username: 'user',
    })
    .expect(400);
});
it('throws on non secure password', async () => {
  await global.superapp
    .post('/auth/signup')
    .send({
      email: 'signup1@test.com',
      password: 'notsecure',
      username: 'signup1',
    })
    .expect(400);
});
it('throws on missing password', async () => {
  await global.superapp
    .post('/auth/signup')
    .send({
      email: 'signup1@test.com',
      username: 'signup1',
    })
    .expect(400);
});
it('throws on missing email', async () => {
  await global.superapp
    .post('/auth/signup')
    .send({ password: 'Passw0rd!', username: 'signup1' })
    .expect(400);
});
it('throws on missing username', async () => {
  await global.superapp
    .post('/auth/signup')
    .send({ email: 'signup1@test.com', password: 'Passw0rd!' })
    .expect(400);
});
