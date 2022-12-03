import { persons as resource } from '../../resources';

let authorization;
let id;

const payload = {
  lastName: 'Dupond',
  firstName: 'Jean',
  gender: 'Femme',
};
const updatePayLoad = { lastName: 'Dupont', firstName: null };

beforeAll(async () => {
  authorization = await global.utils.createUser('user');
});

describe('API > persons > create', () => {
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
    await global.superapp
      .post(`/${resource}`)
      .set('Authorization', authorization)
      .send({ ...payload, arbitrary: 'test' })
      .expect(201);
    const dbData = await global.db.collection('persons').findOne({ id });
    expect(dbData.arbitrary).toBe(undefined);
  });

  it('should fail if lastName is missing', async () => {
    const { lastName, ...rest } = payload;
    await global.superapp
      .post(`/${resource}`)
      .set('Authorization', authorization)
      .send(rest)
      .expect(400);
  });
});

describe('API > persons > update', () => {
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
    expect(body.createdBy.lastName).toBe('user');
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

describe('API > persons > read', () => {
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

describe('API > persons > delete', () => {
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

describe('API > persons > list', () => {
  beforeAll(async () => {
    await global.utils.db.collection('persons').deleteMany({});
    await global.superapp
      .post(`/${resource}`)
      .set('Authorization', authorization)
      .send(payload)
      .expect(201);
    await global.superapp
      .post(`/${resource}`)
      .set('Authorization', authorization)
      .send({ ...payload, lastName: 'Dupont' })
      .expect(201);
    await global.superapp
      .post(`/${resource}`)
      .set('Authorization', authorization)
      .send({ ...payload, lastName: 'Dupon' })
      .expect(201);
  });
  it('can list successfully', async () => {
    const { body } = await global.superapp
      .get(`/${resource}`)
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.lastName);
    expect(docs).toContain('Dupond');
    expect(docs).toContain('Dupont');
    expect(docs).toContain('Dupon');
  });
  it('can filter successfully', async () => {
    const { body } = await global.superapp
      .get(`/${resource}?filters[lastName]=Dupont`)
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.lastName);
    expect(docs).toContain('Dupont');
    expect(body.totalCount).toBe(1);
  });
});
