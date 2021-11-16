import jwt from 'jsonwebtoken';

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

it('throws when not registered', async () => {
  await global.superapp
    .post('/auth/activate-account')
    .send({ activationCode: 456867 })
    .expect(401);
});
it('throws when wrong code', async () => {
  await global.superapp
    .post('/auth/activate-account')
    .set('Authorization', `Bearer ${accessToken}`)
    .send({ activationCode: 456867 })
    .expect(400);
});
it('throws when no code', async () => {
  await global.superapp
    .post('/auth/activate-account')
    .set('Authorization', `Bearer ${accessToken}`)
    .send({})
    .expect(400);
});
it('can activate account', async () => {
  const { user } = jwt.decode(accessToken);
  await global.db.collection('codes').insertOne({ code: 456876, type: 'activation', userId: user.id });
  await global.superapp
    .post('/auth/activate-account')
    .set('Authorization', `Bearer ${accessToken}`)
    .send({ activationCode: 456876 })
    .expect(200);
});
