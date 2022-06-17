import { officialtexts as resource } from '../../resources';

let authorization;
let id;
let structureId;
let personId;

const payload = {
  nature: 'Publication au JO',
  type: 'Loi',
  textNumber: 'textNumber',
  title: 'title',
  pageUrl: 'http://string.fr',
  signatureDate: '2020',
  endDate: '2020',
  textExtract: 'string',
};
const updatePayLoad = { nature: 'Publication au BOESR', type: 'Décret' };

beforeAll(async () => {
  authorization = await global.utils.createUser('user');
  const { body: structureBody } = await global.superapp
    .post('/structures')
    .set('Authorization', authorization)
    .send({
      structureStatus: 'active',
      creationDate: '2021-02',
      usualName: 'Université',
    }).expect(201);
  structureId = structureBody.id;
  const { body: personBody } = await global.superapp
    .post('/persons')
    .set('Authorization', authorization)
    .send({
      firstName: 'Jean',
      gender: 'Femme',
      lastName: 'Dupond',
    });
  personId = personBody.id;
});

describe('API > official texts > create', () => {
  it('can create successfully', async () => {
    const { body } = await global.superapp
      .post(`/${resource}`)
      .set('Authorization', authorization)
      .send({ ...payload, relatesTo: [structureId, personId] })
      .expect(201);
    Object.entries(payload).map((entry) => expect(body[entry[0]]).toBe(entry[1]));
    expect(body.id).toBeTruthy();
    expect(body.createdBy.username).toBe('user');
    id = body.id;
  });
  it('ignore additionalProperties', async () => {
    await global.superapp
      .post(`/${resource}`)
      .set('Authorization', authorization)
      .send({ ...payload, arbitrary: 'test' })
      .expect(201);
    const dbData = await global.db.collection('officialtexts').findOne({ id });
    expect(dbData.arbitrary).toBe(undefined);
  });

  it('should fail if title is missing', async () => {
    const { title, ...rest } = payload;
    await global.superapp
      .post(`/${resource}`)
      .set('Authorization', authorization)
      .send(rest)
      .expect(400);
  });

  it('should fail if type is missing', async () => {
    const { type, ...rest } = payload;
    await global.superapp
      .post(`/${resource}`)
      .set('Authorization', authorization)
      .send(rest)
      .expect(400);
  });
});

describe('API > official texts > update', () => {
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
    Object.entries(updated).map((entry) => expect(body[entry[0]]).toBe(entry[1]));
    expect(body.id).toBeTruthy();
    expect(body.createdBy.username).toBe('user');
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
  it('throws when nullifying required', async () => {
    await global.superapp
      .patch(`/${resource}/${id}`)
      .set('Authorization', authorization)
      .send({ nature: null })
      .expect(400);
  });
});

describe('API > official texts > read', () => {
  it('can read successfully', async () => {
    const { body } = await global.superapp
      .get(`/${resource}/${id}`)
      .set('Authorization', authorization)
      .expect(200);
    const expected = { ...payload, ...updatePayLoad };
    Object.entries(expected).map((entry) => expect(body[entry[0]]).toBe(entry[1]));
    expect(body.id).toBe(id);
    expect(body.createdBy.username).toBe('user');
    expect(body.relatedStructures[0].currentName.usualName).toBe('Université');
  });
  it('throws not found with unknown id', async () => {
    await global.superapp
      .get(`/${resource}/45frK45frK45frK`)
      .set('Authorization', authorization)
      .expect(404);
  });
});

describe('API > official texts > delete', () => {
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

describe('API > official texts > list', () => {
  beforeAll(async () => {
    await global.utils.db.collection('officialtexts').deleteMany({});
    await global.superapp
      .post(`/${resource}`)
      .set('Authorization', authorization)
      .send({ ...payload, title: 'od1' })
      .expect(201);
    await global.superapp
      .post(`/${resource}`)
      .set('Authorization', authorization)
      .send({ ...payload, title: 'od2' })
      .expect(201);
    await global.superapp
      .post(`/${resource}`)
      .set('Authorization', authorization)
      .send({ ...payload, title: 'od3' })
      .expect(201);
  });
  it('can list successfully', async () => {
    const { body } = await global.superapp
      .get(`/${resource}`)
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.title);
    expect(docs).toContain('od1');
    expect(docs).toContain('od2');
    expect(docs).toContain('od3');
  });
  it('can skip successfully', async () => {
    const { body } = await global.superapp
      .get(`/${resource}?skip=1`)
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.title);
    expect(docs).toContain('od2');
    expect(docs).toContain('od3');
    expect(body.totalCount).toBe(3);
  });
  it('can limit successfully', async () => {
    const { body } = await global.superapp
      .get(`/${resource}?limit=1`)
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.title);
    expect(docs).toContain('od1');
    expect(body.totalCount).toBe(3);
  });
  it('can sort successfully', async () => {
    const { body } = await global.superapp
      .get(`/${resource}?sort=title`)
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.title);
    expect(docs[0]).toBe('od1');
    expect(body.totalCount).toBe(3);
  });
  it('can reversely sort successfully', async () => {
    const { body } = await global.superapp
      .get(`/${resource}?sort=-title`)
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.title);
    expect(docs[0]).toBe('od3');
    expect(body.totalCount).toBe(3);
  });
  it('can filter successfully', async () => {
    const { body } = await global.superapp
      .get(`/${resource}?filters[title]=od1`)
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.title);
    expect(docs).toContain('od1');
    expect(body.totalCount).toBe(1);
  });
});
