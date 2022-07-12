let authorization;
beforeAll(async () => {
  authorization = await global.utils.createUser('user-admin', true);
  await global.superapp
    .post('/users')
    .set('Authorization', authorization)
    .send({
      firstName: 'admin',
      email: 'admin@admin.com',
      lastName: 'C-User',
      username: 'adminUser',
      role: 'admin',
      active: true,
      password: 'Passw0rd!123',
    }).expect(201);
  await global.superapp
    .post('/users')
    .set('Authorization', authorization)
    .send({
      firstName: 'admin1',
      email: 'admin1@admin.com',
      lastName: 'B-User',
      username: 'adminUser1',
      role: 'admin',
      active: true,
      password: 'Passw0rd!123',
    }).expect(201);
  await global.superapp
    .post('/users')
    .set('Authorization', authorization)
    .send({
      firstName: 'admin2',
      email: 'admin2@admin.com',
      lastName: 'A-User',
      username: 'adminUser2',
      role: 'admin',
      active: true,
      password: 'Passw0rd!123',
    }).expect(201);
});
it('can list users successfully', async () => {
  const { body } = await global.superapp
    .get('/users')
    .set('Authorization', authorization)
    .expect(200);
  const docs = body.data.map((doc) => doc.firstName);
  expect(docs).toContain('admin');
  expect(docs).toContain('admin1');
  expect(docs).toContain('admin2');
  expect(docs).toContain('firstName');
});
it('can skip documents successfully', async () => {
  const { body } = await global.superapp
    .get('/users?skip=1')
    .set('Authorization', authorization)
    .expect(200);
  expect(body.data).toHaveLength(3);
});
it('can limit documents successfully', async () => {
  const { body } = await global.superapp
    .get('/users?limit=2')
    .set('Authorization', authorization)
    .expect(200);
  expect(body.data).toHaveLength(2);
});
it('can sort documents successfully', async () => {
  const { body } = await global.superapp
    .get('/users?sort=lastName')
    .set('Authorization', authorization)
    .expect(200);
  const docs = body.data.map((doc) => doc.lastName);
  expect(docs).toHaveLength(4);
  expect(docs[0]).toEqual('A-User');
});
it('can reversely sort documents successfully', async () => {
  const { body } = await global.superapp
    .get('/users?sort=-lastName')
    .set('Authorization', authorization)
    .expect(200);
  const docs = body.data.map((doc) => doc.lastName);
  expect(docs).toHaveLength(4);
  expect(docs[0]).toEqual('lastName');
});
it('can filter documents successfully', async () => {
  const { body } = await global.superapp
    .get('/users?filters[lastName]=C-User')
    .set('Authorization', authorization)
    .expect(200);
  const docs = body.data.map((doc) => doc.lastName);
  expect(docs).toContain('C-User');
  expect(docs).toHaveLength(1);
});
