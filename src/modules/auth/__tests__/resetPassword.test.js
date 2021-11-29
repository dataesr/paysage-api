let code;
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
  await global.superapp
    .post('/auth/send-password-renewal-code')
    .send({ account: 'user' });
  const dbCode = await global.db.collection('codes').findOne({ type: 'password-renewal' });
  code = dbCode.code;
});

it('throws without code', async () => {
  await global.superapp
    .post('/auth/reset-password')
    .send({ account: 'user', password: 'Passw00rd!' })
    .expect(400);
});
it('throws with falsy code', async () => {
  await global.superapp
    .post('/auth/reset-password')
    .send({ account: 'user', password: 'Passw00rd!', code: 456879 })
    .expect(400);
});
it('throws with falsy username', async () => {
  await global.superapp
    .post('/auth/reset-password')
    .send({ account: 'user1234', password: 'Passw00rd!', code })
    .expect(404);
});
it('throws with non secure password account', async () => {
  await global.superapp
    .post('/auth/reset-password')
    .send({ account: 'user', password: 'azerty', code })
    .expect(400);
});
it('successfully change user password', async () => {
  await global.superapp
    .post('/auth/reset-password')
    .send({ account: 'user', password: 'Passw00rd!', code })
    .expect(200);
  const deleted = await global.db.collection('codes').find({ type: 'password-renewal' });
  expect(deleted.token).toBeFalsy();
});
