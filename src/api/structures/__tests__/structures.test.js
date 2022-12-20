import { structures as resource } from '../../resources';

let authorization;
let id;
beforeAll(async () => {
  authorization = await global.utils.createUser('user');
});

describe('API > structures > structures > create', () => {
  it('can create successfully', async () => {
    const response = await global.superapp
      .post(`/${resource}`)
      .set('Authorization', authorization)
      .send({
        structureStatus: 'active',
        creationDate: '2021-02',
        usualName: 'Université',
        wikidata: '5dv7d6',
      }).expect(201);
    const { body } = response;
    expect(body.id).toBeTruthy();
    expect(body.createdBy.lastName).toBe('user');
    expect(body.currentName.usualName).toBe('Université');
    id = body.id;
  });
  it('has an identifier', async () => {
    const response = await global.superapp
      .get(`/${resource}/${id}/identifiers`)
      .set('Authorization', authorization)
      .expect(200);
    const { body } = response;
    expect(body.totalCount).toBe(1);
  });
});

describe('API > structures > structures > update', () => {
  it('throws not found with wrong id', async () => {
    await global.superapp
      .patch(`/${resource}/45frK`)
      .set('Authorization', authorization)
      .send({
        structureStatus: 'inactive',
      }).expect(404);
  });
  it('can update successfully', async () => {
    const { body } = await global.superapp
      .patch(`/${resource}/${id}`)
      .set('Authorization', authorization)
      .send({ structureStatus: 'inactive' })
      .expect(200);
    expect(body.structureStatus).toBe('inactive');
  });
  it('ignore additional properties', async () => {
    await global.superapp
      .patch(`/${resource}/${id}`)
      .set('Authorization', authorization)
      .send({ status: 'test' })
      .expect(400);
  });
});

describe('API > structures > structures > read', () => {
  it('can read successfully', async () => {
    const response = await global.superapp
      .get(`/${resource}/${id}`)
      .set('Authorization', authorization)
      .expect(200);
    expect(response.body.structureStatus).toBe('inactive');
    expect(response.body.id).toBe(id);
    expect(response.body.createdBy.lastName).toBe('user');
  });
  it('throws not found with unknown id', async () => {
    await global.superapp
      .get(`/${resource}/45frK`)
      .set('Authorization', authorization)
      .expect(404);
  });
});

describe('API > structures > structures > delete', () => {
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
    await global.utils.db.collection('structures').deleteMany({});
    await global.superapp
      .post(`/${resource}`)
      .set('Authorization', authorization)
      .send({
        structureStatus: 'active',
        creationDate: '2021-02',
        usualName: 'Université',
      }).expect(201);
    await global.superapp
      .post(`/${resource}`)
      .set('Authorization', authorization)
      .send({
        structureStatus: 'inactive',
        creationDate: '2021-02',
        usualName: 'Université',
      }).expect(201);
    await global.superapp
      .post(`/${resource}`)
      .set('Authorization', authorization)
      .send({
        structureStatus: 'forthcoming',
        creationDate: '2021-02',
        usualName: 'Université',
      }).expect(201);
  });
  it('can list successfully', async () => {
    const { body } = await global.superapp
      .get(`/${resource}`)
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.structureStatus);
    expect(docs).toContain('forthcoming');
    expect(docs).toContain('active');
    expect(docs).toContain('inactive');
  });
  it('can list empty results', async () => {
    const { body } = await global.superapp
      .get(`/${resource}?filters[structureStatus]=empty`)
      .set('Authorization', authorization)
      .expect(200);
    expect(body.data).toHaveLength(0);
    expect(body.totalCount).toBe(0);
  });
  it('can skip successfully', async () => {
    const { body } = await global.superapp
      .get(`/${resource}?skip=1`)
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.structureStatus);
    expect(docs).toContain('inactive');
    expect(docs).toContain('active');
    expect(body.totalCount).toBe(3);
  });
  it('can limit successfully', async () => {
    const { body } = await global.superapp
      .get(`/${resource}?limit=1`)
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.structureStatus);
    expect(docs).toContain('forthcoming');
    expect(body.totalCount).toBe(3);
  });
  it('can sort successfully', async () => {
    const { body } = await global.superapp
      .get(`/${resource}?sort=structureStatus`)
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.structureStatus);
    expect(docs[0]).toBe('active');
    expect(body.totalCount).toBe(3);
  });
  it('can reversely sort successfully', async () => {
    const { body } = await global.superapp
      .get(`/${resource}?sort=-structureStatus`)
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.structureStatus);
    expect(docs[0]).toBe('inactive');
    expect(body.totalCount).toBe(3);
  });
  it('can filter successfully', async () => {
    const { body } = await global.superapp
      .get(`/${resource}?filters[structureStatus]=active`)
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.structureStatus);
    expect(docs).toContain('active');
    expect(body.totalCount).toBe(1);
  });
  it('can filter successfully dates', async () => {
    const { body } = await global.superapp
      .get(`/${resource}?filters[structureStatus]=active&filters[createdAt][$gte]=2022-11-28T22:31:57.703Z`)
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.structureStatus);
    expect(docs).toContain('active');
    expect(body.totalCount).toBe(1);
  });
});
