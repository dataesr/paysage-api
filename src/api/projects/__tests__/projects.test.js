import { projects as resource } from '../../resources';

let authorization;
let id;

const payload = {
  nameFr: 'Test',
  nameEn: 'Test',
  fullNameFr: 'Test',
  fullNameEn: 'Test',
  acronymFr: 'Test',
  acronymEn: 'Test',
  description: 'Test',
  startDate: '2000',
  endDate: '2001',
  grantPart: 'Test',
  comment: 'Test',
};
const updatePayLoad = { fullNameFr: 'TestTestTest', fullNameEn: null };

beforeAll(async () => {
  authorization = await global.utils.createUser('user');
});

describe(`API > ${resource} > create`, () => {
  it('can create successfully', async () => {
    const { body } = await global.superapp
      .post(`/${resource}`)
      .set('Authorization', authorization)
      .send(payload)
      .expect(201);
    Object.entries(payload).map((entry) => expect(body[entry[0]]).toBe(entry[1]));
    expect(body.id).toBeTruthy();
    expect(body.createdBy.lastName).toBe('user');;
    id = body.id;
  });
  it('ignore additionalProperties', async () => {
    await global.superapp
      .post(`/${resource}`)
      .set('Authorization', authorization)
      .send({ ...payload, arbitrary: 'test' })
      .expect(201);
    const dbData = await global.db.collection('projects').findOne({ id });
    expect(dbData.arbitrary).toBe(undefined);
  });

  it('should fail if nameFr is missing', async () => {
    const { nameFr, ...rest } = payload;
    await global.superapp
      .post(`/${resource}`)
      .set('Authorization', authorization)
      .send(rest)
      .expect(400);
  });
});

describe(`API > ${resource} > update`, () => {
  it('throws not found with wrong id', async () => {
    await global.superapp
      .patch(`/${resource}/45frK`)
      .set('Authorization', authorization)
      .send(updatePayLoad)
      .expect(404);
  });
  it('can update successfully', async () => {
    const { body } = await global.superapp
      .patch(`/${resource}/${id}`)
      .set('Authorization', authorization)
      .send(updatePayLoad)
      .expect(200);
    const updated = { ...payload, ...updatePayLoad };
    Object.entries(updated).map((entry) => expect(body[entry[0]]).toBe(entry[1]));
    expect(body.id).toBeTruthy();
    expect(body.createdBy.lastName).toBe('user');;
  });
  it('ignore additionalProperties', async () => {
    await global.superapp
      .patch(`/${resource}/${id}`)
      .set('Authorization', authorization)
      .send({ arbitrary: 'test' })
      .expect(400);
  });
  it('throws with no data', async () => {
    await global.superapp
      .patch(`/${resource}/${id}`)
      .set('Authorization', authorization)
      .send({})
      .expect(400);
  });
});

describe(`API > ${resource} > read`, () => {
  it('can read successfully', async () => {
    const { body } = await global.superapp
      .get(`/${resource}/${id}`)
      .set('Authorization', authorization)
      .expect(200);
    const expected = { ...payload, ...updatePayLoad };
    Object.entries(expected).map((entry) => expect(body[entry[0]]).toBe(entry[1]));
    expect(body.id).toBe(id);
    expect(body.createdBy.lastName).toBe('user');;
  });
  it('throws not found with unknown id', async () => {
    await global.superapp
      .get(`/${resource}/45frK`)
      .set('Authorization', authorization)
      .expect(404);
  });
});

describe(`API > ${resource} > delete`, () => {
  it('throws not found with wrong id', async () => {
    await global.superapp
      .delete(`/${resource}/45frK`)
      .set('Authorization', authorization)
      .expect(404);
  });
  it('can delete successfully', async () => {
    await global.superapp
      .delete(`/${resource}/${id}`)
      .set('Authorization', authorization)
      .expect(204);
  });
});

describe(`API > ${resource} > list`, () => {
  beforeAll(async () => {
    await global.utils.db.collection('projects').deleteMany({});
    await global.superapp
      .post(`/${resource}`)
      .set('Authorization', authorization)
      .send(payload)
      .expect(201);
    await global.superapp
      .post(`/${resource}`)
      .set('Authorization', authorization)
      .send({ ...payload, fullNameFr: 'Test1' })
      .expect(201);
    await global.superapp
      .post(`/${resource}`)
      .set('Authorization', authorization)
      .send({ ...payload, fullNameFr: 'Test2' })
      .expect(201);
  });
  it('can list successfully', async () => {
    const { body } = await global.superapp
      .get(`/${resource}`)
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.fullNameFr);
    expect(docs).toContain('Test');
    expect(docs).toContain('Test1');
    expect(docs).toContain('Test2');
  });
  it('can skip successfully', async () => {
    const { body } = await global.superapp
      .get(`/${resource}?skip=1`)
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.fullNameFr);
    expect(docs).toContain('Test1');
    expect(docs).toContain('Test2');
    expect(body.totalCount).toBe(3);
  });
  it('can limit successfully', async () => {
    const { body } = await global.superapp
      .get(`/${resource}?limit=1`)
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.fullNameFr);
    expect(docs).toContain('Test');
    expect(body.totalCount).toBe(3);
  });
  it('can sort successfully', async () => {
    const { body } = await global.superapp
      .get(`/${resource}?sort=fullNameFr`)
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.fullNameFr);
    expect(docs[0]).toBe('Test');
    expect(body.totalCount).toBe(3);
  });
  it('can reversely sort successfully', async () => {
    const { body } = await global.superapp
      .get(`/${resource}?sort=-fullNameFr`)
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.fullNameFr);
    expect(docs[0]).toBe('Test2');
    expect(body.totalCount).toBe(3);
  });
  it('can filter successfully', async () => {
    const { body } = await global.superapp
      .get(`/${resource}?filters[fullNameFr]=Test`)
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.fullNameFr);
    expect(docs).toContain('Test');
    expect(body.totalCount).toBe(1);
  });
});
