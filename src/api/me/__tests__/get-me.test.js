let authorization;
beforeAll(async () => {
  authorization = await global.utils.createUser('user');
});

it('throws when not registered', async () => {
  await global.superapp
    .get('/me')
    .expect(401);
});
it('can get me', async () => {
  const response = await global.superapp
    .get('/me')
    .set('Authorization', authorization)
    .expect(200);
  expect(response.body.username).toBe('user');
  expect(response.body.firstName).toBe('firstName');
  expect(response.body.password).toBeFalsy();
});
