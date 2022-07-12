let adminAuthorization;
let userAuthorization;
beforeAll(async () => {
  adminAuthorization = await global.utils.createUser('user-admin', true);
  userAuthorization = await global.utils.createUser('user-user', false);
});

it('can create user successfully with default values', async () => {
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
  expect(response.body.id).toBeTruthy();
  expect(response.body.firstName).toBe('admin');
  expect(response.body.createdBy).toBe('user-admin');
  expect(response.body.confirmed).toBeTruthy();
  expect(response.body.active).toBeTruthy();
});
it('thorws 403 for non admin users', async () => {
  await global.superapp
    .post('/users')
    .set('Authorization', userAuthorization)
    .send({
      firstName: 'admin',
      email: 'admin@admin.com',
      lastName: 'User',
      username: 'adminUser',
      role: 'admin',
      active: true,
      password: 'Passw0rd!123',
    }).expect(403);
});
it('thorws 401 for non connected users', async () => {
  await global.superapp
    .post('/users')
    .send({
      firstName: 'admin',
      email: 'admin@admin.com',
      lastName: 'User',
      username: 'adminUser',
      role: 'admin',
      active: true,
      password: 'Passw0rd!123',
    }).expect(401);
});
it('throws with additional properties', async () => {
  await global.superapp
    .post('/users')
    .set('Authorization', adminAuthorization)
    .send({
      blah: 'blah',
      firstName: 'admin',
      lastName: 'User',
      email: 'admin@admin.com',
      username: 'adminUser',
      role: 'admin',
      active: true,
      confirmed: true,
      password: 'Passw0rd!123',
    }).expect(400);
});
it('throws with missing required property', async () => {
  await global.superapp
    .post('/users')
    .set('Authorization', adminAuthorization)
    .send({
      firstName: 'admin',
      lastName: 'User',
      role: 'admin',
      active: true,
      confirmed: true,
      password: 'Passw0rd!123',
    }).expect(400);
});
it('throws with wrong data', async () => {
  const { body } = await global.superapp
    .post('/users')
    .set('Authorization', adminAuthorization)
    .send({
      firstName: 'admin',
      lastName: 'User',
      email: 'admin@admin.com',
      username: 'adminUser',
      role: 'admin',
      active: 'test',
      confirmed: 'test',
      password: 'Passw0rd!123',
    }).expect(400);
  expect(body.details).toHaveLength(2);
});
