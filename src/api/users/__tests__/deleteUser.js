let authorization;
let id;
beforeAll(async () => {
  authorization = await global.utils.createUser('user', true);
  const response = await global.superapp
    .post('/users')
    .set('Authorization', authorization)
    .send({
      firstName: 'admin',
      email: 'admin@admin.com',
      lastName: 'User',
      username: 'adminUser',
      role: 'admin',
      active: true,
      password: 'Passw0rd!123',
    }).expect(201);
  id = response.body.id;
});
it('throws not found with wrong id', async () => {
  await global.superapp
    .delete('/users/45frK')
    .set('Authorization', authorization)
    .expect(404);
});
it('can delete user successfully', async () => {
  await global.superapp
    .delete(`/users/${id}`)
    .set('Authorization', authorization)
    .expect(204);
});
