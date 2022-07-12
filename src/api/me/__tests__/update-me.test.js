let authorization;
beforeAll(async () => {
  authorization = await global.utils.createUser('user');
});

it('can update me', async () => {
  const response = await global.superapp
    .patch('/me')
    .set('Authorization', authorization)
    .send({ firstName: 'User' })
    .expect(200);
  expect(response.body.firstName).toBe('User');
  expect(response.body.password).toBeFalsy();
});
it('throws with update wrong payload', async () => {
  await global.superapp
    .patch('/me')
    .set('Authorization', authorization)
    .send({ firstName: 456 })
    .expect(400);
  await global.superapp
    .patch('/me')
    .set('Authorization', authorization)
    .send({ firstNam: 'User' })
    .expect(400);
});

it('throws with username or password', async () => {
  await global.superapp
    .patch('/me')
    .set('Authorization', authorization)
    .send({ username: 'newuser' })
    .expect(400);
  await global.superapp
    .patch('/me')
    .set('Authorization', authorization)
    .send({ password: 'PassWord!00' })
    .expect(400);
});
