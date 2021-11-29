import jwt from 'jsonwebtoken';

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

it('can sign user in', async () => {
  const response = await global.superapp
    .post('/auth/signin')
    .send({ account: 'user', password: 'Passw0rd!' })
    .expect(200);
  const { accessToken, refreshToken } = response.body;
  const { user } = jwt.decode(accessToken);
  expect(user.username).toBeTruthy();
  expect(refreshToken).toBeTruthy();
});
it('throws on username missmatch', async () => {
  global.superapp
    .post('/auth/signin')
    .send({ account: 'Unpourtous', password: 'Passw0rd!' })
    .expect(400);
});
it('throws on email missmatch', async () => {
  global.superapp
    .post('/auth/signin')
    .send({ account: 'wrong@test.com', password: 'Passw0rd!' })
    .expect(400);
});
it('throws on password missmatch', async () => {
  global.superapp
    .post('/auth/signin')
    .send({ account: 'user@test.com', password: 'IamWr0ng!' })
    .expect(400);
});
it('throws on missing account', async () => {
  global.superapp
    .post('/auth/signin')
    .send({ password: 'Passw0rd!' })
    .expect(400);
});
it('throws on missing password', async () => {
  global.superapp
    .post('/auth/signin')
    .send({ account: 'user@test.com' })
    .expect(400);
});
