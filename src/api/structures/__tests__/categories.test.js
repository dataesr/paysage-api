import { BadRequestError } from '../../../libs/http-errors';

let authorization;
let cid;
let id;
let rid;

const category = {
  usualNameFr: 'Catégorie',
};
const categoryLink = {
  startDate: '2000-02-12',
  endDate: '2020-02-12',
};
const structure = {
  structureStatus: 'active',
  creationDate: '2021-02',
  usualName: 'Université',
};

beforeAll(async () => {
  authorization = await global.utils.createUser('user');
  const struct = await global.superapp
    .post('/structures')
    .set('Authorization', authorization)
    .send(structure)
    .expect(201);
  const cat = await global.superapp
    .post('/categories')
    .set('Authorization', authorization)
    .send(category)
    .expect(201);
  rid = struct.body.id;
  cid = cat.body.id;
});

describe('API > structures > categories > create', () => {
  it('can create successfully', async () => {
    const response = await global.superapp
      .post(`/structures/${rid}/categories`)
      .set('Authorization', authorization)
      .send(categoryLink)
      .expect(201);
    expect(response.body.id).toBeTruthy();
    id = response.body.id;
  });

  it('should accept approximate date with only year and month', async () => {
    const response = await global.superapp
      .post(`/structures/${rid}/categories`)
      .set('Authorization', authorization)
      .send({ ...categoryLink, startDate: '2000-02' })
      .expect(201);
    expect(response.body.id).toBeTruthy();
    id = response.body.id;
  });

  it('should accept approximate date with only year', async () => {
    const response = await global.superapp
      .post(`/structures/${rid}/categories`)
      .set('Authorization', authorization)
      .send({ ...categoryLink, startDate: '2000' })
      .expect(201);
    expect(response.body.id).toBeTruthy();
    id = response.body.id;
  });

  it('should throw a BadRequest error if date is malformed', async () => {
    const create = async () => {
      await global.superapp
        .post(`/structures/${rid}/categories`)
        .set('Authorization', authorization)
        .send({ ...categoryLink, startDate: '20' });
    };
    expect(create).rejects.toThrow(BadRequestError);
  });
});

describe('API > structures > categories > update', () => {
  it('can update successfully', async () => {
    const response = await global.superapp
      .patch(`/structures/${rid}/categories/${id}`)
      .set('Authorization', authorization)
      .send({ startDate: '2017-01-01' })
      .expect(200);
    expect(response.body.startDate).toBe('2017-01-01');
  });
  it('throws bad request with malformed id', async () => {
    await global.superapp
      .patch(`/structures/${rid}/categories/45frK`)
      .set('Authorization', authorization)
      .send({ startDate: '2017-01-01' })
      .expect(400);
  });
  it('throws not found with wrong id', async () => {
    await global.superapp
      .patch(`/structures/${rid}/categories/45skrc65`)
      .set('Authorization', authorization)
      .send({ startDate: '2017-01-01' })
      .expect(404);
  });
  it('throws with wrong data', async () => {
    await global.superapp
      .patch(`/structures/${rid}/categories/${id}`)
      .set('Authorization', authorization)
      .send({ startDate: 'string' })
      .expect(400);
  });
  it('can empty dates', async () => {
    const { body } = await global.superapp
      .patch(`/structures/${rid}/categories/${id}`)
      .set('Authorization', authorization)
      .send({ startDate: '' })
      .expect(200);
    expect(body.startDate).toBe(null);
  });
});

describe('API > structures > categories > read', () => {
  it('can read successfully', async () => {
    const response = await global.superapp
      .get(`/structures/${rid}/categories/${id}`)
      .set('Authorization', authorization)
      .expect(200);
    expect(response.body.id).toBe(id);
    expect(response.body.category.id).toBe(cid);
    expect(response.body.category.usualNameFr).toBe('Catégorie');
    expect(response.body.createdBy.username).toBe('user');
  });
  it('throws bad request with wrong id', async () => {
    await global.superapp
      .get(`/structures/${rid}/categories/265vty`)
      .set('Authorization', authorization)
      .expect(400);
  });
  it('throws not found with unknown id', async () => {
    await global.superapp
      .get(`/structures/${rid}/categories/265fkrld`)
      .set('Authorization', authorization)
      .expect(404);
  });
});

