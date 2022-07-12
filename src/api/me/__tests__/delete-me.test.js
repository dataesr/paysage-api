let authorization;
beforeAll(async () => {
  authorization = await global.utils.createUser('user');
});

it('throws when not registered', async () => {
  await global.superapp
    .delete('/me')
    .expect(401);
});
it('can delete me', async () => {
  const response = await global.superapp
    .delete('/me')
    .set('Authorization', authorization)
    .expect(204);
  expect(response.body).toEqual({});
});
