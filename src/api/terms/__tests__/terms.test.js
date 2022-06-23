import { terms as resource } from '../../resources';

let authorization;
let id;
let textId;

const payload = {
  usualNameFr: 'Terme',
  usualNameEn: 'Term',
  shortNameEn: 'Te',
  shortNameFr: 'Te',
  acronymFr: 'T',
  pluralNameFr: 'Termes',
  otherNamesFr: ['Mot', 'Concept'],
  otherNamesEn: ['Mot', 'Concept'],
  descriptionFr: 'Un terme',
  descriptionEn: 'A term',
  comment: 'Terminé!',
};
const updatePayLoad = { usualNameFr: 'Terme modifié' };

beforeAll(async () => {
  authorization = await global.utils.createUser('user');
  const { body } = await global.superapp
    .post('/official-texts')
    .set('Authorization', authorization)
    .send({
      nature: 'Publication au JO',
      type: 'Loi',
      jorftext: 'jorftextNumber',
      nor: 'norNumber',
      title: 'title',
      pageUrl: 'http://string.fr',
      signatureDate: '2020',
      endDate: '2020',
      textExtract: 'string',
    }).expect(201);
  textId = body.id;
});

describe(`API > ${resource} > create`, () => {
  it('can create successfully', async () => {
    const { body } = await global.superapp
      .post(`/${resource}`)
      .set('Authorization', authorization)
      .send({ ...payload, creationOfficialTextId: textId, closureOfficialTextId: textId })
      .expect(201);
    Object.entries(payload).map((entry) => expect(body[entry[0]]).toStrictEqual(entry[1]));
    expect(body.id).toBeTruthy();
    expect(body.createdBy.username).toBe('user');
    expect(body.creationOfficialText.id).toBe(textId);
    expect(body.closureOfficialText.id).toBe(textId);
    id = body.id;
  });
  it('ignore additionalProperties', async () => {
    await global.superapp
      .post(`/${resource}`)
      .set('Authorization', authorization)
      .send({ ...payload, arbitrary: 'test' })
      .expect(201);
    const dbData = await global.db.collection('terms').findOne({ id });
    expect(dbData.arbitrary).toBe(undefined);
  });

  it('should fail if usualName is missing', async () => {
    const { usualNameFr, ...rest } = payload;
    await global.superapp
      .post(`/${resource}`)
      .set('Authorization', authorization)
      .send(rest)
      .expect(400);
  });
  it('should fail if creationTextId does not exist', async () => {
    const { body } = await global.superapp
      .post(`/${resource}`)
      .set('Authorization', authorization)
      .send({ ...payload, creationOfficialTextId: '45frK45frK45frK' })
      .expect(400);
    expect(body.error).toBe('Validation failed');
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
    Object.entries(updated).map((entry) => expect(body[entry[0]]).toStrictEqual(entry[1]));
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
  it('should fail if creationTextId does not exist', async () => {
    const { body } = await global.superapp
      .patch(`/${resource}/${id}`)
      .set('Authorization', authorization)
      .send({ creationOfficialTextId: '45frK45frK45frK' })
      .expect(400);
    expect(body.error).toBe('Validation failed');
  });
});

describe(`API > ${resource} > read`, () => {
  it('can read successfully', async () => {
    const { body } = await global.superapp
      .get(`/${resource}/${id}`)
      .set('Authorization', authorization)
      .expect(200);
    const expected = { ...payload, ...updatePayLoad };
    Object.entries(expected).map((entry) => expect(body[entry[0]]).toStrictEqual(entry[1]));
    expect(body.id).toBe(id);
    expect(body.priority).toBe(99);
    expect(body.createdBy.username).toBe('user');
    expect(body.creationOfficialText.id).toBe(textId);
    expect(body.closureOfficialText.id).toBe(textId);
    expect(body.creationOfficialText.nature).toBe('Publication au JO');
    expect(body.closureOfficialText.nature).toBe('Publication au JO');
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
    await global.utils.db.collection('terms').deleteMany({});
    await global.superapp
      .post(`/${resource}`)
      .set('Authorization', authorization)
      .send({ ...payload, usualNameFr: 'Name_0' })
      .expect(201);
    await global.superapp
      .post(`/${resource}`)
      .set('Authorization', authorization)
      .send({ ...payload, usualNameFr: 'Name_1' })
      .expect(201);
    await global.superapp
      .post(`/${resource}`)
      .set('Authorization', authorization)
      .send({ ...payload, usualNameFr: 'Name_2' })
      .expect(201);
  });
  it('can list successfully', async () => {
    const { body } = await global.superapp
      .get(`/${resource}`)
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.usualNameFr);
    expect(docs).toContain('Name_0');
    expect(docs).toContain('Name_1');
    expect(docs).toContain('Name_2');
  });
  it('can skip successfully', async () => {
    const { body } = await global.superapp
      .get(`/${resource}?skip=1`)
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.usualNameFr);
    expect(docs).toContain('Name_1');
    expect(docs).toContain('Name_2');
    expect(body.totalCount).toBe(3);
  });
  it('can limit successfully', async () => {
    const { body } = await global.superapp
      .get(`/${resource}?limit=1`)
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.usualNameFr);
    expect(docs).toContain('Name_0');
    expect(body.totalCount).toBe(3);
  });
  it('can sort successfully', async () => {
    const { body } = await global.superapp
      .get(`/${resource}?sort=usualNameFr`)
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.usualNameFr);
    expect(docs[0]).toBe('Name_0');
    expect(body.totalCount).toBe(3);
  });
  it('can reversely sort successfully', async () => {
    const { body } = await global.superapp
      .get(`/${resource}?sort=-usualNameFr`)
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.usualNameFr);
    expect(docs[0]).toBe('Name_2');
    expect(body.totalCount).toBe(3);
  });
  it('can filter successfully', async () => {
    const { body } = await global.superapp
      .get(`/${resource}?filters[usualNameFr]=Name_1`)
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.usualNameFr);
    expect(docs).toContain('Name_1');
    expect(body.totalCount).toBe(1);
  });
});
