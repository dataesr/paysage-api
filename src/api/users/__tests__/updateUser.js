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

it('can update user successfully with default values', async () => {
  const response = await global.superapp
    .patch(`/users/${userId}`)
    .set('Authorization', adminAuthorization)
    .send({
      firstName: 'admin2',
      email: 'admin2@admin.com',
      lastName: 'User2',
      username: 'adminUser2',
      role: 'user',
      active: false,
    }).expect(200);
  expect(response.body.id).toBeTruthy();
  expect(response.body.firstName).toBe('admin2');
  expect(response.body.createdBy).toBe('user-admin');
  expect(response.body.confirmed).toBeTruthy();
  expect(response.body.active).toBeFalsy();
  expect(response.body.password).toBeFalsy();
});
it('throws with wrong userId', async () => {
  await global.superapp
    .patch('/users/456')
    .set('Authorization', adminAuthorization)
    .send({
      firstName: 'admin2',
      email: 'admin2@admin.com',
      lastName: 'User2',
      username: 'adminUser2',
      role: 'user',
      active: false,
    }).expect(404);
});
it('thorws 403 for non admin users', async () => {
  await global.superapp
    .patch(`/users/${userId}`)
    .set('Authorization', userAuthorization)
    .send({
      firstName: 'admin2',
      email: 'admin2@admin.com',
      lastName: 'User2',
      username: 'adminUser2',
      role: 'user',
      active: false,
    }).expect(403);
});
it('thorws 401 for non connected users', async () => {
  await global.superapp
    .patch(`/users/${userId}`)
    .send({
      firstName: 'admin2',
      email: 'admin2@admin.com',
      lastName: 'User2',
      username: 'adminUser2',
      role: 'user',
      active: false,
    }).expect(401);
});
it('throws with additional properties', async () => {
  await global.superapp
    .patch(`/users/${userId}`)
    .set('Authorization', adminAuthorization)
    .send({
      blah: 'test',
      firstName: 'admin2',
      email: 'admin2@admin.com',
      lastName: 'User2',
      username: 'adminUser2',
      role: 'user',
      active: false,
      password: 'Passw0rd!1234',
    }).expect(400);
});
it('throws with wrong data', async () => {
  const { body } = await global.superapp
    .patch(`/users/${userId}`)
    .set('Authorization', adminAuthorization)
    .send({
      firstName: 'admin2',
      email: 'admin2@admin.com',
      lastName: 'User2',
      username: 'adminUser2',
      role: false,
      active: false,
    }).expect(400);
  expect(body.details).toHaveLength(2);
});
