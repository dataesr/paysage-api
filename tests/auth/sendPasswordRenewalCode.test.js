beforeAll(async () => {
  await global.superapp
    .post('/auth/signup')
    .send({
      email: 'user@test.com',
      password: 'Passw0rd!',
      username: 'user',
      firstName: 'firstName',
      lastName: 'lastName',
    })
    .expect(201);
});
it('sends an email with the new code to user <email>', async () => {
  await global.superapp
    .post('/auth/send-password-renewal-code')
    .send({ account: 'user' })
    .expect(200);
  await global.superapp
    .post('/auth/send-password-renewal-code')
    .send({ account: 'user@test.com' })
    .expect(200);
  const { code } = await global.db.collection('codes').findOne({ type: 'password-renewal' });
  expect(code).toBeTruthy();
});
it('throws with falsy account', async () => {
  await global.superapp
    .post('/auth/send-password-renewal-code')
    .send({ account: 'blah' })
    .expect(404);
});
