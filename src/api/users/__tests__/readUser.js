let adminAuthorization;
let userAuthorization;
let userId;
beforeAll(async () => {
  adminAuthorization = await global.utils.createUser('user-admin', true);
  userAuthorization = await global.utils.createUser('user-user', false);
  const response = await global.superapp
    .post('/users')
    .set('Authorization', adminAuthorization)
    .send({
      firstName: 'admin',
      email: 'admin@admin.com',
      lastName: 'User',
      username: 'adminUser',
      role: 'admin',
      active: true,
      password: 'Passw0rd!123',
    }).expect(201);
  userId = response.body.id;
});

it('can read user successfully', async () => {
  const response = await global.superapp
    .get(`/users/${userId}`)
    .set('Authorization', adminAuthorization)
    .expect(200);
  expect(response.body.id).toBeTruthy();
  expect(response.body.firstName).toBe('admin');
  expect(response.body.createdBy).toBe('user-admin');
  expect(response.body.confirmed).toBeTruthy();
  expect(response.body.active).toBeTruthy();
});
it('throws with unknown user id', async () => {
  await global.superapp
    .get('/users/456')
    .set('Authorization', adminAuthorization)
    .expect(404);
});
it('thorws 403 for non admin users', async () => {
  await global.superapp
    .get(`/users/${userId}`)
    .set('Authorization', userAuthorization)
    .expect(403);
});
it('thorws 401 for non connected users', async () => {
  await global.superapp
    .get(`/users/${userId}`)
    .expect(401);
});
