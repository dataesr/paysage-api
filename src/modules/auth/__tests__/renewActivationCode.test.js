let accessToken;
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
  accessToken = body.accessToken;
});
it('throws when user is not registered', async () => {
  await global.superapp
    .get('/auth/renew-activation-code')
    .expect(401);
});
it('sends an email with the new code to user <email>', async () => {
  await global.superapp
    .get('/auth/renew-activation-code')
    .set('Authorization', `Bearer ${accessToken}`)
    .expect(200);
});
