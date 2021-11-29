let authorization;
beforeAll(async () => {
  authorization = await global.utils.createUser('user');
});

it('throws with falsy current password', async () => {
  await global.superapp
    .put('/me/password')
    .set('Authorization', authorization)
    .send({ currentPassword: 'Passw0rd!!!!', newPassword: 'Passw0rd!!' })
    .expect(400);
});
it('throws with new password not secure', async () => {
  await global.superapp
    .put('/me/password')
    .set('Authorization', authorization)
    .send({ currentPassword: 'Passw0rd!', newPassword: 'password' })
    .expect(400);
});
it('can update password', async () => {
  const { body } = await global.superapp
    .put('/me/password')
    .set('Authorization', authorization)
    .send({ currentPassword: 'Passw0rd!', newPassword: 'Passw0rd!!' })
    .expect(200);
  expect(body.password).toBeFalsy();
});