describe('API > structures > names > delete', () => {
  it('throws bad request with wrong id', async () => {
    await global.superapp
      .delete(`/structures/${rid}/categories/vgy775`)
      .set('Authorization', authorization)
      .expect(400);
  });
  it('throws not found with unknown id', async () => {
    await global.superapp
      .delete(`/structures/${rid}/categories/775flrks`)
      .set('Authorization', authorization)
      .expect(404);
  });
  it('can delete successfully', async () => {
    await global.superapp
      .delete(`/structures/${rid}/categories/${id}`)
      .set('Authorization', authorization)
      .expect(204);
  });
});

// describe('API > structures > names > list', () => {
//   beforeAll(async () => {
//     await global.superapp
//       .post(`/structures/${rid}/names/`)
//       .set('Authorization', authorization)
//       .send({ ...structureName, usualName: 'string2', startDate: null })
//       .expect(201);
//     await global.superapp
//       .post(`/structures/${rid}/names/`)
//       .set('Authorization', authorization)
//       .send({ ...structureName, usualName: 'string3', startDate: '2017-01-01' })
//       .expect(201);
//   });
//   it('can list successfully', async () => {
//     const { body } = await global.superapp
//       .get(`/structures/${rid}/names`)
//       .set('Authorization', authorization)
//       .expect(200);
//     const docs = body.data.map((doc) => doc.usualName);
//     expect(docs).toContain('string');
//     expect(docs).toContain('string2');
//     expect(docs).toContain('string3');
//   });
//   it('can skip successfully', async () => {
//     const { body } = await global.superapp
//       .get(`/structures/${rid}/names?skip=1`)
//       .set('Authorization', authorization)
//       .expect(200);
//     const docs = body.data.map((doc) => doc.usualName);
//     expect(docs).toContain('string2');
//     expect(docs).toContain('string3');
//     expect(docs).toHaveLength(3);
//     expect(body.totalCount).toBe(4);
//   });
//   it('can limit successfully', async () => {
//     const { body } = await global.superapp
//       .get(`/structures/${rid}/names?limit=1`)
//       .set('Authorization', authorization)
//       .expect(200);
//     const docs = body.data.map((doc) => doc.usualName);
//     expect(docs).toContain('Université');
//     expect(docs).toHaveLength(1);
//     expect(body.totalCount).toBe(4);
//   });
//   it('can sort successfully', async () => {
//     const { body } = await global.superapp
//       .get(`/structures/${rid}/names?sort=usualName`)
//       .set('Authorization', authorization)
//       .expect(200);
//     const docs = body.data.map((doc) => doc.usualName);
//     expect(docs[0]).toBe('Université');
//     expect(docs).toHaveLength(4);
//     expect(body.totalCount).toBe(4);
//   });
//   it('can reversely sort successfully', async () => {
//     const { body } = await global.superapp
//       .get(`/structures/${rid}/names?sort=-usualName`)
//       .set('Authorization', authorization)
//       .expect(200);
//     const docs = body.data.map((doc) => doc.usualName);
//     expect(docs[0]).toBe('string3');
//     expect(docs).toHaveLength(4);
//     expect(body.totalCount).toBe(4);
//   });
//   it('can filter successfully', async () => {
//     const { body } = await global.superapp
//       .get(`/structures/${rid}/names?filters[usualName]=string2`)
//       .set('Authorization', authorization)
//       .expect(200);
//     const docs = body.data.map((doc) => doc.usualName);
//     expect(docs).toContain('string2');
//     expect(docs).toHaveLength(1);
//     expect(body.totalCount).toBe(1);
//   });
//   it('returns currentName successfully', async () => {
//     const { body } = await global.superapp
//       .get(`/structures/${rid}`)
//       .set('Authorization', authorization)
//       .expect(200);
//     expect(body.currentName.startDate).toBe('2017-01-01');
//   });
// });
