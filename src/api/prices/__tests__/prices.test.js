import { prices as resource } from '../../resources';

let authorization;
let id;
const payload = {
  nameFr: 'Prix A',
  nameEn: 'Price A',
  startDate: '2020',
  endDate: '2021',
};
const updatePayLoad = { nameFr: 'Prix C', nameEn: null };

beforeAll(async () => {
  authorization = await global.utils.createUser('user');
});

describe('API > prices > create', () => {
  it('can create successfully', async () => {
    const { body } = await global.superapp
      .post(`/${resource}`)
      .set('Authorization', authorization)
      .send(payload)
      .expect(201);
    Object.entries(payload).map((entry) => expect(body[entry[0]]).toBe(entry[1]));
    expect(body.id).toBeTruthy();
    expect(body.createdBy.lastName).toBe('user');
    id = body.id;
  });
  it('ignore additionalProperties', async () => {
    const { body } = await global.superapp
      .post(`/${resource}`)
      .set('Authorization', authorization)
      .send({ ...payload, arbitrary: 'test' })
      .expect(201);
    expect(body.arbitrary).toBeFalsy();
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

describe('API > prices > update', () => {
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
      .send(updatePayLoad);
    const updated = { ...payload, ...updatePayLoad };
    Object.entries(updated).map((entry) => expect(body[entry[0]]).toBe(entry[1]));
    expect(body.id).toBeTruthy();
    expect(body.createdBy.lastName).toBe('user');
  });
  it('throws with wrong data', async () => {
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

describe('API > prices > read', () => {
  it('can read successfully', async () => {
    const { body } = await global.superapp
      .get(`/${resource}/${id}`)
      .set('Authorization', authorization)
      .expect(200);
    const expected = { ...payload, ...updatePayLoad };
    Object.entries(expected).map((entry) => expect(body[entry[0]]).toBe(entry[1]));
    expect(body.id).toBe(id);
    expect(body.createdBy.lastName).toBe('user');
  });
  it('throws not found with unknown id', async () => {
    await global.superapp
      .get(`/${resource}/45frK`)
      .set('Authorization', authorization)
      .expect(404);
  });
});

describe('API > prices > delete', () => {
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

describe('API > structures > structures > list', () => {
  beforeAll(async () => {
    await global.utils.db.collection('prices').deleteMany({});
    await global.superapp
      .post(`/${resource}`)
      .set('Authorization', authorization)
      .send(payload)
      .expect(201);
    await global.superapp
      .post(`/${resource}`)
      .set('Authorization', authorization)
      .send({ ...payload, nameFr: 'Prix B' })
      .expect(201);
    await global.superapp
      .post(`/${resource}`)
      .set('Authorization', authorization)
      .send({ ...payload, nameFr: 'Prix C' })
      .expect(201);
  });
  it('can list successfully', async () => {
    const { body } = await global.superapp
      .get(`/${resource}`)
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.nameFr);
    expect(docs).toContain('Prix A');
    expect(docs).toContain('Prix B');
    expect(docs).toContain('Prix C');
  });
  it('can filter successfully', async () => {
    const { body } = await global.superapp
      .get(`/${resource}?filters[nameFr]=Prix A`)
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.nameFr);
    expect(docs).toContain('Prix A');
    expect(body.totalCount).toBe(1);
  });
});
