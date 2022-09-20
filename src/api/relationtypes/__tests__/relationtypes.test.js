import { relationTypes as resource } from '../../resources';

let authorization;
let id;

const payload = {
  acronym: 'C',
  name: 'Coordinateur',
  pluralName: 'Cordinateurs',
  feminineName: 'Coordinatrice',
  for: ['structures', 'persons'],
  priority: 5,
  otherNames: ['Coordi', 'Coor'],
};
const updatePayLoad = {
  pluralName: 'Coordinateurs',
};

beforeAll(async () => {
  authorization = await global.utils.createUser('user');
});

describe('API > relation types > create', () => {
  it('can create successfully', async () => {
    const { body } = await global.superapp
      .post(`/${resource}`)
      .set('Authorization', authorization)
      .send(payload)
      .expect(201);
    Object.entries(payload).map((entry) => expect(body[entry[0]]).toStrictEqual(entry[1]));
    expect(body.id).toBeTruthy();
    expect(body.createdBy.lastName).toBe('user');
    id = body.id;
  });
  it('ignore additionalProperties', async () => {
    await global.superapp
      .post(`/${resource}`)
      .set('Authorization', authorization)
      .send({ ...payload, arbitrary: 'test' })
      .expect(201);
    const dbData = await global.db.collection('relationtypes').findOne({ id });
    expect(dbData.arbitrary).toBe(undefined);
  });

  it('should fail if name is missing', async () => {
    const { name, ...rest } = payload;
    await global.superapp
      .post(`/${resource}`)
      .set('Authorization', authorization)
      .send(rest)
      .expect(400);
  });
});

describe('API > relation types > update', () => {
  it('throws not found with wrong id', async () => {
    await global.superapp
      .patch(`/${resource}/45frK45frK45frK`)
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
    Object.entries(updated).map((entry) => expect(body[entry[0]]).toStrictEqual(entry[1]));
    expect(body.id).toBeTruthy();
    expect(body.createdBy.lastName).toBe('user');
  });
  it('throws when nullifying required', async () => {
    await global.superapp
      .patch(`/${resource}/${id}`)
      .set('Authorization', authorization)
      .send({ name: null })
      .expect(400);
  });
});

describe('API > relation types > read', () => {
  it('can read successfully', async () => {
    const { body } = await global.superapp
      .get(`/${resource}/${id}`)
      .set('Authorization', authorization)
      .expect(200);
    const expected = { ...payload, ...updatePayLoad };
    Object.entries(expected).map((entry) => expect(body[entry[0]]).toStrictEqual(entry[1]));
    expect(body.id).toBe(id);
    expect(body.createdBy.lastName).toBe('user');
  });
  it('throws not found with unknown id', async () => {
    await global.superapp
      .get(`/${resource}/45frK45frK45frK`)
      .set('Authorization', authorization)
      .expect(404);
  });
});

describe('API > relation types > delete', () => {
  it('throws not found with wrong id', async () => {
    await global.superapp
      .delete(`/${resource}/45frK45frK45frK`)
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

describe('API > legal categories > list', () => {
  beforeAll(async () => {
    await global.utils.db.collection('relationtypes').deleteMany({});
    await global.superapp
      .post(`/${resource}`)
      .set('Authorization', authorization)
      .send({ ...payload, name: 'od1' })
      .expect(201);
    await global.superapp
      .post(`/${resource}`)
      .set('Authorization', authorization)
      .send({ ...payload, name: 'od2' })
      .expect(201);
    await global.superapp
      .post(`/${resource}`)
      .set('Authorization', authorization)
      .send({ ...payload, name: 'od3' })
      .expect(201);
  });
  it('can list successfully', async () => {
    const { body } = await global.superapp
      .get(`/${resource}`)
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.name);
    expect(docs).toContain('od1');
    expect(docs).toContain('od2');
    expect(docs).toContain('od3');
  });
  it('can skip successfully', async () => {
    const { body } = await global.superapp
      .get(`/${resource}?skip=1`)
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.name);
    expect(docs).toContain('od2');
    expect(docs).toContain('od3');
    expect(body.totalCount).toBe(3);
  });
  it('can limit successfully', async () => {
    const { body } = await global.superapp
      .get(`/${resource}?limit=1`)
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.name);
    expect(docs).toContain('od1');
    expect(body.totalCount).toBe(3);
  });
  it('can sort successfully', async () => {
    const { body } = await global.superapp
      .get(`/${resource}?sort=name`)
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.name);
    expect(docs[0]).toBe('od1');
    expect(body.totalCount).toBe(3);
  });
  it('can reversely sort successfully', async () => {
    const { body } = await global.superapp
      .get(`/${resource}?sort=-name`)
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.name);
    expect(docs[0]).toBe('od3');
    expect(body.totalCount).toBe(3);
  });
  it('can filter successfully', async () => {
    const { body } = await global.superapp
      .get(`/${resource}?filters[name]=od1`)
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.name);
    expect(docs).toContain('od1');
    expect(body.totalCount).toBe(1);
  });
});
