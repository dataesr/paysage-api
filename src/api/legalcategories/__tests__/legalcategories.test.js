let authorization;
let id;

const collection = 'legal-categories';
const payload = {
  acronymeFr: 'acronymeFr',
  inseeCode: 'inseeCode',
  legalPersonality: 'personne morale de droit public',
  longNameFr: 'longNameFr',
  sector: 'public',
};
const updatePayLoad = {
  inseeCode: null,
  longNameFr: 'test',
  sector: 'privé',
};

beforeAll(async () => {
  authorization = await global.utils.createUser('user');
});

describe('API > legal categories > create', () => {
  it('can create successfully', async () => {
    const { body } = await global.superapp
      .post(`/${collection}`)
      .set('Authorization', authorization)
      .send(payload)
      .expect(201);
    Object.entries(payload).map((entry) => expect(body[entry[0]]).toBe(entry[1]));
    expect(body.id).toBeTruthy();
    expect(body.createdBy.username).toBe('user');
    id = body.id;
  });
  it('ignore additionalProperties', async () => {
    await global.superapp
      .post(`/${collection}`)
      .set('Authorization', authorization)
      .send({ ...payload, arbitrary: 'test' })
      .expect(201);
    const dbData = await global.db.collection('legal-categories').findOne({ id });
    expect(dbData.arbitrary).toBe(undefined);
  });

  it('should fail if longNameFr is missing', async () => {
    const { longNameFr, ...rest } = payload;
    await global.superapp
      .post(`/${collection}`)
      .set('Authorization', authorization)
      .send(rest)
      .expect(400);
  });
});

describe('API > legal categories > update', () => {
  it('throws not found with wrong id', async () => {
    await global.superapp
      .patch(`/${collection}/45frK`)
      .set('Authorization', authorization)
      .send(updatePayLoad)
      .expect(404);
  });
  it('can update successfully', async () => {
    const { body } = await global.superapp
      .patch(`/${collection}/${id}`)
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
      .patch(`/${collection}/${id}`)
      .set('Authorization', authorization)
      .send({ arbitrary: 'test' })
      .expect(400);
  });
  it('throws with no data', async () => {
    await global.superapp
      .patch(`/${collection}/${id}`)
      .set('Authorization', authorization)
      .send({})
      .expect(400);
  });
  it('throws when nullifying required', async () => {
    await global.superapp
      .patch(`/${collection}/${id}`)
      .set('Authorization', authorization)
      .send({ nature: null })
      .expect(400);
  });
});

describe('API > legal categories > read', () => {
  it('can read successfully', async () => {
    const { body } = await global.superapp
      .get(`/${collection}/${id}`)
      .set('Authorization', authorization)
      .expect(200);
    const expected = { ...payload, ...updatePayLoad };
    Object.entries(expected).map((entry) => expect(body[entry[0]]).toBe(entry[1]));
    expect(body.id).toBe(id);
    expect(body.createdBy.username).toBe('user');
  });
  it('throws not found with unknown id', async () => {
    await global.superapp
      .get(`/${collection}/45frK`)
      .set('Authorization', authorization)
      .expect(404);
  });
});

describe('API > legal categories > delete', () => {
  it('throws not found with wrong id', async () => {
    await global.superapp
      .delete(`/${collection}/45frK`)
      .set('Authorization', authorization)
      .expect(404);
  });
  it('can delete successfully', async () => {
    await global.superapp
      .delete(`/${collection}/${id}`)
      .set('Authorization', authorization)
      .expect(204);
  });
});

describe('API > legal categories > list', () => {
  beforeAll(async () => {
    await global.utils.db.collection('legal-categories').deleteMany({});
    await global.superapp
      .post(`/${collection}`)
      .set('Authorization', authorization)
      .send({ ...payload, longNameFr: 'od1' })
      .expect(201);
    await global.superapp
      .post(`/${collection}`)
      .set('Authorization', authorization)
      .send({ ...payload, longNameFr: 'od2' })
      .expect(201);
    await global.superapp
      .post(`/${collection}`)
      .set('Authorization', authorization)
      .send({ ...payload, longNameFr: 'od3' })
      .expect(201);
  });
  it('can list successfully', async () => {
    const { body } = await global.superapp
      .get(`/${collection}`)
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.longNameFr);
    expect(docs).toContain('od1');
    expect(docs).toContain('od2');
    expect(docs).toContain('od3');
  });
  it('can skip successfully', async () => {
    const { body } = await global.superapp
      .get(`/${collection}?skip=1`)
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.longNameFr);
    expect(docs).toContain('od2');
    expect(docs).toContain('od3');
    expect(body.totalCount).toBe(3);
  });
  it('can limit successfully', async () => {
    const { body } = await global.superapp
      .get(`/${collection}?limit=1`)
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.longNameFr);
    expect(docs).toContain('od1');
    expect(body.totalCount).toBe(3);
  });
  it('can sort successfully', async () => {
    const { body } = await global.superapp
      .get(`/${collection}?sort=longNameFr`)
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.longNameFr);
    expect(docs[0]).toBe('od1');
    expect(body.totalCount).toBe(3);
  });
  it('can reversely sort successfully', async () => {
    const { body } = await global.superapp
      .get(`/${collection}?sort=-longNameFr`)
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.longNameFr);
    expect(docs[0]).toBe('od3');
    expect(body.totalCount).toBe(3);
  });
  it('can filter successfully', async () => {
    const { body } = await global.superapp
      .get(`/${collection}?filters[longNameFr]=od1`)
      .set('Authorization', authorization)
      .expect(200);
    const docs = body.data.map((doc) => doc.longNameFr);
    expect(docs).toContain('od1');
    expect(body.totalCount).toBe(1);
  });
});
