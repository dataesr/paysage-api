let authorization;
let id;
beforeAll(async () => {
  authorization = await global.utils.createUser();
  const { body } = await global.superapp
    .post('/official-documents')
    .set('Authorization', authorization)
    .send({
      nature: 'Publication au JO',
      type: 'Loi',
      documentNumber: 'string',
      title: 'string',
      pageUrl: 'http://string.fr',
      signatureDate: '2020',
      endDate: '2020',
      textExtract: 'string',
    }).expect(201);
  const cat = await global.superapp
    .post('/categories')
    .set('Authorization', authorization)
    .send({
      longNameFr: 'tests',
      usualNameFr: 'tests',
      descriptionFr: 'tests',
      officialDocumentId: body.id,
    })
    .expect(201);
  const cat1 = await global.superapp
    .post('/categories')
    .set('Authorization', authorization)
    .send({
      longNameFr: 'tests1',
      usualNameFr: 'tests1',
      descriptionFr: 'tests1',
      officialDocumentId: body.id,
    })
    .expect(201);
  const cat2 = await global.superapp
    .post('/categories')
    .set('Authorization', authorization)
    .send({
      longNameFr: 'tests2',
      usualNameFr: 'tests2',
      descriptionFr: 'tests2',
      officialDocumentId: body.id,
      parentIds: [cat.body.id, cat1.body.id],
    })
    .expect(201);
  await global.superapp
    .post('/categories')
    .set('Authorization', authorization)
    .send({
      longNameFr: 'tests3',
      usualNameFr: 'tests3',
      descriptionFr: 'tests3',
      officialDocumentId: body.id,
      parentIds: [cat2.body.id],
    })
    .expect(201);
  id = cat2.body.id;
});
it('can read category successfully', async () => {
  const res = await global.superapp
    .get(`/categories/${id}`)
    .set('Authorization', authorization)
    .expect(200);
  expect(res.body.officialDocument.type).toBe('Loi');
});
it('throws not found with wrong id', async () => {
  await global.superapp
    .get('/categories/45frK')
    .set('Authorization', authorization)
    .expect(404);
});
